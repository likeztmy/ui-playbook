import { GitMerge, GitPullRequest, GitPullRequestClosed, GitPullRequestDraft } from 'lucide-react';
import type { PullRequest } from './model';
import s from './PrMark.module.scss';

export const MARK = { draft: GitPullRequestDraft, open: GitPullRequest, merged: GitMerge, closed: GitPullRequestClosed };
export const STATE = { draft: 'Draft', open: 'Open', merged: 'Merged', closed: 'Closed' };

/**
 * A pull request in a row, as its mark: open, draft, merged or closed by shape; a failing check or a
 * change asked for turns it red, the one state there worth stopping for.
 */
export function PrMark({ pr }: { pr: PullRequest }) {
  const Mark = MARK[pr.state];
  const trouble = !!pr.checks?.failing || pr.review === 'changes';
  const what = `${pr.repo} #${pr.number}: ${STATE[pr.state]}${pr.checks?.failing ? `, ${pr.checks.failing} failed` : ''}${pr.review === 'changes' ? ', changes asked for' : ''}`;
  return (
    <span className={s.mark} data-state={pr.state} data-trouble={trouble ? '' : undefined} title={what}>
      <Mark size={14} strokeWidth={1.5} aria-label={what} />
    </span>
  );
}
