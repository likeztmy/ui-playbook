import { forwardRef, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { FileText, Inbox, PanelLeft, Settings, Share } from 'lucide-react';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { ACCOUNT, CURRENT, DOC, PAGES, WORKSPACE } from './data';
import s from './app-shell.module.scss';

type AppProps = {
  /** The whole window scrolls as one page, instead of each pane. */
  whole?: boolean;
  /** The layer between the window and the panes keeps its automatic minimum height. */
  loose?: boolean;
  height?: number;
};

// Below this width the window shows one pane, and the places move behind a button in the header.
const NARROW = 480;

/** A work tool's window: a title bar, the sidebar (head, pages, account) and the open page. */
export const App = forwardRef<HTMLDivElement, AppProps>(function App({ whole, loose, height = 320 }, ref) {
  const navId = useId();
  const layout = useRef<HTMLDivElement>(null);
  const nav = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);

  // Wide again, the sidebar is back in its column: nothing is left open over the page.
  useEffect(() => {
    const el = layout.current;
    if (!el) return;
    const ro = new ResizeObserver(() => el.clientWidth >= NARROW && setOpen(false));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const show = () => {
    setOpen(true);
    requestAnimationFrame(() => nav.current?.querySelector<HTMLElement>('[aria-current="page"]')?.focus());
  };
  const hide = () => {
    setOpen(false);
    requestAnimationFrame(() => toggle.current?.focus());
  };
  const onKey = (e: KeyboardEvent) => {
    if (open && e.key === 'Escape') {
      e.stopPropagation();
      hide();
    }
  };
  const go = (e: MouseEvent) => {
    e.preventDefault();
    if (open) hide();
  };

  return (
    <div ref={ref} className={cx(s.window, whole && s.whole, loose && s.loose)} style={{ height }}>
      <div ref={layout} className={s.layout} data-layer="layout" data-open={open || undefined}>
        {/* Before the sidebar, so the sidebar paints over it at the same z-index. */}
        {open && <div className={s.scrim} onClick={hide} aria-hidden />}
        <nav ref={nav} id={navId} className={s.sidebar} aria-label="Pages" onKeyDown={onKey}>
          <div className={s.head}>{WORKSPACE}</div>
          <a href="#" className={s.item} onClick={go}>
            <Inbox size={16} aria-hidden />
            Inbox
          </a>
          <div className={s.list} data-pane="sidebar">
            <h4 className={s.section}>Handbook</h4>
            {PAGES.map((p) => (
              <a key={p} href="#" className={s.item} aria-current={p === CURRENT ? 'page' : undefined} onClick={go}>
                <FileText size={16} aria-hidden />
                {p}
              </a>
            ))}
          </div>
          <div className={s.foot}>
            <span className={s.avatar} aria-hidden>
              {ACCOUNT.initials}
            </span>
            <span className={s.name}>{ACCOUNT.name}</span>
            <Button variant="ghost" size="sm" icon label="Settings">
              <Settings size={16} aria-hidden />
            </Button>
          </div>
        </nav>
        <main className={s.content} inert={open || undefined}>
          <header className={s.bar}>
            <Button
              ref={toggle}
              className={s.placesButton}
              variant="ghost"
              size="sm"
              icon
              label="Pages"
              aria-expanded={open}
              aria-controls={navId}
              onClick={show}
            >
              <PanelLeft size={16} aria-hidden />
            </Button>
            <h3 className={s.title}>{CURRENT}</h3>
            <Button variant="secondary" size="sm">
              <Share size={14} aria-hidden />
              Share
            </Button>
          </header>
          <div className={s.body} data-pane="content" tabIndex={0} role="region" aria-label={CURRENT}>
            <article className={s.doc}>
              {DOC.map(({ heading, text }) => (
                <section key={text}>
                  {heading && <h4>{heading}</h4>}
                  <p>{text}</p>
                </section>
              ))}
            </article>
          </div>
        </main>
      </div>
    </div>
  );
});
