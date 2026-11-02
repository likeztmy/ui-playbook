// The lab directions keep what's shown in the address, so a view can be linked, opened in a new tab
// and gone back to. Looks and the theme replace the entry; places push one, so Back retraces them.
import { useEffect, useState } from 'react';
import { PLATFORMS, type Place, type Platform } from './ship/model';

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
});

export function readPlace(q = params()): Place {
  const page = q.get('page') === 'releases' ? 'releases' : 'dashboard';
  const asked = q.get('platform');
  const platform: Platform = PLATFORMS.find((p) => p.toLowerCase() === asked) ?? 'any';
  return { page, platform: page === 'releases' ? platform : 'any' };
}

/** Runs on Back and Forward, with the address they landed on. */
export function usePopState(on: (q: URLSearchParams) => void) {
  useEffect(() => {
    const pop = () => on(params());
    addEventListener('popstate', pop);
    return () => removeEventListener('popstate', pop);
  }, [on]);
}

/** The page's own theme: the saved one, else the system's. Follows the site's toggle and the system. */
export function pageTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === 'light' || set === 'dark') return set;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function usePageTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('light');
  useEffect(() => {
    const read = () => setTheme(pageTheme());
    read();
    const media = matchMedia('(prefers-color-scheme: dark)');
    media.addEventListener('change', read);
    const watch = new MutationObserver(read);
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => {
      media.removeEventListener('change', read);
      watch.disconnect();
    };
  }, []);
  return theme;
}
