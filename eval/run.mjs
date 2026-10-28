// One eval build: a task's brief, given to Codex in a fresh copy of the starter, with (arm b) or
// without (arm a) the playbook's Skill. Each run gets its own HOME and CODEX_HOME holding only the
// login, so the owner's own instructions and skills (~/.codex, ~/.agents) reach neither arm, and its
// folder sits outside this repo with its own git root, so no AGENTS.md or node_modules above it does.
//
//   node eval/run.mjs <task> <a|b> <n>     build, e.g. `node eval/run.mjs 01 b 1`
//   node eval/run.mjs --smoke <a|b>        ask an arm what instructions and skills it sees
//
// Builds land in $EVAL_RUNS (default ~/code/ui-playbook-eval-runs)/<task>/<arm>-<n>; the agent's
// events, last message and run.json (time, tokens, whether it builds) beside it in <arm>-<n>.run.
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, createWriteStream, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const CODEX = '/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex';
const MODEL = 'gpt-6.1-sol';
const EFFORT = 'medium';
const ROOT = new URL('..', import.meta.url).pathname;
const RUNS = process.env.EVAL_RUNS ?? join(homedir(), 'code/ui-playbook-eval-runs');
const SKILL = join(ROOT, 'dist/skill/ui-playbook');
const STORE = execFileSync('pnpm', ['store', 'path'], { encoding: 'utf8' }).trim();

// The same for both arms: where to build and how it's run, nothing about how it should look.
const FOOTER = `
---

Build this in the Vite + React + TypeScript project in the current folder, as you would ship it.
It must run with \`pnpm dev\` and build with \`pnpm build\`. Invent realistic sample data where the
brief asks for it. You may add npm packages.`;

const SMOKE = `Don't change any files. List every instruction file (AGENTS.md or similar) and every
skill available to you in this session: for each, its name, its path, and its first line. Then
list any other instructions you were given beyond this message. If there are none, say so.`;

const [flag, ...rest] = process.argv.slice(2);
const smoke = flag === '--smoke';
const [taskArg, arm, n] = smoke ? [null, rest[0], 1] : [flag, rest[0], rest[1]];
if (!['a', 'b'].includes(arm) || (!smoke && !(taskArg && n))) {
  console.error('usage: node eval/run.mjs <task> <a|b> <n> | --smoke <a|b>');
  process.exit(2);
}
if (arm === 'b' && !existsSync(join(SKILL, 'SKILL.md'))) throw new Error('No Skill: run `pnpm build` first.');

const task = smoke ? '_smoke' : readdirSync(join(ROOT, 'eval/tasks')).find((f) => f.startsWith(taskArg))?.replace(/\.md$/, '');
if (!task) throw new Error(`No task ${taskArg} in eval/tasks`);
const dir = join(RUNS, task, `${arm}-${n}`);
const meta = `${dir}.run`;
if (existsSync(dir) && !smoke) throw new Error(`${dir} exists; pick another n`);
rmSync(dir, { recursive: true, force: true });
mkdirSync(meta, { recursive: true });

// The project: the starter, installed, committed, so the agent's work is the diff from here.
cpSync(join(ROOT, 'eval/starter'), dir, { recursive: true, filter: (p) => !/node_modules|\/dist$/.test(p) });
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: dir, stdio: 'pipe', encoding: 'utf8', ...opts });
if (!smoke) sh('pnpm', ['install', '--prefer-offline', '--silent']);
sh('git', ['init', '-q']);
sh('git', ['add', '-A']);
sh('git', ['-c', 'user.name=eval', '-c', 'user.email=eval@localhost', 'commit', '-qm', 'starter']);

// The agent's world: a HOME with nothing in it but the login, and for arm b the Skill.
const home = mkdtempSync(join(tmpdir(), 'eval-home-'));
const codexHome = join(home, '.codex');
mkdirSync(codexHome);
cpSync(join(homedir(), '.codex/auth.json'), join(codexHome, 'auth.json'));
if (arm === 'b') cpSync(SKILL, join(codexHome, 'skills/ui-playbook'), { recursive: true });

const brief = smoke ? SMOKE : readFileSync(join(ROOT, 'eval/tasks', `${task}.md`), 'utf8').replace(/^---[\s\S]*?---\n/, '') + FOOTER;
writeFileSync(join(meta, 'prompt.md'), brief);
const args = [
  'exec', '-m', MODEL, '-c', `model_reasoning_effort="${EFFORT}"`, '-c', 'approval_policy="never"',
  '--ignore-user-config', '--ephemeral', '--json', '-o', join(meta, 'last.md'), '-C', dir,
  ...(smoke
    ? ['-s', 'read-only']
    : ['-s', 'workspace-write', '-c', 'sandbox_workspace_write.network_access=true', '--add-dir', STORE]),
  '-',
];

const started = Date.now();
const events = createWriteStream(join(meta, 'events.jsonl'));
const usage = { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 };
let code;
try {
  code = await new Promise((resolve, reject) => {
    const env = { ...process.env, HOME: home, CODEX_HOME: codexHome, npm_config_store_dir: STORE };
    const child = spawn(CODEX, args, { cwd: dir, env, stdio: ['pipe', 'pipe', 'inherit'] });
    let buf = '';
    child.stdout.on('data', (d) => {
      events.write(d);
      buf += d;
      for (let i; (i = buf.indexOf('\n')) >= 0; buf = buf.slice(i + 1)) {
        const e = JSON.parse(buf.slice(0, i) || 'null');
        if (e?.type === 'turn.completed') for (const k in usage) usage[k] += e.usage?.[k] ?? 0;
      }
    });
    child.on('error', reject);
    child.on('close', resolve);
    child.stdin.end(brief);
  });
} finally {
  events.end();
  rmSync(home, { recursive: true, force: true });
}
const seconds = Math.round((Date.now() - started) / 1000);

let builds = null;
if (!smoke) {
  try { sh('pnpm', ['build']); builds = true; } catch { builds = false; }
}
const run = { task, arm, n: Number(n), model: MODEL, effort: EFFORT, exit: code, seconds, usage, builds };
writeFileSync(join(meta, 'run.json'), JSON.stringify(run, null, 2) + '\n');
console.log(JSON.stringify(run));
if (smoke) console.log(readFileSync(join(meta, 'last.md'), 'utf8'));
