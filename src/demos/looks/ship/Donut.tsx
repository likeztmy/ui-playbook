import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import s from './Page.module.scss';
import c from './Charts.module.scss';

const parts = [
  { label: 'Passed', n: 41, tone: 'success', Icon: CircleCheck },
  { label: 'Failed', n: 6, tone: 'danger', Icon: CircleX },
  { label: 'Running', n: 3, tone: 'warning', Icon: LoaderCircle },
] as const;

/** Check outcomes: status colours, each with its icon and word in the legend. */
export function Donut() {
  const total = parts.reduce((a, p) => a + p.n, 0);
  let at = 0;
  const stops = parts.map((p) => {
    const from = at;
    at += (p.n / total) * 100;
    return `var(--${p.tone}) ${from}% calc(${at}% - 1%), transparent calc(${at}% - 1%) ${at}%`;
  });
  return (
    <section className={s.card} aria-label="Checks this week">
      <div className={s.head}>
        <h3>Checks this week</h3>
        <span className={s.meta}>{total} runs</span>
      </div>
      <div className={c.donutRow}>
        <div
          className={c.donut}
          style={{ background: `conic-gradient(${stops.join(', ')})` }}
          role="img"
          aria-label={parts.map((p) => `${p.n} ${p.label.toLowerCase()}`).join(', ')}
        >
          <span>{Math.round((parts[0].n / total) * 100)}%</span>
        </div>
        <ul className={c.legend}>
          {parts.map(({ label, n, tone, Icon }) => (
            <li key={label}>
              <Icon size={16} style={{ color: `var(--${tone})` }} aria-hidden />
              <span>{label}</span>
              <span className={c.n}>{n}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
