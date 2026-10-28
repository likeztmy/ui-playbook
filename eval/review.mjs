// The owner's blind picks: a local page showing one pair of builds at a time, the same task walked
// by both arms, screenshots step by step and side by side. Which side is which arm is decided once
// per pair and kept server-side; nothing on the page or in its URLs names an arm.
//
//   node eval/review.mjs          then open http://localhost:4400
//
// Picks are written to $EVAL_RUNS/picks.json as they're made.
import { createServer } from 'node:http';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

const RUNS = process.env.EVAL_RUNS ?? join(homedir(), 'code/ui-playbook-eval-runs');
const PICKS = join(RUNS, 'picks.json');
const TASKS = new URL('./tasks/', import.meta.url).pathname;
const saved = existsSync(PICKS) ? JSON.parse(readFileSync(PICKS, 'utf8')) : { sides: {}, picks: {} };

// A pair: run n of a task in each arm, both walked.
const pairs = readdirSync(RUNS, { withFileTypes: true })
  .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
  .flatMap((d) => {
    const ns = readdirSync(join(RUNS, d.name)).filter((f) => /^a-\d+$/.test(f)).map((f) => f.slice(2));
    return ns.filter((n) => existsSync(join(RUNS, d.name, `b-${n}.run/walk.json`)) && existsSync(join(RUNS, d.name, `a-${n}.run/walk.json`))).map((n) => ({ task: d.name, n }));
  })
  .map((p) => {
    const id = `${p.task}/${p.n}`;
    saved.sides[id] ??= Math.random() < 0.5 ? ['a', 'b'] : ['b', 'a'];
    return { ...p, id, sides: saved.sides[id] };
  });
writeFileSync(PICKS, JSON.stringify(saved, null, 2));

const shots = (p, side) => {
  const dir = join(RUNS, p.task, `${p.sides[side]}-${p.n}.run/shots`);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.png')).sort() : [];
};
const step = (f) => f.replace(/^\d+-/, '').replace(/\.png$/, '').replace(/-/g, ' ');

function view(i) {
  const p = pairs[i];
  const brief = readFileSync(join(TASKS, `${p.task}.md`), 'utf8').replace(/^---[\s\S]*?---\n/, '');
  const [L, R] = [shots(p, 0), shots(p, 1)];
  const names = [...new Set([...L, ...R].map(step))];
  const cell = (list, side, name) => {
    const f = list.find((x) => step(x) === name);
    return f ? `<a href="/img/${i}/${side}/${f}" target="_blank"><img src="/img/${i}/${side}/${f}" alt="${side ? 'Right' : 'Left'}: ${name}" loading="lazy"></a>` : '<div class="none">Not reached</div>';
  };
  const pick = saved.picks[p.id];
  const choice = (v, label) => `<button type="submit" name="pick" value="${v}"${pick?.pick === v ? ' aria-pressed="true"' : ''}>${label}</button>`;
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Pair ${i + 1} of ${pairs.length}</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
  :root { color-scheme: light dark; --line: color-mix(in oklch, currentColor 14%, transparent); font: 14px/1.5 system-ui, sans-serif; }
  body { margin: 0; background: Canvas; color: CanvasText; }
  header, form { position: sticky; z-index: 1; background: Canvas; display: flex; gap: 12px; align-items: center; padding: 10px 16px; }
  header { top: 0; border-bottom: 1px solid var(--line); }
  form { bottom: 0; border-top: 1px solid var(--line); flex-wrap: wrap; }
  h1 { font-size: 15px; margin: 0; flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  header span { white-space: nowrap; color: GrayText; }
  details { padding: 8px 16px; border-bottom: 1px solid var(--line); }
  details pre { white-space: pre-wrap; font: inherit; max-width: 720px; }
  .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px 16px; padding: 16px; }
  .side { font-weight: 600; position: sticky; top: 49px; background: Canvas; padding: 4px 0; }
  .step { grid-column: 1 / -1; color: GrayText; margin-top: 8px; border-top: 1px solid var(--line); padding-top: 8px; }
  img { width: 100%; display: block; border-radius: 6px; outline: 1px solid var(--line); }
  .none { aspect-ratio: 16 / 10; display: grid; place-items: center; border: 1px dashed var(--line); border-radius: 6px; color: GrayText; }
  button, a.nav { font: inherit; padding: 6px 12px; border-radius: 6px; border: 1px solid var(--line); background: Canvas; color: CanvasText; text-decoration: none; cursor: pointer; }
  button[aria-pressed="true"] { background: CanvasText; color: Canvas; }
  input { flex: 1; min-width: 200px; font: inherit; padding: 6px 10px; border-radius: 6px; border: 1px solid var(--line); background: Canvas; color: CanvasText; }
  a.nav[aria-disabled="true"] { pointer-events: none; opacity: 0.4; }
</style>
<header>
  <h1>Pair ${i + 1} of ${pairs.length} · ${brief.match(/^# (.+)/m)?.[1] ?? p.task}</h1>
  <span>${Object.keys(saved.picks).length} picked</span>
  <a class="nav" href="/${i - 1}" aria-disabled="${i === 0}">Previous</a>
  <a class="nav" href="/${i + 1}" aria-disabled="${i === pairs.length - 1}">Next</a>
</header>
<details><summary>Brief</summary><pre>${brief.replace(/</g, '&lt;')}</pre></details>
<div class="grid">
  <div class="side">Left</div><div class="side">Right</div>
  ${names.map((n) => `<div class="step">${n}</div>${cell(L, 0, n)}${cell(R, 1, n)}`).join('')}
</div>
<form method="post" action="/${i}">
  ${choice('left', 'Left is better')}${choice('right', 'Right is better')}${choice('tie', 'Tie')}${choice('both-bad', 'Both bad')}
  <input name="note" placeholder="Note (optional)" value="${(pick?.note ?? '').replace(/"/g, '&quot;')}" aria-label="Note">
</form>
</html>`;
}

createServer((req, res) => {
  const [, a, b, c] = req.url.split('/');
  if (a === 'img') {
    const p = pairs[Number(b)];
    const file = join(RUNS, p.task, `${p.sides[Number(c)]}-${p.n}.run/shots`, decodeURIComponent(req.url.split('/')[4]));
    if (!existsSync(file)) return res.writeHead(404).end();
    return res.writeHead(200, { 'content-type': 'image/png' }).end(readFileSync(file));
  }
  const i = Math.min(Math.max(Number(a) || 0, 0), pairs.length - 1);
  if (!pairs.length) return res.end('No walked pairs yet.');
  if (req.method === 'POST') {
    let body = '';
    req.on('data', (d) => (body += d));
    req.on('end', () => {
      const f = new URLSearchParams(body);
      const p = pairs[i];
      const side = { left: 0, right: 1 }[f.get('pick')];
      // Stored as the arm that won, so the report needs no mapping.
      saved.picks[p.id] = { pick: f.get('pick'), winner: side == null ? f.get('pick') : p.sides[side], note: f.get('note') ?? '', at: new Date().toISOString() };
      writeFileSync(PICKS, JSON.stringify(saved, null, 2));
      res.writeHead(303, { location: `/${Math.min(i + 1, pairs.length - 1)}` }).end();
    });
    return;
  }
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' }).end(view(i));
}).listen(4400, () => console.log(`review: ${pairs.length} pairs at http://localhost:4400`));
