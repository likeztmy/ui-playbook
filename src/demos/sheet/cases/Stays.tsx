import type { Stay } from './places';
import c from './cases.module.scss';

/** A results list: the count, then each place and its price. */
export function Stays({ stays }: { stays: Stay[] }) {
  return (
    <div className={c.page}>
      <p className={c.count} aria-live="polite">
        {stays.length} places to stay
      </p>
      {stays.map((x) => (
        <div key={x.name} className={c.row}>
          <span>{x.name}</span>
          <span className={c.meta}>£{x.price}</span>
        </div>
      ))}
    </div>
  );
}
