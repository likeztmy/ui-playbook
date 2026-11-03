import { CircleCheck, CircleX, LoaderCircle } from 'lucide-react';
import r from './Rows.module.scss';

export type Check = { name: string; state: string; outcome: 'passed' | 'failed' | 'running' };

// Running is progress, not a caution: it takes info (C35), so amber keeps one meaning, In review.
const MARK = {
  passed: { Icon: CircleCheck, tone: 'success', word: 'Passed' },
  failed: { Icon: CircleX, tone: 'danger', word: 'Failed' },
  running: { Icon: LoaderCircle, tone: 'info', word: 'Running' },
} as const;

/** Checks as rows: the outcome as an icon and a word, never colour alone. The icon is named (C9). */
export function CheckList({ checks }: { checks: Check[] }) {
  return (
    <ul className={r.rows}>
      {checks.map(({ name, state, outcome }) => {
        const { Icon, tone, word } = MARK[outcome];
        return (
          <li key={name}>
            <Icon size={16} data-tone={tone} role="img" aria-label={word} />
            <span className={r.grow}>{name}</span>
            <span className={r.muted}>{state}</span>
          </li>
        );
      })}
    </ul>
  );
}
