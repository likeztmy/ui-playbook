import { GitPullRequest, Rocket } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Tip } from '../../ui/Tooltip';
import { Face } from './Face';
import type { Issue } from './model';
import { PEOPLE } from './people';
import type { Track } from './useTrack';
import { ago, fullTime } from './when';
import s from './Activity.module.scss';

// The integrations act on issues as people do, so they get a place in the history, drawn as a mark
// where a face would be.
const BOTS: Record<string, { name: string; Mark: typeof Rocket }> = {
  github: { name: 'GitHub', Mark: GitPullRequest },
  shipyard: { name: 'Shipyard', Mark: Rocket },
};

const nameOf = (who: string) => BOTS[who]?.name ?? (PEOPLE[who]?.me ? 'You' : (PEOPLE[who]?.name.split(' ')[0] ?? 'Someone'));

/**
 * What's happened to it, oldest first, ending where you add to it. Changes are one quiet line each;
 * what people said stands apart as a block, since it's what you came to read.
 */
export function Activity({ issue, track }: { issue: Issue; track: Track }) {
  const [draft, setDraft] = useState('');
  const box = useRef<HTMLTextAreaElement>(null);
  // Closed while you were in the box: no blur comes, so let go here.
  useEffect(() => () => track.hold('comment', false), []);
  const send = () => {
    const body = draft.trim();
    if (!body) return box.current?.focus();
    track.comment(issue.n, body);
    setDraft('');
  };

  return (
    <section className={s.activity} aria-label="Activity">
      <h3 className={s.heading}>Activity</h3>
      <ol className={s.list}>
        {issue.activity.map((a, k) => {
          const bot = BOTS[a.who];
          const mark = bot ? (
            <span className={s.bot} aria-hidden>
              <bot.Mark size={11} strokeWidth={2} />
            </span>
          ) : (
            <Face id={a.who} size="sm" />
          );
          const time = (
            <time dateTime={a.at} title={fullTime(a.at)}>
              {ago(a.at)}
            </time>
          );
          return a.body ? (
            <li key={k} className={s.comment}>
              <div className={s.line}>
                {mark}
                <span>
                  <b>{nameOf(a.who)}</b>
                </span>
                {time}
              </div>
              <p className={s.body}>{a.body}</p>
            </li>
          ) : (
            <li key={k} className={s.line}>
              {mark}
              <span>
                <b>{nameOf(a.who)}</b> {a.text}
              </span>
              {time}
            </li>
          );
        })}
      </ol>

      <div className={s.compose}>
        <textarea
          ref={box}
          className={s.box}
          aria-label="Comment"
          placeholder="Leave a comment…"
          rows={1}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          // Writing here is a task under way: teammates' changes wait until you leave it.
          onFocus={() => track.hold('comment', true)}
          onBlur={() => track.hold('comment', false)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              send();
            }
            // Esc leaves the box, not the issue: what you wrote stays.
            if (e.key === 'Escape') {
              e.stopPropagation();
              e.currentTarget.blur();
            }
          }}
        />
        <Tip keys={['⌘', '↵']}>
          <Button size="sm" className={s.send} onClick={send}>
            Comment
          </Button>
        </Tip>
      </div>
    </section>
  );
}
