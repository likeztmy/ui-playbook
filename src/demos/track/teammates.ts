import type { Issue } from './model';

/** A change a teammate makes while you work: what, to which issue, and how it reads in the history. */
export type Change = { n: number; who: string; patch: Partial<Issue>; text: string };

// What the team does during a visit, in order. One arrives now and then; each skips an issue you deleted.
export const CHANGES: Change[] = [
  { n: 51, who: 'kofi', patch: { status: 'review' }, text: 'moved it to In review' },
  { n: 57, who: 'ana', patch: { status: 'progress' }, text: 'moved it to In progress' },
  { n: 61, who: 'yuki', patch: { status: 'todo', priority: 'medium' }, text: 'moved it to Todo' },
  { n: 41, who: 'yuki', patch: { status: 'done' }, text: 'moved it to Done' },
  { n: 49, who: 'tom', patch: { assignee: 'tom' }, text: 'took it' },
  { n: 64, who: 'tom', patch: { status: 'progress' }, text: 'moved it to In progress' },
];

/** First change after this long, then one every so often: enough to be noticed, not to nag. */
export const FIRST = 15000;
export const EVERY = 30000;
