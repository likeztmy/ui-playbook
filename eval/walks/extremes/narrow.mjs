// Narrow: a phone's width. Nothing scrolls sideways, and on a phone app every control a thumb
// presses is 44 px in both directions (Apple's minimum; WCAG 2.5.8's floor is 24).
export default async function narrow({ page, meta, snap, check }) {
  const wide = await page.evaluate(() => ({ content: document.scrollingElement.scrollWidth, window: innerWidth }));
  await snap('narrow');
  check('narrow-no-sideways', wide.content <= wide.window + 1, `${wide.content} in ${wide.window}`);
  const small = await page.evaluate(() =>
    [
      ...document.querySelectorAll(
        'button, [role="button"], [role="tab"], [role="switch"], [role="checkbox"], [role="radio"], input, select, textarea, nav a',
      ),
    ]
      .filter((el) => el.checkVisibility({ visibilityProperty: true, opacityProperty: true }) && !el.closest('p, li p'))
      // An input's target includes its label, since a click there works it; a visually hidden
      // input (1 px, the sr-only pattern) is pressed through that label, not itself.
      .map((el) => {
        const own = el.getBoundingClientRect();
        const label = [...(el.labels ?? [])].map((l) => l.getBoundingClientRect()).sort((a, b) => b.width * b.height - a.width * a.height)[0];
        return { el, r: label && label.width * label.height > own.width * own.height ? label : own };
      })
      .filter(({ r }) => r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight)
      .map(({ el, r }) => ({
        name: (el.getAttribute('aria-label') ?? el.textContent ?? el.tagName).trim().slice(0, 20),
        w: Math.round(r.width),
        h: Math.round(r.height),
      })),
  );
  const under = (min) => small.filter((c) => c.w < min || c.h < min);
  check(
    'narrow-targets-24',
    !under(24).length,
    under(24)
      .map((c) => `${c.name} ${c.w}×${c.h}`)
      .join(', '),
  );
  if (meta.device === 'phone')
    check(
      'narrow-targets-44',
      !under(44).length,
      `${under(44).length}/${small.length}: ${under(44)
        .slice(0, 6)
        .map((c) => `${c.name} ${c.w}×${c.h}`)
        .join(', ')}`,
    );
}
