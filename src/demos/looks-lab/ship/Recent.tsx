import { Section } from './Section';
import d from './Dashboard.module.scss';

// Newest first, in one unit (LK#35: the old list ran 2h, 1d, 1d, 4d, 5h).
const recent = [
  ['Mira Chen', 'raised 4.2.0 iOS to 25%', '2h'],
  ['Ship', 'finished checks on 4.2.0', '5h'],
  ['Jonas Berg', 'halted 4.1.3 Android', '1d'],
  ['Ada Okafor', 'shipped 2026.44 to the web', '1d'],
  ['Sam Rivera', 'opened 4.3.0 Widgets', '4d'],
];

/** What just happened: rows split by lines, the time in one right-aligned column. */
export function Recent() {
  return (
    <Section title="Recent">
      <ul className={d.rows}>
        {recent.map(([who, what, when]) => (
          <li key={what}>
            <span className={d.grow}>
              <strong>{who}</strong> {what}
            </span>
            <span className={d.when}>{when}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
