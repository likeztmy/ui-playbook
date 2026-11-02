import { Check, LoaderCircle } from 'lucide-react';
import { cx } from '../../ui/cx';
import { AIRLINES } from './Labor';
import s from './wait.module.scss';

/** The flight search mid-way, held still. */
export function WaitPreview() {
  return (
    <div className={cx(s.waitFlights, s.waitStill)} aria-hidden>
      <div className={s.waitChecks}>
        {AIRLINES.slice(0, 4).map((a, i) => (
          <span key={a} className={s.waitCheck} data-state={i < 2 ? 'done' : i === 2 ? 'now' : undefined}>
            {i < 2 ? <Check size={16} aria-hidden /> : i === 2 ? <LoaderCircle size={16} aria-hidden /> : <span className={s.waitDot} />}
            {i < 2 ? `Checked ${a}` : `Checking ${a}`}
          </span>
        ))}
      </div>
    </div>
  );
}
