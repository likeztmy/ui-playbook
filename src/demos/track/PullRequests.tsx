import { CircleCheck, CircleDashed, CircleX } from 'lucide-react';
import type { PullRequest } from './model';
import { MARK, STATE } from './PrMark';
import s from './Details.module.scss';

const ic = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const;
const REVIEW = { approved: 'Approved', changes: 'Changes asked for', waiting: 'Waiting for review' };

/**
 * The code that closes it, from GitHub: each pull request's state, then what it's waiting on, the
 * failing check named, so you know whether to look without leaving the issue.
 */
export function PullRequests({ prs }: { prs?: PullRequest[] }) {
  if (!prs?.length) return null;
  return (
    <section className={s.section} aria-label="Pull requests">
      <h3 className={s.head}>
        Pull requests <span className={s.meta}>{prs.length}</span>
      </h3>
      <ul className={s.rows}>
        {prs.map((pr) => {
          const Mark = MARK[pr.state];
          const c = pr.checks;
          return (
            <li key={`${pr.repo}-${pr.number}`} className={s.pr}>
              <Mark {...ic} className={s[pr.state]} />
              <div>
                <div className={s.prTitle}>{pr.title}</div>
                <div className={s.prMeta}>
                  <span className={s.repo}>
                    {pr.repo} #{pr.number}
                  </span>
                  <span>{STATE[pr.state]}</span>
                </div>
                {(c || pr.review) && (
                  <div className={s.prChecks}>
                    {c &&
                      (c.failing ? (
                        <span className={s.failing}>
                          <CircleX size={12} strokeWidth={2} aria-hidden /> {c.failing} failed
                        </span>
                      ) : c.passed === c.total ? (
                        <span className={s.passing}>
                          <CircleCheck size={12} strokeWidth={2} aria-hidden /> {c.total} checks passed
                        </span>
                      ) : (
                        <span>
                          <CircleDashed size={12} strokeWidth={2} aria-hidden /> {c.passed} of {c.total} checks
                        </span>
                      ))}
                    {pr.review && <span className={pr.review === 'changes' ? s.failing : undefined}>{REVIEW[pr.review]}</span>}
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
