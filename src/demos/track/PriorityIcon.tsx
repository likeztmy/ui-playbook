import type { Priority } from './model';
import s from './icons.module.scss';

const BARS: Record<Priority, number> = { urgent: 3, high: 3, medium: 2, low: 1, none: 0 };

/** Bars rising like a signal, as many filled as it matters; urgent is a filled mark of its own. */
export function PriorityIcon({ priority }: { priority: Priority }) {
  if (priority === 'urgent')
    return (
      <svg className={s.priority} data-priority="urgent" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        <rect x="1" y="1" width="12" height="12" rx="3" fill="currentColor" />
        <path d="M7 3.8v3.8" stroke="var(--surface)" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="7" cy="10" r="0.95" fill="var(--surface)" />
      </svg>
    );
  if (priority === 'none')
    return (
      <svg className={s.priority} data-priority="none" width="14" height="14" viewBox="0 0 14 14" aria-hidden>
        {[2, 6, 10].map((x) => (
          <rect key={x} x={x} y="6.25" width="2" height="1.5" rx="0.5" fill="currentColor" />
        ))}
      </svg>
    );
  return (
    <svg className={s.priority} data-priority={priority} width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      {[0, 1, 2].map((i) => (
        <rect key={i} x={1.5 + i * 4} y={9 - i * 3} width="3" height={3.5 + i * 3} rx="0.75" fill="currentColor" opacity={i < BARS[priority] ? 1 : 0.28} />
      ))}
    </svg>
  );
}
