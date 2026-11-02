import { cx } from '../../ui/cx';
import { Slide } from './Slide';
import { SLIDES } from './slides';
import s from './interrupt.module.scss';

/** The carousel, caught between two photos. */
export function InterruptPreview() {
  return (
    <div className={cx(s.intCarousel, s.intStill)} aria-hidden>
      <div className={s.intViewport}>
        <div className={s.intSlides} style={{ translate: '-40% 0' }}>
          {SLIDES.slice(0, 2).map(([place, stops]) => (
            <Slide key={place} place={place} stops={stops} />
          ))}
        </div>
      </div>
    </div>
  );
}
