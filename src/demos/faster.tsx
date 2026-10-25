import { Archive, Mail, MailOpen, Star } from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Tip } from '../ui/Tooltip';
import { Compare, localized } from './shell';
import s from './demos.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

const START = [
  ['Mira Okafor', 'Q4 roadmap: final draft'],
  ['Atlas Travel', 'Your trip to Lisbon is confirmed'],
  ['Northwind Billing', 'Invoice #2041 is ready'],
  ['Daniel Brooks', 'Lunch Friday?'],
  ['Priya Natarajan', 'Design review notes'],
  ['Field Notes', 'The case for slower software'],
  ['Sam Lee', 'Photos from the offsite'],
  ['Jonas Weber', 'Standup notes, Tuesday'],
].map(([from, subject]) => ({ from, subject, starred: false, unread: true }));

/** The modifier's name where the reader is: ⌥ on a Mac, Alt elsewhere. */
function useModifier() {
  const [name, setName] = useState('⌥');
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setName('Alt');
  }, []);
  return name;
}

/**
 * A short inbox with three commands on its toolbar, each with a key, and a
 * tally of how each command was given. `expose` shows every key at once
 * while the modifier is held, as ExposeHK does; otherwise keys live in the
 * tooltips, one at a time.
 */
function Triage({ expose }: { expose?: boolean }) {
  const [mail, setMail] = useState(START);
  const [at, setAt] = useState(0);
  const [held, setHeld] = useState(false);
  const [tally, setTally] = useState({ key: 0, pointer: 0 });
  const box = useRef<HTMLDivElement>(null);
  const mod = useModifier();
  const current = mail[at];

  const run = (cmd: 'archive' | 'star' | 'read', by: 'key' | 'pointer') => {
    if (!current) return;
    setTally((t) => ({ ...t, [by]: t[by] + 1 }));
    if (cmd === 'archive') {
      setMail((m) => m.filter((_, i) => i !== at));
      setAt((i) => Math.min(i, mail.length - 2));
    } else setMail((m) => m.map((x, i) => (i === at ? (cmd === 'star' ? { ...x, starred: !x.starred } : { ...x, unread: !x.unread }) : x)));
    // Keep the keyboard on the list after a pointer command.
    box.current?.focus();
  };

  const keys = (e: KeyboardEvent) => {
    if (e.key === 'Alt') {
      setHeld(true);
      return;
    }
    // By physical key, so a held ⌥ (which turns E into ´ on a Mac) still means E.
    const cmd = { KeyE: 'archive', KeyS: 'star', KeyI: 'read' }[e.code] as 'archive' | 'star' | 'read' | undefined;
    if (cmd) {
      e.preventDefault();
      run(cmd, 'key');
    } else if (e.code === 'KeyJ' || e.key === 'ArrowDown') {
      e.preventDefault();
      setAt((i) => Math.min(mail.length - 1, i + 1));
    } else if (e.code === 'KeyK' || e.key === 'ArrowUp') {
      e.preventDefault();
      setAt((i) => Math.max(0, i - 1));
    }
  };

  const tool = (cmd: 'archive' | 'star' | 'read', name: string, key: string, icon: ReactNode) => (
    <span className={s.fkTool}>
      <Tip label={name} keys={[key]}>
        <Button variant="ghost" icon aria-label={name} onClick={() => run(cmd, 'pointer')}>
          {icon}
        </Button>
      </Tip>
      {expose && held && (
        <kbd className={s.fkKey} aria-hidden>
          {key}
        </kbd>
      )}
    </span>
  );

  const total = tally.key + tally.pointer;
  return (
    <div
      ref={box}
      className={s.fkApp}
      tabIndex={0}
      aria-label="Inbox"
      onKeyDown={keys}
      onKeyUp={(e) => e.key === 'Alt' && setHeld(false)}
      onBlur={() => setHeld(false)}
    >
      <div className={s.fkBar}>
        {tool('archive', 'Archive', 'E', <Archive {...ic} />)}
        {tool('star', current?.starred ? 'Unstar' : 'Star', 'S', <Star {...ic} />)}
        {tool('read', current?.unread ? 'Mark as read' : 'Mark as unread', 'I', current?.unread ? <MailOpen {...ic} /> : <Mail {...ic} />)}
        <span className={s.fkTally} data-tally>
          {total ? `${tally.key} of ${total} by key` : 'No commands yet'}
        </span>
      </div>
      <div className={s.fkRows}>
        {mail.slice(0, 6).map((m, i) => (
          <button
            key={m.subject}
            type="button"
            tabIndex={-1}
            className={s.fkRow}
            data-current={i === at ? '' : undefined}
            data-unread={m.unread ? '' : undefined}
            onClick={() => {
              setAt(i);
              box.current?.focus();
            }}
          >
            <span className={s.fkFrom}>{m.from}</span>
            <span className={s.fkSubject}>{m.subject}</span>
            {m.starred && <Star {...ic} className={s.fkStar} />}
          </button>
        ))}
        {mail.length === 0 && <p className={s.fkEmpty}>All done.</p>}
      </div>
      {expose && (
        <p className={s.fkHint} data-held={held ? '' : undefined}>
          Hold {mod} to see shortcuts
        </p>
      )}
    </div>
  );
}

export const FasterExpose = localized(function FasterExpose() {
  return (
    <Compare
      height={0}
      before={<Triage />}
      after={<Triage expose />}
      beforeNote={
        <>
          Each key lives in its button’s tooltip, one at a time, and only for the pointer that’s already there. In a study where tooltips
          showed the key the moment the pointer arrived, only 35% of commands ended up given by key (
          <a href="https://www.cosc.canterbury.ac.nz/~andy/papers/ehk.pdf">Malacria et al., CHI 2013</a>).
        </>
      }
      afterNote={
        <>
          Holding the modifier shows every key on its button at once, so they can be learned before the pointer moves. With this, ExposeHK,
          94% of the same commands were given by key. Across the study a command by key took 2.74 s, by pointer 4.16 s.
        </>
      }
    />
  );
});
