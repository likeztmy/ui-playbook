# Fixes: components A (review 2 shoulds and nits)

Rows from `components-1.md` (app-shell … popover) and `components-2a.md` (radio … switch). Musts were fixed
earlier and are skipped. Shots in `shots/fix/components-a/`.

## 1. Governing pages read

Components: app-shell, badge, button, card, checkbox, combobox, icon, input, radio, segmented-control,
sheet, slider, switch. Principles: colour-means-one-thing, lightness-first, the-lightest-boundary-that-holds,
every-line-does-a-job. Systems: work-tool, consumer-app.

## 2. Fixed

| finding | what changed | evidence |
| --- | --- | --- |
| C1 badge placeholder (should) | `src/demos/badge.tsx:98` placeholder `Title, state or ID` → `PB-131`, one of its IDs; the empty state already names what else to try | `badge-scene-{1280-light,375-dark}.png` |
| C1 input placeholders (should) | `src/demos/input.tsx:160,195` `Search files` / `Search` → `Brand refresh`, an example query (not the Text row's `Q4 roadmap`, nor the Multiline example) | `input-variants-{1280-light,375-dark}.png` |
| C1 input ⌘ name (nit) | `src/ui/Field.tsx` FieldKey: `<Command role="img" aria-label="Command">` | `kbd svg` → `Command` / `img` |
| C1 input hint + error (nit) | `src/ui/Field.tsx` the hint mounts inside `Field.Validity` only while valid, so its id leaves `aria-describedby` when the error shows | scene Email: before, `aria-describedby` → hint; after `ana@studio` + blur, only “Enter an email address, like ana@studio.com.” |
| C1 app-shell foot (nit) | `src/demos/app-shell/app-shell.module.scss` `.foot`: padding-left `space-4` → `space-3`, gap `space-2` → `space-1`. The 24px avatar is centred on the 16px icon column, the name starts on the labels' line | name x 345 = row labels 345; avatar centre 329 = icon centre 329; `app-shell-{1280,375}-{light,dark}.png` |
| C1 app-shell Share icon (nit) | `src/ui/Button.module.scss` `.sm:not(.icon) svg` 14×14 (icon-only sm keeps 16); `button.mdx` Anatomy gains an Icon row (16; 14 beside an sm label) | Share svg 14×14; on /components/button every icon-only sm svg still 16 |
| C1 button sm label (nit) | `src/pages/components/button.mdx` Anatomy Label row: “body, weight 500; sm 13, as in dense rows” (C42: the build's 13 is the work-tool value for dense rows, so the page changes) | sm computed 13px, md/lg 14px |
| C1 card subtitle (nit) | `src/demos/card.tsx` three `A specimen` → `Geist, 8 styles` (Interface group of `precision.json` has 8 styles) | 3 occurrences |
| C1 card stagger (nit) | `src/demos/demos.module.scss` `.cardTiny`: the meta row shows again with a 12/16 title; `card.tsx` `SHORT` one-word titles so none truncates at 64 wide | 0 of 24 titles truncated at 1280 and 375; frames don't overflow (416 = 416); `card-stagger-1280-light.png`, `card-stagger-375-dark.png` |
| C1 checkbox C31 (should) | `src/demos/checkbox.tsx` live scene is a `<form>` with **Save changes** and a polite `Saved` status that clears on the next change (`checkbox.module.scss` `.form/.actions/.saved`); the target pair is a sign-up form ending in **Create account**, and `Show hidden files` (a view setting that applies at once) became `Email me about updates` | 3 forms on the page |
| C1 combobox chevron name (nit) | `src/ui/Combobox.tsx` trigger `aria-label="Show list"` (was `Show all ${label}`, “Show all time zone”) | trigger found by `[aria-label="Show list"]` |
| C1 combobox scene note (nit) | `src/demos/combobox.tsx` the note is the field's `description`; `src/ui/Combobox.tsx` ties the hint with `aria-describedby` (`${id}-hint`). The two unused `.comboNote` blocks went from `demos.module.scss` | hint 4 below the box; input's `aria-describedby` → “Meetings shown in Lisbon time”; `combobox-live-375-dark.png` |
| C2a sheet case picker (should) | `src/demos/sheet/cases/Cases.tsx` one Base UI `RadioGroup` (`aria-label="Case"`) of `Radio.Root` pills, the Good/Bad groups kept inside; `cases.module.scss` `.groups`, `.pick` inline-flex, `[data-checked]` | 9 radios, 1 Tab stop |
| C2a sheet Route focus (should) | `src/demos/sheet/Walk.tsx` `fromRoute`: when Route reopens a closed sheet, `initialFocus` is the Close button; open on arrival, or opened from a map pin, it stays `false` | after Close → Route, focus on “Close” inside the dialog |
| C2a sheet pin contrast (should) + pin colour (nit) | `src/demos/sheet/sheet.module.scss` `.pin`: `surface-raised` with an `ink` glyph in both themes, no `warning`; picked stays `ink` fill | dark glyph 13.96:1 (`rgb(236,236,239)` on `rgb(30,31,35)`); `sheet-scene-375-dark.png`, `sheet-scene-1280-light.png` |
| C2a sheet body size (should) | `src/ui/Sheet.module.scss` popup body 17/22 (was 14/20); `sheet.mdx` Anatomy gains “Body · 17 / 22, the Consumer app's” (also closes components-2a gap 4) | dialog 17px/22px, steps 17px |
| C2a slider ticks (should) | `src/ui/Slider.module.scss` tick rule adds `.slider:focus-visible` and `[data-pin~='focus']`; `src/demos/slider.tsx` Discrete row “Ticks appear on hover and focus” | discrete ticks opacity 0 at rest, 1 on `:focus-visible` |
| C2a segmented thumb (nit) | `src/ui/SegmentedControl.module.scss` pre-hydration veil 10% → 14%, one value; `segmented-control.mdx` Thumb row names the veil | one value in both rules |
| C2a segmented placement (nit) | `segmented-control.mdx` table: Sits “In the toolbar or inspector of what it changes” (gap 3, matching its own Common mistakes); `src/demos/segmented.tsx` live control on the board's left edge (`leftStack`), as a toolbar row | control left 520 = board left 520, 12 above it; `segmented-live-1280-light.png`, `segmented-live-375-dark.png`, `segmented-table-375-dark.png` |
| C2a slider swatches (nit) | `src/demos/demos.module.scss` `.swatchGrid > span` `accent` → `ink-muted` | swatch `rgb(94,94,103)`; `slider-live-{1280-light,375-dark}.png` |
| C2a switch/radio descriptions (nit) | `src/ui/Switch.tsx`, `src/ui/Radio.tsx`: with a description, the control takes `aria-labelledby` (label text) and `aria-describedby` (description); caller props still override | Settings row: label “Autosave”, description “Changes are saved as you type.”; Snap to grid likewise; radios “2×” / “For Retina screens.”, “Standard” / “3–5 days, free” |
| C1 checkbox unlabeled row (nit) | `src/demos/checkbox.module.scss` `.row`: no own inset, gap 8, line from 24 | boxes 582.4 = other rows' 582.4; names 606.4 = labels 606.4 |

## 3. Left

| finding | reason |
| --- | --- |
| C2a sheet `aria-modal` on covering sheets (nit) | The sheet's area is a demo inside a page, and its dim and `inert` cover only that area. `aria-modal="true"` tells a screen reader the whole page outside the dialog is inert (VoiceOver hides it), so a demo open at full height on arrival (“Modal at every height”, the tall After) would hide the rest of the page. The page's own condition, blocked *and* obscured, holds for the area, not the page. Revisit if Sheet gets a prop for a sheet whose area is the window. |
| C1 icon: code in Compare captions 11.05px (nit) | Fixed by another agent in `src/styles/_reading.scss` (`max(12px, 0.85em)`); measured 12px on /components/icon. |
| C1 badge `taskList` last line (nit) | No longer reproduces: `demos.module.scss` `.taskList li:not(:last-child)` draws the line (19dbbcc). |

## 4. Changes needed in files I don't own

- **C1 icon: scene sidebar labels 14px (nit).** `src/demos/icon/icon.module.scss:21` `.navItem` `font-size: 14px`
  → `13px` (work-tool: 13 in sidebars), and its icons in `src/demos/icon/Nav.tsx` 16 → 14, as the Icon
  page's own Anatomy row “Size in dense rows (13px): 14” says. Owner of the Icon demos. (The App shell
  demo's sidebar is 13px with 16px icons; if the Icon owner keeps 16 beside 13, the Icon Anatomy row is
  the one to change, and I'd follow it there.)
- **Tests** (`tests/interactions.spec.ts`):
  - line 1966 and 1969: the case picker's pills are radios now:
    `cases.getByRole('radio', { name: 'Filters, live' })` and `cases.getByRole('radio', { name: 'Filters, applied' })`.
  - line 606 still passes (the note text is unchanged; it is now the field's hint).
  - The checkbox target pair's second label changed from `Show hidden files` to `Email me about updates`;
    no test names it.
- **Gap 5 of `components-2a.md` (content colours in demos).** The café pins no longer borrow `warning`,
  but the note the gap asks for belongs on colour-means-one-thing (owner of the principle pages): content
  colour in a scene comes from a content palette, never from status or accent tokens.
- **Post (heads-up, no change needed).** Sheet body is now 17/22, so Post's composer in its phone sheet
  inherits 17px in To, Subject and the body (`post-sheet-390-light.png`; Cc/Bcc keep 13). It reads as
  iOS Mail does; the Post owner may want to check it against their own rules.

## 5. Rule departures

- **App shell foot:** the 24px avatar is 4px wider each side than the 16px icon column, so it is centred
  on that column rather than sharing its left edge; the name is on the labels' line. A 16 or 20px avatar
  can't hold 12px initials.
- **Checkbox live scene:** adds a `Saved` status after Save changes, so a submit that doesn't navigate
  still answers; it clears on the next change.
- Prettier: `cases.module.scss`, `button.mdx`, `segmented-control.mdx`, `sheet.mdx` weren't prettier-clean
  at HEAD, so I didn't run `--write` on them; my lines follow their style.

`pnpm check`: 0 errors, 0 warnings (run once, after the machine came back to `ok`).
