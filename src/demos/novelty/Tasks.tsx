import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { Burst } from './Burst';
import { TASKS } from './data';
import s from './novelty.module.scss';

/** A day's tasks. `every` throws confetti on each tick; otherwise only the last one is celebrated. */
export function Tasks({ every }: { every?: boolean }) {
  const [done, setDone] = useState<number[]>([]);
  // Each tick's own key, so a burst replays on the row just ticked.
  const [last, setLast] = useState<{ i: number; n: number } | null>(null);
  const all = done.length === TASKS.length;

  const tick = (i: number, on: boolean) => {
    setDone((d) => (on ? [...d, i] : d.filter((x) => x !== i)));
    if (on) setLast((l) => ({ i, n: (l?.n ?? 0) + 1 }));
  };

  return (
    <div className={s.tasks}>
      <div className={s.inboxHead}>
        <span className={s.count}>{all ? 'All done for today' : `${TASKS.length - done.length} left today`}</span>
        <Button size="sm" variant="ghost" onClick={() => (setDone([]), setLast(null))}>
          Reset
        </Button>
      </div>
      <ul className={s.taskList}>
        {TASKS.map((t, i) => (
          <li key={t} className={s.task}>
            <Checkbox label={t} checked={done.includes(i)} onCheckedChange={(on) => tick(i, on)} />
            {every && last?.i === i && done.includes(i) && <Burst key={last.n} />}
          </li>
        ))}
      </ul>
      {!every && all && <Burst big />}
    </div>
  );
}
