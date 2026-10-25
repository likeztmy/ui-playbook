import { expect, test, type Page } from '@playwright/test';
import { hydrateAll, ZH_PUBLISHED } from './helpers';

// Each test pins one behaviour a playbook page claims. If a page says it,
// the component has to do it.

const openTip = (page: Page, text: string) => page.locator('[data-open]').filter({ hasText: text }).last();

test('tooltip waits delay-tooltip, then neighbours swap instantly', async ({ page }) => {
  await page.goto('/components/tooltip');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  const zoomOut = live.getByRole('button', { name: 'Zoom out' });
  await zoomOut.scrollIntoViewIfNeeded();

  await zoomOut.hover();
  await page.waitForTimeout(250);
  await expect(openTip(page, 'Zoom out'), 'still waiting at 250ms').toHaveCount(0);
  await expect(openTip(page, 'Zoom out'), 'open after 500ms').toBeVisible({ timeout: 1000 });

  await live.getByRole('button', { name: 'Zoom in' }).hover();
  const redo = openTip(page, 'Zoom in');
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

test('button: publishing the draft shows busy, then the state changes', async ({ page }) => {
  await page.goto('/components/button');
  await hydrateAll(page);
  const scene = page.locator('figure').first();
  await expect(scene.getByText('Draft')).toBeVisible();
  await scene.getByRole('button', { name: 'Publish' }).click();
  await expect(scene.getByRole('button', { name: /Publish/ })).toHaveAttribute('data-loading', '', { timeout: 800 });
  await expect(scene.getByText('Published')).toBeVisible({ timeout: 3000 });
});

test('badge: the states are words, so the list filters by them', async ({ page }) => {
  await page.goto('/components/badge');
  await hydrateAll(page);
  const scene = page.locator('figure').first();
  await scene.getByRole('textbox', { name: 'Filter' }).fill('review');
  await expect(scene.getByRole('listitem')).toHaveCount(2);
  await scene.getByRole('textbox', { name: 'Filter' }).fill('Atlantis');
  await expect(scene.getByText('No issue matches “Atlantis”.')).toBeVisible();
});

test('loading waits delay-loading, keeps its width, ignores presses', async ({ page }) => {
  await page.goto('/components/button');
  await hydrateAll(page);
  const after = page.locator('figure').filter({ hasText: 'Requests sent' }).filter({ hasText: 'After' });
  const publish = after.getByRole('button', { name: /^Publish/ });
  await publish.scrollIntoViewIfNeeded();
  const meter = after.getByText(/^Requests sent:/);
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
  await expect(readout).toHaveText('18 − 8 − 0 = 10px');
  await page.getByRole('slider', { name: 'Inset' }).focus();
  await page.keyboard.press('End');
  await expect(readout).toHaveText('inset + border ≥ radius: inner keeps its own 8px');
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
  await page.getByRole('searchbox').fill('slider');
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

test('menu scene: Duplicate and Delete act on the file; Sort reorders', async ({ page }) => {
  await page.goto('/components/menu');
  await hydrateAll(page);
  const scene = page.locator('figure').first();
  const names = () => scene.getByRole('listitem').evaluateAll((rows) => rows.map((r) => r.querySelector('[class*=fileName]')?.textContent));
  await scene.getByText('Metrics').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Duplicate' }).click();
  await expect.poll(names).toContain('Metrics copy');
  await scene.getByText('Brand guide').click({ button: 'right' });
  await page.getByRole('menuitem', { name: 'Delete' }).click();
  await expect.poll(names).not.toContain('Brand guide');
  await scene.getByRole('button', { name: /^Sort:/ }).click();
  await page.getByRole('menuitemradio', { name: 'Name' }).click();
  await scene.getByRole('button', { name: /^Sort:/ }).click();
  await page.getByRole('menuitemradio', { name: 'Ascending' }).click();
  await expect.poll(names).toEqual(['Metrics', 'Metrics copy', 'Q4 roadmap']);
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

test('toolbar canvas: a letter picks the tool, one shape returns to Select, Undo takes it back', async ({ page }) => {
  await page.goto('/components/toolbar');
  await hydrateAll(page);
  const scene = page.locator('figure').first();
  const board = scene.getByRole('application', { name: 'Canvas' });
  const shapes = scene.locator('[aria-label="rect"]');
  await expect(shapes).toHaveCount(1);
  await board.focus();
  await page.keyboard.press('r');
  await expect(scene.getByRole('button', { name: 'Rectangle' })).toHaveAttribute('aria-pressed', 'true');
  await board.click({ position: { x: 400, y: 120 } });
  await expect(shapes).toHaveCount(2);
  await expect(scene.getByRole('button', { name: 'Select' })).toHaveAttribute('aria-pressed', 'true');
  await scene.getByRole('button', { name: 'Undo' }).click();
  await expect(shapes).toHaveCount(1);
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
  const trigger = page.locator('figure').first().getByRole('button', { name: 'Delete…' });
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
  const trigger = page.locator('figure').first().getByRole('button', { name: 'Delete…' });
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
  const after = page.locator('figure').filter({ hasText: 'After' }).filter({ hasText: 'For delivery updates only.' }).first();
  const email = after.getByRole('textbox', { name: 'Email' });
  await email.scrollIntoViewIfNeeded();
  await email.fill('zoe@laurent');
  await expect(after.getByText('Enter an email address'), 'no error while typing').toHaveCount(0);
  await email.press('Tab');
  await expect(after.getByText('Enter an email address, like ana@studio.com.')).toBeVisible();
  await expect(after.getByText('For delivery updates only.'), 'error takes the hint’s line').toBeHidden();
  await email.fill('zoe@laurent.de');
  await expect(after.getByText('Enter an email address'), 'clears on fix').toHaveCount(0);
});

test('input: a failed submit focuses the first error with the caret at the end; Edit comes back', async ({ page }) => {
  await page.goto('/components/input');
  await hydrateAll(page);
  const scene = page.locator('figure').filter({ hasText: 'Shipping address' }).first();
  await scene.scrollIntoViewIfNeeded();
  await scene.getByRole('button', { name: 'Continue' }).click();
  const email = scene.getByRole('textbox', { name: 'Email' });
  await expect(email).toBeFocused();
  await expect(scene.getByText('Enter an email address, like ana@studio.com.')).toBeVisible();
  // Base UI selects the text here; one keystroke would replace the answer.
  await expect.poll(() => email.evaluate((el: HTMLInputElement) => [el.selectionStart, el.selectionEnd])).toEqual([11, 11]);
  await page.keyboard.type('.de');
  await expect(email).toHaveValue('zoe@laurent.de');
  await scene.getByRole('button', { name: 'Continue' }).click();
  const edit = scene.getByRole('button', { name: 'Edit' });
  await expect(edit, 'focus follows to the summary').toBeFocused();
  await expect(scene.getByText('Updates go to zoe@laurent.de')).toBeVisible();
  await edit.click();
  await expect(scene.getByRole('textbox', { name: 'Full name' })).toBeFocused();
  await expect(email, 'nothing is lost').toHaveValue('zoe@laurent.de');
});

test('colour: one solid blue in the After editor; the frame list answers arrow keys', async ({ page }) => {
  await page.goto('/principles/colour-means-one-thing');
  await hydrateAll(page);
  const after = page.locator('figure').nth(1);
  await after.scrollIntoViewIfNeeded();
  const solidAccent = () =>
    after.evaluate((root) => {
      const accent = getComputedStyle(root).getPropertyValue('--accent').trim();
      const probe = document.createElement('i');
      probe.style.color = accent;
      root.append(probe);
      const rgb = getComputedStyle(probe).color;
      probe.remove();
      return [...root.querySelectorAll('*')].filter((el) => getComputedStyle(el).backgroundColor === rgb).length;
    });
  expect(await solidAccent(), 'only Publish is filled with the accent').toBe(1);
  await after.getByRole('option', { name: 'Pricing' }).focus();
  await page.keyboard.press('ArrowDown');
  await expect(after.getByRole('option', { name: 'Onboarding' })).toHaveAttribute('aria-selected', 'true');
  await expect(after.getByRole('option', { name: 'Onboarding' })).toBeFocused();
});

test('where the eye goes: only the After answers at the button; only its fold cuts a plan', async ({ page }) => {
  await page.goto('/principles/where-the-eye-goes');
  await hydrateAll(page);
  const [before, after] = [page.locator('figure').nth(0), page.locator('figure').nth(1)];
  await before.getByRole('button', { name: 'Add to cart' }).click();
  await expect(before.getByRole('button', { name: 'Cart, 1 items' })).toBeVisible();
  await expect(before.getByRole('button', { name: 'Add to cart' })).toBeVisible();
  const add = after.getByRole('button', { name: 'Add to cart' });
  const width = (await add.boundingBox())!.width;
  await add.click();
  await expect(after.getByRole('button', { name: 'Added' })).toBeVisible();
  expect((await after.getByRole('button', { name: 'Added' }).boundingBox())!.width).toBe(width);
  const firstScreenShowsPlans = (n: number) =>
    page
      .getByRole('region', { name: 'Pricing page' })
      .nth(n)
      .evaluate((pane) => {
        const plan = pane.querySelector('[class*="floorPlanName"]')!.getBoundingClientRect();
        return plan.top < pane.getBoundingClientRect().bottom;
      });
  expect(await firstScreenShowsPlans(0)).toBe(false);
  expect(await firstScreenShowsPlans(1)).toBe(true);
});

test('nothing shifts: late results land above the Before list, below the After; the After holds the gutter', async ({ page }) => {
  await page.goto('/principles/nothing-shifts');
  await hydrateAll(page);
  const [before, after] = [page.locator('figure').nth(0), page.locator('figure').nth(1)];
  for (const f of [before, after]) {
    await f.getByRole('combobox', { name: 'Search docs' }).fill('b');
    await expect(f.getByRole('option').first()).toHaveText('Buttons');
  }
  await expect(before.getByRole('option').first()).toHaveText('Badges', { timeout: 2000 });
  await expect(after.getByRole('option')).toHaveCount(4, { timeout: 2000 });
  await expect(after.getByRole('option').first()).toHaveText('Buttons');
  for (const f of [before, after]) await f.getByRole('combobox', { name: 'Search docs' }).press('Enter');
  await expect(before.getByText('Opened “Badges”')).toBeVisible();
  await expect(after.getByText('Opened “Buttons”')).toBeVisible();

  // Headless Chromium hides scroll bars, so check the gutter is held rather than measure the jump.
  const gutter = (n: number) => page.getByRole('region', { name: 'Members' }).nth(n).evaluate((l) => getComputedStyle(l).scrollbarGutter);
  expect(await gutter(0)).toBe('auto');
  expect(await gutter(1)).toBe('stable');
});

test('nothing shifts: earlier messages push the Before thread, the After keeps its place', async ({ page }) => {
  await page.goto('/principles/nothing-shifts');
  await hydrateAll(page);
  const threads = page.getByRole('log', { name: 'Onboarding thread' });
  const topLine = (n: number) =>
    threads.nth(n).evaluate((p) => {
      const top = p.getBoundingClientRect().top;
      return [...p.children].find((c) => c.getBoundingClientRect().bottom > top + 2)!.textContent;
    });
  for (const n of [0, 1]) {
    const pane = threads.nth(n);
    await pane.scrollIntoViewIfNeeded();
    await pane.hover();
    await page.mouse.wheel(0, -260);
    await expect(pane.getByText('Kickoff notes are in the doc.')).toHaveCount(1, { timeout: 2000 });
    await page.waitForTimeout(200);
  }
  expect(await topLine(0)).not.toBe(await topLine(1));
  expect(await topLine(1)).not.toContain('Kickoff');
});

test('hover forgives: a diagonal to the submenu closes it in Before, holds in After', async ({ page }) => {
  await page.goto('/principles/hover-forgives');
  await hydrateAll(page);
  for (const [side, holds] of [['Before', false], ['After', true]] as const) {
    const f = page.locator('figure').filter({ hasText: side }).filter({ hasText: 'Move to' }).first();
    await f.scrollIntoViewIfNeeded();
    const move = (await f.getByText('Move to', { exact: true }).boundingBox())!;
    await page.mouse.move(move.x + 60, move.y + move.height / 2, { steps: 4 });
    const archive = (await f.getByText('Archive', { exact: true }).boundingBox())!;
    await page.mouse.move(archive.x + 20, archive.y + archive.height / 2, { steps: 12 });
    await expect(f.getByText('Archive', { exact: true })).toHaveCount(holds ? 1 : 0);
    await page.mouse.move(5, 5);
  }
});

test('error timing: only “on leaving, cleared on fix” is quiet while typing and clears on the fix', async ({ page }) => {
  await page.goto('/principles/error-timing');
  await hydrateAll(page);
  const grid = page.locator('figure').filter({ hasText: 'Four timings' });
  await grid.scrollIntoViewIfNeeded();
  const cell = (name: string) => grid.getByRole('region', { name, exact: true });
  const error = (name: string) => cell(name).getByText(/^Enter an email/);
  const field = (name: string) => cell(name).getByRole('textbox', { name: 'Email' });

  await field('On every keystroke').fill('zoe@laure');
  await expect(error('On every keystroke'), 'judged mid-word').toBeVisible();

  for (const [name, clearsOnFix] of [['On leaving', false], ['On leaving, cleared on fix', true]] as const) {
    await field(name).fill('zoe@laurent');
    await expect(error(name), 'quiet while typing').toHaveCount(0);
    await field(name).blur();
    await expect(error(name)).toBeVisible();
    await field(name).focus();
    await field(name).press('End');
    await page.keyboard.type('.de');
    if (clearsOnFix) await expect(error(name), 'cleared on the fix').toHaveCount(0);
    else await expect(error(name), 'still accusing until you leave').toBeVisible();
    await field(name).blur();
  }
});

test('select: opens over the trigger, typeahead + Enter picks, Esc keeps the old value', async ({ page }) => {
  await page.goto('/components/select');
  await hydrateAll(page);
  const live = page.locator('figure').first();
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
  await expect(trigger, 'open before the keys').toHaveAttribute('aria-expanded', 'true');
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('Escape');
  await expect(trigger).toHaveText('Viewer');
  await expect(trigger).toBeFocused();

  await expect(trigger, 'closed before moving on').toHaveAttribute('aria-expanded', 'false');
  await live.getByRole('textbox', { name: 'Email' }).fill('lea@acme.com');
  await live.getByRole('button', { name: 'Send invite' }).click();
  await expect(live.getByText('Invited lea@acme.com as Viewer')).toBeVisible();
});

test('checkbox: label toggles; parent goes mixed, then all on, then all off', async ({ page }) => {
  await page.goto('/components/checkbox');
  await hydrateAll(page);
  const live = page.locator('figure').first();
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

test('radio: one Tab stop on the chosen one, arrows move and choose, a choice reveals its field', async ({ page }) => {
  await page.goto('/components/radio');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  await live.scrollIntoViewIfNeeded();
  const two = live.getByRole('radio', { name: '2×' });
  await expect(two).toBeChecked();
  await two.focus();
  await page.keyboard.press('ArrowDown');
  await expect(live.getByRole('radio', { name: '3×' }), 'arrows choose').toBeChecked();
  await expect(live.getByText('3,600 × 2,400 px')).toBeVisible();
  await expect(live.getByRole('textbox', { name: 'Width' })).toHaveCount(0);
  await live.getByText('Custom width').click();
  await expect(live.getByRole('textbox', { name: 'Width' }), 'the follow-up appears').toBeVisible();

  // The mistake: every circle is its own Tab stop.
  const keys = page.locator('figure').filter({ hasText: 'Before' }).filter({ hasText: 'Overnight' }).nth(1);
  await keys.scrollIntoViewIfNeeded();
  await keys.getByRole('button').first().focus();
  await page.keyboard.press('Tab');
  await expect(keys.getByRole('button').nth(1)).toBeFocused();
});

test('popover origin: slow motion marks where each panel grows from, without scrolling the page', async ({ page }) => {
  await page.goto('/components/popover');
  await hydrateAll(page);
  const pair = page.locator('figure').filter({ hasText: 'Before' }).first().locator('..').locator('..');
  const [before, after] = [pair.locator('figure').nth(0), pair.locator('figure').nth(1)];
  await before.scrollIntoViewIfNeeded();
  await before.getByRole('button', { name: '0.1×' }).click();
  await expect(after.getByRole('button', { name: '0.1×' })).toHaveAttribute('aria-pressed', 'true');
  const originAt = async (f: typeof before) => {
    await f.getByRole('button', { name: 'Share' }).click();
    const dot = f.locator('[class*="origin"]');
    await expect(dot).toBeVisible();
    const y = await page.evaluate(() => scrollY);
    const [d, p] = [(await dot.boundingBox())!, (await f.getByRole('dialog').locator('..').boundingBox())!];
    await page.keyboard.press('Escape');
    await expect(dot).toHaveCount(0);
    return { dx: d.x + d.width / 2 - p.x, w: p.width, y };
  };
  const y0 = await page.evaluate(() => scrollY);
  const b = await originAt(before);
  const a = await originAt(after);
  expect(b.dx).toBeGreaterThan(b.w / 3);
  expect(a.dx).toBeLessThan(a.w / 6);
  expect(b.y).toBe(y0);
});

test('popover: focus goes to the field and back; a stray click keeps the draft', async ({ page }) => {
  await page.goto('/components/popover');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  await live.scrollIntoViewIfNeeded();
  const share = live.getByRole('button', { name: 'Share', exact: true });
  await share.click();
  await expect(share, 'the trigger stays pressed').toHaveAttribute('data-popup-open', '');
  const email = live.getByRole('textbox', { name: 'Email' });
  await expect(email).toBeFocused();
  await page.keyboard.type('lea@acme');
  await page.mouse.click(5, 5);
  await expect(email).toHaveCount(0);
  await share.click();
  await expect(email, 'the draft is kept').toHaveValue('lea@acme');
  await page.keyboard.press('Escape');
  await expect(share, 'focus returns').toBeFocused();
  await share.click();
  await live.getByRole('button', { name: 'Invite' }).click();
  await expect(live.getByText('Shared with Ana Ruiz, Kenji Mori, lea@acme')).toBeVisible();
});

test('combobox: forgiving match, Enter picks the first, Esc keeps the value, empty names the query', async ({ page }) => {
  await page.goto('/components/combobox');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  await live.scrollIntoViewIfNeeded();
  const input = live.getByRole('combobox', { name: 'Time zone' });
  await expect(input).toHaveValue('Lisbon');
  await input.fill('zurich');
  await expect(live.getByRole('option')).toHaveText(['ZürichSwitzerland']);
  await page.keyboard.press('Enter');
  await expect(input).toHaveValue('Zürich');
  await expect(live.getByText('Meetings shown in Zürich time')).toBeVisible();

  await input.fill('japan');
  await expect(live.getByRole('option'), 'the country is searched').toHaveText(['TokyoJapan']);
  await page.keyboard.press('Escape');
  await expect(input).toHaveValue('Zürich');
  await page.keyboard.press('Escape');
  await expect(input, 'a second Esc keeps the choice').toHaveValue('Zürich');

  await input.fill('Atlantis');
  await expect(live.getByText('No city matches “Atlantis”. Try the country instead.')).toBeVisible();
});

test('switch: takes effect at once, Space toggles, knob stretches while pressed', async ({ page }) => {
  await page.goto('/components/switch');
  await hydrateAll(page);
  const live = page.locator('figure').first();
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
  const live = page.locator('figure').first();
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
  const live = page.locator('figure').first();
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
  const live = page.locator('figure').first();
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
  const live = page.locator('figure').first();
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

test('table: header sorts and announces it, select-all goes mixed then all, name stays pinned', async ({ page }) => {
  await page.goto('/components/table');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  const table = live.getByRole('table', { name: 'Files' });
  await table.scrollIntoViewIfNeeded();
  const firstName = () => table.locator('tbody tr').first().locator('td').nth(1).innerText();

  const size = table.getByRole('columnheader', { name: 'Size' });
  await size.getByRole('button').click();
  await expect(size).toHaveAttribute('aria-sort', 'ascending');
  await expect.poll(firstName).toBe('Interview notes.md');
  await size.getByRole('button').click();
  await expect(size).toHaveAttribute('aria-sort', 'descending');
  await expect.poll(firstName).toBe('Onboarding flow.fig');
  await expect(table.getByRole('columnheader', { name: 'Modified' })).toHaveAttribute('aria-sort', 'none');

  const all = table.getByRole('checkbox', { name: 'Select all rows' });
  await table.getByRole('checkbox', { name: 'Select Metrics.csv' }).click();
  await expect(all).toHaveAttribute('aria-checked', 'mixed');
  await expect(live.getByText('1 selected')).toBeVisible();
  await all.click();
  await expect(live.getByText('5 selected')).toBeVisible();
  await all.click();
  await expect(live.getByText('Select files to act on them')).toBeVisible();

  const wide = page.locator('figure').filter({ hasText: 'After' }).filter({ hasText: 'Comments' }).getByRole('table');
  await wide.scrollIntoViewIfNeeded();
  const name = wide.locator('tbody td').first();
  const before = (await name.boundingBox())!.x;
  await wide.locator('..').evaluate((el) => (el.scrollLeft = 200));
  expect(Math.round((await name.boundingBox())!.x), 'pinned name column').toBe(Math.round(before));
});

test('toast: Undo restores, plain ones leave after 4s, errors stay and are alerts, three at most', async ({ page }) => {
  await page.clock.install();
  await page.goto('/components/toast');
  await hydrateAll(page);
  const live = page.locator('figure').first();
  await live.scrollIntoViewIfNeeded();

  await live.getByRole('button', { name: 'Delete' }).first().click();
  await expect(live.getByText('Q4 roadmap.fig', { exact: true })).toHaveCount(0);
  await live.locator('button', { hasText: 'Undo' }).click();
  await expect(live.getByText('Q4 roadmap.fig', { exact: true })).toBeVisible();

  await live.getByRole('button', { name: 'Copy link' }).click();
  await expect(live.getByText('Link copied')).toBeVisible();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(4500);
  await expect(live.getByText('Link copied')).toHaveCount(0);

  await live.getByRole('button', { name: 'Export' }).click();
  await page.mouse.move(0, 0);
  await page.clock.fastForward(20000);
  const error = live.locator('[data-type="error"]:has(button)').first();
  await expect(error, 'errors wait to be closed').toBeVisible();
  await expect(live.locator('[role="alert"]').filter({ hasText: 'Couldn’t export' }), 'announced at once').toHaveCount(1);
  // Base UI keeps toasts aria-hidden until focus moves in (F6) and announces
  // them through a separate live region, so find the button by its label.
  await error.locator('button[aria-label="Dismiss"]').click();
  await expect(error).toHaveCount(0);

  const limit = page.locator('figure').filter({ hasText: 'After' }).filter({ hasText: 'Upload 6 photos' });
  await limit.scrollIntoViewIfNeeded();
  await limit.getByRole('button', { name: 'Upload 6 photos' }).click();
  await expect(limit.locator('[data-type="success"]:has(button):not([data-limited])')).toHaveCount(3);
});

test('chinese edition, unpublished: no language link and no /zh pages', async ({ page }) => {
  test.skip(ZH_PUBLISHED, 'the Chinese edition is published');
  await page.goto('/principles/nothing-shifts');
  await expect(page.getByRole('link', { name: '中文' })).toHaveCount(0);
  await expect(page.locator('link[hreflang]')).toHaveCount(0);
  expect((await page.request.get('/zh/principles/nothing-shifts')).status()).toBe(404);
});

test('chinese edition: the header switches to the same page; untranslated entries link to English', async ({ page }) => {
  test.skip(!ZH_PUBLISHED, 'the Chinese edition is not published');
  await page.goto('/principles/nothing-shifts');
  await page.getByRole('link', { name: '中文' }).click();
  await expect(page).toHaveURL(/\/zh\/principles\/nothing-shifts\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'zh-CN');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('保持布局稳定');
  await hydrateAll(page);
  await expect(page.locator('figure').first().getByRole('button', { name: '切换主题' })).toBeVisible();
  await expect(page.getByText('同样的结果放到已有内容下面', { exact: false })).toBeVisible();
  await page.getByRole('link', { name: 'English' }).click();
  await expect(page).toHaveURL(/\/principles\/nothing-shifts\/?$/);

  await page.goto('/zh');
  await expect(page.getByRole('link', { name: /保持布局稳定/ })).toHaveAttribute('href', '/zh/principles/nothing-shifts');
  await expect(page.getByRole('link', { name: /^Button/ })).toHaveAttribute('href', '/components/button');
});

test('how waiting feels: a quick refresh shows no spinner in the After; once shown it stays; a star fills at once and rolls back on failure', async ({ page }) => {
  await page.goto('/principles/how-waiting-feels');
  await hydrateAll(page);
  const [before, after] = [page.locator('figure').nth(0), page.locator('figure').nth(1)];
  const spinner = (f: typeof before) => f.getByRole('button', { name: 'Refresh' }).locator('[class*="waitSpin"]');

  // Request 1 takes 160 ms: the Before flashes a spinner, the After shows none.
  await before.getByRole('button', { name: 'Refresh' }).click();
  await expect(spinner(before)).toHaveCount(1);
  await after.getByRole('button', { name: 'Refresh' }).click();
  await expect(spinner(after)).toHaveCount(0);
  await expect(after.getByText('Updated once')).toBeVisible();
  await expect(spinner(after)).toHaveCount(0);
  // Request 2 takes 340 ms: past the 300 ms delay, so the spinner shows, and holds until 800 ms.
  await after.getByRole('button', { name: 'Refresh' }).click();
  await expect(spinner(after)).toHaveCount(1, { timeout: 600 });
  await page.waitForTimeout(250);
  await expect(spinner(after)).toHaveCount(1);
  await expect(after.getByText('Updated 2 times')).toBeVisible({ timeout: 1500 });

  const stars = page.locator('figure').filter({ has: page.getByRole('checkbox', { name: 'Fail the next request' }) }).nth(1);
  await stars.scrollIntoViewIfNeeded();
  const q4 = stars.getByRole('button', { name: /Star Q4 roadmap|Unstar Q4 roadmap/ });
  await q4.click();
  await expect(q4).toHaveAttribute('aria-pressed', 'true', { timeout: 100 });
  await stars.getByRole('checkbox', { name: 'Fail the next request' }).click();
  await q4.click();
  await expect(q4).toHaveAttribute('aria-pressed', 'false');
  await expect(q4).toHaveAttribute('aria-pressed', 'true', { timeout: 2000 });
  await expect(stars.getByText('Couldn’t unstar “Q4 roadmap”. Try again.')).toBeVisible();
});

test('let motion change its mind: locked clicks are dropped, a keyframe sheet snaps open before closing, a spring keeps the flick', async ({ page }) => {
  await page.goto('/principles/let-motion-change-its-mind');
  await hydrateAll(page);
  const figure = (i: number) => page.locator('figure').nth(i);

  // Three fast Nexts: the locked carousel moves once, the redirectable one three times.
  for (const i of [0, 1]) {
    const next = figure(i).getByRole('button', { name: 'Next' });
    await next.click();
    await next.click();
    await next.click();
  }
  await expect(figure(0).getByLabel('Photo 2 of 5')).toBeVisible({ timeout: 2000 });
  await expect(figure(1).getByLabel('Photo 4 of 5')).toBeVisible({ timeout: 2000 });

  // A sheet opened and closed at once: the keyframe close starts fully open, the transition from where it got to.
  const reconsider = (i: number) =>
    figure(i).evaluate(async (f) => {
      const stage = f.querySelector('[class*="intSheetStage"]') as HTMLElement;
      const sheet = stage.querySelector('[role="dialog"]') as HTMLElement;
      const shown = () => (stage.getBoundingClientRect().right - sheet.getBoundingClientRect().left) / sheet.offsetWidth;
      (stage.querySelector('button') as HTMLButtonElement).click();
      await new Promise((r) => setTimeout(r, 120));
      (stage.querySelector('[class*="intOverlay"]') as HTMLElement).click();
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return shown();
    });
  await figure(2).scrollIntoViewIfNeeded();
  const snapped = await reconsider(2);
  const turned = await reconsider(3);
  expect(snapped).toBeGreaterThan(0.9);
  expect(turned).toBeLessThan(0.6);

  // A flick: after the release, the timed ease starts from rest while the spring carries on.
  const flick = async (i: number) => {
    const viewport = figure(i).locator('[class*="intSwipeViewport"]');
    await viewport.scrollIntoViewIfNeeded();
    const box = (await viewport.boundingBox())!;
    const strip = viewport.locator('[class*="intSwipeStrip"]');
    const left = () => strip.evaluate((el) => el.getBoundingClientRect().left);
    await page.mouse.move(box.x + box.width - 20, box.y + 60);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 100, box.y + 60, { steps: 6 });
    await page.mouse.up();
    const at = await left();
    await page.waitForTimeout(60);
    return at - (await left());
  };
  const eased = await flick(4);
  const sprung = await flick(5);
  expect(sprung).toBeGreaterThan(eased * 1.5);
});
