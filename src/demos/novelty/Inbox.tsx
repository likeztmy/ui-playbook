import { Archive } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { INBOX } from './data';
import { useTimers } from './useTimers';
import s from './novelty.module.scss';

/** The flourish: the row lifts, flies off and closes up, and takes no press until it's done. */
export const FLOURISH = 450;
/** The brief way: the row closes up, and the next press counts at once. */
export const BRIEF = 120;

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** Thirty messages and an Archive button that takes the top one. */
export function Inbox({ flourish }: { flourish?: boolean }) {
  const [gone, setGone] = useState<string[]>([]);
  const [leaving, setLeaving] = useState<string[]>([]);
  const [waited, setWaited] = useState(0);
  const [lost, setLost] = useState(0);
  // Read on every press, which can come faster than a render: a held Enter repeats.
  const left = useRef(INBOX.map((m) => m.id));
  const busy = useRef(false);
  // A Reset mid-flourish: the timer from before it mustn't take a row from the fresh Inbox.
  const round = useRef(0);
  const later = useTimers();

  const archive = () => {
    if (busy.current) {
      setLost((n) => n + 1);
      return;
    }
    const id = left.current.shift();
    if (!id) return;
    setLeaving((l) => [...l, id]);
    if (flourish) {
      busy.current = true;
      setWaited((w) => w + FLOURISH);
    }
    const r = round.current;
    later(
      () => {
        if (r !== round.current) return;
        busy.current = false;
        setGone((g) => [...g, id]);
        setLeaving((l) => l.filter((x) => x !== id));
      },
      flourish ? FLOURISH : BRIEF,
    );
  };

  const reset = () => {
    round.current += 1;
    left.current = INBOX.map((m) => m.id);
    busy.current = false;
    setGone([]);
    setLeaving([]);
    setWaited(0);
    setLost(0);
  };

  const count = left.current.length;
  return (
    <div className={s.inbox}>
      <div className={s.inboxHead}>
        <Button size="sm" leading={<Archive {...ic} />} onClick={archive}>
          Archive
        </Button>
        <span className={s.count}>{count ? `${count} in Inbox` : 'Inbox empty'}</span>
        <Button size="sm" variant="ghost" onClick={reset}>
          Reset
        </Button>
      </div>
      <ul className={s.rows}>
        {INBOX.filter((m) => !gone.includes(m.id)).map((m) => (
          <li key={m.id} className={s.row} data-leaving={leaving.includes(m.id) ? (flourish ? 'flourish' : 'brief') : undefined}>
            <span className={s.from}>{m.from}</span>
            <span className={s.subject}>{m.subject}</span>
          </li>
        ))}
      </ul>
      <p className={s.tally} aria-live="polite">
        Waited {(waited / 1000).toFixed(1)} s · {lost === 1 ? '1 press' : `${lost} presses`} lost
      </p>
    </div>
  );
}
