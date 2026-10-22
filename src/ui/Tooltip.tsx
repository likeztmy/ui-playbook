import { Tooltip } from '@base-ui/react/tooltip';
import { ArrowBigUp, Command, CornerDownLeft, Delete, Option, type LucideIcon } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { usePortalContainer } from './portal';
import s from './Tooltip.module.scss';

// delay-tooltip: wait 500ms before the first label; once one has shown,
// neighbours open at once (within the 400ms grouping timeout).
const DELAY = 500;

/** Shares the hover delay across a group, e.g. one toolbar. */
export function TipGroup({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delay={DELAY} timeout={400}>
      {children}
    </Tooltip.Provider>
  );
}

const KEY_ICON: Record<string, LucideIcon> = {
  '⌘': Command,
  '⇧': ArrowBigUp,
  '⌥': Option,
  '⌫': Delete,
  '↵': CornerDownLeft,
};

type TipProps = {
  /** Same words as the trigger's aria-label. */
  label: string;
  keys?: string[];
  side?: 'top' | 'bottom';
  /** Start open, e.g. for a still preview. */
  defaultOpen?: boolean;
  /** The trigger: an element that forwards props and ref, such as Button. */
  children: ReactElement;
};

/** Names an icon-only control, with its shortcut. One line, never interactive. */
export function Tip({ label, keys, side = 'top', defaultOpen, children }: TipProps) {
  const container = usePortalContainer();
  return (
    <Tooltip.Root defaultOpen={defaultOpen}>
      <Tooltip.Trigger render={children} delay={DELAY} />
      <Tooltip.Portal container={container}>
        <Tooltip.Positioner className={s.positioner} side={side} sideOffset={4}>
          <Tooltip.Popup className={s.popup}>
            {label}
            {keys && <TipKeys keys={keys} />}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

/** A shortcut inside a tooltip: glyphs only, no caps, dimmed against the label. */
export function TipKeys({ keys }: { keys: string[] }) {
  return (
    <kbd className={s.keys}>
      {keys.map((k, i) => {
        const Icon = KEY_ICON[k];
        return Icon ? (
          <Icon key={i} size={12} strokeWidth={1.5} nonScalingStroke aria-label={k} />
        ) : (
          <span key={i}>{k}</span>
        );
      })}
    </kbd>
  );
}

export { s as tooltipClasses };
