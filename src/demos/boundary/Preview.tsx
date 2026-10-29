import s from './boundary.module.scss';

/** The home page's card: two sections held by their headings, one group of rows with lines between. */
export function BoundaryPreview() {
  return (
    <div className={s.preview} aria-hidden>
      <span className={s.previewHead}>General</span>
      <span className={s.previewBar} style={{ width: '80%' }} />
      <span className={s.previewBar} style={{ width: '56%' }} />
      <span className={s.previewHead}>Access</span>
      <span className={s.previewGroup}>
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}
