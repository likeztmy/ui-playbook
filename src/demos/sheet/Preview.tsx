import s from './sheet.module.scss';

/** The home page's card: a map with the walk, half covered by a sheet. */
export function SheetPreview() {
  return (
    <div className={s.preview} aria-hidden>
      <i />
      <span />
    </div>
  );
}
