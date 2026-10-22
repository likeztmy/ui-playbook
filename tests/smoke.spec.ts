import { expect, test } from '@playwright/test';
import { hydrateAll, ROUTES, watchErrors } from './helpers';

// Every page: loads, hydrates every island, logs no errors, and never scrolls
// sideways, at a desktop and a phone width, in both themes.
for (const route of ROUTES) {
  for (const width of [1280, 375]) {
    for (const scheme of ['light', 'dark'] as const) {
      test(`${route} @${width} ${scheme}`, async ({ page }) => {
        await page.setViewportSize({ width, height: 800 });
        await page.emulateMedia({ colorScheme: scheme });
        const errors = watchErrors(page);
        await page.goto(route);
        await hydrateAll(page);

        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
        expect(overflow, 'horizontal overflow (px)').toBeLessThanOrEqual(0);
        expect(errors).toEqual([]);
      });
    }
  }
}
