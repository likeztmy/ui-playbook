// The tick rail (Ticks.astro): one tick per block of the article. The block you are reading is
// marked, a hover or focus shows its heading and opening words, and a press scrolls to it.

const still = matchMedia('(prefers-reduced-motion: reduce)');

for (const rail of document.querySelectorAll<HTMLElement>('[data-ticks]')) {
  const scope = rail.closest(rail.dataset.scope!)!;
  const peek = rail.querySelector<HTMLElement>('[data-peek]')!;
  const [peekTitle, peekText] = peek.children as unknown as [HTMLElement, HTMLElement];
  const blocks = [...scope.querySelectorAll<HTMLElement>(rail.dataset.blocks!)];
  if (!blocks.length) continue;
  // Rows shrink on a long page, so the rail stays inside 60% of the window.
  rail.style.setProperty('--tick-h', `${Math.min(20, Math.floor((innerHeight * 0.6) / blocks.length))}px`);

  // A block's heading is the nearest heading at or before it.
  let heading = '';
  const ticks = blocks.map((block) => {
    // What a reader sees: a demo by its caption, else the text less any decorative note.
    const copy = (block.querySelector('figcaption') ?? block).cloneNode(true) as HTMLElement;
    for (const hidden of copy.querySelectorAll('[aria-hidden=true], button')) hidden.remove();
    const text = copy.textContent!.replace(/\s+/g, ' ').trim();
    if (/^H[1-3]$/.test(block.tagName)) heading = text;
    const title = heading;
    const tick = document.createElement('button');
    tick.type = 'button';
    tick.setAttribute('aria-label', title === text ? title : `${title}: ${text.slice(0, 60)}`);
    const show = () => {
      peekTitle.textContent = title;
      peekText.textContent = title === text ? '' : text;
      peek.style.top = `${tick.offsetTop + tick.offsetHeight / 2}px`;
      peek.dataset.open = '';
    };
    tick.addEventListener('pointerenter', show);
    tick.addEventListener('focus', show);
    tick.addEventListener('click', () => block.scrollIntoView({ block: 'center', behavior: still.matches ? 'auto' : 'smooth' }));
    rail.append(tick);
    return tick;
  });
  const hide = () => delete peek.dataset.open;
  rail.addEventListener('pointerleave', hide);
  rail.addEventListener('focusout', (e) => rail.contains(e.relatedTarget as Node) || hide());

  // Current: the last block whose top has passed the middle of the viewport, where a press
  // centres its block, so the tick pressed is the tick marked. At the foot of the page the last
  // block can't reach the middle, so it is marked once nothing below it is left to scroll.
  let frame = 0;
  const mark = () => {
    frame = 0;
    const line = innerHeight / 2;
    let current = 0;
    blocks.forEach((b, i) => b.getBoundingClientRect().top <= line && (current = i));
    if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) current = blocks.length - 1;
    ticks.forEach((t, i) => (i === current ? t.setAttribute('aria-current', 'location') : t.removeAttribute('aria-current')));
  };
  addEventListener('scroll', () => (frame ||= requestAnimationFrame(mark)), { passive: true });
  mark();
}
