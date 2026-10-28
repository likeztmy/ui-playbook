import { Face } from './Face';
import type { Entry } from './notifications';
import { issueId } from './model';
import { PEOPLE } from './people';
import { ago, fullTime } from './when';
import s from './InboxRow.module.scss';

type Props = {
  entry: Entry;
  /** Where Tab lands in the list. */
  tabStop: boolean;
  current: boolean;
  onOpen: (n: number) => void;
  onFocus: (n: number) => void;
};

/** One issue of yours on two lines: which, then who did what to it; unread marked at the start. */
export function InboxRow({ entry: { issue, event, unread }, tabStop, current, onOpen, onFocus }: Props) {
  const n = issue.n;
  const first = PEOPLE[event.who].name.split(' ')[0];
  const what = `${first} ${event.text}${event.body ? `: ${event.body}` : ''}`;
  return (
    <div
      className={s.row}
      role="listitem"
      tabIndex={tabStop ? 0 : -1}
      aria-label={`${unread ? 'Unread, ' : ''}${issueId(issue)} ${issue.title}. ${what}`}
      aria-current={current || undefined}
      data-n={n}
      data-unread={unread ? '' : undefined}
      onFocus={(e) => e.target === e.currentTarget && onFocus(n)}
      onClick={() => onOpen(n)}
    >
      <span className={s.dot} aria-hidden />
      <Face id={event.who} size="lg" />
      <span className={s.what}>
        <span className={s.line}>
          <span className={s.id}>{issueId(issue)}</span>
          <span className={s.title} data-title={n}>
            {issue.title}
          </span>
        </span>
        <span className={s.event}>{what}</span>
      </span>
      <time className={s.time} dateTime={event.at} title={fullTime(event.at)}>
        {ago(event.at)}
      </time>
    </div>
  );
}
