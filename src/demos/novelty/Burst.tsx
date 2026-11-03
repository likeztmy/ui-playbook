import type { CSSProperties } from 'react';
import s from './novelty.module.scss';

const PIECES = 14;
// Content colours, clear of the accent's and the statuses' hues: decoration says nothing went right or wrong.
const HUES = ['oklch(0.72 0.17 345)', 'oklch(0.74 0.12 205)', 'oklch(0.86 0.15 105)'];

/** Confetti from a point: pieces thrown out evenly, each spinning as it falls. Remount it to throw again. */
export function Burst({ big }: { big?: boolean }) {
  const reach = big ? 120 : 48;
  return (
    <span className={s.burst} data-big={big ? '' : undefined} aria-hidden>
      {Array.from({ length: PIECES }, (_, i) => {
        const a = (i / PIECES) * Math.PI * 2;
        const r = reach * (0.6 + ((i * 7) % 5) / 10);
        return (
          <span
            key={i}
            style={{ '--x': `${Math.cos(a) * r}px`, '--y': `${Math.sin(a) * r}px`, '--turn': `${(i % 2 ? 1 : -1) * 240}deg`, background: HUES[i % HUES.length] } as CSSProperties}
          />
        );
      })}
    </span>
  );
}
