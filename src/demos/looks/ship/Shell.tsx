import { useEffect, useRef, type ReactNode } from 'react';
import { placeName } from './model';
import { useNav } from './nav';
import { Sidebar } from './Sidebar';
import s from './Shell.module.scss';

type ShellProps = {
  /** The header's name for the place; the place's own name when left out. */
  title?: ReactNode;
  /** The page's own actions, on the header row. */
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Ship's window: places on the left, the open place's name and actions above its page. As tall as its
 * parent, and only the sidebar's list and the page scroll (the app shell floor).
 */
export function Shell({ title, actions, children }: ShellProps) {
  const { current } = useNav();
  const name = placeName(current);
  // A new place opens at its top, as a new page does.
  const pane = useRef<HTMLDivElement>(null);
  const where = `${current.page}:${current.platform}:${current.release}`;
  useEffect(() => {
    if (pane.current) pane.current.scrollTop = 0;
  }, [where]);
  return (
    <div className={s.shell}>
      <Sidebar />
      <div className={s.main}>
        <header className={s.header}>
          <h2 className={s.title}>{title ?? name}</h2>
          {actions && <div className={s.actions}>{actions}</div>}
        </header>
        <div ref={pane} className={s.pane} data-pane role="region" aria-label={name} tabIndex={0}>
          {children}
        </div>
      </div>
    </div>
  );
}
