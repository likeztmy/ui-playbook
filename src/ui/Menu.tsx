import { Menu as BaseMenu } from '@base-ui/react/menu';
import { ArrowBigUp, Check, ChevronRight, Command, CornerDownLeft, Delete, Option, type LucideIcon } from 'lucide-react';
import { useState, type ComponentProps, type ReactNode } from 'react';
import { cx } from './cx';
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
      <BaseMenu.Positioner
        className={s.positioner}
        side={sub ? 'right' : side}
        align={align}
        sideOffset={sub ? 0 : 6}
        alignOffset={sub ? -4 : 0}
      >
        <BaseMenu.Popup {...props} className={cx(s.popup, sub && s.subPopup, className as string)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

// Modifier keys drawn as icons: Geist has no ⌘ ⇧ ⌥ ⌫ ↵ glyphs.
const KEY_ICON: Record<string, LucideIcon> = {
  '⌘': Command,
  '⇧': ArrowBigUp,
  '⌥': Option,
  '⌫': Delete,
  '↵': CornerDownLeft,
};

/** A shortcut as keycaps, e.g. keys={['⌘', 'D']}. */
export function Keys({ keys, className }: { keys: string[]; className?: string }) {
  return (
    <kbd className={cx(s.keys, className)}>
      {keys.map((k, i) => {
        const Icon = KEY_ICON[k];
        return (
          <span key={i} className={s.key}>
            {Icon ? <Icon size={12} strokeWidth={1.5} absoluteStrokeWidth aria-label={k} /> : k}
          </span>
        );
      })}
    </kbd>
  );
}

type RowProps = {
  icon?: LucideIcon;
  keys?: string[];
  checked?: boolean;
  submenu?: boolean;
  children: ReactNode;
};

/** The inside of a row. Shared by live items and stills, so they can't drift. */
export function RowContent({ icon: Icon, keys, checked, submenu, children }: RowProps) {
  return (
    <>
      {Icon && <Icon className={s.icon} size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />}
      <span className={s.text}>{children}</span>
      {checked && (
        <span className={s.check}>
          <Check size={16} strokeWidth={1.75} absoluteStrokeWidth aria-hidden />
        </span>
      )}
      {submenu && <ChevronRight className={s.chevron} size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />}
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
  Submenu,
  Group,
  Label,
  Separator,
};
