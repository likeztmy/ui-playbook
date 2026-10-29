import s from './copy.module.scss';

/** The home page's card: a panel named for its task, its first field, its action. */
export function CopyPreview() {
  return (
    <div className={s.preview} aria-hidden>
      <span className={s.previewTitle}>New issue</span>
      <span className={s.previewLabel}>Title</span>
      <span className={s.previewBox} />
      <span className={s.previewButton}>Create issue</span>
    </div>
  );
}
