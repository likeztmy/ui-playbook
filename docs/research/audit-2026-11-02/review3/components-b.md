# Review 3: components b (table, tabs, toast, toolbar, tooltip) and principles 2

Scope: commit f52c877, the changes described in `review2/fixes-components-b.md`, plus the shared files
`src/demos/frame/{Compare,Tweak,Frame}.tsx`, `src/styles/_reading.scss`, `src/components/Hero.astro` (and the
home-page search it touches). Reviewer did not build them. Shots in `shots/review3/components-b/`
(`<demo>-<width>-<theme>.png`). Measurements come from `pnpm shoot --eval`; the eval runs after the shot, so
states that need two steps (focus rings, post-click toasts) are measured, not shot.


## 1. Findings

0 must · 3 should · 5 nit. Every change in `fixes-components-b.md` does what it says on its route, at 1280 and 375,
light and dark; the rows below are what the changes left or broke around them.

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | `/` home, Table card preview (`src/demos/table.tsx:346-354`, `.tablePreview` `src/demos/demos.module.scss:2242`) | owner's rule: inspect rendered geometry for clipped text; Table: “Truncating the name column” | table 323 wide in a 311 (375) / 315 (1280) wrap: at 375 the frame's right edge is gone and “Size”, “18.4 MB” are cut mid-glyph (`home-table-card-375-dark.png`); at 1280 the Size cell loses 8 of its 12px right padding, digits 4px from the edge (`home-table-card-1280-light.png`). The preview renders without `client:`, so the Wide variant's fade (`data-more`) never appears either | Make the preview fit instead of scroll: show Name and Size only (the page's first rule, numbers on the right), or Name, Status, Size with the badge column dropped below the card's width. Then drop `.tablePreview` |
| should | `/components/table`, Prefer “Name column pinned” note (`src/demos/table.tsx:341`) | Every line does a job: a line names a state that is true; the demo shows the verdict | at rest the pinned edge has `box-shadow: none` (by design now) but the note says “with a line at its edge, while the rest scroll under it”; a reader at 1280 sees no line (`table-pinned-1280-light.png`) | Say when the line comes: “The name column stays pinned; a line appears at its edge once the rest scroll under it.” The skill export's Prefer line follows at the next build |
| should | `/principles/the-faster-way`, keycaps while Option is held (`src/demos/demos.module.scss:2132-2148` `.fkKey`) | `.fkKey`'s own contract “clear of the glyph, inside the bar”; owner's rule: check overlaps | keycap 536.5–552.5; icon glyph bottoms 535.5 (Archive, Star) and 536.2 (Mail open): 0.3–1px clear, so the ink keycap butts against the icon; the svg box (to 537.5) is overlapped by 1px. Bar line at 553, keycap 0.5 above it. The 16px line leaves no slack between glyph and line (was 2–3px at 14) | Keep the 12px floor, take `line-height: 14px` and `bottom: -6px`: keycap 537.5–551.5, 1.3 clear of the glyph and 1.5 of the line |
| nit | `/components/toolbar`, Share popover (`src/demos/canvas-share/Share.tsx:32`) | Button: “One filled button per view”; Popover: trigger stays pressed | with the popover open, Share (pressed, `accent-hover`) and Copy link are two accent fills side by side (`toolbar-share-375-dark.png`) | Copy link as a secondary button: it is the popover's only action, and the pressed Share already carries the accent. Or leave it, if the owner reads the popover as its own view |
| nit | `/components/tooltip`, View controls (`src/demos/tooltip.tsx:67-78`) | Button: “Disabled with no reason”; Toolbar canvas disables Undo/Redo when there's nothing to undo | after the seeded step is used, Undo (and Redo after any new zoom) does nothing and stays enabled; the canvas on `/components/toolbar` disables the same buttons | Make it consistent with the canvas (disable at the end of the history), which lands on owner question (c) about tips on disabled buttons; or keep enabled and leave as is until (c) is settled |
| nit | `/components/toast` Live and Kinds, switch label (`src/demos/toast.tsx:71`) | Switch Copy: “a noun phrase or a verb phrase that’s true when on … Never the state” | label “Offline” reads as a state (as “Enabled” would) | “Work offline”, Firefox's own wording for the setting |
| nit | `/principles/where-the-eye-goes`, Avoid “Promo-style band on top” (`src/demos/eye.tsx:177-188`) | owner's rule: every action has a way back | Dismiss now works (24 × 24 at 1280 and 375, focus to the billing panel, not `<body>`), but the Avoid specimen is then gone until reload, and its caption describes nothing | Bring the band back when the comparison is switched or after a few seconds, or leave it: dismissing is the real behaviour. Owner's call |
| nit | `/` hero search (`src/components/Hero.astro:19`, `src/i18n.ts:37,63`) | C17: placeholder is an example | “Dialog, focus, spacing” is an example and passes; the zh page shows the English example (left for the owner to translate, as the code says) | none now; translate with the rest of `zh` |

## 2. Ledger

Only rules a change in f52c877 touches are marked; the rest of each page was reviewed in round 2 and is n/a here
(untouched).

**component-table**: Numbers right, tabular (Prefer): pass on the home preview (Size right-aligned). Lines not
stripes: pass (cross-reference line added, C2, both pages name each other). One arrow: n/a. Secondary muted: n/a.
Name stays pinned (Prefer): pass in behaviour (line only after scroll, measured all four combos and on
`/components/badge` 375), **fail** in the note (should 2). Anatomy Header 32: pass (button 31 in 32, ring inside).
Focus ring = `--focus-ring`: pass. Common mistakes, truncating the name column: **fail** on the home preview (should
1). Copy, empty cells en dash: pass (`toast.mdx:34`, three principle tables: 0 empty `td` on every route and width).

**component-tabs**: Focus ring `--focus-ring`, unclipped in the scrolling list: pass at 1280/375 both themes, and on
`/principles/colour-means-one-thing` (ring edge = list left, 364 / 44). Weight stays put, ink bar, one row, counts:
n/a (untouched; the 11px count stays with the owner, C42).

**component-toast**: Undo instead of asking: pass (rows level, 32 below the stage top on both sides). Colour on
the icon only: pass. Three at most: n/a. Kinds: pass (one of each still raised; warning by the switch). Anatomy
width “320 to 440; never wider than the screen”: pass (canvas toast 320 at 1280, 263 at 375; `.still`
`max-width: min(440px,100%)`). Place: bottom centre of its frame, 16 above the Drawing toolbar: pass. Common
mistakes, toasts as the only feedback: pass (the switch shows the state). Copy: “Link copied”, “Couldn’t copy the
link: the browser blocked it”: pass.

**component-toolbar**: Actions, a primary only for the main job: pass (Share). Every tool named by a tip: n/a
(untouched). Anatomy 40 / inset 4: n/a. Disabled Undo/Redo with tips: left to the owner (c).

**component-popover**: Focus goes in and comes back: pass (Copy link, then Share). Trigger stays filled: pass
(`data-popup-open`, `accent-hover`). Gap 6: pass (6.0). Width ≤ 320: pass (202.5). Radius 10, inset 12: pass.
Title 13/600, description 13 muted: pass. Actions right-aligned, small: pass. Copy: title matches trigger
(“Share “Wireframes””), description one sentence of consequence, action a verb: pass. A popover for a decision: n/a.

**component-tooltip**: Copy, name = `aria-label`: pass (Cart, 0 items; Dismiss). Wait once / inverse: n/a. A
disabled button shows none: n/a here (owner (c)). Anything clickable inside: pass.

**component-switch**: Takes effect at once: pass. Label names the setting: **nit** (“Offline”). 32 × 20 track,
label-to-switch 12: pass. No confirmation after flipping: pass.

**component-button**: One filled button per view: **nit** (Share popover). Icon-only has a tip with the same
words: pass (Dismiss, Cart). Disabled with no reason: **nit** (view controls never disable; opposite of the canvas).
sm 24: pass (Dismiss 24 × 24).

**principle-lightness-first**: Decorative lines row: pass (`– · –`). Status specimen and Tint stage light on a dark
page, caption in the page's theme (C15): pass (`data-theme="light"`, `rgb(255,255,255)`; caption `rgb(180,180,189)`).

**principle-reading-text**: lines between rows only: pass (list top 0, first row 0/0, second 1px top). Table
cells filled: pass.

**principle-space-groups-by-ratio**: cross-reference to Table (C2): pass.

**principle-who-before-what**: ticked row takes `accent-soft`: pass (`#e8f2ff` light, `#0b2747` dark, both sides).
Faces table `same` cells: pass. Phone: no checkboxes, nothing to tick: n/a.

**principle-nothing-shifts**: Bold nav one row: pass (265/272 in a 352 stage at 1280; 262 in a 295 inner width at
375, Avoid and Prefer). Code chips in notes ≥ 12px: pass (12px in 13px notes, 13.6 in prose; also on
`/components/icon` and `/principles/concentric-radius`).

**principle-the-faster-way**: keys at the 12px floor: pass. Keycap clear of glyph and line: **fail** (should 3).

**principle-where-the-eye-goes**: cart tip = `aria-label`: pass. Band Dismiss a real button, focus not on `<body>`:
pass at 1280 and 375 (the squint copy's 19 × 19 Dismiss is inside `inert`, correctly unreachable).

**principle-never-too-busy-to-listen**: 0.1× offered on the one-at-a-time view: pass (375: both motion
comparisons show it; also `/components/popover` 375).

**system-work-tool**: 12px floor: pass (fkKey 12, zoom readout 12, code chips ≥ 12). Contrast 4.5:1: readout
`ink-muted`, placeholder `ink-muted`: pass.

**Owner's rules (CLAUDE.md)**: focus follows the action: pass (Share → Copy link → Share; Dismiss → billing
panel). One left edge / trailing column: pass (toast row ends on the Delete column at 375). Rendered geometry:
**fail** twice (should 1, should 3).

## 3. Gaps in the playbook

- Tooltip “A disabled button shows none” vs Button “Disabled with no reason” vs a history that runs out: no page
  says whether Undo at the end of its history disables or stays live. The canvas and the tooltip demo now answer
  differently (owner question (c) from round 2).
- Home card previews are pictures (C27) but nothing says a picture must fit its stage; a scrolling, cut-off table
  in an `inert` stage is allowed by the letter of C27.
- Button's one-fill rule doesn't say whether a popover counts as its own view next to a filled trigger.

## 4. Notes from the route

### /components/table

- Pin line at rest (`src/ui/Table.tsx:81-88`, `Table.module.scss:126,149`): all 13 sticky tables `box-shadow: none`
  at rest in all four combos. After `scrollLeft = 60`: `rgb(228,228,232) 1px 0 0` light, `rgb(38,39,44) 1px 0 0`
  dark, on the first cell, or on the 2nd cell for the two tables with a checkbox column (375). Back to 0: `none`
  again. Pass.
- Sort focus ring (`Table.module.scss:177-191`): `::before` inset 4px 0, `box-shadow` = `--focus-ring` (light
  `#fff 2px, rgb(0,113,227) 4px`; dark `rgb(14,15,17) 2px, rgb(10,132,255) 4px`), `:focus-visible` true. Header
  384–416, button 384–415, so the ring spans 384–415, inside the scrolling wrap (top 383 + 1px border). Not clipped
  at 1280 or 375. Pass.
- Prefer “Name column pinned” at rest now shows no line (`table-pinned-*.png`), but its note still promises one:
  `src/demos/table.tsx:341` “with a line at its edge, while the rest scroll under it”. See findings.

### /components/tabs

- Focus ring (`Tabs.module.scss:64-74`): `::before` inset `6px -4px`, ring = `--focus-ring` in both themes. First tab
  at 400 (1280) / 40 (375); the ring's outer edge = tab left − 4 − 4 = list left (392 / 32), the list's padding
  edge, so it isn't clipped by `overflow-x: auto`. Pass.

### /components/toast

- Kinds (`src/demos/toast.tsx:62-80`): Copy link, Export, then label “Offline” and a 32 × 20 switch; buttons 32 tall,
  centres level (316). Switching on: `aria-checked="true"`, one “Sync paused while offline” toast. Off: no toast.
- Undo comparison: the first row sits 32 below the stage top and 26 in on both sides at 1280 (stage 260 each). Pass.

### /components/toolbar

- Share (`src/demos/canvas-share/Share.tsx`): popover 6 above Share, right edges 761.66 / 761.53 (1280) and
  309.16 / 309.03 (375); 202.5 wide, radius 10, inset 12; title 13/600, description 13/400 muted, Copy link 13/500;
  focus to Copy link; Share keeps `data-popup-open` (`accent-hover`). After Copy link: focus back on Share, toast
  “Link copied” rises 16 above the Drawing toolbar (the toast's `contained` viewport sits `space-4` above the
  `.sketchToasts` line). Pass.
- With the popover open the view has two accent fills side by side, Share (pressed) and Copy link
  (`toolbar-share-375-dark.png`). See findings.

### /components/tooltip

- View controls (`src/demos/tooltip.tsx:55-90`): driven by clicks in all four combos: start 100%; Zoom in 125, Zoom in
  150, Undo 125, Redo 150, Zoom out 125, Fit to screen 100, then Undo ×4 125 / 150 / 125 / 100, Redo ×4 back the same
  way. History is consistent. Readout 12px `ink-muted` (light `rgb(94,94,103)`, dark `rgb(180,180,189)`), 40 wide,
  `aria-live="polite"`, centred with the buttons (`.toolRow` `align-items: center`). The default-open Redo tip still
  shows on arrival (`tooltip-live-*.png`). Pass.
- Once the seeded step is used up, Undo (or Redo after a new zoom) does nothing and isn't disabled. See findings.

### Principles and shared files

- lightness-first, reading-text, who-before-what, nothing-shifts, the-faster-way, where-the-eye-goes,
  never-too-busy-to-listen, space-groups-by-ratio: shot at 1280/375 light/dark (`lf-*`, `rt-*`, `wbw-*`, `ns-*`,
  `fw-*`, `eye-*`, `ntb-*`, `sgr-*`); no horizontal overflow on any (scrollWidth = innerWidth).
- `frame/Compare.tsx`: 0.1× now on the toggled frame (never-too-busy 375; popover 375). `frame/Tweak.tsx`
  `defaultTheme`: lightness Tint light on dark; concentric-radius 375 dark stages follow the page. `Frame.tsx` only
  exports `Theme`.
- `_reading.scss` code chip `max(12px, 0.85em)`: 12px in 13/14px notes, 13.6 in 16px prose.
- Home: search `aria-label` “Search the playbook”, placeholder “Dialog, focus, spacing” in `ink-muted`; results
  announced (“Components 2”, “Nothing matches “zzzq”.”).
- Machine read `busy` for long stretches; shots were gated on `ok` from the third batch on (the first table and
  toast-kinds batches ran while it read busy).
