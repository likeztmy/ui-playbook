import { useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { FaceRow } from './FaceRow';
import { INBOX, shuffled, type Row } from './data';
import s from './faces.module.scss';

// How long the list stays up for a count: a glance, not a read.
const GLANCE = 1200;
// The unread dot's chroma, the accent's.
const DOT = 0.193;

/** Ten rows with two to five unread, drawn fresh for each glance. */
function draw(): Row[] {
  const rows = shuffled(INBOX).slice(0, 10);
  const n = 2 + Math.floor(Math.random() * 4);
  const picked = new Set(shuffled(rows.map((r) => r.id)).slice(0, n));
  return rows.map((r) => ({ ...r, unread: picked.has(r.id) }));
}

type Step = { kind: 'look' } | { kind: 'glance'; rows: Row[] } | { kind: 'answer'; rows: Row[] } | { kind: 'told'; rows: Row[]; said: number };

/** Glance at the list, then say how many are unread: with faces in pastel, then in full colour. */
export function FacesDots() {
  const [chroma, setChroma] = useState(4);
  const [step, setStep] = useState<Step>({ kind: 'look' });
  const [rows, setRows] = useState<Row[]>(() => INBOX.slice(0, 10));
  // After an answer the count buttons go; focus goes back to the button that starts another glance.
  const again = useRef<HTMLButtonElement>(null);
  const answer = (rows: Row[], said: number) => {
    setStep({ kind: 'told', rows, said });
    requestAnimationFrame(() => again.current?.focus());
  };
  const c = chroma / 100;

  const glance = () => {
    const next = draw();
    setRows(next);
    setStep({ kind: 'glance', rows: next });
    setTimeout(() => setStep({ kind: 'answer', rows: next }), GLANCE);
  };
  const real = 'rows' in step ? step.rows.filter((r) => r.unread).length : 0;
  const readout =
    step.kind === 'told'
      ? step.said === real
        ? `right: ${real} unread`
        : `${real} unread, not ${step.said}`
      : `face chroma ${c.toFixed(2)} · ${(c / DOT).toFixed(1)}× the dot’s`;

  return (
    <Tweak
      height={0}
      readout={
        <code className={s.readout} data-off={step.kind === 'told' && step.said !== real ? '' : undefined}>
          {readout}
        </code>
      }
      stage={
        <div className={s.dots}>
          <div className={s.column} data-hidden={step.kind === 'answer' ? '' : undefined} aria-hidden={step.kind === 'answer' || undefined}>
            {rows.map((r) => (
              <FaceRow key={r.id} row={r} chroma={c} />
            ))}
          </div>
          {step.kind === 'answer' && (
            <div className={s.ask} role="group" aria-label="How many were unread?">
              <p>How many were unread?</p>
              <div className={s.counts}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <Button key={n} autoFocus={n === 1} onClick={() => answer(step.rows, n)}>
                    {n}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      }
      controls={
        <>
          <Slider label="Face colour" value={chroma} onValueChange={setChroma} max={20} />
          <Button ref={again} variant="primary" onClick={glance} disabled={step.kind === 'glance'} className={s.full}>
            {step.kind === 'look' ? 'Glance at the list' : 'Another glance'}
          </Button>
        </>
      }
    />
  );
}
