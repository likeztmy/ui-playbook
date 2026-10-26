import { css } from './maths';
import s from './lightness.module.scss';

const HUES = [25, 70, 145, 200, 256, 320];

/** The home page's card: six hues at one OKLCH lightness, and under them the same six without colour. */
export function LightnessPreview() {
  const chips = HUES.map((h) => css({ l: 0.62, c: 0.13, h }));
  return (
    <div className={s.preview} aria-hidden>
      {[...chips, ...chips].map((fill, i) => (
        <span key={i} style={{ background: fill }} />
      ))}
    </div>
  );
}
