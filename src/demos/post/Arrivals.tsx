import { useRef, useState } from 'react';
import { Compare } from '../shell';
import { CONVERSATIONS, incoming } from './conversations';
import { unread, type Conversation } from './model';
import { participants } from './people';
import s from './Arrivals.module.scss';

const FEW = CONVERSATIONS.filter((c) => c.folder === 'inbox').slice(1, 5);

/**
 * A short inbox. Mail arrives 1.2 s after the pointer comes in, while you're aiming. `push` puts it
 * straight at the top; otherwise it waits behind a pill.
 */
function Arrivals({ push }: { push?: boolean }) {
  const [list, setList] = useState(FEW);
  const [waiting, setWaiting] = useState<Conversation[]>([]);
  const [opened, setOpened] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const count = useRef(0);
  const arrive = () => {
    const c = incoming(++count.current, '9:52');
    if (push) setList((l) => [c, ...l]);
    else setWaiting((w) => [c, ...w]);
  };
  return (
    <div className={s.mini}>
      <div className={s.list} onPointerEnter={() => (timer.current = setTimeout(arrive, 1200))} onPointerLeave={() => clearTimeout(timer.current)}>
        <div className={s.head}>Inbox</div>
        {waiting.length > 0 && (
          <button
            type="button"
            className={s.pill}
            data-overlay
            onClick={() => {
              setList((l) => [...waiting, ...l]);
              setWaiting([]);
            }}
          >
            {waiting.length === 1 ? '1 new message' : `${waiting.length} new messages`}
          </button>
        )}
        {list.slice(0, 4).map((c) => (
          <button key={c.id} type="button" className={s.row} data-unread={unread(c) ? '' : undefined} onClick={() => setOpened(c.subject)}>
            <span className={s.dot} />
            <span className={s.from}>{participants(c.messages.map((m) => m.from))}</span>
            <span className={s.time}>{c.time}</span>
            <span className={s.subject}>{c.subject}</span>
          </button>
        ))}
      </div>
      <p className={s.status}>{opened ? `Opened: ${opened}` : 'Open a message'}</p>
    </div>
  );
}

export function MailArrivals() {
  return (
    <Compare
      beforeLabel="New mail pushes rows down"
      afterLabel="New mail waits behind a pill"
      height={0}
      before={<Arrivals push />}
      after={<Arrivals />}
      beforeNote="Move to a message to open it. A second later new mail lands at the top and every row drops one place: the click meant for one message opens the one above it."
      afterNote="New mail waits behind a pill over the list. Nothing under the pointer moves until you ask for it."
    />
  );
}
