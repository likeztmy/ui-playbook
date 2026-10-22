import { expect, test, type Page } from '@playwright/test';
import { hydrateAll } from './helpers';

// Each test pins one behaviour a playbook page claims. If a page says it,
// the component has to do it.

const openTip = (page: Page, text: string) => page.locator('[data-open]').filter({ hasText: text }).last();

test('tooltip waits delay-tooltip, then neighbours swap instantly', async ({ page }) => {
  await page.goto('/components/tooltip');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  const undo = live.getByRole('button', { name: 'Undo' });
  await undo.scrollIntoViewIfNeeded();

  await undo.hover();
  await page.waitForTimeout(250);
  await expect(openTip(page, 'Undo'), 'still waiting at 250ms').toHaveCount(0);
  await expect(openTip(page, 'Undo'), 'open after 500ms').toBeVisible({ timeout: 1000 });

  await live.getByRole('button', { name: 'Redo' }).hover();
  const redo = openTip(page, 'Redo');
  await expect(redo, 'neighbour opens at once').toBeVisible({ timeout: 150 });
  await expect(redo).toHaveAttribute('data-instant', /.+/);
});

test('toolbar tools are named by tooltips with their shortcut', async ({ page }) => {
  await page.goto('/components/toolbar');
  await hydrateAll(page);
  const tool = page.locator('figure').first().getByRole('button', { name: 'Rectangle' });
  await tool.scrollIntoViewIfNeeded();
  await tool.hover();
  await expect(openTip(page, 'Rectangle')).toContainText('R', { timeout: 1000 });
  await expect(tool).not.toHaveAttribute('title');
});

test('loading waits delay-loading, keeps its width, ignores presses', async ({ page }) => {
  await page.goto('/components/button');
  await hydrateAll(page);
  // The "after" side of the loading comparison.
  const publish = page.getByRole('button', { name: /^Publish/ }).nth(1);
  await publish.scrollIntoViewIfNeeded();
  const meter = page.getByText(/^Requests sent:/).nth(1);
  const width = (await publish.boundingBox())!.width;

  await publish.click();
  await page.waitForTimeout(120);
  await expect(publish, 'not busy before 300ms').not.toHaveAttribute('data-loading');
  await expect(publish).toHaveAttribute('data-loading', '', { timeout: 500 });
  expect((await publish.boundingBox())!.width, 'width while busy').toBeCloseTo(width, 0);

  await publish.click();
  await expect(meter).toHaveText('Requests sent: 1');

  await expect(publish).not.toHaveAttribute('data-loading', { timeout: 2500 });
  expect((await publish.boundingBox())!.width, 'width after').toBeCloseTo(width, 0);
});

test('menu: keycaps share one width; keyboard flow; focus returns', async ({ page }) => {
  await page.goto('/components/menu');
  await hydrateAll(page);
  const trigger = page.getByRole('button', { name: 'Edit' }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();

  const capWidths = await menu.locator('kbd > span').evaluateAll((caps) => [
    ...new Set(caps.map((c) => Math.round(c.getBoundingClientRect().width))),
  ]);
  expect(capWidths, 'one cap width').toHaveLength(1);

  const snap = menu.getByRole('menuitemcheckbox', { name: 'Snap to grid' });
  await expect(snap).toHaveAttribute('aria-checked', 'true');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect(snap).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('Space');
  await expect(snap, 'toggled').toHaveAttribute('aria-checked', 'false');
  await expect(menu, 'stays open on toggle').toBeVisible();

  await page.keyboard.press('Escape');
  await expect(menu).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('concentric: inset at or past the radius keeps the inner radius', async ({ page }) => {
  await page.goto('/principles/concentric-radius');
  await hydrateAll(page);
  const readout = page.locator('figure').first().locator('code').first();
  await expect(readout).toHaveText('16 − 8 − 0 = 8px');
  await page.getByRole('slider', { name: 'Inset' }).focus();
  await page.keyboard.press('End');
  await expect(readout).toHaveText('inset ≥ radius: inner keeps its own 8px');
});

test('header theme toggle flips, persists, and relabels', async ({ page }) => {
  await page.goto('/');
  await hydrateAll(page);
  const toggle = page.getByRole('button', { name: 'Switch to dark theme' });
  await toggle.click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await expect(page.getByRole('button', { name: 'Switch to light theme' })).toBeVisible();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
});

test('home search filters and names the empty state', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('searchbox').fill('menu');
  await expect(page.locator('[data-card]:visible')).toHaveCount(1);
  await page.getByRole('searchbox').fill('zzz');
  await expect(page.getByText('Nothing matches')).toBeVisible();
  await page.getByRole('button', { name: 'Clear search' }).click();
  await expect(page.getByRole('searchbox')).toBeFocused();
});

test('context menu: opens on right-click, no shortcuts, nothing dimmed', async ({ page }) => {
  await page.goto('/components/menu');
  await hydrateAll(page);
  const file = page.getByText('Q4 roadmap').first();
  await file.scrollIntoViewIfNeeded();
  await file.click({ button: 'right' });
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();
  await expect(menu.getByRole('menuitem', { name: 'Copy link' })).toBeVisible();
  await expect(menu.locator('kbd')).toHaveCount(0);
  await expect(menu.locator('[data-disabled]')).toHaveCount(0);
  await page.keyboard.press('Escape');
});

test('choice menu: picking a value closes and relabels the trigger', async ({ page }) => {
  await page.goto('/components/menu');
  await hydrateAll(page);
  const trigger = page.getByRole('button', { name: /^Sort: Modified/ });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const menu = page.getByRole('menu');
  await expect(menu.getByRole('menuitemradio', { name: 'Modified' })).toHaveAttribute('aria-checked', 'true');
  // No icons: the only glyphs are the checkmarks, one per radio group.
  await expect(menu.locator('svg.lucide')).toHaveCount(2);
  await menu.getByRole('menuitemradio', { name: 'Name' }).click();
  await expect(menu).toHaveCount(0);
  await expect(page.getByRole('button', { name: /^Sort: Name/ })).toBeVisible();
});

test('toolbar toggles: several can be pressed at once', async ({ page }) => {
  await page.goto('/components/toolbar');
  await hydrateAll(page);
  const bold = page.getByRole('button', { name: 'Bold' });
  const italic = page.getByRole('button', { name: 'Italic' });
  await italic.scrollIntoViewIfNeeded();
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
  await italic.click();
  await expect(bold).toHaveAttribute('aria-pressed', 'true');
  await expect(italic).toHaveAttribute('aria-pressed', 'true');
});
