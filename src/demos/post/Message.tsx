import { Ellipsis } from 'lucide-react';
import { useState, type Ref } from 'react';
import { Tip } from '../../ui/Tooltip';
import { Attachments } from './Attachments';
import { Avatar } from './Avatar';
import { Blocks } from './Blocks';
import { snippet, type Message as Msg } from './model';
import { person } from './people';
import { Recipients } from './Recipients';
import s from './Message.module.scss';

type Props = {
  m: Msg;
  open: boolean;
  onToggle: () => void;
  /** Focus lands here when the conversation opens. */
  headRef?: Ref<HTMLButtonElement>;
};

/** One message in a conversation: a single line when collapsed, the whole message when open. */
export function Message({ m, open, onToggle, headRef }: Props) {
  const [quoted, setQuoted] = useState(false);
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
        <span className={s.time}>{m.at}</span>
      </header>
      <div className={s.body}>
        {m.letter ? (
          <div className={s.letter}>
            <Blocks blocks={m.body} />
          </div>
        ) : (
          <Blocks blocks={m.body} />
        )}
        {m.quoted && (
          <>
            <Tip label={quoted ? 'Hide quoted text' : 'Show quoted text'}>
              <button type="button" className={s.fold} aria-label={quoted ? 'Hide quoted text' : 'Show quoted text'} aria-expanded={quoted} onClick={() => setQuoted((q) => !q)}>
                <Ellipsis size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
              </button>
            </Tip>
            {quoted && <Blocks blocks={m.quoted} className={s.quoted} />}
          </>
        )}
        {m.attachments && <Attachments files={m.attachments} />}
      </div>
    </article>
  );
}
