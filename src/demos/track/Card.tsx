import type { PointerEvent } from 'react';
import { Badge } from '../../ui/Badge';
import { Face } from './Face';
import { issueId, priorityName, statusName, type Issue } from './model';
import { PEOPLE } from './people';
import { PriorityIcon } from './PriorityIcon';
import type { Track } from './useTrack';
import s from './Card.module.scss';

type CardProps = {
  issue: Issue;
  track?: Track;
  onOpen?: (n: number) => void;
  onPointerDown?: (e: PointerEvent<HTMLDivElement>) => void;
  /** The copy that follows the pointer while dragging. */
  lifted?: boolean;
};

/** An issue on the board: which, what, whose, and how pressing. Its column says how far along. */
export function Card({ issue, track, onOpen, onPointerDown, lifted }: CardProps) {
  const n = issue.n;
  const who = issue.assignee ? PEOPLE[issue.assignee].name : null;
  const checked = track?.checked.has(n);
  return (
    <div
      className={s.card}
      role={lifted ? undefined : 'listitem'}
      aria-hidden={lifted || undefined}
      tabIndex={lifted ? undefined : track && (track.focus === n || (track.focus == null && track.order[0] === n)) ? 0 : -1}
      aria-label={lifted ? undefined : `${issueId(issue)} ${issue.title}, ${statusName(issue.status)}, ${priorityName(issue.priority).toLowerCase()}, ${who ?? 'unassigned'}${checked ? ', selected' : ''}`}
      aria-current={track?.open === n || undefined}
      data-n={n}
      data-checked={checked ? '' : undefined}
      data-fresh={track?.fresh.has(n) ? '' : undefined}
      data-lifted={lifted ? '' : undefined}
      onFocus={(e) => track && e.target === e.currentTarget && track.setFocus(n)}
      onPointerDown={onPointerDown}
      onClick={(e) => {
        if (!track) return;
        if (track.checked.size || e.shiftKey) track.tick(n, e.shiftKey);
        else onOpen?.(n);
      }}
    >
      <div className={s.top}>
        <span className={s.id}>{issueId(issue)}</span>
        <Face id={issue.assignee} />
      </div>
      <span className={s.title}>
        {issue.title}
      </span>
      <div className={s.meta}>
        <PriorityIcon priority={issue.priority} />
        {issue.labels.map((l) => (
          <Badge key={l}>{l}</Badge>
        ))}
      </div>
    </div>
  );
}
