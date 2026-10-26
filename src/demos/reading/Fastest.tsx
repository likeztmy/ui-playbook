import { useRef, useState, type CSSProperties } from 'react';
import { Button } from '../../ui/Button';
import { Frame } from '../shell';
import s from './reading.module.scss';

type Face = { name: string; family: string };

// Three faces most screens already have, matched by x-height as Wallace et al. matched theirs, so the
// bigger-looking one doesn't win on size alone.
const FACES: Face[] = [
  { name: 'Geist', family: 'var(--font-sans)' },
  { name: 'Your system’s serif', family: 'ui-serif, "New York", Georgia, "Times New Roman", serif' },
  { name: 'Your system’s sans', family: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif' },
];

// Three passages of about the same length and difficulty, one per face.
const PASSAGES = [
  'The market opens before the sun is fully up. By six the fish stalls are already busy, the ice shining under bare bulbs, and the women who sell bread have laid out the first loaves on cloth. Most people buy the same things every week and barely need to speak. A nod, a coin, a paper bag, and they move on to the next stall, where the oranges are piled in careful pyramids.',
  'The library was built for a town twice the size it is now. Its reading room has tall windows on three sides, so the light moves across the long tables as the day goes on. In winter the radiators knock and hiss, and students sit closest to them. Nobody minds the noise. The librarian has worked there for thirty years and still knows where every map and almanac is kept.',
  'The ferry crosses the bay four times a day in summer and twice in winter. It takes forty minutes, longer if the wind is from the west. Regulars stand on the open deck whatever the weather, while visitors stay inside and watch the harbour shrink through the salt on the glass. Halfway across there is a moment when neither shore seems closer, and the engine is the only sound.',
];

const words = (t: string) => t.split(/\s+/).length;

type Step = { kind: 'pick' } | { kind: 'ready'; i: number } | { kind: 'reading'; i: number; start: number } | { kind: 'done' };

const faceStyle = (f: Face) => ({ fontFamily: f.family, fontSizeAdjust: 'ex-height 0.53' }) as CSSProperties;

/** Pick the face that reads best to you, then read one passage in each and see which was fastest. */
export function ReadingFastest() {
  const [step, setStep] = useState<Step>({ kind: 'pick' });
  const [favourite, setFavourite] = useState<number | null>(null);
  // Which face each passage is set in, shuffled at the start so order doesn't decide the winner.
  const order = useRef<number[]>([0, 1, 2]);
  const [wpm, setWpm] = useState<number[]>([]);

  const begin = (pick: number) => {
    setFavourite(pick);
    order.current = [0, 1, 2].sort(() => Math.random() - 0.5);
    setWpm([]);
    setStep({ kind: 'ready', i: 0 });
  };
  const finish = (i: number, start: number) => {
    const minutes = (performance.now() - start) / 60000;
    const face = order.current[i];
    setWpm((w) => {
      const next = [...w];
      next[face] = Math.round(words(PASSAGES[i]) / minutes);
      return next;
    });
    setStep(i < 2 ? { kind: 'ready', i: i + 1 } : { kind: 'done' });
  };

  const fastest = wpm.length === 3 ? wpm.indexOf(Math.max(...wpm)) : -1;
  // Past about 900 words a minute it's skimming, and the race says nothing about reading.
  const skimmed = wpm.some((w) => w > 900);
  const label =
    step.kind === 'pick'
      ? 'Which reads best to you?'
      : step.kind === 'done'
        ? skimmed
          ? 'Faster than anyone reads: try again at your usual pace'
          : fastest === favourite
          ? 'Your favourite was your fastest: it is, for one reader in five'
          : 'Your fastest face wasn’t your favourite'
        : `Passage ${step.i + 1} of 3`;

  return (
    <Frame label={label} height={0}>
      <div className={s.fastest}>
        {step.kind === 'pick' && (
          <div className={s.faces}>
            {FACES.map((f, i) => (
              <button key={f.name} type="button" className={s.face} onClick={() => begin(i)}>
                <span className={s.faceSample} style={faceStyle(f)}>
                  Halfway across, neither shore seems closer.
                </span>
                <span className={s.faceName}>{f.name}</span>
              </button>
            ))}
          </div>
        )}

        {step.kind === 'ready' && (
          <div className={s.ready}>
            <p>Read the next passage at your usual pace, for its sense, then press Done.</p>
            {/* Focus follows each step: the control that moves it on is the one under the hand. */}
            <Button variant="primary" autoFocus onClick={() => setStep({ kind: 'reading', i: step.i, start: performance.now() })}>
              Start passage {step.i + 1}
            </Button>
          </div>
        )}

        {step.kind === 'reading' && (
          <div className={s.passage}>
            <p style={faceStyle(FACES[order.current[step.i]])}>{PASSAGES[step.i]}</p>
            <Button autoFocus onClick={() => finish(step.i, step.start)}>
              Done
            </Button>
          </div>
        )}

        {step.kind === 'done' && (
          <div className={s.results}>
            {FACES.map((f, i) => (
              <div key={f.name} className={s.result} data-fastest={i === fastest && !skimmed ? '' : undefined}>
                <span style={faceStyle(f)}>{f.name}</span>
                <span className={s.resultMeta}>
                  {i === favourite && 'Your favourite · '}
                  {wpm[i]} words a minute
                </span>
              </div>
            ))}
            <Button variant="ghost" autoFocus onClick={() => setStep({ kind: 'pick' })}>
              Try again
            </Button>
          </div>
        )}
      </div>
    </Frame>
  );
}
