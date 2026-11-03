import { useState } from 'react';
import { Section } from '../Section';
import c from './Charts.module.scss';
import { dayLabel, type Span } from './span';

// Thirty days of crash-free sessions; the range shows the last 7, 14 or 30.
const ALL = [
  99.55, 99.58, 99.52, 99.6, 99.57, 99.62, 99.59, 99.63, 99.6, 99.58, 99.62, 99.65, 99.6, 99.63, 99.59, 99.62, 99.61, 99.66, 99.64, 99.7, 99.72,
  99.69, 99.75, 99.78, 99.74, 99.8, 99.79, 99.83, 99.81, 99.82,
];
const [lo, hi] = [99.5, 99.9];
const W = 300;
const H = 100;
const y = (v: number) => H - ((v - lo) / (hi - lo)) * H;

/** Crash-free sessions over the range: a 2px line with a crosshair that reads the nearest day. */
export function Line({ span, className }: { span: Span; className?: string }) {
  const [hot, setHot] = useState<number | null>(null);
  const points = ALL.slice(-span);
  const label = (i: number) => dayLabel(i, span);
  const x = (i: number) => (i / (points.length - 1)) * W;
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    setHot(Math.round(((e.clientX - box.left) / box.width) * (points.length - 1)));
  };
  return (
    <Section title="Crash-free sessions" meta={hot == null ? `${points.at(-1)}% today` : `${label(hot)}: ${points[hot]}%`} className={className}>
      <svg
        className={c.line}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        role="img"
        aria-label={`From ${points[0]}% to ${points.at(-1)}%`}
        onPointerMove={move}
        onPointerLeave={() => setHot(null)}
      >
        {[0.25, 0.5, 0.75].map((f) => (
          <line key={f} className={c.grid} x1={0} x2={W} y1={H * f} y2={H * f} />
        ))}
        <polyline className={c.path} points={points.map((v, i) => `${x(i)},${y(v)}`).join(' ')} />
        {hot != null && <line className={c.cross} x1={x(hot)} x2={x(hot)} y1={0} y2={H} />}
      </svg>
      <div className={c.axis}>
        <span>{label(0)}</span>
        <span>
          {hi}% top, {lo}% bottom
        </span>
        <span>{label(points.length - 1)}</span>
      </div>
    </Section>
  );
}
