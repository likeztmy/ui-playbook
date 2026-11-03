import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut, type LucideIcon } from 'lucide-react';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { Tip, TipGroup, TipKeys, tooltipClasses as ts } from '../ui/Tooltip';
import { Compare, Frame } from './shell';
import { Walk, type Action } from './tooltip-walk/Walk';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const ACTIONS: Action[] = [
  ['Undo', Undo2, ['⌘', 'Z']],
  ['Redo', Redo2, ['⇧', '⌘', 'Z']],
  ['Zoom in', ZoomIn, ['⌘', '+']],
  ['Zoom out', ZoomOut, ['⌘', '−']],
  ['Fit to screen', Maximize, ['⇧', '1']],
];

// Forwards the rest: Tip merges its trigger props and ref into this element.
function IconButton({ label, Icon, ...props }: { label: string; Icon: LucideIcon } & ComponentProps<typeof Button>) {
  return (
    <Button focusableWhenDisabled {...props} variant="ghost" icon aria-label={label}>
      <Icon size={16} aria-hidden />
    </Button>
  );
}

type RowProps = {
  openFirst?: boolean;
  /** What each button runs, by its label. */
  run?: Record<string, () => void>;
  /** Which buttons can't run now, by label: they keep their name, without the shortcut. */
  off?: Record<string, boolean>;
  /** After the buttons: what they act on. */
  children?: ReactNode;
};

/** A row of icon buttons sharing one delay. */
function Row({ openFirst, run, off, children }: RowProps) {
  return (
    <div className={s.toolRow}>
      <TipGroup>
        {ACTIONS.map(([label, Icon, keys], i) => (
          <Tip key={label} label={label} keys={off?.[label] ? undefined : keys} defaultOpen={openFirst && i === 1}>
            <IconButton label={label} Icon={Icon} onClick={run?.[label]} disabled={off?.[label]} />
          </Tip>
        ))}
      </TipGroup>
      {children}
    </div>
  );
}

const clamp = (z: number) => Math.min(2, Math.max(0.5, z));

/** The view controls at work: each one changes the zoom, and Undo and Redo step through the changes. */
function ViewControls() {
  const [zoom, setZoom] = useState(1);
  // A step either way already in the history, so Undo and Redo run from the start.
  const [past, setPast] = useState([0.75]);
  const [future, setFuture] = useState([1.25]);
  const go = (next: number) => {
    if (next === zoom) return;
    setPast((p) => [...p, zoom]);
    setFuture([]);
    setZoom(next);
  };
  const run = {
    Undo: () => {
      if (!past.length) return;
      setFuture((f) => [zoom, ...f]);
      setZoom(past[past.length - 1]);
      setPast((p) => p.slice(0, -1));
    },
    Redo: () => {
      if (!future.length) return;
      setPast((p) => [...p, zoom]);
      setZoom(future[0]);
      setFuture((f) => f.slice(1));
    },
    'Zoom in': () => go(clamp(zoom + 0.25)),
    'Zoom out': () => go(clamp(zoom - 0.25)),
    'Fit to screen': () => go(1),
  };
  return (
    <Row openFirst run={run} off={{ Undo: !past.length, Redo: !future.length }}>
      <span className={s.sketchZoom} aria-live="polite">
        {Math.round(zoom * 100)}%
      </span>
    </Row>
  );
}

export function TooltipPreview() {
  return <Row openFirst />;
}

/** The page's own scene: an editor's view controls, one label already showing, the rest a hover away. */
export function TooltipLive() {
  return (
    <Frame label="View controls" height={200}>
      <ViewControls />
    </Frame>
  );
}

export function TooltipGrouping() {
  return (
    <Compare
      beforeLabel="Each waits 500 ms"
      afterLabel="One shared 500 ms delay"
      height={0}
      before={<Walk actions={ACTIONS} />}
      after={<Walk actions={ACTIONS} shared />}
      beforeNote="Every button waits the full 500ms. Slide along the row and you wait at every stop, so the tooltips never quite keep up."
      afterNote="One shared delay: wait once, then each neighbour’s label swaps in instantly and without animation."
    />
  );
}

/** A tooltip drawn in place above a button, for side-by-side stills. */
function Still({ popupClass }: { popupClass?: string }) {
  return (
    <div className={s.tipStill}>
      <div className={cx(ts.popup, popupClass)}>
        Redo
        <TipKeys keys={['⇧', '⌘', 'Z']} />
      </div>
      <IconButton label="Redo" Icon={Redo2} />
    </div>
  );
}

export function TooltipInverse() {
  return (
    <Compare
      beforeLabel="Raised surface, shadow"
      afterLabel="Inverse ink, no shadow"
      height={160}
      before={<Still popupClass={m.raisedTip} />}
      after={<Still />}
      beforeNote="Drawn like a menu: raised surface, shadow, ink text. It blends into the panels around it and reads as something you could click."
      afterNote="Inverse, ink ground and bg text. It separates from any surface in either theme, and its flatness says it's a label, not a control."
    />
  );
}
