// Field guide's hand-drawn marks: the notes' arrows drawn with Rough.js, and RoughNotation
// circling what a note points at, drawn the first time it scrolls into view.
import rough from 'roughjs';
import { annotate } from 'rough-notation';

const still = matchMedia('(prefers-reduced-motion: reduce)');
const points = (list: string) => list.split(' ').map((p) => p.split(',').map(Number) as [number, number]);

// A fixed seed, so an arrow is the same stroke on every load.
const pen = { stroke: 'currentColor', strokeWidth: 1.75, roughness: 1.2, bowing: 1.5, seed: 7 };
for (const svg of document.querySelectorAll<SVGSVGElement>('[data-direction=field] svg[data-arrow]')) {
  const rc = rough.svg(svg);
  svg.replaceChildren(rc.curve(points(svg.dataset.arrow!), pen), rc.linearPath(points(svg.dataset.head!), pen));
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
if (demo && row) marks.push(stand(row, demo));

const seen = new IntersectionObserver(
  (entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      seen.unobserve(e.target);
      annotate(e.target as HTMLElement, {
        type: 'circle',
        color: 'currentColor',
        strokeWidth: 1.5,
        padding: e.target.classList.contains('mark-stand') ? [12, 24] : 8,
        animate: !still.matches,
        animationDuration: 600,
      }).show();
    }
  },
  // Mostly in view and clear of the bottom edge; a ratio of exactly 1 can miss by a sub-pixel.
  { threshold: 0.9, rootMargin: '0px 0px -15% 0px' },
);
for (const m of marks) seen.observe(m);
