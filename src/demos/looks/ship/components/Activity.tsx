import { Section } from '../Section';
import a from './Activity.module.scss';

const weeks = [3, 5, 2, 6, 4, 7, 5, 8];

/** Releases a week as bars: the accent on data, the latest week full strength. */
export function Activity() {
  const top = Math.max(...weeks);
  return (
    <Section title="Releases a week" meta="Last 8 weeks">
      <div className={a.chart} role="img" aria-label={`From ${weeks[0]} to ${weeks.at(-1)} a week`}>
        {weeks.map((n, i) => (
          <span key={i} className={a.bar} style={{ height: `${(n / top) * 100}%` }} data-last={i === weeks.length - 1 || undefined} />
        ))}
      </div>
      <div className={a.axis}>
        <span>Sep 8</span>
        <span>Oct 27</span>
      </div>
    </Section>
  );
}
