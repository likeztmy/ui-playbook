import { RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Tip } from '../../ui/Tooltip';
import { useTimers } from '../novelty/useTimers';
import { Compare, localized } from '../shell';
import { Spinner } from './Spinner';
import { DELAY } from './useBusy';
import s from './wait.module.scss';

/** Once shown, keep it this long, so it can't flash out again (spin-delay's minDuration). */
const MIN = 500;
/** Request times, in turn: mostly quick, one just past the delay, one slow. */
const LATENCY = [160, 340, 1600, 220, 380, 900];

const FILES = ['Q4 roadmap', 'Brand guide', 'Onboarding', 'Pricing'];

/** A file list with Refresh. `patient` waits before showing the spinner, then keeps it a moment. */
function Refresh({ patient }: { patient?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [spin, setSpin] = useState(false);
  const [n, setN] = useState(0);
  const [updated, setUpdated] = useState(0);
  const later = useTimers();

  const refresh = () => {
    if (busy) return;
    const latency = LATENCY[n % LATENCY.length];
    setN((x) => x + 1);
    setBusy(true);
    if (!patient) {
      setSpin(true);
      later(() => {
        setSpin(false);
        setBusy(false);
        setUpdated((u) => u + 1);
      }, latency);
      return;
    }
    const shownAt = latency > DELAY ? DELAY : null;
    if (shownAt !== null) later(() => setSpin(true), shownAt);
    const end = shownAt === null ? latency : Math.max(latency, shownAt + MIN);
    later(() => {
      setSpin(false);
      setBusy(false);
      setUpdated((u) => u + 1);
    }, end);
  };

  return (
    <div className={s.waitList}>
      <div className={s.waitHead}>
        <span className={s.waitTitle}>Files</span>
        <span className={s.waitMeta}>{updated ? `Updated ${updated === 1 ? 'once' : `${updated} times`}` : 'Not refreshed'}</span>
        <Tip label="Refresh">
          <Button variant="ghost" size="sm" icon aria-label="Refresh" aria-busy={busy || undefined} onClick={refresh}>
            {spin ? <Spinner /> : <RefreshCw size={16} aria-hidden />}
          </Button>
        </Tip>
      </div>
      {FILES.map((f) => (
        <div key={f} className={s.waitRow} data-stale={spin ? '' : undefined}>
          {f}
        </div>
      ))}
    </div>
  );
}

export const WaitFlash = localized(function WaitFlash() {
  return (
    <Compare
      beforeLabel="Spinner at once"
      afterLabel="Waits 300 ms, stays 500 ms"
      height={0}
      before={<Refresh />}
      after={<Refresh patient />}
      beforeNote={
        <>
          The spinner shows the moment Refresh is pressed. Most refreshes take under a third of a second, so it blinks on and off, and a blink reads
          as a glitch rather than as work. Under a second, NN/g advises showing{' '}
          <a href="https://www.nngroup.com/articles/skeleton-screens/">no indicator at all</a>.
        </>
      }
      afterNote={
        <>
          Nothing shows for the first 300 ms (<code>delay-loading</code>), so quick refreshes just land. Past that, the spinner stays at least half a
          second, so a request that ends just after the delay can’t flash it either: the second half of the rule, from{' '}
          <a href="https://github.com/smeijer/spin-delay">spin-delay</a>.
        </>
      }
    />
  );
});
