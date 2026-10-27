// Note.astro's marks: an arrow drawn with Rough.js from the note to its control, measured from
// their boxes, and a RoughNotation circle round the control, drawn the first time it scrolls into
// view and faded once the reader uses what the note wraps.
import rough from 'roughjs';
import { annotate } from 'rough-notation';

const still = matchMedia('(prefers-reduced-motion: reduce)');
const wide = matchMedia('(min-width: 1181px)');

type Point = [number, number];
// A fixed seed, so an arrow is the same stroke on every load.
const pen = { stroke: 'currentColor', strokeWidth: 1.75, roughness: 0.9, bowing: 0.8, seed: 7 };

// One arrow: a quadratic arc bowed `bend` (a share of its length) off the straight line, and a
// head of two short strokes along the arc's last stretch.
const arrow = (rc: ReturnType<typeof rough.svg>, from: Point, to: Point, bend: number) => {
  const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
  const c: Point = [from[0] + dx / 2 - dy * bend, from[1] + dy / 2 + dx * bend];
  const angle = Math.atan2(to[1] - c[1], to[0] - c[0]);
  const barb = (turn: number): Point => [to[0] - 10 * Math.cos(angle + turn), to[1] - 10 * Math.sin(angle + turn)];
  return [rc.path(`M${from} Q${c} ${to}`, pen), rc.linearPath([barb(0.5), to, barb(-0.5)], pen)];
};

// Where the arrow starts and ends, from the note's and the control's boxes: it leaves the note's
// near edge and stops a step short of the circle round the control.
const ends = (note: DOMRect, target: DOMRect): [Point, Point, number] =>
  note.bottom < target.top && note.left < target.right && note.right > target.left
    ? // Above: down from the note's left end to the top of the circle.
      [[note.left + 12, note.bottom + 6], [target.left + target.width / 2 + 8, target.top - 22], -0.25]
    : // Beside: from the note's start to the near side of the circle.
      note.left > target.right
      ? [[note.left - 8, note.top + note.height / 2], [target.right + 18, target.top + target.height / 2], 0.3]
      : [[note.right + 8, note.top + note.height / 2], [target.left - 18, target.top + target.height / 2], -0.3];

const seen = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      seen.unobserve(e.target);
      (e.target as HTMLElement).dispatchEvent(new Event('note:seen'));
    }
  },
  // Mostly in view and clear of the bottom edge; a ratio of exactly 1 can miss by a sub-pixel.
  { threshold: 0.9, rootMargin: '0px 0px -15% 0px' },
);

for (const wrap of document.querySelectorAll<HTMLElement>('[data-noted]')) {
  const note = wrap.querySelector<HTMLElement>(':scope > [data-note]')!;
  const target = wrap.querySelector<HTMLElement>(note.dataset.note!);
  if (!target) continue;

  const box = (r: DOMRect) => {
    const w = wrap.getBoundingClientRect();
    return new DOMRect(r.x - w.x, r.y - w.y, r.width, r.height);
  };

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('note-arrows');
  svg.setAttribute('aria-hidden', 'true');
  wrap.append(svg);
  const rc = rough.svg(svg);

  const stand = document.createElement('span');
  stand.className = 'mark-stand';
  wrap.append(stand);

  const place = () => {
    const t = box(target.getBoundingClientRect());
    Object.assign(stand.style, { left: `${t.x}px`, top: `${t.y}px`, width: `${t.width}px`, height: `${t.height}px` });
    svg.replaceChildren(...(wide.matches ? arrow(rc, ...ends(box(note.getBoundingClientRect()), t)) : []));
  };
  const watch = new ResizeObserver(place);
  for (const el of [wrap, note, target]) watch.observe(el);
  document.fonts.ready.then(place);

  // The circle: drawn on first sight, unless the control was used first; faded on first use.
  let fade: (() => void) | undefined;
  let used = false;
  stand.addEventListener('note:seen', () => {
    if (used) return;
    const mark = annotate(stand, {
      type: 'circle',
      padding: [12, 20],
      color: 'currentColor',
      strokeWidth: 1.5,
      animate: !still.matches,
      animationDuration: 600,
    });
    mark.show();
    const drawn = stand.nextElementSibling as SVGElement;
    fade = () => {
      if (still.matches) return mark.remove();
      drawn.style.transition = 'opacity 300ms ease-out';
      drawn.style.opacity = '0';
      drawn.addEventListener('transitionend', () => mark.remove(), { once: true });
    };
  });
  // Used: a press or an edit anywhere in what the note wraps, or focus landing in a text field,
  // which is how a shortcut like "/" uses a search field without a click.
  const use = (e: Event) => {
    if (e.type === 'focusin' && !(e.target as Element).matches('input, textarea')) return;
    used = true;
    fade?.();
    for (const type of ['click', 'input', 'focusin']) wrap.removeEventListener(type, use);
  };
  for (const type of ['click', 'input', 'focusin']) wrap.addEventListener(type, use);
  seen.observe(stand);
}
