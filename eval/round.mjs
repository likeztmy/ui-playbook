// A round's results, for the cases in eval/cases: each measured check's pass count by agent and
// arm, over every walked build, and the builds that didn't build or walk.
//
//   node eval/round.mjs [--set practice|exam]
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const RUNS = process.env.EVAL_RUNS ?? '/Users/Shared/ui-playbook-eval-runs';
const i = process.argv.indexOf('--set');
const set = i < 0 ? null : process.argv[i + 1];

const cases = readdirSync(join(ROOT, 'eval/cases')).filter((c) => {
  const meta = JSON.parse(readFileSync(join(ROOT, 'eval/cases', c, 'case.json'), 'utf8'));
  return !set || meta.set === set;
});

const groups = ['claude-a', 'claude-b', 'codex-a', 'codex-b'];
const tally = new Map(); // check id → group → [pass, of]
const trouble = [];
let walked = 0;
for (const c of cases) {
  if (!existsSync(join(RUNS, c))) continue;
  for (const f of readdirSync(join(RUNS, c)).filter((f) => f.endsWith('.run'))) {
    const build = f.replace(/\.run$/, '');
    const [agent, arm] = build.split('-');
    if (!groups.includes(`${agent}-${arm}`)) continue;
    const run = existsSync(join(RUNS, c, f, 'run.json')) ? JSON.parse(readFileSync(join(RUNS, c, f, 'run.json'), 'utf8')) : null;
    const walk = existsSync(join(RUNS, c, f, 'walk.json')) ? JSON.parse(readFileSync(join(RUNS, c, f, 'walk.json'), 'utf8')) : null;
    if (!run?.builds || !walk) {
      trouble.push(`${c}/${build}: ${!run ? 'no run' : !run.builds ? "doesn't build" : 'not walked'}`);
      continue;
    }
    walked++;
    if (walk.failed) trouble.push(`${c}/${build}: walk stopped at ${walk.failed}`);
    for (const { id, pass } of walk.checks) {
      const row = tally.get(id) ?? Object.fromEntries(groups.map((g) => [g, [0, 0]]));
      row[`${agent}-${arm}`][0] += pass ? 1 : 0;
      row[`${agent}-${arm}`][1] += 1;
      tally.set(id, row);
    }
  }
}

const cell = ([p, n]) => (n ? `${p}/${n}` : '–');
console.log(`${walked} builds walked over ${cases.length} cases\n`);
console.log(`| check | ${groups.join(' | ')} |\n| --- | ${groups.map(() => '---').join(' | ')} |`);
for (const [id, row] of [...tally].sort(([a], [b]) => a.localeCompare(b))) console.log(`| ${id} | ${groups.map((g) => cell(row[g])).join(' | ')} |`);
if (trouble.length) console.log(`\n${trouble.join('\n')}`);
