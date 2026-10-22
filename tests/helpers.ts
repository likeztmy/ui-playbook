import { expect, type Page } from '@playwright/test';
import { entries, href } from '../src/entries';

export const ROUTES = ['/', ...entries.map(href), '/lab/menu', '/lab/shortcuts', '/lab/hero'];

/**
 * Collects console errors and page exceptions from the moment it's called.
 * Read `errors` after the interaction under test.
 */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

/**
 * Scrolls every island into view so `client:visible` fires, then waits until
 * none is still server-rendered only. A failed hydration leaves `ssr` behind.
 */
export async function hydrateAll(page: Page) {
  const islands = page.locator('astro-island');
  const n = await islands.count();
  for (let i = 0; i < n; i++) await islands.nth(i).scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
}
