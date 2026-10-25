import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { animate, motion, useMotionValue, type MotionValue } from 'motion/react';
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { Compare, localized } from './shell';
import s from './demos.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

// ── Second thoughts ──────────────────────────────────────

const SLIDES = [
  ['Lisbon', 'oklch(0.78 0.09 60), oklch(0.62 0.12 30)'],
  ['Kyoto', 'oklch(0.8 0.07 150), oklch(0.6 0.09 170)'],
  ['Reykjavík', 'oklch(0.82 0.05 230), oklch(0.6 0.08 260)'],
  ['Marrakesh', 'oklch(0.8 0.1 80), oklch(0.65 0.13 50)'],
  ['Oslo', 'oklch(0.85 0.03 250), oklch(0.62 0.05 280)'],
] as const;

/**
 * A photo carousel. With `locked`, a click while a slide is moving is
 * dropped, as Bootstrap's Carousel does; otherwise each click moves the
 * target and the slide turns from where it is.
 */
function Carousel({ locked }: { locked?: boolean }) {
  const [index, setIndex] = useState(0);
  const sliding = useRef(false);
  // The latest target; state alone goes stale between clicks in one frame.
  const target = useRef(0);
  const go = (step: number) => {
    if (locked && sliding.current) return;
    const next = Math.min(SLIDES.length - 1, Math.max(0, target.current + step));
    if (next === target.current) return;
    target.current = next;
    sliding.current = true;
    setIndex(next);
  };
  return (
    <div className={s.intCarousel}>
      <div className={s.intViewport}>
        <div
          className={s.intSlides}
          style={{ translate: `${index * -100}% 0` }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) sliding.current = false;
          }}
        >
          {SLIDES.map(([place, stops]) => (
            <div key={place} className={s.intSlide} style={{ backgroundImage: `linear-gradient(160deg, ${stops})` }}>
              {place}
            </div>
          ))}
        </div>
        <button type="button" className={cx(s.intArrow, s.intArrowPrev)} aria-label="Previous" disabled={index === 0} onClick={() => go(-1)}>
          <ChevronLeft {...ic} />
        </button>
        <button type="button" className={cx(s.intArrow, s.intArrowNext)} aria-label="Next" disabled={index === SLIDES.length - 1} onClick={() => go(1)}>
          <ChevronRight {...ic} />
        </button>
      </div>
      <div className={s.intDots} aria-label={`Photo ${index + 1} of ${SLIDES.length}`}>
        {SLIDES.map(([place], i) => (
          <span key={place} className={s.intDot} data-current={i === index ? '' : undefined} />
        ))}
      </div>
    </div>
  );
}

export const InterruptQueue = localized(function InterruptQueue() {
  return (
    <Compare
      height={0}
      motion
      before={<Carousel locked />}
      after={<Carousel />}
      beforeNote={
        <>
          Click Next three times fast and the carousel moves once: the clicks that land while a slide is moving are dropped. That’s
          Bootstrap’s Carousel, whose <a href="https://github.com/twbs/bootstrap/blob/v5.3.3/js/src/carousel.js">slide method</a> returns
          early while a slide is in progress.
        </>
      }
      afterNote={
        <>
          Each click moves the target on, and the strip turns from where it is: three clicks, three photos. Apple built the iPhone X
          gestures the same way, “a <a href="https://developer.apple.com/videos/play/wwdc2018/803/">fully redirectable interface</a>”.
        </>
      }
    />
  );
});

// ── Keyframes start over ─────────────────────────────────

/**
 * A settings page with an Edit profile sheet. `keyframes` slides it with
 * two @keyframes, as shadcn/ui's Sheet does; otherwise with a transition.
 * Both take shadcn's timing: 500 ms in, 300 ms out, ease-in-out.
 */
function Sheet({ keyframes }: { keyframes?: boolean }) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const set = (next: boolean) => {
    setOpen(next);
    setTouched(true);
  };
  const state = { 'data-open': open ? '' : undefined, 'data-touched': touched ? '' : undefined };
  return (
    <div className={cx(s.intSheetStage, keyframes ? s.intSheetKeys : s.intSheetFluid)} onKeyDown={(e) => e.key === 'Escape' && set(false)}>
      <div className={s.intPage}>
        <span className={s.intPageTitle}>Account</span>
        <span className={s.intPageMeta}>Ada Lovelace · @ada</span>
        <Button size="sm" className={s.intOpen} onClick={() => set(true)}>
          Edit profile
        </Button>
      </div>
      <div className={s.intOverlay} {...state} onClick={() => set(false)} />
      <div className={s.intSheet} role="dialog" aria-label="Edit profile" aria-hidden={!open} {...state}>
        <span className={s.intPageTitle}>Edit profile</span>
        <span className={s.intPageMeta}>Make changes to your profile here.</span>
        <span className={s.intField}>Ada Lovelace</span>
        <span className={s.intField}>@ada</span>
        <Button variant="ghost" size="sm" icon className={s.intClose} aria-label="Close" tabIndex={open ? 0 : -1} onClick={() => set(false)}>
          <X {...ic} />
        </Button>
      </div>
    </div>
  );
}

export const InterruptKeyframes = localized(function InterruptKeyframes() {
  return (
    <Compare
      height={0}
      motion
      before={<Sheet keyframes />}
      after={<Sheet />}
      beforeNote={
        <>
          shadcn/ui’s <a href="https://ui.shadcn.com/docs/components/sheet">Sheet</a> slides in and out with two keyframe animations.
          Open it, then close it at once: the closing animation starts from its own first frame, so the sheet snaps fully open before it
          slides away.
        </>
      }
      afterNote={
        <>
          A transition only knows where it is and where it’s going, so the sheet turns back from where it got to. The way back is shorter,
          too: a reversed transition is cut by how far it went, the spec’s{' '}
          <a href="https://www.w3.org/TR/css-transitions-1/">reversing shortening factor</a>. In Chrome, a 1000 ms move reversed at its
          midpoint came back in 508 ms.
        </>
      }
    />
  );
});

// ── Keep the speed when you turn ─────────────────────────

/**
 * Plots a motion value over the last few seconds: position up the side,
 * time along the bottom. The scale fits what's on screen, at least `span` tall.
 */
function MotionTrace({ value, span: least }: { value: MotionValue<number>; span: number }) {
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
      const vs = samples.map((p) => p.v);
      const mid = (Math.min(...vs) + Math.max(...vs)) / 2;
      const range = Math.max(least, Math.max(...vs) - Math.min(...vs));
      const min = mid - range / 2;
      ctx.strokeStyle = css.getPropertyValue('--ink').trim();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      samples.forEach(({ t, v }, i) => {
        const x = width - ((now - t) / span) * width;
        const y = height - 4 - ((v - min) / range) * (height - 8);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [value, least]);
  return <canvas ref={canvas} className={s.intTrace} aria-hidden />;
}

const PHOTO = 240;
const LAST = -(SLIDES.length - 1) * PHOTO;

/**
 * Photos you swipe through. On release, `curve` settles with a timed ease,
 * which starts from rest whatever the finger was doing; otherwise a physical
 * spring carries the finger's velocity on.
 */
function Swiper({ curve }: { curve?: boolean }) {
  const x = useMotionValue(0);
  const drag = useRef<{ x0: number; start: number; from: number } | null>(null);
  const settle = useRef<ReturnType<typeof animate> | null>(null);
  const [index, setIndex] = useState(0);

  const down = (e: ReactPointerEvent) => {
    settle.current?.stop();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x0: e.clientX, start: x.get(), from: Math.round(-x.get() / PHOTO) };
  };
  const move = (e: ReactPointerEvent) => {
    if (!drag.current) return;
    const raw = drag.current.start + e.clientX - drag.current.x0;
    // Past either end the strip gives a third as much.
    x.set(raw > 0 ? raw / 3 : raw < LAST ? LAST + (raw - LAST) / 3 : raw);
  };
  const up = () => {
    if (!drag.current) return;
    const { from } = drag.current;
    drag.current = null;
    const velocity = x.getVelocity();
    // Where a flick would carry it, one photo at most from where the drag began.
    const aim = Math.round(-(x.get() + velocity * 0.2) / PHOTO);
    const next = Math.min(SLIDES.length - 1, Math.max(0, from - 1, Math.min(from + 1, aim)));
    setIndex(next);
    settle.current = animate(
      x,
      -next * PHOTO,
      curve ? { duration: 0.5, ease: 'easeInOut' } : { type: 'spring', stiffness: 260, damping: 30, velocity },
    );
  };

  return (
    <div className={s.intSwipe}>
      <div className={s.intSwipeViewport} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
        <motion.div className={s.intSwipeStrip} style={{ x }}>
          {SLIDES.map(([place, stops]) => (
            <div key={place} className={s.intSlide} style={{ backgroundImage: `linear-gradient(160deg, ${stops})` }}>
              {place}
            </div>
          ))}
        </motion.div>
      </div>
      <div className={s.intDots} aria-label={`Photo ${index + 1} of ${SLIDES.length}`}>
        {SLIDES.map(([place], i) => (
          <span key={place} className={s.intDot} data-current={i === index ? '' : undefined} />
        ))}
      </div>
      <MotionTrace value={x} span={PHOTO} />
    </div>
  );
}

export const InterruptVelocity = localized(function InterruptVelocity() {
  return (
    <Compare
      height={0}
      before={<Swiper curve />}
      after={<Swiper />}
      beforeNote="Flick a photo and let go. A timed ease starts from rest, so the strip stalls under your finger, then sets off again: the line under it bends at a corner where you let go."
      afterNote={
        <>
          A spring defined by stiffness and damping takes the finger’s speed and carries it on, so the photo leaves your hand in one curve.
          Motion’s physical springs “incorporate the velocity of any existing gestures or animations”; springs set by duration don’t (
          <a href="https://motion.dev/docs/react-transitions">Motion docs</a>).
        </>
      }
    />
  );
});

/** The carousel, caught between two photos. */
export function InterruptPreview() {
  return (
    <div className={cx(s.intCarousel, s.intStill)} aria-hidden>
      <div className={s.intViewport}>
        <div className={s.intSlides} style={{ translate: '-40% 0' }}>
          {SLIDES.slice(0, 2).map(([place, stops]) => (
            <div key={place} className={s.intSlide} style={{ backgroundImage: `linear-gradient(160deg, ${stops})` }}>
              {place}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
