import { existsSync, readdirSync } from 'node:fs';
import { expect, type Locator, type Page } from '@playwright/test';
import { entries, href } from '../src/entries';

// Chinese pages, once published (src/pages/zh; drafts wait in src/pages/_zh):
// /zh and whichever entries have been translated.
export const ZH_PUBLISHED = existsSync(new URL('../src/pages/zh/', import.meta.url));
const ZH = ['components', 'principles'].flatMap((kind) => {
  const dir = new URL(`../src/pages/zh/${kind}/`, import.meta.url);
  return existsSync(dir) ? readdirSync(dir).filter((f) => f.endsWith('.mdx')).map((f) => `/zh/${kind}/${f.replace(/\.mdx$/, '')}`) : [];
});

export const ROUTES = ['/', ...entries.map(href), ...(ZH_PUBLISHED ? ['/zh', ...ZH] : []), '/lab/menu', '/lab/shortcuts', '/lab/check', '/lab/hero', '/lab/frames', '/lab/mail-states', '/practice/mail/app', '/lab/track'];

/**
 * Collects console errors and page exceptions from the moment it's called.
 * Read `errors` after the interaction under test.
 */
export function watchErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  page.on('pageerror', (e) => errors.push(e.message));
  return errors;
}

/**
 * Scrolls every island into view so `client:visible` fires, then waits until
 * none is still server-rendered only. A failed hydration leaves `ssr` behind.
 */
export async function hydrateAll(page: Page) {
  const islands = page.locator('astro-island');
  const n = await islands.count();
  for (let i = 0; i < n; i++) await islands.nth(i).scrollIntoViewIfNeeded();
  await expect(page.locator('astro-island[ssr]')).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, 0));
}

/**
 * Layout faults inside `root`, for checking after every step of an
 * interaction, not only at rest:
 * - a `fill` child that no longer fills its parent's height;
 * - visible text overlapping other text, or a visible icon or button;
 * - the same icon twice in one row, toolbar or header.
 * Things meant to float over content carry `data-overlay` and are skipped.
 * Returns one line per fault; an empty list passes.
 */
export async function layoutProblems(root: Locator, { fill = [] as string[] } = {}) {
  return root.evaluate((rootEl, fill) => {
    const problems: string[] = [];
    type Box = { l: number; t: number; r: number; b: number };
    const box = (r: DOMRect): Box => ({ l: r.left, t: r.top, r: r.right, b: r.bottom });
    const meet = (a: Box, b: Box): Box => ({ l: Math.max(a.l, b.l), t: Math.max(a.t, b.t), r: Math.min(a.r, b.r), b: Math.min(a.b, b.b) });
    const area = (a: Box) => Math.max(0, a.r - a.l) * Math.max(0, a.b - a.t);
    const name = (el: Element) => `${el.tagName.toLowerCase()}${el.getAttribute('aria-label') ? `[${el.getAttribute('aria-label')}]` : ''}`;

    // Shown at all: no hidden ancestor up to the root, and not floated over the content on purpose.
    const shown = (el: Element) => {
      for (let n: Element | null = el; n && n !== rootEl.parentElement; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0 || n.hasAttribute('data-overlay')) return false;
      }
      return true;
    };
    // The part of a box its clipping ancestors let through.
    const clipped = (el: Element, r: Box) => {
      let out = r;
      for (let n = el.parentElement; n && n !== rootEl.parentElement; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible') out = meet(out, box(n.getBoundingClientRect()));
      }
      return out;
    };

    for (const sel of fill) {
      for (const el of rootEl.querySelectorAll(sel)) {
        const parent = el.parentElement!;
        const cs = getComputedStyle(parent);
        const inner = parent.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
        const h = el.getBoundingClientRect().height;
        if (Math.abs(h - inner) > 1) problems.push(`${sel} is ${Math.round(h)}px tall in a ${Math.round(inner)}px parent`);
      }
    }

    // Visible text, one box per line of each text node.
    const texts: { node: Text; label: string; r: Box }[] = [];
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode() as Text | null; n; n = walker.nextNode() as Text | null) {
      if (!n.data.trim() || !shown(n.parentElement!)) continue;
      const range = document.createRange();
      range.selectNodeContents(n);
      // Text cut off with an ellipsis runs on past its box; only the part inside its content box shows.
      const own = n.parentElement!;
      const cs = getComputedStyle(own);
      const ob = own.getBoundingClientRect();
      const content =
        cs.overflowX !== 'visible'
          ? { l: ob.left + parseFloat(cs.paddingLeft), t: ob.top, r: ob.right - parseFloat(cs.paddingRight), b: ob.bottom }
          : null;
      for (const rect of range.getClientRects()) {
        const r0 = clipped(own, box(rect));
        const r = content ? meet(r0, content) : r0;
        if (area(r) > 4) texts.push({ node: n, label: n.data.trim().slice(0, 24), r });
      }
    }
    for (let i = 0; i < texts.length; i++)
      for (let j = i + 1; j < texts.length; j++)
        if (texts[i].node !== texts[j].node && area(meet(texts[i].r, texts[j].r)) > 4)
          problems.push(`text “${texts[i].label}” overlaps text “${texts[j].label}”`);

    const marks = [...rootEl.querySelectorAll('svg, button')].filter(shown);
    for (const el of marks) {
      const r = clipped(el, box(el.getBoundingClientRect()));
      if (area(r) < 4) continue;
      for (const t of texts) if (!el.contains(t.node) && area(meet(r, t.r)) > 4) problems.push(`${name(el)} overlaps text “${t.label}”`);
    }

    const groups = new Map<Element, string[]>();
    for (const svg of rootEl.querySelectorAll('svg')) {
      if (!shown(svg) || area(clipped(svg, box(svg.getBoundingClientRect()))) < 4) continue;
      const icon = [...svg.classList].find((c) => c.startsWith('lucide-'));
      const group = svg.closest('[data-row], [role="toolbar"], header, li');
      if (!icon || !group) continue;
      const seen = groups.get(group) ?? [];
      if (seen.includes(icon)) problems.push(`${icon} twice in one ${group.tagName.toLowerCase()}${group.getAttribute('data-row') ? ` (${group.getAttribute('data-row')})` : ''}`);
      groups.set(group, [...seen, icon]);
    }
    return [...new Set(problems)];
  }, fill);
}
