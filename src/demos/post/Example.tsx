import { Maximize2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button, buttonClass } from '../../ui/Button';
import { ToastProvider } from '../../ui/Toast';
import { DECISIONS } from './decisions';
import { Shell, type Control } from './Shell';
import s from './Example.module.scss';

const SHOWN = 2400;

/** Brings the app into view only if it isn't: scrolling to a stuck element would unstick the page. */
function inView(el: HTMLElement | null) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  if (r.top < 56 || r.bottom > innerHeight) el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

/** Resolves once `el` has kept its place for a few frames, or after a second. */
function still(el: HTMLElement | null) {
  return new Promise<void>((done) => {
    let last = NaN;
    let same = 0;
    const end = performance.now() + 1000;
    const tick = () => {
      const top = el?.getBoundingClientRect().top ?? 0;
      same = top === last ? same + 1 : 0;
      last = top;
      if (same >= 3 || performance.now() > end) done();
      else requestAnimationFrame(tick);
    };
    tick();
  });
}

/** Post on its page: wider than the text around it, a way to full screen, and each decision with a Show that plays it in the app. */
export function PostExample() {
  const [toasts, setToasts] = useState<HTMLElement | null>(null);
  const [spot, setSpot] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const control = useRef<Control | null>(null);
  const frame = useRef<HTMLDivElement>(null);
  const run = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // What the app was before a Show, put back once it's been seen, unless the reader took over.
  const before = useRef<{ post: ReturnType<Control['post']['snapshot']>; compose: ReturnType<Control['compose']['snapshot']> } | null>(null);
  const touched = useRef(false);
  const putBack = () => {
    const c = control.current;
    if (c && before.current && !touched.current) {
      c.post.restore(before.current.post);
      c.compose.restore(before.current.compose);
    }
    before.current = null;
  };

  const show = async (d: (typeof DECISIONS)[number]) => {
    const mine = ++run.current;
    clearTimeout(timer.current);
    putBack();
    const c = control.current!;
    before.current = { post: c.post.snapshot(), compose: c.compose.snapshot() };
    touched.current = false;
    setSpot(null);
    setPinned(null);
    inView(frame.current);
    // Played once the page has stopped: what a decision points at is measured where it will stay.
    await still(frame.current);
    await d.play({ get: () => control.current!, pin: setPinned });
    // Inside the app, scrolling to what a decision is about can move the page too; the app comes back whole.
    inView(frame.current);
    // A later Show takes over from this one.
    if (run.current !== mine) return;
    setSpot(d.spot);
    timer.current = setTimeout(() => {
      setSpot(null);
      setPinned(null);
      putBack();
    }, SHOWN);
  };

  return (
    <div className={s.example}>
      <div className={s.wide}>
        <div className={s.head}>
          <a className={buttonClass({ variant: 'ghost', size: 'sm' })} href="/practice/mail/app">
            <Maximize2 size={14} aria-hidden />
            Open full screen
          </a>
        </div>
        <div ref={frame} className={s.frame} onPointerDown={() => (touched.current = true)} onKeyDown={() => (touched.current = true)}>
          <ToastProvider container={toasts} contained>
            <Shell onToasts={setToasts} spot={spot} pinned={pinned} control={control} embedded />
          </ToastProvider>
        </div>
      </div>
      <ol className={s.decisions}>
        {DECISIONS.map((d, i) => (
          <li key={d.spot} className={s.decision} data-active={spot === d.spot ? '' : undefined}>
            <span className={s.number}>{i + 1}</span>
            <span className={s.text}>{d.text}</span>
            <Button size="sm" onClick={() => show(d)}>
              Show
            </Button>
          </li>
        ))}
      </ol>
    </div>
  );
}
