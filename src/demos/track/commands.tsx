import { Columns3, List, PanelRightOpen, Plus, RotateCcw, Trash2, X, type LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Face } from './Face';
import { issueId, NOBODY, PRIORITIES, STATUSES } from './model';
import { TEAM } from './people';
import { PriorityIcon } from './PriorityIcon';
import { StatusIcon } from './StatusIcon';
import type { Track } from './useTrack';

export type Command = { id: string; group: string; label: string; lead?: ReactNode; icon?: LucideIcon; run: () => void };

/** What ⌘K acts on: the ticked issues, else the open one, else the focused one. */
export function targetOf(track: Track) {
  if (track.checked.size) return [...track.checked];
  const one = track.open ?? track.focus;
  return one != null && track.get(one) ? [one] : [];
}

/** Every command for the target, then the app's own. */
export function commands(track: Track, ns: number[], app: { newIssue: () => void; openIssue: (n: number) => void }): Command[] {
  const one = ns.length === 1 ? track.get(ns[0]) : undefined;
  const list: Command[] = [];
  if (ns.length) {
    const g = 'Issue';
    if (one && track.open !== one.n) list.push({ id: 'open', group: g, label: `Open ${issueId(one)}`, icon: PanelRightOpen, run: () => app.openIssue(one.n) });
    for (const st of STATUSES)
      if (one?.status !== st.id) list.push({ id: `s-${st.id}`, group: g, label: `Move to ${st.name}`, lead: <StatusIcon status={st.id} />, run: () => track.update(ns, { status: st.id }) });
    for (const p of TEAM)
      if (one?.assignee !== p.id)
        list.push({ id: `a-${p.id}`, group: g, label: p.me ? 'Assign to me' : `Assign to ${p.name}`, lead: <Face id={p.id} size="sm" />, run: () => track.update(ns, { assignee: p.id }) });
    if (!one || one.assignee) list.push({ id: `a-${NOBODY}`, group: g, label: 'Unassign', lead: <Face size="sm" />, run: () => track.update(ns, { assignee: undefined }) });
    for (const p of PRIORITIES)
      if (one?.priority !== p.id)
        list.push({ id: `p-${p.id}`, group: g, label: p.id === 'none' ? 'Remove priority' : `Set priority to ${p.name}`, lead: <PriorityIcon priority={p.id} />, run: () => track.update(ns, { priority: p.id }) });
    list.push({ id: 'delete', group: g, label: ns.length > 1 ? `Delete ${ns.length} issues` : 'Delete issue', icon: Trash2, run: () => track.remove(ns) });
  }
  const g = 'Track';
  list.push({ id: 'new', group: g, label: 'New issue', icon: Plus, run: app.newIssue });
  list.push(
    track.view === 'list'
      ? { id: 'board', group: g, label: 'Show as board', icon: Columns3, run: () => track.setView('board') }
      : { id: 'list', group: g, label: 'Show as list', icon: List, run: () => track.setView('list') },
  );
  if (track.filtering) list.push({ id: 'clear', group: g, label: 'Clear filters', icon: X, run: () => track.setFilter({ assignee: [], label: [], priority: [] }) });
  list.push({ id: 'reset', group: g, label: 'Reset sample issues', icon: RotateCcw, run: track.reset });
  return list;
}

/** Every word typed, found somewhere in the label: "ana as" finds "Assign to Ana Ruiz". */
export const find = (list: Command[], q: string) => {
  const words = q.toLowerCase().split(/\s+/).filter(Boolean);
  return words.length ? list.filter((c) => words.every((w) => c.label.toLowerCase().includes(w))) : list;
};
