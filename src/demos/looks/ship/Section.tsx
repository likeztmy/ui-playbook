import type { ReactNode } from 'react';
import s from './Section.module.scss';

type Props = {
  title: string;
  /** A fact about the section, right-aligned on its heading row; read out when it changes. */
  meta?: ReactNode;
  /** The section's own action, on its heading row. */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** A part of a page held by its heading and the space around it: no box (the lightest boundary that holds). */
export function Section({ title, meta, action, children, className }: Props) {
  return (
    <section className={className ? `${s.section} ${className}` : s.section} aria-label={title}>
      <div className={s.head} data-action={action ? '' : undefined}>
        <h3>{title}</h3>
        {meta !== undefined && (
          <span className={s.meta} aria-live="polite">
            {meta}
          </span>
        )}
        {action}
      </div>
      {children}
    </section>
  );
}
