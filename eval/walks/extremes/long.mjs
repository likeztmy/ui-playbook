// Long: the floor that an app's window holds still and each pane scrolls on its own. Every pane the
// grid finds is wheeled down and back up; nothing else may move, and no text may sit past the
// window's foot where no scrolling reaches. A reading page or a phone screen may scroll as one, so
// there only the reach is checked.
import { outOfReach, panes, scrollerAt, wheel, windowTop } from './panes.mjs';

const tops = (page, list) => Promise.all(list.map((p) => scrollerAt(page, p.x, p.y).then((s) => s.top)));

export default async function long({ page, meta, snap, check }) {
  const lost = await outOfReach(page);
  check('long-in-reach', !lost.length, lost.join(' | '));
  if (meta.kind === 'reading' || meta.device === 'phone') return;

  const list = await panes(page);
  const bad = [];
  for (const [i, p] of list.entries()) {
    const before = await tops(page, list);
    await wheel(page, p.x, p.y, 2400);
    const after = await tops(page, list);
    if (i === 0) await snap('long-scrolled');
    const moved = after[i] > before[i];
    const others = after.every((t, j) => j === i || t === before[j]);
    const win = await windowTop(page);
    await wheel(page, p.x, p.y, -9000);
    const back = (await scrollerAt(page, p.x, p.y)).top;
    if (!moved || !others || win !== 0 || back !== 0) bad.push(`${p.name}: moved ${moved}, others still ${others}, window ${win}, back to ${back}`);
  }
  // Wheel where no pane was found: if the window moves, the page scrolls as one.
  await wheel(page, 640, 400, 2400);
  const win = await windowTop(page);
  await wheel(page, 640, 400, -9000);
  check(
    'long-panes-scroll',
    list.length > 0 && !bad.length && win === 0,
    list.length ? `${list.map((p) => p.name).join(', ')}; ${bad.join(' | ')}; window ${win}` : `no pane scrolls; window ${win}`,
  );
}
