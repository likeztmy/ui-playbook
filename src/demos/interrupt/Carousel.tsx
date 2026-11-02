import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../ui/cx';
import { Tip } from '../../ui/Tooltip';
import { Compare, localized } from '../shell';
import { Slide } from './Slide';
import { SLIDES } from './slides';
import s from './interrupt.module.scss';

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
  const prev = useRef<HTMLButtonElement>(null);
  const next = useRef<HTMLButtonElement>(null);
  const go = (step: number) => {
    if (locked && sliding.current) return;
    const to = Math.min(SLIDES.length - 1, Math.max(0, target.current + step));
    if (to === target.current) return;
    target.current = to;
    sliding.current = true;
    setIndex(to);
  };
  // An arrow goes at its end. If it had focus, the other arrow takes it, so focus never falls to <body>.
  useEffect(() => {
    const active = document.activeElement;
    const gone = index === 0 ? prev.current : index === SLIDES.length - 1 ? next.current : null;
    if (gone && (active === gone || active === document.body)) (gone === prev.current ? next : prev).current?.focus();
  }, [index]);
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
            <Slide key={place} place={place} stops={stops} />
          ))}
        </div>
        <Tip label="Previous">
          <button
            ref={prev}
            type="button"
            className={cx(s.intArrow, s.intArrowPrev)}
            aria-label="Previous"
            disabled={index === 0}
            onClick={() => go(-1)}
          >
            <ChevronLeft size={16} aria-hidden />
          </button>
        </Tip>
        <Tip label="Next">
          <button
            ref={next}
            type="button"
            className={cx(s.intArrow, s.intArrowNext)}
            aria-label="Next"
            disabled={index === SLIDES.length - 1}
            onClick={() => go(1)}
          >
            <ChevronRight size={16} aria-hidden />
          </button>
        </Tip>
      </div>
      <div className={s.intDots} role="img" aria-label={`Photo ${index + 1} of ${SLIDES.length}`}>
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
      beforeLabel="Drops clicks mid-slide"
      afterLabel="Each click moves the target"
      height={0}
      motion
      before={<Carousel locked />}
      after={<Carousel />}
      beforeNote={
        <>
          Click Next three times fast and the carousel moves once: the clicks that land while a slide is moving are dropped. That’s Bootstrap’s
          Carousel, whose <a href="https://github.com/twbs/bootstrap/blob/v5.3.3/js/src/carousel.js">slide method</a> returns early while a slide is
          in progress.
        </>
      }
      afterNote={
        <>
          Each click moves the target on, and the strip turns from where it is: three clicks, three photos. Apple built the iPhone X gestures the same
          way, “a <a href="https://developer.apple.com/videos/play/wwdc2018/803/">fully redirectable interface</a>”.
        </>
      }
    />
  );
});
