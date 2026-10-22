import { Maximize, Redo2, Undo2, ZoomIn, ZoomOut, type LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { Tip, TipGroup, TipKeys, tooltipClasses as ts } from '../ui/Tooltip';
import { Compare, Frame } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const ACTIONS: [string, LucideIcon, string[]][] = [
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
      <Icon size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
    </Button>
  );
}

/** A row of icon buttons. `grouped` shares one delay across the row. */
function Row({ grouped = true, openFirst }: { grouped?: boolean; openFirst?: boolean }) {
  const buttons = ACTIONS.map(([label, Icon, keys], i) => {
    const tip = (
      <Tip key={label} label={label} keys={keys} defaultOpen={openFirst && i === 1}>
        <IconButton label={label} Icon={Icon} />
      </Tip>
    );
    // Ungrouped: every tip gets its own provider, so each waits the full delay.
    return grouped ? tip : <TipGroup key={label}>{tip}</TipGroup>;
  });
  return <div className={s.toolRow}>{grouped ? <TipGroup>{buttons}</TipGroup> : buttons}</div>;
}

export function TooltipPreview() {
  return <Row openFirst />;
}

export function TooltipLive() {
  return (
    <Frame label="Live" height={140}>
      <Row />
    </Frame>
  );
}

export function TooltipGrouping() {
  return (
    <Compare
      height={140}
      before={<Row grouped={false} />}
      after={<Row />}
      beforeNote="Every button waits the full 500ms. Slide along the row looking for Zoom out and you wait at each stop, so the tooltips never quite keep up."
      afterNote="One shared delay: wait once, then each neighbour's label swaps in instantly and without animation (data-instant)."
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
      height={160}
      before={<Still popupClass={m.raisedTip} />}
      after={<Still />}
      beforeNote="Drawn like a menu: raised surface, shadow, ink text. It blends into the panels around it and reads as something you could click."
      afterNote="Inverse, ink ground and bg text. It separates from any surface in either theme, and its flatness says it's a label, not a control."
    />
  );
}
