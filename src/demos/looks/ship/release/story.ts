// What a release page says about each release, made from its data so the page, the table and Recent
// agree: its history, newest first, its checks and its notes. 4.2.0 for iOS, the one rolling out, has
// a comment and a failed check of its own.
import { CircleCheck, FilePen, GitCommitHorizontal, MessageSquare, OctagonPause, Rocket, Send, type LucideIcon } from 'lucide-react';
import type { Check } from '../CheckList';
import { hoursAgo, lastChange, type Release } from '../model';

export type Event = { Icon: LucideIcon; who: string; what: string; hours: number; quote?: string };

// Ship's "now": the afternoon of Nov 2.
const NOW = new Date(2026, 10, 2, 16);

/** A time in a history: hours ago today, Yesterday, then the date. */
export function when(hours: number) {
  if (hours < 24) return `${hours}h ago`;
  if (hours < 48) return 'Yesterday';
  return new Date(NOW.getTime() - hours * 3600_000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

const NOTES: Record<string, string> = {
  'Offline drafts': 'Drafts now save on the device and sync when you’re back online. Nothing you write is lost on a train or a plane.',
  'Faster search': 'Search answers as you type, and finds messages by who they’re from.',
  'Login fix': 'Signing in with a passkey no longer asks twice on a new device.',
  'Shared inbox': 'A team can share one inbox, with who has replied marked on each message.',
  Widgets: 'Two home-screen widgets: today’s drafts, and unread from favourites.',
  'Push settings': 'Each kind of notification can be turned off on its own.',
  'Dark mode': 'The web app follows the system’s dark setting.',
  'Sync retry': 'A sync that fails on a weak connection tries again, then says so.',
  'Billing page': 'Invoices and the plan are on one page, with the next charge at the top.',
};

const passed = (n: number): Check[] =>
  [
    { name: 'Unit tests', state: 'Passed in 4m 12s', outcome: 'passed' as const },
    { name: 'Build', state: 'Passed in 9m 40s', outcome: 'passed' as const },
    { name: 'Screenshot diff', state: 'No changes', outcome: 'passed' as const },
    { name: 'Licence scan', state: 'Passed in 38s', outcome: 'passed' as const },
  ].slice(0, n);

export function story(r: Release): { events: Event[]; checks: Check[]; notes: string } {
  const h = hoursAgo(r);
  const notes = NOTES[r.name] ?? '';
  const last = lastChange(r);
  if (r.id === 'r1') {
    return {
      events: [
        { Icon: Rocket, who: 'Mira Chen', what: 'raised the rollout to 25%', hours: 2 },
        { Icon: MessageSquare, who: 'Jonas Berg', what: 'commented', hours: 3, quote: 'Crash rate is flat after the first 10%. Fine to go on.' },
        { Icon: CircleCheck, who: 'Ship', what: 'finished checks: 3 passed, 1 failed', hours: 5 },
        { Icon: GitCommitHorizontal, who: 'Ada Okafor', what: 'added 12 changes from main', hours: 26 },
      ],
      checks: [
        { name: 'Unit tests', state: 'Passed in 4m 12s', outcome: 'passed' },
        { name: 'iOS build', state: 'Passed in 9m 40s', outcome: 'passed' },
        { name: 'Screenshot diff', state: '2 screens changed', outcome: 'failed' },
        { name: 'Licence scan', state: 'Passed in 38s', outcome: 'passed' },
      ],
      notes,
    };
  }
  const checked: Event = { Icon: CircleCheck, who: 'Ship', what: 'finished checks: 4 passed', hours: h + 24 };
  switch (r.status) {
    case 'Draft':
      return { events: [{ Icon: FilePen, who: r.owner, what: 'drafted it from main', hours: h }], checks: [], notes };
    case 'In review':
      return { events: [{ Icon: Send, ...last, hours: h, what: 'sent it for review' }, checked], checks: passed(4), notes };
    case 'Halted':
      return {
        events: [
          { Icon: OctagonPause, who: 'Ship', what: `halted the rollout at ${r.rollout}%: crash-free fell to ${r.crashFree}%`, hours: h },
          { Icon: Rocket, who: r.owner, what: `raised the rollout to ${r.rollout}%`, hours: h + 20 },
          checked,
        ],
        checks: passed(4),
        notes,
      };
    default:
      return {
        events: [
          { Icon: Rocket, who: r.owner, what: r.status === 'Live' ? 'rolled it out to everyone' : `raised the rollout to ${r.rollout}%`, hours: h },
          checked,
        ],
        checks: passed(4),
        notes,
      };
  }
}
