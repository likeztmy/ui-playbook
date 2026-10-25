import { ChevronDown, Search, X } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Button } from '../../ui/Button';
import { Menu } from '../../ui/Menu';
import { ToastProvider } from '../../ui/Toast';
import { Conversation } from './Conversation';
import { FOLDERS, FOLDER_NAME } from './folders';
import { List } from './List';
import { usePost, type Post } from './usePost';
import s from './Shell.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** Gmail's keys: J older, K newer, X tick, E archive, S star, U back, / search. */
function useKeys(post: Post, rows: RefObject<Map<string, HTMLButtonElement>>, search: RefObject<HTMLInputElement | null>) {
  const moved = useRef(false);
  // Focus follows a conversation the keyboard moved to.
  useEffect(() => {
    if (moved.current && post.open) rows.current.get(post.open.id)?.focus();
    moved.current = false;
  }, [post.open, rows]);

  return (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, [role="dialog"], [role="menu"]')) return;
    const row = (e.target as HTMLElement).closest('[data-row]')?.getAttribute('data-row');
    const id = row ?? post.open?.id;
    const c = post.mail.find((x) => x.id === id);
    const ticked = [...post.checked];
    const act: Record<string, () => void> = {
      j: () => post.step(1, id),
      k: () => post.step(-1, id),
      // With conversations ticked, E and S act on them, as the bar's buttons do.
      e: () => (ticked.length ? post.archive(ticked) : c && post.archive([c.id])),
      s: () => {
        if (ticked.length) post.star(ticked, !post.mail.filter((x) => post.checked.has(x.id)).every((x) => x.starred));
        else if (c) post.star([c.id], !c.starred);
      },
      x: () => {
        if (!c) return;
        const next = new Set(post.checked);
        if (next.has(c.id)) next.delete(c.id);
        else next.add(c.id);
        post.setChecked(next);
      },
      u: post.close,
      '/': () => search.current?.focus(),
    };
    if (!act[e.key]) return;
    e.preventDefault();
    moved.current = e.key === 'j' || e.key === 'k';
    act[e.key]();
  };
}

function Shell({ onToasts }: { onToasts: (el: HTMLDivElement | null) => void }) {
  const post = usePost();
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const search = useRef<HTMLInputElement>(null);
  const keys = useKeys(post, rows, search);
  const reading = !!post.open;

  return (
    <div className={s.app} data-view={reading ? 'message' : 'list'} onKeyDown={keys}>
      <header className={s.top}>
        <span className={s.brand}>Post</span>
        <span className={s.phoneOnly}>
          <Menu.Root>
            <Menu.Trigger render={<Button variant="ghost" className={s.folderMenu} />}>
              {FOLDER_NAME[post.folder]}
              <ChevronDown {...ic} />
            </Menu.Trigger>
            <Menu.Popup>
              {FOLDERS.map((f) => (
                <Menu.Item key={f.id} icon={f.icon} onClick={() => post.go(f.id)}>
                  {FOLDER_NAME[f.id]}
                </Menu.Item>
              ))}
            </Menu.Popup>
          </Menu.Root>
        </span>
        <label className={s.search}>
          <Search {...ic} />
          <input
            ref={search}
            value={post.query}
            placeholder="Search mail"
            aria-label="Search mail"
            onChange={(e) => post.search(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') post.search('');
              e.stopPropagation();
            }}
          />
          {post.query && (
            <Button variant="ghost" size="sm" icon aria-label="Clear search" onClick={() => post.search('')}>
              <X {...ic} />
            </Button>
          )}
        </label>
      </header>
      <nav className={s.side} aria-label="Folders">
        {FOLDERS.map((f) => (
          <button key={f.id} type="button" className={s.folder} aria-current={post.folder === f.id || undefined} onClick={() => post.go(f.id)}>
            <f.icon {...ic} />
            <span>{FOLDER_NAME[f.id]}</span>
            {f.id === 'inbox' && post.unreadCount > 0 && <span className={s.folderCount}>{post.unreadCount}</span>}
          </button>
        ))}
      </nav>
      <main className={s.main}>
        {post.open ? <Conversation key={post.open.id} post={post} c={post.open} single /> : <List post={post} rows={rows} />}
      </main>
      {/* Toasts rise in their own layer, out of the app's grid. */}
      <div ref={onToasts} className={s.toastLayer} data-overlay />
    </div>
  );
}

/** Post, the In practice mail app, at full size. */
export function PostApp() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={s.frame}>
      <ToastProvider container={container} contained align="start">
        <Shell onToasts={setContainer} />
      </ToastProvider>
    </div>
  );
}
