// Walks one build through its task: serves the build, runs eval/walks/<task>.mjs, which follows the
// brief's named controls, and records what the judges see (screenshots) and the measured
// checks, into the build's .run folder.
//
//   node eval/walk.mjs <build dir>     e.g. node eval/walk.mjs ~/code/ui-playbook-eval-runs/01-confirm-delete/b-1
import { chromium } from '@playwright/test';
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { createServer } from 'node:net';

const dir = process.argv[2]?.replace(/\/$/, '');
if (!dir) throw new Error('usage: node eval/walk.mjs <build dir>');
const task = basename(dirname(dir));
const meta = `${dir}.run`;
const shots = join(meta, 'shots');
rmSync(shots, { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
const { default: walk } = await import(`./walks/${task}.mjs`);

const port = await new Promise((r) => {
  const s = createServer().listen(0, '127.0.0.1', () => {
    const p = s.address().port;
    s.close(() => r(p));
  });
});
// The build's own vite, so killing it stops the server, on whatever path this script leaves by.
const server = spawn(join(dir, 'node_modules/.bin/vite'), ['preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: dir, stdio: 'ignore' });
process.on('exit', () => server.kill());
const url = `http://127.0.0.1:${port}`;
for (let i = 0; ; i++) {
  if (server.exitCode != null) throw new Error(`${dir}: preview exited (${server.exitCode})`);
  if (await fetch(url).then((r) => r.ok, () => false)) break;
  if (i > 100) throw new Error(`${dir}: preview never came up`);
  await new Promise((r) => setTimeout(r, 200));
}

const browser = await chromium.launch({ channel: 'chrome' });
const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
// Layout shift, summed as CLS does without session windows: what moved that the person didn't move.
await context.addInitScript(() => {
  window.__shift = 0;
  new PerformanceObserver((l) => l.getEntries().forEach((e) => !e.hadRecentInput && (window.__shift += e.value))).observe({ type: 'layout-shift', buffered: true });
});
const page = await context.newPage();
// A build that doesn't have what the brief names should stop the walk quickly, not hang it.
page.setDefaultTimeout(5000);
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

const checks = [];
let step = 0;
const api = {
  page,
  url,
  /** A screenshot for the judges, numbered in walk order. */
  shot: (name) => page.screenshot({ path: join(shots, `${String(++step).padStart(2, '0')}-${name}.png`) }),
  /** A measured check: its id names the page that states the rule (see the plan's Scoring table). */
  check: (id, pass, detail = '') => checks.push({ id, pass: Boolean(pass), detail: String(detail) }),
  /** What has focus, as role and name, or "body". */
  focused: () =>
    page.evaluate(() => {
      const a = document.activeElement;
      if (!a || a === document.body) return 'body';
      return `${a.getAttribute('role') ?? a.tagName.toLowerCase()} "${(a.getAttribute('aria-label') ?? a.textContent ?? '').trim().slice(0, 40)}"`;
    }),
  shift: () => page.evaluate(() => window.__shift),
  /** A step the build may not have: if it can't be done, that's a failed check and the walk goes on. */
  attempt: async (id, fn) => {
    try {
      await fn();
    } catch (e) {
      api.check(id, false, `couldn't: ${e.message.split('\n')[0]}`);
      await page.keyboard.press('Escape').catch(() => {});
    }
  },
};

let failed = null;
try {
  await walk(api);
} catch (e) {
  // A build the script can't walk is a result too: the step it stopped at.
  failed = e.message.split('\n')[0];
  await api.shot('stopped').catch(() => {});
}
api.check('no-errors', !errors.length, errors.join(' | '));
await context.close();
await browser.close();
server.kill();

writeFileSync(join(meta, 'walk.json'), JSON.stringify({ task, failed, checks }, null, 2) + '\n');
console.log(`${dir}: ${failed ? `stopped: ${failed}` : 'walked'}; ${checks.filter((c) => c.pass).length}/${checks.length} checks pass`);
