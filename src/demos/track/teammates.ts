import type { Issue } from './model';

/** A change a teammate makes while you work: what, to which issue, and how it reads in the history; a comment has its words. */
export type Change = { n: number; who: string; patch: Partial<Issue>; text: string; body?: string };

// What the team does during a visit, in order. One arrives now and then; each skips an issue you deleted.
// A few are yours and reach Inbox (notifications.ts); the rest only change the list.
export const CHANGES: Change[] = [
  { n: 53, who: 'ana', patch: {}, text: 'commented', body: 'Should the default follow the last address used? Most people ship to one place.' },
  { n: 51, who: 'kofi', patch: { status: 'review' }, text: 'moved it to In review' },
  { n: 60, who: 'kofi', patch: { assignee: 'me' }, text: 'assigned it to you' },
  { n: 57, who: 'ana', patch: { status: 'progress' }, text: 'moved it to In progress' },
  { n: 51, who: 'kofi', patch: {}, text: 'commented', body: '@Alex does the cart survive the redirect? If not, this one hits SHOP-54 too.' },
  { n: 61, who: 'yuki', patch: { status: 'todo', priority: 'medium' }, text: 'moved it to Todo' },
  { n: 43, who: 'yuki', patch: { status: 'done' }, text: 'moved it to Done' },
  { n: 41, who: 'yuki', patch: { status: 'done' }, text: 'moved it to Done' },
  { n: 49, who: 'tom', patch: { assignee: 'tom' }, text: 'took it' },
  { n: 64, who: 'tom', patch: { status: 'progress' }, text: 'moved it to In progress' },
];

/** First change after this long, then one every so often: enough to be noticed, not to nag. */
export const FIRST = 15000;
export const EVERY = 30000;
