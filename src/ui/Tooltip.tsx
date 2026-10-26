import { Tooltip } from '@base-ui/react/tooltip';
import { useEffect, type ReactElement, type ReactNode } from 'react';
import { KEY_ICON, inAppleOrder } from './keys';
import { usePortalContainer } from './portal';
import s from './Tooltip.module.scss';

// delay-tooltip: wait 500ms before the first label; once one has shown,
// neighbours open at once (within the 400ms grouping timeout).
const DELAY = 500;

// Keys that move focus by the person's own hand: Tab, and the arrows, Home and End a toolbar or
// group moves by.
const NAVIGATION = new Set(['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End']);
let navigating = false;
let listening = false;

/**
 * Tracks whether the latest focus move was the person's: the last key was a navigation key, with no
 * pointer press or other key since. Focus the app moves (back to a button after Esc, after Send)
 * comes after some other key or a click, so it doesn't count.
 */
function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener('keydown', (e) => (navigating = NAVIGATION.has(e.key)), true);
  document.addEventListener('pointerdown', () => (navigating = false), true);
}

/** Shares the hover delay across a group, e.g. one toolbar. */
export function TipGroup({ children }: { children: ReactNode }) {
  return (
    <Tooltip.Provider delay={DELAY} timeout={400}>
      {children}
    </Tooltip.Provider>
  );
}

type TipProps = {
  /** Same words as the trigger's aria-label. */
  label: string;
  keys?: string[];
  side?: 'top' | 'bottom';
  /** Start open, e.g. for a still preview. */
  defaultOpen?: boolean;
  /** Gap from the trigger. Default space-1 4; a trigger inset in a panel adds the inset. */
  offset?: number;
  /** The trigger: an element that forwards props and ref, such as Button. */
  children: ReactElement;
};

/** Names an icon-only control, with its shortcut. One line, never interactive. */
export function Tip({ label, keys, side = 'top', defaultOpen, offset = 4, children }: TipProps) {
  const container = usePortalContainer();
  useEffect(listen, []);
  return (
    <Tooltip.Root
      defaultOpen={defaultOpen}
      onOpenChange={(open, details) => {
        // Opened by focus only when the person moved it there; focus the app moves stays quiet.
        if (open && details.reason === 'trigger-focus' && !navigating) details.cancel();
      }}
    >
      <Tooltip.Trigger render={children} delay={DELAY} />
      <Tooltip.Portal container={container}>
        <Tooltip.Positioner className={s.positioner} side={side} sideOffset={offset}>
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
      {inAppleOrder(keys).map((k, i) => {
        const Icon = KEY_ICON[k];
        return Icon ? <Icon key={i} size={12} strokeWidth={1.5} nonScalingStroke aria-label={k} /> : <span key={i}>{k}</span>;
      })}
    </kbd>
  );
}

export { s as tooltipClasses };
