// The extremes every case is walked through after its own flow, each on a fresh screen in its own
// browser context (so the case's own changes don't carry over): long content, a phone's width,
// the keyboard alone, dark mode, and a search that finds nothing. Plan:
// docs/plans/2026-10-31-real-cases.md.
import { look } from '../look.mjs';
import dark from './dark.mjs';
import empty from './empty.mjs';
import keyboard from './keyboard.mjs';
import long from './long.mjs';
import narrow from './narrow.mjs';

/** `open(options)` gives a fresh page at the build's first screen; `prepare.long`, from the case's
 * walk, brings up its longest content first. */
export default async function extremes({ open, meta, snap, check, attempt, prepare = {} }) {
  const desktop = { width: 1280, height: 800 };
  const phone = { width: 390, height: 844 };
  const base = meta.device === 'phone' ? phone : desktop;
  const run = async (id, options, fn) =>
    attempt(id, async () => {
      const page = await open(options);
      try {
        await fn(page, (name) => snap(page, name));
      } finally {
        await page.context().close();
      }
    });

  let light;
  await run('long', { viewport: base }, async (page, s) => {
    light = await look(page);
    await prepare.long?.(page);
    await long({ page, meta, snap: s, check });
  });
  await run('narrow', { viewport: { width: 375, height: 812 }, hasTouch: true }, (page, s) => narrow({ page, meta, snap: s, check }));
  await run('keyboard', { viewport: base }, (page, s) => keyboard({ page, snap: s, check }));
  await run('dark', { viewport: base, colorScheme: 'dark' }, (page, s) => dark({ page, snap: s, check, light: light ?? { faintText: 1 } }));
  await run('empty', { viewport: base }, (page, s) => empty({ page, snap: s, check }));
}
