import { ISSUES } from '../track/issues';
import type { Issue } from '../track/model';

// Twelve of Track's issues with their due dates, on Wednesday 28 October. One is past its date.
const DUE: [n: number, due: string][] = [
  [48, 'Thu 29 Oct'],
  [51, 'Fri 30 Oct'],
  [46, 'Mon 2 Nov'],
  [64, 'Fri 30 Oct'],
  [47, 'Tue 3 Nov'],
  [43, 'Thu 29 Oct'],
  [54, 'Mon 26 Oct'],
  [65, 'Wed 4 Nov'],
  [40, 'Mon 2 Nov'],
  [59, 'Fri 6 Nov'],
  [42, 'Thu 5 Nov'],
  [57, 'Tue 3 Nov'],
];

export const OVERDUE = 54;

export type DueRow = Pick<Issue, 'n' | 'title' | 'labels'> & { due: string; overdue: boolean };

export const ROWS: DueRow[] = DUE.map(([n, due]) => {
  const { title, labels } = ISSUES.find((i) => i.n === n)!;
  return { n, title, labels, due, overdue: n === OVERDUE };
});

/** Each label's own hue, as a team picks one per label: spread round the wheel so no two look alike. */
export const LABEL_HUE: Record<string, number> = {
  Bug: 25,
  Feature: 150,
  Design: 305,
  Performance: 65,
  Catalogue: 195,
  Search: 250,
  Cart: 345,
  Checkout: 100,
  Payments: 275,
  Account: 175,
};
