import { CONVERSATIONS } from './conversations';
import { unread } from './model';
import { participants } from './people';
// The arrivals' short inbox is the same list, held still.
import s from './Arrivals.module.scss';

/** The inbox's top, held still, for the home page's card. */
export function PostPreview() {
  return (
    <div className={`${s.list} ${s.preview}`} aria-hidden>
      <div className={s.head}>Inbox</div>
      {CONVERSATIONS.slice(0, 3).map((c) => (
        <div key={c.id} className={s.row} data-unread={unread(c) ? '' : undefined}>
          <span className={s.dot} />
          <span className={s.from}>{participants(c.messages.map((m) => m.from))}</span>
          <span className={s.time}>{c.time}</span>
          <span className={s.subject}>{c.subject}</span>
        </div>
      ))}
    </div>
  );
}
