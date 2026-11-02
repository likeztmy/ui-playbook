import { Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Switch } from '../../ui/Switch';
import { Tip } from '../../ui/Tooltip';
import { useTimers } from '../novelty/useTimers';
import { Compare, localized } from '../shell';
import { Spinner } from './Spinner';
import s from './wait.module.scss';

const SAVE = 900;
const STARRED = ['Q4 roadmap', 'Brand guide', 'Onboarding'];

/** Starring files. `optimistic` stars at once and takes it back if the server says no. */
function Stars({ optimistic }: { optimistic?: boolean }) {
  const [starred, setStarred] = useState<string[]>(['Brand guide']);
  const [pending, setPending] = useState<string[]>([]);
  const [fail, setFail] = useState(false);
  // The failure, on the row it belongs to.
  const [error, setError] = useState<{ file: string; text: string } | null>(null);
  const later = useTimers();

  const toggle = (f: string) => {
    if (pending.includes(f)) return;
    const on = !starred.includes(f);
    const failing = fail;
    setFail(false);
    setError(null);
    const apply = (v: boolean) => setStarred((l) => (v ? [...l, f] : l.filter((x) => x !== f)));
    if (optimistic) apply(on);
    else setPending((p) => [...p, f]);
    later(() => {
      setPending((p) => p.filter((x) => x !== f));
      if (failing) {
        if (optimistic) apply(!on);
        setError({ file: f, text: `Couldn’t ${on ? 'star' : 'unstar'}: the server didn’t respond. Try again.` });
      } else if (!optimistic) apply(on);
    }, SAVE);
  };

  return (
    <div className={s.waitList}>
      {STARRED.map((f) => {
        const on = starred.includes(f);
        const name = on ? `Unstar ${f}` : `Star ${f}`;
        return (
          <div key={f} className={s.waitRow}>
            <span className={s.waitRowText}>
              {f}
              <span className={s.waitError} role="status">
                {error?.file === f ? error.text : ''}
              </span>
            </span>
            <Tip label={name}>
              <Button variant="ghost" size="sm" icon aria-label={name} aria-pressed={on} onClick={() => toggle(f)}>
                {pending.includes(f) ? <Spinner /> : <Star size={16} aria-hidden className={on ? s.waitStarOn : undefined} />}
              </Button>
            </Tip>
          </div>
        );
      })}
      <Switch label="Fail the next request" checked={fail} onCheckedChange={setFail} className={s.waitFail} />
    </div>
  );
}

export const WaitOptimistic = localized(function WaitOptimistic() {
  return (
    <Compare
      beforeLabel="Waits 0.9 s for the server"
      afterLabel="Stars at once, rolls back"
      height={0}
      before={<Stars />}
      after={<Stars optimistic />}
      beforeNote="The star waits for the server: a spinner for most of a second on an action that almost never fails."
      afterNote={
        <>
          The star fills at once, and the request runs behind it. If the server refuses, the star goes back and says why. React builds this in as{' '}
          <a href="https://react.dev/reference/react/useOptimistic">useOptimistic</a>. It suits actions that rarely fail and are cheap to undo; a
          payment still waits.
        </>
      }
    />
  );
});
