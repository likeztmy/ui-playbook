// What people change in Ship while they look at it: rollouts paused and resumed, releases drafted, the
// project archived. The data stays as written; the changes sit over it, so every page reads the same
// state, and each change hands back the Undo that puts it back.
import { useSyncExternalStore } from 'react';
import { hoursAgo, lastChange, releaseName, releases, type Release, type Status } from './model';

/** Who is signed in: the one making every change here. */
export const ME = 'Mira Chen';

let statuses: Record<string, Status> = {};
// Which releases changed here, and in what order: each change takes the next number, so the latest
// change sorts first among those made "now".
let touched: Record<string, number> = {};
let stamp = 0;
let archived = false;
let version = 0;
const listeners = new Set<() => void>();
const changed = () => {
  version++;
  for (const f of listeners) f();
};
const subscribe = (f: () => void) => {
  listeners.add(f);
  return () => void listeners.delete(f);
};

/** Re-renders its component on every change; Ship's root calls it, so every page is current. */
export const useChanges = () =>
  useSyncExternalStore(
    subscribe,
    () => version,
    () => 0,
  );

export const statusOf = (r: Release): Status => statuses[r.id] ?? r.status;

/** Hours since a release last changed: none, for one changed here. */
export const hoursOf = (r: Release) => (r.id in touched ? 0 : hoursAgo(r));
/** The Updated column's word: "Just now" for one changed here. */
export const updatedOf = (r: Release) => (r.id in touched ? 'Just now' : r.updated);
/** For sorting by Updated: larger is newer, and of two changed now, the later change wins. */
export const freshness = (r: Release) => (touched[r.id] ?? 0) / 1e6 - hoursOf(r);

/** What last happened to a release and who did it, a pause or resume made here included. */
export function lastChangeOf(r: Release): { who: string; what: string } {
  const status = statusOf(r);
  if (!(r.id in statuses)) return lastChange(r);
  const name = releaseName(r);
  if (status === 'Paused') return { who: ME, what: `paused ${name} at ${r.rollout}%` };
  if (status === 'Rolling out') return { who: ME, what: `resumed ${name} at ${r.rollout}%` };
  return { who: ME, what: lastChange({ ...r, status }).what };
}

/** Sets each release's status; the Undo puts back only these releases' own. */
export function setStatus(ids: string[], status: Status) {
  const before = ids.map((id) => [id, statuses[id], touched[id]] as const);
  statuses = { ...statuses, ...Object.fromEntries(ids.map((id) => [id, status])) };
  touched = { ...touched, ...Object.fromEntries(ids.map((id) => [id, ++stamp])) };
  changed();
  return () => {
    const next = { ...statuses };
    const when = { ...touched };
    for (const [id, s, t] of before) {
      if (s) next[id] = s;
      else delete next[id];
      if (t) when[id] = t;
      else delete when[id];
    }
    statuses = next;
    touched = when;
    changed();
  };
}

export const isArchived = () => archived;

/** Archives the project, or brings it back; the Undo puts it as it was. */
export function setArchived(to: boolean) {
  const before = archived;
  archived = to;
  changed();
  return () => {
    archived = before;
    changed();
  };
}

// Drafts are numbered from a count that only goes up, so an id is never handed out twice.
let drafted = 0;

const parts = (v: string) => v.split('.').map(Number);
const later = (a: string, b: string) => {
  const [x, y] = [parts(a), parts(b)];
  for (let i = 0; i < Math.max(x.length, y.length); i++) if ((x[i] ?? 0) !== (y[i] ?? 0)) return (x[i] ?? 0) > (y[i] ?? 0);
  return false;
};

/** The version after the platform's latest: 4.3.0 → 4.3.1, 2026.44 → 2026.45. */
function nextVersion(platform: Release['platform']) {
  const latest = releases.filter((r) => r.platform === platform).reduce((top, r) => (later(r.version, top) ? r.version : top), '0');
  const p = parts(latest);
  p[p.length - 1]++;
  return p.join('.');
}

/** A new draft for a platform, at the top of the list, signed in as Mira Chen; the Undo discards it. */
export function draft(platform: Release['platform']) {
  const release: Release = {
    id: `d${++drafted}`,
    version: nextVersion(platform),
    name: 'Untitled',
    status: 'Draft',
    platform,
    owner: ME,
    rollout: 0,
    crashFree: 0,
    updated: 'Just now',
    age: 0,
  };
  releases.unshift(release);
  touched = { ...touched, [release.id]: ++stamp };
  changed();
  return {
    release,
    undo: () => {
      const at = releases.indexOf(release);
      if (at < 0) return;
      releases.splice(at, 1);
      touched = Object.fromEntries(Object.entries(touched).filter(([id]) => id !== release.id));
      changed();
    },
  };
}
