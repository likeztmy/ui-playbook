// Ship's places and the numbers derived from its data, so the sidebar, the figures and the table can't
// disagree (the audit's LK#35). The releases themselves are the gallery's, read only.
import { releases, type Release } from '../../looks/ship/data';

export { releases, tone, type Release, type Status } from '../../looks/ship/data';

export type PageId = 'dashboard' | 'releases';
export type Platform = 'any' | Release['platform'];
/** Where Ship is: a page, and for Releases the platform it's filtered to. */
export type Place = { page: PageId; platform: Platform };

export const PLATFORMS: Release['platform'][] = ['iOS', 'Android', 'Web'];
export const PAGE_TITLE: Record<PageId, string> = { dashboard: 'Dashboard', releases: 'Releases' };

export const placeName = (p: Place) => (p.page === 'releases' && p.platform !== 'any' ? p.platform : PAGE_TITLE[p.page]);
export const samePlace = (a: Place, b: Place) => a.page === b.page && (a.page === 'dashboard' || a.platform === b.platform);
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
