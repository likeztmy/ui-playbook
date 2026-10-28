import { expect, test } from '@playwright/test';
import { entries, href } from '../src/entries';
import { hydrateAll, ROUTES, watchErrors } from './helpers';

// Every page: loads, hydrates every island, logs no errors, never scrolls sideways and
// keeps every demo inside its stage, at a desktop and a phone width, in both themes.
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
        // Nor does a reading page's demo outgrow its stage: a scene wider than its frame is cut off
        // at the edge. Labs are working comparisons, not pages.
        if (route.includes('/lab/')) return;
        const outgrown = await page.evaluate(() =>
          [...document.querySelectorAll('figure > [class*="_stage_"]')]
            .filter((st) => st.scrollWidth > st.clientWidth + 1)
            .map((st) => st.closest('astro-island')?.getAttribute('component-export')),
        );
        expect(outgrown, 'demos wider than their stage').toEqual([]);
      });
    }
  }
}

// Every reading page's column: the title and every block under it start on one left edge and end
// on one right edge, whatever size its type is set in. The pilot is checked in each of its frame styles.
const READING = [
  ...ROUTES.filter((r) => /^(\/zh)?\/(components|principles|practice)\/[a-z-]+$/.test(r)).map((r) => ({ route: r, box: '' })),
  ...['band', 'caption', 'plate', 'toggle'].map((box) => ({ route: '/pilot/button', box })),
];
for (const { route, box } of READING) {
  for (const width of [1280, 375]) {
    test(`${route}${box && ` ${box}`} one column @${width}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      // The edges are in the served page; demos in a closed Reference never hydrate, so don't wait for them.
      await page.goto(box ? `${route}?box=${box}` : route);
      const edges = await page.evaluate(() => {
        const body = document.querySelector('article > div')!;
        const blocks = [document.querySelector('h1')!, ...body.children].filter((e) => e.tagName !== 'SCRIPT');
        const edge = (side: 'left' | 'right', els: Element[]) => [
          ...new Set(els.map((e) => Math.round(e.getBoundingClientRect()[side]))),
        ];
        return { lefts: edge('left', blocks), rights: edge('right', blocks) };
      });
      expect(edges.lefts, 'distinct left edges').toHaveLength(1);
      expect(edges.rights, 'distinct right edges').toHaveLength(1);
    });
  }
}

// The Skill agents read is made from the built pages: it lists every entry, and each reference is served.
test('the Skill covers every page', async ({ request }) => {
  const index = await (await request.get('/skill/ui-playbook/SKILL.md')).text();
  expect(index).toMatch(/^---\nname: ui-playbook\n/);
  for (const e of entries.filter((e) => e.kind !== 'practice')) {
    const name = `references/${e.kind}-${e.slug}.md`;
    expect(index, `SKILL.md lists ${name}`).toContain(`(${name})`);
    const ref = await request.get(`/skill/ui-playbook/${name}`);
    expect(ref.ok(), name).toBe(true);
    const text = await ref.text();
    expect(text).toContain(`From https://ui-playbook.suspense.site${href(e)}`);
    expect(text.split('\n')[2], `${name} leads with its summary`).toBe(e.summary);
  }
});
