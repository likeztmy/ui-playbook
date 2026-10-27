import type { Status } from './model';
import s from './icons.module.scss';

// How far along, as a ring of four steps lighting up from twelve o'clock: read by shape, so no colour
// is spent on it. Waiting work is a faint ring, dashed while it isn't planned yet; done is a solid disc.
const LIT: Record<Status, number> = { backlog: 0, todo: 0, progress: 2, review: 3, done: 4 };

const R = 5.25;
const GAP = 14; // degrees cut from each end of a quarter, so the four read as steps

/** A quarter of the ring, the `i`th clockwise from twelve. */
function step(i: number) {
  const point = (deg: number) => {
    const a = (deg * Math.PI) / 180;
    return `${(7 + R * Math.sin(a)).toFixed(2)} ${(7 - R * Math.cos(a)).toFixed(2)}`;
  };
  return `M${point(i * 90 + GAP)} A${R} ${R} 0 0 1 ${point((i + 1) * 90 - GAP)}`;
}

export function StatusIcon({ status }: { status: Status }) {
  const lit = LIT[status];
  return (
    <svg className={s.status} data-status={status} width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      {status === 'done' ? (
        <>
          <circle cx="7" cy="7" r="6.25" fill="currentColor" />
          <path d="M4.4 7.2 6.2 9 9.6 5.4" fill="none" stroke="var(--surface)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : lit === 0 ? (
        <circle cx="7" cy="7" r={R} fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray={status === 'backlog' ? '1.6 2.1' : undefined} strokeLinecap="round" />
      ) : (
        [0, 1, 2, 3].map((i) => <path key={i} d={step(i)} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity={i < lit ? 1 : 0.4} />)
      )}
    </svg>
  );
}
