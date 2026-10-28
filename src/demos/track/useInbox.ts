import { useEffect, useMemo, useRef, useState } from 'react';
import type { useToast } from '../../ui/Toast';
import { entries, type Arrival, type Mark } from './notifications';
import { issueId, type Issue } from './model';

// Inbox keeps what you've read and cleared in this browser, beside the issues; Reset clears it.
const KEY = 'track:inbox:v1';

/** Inbox: entries for what's yours, and reading, unreading and clearing them. */
export function useInbox(issues: Issue[], waiting: Arrival[], toast: ReturnType<typeof useToast>) {
  const [marks, setMarks] = useState<Record<number, Mark>>({});
  const loaded = useRef(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMarks(JSON.parse(raw));
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (!loaded.current) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(marks));
    } catch {}
  }, [marks]);

  const list = useMemo(() => entries(issues, waiting, marks), [issues, waiting, marks]);
  const at = (n: number) => list.find((e) => e.issue.n === n)?.event.at;
  const mark = (n: number, m: Mark) => setMarks((all) => ({ ...all, [n]: { ...all[n], ...m } }));

  const read = (n: number) => mark(n, { read: at(n), unread: false });
  const toggle = (n: number) => {
    const e = list.find((x) => x.issue.n === n);
    if (e) mark(n, e.unread ? { read: e.event.at, unread: false } : { unread: true });
  };
  const readAll = () => setMarks((all) => Object.fromEntries([...Object.entries(all), ...list.map((e) => [e.issue.n, { ...all[e.issue.n], read: e.event.at, unread: false }])]));
  /** Off the list until its next event; Undo puts it back as it was. */
  const clear = (n: number) => {
    const before = marks[n];
    const issue = list.find((e) => e.issue.n === n)?.issue;
    mark(n, { cleared: at(n) });
    toast({
      title: issue ? `Removed ${issueId(issue)} from Inbox` : 'Removed from Inbox',
      action: { label: 'Undo', onClick: () => setMarks((all) => ({ ...all, [n]: before ?? {} })) },
    });
  };
  const reset = () => {
    setMarks({});
    try {
      localStorage.removeItem(KEY);
    } catch {}
  };

  return { entries: list, unread: list.filter((e) => e.unread).length, read, toggle, readAll, clear, reset };
}

export type Inbox = ReturnType<typeof useInbox>;
