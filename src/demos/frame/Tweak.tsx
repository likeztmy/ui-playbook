import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { SliderPanel } from '../../ui/Slider';
import { Frame, type Theme } from './Frame';
import s from '../shell.module.scss';

type TweakProps = {
  stage: ReactNode;
  controls: ReactNode;
  readout?: ReactNode;
  height?: number;
  /** The stage's theme at first, for a stage that only makes sense in one. */
  defaultTheme?: Theme;
};

/** A live stage beside a panel of dials. */
export function Tweak({ stage, controls, readout, height = 280, defaultTheme }: TweakProps) {
  // The dials start on the stage's top edge, below the label's row however many lines it takes.
  const root = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = root.current;
    const caption = el?.querySelector(':scope > figure > figcaption');
    if (!el || !caption) return;
    const place = () => el.style.setProperty('--caption', `${caption.getBoundingClientRect().height}px`);
    place();
    const ro = new ResizeObserver(place);
    ro.observe(caption);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={root} className={s.tweak}>
      <Frame label={readout} height={height} defaultTheme={defaultTheme}>
        {stage}
      </Frame>
      <SliderPanel className={s.panel}>{controls}</SliderPanel>
    </div>
  );
}
