import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { useState } from 'react';
import { Frame } from '../../shell';
import { CASES } from './list';
import c from './cases.module.scss';

/** Pick a case (a radio group of pills); the phone shows it live, and the band says whether a sheet is right for it, and why. */
export function SheetCases() {
  const [id, setId] = useState(CASES[0].id);
  const x = CASES.find((y) => y.id === id)!;
  const group = (good: boolean) => (
    <div className={c.group} role="group" aria-label={good ? 'Good' : 'Bad'}>
      <span className={c.groupLabel}>{good ? 'Good' : 'Bad'}</span>
      {CASES.filter((y) => y.good === good).map((y) => (
        <Radio.Root key={y.id} value={y.id} className={c.pick}>
          {y.label}
        </Radio.Root>
      ))}
    </div>
  );
  return (
    <Frame label={`${x.good ? 'Good' : 'Bad'}: ${x.label.toLowerCase()}`} tone={x.good ? 'good' : 'bad'} height={0}>
      <div className={c.cases}>
        <div className={c.picker}>
          {/* One choice of nine: one Tab stop, arrows move and choose. */}
          <RadioGroup className={c.groups} aria-label="Case" value={id} onValueChange={(v) => setId(v as string)}>
            {group(true)}
            {group(false)}
          </RadioGroup>
          <p className={c.why}>{x.why}</p>
        </div>
        <x.Scene key={x.id} />
      </div>
    </Frame>
  );
}
