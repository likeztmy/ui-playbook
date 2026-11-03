// What people change in Ship while they look at it: rollouts paused and resumed, releases drafted.
// The data stays as written; the changes sit over it, so every page reads the same state, and each
// change hands back the Undo that puts it back.
import { useSyncExternalStore } from 'react';
import { releases, type Release, type Status } from './model';

let statuses: Record<string, Status> = {};
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

/** Sets each release's status; the Undo puts back only these releases' own. */
export function setStatus(ids: string[], status: Status) {
  const before = ids.map((id) => [id, statuses[id]] as const);
  statuses = { ...statuses, ...Object.fromEntries(ids.map((id) => [id, status])) };
  changed();
  return () => {
    const next = { ...statuses };
    for (const [id, s] of before) {
      if (s) next[id] = s;
      else delete next[id];
    }
    statuses = next;
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
    owner: 'Mira Chen',
    rollout: 0,
    crashFree: 0,
    updated: 'Just now',
    age: 0,
  };
  releases.unshift(release);
  changed();
  return {
    release,
    undo: () => {
      const at = releases.indexOf(release);
      if (at < 0) return;
      releases.splice(at, 1);
      changed();
    },
  };
}
