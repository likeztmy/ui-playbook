// Track's clock is fixed, so the sample reads the same on every visit: "3h" stays three hours.
export const NOW = new Date('2026-10-28T10:00:00');

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** How long ago, as short as it can be read: "12m", "5h", "3d"; a date past a week. */
export function ago(iso: string, now = NOW) {
  const t = new Date(iso);
  const min = Math.max(0, Math.round((now.getTime() - t.getTime()) / 60000));
  if (min < 60) return `${Math.max(1, min)}m`;
  if (min < 60 * 24) return `${Math.round(min / 60)}h`;
  if (min < 60 * 24 * 7) return `${Math.round(min / 60 / 24)}d`;
  return `${MONTHS[t.getMonth()]} ${t.getDate()}`;
}

/** The full time, for a tooltip. */
export const fullTime = (iso: string) =>
  new Date(iso).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

/** A due day as it bears on now: "Today", "Tomorrow", "Nov 6", and whether it's that close or past. */
export function dueIn(day: string, now = NOW) {
  const d = new Date(`${day}T00:00`);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const days = Math.round((d.getTime() - today.getTime()) / 864e5);
  const text = days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : days < 0 ? `${MONTHS[d.getMonth()]} ${d.getDate()}, ${-days}d late` : `${MONTHS[d.getMonth()]} ${d.getDate()}`;
  return { text, soon: days <= 1 };
}
