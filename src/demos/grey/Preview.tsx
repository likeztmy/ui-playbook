import s from './grey.module.scss';

const ROWS = [0.78, 0.6, 0.84, 0.66, 0.72];
const LATE = 2;

/** The home page's card: grey rows with one red mark, found before it's looked for. */
export function GreyPreview() {
  return (
    <div className={s.preview} aria-hidden>
      {ROWS.map((w, i) => (
        <div key={i} className={s.previewRow}>
          <span style={{ width: `${w * 100}%` }} />
          <span data-late={i === LATE ? '' : undefined} />
        </div>
      ))}
    </div>
  );
}
