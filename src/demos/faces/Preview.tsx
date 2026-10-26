import { Avatar } from '../post/Avatar';
import s from './faces.module.scss';

const ROWS: [string, number][] = [
  ['mira', 0.72],
  ['atlas', 0.56],
  ['daniel', 0.8],
  ['billing', 0.62],
];

/** The home page's card: one column of marks, people in circles and companies on grey squares. */
export function FacesPreview() {
  return (
    <div className={s.preview} aria-hidden>
      {ROWS.map(([id, w]) => (
        <div key={id} className={s.previewRow}>
          <Avatar id={id} size="sm" />
          <span style={{ width: `${w * 100}%` }} />
        </div>
      ))}
    </div>
  );
}
