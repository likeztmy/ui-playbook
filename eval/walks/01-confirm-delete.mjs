import { dialog, longestAnimation } from './lib.mjs';

export default async function walk({ page, url, shot, check, focused }) {
  await page.goto(url);
  const trigger = page.getByRole('button', { name: /delete project/i }).first();
  await trigger.scrollIntoViewIfNeeded();
  await shot('settings');

  await trigger.click();
  const d = dialog(page);
  await d.waitFor();
  check('motion-short', (await longestAnimation(page)) <= 300, `${await longestAnimation(page)} ms`);
  await page.waitForTimeout(400);
  await shot('asks');
  const inside = await d.evaluate((el) => el.contains(document.activeElement));
  const f = await focused();
  check('dialog-focus-inside', inside, f);
  check('dialog-focus-safe', inside && !/delete|remove|yes|confirm|ok/i.test(f), f);
  check('dialog-names-object', /q4 roadmap/i.test(await d.innerText()), (await d.innerText()).slice(0, 120));
  const go = d.getByRole('button', { name: /delete|remove/i }).last();
  check('dialog-verb-button', await go.count(), await d.getByRole('button').allInnerTexts());

  await page.keyboard.press('Escape');
  await d.waitFor({ state: 'hidden' }).catch(() => {});
  check('dialog-escape', !(await d.isVisible()));
  const back = await trigger.evaluate((el) => el === document.activeElement);
  check('dialog-focus-return', back, await focused());

  await trigger.click();
  await d.waitFor();
  // Some builds ask for the name to be typed: type it, as a person would.
  const field = d.getByRole('textbox');
  if (await field.count()) await field.first().fill('Q4 roadmap');
  await shot('about-to-delete');
  await d.getByRole('button', { name: /delete|remove/i }).last().click();
  await page.getByText(/^projects$/i).filter({ visible: true }).first().waitFor();
  await page.waitForTimeout(400);
  await shot('projects');
  check('deleted', !(await page.getByText(/q4 roadmap/i).filter({ visible: true }).count()) || /deleted|removed/i.test(await page.innerText('body')));
  check('focus-not-body', (await focused()) !== 'body', await focused());
}
