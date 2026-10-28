import type { Activity, Issue } from './model';
import { PEOPLE } from './people';
import type { Change } from './teammates';

/** A teammate's change as it arrived, waiting behind the list's pill: when, so Inbox can date it. */
export type Arrival = Change & { at: string };

/** How a comment names you. */
const MENTION = '@Alex';

/** What reaches Inbox: a teammate's doing. Integrations, opening the issue and your own don't. */
const isEvent = (a: Activity) => !!PEOPLE[a.who] && !PEOPLE[a.who].me && a.text !== 'created the issue';

/** Yours, as Linear subscribes you: assigned to you, opened by you, or you're mentioned in it. */
const isYours = (i: Issue) => i.assignee === 'me' || i.activity[0]?.who === 'me' || i.activity.some((a) => a.body?.includes(MENTION));

/** The issue as it will be once what's waiting for it is let in: Inbox tells you before the list moves. */
function ahead(issue: Issue, waiting: Arrival[]): Issue {
  return waiting
    .filter((c) => c.n === issue.n)
    .reduce((i, c) => ({ ...i, ...c.patch, activity: [...i.activity, { who: c.who, text: c.text, at: c.at, body: c.body }] }), issue);
}

/** Per issue: read up to a time, marked unread by hand, or cleared up to a time. */
export type Mark = { read?: string; unread?: boolean; cleared?: string };

export type Entry = { issue: Issue; event: Activity; unread: boolean };

/**
 * One entry per issue of yours, from its newest teammate event, newest first. Read once you've
 * opened it, or done something to it yourself since; cleared ones come back with the next event.
 */
export function entries(issues: Issue[], waiting: Arrival[], marks: Record<number, Mark>): Entry[] {
  return issues
    .map((i) => ahead(i, waiting))
    .filter(isYours)
    .flatMap((issue) => {
      const event = issue.activity.filter(isEvent).at(-1);
      const m = marks[issue.n] ?? {};
      if (!event || event.at <= (m.cleared ?? '')) return [];
      // Something you did since says you've seen it; at the same moment, theirs still counts.
      const mine = issue.activity.filter((a) => a.who === 'me').at(-1)?.at ?? '';
      return [{ issue, event, unread: !!m.unread || (event.at > (m.read ?? '') && event.at >= mine) }];
    })
    .sort((a, b) => b.event.at.localeCompare(a.event.at));
}
