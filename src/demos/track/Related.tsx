import { CornerLeftUp } from 'lucide-react';
import { Face } from './Face';
import { issueId, type Issue } from './model';
import { StatusIcon } from './StatusIcon';
import type { Track } from './useTrack';
import s from './Details.module.scss';

type Props = { issue: Issue; track: Track; onOpen: (n: number) => void };

/** One related issue as a row you can open, here in the panel. */
export function IssueLink({ issue, onOpen }: { issue: Issue; onOpen: (n: number) => void }) {
  return (
    <button type="button" className={s.issue} onClick={() => onOpen(issue.n)}>
      <StatusIcon status={issue.status} />
      <span className={s.id}>{issueId(issue)}</span>
      <span className={s.text}>{issue.title}</span>
      <Face id={issue.assignee} size="sm" />
    </button>
  );
}

/** Above the title: the issue this one is a step of, so you know where you are before what it is. */
export function ParentLink({ issue, track, onOpen }: Props) {
  const parent = track.get(issue.parent ?? null);
  if (!parent) return null;
  return (
    <button type="button" className={s.parent} onClick={() => onOpen(parent.n)}>
      <CornerLeftUp size={14} strokeWidth={1.5} aria-hidden />
      Sub-issue of <span className={s.id}>{issueId(parent)}</span> <b>{parent.title}</b>
    </button>
  );
}

/** Its steps, with how many are done, in the order work moves. */
export function SubIssues({ issue, track, onOpen }: Props) {
  const steps = track.issues.filter((i) => i.parent === issue.n).sort((a, b) => order(a) - order(b));
  if (!steps.length) return null;
  const done = steps.filter((i) => i.status === 'done').length;
  return (
    <section className={s.section} aria-label="Sub-issues">
      <h3 className={s.head}>
        Sub-issues
        <span className={s.meta}>
          {done} of {steps.length} done
        </span>
        <span className={s.progress} aria-hidden>
          <span style={{ width: `${(done / steps.length) * 100}%` }} />
        </span>
      </h3>
      <ul className={s.rows}>
        {steps.map((i) => (
          <li key={i.n}>
            <IssueLink issue={i} onOpen={onOpen} />
          </li>
        ))}
      </ul>
    </section>
  );
}

const STEP = { backlog: 0, todo: 1, progress: 2, review: 3, done: 4 } as const;
const order = (i: Issue) => STEP[i.status];
