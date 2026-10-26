import type { Ref } from 'react';
import { Attachments } from './Attachments';
import { Avatar } from './Avatar';
import { Blocks } from './Blocks';
import { snippet, type Message as Msg } from './model';
import { person } from './people';
import { QuotedFold } from './QuotedFold';
import { Recipients } from './Recipients';
import { Sending } from './Sending';
import s from './Message.module.scss';

type Props = {
  m: Msg;
  open: boolean;
  onToggle: () => void;
  /** Focus lands here when the conversation opens. */
  headRef?: Ref<HTMLButtonElement>;
  /** Just sent: takes it back. While set, the message says it's sending, with Undo, where its time goes. */
  undo?: () => void;
};

/** One message in a conversation: a single line when collapsed, the whole message when open. */
export function Message({ m, open, onToggle, headRef, undo }: Props) {
  const from = person(m.from);
  if (!open) {
    return (
      <button ref={headRef} type="button" className={s.collapsed} data-unread={m.unread ? '' : undefined} onClick={onToggle}>
        <Avatar id={m.from} size="sm" />
        <span className={s.name}>{from.name}</span>
        <span className={s.snippet}>{snippet(m.body)}</span>
        <span className={s.time}>{m.at}</span>
      </button>
    );
  }
  return (
    <article className={s.message} aria-label={`${from.name}, ${m.at}`}>
      <header className={s.head}>
        <Avatar id={m.from} />
        {/* The name collapses the message; the recipients open their own list. */}
        <span className={s.who}>
          <button ref={headRef} type="button" className={s.sender} aria-expanded onClick={onToggle}>
            {from.name}
            <span className={s.address}>{from.email}</span>
          </button>
          <Recipients m={m} />
        </span>
        {undo ? <Sending onUndo={undo} /> : <span className={s.time}>{m.at}</span>}
      </header>
      <div className={s.body}>
        {m.letter ? (
          <div className={s.letter}>
            <Blocks blocks={m.body} />
          </div>
        ) : (
          <Blocks blocks={m.body} />
        )}
        {m.quoted && <QuotedFold blocks={m.quoted} quotes={m.quotes} />}
        {m.attachments && <Attachments files={m.attachments} />}
      </div>
    </article>
  );
}
