import { CONVERSATIONS } from '../post/conversations';
import { unread } from '../post/model';
import { faceOf, participants, person } from '../post/people';

export type Row = { id: string; face: string; from: string; subject: string; time: string; unread: boolean; org: boolean };

/** Post's inbox as the demos' rows: the same people, subjects and times. */
export const INBOX: Row[] = CONVERSATIONS.filter((c) => c.folder === 'inbox').map((c) => ({
  id: c.id,
  face: faceOf(c),
  from: participants(c.messages.map((m) => m.from)),
  subject: c.subject,
  time: c.time,
  unread: unread(c),
  org: !!person(faceOf(c)).org,
}));

/** A fresh order for each trial. */
export function shuffled<T>(xs: T[]) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const median = (xs: number[]) => {
  const a = [...xs].sort((p, q) => p - q);
  return a.length ? (a.length % 2 ? a[(a.length - 1) / 2] : (a[a.length / 2 - 1] + a[a.length / 2]) / 2) : 0;
};
