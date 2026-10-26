import { useState } from 'react';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { apca, css, rgb, wcag, type Lch, type Rgb } from './maths';
import s from './lightness.module.scss';

const HUE = 256;
const LABELS: { name: string; colour: Rgb; css: string }[] = [
  { name: 'White', colour: [1, 1, 1], css: 'oklch(1 0 0)' },
  { name: 'Dark', colour: rgb({ l: 0.18, c: 0.005, h: 270 }), css: 'oklch(18% 0.005 270)' },
];
// APCA's floor for a short label, "other content text" in its Bronze guidance.
const APCA_NEEDS = 60;

/** One blue fill on a dark desk, two labels, two standards' verdicts. Between 59% and 71% they disagree. */
export function LightnessButton() {
  const [l, setL] = useState(62);
  const fill: Lch = { l: l / 100, c: 0.2, h: HUE };
  const scores = LABELS.map((x) => ({ ...x, wcag: wcag(x.colour, rgb(fill)), apca: apca(x.colour, rgb(fill)) }));
  const byWcag = scores[0].wcag >= scores[1].wcag ? 'white' : 'dark';
  const byApca = scores[0].apca >= scores[1].apca ? 'white' : 'dark';
  return (
    <Tweak
      height={0}
      readout={
        <code className={s.readout} data-fails={byWcag !== byApca ? '' : undefined}>
          {byWcag === byApca ? `both standards pick the ${byWcag} label` : `WCAG picks the ${byWcag} label, APCA the ${byApca}`}
        </code>
      }
      stage={
        <div className={s.buttons}>
          {scores.map((x) => (
            <div key={x.name} className={s.buttonCase}>
              <span className={s.fillButton} style={{ background: css(fill), color: x.css }}>
                Send
              </span>
              <span className={s.verdicts}>
                <span className={s.labelName}>{x.name} label</span>
                <span data-fails={x.wcag < 4.5 ? '' : undefined}>WCAG {x.wcag.toFixed(2)}:1</span>
                <span data-fails={x.apca < APCA_NEEDS ? '' : undefined}>APCA Lc {Math.round(x.apca)}</span>
              </span>
            </div>
          ))}
        </div>
      }
      controls={<Slider label="Lightness" value={l} onValueChange={setL} min={45} max={80} unit="%" />}
    />
  );
}
