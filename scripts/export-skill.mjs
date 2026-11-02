// The playbook as an agent reads it: a Skill made from the built pages, so the site stays the one
// source. Each page becomes references/<kind>-<slug>.md (its prose, tables, and each demo's
// before/after verdicts and notes, without the demo); SKILL.md lists them with when to reach for
// each. Written into dist/skill/ui-playbook, served beside the site. Fails if a page comes out empty.
import { chromium } from '@playwright/test';
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { MOMENTS } from './skill-moments.mjs';
import { WORDS } from './skill-words.mjs';

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
    // The looks gallery is a picker over the look pages, which export on their own.
    .filter((d) => d.isDirectory() && !(dir === 'systems' && d.name === 'looks'))
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
const links = (pages, owner) =>
  pages
    .map((slug) => {
      const e = byName.get(`${slug}.md`);
      if (!e) throw new Error(`export-skill: "${owner}" names a missing page ${slug}`);
      return `[${e.title}](references/${e.name})`;
    })
    .join(', ');
const moment = ({ when, rule, pages }) => `- **When you're ${when}:** ${rule} (${links(pages, when)})`;
const word = ({ asked, means, pages }) => `- **${asked}:** ${means} (${links(pages, asked)})`;
writeFileSync(
  join(OUT, 'SKILL.md'),
  `---
name: ui-playbook
description: Rules for product UI, each with the reason and the mistake it prevents, from UI Playbook. Use when building or reviewing any interface: choosing and wiring a component (button, menu, dialog, toast, input, select, combobox, tabs, table, sheet…); a form and when its errors show; loading, waiting and empty states; confirmations and undo; lists, selection and bulk actions; motion; colour, spacing, radius and shadow; focus, keyboard and pointer behaviour; a request to make it nicer, cleaner, more premium or smoother.
---

# UI Playbook

Each reference is one page of ${SITE}: a component's kinds, anatomy, states, common mistakes and copy,
a principle's rule, details and where it doesn't apply, or a system's numbers for one kind of
product. Demos on the site are given here as their verdicts: **Prefer** is what to build, **Avoid**
is the mistake it replaces.

## Floors

Three floors every screen meets, in every system, whichever pages you read:

- **Text holds 4.5:1** against what it sits on: muted and secondary text too, ids, dates, counts,
  badges and hints included. On white, no grey lighter than \`#767676\`. This is WCAG 2.2 AA
  ([Lightness first](references/principle-lightness-first.md)).
- **Icons come from one icon library**, at one stroke, sized to the text beside them. If the
  project has none, add one, such as Lucide or Phosphor. A text symbol or emoji (↗ ✓ ★ ✳ ×) never
  stands in for an icon, and no SVG is drawn by hand: status, priority and arrows are in the
  library too (Lucide's \`CircleDashed\`, \`SignalHigh\`, \`ArrowUpRight\`). For a logo, use the one
  the brief gives, or set the product's name in type ([Icon](references/component-icon.md)).
- **An app's window holds still; each pane scrolls on its own.** The shell is \`100dvh\` tall
  (\`100vh\` hides its foot under a phone's toolbar), and the sidebar and the content each scroll
  inside it: scrolling a long document never moves the sidebar, and what sits at the sidebar's
  foot stays there. A flex or grid item's minimum height is its content's unless the item itself
  scrolls, so every layer between the shell and a scrolling pane takes \`min-height: 0\` and grid
  rows are \`minmax(0, 1fr)\`, or the pane grows past the window and nothing scrolls. A pane with
  no links or fields gets \`tabindex="0"\` and a name, so the keyboard can scroll it. A page that
  reads like a document, such as an article or a repository's front page, scrolls as one
  ([App shell](references/component-app-shell.md)).

## What you're building

The kind of thing decides which rules lead. When the brief doesn't say, ask how long and how
attentively someone stays with it: a product used all day can be dense and quiet, one used for a
moment has to explain itself at a glance. (About Face, 4th ed., ch. 9, calls this posture.)

- **A work tool** is used all day, in a window: trackers, editors, admin, chat. It leads with
  familiarity: start from the product people already use for this, grey surfaces, one accent, no
  entrance motion. People judge a tool by how little it asks of them, not by how new it looks.
- **A consumer app** is picked up in short visits, often on a phone: larger text and targets,
  colour in the content, motion that answers touch.
- **A reading page** is read through, or returned to: an article, docs, a repository's front page.
  It leads with type (measure, size, rhythm) and scrolls as one
  ([Reading text](references/principle-reading-text.md)).
- **A marketing page** is seen once and has to be remembered. Here, and only here, distinctiveness
  leads: open with the most characteristic thing in the subject's world, spend boldness on one
  idea and keep the rest quiet, and avoid the tells of generated pages that Anthropic lists in its
  [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) skill
  (one word accented in a headline, an uppercase label above every heading, identical rounded cards
  with one soft shadow, gradient washes, a “→” after every link). The floors still hold.

A sign-up, checkout, settings or empty screen takes the kind of the product it belongs to.

The text sizes, targets and colour for tools and consumer apps are in their systems; the brand
colour and typeface stay the product's own.

${index.filter((e) => e.kind === 'system' && !e.name.startsWith('system-look-')).map(line).join('\n')}

A look is a whole set of values for the variables the components read, light and dark, ready to
paste as \`:root\` blocks: take the one for the product the brief should feel like, or the
playbook's own when it names none. Each value says whether the product published it. A look is
named after the product; the screen never carries the product's logo or name.

${index.filter((e) => e.name.startsWith('system-look-')).map(line).join('\n')}

## When they ask for a look

People ask for a look in words an agent can't act on. Each means changes you can make and check:

${WORDS.map(word).join('\n')}

Say which of these you changed, so the next request can point at one.

## While you build

Each line is the rule for that moment, stated in full: follow it as written. Its pages hold the
kinds, states, numbers and reasons.

${MOMENTS.map(moment).join('\n')}

## Steps

1. Decide the kind of thing you're building; for a tool or a consumer app, read its system in full.
2. Before any code, write a short brief: what the person is trying to get done (the goal, not the
   steps), who uses it and on what device, the product it should feel like, and the component
   library: the project's own, or, with none, ask whether to use Base UI or shadcn/ui. Ask only
   what would change the whole design and has no sound default, three questions at most; what
   this playbook answers is decided, not asked. When you can't ask, write your assumptions and
   build on them; with no library chosen, use shadcn/ui and say so.
3. Then state the design you'll build to, each part with where it comes from (the brief, a line of
   this playbook, or your own choice): the system, and the look that fits the brief, pasted whole;
   with none that fits, the accent, each surface layer, and the typeface with its sizes. Define
   each as a variable; every colour and font in the code is one of them.
4. As you reach each moment above, build to its rule.
5. Before writing a component, read its page from the list below: its kinds, states, focus and copy.
6. Before you finish, go back through each moment you reached and check the screen against its
   line, and the code against the design you stated. Fill each pane past the window's height and
   scroll it with the wheel, down and back up: only that pane moves. Then write out each text
   colour with the surface under it and its contrast ratio, each font size with where it's used,
   and each icon with where it comes from; fix what falls short of the floors and the system.
   Walk the main task and count the steps that don't move it forward (excise, in About Face's
   word, ch. 12): a question the product could answer itself, a choice it could remember from last
   time, a confirmation for something that can be undone, a trip to another screen for what the
   task needs. Remove each one you can. Then check the result against each page's Common mistakes
   and When it doesn't apply.

## Components

${index.filter((e) => e.kind === 'component').map(line).join('\n')}

## Principles

${index.filter((e) => e.kind === 'principle').map(line).join('\n')}
`,
);
console.log(`export-skill: ${index.length} pages → ${OUT}`);
