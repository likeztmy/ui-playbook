// The app-window floor: the window holds still and each pane scrolls on its own, with the wheel,
// as a person scrolls, on a long document, a long sidebar and a document typed past the window.

/** What the wheel would scroll at a point: the nearest scrolling ancestor, or the window. */
const scrollerAt = (page, x, y) =>
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

/** The text at a point in the sidebar, and where its element sits: it shouldn't move when the content scrolls. */
const sidebarMark = (page) =>
  page.evaluate(() => {
    const el = document.elementFromPoint(140, 300);
    return `${(el?.textContent ?? '').trim().slice(0, 30)} @${Math.round(el?.getBoundingClientRect().top ?? -1)}`;
  });

/** Whether some text in an element is on screen: inside the window and not clipped by a pane
 * around it. Scoped to the editor, since the sidebar's preview of the document repeats it. */
const onScreen = (scope, text) =>
  scope.evaluate((root, text) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      const i = n.textContent.indexOf(text);
      if (i < 0) continue;
      const r = document.createRange();
      r.setStart(n, i);
      r.setEnd(n, i + text.length);
      const b = r.getBoundingClientRect();
      if (b.top < 0 || b.bottom > innerHeight) return false;
      const hit = document.elementFromPoint(b.x + 2, b.y + b.height / 2);
      return Boolean(hit && (hit === n.parentElement || hit.contains(n) || n.parentElement.contains(hit)));
    }
    return false;
  }, text);

const windowTop = (page) => page.evaluate(() => Math.round(document.scrollingElement.scrollTop));

async function wheel(page, x, y, dy) {
  await page.mouse.move(x, y);
  for (let i = 0; i < 6; i++) await page.mouse.wheel(0, dy / 6);
  await page.waitForTimeout(500);
}

export default async function walk({ page, url, shot, check, attempt }) {
  const CONTENT = [880, 420];
  const SIDEBAR = [140, 420];
  await page.goto(url);
  await page
    .getByText(/field notes/i)
    .filter({ visible: true })
    .first()
    .waitFor();
  await page.waitForTimeout(500);
  await shot('first');

  await attempt('content-scrolls', async () => {
    await page
      .getByText(/field notes/i)
      .filter({ visible: true })
      .first()
      .click();
    await page.waitForTimeout(500);
    await shot('field-notes');
    const mark = await sidebarMark(page);
    await wheel(page, ...CONTENT, 2400);
    const down = await scrollerAt(page, ...CONTENT);
    await shot('content-scrolled');
    check('content-scrolls', !down.window && down.top > 300, `${down.name} ${down.top}`);
    check(
      'window-still',
      (await windowTop(page)) === 0 && (await sidebarMark(page)) === mark,
      `window ${await windowTop(page)}; sidebar ${mark} → ${await sidebarMark(page)}`,
    );
    await wheel(page, ...CONTENT, -6000);
    const up = await scrollerAt(page, ...CONTENT);
    check(
      'content-scrolls-back',
      !down.window && down.top > 300 && !up.window && up.top === 0 && (await windowTop(page)) === 0,
      `${up.name} ${up.top}`,
    );
  });

  await attempt('sidebar-scrolls', async () => {
    const before = await scrollerAt(page, ...CONTENT);
    await wheel(page, ...SIDEBAR, 2400);
    const side = await scrollerAt(page, ...SIDEBAR);
    await shot('sidebar-scrolled');
    const after = await scrollerAt(page, ...CONTENT);
    check(
      'sidebar-scrolls',
      !side.window && side.top > 100 && after.top === before.top,
      `${side.name} ${side.top}; content ${before.top} → ${after.top}`,
    );
    await wheel(page, ...SIDEBAR, -6000);
  });

  // The failure a short sample hides: a document typed past the window, then scrolled back up.
  await attempt('typed-doc-scrolls-back', async () => {
    await page
      .getByRole('button', { name: /new (document|doc|page)/i })
      .first()
      .click();
    await page.waitForTimeout(500);
    const body = page.locator('[contenteditable="true"], textarea').filter({ visible: true }).last();
    await body.click();
    // At a fast typist's pace, a line and then Enter as its own key. Machine-speed typing broke
    // editors that a person's typing doesn't (React's update-depth error, lost keys), which
    // isn't what this check is for.
    for (let i = 1; i <= 70; i++) {
      await page.keyboard.type(`Typed line ${i}.`, { delay: 25 });
      await page.keyboard.press('Enter');
    }
    await page.waitForTimeout(400);
    await shot('typed');
    const lastSeen = await onScreen(body, 'Typed line 70.');
    await wheel(page, ...CONTENT, -9000);
    const up = await scrollerAt(page, ...CONTENT);
    const firstSeen = await onScreen(body, 'Typed line 1.');
    await shot('typed-back-up');
    check(
      'typed-doc-scrolls-back',
      lastSeen && firstSeen && (await windowTop(page)) === 0,
      `typed end shown ${lastSeen}; back to line 1 ${firstSeen}; ${up.name} ${up.top}; window ${await windowTop(page)}`,
    );
  });
}
