// The Claude-side Skill eval: `claude plugin eval` on the exported Skill, with and without it.
// Wraps dist/skill/ui-playbook as a plugin in eval/plugin/.build (dist/ is deployed, so the wrapper
// and the cases stay out of it), then runs the cases in eval/plugin/cases on this machine, under
// the owner's Claude login, once the 1-minute load is under 6.
//
//   node eval/plugin.mjs [--case <glob>] [--runs <n>] ...   extra flags go to `claude plugin eval`
//
// Results and the HTML report land in eval/plugin/results/<time>/. Plan:
// docs/plans/2026-10-30-plugin-eval.md.
import { execFileSync, spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { loadavg } from 'node:os';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SKILL = join(ROOT, 'dist/skill/ui-playbook');
const BUILD = join(ROOT, 'eval/plugin/.build/ui-playbook');
const MODEL = 'claude-sonnet-5-5';

if (!existsSync(join(SKILL, 'SKILL.md'))) throw new Error('no exported Skill: run `pnpm build` first');

const { version } = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf8'));
rmSync(BUILD, { recursive: true, force: true });
mkdirSync(join(BUILD, '.claude-plugin'), { recursive: true });
writeFileSync(
  join(BUILD, '.claude-plugin/plugin.json'),
  JSON.stringify(
    {
      name: 'ui-playbook',
      version,
      description: 'Rules for product UI, each with the reason and the mistake it prevents.',
      homepage: 'https://ui-playbook.suspense.site',
      license: 'MIT',
    },
    null,
    2,
  ),
);
cpSync(SKILL, join(BUILD, 'skills/ui-playbook'), { recursive: true });
cpSync(join(ROOT, 'eval/plugin/cases'), join(BUILD, 'evals'), { recursive: true });

// The runs are claude children on this machine: wait for it to be free, as eval/batch.sh does.
while (loadavg()[0] >= 6) {
  console.log(`load ${loadavg()[0].toFixed(1)}, waiting`);
  execFileSync('sleep', ['30']);
}

const now = new Date();
const stamp = [now.getFullYear(), now.getMonth() + 1, now.getDate(), now.getHours(), now.getMinutes()].map((n) => String(n).padStart(2, '0')).join('');
const out = join(ROOT, 'eval/plugin/results', stamp);
const { status } = spawnSync(
  'claude',
  [
    'plugin',
    'eval',
    BUILD,
    '--trust-plugin',
    '--no-publish',
    '--model',
    MODEL,
    '--judge-model',
    MODEL,
    '-j',
    '2',
    '--max-cost-usd',
    '30',
    '--output-dir',
    out,
    '--report',
    join(out, 'report.html'),
    ...process.argv.slice(2),
    // Last: --allow-tools takes a list, so anything after it would be read as a tool.
    '--allow-tools',
    'Write',
    'Edit',
  ],
  { stdio: 'inherit' },
);
console.log(`results: ${out}`);
process.exit(status ?? 1);
