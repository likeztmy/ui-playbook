// Track's data: one team's issues for the shop app it's building.

export type Status = 'backlog' | 'todo' | 'progress' | 'review' | 'done';
export type Priority = 'urgent' | 'high' | 'medium' | 'low' | 'none';

export type Person = { id: string; name: string; me?: boolean };

export type Issue = {
  /** The number after the project's key: SHOP-12. */
  n: number;
  title: string;
  status: Status;
  priority: Priority;
  assignee?: string;
  labels: string[];
  /** ISO time of the last change. */
  updated: string;
  description: string;
  /** Where it sits in its status: lower first. Dragging on the board changes it. */
  rank: number;
  activity: Activity[];
  /** The issue this is a step of. */
  parent?: number;
  /** Issues that have to be done first. */
  blockedBy?: number[];
  cycle?: string;
  /** A day, YYYY-MM-DD. */
  due?: string;
  /** Points. */
  estimate?: number;
  /** Code changes on GitHub that close it. */
  prs?: PullRequest[];
  /** The build it ships in, on the team's release platform. */
  release?: Release;
};

/**
 * One line of an issue's history: who did what, when. A comment has a body; `who` may be 'github' or
 * 'shipyard', the integrations, which act on an issue as people do.
 */
export type Activity = { who: string; text: string; at: string; body?: string };

export type PullRequest = {
  repo: string;
  number: number;
  title: string;
  state: 'draft' | 'open' | 'merged' | 'closed';
  /** Checks that passed, of all; a failing one by name. */
  checks?: { passed: number; total: number; failing?: string };
  review?: 'approved' | 'changes' | 'waiting';
};

/** Shipyard, the team's release platform: a build goes through these, then out to a share of people. */
export const STAGES = ['Build', 'QA', 'Rollout', 'Released'] as const;
export type Release = { name: string; stage: (typeof STAGES)[number]; /** Of people, while rolling out. */ rollout?: number; since: string };

/** What the list shows: everyone's when empty. Each set narrows by "any of". */
export type Filter = { assignee: string[]; label: string[]; priority: Priority[] };
export const NO_FILTER: Filter = { assignee: [], label: [], priority: [] };

/** "No one", as a value an assignee filter can hold. */
export const NOBODY = 'none';

export const LABELS = ['Bug', 'Feature', 'Design', 'Performance', 'Catalogue', 'Search', 'Cart', 'Checkout', 'Payments', 'Account'];

/** Statuses in the order work moves through them; each group in the list follows it. */
export const STATUSES: { id: Status; name: string }[] = [
  { id: 'backlog', name: 'Backlog' },
  { id: 'todo', name: 'Todo' },
  { id: 'progress', name: 'In progress' },
  { id: 'review', name: 'In review' },
  { id: 'done', name: 'Done' },
];

export const PRIORITIES: { id: Priority; name: string }[] = [
  { id: 'urgent', name: 'Urgent' },
  { id: 'high', name: 'High' },
  { id: 'medium', name: 'Medium' },
  { id: 'low', name: 'Low' },
  { id: 'none', name: 'No priority' },
];

export const KEY = 'SHOP';
export const issueId = (i: Issue) => `${KEY}-${i.n}`;

const RANK = Object.fromEntries(PRIORITIES.map((p, i) => [p.id, i])) as Record<Priority, number>;

/** The sample's first order within a group: the most pressing first, then the most recently changed. */
export const byPriority = (a: Issue, b: Issue) => RANK[a.priority] - RANK[b.priority] || b.updated.localeCompare(a.updated);

/** The order every view shows: by rank, which starts as byPriority and moves when a card is dragged. */
export const byRank = (a: Issue, b: Issue) => a.rank - b.rank;

export const statusName = (id: Status) => STATUSES.find((s) => s.id === id)!.name;
export const priorityName = (id: Priority) => PRIORITIES.find((p) => p.id === id)!.name;

export function matches(i: Issue, f: Filter) {
  return (
    (!f.assignee.length || f.assignee.includes(i.assignee ?? NOBODY)) &&
    (!f.label.length || i.labels.some((l) => f.label.includes(l))) &&
    (!f.priority.length || f.priority.includes(i.priority))
  );
}

export const filtering = (f: Filter) => f.assignee.length + f.label.length + f.priority.length > 0;
