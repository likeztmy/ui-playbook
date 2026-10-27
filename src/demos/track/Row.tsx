import { ListTree } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Badge } from '../../ui/Badge';
import { Checkbox } from '../../ui/Checkbox';
import { AssigneePicker } from './AssigneePicker';
import { Face } from './Face';
import { PrMark } from './PrMark';
import { issueId, NOBODY, priorityName, statusName, type Issue, type Priority, type Status } from './model';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from './options';
import { PEOPLE } from './people';
import { PickMenu } from './PickMenu';
import { PriorityIcon } from './PriorityIcon';
import { StatusIcon } from './StatusIcon';
import type { Track } from './useTrack';
import { ago, fullTime } from './when';
import s from './Row.module.scss';

const PR_WEIGHT = { open: 0, draft: 1, merged: 2, closed: 3 };

// A cell's menu opens from the cell and leaves the row alone: changing a status isn't opening the issue.
const own = (e: MouseEvent) => e.stopPropagation();

type RowProps = {
  issue: Issue;
  track: Track;
  /** Opens the issue, from its title: the panel grows out of it. */
  onOpen: (n: number) => void;
};

/**
 * One issue on one line: tick, how pressing, which, how far, what, its labels, whose, when last
 * touched. Focus, ticked and open are three marks that can all be on one row at once.
 */
export function Row({ issue, track, onOpen }: RowProps) {
  const steps = track.issues.filter((i) => i.parent === issue.n);
  const done = steps.filter((i) => i.status === 'done').length;
  // The pull request that says most about where it is: an open one over a draft over a merged one.
  const pr = [...(issue.prs ?? [])].sort((a, b) => PR_WEIGHT[a.state] - PR_WEIGHT[b.state])[0];
  const n = issue.n;
  const who = issue.assignee ? PEOPLE[issue.assignee].name : null;
  const checked = track.checked.has(n);
  const click = (e: MouseEvent) => {
    // Once you're ticking, a click ticks; otherwise it opens.
    if (track.checked.size || e.shiftKey) track.tick(n, e.shiftKey);
    else onOpen(n);
  };
  return (
    <div
      className={s.row}
      role="listitem"
      tabIndex={track.focus === n || (track.focus == null && track.order[0] === n) ? 0 : -1}
      aria-label={`${issueId(issue)} ${issue.title}, ${statusName(issue.status)}, ${priorityName(issue.priority).toLowerCase()}, ${who ?? 'unassigned'}${checked ? ', selected' : ''}`}
      aria-current={track.open === n || undefined}
      data-issue={issueId(issue)}
      data-n={n}
      data-checked={checked ? '' : undefined}
      data-fresh={track.fresh.has(n) ? '' : undefined}
      onFocus={(e) => e.target === e.currentTarget && track.setFocus(n)}
      onClick={click}
      // Shift-click picks a range of issues, not of text.
      onMouseDown={(e) => e.shiftKey && e.preventDefault()}
    >
      <span className={s.tick} onClick={own}>
        <Checkbox aria-label={`Select ${issueId(issue)}`} tabIndex={-1} checked={checked} onClick={(e) => track.tick(n, e.shiftKey)} />
      </span>
      <PickMenu
        options={PRIORITY_OPTIONS}
        value={issue.priority}
        onPick={(v) => track.update([n], { priority: v as Priority })}
        trigger={
          <button type="button" className={s.cell} tabIndex={-1} aria-label={`Priority: ${priorityName(issue.priority)}`} onClick={own}>
            <PriorityIcon priority={issue.priority} />
          </button>
        }
      />
      <span className={s.id}>{issueId(issue)}</span>
      <PickMenu
        options={STATUS_OPTIONS}
        value={issue.status}
        onPick={(v) => track.update([n], { status: v as Status })}
        trigger={
          <button type="button" className={s.cell} tabIndex={-1} aria-label={`Status: ${statusName(issue.status)}`} onClick={own}>
            <StatusIcon status={issue.status} />
          </button>
        }
      />
      <span className={s.title} data-title={n}>
        {issue.title}
      </span>
      <span className={s.labels}>
        {/* How far its steps and its code have got, before what kind of work it is. */}
        {steps.length > 0 && (
          <span className={s.steps} title={`${done} of ${steps.length} sub-issues done`}>
            <ListTree size={14} strokeWidth={1.5} aria-hidden />
            {done}/{steps.length}
          </span>
        )}
        {pr && <PrMark pr={pr} />}
        {issue.labels.map((l) => (
          <Badge key={l}>{l}</Badge>
        ))}
      </span>
      <AssigneePicker
        value={issue.assignee ?? NOBODY}
        onPick={(id) => track.update([n], { assignee: id === NOBODY ? undefined : id })}
        align="end"
        trigger={
          <button type="button" className={s.cell} tabIndex={-1} aria-label={`Assignee: ${who ?? 'No one'}`} onClick={own}>
            <Face id={issue.assignee} />
          </button>
        }
      />
      <time className={s.time} dateTime={issue.updated} title={fullTime(issue.updated)}>
        {ago(issue.updated)}
      </time>
    </div>
  );
}
