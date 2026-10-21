import { Menu as BaseMenu } from '@base-ui/react/menu';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';
import { usePortalContainer } from './portal';
import s from './Menu.module.scss';

type PositionerProps = ComponentProps<typeof BaseMenu.Positioner>;

type PopupProps = ComponentProps<typeof BaseMenu.Popup> & {
  side?: PositionerProps['side'];
  align?: PositionerProps['align'];
};

function Popup({ side = 'bottom', align = 'start', className, ...props }: PopupProps) {
  const container = usePortalContainer();
  return (
    <BaseMenu.Portal container={container}>
      <BaseMenu.Positioner className={s.positioner} side={side} align={align} sideOffset={6}>
        <BaseMenu.Popup {...props} className={cx(s.popup, className as string)} />
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
}

type ItemProps = ComponentProps<typeof BaseMenu.Item> & {
  icon?: ReactNode;
  shortcut?: string;
  danger?: boolean;
};

function Item({ icon, shortcut, danger, children, className, ...props }: ItemProps) {
  return (
    <BaseMenu.Item {...props} className={cx(s.item, danger && s.danger, className as string)}>
      {icon}
      {children}
      {shortcut && <kbd className={s.shortcut}>{shortcut}</kbd>}
    </BaseMenu.Item>
  );
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
  Group: BaseMenu.Group,
  Popup,
  Item,
  Label,
  Separator,
};
