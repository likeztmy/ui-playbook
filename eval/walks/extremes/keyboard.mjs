// Keyboard: Tab from the top of a fresh screen. Focus always lands on something and shows where it
// is: while focused, the control (or the box around it) looks different from when it isn't.
export default async function keyboard({ page, snap, check }) {
  const stops = [];
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    await page.waitForTimeout(80);
    const stop = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      // The control and the two boxes around it: a field often shows focus on its wrapper (:focus-within).
      const look = () =>
        [el, el.parentElement, el.parentElement?.parentElement]
          .filter(Boolean)
          .map((e) => {
            const cs = getComputedStyle(e);
            return [
              cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) > 0 ? cs.outlineColor : 'none',
              cs.boxShadow,
              cs.backgroundColor,
              cs.borderColor,
              cs.color,
              cs.textDecorationLine,
            ].join('|');
          })
          .join('/');
      const focused = look();
      el.blur();
      const rest = look();
      el.focus();
      return {
        name: `${el.getAttribute('role') ?? el.tagName.toLowerCase()} "${(el.getAttribute('aria-label') ?? el.textContent ?? '').trim().slice(0, 24)}"`,
        shown: focused !== rest,
      };
    });
    if (i === 3) await snap('keyboard');
    stops.push(stop);
  }
  // Past the last control the browser's own UI takes focus and the page reports body: a cycle, not a loss.
  const seen = stops.filter(Boolean);
  const lost = stops.findIndex((s) => !s);
  const cycled = lost > 0 && stops[lost + 1]?.name === stops[0]?.name;
  check(
    'keyboard-focus-lands',
    seen.length >= 3 && (lost < 0 || cycled),
    stops
      .map((s) => s?.name ?? 'body')
      .slice(0, 8)
      .join(' → '),
  );
  const hidden = seen.filter((s) => !s.shown);
  check('keyboard-focus-shown', seen.length && !hidden.length, hidden.map((s) => s.name).join(', '));
}
