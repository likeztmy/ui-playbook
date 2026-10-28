import { useEffect, useMemo, useRef, useState } from 'react';
import { useToast } from '../../ui/Toast';
import { ISSUES } from './issues';
import { byRank, filtering, issueId, matches, NO_FILTER, statusName, STATUSES, type Filter, type Issue, type Status } from './model';
import { clear, load, save } from './store';
import type { Arrival } from './notifications';
import { CHANGES, EVERY, FIRST, type Change } from './teammates';
import { useInbox } from './useInbox';
import { NOW } from './when';

export type View = 'list' | 'board';
/** Where in the sidebar you are: the team's issues, yours across it, or what's happened to them. */
export type Place = 'issues' | 'mine' | 'inbox';
/** Which of them, by the header's tabs: all, the ones in play, or the ones waiting. */
export type Scope = 'all' | 'active' | 'backlog';
const SCOPES: Record<Scope, Status[]> = {
  all: ['backlog', 'todo', 'progress', 'review', 'done'],
  active: ['todo', 'progress', 'review'],
  backlog: ['backlog'],
};
const VIEW = 'track:view';

// Track's clock runs from its fixed NOW (when.ts), so what you change reads "1m" beside the sample's "3h".
const started = Date.now();
// The sample's times are local, without a zone, so this is too.
const clock = () => {
  const t = new Date(NOW.getTime() + (Date.now() - started));
  return new Date(t.getTime() - t.getTimezoneOffset() * 60000).toISOString().slice(0, 19);
};

/** How a change reads in an issue's history. */
function describe(patch: Partial<Issue>) {
  if (patch.status) return `moved it to ${statusName(patch.status)}`;
  if ('assignee' in patch) return patch.assignee ? 'changed the assignee' : 'removed the assignee';
  if (patch.priority) return 'changed the priority';
  if (patch.labels) return 'changed the labels';
  if (patch.title !== undefined) return 'renamed it';
  if (patch.description !== undefined) return 'edited the description';
  return 'changed it';
}

/** A teammate's change still to come: its issue is here and its history doesn't have it yet, from an earlier visit. */
const due = (c: Change, issue?: Issue) => !!issue && !issue.activity.some((a) => a.who === c.who && a.text === c.text && a.body === c.body);

const top = (issues: Issue[], status: Status) => Math.min(1000, ...issues.filter((i) => i.status === status).map((i) => i.rank)) - 1000;

/**
 * Track's state: the issues, how they're viewed and filtered, what's focused, ticked and open, and
 * teammates' changes waiting to be let in.
 */
export function useTrack({ embedded }: { embedded?: boolean } = {}) {
  const toast = useToast();
  const [issues, setIssues] = useState<Issue[]>(ISSUES);
  const loaded = useRef(false);
  const [view, setViewState] = useState<View>('list');
  const [folded, setFolded] = useState<Set<Status>>(() => new Set(['done']));
  const [filter, setFilter] = useState<Filter>(NO_FILTER);
  const [place, setPlace] = useState<Place>('issues');
  const [scope, setScope] = useState<Scope>('all');
  const [open, setOpen] = useState<number | null>(null);
  const [focus, setFocus] = useState<number | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const anchor = useRef<number | null>(null);
  const [incoming, setIncoming] = useState<Arrival[]>([]);
  const [fresh, setFresh] = useState<Set<number>>(new Set());

  // What this browser kept, after the first render so the page and the app agree on it.
  useEffect(() => {
    setIssues(load());
    try {
      if (!embedded && localStorage.getItem(VIEW) === 'board') setViewState('board');
    } catch {}
    loaded.current = true;
  }, []);
  useEffect(() => {
    if (loaded.current) save(issues);
  }, [issues]);

  const setView = (v: View) => {
    setViewState(v);
    if (embedded) return;
    try {
      localStorage.setItem(VIEW, v);
    } catch {}
  };

  // What the place and tab hold; the filter narrows that, and its count of hidden issues is out of it.
  const here = useMemo(() => issues.filter((i) => (place === 'issues' || i.assignee === 'me') && SCOPES[scope].includes(i.status)), [issues, place, scope]);
  /** What each tab would show here, under the filter: the tabs' counts. */
  const counts = useMemo(() => {
    const mine = issues.filter((i) => (place === 'issues' || i.assignee === 'me') && matches(i, filter));
    return Object.fromEntries((Object.keys(SCOPES) as Scope[]).map((sc) => [sc, mine.filter((i) => SCOPES[sc].includes(i.status)).length])) as Record<Scope, number>;
  }, [issues, place, filter]);
  const shown = useMemo(() => here.filter((i) => matches(i, filter)).sort(byRank), [here, filter]);
  const groups = useMemo(
    () =>
      STATUSES.filter((st) => SCOPES[scope].includes(st.id)).map((st) => ({
        ...st,
        issues: shown.filter((i) => i.status === st.id),
        hidden: here.filter((i) => i.status === st.id).length - shown.filter((i) => i.status === st.id).length,
      })),
    [here, shown, scope],
  );
  /** The list's issues in the order they're on screen. */
  const listed = useMemo(
    () => groups.flatMap((g) => (view === 'list' && folded.has(g.id) ? [] : g.issues)).map((i) => i.n),
    [groups, folded, view],
  );
  const byN = useMemo(() => new Map(issues.map((i) => [i.n, i])), [issues]);
  const get = (n: number | null) => (n == null ? undefined : byN.get(n));

  const patchAll = (list: Issue[], ns: number[], patch: Partial<Issue>, who = 'me', text = describe(patch), at = clock(), body?: string) => {
    return list.map((i) => {
      if (!ns.includes(i.n)) return i;
      const moved = patch.status && patch.status !== i.status;
      return {
        ...i,
        ...patch,
        // A moved issue goes to the top of where it went, so it's found there.
        rank: moved ? top(list, patch.status!) : i.rank,
        updated: at,
        activity: [...i.activity, body ? { who, text, at, body } : { who, text, at }],
      };
    });
  };

  /** Changes at once. Several at a time can be undone from the toast; one is undone by changing it back. */
  const update = (ns: number[], patch: Partial<Issue>) => {
    if (!ns.length) return;
    const before = issues;
    setIssues((list) => patchAll(list, ns, patch));
    if (ns.length > 1) {
      const what = patch.status ? `moved to ${statusName(patch.status)}` : 'changed';
      toast({
        title: `${ns.length} issues ${what}`,
        action: {
          label: 'Undo',
          onClick: () => {
            setIssues((list) => list.map((i) => (ns.includes(i.n) ? before.find((b) => b.n === i.n) ?? i : i)));
            setChecked(new Set(ns));
          },
        },
      });
      setChecked(new Set());
    }
  };

  /** Deletes at once; Undo puts them back where they were, ticked again if they were. */
  const remove = (ns: number[]) => {
    if (!ns.length) return;
    const gone = issues.filter((i) => ns.includes(i.n));
    const wasChecked = ns.filter((n) => checked.has(n));
    // Focus and the panel go to the issue after the last one deleted, or before it at the end.
    const at = Math.max(...ns.map((n) => order.indexOf(n)));
    const rest = order.filter((n) => !ns.includes(n));
    const next = order.slice(at + 1).find((n) => !ns.includes(n)) ?? rest[rest.length - 1] ?? null;
    setIssues((list) => list.filter((i) => !ns.includes(i.n)));
    setChecked((c) => new Set([...c].filter((n) => !ns.includes(n))));
    if (open != null && ns.includes(open)) setOpen(next);
    setFocus(next);
    toast({
      title: ns.length === 1 ? `Deleted ${issueId(gone[0])}` : `Deleted ${ns.length} issues`,
      action: {
        label: 'Undo',
        onClick: () => {
          setIssues((list) => [...list, ...gone]);
          if (wasChecked.length) setChecked(new Set(wasChecked));
          setFocus(ns[0]);
        },
      },
    });
  };

  /** Somewhere else in the sidebar or the tabs: nothing stays ticked or open that you can't see. */
  const go = (p: Place, sc: Scope = scope) => {
    setPlace(p);
    setScope(sc);
    setChecked(new Set());
    setOpen(null);
  };

  const create = (draft: Pick<Issue, 'title' | 'description' | 'status' | 'priority' | 'assignee' | 'labels'>) => {
    const n = Math.max(0, ...issues.map((i) => i.n), ...ISSUES.map((i) => i.n)) + 1;
    const at = clock();
    const issue: Issue = { ...draft, n, updated: at, rank: top(issues, draft.status), activity: [{ who: 'me', text: 'created the issue', at }] };
    setIssues((list) => [...list, issue]);
    setFolded((f) => {
      const next = new Set(f);
      next.delete(draft.status);
      return next;
    });
    setFocus(n);
    mark([n]);
    toast({ title: `${issueId(issue)} created`, action: { label: 'Open', onClick: () => setOpen(n) } });
    return n;
  };

  /** A comment from you, at the end of the issue's history. */
  const comment = (n: number, body: string) => {
    const at = clock();
    setIssues((list) => list.map((i) => (i.n === n ? { ...i, updated: at, activity: [...i.activity, { who: 'me', text: 'commented', at, body }] } : i)));
  };

  /** A card dropped in `status`, before `before` (or last). */
  const move = (n: number, status: Status, before: number | null) => {
    setIssues((list) => {
      const column = list.filter((i) => i.status === status && i.n !== n).sort(byRank);
      const at = before == null ? column.length : column.findIndex((i) => i.n === before);
      const prev = column[at - 1]?.rank;
      const next = column[at]?.rank;
      const rank = prev == null && next == null ? 1000 : prev == null ? next! - 1000 : next == null ? prev + 1000 : (prev + next) / 2;
      const it = list.find((i) => i.n === n)!;
      const moved = it.status !== status;
      const stamped = moved ? patchAll(list, [n], { status }) : list;
      return stamped.map((i) => (i.n === n ? { ...i, rank } : i));
    });
  };

  const mark = (ns: number[]) => {
    setFresh(new Set(ns));
    setTimeout(() => setFresh(new Set()), 2000);
  };

  // Teammates at work: each change waits behind the pill until you let it in. While you're writing
  // (a new issue, a comment) they're held, and arrive once you stop: a break in the task.
  const holds = useRef(new Set<string>());
  const held = useRef<Change[]>([]);
  const arrive = (c: Change) => setIncoming((q) => (q.some((x) => x.n === c.n && x.text === c.text && x.body === c.body) ? q : [...q, { ...c, at: clock() }]));
  const hold = (why: string, on: boolean) => {
    if (on) return void holds.current.add(why);
    holds.current.delete(why);
    if (holds.current.size) return;
    held.current.forEach(arrive);
    held.current = [];
  };
  useEffect(() => {
    let k = 0;
    let timer: ReturnType<typeof setTimeout>;
    const next = (wait: number) => {
      timer = setTimeout(() => {
        const c = CHANGES[k++];
        if (!c) return;
        if (holds.current.size) held.current.push(c);
        else arrive(c);
        next(EVERY);
      }, wait);
    };
    next(FIRST);
    return () => clearTimeout(timer);
  }, []);

  const waiting = useMemo(() => incoming.filter((c) => due(c, byN.get(c.n))), [incoming, byN]);
  const inbox = useInbox(issues, waiting, toast);
  /** Issues in the order they're on screen, the list's or Inbox's: what ↑ ↓, a shift-click range and "the next one" follow. */
  const order = useMemo(() => (place === 'inbox' ? inbox.entries.map((e) => e.issue.n) : listed), [place, inbox.entries, listed]);

  /** Lets in what's waiting: all of it from the pill, or one issue's as Inbox opens it. */
  const letIn = (only?: number) => {
    const live = waiting.filter((c) => only == null || c.n === only);
    if (!live.length) return;
    setIssues((list) => live.reduce((l, c) => (due(c, l.find((i) => i.n === c.n)) ? patchAll(l, [c.n], c.patch, c.who, c.text, c.at, c.body) : l), list));
    setIncoming((q) => (only == null ? [] : q.filter((c) => c.n !== only)));
    mark(live.map((c) => c.n));
  };

  // Open from Inbox, by a click, a key or the panel's arrows: its waiting changes come in, and it's read.
  useEffect(() => {
    if (place !== 'inbox' || open == null) return;
    letIn(open);
    inbox.read(open);
  }, [place, open]);

  const toggle = (st: Status) =>
    setFolded((f) => {
      const next = new Set(f);
      if (!next.delete(st)) next.add(st);
      return next;
    });

  /** A tick on its own, or with shift, every issue on screen from the last tick to this one. */
  const tick = (n: number, range = false) => {
    const from = anchor.current;
    setChecked((c) => {
      const next = new Set(c);
      if (range && from != null && order.includes(from)) {
        const [a, b] = [order.indexOf(from), order.indexOf(n)].sort((x, y) => x - y);
        order.slice(a, b + 1).forEach((m) => next.add(m));
      } else if (!next.delete(n)) next.add(n);
      return next;
    });
    anchor.current = n;
  };

  const reset = () => {
    clear();
    setIssues(ISSUES);
    setChecked(new Set());
    setOpen(null);
    setFilter(NO_FILTER);
    setIncoming([]);
    inbox.reset();
    toast({ title: 'Sample issues restored' });
  };

  return {
    issues,
    shown,
    groups,
    order,
    get,
    view,
    setView,
    folded,
    toggle,
    filter,
    setFilter,
    place,
    scope,
    counts,
    go,
    filtering: filtering(filter),
    open,
    setOpen,
    focus,
    setFocus,
    checked,
    setChecked,
    tick,
    update,
    remove,
    create,
    comment,
    move,
    incoming: waiting.length,
    letIn,
    hold,
    inbox,
    fresh,
    reset,
  };
}

export type Track = ReturnType<typeof useTrack>;
