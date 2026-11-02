import { useState } from 'react';
import s from './Page.module.scss';
import c from './Charts.module.scss';

const days = [4, 6, 3, 7, 5, 2, 1, 6, 8, 5, 7, 9, 3, 2];
const label = (i: number) => new Date(2026, 9, 20 + i).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

/** Releases a day: one series, so one colour and no legend; hovering a bar reads it out. */
export function Bars() {
  const [hot, setHot] = useState<number | null>(null);
  const top = Math.max(...days);
  return (
    <section className={s.card} aria-label="Releases a day">
      <div className={s.head}>
        <h3>Releases a day</h3>
        <span className={s.meta} aria-live="polite">
          {hot == null ? `${days.reduce((a, b) => a + b)} in 14 days` : `${label(hot)}: ${days[hot]}`}
        </span>
      </div>
      <div className={c.bars} role="img" aria-label={`Between ${Math.min(...days)} and ${top} a day`} onPointerLeave={() => setHot(null)}>
        {days.map((n, i) => (
          <span key={i} className={c.slot} onPointerEnter={() => setHot(i)}>
            <span className={c.bar} style={{ height: `${(n / top) * 100}%` }} data-hot={hot === i || undefined} />
          </span>
        ))}
      </div>
      <div className={c.axis}>
        <span>{label(0)}</span>
        <span>{label(days.length - 1)}</span>
      </div>
    </section>
  );
}
