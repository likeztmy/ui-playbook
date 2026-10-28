import { dialog } from './lib.mjs';

export default async function walk({ page, url, shot, check, focused, shift }) {
  await page.goto(url);
  await page.getByText(/in progress/i).first().waitFor();
  await page.waitForTimeout(500);
  await shot('list');
  check('no-shift-on-load', (await shift()) < 0.1, (await shift()).toFixed(3));

  await page.getByRole('button', { name: /new issue/i }).first().click();
  await page.waitForTimeout(400);
  const f = await focused();
  check('new-issue-focus-title', /title/i.test(f) || (await page.evaluate(() => /title/i.test(document.activeElement?.getAttribute('placeholder') ?? document.activeElement?.id ?? ''))), f);
  const title = 'Offline banner on checkout';
  const scope = (await dialog(page).count()) ? dialog(page) : page;
  await scope.getByLabel(/title/i).or(scope.getByPlaceholder(/title/i)).first().fill(title);
  await shot('new-issue');
  await scope.getByRole('button', { name: /create|save|add|submit/i }).last().click();
  await page.waitForTimeout(500);
  await shot('created');
  check('created-in-list', await page.getByText(title).first().isVisible());

  await page.getByText(title).first().click();
  await page.waitForTimeout(500);
  await shot('detail');
  const comment = page.getByRole('textbox', { name: /comment/i }).or(page.getByPlaceholder(/comment/i)).first();
  await comment.fill('Same on iOS.');
  await page.getByRole('button', { name: /comment|send|post|reply/i }).last().click();
  await page.waitForTimeout(400);
  await shot('commented');
  check('comment-added', await page.getByText('Same on iOS.').first().isVisible());

  await page.keyboard.press('Escape');
  await page.getByRole('button', { name: /status|filter/i }).first().click().catch(() => {});
  await page.waitForTimeout(400);
  await shot('filter');
  await page.keyboard.press('Escape');

  await page.reload();
  await page.getByText(/in progress/i).first().waitFor();
  check('persists', await page.getByText(title).first().isVisible());
}
