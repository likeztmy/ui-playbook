import { useState } from 'react';
import { Frame } from '../../shell';
import { CASES } from './list';
import c from './cases.module.scss';

/** Pick a case; the phone shows it live, and the band says whether a sheet is right for it, and why. */
export function SheetCases() {
  const [id, setId] = useState(CASES[0].id);
  const x = CASES.find((y) => y.id === id)!;
  const group = (good: boolean) => (
    <div className={c.group} role="group" aria-label={good ? 'Good' : 'Bad'}>
      <span className={c.groupLabel}>{good ? 'Good' : 'Bad'}</span>
      {CASES.filter((y) => y.good === good).map((y) => (
        <button key={y.id} type="button" className={c.pick} aria-pressed={y.id === id} onClick={() => setId(y.id)}>
          {y.label}
        </button>
      ))}
    </div>
  );
  return (
    <Frame label={`${x.good ? 'Good' : 'Bad'}: ${x.label.toLowerCase()}`} tone={x.good ? 'good' : 'bad'} height={0}>
      <div className={c.cases}>
        <div className={c.picker}>
          {group(true)}
          {group(false)}
          <p className={c.why}>{x.why}</p>
        </div>
        <x.Scene key={x.id} />
      </div>
    </Frame>
  );
}
