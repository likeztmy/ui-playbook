// Screenshot and measure a page in headless Chrome, independent of any
// visible browser pane: islands hydrate, animations run, frames render.
//
//   pnpm shoot /components/menu --width 1280 --theme dark --selector "figure" --out shots/menu.png
//   pnpm shoot / --eval "document.documentElement.scrollWidth - innerWidth"
//
// Flags: --base (default http://localhost:4321, the dev server), --width
// (1280), --height (800), --theme light|dark (light), --selector (element to
// shoot; default the viewport), --full (whole page), --scale (device pixel
// ratio, 2), --hover "<selector>" (hover it, wait 800ms), --out (shots/<route>.png),
// --eval "<expression>" (printed as JSON after the shot).
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const [route = '/', ...rest] = process.argv.slice(2);
const flags = {};
for (let i = 0; i < rest.length; i++) {
  const key = rest[i].replace(/^--/, '');
  const next = rest[i + 1];
  if (next === undefined || next.startsWith('--')) flags[key] = true;
  else (flags[key] = next), i++;
}

const base = flags.base ?? 'http://localhost:4321';
const width = Number(flags.width ?? 1280);
const height = Number(flags.height ?? 800);
const theme = flags.theme ?? 'light';
const slug = route === '/' ? 'home' : route.replace(/^\//, '').replaceAll('/', '-');
const out = flags.out ?? `shots/${slug}-${width}-${theme}.png`;

const browser = await chromium.launch({ channel: 'chrome' });
try {
  const page = await browser.newPage({
    viewport: { width, height },
    deviceScaleFactor: Number(flags.scale ?? 2),
    colorScheme: theme,
  });
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(base + route);

  // Hydrate every client:visible island, then return to the top.
  const islands = page.locator('astro-island');
  for (let i = 0, n = await islands.count(); i < n; i++) await islands.nth(i).scrollIntoViewIfNeeded();
  try {
    await page.waitForFunction(() => !document.querySelector('astro-island[ssr]'), null, { timeout: 10_000 });
  } catch {
    const stuck = await page.$$eval('astro-island[ssr]', (els) => els.map((e) => e.getAttribute('component-url')));
    console.error(`Islands never hydrated: ${stuck.join(', ')}`);
    console.error(errors.join('\n') || '(no console errors)');
    console.error('On the dev server, "504 Outdated Optimize Dep" means Vite deps went stale after an install: restart it.');
    process.exitCode = 1;
    throw new Error('hydration failed');
  }
  await page.evaluate(() => window.scrollTo(0, 0));

  if (flags.hover) {
    await page.locator(flags.hover).first().hover();
    await page.waitForTimeout(800);
  }

  mkdirSync(dirname(out), { recursive: true });
  if (flags.selector) await page.locator(flags.selector).first().screenshot({ path: out });
  else await page.screenshot({ path: out, fullPage: Boolean(flags.full) });
  console.log(out);

  if (flags.eval) console.log(JSON.stringify(await page.evaluate(flags.eval), null, 2));
} finally {
  await browser.close();
}
