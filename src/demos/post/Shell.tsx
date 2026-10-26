import { ChevronDown, Pencil } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Button } from '../../ui/Button';
import { Menu } from '../../ui/Menu';
import { Tip } from '../../ui/Tooltip';
import { ToastProvider } from '../../ui/Toast';
import { Composer, preloadBody } from './Composer';
import { Conversation } from './Conversation';
import { DraftList } from './DraftList';
import { Find } from './Find';
import { FOLDERS, FOLDER_NAME } from './folders';
import { participants } from './people';
import { Sending } from './Sending';
import { List, type Chrome } from './List';
import type { Folder } from './model';
import { useCompose, type Compose } from './useCompose';
import { usePost, type Post } from './usePost';
import s from './Shell.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** Gmail's keys: J older, K newer, X tick, E archive, S star, U back, / search; C compose, R reply, A reply all, F forward. */
function useKeys(post: Post, compose: Compose, rows: RefObject<Map<string, HTMLButtonElement>>, search: RefObject<HTMLInputElement | null>) {
  const moved = useRef(false);
  // Focus follows a conversation the keyboard moved to.
  useEffect(() => {
    if (moved.current && post.open) rows.current.get(post.open.id)?.focus();
    moved.current = false;
  }, [post.open, rows]);

  return (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || compose.writing) return;
    if (
      (e.target as HTMLElement).closest(
        'input, textarea, [contenteditable="true"], [role="dialog"], [role="menu"], section[aria-label="Reply"], section[aria-label="Forward"]',
      )
    )
      return;
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
      // Search filters the list: from a conversation, back to the list first.
      '/': () => {
        post.close();
        requestAnimationFrame(() => search.current?.focus());
      },
      c: compose.compose,
      r: () => post.open && compose.reply(post.open, 'reply'),
      a: () => post.open && compose.reply(post.open, 'replyAll'),
      f: () => post.open && compose.reply(post.open, 'forward'),
    };
    if (!act[e.key]) return;
    e.preventDefault();
    moved.current = e.key === 'j' || e.key === 'k';
    act[e.key]();
  };
}

function Shell({ onToasts }: { onToasts: (el: HTMLDivElement | null) => void }) {
  const post = usePost();
  const compose = useCompose(post);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const search = useRef<HTMLInputElement>(null);
  const composeButton = useRef<HTMLButtonElement>(null);
  const keys = useKeys(post, compose, rows, search);
  // On the whole page, as Gmail's are: they work before anything in the app has focus.
  const latestKeys = useRef(keys);
  latestKeys.current = keys;
  useEffect(() => {
    const on = (e: KeyboardEvent) => latestKeys.current(e);
    document.addEventListener('keydown', on);
    return () => document.removeEventListener('keydown', on);
  }, []);
  const reading = !!post.open || !!compose.writing;

  useEffect(() => {
    preloadBody();
  }, []);

  // What's been sent goes with the next move, never on a timer under the pointer.
  useEffect(() => compose.clearSent(), [post.folder, post.open?.id, compose.writing?.id]);

  // Back from a conversation puts focus on its row; leaving a new message, on Compose. Never on <body>.
  const was = useRef<{ open?: string; writing: boolean }>({ writing: false });
  useEffect(() => {
    if (!compose.writing && !post.open) {
      if (was.current.open) rows.current.get(was.current.open)?.focus({ preventScroll: true });
      else if (was.current.writing) composeButton.current?.focus();
    }
    was.current = { open: post.open?.id, writing: !!compose.writing };
  }, [compose.writing, post.open]);

  const go = (f: Folder) => {
    compose.leave();
    post.go(f);
  };

  // What every list's bar carries besides its own tools: where you are on a phone, search, and New message.
  const chrome: Chrome = {
    outbox: null,
    folders: (
      <Menu.Root>
        <Menu.Trigger render={<Button variant="ghost" className={s.folderMenu} />}>
          {FOLDER_NAME[post.folder]}
          <ChevronDown {...ic} />
        </Menu.Trigger>
        <Menu.Popup>
          {FOLDERS.map((f) => (
            <Menu.Item key={f.id} icon={f.icon} onClick={() => go(f.id)}>
              {FOLDER_NAME[f.id]}
            </Menu.Item>
          ))}
        </Menu.Popup>
      </Menu.Root>
    ),
    actions: (
      <>
        <Find
          value={post.query}
          inputRef={search}
          onChange={(q) => {
            compose.leave();
            post.search(q);
          }}
        />
        <Tip label="New message" keys={['C']}>
          <Button ref={composeButton} variant="primary" className={s.newMessage} aria-label="New message" onClick={compose.compose}>
            <Pencil {...ic} />
            <span className={s.newLabel}>New message</span>
          </Button>
        </Tip>
      </>
    ),
  };

  chrome.outbox = compose.sending
    .filter((x) => !x.conversation)
    .map((x) => (
      <div key={x.message} className={s.outbox} data-outbox="">
        <span className={s.outboxText}>
          <b>{x.subject.trim() || '(no subject)'}</b>
          {x.to.length > 0 && ` to ${participants(x.to)}`}
        </span>
        <Sending onUndo={x.undo} done={x.done} />
      </div>
    ));

  const main = compose.writing ? (
    <Composer key={compose.writing.id} d={compose.writing} compose={compose} page onBack={() => compose.close(compose.writing!.id)} />
  ) : post.open ? (
    <Conversation key={post.open.id} post={post} compose={compose} c={post.open} single />
  ) : post.folder === 'drafts' && !post.query ? (
    <DraftList compose={compose} chrome={chrome} />
  ) : (
    <List post={post} rows={rows} chrome={chrome} />
  );

  return (
    <div className={s.app} data-view={reading ? 'message' : 'list'}>
      <nav className={s.side} aria-label="Folders">
        <span className={s.brand}>Post</span>
        {FOLDERS.map((f) => {
          const count = f.id === 'inbox' ? post.unreadCount : f.id === 'drafts' ? compose.drafts.length : 0;
          return (
            <button key={f.id} type="button" className={s.folder} aria-current={post.folder === f.id || undefined} onClick={() => go(f.id)}>
              <f.icon {...ic} />
              <span>{FOLDER_NAME[f.id]}</span>
              {count > 0 && <span className={s.folderCount}>{count}</span>}
            </button>
          );
        })}
      </nav>
      <main className={s.main}>{main}</main>
      {/* Toasts rise in their own layer, laid over the main area. */}
      <div ref={onToasts} className={s.toastLayer} data-overlay />
    </div>
  );
}

/** Post, the In practice mail app, at full size. */
export function PostApp() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={s.frame}>
      <ToastProvider container={container} contained>
        <Shell onToasts={setContainer} />
      </ToastProvider>
    </div>
  );
}
