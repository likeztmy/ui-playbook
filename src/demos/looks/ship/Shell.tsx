import { Archive } from 'lucide-react';
import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../../../ui/Button';
import { placeName } from './model';
import { useNav } from './nav';
import { Sidebar } from './Sidebar';
import { isArchived, setArchived } from './store';
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
 * parent, and only the sidebar's list and the page scroll (the app shell floor). An archived project says so
 * across the top of the window, on every page: a flat row in the window's own voice, with no close, since
 * it is a state and not news (app shell, where the eye goes).
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
  const archived = isArchived();
  // Unarchive takes its own button away, so focus goes on to the page.
  const restore = () => {
    setArchived(false);
    requestAnimationFrame(() => pane.current?.focus({ preventScroll: true }));
  };
  return (
    <div className={s.shell} data-archived={archived || undefined}>
      {archived && (
        <div className={s.archived}>
          <Archive size={16} aria-hidden />
          <span className={s.archivedText}>This project is archived: it’s read-only and its rollouts are paused.</span>
          {/* On Settings the danger zone holds the way back, so it is offered once. */}
          {current.page !== 'settings' && (
            <Button size="sm" onClick={restore}>
              Unarchive project
            </Button>
          )}
        </div>
      )}
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
