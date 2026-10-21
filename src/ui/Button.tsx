import { Button as BaseButton } from '@base-ui/react/button';
import { LoaderCircle } from 'lucide-react';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';
import s from './Button.module.scss';

export type ButtonProps = ComponentProps<typeof BaseButton> & {
  /** `danger-fill` is the one filled button of a destructive dialog. */
  variant?: 'secondary' | 'primary' | 'ghost' | 'danger' | 'danger-fill';
  size?: 'sm' | 'md' | 'lg';
  /** Square icon-only button. Needs an aria-label and a Tip. */
  icon?: boolean;
  /** Busy: spinner in the icon slot, label swapped, presses ignored. */
  loading?: boolean;
  /** The label while loading, e.g. "Saving". Its width is reserved up front. */
  loadingLabel?: string;
  /** Leading icon; the spinner takes its place while loading. */
  leading?: ReactNode;
};

const VARIANT_CLASS = { primary: s.primary, ghost: s.ghost, danger: s.danger, 'danger-fill': s.dangerFill } as const;

export function buttonClass({ variant = 'secondary', size = 'md', icon }: Pick<ButtonProps, 'variant' | 'size' | 'icon'>) {
  return cx(s.button, variant !== 'secondary' && VARIANT_CLASS[variant], size !== 'md' && s[size], icon && s.icon);
}

export function Button({
  variant,
  size,
  icon,
  loading,
  loadingLabel,
  leading,
  children,
  className,
  onClick,
  ...props
}: ButtonProps) {
  const spinner = <LoaderCircle className={s.spinner} size={16} strokeWidth={1.5} absoluteStrokeWidth aria-hidden />;

  // Idle and busy content share one grid cell, spinner included, so the
  // button is as wide as the wider of the two from the start and never jumps.
  const content =
    loadingLabel !== undefined ? (
      <span className={s.labels}>
        <span className={s.layer} data-hidden={loading ? '' : undefined}>
          {leading}
          {children}
        </span>
        <span className={s.layer} data-hidden={loading ? undefined : ''} aria-hidden={!loading}>
          {spinner}
          {loadingLabel}
        </span>
      </span>
    ) : (
      <>
        {loading ? spinner : leading}
        {children}
      </>
    );

  return (
    <BaseButton
      {...props}
      aria-busy={loading || undefined}
      // Stays focusable and in the tab order while busy; presses do nothing.
      onClick={loading ? (e) => e.preventDefault() : onClick}
      data-loading={loading ? '' : undefined}
      className={cx(buttonClass({ variant, size, icon }), className as string)}
    >
      {content}
    </BaseButton>
  );
}
