// Claude Code under the owner's login, with only project and local settings: the owner's CLAUDE.md,
// skills, plugins and MCP servers stay out of both arms (checked with `--smoke`). Arm b gets the
// Skill as a plugin loaded for this run alone. Edits are accepted inside the build folder; the shell
// is limited to the commands a build needs, and anything else is refused, not asked.
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { cpSync, createWriteStream, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const MODEL = 'claude-sonnet-5-5';
const SHELL = [
  'pnpm',
  'npm',
  'npx',
  'node',
  'git',
  'ls',
  'cat',
  'head',
  'tail',
  'wc',
  'grep',
  'find',
  'mkdir',
  'mv',
  'cp',
  'rm',
  'touch',
  'sed',
  'echo',
  'pwd',
];

/** A run is one turn. With `session` (an object kept by the caller across turns) the conversation
 * is kept: the first turn names it, later turns resume it; `session.close()` ends it. */
export default async function claude({ dir, meta, skill, brief, smoke, store, session }) {
  const resume = Boolean(session?.id);
  const tmp = session?.tmp ?? mkdtempSync(join(tmpdir(), 'eval-claude-'));
  const plugin = join(tmp, 'ui-playbook');
  if (skill && !resume) {
    mkdirSync(join(plugin, '.claude-plugin'), { recursive: true });
    writeFileSync(join(plugin, '.claude-plugin/plugin.json'), JSON.stringify({ name: 'ui-playbook', version: '0.0.0' }));
    cpSync(skill, join(plugin, 'skills/ui-playbook'), { recursive: true });
  }
  const args = [
    '-p',
    '--model',
    MODEL,
    '--output-format',
    'stream-json',
    '--verbose',
    ...(!session ? ['--no-session-persistence'] : resume ? ['--resume', session.id] : ['--session-id', (session.id = randomUUID())]),
    '--setting-sources',
    'project,local',
    '--strict-mcp-config',
    '--no-chrome',
    '--permission-mode',
    smoke ? 'plan' : 'acceptEdits',
    '--allowedTools',
    ...SHELL.map((c) => `Bash(${c}:*)`),
    ...(skill ? ['--plugin-dir', plugin] : []),
  ];
  const events = createWriteStream(join(meta, 'events.jsonl'));
  let result = null;
  try {
    const exit = await new Promise((resolve, reject) => {
      const env = { ...process.env, npm_config_store_dir: store, CLAUDE_CODE_DISABLE_AUTO_MEMORY: '1' };
      const child = spawn('claude', args, { cwd: dir, env, stdio: ['pipe', 'pipe', 'inherit'] });
      let buf = '';
      child.stdout.on('data', (d) => {
        events.write(d);
        buf += d;
        for (let i; (i = buf.indexOf('\n')) >= 0; buf = buf.slice(i + 1)) {
          const e = JSON.parse(buf.slice(0, i) || 'null');
          if (e?.type === 'result') result = e;
        }
      });
      child.on('error', reject);
      child.on('close', resolve);
      child.stdin.end(brief);
    });
    writeFileSync(join(meta, 'last.md'), String(result?.result ?? ''));
    const u = result?.usage ?? {};
    const usage = {
      input_tokens: (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0),
      cached_input_tokens: u.cache_read_input_tokens ?? 0,
      output_tokens: u.output_tokens ?? 0,
    };
    // A resumed session reports its cost so far; this turn's is the difference.
    const total = result?.total_cost_usd ?? null;
    const cost = total === null ? null : total - (session?.spent ?? 0);
    if (session) session.spent = total ?? session.spent;
    return { model: MODEL, effort: 'default', exit, usage, cost, turns: result?.num_turns ?? null };
  } finally {
    events.end();
    if (session) {
      session.tmp = tmp;
      // And the transcript Claude Code kept under the owner's ~/.claude/projects, in a folder named
      // for this build's alone.
      session.close = () => {
        rmSync(tmp, { recursive: true, force: true });
        rmSync(join(homedir(), '.claude/projects', dir.replace(/[^a-zA-Z0-9]/g, '-')), { recursive: true, force: true });
      };
    } else rmSync(tmp, { recursive: true, force: true });
  }
}
