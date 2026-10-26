import { Popover as BasePopover } from '@base-ui/react/popover';
import type { ComponentProps, ReactElement, ReactNode } from 'react';
import { cx } from './cx';
import { usePortalContainer } from './portal';
import { Tip } from './Tooltip';
import s from './Popover.module.scss';

export { s as popoverClasses };

type PositionerProps = ComponentProps<typeof BasePopover.Positioner>;
type PopupProps = ComponentProps<typeof BasePopover.Popup>;

type PopoverProps = Pick<ComponentProps<typeof BasePopover.Root>, 'open' | 'onOpenChange' | 'defaultOpen'> &
  Pick<PopupProps, 'initialFocus' | 'finalFocus'> & {
    /** The button that opens it; it stays pressed in while open. */
    trigger: ReactElement;
    /** For an icon-only trigger: its name, shown as a tooltip. */
    tip?: string;
    /** The trigger's shortcut, shown in its tooltip. */
    tipKeys?: string[];
    /** Names the popover; shown as its heading unless `hideTitle`. */
    title: string;
    hideTitle?: boolean;
    description?: ReactNode;
    children?: ReactNode;
    /** Buttons on the footer row, the likeliest action last. */
    actions?: ReactNode;
    side?: PositionerProps['side'];
    align?: PositionerProps['align'];
    className?: string;
  };

/** A small panel of controls or detail, opened by a click on its trigger. */
export function Popover({
  trigger,
  tip,
  tipKeys,
  title,
  hideTitle,
  description,
  children,
  actions,
  side = 'bottom',
  align = 'start',
  className,
  initialFocus,
  finalFocus,
  ...root
}: PopoverProps) {
  const container = usePortalContainer();
  const button = <BasePopover.Trigger render={trigger} />;
  return (
    <BasePopover.Root {...root}>
      {tip ? (
        <Tip label={tip} keys={tipKeys}>
          {button}
        </Tip>
      ) : (
        button
      )}
      <BasePopover.Portal container={container}>
        <BasePopover.Positioner className={s.positioner} side={side} align={align} sideOffset={6} collisionPadding={8}>
          <BasePopover.Popup
            className={cx(s.popup, className)}
            initialFocus={initialFocus}
            finalFocus={finalFocus}
            aria-label={hideTitle ? title : undefined}
          >
            {(!hideTitle || description) && (
              <div className={s.header}>
                {!hideTitle && <BasePopover.Title className={s.title}>{title}</BasePopover.Title>}
                {description && <BasePopover.Description className={s.description}>{description}</BasePopover.Description>}
              </div>
            )}
            {children && <div className={s.body}>{children}</div>}
            {actions && <div className={s.footer}>{actions}</div>}
          </BasePopover.Popup>
        </BasePopover.Positioner>
      </BasePopover.Portal>
    </BasePopover.Root>
  );
}

export const PopoverClose = BasePopover.Close;
