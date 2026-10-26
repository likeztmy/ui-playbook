import { useRef, useState } from 'react';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Slider } from '../../ui/Slider';
import { LETTER } from '../post/letter';
import { Tweak } from '../shell';
import { useCharsPerLine } from './lines';
import s from './reading.module.scss';

type Set = 'Interface' | 'Reading';

// Geist's zero is 0.66em wide and its average character of prose 0.449em, so 1ch ≈ 1.48 characters.
const CH_PER_EM = 1 / 0.665;

/** Sam's letter, set as the list's text or as reading text, at a measure you choose. */
export function ReadingMeasure() {
  const [set, setSet] = useState<Set>('Interface');
  const [measure, setMeasure] = useState(60);
  const ref = useRef<HTMLDivElement>(null);
  const cpl = useCharsPerLine(ref, [set, measure]);
  return (
    <Tweak
      height={0}
      readout={
        <code className={s.readout} data-off={cpl > 75 || cpl < 45 ? '' : undefined}>
          {`≈ ${cpl} characters a line · ${measure}em is ${Math.round(measure * CH_PER_EM)}ch`}
        </code>
      }
      stage={
        <div ref={ref} className={s.letter} data-set={set} style={{ maxWidth: `${measure}em` }}>
          {LETTER.slice(1, 4).map((t) => (
            <p key={t}>{t}</p>
          ))}
        </div>
      }
      controls={
        <>
          <SegmentedControl
            label="Set as"
            value={set}
            onValueChange={setSet}
            segments={[
              { value: 'Interface', label: 'Interface' },
              { value: 'Reading', label: 'Reading' },
            ]}
            className={s.full}
          />
          <Slider label="Measure" value={measure} onValueChange={setMeasure} min={20} max={60} unit="em" />
        </>
      }
    />
  );
}
