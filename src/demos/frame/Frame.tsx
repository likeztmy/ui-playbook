import { useState, type ReactNode } from 'react';
import { Ruler } from 'lucide-react';
import { PortalContainer } from '../../ui/portal';
import { Button } from '../../ui/Button';
import { ContrastIcon } from '../../ui/icons';
import { cx } from '../../ui/cx';
import { Tip, TipGroup } from '../../ui/Tooltip';
import { useBox } from '../box';
import { FRAME_UI, useLang } from './lang';
import { GapsOn } from './Measured';
import { useStartFrame } from './startFrame';
import s from '../shell.module.scss';

export type Theme = 'light' | 'dark';

function pageTheme(): Theme {
  const pinned = document.documentElement.dataset.theme;
  if (pinned === 'light' || pinned === 'dark') return pinned;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export type FrameProps = {
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

/**
 * A demo stage with a band under it naming the scene or the verdict, after
 * Material 3's Do / Don't, and its own light/dark switch. Popups stay inside it.
 * The switch repaints the stage and its popups only: the label and the tools
 * sit on the page, so they keep the page's theme and ink.
 */
export function Frame({ label, children, height = 200, className, defaultTheme, tone, slow, onSlowChange, gaps, onGapsChange, still }: FrameProps) {
  const words = FRAME_UI[useLang()];
  const [theme, setTheme] = useState<Theme | null>(defaultTheme ?? null);
  const [portal, setPortal] = useState<HTMLElement | null>(null);
  const [stage, setStage] = useState<HTMLElement | null>(null);
  const { start, origin } = useStartFrame(slow, stage, portal);
  // Read at click time: the page theme may have changed since render.
  const flip = () => setTheme((t) => ((t ?? pageTheme()) === 'dark' ? 'light' : 'dark'));

  // The frame's own tools: on the band under the stage, or at the end of the label's row above it.
  const tools = (
    <span className={s.tools}>
      {onGapsChange && (
        <Tip label={words.gaps}>
          <Button variant="ghost" size="sm" icon aria-label={words.gaps} aria-pressed={gaps} className={s.slow} onClick={() => onGapsChange(!gaps)}>
            <Ruler size={14} aria-hidden />
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
  );

  // Without a band, the label sits above the stage (in its corner on a plate), its tools at the row's end.
  const box = useBox();
  const banded = box === 'band';
  const caption = !banded && (
    <figcaption className={s.caption} data-tone={tone}>
      <span className={s.captionLabel}>{label}</span>
      {tools}
    </figcaption>
  );
  const own = theme ?? undefined;
  return (
    <figure className={cx(s.frame, className)} data-slow={slow ? '' : undefined} data-box={banded ? undefined : box}>
      {box !== 'plate' && caption}
      <div ref={setStage} className={s.stage} data-theme={own} style={{ minHeight: height }} inert={still}>
        {box === 'plate' && caption}
        <PortalContainer.Provider value={portal}>
          <GapsOn.Provider value={!!gaps}>
            <TipGroup>{children}</TipGroup>
          </GapsOn.Provider>
        </PortalContainer.Provider>
        {start && <span className={s.startFrame} style={{ left: start.x, top: start.y, width: start.w, height: start.h }} aria-hidden />}
        {origin && <span className={s.origin} style={{ left: origin.x, top: origin.y }} aria-hidden />}
      </div>
      {banded && (
        <div className={s.bar} data-tone={tone}>
          <span className={s.label}>{label}</span>
          {tools}
        </div>
      )}
      {/* Popups from the stage open here, in the stage's theme. */}
      <div ref={setPortal} data-theme={own} />
    </figure>
  );
}
