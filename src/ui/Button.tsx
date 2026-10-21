import { Button as BaseButton } from '@base-ui/react/button';
import type { ComponentProps } from 'react';
import { cx } from './cx';
import s from './Button.module.scss';

export type ButtonProps = ComponentProps<typeof BaseButton> & {
  variant?: 'secondary' | 'primary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Square icon-only button. Needs an aria-label. */
  icon?: boolean;
};

export function buttonClass({ variant = 'secondary', size = 'md', icon }: Omit<ButtonProps, 'className'>) {
  return cx(
    s.button,
    variant !== 'secondary' && s[variant],
    size !== 'md' && s[size],
    icon && s.icon,
  );
}

export function Button({ variant, size, icon, className, ...props }: ButtonProps) {
  return <BaseButton {...props} className={cx(buttonClass({ variant, size, icon }), className as string)} />;
}
