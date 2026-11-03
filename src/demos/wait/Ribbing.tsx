import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { useTimers } from '../novelty/useTimers';
import { Compare, localized } from '../shell';
import { useBusy } from './useBusy';
import s from './wait.module.scss';

const RIB_TIME = 6000;

/** A 6 s linear bar; `ribbed` adds stripes that drift backwards, slowing as they go. */
function Ribbed({ ribbed }: { ribbed?: boolean }) {
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);
  const busy = useBusy(running);
  const later = useTimers();
  // The fill is a CSS animation; its value is kept for screen readers, as the Stall bars give theirs.
  const [pct, setPct] = useState(0);
  useEffect(() => {
    if (!running) return;
    const from = performance.now();
    const tick = setInterval(() => setPct(Math.min(100, Math.round(((performance.now() - from) / RIB_TIME) * 100))), 250);
    return () => clearInterval(tick);
  }, [running, run]);
  const start = () => {
    if (running) return;
    setRun((r) => r + 1);
    setPct(0);
    setRunning(true);
    later(() => {
      setRunning(false);
      setPct(100);
    }, RIB_TIME);
  };
  return (
    <div className={s.waitBarDemo}>
      <span className={s.waitMeta}>{running ? 'Uploading video.mov' : 'video.mov'}</span>
      <div className={s.waitBar} role="progressbar" aria-label="Upload" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        {run > 0 && <span key={run} className={cx(s.waitFill, s.waitLinear, ribbed && s.waitRibs)} />}
      </div>
      <Button size="sm" onClick={start} loading={busy} loadingLabel="Uploading">
        {run ? 'Upload again' : 'Upload'}
      </Button>
    </div>
  );
}

export const WaitRibbing = localized(function WaitRibbing() {
  return (
    <Compare
      beforeLabel="Solid fill"
      afterLabel="Stripes drifting backwards"
      height={0}
      before={<Ribbed />}
      after={<Ribbed ribbed />}
      beforeNote="A solid bar, filling at a steady rate for six seconds."
      afterNote={
        <>
          The same six seconds, with stripes drifting against the fill and slowing as they go. The motion against the bar makes it seem to move
          faster: perceived duration was 11% shorter in Harrison, Yeo and Hudson’s tests (
          <a href="https://www.chrisharrison.net/index.php/Research/ProgressBars2">Faster Progress Bars</a>, CHI 2010).
        </>
      }
    />
  );
});
