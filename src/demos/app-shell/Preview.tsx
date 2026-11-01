import s from './app-shell.module.scss';

/** The home page's card: a still sidebar beside a page that runs past the bottom. */
export function AppShellPreview() {
  return (
    <div className={s.preview} aria-hidden>
      <span />
      <i />
    </div>
  );
}
