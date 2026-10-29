import { NAV } from './data';
import s from './icon.module.scss';

/** The home page's card: three places of a sidebar, each icon beside its word. */
export function IconPreview() {
  return (
    <div className={s.preview} aria-hidden>
      {NAV.slice(0, 3).map(([label, Icon], i) => (
        <span key={label} className={s.navItem} data-selected={i === 1 || undefined}>
          <Icon size={16} />
          {label}
        </span>
      ))}
    </div>
  );
}
