import { ChartColumn, ChevronDown, Package, Plus, type LucideIcon } from 'lucide-react';
import { useEffect, useId, useRef, type MouseEvent, type ReactNode } from 'react';
import { Button } from '../../../ui/Button';
import { Menu } from '../../../ui/Menu';
import { count, PLATFORMS, placeName, samePlace, type Place } from './model';
import s from './Shell.module.scss';

/** How Ship moves between its places: each is a link with its own address, swapped in place on a plain click. */
export type Nav = { current: Place; href: (to: Place) => string; go: (to: Place) => void };

type Row = { to: Place; label: string; Icon?: LucideIcon; count?: number };
const MAIN: Row[] = [
  { to: { page: 'dashboard', platform: 'any' }, label: 'Dashboard', Icon: ChartColumn },
  { to: { page: 'releases', platform: 'any' }, label: 'Releases', Icon: Package, count: count('any') },
];
const BY_PLATFORM: Row[] = PLATFORMS.map((p) => ({ to: { page: 'releases', platform: p }, label: p, count: count(p) }));
const key = (p: Place) => `${p.page}:${p.platform}`;

/** A plain left click stays in the page; a modified one (new tab, new window) is the browser's. */
export function follow(e: MouseEvent, go: () => void) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  go();
}

type ShellProps = {
  nav: Nav;
  /** Beside New release on the header row. */
  actions?: ReactNode;
  /**
   * `window`: Ship fills its parent and each pane scrolls on its own, as an app does.
   * `content`: as tall as the page in it, for a figure that shows the whole screen.
   */
  fit: 'window' | 'content';
  /** The scrolling pane, for a gallery that keeps two Ships' panes in step. */
  onPane?: (el: HTMLDivElement | null) => void;
  children: ReactNode;
};

/** Ship's window: places on the left, the open place's name and actions above its page. */
export function Shell({ nav, actions, fit, onPane, children }: ShellProps) {
  const name = placeName(nav.current);
  const platforms = useId();
  // A new place opens at its top, as a new page does.
  const pane = useRef<HTMLDivElement | null>(null);
  const at = key(nav.current);
  useEffect(() => {
    if (pane.current) pane.current.scrollTop = 0;
  }, [at]);
  const link = ({ to, label, Icon, count: n }: Row) => (
    <li key={key(to)}>
      <a
        className={s.item}
        href={nav.href(to)}
        aria-current={samePlace(to, nav.current) ? 'page' : undefined}
        onClick={(e) => follow(e, () => nav.go(to))}
      >
        <span className={s.icon}>{Icon && <Icon size={16} aria-hidden />}</span>
        <span className={s.label}>{label}</span>
        {n !== undefined && <span className={s.count}>{n}</span>}
      </a>
    </li>
  );
  const window = fit === 'window';
  return (
    <div className={s.shell} data-fit={fit}>
      <nav className={s.sidebar} aria-label="Ship">
        <div className={s.scroll}>
          <span className={s.name}>Ship</span>
          <ul className={s.list}>{MAIN.map(link)}</ul>
          <p className={s.heading} id={platforms}>
            Platforms
          </p>
          <ul className={s.list} aria-labelledby={platforms}>
            {BY_PLATFORM.map(link)}
          </ul>
        </div>
        <div className={s.foot}>
          <span className={s.face} aria-hidden>
            MC
          </span>
          Mira Chen
        </div>
      </nav>
      <div className={s.main}>
        <header className={s.header}>
          <h2 className={s.title}>
            <span className={s.wide}>{name}</span>
            {/* Narrow: the sidebar is gone, so the place's name opens the places, as Post's folder menu does. */}
            <Menu.Root>
              <Menu.Trigger render={<Button variant="ghost" className={s.places} />}>
                {name}
                <ChevronDown size={16} aria-hidden />
              </Menu.Trigger>
              <Menu.Popup>
                <Menu.RadioGroup
                  value={key(nav.current)}
                  onValueChange={(v) => {
                    const row = [...MAIN, ...BY_PLATFORM].find((r) => key(r.to) === v);
                    if (row) nav.go(row.to);
                  }}
                >
                  {MAIN.map((r) => (
                    <Menu.RadioItem key={key(r.to)} value={key(r.to)} detail={r.count}>
                      {r.label}
                    </Menu.RadioItem>
                  ))}
                </Menu.RadioGroup>
                <Menu.Separator />
                <Menu.Group>
                  <Menu.Label>Platforms</Menu.Label>
                  <Menu.RadioGroup
                    value={key(nav.current)}
                    onValueChange={(v) => {
                      const row = BY_PLATFORM.find((r) => key(r.to) === v);
                      if (row) nav.go(row.to);
                    }}
                  >
                    {BY_PLATFORM.map((r) => (
                      <Menu.RadioItem key={key(r.to)} value={key(r.to)} detail={r.count}>
                        {r.label}
                      </Menu.RadioItem>
                    ))}
                  </Menu.RadioGroup>
                </Menu.Group>
              </Menu.Popup>
            </Menu.Root>
          </h2>
          <div className={s.actions}>
            {actions}
            <Button size="sm" variant="primary">
              <Plus size={16} aria-hidden /> New release
            </Button>
          </div>
        </header>
        <div
          ref={(el) => {
            pane.current = el;
            onPane?.(el);
          }}
          className={s.pane}
          data-pane
          role={window ? 'region' : undefined}
          aria-label={window ? name : undefined}
          tabIndex={window ? 0 : undefined}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
