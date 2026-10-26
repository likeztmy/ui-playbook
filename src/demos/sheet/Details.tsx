import { Button } from '../../ui/Button';
import { ALONG, STEPS, place } from './data';
import s from './sheet.module.scss';

type Props = {
  picked: string | null;
  /** The walk with a stop at Kettle & Crumb, and the way to add or drop it. */
  via?: boolean;
  onStop?: () => void;
  /** Everything along the way, longer than the sheet at half height. */
  long?: boolean;
};

/** What the sheet shows: the walk, or a café picked on the map. */
export function Details({ picked, via, onStop, long }: Props) {
  const p = place(picked);
  if (p)
    return (
      <div className={s.place} aria-live="polite">
        <p className={s.where}>{p.where}</p>
        <p className={s.hours} data-open={p.openThen ? '' : undefined}>
          {p.hours}
        </p>
      </div>
    );
  return (
    <>
      <p className={s.summary}>{via ? '21 min · 1.6 km · arrive 8:27' : '18 min · 1.4 km · arrive 8:24'}</p>
      <ol className={s.steps}>
        {STEPS.map((x) => (
          <li key={x.at}>
            <span className={s.at}>{x.at}</span>
            {x.what}
          </li>
        ))}
      </ol>
      {long && (
        <>
          <h3 className={s.listHead}>Along the way</h3>
          <ul className={s.along}>
            {ALONG.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </>
      )}
      {onStop && (
        <div className={s.stop}>
          <span>
            <b>Kettle &amp; Crumb</b>
            <span className={s.stopMeta}>3 min off your route</span>
          </span>
          <Button size="sm" onClick={onStop}>
            {via ? 'Remove stop' : 'Add stop'}
          </Button>
        </div>
      )}
    </>
  );
}
