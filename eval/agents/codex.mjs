// Codex in a HOME and CODEX_HOME holding only the login, so the owner's own instructions and skills
// (~/.codex, ~/.agents) reach neither arm; arm b gets the Skill as a user skill.
import { spawn } from 'node:child_process';
import { cpSync, createWriteStream, mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';

const CODEX = '/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex';
const MODEL = 'gpt-6.1-sol';
const EFFORT = 'medium';

export default async function codex({ dir, meta, skill, brief, smoke, store }) {
  const home = mkdtempSync(join(tmpdir(), 'eval-home-'));
  const codexHome = join(home, '.codex');
  mkdirSync(codexHome);
  cpSync(join(homedir(), '.codex/auth.json'), join(codexHome, 'auth.json'));
  if (skill) cpSync(skill, join(codexHome, 'skills/ui-playbook'), { recursive: true });

  const args = [
    'exec',
    '-m',
    MODEL,
    '-c',
    `model_reasoning_effort="${EFFORT}"`,
    '-c',
    'approval_policy="never"',
    '--ignore-user-config',
    '--ephemeral',
    '--json',
    '-o',
    join(meta, 'last.md'),
    '-C',
    dir,
    ...(smoke ? ['-s', 'read-only'] : ['-s', 'workspace-write', '-c', 'sandbox_workspace_write.network_access=true', '--add-dir', store]),
    '-',
  ];
  const events = createWriteStream(join(meta, 'events.jsonl'));
  const usage = { input_tokens: 0, cached_input_tokens: 0, output_tokens: 0 };
  try {
    const exit = await new Promise((resolve, reject) => {
      const env = { ...process.env, HOME: home, CODEX_HOME: codexHome, npm_config_store_dir: store };
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
    return { model: MODEL, effort: EFFORT, exit, usage };
  } finally {
    events.end();
    rmSync(home, { recursive: true, force: true });
  }
}
