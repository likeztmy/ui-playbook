import s from './Wall.module.scss';
import c from './Activity.module.scss';

const weeks = [3, 5, 2, 6, 4, 7, 5, 8];

/** Releases per week as bars: the accent on data. */
export function Activity() {
  const top = Math.max(...weeks);
  return (
    <section className={s.card} aria-label="Releases per week">
      <div className={s.head}>
        <h3>Releases per week</h3>
        <span className={s.meta}>Last 8 weeks</span>
      </div>
      <div className={c.chart} role="img" aria-label={`From ${weeks[0]} to ${weeks.at(-1)} a week`}>
        {weeks.map((n, i) => (
          <span key={i} className={c.bar} style={{ height: `${(n / top) * 100}%` }} data-last={i === weeks.length - 1 || undefined} />
        ))}
      </div>
      <div className={c.axis}>
        <span>Sep 8</span>
        <span>Oct 27</span>
      </div>
    </section>
  );
}
