import { ArrowLeft, ChevronDown, Pencil } from 'lucide-react';
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

/** What a page around Post reads and drives, to play a decision in the app. Current as of the last render. */
export type Control = { post: Post; compose: Compose; root: HTMLDivElement | null };

type ShellProps = {
  onToasts: (el: HTMLDivElement | null) => void;
  /** A decision being shown: the parts marked `data-spot` with it are outlined. */
  spot?: string | null;
  control?: RefObject<Control | null>;
  /** A row held as though the pointer rested on it. */
  pinned?: string | null;
  /** At full screen: the page Post came from, at the folders' foot. */
  back?: string;
  /** Inside a page that has its own main content: the app's main area is a plain region then. */
  embedded?: boolean;
};

export function Shell({ onToasts, spot, control, pinned, back, embedded }: ShellProps) {
  const post = usePost();
  const compose = useCompose(post);
  const root = useRef<HTMLDivElement>(null);
  if (control) control.current = { post, compose, root: root.current };
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const search = useRef<HTMLInputElement>(null);
  const composeButton = useRef<HTMLButtonElement>(null);
  const reading = !!post.open || !!compose.writing;

  useEffect(() => {
    preloadBody();
  }, []);

  // What's been sent goes with the next move, never on a timer under the pointer.
  useEffect(() => compose.clearSent(), [post.folder, post.open?.id, compose.writing?.id]);

  // Back from a conversation puts focus on its row; leaving a new message, on Compose. Never on <body>.
  const was = useRef<{ open?: string; writing: boolean }>({ writing: false });
  useEffect(() => {
    // Only when focus was in the app: a page around it keeps its own.
    const here = document.activeElement === document.body || !!root.current?.contains(document.activeElement);
    if (!compose.writing && !post.open && here) {
      if (was.current.open) rows.current.get(was.current.open)?.focus({ preventScroll: true });
      else if (was.current.writing) composeButton.current?.focus();
    }
    was.current = { open: post.open?.id, writing: !!compose.writing };
  }, [compose.writing, post.open]);

  /** What a folder's count says: the Inbox's unread, the drafts kept. */
  const count = (f: Folder) => (f === 'inbox' ? post.unreadCount : f === 'drafts' ? compose.drafts.length : 0);

  const go = (f: Folder) => {
    compose.leave();
    post.go(f);
  };

  // What every list's bar carries besides its own tools: where you are on a phone, search, and New message.
  const chrome: Chrome = {
    outbox: null,
    search,
    folders: (
      <Menu.Root>
        <Menu.Trigger render={<Button variant="ghost" className={s.folderMenu} />}>
          {FOLDER_NAME[post.folder]}
          <ChevronDown {...ic} />
        </Menu.Trigger>
        <Menu.Popup>
          {/* Where you are is checked; each folder's count, as in the sidebar. */}
          <Menu.RadioGroup value={post.folder} onValueChange={(f) => go(f as Folder)}>
            {FOLDERS.map((f) => (
              <Menu.RadioItem key={f.id} value={f.id} detail={count(f.id) || undefined}>
                {FOLDER_NAME[f.id]}
              </Menu.RadioItem>
            ))}
          </Menu.RadioGroup>
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
        <Tip label="New message">
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
    <List post={post} rows={rows} chrome={chrome} pinned={pinned} />
  );

  return (
    <div ref={root} className={s.app} data-view={reading ? 'message' : 'list'} data-spot={spot ?? undefined}>
      <nav className={s.side} aria-label="Folders">
        {/* The app's name heads the page at full screen; on a page with its own title it's a label. */}
        {embedded ? <span className={s.brand}>Post</span> : <h1 className={s.brand}>Post</h1>}
        {FOLDERS.map((f) => {
          const n = count(f.id);
          return (
            <button
              key={f.id}
              type="button"
              className={s.folder}
              aria-current={(post.folder === f.id && !post.everywhere) || undefined}
              onClick={() => go(f.id)}
            >
              <f.icon {...ic} />
              <span>{FOLDER_NAME[f.id]}</span>
              {n > 0 && <span className={s.folderCount}>{n}</span>}
            </button>
          );
        })}
        {back && (
          <a className={`${s.folder} ${s.back}`} href={back}>
            <ArrowLeft {...ic} />
            <span>UI Playbook</span>
          </a>
        )}
      </nav>
      {embedded ? <div className={s.main}>{main}</div> : <main className={s.main}>{main}</main>}
      {/* Toasts rise in their own layer, laid over the main area. */}
      <div ref={onToasts} className={s.toastLayer} data-overlay />
    </div>
  );
}

/** Post, the In practice mail app, at full size. */
export function PostApp({ back }: { back?: string }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={s.frame}>
      <ToastProvider container={container} contained>
        <Shell onToasts={setContainer} back={back} />
      </ToastProvider>
    </div>
  );
}
