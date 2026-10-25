import { Archive, ArchiveRestore, ChevronLeft, ChevronRight, Mail, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Tip, TipGroup } from '../../ui/Tooltip';
import { Message } from './Message';
import type { Conversation as Conv } from './model';
import type { Post } from './usePost';
import s from './Conversation.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** Unread messages and the newest start open; the rest start as one line each. */
const startOpen = (c: Conv) => new Set(c.messages.filter((m, i) => m.unread || i === c.messages.length - 1).map((m) => m.id));

type Row = { kind: 'message'; index: number } | { kind: 'run'; from: number; count: number };

/**
 * Three or more collapsed messages in a row stand as one line, "3 earlier messages",
 * until it's clicked; then each shows as its own collapsed line.
 */
function rows(c: Conv, open: Set<string>, unfolded: boolean): Row[] {
  const out: Row[] = [];
  let i = 0;
  while (i < c.messages.length) {
    let j = i;
    while (j < c.messages.length && !open.has(c.messages[j].id)) j++;
    if (j - i >= 3 && !unfolded) out.push({ kind: 'run', from: i, count: j - i });
    else for (let k = i; k < j; k++) out.push({ kind: 'message', index: k });
    if (j < c.messages.length) out.push({ kind: 'message', index: j });
    i = j + 1;
  }
  return out;
}

/** One conversation: its bar, its subject, and its messages, opened to the first unread. */
export function Conversation({ post, c, single }: { post: Post; c: Conv; single: boolean }) {
  const [open, setOpen] = useState(() => startOpen(c));
  const [unfolded, setUnfolded] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  const firstOpen = c.messages.findIndex((m) => open.has(m.id));
  const i = post.list.findIndex((x) => x.id === c.id);

  // Arriving: scroll to the first open message and put focus on it.
  useEffect(() => {
    first.current?.scrollIntoView({ block: 'nearest' });
    first.current?.focus({ preventScroll: true });
  }, []);

  const toggle = (id: string) =>
    setOpen((o) => {
      const next = new Set(o);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <section className={s.conversation} aria-label="Conversation">
      <TipGroup>
        <div className={s.bar}>
          <Tip label="Back" keys={['U']}>
            <Button variant="ghost" icon aria-label="Back" className={s.back} onClick={post.close}>
              <ChevronLeft {...ic} />
            </Button>
          </Tip>
          {c.folder === 'inbox' && (
            <Tip label="Archive" keys={['E']}>
              <Button variant="ghost" icon aria-label="Archive" onClick={() => post.archive([c.id])}>
                <Archive {...ic} />
              </Button>
            </Tip>
          )}
          {c.folder === 'archive' && (
            <Tip label="Move to Inbox">
              <Button variant="ghost" icon aria-label="Move to Inbox" onClick={() => post.unarchive([c.id])}>
                <ArchiveRestore {...ic} />
              </Button>
            </Tip>
          )}
          <Tip label="Mark as unread">
            <Button
              variant="ghost"
              icon
              aria-label="Mark as unread"
              onClick={() => {
                post.setUnread([c.id], true);
                post.close();
              }}
            >
              <Mail {...ic} />
            </Button>
          </Tip>
          {single && i >= 0 && (
            <span className={s.pager}>
              <span className={s.count}>
                {i + 1} of {post.list.length}
              </span>
              <Tip label="Newer" keys={['K']}>
                <Button variant="ghost" icon aria-label="Newer" disabled={i === 0} onClick={() => post.step(-1)}>
                  <ChevronLeft {...ic} />
                </Button>
              </Tip>
              <Tip label="Older" keys={['J']}>
                <Button variant="ghost" icon aria-label="Older" disabled={i === post.list.length - 1} onClick={() => post.step(1)}>
                  <ChevronRight {...ic} />
                </Button>
              </Tip>
            </span>
          )}
        </div>
      </TipGroup>
      <div className={s.scroll}>
        <div className={s.column}>
          <header className={s.head}>
            <h1 className={s.subject}>{c.subject}</h1>
            <Tip label={c.starred ? 'Unstar' : 'Star'} keys={['S']}>
              <Button variant="ghost" icon aria-label={c.starred ? 'Unstar' : 'Star'} aria-pressed={!!c.starred} onClick={() => post.star([c.id], !c.starred)}>
                <Star {...ic} className={s.star} data-on={c.starred ? '' : undefined} />
              </Button>
            </Tip>
          </header>
          <div className={s.messages}>
            {rows(c, open, unfolded).map((r) =>
              r.kind === 'run' ? (
                <button
                  key={`run-${r.from}`}
                  type="button"
                  className={s.run}
                  onClick={() => setUnfolded(true)}
                >
                  <span className={s.runCount}>{r.count}</span>
                  earlier messages
                </button>
              ) : (
                <Message
                  key={c.messages[r.index].id}
                  m={c.messages[r.index]}
                  open={open.has(c.messages[r.index].id)}
                  onToggle={() => toggle(c.messages[r.index].id)}
                  headRef={r.index === firstOpen ? first : undefined}
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
