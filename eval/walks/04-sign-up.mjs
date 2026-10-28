import { appeared, lines } from './lib.mjs';

export default async function walk({ page, url, shot, check, focused }) {
  await page.goto(url);
  await shot('empty');
  const email = page.getByLabel(/email/i).first();
  const password = page.getByLabel(/password/i).first();

  // Typing an address that's only half there: nothing should complain yet.
  let before = await lines(page);
  await email.click();
  await email.pressSequentially('ana@exa', { delay: 60 });
  const whileTyping = appeared(before, await lines(page), ['ana@exa']);
  await shot('typing');
  check('error-not-while-typing', !whileTyping.length && (await email.getAttribute('aria-invalid')) !== 'true', whileTyping.join(' / '));

  before = await lines(page);
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  const onLeave = appeared(before, await lines(page));
  await shot('left-email');
  check('error-on-leave', onLeave.length || (await email.getAttribute('aria-invalid')) === 'true', onLeave.join(' / '));

  await password.fill('short');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(300);
  await shot('short-password');

  await page.getByLabel(/name/i).first().fill('Ana Silva');
  await email.fill('ana@example.com');
  await password.fill('ceramics2026');
  // The checkbox's words are part of it: clicking them ticks it.
  const terms = page.getByRole('checkbox').first();
  await page.getByText(/i agree/i).first().click();
  check('label-is-target', await terms.isChecked());
  if (!(await terms.isChecked())) await terms.check();

  before = await lines(page);
  await page.getByRole('button', { name: /create account/i }).click();
  await page.waitForTimeout(150);
  await shot('submitting');
  await page.waitForTimeout(1800);
  await shot('taken');
  const taken = appeared(before, await lines(page)).join(' / ');
  check('taken-shown', /taken|already|in use|exists|registered/i.test(taken), taken);
  check('focus-not-body', (await focused()) !== 'body', await focused());

  await email.fill('ana.silva@example.com');
  await page.getByRole('button', { name: /create account/i }).click();
  await page.getByText(/ana/i).filter({ hasText: /welcome|hi|hello/i }).first().waitFor({ timeout: 4000 });
  await shot('welcome');
  check('welcome', true);
}
