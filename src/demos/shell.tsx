import { useState, type ReactNode } from 'react';
import { PortalContainer } from '../ui/portal';
import { Button } from '../ui/Button';
import { CheckIcon, ContrastIcon, CrossIcon } from '../ui/icons';
import { DialPanel } from '../ui/Dial';
import { cx } from '../ui/cx';
import s from './shell.module.scss';

type Theme = 'light' | 'dark';

function pageTheme(): Theme {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === 'light' || pinned === 'dark') return pinned;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type FrameProps = {
  label?: ReactNode;
  children: ReactNode;
  /** Stage height in px. */
  height?: number;
  className?: string;
};

/** A demo stage with its own light/dark switch. Popups stay inside it. */
export function Frame({ label, children, height = 200, className }: FrameProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  // Read at click time: the page theme may have changed since render.
  const flip = () => setTheme((t) => ((t ?? pageTheme()) === 'dark' ? 'light' : 'dark'));

  return (
    <figure className={cx(s.frame, className)} data-theme={theme ?? undefined}>
      <div className={s.bar}>
        <span className={s.label}>{label}</span>
        <Button variant="ghost" size="sm" icon aria-label="Switch this demo's theme" title="Switch theme" onClick={flip}>
          <ContrastIcon />
        </Button>
      </div>
      <div className={s.stage} style={{ minHeight: height }}>
        <PortalContainer.Provider value={portal}>{children}</PortalContainer.Provider>
      </div>
      <div ref={setPortal} />
    </figure>
  );
}

type CompareProps = {
  before: ReactNode;
  after: ReactNode;
  beforeNote: string;
  afterNote: string;
  height?: number;
};

/** The same thing twice: the common version and the better one. */
export function Compare({ before, after, beforeNote, afterNote, height }: CompareProps) {
  return (
    <div className={s.compare}>
      <div className={s.side}>
        <Frame label={<Verdict good={false} />} height={height}>
          {before}
        </Frame>
        <p className={s.note}>{beforeNote}</p>
      </div>
      <div className={s.side}>
        <Frame label={<Verdict good />} height={height}>
          {after}
        </Frame>
        <p className={s.note}>{afterNote}</p>
      </div>
    </div>
  );
}

function Verdict({ good }: { good: boolean }) {
  return (
    <span className={s.verdict} data-good={good ? '' : undefined}>
      {good ? <CheckIcon size={14} /> : <CrossIcon size={14} />}
      {good ? 'After' : 'Before'}
    </span>
  );
}

type TweakProps = {
  stage: ReactNode;
  controls: ReactNode;
  readout?: ReactNode;
  height?: number;
};

/** A live stage beside a panel of dials. */
export function Tweak({ stage, controls, readout, height = 280 }: TweakProps) {
  return (
    <div className={s.tweak}>
      <Frame label={readout} height={height}>
        {stage}
      </Frame>
      <DialPanel className={s.panel}>{controls}</DialPanel>
    </div>
  );
}

export const STATES = ['Default', 'Hover', 'Pressed', 'Focus', 'Disabled'] as const;
export type State = (typeof STATES)[number];

/** The `data-pin` value that holds each state still. Disabled is a prop. */
export const statePin: Record<State, string | undefined> = {
  Default: undefined,
  Hover: 'hover',
  Pressed: 'hover active',
  Focus: 'focus',
  Disabled: undefined,
};

type StateGridProps = {
  rows: { name: string; render: (state: State) => ReactNode }[];
};

/** Every variant × every state, pinned, so they can be read side by side. */
export function StateGrid({ rows }: StateGridProps) {
  return (
    <Frame label="All states" height={0}>
      <div className={s.grid} style={{ gridTemplateColumns: `auto repeat(${STATES.length}, 1fr)` }}>
        <span />
        {STATES.map((state) => (
          <span key={state} className={s.head}>
            {state}
          </span>
        ))}
        {rows.map((row) => (
          <div key={row.name} className={s.row}>
            <span className={s.name}>{row.name}</span>
            {STATES.map((state) => (
              <div key={state} className={s.cell}>
                {row.render(state)}
              </div>
            ))}
          </div>
        ))}
      </div>
    </Frame>
  );
}
