import { CircleAlert, GitMerge, GitPullRequest, GitPullRequestClosed, GitPullRequestDraft } from 'lucide-react';
import { Tip } from '../../ui/Tooltip';
import type { PullRequest } from './model';
import s from './PrMark.module.scss';

export const MARK = { draft: GitPullRequestDraft, open: GitPullRequest, merged: GitMerge, closed: GitPullRequestClosed };
export const STATE = { draft: 'Draft', open: 'Open', merged: 'Merged', closed: 'Closed' };

/**
 * A pull request in a row, as its mark: open, draft, merged or closed by shape; a failing check or a
 * change asked for turns it into an alert, red, the one state there worth stopping for. Its shape
 * says so without the colour, and the tip says what went wrong.
 */
export function PrMark({ pr }: { pr: PullRequest }) {
  const trouble = !!pr.checks?.failing || pr.review === 'changes';
  const Mark = trouble ? CircleAlert : MARK[pr.state];
  const what = `${pr.repo} #${pr.number}: ${STATE[pr.state]}${pr.checks?.failing ? `, ${pr.checks.failing} failed` : ''}${pr.review === 'changes' ? ', changes asked for' : ''}`;
  return (
    <Tip label={what}>
      <span className={s.mark} data-state={pr.state} data-trouble={trouble ? '' : undefined}>
        <Mark size={14} aria-label={what} />
      </span>
    </Tip>
  );
}
