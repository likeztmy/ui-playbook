// Steps several walks share.

/** The page's visible lines, to see what appeared between two moments. */
export const lines = (page) => page.evaluate(() => document.body.innerText.split('\n').map((l) => l.trim()).filter(Boolean));

/** Lines in `after` that weren't in `before`, leaving out what the person typed. */
export const appeared = (before, after, typed = []) => after.filter((l) => !before.includes(l) && !typed.some((t) => l.includes(t)));

/** The longest animation running now, in ms: motion that opens a surface the person asked for. */
export const longestAnimation = (page) =>
  page.evaluate(() => Math.max(0, ...document.getAnimations().map((a) => Number(a.effect?.getComputedTiming().endTime) || 0)));

/** The open dialog, whichever role the build gave it. */
export const dialog = (page) => page.locator('[role="dialog"]:visible, [role="alertdialog"]:visible, dialog[open]').first();
