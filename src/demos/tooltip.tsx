import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
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
    <Button {...props} variant="ghost" icon aria-label={label}>
      <Icon size={16} aria-hidden />
    </Button>
  );
}

/** A row of icon buttons sharing one delay. */
function Row({ openFirst }: { openFirst?: boolean }) {
  return (
    <div className={s.toolRow}>
      <TipGroup>
        {ACTIONS.map(([label, Icon, keys], i) => (
          <Tip key={label} label={label} keys={keys} defaultOpen={openFirst && i === 1}>
            <IconButton label={label} Icon={Icon} />
          </Tip>
        ))}
      </TipGroup>
    </div>
  );
}

export function TooltipPreview() {
  return <Row openFirst />;
}

/** The page's own scene: an editor's view controls, one label already showing, the rest a hover away. */
export function TooltipLive() {
  return (
    <Frame label="View controls" height={200}>
      <Row openFirst />
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
