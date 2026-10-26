import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Compare } from '../shell';
import m from '../mistakes.module.scss';
import s from './pilot.module.scss';

const LABELS = ['Duplicate', 'Rename', 'Move'];
// A pointer sweeping the row: one button every 220ms, as a quick pass across.
const STEP = 220;

/**
 * Three buttons that a pointer sweeps across once when they come into view, so the difference
 * shows before anyone hovers; after that they're the reader's.
 */
function Sweep({ slow }: { slow?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [at, setAt] = useState<number | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        LABELS.forEach((_, i) => timers.push(setTimeout(() => setAt(i), 400 + i * STEP)));
        timers.push(setTimeout(() => setAt(null), 400 + LABELS.length * STEP));
      },
      { threshold: 0.8 },
    );
    io.observe(el);
    return () => (io.disconnect(), timers.forEach(clearTimeout));
  }, []);
  return (
    <div ref={ref} className={s.pressRow} onPointerEnter={() => setAt(null)}>
      {LABELS.map((l, i) => (
        <Button key={l} className={slow ? m.slowHover : undefined} data-pin={at === i ? 'hover' : undefined}>
          {l}
        </Button>
      ))}
    </div>
  );
}

/** Hover in at once and out softly, against the same fade both ways. */
export function PilotHover() {
  return (
    <Compare
      beforeLabel="Fades both ways"
      afterLabel="In at once, out softly"
      before={<Sweep slow />}
      after={<Sweep />}
      beforeNote="The same fade in as out, as Bootstrap's 0.15 s both ways. Swept quickly, the highlight trails behind the pointer."
      afterNote="What the pointer is on answers at once; what it has left fades in 120 ms, so a quick pass leaves a short tail, not a lag."
    />
  );
}
