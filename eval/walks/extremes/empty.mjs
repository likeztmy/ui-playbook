// Empty: a search that finds nothing. The screen says so, rather than going blank; saying it with
// the query ("No results for …") counts. (Clearing
// storage only brings the sample data back, so search is the empty state every case can reach.)
import { appeared, lines } from '../lib.mjs';

export default async function empty({ page, snap, check }) {
  const box = page
    .locator(
      'input[type="search"], [role="searchbox"], input[placeholder*="earch" i], input[placeholder*="搜索"], input[aria-label*="earch" i], input[aria-label*="搜索"]',
    )
    .filter({ visible: true })
    .first();
  if (!(await box.count())) return;
  const before = await lines(page);
  await box.fill('zqxjvw');
  await page.waitForTimeout(700);
  await snap('empty-search');
  const said = appeared(before, await lines(page));
  check('empty-search-says', said.length > 0, said.slice(0, 3).join(' | '));
}
