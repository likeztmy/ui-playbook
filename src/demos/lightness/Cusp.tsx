import { useState } from 'react';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { css, maxChroma } from './maths';
import s from './lightness.module.scss';

// Eleven steps from near white to near black, evenly spaced in perceived lightness.
const STEPS = Array.from({ length: 11 }, (_, i) => 0.97 - i * 0.075);
// The bars' full height: more chroma than sRGB holds at any lightness.
const TOP = 0.32;

/** One hue's scale, each step as colourful as sRGB allows. Turn the hue and the peak moves. */
export function LightnessCusp() {
  const [hue, setHue] = useState(256);
  const most = STEPS.map((l) => maxChroma(l, hue));
  const peak = STEPS[most.indexOf(Math.max(...most))];
  return (
    <Tweak
      height={0}
      readout={
        <code className={s.readout}>
          {`hue ${hue}° · most colour at L ${Math.round(peak * 100)}% · L 97% holds C ${most[0].toFixed(3)}`}
        </code>
      }
      stage={
        <div className={s.cusp}>
          {STEPS.map((l, i) => (
            <div key={l} className={s.step}>
              <span className={s.bar}>
                <span style={{ height: `${(most[i] / TOP) * 100}%`, background: css({ l, c: most[i], h: hue }) }} />
              </span>
              <span className={s.stepName}>{Math.round(l * 100)}</span>
            </div>
          ))}
        </div>
      }
      controls={<Slider label="Hue" value={hue} onValueChange={setHue} max={359} unit="°" />}
    />
  );
}
