# Rule review 2: components, part 1

Routes: `/components/app-shell`, `badge`, `button`, `card`, `checkbox`, `combobox`, `dialog`, `icon`,
`input`, `menu`, `popover`. Method: `.claude/agents/ui-rule-review.md`. Reviewed 2026-11-02 by an agent
that did not build these screens. Decisions in `../decisions.md` are binding: a screen that follows one is
not a finding.

Shots: `shots/review2/components-1/<route>-<1280|375>-<light|dark>.png` (full page, scale 1), plus the
interaction and close-up shots named in the evidence column. Measurements were taken with
`pnpm shoot --eval` on the dev server; a generic probe (text contrast against the composited background,
text under 12px, Lucide sizes and strokes, unnamed buttons, horizontal overflow) ran on every route at
1280 light and 375 dark, and its numbers are quoted as "probe".

Status: written route by route; the summary table is filled in at the end.

## Findings

(Collected at the end from the per-route sections below.)

## Per route

### /components/app-shell

Shots looked at whole: all four. Probe at 1280 light and 375 dark: no text under 4.5:1 (the Shiki code
block included), no text under 12px, every Lucide icon at stroke 2 (16px ×83, 14px ×2), no unnamed
button, no horizontal overflow.

Measured in the first demo (1280 light): window 672 × 320, radius 10; sidebar 240 wide; head 48; rows 32;
foot 48 with a `line` above it; title bar 48 with a `line` under it. Content pane `tabindex=0`,
`role=region`, `aria-label="Release process"`, scrolls 928 in 270. Sidebar list scrolls 792 in 182, foot
outside it. Code block: `tabindex=0`, `role=region`, `aria-label="CSS code"`, inset 2px accent ring on
`:focus-visible` (`_reading.scss:177`). Sidebar labels at x 345 (Inbox and every page), heads at 321;
the account name at 353.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | first demo, sidebar foot: `Mira Chen` (`src/demos/app-shell/app-shell.module.scss:141-163`) | owner: “Labels start on one vertical line”; “Icons sit in one column” | name text at x 353; every row label above at 345 (24px avatar vs 16px icons, both 8 gap) | Avatar 16px (or 20 with gap 4) so the name starts at 345, or accept and say why |
| nit | first demo, Share button (`src/demos/app-shell/App.tsx` `Share size={14}`) | component-icon Anatomy: “Size in dense rows (13px): 14” | sm button label 13px, icon renders 16 × 16 (the Button CSS overrides the 14) | Let sm buttons take a 14px icon, or drop the `size={14}` that has no effect |

Ledger, `component-app-shell` (`.mdx` read; it adds the narrow-window mistake and the scroller sentence):

| rule | mark | why |
| --- | --- | --- |
| Avoid “The window scrolls” / Prefer “Each pane scrolls” | pass at 1280; see Gaps for 375 | 1280: Avoid sidebar runs past the frame with the doc, Prefer keeps foot. 375: both frames are the one-pane layout, so the pair shows no difference |
| Every layer gives up min-height (demo) | pass | toggle demo; `.layout` `min-height: 0`, rows `minmax(0,1fr)` |
| Mistake: `overflow: auto` with nothing above told | pass | as above |
| Mistake: `100vh` on phones | n/a | demo windows are fixed-height figures |
| Mistake: sticky sidebar on a page that scrolls | pass | panes scroll; nothing sticky |
| Mistake: content jumps when it gets long | pass | `.body` `scrollbar-gutter: stable`; sidebar list always overflows |
| Mistake: account in a sidebar that scrolls | pass | foot outside `[data-pane=sidebar]` |
| Mistake: narrow window drops the sidebar | pass | < 480 container: PanelLeft “Pages” button opens it over a scrim, focus to current page, Esc and scrim close, focus back (`App.tsx:36-47`); C33 |
| Anatomy: Window `100dvh` | n/a | demo; the page itself is a reading page and scrolls as one |
| Anatomy: Title bar 48 | pass | 48 |
| Anatomy: Sidebar 240, `surface-sunken` | pass | 240 |
| Anatomy: Sidebar rows 32 | pass | 32 |
| Anatomy: Sidebar foot 48 | pass | 48 |
| Anatomy: Panes `overflow-y: auto` | pass | both panes |
| Anatomy: hairlines on sidebar edge and above foot | pass | `border-right` and foot `border-top`, `line` |
| States: pane is a Tab stop, named, ring inside | pass | `tabindex=0`, region, label; inset ring |
| States: a code block too wide is a named Tab stop, inset ring, 4.5:1 tokens | pass | `CSS code`; probe found no token under 4.5:1 in either theme (C10) |
| Copy: name each pane by what's in it | pass | `Pages`, `Release process` |

Governing references also checked on this route (shared ledger at the end covers the principle rules
line by line): icon, button (Share, Settings), tooltip (Settings has a Tip via `label`), work-tool,
lightest-boundary, space-groups-by-ratio, concentric-radius, lightness-first, every-line-does-a-job.

### /components/badge

Shots looked at whole: all four. Probe at 1280 light, 1280 dark and 375 dark: no text under 4.5:1, none
under 12px, Lucide at stroke 2 only, no unnamed button, no overflow. Measured badge: 20 tall, 8 + 8
padding, 12/16 weight 500, pill, dot 6 × 6, gap 4. Scene table: header 32 on `surface-sunken`, rows 36,
IDs muted, name column pinned; at 375 its wrapper scrolls (321 in 293) and is `tabindex=0`,
`role=region`, `aria-label="Issues"`. The empty filter state is `role="status"` and repeats the query
(C29).

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | “Dot and word”, “Without colour” and “Soft tints” frames (`src/demos/badge.tsx`, `taskList` rows) | component-badge mistake: “A badge in every row, with no header … give it a header” (C12) | each list has a badge on all 5 rows and no header; shots `badge-1280-light.png` | Give the badge column a header (“State”) as the scene's table does, or set these lists as the Table; keep the Avoid frames as they are |
| should | scene filter field, placeholder `Title, state or ID` (`src/demos/badge.tsx:91`) | component-input Copy: “Placeholder: an example, not an instruction” (C17) | `placeholder="Title, state or ID"` lists what to type, not an example | Placeholder an example such as `PB-142`; if the searchable fields need saying, say it in a hint |
| nit | every `taskList` frame on the page (`src/demos/demos.module.scss:472-479`) | lightest-boundary: “Lines only between the repeated rows” | probe: last `li` has `border-bottom: 1px solid` in all 6 lists | `> li:last-child { border-bottom: 0 }` (shared class, so other pages change too) |

Ledger, `component-badge` (`.mdx` read; the mistake now says “in a list or a table”):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Dot only” / Prefer “Dot and word” | pass | Prefer shows word and dot; Avoid dots carry `role=img` + label |
| Avoid “Solid fills” / Prefer “Soft tints” | pass | soft tints in Prefer |
| Avoid “Dot on every badge” / Prefer “Dot only on Online” | pass | |
| Anatomy: Height 20 | pass | 20 |
| Anatomy: Padding 8 each side | pass | 8 / 8 |
| Anatomy: Shape pill | pass | 9999px |
| Anatomy: Text 12/16, 500 | pass | 12/16/500 |
| Anatomy: Status tones on `*-soft` | pass | probe: every tone ≥ 4.5:1 in both themes |
| Anatomy: Neutral `ink-muted` on `fill-control` | pass | Draft, Admin |
| Anatomy: Dot 6, text colour | pass | 6 × 6 |
| Anatomy: Dot to text 4 | pass | gap 4 |
| States: each tone holds in both themes | pass | probe, 1280 dark and 375 dark |
| Mistake: a badge in every row, no header | **fail** | the three Prefer list frames (finding 1); the scene's table passes |
| Mistake: red for “new” | pass | none |
| Mistake: truncated badges | pass | at 375 the scene's State column is cut by its scroller's edge, not truncated |
| Mistake: badges as buttons | pass | none clickable |
| Copy: one or two words, sentence case | pass | |
| Copy: states as adjectives or participles | pass | Failed, In review, Shipped, Scheduled, Draft |
| Table (scene): frame, header, row, divider none after last, secondary muted, pinned name | pass | measured above |
| Input (scene filter): label above, 4 apart, placeholder an example | **fail** on placeholder | finding 2 |

### /components/button

Shots looked at whole: all four, and the States grid at 375 (`button-375-light.png`, it wraps to three
columns cleanly). Probe at 1280 light/dark and 375 dark: the only text under 4.5:1 is the three disabled
`Save` labels in the States grid (2.09:1 light, 1.61:1 dark), which WCAG 1.4.3 exempts as inactive; none
under 12px; Lucide at stroke 2 only; no unnamed button; no overflow.

Measured every distinct button (1280 light): md 32 tall, 14/20 weight 500, padding 12, pill, gap 4, no
border, no shadow; sm 24, 13/20, padding 8; lg 40, padding 16; icon-only 32 × 32 with a Tip (`label`);
pressed cells 31 tall (32 × 0.97); rest transition `background-color 0.12s`, pressed `0s` with
`scale 0.08s`. The scene's Publish is 112 wide at rest, the width of “Publishing”, so it doesn't move
when busy; busy buttons get `aria-busy` and ignore presses without `disabled` (C23). One primary in the
scene.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | Variants, Sizes row: `Small` (`src/ui/Button.module.scss`, `.sm`) | component-button Anatomy: “Label · body, weight 500 · 14 / 20” | sm label 13px; md and lg 14px | Either state on the Anatomy row that sm takes 13 (work-tool: 13 in dense rows), or set sm to 14 |

Ledger, `component-button` (`.mdx` unchanged since 26 Oct; reference read):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Outlined” / Prefer “Filled” | pass | |
| Avoid “Fades both ways” / Prefer “In at once, out softly” | pass | rest 120ms out; hover/pressed 0s in |
| Avoid “Down to 0.9” / Prefer “Down to 0.97” | pass | 31 of 32 when pressed |
| Avoid “Two fills” / Prefer “One fill, and it's danger” | pass | danger-fill `rgb(161,31,1)`, white label passes in both themes |
| Avoid “Spinner at once” / Prefer “Waits 300 ms, keeps its width” | pass | reserved width measured |
| Anatomy: Height 32 · 24 · 40 | pass | |
| Anatomy: Padding 12 (sm 8, lg 16) | pass | |
| Anatomy: Radius pill every size | pass | the Avoid outlined frame's 8px is the mistake shown |
| Anatomy: Icon gap 4 | pass | 4 (see Gaps: Icon page says 8) |
| Anatomy: Label 14/20, 500 | pass for md, lg; **fail** (nit) for sm | finding 1 |
| Anatomy: Fill / hover fill | pass | `fill-control` 6% ink → 10% |
| Anatomy: Hover in 0, out 120 | pass | |
| Anatomy: Press 0.97 in 80ms, spring back | pass | `scale 0.08s` |
| Anatomy: Busy after 300, `loader-circle` | pass | `LoaderCircle` in the icon slot (`src/ui/Button.tsx`) |
| One row, one height; icon-only has a Tip with its aria-label | pass | Settings, New file, Add, More |
| Busy stays focusable, ignores presses | pass | `onClick` prevented, no `disabled` |
| States: secondary is translucent `fill-control`; ring only on `:focus-visible` | pass | |
| Mistake: a shadow to lift it | pass | `box-shadow: none` everywhere |
| Mistake: colour as rank | pass | |
| Mistake: disabled with no reason | n/a | only in the States grid, which shows the state itself |
| Copy: verb that names the result | pass | Save changes, Publish, Export, Delete project |
| Copy: sentence case | pass | |
| Copy: matches the dialog's title | n/a | no dialog here |

### /components/card

Shots looked at whole: all four, plus `card-scene-hover-1280-light.png` (pointer on the first card's
title). Probe at 1280 light/dark and 375 dark: no text under 4.5:1, none under 12px (the Stage figure's
caption included), Lucide at stroke 2 only, no unnamed button, no overflow.

Measured in the scene (1280 light): card radius 18, `surface`, at rest `0 1px 2px` 6% plus a 1px 8% ring
(`shadow-xs`), no border; inset 8 to the stage; stage `fill-control`, radius 10; title 12 below the stage,
8 in from it, 14/20 weight 500; subtitle 13/18 in `ink-muted`. The title is a `button` whose `::after`
is `position: absolute; inset: 0`, so the whole card is one target; “More for Q4 roadmap” is a separate
24 × 24 button above it. Under the pointer the card scales toward 1.01 (1.0095 mid-spring) and takes
`0 2px 4px` (`shadow-sm`).

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | Variants “Static” and the “Only a card that opens lifts” pair: subtitle `A specimen` (`src/demos/card.tsx`) | component-card Copy: “Subtitle: the one fact that helps choose between cards” | `A specimen` is the same kind of line on any static card | A fact, e.g. `Geist, 9 sizes`, or no subtitle |
| nit | “Arrive together, almost” frames | component-card: “A frame around a grey stage, words beneath” | the twelve cards are stages only, no title row | Give each mini card its one-line title, or caption the figure as thumbnails |

Ledger, `component-card` (`.mdx` unchanged since 26 Oct; reference read):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Static card lifts on hover” / Prefer “Static card stays still” | pass | |
| Avoid “Up to 1.05, heavy shadow” / Prefer “Up to 1.01, small shadow” | pass | measured on the scene |
| Avoid “120 ms apart, uncapped” / Prefer “30 ms apart, capped at 8” | pass | shots show the Avoid grid mid-entrance |
| Avoid “Swaps in one frame” / Prefer “Digits rise, 30 ms apart” | pass | mono tabular digits |
| Anatomy: Frame `surface`, `shadow-xs`, 18 | pass | |
| Anatomy: Inset 8 | pass | |
| Anatomy: Stage `fill-control`, 10 | pass | |
| Anatomy: Title 14/20, 500 | pass | |
| Anatomy: Subtitle 13/18, `ink-muted` | pass | |
| Anatomy: Meta padding 12 above, 8 sides | pass | |
| Anatomy: Hover 1.01, `shadow-sm`, gentle spring | pass | |
| Anatomy: Entrance 30ms, at most 8 | pass | |
| States: one target, More above it, Tab card then action | pass | stretched `::after`, More is its own button |
| Mistake: buttons all over the card | pass | one target, one More |
| Mistake: text on the stage | pass | “Aa” and digits are the content, not titles |
| Mistake: uneven heights | pass | one-line titles (C14) |
| Mistake: staggering every re-render | pass | Replay only |
| Mistake: the stage copying the card's corner | pass | 10 inside 18 |
| Copy: title is the thing's own name | pass | |
| Copy: subtitle is the one fact that helps choose | **fail** (nit) on `A specimen` | finding 1 |

### /components/checkbox

Shots looked at whole: all four. Probe at 1280 light/dark and 375 dark: the only text under 4.5:1 is the
three disabled `Option` labels in the States grid (2.36:1 light, 2.07:1 dark; WCAG-exempt as inactive);
none under 12px; marks are Lucide `Check`/`Minus` at 14px with no stroke override (13px only mid-press
at 0.9, 28px in the 2× figure); no unnamed button; no overflow.

Measured (1280 light): box 16 × 16, radius 4; off is white with a 1px `rgb(134,134,144)` edge (3.6:1 on
white); on and mixed `rgb(0,113,227)` fill; box 2 below the 20px label line's top; box to label 8;
children indented 24. Scene and Prefer rows are `<label>`; the Avoid “Only the 16 px box clicks” rows are
`<div>`, as meant. The scene has no form and no button other than the frame's theme switch.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | scene “Notifications” and the “The words are part of the target” pair (`src/demos/checkbox.tsx`) | component-checkbox mistake: “A checkbox that saves on the spot … it's a Switch” (C31) | scene: no `form`, no Save or Submit (`buttons: ['Switch theme']`); same for “Keep me signed in / Show hidden files” | Put the group in a form with its submit (e.g. a sign-in form for “Keep me signed in”, Save for the notification group), or make the settings that apply at once Switches |
| nit | Variants, “Without a label” row | owner: “Labels start on one vertical line” | its boxes at x 594.4, every other row's at 582.4; labels 622 vs 606 | Drop the row's own 12px inset so its boxes share the gallery's column, or note why a selection list is inset |

Ledger, `component-checkbox` (`.mdx` read; Mark row now “14px at Lucide's own line”):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Only the 16 px box clicks” / Prefer “The whole row clicks” | pass | label vs div measured |
| Avoid “Parent ticked if any is” / Prefer “Parent dashed if some are” | pass | |
| Anatomy: Box 16, radius 4 | pass | |
| Anatomy: Off `surface`, `line-strong` ≥ 3:1 | pass | 3.6:1 |
| Anatomy: On, mixed `accent` / `on-accent` | pass | |
| Anatomy: Mark 14px at Lucide's own line | pass | probe: 14px, stroke 2 |
| Anatomy: Box to label 8 | pass | |
| Anatomy: Label 14/20 | pass | |
| Anatomy: Box offset 2 | pass | |
| Anatomy: Children indent 24 | pass | |
| States: press 0.9, mark spring, reduced motion fade | pass | 13px pressed mark = 14 × 0.9; motion not timed |
| States: Space toggles | pass | Base UI checkbox |
| Mistake: a checkbox that saves on the spot | **fail** | finding 1 |
| Mistake: negative labels | pass | |
| Mistake: consent ticked in advance | n/a | no consent box |
| Mistake: disabling instead of explaining | n/a | disabled only in the States grid |
| Copy: label is what's true when checked, no full stop | pass | |
| Copy: group label is what the set is about | pass | “Email me about”, “Export” |
| Copy: description is the consequence | pass | “Anyone with the link can reply.” |

### /components/combobox

Shots looked at whole: all four, plus `combobox-scene-open-1280-light.png` and `-dark.png` (scene field
clicked). Probe at 1280 light/dark and 375 dark: no text under 4.5:1, none under 12px, Lucide at stroke 2
only (chip × at 12px), no unnamed button, no overflow.

Measured, scene open (1280 light): label 4 above the field; field 220 × 32, radius 10, edge turns
`rgb(0,113,227)` and stays while the list is open, focus stays in the input; chevron trigger 24 × 24,
radius 6, 4 in; list as wide as the field, 6 below it, radius 10, `shadow-md`, rows 32 radius 6, 296
visible of 864 (nine rows); clicking the field opens the whole list (27 options) scrolled to the current
value, which has weight 500, a leading accent check and the keyboard highlight; countries right-aligned
in `ink-muted`. Multiple: chips 24 tall, radius 6, `fill-control`, × named “Remove Ana Ruiz”.
Placeholders: `Lisbon or Portugal`, `Lisbon`, `Berlin` (examples, C17).

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | every combobox's chevron, `aria-label` (`src/ui/Combobox.tsx:151`) | every-line-does-a-job: the words name the action; component-tooltip Copy: names match | `Show all ${label.toLowerCase()}` reads “Show all time zone”, “Show all office” | Take a plural noun as its own prop (`allLabel="Show all time zones"`), or name it “Show list” |
| nit | scene note `Meetings shown in Lisbon time` (`src/demos/combobox.tsx:69`) | component-input Anatomy: “Label, field, hint · `space-1` apart · 4” | it reads as the field's hint (13px muted, directly under) but sits 12 below the field and isn't `aria-describedby` | Pass it as the field's `description` so it sits 4 below and is tied, or set it apart as the page's own text |

Ledger, `component-combobox` (`.mdx` read; Copy placeholder rule now “an example … Lisbon or Portugal”):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Exact match, cities only” / Prefer “Loose match, countries too” | pass | source: `strict` on Avoid only; not typed in a shot (shoot has no typing) |
| Avoid “Nothing highlighted” / Prefer “First match highlighted” | pass | `autoHighlight={false}` on Avoid only; open scene shows a highlight |
| Avoid “Plain rows” / Prefer “Matched letters bolder” | pass | `showMatch={false}` on Avoid only |
| Avoid “No results” / Prefer “Repeats query, names next step” | pass | `cityEmpty` copy |
| Anatomy: Field 32, radius 10, `line-strong` | pass | |
| Anatomy: Trigger 24, 4 in, radius 6 | pass | |
| Anatomy: List as wide as the field, 6 below | pass | 220, 6 |
| Anatomy: Current option 500, accent check leading | pass | |
| Anatomy: Match 600 | pass | source |
| Anatomy: Trailing detail muted, right, searched | pass | |
| Anatomy: Chip 24, 4 in, 6, `fill-control` | pass | |
| Anatomy: List height nine rows, 296 | pass | 296 |
| Field keeps accent edge while open | pass | |
| States: Esc restores, chevron opens all | pass | Base UI; trigger opens the list |
| Mistake: accepting text not in the list | pass | value is an item |
| Mistake: opening empty | pass | click shows all 27 |
| Mistake: sorting by score | pass | list order kept |
| Mistake: chips push the field off the row | pass | chips wrap inside |
| Copy: label what's chosen | pass | Time zone, Office, Assignees |
| Copy: placeholder an example | pass | |
| Copy: empty repeats query and next step | pass | |
| Menu (the list is a Menu popup): radius 10, inset 4, item radius 6, rows 32, `shadow-md` | pass | |

### /components/dialog

Shots looked at whole: all four, plus `dialog-confirm-open-1280-light.png`,
`dialog-task-open-1280-light.png` and `dialog-task-open-375-dark.png` (scene's Delete… and Rename…
clicked). Probe at 1280 light/dark and 375 dark: no text under 4.5:1, none under 12px, Lucide at stroke 2
only, no unnamed button, no overflow.

Measured, open: confirm is `role=alertdialog`, 400 wide; task is `role=dialog`, 560 wide (343 at 375,
16 from each edge). Both: padding 20, radius 18, `surface-raised` white, `0 12px 24px` drop
(`shadow-lg`), title 18/26 weight 600, body bottom to buttons 24, buttons trail right with Cancel first
and about 8 apart, scrim `rgba(24,24,27,0.32)`. Focus on open: Cancel in the confirm; the Name field in
the task with “Q4 roadmap” selected (0–10). Source: the alert dialog ignores outside presses
(`src/ui/Dialog.tsx:55`); the task closes on an outside press only while untouched
(`src/demos/dialog.tsx:90-96`).

Findings: none.

Ledger, `component-dialog` (`.mdx` unchanged since 26 Oct; reference read):

| rule | mark | why |
| --- | --- | --- |
| Confirm: `dialog-sm` 400, question title, consequence, two buttons | pass | |
| Confirm: Cancel and a verb | pass | Cancel · Delete project |
| Confirm: focus starts on Cancel; Esc cancels | pass | focus measured; Base UI Esc |
| Confirm: no outside dismissal | pass | source |
| Confirm: one fill is `danger-fill` | pass | |
| Task: `dialog-md` 560, task title, fields, Cancel and action | pass | |
| Task: focus in first field, text selected | pass | |
| Task: Enter submits, Esc cancels, action disabled until valid | pass | form submit in source; valid name, so enabled |
| Task: scrim cancels only when untouched | pass | source |
| Kinds table rows (part, width, title, focus, Enter, scrim, fill) | pass | as above |
| Avoid “Generic title, OK button” / Prefer “Names project, Delete button” | pass | |
| Avoid “Focus on Delete” / Prefer “Focus on Cancel” | pass | |
| Avoid “Drops in from 50 px above” / Prefer “Grows in place” | pass | |
| Anatomy: Scrim, Panel `surface-raised` + `shadow-lg`, Radius 18, Padding 20, Title 18/26 600, Body to actions 24, Between buttons 8, Button radius pill, Layer 200 | pass | each measured above; layer from `z-dialog` in source |
| Buttons trail right, likeliest last | pass | |
| States: focus trapped, returns to opener | pass | Base UI Dialog; `finalFocus` default |
| Mistake: confirming the undoable | pass | delete project and files |
| Mistake: a dialog on arrival | pass | |
| Mistake: explaining the buttons | pass | |
| Mistake: a dialog that scrolls | pass | 166 and 190 tall |
| Copy: title specific; body only if needed; Cancel and a verb; trigger ends in ellipsis | pass | `Rename…`, `Delete…` |

### /components/icon

Shots looked at whole: all four, plus `icon-scene-hover-1280-light.png` (pointer on Search: the Tip
“Search” shows above it). Probe at 1280 light/dark and 375 dark: no text under 4.5:1; one text under 12px
(below); Lucide at stroke 2 only (16 ×40, 14 ×12, 24 ×3 in the “24px, Lucide's default” Avoid frame); the
only non-Lucide SVGs (3) are inside the “Drawn for this page” Avoid frame; no unnamed button; no overflow.

Measured, scene (1280 light): sidebar places 14px with 16px icons in `ink-muted` (`rgb(94,94,103)`), the
current place `ink` with `aria-current="page"`; toolbar icon buttons 32 × 32 named Search, Filter, New
issue, More, each with a Tip of the same words; issue rows 36 tall at 13px; status icons 14px, each
`role="img"` with `aria-label` In progress / Todo / In review / Done (C9); lines between rows start at the
title text, none after the last (C21).

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | Compare captions with inline code, e.g. “From the library” caption's `aria-hidden` (probe: `div.compare>div.side>p.note>code`) | work-tool: “Labels and meta 12px; nothing smaller” | 11.05px (0.85em of the 13px note) in both themes and at 375 | `font-size: max(12px, 0.85em)` for code inside `.note` |
| nit | scene sidebar places | work-tool: “13px in table rows, sidebars and dense lists” | sidebar labels 14px here; the App shell demo's sidebar is 13px | 13px, with 16px icons (the Icon page's own dense size is 14 at 13px: pick one and say it) |

Ledger, `component-icon` (`.mdx` read; it adds “the line is never set per icon” and the home-page
exemption, C6, C7, C9):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Typed as characters” / Prefer “From the library” | pass | Prefer frame Lucide only |
| Avoid “Icons, named on hover” / Prefer “Icons beside their words” | pass | |
| Avoid “24px, Lucide's default” / Prefer “16px beside 14px text” | pass | 24 only in Avoid |
| Avoid “Drawn for this page” / Prefer “From the library” | pass | hand-drawn SVGs only in Avoid |
| Line never set per icon (C6) | pass | probe: every Lucide `stroke-width="2"`, no non-scaling stroke |
| Kinds: beside a word | pass | sidebar |
| Kinds: alone, named in a Tip with the aria-label's words | pass | toolbar, measured |
| Kinds: status, a shape per state, named when alone | pass | four shapes, `role=img` + label |
| Kinds: decorative, hidden | pass | probe found no unhidden non-Lucide SVG outside the Avoid frame |
| Anatomy: 16 beside 14 | pass | |
| Anatomy: 14 in dense rows (13px) | pass | status icons |
| Anatomy: 20 beside 17 | n/a | no consumer text here |
| Anatomy: Line 2 on 24 (1.33 at 16) | pass | |
| Anatomy: Gap to the word 8 | pass | sidebar 8; see Gaps for Button's 4 |
| Anatomy: Colour `ink-muted`, `ink` when current | pass | measured |
| Anatomy: button 24/32/44 | pass | 32 |
| States: hover/current full ink, disabled `ink-disabled` | pass for current | no disabled icon on the page |
| Mistake: typed symbol or emoji | pass | only in the Avoid frame |
| Mistake: two libraries, filled and outline mixed at rest | pass | |
| Mistake: navigation as icons alone | pass | only in the Avoid frame |
| Mistake: icon button with no name | pass | |
| Mistake: 24px beside 14px | pass | only in the Avoid frame |
| Mistake: bigger icon for a bigger target | pass | |
| Copy: Tip and aria-label the same words, naming the action | pass | Search, Filter, New issue, More |
| Copy: decorative icon says nothing | pass | |

### /components/input

Shots looked at whole: all four, plus `input-fig0-submit-1280-light.png` (scene, Continue pressed) and
`input-fig4-submit-1280-light.png` (“Message under each field”, Continue pressed). Probe at 1280
light/dark and 375 dark: no text under 4.5:1 (the disabled field's text is exempt), none under 12px,
Lucide at stroke 2 only, no unnamed button, no overflow.

Measured, scene Email (1280 light): label 12/16 weight 500 `ink-muted`, 4 above the field; field 32,
radius 10, 1px `rgb(134,134,144)` edge, padding 12, text 14/20; hint 4 below, tied by
`aria-describedby`; `type="text"` with `inputMode="email"`. Embedded key 24 tall, radius 6, 4 from the
field's top and right edge, ⌘ drawn with Lucide `Command`. On Continue with `zoe@laurent`: the error
“Enter an email address, like ana@studio.com.” replaces the hint, the input gets `aria-invalid` and
focus moves to it with the caret at the end (11/11). `required` waits for submit (`src/ui/Field.tsx:72-92`,
C13).

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | Variants “Search” (`placeholder="Search files"`) and the 2× figure (`placeholder="Search"`) (`src/demos/input.tsx:162,195`) | component-input Copy: “Placeholder: an example, not an instruction” (C17) | both placeholders tell the reader what to do, and repeat the label `Search` | Placeholder an example of a query (`Q4 roadmap`), or none: the magnifier and the label already say it |
| nit | ⌘ in every `FieldKey` (`src/ui/Field.tsx:128`) | component-icon: a symbol “is read out by whatever name the screen reader's dictionary has” | `<Command aria-label="⌘">` hands the icon the same symbol as its name | `aria-label="Command"` (or hide the `kbd` and name the shortcut on the field) |
| nit | scene Email while invalid | component-input Anatomy note: “the hint or the error below, never both” | `aria-describedby` keeps the hint's id with the error's (`…4ki_ …3ki_`), so a screen reader reads both | Drop the hint's id from `aria-describedby` while the error shows |

Ledger, `component-input` (`.mdx` unchanged since 26 Oct; reference read):

| rule | mark | why |
| --- | --- | --- |
| Avoid “Checks on every keystroke” / Prefer “Checks when focus leaves” | pass | `validationMode` onBlur, then onChange once invalid |
| Avoid “One faint line at the top” / Prefer “Message under each field” | pass | Prefer submit measured |
| Avoid “Placeholder as label” / Prefer “Label above, example inside” | pass | `ana@studio.com`, `+49 30 1234567` |
| Avoid “Every field full width” / Prefer “Sized to 16, 4 and 3 digits” | pass | |
| Variants: leading end says what it's for; trailing offers one thing | pass | magnifier; ⌘K; px |
| Anatomy: Height 32 | pass | |
| Anatomy: Radius 10 | pass | |
| Anatomy: Edge `line-strong` 1px | pass | |
| Anatomy: Padding 12 | pass | |
| Anatomy: Trailing inset 4 | pass | |
| Anatomy: Embedded key 24, radius 6 | pass | |
| Anatomy: Label 12/16 500 muted | pass | |
| Anatomy: Label, field, hint 4 apart | pass | |
| Anatomy: Focus recolours the edge, nothing around | pass | States grid and 2× figure |
| Anatomy: Text 14/20; 16 on touch | pass | 14 at 1280 and 375 (headless pointer is fine) |
| Hint or error, never both | pass visually; nit for assistive tech | finding 3 |
| Known issue: iOS zoom under 16px | pass | `pointer: coarse` rule in source |
| Known issue: `type="email"` answers first | pass | text + inputMode |
| Mistake: hint repeats the label | pass | “For delivery updates only.” |
| Mistake: clearing the field on error | pass | value kept |
| Mistake: read-only drawn as disabled | pass | read-only keeps ink |
| Copy: label a noun, no colon | pass | |
| Copy: placeholder an example | **fail** | finding 1 |
| Copy: error says what to do, with an example | pass | |
| Error timing (principle): wait till they finish; required waits for submit | pass | |
