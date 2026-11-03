// Ship's places and the numbers derived from its data, so the sidebar, the figures and the table can't
// disagree (the audit's LK#35).
import { releases, type Release } from './data';

export { releases, tone, type Release, type Status } from './data';

/** Ship's own places, then the specimens: screens held still to show the rest of a look. */
export const PAGES = ['dashboard', 'releases', 'release', 'settings', 'components', 'overlays', 'states', 'marketing'] as const;
export type PageId = (typeof PAGES)[number];
export type Platform = 'any' | Release['platform'];
/** Where Ship is: a page; for Releases the platform it's filtered to, for Release which one is open. */
export type Place = { page: PageId; platform: Platform; release: string };

export const PLATFORMS: Release['platform'][] = ['iOS', 'Android', 'Web'];
export const PAGE_TITLE: Record<PageId, string> = {
  dashboard: 'Dashboard',
  releases: 'Releases',
  release: 'Release',
  settings: 'Settings',
  components: 'Components',
  overlays: 'Overlays',
  states: 'States',
  marketing: 'Website',
};

export const HOME: Place = { page: 'dashboard', platform: 'any', release: releases[0].id };
export const at = (page: PageId, more: Partial<Place> = {}): Place => ({ ...HOME, page, ...more });

export const releaseById = (id: string) => releases.find((r) => r.id === id) ?? releases[0];
/** A release's short name, as the header and the links give it: version and platform. */
export const releaseName = (r: Release) => `${r.version} ${r.platform}`;

export const placeName = (p: Place) =>
  p.page === 'releases' && p.platform !== 'any' ? p.platform : p.page === 'release' ? releaseName(releaseById(p.release)) : PAGE_TITLE[p.page];

/** The same place: the sidebar marks it as the current page. */
export const samePlace = (a: Place, b: Place) =>
  a.page === b.page && (a.page !== 'releases' || a.platform === b.platform) && (a.page !== 'release' || a.release === b.release);

export const count = (platform: Platform) => releases.filter((r) => platform === 'any' || r.platform === platform).length;
export const live = releases.filter((r) => r.status === 'Live').length;

// Hours since each release last changed. The data's `age` is whole days, so 2h and 5h tied and sorted
// the wrong way round (LK#27); the table sorts on these instead.
const HOURS: Record<string, number> = {
  r1: 2,
  r2: 5,
  r3: 26,
  r4: 5 * 24,
  r5: 6 * 24,
  r6: 9 * 24,
  r7: 11 * 24,
  r8: 13 * 24,
  r9: 16 * 24,
  r10: 19 * 24,
  r11: 19 * 24 + 1,
  r12: 23 * 24,
};
export const hoursAgo = (r: Release) => HOURS[r.id] ?? r.age * 24;

/** How long ago, in the short form a list's time column takes: 2h, 3d. */
export const ago = (hours: number) => (hours < 24 ? `${hours}h` : `${Math.round(hours / 24)}d`);

/** What last happened to a release, and who did it: the line Recent and the release's history share. */
export function lastChange(r: Release): { who: string; what: string } {
  const name = releaseName(r);
  switch (r.status) {
    case 'Rolling out':
      return { who: r.owner, what: `raised ${name} to ${r.rollout}%` };
    case 'In review':
      return { who: r.owner, what: `sent ${name} for review` };
    case 'Live':
      return { who: r.owner, what: `shipped ${name}` };
    case 'Halted':
      return { who: 'Ship', what: `halted ${name} at ${r.rollout}%` };
    case 'Draft':
      return { who: r.owner, what: `drafted ${name}` };
  }
}
