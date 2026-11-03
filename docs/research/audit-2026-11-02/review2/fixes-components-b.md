# Fixes: components 2b and principles 2 (should and nit rows)

Rows from `components-2b.md` (table, tabs, toast, toolbar, tooltip) and `principles-2.md`. The `must` rows were
fixed earlier (ae39e80, 5484f44, 7da7959) and are skipped. Shots in `shots/fix/components-b/`.

## 1. Governing pages read

Read whole in `skill/ui-playbook/references/`: component-table, component-tabs, component-toast,
component-toolbar, component-tooltip, component-button, component-popover. Read for the rows they govern:
component-switch (Offline switch), component-checkbox (faces), principle-the-lightest-boundary-that-holds,
principle-reading-text, principle-space-groups-by-ratio, principle-where-the-eye-goes, principle-who-before-what,
principle-nothing-shifts, principle-the-faster-way, principle-lightness-first, system-work-tool (12px floor),
and `decisions.md` C2, C15, C20, C41.

## 2. Fixed

State shots and measurements come from a Playwright script driving the dev server with real clicks, hovers and
keys (same harness as `pnpm shoot`); routes shot at 1280 light and 375 dark.

### components-2b

| finding | what changed | evidence |
| --- | --- | --- |
| should · table: pinned Name line when nothing scrolls | `src/ui/Table.tsx` `edge()` sets `scrolled` from `scrollLeft > 0`, wrap carries `data-scrolled`; `src/ui/Table.module.scss` `.stickyFirst`: the 1px `line` shadow only under `[data-scrolled] >` (plain and with checkbox) | 1280 light: all 12 tables `box-shadow: none` at rest; Wide/Prefer after `scrollLeft = 60`: `rgb(228,228,232) 1px 0 0`; Avoid “Names scroll away” stays `none`. 375 dark live: rest `none`, scrolled `rgb(38,39,44) 1px 0 0`. `table-live-scrolled-1280-light.png` (no line), `table-live-scrolled-375-dark.png` (line once Status slides under) |
| nit · table: sort header focus ring | `src/ui/Table.module.scss` `.sort`: `position: relative`; ring on a `::before` inset 4px top and bottom, `box-shadow: var(--focus-ring)` (was `inset 0 0 0 2px var(--accent)`) | focused Name: `::before` shadow = `--focus-ring` (light `#fff 2px, rgb(0,113,227) 4px`; dark `rgb(14,15,17) 2px, rgb(10,132,255) 4px`); button 31 in a 32 header, ring reaches the header's top and bottom, not clipped. `table-sort-focus-1280-light.png`, `-375-dark.png` |
| nit · tabs: focus ring | `src/ui/Tabs.module.scss` `.tab::before`: `inset: 6px -4px`, `box-shadow: var(--focus-ring)` (4 out + 4 ring = the list's 8px padding) | ring = `--focus-ring` both themes; first tab at 375 dark not clipped on the left. `tabs-focus-1280-light.png`, `tabs-focus-first-375-dark.png` |
| should · toast: Go offline | `src/demos/toast.tsx` `Triggers`: the button became a Switch “Offline” (a state that stays is a Switch, Button page); turning it on raises “Sync paused while offline”, which adds the consequence the switch doesn't show. Kinds frame label “A button for each kind” → “One of each kind” | after a click: `aria-checked="true"`, one warning toast. `toast-offline-1280-light.png`, `toast-offline-375-dark.png` |
| should · toolbar: canvas Share does nothing | new `src/demos/canvas-share/Share.tsx`: Share opens a Popover (side top, align end) titled “Share “Wireframes””, “Anyone with the link can view.”, primary Copy link; Copy link writes the link, closes, and toasts “Link copied” (or a failure toast if the browser blocks the clipboard). `src/demos/canvas.tsx`: the scene sits in a contained `ToastProvider`; toasts rise from a zero-height `data-overlay` line above the Drawing toolbar (`.sketchToasts` in `demos.module.scss`) | popover 6 above Share, right edges equal (761.5 / 761.7 at 1280), focus to Copy link, trigger `data-popup-open`; after Copy link: clipboard reads the link, toast 16 above the toolbar (648 → 664), focus back on Share. `toolbar-share-open-1280-light.png`, `toolbar-share-copied-1280-light.png`, `-375-dark.png` |
| nit · toast: Kinds en dash | `src/pages/components/toast.mdx:34` `—` → `–` | source |
| nit · toast: Undo comparison rows not level | `src/demos/toast.tsx` `ToastUndo`: the Avoid side sits in the same `.toastStage` as the Prefer side | first row 64 below each figure's top on both sides at 1280 (was ≈40 apart) |
| nit · tooltip: live view buttons do nothing | `src/demos/tooltip.tsx`: `Row` takes `run` and a trailing child; new `ViewControls` keeps a zoom with a history (one step each way seeded, so Undo and Redo run from the start) and shows it in a `sketchZoom` readout (`aria-live="polite"`); `.toolRow` gets `align-items: center` | Zoom in → 125%, Zoom in → 150%, Undo → 125%, Redo → 150%, Zoom out → 125%, Fit to screen → 100%, Undo → 125%. `tooltip-live-1280-light.png`, `-375-dark.png` |

### principles-2

| finding | what changed | evidence |
| --- | --- | --- |
| should #5 · reading-text leading list: line above the first row and after the last | `src/demos/reading/reading.module.scss`: `.rows` loses its `border-top`; `.row` border-bottom → `& + & { border-top }` | rows' computed borders: first `0/0`, second top `1px`, list top `0`. `reading-leading-375-dark.png`, `-1280-light.png` |
| should #6 · empty prose-table cells | `lightness-first.mdx:28` Decorative lines → `– · –`; `reading-text.mdx:57` Numbers / Reading text → `–`; `reading-text.mdx:64` `body` measure → “the row's width” (the Interface text row above says the same); `who-before-what.mdx:44-47` blanks meaning “as Comfortable” → `same` | empty `main table td`: 0 on all three routes, both widths |
| should #8 · the-faster-way keycaps 10px | `src/demos/demos.module.scss` `.fkKey`: 12px / 16px (was 10 / 14); still absolutely placed | E, S, I: 12px, 16 tall, ending 2px above the bar's foot (its 1px line clear), opacity 1 while Option is held. `faster-held-1280-light.png` |
| should #9 · nothing-shifts project nav wraps | `src/demos/shift.tsx` `NAV`: four links (Pull requests dropped); `.boldNav` loses `flex-wrap` and its row gap | 1280: navs 262 / 272 wide in a 304 stage, one row; 375: 272 in 295, one row; hovering Overview, Releases, Settings on the Avoid side keeps one row and no overflow. Shift counter still reads per side. `shift-bold-375-dark.png` |
| should #10 · where-the-eye-goes cart has no tooltip | `src/demos/eye.tsx` `Shop`: the cart uses Button's `label`, so aria-label and Tip are one string (`Cart, 0 items`); a plain “Cart” tip would differ from the aria-label, which the Tooltip Copy rule forbids | hover: tip “Cart, 0 items” = `aria-label`. `eye-cart-tip-1280-light.png` |
| should #11 · who-before-what ticked row keeps the surface | `src/demos/faces/FaceRow.tsx` `selected` prop → `data-selected`; `faces.module.scss` `.row[data-selected] { background: accent-soft }`; `Column.tsx` passes it on both sides | ticked Atlas Travel: `rgb(232,242,255)` = `--accent-soft`. `faces-selected-1280-light.png`. (At 375 the faces table says phones have no checkbox, so nothing to tick.) |
| should #12 · stripes vs Table not cross-referenced (C2) | `space-groups-by-ratio.mdx` after RatioRegion: one line naming Table; `components/table.mdx` after TableLines: one line naming Space groups by ratio, so each page names the other | source |
| nit #14 · Avoid promo band's X isn't a button | `src/demos/eye.tsx` `Billing`: ghost icon `Button` with `label="Dismiss"` (aria-label + Tip); click hides the band and moves focus to the billing panel (`tabIndex={-1}`, `focus({ preventScroll: true })`, `.billing:focus-visible` takes `--focus-ring`); `mistakes.module.scss` `.promoBand > button[aria-label='Dismiss']` keeps the band's white | 24 × 24, colour `rgb(255,255,255)` on the band; tip “Dismiss” on hover; after click the band is gone and `activeElement` is the billing `DIV`, not `<body>`. `eye-band-375-dark.png` |
| nit #15 · lightness-first status specimen stays light on a dark stage (C15) | `src/demos/lightness/Status.tsx`: `Frame defaultTheme="light"` | 375 dark: stage `data-theme="light"`, `rgb(255,255,255)`; caption keeps the page's dark. `lightness-status-375-dark.png`. The Tint specimen needs a shell change (section 4) |

`pnpm check`: 0 errors, 0 warnings (2 hints in `src/demos/checkbox.tsx`, not mine); `pnpm -s lint` exit 0. The
machine read `busy` through most of this run; each batch waited up to several minutes for `ok`, and the last
shots and the check ran after waiting while it still read `busy`.

## 3. Left

Waiting for the owner, as the prompt lists:

| finding | reason |
| --- | --- |
| should · tabs count chips at 11px | (b) Tabs count 11 vs the 12px floor, C42 / Gap 2 |
| should · toolbar: disabled Undo/Redo still show a tip | (c) tooltips on disabled icon buttons, Gap 3 |
| nit · table: Move… and Delete disabled with nothing selected | (a) bulk actions disabled vs “a disabled button says why”, Gap 1 |
| should #4 · never-too-busy-to-listen hand note (Rough.js arrow and circle, accent ink) | (f) hand-drawn notes on principle pages; also `src/components/note/` isn't mine. Its second half, the note's accent ink, rides on the same owner decision (Gap 3 of principles-2 asks whether accent is allowed for annotation) |

Gaps both reports mark for the owner (components-2b Gaps 1–7, principles-2 Gaps 1–7) are left as written.

None of my rows had stopped reproducing before I fixed them; the `must` rows that ae39e80 / 5484f44 / 7da7959
fixed were skipped as the prompt says.

## 4. Changes needed in files I don't own

| finding | file | change |
| --- | --- | --- |
| should #3 · never-too-busy: the 0.1× switch disappears at 375 | `src/demos/frame/Compare.tsx:45` (toggle branch) | pass `{...slowing}` to the toggled `Frame` beside `{...measuring}` |
| should #7 · nothing-shifts: code chips in demo notes at 11.05px | `src/styles/_reading.scss:188` | `font-size: max(12px, 0.85em);` in the prose `code` chip rule. The root is this shared rule, so I didn't patch `shift.tsx` |
| nit #13 · ratio “Gaps” pills overlap the time column | `src/demos/shell.module.scss` `.gapLabel` (used by `Measured.tsx`) | at 375 light the pills sit 1–2px from the times' glyphs and overlap only their line boxes (`ratio-scale-375-before.png`). Options: centre the pill in the band (`left: 50%; right: auto; translate: -50% -50%`), or let `Measured` take an inset for the pill so a list with a trailing column can keep it clear |
| nit #15 · lightness-first Tint specimen stays light on a dark stage | `src/demos/frame/Tweak.tsx` | add `defaultTheme?: 'light' \| 'dark'` to `TweakProps` and pass it to its `Frame`; then `src/demos/lightness/Tint.tsx` (mine) passes `defaultTheme="light"` — I can make that one-line change once Tweak takes it |

Tests: nothing in `tests/` relies on text or structure I changed (checked the Cart name, toolbar canvas Undo, table
pin, toast Undo/Dismiss focus, tooltip walk tests). Not yet tested, and worth a test each in
`tests/interactions.spec.ts` (CODING_STANDARDS “claims are tested”):

- table: the pinned column's line appears only after a sideways scroll (`box-shadow` `none` at rest, the `line` 1px after `scrollLeft = 60`);
- toolbar canvas: Share opens “Share “Wireframes””, Copy link closes it, toasts “Link copied”, focus back on Share (grant `clipboard-write`);
- toast: turning on Offline shows “Sync paused while offline” and the switch stays on;
- tooltip: Zoom in on “View controls” reads 125%, Undo reads 100%;
- where-the-eye-goes: Dismiss on the band removes it and focus is not `<body>`.

## 5. Rule departures

- **Tooltip view controls: Undo and Redo step through zoom changes.** Figma and most canvas tools leave zoom out of
  the undo history. The page's scene has no content to edit, and the nit asks that each control run something,
  so the history is the view's own. Seeded one step each way so neither starts as a dead button (which would also
  land on owner question (c)).
- **Toast Kinds: the warning kind is now a Switch, not a button.** The frame label changed from “A button for each
  kind” to “One of each kind”. The Button page says a state that stays is a Switch, and the toast mistake asks
  that the page show the change; the toast keeps the part the switch can't show (sync paused). Turning Offline
  off raises no toast: that change is plain on screen.
- **Bold nav: four links instead of five.** The report offered `nowrap` + scroll or a dropped link; a scrolling
  row would hide the bold growth it demonstrates behind the edge, so Pull requests went.
