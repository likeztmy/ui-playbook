import { AlertDialog as BaseAlertDialog } from '@base-ui/react/alert-dialog';
import { Dialog as BaseDialog } from '@base-ui/react/dialog';
import type { ComponentProps, MouseEvent, ReactNode } from 'react';
import { cx } from './cx';
import { usePortalContainer } from './portal';
import s from './Dialog.module.scss';

export { s as dialogClasses };

// A press on the scrim around the panel keeps focus where it was: in the dialog, never on <body>.
const keepFocus = (e: MouseEvent<HTMLElement>) => e.target === e.currentTarget && e.preventDefault();

type Shell = {
  title: ReactNode;
  description?: ReactNode;
  /** Content between the text and the actions, e.g. a field. */
  children?: ReactNode;
  /** Buttons, Cancel first and the likeliest action last. */
  actions: ReactNode;
  size?: 'sm' | 'md';
  className?: string;
};

type DialogPopupProps = Shell & Pick<ComponentProps<typeof BaseDialog.Popup>, 'initialFocus' | 'finalFocus'>;

/** A task dialog: a short, narrowly scoped job such as Rename or New project. */
function DialogPopup({ title, description, children, actions, size = 'md', className, ...focus }: DialogPopupProps) {
  const container = usePortalContainer();
  return (
    <BaseDialog.Portal container={container}>
      <BaseDialog.Backdrop className={s.backdrop} onMouseDown={keepFocus} />
      <BaseDialog.Viewport className={s.viewport} onMouseDown={keepFocus}>
        <BaseDialog.Popup {...focus} className={cx(s.popup, size === 'sm' && s.sm, className)}>
          <BaseDialog.Title className={s.title}>{title}</BaseDialog.Title>
          {description && <BaseDialog.Description className={s.description}>{description}</BaseDialog.Description>}
          {children && <div className={s.body}>{children}</div>}
          <div className={s.footer}>{actions}</div>
        </BaseDialog.Popup>
      </BaseDialog.Viewport>
    </BaseDialog.Portal>
  );
}

export const Dialog = {
  Root: BaseDialog.Root,
  Trigger: BaseDialog.Trigger,
  Close: BaseDialog.Close,
  Popup: DialogPopup,
};

type AlertPopupProps = Shell & Pick<ComponentProps<typeof BaseAlertDialog.Popup>, 'initialFocus' | 'finalFocus'>;

/**
 * A confirmation that interrupts for a decision. Unlike a task dialog it
 * doesn't close on an outside press: it waits for a button, or Esc to cancel.
 */
function AlertPopup({ title, description, children, actions, size = 'sm', className, ...focus }: AlertPopupProps) {
  const container = usePortalContainer();
  return (
    <BaseAlertDialog.Portal container={container}>
      <BaseAlertDialog.Backdrop className={s.backdrop} onMouseDown={keepFocus} />
      <BaseAlertDialog.Viewport className={s.viewport} onMouseDown={keepFocus}>
        <BaseAlertDialog.Popup {...focus} className={cx(s.popup, size === 'sm' && s.sm, className)}>
          <BaseAlertDialog.Title className={s.title}>{title}</BaseAlertDialog.Title>
          {description && <BaseAlertDialog.Description className={s.description}>{description}</BaseAlertDialog.Description>}
          {children && <div className={s.body}>{children}</div>}
          <div className={s.footer}>{actions}</div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Viewport>
    </BaseAlertDialog.Portal>
  );
}

export const AlertDialog = {
  Root: BaseAlertDialog.Root,
  Trigger: BaseAlertDialog.Trigger,
  Close: BaseAlertDialog.Close,
  Popup: AlertPopup,
};
