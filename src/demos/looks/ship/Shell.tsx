import { Bell, ChartColumn, Inbox, Package, Plus, Search, Settings } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '../../../ui/Button';
import s from './Shell.module.scss';

export type Section = 'dashboard' | 'releases' | 'settings';

const nav = [
  { id: 'dashboard', label: 'Dashboard', Icon: ChartColumn },
  { id: 'inbox', label: 'Inbox', Icon: Inbox, count: 3 },
  { id: 'releases', label: 'Releases', Icon: Package, count: 12 },
  { id: 'settings', label: 'Settings', Icon: Settings },
] as const;

const channels = [
  { label: 'iOS', count: 5 },
  { label: 'Android', count: 4 },
  { label: 'Web', count: 3 },
];

/** Ship's window: the sidebar, a header with the place and its actions, and the page. */
export function Shell({ section, place, actions, children }: { section: Section; place: ReactNode; actions?: ReactNode; children: ReactNode }) {
  return (
    <div className={s.shell}>
      <aside className={s.sidebar} aria-label="Ship">
        <div className={s.team}>
          <span className={s.logo} aria-hidden>
            S
          </span>
          Ship
        </div>
        <div className={s.search}>
          <Search size={16} aria-hidden />
          Search
          <kbd>⌘K</kbd>
        </div>
        <ul className={s.nav}>
          {nav.map(({ id, label, Icon, ...rest }) => (
            <li key={id}>
              <span className={s.item} aria-current={id === section ? 'page' : undefined}>
                <Icon size={16} aria-hidden />
                <span className={s.label}>{label}</span>
                {'count' in rest && <span className={s.count}>{rest.count}</span>}
              </span>
            </li>
          ))}
        </ul>
        <p className={s.heading}>Platforms</p>
        <ul className={s.nav}>
          {channels.map((c) => (
            <li key={c.label}>
              <span className={s.item}>
                <span className={s.dot} aria-hidden />
                <span className={s.label}>{c.label}</span>
                <span className={s.count}>{c.count}</span>
              </span>
            </li>
          ))}
        </ul>
      </aside>
      <div className={s.main}>
        <header className={s.header}>
          <div className={s.place}>{place}</div>
          <div className={s.actions}>
            {actions}
            <Button size="sm" variant="ghost" icon aria-label="Notifications">
              <Bell size={16} aria-hidden />
            </Button>
            <Button size="sm" variant="primary">
              <Plus size={16} aria-hidden /> New release
            </Button>
          </div>
        </header>
        <div className={s.page}>{children}</div>
      </div>
    </div>
  );
}
