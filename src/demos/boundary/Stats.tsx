import { cx } from '../../ui/cx';
import { Compare } from '../shell';
import { STATS } from './data';
import s from './boundary.module.scss';

/** A project overview's figures: three tiles, or one row split by hairlines. */
function Figures({ tiles }: { tiles?: boolean }) {
  return (
    <dl className={cx(s.figures, tiles && s.tiles)}>
      {STATS.map(([label, value]) => (
        <div key={label} className={s.figure}>
          <dt className={s.muted}>{label}</dt>
          <dd className={s.value}>{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function BoundaryStats() {
  return (
    <Compare
      height={180}
      beforeLabel="Three equal tiles"
      afterLabel="One row of figures"
      before={<Figures tiles />}
      after={<Figures />}
      beforeNote="Three agents’ overviews, one of them with the playbook: a tile per figure, in a grid of equal columns. Three edges for three numbers that are read together."
      afterNote="One surface and a line between figures, as another build of the same task did. The row reads across, and the page has one region where it had three."
    />
  );
}
