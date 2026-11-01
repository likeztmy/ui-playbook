import { forwardRef } from 'react';
import { FileText, Inbox, Settings, Share } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Tip } from '../../ui/Tooltip';
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

/** A work tool's window: a title bar, the sidebar (head, pages, account) and the open page. */
export const App = forwardRef<HTMLDivElement, AppProps>(function App({ whole, loose, height = 320 }, ref) {
  return (
    <div ref={ref} className={cx(s.window, whole && s.whole, loose && s.loose)} style={{ height }}>
      <div className={s.titlebar}>{WORKSPACE}</div>
      <div className={s.layout} data-layer="layout">
        <nav className={s.sidebar} aria-label="Pages">
          <a href="#" className={s.item} onClick={(e) => e.preventDefault()}>
            <Inbox size={16} aria-hidden />
            Inbox
          </a>
          <div className={s.list} data-pane="sidebar">
            <h4 className={s.section}>Handbook</h4>
            {PAGES.map((p) => (
              <a key={p} href="#" className={s.item} aria-current={p === CURRENT ? 'page' : undefined} onClick={(e) => e.preventDefault()}>
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
            <Tip label="Settings">
              <Button variant="ghost" size="sm" icon aria-label="Settings">
                <Settings size={16} aria-hidden />
              </Button>
            </Tip>
          </div>
        </nav>
        <main className={s.content}>
          <header className={s.bar}>
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
