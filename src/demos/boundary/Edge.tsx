import { cx } from '../../ui/cx';
import { Compare } from '../shell';
import { PREFS } from './data';
import s from './boundary.module.scss';

/** Three groups of preferences; `boxMiddle` puts the second in a box of its own. */
function Prefs({ boxMiddle }: { boxMiddle?: boolean }) {
  return (
    <div className={s.prefs}>
      {PREFS.map((g, i) => (
        <section key={g.title} className={cx(s.pref, boxMiddle && i === 1 && s.prefBoxed)}>
          <h4 className={s.heading}>{g.title}</h4>
          {g.rows.map(([label, value]) => (
            <div key={label} className={s.prefRow}>
              <span>{label}</span>
              <span className={s.muted}>{value}</span>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

export function BoundaryEdge() {
  return (
    <Compare
      height={300}
      beforeLabel="One group boxed"
      afterLabel="All on the page’s edge"
      before={<Prefs boxMiddle />}
      after={<Prefs />}
      beforeNote="The box’s padding moves its labels and values in from the page’s edges, so Notifications no longer lines up with the groups above and below it. It now reads as a different kind of thing."
      afterNote="Three groups of one kind, held apart by their headings and space, on one left edge and one right edge."
    />
  );
}
