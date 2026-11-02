# Directions: the looks gallery and Ship, rebuilt

Status: three directions built as lab routes on 2026-11-02 for the owner to pick one. Nothing in
`/systems/looks` has changed yet.

- A, app window: `/lab/looks-a`
- B, specimen sheet: `/lab/looks-b`
- C, compare: `/lab/looks-c`

## Why

The owner called `/systems/looks` ugly, and said the playbook's own rules weren't used. The audit
(`docs/research/audit-2026-11-02/looks.md`, causes 21, 22 and 27) agrees:

- The gallery and Ship scroll as one window. Only `sticky` keeps the rail and the bar in place.
- Ship draws a box for every section, nests cards inside a window that has both a border and a
  shadow, and puts a shadow on panels that never move.
- At 375 the gallery's controls take up the first 560px, so Ship starts below the fold.
- The look list and the page bar are buttons, so they can't be linked to or opened in a new tab.

Decisions C3, C30, C33, C34, C35 and C36 govern the fix.

## What all three share: Ship, rebuilt once

All three directions draw the same rebuilt Ship, from `src/demos/looks-lab/ship/`. It reads the
gallery's data and looks without changing them (`src/demos/looks/ship/data.ts`, `src/looks/*`,
`Panel`). Only Dashboard and Releases are built.

| Audit finding | What Ship does now |
| --- | --- |
| LK#1, #2, #47: the window scrolls | In a window (A, C), Ship is a grid as tall as its parent, with `minmax(0, 1fr)` rows and `min-height: 0` on every layer. The sidebar list and the page each scroll on their own. The page is `tabindex="0"`, has `role="region"` and is named after the place. In a figure (B), Ship is as tall as its content. |
| LK#3: four stat tiles | One row of figures, with 1px lines between them and none around the outside. They become 2×2 below a 640px pane and one column below 280px. |
| LK#5, #14: box in box, border plus shadow | The sidebar sits on `bg` and the work on `surface`, split by one hairline. There is no raised panel and no shadow at rest. The Dashboard's charts and Recent are sections held by their headings and space. Releases has no box at all: the pane is the table's frame. |
| LK#10: focus falls to `<body>` | Clear selection moves focus to the select-all checkbox. Measured: `activeElement` is the `thead` checkbox. |
| LK#11: drawn logo | **Ship** is set in type. |
| LK#12, #13: no tooltips; a typed ⌘K | Clear selection uses `Button label`, so it gets a Tip. The inert bell and the fake search box are gone. |
| LK#15 (C35): amber for "running" | Running checks take `info`. Amber keeps one meaning: In review. |
| LK#16: avatars in the accent | The one face, the account at the sidebar's foot, is grey. |
| LK#18, #39: places are buttons or inert spans | Every place is an `<a href>` with `aria-current="page"`. A plain click swaps in place; a modified click is left to the browser. Platforms are links to Releases filtered by that platform. |
| LK#23 (C33): sidebar hidden at 375 | Below a 720px container the place's name in the header becomes a menu of the places, with counts. This is how Post handles its folders on a phone (`src/demos/post/Shell.tsx`). |
| LK#27: sort order lies | Updated sorts on hours (`model.ts`), so 2h comes before 5h. |
| LK#32 (C42): 52 / 220 / 14 | Header 48, sidebar 240, rows 32, sidebar text `min(text-md, 13px)`, foot 48. |
| LK#35: counts disagree | Sidebar and figure counts come from `releases`: 12 releases, 4 per platform, 8 Live. Recent is sorted newest first. |
| LK#48: hidden donut label | Removed. |

Two smaller fixes inside Ship:

- `--info` and `--info-soft` are set again on Ship's shell. The page's `:root` turns them into its
  own accent before the look's values arrive, so the old gallery drew Linear's "Rolling out" badge
  in the playbook's blue.
- Ship's header, filter bar, table cells and page body all start on one inset (`--ship-inset`:
  24, or 16 on a phone). The title, the filters and the first column share a left edge.

## References

Read on 2026-11-02. How these products behave at phone width is not documented in any of them.

| Source | What it does | What the directions take |
| --- | --- | --- |
| [Radix Themes playground](https://www.radix-ui.com/themes/playground) | One panel holds every theme control (accent, gray, appearance, radius, scaling) plus Copy Theme. The whole page follows it. The page itself scrolls as one long sheet of component sections. | A: every look control in one toolbar, and Copy :root beside it. |
| [tweakcn editor](https://tweakcn.com/editor/theme) | A preset selector in a side panel. The preview switches between whole screens (Cards, Dashboard, …). The tab names are inferred from the page text. | A, C: the look as a picker, separate from how screens are chosen. |
| [shadcn/ui blocks](https://ui.shadcn.com/blocks) | Each block has its own URL (`/view/…`), and categories are links. | All: every view has an address. Places are links. |
| [Storybook, theme switcher](https://storybook.js.org/blog/how-to-add-a-theme-switcher-to-storybook/) | A toolbar dropdown offers light, dark and side-by-side. Side-by-side draws the story twice, each copy in its own theme provider. | C: one screen drawn twice, each copy in its own `Panel`. Later, side-by-side could be one more choice in A's toolbar. |
| [Primer, Button](https://primer.style/product/components/button/) | A heading, a line of text, the live example, then its actions. Dark mode is site-wide; examples have no theme switch of their own. | B: a heading over each figure, and figures that follow the page's theme. |
| [Apple HIG, Sidebars](https://developer.apple.com/design/human-interface-guidelines/sidebars) (read via its JSON) | Figures sit under the section they illustrate, and each comes in light and dark to match the reader's mode. | B: Ship's screens as figures in the reader's theme, each under its own heading. |
| [Vercel, managing deployments](https://vercel.com/docs/deployments/managing-deployments) | A deployments list filtered by dropdowns (branch, date, environment, status), with a menu on each row. | Releases: the filter row above a flush list. |
| [GitHub releases](https://github.com/vercel/next.js/releases) | Stacked release entries with Previous and Next pages. | Releases keeps Previous / Next. |
| [Linear Releases](https://linear.app/docs/releases) | Pipelines and stages, filtered by release, stage or pipeline. | Releases keeps a status filter. |
| Post's phone layout (`src/demos/post/Shell.tsx`) | The playbook's own app: on a phone the folder name opens a menu of folders. | Ship's places menu at 375. |

## Governing pages read whole

These pages come from `skill/ui-playbook/references/`. Every direction was built to them.

- component-app-shell, component-tabs, component-select, component-table, component-card,
  component-badge, component-button, component-menu, component-dialog, component-toast,
  component-sheet, component-segmented-control
- system-work-tool
- principle-the-lightest-boundary-that-holds, principle-space-groups-by-ratio,
  principle-concentric-radius, principle-a-shadow-says-how-high, principle-every-line-does-a-job,
  principle-colour-means-one-thing
- SKILL.md floors

## A · App window

**Idea.** The gallery is a work tool: one 48px toolbar holds the look (a Select), the theme and
Copy :root, and Ship fills the rest of the window as the app it is. Ship's own sidebar is how its
pages are reached, so the gallery has no page bar at all.

**Starts from:** Radix Themes' single control panel, tweakcn's preset picker, Storybook's toolbar
over a canvas, Post's phone folder menu.

**Good at:**

- It fixes every headline problem at the root.
  - The document never scrolls (`scrollHeight − innerHeight = 0`). At 1280 the only scroller is
    Ship's page (Dashboard: 648 of 695px).
  - At 375 Ship's header starts at y=104, where it used to start at about 560.
  - Ship's places are links.
- Ship is shown the way people would use it, so its density, its panes and its phone layout can
  all be judged.
- It has the fewest controls: the gallery adds four, and everything else is Ship.
- The toolbar starts on the site header's edge (both at 24px) and ends on it (12px in from the
  right).

**Bad at:**

- Only one look at a time. Comparing two means remembering one.
- The look is a Select, so it can't be middle-clicked or opened in a new tab. The address still
  changes and can be copied. This follows the Tabs page ("past about six, a sidebar or a Select")
  and decision C8.
- A screen Ship has no place for (Overlays, States, Marketing) needs another way in. Overlays and
  States can live where they really happen (a row's menu, an empty filter). Marketing would become a
  link in the toolbar menu.

**Shots:** `shots/fix/directions/a-{dashboard,releases}-{playbook,linear}-{1280,375}-{light,dark}.png`

| Trigger | Main area | Selection | Focus | URL | Way back | Reference |
| --- | --- | --- | --- | --- | --- | --- |
| Pick a look in the Select | Ship redraws in the look, at the same place and scroll | The Select shows the look | Returns to the Select's trigger | `?look=` replaced (no new history entry) | Pick again | Radix: the page follows the panel |
| Pick a page (Ship sidebar link, or the place menu at 375) | The new place, scrolled to its top; pane named after it | `aria-current` on the link; header names the place | Stays on the link (measured: "Android", `aria-current=page`); the menu returns it to its trigger | `?page=&platform=` pushed | Browser Back: measured, back to `?look=linear` and Dashboard | Linear, GitHub: places are links |
| Toggle theme | Ship redraws light or dark; the site keeps its own theme | Segment raised | Stays on the segment | Unchanged (a preference, not a view) | Toggle back | Radix Appearance |
| Resize to 375 | Ship's sidebar goes; its places fold into the header's name; Values and Copy fold into ⋯ | Place still named in the header | Focus left on a sidebar link that is now hidden would fall to `<body>`. Not tested or fixed; a rare move | Unchanged | Widen again | Post's folder menu |

## B · Specimen sheet

**Idea.** Each look is a page you read. The looks are a list of links beside it. Ship's screens
are figures at true size, each with a caption that names the rules it shows and links to them. The
page scrolls as one document; the figures follow the page's own theme.

**Starts from:** Apple HIG figures (shown under their section, in the reader's mode), Primer's
component pages, Geist labelling colours by their job. The facts line ("Inter … · 13px text ·
36px rows · pill controls") says what sets the look apart.

**Good at:**

- It teaches. Each screen says which rules it obeys and links to them, which is the playbook's own
  argument.
- Every look is a real link (`?look=linear`, pushed to history). Ship's places link to the figure
  that shows them (`#releases`).
- One theme for everything: the site's toggle.
- It would sit naturally on each look's own page (`/systems/look-linear` and the others), under
  its values table. The gallery index could then simply list those pages.

**Bad at:**

- Ship is never used as an app. Its panes don't scroll on their own in a figure, so the window
  floor isn't shown, only the screens.
- Comparing looks means scrolling back to the rail. Switching keeps your scroll position, but the
  picker is far away at 375.
- The page is long (2289px at 1280 for two screens). All seven screens would make it long enough
  to need a contents list.
- The Dashboard figure's heading and Ship's header both say "Dashboard".

**Shots:** `shots/fix/directions/b-sheet-{playbook,linear}-{1280,375}-{light,dark}.png` (full page)

| Trigger | Main area | Selection | Focus | URL | Way back | Reference |
| --- | --- | --- | --- | --- | --- | --- |
| Pick a look (rail link; Select at 375) | Title, facts and both figures redraw; scroll kept | `aria-current` on the rail link | Stays on the link (measured) | `?look=` pushed | Browser Back | Primer, Geist: one page per thing |
| Pick a page (Ship place in a figure) | Scrolls to the figure that shows it; a platform filters the Releases figure | That figure's sidebar lights it | Stays on the link | `#dashboard` / `#releases` replaced | Scroll up; Back for the look | HIG: figure under its section |
| Toggle theme (site header) | Page and figures change together | — | Stays on the toggle | Unchanged | Toggle back | HIG: art follows the reader's mode |
| Resize to 375 | Rail becomes a Select above the title; figures show Ship's phone layout at 343px | Select shows the look | If it was on a rail link, would fall to `<body>` (not tested) | Unchanged | Widen | Primer docs collapse their sidebar |

## C · Compare

**Idea.** Two looks on one Ship. The same screen is drawn twice in the same place, and a divider
you drag shows the left look on one side and the right look on the other. Both Ships move
together: a place picked in either opens in both, and their pages scroll to the same share of
their length.

**Starts from:** Storybook's side-by-side mode (one story drawn twice, each copy in its own
theme), before-and-after sliders, and the WAI-ARIA window splitter (`role="separator"` with a
value, moved by arrows).

**Good at:**

- It answers "how do two looks differ?" at a glance.
  - Linear's 36px rows against the playbook's 40.
  - Inter at 13 against Geist at 14.
  - Indigo against blue.
  - The seam shows the density change directly.
- Drag, Left/Right (5% steps), Home and End all move the divider. Measured: four presses of Left
  took it from 50 to 30.
- The window floor holds as in A: the document doesn't scroll, and each Ship's pane does.

**Bad at:**

- Keyboard and screen readers. Both Ships are in the tab order, including the half of each that is
  hidden, so Tab lands on controls nobody can see. Fixing this needs per-region `inert`, which
  doesn't map onto a clip.
- Rendering. Every change draws two Ships. Switches took 30–50ms here against A's 17–34ms.
- On a phone the 343px stage cramps both halves. Picking the two looks takes the whole toolbar, so
  the theme moves into ⋯.
- The seam can look broken, because rows of different heights don't line up across it. That is
  the point, but it reads as a glitch at first.

**Shots:**

- `shots/fix/directions/c-{dashboard,releases}-playbook-vs-linear-{1280,375}-{light,dark}.png`
- `shots/fix/directions/c-dashboard-linear-vs-playbook-1280-dark.png`

| Trigger | Main area | Selection | Focus | URL | Way back | Reference |
| --- | --- | --- | --- | --- | --- | --- |
| Pick a look (left or right Select) | That side's Ship redraws; divider stays | Each Select shows its look | Returns to that Select | `?left=` / `?right=` replaced | Pick again | Storybook side-by-side |
| Pick a page (a link in either Ship) | Both Ships open the place at their top | `aria-current` in both | Stays on the link | `?page=&platform=` pushed | Browser Back | as A |
| Drag or arrow the divider | The split moves; nothing else changes | `aria-valuenow` | On the divider | Unchanged | Drag back; Home / End | WAI-ARIA window splitter |
| Toggle theme | Both sides change together | Segment raised (in ⋯ at 375) | Stays on the control | Unchanged | Toggle back | Storybook |
| Resize to 375 | Toolbar keeps the two looks and moves the theme into ⋯; both Ships switch to their phone layout | Unchanged | As A | Unchanged | Widen | — |

## Measured (dev server, machine at 90%+ CPU)

- **Frame time.** Each switch was measured as two `requestAnimationFrame`s, so 33ms is the floor of
  the measurement, not a long task.
  - A: 17–34ms per place switch.
  - B: 24–37ms per look switch.
  - C: 30–50ms (two Ships).
- **No sideways scroll** in any of the 33 shots. At 375, Releases first overflowed by 26px: the
  filter row's minimum width came from its content. Fixed with `min-width: 0` on the row; measured
  scrollWidth is now 375.
- **Every shot's geometry was looked at whole**, with no clipped text or overlaps. The pill at the
  bottom of each shot is Astro's dev toolbar.

## Departures, each with its reason

- **The Range control sits alone above the figures**, not on a heading row. It sets the whole page,
  and the page's heading row is Ship's header, which at 375 has room only for the place and New
  release.
- **Pause rollout and Export still do nothing.** They were carried over unchanged. Rebuilding
  Overlays (a toast with Undo for Pause) would give them a job.
- **Releases keeps eight rows a page** inside a pane that could scroll. This copies GitHub's
  Previous / Next. Linear would show all 12.
- **B's rail sticks** on a page that scrolls. This is App shell's own exception: "a sidebar beside
  one document".

## Not built

Ship's Release, Settings, Overlays, States and Marketing pages, and the Cards wall. Each moves
over the same way:

- drop its `s.card` boxes for headings and space;
- move it onto `--ship-inset`;
- in A and C, give it a place in Ship's sidebar or reach it from where it happens.

## For the coordinator

`pnpm check`'s SVG lint flags `src/demos/looks-lab/ship/Line.tsx`. It is a copy of the allowed
`src/demos/looks/ship/Line.tsx` without its card, and importing the original would bring back the
box-in-box that LK#5 asks to remove. Add this entry to `DIAGRAMS` in `scripts/lint-svg.mjs`:

```js
  // The line chart in the looks gallery directions: data, not an icon.
  'src/demos/looks-lab/ship/Line.tsx',
```

## Recommendation

**A, with B's figures moved onto each look's own page, and C kept for later as one more choice in
A's toolbar.**

- **A fixes the root causes the owner and the audit named, rather than patching them.**
  - The gallery is a bounded window.
  - Ship is a real app with scrolling panes.
  - Places are links.
  - At 375 Ship starts at y=104.
- **A copies how shipping theme tools already work.** Radix, tweakcn and Storybook each keep the
  look's controls in one panel and the product in all the rest. It also stays in the work-tool
  system that the gallery itself belongs to.
- **B is the better teacher but the weaker gallery.** Its captioned figures belong on
  `/systems/look-*`, where a reader has already chosen a look and wants to see why it works.
- **C answers a real question,** but it costs keyboard access and doubles the rendering.
  Storybook's own answer, side-by-side as one more choice in the same theme control, is the way to
  add it to A once its tab-order problem has a fix.
