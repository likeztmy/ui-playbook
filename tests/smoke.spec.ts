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

// The pilot's reading column, in each frame style: the title and every block under it start on one
// left edge, and everything but prose (which stops at its measure) runs to one right edge, whatever
// size its type is set in.
for (const box of ['band', 'caption', 'plate', 'toggle']) {
  for (const width of [1280, 375]) {
    test(`/pilot/button one left edge, ${box} @${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      // The edges are in the served page; demos in the closed Reference never hydrate, so don't wait for them.
      await page.goto(`/pilot/button?box=${box}`);
      const lefts = await page.evaluate(() => {
        const body = document.querySelector('article > div')!;
        const blocks = [document.querySelector('h1')!, ...body.children].filter((e) => e.tagName !== 'SCRIPT');
        const edges = (side: 'left' | 'right', els: Element[]) => [
          ...new Set(els.map((e) => Math.round(e.getBoundingClientRect()[side]))),
        ];
        const wide = blocks.filter((e) => !['P', 'UL', 'OL'].includes(e.tagName));
        return { lefts: edges('left', blocks), rights: edges('right', wide) };
      });
      expect(lefts.lefts, 'distinct left edges').toHaveLength(1);
      expect(lefts.rights, 'distinct right edges of demos, code and headings').toHaveLength(1);
    });
  }
}
