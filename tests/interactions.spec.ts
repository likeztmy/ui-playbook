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

test('menu: shortcut keys form one column; keyboard flow; focus returns', async ({ page }) => {
  await page.goto('/components/menu');
  await hydrateAll(page);
  const trigger = page.getByRole('button', { name: 'Edit' }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const menu = page.getByRole('menu');
  await expect(menu).toBeVisible();

  // Measured once the opening spring has settled.
  const keyColumns = () =>
    menu.locator('kbd > span:last-child').evaluateAll((cells) => new Set(cells.map((c) => Math.round(c.getBoundingClientRect().left))).size);
  await expect.poll(keyColumns, { message: 'last keys share one column' }).toBe(1);

  const snap = menu.getByRole('menuitemcheckbox', { name: 'Snap to grid' });
  const checkBox = (await snap.locator('svg').first().boundingBox())!;
  const snapLabel = (await snap.getByText('Snap to grid', { exact: true }).boundingBox())!;
  const copyLabel = (await menu.getByRole('menuitem', { name: 'Copy' }).getByText('Copy', { exact: true }).boundingBox())!;
  expect(checkBox.x, 'check leads the row').toBeLessThan(snapLabel.x);
  expect(Math.round(copyLabel.x), 'labels share one line').toBe(Math.round(snapLabel.x));
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
  // No icons: the only visible glyphs are the checkmarks, one per radio
  // group. Unchecked rows keep a hidden one to hold the column.
  await expect(menu.locator('svg.lucide:visible')).toHaveCount(2);
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

test('confirm dialog: focus on Cancel, scrim does nothing, Esc cancels, focus returns', async ({ page }) => {
  await page.goto('/components/dialog');
  await hydrateAll(page);
  const trigger = page.getByRole('button', { name: 'Delete project…' }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const dialog = page.getByRole('alertdialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();

  await page.mouse.click(5, 5);
  await expect(dialog, 'scrim click does not dismiss').toBeVisible();

  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
});

test('confirm dialog: Delete project runs the action', async ({ page }) => {
  await page.goto('/components/dialog');
  await hydrateAll(page);
  const trigger = page.getByRole('button', { name: 'Delete project…' }).first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete project' }).click();
  await expect(page.getByText('was deleted.').first()).toBeVisible();
});

test('task dialog: field focused, Enter submits, scrim cancels only when untouched', async ({ page }) => {
  await page.goto('/components/dialog');
  await hydrateAll(page);
  const trigger = page.getByRole('button', { name: 'Rename…' });
  await trigger.scrollIntoViewIfNeeded();

  await trigger.click();
  const dialog = page.getByRole('dialog');
  const field = dialog.getByRole('textbox', { name: 'Name' });
  await expect(field).toBeFocused();
  await page.mouse.click(5, 5);
  await expect(dialog, 'untouched: scrim cancels').toHaveCount(0);

  await trigger.click();
  await field.fill('Q1 plan');
  await page.mouse.click(5, 5);
  await expect(dialog, 'typed: scrim keeps it open').toBeVisible();
  await field.press('Enter');
  await expect(dialog).toHaveCount(0);
  await expect(page.getByText('Q1 plan')).toBeVisible();
});

test('input: checked on blur, not per keystroke; clears as you fix it', async ({ page }) => {
  await page.goto('/components/input');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · checked' });
  const email = live.getByRole('textbox', { name: 'Email' });
  await email.scrollIntoViewIfNeeded();
  await email.fill('ana@studio');
  await expect(live.getByText('Enter an email address'), 'no error while typing').toHaveCount(0);
  await email.press('Tab');
  await expect(live.getByText('Enter an email address, like ana@studio.com.')).toBeVisible();
  await expect(live.getByText('We send the invite here.'), 'error takes the hint’s line').toBeHidden();
  await email.fill('ana@studio.com');
  await expect(live.getByText('Enter an email address'), 'clears on fix').toHaveCount(0);
});

test('select: opens over the trigger, typeahead + Enter picks, Esc keeps the old value', async ({ page }) => {
  await page.goto('/components/select');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · opens' });
  const trigger = live.getByRole('combobox');
  await trigger.scrollIntoViewIfNeeded();
  await expect(trigger).toHaveText('Editor');

  await trigger.click();
  const current = page.getByRole('option', { name: 'Editor' });
  await expect(current).toBeVisible();
  // Measured once the opening spring has settled.
  const offset = async () => {
    const [t, o] = [await trigger.locator('span').first().boundingBox(), await current.getByText('Editor', { exact: true }).boundingBox()];
    return Math.max(Math.abs(t!.x - o!.x), Math.abs(t!.y + t!.height / 2 - (o!.y + o!.height / 2)));
  };
  await expect.poll(offset, { message: 'option text on the trigger text' }).toBeLessThan(1);

  await page.keyboard.press('v');
  await expect(page.getByRole('option', { name: 'Viewer' })).toHaveAttribute('data-highlighted', '');
  await page.keyboard.press('Enter');
  await expect(trigger).toHaveText('Viewer');

  await trigger.click();
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveText('Viewer');
  await expect(trigger).toBeFocused();
});

test('checkbox: label toggles; parent goes mixed, then all on, then all off', async ({ page }) => {
  await page.goto('/components/checkbox');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · a parent box' });
  const parent = live.getByRole('checkbox', { name: 'All activity' });
  const comments = live.getByRole('checkbox', { name: 'Comments' });
  await parent.scrollIntoViewIfNeeded();
  await expect(parent).toHaveAttribute('aria-checked', 'mixed');

  await live.getByText('Comments').click();
  await expect(comments, 'clicking the words toggles').toHaveAttribute('aria-checked', 'true');

  await live.getByText('All activity').click();
  for (const name of ['Comments', 'Mentions', 'Assigned to me', 'Status changes'])
    await expect(live.getByRole('checkbox', { name })).toHaveAttribute('aria-checked', 'true');
  await expect(parent).toHaveAttribute('aria-checked', 'true');

  await parent.click();
  await expect(parent).toHaveAttribute('aria-checked', 'false');
  await expect(comments).toHaveAttribute('aria-checked', 'false');
});

test('switch: takes effect at once, Space toggles, knob stretches while pressed', async ({ page }) => {
  await page.goto('/components/switch');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · takes effect' });
  const rulers = live.getByRole('switch', { name: 'Show rulers' });
  const canvas = live.getByRole('img', { name: 'Canvas preview' });
  await rulers.scrollIntoViewIfNeeded();
  await expect(canvas).not.toHaveAttribute('data-rulers');

  await live.getByText('Show rulers').click();
  await expect(rulers).toHaveAttribute('aria-checked', 'true');
  await expect(canvas).toHaveAttribute('data-rulers');

  await rulers.focus();
  await page.keyboard.press('Space');
  await expect(rulers).toHaveAttribute('aria-checked', 'false');

  const thumb = rulers.locator('span').first();
  const box = (await rulers.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await expect.poll(async () => (await thumb.boundingBox())!.width).toBeCloseTo(20, 0);
  await page.mouse.up();
  await expect.poll(async () => (await thumb.boundingBox())!.width).toBeCloseTo(16, 0);
  await expect(rulers).toHaveAttribute('aria-checked', 'true');
});

test('tabs: arrows open, Home/End jump, bar sits under the current tab, nothing shifts', async ({ page }) => {
  await page.goto('/components/tabs');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · arrows' });
  const tab = (name: string) => live.getByRole('tab', { name });
  await tab('Overview').scrollIntoViewIfNeeded();
  const settingsX = (await tab('Settings').boundingBox())!.x;

  await tab('Overview').focus();
  await page.keyboard.press('ArrowRight');
  await expect(tab('Issues 12')).toHaveAttribute('aria-selected', 'true');
  await expect(live.getByText('12 open issues')).toBeVisible();
  await page.keyboard.press('End');
  await expect(tab('Settings')).toHaveAttribute('aria-selected', 'true');
  await page.keyboard.press('Home');
  await expect(tab('Overview')).toHaveAttribute('aria-selected', 'true');

  await tab('Activity').click();
  await expect(live.getByText('Ana moved')).toBeVisible();
  const bar = live.locator('[role=tablist] > :last-child');
  const t = (await tab('Activity').boundingBox())!;
  await expect.poll(async () => Math.round((await bar.boundingBox())!.x)).toBe(Math.round(t.x));
  await expect.poll(async () => Math.round((await bar.boundingBox())!.width)).toBe(Math.round(t.width));
  expect((await tab('Settings').boundingBox())!.x, 'tabs keep their place').toBe(settingsX);
});

test('slider: click glides to a stop, drag follows, ends stretch, keys step', async ({ page }) => {
  await page.goto('/components/slider');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · drag' });
  const radius = live.getByRole('slider', { name: 'Radius' });
  const opacity = live.getByRole('slider', { name: 'Opacity' });
  const columns = live.getByRole('slider', { name: 'Columns' });
  await radius.scrollIntoViewIfNeeded();

  // A click on a long range lands on the nearest tenth: 22% of 0–48 → 0.2 → 10.
  const r = (await radius.boundingBox())!;
  await page.mouse.click(r.x + r.width * 0.22, r.y + r.height / 2);
  await expect(radius).toHaveAttribute('aria-valuenow', '10');

  // A click on ten stops or fewer lands on a stop: 62% of 1–6 → 4.
  const c = (await columns.boundingBox())!;
  await page.mouse.click(c.x + c.width * 0.62, c.y + c.height / 2);
  await expect(columns).toHaveAttribute('aria-valuenow', '4');

  // A drag follows the pointer exactly, with no glide.
  const o = (await opacity.boundingBox())!;
  const y = o.y + o.height / 2;
  await page.mouse.move(o.x + o.width * 0.5, y);
  await page.mouse.down();
  await page.mouse.move(o.x + o.width * 0.8, y, { steps: 8 });
  await expect(opacity).toHaveAttribute('aria-valuenow', '80');
  await expect(opacity).not.toHaveAttribute('data-gliding');

  // Past the end the row stretches, at most 10px, and springs back.
  await page.mouse.move(o.x + o.width + 400, y, { steps: 8 });
  await expect(opacity).toHaveAttribute('aria-valuenow', '100');
  expect((await opacity.boundingBox())!.width - o.width).toBeCloseTo(10, 0);
  await page.mouse.up();
  await expect.poll(async () => Math.round((await opacity.boundingBox())!.width)).toBe(Math.round(o.width));

  await opacity.focus();
  await page.keyboard.press('ArrowLeft');
  await expect(opacity).toHaveAttribute('aria-valuenow', '99');
  await page.keyboard.press('Shift+ArrowLeft');
  await expect(opacity).toHaveAttribute('aria-valuenow', '89');
  await page.keyboard.press('Home');
  await expect(opacity).toHaveAttribute('aria-valuenow', '0');
  await expect(opacity).toHaveAttribute('aria-valuetext', '0%');
});

test('segmented: click and arrows choose, the thumb slides under the choice', async ({ page }) => {
  await page.goto('/components/segmented-control');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · click' });
  const group = live.getByRole('radiogroup', { name: 'View' });
  const thumb = group.locator('[aria-hidden]').first();
  await group.scrollIntoViewIfNeeded();
  const under = async (name: string) => {
    const [t, r] = [await thumb.boundingBox(), await live.getByRole('radio', { name }).boundingBox()];
    return Math.abs(t!.x - r!.x) < 1 && Math.abs(t!.width - r!.width) < 1;
  };

  await expect(live.getByRole('radio', { name: 'Board' })).toHaveAttribute('aria-checked', 'true');
  await live.getByRole('radio', { name: 'List' }).click();
  await expect(live.getByRole('radio', { name: 'List' })).toHaveAttribute('aria-checked', 'true');
  await expect(live.getByRole('img', { name: 'Tasks as list' })).toBeVisible();
  await expect.poll(() => under('List'), { message: 'thumb under List' }).toBe(true);

  await page.keyboard.press('ArrowRight');
  await expect(live.getByRole('radio', { name: 'Timeline' })).toHaveAttribute('aria-checked', 'true');
  await expect(live.getByRole('radio', { name: 'Timeline' })).toBeFocused();
  await expect.poll(() => under('Timeline')).toBe(true);
});

test('segmented: icon segments are named and carry tooltips', async ({ page }) => {
  await page.goto('/components/segmented-control');
  await hydrateAll(page);
  const center = page.getByRole('radio', { name: 'Align center' });
  await center.scrollIntoViewIfNeeded();
  await center.hover();
  await expect(page.locator('[data-open]').filter({ hasText: 'Align center' }).last()).toBeVisible();
});

test('card: opens as one target, More opens its own menu, only live cards lift', async ({ page }) => {
  await page.goto('/components/card');
  await hydrateAll(page);
  const live = page.locator('figure').filter({ hasText: 'Live · hover' });
  const open = live.getByRole('button', { name: 'Brand refresh', exact: true });
  await open.scrollIntoViewIfNeeded();

  // Clicking the stage, not the title, still opens: the title's target covers the card.
  // Playwright sees the title's stretched target covering the stage, which
  // is the point; click the stage's spot with the mouse.
  const stage = (await live.locator('article').nth(1).locator('div').first().boundingBox())!;
  await page.mouse.click(stage.x + stage.width / 2, stage.y + stage.height / 2);
  await expect(live.getByText('Opened Brand refresh')).toBeVisible();

  await live.getByRole('button', { name: 'More for Q4 roadmap' }).click();
  await expect(page.getByRole('menu')).toBeVisible();
  await expect(live.getByText('Opened Q4 roadmap'), 'More does not open the card').toHaveCount(0);
  await page.keyboard.press('Escape');

  const scaleOf = (el: import('@playwright/test').Locator) => el.evaluate((n) => getComputedStyle(n).scale);
  const linkCard = page.locator('figure').filter({ hasText: 'Variants' }).locator('article').first();
  const staticCard = page.locator('figure').filter({ hasText: 'Variants' }).locator('article').last();
  await linkCard.hover();
  await expect.poll(() => scaleOf(linkCard)).toBe('1.01');
  await staticCard.hover();
  await expect.poll(() => scaleOf(staticCard)).toBe('none');
});

test('card: a refreshed number swaps in digit by digit', async ({ page }) => {
  await page.goto('/components/card');
  await hydrateAll(page);
  const after = page.locator('figure').filter({ hasText: 'After' }).filter({ hasText: 'Conversion' });
  await after.scrollIntoViewIfNeeded();
  await after.getByRole('button', { name: 'Conversion' }).click();
  const digits = after.locator('[aria-hidden] > span');
  await expect(digits).toHaveCount(5);
  const delays = await digits.evaluateAll((d) => d.map((n) => getComputedStyle(n).animationDelay.split(',')[0].trim()));
  expect(delays.slice(0, 3)).toEqual(['0s', '0.03s', '0.06s']);
});
