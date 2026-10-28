// The owner's blind picks, as an Artifact page: one pair at a time, the same task walked by both
// arms, screenshots step by step and side by side. Which side is which arm is decided once per
// pair and kept in $EVAL_RUNS/picks.json; the page and its file names only say p3/L.
//
//   node eval/review.mjs <out dir>     writes index.html and img/ there, to publish as an Artifact
//
// Picks are saved in the Artifact's db (picks/<pair id>: {pick: left|right|tie|both-bad, note}).
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const RUNS = process.env.EVAL_RUNS ?? join(homedir(), 'code/ui-playbook-eval-runs');
const MAP = join(RUNS, 'picks.json');
const TASKS = new URL('./tasks/', import.meta.url).pathname;
const out = process.argv[2];
if (!out) throw new Error('usage: node eval/review.mjs <out dir>');

// Pair ids stay put as pairs are added, so a pick never moves to another pair.
const map = existsSync(MAP) ? JSON.parse(readFileSync(MAP, 'utf8')) : {};
map.sides ??= {};
map.ids ??= {};
const walked = readdirSync(RUNS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
  .flatMap((d) =>
    readdirSync(join(RUNS, d.name))
      .filter((f) => /^a-\d+$/.test(f))
      .map((f) => f.slice(2))
      .filter((n) => ['a', 'b'].every((arm) => existsSync(join(RUNS, d.name, `${arm}-${n}.run/walk.json`))))
      .map((n) => `${d.name}/${n}`),
  )
  .sort();
for (const key of walked) {
  map.sides[key] ??= Math.random() < 0.5 ? ['a', 'b'] : ['b', 'a'];
  map.ids[key] ??= `p${Object.keys(map.ids).length + 1}`;
}
writeFileSync(MAP, JSON.stringify(map, null, 2) + '\n');

rmSync(out, { recursive: true, force: true });
const step = (f) => f.replace(/^\d+-/, '').replace(/\.png$/, '').replace(/-/g, ' ');
const pairs = walked.map((key) => {
  const [task, n] = key.split('/');
  const id = map.ids[key];
  const brief = readFileSync(join(TASKS, `${task}.md`), 'utf8').replace(/^---[\s\S]*?---\n/, '').trim();
  const sides = map.sides[key].map((arm, i) => {
    const dir = join(RUNS, task, `${arm}-${n}.run/shots`);
    const files = existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.png')).sort() : [];
    const dest = join(out, 'img', id, 'LR'[i]);
    mkdirSync(dest, { recursive: true });
    return files.map((f) => {
      const jpg = f.replace(/\.png$/, '.jpg');
      execFileSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '72', join(dir, f), '--out', join(dest, jpg)], { stdio: 'ignore' });
      return { name: step(f), src: `img/${id}/${'LR'[i]}/${jpg}` };
    });
  });
  const names = [...new Set(sides.flat().map((s) => s.name))];
  return {
    id,
    title: brief.match(/^# (.+)/m)?.[1] ?? task,
    brief: brief.replace(/^# .+\n+/, ''),
    steps: names.map((name) => ({ name, L: sides[0].find((s) => s.name === name)?.src ?? null, R: sides[1].find((s) => s.name === name)?.src ?? null })),
  };
});

const data = JSON.stringify(pairs).replace(/</g, '\\u003c');
writeFileSync(join(out, 'index.html'), readFileSync(new URL('./review.html', import.meta.url), 'utf8').replace('/*DATA*/[]', data));
console.log(`review: ${pairs.length} pairs → ${out}`);
