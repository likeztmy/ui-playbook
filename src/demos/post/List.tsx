import { Archive, Mail, MailOpen, Star } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Tip, TipGroup } from '../../ui/Tooltip';
import { Line } from './Line';
import { section, unread } from './model';
import { FOLDER_NAME } from './folders';
import type { Post } from './usePost';
import s from './List.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** The widest sender text in the list, up to 200: subjects keep one left edge with no gap wider than it needs. */
export function useFromWidth(box: RefObject<HTMLDivElement | null>, deps: unknown[]) {
  const [width, setWidth] = useState(160);
  useLayoutEffect(() => {
    const measure = () => {
      const names = [...(box.current?.querySelectorAll<HTMLElement>('[data-from]') ?? [])];
      const text = (n: HTMLElement) => {
        const range = document.createRange();
        range.selectNodeContents(n);
        return range.getBoundingClientRect().width;
      };
      if (names.length) setWidth(Math.min(200, Math.ceil(Math.max(...names.map(text)))));
    };
    measure();
    // Again once the webfont is in: the fallback's widths differ.
    document.fonts.ready.then(measure);
  }, deps);
  return width;
}

/** What a list's bar carries from the app: the folder menu (on a phone), and search with New message. */
export type Chrome = {
  folders: ReactNode;
  actions: ReactNode;
  /** New messages just sent, atop the list with their Undo: where the eye comes back to. */
  outbox: ReactNode;
};

/** The bar over the list: select all, then the selection's actions or where you are; then search and New message. */
function Bar({ post, chrome }: { post: Post; chrome: Chrome }) {
  const ticked = post.list.filter((c) => post.checked.has(c.id));
  const ids = ticked.map((c) => c.id);
  const all = post.list.length > 0 && ticked.length === post.list.length;
  const anyUnread = ticked.some(unread);
  return (
    <div className={s.bar}>
      <span className={s.check}>
        <Checkbox
          aria-label={all ? 'Select none' : 'Select all'}
          checked={all}
          indeterminate={ticked.length > 0 && !all}
          onCheckedChange={() => post.setChecked(all || ticked.length ? new Set() : new Set(post.list.map((c) => c.id)))}
        />
      </span>
      {ticked.length > 0 ? (
        // What's chosen, then what can be done with it: the count reads before the tools.
        <TipGroup>
          <span className={s.title}>{ticked.length} selected</span>
          <span className={s.tools}>
            {ticked.some((c) => c.folder === 'inbox') && (
              <Tip label="Archive">
                <Button variant="ghost" icon aria-label="Archive" onClick={() => post.archive(ids)}>
                  <Archive {...ic} />
                </Button>
              </Tip>
            )}
            <Tip label={anyUnread ? 'Mark as read' : 'Mark as unread'}>
              <Button variant="ghost" icon aria-label={anyUnread ? 'Mark as read' : 'Mark as unread'} onClick={() => post.setUnread(ids, !anyUnread)}>
                {anyUnread ? <MailOpen {...ic} /> : <Mail {...ic} />}
              </Button>
            </Tip>
            <Tip label="Star">
              <Button variant="ghost" icon aria-label="Star" onClick={() => post.star(ids, !ticked.every((c) => c.starred))}>
                <Star {...ic} />
              </Button>
            </Tip>
          </span>
        </TipGroup>
      ) : (
        <>
          <span className={s.title}>{post.everywhere ? 'All mail' : FOLDER_NAME[post.folder]}</span>
          <span className={s.where}>{chrome.folders}</span>
        </>
      )}
      <span className={s.barActions}>{chrome.actions}</span>
    </div>
  );
}

/** Conversations in date sections, or what to do when there are none. */
type ListProps = {
  post: Post;
  rows: RefObject<Map<string, HTMLButtonElement>>;
  chrome: Chrome;
  /** A row held as though the pointer rested on it. */
  pinned?: string | null;
};

export function List({ post, rows, chrome, pinned }: ListProps) {
  const box = useRef<HTMLDivElement>(null);
  const fromWidth = useFromWidth(box, [post.list]);
  const q = post.query.trim();
  return (
    <section className={s.list} aria-label="Conversations">
      <Bar post={post} chrome={chrome} />
      {chrome.outbox}
      {/* New mail waits here, over the list, until asked for: nothing moves under the pointer on its own. */}
      {post.waiting > 0 && post.folder === 'inbox' && !q && (
        <button
          type="button"
          className={s.pill}
          data-spot="arrive"
          onClick={() => {
            post.letIn();
            box.current?.scrollTo({ top: 0 });
          }}
        >
          {post.waiting === 1 ? '1 new message' : `${post.waiting} new messages`}
        </button>
      )}
      <div
        ref={box}
        className={s.rows}
        role="list"
        data-selecting={post.checked.size ? '' : undefined}
        style={{ '--from': `${fromWidth}px` } as CSSProperties}
      >
        {post.list.map((c, i) => [
          // A header where the section changes: more space above than below, so it joins the rows it names.
          (i === 0 || section(c) !== section(post.list[i - 1])) && (
            <div key={`h-${c.id}`} className={s.section} data-first={i === 0 ? '' : undefined} data-spot="sections">
              {section(c)}
            </div>
          ),
          <Line
            key={c.id}
            c={c}
            post={post}
            pin={pinned === c.id ? 'hover' : undefined}
            rowRef={(el) => {
              if (el) rows.current.set(c.id, el);
              else rows.current.delete(c.id);
            }}
          />,
        ])}
        {post.list.length === 0 && (
          <div className={s.empty}>
            {q ? (
              <>
                <p data-spot="search">
                  No conversations match “{q}” in {post.everywhere ? 'All mail' : FOLDER_NAME[post.folder]}.
                </p>
                {!post.everywhere && (
                  <Button size="sm" onClick={post.searchEverywhere}>
                    Search all mail
                  </Button>
                )}
              </>
            ) : (
              <p>{post.folder === 'inbox' ? 'You’re all caught up.' : `Nothing in ${FOLDER_NAME[post.folder]}.`}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
