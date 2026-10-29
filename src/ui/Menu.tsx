import { Menu as BaseMenu } from '@base-ui/react/menu';
import { ContextMenu as BaseContextMenu } from '@base-ui/react/context-menu';
import { Check, ChevronRight, type LucideIcon } from 'lucide-react';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { cx } from './cx';
import { KEY_ICON, inAppleOrder } from './keys';
import { usePortalContainer } from './portal';
import s from './Menu.module.scss';

export { s as menuClasses };

type PositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

type PopupProps = ComponentProps<typeof BaseMenu.Popup> & {
  side?: PositionerProps['side'];
  align?: PositionerProps['align'];
  sub?: boolean;
};

function Popup({ side = 'bottom', align = 'start', sub, className, ...props }: PopupProps) {
  const container = usePortalContainer();
  return (
    <BaseMenu.Portal container={container}>
      <BaseMenu.Positioner className={s.positioner} side={sub ? 'right' : side} align={align} sideOffset={sub ? 0 : 6} alignOffset={sub ? -4 : 0}>
        <BaseMenu.Popup {...props} className={cx(s.popup, sub && s.subPopup, className as string)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

function KeyGlyph({ k }: { k: string }) {
  const Icon = KEY_ICON[k];
  return Icon ? <Icon size={12} strokeWidth={1.25} nonScalingStroke aria-label={k} /> : <>{k}</>;
}

/**
 * A shortcut as bare symbols, after macOS: the last key in a fixed cell at
 * the row's end, modifiers to its left in Apple's order. Every row's key
 * falls in one column, however many modifiers come before it.
 */
export function Keys({ keys, className }: { keys: string[]; className?: string }) {
  const ordered = inAppleOrder(keys);
  const key = ordered[ordered.length - 1];
  return (
    <kbd className={cx(s.keys, className)}>
      <span className={s.mods}>
        {ordered.slice(0, -1).map((k) => (
          <KeyGlyph key={k} k={k} />
        ))}
      </span>
      <span className={s.keyCell}>
        <KeyGlyph k={key} />
      </span>
    </kbd>
  );
}

type RowProps = {
  icon?: LucideIcon;
  keys?: string[];
  /** On or off for a toggle row; leave undefined for a row that can't be checked. */
  checked?: boolean;
  submenu?: boolean;
  children: ReactNode;
};

/** The checkmark slot, leading the row as on macOS. Kept when off, so labels stay aligned. */
function CheckSlot({ on }: { on: boolean }) {
  return (
    <span className={s.check} data-off={on ? undefined : ''}>
      <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
    </span>
  );
}

/** The inside of a row. Shared by live items and stills, so they can't drift. */
export function RowContent({ icon: Icon, keys, checked, submenu, children }: RowProps) {
  return (
    <>
      {checked !== undefined && <CheckSlot on={checked} />}
      {Icon && <Icon className={s.icon} size={16} aria-hidden />}
      <span className={s.text}>{children}</span>
      {submenu && <ChevronRight className={s.chevron} size={16} aria-hidden />}
      {keys && <Keys keys={keys} />}
    </>
  );
}

type ItemProps = Omit<ComponentProps<typeof BaseMenu.Item>, 'children'> & {
  icon?: LucideIcon;
  keys?: string[];
  danger?: boolean;
  children: string;
};

function Item({ icon, keys, danger, children, className, ...props }: ItemProps) {
  return (
    <BaseMenu.Item {...props} label={children} className={cx(s.item, danger && s.danger, className as string)}>
      <RowContent icon={icon} keys={keys}>
        {children}
      </RowContent>
    </BaseMenu.Item>
  );
}

type CheckboxItemProps = Omit<ComponentProps<typeof BaseMenu.CheckboxItem>, 'children'> & {
  icon?: LucideIcon;
  keys?: string[];
  children: string;
};

/** A toggle. Stays open on click, so several can be flipped in one go. */
function CheckboxItem({ icon, keys, children, className, checked, defaultChecked, onCheckedChange, ...props }: CheckboxItemProps) {
  const [own, setOwn] = useState(defaultChecked ?? false);
  const on = checked ?? own;
  return (
    <BaseMenu.CheckboxItem
      {...props}
      checked={on}
      onCheckedChange={(v, e) => {
        setOwn(v);
        onCheckedChange?.(v, e);
      }}
      closeOnClick={false}
      label={children}
      className={cx(s.item, className as string)}
    >
      <RowContent icon={icon} keys={keys} checked={on}>
        {children}
      </RowContent>
    </BaseMenu.CheckboxItem>
  );
}

type SubmenuProps = { icon?: LucideIcon; label: string; children: ReactNode; className?: string };

function Submenu({ icon, label, children, className }: SubmenuProps) {
  return (
    <BaseMenu.SubmenuRoot>
      <BaseMenu.SubmenuTrigger label={label} className={cx(s.item, className)}>
        <RowContent icon={icon} submenu>
          {label}
        </RowContent>
      </BaseMenu.SubmenuTrigger>
      <Popup sub>{children}</Popup>
    </BaseMenu.SubmenuRoot>
  );
}

type RadioItemProps = Omit<ComponentProps<typeof BaseMenu.RadioItem>, 'children'> & {
  children: string;
  /** Trailing, muted: a count that belongs to the value, such as a folder's unread, or a swatch. */
  detail?: ReactNode;
};

/** One value in a choice menu (Sort by, View as). Picking it closes the menu. */
function RadioItem({ children, detail, className, closeOnClick = true, ...props }: RadioItemProps) {
  return (
    <BaseMenu.RadioItem {...props} closeOnClick={closeOnClick} label={children} className={cx(s.item, className as string)}>
      <BaseMenu.RadioItemIndicator keepMounted className={s.check}>
        <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
      </BaseMenu.RadioItemIndicator>
      <span className={s.text}>{children}</span>
      {detail !== undefined && <span className={s.detail}>{detail}</span>}
    </BaseMenu.RadioItem>
  );
}

function Group({ className, ...props }: ComponentProps<typeof BaseMenu.Group>) {
  return <BaseMenu.Group {...props} className={className} />;
}

function Label({ className, ...props }: ComponentProps<typeof BaseMenu.GroupLabel>) {
  return <BaseMenu.GroupLabel {...props} className={cx(s.label, className as string)} />;
}

function Separator() {
  return <BaseMenu.Separator className={s.separator} />;
}

export const Menu = {
  Root: BaseMenu.Root,
  Trigger: BaseMenu.Trigger,
  Popup,
  Item,
  CheckboxItem,
  RadioGroup: BaseMenu.RadioGroup,
  RadioItem,
  Submenu,
  Group,
  Label,
  Separator,
};

/** Opens at the pointer on right-click or long-press, over its trigger area. */
function ContextPopup({ className, ...props }: ComponentProps<typeof BaseMenu.Popup>) {
  const container = usePortalContainer();
  return (
    <BaseContextMenu.Portal container={container}>
      <BaseContextMenu.Positioner className={s.positioner}>
        <BaseContextMenu.Popup {...props} className={cx(s.popup, className as string)} />
      </BaseContextMenu.Positioner>
    </BaseContextMenu.Portal>
  );
}

/** A context menu. Its items are Menu's: Menu.Item, Menu.Separator, and so on. */
export const ContextMenu = {
  Root: BaseContextMenu.Root,
  Trigger: BaseContextMenu.Trigger,
  Popup: ContextPopup,
};
