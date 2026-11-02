import type { ReactNode } from 'react';
import s from './Section.module.scss';

/** A part of a page held by its heading and the space around it: no box (the lightest boundary that holds). */
export function Section({ title, meta, children, className }: { title: string; meta?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={className ? `${s.section} ${className}` : s.section} aria-label={title}>
      <div className={s.head}>
        <h3>{title}</h3>
        {meta !== undefined && (
          <span className={s.meta} aria-live="polite">
            {meta}
          </span>
        )}
      </div>
      {children}
    </section>
  );
}
