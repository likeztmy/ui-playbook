import { useState, type CSSProperties } from 'react';
import { Button } from '../../ui/Button';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import s from './pilot.module.scss';

// The playbook's press: press-scale 0.97, down in 80ms, back on the snappy spring.
const OURS = { depth: 97, down: 80, back: 394 };

/** What the reader's numbers feel like, judged at the edges the page names. */
function verdict({ depth, down, back }: typeof OURS) {
  if (depth < 95) return 'Below 0.95 you watch the button, not the click';
  if (depth > 99) return 'Too little to feel';
  if (down > 150) return 'The press lags the finger';
  if (back < 120) return 'It snaps back hard';
  return 'Felt more than seen';
}

/** One pair of buttons, and the three numbers that make a press. */
export function PilotPress() {
  const [v, setV] = useState(OURS);
  const set = (k: keyof typeof OURS) => (n: number) => setV((o) => ({ ...o, [k]: n }));
  const style = { '--depth': v.depth / 100, '--down': `${v.down}ms`, '--back': `${v.back}ms` } as CSSProperties;
  return (
    <Tweak
      height={200}
      readout={<code className={s.readout}>{verdict(v)}</code>}
      stage={
        <div className={s.pressRow} style={style}>
          <Button className={s.tuned}>Duplicate</Button>
          <Button variant="primary" className={s.tuned}>
            Save changes
          </Button>
        </div>
      }
      controls={
        <>
          <Slider label="Depth" value={v.depth} onValueChange={set('depth')} min={85} max={100} step={1} unit="%" />
          <Slider label="Down" value={v.down} onValueChange={set('down')} min={0} max={300} step={10} unit="ms" />
          <Slider label="Back" value={v.back} onValueChange={set('back')} min={0} max={800} step={10} unit="ms" />
          <Button size="sm" variant="ghost" onClick={() => setV(OURS)}>
            Use the playbook’s
          </Button>
        </>
      }
    />
  );
}
