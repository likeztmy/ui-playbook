import { useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { hue } from '../post/Avatar';
import { person, shortName } from '../post/people';
import { Frame } from '../shell';
import { FaceRow } from './FaceRow';
import { INBOX, median, shuffled, type Row } from './data';
import s from './faces.module.scss';

type Condition = 'Names only' | 'Coloured initials' | 'Grey initials';
const CONDITIONS: Condition[] = ['Names only', 'Coloured initials', 'Grey initials'];
const ROUNDS = 5;
// Twelve rows: enough to search, short enough to see whole.
const SIZE = 12;
// People with one conversation in the inbox, so "their message" is one row.
const TARGETS = [...new Set(INBOX.filter((r) => !r.org).map((r) => r.face))].filter((f) => INBOX.filter((r) => r.face === f).length === 1);

type Trial = { condition: Condition; target: string; rows: Row[] };

/** Fifteen trials, five per condition, interleaved so practice helps each the same. */
function trials(): Trial[] {
  const out: Trial[] = [];
  for (let round = 0; round < ROUNDS; round++) {
    for (const condition of shuffled(CONDITIONS)) {
      const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      const others = shuffled(INBOX.filter((r) => r.face !== target)).slice(0, SIZE - 1);
      out.push({ condition, target, rows: shuffled([INBOX.find((r) => r.face === target)!, ...others]) });
    }
  }
  return out;
}

type Step = { kind: 'intro' } | { kind: 'ready'; i: number } | { kind: 'search'; i: number; start: number } | { kind: 'done' };

/** Find a named person's message, fifteen times, with faces, names alone or grey initials. */
export function FacesFind() {
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const plan = useRef<Trial[]>([]);
  const [times, setTimes] = useState<Record<Condition, number[]>>({ 'Names only': [], 'Coloured initials': [], 'Grey initials': [] });
  const [misses, setMisses] = useState(0);

  const begin = () => {
    plan.current = trials();
    setTimes({ 'Names only': [], 'Coloured initials': [], 'Grey initials': [] });
    setMisses(0);
    setStep({ kind: 'ready', i: 0 });
  };
  const pick = (row: Row, i: number, start: number) => {
    const t = plan.current[i];
    if (row.face !== t.target) return setMisses((m) => m + 1);
    const ms = performance.now() - start;
    setTimes((all) => ({ ...all, [t.condition]: [...all[t.condition], ms] }));
    setStep(i + 1 < plan.current.length ? { kind: 'ready', i: i + 1 } : { kind: 'done' });
  };

  const trial = step.kind === 'ready' || step.kind === 'search' ? plan.current[step.i] : null;
  const label =
    step.kind === 'intro'
      ? 'Find a message by who sent it'
      : step.kind === 'done'
        ? 'Your median time in each'
        : `${step.i + 1} of ${ROUNDS * CONDITIONS.length} · ${trial!.condition}`;

  return (
    <Frame label={label} height={0}>
      <div className={s.find}>
        {step.kind === 'intro' && (
          <div className={s.prompt}>
            <p>Fifteen times, open the message from the person named. Rows shuffle each time; some show faces, some only names.</p>
            <Button variant="primary" onClick={begin}>
              Start
            </Button>
          </div>
        )}

        {step.kind === 'ready' && trial && (
          <div className={s.prompt}>
            <p className={s.target}>Open {shortName(trial.target)}’s message</p>
            {/* Focus follows each step: the control that moves it on is the one under the hand. */}
            <Button variant="primary" autoFocus onClick={() => setStep({ kind: 'search', i: step.i, start: performance.now() })}>
              Show the list
            </Button>
          </div>
        )}

        {step.kind === 'search' && trial && (
          <div className={s.list}>
            <p className={s.target}>Open {shortName(trial.target)}’s message</p>
            {trial.rows.map((r) => (
              <FaceRow
                key={r.id}
                row={r}
                lead={trial.condition === 'Names only' ? 'none' : 'face'}
                chroma={trial.condition === 'Grey initials' ? 0 : undefined}
                onClick={() => pick(r, step.i, step.start)}
              />
            ))}
          </div>
        )}

        {step.kind === 'done' && (
          <div className={s.results}>
            {CONDITIONS.map((c) => (
              <div key={c} className={s.result}>
                <span>{c}</span>
                <span className={s.resultTime}>{(median(times[c]) / 1000).toFixed(2)} s</span>
              </div>
            ))}
            <p className={s.note}>
              {misses ? `${misses} wrong ${misses === 1 ? 'row' : 'rows'} opened. ` : ''}
              {sharing()}
            </p>
            <Button variant="ghost" autoFocus onClick={begin}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </Frame>
  );
}

/** Who shares a colour with whom: more people than hues, so some pairs are certain. */
function sharing() {
  const people = [...new Set(INBOX.filter((r) => !r.org).map((r) => r.face))];
  const byHue = new Map<number, string[]>();
  for (const id of people) byHue.set(hue(person(id).email), [...(byHue.get(hue(person(id).email)) ?? []), shortName(id)]);
  const shared = [...byHue.values()].filter((names) => names.length > 1).map((names) => names.join(' and '));
  const companies = INBOX.filter((r) => r.org).length;
  const pairs = shared.length ? `${shared.join('; ')} share one` : 'each has their own';
  return `${people.length} people on ${byHue.size} hues: ${pairs}. ${companies} of the ${INBOX.length} rows are companies, all on grey.`;
}
