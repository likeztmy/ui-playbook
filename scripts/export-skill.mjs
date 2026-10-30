// The playbook as an agent reads it: a Skill made from the built pages, so the site stays the one
// source. Each page becomes references/<kind>-<slug>.md (its prose, tables, and each demo's
// before/after verdicts and notes, without the demo); SKILL.md lists them with when to reach for
// each. Written into dist/skill/ui-playbook, served beside the site. Fails if a page comes out empty.
import { chromium } from '@playwright/test';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MOMENTS } from './skill-moments.mjs';

const SITE = 'https://ui-playbook.suspense.site';
const DIST = 'dist';
const OUT = join(DIST, 'skill/ui-playbook');
const KINDS = { components: 'component', principles: 'principle', systems: 'system' };

/** Runs in the page: the body of an entry as Markdown. */
function toMarkdown(site) {
  const text = (el) => el.textContent.replace(/\s+/g, ' ').trim();
  const inline = (el) =>
    [...el.childNodes]
      .map((n) => {
        if (n.nodeType === 3) return n.textContent.replace(/\s+/g, ' ');
        if (n.nodeType !== 1 || n.matches('svg, button, script, style')) return '';
        const inner = inline(n);
        if (n.matches('strong, b')) return `**${inner.trim()}**`;
        if (n.matches('em, i')) return `*${inner.trim()}*`;
        if (n.matches('code')) return `\`${n.textContent}\``;
        if (n.matches('a[href]')) {
          const href = n.getAttribute('href');
          return `[${inner.trim()}](${href.startsWith('/') ? site + href : href})`;
        }
        return inner;
      })
      .join('')
      .replace(/ +/g, ' ');
  const table = (t) => {
    const rows = [...t.querySelectorAll('tr')].map((r) => [...r.children].map((c) => inline(c).trim().replace(/\|/g, '\\|')));
    if (!rows.length) return '';
    const head = `| ${rows[0].join(' | ')} |\n| ${rows[0].map(() => '---').join(' | ')} |`;
    return [head, ...rows.slice(1).map((r) => `| ${r.join(' | ')} |`)].join('\n');
  };
  const list = (l) => [...l.children].map((li, k) => `${l.matches('ol') ? `${k + 1}.` : '-'} ${inline(li).trim()}`).join('\n');
  // A demo: its verdicts and notes are the lesson; the working demo is left on the page.
  const demo = (el) => {
    const sides = [...el.querySelectorAll('[class*="_side_"]')];
    if (sides.length)
      return sides
        .map((side) => {
          const cap = side.querySelector('figcaption[data-tone]');
          const label = cap?.querySelector('[class*="_verdict_"]') ?? cap;
          const note = side.querySelector('[class*="_note_"]');
          const tone = cap?.dataset.tone === 'good' ? 'Prefer' : cap?.dataset.tone === 'bad' ? 'Avoid' : 'Compare';
          return `- **${tone}: ${label ? text(label) : ''}.**${note ? ` ${inline(note).trim()}` : ''}`;
        })
        .join('\n');
    // Without verdicts, only captions that say something on their own: a scene's name ("Variants")
    // or a live readout (`18 − 8 − 0 = 10px`) means nothing once the demo is gone.
    const says = (n) => !n.startsWith('`') && n.split(' ').length >= 5;
    const notes = [...el.querySelectorAll('figcaption, [class*="_note_"], [class*="_caption"]')].map((n) => inline(n).trim()).filter(says);
    return [...new Set(notes)].map((n) => `- ${n}`).join('\n');
  };
  const block = (el) => {
    if (el.matches('h2')) return `## ${text(el)}`;
    if (el.matches('h3')) return `### ${text(el)}`;
    if (el.matches('h4')) return `#### ${text(el)}`;
    if (el.matches('p')) return inline(el).trim();
    if (el.matches('ul, ol')) return list(el);
    if (el.matches('table')) return table(el);
    if (el.matches('pre')) return '```\n' + el.textContent.trim() + '\n```';
    if (el.matches('blockquote')) return `> ${inline(el).trim()}`;
    if (el.matches('astro-island, figure, [data-noted]') || el.querySelector('astro-island')) return demo(el);
    if (el.querySelector('table')) return table(el.querySelector('table'));
    return '';
  };
  const body = document.querySelector('[data-body]');
  return [...body.children].map(block).filter((s) => s && s.trim()).join('\n\n');
}

const pages = Object.entries(KINDS).flatMap(([dir, kind]) =>
  readdirSync(join(DIST, dir), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ kind, slug: d.name, file: join(DIST, dir, d.name, 'index.html'), url: `${SITE}/${dir}/${d.name}` })),
);

const browser = await chromium.launch({ channel: 'chrome' });
const page = await browser.newPage({ javaScriptEnabled: false });
rmSync(OUT, { recursive: true, force: true });
mkdirSync(join(OUT, 'references'), { recursive: true });

const index = [];
for (const p of pages) {
  await page.setContent(readFileSync(p.file, 'utf8'));
  const title = (await page.textContent('h1'))?.trim();
  // The page's own header, not one inside a demo.
  const summary = (await page.locator('header:has(~ [data-body]) > p').last().textContent())?.trim();
  const body = await page.evaluate(toMarkdown, SITE);
  // A principle leads with its rule in bold: that sentence is what the index promises.
  const rule = p.kind === 'principle' ? body.match(/^\*\*(.+?)\*\*/m)?.[1] : null;
  if (!title || body.length < 400) throw new Error(`export-skill: ${p.url} came out empty (${body.length} chars)`);
  const name = `${p.kind}-${p.slug}.md`;
  writeFileSync(join(OUT, 'references', name), `# ${title}\n\n${summary}\n\nFrom ${p.url}\n\n${body}\n`);
  index.push({ ...p, title, summary, rule, name });
}
await browser.close();

const line = (e) => `- [${e.title}](references/${e.name}): ${e.rule ?? e.summary}`;
const byName = new Map(index.map((e) => [e.name, e]));
const moment = ({ when, rule, pages }) => {
  const links = pages.map((slug) => {
    const e = byName.get(`${slug}.md`);
    if (!e) throw new Error(`export-skill: moment "${when}" names a missing page ${slug}`);
    return `[${e.title}](references/${e.name})`;
  });
  return `- **When you're ${when}:** ${rule} (${links.join(', ')})`;
};
writeFileSync(
  join(OUT, 'SKILL.md'),
  `---
name: ui-playbook
description: Rules for product UI, each with the reason and the mistake it prevents, from UI Playbook. Use when building or reviewing any interface: choosing and wiring a component (button, menu, dialog, toast, input, select, combobox, tabs, table, sheet…); a form and when its errors show; loading, waiting and empty states; confirmations and undo; lists, selection and bulk actions; motion; colour, spacing, radius and shadow; focus, keyboard and pointer behaviour.
---

# UI Playbook

Each reference is one page of ${SITE}: a component's kinds, anatomy, states, common mistakes and copy,
a principle's rule, details and where it doesn't apply, or a system's numbers for one kind of
product. Demos on the site are given here as their verdicts: **Prefer** is what to build, **Avoid**
is the mistake it replaces.

## Floors

Two floors every screen meets, in every system, whichever pages you read:

- **Text holds 4.5:1** against what it sits on: muted and secondary text too, ids, dates, counts,
  badges and hints included. On white, no grey lighter than \`#767676\`. This is WCAG 2.2 AA
  ([Lightness first](references/principle-lightness-first.md)).
- **Icons come from one icon library**, at one stroke, sized to the text beside them. If the
  project has none, add one, such as Lucide or Phosphor. A text symbol or emoji (↗ ✓ ★ ✳ ×) never
  stands in for an icon, and no SVG is drawn by hand: status, priority and arrows are in the
  library too (Lucide's \`CircleDashed\`, \`SignalHigh\`, \`ArrowUpRight\`). For a logo, use the one
  the brief gives, or set the product's name in type ([Icon](references/component-icon.md)).

## Systems

How big the text and controls are, and how much colour a screen carries, depend on the kind of
product. Each system gives those numbers; the brand colour and typeface stay the product's own.

${index.filter((e) => e.kind === 'system').map(line).join('\n')}

A sign-up, settings or empty screen takes the system of the product it belongs to.

## While you build

Each line is the rule for that moment, stated in full: follow it as written. Its pages hold the
kinds, states, numbers and reasons.

${MOMENTS.map(moment).join('\n')}

## Steps

1. Pick the system the product calls for and read it in full.
2. Before any code, state the design you'll build to, each part with where it comes from (the
   brief, a line of this playbook, or your own choice): the system, the accent, each surface
   layer, and the typeface with its sizes. Define each as a variable; every colour and font in the
   code is one of them.
3. As you reach each moment above, build to its rule.
4. Before writing a component, read its page from the list below: its kinds, states, focus and copy.
5. Before you finish, go back through each moment you reached and check the screen against its
   line, and the code against the design you stated. Then write out each text colour with the
   surface under it and its contrast ratio, each font size with where it's used, and each icon
   with where it comes from; fix what falls short of the floors and the system. Then check the
   result against each page's Common mistakes and When it doesn't apply.

## Components

${index.filter((e) => e.kind === 'component').map(line).join('\n')}

## Principles

${index.filter((e) => e.kind === 'principle').map(line).join('\n')}
`,
);
console.log(`export-skill: ${index.length} pages → ${OUT}`);
