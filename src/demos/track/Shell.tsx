import { Plus } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { flushSync } from 'react-dom';
import { Button } from '../../ui/Button';
import { ToastProvider } from '../../ui/Toast';
import { Board } from './Board';
import { CommandMenu } from './CommandMenu';
import { commands, targetOf } from './commands';
import { Filters } from './Filters';
import { Header } from './Header';
import { IssueList } from './IssueList';
import { onIssueKeys } from './keys';
import { issueId, NO_FILTER, type Status } from './model';
import { NewIssue } from './NewIssue';
import { Panel } from './Panel';
import { SelectionBar } from './SelectionBar';
import { Sidebar } from './Sidebar';
import { useTrack, type View } from './useTrack';
import s from './Shell.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

type ShellProps = {
  onToasts: (el: HTMLDivElement | null) => void;
  /** At full screen: the page Track came from. */
  back?: string;
  /** Inside a page that has its own title and main content. */
  embedded?: boolean;
};

const SIDEBAR = 'track:sidebar';

const reduced = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Track: the sidebar on the desk, then the page you're on, flat beside it as a tool's is, headed by
 * its name and tabs; under them, how the issues are filtered, or what's ticked and what to do with it.
 */
export function Shell({ onToasts, back, embedded }: ShellProps) {
  const track = useTrack({ embedded });
  const root = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const [cmd, setCmd] = useState(false);
  const [making, setMaking] = useState(false);
  const [startIn, setStartIn] = useState<{ status: Status; from: boolean }>({ status: 'todo', from: false });
  const returnTo = useRef<HTMLElement | null>(null);
  const created = useRef<number | null>(null);

  // As narrow as the container query that makes it a phone: the panel is the whole screen then, and
  // the board gives way to the list.
  const [narrow, setNarrow] = useState(false);
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setNarrow(e.contentRect.width <= 760));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const view: View = narrow ? 'list' : track.view;

  const focusOn = (n: number) => root.current?.querySelector<HTMLElement>(`[role="listitem"][data-n="${n}"]`)?.focus({ preventScroll: false });

  /**
   * Opens an issue, or closes it with null. Between closed and open the title flies from its row to
   * the panel's heading and back, so you see where it came from and where it goes back to.
   */
  const openIssue = (n: number | null) => {
    const was = track.open;
    const apply = () =>
      flushSync(() => {
        track.setOpen(n);
        if (n != null) track.setFocus(n);
      });
    const row = (m: number | null) => (m == null ? null : root.current?.querySelector<HTMLElement>(`[data-title="${m}"]`));
    // Moving between open issues, or with nothing to fly between, it just changes.
    const from = n != null && was == null ? row(n) : null;
    const to = n == null && was != null ? row(was) : null;
    if (!document.startViewTransition || reduced() || (!from && !to)) {
      apply();
    } else {
      if (from) from.style.viewTransitionName = 'track-title';
      const t = document.startViewTransition(() => {
        if (from) from.style.viewTransitionName = '';
        apply();
        if (to) to.style.viewTransitionName = 'track-title';
      });
      t.finished.finally(() => {
        if (to) to.style.viewTransitionName = '';
      });
    }
    // Closing puts focus back on the issue's row; on a phone, opening puts it on Back.
    if (n == null && was != null) requestAnimationFrame(() => focusOn(was));
    if (n != null && narrow) requestAnimationFrame(() => closeRef.current?.focus());
  };

  // The tab's title says where you are, as the header does, for the tab strip and history.
  useEffect(() => {
    if (embedded) return;
    const where = track.place === 'mine' ? 'My issues' : 'Shop app';
    const which = { all: 'All issues', active: 'Active', backlog: 'Backlog' }[track.scope];
    const it = track.get(track.open);
    document.title = `${it ? `${issueId(it)} ${it.title} · ` : ''}${where} · ${which} · Track`;
  }, [track.place, track.scope, track.open, embedded]);

  const onKeys = (e: KeyboardEvent) => onIssueKeys(e, track, openIssue, focusOn);

  // ⌘K from anywhere in the app; at full screen, from anywhere on the page.
  useEffect(() => {
    const key = (e: globalThis.KeyboardEvent) => {
      if (!(e.key === 'k' && (e.metaKey || e.ctrlKey))) return;
      const inside = root.current?.contains(document.activeElement);
      if (embedded && !inside) return;
      e.preventDefault();
      returnTo.current = document.activeElement as HTMLElement;
      setCmd(true);
    };
    addEventListener('keydown', key);
    return () => removeEventListener('keydown', key);
  }, [embedded]);

  // Esc in the panel closes it, unless a menu or field inside it took the key first.
  const onPanelKeys = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !e.defaultPrevented && !(e.target as HTMLElement).matches('textarea, input')) openIssue(null);
  };

  const target = targetOf(track);
  const targetText = target.length > 1 ? `${target.length} issues` : target.length ? `${issueId(track.get(target[0])!)} ${track.get(target[0])!.title}` : 'No issue selected';
  const open = track.get(track.open);
  const Main = embedded ? 'div' : 'main';

  /** A new issue, starting in `status` from a group's +, or else the tab's likeliest. */
  const newIssue = (status?: Status) => {
    returnTo.current = document.activeElement as HTMLElement;
    setStartIn({ status: status ?? (track.scope === 'backlog' ? 'backlog' : 'todo'), from: status != null });
    setNav(false);
    setMaking(true);
  };
  const search = () => {
    returnTo.current = document.activeElement as HTMLElement;
    setNav(false);
    setCmd(true);
  };

  // The phone's sidebar: focus goes into it, and back to Menu when it goes.
  const [nav, setNav] = useState(false);
  const drawer = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);
  const openNav = () => {
    setNav(true);
    // Onto where you are, so the next arrow or Tab starts from there.
    requestAnimationFrame(() => (drawer.current?.querySelector<HTMLElement>('[aria-current="page"]') ?? drawer.current?.querySelector('button'))?.focus());
  };
  const closeNav = () => {
    setNav(false);
    requestAnimationFrame(() => menuRef.current?.focus());
  };
  useEffect(() => {
    if (!narrow) setNav(false);
  }, [narrow]);

  // Wider, the sidebar folds away and back with the button at its top left, which stays in that spot.
  const [folded, setFolded] = useState(false);
  const hideRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    try {
      if (!embedded && localStorage.getItem(SIDEBAR) === 'hidden') setFolded(true);
    } catch {}
  }, []);
  const fold = (f: boolean) => {
    setFolded(f);
    requestAnimationFrame(() => (f ? menuRef : hideRef).current?.focus());
    if (embedded) return;
    try {
      localStorage.setItem(SIDEBAR, f ? 'hidden' : 'shown');
    } catch {}
  };

  return (
    <div ref={root} className={s.app} data-view={view}>
      {narrow ? (
        nav && (
          // On a phone the sidebar comes over the page from the left, and goes once you pick a place.
          <div className={s.drawer} onKeyDown={(e) => e.key === 'Escape' && closeNav()}>
            <button type="button" className={s.scrim} aria-label="Close menu" tabIndex={-1} onClick={closeNav} />
            <div ref={drawer} className={s.drawerPanel}>
              <Sidebar track={track} onSearch={search} onNewIssue={() => newIssue()} onGo={closeNav} onHide={closeNav} back={back} />
            </div>
          </div>
        )
      ) : (
        <div className={s.side} data-folded={folded ? '' : undefined} inert={folded ? true : undefined}>
          <Sidebar track={track} onSearch={search} onNewIssue={() => newIssue()} onHide={() => fold(true)} hideRef={hideRef} back={back} />
        </div>
      )}

      <Main className={s.page} inert={narrow && nav ? true : undefined}>
        <Header track={track} view={view} embedded={embedded} onShowSidebar={narrow ? openNav : folded ? () => fold(false) : undefined} showRef={menuRef} />

        <div className={s.tools}>{track.checked.size ? <SelectionBar track={track} /> : <Filters filter={track.filter} onChange={track.setFilter} />}</div>

        <div className={s.main} data-open={open && !narrow ? '' : undefined}>
          <div className={s.issues}>
            {/* A teammate's changes wait here instead of moving the row you were about to click. */}
            {track.incoming > 0 && (
              <button type="button" className={s.pill} onClick={track.letIn}>
                {track.incoming === 1 ? '1 update' : `${track.incoming} updates`}
              </button>
            )}
            {track.shown.length === 0 ? (
              <div className={s.empty}>
                {track.filtering ? (
                  <>
                    <p>No issues match these filters.</p>
                    <Button onClick={() => track.setFilter(NO_FILTER)}>Clear filters</Button>
                  </>
                ) : (
                  <>
                    <p>{track.place === 'mine' ? 'Nothing here is assigned to you.' : 'No issues here yet.'}</p>
                    <Button variant="primary" onClick={() => newIssue()}>
                      <Plus {...ic} />
                      New issue
                    </Button>
                  </>
                )}
              </div>
            ) : view === 'board' ? (
              <Board track={track} onOpen={openIssue} onKeys={onKeys} />
            ) : (
              <IssueList track={track} onOpen={openIssue} onKeys={onKeys} onAdd={newIssue} />
            )}
          </div>
          {open && (
            <div className={s.panelSlot} onKeyDown={onPanelKeys}>
              <Panel key={open.n} issue={open} track={track} narrow={narrow} onClose={() => openIssue(null)} closeRef={closeRef} />
            </div>
          )}
        </div>
        <div ref={onToasts} className={s.toastLayer} data-overlay />
      </Main>

      <CommandMenu
        open={cmd}
        onOpenChange={(o) => {
          setCmd(o);
          if (!o) requestAnimationFrame(() => returnTo.current?.isConnected && returnTo.current.focus());
        }}
        target={targetText}
        commands={commands(track, target, { newIssue: () => newIssue(), openIssue })}
      />
      <NewIssue
        open={making}
        status={startIn.status}
        from={startIn.from}
        onOpenChange={(o) => {
          setMaking(o);
          // Created: focus is on the new row. Cancelled: back where you were.
          if (!o)
            setTimeout(() => {
              const n = created.current;
              created.current = null;
              if (n != null) focusOn(n);
              else returnTo.current?.isConnected && returnTo.current.focus();
            });
        }}
        onCreated={(n) => (created.current = n)}
        track={track}
      />
    </div>
  );
}

/** Track, the In practice project tracker, at full size. */
export function TrackApp({ back }: { back?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={s.frame}>
      <ToastProvider container={container} contained>
        <Shell onToasts={setContainer} back={back} />
      </ToastProvider>
    </div>
  );
}
