import { Coffee } from 'lucide-react';
import { PLACES, ROUTE, VIA } from './data';
import s from './sheet.module.scss';

const STREETS = [
  'M0 96H340',
  'M0 176H340',
  'M0 128H340',
  'M0 300H340',
  'M0 400H340',
  'M60 0V520',
  'M150 0V520',
  'M262 0V520',
  'M0 236L340 236',
];

type Props = {
  picked: string | null;
  onPick: (id: string) => void;
  /** The walk goes by way of Kettle & Crumb. */
  via?: boolean;
};

/** The map behind the sheet: streets, the walk in the accent, and the two cafés as buttons. */
export function Map({ picked, onPick, via }: Props) {
  return (
    <div className={s.map}>
      <div className={s.canvas}>
        <svg viewBox="0 0 340 520" width="340" height="520" aria-hidden>
          <path className={s.water} d="M210 0H340V40C300 52 262 44 230 30Z" />
          <rect className={s.park} x="72" y="190" width="66" height="34" rx="6" />
          <rect className={s.park} x="168" y="320" width="80" height="64" rx="6" />
          {STREETS.map((d) => (
            <path key={d} className={s.street} d={d} />
          ))}
          <polyline className={s.route} points={(via ? VIA : ROUTE).map((p) => p.join(',')).join(' ')} />
          <circle className={s.home} cx={ROUTE[0][0]} cy={ROUTE[0][1]} r="6" />
          <circle className={s.terminal} cx={ROUTE.at(-1)![0]} cy={ROUTE.at(-1)![1]} r="6" />
        </svg>
        <span className={s.ferry} style={{ left: ROUTE.at(-1)![0] + 10, top: ROUTE.at(-1)![1] - 9 }}>
          Ferry
        </span>
        {PLACES.map((p) => (
          <button
            key={p.id}
            type="button"
            className={s.pin}
            style={{ left: p.x, top: p.y }}
            aria-label={p.name}
            aria-pressed={picked === p.id}
            onClick={() => onPick(p.id)}
          >
            <Coffee size={14} strokeWidth={2} aria-hidden />
          </button>
        ))}
      </div>
    </div>
  );
}
