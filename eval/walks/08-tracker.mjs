import { dialog } from './lib.mjs';

export default async function walk({ page, url, shot, check, focused, shift, attempt }) {
  const title = 'Offline banner on checkout';
  await page.goto(url);
  await page
    .getByText(/in progress/i)
    .filter({ visible: true })
    .first()
    .waitFor();
  await page.waitForTimeout(500);
  await shot('list');
  check('no-shift-on-load', (await shift()) < 0.1, (await shift()).toFixed(3));

  await attempt('created-in-list', async () => {
    await page
      .getByRole('button', { name: /new issue/i })
      .first()
      .click();
    await page.waitForTimeout(400);
    const f = await focused();
    check(
      'new-issue-focus-title',
      /title/i.test(f) ||
        (await page.evaluate(() => /title/i.test(document.activeElement?.getAttribute('placeholder') ?? document.activeElement?.id ?? ''))),
      f,
    );
    const scope = (await dialog(page).count()) ? dialog(page) : page;
    await scope.getByLabel(/title/i).or(scope.getByPlaceholder(/title/i)).first().fill(title);
    await shot('new-issue');
    await scope
      .getByRole('button', { name: /create|save|add|submit/i })
      .last()
      .click();
    await page.waitForTimeout(500);
    await shot('created');
    check('created-in-list', await page.getByText(title).filter({ visible: true }).first().isVisible());
  });

  await attempt('comment-added', async () => {
    const comment = page
      .getByRole('textbox', { name: /comment/i })
      .or(page.getByPlaceholder(/comment/i))
      .filter({ visible: true })
      .first();
    // Some builds open the new issue on creating it; the others open it from the list.
    if (!(await comment.isVisible())) await page.getByText(title).filter({ visible: true }).first().click();
    await page.waitForTimeout(500);
    await shot('detail');
    await comment.fill('Same on iOS.');
    // The button beside the box: in its own form when it has one.
    const send = /comment|send|post|reply/i;
    const form = page.locator('form').filter({ has: comment });
    await ((await form.count()) ? form.getByRole('button', { name: send }) : page.getByRole('button', { name: send })).last().click();
    await page.waitForTimeout(400);
    await shot('commented');
    check('comment-added', await page.getByText('Same on iOS.').filter({ visible: true }).first().isVisible());
  });

  await page.keyboard.press('Escape');
  await attempt('filter-opens', async () => {
    await page
      .getByRole('button', { name: /status|filter/i })
      .or(page.getByRole('combobox', { name: /status/i }))
      .first()
      .click();
    await page.waitForTimeout(400);
    await shot('filter');
    await page.keyboard.press('Escape');
  });

  await page.reload();
  await page
    .getByText(/in progress/i)
    .filter({ visible: true })
    .first()
    .waitFor();
  check('persists', await page.getByText(title).filter({ visible: true }).first().isVisible());
}
