// One small release tool's data, shared by every page of the showcase.
export type Status = 'Live' | 'Rolling out' | 'In review' | 'Draft' | 'Halted';
export type Release = {
  id: string;
  version: string;
  name: string;
  status: Status;
  platform: 'iOS' | 'Android' | 'Web';
  owner: string;
  rollout: number;
  crashFree: number;
  updated: string;
  /** Days ago, for sorting by date. */
  age: number;
};

export const releases: Release[] = [
  {
    id: 'r1',
    version: '4.2.0',
    name: 'Offline drafts',
    status: 'Rolling out',
    platform: 'iOS',
    owner: 'Mira Chen',
    rollout: 25,
    crashFree: 99.82,
    updated: '2h ago',
    age: 0,
  },
  {
    id: 'r2',
    version: '4.2.0',
    name: 'Offline drafts',
    status: 'In review',
    platform: 'Android',
    owner: 'Jonas Berg',
    rollout: 0,
    crashFree: 0,
    updated: '5h ago',
    age: 0,
  },
  {
    id: 'r3',
    version: '2026.44',
    name: 'Faster search',
    status: 'Live',
    platform: 'Web',
    owner: 'Ada Okafor',
    rollout: 100,
    crashFree: 99.95,
    updated: 'Yesterday',
    age: 1,
  },
  {
    id: 'r4',
    version: '4.1.3',
    name: 'Login fix',
    status: 'Live',
    platform: 'iOS',
    owner: 'Mira Chen',
    rollout: 100,
    crashFree: 99.7,
    updated: 'Oct 28',
    age: 5,
  },
  {
    id: 'r5',
    version: '4.1.3',
    name: 'Login fix',
    status: 'Halted',
    platform: 'Android',
    owner: 'Jonas Berg',
    rollout: 10,
    crashFree: 98.4,
    updated: 'Oct 27',
    age: 6,
  },
  {
    id: 'r6',
    version: '2026.43',
    name: 'Shared inbox',
    status: 'Live',
    platform: 'Web',
    owner: 'Sam Rivera',
    rollout: 100,
    crashFree: 99.91,
    updated: 'Oct 24',
    age: 9,
  },
  {
    id: 'r7',
    version: '4.3.0',
    name: 'Widgets',
    status: 'Draft',
    platform: 'iOS',
    owner: 'Ada Okafor',
    rollout: 0,
    crashFree: 0,
    updated: 'Oct 22',
    age: 11,
  },
  {
    id: 'r8',
    version: '4.1.2',
    name: 'Push settings',
    status: 'Live',
    platform: 'Android',
    owner: 'Sam Rivera',
    rollout: 100,
    crashFree: 99.6,
    updated: 'Oct 20',
    age: 13,
  },
  {
    id: 'r9',
    version: '2026.42',
    name: 'Dark mode',
    status: 'Live',
    platform: 'Web',
    owner: 'Mira Chen',
    rollout: 100,
    crashFree: 99.93,
    updated: 'Oct 17',
    age: 16,
  },
  {
    id: 'r10',
    version: '4.1.1',
    name: 'Sync retry',
    status: 'Live',
    platform: 'iOS',
    owner: 'Jonas Berg',
    rollout: 100,
    crashFree: 99.75,
    updated: 'Oct 14',
    age: 19,
  },
  {
    id: 'r11',
    version: '4.1.1',
    name: 'Sync retry',
    status: 'Live',
    platform: 'Android',
    owner: 'Jonas Berg',
    rollout: 100,
    crashFree: 99.58,
    updated: 'Oct 14',
    age: 19,
  },
  {
    id: 'r12',
    version: '2026.41',
    name: 'Billing page',
    status: 'Live',
    platform: 'Web',
    owner: 'Ada Okafor',
    rollout: 100,
    crashFree: 99.9,
    updated: 'Oct 10',
    age: 23,
  },
];

export const tone = (s: Status) =>
  (({ Live: 'success', 'Rolling out': 'info', 'In review': 'warning', Draft: 'neutral', Halted: 'danger' }) as const)[s];

export const people = ['Mira Chen', 'Jonas Berg', 'Ada Okafor', 'Sam Rivera'];
export const initials = (name: string) =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('');
