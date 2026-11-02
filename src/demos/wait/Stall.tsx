import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Compare, localized } from '../shell';
import { useBusy } from './useBusy';
import { useKeepFocus } from './useKeepFocus';
import s from './wait.module.scss';

/** 5.5 s in all, as in Harrison et al.'s study; one second of it stands still. */
const TOTAL = 5500;
const STALL = 1000;

/** Progress at time t (0–TOTAL) for a bar whose stall starts at `stallAt` (0–1 of the moving time). */
function progressAt(t: number, stallAt: number) {
  const moving = TOTAL - STALL;
  const stallStart = stallAt * moving;
  const m = t < stallStart ? t : t < stallStart + STALL ? stallStart : t - STALL;
  return Math.min(1, m / moving);
}

const GUESSES = [4, 5, 6, 7, 8];

/** A progress bar that stands still for a second, early or late, then asks how long it took. */
function Stall({ early }: { early?: boolean }) {
  const [t, setT] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const p = t === null ? 0 : progressAt(t, early ? 0.04 : 0.92);
  const done = t !== null && t >= TOTAL;
  const running = t !== null && !done;
  const busy = useBusy(running);
  const box = useKeepFocus<HTMLDivElement>(done ? (guess === null ? 'ask' : 'told') : 'export');

  const run = () => {
    if (running) return;
    setGuess(null);
    setT(0);
    const start = performance.now();
    const tick = () => {
      const now = performance.now() - start;
      setT(Math.min(now, TOTAL));
      if (now < TOTAL) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  return (
    <div ref={box} className={s.waitBarDemo}>
      <span className={s.waitMeta}>{running ? 'Exporting 248 files' : '248 files'}</span>
      <div className={s.waitBar} role="progressbar" aria-label="Export" aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100}>
        <span className={s.waitFill} style={{ width: `${p * 100}%` }} />
      </div>
      {done ? (
        guess === null ? (
          <div className={s.waitGuess}>
            <span className={s.waitMeta}>How long did it take?</span>
            <div className={s.waitChips}>
              {GUESSES.map((g) => (
                <Button key={g} size="sm" onClick={() => setGuess(g)}>
                  {g} s
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className={s.waitGuess}>
            <span className={s.waitMeta}>
              You said {guess} s. It took {TOTAL / 1000} s, the same as the other one.
            </span>
            <Button size="sm" variant="ghost" onClick={run}>
              Run again
            </Button>
          </div>
        )
      ) : (
        <Button size="sm" onClick={run} loading={busy} loadingLabel="Exporting">
          Export
        </Button>
      )}
    </div>
  );
}

export const WaitStall = localized(function WaitStall() {
  return (
    <Compare
      beforeLabel="Stalls 1 s at 90%"
      afterLabel="Stalls 1 s at the start"
      height={0}
      before={<Stall />}
      after={<Stall early />}
      beforeNote={
        <>
          The bar stands still for a second at 90%, just when the end seemed near. In Harrison et al.’s study people disliked a pause towards the end
          most of all (<a href="https://www.chrisharrison.net/index.php/Research/ProgressBars">Rethinking the Progress Bar</a>, UIST 2007).
        </>
      }
      afterNote="The same second, spent at the start, before anyone is watching closely. The study’s advice: front-load the slow, uncertain stages and let the bar speed up towards the end, which people favoured most."
    />
  );
});
