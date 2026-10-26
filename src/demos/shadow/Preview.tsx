import { Lifted } from './Lifted';
import s from './shadow.module.scss';

/** The home page's card: three steps of height, each by a longer drop at the same darkness. */
export function ShadowPreview() {
  return (
    <div className={s.preview} aria-hidden>
      {[1, 3, 6].map((y) => (
        <Lifted key={y} label={`${y}px`} shadow={`0 0 0 1px oklch(0.3 0.01 75 / 0.08), 0 ${y}px ${y * 2}px oklch(0.3 0.01 75 / 0.12)`} />
      ))}
    </div>
  );
}
