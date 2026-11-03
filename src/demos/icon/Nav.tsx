import { Button } from '../../ui/Button';
import { TipGroup } from '../../ui/Tooltip';
import { cx } from '../../ui/cx';
import { NAV } from './data';
import s from './icon.module.scss';

/** The sidebar: icon and word, or (`rail`) the icons alone, each naming itself in a tooltip. */
export function Nav({ rail, selected = 'My issues' }: { rail?: boolean; selected?: string }) {
  if (rail)
    return (
      <nav className={cx(s.nav, s.rail)} aria-label="Workspace">
        <TipGroup>
          {NAV.map(([label, Icon]) => (
            <Button key={label} variant="ghost" icon label={label} className={s.railItem} data-selected={label === selected || undefined}>
              <Icon size={16} aria-hidden />
            </Button>
          ))}
        </TipGroup>
      </nav>
    );
  return (
    <nav className={s.nav} aria-label="Workspace">
      {NAV.map(([label, Icon]) => (
        <a key={label} href="#" className={s.navItem} aria-current={label === selected ? 'page' : undefined} onClick={(e) => e.preventDefault()}>
          <Icon size={14} aria-hidden />
          {label}
        </a>
      ))}
    </nav>
  );
}
