import { useRef, useState } from 'react';
import { Slider } from '../../ui/Slider';
import { LETTER } from '../post/letter';
import { Tweak } from '../shell';
import { useCharsPerLine } from './lines';
import s from './reading.module.scss';

const ROWS = [
  { from: 'Sam Lee', subject: 'Back from the coast', time: 'Sun' },
  { from: 'Chidi Eze', subject: 'Retro: what slowed us down', time: 'Sun' },
];

/** One line height for a long paragraph and two list rows. Only the paragraph has a next line to find. */
export function ReadingLeading() {
  const [lh, setLh] = useState(150);
  const ref = useRef<HTMLDivElement>(null);
  const cpl = useCharsPerLine(ref, [lh]);
  const lineHeight = lh / 100;
  return (
    <Tweak
      height={0}
      readout={<code className={s.readout}>{`line height ${lineHeight.toFixed(2)} · paragraph ≈ ${cpl} characters a line`}</code>}
      stage={
        <div className={s.leading} style={{ lineHeight }}>
          <div ref={ref} className={s.wide}>
            <p>{LETTER[2]}</p>
          </div>
          <div className={s.rows}>
            {ROWS.map((r) => (
              <div key={r.from} className={s.row}>
                <span className={s.rowFrom}>{r.from}</span>
                <span className={s.rowSubject}>{r.subject}</span>
                <span className={s.rowTime}>{r.time}</span>
              </div>
            ))}
          </div>
        </div>
      }
      controls={<Slider label="Line height" value={lh} onValueChange={setLh} min={90} max={220} step={5} unit="%" />}
    />
  );
}
