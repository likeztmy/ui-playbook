import s from './novelty.module.scss';

// Bars as long as each event takes: many short ones, then the one long one that's rare.
const BARS = [0.18, 0.18, 0.18, 0.18, 0.18, 0.18, 0.18, 0.18, 0.8];

/** The home page's card: a row of brief marks and one long one. */
export function NoveltyPreview() {
  return (
    <div className={s.preview} aria-hidden>
      {BARS.map((h, i) => (
        <span key={i} style={{ height: `${h * 100}%` }} data-rare={h > 0.5 ? '' : undefined} />
      ))}
    </div>
  );
}
