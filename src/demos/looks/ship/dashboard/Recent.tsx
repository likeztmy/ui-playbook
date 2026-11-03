import { ago, at, releases } from '../model';
import { PlaceLink } from '../PlaceLink';
import { Section } from '../Section';
import { freshness, hoursOf, lastChangeOf } from '../store';
import d from './Dashboard.module.scss';

/** What just happened: rows split by lines, each opening its release, the time in one right-aligned column. */
export function Recent() {
  // The five releases that changed last, newest first, from the same data as the table (LK#35), a
  // pause, resume or draft made here included: read on every render, as Ship re-renders on each change.
  const recent = [...releases].sort((a, b) => freshness(b) - freshness(a)).slice(0, 5);
  return (
    <Section title="Recent">
      <ul className={d.rows}>
        {recent.map((r) => {
          const { who, what } = lastChangeOf(r);
          return (
            <li key={r.id}>
              <PlaceLink className={d.grow} to={at('release', { release: r.id })}>
                <strong>{who}</strong> {what}
              </PlaceLink>
              <span className={d.when}>{ago(hoursOf(r))}</span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
