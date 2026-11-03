# Review 3: components b (table, tabs, toast, toolbar, tooltip) and principles 2

Scope: commit f52c877, the changes described in `review2/fixes-components-b.md`, plus the shared files
`src/demos/frame/{Compare,Tweak,Frame}.tsx`, `src/styles/_reading.scss`, `src/components/Hero.astro` (and the
home-page search it touches). Reviewer did not build them. Shots in `shots/review3/components-b/`
(`<demo>-<width>-<theme>.png`). Measurements come from `pnpm shoot --eval`; the eval runs after the shot, so
states that need two steps (focus rings, post-click toasts) are measured, not shot.

_In progress: written as the review goes._

## Running notes

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
