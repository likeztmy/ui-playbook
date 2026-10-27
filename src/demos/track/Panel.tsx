import { ArrowLeft, Ban, ChevronDown, ChevronUp, GitBranch, Tag, Trash2, X } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { useToast } from '../../ui/Toast';
import { Tip, TipGroup } from '../../ui/Tooltip';
import { Activity } from './Activity';
import { AssigneePicker } from './AssigneePicker';
import { Face } from './Face';
import { issueId, NOBODY, priorityName, statusName, type Issue, type Priority, type Status } from './model';
import { LABEL_OPTIONS, PRIORITY_OPTIONS, STATUS_OPTIONS } from './options';
import { PEOPLE } from './people';
import { PickMenu } from './PickMenu';
import { PullRequests } from './PullRequests';
import { IssueLink, ParentLink, SubIssues } from './Related';
import { ReleaseProgress } from './ReleaseProgress';
import { PriorityIcon } from './PriorityIcon';
import { StatusIcon } from './StatusIcon';
import type { Track } from './useTrack';
import { dueIn } from './when';
import s from './Panel.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

type PanelProps = {
  issue: Issue;
  track: Track;
  onClose: () => void;
  /** A phone: the panel is the whole screen, with Back. */
  narrow: boolean;
  closeRef?: RefObject<HTMLButtonElement | null>;
};

/** Text that saves when you leave it, Enter for a one-line title; emptied, it goes back to what it was. */
function useDraft(value: string, save: (v: string) => void, required: boolean) {
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  const commit = () => {
    const v = required ? draft.trim() : draft;
    if (required && !v) return setDraft(value);
    if (v !== value) save(v);
  };
  return { draft, setDraft, commit };
}

/** An element that grows with its text, so the title and description never scroll inside themselves. */
const grow = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.style.height = '0';
  el.style.height = `${el.scrollHeight}px`;
};

/**
 * One issue beside the list: what it is, its properties, and what's happened to it. The list stays
 * in view, so the next issue is one key away and you never lose your place.
 */
export function Panel({ issue, track, onClose, narrow, closeRef }: PanelProps) {
  const n = issue.n;
  const title = useDraft(issue.title, (t) => track.update([n], { title: t }), true);
  const body = useDraft(issue.description, (d) => track.update([n], { description: d }), false);
  const titleEl = useRef<HTMLTextAreaElement>(null);
  const bodyEl = useRef<HTMLTextAreaElement>(null);
  useEffect(() => {
    grow(titleEl.current);
    grow(bodyEl.current);
  });
  const i = track.order.indexOf(n);
  const go = (step: number) => {
    const next = track.order[i + step];
    if (next == null) return;
    track.setOpen(next);
    track.setFocus(next);
  };
  const who = issue.assignee ? PEOPLE[issue.assignee] : null;
  // Another issue from this one: a step, its parent, what blocks it. It opens here, and focus follows.
  const openHere = (m: number) => {
    track.setOpen(m);
    track.setFocus(m);
  };
  const toast = useToast();
  // The branch a pull request for it would come from, as GitHub's integration names it.
  const branch = `${PEOPLE[issue.assignee ?? 'me']?.name.split(' ')[0].toLowerCase()}/${issueId(issue).toLowerCase()}-${issue.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40)
    .replace(/-$/, '')}`;
  const copyBranch = async () => {
    try {
      await navigator.clipboard.writeText(branch);
      toast({ title: `Copied ${branch}` });
    } catch {
      toast({ title: 'Couldn’t copy the branch name' });
    }
  };
  const blockers = (issue.blockedBy ?? []).map((b) => track.get(b)).filter((b) => b && b.status !== 'done') as Issue[];
  const due = issue.due ? dueIn(issue.due) : null;

  return (
    <aside className={s.panel} aria-label={issueId(issue)} data-narrow={narrow ? '' : undefined}>
      <div className={s.bar}>
        {narrow && (
          <Button ref={closeRef} variant="ghost" size="sm" onClick={onClose}>
            <ArrowLeft {...ic} />
            Issues
          </Button>
        )}
        <span className={s.id}>{issueId(issue)}</span>
        <TipGroup>
          <span className={s.tools}>
            {!narrow && (
              <>
                <Tip label="Previous issue" keys={['↑']}>
                  <Button variant="ghost" icon aria-label="Previous issue" disabled={i <= 0} onClick={() => go(-1)}>
                    <ChevronUp {...ic} />
                  </Button>
                </Tip>
                <Tip label="Next issue" keys={['↓']}>
                  <Button variant="ghost" icon aria-label="Next issue" disabled={i < 0 || i >= track.order.length - 1} onClick={() => go(1)}>
                    <ChevronDown {...ic} />
                  </Button>
                </Tip>
              </>
            )}
            <Tip label="Copy branch name">
              <Button variant="ghost" icon aria-label="Copy branch name" onClick={copyBranch}>
                <GitBranch {...ic} />
              </Button>
            </Tip>
            <Tip label="Delete">
              <Button variant="ghost" icon aria-label="Delete" onClick={() => track.remove([n])}>
                <Trash2 {...ic} />
              </Button>
            </Tip>
            {!narrow && (
              <Tip label="Close" keys={['Esc']}>
                <Button ref={closeRef} variant="ghost" icon aria-label="Close" onClick={onClose}>
                  <X {...ic} />
                </Button>
              </Tip>
            )}
          </span>
        </TipGroup>
      </div>

      <div className={s.body}>
        <ParentLink issue={issue} track={track} onOpen={openHere} />
        <textarea
          ref={titleEl}
          className={s.title}
          data-panel-title=""
          aria-label="Title"
          rows={1}
          value={title.draft}
          onChange={(e) => {
            title.setDraft(e.target.value.replace(/\n/g, ''));
            grow(e.target);
          }}
          onBlur={title.commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.currentTarget.blur();
            }
            if (e.key === 'Escape') {
              title.setDraft(issue.title);
              e.currentTarget.blur();
            }
          }}
        />

        {/* Properties: a label column and a value column, every value a control on one left edge. */}
        <dl className={s.props}>
          <dt>Status</dt>
          <dd>
            <PickMenu
              options={STATUS_OPTIONS}
              value={issue.status}
              onPick={(v) => track.update([n], { status: v as Status })}
              trigger={
                <button type="button" className={s.value}>
                  <StatusIcon status={issue.status} />
                  {statusName(issue.status)}
                </button>
              }
            />
          </dd>
          <dt>Priority</dt>
          <dd>
            <PickMenu
              options={PRIORITY_OPTIONS}
              value={issue.priority}
              onPick={(v) => track.update([n], { priority: v as Priority })}
              trigger={
                <button type="button" className={s.value}>
                  <PriorityIcon priority={issue.priority} />
                  {priorityName(issue.priority)}
                </button>
              }
            />
          </dd>
          <dt>Assignee</dt>
          <dd>
            <AssigneePicker
              value={issue.assignee ?? NOBODY}
              onPick={(id) => track.update([n], { assignee: id === NOBODY ? undefined : id })}
              trigger={
                <button type="button" className={s.value} data-empty={who ? undefined : ''}>
                  <Face id={issue.assignee} size="sm" />
                  {who ? who.name : 'No one'}
                </button>
              }
            />
          </dd>
          <dt>Labels</dt>
          <dd>
            <PickMenu
              multiple
              options={LABEL_OPTIONS}
              value={issue.labels}
              onPick={(v) => track.update([n], { labels: v })}
              trigger={
                <button type="button" className={s.value} data-empty={issue.labels.length ? undefined : ''}>
                  {issue.labels.length ? (
                    issue.labels.map((l) => <Badge key={l}>{l}</Badge>)
                  ) : (
                    <>
                      <Tag {...ic} size={14} />
                      Add label
                    </>
                  )}
                </button>
              }
            />
          </dd>
          {/* Set elsewhere in a real tracker (cycle planning, the estimate poker), so read here. */}
          {issue.cycle && (
            <>
              <dt>Cycle</dt>
              <dd className={s.plain}>{issue.cycle}</dd>
            </>
          )}
          {due && (
            <>
              <dt>Due</dt>
              <dd className={s.plain} data-soon={due.soon && issue.status !== 'done' ? '' : undefined}>
                {due.text}
              </dd>
            </>
          )}
          {issue.estimate != null && (
            <>
              <dt>Estimate</dt>
              <dd className={s.plain}>{issue.estimate === 1 ? '1 point' : `${issue.estimate} points`}</dd>
            </>
          )}
        </dl>

        {/* What it waits on, first after its state: the one thing that says it can't move yet. */}
        {blockers.length > 0 && (
          <section className={s.blocked} aria-label="Blocked by">
            <h3 className={s.blockedHead}>
              <Ban size={14} strokeWidth={2} aria-hidden />
              Blocked by
            </h3>
            {blockers.map((b) => (
              <IssueLink key={b.n} issue={b} onOpen={openHere} />
            ))}
          </section>
        )}

        <textarea
          ref={bodyEl}
          className={s.description}
          aria-label="Description"
          placeholder="Add a description…"
          value={body.draft}
          onChange={(e) => {
            body.setDraft(e.target.value);
            grow(e.target);
          }}
          onBlur={body.commit}
        />

        <SubIssues issue={issue} track={track} onOpen={openHere} />
        <PullRequests prs={issue.prs} />
        <ReleaseProgress release={issue.release} />
        <Activity issue={issue} track={track} />
      </div>
    </aside>
  );
}
