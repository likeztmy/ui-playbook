import type { ReactNode } from 'react';
import { cx } from './cx';
import s from './Badge.module.scss';

export { s as badgeClasses };

export type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

type BadgeProps = {
  children: ReactNode;
  tone?: Tone;
  /** A state (In review, Failed) leads with a dot; an attribute (Beta, Admin) doesn't. */
  status?: boolean;
  className?: string;
};

/** A short, unclickable label for a state or an attribute. */
export function Badge({ children, tone = 'neutral', status, className }: BadgeProps) {
  return (
    <span className={cx(s.badge, tone !== 'neutral' && s[tone], className)} data-tone={tone}>
      {status && <span className={s.dot} aria-hidden />}
      {children}
    </span>
  );
}
