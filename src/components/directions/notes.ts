// Field guide's hand-drawn marks: each note's arrow drawn with Rough.js from the note to what it
// points at, and RoughNotation circling that, drawn the first time it scrolls into view.
import rough from 'roughjs';
import { annotate } from 'rough-notation';

const still = matchMedia('(prefers-reduced-motion: reduce)');

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

// Where each arrow starts and ends, from the note's and the target's boxes: it leaves the note's
// near edge and stops a step short of the circle drawn round the target.
const ends = (note: DOMRect, target: DOMRect): [Point, Point, number] =>
  note.bottom < target.top
    ? // Above: down from the note's left end to the top of the circle.
      [[note.left + 12, note.bottom + 6], [target.left + target.width / 2 + 8, target.top - 22], -0.25]
    : // Beside: left from the note's start to the right of the circle.
      [[note.left - 8, note.top + note.height / 2], [target.right + 18, target.top + target.height / 2], 0.3];

for (const canvas of document.querySelectorAll<HTMLElement>('[data-direction=field] [data-canvas]')) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('note-arrows');
  svg.setAttribute('aria-hidden', 'true');
  canvas.append(svg);
  const rc = rough.svg(svg);
  const notes = [...canvas.querySelectorAll<HTMLElement>('[data-note]')];
  const draw = () => {
    const c = canvas.getBoundingClientRect();
    const local = (r: DOMRect) => new DOMRect(r.x - c.x, r.y - c.y, r.width, r.height);
    svg.replaceChildren(
      ...notes.flatMap((note) => {
        const target = canvas.querySelector(note.dataset.note!);
        return target ? arrow(rc, ...ends(local(note.getBoundingClientRect()), local(target.getBoundingClientRect()))) : [];
      }),
    );
  };
  const watch = new ResizeObserver(draw);
  for (const el of [canvas, ...notes]) watch.observe(el);
  document.fonts.ready.then(draw);
}

// RoughNotation draws its SVG beside the element it marks. A switch row belongs to a React island,
// so it gets a stand-in box in the demo's own wrapper instead, kept over the row as it resizes.
const stand = (row: HTMLElement, host: HTMLElement) => {
  const box = document.createElement('span');
  box.className = 'mark-stand';
  host.append(box);
  const place = () => {
    const r = row.getBoundingClientRect();
    const h = host.getBoundingClientRect();
    Object.assign(box.style, { left: `${r.left - h.left}px`, top: `${r.top - h.top}px`, width: `${r.width}px`, height: `${r.height}px` });
  };
  place();
  new ResizeObserver(place).observe(host);
  return box;
};

const marks: HTMLElement[] = [...document.querySelectorAll<HTMLElement>('[data-direction=field] [data-mark]')];
const demo = document.querySelector<HTMLElement>('[data-direction=field] [data-part=demo]');
const row = demo?.querySelector<HTMLElement>('[class*=_switches_] > :first-child');
// Each mark stays until the reader does what it points at: the switch's circle goes on its first flip.
const done = new Map<Element, () => void>();
if (demo && row) {
  const box = stand(row, demo);
  marks.push(box);
  row.addEventListener(
    'click',
    () => {
      // Drawn already: fade it. Not yet: leave a no-op, so it is never drawn.
      const fade = done.get(box);
      if (fade) fade();
      else done.set(box, () => {});
    },
    { once: true },
  );
}

const seen = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      seen.unobserve(e.target);
      if (done.has(e.target)) continue;
      const mark = annotate(e.target as HTMLElement, {
        type: 'circle',
        color: 'currentColor',
        strokeWidth: 1.5,
        padding: e.target.classList.contains('mark-stand') ? [14, 34] : 8,
        animate: !still.matches,
        animationDuration: 600,
      });
      mark.show();
      const svg = e.target.nextElementSibling as SVGElement;
      done.set(e.target, () => {
        if (still.matches) return mark.remove();
        svg.style.transition = 'opacity 300ms ease-out';
        svg.style.opacity = '0';
        svg.addEventListener('transitionend', () => mark.remove(), { once: true });
      });
    }
  },
  // Mostly in view and clear of the bottom edge; a ratio of exactly 1 can miss by a sub-pixel.
  { threshold: 0.9, rootMargin: '0px 0px -15% 0px' },
);
for (const m of marks) seen.observe(m);
