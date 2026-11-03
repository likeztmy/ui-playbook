import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import r from './Rows.module.scss';

export type Check = { name: string; state: string; outcome: 'passed' | 'failed' | 'running' };

// Running is progress, not a caution: it takes info (C35), so amber keeps one meaning, In review.
const MARK = {
  passed: { Icon: CircleCheck, tone: 'success' },
  failed: { Icon: CircleX, tone: 'danger' },
  running: { Icon: LoaderCircle, tone: 'info' },
} as const;

/** Checks as rows: the outcome as an icon and a word, never colour alone. */
export function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className={r.rows}>
      {checks.map(({ name, state, outcome }) => {
        const { Icon, tone } = MARK[outcome];
        return (
          <li key={name}>
            <Icon size={16} data-tone={tone} aria-hidden />
            <span className={r.grow}>{name}</span>
            <span className={r.muted}>{state}</span>
          </li>
        );
      })}
    </ul>
  );
}
