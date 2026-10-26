import { useState } from 'react';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { css } from './maths';
import { Screen, type Palette } from './Screen';
import s from './lightness.module.scss';

type Hue = 'Accent’s' | 'Opposite';

// The accent is the playbook's blue; the opposite hue is the warm one Post's desk uses.
const ACCENT = { l: 0.563, c: 0.193, h: 256 };
const HUE: Record<Hue, number> = { 'Accent’s': 256, Opposite: 75 };

function palette(tint: number, h: number): Palette {
  return {
    ground: css({ l: 0.95, c: tint, h }),
    surface: css({ l: 0.995, c: tint * 0.3, h }),
    line: css({ l: 0.91, c: tint, h }),
    ink: css({ l: 0.24, c: tint * 1.5, h }),
    muted: css({ l: 0.5, c: tint * 1.5, h }),
    accent: css(ACCENT),
    onAccent: 'oklch(1 0 0)',
    accentSoft: css({ l: 0.95, c: 0.03, h: 256 }),
  };
}

/** The same screen with its greys tinted: too little to name in a swatch, enough to change the whole. */
export function LightnessTint() {
  const [tint, setTint] = useState(6);
  const [hue, setHue] = useState<Hue>('Accent’s');
  const c = tint / 1000;
  return (
    <Tweak
      height={0}
      readout={<code className={s.readout}>{tint ? `greys at C ${c.toFixed(3)}, hue ${HUE[hue]}°` : 'greys at C 0: no hue at all'}</code>}
      stage={<Screen palette={palette(c, HUE[hue])} />}
      controls={
        <>
          <Slider label="Tint" value={tint} onValueChange={setTint} max={30} />
          <SegmentedControl
            label="Hue"
            value={hue}
            onValueChange={setHue}
            segments={[
              { value: 'Accent’s', label: 'Accent’s' },
              { value: 'Opposite', label: 'Opposite' },
            ]}
            className={s.full}
          />
        </>
      }
    />
  );
}
