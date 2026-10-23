import { useState, type ReactNode } from 'react';
import { PortalContainer } from '../ui/portal';
import { Button } from '../ui/Button';
import { CheckIcon, ContrastIcon, CrossIcon } from '../ui/icons';
import { SliderPanel } from '../ui/Slider';
import { cx } from '../ui/cx';
import { Tip, TipGroup } from '../ui/Tooltip';
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
  /** Start pinned to a theme instead of following the page. */
  defaultTheme?: Theme;
  /** Tints the band: the common mistake or the better way. */
  tone?: 'bad' | 'good';
};

/**
 * A demo stage with a band under it naming the scene or the verdict, after
 * Material 3's Do / Don't, and its own light/dark switch. Popups stay inside it.
 */
export function Frame({ label, children, height = 200, className, defaultTheme, tone }: FrameProps) {
  const [theme, setTheme] = useState<Theme | null>(defaultTheme ?? null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  // Read at click time: the page theme may have changed since render.
  const flip = () => setTheme((t) => ((t ?? pageTheme()) === 'dark' ? 'light' : 'dark'));

  return (
    <figure className={cx(s.frame, className)} data-theme={theme ?? undefined}>
      <div className={s.stage} style={{ minHeight: height }}>
        <PortalContainer.Provider value={portal}>
          <TipGroup>{children}</TipGroup>
        </PortalContainer.Provider>
      </div>
      <div className={s.bar} data-tone={tone}>
        <span className={s.label}>{label}</span>
        <Tip label="Switch theme">
          <Button variant="ghost" size="sm" icon aria-label="Switch theme" onClick={flip}>
            <ContrastIcon />
          </Button>
        </Tip>
      </div>
      <div ref={setPortal} />
    </figure>
  );
}

type CompareProps = {
  before: ReactNode;
  after: ReactNode;
  /** What the demo can't show: why, a source link, when it flips. */
  beforeNote: ReactNode;
  afterNote: ReactNode;
  height?: number;
  /** One above the other, for demos too wide for half a column (tables). */
  stacked?: boolean;
};

/** The same thing twice: the common version and the better one. */
export function Compare({ before, after, beforeNote, afterNote, height, stacked }: CompareProps) {
  return (
    <div className={cx(s.compare, stacked && s.stacked)}>
      <div className={s.side}>
        <Frame label={<Verdict good={false} />} height={height} tone="bad">
          {before}
        </Frame>
        <p className={s.note}>{beforeNote}</p>
      </div>
      <div className={s.side}>
        <Frame label={<Verdict good />} height={height} tone="good">
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
      <SliderPanel className={s.panel}>{controls}</SliderPanel>
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

type GalleryProps = {
  label?: string;
  rows: { name: string; use: string; render: () => ReactNode }[];
  /** Text above each live instance, for instances that need the full width. */
  stacked?: boolean;
};

/** Variants side by side: what each one is for, and a live instance of it. */
export function Gallery({ label = 'Variants', rows, stacked }: GalleryProps) {
  return (
    <Frame label={label} height={0}>
      <div className={s.gallery}>
        {rows.map((row) => (
          <div key={row.name} className={cx(s.galleryRow, stacked && s.stacked)}>
            <div className={s.galleryText}>
              <span className={s.galleryName}>{row.name}</span>
              <span className={s.galleryUse}>{row.use}</span>
            </div>
            <div className={s.galleryLive}>{row.render()}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
