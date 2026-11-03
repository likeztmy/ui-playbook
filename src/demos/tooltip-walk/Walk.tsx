import { MousePointer2, RotateCcw, type LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Tip, TipGroup } from '../../ui/Tooltip';
import s from '../demos.module.scss';
import w from './walk.module.scss';

export type Action = [label: string, Icon: LucideIcon, keys: string[]];

// One pass along the row: the pointer takes 150ms to the next button, the label waits its delay,
// then is read for 400ms.
const MOVE = 150;
const WAIT = 500;
const READ = 400;

/** Total time to read every label, waiting at each stop or only at the first. */
const total = (n: number, shared: boolean) => n * (MOVE + READ) + (shared ? 1 : n) * WAIT;

/**
 * A row of icon buttons and a pointer that walks along it, reading each label. It walks once when
 * the row comes into view and again on Replay, so the delay shows without a mouse; a real pointer
 * takes over at once.
 */
export function Walk({ actions, shared }: { actions: Action[]; shared?: boolean }) {
  const [open, setOpen] = useState<number | null>(null);
  const [at, setAt] = useState<{ x: number; y: number } | null>(null);
  const [done, setDone] = useState(false);
  const row = useRef<HTMLDivElement>(null);
  const run = useRef(0);

  const stop = () => {
    run.current++;
    setAt(null);
  };

  const play = async () => {
    const id = ++run.current;
    const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));
    setDone(false);
    for (let i = 0; i < actions.length; i++) {
      const b = row.current?.querySelectorAll('button')[i];
      if (!b) return;
      setOpen(null);
      setAt({ x: b.offsetLeft + b.offsetWidth / 2, y: b.offsetTop + b.offsetHeight / 2 });
      await pause(MOVE);
      if (!shared || i === 0) await pause(WAIT);
      if (run.current !== id) return;
      setOpen(i);
      await pause(READ);
      if (run.current !== id) return;
    }
    setDone(true);
  };

  useEffect(() => {
    const el = row.current;
    if (!el) return;
    const seen = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        seen.disconnect();
        play();
      },
      { threshold: 1 },
    );
    seen.observe(el);
    return () => {
      seen.disconnect();
      run.current++;
    };
  }, []);

  const tips = actions.map(([label, Icon, keys], i) => {
    const tip = (
      <Tip key={label} label={label} keys={keys} open={open === i} onOpenChange={(o) => setOpen((cur) => (o ? i : cur === i ? null : cur))}>
        <Button variant="ghost" icon aria-label={label}>
          <Icon size={16} aria-hidden />
        </Button>
      </Tip>
    );
    // Not shared: every tip gets its own provider, so each waits the full delay.
    return shared ? tip : <TipGroup key={label}>{tip}</TipGroup>;
  });

  return (
    <div className={s.aimDemo}>
      <div ref={row} className={w.row} onPointerEnter={(e) => e.pointerType === 'mouse' && stop()}>
        {shared ? <TipGroup>{tips}</TipGroup> : tips}
        {at && <MousePointer2 className={w.pointer} style={{ left: at.x, top: at.y }} size={20} aria-hidden />}
      </div>
      <div className={s.aimFoot}>
        <span className={s.aimStatus} aria-live="polite">
          {done ? `${actions.length} labels in ${(total(actions.length, !!shared) / 1000).toFixed(2)} s` : ' '}
        </span>
        <Button size="sm" variant="ghost" onClick={play}>
          <RotateCcw size={14} aria-hidden />
          Replay
        </Button>
      </div>
    </div>
  );
}
