# Rule review 2: components, part 2b

Routes: `/components/table`, `tabs`, `toast`, `toolbar`, `tooltip`. Method: `.claude/agents/ui-rule-review.md`.
Reviewed 2026-11-03 by an agent that did not build these screens. Decisions in `../decisions.md` are
binding: a screen that follows one is not a finding. Each page's source is `src/pages/components/<slug>.mdx`;
where it differs from `skill/ui-playbook/references/`, the `.mdx` wins.

Shots: `shots/review2/components-2b/<route>-<1280|375>-<light|dark>.png` (full page, scale 1, each looked at
whole once), plus the crops named in the evidence column. Measurements with `pnpm shoot --eval` on the dev
server. A generic probe (text contrast against the composited background, text under 12px, Lucide sizes and
strokes, non-Lucide SVG in `main`, unnamed controls, horizontal overflow) ran on every route at 1280 light and
375 dark; its numbers are quoted as "probe". Known false positives: Base UI's hidden form `input`s, and
Lucide icons caught mid-scale (an unchecked Checkbox's check reads 6px). `~/.machine-pulse/state.json` was
read before each route.

Status: complete for all five routes. Shoots waited whenever `~/.machine-pulse/state.json` read `busy`.

## Findings

4 must, 5 should, 6 nit. Each route's section has the full row with its evidence and fix.

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | table: selectable tables at 375 (`src/ui/Table.module.scss` `.check`, `.hasCheck` sticky `left`) | table Anatomy: cell padding 12; Details: name pinned with a line at its edge | checkbox column shrinks to 28, Name pinned at 40: a 12px gap, and Name covers Status's first 12px; `table-live-375-dark.png` | `min-width: 40px` on `.check` |
| must | table: live bulk bar, Move… and Delete (`src/demos/table.tsx` `Files`) | component-button: “Runs an action now” | with a row ticked, Delete and Move… do nothing | Delete with Undo toast; Move… opens its menu or dialog; or drop the buttons |
| must | toast: Undo and Dismiss (`src/demos/toast.tsx` `Files`; `src/ui/Toast.tsx`) | owner's rule: focus never falls to `<body>`; C39 | after Undo and after Dismiss, `activeElement` is `<body>` | focus the restored row's Delete; otherwise return focus to where it was |
| must | tooltip: “Wait once, then follow the pointer” (`src/demos/tooltip.tsx` `TooltipGrouping`) | C20: a visible state at rest, a keyboard path, a tap shows what hover shows | both sides identical at rest; touch opens nothing (`mouseOnly`); focus opens at once on both | a replayed pointer walk on each row, with Replay |
| should | table: pinned Name line when nothing scrolls (`.stickyFirst` box-shadow) | lightest-boundary: lines only between repeated rows | vertical line after Name at 1280 with `scrollWidth == clientWidth` | draw it only while scrolled |
| should | tabs: count chips (`src/ui/Tabs.module.scss` `.count`) | system-work-tool: 12px, nothing smaller | 11px on 7 chips | 12px, Anatomy row with it (Gap 2) |
| should | toast: Go offline (`src/demos/toast.tsx` `Triggers`) | toast mistake: the page itself should show the change | nothing on the stage changes | make it a visible state the toast confirms |
| should | toolbar: disabled Undo/Redo show a tip (`src/ui/Toolbar.tsx` `Action`) | tooltip States: a disabled button shows none | “Undo ⌘Z” opens on hover while disabled | gate the Tip on `disabled`, or change the rule (Gap 3) |
| should | toolbar: canvas Share (`src/demos/canvas.tsx`) | component-button: runs an action now | click does nothing | a share Popover, or a runnable action |
| nit | table: sort header focus ring | component-button: the focus ring | inset 2px `accent`, not `--focus-ring` | take the focus token's colour (Gap 5) |
| nit | table: Move…/Delete disabled with no selection | button mistake: disabled with no reason | “5 files” names the count, not why | Gap 1 |
| nit | tabs: focus ring (`.tab::before`) | component-button: the focus ring | 2px `accent` | as above (Gap 5) |
| nit | toast: Kinds table, With Undo's Icon cell | table Copy: empty cells an en dash (C41) | “—” | “–” |
| nit | toast: Undo instead of asking, rows not on one level across the two stages | owner's grid rule | Avoid rows ≈40px lower than Prefer's | align both to the top |
| nit | tooltip: live view buttons do nothing | component-button: runs an action now | no `onClick` | wire to a zoom readout or reuse `CanvasScene` |

## Per route

### /components/table (done)

Shots looked at whole: all four. Probe at 1280 light and 375 dark: no overflow, no text under 12px; Lucide
16, 14 and 12 (sort arrows beside 12px headers) at stroke 2, plus the 6px mid-scale checks; no non-Lucide
SVG; unnamed controls only Base UI's hidden inputs. Low contrast only on the disabled Move… and Delete (2.09
light, 1.61 dark; WCAG exempts disabled controls).

Measured (1280 light, live table): frame 1px `rgb(228,228,232)` (`line`), radius 10, `surface` white, no
shadow; header cells 32 tall incl. their line, 12/500 `rgb(94,94,103)` (`ink-muted`) on `rgb(239,239,241)`
(`surface-sunken`), padding 12; rows 36, 13/18, padding 12, 1px `line` below each, none after the last; Size
right-aligned in header and cells, table `tabular-nums`; Owner and Modified `ink-muted`; `aria-sort`
`descending` on Modified, `none` on the other sortable headers, absent on Status. Bulk bar 24 tall: “5 files”
13 `ink-muted`, Move… and Delete 24px (`size="sm"`, work-tool's 24 in table rows), right-aligned on the bar's
row. After ticking one row: “1 selected”, both buttons enabled, header box `aria-checked="mixed"`, the row
`accent-soft` (`table-live-one-selected.png`).

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | table: live demo and Variants “Sortable and selectable” at 375 (`src/ui/Table.module.scss`, `.check` and `.hasCheck` sticky `left`) | table Anatomy: “Cell padding `space-3` each side”; Details: the name “stays pinned, with a line at its edge” | at 375 the checkbox column shrinks to 28 wide, but the pinned Name column sits at `left: 40px`: a 12px gap opens between the two (29 → 41, the page shows through) and Name (41–181) covers the first 12px of Status (starts 169), so “Status” touches the pinned line; `table-live-375-dark.png` | Give `.check` `min-width: calc(16px + 2 * var(--space-3))` (or `width` on the `col`), so the column can't shrink below the sticky offset |
| must | table: live demo, Move… and Delete with rows selected (`src/demos/table.tsx` `Files`, the two `Button`s have no `onClick`) | component-button: “Runs an action now”; toast: a common undoable action “runs at once and offers Undo” | tick a row, press Delete: rows stay 5, no toast, focus stays on the checkbox; Move… (an ellipsis, so it promises a next step) opens nothing | Delete removes the selected rows and shows “Deleted 2 files” with Undo; Move… opens its menu or dialog. Or, if the demo is only about selection, drop the buttons and keep the count |
| should | table: the pinned Name column's line when nothing scrolls (`src/ui/Table.module.scss` `.stickyFirst` box-shadow) | every-line-does-a-job / lightest-boundary: lines only between repeated rows | at 1280 the live table, every comparison and the Variants draw a vertical line after Name though `scrollWidth == clientWidth`; `table-live-one-selected.png` | Draw the pin's line only while the wrap scrolls (`[data-scrolled]` from `scrollLeft > 0`, or the existing `scrolls` state) |
| nit | table: sort header focus (`src/ui/Table.module.scss` `.sort` focus) | component-button: focus shows the ring | `inset 0 0 0 2px var(--accent)`, not `--focus-ring` (2px gap + 2px ring) | Keep inset (the header clips an outer ring), but take the ring colour from the focus token so a look's ring holds |
| nit | table: Move… and Delete disabled with nothing selected | component-button mistake: “Disabled with no reason … say why nearby” | “5 files” sits beside them; it names the count, not why they are off | See Gap 1: either the table page's “enables the bulk actions” wins, or show the buttons only once something is selected, as Gmail and Linear do |

Ledger, `component-table`:

| rule | mark | why |
| --- | --- | --- |
| When to use (compare many things by the same attributes, act on several) | pass | five files by owner, status, size, date |
| Avoid “Sizes left-aligned” / Prefer “Sizes right-aligned, tabular” | pass | Prefer right-aligned, header too, `tabular-nums` |
| Avoid “Zebra stripes” / Prefer “One line between rows” | pass | stripes only on the Avoid side |
| Avoid “Arrows on every header” / Prefer “Arrow on the sorted column” | pass | arrows at opacity 0 except `[data-sorted]`, hover and `:focus-visible` (C20 keyboard path) |
| Avoid “Every column in ink” / Prefer “Secondary columns muted” | pass | Owner, Modified `ink-muted` |
| Avoid “Names scroll away” / Prefer “Name column pinned” | **fail** (must at 375) | pinned offset vs shrunk checkbox column (finding 1); line drawn when nothing scrolls (finding 3) |
| Variants: Plain, Sortable and selectable, Wide | pass with finding | finding 1 on “Sortable and selectable” |
| Anatomy: frame 1px `line`, `radius-lg` 10, `surface`, no shadow | pass | measured |
| Anatomy: header 32 with its line, 12/500 `ink-muted` on `surface-sunken` | pass | measured |
| Anatomy: row 36, 13/18 | pass | measured |
| Anatomy: cell padding 12 | **fail** at 375 | Status's padding covered (finding 1) |
| Anatomy: divider between rows, none after the last | pass | last row `border-bottom: 0` |
| Anatomy: numbers right, `tabular-nums`, header too | pass | |
| Anatomy: secondary columns `ink-muted` | pass | |
| Anatomy: hover `fill-hover`, selected `accent-soft` | pass | States frame pins hover on row 2, selects row 3 |
| Anatomy: sticky header `z-sticky` 10 | pass | `th { position: sticky; z-index: var(--z-sticky) }` |
| “A line edge, never a shadow” | pass | `box-shadow: none` on the frame |
| States: sorting is a header button with `aria-sort`; click again reverses | pass | source and measured |
| States: select-all goes mixed; a click on mixed selects all | pass | `aria-checked="mixed"` after one; `onCheckedChange` sets all keys |
| States: the bar names the count and enables bulk actions | pass with finding | count and enabling pass; the actions do nothing (finding 2) |
| Mistake: status as colour alone | pass | Badge with dot and word |
| Mistake: actions in every row | pass | none per row |
| Mistake: truncating the name column | pass | `nowrap`; at 375 the table scrolls and Owner (`optional`) goes first |
| Mistake: row click and checkbox doing different things | pass | rows don't open; only the checkbox selects |
| Copy: headers a noun, sentence case, short | pass | Name, Owner, Status, Size, Modified, Type, Views, Comments |
| Copy: units in the cells | pass | “18.4 MB” |
| Copy: empty cells an en dash (C41) | n/a | no empty value in the data |

Ledger, neighbouring components on this route:

| reference | rule | mark | why |
| --- | --- | --- | --- |
| component-badge | dot and word; soft tints; dot only on a state that can change (C19) | pass | Shipped, In review, Scheduled, Failed, Draft are states, each with dot and word |
| component-badge | a column of badges gets a header (C12) | pass | “Status” |
| component-badge | `info` in a selected row stays a badge (C13) | pass | inset `info` edge at 35% on `[aria-selected] [data-tone=info]` |
| component-checkbox | box 16, `line-strong` edge, mixed is a dash, mixed click turns all on | pass | |
| component-checkbox | “Without a label”: the row names it | pass | `aria-label="Select Brand guide.pdf"`, “Select all rows” |
| component-button | runs an action now | **fail** (must) | finding 2 |
| component-button | disabled with no reason | **fail** (nit) | finding 5 / Gap 1 |
| system-work-tool | 13px in table rows, 12px labels, 24px controls in table rows | pass | 13/18 rows, 12 headers, bulk buttons 24 |

### /components/tabs (done)

Shots looked at whole: all four. Probe at 1280 light and 375 dark: no overflow, Lucide 16 and 14 at stroke 2,
no non-Lucide SVG, no unnamed control; low contrast only on the Disabled state tab (2.36 light, 2.07 dark,
exempt); **text under 12px: every count chip, 11px** (7 on the page).

Measured (1280 light, live “Project”): tabs 40 tall, 16 apart (461.3 → 477.3), 14/20/500; current
`rgb(24,24,27)` `ink`, others `rgb(94,94,103)` `ink-muted`; bar 2 × 61.3 under “Overview” (the label's full
width), `ink`, radius 9999, at the list's foot; line a 1px `line` background on the list's content box; first
label at x 400 = panel text at x 400 (the list's 8px padding is given back by −8 margin, for the ring);
panel `padding-top` 16; count 25 × 18, Geist Mono 11, `ink-muted` on `surface-sunken`, pill. One Tab stop
(`tabIndex` 0 only on the current tab). Keyboard: ArrowRight moves to Issues, opens it and the bar follows
(x 117.7, width 75.3 at 375); End opens Settings. Bar on `ease-spring-smooth`, `transition: none` under
reduced motion.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | tabs: every count chip (`src/ui/Tabs.module.scss` `.count`; tabs Anatomy “Count mono 11”) | system-work-tool: “Labels and meta 12px; nothing smaller in a row someone reads” | probe: 7 chips at 11px, both themes | 12px mono in the 18px chip; change the Anatomy row with it (C42: the better value wins). See Gap 2 |
| nit | tabs: focus ring (`.tab::before`, `0 0 0 2px var(--accent)`) | component-button: focus is the focus ring | not `--focus-ring`; the States grid's Focus shows a single accent ring | Take the colour from the focus token (keep the inset `::before` that avoids clipping) |

Ledger, `component-tabs`:

| rule | mark | why |
| --- | --- | --- |
| When to use; Tabs or segmented control table | pass | prose table fits at 375 |
| Avoid “Current tab goes bold” / Prefer “Weight 500, colour only” | pass | 500 on every tab |
| Avoid “Current tab in the accent” / Prefer “Current tab in ink” | pass | |
| Avoid “Wraps onto more rows” / Prefer “One row that scrolls” | pass | `overflow-x: auto`, `flex: none`, cut-off “Discussi” |
| Avoid “Count in parentheses” / Prefer “Count in a quiet chip” | pass with finding | chip quiet, digits mono; size 11 (finding 1) |
| Variants: Sections, With counts, Overflowing | pass | |
| Anatomy: height 40 (48 in a toolbar) | pass | 40; toolbar case not on this route |
| Anatomy: between tabs 16 | pass | |
| Anatomy: label 14/20/500; default `ink-muted`; current `ink` | pass | |
| Anatomy: bar 2px `ink` `radius-full`, on the line, label's full width | pass | |
| Anatomy: line 1px `line`, full width of the tabs | pass | |
| Anatomy: count mono 11, `surface-sunken`, `radius-full`, 18 | pass as written | but under the work tool's 12 (finding 1) |
| Anatomy: panel gap 16 | pass | |
| Anatomy note: no side padding, labels on the content's left edge | pass | 400 = 400 |
| States grid: Current, Default, Hover, Focus, Disabled | pass | |
| States: arrows move and open; Home/End; Tab into the panel; bar slides on the smooth spring | pass | measured; panel `tabIndex` 0 |
| Mistake: tabs that hide required input | n/a | no form |
| Mistake: controls above the tabs acting on one panel | pass | none |
| Mistake: tabs that reset | n/a | no navigation on the route |
| Mistake: a single tab | pass | |
| Copy: nouns, one or two words; sentence case; parallel | pass | Overview, Issues, Activity, Settings; Pull requests, Discussions |

### /components/toast (done)

Shots looked at whole: all four. Probe: see the paragraph after the findings. Interaction runs on
the live “Files” stage at 1280 light, plus `toast-live-375-dark.png` (after deleting Brand guide.pdf at 375).

Measured (1280 light, after Delete on Q4 roadmap.fig): toast 320 × 40 (`min-width: min(320px, 100%)`, C14),
radius 9999, `surface-raised` white, `shadow-lg` (`0 12px 24px` + `0 2px 4px`), padding 4 4 4 16; message
“Deleted “Q4 roadmap.fig”” 14/20 `ink`; Undo 58 × 32 pill (secondary), Dismiss 32 × 32 ghost icon,
`aria-label="Dismiss"`, 4 apart; bottom centre of its stage. After Delete, focus moves to the next row's
Delete (C39) and the row is gone (the page shows the change). At 375 the stage gives the toast 263: the
message wraps to two lines, the toast grows to 52, and nothing truncates (C14). Export gives the error toast
(`alertdialog`, announced through a `role="alert"` node), 320 × 40. Regions: one `role="region"`
`aria-live="polite"` “Notifications” per stage.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | toast: Undo and Dismiss in every toast demo (`src/demos/toast.tsx` `Files`, the `action.onClick` that restores the file; `src/ui/Toast.tsx` `useToast` and `List`) | owner's rule: focus “never falls to `<body>`”; C39 | focus on Undo, click: the toast unmounts and `document.activeElement` is `<body>` (the file is back, 3 rows); the same after Dismiss on the error toast | After Undo, focus the restored row's Delete (the file's index is known in `remove`); in `useToast`, when the closing toast holds focus, hand it back to the element that had it before |
| should | toast: live and Kinds “Go offline” (`src/demos/toast.tsx` `Triggers`) | toast mistake: “Toasts as the only feedback … The page itself should show the change” | after “Sync paused while offline” the button still reads Go offline and nothing on the stage changes | Let the trigger become a state the page shows (a switch “Offline”, or the button turning into Go online), so the toast confirms what is already visible |
| nit | toast: Kinds table, With Undo's Icon cell (`src/pages/components/toast.mdx`) | table Copy: “Empty cells show an en dash, –” (C41) | “—”, an em dash | “–” |
| nit | toast: Undo instead of asking, the two sides' rows at 1280 | owner's grid rule: one edge per kind of thing | Avoid's file rows sit about 40px lower than Prefer's in their stages (`toast-1280-light.png`) | Align both stages' content to the top, or both centred |

Also measured: the Prefer side of “Three at most” keeps the newest three (“Uploaded photo 6, 5, 4 of 6”) and
hides the rest; the Avoid side shows all six. The error toast is still up after 5 s. Probe at 1280 light and
375 dark (no toast open): no overflow, no low contrast, nothing under 12px, Lucide 16 and 14 at stroke 2, no
unnamed control.

Ledger, `component-toast`:

| rule | mark | why |
| --- | --- | --- |
| When to use (confirms, offers Undo; not for choices or what's plain on screen) | pass with finding | Go offline (finding 2) |
| Avoid “Asks before deleting” / Prefer “Deletes, offers Undo” | pass | the Avoid's alert dialog only on the Avoid side |
| Avoid “Filled with colour” / Prefer “Neutral, with an icon” | pass | `.icon` takes the tone; words `ink` |
| Avoid “All six stack up” / Prefer “Three at most, oldest out” | pass | measured |
| Kinds: Done 4 s, With Undo 6 s, Needs attention 4 s, Failed until closed `role="alert"` | pass | `TIMEOUT` 4000/6000/0; error `priority: 'high'`; still up at 5 s |
| Hover or focus pauses; F6 moves focus in | pass (source) | Base UI Toast viewport; not driven |
| Anatomy: `surface-raised`, `shadow-lg`, `radius-full` | pass | |
| Anatomy: height 40 = 32 + 4 × 2; grows with a second line | pass | 40; 52 at 375 |
| Anatomy: inset 4, 16 before the text | pass | `4px 4px 4px 16px` |
| Anatomy: width fits the text, 320 to 440, never wider than the screen (C14 `min(320px, 100%)`) | pass | 320 at 1280, 263 in the 375 stage |
| Anatomy: icon Lucide 16 in the kind's colour | pass | `CircleCheck`, `TriangleAlert`, `CircleAlert` 16 |
| Anatomy: text 14/20 `ink`, two lines then truncates; a failure shows it all | pass | `-webkit-line-clamp: 2`, `none` for errors |
| Anatomy: one pill button, then Dismiss, 32 | pass | |
| Anatomy: bottom centre, `z-toast` | pass | contained stages use the stage's bottom centre |
| Motion: rise 8 px from `enter-scale` on the smooth spring; leave `duration-fast`; older move up on the spring | pass (source) | `.toast` transitions; reduced motion drops the scale |
| Mistake: errors that disappear | pass | |
| Mistake: toasts as the only feedback | **fail** (should) | finding 2 |
| Mistake: links and paragraphs | pass | one sentence, one action |
| Mistake: toasts on page load | pass | none |
| Copy: what happened, past tense, with its object | pass | Deleted “Q4 roadmap.fig”, Link copied, Uploaded photo 1 of 6 |
| Copy: failures say what failed and why | pass | Couldn’t export: the file is locked |
| Copy: the action is one verb | pass | Undo |

Ledger, neighbours on this route:

| reference | rule | mark | why |
| --- | --- | --- | --- |
| component-dialog | the Avoid's alert: question with object, a sentence of what's lost, Cancel and the verb | pass | “Delete “Q4 roadmap.fig”?”, Cancel, Delete (`danger-fill`); it is the Avoid side's mistake on purpose |
| component-button | danger as text-red secondary for row actions; one verb | pass | Delete in `danger` at 24 (work tool's row size) |
| principle-a-shadow-says-how-high | a toast covers: `shadow-lg` | pass | |
| principle-concentric-radius | toast `radius-full`, inset 4, buttons `radius-full` | pass | at two lines the buttons sit mid-height, away from the corners |

### /components/toolbar (done)

Shots looked at whole: all four. Crops: `toolbar-canvas-375-light.png`, `toolbar-tip-rect.png` (Rectangle's
tip, 1280 light). Probe at 1280 light and 375 dark: no overflow, no low contrast, nothing under 12px, no
non-Lucide SVG (the Pen shape's path is canvas content, `aria-hidden`), no unnamed control; Lucide 16 and 14 at
stroke 2, plus three 32px icons in the Anatomy's 2× magnifier (a picture of the toolbar).

Measured (375 light, live canvas): both toolbars 40 tall, padding 4 on every side; tools 32 × 32 pills,
2 apart (Select 66–98, Rectangle 100); separator 1 × 16 `line`, 4 + 2 from its neighbours; panel
`shadow-sm` = `0 2px 4px` + a 7% hairline ring (C30); View bar 12 from the board's right edge, Drawing bar
centred (centre 187.5 in a board centred at 187.5); “100%” 12px `ink-muted`. Current tool `aria-pressed`
`true` on Select, tint `color-mix(accent-soft, accent 16%)`, icon `accent-text`. Tips: Rectangle's tip sits 4
above the Drawing panel's edge (660 → 664), 12/16/500, `ink` ground, `bg` text, padding 4 × 8, radius 6, no
shadow, the key dimmed (`bg` at 62%: ≈7.0:1 light, ≈5.2:1 dark). Keyboard: ArrowRight from Select moves
focus to Rectangle; Select stays pressed until Space or Enter. Undo and Redo start `aria-disabled`, still
focusable.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | toolbar: live canvas, Undo and Redo while there is nothing to undo (`src/demos/canvas.tsx`, `Toolbar.Action … disabled`; `src/ui/Toolbar.tsx` `Action` wraps every labelled action in a `Tip`) | tooltip States: “A disabled button shows none” | hover on the disabled Undo: the tip “Undo ⌘Z” opens (74 × 24 at 718, 380) | Don't open the Tip while the trigger is disabled, or reword the tooltip page (Gap 3): a name on a disabled icon-only control is what lets people learn it |
| should | toolbar: live canvas, Share (`src/demos/canvas.tsx` `<Toolbar.Action primary>Share</Toolbar.Action>`, no `onClick`) | component-button: “Runs an action now”; toolbar Variants: “actions just run” | click: no dialog, menu, popover or toast | Open a share Popover (link and Copy link, per the Popover page), or swap it for an action the demo can run |

Ledger, `component-toolbar`:

| rule | mark | why |
| --- | --- | --- |
| When to use (a canvas's tools, floating) | pass | |
| Avoid “Current tool filled solid” / Prefer “Current tool tinted” | pass | the one solid fill is Create/Share |
| Avoid “Native title tooltip” / Prefer “Tip with its shortcut” | pass | `title` only on the Avoid side |
| Shared delay: once one label shows, neighbours open at once | pass | `TipGroup` per toolbar (`delay` 500, `timeout` 400) |
| Variants: Tools (one pressed), Toggles (any number), Actions (never pressed, one primary) | pass | `multiple` on Toggles; Actions are plain buttons |
| After drawing one shape the tool returns to Select | pass (source) | `place` calls `setTool('select')` |
| Anatomy: panel `radius-full`, `surface-raised`, `shadow-sm` | pass | |
| Anatomy: inset 4 on all four sides | pass | |
| Anatomy: tools `control-md` 32, `radius-full` | pass | |
| Anatomy: gap 2 | pass | |
| Anatomy: height 40 | pass | |
| Anatomy: divider 1 × 16 `line` | pass | |
| Anatomy: current tool tint mixed 16% toward accent, icon `accent-text` | pass | |
| Anatomy figure “Inset”: 4 on every side | pass | |
| States grid: Tool/Current × Default, Hover, Pressed, Focus, Disabled | pass | disabled Current keeps its tint |
| States: arrows move between tools; current carries `aria-pressed`; the letter switches on the canvas | pass | measured; letters in `onKey` on the board |
| Mistake: borders around groups | pass | one hairline separator |
| Mistake: two icon sets | pass | Lucide only, stroke 2 |
| Mistake: uneven inset | pass | 4 all round |
| Copy: tooltip names the tool, then its shortcut, word for word the `aria-label` | pass | “Rectangle R” = `aria-label="Rectangle"` |

Ledger, neighbours on this route:

| reference | rule | mark | why |
| --- | --- | --- | --- |
| component-tooltip | offset from the toolbar's edge, not the tool's | pass | 4 from the panel (`TIP_OFFSET` 8 = inset 4 + 4) |
| component-tooltip | disabled shows none | **fail** (should) | finding 1 |
| component-button | an action runs | **fail** (should) | finding 2 |
| principle-a-shadow-says-how-high | a toolbar floating over a canvas: `shadow-sm` | pass | |
| principle-concentric-radius | toolbar `radius-full`, inset 4, tools `radius-full` | pass | |
| principle-the-faster-way | keys taught on the slow path | pass with a gap | letters shown in every tip; no hold-a-modifier overlay (n/a: single-letter tools, not modifier commands) |
| principle-colour-means-one-thing | accent only for the current tool's icon and the one primary | pass | |
| principle-the-lightest-boundary-that-holds | a canvas needs edges | n/a | “When it doesn't apply: A canvas” |

### /components/tooltip (done)

Shots looked at whole: all four. Probe at 1280 light and 375 dark (Redo's tip open on arrival): no overflow,
no low contrast, nothing under 12px, no non-Lucide SVG, no unnamed control; Lucide 16 (buttons), 14 and 12
(the shortcut glyphs beside 12px text) at stroke 2.

Measured (live “View controls”): Redo's tip 87.8 × 24, 4 above the trigger (gap 4.0 at both widths), `ink` on
`bg` (light `rgb(24,24,27)` / `rgb(247,247,248)`; dark `rgb(236,236,239)` / `rgb(14,15,17)`), 12/16/500,
padding 4 × 8, radius 6, no shadow, positioner `z-index` 400; keys ⇧ ⌘ as Lucide `ArrowBigUp` and `Command`
at 12 with `aria-label`s, then “Z”, dimmed to `bg` at 62% (≈7.0:1 light, ≈5.2:1 dark). Trigger `aria-label`
“Redo” = the tip's name. Delay 500 with a 400ms group timeout (`TipGroup`); `data-instant` drops the fade
between neighbours; focus opens a tip only when the person moved focus by Tab, arrows, Home or End.
Base UI's `TooltipTrigger` opens on hover with `mouseOnly: true`, so a touch never opens one.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | tooltip: “Wait once, then follow the pointer”, both sides (`src/demos/tooltip.tsx` `TooltipGrouping`, `Row` without `openFirst`) | C20: “Every hover demo has a visible state at rest and a keyboard path; on touch, a tap shows what hover shows” | at rest both stages show five bare icons, identical (`tooltip-1280-light.png`); at 375 a tap opens nothing (`mouseOnly`), so a phone reader sees two identical rows; by keyboard both sides open at once on focus, so the 500 ms difference can't be seen either | Give the comparison a played state: a Replay button that walks a pointer along each row (Avoid: a 500 ms wait at each stop; Prefer: one wait, then instant swaps), shown once on arrival; keep live hover for mouse users |
| nit | tooltip: live “View controls” buttons (`src/demos/tooltip.tsx` `IconButton`, no `onClick`) | component-button: “Runs an action now” | Undo, Redo, Zoom in, Zoom out, Fit to screen do nothing on click | Wire them to a small zoom readout, as the canvas on the Toolbar page does, or reuse `CanvasScene` |

Ledger, `component-tooltip`:

| rule | mark | why |
| --- | --- | --- |
| When to use: names an icon-only control, same words as `aria-label`, plus shortcut | pass | |
| Avoid “Each waits 500 ms” / Prefer “One shared 500 ms delay” | pass in source, **fail** C20 | the pair is built right (one `TipGroup` vs one per tip); it can't be seen at rest, by keyboard or on touch (finding 1) |
| Avoid “Raised surface, shadow” / Prefer “Inverse ink, no shadow” | pass | stills, both visible at rest |
| Fades in `duration-fast`, no travel | pass | `transition: opacity var(--duration-fast)`, no translate |
| Anatomy: `ink` on `bg`, inverse | pass | both themes |
| Anatomy: radius 6 | pass | |
| Anatomy: padding 4 × 8 | pass | |
| Anatomy: 12/16/500 | pass | |
| Anatomy: offset 4; from a toolbar's edge, not the tool's | pass | 4 here; 4 from the panel on the Toolbar page |
| Anatomy: delay 500 | pass | `DELAY = 500` |
| Anatomy: layer 400 | pass | |
| One line: name, then shortcut as glyphs, dimmed; above, flips below | pass | `white-space: nowrap`; `side="top"`, Base UI flips |
| States: hover after the delay; keyboard focus shows it; Esc hides | pass (source) | Base UI; focus gated on navigation keys |
| States: a disabled button shows none | n/a here | **fail** on the Toolbar page (Toolbar finding 1) |
| Mistake: anything clickable inside | pass | `pointer-events: none` |
| Mistake: tooltips on labelled buttons | pass | only icon-only triggers |
| Mistake: sentences | pass | names only |
| Copy: name = `aria-label` word for word | pass | Undo, Redo, Zoom in, Zoom out, Fit to screen |
| Copy: sentence case, no full stop, shortcut after the name as glyphs | pass | ⇧⌘Z in Apple's order (`inAppleOrder`) |

## Shared ledger: principles and systems

Marked across all five routes from the measurements above. A failed row points to its route's finding.

| reference | rule | mark | why |
| --- | --- | --- | --- |
| the-lightest-boundary-that-holds | heading and space, a line, a box last; no box in a box | pass | stages are figures (C3); the table's frame is the one region; toast file rows split by hairlines; a canvas is exempt |
| the-lightest-boundary-that-holds | lines only between repeated rows, lighter than the edge | **fail** (should) | the table's pinned-column line when nothing scrolls (Table finding 3) |
| every-line-does-a-job | no eyebrows or taglines; words name a thing, action or state | pass | kind line above titles per C4; demo copy names things |
| space-groups-by-ratio | tighter inside a group than between | pass | bulk bar 12 above its table; tabs panel 16 below the line; toast file rows then 16 to the triggers |
| lightness-first | text 4.5:1, state icons 3:1 | pass | probe on every route; only disabled controls under 4.5 (exempt); tooltip keys ≈7.0 / ≈5.2 |
| grey-until-it-matters | grey carries the screen | pass | accent only on chosen/pressed, primaries, links |
| colour-means-one-thing | hover grey, selection tint; accent one meaning | pass | table hover `fill-hover`, selected `accent-soft`; tabs current in ink; toolbar tint only on the current tool |
| a-shadow-says-how-high | only what covers or floats casts | pass | table none; toolbar `shadow-sm`; toast `shadow-lg`; tooltip none (inverse) |
| concentric-radius | inner = outer − inset | pass | toolbar and toast pills in pills at 4 |
| nothing-shifts | nothing moves unless asked | pass | tabs weight fixed; toast stack moves on the user's action; table sort keeps column widths (`nowrap`) |
| never-too-busy-to-listen | transitions turn from where they are | pass | tab bar, toast offsets, toolbar fills are CSS transitions |
| attention-wears-off | what repeats is brief | pass | hover fills `duration-instant`/`fast`; tab colour 120 |
| hover-forgives / C20 | rest state and keyboard path for hover demos; a tap shows what hover shows | **fail** (must) | Tooltip finding 1; table sort arrows pass (focus shows them, a tap sorts) |
| the-faster-way | keys on the slow path | pass | every icon tip carries its key; table and tabs have none to teach |
| how-waiting-feels | spinner and skeleton thresholds | n/a | no waits |
| error-timing | check on leave; error at its field | n/a | no fields |
| reading-text / C25 | prose tables lighter and fit at 375; 12px floor | pass | Anatomy and Kinds tables fit at 375 (the Table route's Anatomy 343 = 343) |
| system-work-tool | 13 in rows, 12 meta and nothing smaller, 24 controls in rows and toolbars, 32 default | **fail** (should) on 12 | tab counts 11 (Tabs finding 1); rows 13, bulk buttons 24, tools 32 |
| system-consumer-app | 17 body, 44 targets | n/a | no consumer screens on these routes |
| component-icon / C6 | Lucide only, stroke 2, 16 beside 14, 14 in dense, sized to the text | pass | probe on every route; 12 beside 12px headers and tip keys |
| component-icon | Avoid “Icons, named on hover” / Prefer “Icons beside their words” | pass with a note | icon-only only in toolbars of familiar tools, each named by a tip (toolbar When to use: unfamiliar icons need words) |

## Owner's rules (`~/.claude/CLAUDE.md`)

| rule | mark | where |
| --- | --- | --- |
| One grid; icons in one column | **fail** at 375 | table checkbox column and pinned Name drift apart (Table finding 1) |
| Labels start on one vertical line | pass | tab labels on the panel's edge (400 = 400); toast message, rows and triggers share one left edge at 375 |
| Trailing meta right-aligned in one column | pass | table Size right-aligned, header too; bulk actions at the bar's right; toast actions at its right end |
| Lightest boundary that holds; no box in a box | pass with finding | pinned line (Table finding 3) |
| Empty states name the next step | pass | toast Files: “Reset demo” when every file is gone |
| Focus follows the action, never `<body>` | **fail** (must) | toast Undo and Dismiss (Toast finding 1); table Delete does nothing to follow (Table finding 2); toast Delete moves to the next row (pass) |
| A user action needs no Agent gate | pass | Undo, not a confirm, on the Prefer side |
| Accept by hand: feature depth against the reference | **fail** | dead controls: table Move…/Delete (must), canvas Share (should), tooltip view buttons (nit) |

## Gaps in the playbook

1. **Disabled bulk actions.** Table States: “the bar … enables the bulk actions” (so they are disabled until
   a row is chosen). Button mistake: “Disabled with no reason … say why nearby, or leave the button enabled and
   explain on press.” Pick one for bulk bars: Gmail and Linear show the actions only once something is
   selected, which satisfies both.
2. **Tab count size.** Tabs Anatomy says mono 11; the work-tool system says 12px for labels and meta and
   “nothing smaller in a row someone reads”, naming counts among the glanced-at words that still get 12.
3. **Disabled icon-only controls.** Tooltip States: “A disabled button shows none.” A disabled Undo that is
   icon-only then has no visible name for a pointer user. Either keep the rule and accept it (Figma shows no
   tip on a disabled control), or allow the name without the shortcut. The toolbar currently shows it.
4. **C20 against the tooltip page.** C20 asks that a tap show what hover shows; the Tooltip page says touch
   screens never show tooltips, and Base UI opens them for the mouse only. A demo of hover timing needs its own
   rule: a replayed state, not a tap that the real component would never answer.
5. **Inset focus rings.** The table's sort buttons and the tabs draw a 2px `accent` ring (inset or on a
   `::before`) instead of `--focus-ring`, to avoid clipping in a scrolling container. No page says when a ring
   may change shape, or that it must still take its colour from the focus token so a look's ring holds.
6. **Where focus goes when a toast closes.** The Toast page covers F6 into the toasts but not the way back;
   the owner's rule (never `<body>`) and C39 decide it only by extension. The Toast page should name it:
   back to where focus was before, or to the restored object after Undo.
7. **`aria-selected` on table rows.** The Table renders `<tr aria-selected>` inside a plain `table`; ARIA
   supports `aria-selected` on a row only in a `grid` or `treegrid`. The checkbox already carries the state;
   the page could say which pattern it is (a static table with row checkboxes) and drop the attribute, or move
   to `role="grid"`.
