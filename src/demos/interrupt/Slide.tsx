import type { CSSProperties } from 'react';
import s from './interrupt.module.scss';

/** One photo stand-in, its place's name on a scrim along the bottom. */
export function Slide({ place, stops }: { place: string; stops: string }) {
  return (
    <div className={s.intSlide} style={{ '--stops': stops } as CSSProperties}>
      {place}
    </div>
  );
}
