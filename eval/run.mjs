// One eval build: a case's prompt, given to an agent in a fresh copy of the starter, with (arm b) or
// without (arm a) the playbook's Skill. Neither arm sees the owner's own instructions or skills (see
// eval/agents), and the folder sits outside this repo and the owner's home, with its own git root,
// so no AGENTS.md, CLAUDE.md or node_modules above it does: Claude Code reads .claude/CLAUDE.md in
// every folder above the one it runs in, the home folder's included.
//
//   node eval/run.mjs <case> <a|b> <n> [--agent codex|claude] [--lang cn|en]
//   node eval/run.mjs --smoke <a|b> [--agent codex|claude]   ask an arm what it sees
//
// A case is eval/cases/<case>/ (cn.md and en.md, the same request in each language; plan:
// docs/plans/2026-10-31-real-cases.md). The older eval/tasks/<nn>-* briefs still run by number, in
// English, on Codex. Builds land in $EVAL_RUNS (default /Users/Shared/ui-playbook-eval-runs)/<case>/
// <agent>-<arm>-<lang>-<n> (old tasks: <arm>-<n>); the agent's events, last message and run.json
// (time, tokens, whether it builds) beside it in the same name plus .run.
import { execFileSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import codex from './agents/codex.mjs';
import claude from './agents/claude.mjs';

const AGENTS = { codex, claude };
const ROOT = new URL('..', import.meta.url).pathname;
const RUNS = process.env.EVAL_RUNS ?? '/Users/Shared/ui-playbook-eval-runs';
const SKILL = join(ROOT, 'dist/skill/ui-playbook');
const STORE = execFileSync('pnpm', ['store', 'path'], { encoding: 'utf8' }).trim();

// The same for both arms: where to build and how it's run, nothing about how it should look.
const FOOTER = {
  en: `
---

Build this in the Vite + React + TypeScript project in the current folder, as you would ship it.
It must run with \`pnpm dev\` and build with \`pnpm build\`. Invent realistic sample data where the
brief asks for it. You may add npm packages.`,
  cn: `
---

在当前文件夹的 Vite + React + TypeScript 项目里做，按你真要上线的标准来。要能用 \`pnpm dev\` 运行、用
\`pnpm build\` 构建。需要示例数据的地方，编得真实一些。可以加 npm 包。`,
};

const SMOKE = `Don't change any files. List every instruction file (AGENTS.md, CLAUDE.md or similar) and
every skill available to you in this session: for each, its name, its path, and its first line. Then
list any other instructions you were given beyond this message. If there are none, say so.`;

const argv = process.argv.slice(2);
const flag = (name, fallback) => {
  const i = argv.indexOf(`--${name}`);
  return i < 0 ? fallback : argv.splice(i, 2)[1];
};
const agentName = flag('agent', 'codex');
const langArg = flag('lang', null);
const smoke = argv[0] === '--smoke';
const [caseArg, arm, n] = smoke ? [null, argv[1], 1] : argv;
const agent = AGENTS[agentName];
if (!agent || !['a', 'b'].includes(arm) || (!smoke && !(caseArg && n)) || (langArg && !FOOTER[langArg])) {
  console.error('usage: node eval/run.mjs <case> <a|b> <n> [--agent codex|claude] [--lang cn|en] | --smoke <a|b> [--agent …]');
  process.exit(2);
}
if (arm === 'b' && !existsSync(join(SKILL, 'SKILL.md'))) throw new Error('No Skill: run `pnpm build` first.');

// A case in either language, or an old task by its number.
let name;
let request;
let lang = langArg ?? 'cn';
let build;
if (smoke) {
  name = '_smoke';
  request = SMOKE;
  build = `${agentName}-${arm}`;
} else if (existsSync(join(ROOT, 'eval/cases', caseArg, 'cn.md'))) {
  name = caseArg;
  request = readFileSync(join(ROOT, 'eval/cases', name, `${lang}.md`), 'utf8').trim() + FOOTER[lang];
  build = `${agentName}-${arm}-${lang}-${n}`;
} else {
  name = readdirSync(join(ROOT, 'eval/tasks')).find((f) => f.startsWith(caseArg))?.replace(/\.md$/, '');
  if (!name) throw new Error(`No case ${caseArg} in eval/cases or eval/tasks`);
  lang = 'en';
  request = readFileSync(join(ROOT, 'eval/tasks', `${name}.md`), 'utf8').replace(/^---[\s\S]*?---\n/, '') + FOOTER.en;
  build = `${arm}-${n}`;
}
const dir = join(RUNS, name, build);
const meta = `${dir}.run`;
if (existsSync(dir) && !smoke) throw new Error(`${dir} exists; pick another n`);
rmSync(dir, { recursive: true, force: true });
rmSync(meta, { recursive: true, force: true });
mkdirSync(meta, { recursive: true });

// The project: the starter, installed, committed, so the agent's work is the diff from here.
cpSync(join(ROOT, 'eval/starter'), dir, { recursive: true, filter: (p) => !/node_modules|\/dist$/.test(p) });
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { cwd: dir, stdio: 'pipe', encoding: 'utf8', ...opts });
if (!smoke) sh('pnpm', ['install', '--prefer-offline', '--silent']);
sh('git', ['init', '-q']);
sh('git', ['add', '-A']);
sh('git', ['-c', 'user.name=eval', '-c', 'user.email=eval@localhost', 'commit', '-qm', 'starter']);

writeFileSync(join(meta, 'prompt.md'), request);
const started = Date.now();
const result = await agent({ dir, meta, skill: arm === 'b' ? SKILL : null, brief: request, smoke, store: STORE });
const seconds = Math.round((Date.now() - started) / 1000);

let builds = null;
if (!smoke) {
  try {
    sh('pnpm', ['build']);
    builds = true;
  } catch {
    builds = false;
  }
}
const run = { case: name, agent: agentName, arm, lang, n: Number(n), ...result, seconds, builds };
writeFileSync(join(meta, 'run.json'), JSON.stringify(run, null, 2) + '\n');
console.log(JSON.stringify(run));
if (smoke) console.log(readFileSync(join(meta, 'last.md'), 'utf8'));
