import { useState, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { CheckIcon, ContrastIcon, CrossIcon } from '../ui/icons';
import { BoldNav, DocSearch } from './shift';
import s from './frames-lab.module.scss';

type Theme = 'light' | 'dark' | undefined;
type Side = { node: ReactNode; note: ReactNode };
type Pair = { before: Side; after: Side };

const flip = (t: Theme): Theme => ((t ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')) === 'dark' ? 'light' : 'dark');

function ThemeButton({ onClick, className }: { onClick: () => void; className?: string }) {
  return (
    <Button variant="ghost" size="sm" icon aria-label="Switch theme" onClick={onClick} className={className}>
      <ContrastIcon />
    </Button>
  );
}

function Verdict({ good }: { good?: boolean }) {
  return (
    <span className={s.verdict} data-good={good ? '' : undefined}>
      {good ? <CheckIcon size={14} /> : <CrossIcon size={14} />}
      {good ? 'After' : 'Before'}
    </span>
  );
}

// ── A: Material's Do / Don't ─────────────────────────────

function CardA({ side, good }: { side: Side; good?: boolean }) {
  const [theme, setTheme] = useState<Theme>();
  return (
    <figure className={s.a}>
      <div className={s.aCard} data-theme={theme}>
        <div className={s.aStage}>{side.node}</div>
        <div className={s.aBand} data-good={good ? '' : undefined}>
          <Verdict good={good} />
          <ThemeButton onClick={() => setTheme(flip)} />
        </div>
      </div>
      <figcaption className={s.caption}>{side.note}</figcaption>
    </figure>
  );
}

// ── B: a quiet stage ─────────────────────────────────────

function CardB({ side, good }: { side: Side; good?: boolean }) {
  const [theme, setTheme] = useState<Theme>();
  return (
    <figure className={s.b}>
      <div className={s.bStage} data-theme={theme}>
        <span className={s.bChip}>
          <Verdict good={good} />
        </span>
        <ThemeButton onClick={() => setTheme(flip)} className={s.bTheme} />
        {side.node}
      </div>
      <figcaption className={s.caption}>{side.note}</figcaption>
    </figure>
  );
}

// ── C: one card, two columns ─────────────────────────────

function PairC({ pair }: { pair: Pair }) {
  const [theme, setTheme] = useState<Theme>();
  const sides = [pair.before, pair.after];
  return (
    <figure className={s.c} data-theme={theme}>
      <div className={s.cHead}>
        <Verdict />
        <Verdict good />
        <ThemeButton onClick={() => setTheme(flip)} className={s.cTheme} />
      </div>
      <div className={s.cBody}>
        {sides.map((side, i) => (
          <div key={i} className={s.cCol}>
            {i === 1 && (
              <span className={s.cMobileVerdict}>
                <Verdict good />
              </span>
            )}
            <div className={s.cStage}>{side.node}</div>
            <p className={s.cNote}>{side.note}</p>
          </div>
        ))}
      </div>
    </figure>
  );
}

// ── The same two cases in each ───────────────────────────

const PAIRS: Pair[] = [
  {
    before: {
      node: <DocSearch />,
      note: 'The best pages from the whole index land 0.7 seconds after the last key, as a group above the recent ones. By then the pointer is on its way to a recent page, and the row it reaches is something else.',
    },
    after: {
      node: <DocSearch keep />,
      note: 'The same group, after the rows already on screen. What the reader was aiming at stays where it was.',
    },
  },
  {
    before: { node: <BoldNav />, note: 'Bold glyphs are wider. Each link the pointer crosses grows, and every link after it moves along.' },
    after: { node: <BoldNav reserve />, note: 'Each link also holds an invisible bold copy of its own name, so it is as wide as it will ever get.' },
  },
];

export function FramesA() {
  return (
    <div className={s.stack}>
      {PAIRS.map((p, i) => (
        <div key={i} className={s.grid}>
          <CardA side={p.before} />
          <CardA side={p.after} good />
        </div>
      ))}
    </div>
  );
}

export function FramesB() {
  return (
    <div className={s.stack}>
      {PAIRS.map((p, i) => (
        <div key={i} className={s.grid}>
          <CardB side={p.before} />
          <CardB side={p.after} good />
        </div>
      ))}
    </div>
  );
}

export function FramesC() {
  return (
    <div className={s.stack}>
      {PAIRS.map((p, i) => (
        <PairC key={i} pair={p} />
      ))}
    </div>
  );
}

