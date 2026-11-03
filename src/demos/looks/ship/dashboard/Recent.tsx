import { ago, at, hoursAgo, lastChange, releases } from '../model';
import { PlaceLink } from '../PlaceLink';
import { Section } from '../Section';
import d from './Dashboard.module.scss';

// The five releases that changed last, newest first, from the same data as the table (LK#35).
const recent = [...releases].sort((a, b) => hoursAgo(a) - hoursAgo(b)).slice(0, 5);

/** What just happened: rows split by lines, each opening its release, the time in one right-aligned column. */
export function Recent() {
  return (
    <Section title="Recent">
      <ul className={d.rows}>
        {recent.map((r) => {
          const { who, what } = lastChange(r);
          return (
            <li key={r.id}>
              <PlaceLink className={d.grow} to={at('release', { release: r.id })}>
                <strong>{who}</strong> {what}
              </PlaceLink>
              <span className={d.when}>{ago(hoursAgo(r))}</span>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
