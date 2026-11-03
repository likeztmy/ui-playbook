// The gallery keeps what's shown in the address, so a view can be linked, opened in a new tab and gone
// back to. A look replaces the entry; a place pushes one, so Back retraces them.
import { useEffect, type MouseEvent } from 'react';
import { HOME, PAGES, PLATFORMS, releases, type PageId, type Place, type Platform } from './ship/model';

export type Theme = 'light' | 'dark';

export const params = () => new URLSearchParams(typeof location === 'undefined' ? '' : location.search);

/** An address built from what's shown, never from `location`, so the server renders the same links. */
export function addressOf(path: string, state: Record<string, string | null>) {
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(state)) if (v !== null) q.set(k, v);
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

export function write(url: string, push: boolean) {
  if (url === location.pathname + location.search) return;
  if (push) history.pushState(null, '', url);
  else history.replaceState(null, '', url);
}

export const placeParams = (p: Place) => ({
  page: p.page === 'dashboard' ? null : p.page,
  platform: p.page === 'releases' && p.platform !== 'any' ? p.platform.toLowerCase() : null,
  release: p.page === 'release' ? p.release : null,
});

// The old gallery opened on its wall of cards, at `?page=cards`.
const ALIASES: Record<string, PageId> = { cards: 'components' };

export function readPlace(q = params()): Place {
  const asked = q.get('page') ?? '';
  const page = ALIASES[asked] ?? PAGES.find((p) => p === asked) ?? 'dashboard';
  const platform: Platform = PLATFORMS.find((p) => p.toLowerCase() === q.get('platform')) ?? 'any';
  const release = releases.find((r) => r.id === q.get('release'))?.id ?? HOME.release;
  return { page, platform: page === 'releases' ? platform : 'any', release };
}

/** A plain left click stays in the page; a modified one (new tab, new window) is the browser's. */
export function follow(e: MouseEvent, go: () => void) {
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  go();
}

/** Runs on Back and Forward, with the address they landed on. */
export function usePopState(on: (q: URLSearchParams) => void) {
  useEffect(() => {
    const pop = () => on(params());
    addEventListener('popstate', pop);
    return () => removeEventListener('popstate', pop);
  }, [on]);
}

/** The page's own theme: the saved one, else the system's. */
export function pageTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
