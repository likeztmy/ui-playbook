import { ChevronDown, Inbox, Archive } from 'lucide-react';
import { animate, motion, useMotionValue, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Switch } from '../ui/Switch';
import { cx } from '../ui/cx';
import { Compare, localized } from './shell';
import s from './demos.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** A duration token in ms and an easing token, read at call time so slow motion applies. */
function token(el: Element, duration: string, easing: string) {
  const css = getComputedStyle(el);
  // The build minifies 618ms to .618s, so read the unit too.
  const raw = css.getPropertyValue(duration).trim();
  return { duration: parseFloat(raw) * (raw.endsWith('ms') ? 1 : 1000), easing: css.getPropertyValue(easing).trim() };
}

// ── Second thoughts ──────────────────────────────────────

const ADVANCED = [
  ['Snap to grid', true],
  ['Show rulers', false],
  ['Autosave', true],
] as const;

/**
 * An Advanced section that opens and shuts. With `queued`, each click waits
 * for the animation before it, as jQuery's effects queue does by default;
 * otherwise the panel turns from wherever it is.
 */
function Advanced({ queued }: { queued?: boolean }) {
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  const queue = useRef<boolean[]>([]);
  const running = useRef(false);
  const shown = useRef(false);
  // The last click's target; state alone goes stale between clicks in one frame.
  const target = useRef(false);

  const play = async () => {
    if (running.current) return;
    running.current = true;
    const el = body.current!;
    while (queue.current.length) {
      const next = queue.current.shift()!;
      const full = el.scrollHeight;
      const { duration, easing } = token(el, '--spring-smooth-duration', '--ease-spring-smooth');
      const anim = el.animate([{ height: `${shown.current ? full : 0}px` }, { height: `${next ? full : 0}px` }], { duration, easing, fill: 'forwards' });
      await anim.finished;
      shown.current = next;
    }
    running.current = false;
  };

  const toggle = () => {
    const next = (target.current = !target.current);
    setOpen(next);
    if (!queued) return;
    queue.current.push(next);
    play();
  };

  return (
    <div className={s.intPanel}>
      <Button variant="ghost" className={s.intTrigger} aria-expanded={open} onClick={toggle}>
        Advanced
        <ChevronDown {...ic} className={s.intChevron} data-open={open ? '' : undefined} />
      </Button>
      <div ref={body} className={cx(s.intBody, !queued && s.intBodyFluid)} data-open={open ? '' : undefined}>
        {/* The clip is the grid item; padding lives inside it, so a 0fr row closes all the way. */}
        <div className={s.intClip}>
          <div className={s.intBodyInner}>
            {ADVANCED.map(([label, on]) => (
              <Switch key={label} label={label} defaultChecked={on} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export const InterruptQueue = localized(function InterruptQueue() {
  return (
    <Compare
      height={0}
      motion
      before={<Advanced queued />}
      after={<Advanced />}
      beforeNote={
        <>
          Each click waits for the animation before it. Change your mind twice and the panel plays all three moves in order, long after the
          last click. jQuery’s effects queue this way by default; its docs call it{' '}
          <a href="https://api.jquery.com/stop/">the common problem of multiple queued animations</a>.
        </>
      }
      afterNote={
        <>
          Each click turns the panel from where it is, and the last click is the one that counts. Apple built the iPhone X gestures the same
          way: “a <a href="https://developer.apple.com/videos/play/wwdc2018/803/">fully redirectable interface</a>”, where the thought and
          the gesture happen in parallel.
        </>
      }
    />
  );
});

// ── Keyframes start over ─────────────────────────────────

const ROWS = ['Q4 roadmap', 'Brand guide', 'Onboarding', 'Pricing'];

/** A file list with a details drawer. `keyframes` animates it with @keyframes; otherwise with a transition. */
function Drawer({ keyframes }: { keyframes?: boolean }) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  return (
    <div className={s.intDrawerStage}>
      <div className={s.intFiles}>
        <div className={s.intFilesHead}>
          <span className={s.intTitle}>Files</span>
          <Button
            size="sm"
            aria-expanded={open}
            onClick={() => {
              setOpen((o) => !o);
              setTouched(true);
            }}
          >
            {open ? 'Hide details' : 'Details'}
          </Button>
        </div>
        {ROWS.map((r) => (
          <div key={r} className={s.intFileRow}>
            {r}
          </div>
        ))}
      </div>
      <aside
        className={cx(s.intDrawer, keyframes ? s.intDrawerKeys : s.intDrawerFluid)}
        data-open={open ? '' : undefined}
        data-touched={touched ? '' : undefined}
        aria-hidden={!open}
      >
        <span className={s.intTitle}>Q4 roadmap</span>
        <span className={s.intMeta}>Edited 2 hours ago</span>
        <span className={s.intMeta}>24 files · 18.4 MB</span>
      </aside>
    </div>
  );
}

export const InterruptKeyframes = localized(function InterruptKeyframes() {
  return (
    <Compare
      height={0}
      motion
      before={<Drawer keyframes />}
      after={<Drawer />}
      beforeNote="The drawer slides with two @keyframes animations, in and out. Hide it before it has finished arriving and the out animation starts from its own first frame, fully open: the drawer jumps out, then slides away."
      afterNote={
        <>
          A transition only knows where it is and where it’s going, so hiding the drawer half-way turns it back from that half. A CSS
          transition “can be interrupted and smoothly transition to a new value” (
          <a href="https://emilkowal.ski/ui/great-animations">Emil Kowalski</a>); keyframes can’t.
        </>
      }
    />
  );
});

// ── The way back is shorter ──────────────────────────────

/**
 * A sidebar that collapses. `fixed` animates every move over the full
 * duration from wherever it is, as a hand-written animate() call does;
 * otherwise a CSS transition shortens a reversal by how far it got.
 */
function Sidebar({ fixed }: { fixed?: boolean }) {
  const [collapsed, setCollapsed] = useState(false);
  const [last, setLast] = useState<number | null>(null);
  const side = useRef<HTMLDivElement>(null);
  const clickedAt = useRef(0);
  const anim = useRef<Animation | null>(null);

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    clickedAt.current = performance.now();
    if (!fixed) return;
    const el = side.current!;
    const from = el.getBoundingClientRect().width;
    anim.current?.cancel();
    const { duration, easing } = token(el, '--spring-smooth-duration', '--ease-spring-smooth');
    anim.current = el.animate([{ width: `${from}px` }, { width: next ? '56px' : '180px' }], { duration, easing, fill: 'forwards' });
    anim.current.finished.then(() => setLast(Math.round(performance.now() - clickedAt.current)), () => {});
  };

  return (
    <div className={s.intShell}>
      <div
        ref={side}
        className={cx(s.intSide, !fixed && s.intSideFluid)}
        data-collapsed={collapsed ? '' : undefined}
        onTransitionEnd={(e) => {
          if (e.propertyName === 'width' && e.target === e.currentTarget) setLast(Math.round(performance.now() - clickedAt.current));
        }}
      >
        <Button variant="ghost" size="sm" aria-expanded={!collapsed} onClick={toggle}>
          {collapsed ? 'Expand' : 'Collapse'}
        </Button>
      </div>
      <div className={s.intMain}>
        <span className={s.intMeta}>{last === null ? ' ' : `Last move: ${last} ms`}</span>
      </div>
    </div>
  );
}

export const InterruptReturn = localized(function InterruptReturn() {
  return (
    <Compare
      height={0}
      motion
      before={<Sidebar fixed />}
      after={<Sidebar />}
      beforeNote="Every move takes the full duration, wherever it starts. Collapse and change your mind at once, and the sidebar spends a full animation crawling back a few pixels."
      afterNote={
        <>
          A reversed CSS transition is shortened by how far it got: turn back a quarter of the way in and the way back takes about a quarter
          of the time. The spec calls it the{' '}
          <a href="https://www.w3.org/TR/css-transitions-1/">reversing shortening factor</a>; in Chrome, a 1000 ms linear move
          reversed at its midpoint came back in 508 ms.
        </>
      }
    />
  );
});

// ── Keep the speed when you turn ─────────────────────────

const TRACK = 220;

/** Plots a motion value over the last few seconds: position up the side, time along the bottom. */
function MotionTrace({ value, min, max }: { value: MotionValue<number>; min: number; max: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const samples: { t: number; v: number }[] = [];
    const span = 3000;
    let raf = 0;
    const draw = () => {
      const now = performance.now();
      samples.push({ t: now, v: value.get() });
      while (samples.length && samples[0].t < now - span) samples.shift();
      const { width, height } = c.getBoundingClientRect();
      const dpr = devicePixelRatio;
      if (c.width !== Math.round(width * dpr)) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const css = getComputedStyle(c);
      ctx.strokeStyle = css.getPropertyValue('--line').trim();
      ctx.lineWidth = 1;
      for (const y of [4, height - 4]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.strokeStyle = css.getPropertyValue('--ink').trim();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      samples.forEach(({ t, v }, i) => {
        const x = width - ((now - t) / span) * width;
        const y = height - 4 - ((v - min) / (max - min)) * (height - 8);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [value, min, max]);
  return <canvas ref={canvas} className={s.intTrace} aria-hidden />;
}

/**
 * A card sent between Inbox and Archive. `curve` uses a timed ease, which
 * starts every new target from rest; otherwise a physical spring carries
 * the card's velocity into the turn.
 */
function Sorter({ curve }: { curve?: boolean }) {
  const x = useMotionValue(0);
  const [target, setTarget] = useState<'inbox' | 'archive'>('inbox');
  const send = (to: 'inbox' | 'archive') => {
    setTarget(to);
    animate(x, to === 'inbox' ? 0 : TRACK, curve ? { duration: 0.6, ease: 'easeInOut' } : { type: 'spring', stiffness: 170, damping: 24 });
  };
  return (
    <div className={s.intSorter}>
      <div className={s.intTrack}>
        <motion.div className={s.intCard} style={{ x }}>
          Invoice #2041
        </motion.div>
      </div>
      <div className={s.intTargets}>
        <Button size="sm" aria-pressed={target === 'inbox'} onClick={() => send('inbox')}>
          <Inbox {...ic} />
          Inbox
        </Button>
        <Button size="sm" aria-pressed={target === 'archive'} onClick={() => send('archive')}>
          <Archive {...ic} />
          Archive
        </Button>
      </div>
      <MotionTrace value={x} min={0} max={TRACK} />
    </div>
  );
}

export const InterruptVelocity = localized(function InterruptVelocity() {
  return (
    <Compare
      height={0}
      before={<Sorter curve />}
      after={<Sorter />}
      beforeNote="A timed ease starts every new target from rest. Send the card back mid-flight and it stops dead, then sets off again: the line under it turns a sharp corner."
      afterNote={
        <>
          A spring defined by stiffness and damping takes the card’s current velocity into the turn, so it slows, swings round and comes back
          in one curve. Motion’s physical springs “incorporate the velocity of any existing gestures or animations”; springs set by duration
          don’t (<a href="https://motion.dev/docs/react-transitions">Motion docs</a>).
        </>
      }
    />
  );
});

/** The Advanced section, half open, held still. */
export function InterruptPreview() {
  return (
    <div className={cx(s.intPanel, s.intStill)} aria-hidden>
      <span className={s.intTrigger}>
        Advanced <ChevronDown {...ic} />
      </span>
      <div className={s.intBodyInner} style={{ height: 52, overflow: 'hidden' }}>
        {ADVANCED.map(([label, on]) => (
          <Switch key={label} label={label} defaultChecked={on} />
        ))}
      </div>
    </div>
  );
}
