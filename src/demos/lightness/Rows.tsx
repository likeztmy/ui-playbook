import { useState } from 'react';
import { Switch } from '../../ui/Switch';
import { Frame } from '../shell';
import { css, oklchFromRgb, rgb, rgbFromHsl, wcag, WHITE, type Rgb } from './maths';
import s from './lightness.module.scss';

const HUES = [0, 30, 60, 120, 180, 240, 270, 300];

// One lightness written two ways. HSL's 50% is the mean of the channels; OKLCH's 55% is lightness as
// seen, low enough for a white label on every hue: 4.6:1 to 5.2:1 (a grey needs 56.8% or less).
const ROWS: { name: string; chips: { fill: string; rgb: Rgb }[] }[] = [
  {
    name: 'hsl(h 100% 50%)',
    chips: HUES.map((h) => ({ fill: `hsl(${h} 100% 50%)`, rgb: rgbFromHsl(h, 1, 0.5) })),
  },
  {
    name: 'oklch(55% 0.13 h)',
    chips: HUES.map((h) => {
      // The same hue as the HSL chip above it, as OKLCH measures hue.
      const x = { l: 0.55, c: 0.13, h: oklchFromRgb(rgbFromHsl(h, 1, 0.5)).h };
      return { fill: css(x), rgb: rgb(x) };
    }),
  },
];

/** Eight hues at one nominal lightness, twice: HSL's and OKLCH's. Without colour, only one row is one grey. */
export function LightnessRows() {
  const [grey, setGrey] = useState(false);
  return (
    <Frame label="Eight hues, one lightness each row" height={0}>
      <div className={s.rows}>
        {ROWS.map((row) => (
          <div key={row.name} className={s.row}>
            <span className={s.rowName}>{row.name}</span>
            <div className={s.chips} data-grey={grey ? '' : undefined}>
              {row.chips.map((c) => {
                const ratio = wcag(WHITE, c.rgb);
                return (
                  <span key={c.fill} className={s.chip}>
                    <span className={s.swatch} style={{ background: c.fill }}>
                      Aa
                    </span>
                    <span className={s.ratio} data-fails={ratio < 4.5 ? '' : undefined}>
                      {ratio.toFixed(1)}
                    </span>
                  </span>
                );
              })}
            </div>
          </div>
        ))}
        <Switch label="Without colour" placement="start" checked={grey} onCheckedChange={setGrey} className={s.rowsSwitch} />
      </div>
    </Frame>
  );
}
