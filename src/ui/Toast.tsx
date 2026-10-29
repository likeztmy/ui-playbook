import { Toast } from '@base-ui/react/toast';
import { CircleAlert, CircleCheck, Info, TriangleAlert, X, type LucideIcon } from 'lucide-react';
import { useCallback, type ReactNode } from 'react';
import { Button, buttonClass } from './Button';
import { cx } from './cx';
import { Tip } from './Tooltip';
import s from './Toast.module.scss';

export { s as toastClasses };

export type ToastType = 'success' | 'error' | 'warning' | 'info';

const ICON: Record<ToastType, LucideIcon> = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
};

/** Precision's timings: 4s, 6s when there's an Undo, errors stay until closed. */
export const TIMEOUT = { plain: 4000, action: 6000, error: 0 };

type ShowOptions = {
  title: string;
  type?: ToastType;
  /** One action, usually Undo. */
  action?: { label: string; onClick: () => void };
  /** Overrides the timeout Precision gives this kind of toast. */
  timeout?: number;
};

/** Shows toasts with Precision's defaults for timing and priority. */
export function useToast() {
  const manager = Toast.useToastManager();
  return useCallback(
    ({ title, type, action, timeout }: ShowOptions) => {
      const error = type === 'error';
      const id = manager.add({
        title,
        type,
        // Errors are announced at once (role="alert") and wait to be closed.
        priority: error ? 'high' : 'low',
        timeout: timeout ?? (error ? TIMEOUT.error : action ? TIMEOUT.action : TIMEOUT.plain),
        actionProps: action
          ? {
              children: action.label,
              onClick: () => {
                manager.close(id);
                action.onClick();
              },
            }
          : undefined,
      });
      return id;
    },
    [manager],
  );
}

function List() {
  const { toasts } = Toast.useToastManager();
  return toasts.map((t) => {
    const Icon = t.type ? ICON[t.type as ToastType] : undefined;
    return (
      <Toast.Root key={t.id} toast={t} className={s.toast} swipeDirection="down">
        {Icon && <Icon className={s.icon} size={16} aria-hidden />}
        <Toast.Title className={s.title} />
        <span className={s.actions}>
          {t.actionProps && <Toast.Action className={buttonClass({})} />}
          <Tip label="Dismiss">
            <Toast.Close render={<Button variant="ghost" icon aria-label="Dismiss" />}>
              <X size={16} aria-hidden />
            </Toast.Close>
          </Tip>
        </span>
      </Toast.Root>
    );
  });
}

type ProviderProps = {
  children: ReactNode;
  /** At most this many on screen; more wait their turn. */
  limit?: number;
  /** Render the viewport into this element instead of the body. */
  container?: HTMLElement | null;
  /** Anchor the stack to its container rather than the window. */
  contained?: boolean;
  /** Bottom centre, or bottom left as in Gmail. */
  align?: 'center' | 'start';
};

/** The toast queue and the place they appear: bottom centre, newest lowest. */
export function ToastProvider({ children, limit = 3, container, contained, align = 'center' }: ProviderProps) {
  return (
    <Toast.Provider limit={limit}>
      {children}
      <Toast.Portal container={container ?? undefined}>
        <Toast.Viewport className={cx(s.viewport, contained && s.contained, align === 'start' && s.start)}>
          <List />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
