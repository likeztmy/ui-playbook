import { animate, motion, useMotionValue } from 'motion/react';
import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Compare, localized } from '../shell';
import { MotionTrace } from './MotionTrace';
import { Slide } from './Slide';
import { SLIDES } from './slides';
import s from './interrupt.module.scss';

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
            <Slide key={place} place={place} stops={stops} />
          ))}
        </motion.div>
      </div>
      <div className={s.intDots} role="img" aria-label={`Photo ${index + 1} of ${SLIDES.length}`}>
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
      beforeLabel="Timed ease from rest"
      afterLabel="Spring carries the velocity"
      height={0}
      before={<Swiper curve />}
      after={<Swiper />}
      beforeNote="Flick a photo and let go. A timed ease starts from rest, so the strip stalls under your finger, then sets off again: the line under it bends at a corner where you let go."
      afterNote={
        <>
          A spring defined by stiffness and damping takes the finger’s speed and carries it on, so the photo leaves your hand in one curve. Motion’s
          physical springs “incorporate the velocity of any existing gestures or animations”; springs set by duration don’t (
          <a href="https://motion.dev/docs/react-transitions">Motion docs</a>).
        </>
      }
    />
  );
});
