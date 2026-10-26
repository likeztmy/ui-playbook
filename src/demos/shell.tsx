import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type ReactNode } from 'react';
import { PortalContainer } from '../ui/portal';
import { Button } from '../ui/Button';
import { Ruler } from 'lucide-react';
import { CheckIcon, ContrastIcon, CrossIcon } from '../ui/icons';
import { SliderPanel } from '../ui/Slider';
import { cx } from '../ui/cx';
import { Tip, TipGroup } from '../ui/Tooltip';
import s from './shell.module.scss';

type Theme = 'light' | 'dark';

// ── Language ─────────────────────────────────────────────

export type Lang = 'en' | 'zh';

const LangContext = createContext<Lang>('en');

/** The page's language, for a demo's notes. */
export const useLang = () => useContext(LangContext);

/**
 * Lets an MDX page say which language a demo speaks: <Demo lang="zh" />.
 * Each island is its own React root, so the language rides in as a prop.
 */
export function localized<P extends object>(Demo: ComponentType<P>) {
  const Localized = ({ lang = 'en', ...props }: P & { lang?: Lang }) => (
    <LangContext.Provider value={lang}>
      <Demo {...(props as P)} />
    </LangContext.Provider>
  );
  Localized.displayName = Demo.displayName ?? Demo.name;
  return Localized;
}

const FRAME_UI = {
  en: { before: 'Before', after: 'After', theme: 'Switch theme', slow: 'Slow motion', gaps: 'Show gaps' },
  zh: { before: 'Before', after: 'After', theme: '切换主题', slow: '慢放', gaps: '显示间距' },
} as const;

// ── Gaps ─────────────────────────────────────────────────

const GapsOn = createContext(false);

type Band = { top: number; height: number; px: number; ratio: number };

/**
 * The vertical gaps between its children's text, drawn when the frame's Gaps
 * switch is on: each in pixels and as a multiple of the smallest, the way
 * grouping by proximity compares them. Text is measured by its em box, so a
 * line's leading doesn't count as space.
 */
export function Measured({ children, className, show }: { children: ReactNode; className?: string; /** Always on, for a playground with no switch. */ show?: boolean }) {
  const on = useContext(GapsOn) || !!show;
  const ref = useRef<HTMLDivElement>(null);
  const [bands, setBands] = useState<Band[]>([]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!on || !el) {
      setBands([]);
      return;
    }
    const measure = () => {
      const top0 = el.getBoundingClientRect().top;
      const extents = [...el.children]
        .filter((c) => !c.hasAttribute('data-gap-band'))
        .map((c) => {
          let t = Infinity;
          let b = -Infinity;
          const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (!n.textContent?.trim()) continue;
            const size = parseFloat(getComputedStyle(n.parentElement!).fontSize);
            const range = document.createRange();
            range.selectNodeContents(n);
            for (const r of range.getClientRects()) {
              const mid = r.top + r.height / 2;
              t = Math.min(t, mid - size / 2);
              b = Math.max(b, mid + size / 2);
            }
          }
          return Number.isFinite(t) ? { t: t - top0, b: b - top0 } : null;
        })
        .filter((x): x is { t: number; b: number } => !!x);
      const gaps = extents.slice(1).map((e, i) => ({ top: extents[i].b, height: e.t - extents[i].b }));
      const least = Math.max(1, Math.min(...gaps.map((g) => g.height)));
      setBands(gaps.map((g) => ({ ...g, px: Math.round(g.height), ratio: g.height / least })));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on, children]);
  return (
    <div ref={ref} className={cx(s.measured, className)}>
      {children}
      {bands.map((b, i) => (
        <span key={i} className={s.gapBand} data-gap-band="" style={{ top: b.top, height: b.height }} aria-hidden>
          <span className={s.gapLabel}>
            {b.px} · {b.ratio.toFixed(1)}×
          </span>
        </span>
      ))}
    </div>
  );
}

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
  /** Plays its motion at a tenth of the speed and outlines a popup's first frame. */
  slow?: boolean;
  /** Shows the slow-motion switch in the band. */
  onSlowChange?: (slow: boolean) => void;
  /** Draws the gaps in its Measured regions. */
  gaps?: boolean;
  /** Shows the Gaps switch in the band. */
  onGapsChange?: (gaps: boolean) => void;
  /** A specimen held still for reading: nothing in it takes focus or a click. */
  still?: boolean;
};

type Box = { x: number; y: number; w: number; h: number };

// Popups whose entrance is worth slowing down; tooltips and backdrops aren't.
const POPUPS = '[role="dialog"], [role="menu"], [role="listbox"], [role="alertdialog"]';

/**
 * While `on`, outlines the first frame of each popup that opens inside
 * `portal` and marks its transform origin. The popup's resting box is its
 * positioner's (which is never scaled); the first frame is that box scaled
 * by enter-scale about the origin and pushed enter-offset away from the
 * trigger, as the popups' own starting style does.
 */
function useStartFrame(on: boolean | undefined, stage: HTMLElement | null, portal: HTMLElement | null) {
  const [start, setStart] = useState<Box | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    setStart(null);
    setOrigin(null);
    if (!on || !stage || !portal) return;
    const measure = (el: HTMLElement) => {
      const f = stage.getBoundingClientRect();
      const box = (el.parentElement ?? el).getBoundingClientRect();
      const css = getComputedStyle(el);
      const [ox, oy] = css.transformOrigin.split(' ').map(parseFloat);
      const scale = parseFloat(css.getPropertyValue('--enter-scale')) || 1;
      const offset = parseFloat(css.getPropertyValue('--enter-offset')) || 0;
      const side = el.dataset.side;
      const [tx, ty] = side === 'bottom' ? [0, -offset] : side === 'top' ? [0, offset] : side === 'right' ? [-offset, 0] : side === 'left' ? [offset, 0] : [0, 0];
      const o = { x: box.left - f.left + ox, y: box.top - f.top + oy };
      setOrigin(o);
      setStart({
        x: o.x - ox * scale + tx,
        y: o.y - oy * scale + ty,
        w: box.width * scale,
        h: box.height * scale,
      });
    };
    const seen = (el: Element) => {
      if (!(el instanceof HTMLElement) || !el.matches(POPUPS)) return;
      if (el.hasAttribute('data-ending-style')) {
        setStart(null);
        setOrigin(null);
      } else if (el.hasAttribute('data-starting-style')) {
        // Two frames: the positioner places the popup after it mounts.
        requestAnimationFrame(() => requestAnimationFrame(() => measure(el)));
      }
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'attributes') seen(r.target as Element);
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          seen(n);
          n.querySelectorAll(POPUPS).forEach(seen);
        });
      }
    });
    mo.observe(portal, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-starting-style', 'data-ending-style'] });
    return () => mo.disconnect();
  }, [on, stage, portal]);
  return { start, origin };
}

/**
 * A demo stage with a band under it naming the scene or the verdict, after
 * Material 3's Do / Don't, and its own light/dark switch. Popups stay inside it.
 */
export function Frame({ label, children, height = 200, className, defaultTheme, tone, slow, onSlowChange, gaps, onGapsChange, still }: FrameProps) {
  const words = FRAME_UI[useLang()];
  const [theme, setTheme] = useState<Theme | null>(defaultTheme ?? null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const { start, origin } = useStartFrame(slow, stage, portal);
  // Read at click time: the page theme may have changed since render.
  const flip = () => setTheme((t) => ((t ?? pageTheme()) === 'dark' ? 'light' : 'dark'));

  return (
    <figure className={cx(s.frame, className)} data-theme={theme ?? undefined} data-slow={slow ? '' : undefined}>
      <div ref={setStage} className={s.stage} style={{ minHeight: height }} inert={still}>
        <PortalContainer.Provider value={portal}>
          <GapsOn.Provider value={!!gaps}>
            <TipGroup>{children}</TipGroup>
          </GapsOn.Provider>
        </PortalContainer.Provider>
        {start && <span className={s.startFrame} style={{ left: start.x, top: start.y, width: start.w, height: start.h }} aria-hidden />}
        {origin && <span className={s.origin} style={{ left: origin.x, top: origin.y }} aria-hidden />}
      </div>
      <div className={s.bar} data-tone={tone}>
        <span className={s.label}>{label}</span>
        <span className={s.tools}>
          {onGapsChange && (
            <Tip label={words.gaps}>
              <Button variant="ghost" size="sm" icon aria-label={words.gaps} aria-pressed={gaps} className={s.slow} onClick={() => onGapsChange(!gaps)}>
                <Ruler size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
              </Button>
            </Tip>
          )}
          {onSlowChange && (
            <Tip label={words.slow}>
              <Button variant="ghost" size="sm" aria-pressed={slow} className={s.slow} onClick={() => onSlowChange(!slow)}>
                0.1×
              </Button>
            </Tip>
          )}
          <Tip label={words.theme}>
            <Button variant="ghost" size="sm" icon aria-label={words.theme} onClick={flip}>
              <ContrastIcon />
            </Button>
          </Tip>
        </span>
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
  /** Offers slow motion, shared by both sides, for demos whose point is how something moves. */
  motion?: boolean;
  /** Offers the Gaps switch, shared by both sides, for demos whose point is spacing. */
  measure?: boolean;
};

/** The same thing twice: the common version and the better one. */
export function Compare({ before, after, beforeNote, afterNote, height, stacked, motion, measure }: CompareProps) {
  const [slow, setSlow] = useState(false);
  const slowing = motion ? { slow, onSlowChange: setSlow } : {};
  const [gaps, setGaps] = useState(false);
  const measuring = measure ? { gaps, onGapsChange: setGaps } : {};
  return (
    <div className={cx(s.compare, stacked && s.stacked)}>
      <div className={s.side}>
        <Frame label={<Verdict good={false} />} height={height} tone="bad" {...slowing} {...measuring}>
          {before}
        </Frame>
        <p className={s.note}>{beforeNote}</p>
      </div>
      <div className={s.side}>
        <Frame label={<Verdict good />} height={height} tone="good" {...slowing} {...measuring}>
          {after}
        </Frame>
        <p className={s.note}>{afterNote}</p>
      </div>
    </div>
  );
}

function Verdict({ good }: { good: boolean }) {
  const words = FRAME_UI[useLang()];
  return (
    <span className={s.verdict} data-good={good ? '' : undefined}>
      {good ? <CheckIcon size={14} /> : <CrossIcon size={14} />}
      {good ? words.after : words.before}
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
    <Frame label="All states" height={0} still>
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
