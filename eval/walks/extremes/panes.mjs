// What scrolls where: the panes a person can scroll with the wheel, and what no scrolling reaches.

/** What the wheel would scroll at a point: the nearest scrolling ancestor, or the window. */
export const scrollerAt = (page, x, y) =>
  page.evaluate(
    ([x, y]) => {
      for (let el = document.elementFromPoint(x, y); el && el !== document.documentElement; el = el.parentElement) {
        if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 1)
          return { window: false, top: Math.round(el.scrollTop), name: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}` };
      }
      return { window: true, top: Math.round(document.scrollingElement.scrollTop), name: 'window' };
    },
    [x, y],
  );

export const windowTop = (page) => page.evaluate(() => Math.round(document.scrollingElement.scrollTop));

/** A wheel turn, as a person gives it: a few notches, then a pause for smooth scrolling to land. */
export async function wheel(page, x, y, dy) {
  await page.mouse.move(x, y);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, dy / 6);
  await page.waitForTimeout(500);
}

/** Every pane that scrolls, found by sampling the window on a grid: its name, a point inside it, and where it sits now. */
export const panes = (page) =>
  page.evaluate(() => {
    const found = new Map();
    for (let y = 60; y < innerHeight - 20; y += 120)
      for (let x = 40; x < innerWidth; x += 160) {
        for (let el = document.elementFromPoint(x, y); el && el !== document.documentElement; el = el.parentElement) {
          if (/(auto|scroll)/.test(getComputedStyle(el).overflowY) && el.scrollHeight > el.clientHeight + 40) {
            if (!found.has(el)) found.set(el, { x, y, name: `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 30)}` });
            break;
          }
        }
      }
    return [...found.values()];
  });

/** Visible text below the window's foot that neither the window nor any pane can scroll to:
 * a pane that grew with its content instead of scrolling it. The first few, as text. */
export const outOfReach = (page) =>
  page.evaluate(() => {
    const root = document.scrollingElement;
    const clipped = (el) => /(hidden|clip)/.test(getComputedStyle(el).overflowY);
    const windowScrolls = root.scrollHeight > innerHeight + 1 && !clipped(document.documentElement) && !clipped(document.body);
    const lost = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()) && lost.length < 5;) {
      const el = n.parentElement;
      if (!n.textContent.trim() || !el?.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
      const r = el.getBoundingClientRect();
      if (windowScrolls || r.top < innerHeight || r.height === 0) continue;
      let reached = false;
      for (let p = el.parentElement; p && p !== document.body; p = p.parentElement)
        if (/(auto|scroll)/.test(getComputedStyle(p).overflowY) && p.scrollHeight > p.clientHeight + 1) reached = true;
      if (!reached) lost.push(n.textContent.trim().slice(0, 30));
    }
    return lost;
  });
