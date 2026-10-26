import s from './reading.module.scss';

// A paragraph's lines, as fractions of the measure; the last one short.
const LINES = [1, 0.96, 1, 0.92, 0.58];

/** The home page's card: list rows set tight beside a paragraph set for reading. */
export function ReadingPreview() {
  return (
    <div className={s.preview} aria-hidden>
      <div className={s.previewRows}>
        {[0.7, 0.55, 0.8, 0.6].map((w, i) => (
          <span key={i} style={{ width: `${w * 100}%` }} />
        ))}
      </div>
      <div className={s.previewText}>
        {LINES.map((w, i) => (
          <span key={i} style={{ width: `${w * 100}%` }} />
        ))}
      </div>
    </div>
  );
}
