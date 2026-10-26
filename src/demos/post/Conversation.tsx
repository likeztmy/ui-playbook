import { Archive, ArchiveRestore, ChevronLeft, ChevronRight, Forward, Mail, ReplyAll, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Tip, TipGroup } from '../../ui/Tooltip';
import { Composer } from './Composer';
import { Message } from './Message';
import { latest, type Conversation as Conv } from './model';
import { Avatar } from './Avatar';
import { called, person } from './people';
import type { Compose } from './useCompose';
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

/** A run of folded messages, by who wrote them: names say whether it's worth opening, a count doesn't. */
function Run({ messages, onOpen }: { messages: Conv['messages']; onOpen: () => void }) {
  const from = messages.map((m) => m.from);
  const writers = [...new Set(from)];
  const names = writers.map(called);
  const label = names.length > 1 ? `${names.slice(0, -1).join(', ')} and ${names.at(-1)}` : names[0];
  return (
    <button type="button" className={s.run} onClick={onOpen}>
      <span className={s.faces}>
        {/* The first writer on top, as the names read. */}
        {writers.slice(0, 3).map((id, i) => (
          <span key={id} style={{ zIndex: 3 - i }}>
            <Avatar id={id} size="sm" />
          </span>
        ))}
      </span>
      <span className={s.runText}>
        <span className={s.runNames}>{label[0].toUpperCase() + label.slice(1)}</span> · {from.length} earlier messages
      </span>
      {/* When they span, in the times' column. */}
      <span className={s.runSpan}>
        {messages[0].at} – {messages.at(-1)!.at}
      </span>
    </button>
  );
}

/** One conversation: its bar, its subject, and its messages, opened to the first unread. */
export function Conversation({ post, compose, c, single }: { post: Post; compose: Compose; c: Conv; single: boolean }) {
  const [open, setOpen] = useState(() => startOpen(c));
  const [unfolded, setUnfolded] = useState(false);
  const first = useRef<HTMLButtonElement>(null);
  const firstOpen = c.messages.findIndex((m) => open.has(m.id));
  const i = post.list.findIndex((x) => x.id === c.id);
  // The way on, named, so you know whether to take it: the next conversation down the list.
  const next = single && i >= 0 ? post.list[i + 1] : undefined;
  const reply = compose.replyIn(c.id);
  const last = latest(c);
  // Reply all only when there's someone besides the sender to reach.
  // Who a reply goes to: the sender, or, after your own message, whoever you wrote to.
  const replyName = (person(last.from).me ? last.to : [last.from]).map(called).join(', ');
  const field = useRef<HTMLButtonElement>(null);
  // A reply sent or closed hands focus back to the field it came from.
  const replied = useRef(false);
  useEffect(() => {
    if (replied.current && !reply) field.current?.focus({ preventScroll: true });
    replied.current = !!reply;
  }, [reply]);
  const many = new Set([last.from, ...last.to, ...(last.cc ?? [])].filter((p) => !person(p).me)).size > 1;

  // Arriving: scroll to the first open message and put focus on it.
  useEffect(() => {
    first.current?.scrollIntoView({ block: 'nearest' });
    first.current?.focus({ preventScroll: true });
  }, []);

  // A message that arrives while the conversation is open (your own reply, sent) opens.
  const newest = latest(c).id;
  useEffect(() => setOpen((o) => (o.has(newest) ? o : new Set([...o, newest]))), [newest]);

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
        </div>
      </TipGroup>
      <div className={s.scroll}>
        <div className={s.column}>
          <header className={s.head}>
            <h1 className={s.subject}>{c.subject}</h1>
            <Tip label={c.starred ? 'Unstar' : 'Star'} keys={['S']}>
              <Button
                variant="ghost"
                icon
                aria-label={c.starred ? 'Unstar' : 'Star'}
                aria-pressed={!!c.starred}
                onClick={() => post.star([c.id], !c.starred)}
              >
                <Star {...ic} className={s.star} data-on={c.starred ? '' : undefined} />
              </Button>
            </Tip>
          </header>
          <div className={s.messages}>
            {rows(c, open, unfolded).map((r) =>
              r.kind === 'run' ? (
                <Run key={`run-${r.from}`} messages={c.messages.slice(r.from, r.from + r.count)} onOpen={() => setUnfolded(true)} />
              ) : (
                <Message
                  key={c.messages[r.index].id}
                  m={c.messages[r.index]}
                  open={open.has(c.messages[r.index].id)}
                  onToggle={() => toggle(c.messages[r.index].id)}
                  headRef={r.index === firstOpen ? first : undefined}
                  undo={compose.sending.find((x) => x.message === c.messages[r.index].id && !x.done)?.undo}
                />
              ),
            )}
          </div>
          {reply ? (
            <Composer key={reply.id} d={reply} compose={compose} />
          ) : (
            // Where reading ends, a reply is already waiting: the action on the path people take.
            <TipGroup>
              <div className={s.answer}>
                <Tip keys={['R']}>
                  <button ref={field} type="button" className={s.replyField} onClick={() => compose.reply(c, 'reply')}>
                    <Avatar id="me" size="sm" />
                    <span>Reply to {replyName}…</span>
                  </button>
                </Tip>
                {many && (
                  <Tip label="Reply all" keys={['A']}>
                    <Button variant="ghost" icon aria-label="Reply all" onClick={() => compose.reply(c, 'replyAll')}>
                      <ReplyAll {...ic} />
                    </Button>
                  </Tip>
                )}
                <Tip label="Forward" keys={['F']}>
                  <Button variant="ghost" icon aria-label="Forward" onClick={() => compose.reply(c, 'forward')}>
                    <Forward {...ic} />
                  </Button>
                </Tip>
              </div>
            </TipGroup>
          )}
          {next && (
            <Tip keys={['J']}>
              <button type="button" className={s.next} onClick={() => post.step(1)}>
                <span className={s.nextLabel}>Next conversation</span>
                <span className={s.nextSubject}>{next.subject}</span>
                <ChevronRight {...ic} />
              </button>
            </Tip>
          )}
        </div>
      </div>
    </section>
  );
}
