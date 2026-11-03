# Rule review: looks gallery, Ship app (direction A)

Date: 2026-11-03. Method: `.claude/agents/ui-rule-review.md`, changed for this gallery: it is desk-only (hidden under 760px by the owner's decision), so the shots are at **1280 and 1024**, light and dark. Reviewer did not build these screens.

Server: http://localhost:4321 (dev, another session's), through `pnpm shoot` only. Shots: `shots/review2/gallery-app/`. Contrast was probed on every visible text node inside Ship, composited over its real background (WCAG 2.2 ratio). Geometry, focus and states were read with `--eval`. The Astro dev toolbar is ignored.

Source: `src/pages/systems/looks.astro`, `src/components/look/Gallery.astro`, `src/demos/looks/**`.

Binding: `docs/research/audit-2026-11-02/decisions.md`. Old findings checked: `docs/research/audit-2026-11-02/looks.md` (LK#n below).

Written screen by screen as the review went.

Count: **5 must, 10 should, 10 nit.** The machine was busy for long stretches; every shot waited for `~/.machine-pulse/state.json` to read `ok`.

Musts:
- **D1** Dashboard: the 7/14/30 days switch changes nothing on the page.
- **D2** Primer: segmented controls stay pills beside 6px controls (C16; LK#38 recurs).
- **R0** Linear: "Rolling out" on a selected row is 4.16:1 (floor; LK#8 recurs there).
- **R1** Releases: the empty filter state names no next step.
- **L1** Release: after the toast's Undo, focus falls to `<body>`.

## Screen 1: Dashboard (`page=dashboard`)

Shots: `linear-dashboard-1280-{light,dark}.png`, `playbook-dashboard-1024-{light,dark}.png`, `playbook-dashboard-1280-light.png`, `primer-dashboard-1280-light.png`, `zoom-primer-foot.png`.

Measured:
- The document never scrolls (`scrollHeight − innerHeight = 0`); at 1280 × 800 no element overflows, at 1024 only Ship's pane does. LK#1, #2, #47 hold.
- Contrast probe: 0 text nodes under 4.5:1 (Linear light and dark, Primer light: 76 nodes).
- Sidebar rows 13px, page 13px in Linear (the look's `text-md`), figure labels 12px. Segments 73/73/73 wide, track 32 tall.
- **Range switch: clicking "30 days" changes nothing.** After the click the segment is chosen, and the page still reads "Releases a day · 68 in 14 days", "Checks this week · 50 runs", the same figures and the same 14 bars (`dashboard/Dashboard.tsx:23` keeps `range` in state and passes it to nothing).
- Primer: the Range track and thumb are `border-radius: 9999px` while Primer's `--radius-control` is 6px and New release is 6px (C16; LK#38 recurs).
- Linear: the lines between the four figures are 0.5px (`--line-width: 0.5px` used as the grid gap). At 1× (`--scale 1`) the four figures sit at x = 264, 512, 760, 1008, each 248 wide: no gap, so no line is drawn. At 2× they show.
- Primer: the signed-in face is `#f6f8fa` (`fill-control`) on the sidebar's `#f6f8fa`, so its circle vanishes and "MC" floats beside the name (`zoom-primer-foot.png`).

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| D1 | must | Range control, `dashboard/Dashboard.tsx:23-35` | Owner: "the main area reflects the last action"; Every line does a job: a status says "what's true" | 30 days chosen, page still says "68 in 14 days", same bars, "Checks this week" | Make the range drive the data (bars per range, the meta "N in 30 days", figures' notes), or drop the control. |
| D2 | must | Range and every SegmentedControl inside Ship in Primer (`src/ui/SegmentedControl`) | C16: "In a look, controls take the look's `radius-control`"; coordinator: radii come from the look | Track and thumb 9999px beside a 6px New release | Have SegmentedControl read `--radius-control` for the track, and `radius-control − 2` for the thumb. |
| D3 | should | Linear, figure lines (`dashboard/Dashboard.module.scss:15` `gap: var(--line-width)`) | Lightest boundary: "One surface and a line between figures" | 0.5px gap rounds to 0 at 1×: no lines between the figures | Use `max(1px, var(--line-width))` for the gap, or draw the line as a 1px `border-left` in `line`. |
| D4 | should | Primer, sidebar foot face (`Shell.module.scss` `.face`) | Who before what: people "in circles"; a face is a mark in one column | Face `#f6f8fa` on sidebar `#f6f8fa`, no edge | Give the face a step darker than the sidebar (`fill-control-hover` or `line`), or an inset 1px `line` ring. |
| D5 | nit | Bars and line in the accent beside the one accent button | Colour means one thing: "one solid fill of it is left on the screen"; Content exception covers "a chart's categories" | 14 accent bars and an accent line next to the filled New release; one series, not categories | See Gaps: decide whether a single-series chart is content. If not, bars in `ink-muted`/`fill-control-hover` with the hovered bar in the accent. |

What passes, checked against LK: one row of figures, no tiles (LK#3); sections held by headings and space, no card, no shadow (LK#5, #14); Running takes `info` (LK#15); grey face (LK#16); places are links (LK#18, #39); header 48, sidebar 240, rows 32, foot 48 (LK#32); 8 Live = "Live releases 8", 12 = 4+4+4 (LK#35); no hidden donut label (LK#48); "Ship" set in type (LK#11); no bell, no fake ⌘K (LK#12, #13).

## Screen 2: Releases (`page=releases`, `&platform=ios`, selection)

Shots: `linear-releases-1280-{light,dark}.png`, `linear-releases-selected-1280-light.png` (row 1 clicked with a real pointer), `playbook-releases-1024-{light,dark}.png`, `playbook-releases-ios-1024-light.png`.

Measured:
- Bar, header checkbox, title and "1–8 of 12" all start at x = 264 (the pane's 24 inset). Rows 36, header 32 on `surface-sunken`, lines full width (C21). Rollout right-aligned and tabular; Owner and Updated muted; one arrow, on Updated; Updated sorts 2h, 5h, Yesterday… (LK#27 holds).
- Selection: the header box goes `mixed`, the row takes `accent-soft`, the bar swaps in place at the same 48px height (nothing shifts) and reads "1 selected · Pause rollout · Export · ×".
- **Clear selection** (eval, after a real click on row 1): focus lands on the header checkbox "Select all rows" (LK#10 holds). The filter bar returns.
- `platform=ios`: header "iOS", sidebar iOS `aria-current="page"`, the Select shows iOS, 4 rows, "1–4 of 4". The Platform column then reads "iOS" on every row.
- Empty filter (search "zzz", eval): the table keeps its header over an empty body, and the only words are "No releases match" in the foot. No `aria-live` region carries the count or the empty state (the only polite region on the page is empty).
- Bulk **Pause rollout** and **Export** do nothing (`releases/Releases.tsx:86-91`, no `onClick`). On the release page the same Pause runs and offers Undo.
- Contrast: clean in Playbook, Clay and Primer, light and dark, selected rows included; only the disabled "Previous" (2.1–2.8:1) is under, which WCAG exempts. Linear: clean unselected (dark probed, light computed at 4.94:1); **"Rolling out" on a selected row, light: 4.16:1**. (The probe first read colour strings and misread `color(srgb …)` and `oklab()`; every figure here is from the rerun that paints each colour to a canvas pixel.)

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| R0 | must | Linear, "Rolling out" badge on a selected row (`src/demos/looks/Panel.module.scss:5-6` `--info: var(--accent-text)`, `--info-soft: var(--accent-soft)`; row fill `accent-soft`) | SKILL floor: "Text holds 4.5:1… badges… included"; C28 | Pixel-read probe, Linear light, row 1 selected: **4.16:1** (`#4e5ac0` on `accent-soft` laid over the row's `accent-soft`). Unselected it holds (4.94:1, computed from the same values); dark holds (pixel probe); Clay and Primer hold. `linear-releases-selected-1280-light.png`, `zoom-linear-selected-row-light.png` | Darken Linear's light `accent-text` one step (it must hold on two layers of `accent-soft`), or give Ship's info badge an opaque soft (`color-mix(in srgb, var(--accent) 16%, var(--surface))`) so a selected row can't stack it. Re-probe on selected rows in every look (C28). LK#8 recurs here. |
| R1 | must | Empty filter state, `releases/Releases.tsx:162` | Owner: "empty states name the next step"; Combobox: "repeats query, names next step" | Search "zzz": header over nothing, "No releases match" in the foot, no way out named | In the table body: "No releases match “zzz”" and a **Clear filters** button that resets search, status and platform and takes focus. |
| R2 | should | Result count and empty state, `releases/Releases.tsx:161-163` | C29: "Result counts and empty filter states are announced with `aria-live="polite"`" | No live region on the foot; filtering is silent to a screen reader | `aria-live="polite"` on the foot's count span. |
| R3 | should | Bulk Pause rollout and Export, `releases/Releases.tsx:86-91` | Every line does a job (a control names an action it takes); Toast: "Deletes, offers Undo" | Pressing them does nothing; the release page's own Pause works | Pause the selected rollouts and toast "Paused 2 rollouts" with Undo (as the release page does); Export can download a CSV or go. |
| R6 | should | Clay, "Rolling out" beside "Halted" (`Panel.module.scss:5` info = the look's `accent-text`) | Colour means one thing: "`danger` is something wrong"; C13: `info` stays a badge tone | `zoom-clay-releases-badges.png`: Rolling out `rgb(167,77,38)` on `rgb(255,233,225)`, Halted crimson on a near-identical pink; in the donut, Running (clay) sits beside Failed (pink) in dark | Where a palette's accent is warm (Clay; check Moss and Petrol too), take `info` from a cool hue of its own instead of the accent, so progress never reads as failure. See Gaps. |
| R4 | nit | `platform=ios` (and Android, Web), the Platform column | C34: "Drop a secondary line that is the same on every row" | "iOS" on all four rows under a header and a Select that already say iOS | Hide the Platform column while a platform is chosen. |
| R5 | nit | Platform filter, a Select of four | Select: "Two to four options are better all in sight"; Segmented control: "Past five… use a Select" | Any platform / iOS / Android / Web | Keep it (a second segmented control beside the status one would read as one control); record it as a departure. |

LK checks: no box in the pane (LK#5); sort true (LK#27); focus after Clear (LK#10); counts from data (LK#35); Clear selection is `Button label` (LK#12, its Tip checked below).

## Screen 3: Release (`page=release&release=r1`, tabs, comment, Pause, Undo; `release=r5`)

Shots: `linear-release-r1-1280-{light,dark}.png`, `playbook-release-r1-1024-{light,dark}.png`, `linear-release-r1-checks-1280-light.png`, `linear-release-r1-notes-1280-dark.png`, `linear-release-r1-paused-1280-light.png` (after a real click on Pause rollout), `linear-release-r5-1280-light.png`, `playbook-release-r5-1024-dark.png`.

Measured:
- Header: "Releases" is a link (LK#31 holds), then the chevron and "4.2.0 iOS"; the sidebar lights Releases (`aria-current="true"`). Pause rollout is secondary; the one fill is Post comment (LK#29 holds).
- Tabs: ink bar under the current tab, count in a chip, labels on the content's left edge. Checks: icon and words per row, time right-aligned in one column. History says "3 passed, 1 failed" and Checks shows 3 passed, 1 failed (LK#35 holds).
- **Post comment, empty**: stays enabled; pressing it focuses the field (LK#46 holds). **With text**: the comment lands at the top of the history as "Mira Chen commented · now", the field clears, focus stays on the button.
- **Two comments**: React logs "Encountered two children with the same key". Both are keyed `Mira Chen-commented-0` (`release/Timeline.tsx:9`).
- **Pause rollout**: runs at once; the button becomes Resume rollout and keeps focus; Status becomes "Paused"; the toast reads "Paused the rollout of 4.2.0 iOS · Undo · ×", 328 × 40, pill, the look's `surface-raised` and Inter (look values hold).
- **Undo**: Status returns to Rolling out and the button to Pause rollout, and **focus falls to `<body>`** (`document.activeElement` = BODY).
- `release=r5` (Halted): Status Halted, history "Ship halted the rollout at 10%: crash-free fell to 98.4%", and the header has **no action**: nothing resumes, retries or rolls back the halted release.
- Contrast: clean in Playbook, Linear and Clay, light and dark (65 nodes), on the pixel-read rerun.

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| L1 | must | Toast Undo, `release/Release.tsx:27-30` with `src/ui/Toast.tsx:45-50` | Owner: "focus follows the action and never falls to `<body>`"; C39 | After Undo, `activeElement` is BODY | Undo hands focus back to the control the action came from: the header's Pause rollout (keep a ref and `focus({ preventScroll: true })` after `setPaused(false)`). Better in Toast: return focus to the element focused before the toast's action. |
| L2 | should | Halted release, `release/Release.tsx:41` (`r.status === 'Rolling out' &&`) | Owner: every state names "the way back" and the next step; the old Overlays dialog promised "You can resume later" | r5 header is empty; nothing to resume | Show **Resume rollout** (secondary) for Halted, running the same Undo-able path. |
| L3 | should | Comment keys, `release/Timeline.tsx:9` | (bug) Keys must be unique | Two posted comments share `Mira Chen-commented-0`; React logs a duplicate-key error | Give posted events an id (a counter), and key on it. |
| L4 | nit | Checks rows, `CheckList.tsx:20` | C9: "A status icon… has an accessible name, and its state is never colour alone" | The icon is `aria-hidden`; "Screenshot diff · 2 screens changed" never says Failed to a screen reader | Give the icon `aria-label` (Passed / Failed / Running) or lead the state with the word: "Failed: 2 screens changed". |
| L5 | nit | Pause, the history | Every line does a job; owner: the main area reflects the last action | Pausing changes Status and shows a toast, but the history (the open tab) gains no "Mira Chen paused the rollout · now" | Add the event to the history while paused; drop it on Undo. |
| L6 | nit | Title meta "4.2.0 for iOS · Mira Chen" | Every line does a job | Platform and Owner say the same in Properties 40px to the right | Keep one; the meta line could name the stage instead ("Rolling out to 25%"). |
| L7 | nit | Composer face, `release/Release.module.scss` `.composer` | One left edge; the face sits beside what it marks | The MC face lines up with the field's label, 21px above the field | Align the face with the field's top (`align-items` on the field row, or offset by the label's height). |

## Screen 4: Settings (`page=settings`)

Shots: `linear-settings-1280-{light,dark}.png`, `playbook-settings-1024-{light,dark}.png`, `primer-settings-1280-light.png`, `zoom-primer-settings-danger.png`, `zoom-linear-settings-danger-dark.png`.

Measured:
- General and Rollouts are held by their headings and space on one left edge (x = 264); only Danger zone is boxed, in a danger-tinted 1px edge, no shadow (LK#4 holds). Groups 32 apart, a heading 12 above its first field, fields 16 apart.
- Saves itself: Switches for on/off, Radios for one-of-few, no Save button (C31). Default channel is three inline one-word radios (LK#28 holds). Switches sit in one column at the right edge of the 512px column, labels on the left edge.
- Bundle ID is read-only in ink on a grey fill, with a hint "Set by the App Store." (Input: read-only keeps ink).
- "Archive project" (LK#42 holds), secondary danger button.
- Contrast: clean in all four shots (41 nodes each).
- Field radii: Primer text fields and the Combobox are 12px (`radius-lg`), Primer's own field and button radius is 6px (`radius-control` and `radius-md` 6px); Linear fields are 10px where the Linear page measured its text fields at 8px (`radius-md`). `src/ui/Field.module.scss:31` takes `radius-lg` in every look.

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| S1 | should | Text fields, Select triggers, Combobox in Primer (and Linear), `src/ui/Field.module.scss:31` | C16: "In a look, controls take the look's `radius-control`"; coordinator: radii come from the look | Primer field 12px beside 6px buttons (GitHub's inputs are 6px); Linear 10px against its measured 8px | Give looks a field radius (`--radius-field`, defaulting to `radius-lg`), set Primer 6 and Linear 8; or have fields read `radius-md` in looks. See Gaps on C16. |
| S2 | nit | Archive project, `settings/Settings.tsx:52` | Every line does a job; Dialog: confirm only what can't be undone | The button does nothing | Archive with a toast and Undo (it is reversible: "the history stays readable"), or leave it inert and say so in the plan. |

## Screen 5: The gallery toolbar (look, theme, Values and sources, Copy :root)

Shots: `toolbar-look-open-1280-light.png` (real click on the Look select), `toolbar-theme-dark-1280-light.png` (real click on Dark), `toolbar-copy-1280-light.png` (real click on Copy :root).

Measured:
- Toolbar 48 tall; Select 32, Theme segmented 32, **Copy :root 24** (`size="sm"`).
- Look: the list opens below the trigger with the current look checked (no room above for it to open over the trigger: After Linear is the last option). Picking Playbook Clay: the address becomes `?look=playbook-clay&page=releases` (replaced, the place kept), focus returns to the Select's trigger, the pane stays at its scroll.
- Theme: Dark turns Ship dark (`data-theme="dark"` on the panel) and leaves the site and the toolbar light; focus stays on the segment; the address is unchanged.
- Values and sources goes to `/systems/look-linear` for Linear (the look's own page).
- Copy :root: the button becomes "✓ Copied" and **narrows by about 20px, so "Values and sources" slides right** (1033 → 1053 in the shot) while the pointer is on the button. "Copied" stays until another look is picked.
- Toolbar left edge 24 matches the site header; its right edge 12 matches the site header's icons.

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| T1 | should | Copy :root, `Gallery.tsx:88-91` | Where the eye goes: "The button keeps its width, so nothing shifts under the pointer"; Nothing shifts | "Copy :root" → "Copied" narrows the button; the link beside it moves ~20px | Reserve the wider label's width (Button `loadingLabel`-style width reservation, or a fixed min-width). |
| T2 | should | Toolbar row, `Gallery.tsx:88` `size="sm"` | Work tool: "Controls of two heights in one row" | Copy :root 24 beside the Select 32 and the segmented control 32 | `size="md"` (32), or make the row's other controls 24 if the toolbar is meant to be dense. |
| T3 | nit | Copy :root after copying | Every line does a job: a state says "what's true" | "Copied" stays indefinitely; after any later edit to the clipboard it is false | Revert to Copy :root after about 2s, as Radix's Copy Theme does. |
| T4 | nit | Look Select opens below | Select: "Opens over the trigger" | Drops below; the current option (last) can't sit on the trigger without leaving the window | Acceptable fallback (Base UI flips when there's no room); n/a. |

## Spot-checks: Primer and Playbook Clay

Shots: `primer-dashboard-1280-light.png`, `primer-releases-1280-dark.png`, `primer-settings-1280-light.png`, `clay-dashboard-1024-dark.png`, `clay-release-r1-1280-light.png`, `zoom-clay-releases-badges.png`. Contrast clean in all, selected rows included. Findings are folded into the screens above: D2 (Primer pill segments), D4 (Primer face), S1 (Primer field radius), R6 (Clay info reads as danger).

## Old audit (LK) recheck

| LK | State now |
|---|---|
| 1, 2, 47 window scrolls | Fixed: document never scrolls; sidebar list and pane scroll alone; foot stays. |
| 3 stat tiles | Fixed (one row, lines between), but the lines vanish at 1× in Linear (D3). |
| 4 settings cards | Fixed. |
| 5, 14 box in box, shadows at rest | Fixed: no card, no shadow on any reviewed screen. |
| 8 Linear info contrast | **Recurs on selected rows** (R0, 4.16:1). |
| 10 focus after Clear selection | Fixed (select-all). The same failure now appears after Undo (L1). |
| 11, 12, 13 logo, Tips, ⌘K | Fixed. |
| 15 amber for running | Fixed (info), but in Clay info looks like danger (R6). |
| 16 accent avatars | Fixed (grey), but invisible in Primer (D4). |
| 18, 39 places as buttons/spans | Fixed: links with `aria-current`. |
| 27 sort lies | Fixed. |
| 28 Select for three | Fixed (inline radios). |
| 29 two fills | Fixed on Release; Dashboard and Releases keep one (New release). |
| 31 crumb not a link | Fixed. |
| 32 shell anatomy | Fixed: 48 / 240 / 32 / 48, sidebar 13px. |
| 35 counts disagree | Fixed. |
| 36 toolbar wraps | Fixed: one 48px row at 1024 and 1280; heights now mixed (T2). |
| 38 Primer pill segments | **Recurs** (D2). |
| 42 "Archive" | Fixed ("Archive project"). |
| 46 disabled Comment | Fixed (enabled; focuses the field). |
| 48 hidden donut label | Fixed. |
| 6, 7, 9, 17, 19–26, 30, 33, 34, 40, 41, 43–45 | On Components, Overlays, States or Website, which this review didn't cover. |

## Ledger

Each governing reference, read whole in `skill/ui-playbook/references/` (the `.mdx` sources agree on every rule cited). P pass, F fail (finding #), — n/a with reason.

**SKILL floors.** Text 4.5:1: F (R0). One icon library, one stroke, no symbol icons, logo in type: P (Lucide 16 throughout; "Ship" in type; chevron in the crumb is Lucide). Window holds still, panes scroll, `min-height: 0`, named pane with `tabindex="0"`: P (`Shell.tsx:42`, `role="region"`, `aria-label` = place).

**App shell.** Each pane scrolls: P. Every layer gives up min height: P. 100dvh: — (under the site header, `calc(100dvh - 56px)`). Anatomy 48 / 240 / 32 / 48: P. Hairlines at sidebar edge and above foot: P. Pane a Tab stop with an inset ring: P (`.pane:focus-visible` inset outline). Common mistakes: overflow untold P; 100vh P; sticky sidebar P; scrollbar-gutter stable P; account in a scrolling sidebar P; narrow window drops sidebar — (gallery hidden under 760px; Ship's narrowest pane here is 784px). Copy: pane named by place P.

**Badge.** Dot and word: P. Soft not solid: P. Dot for states only: P (status badges only). Anatomy 20 tall, 8 padding, pill, 12/16: P. A badge column has a header: P (Status). Red for new: P. Truncated: P. Badges as buttons: P. Copy adjectives/participles: P. Contrast: F (R0).

**Button.** Filled not outlined: P. Hover in/out timing: — (not re-reviewed; kit). Press 0.97: — (kit). One fill per view: P. Loading: — (no busy action here). Variants by weight: P (Pause secondary, Archive danger, Clear ghost). Icon-only has a Tip: P (`Button label`). Disabled with no reason: P (Previous/Next at the ends, conventional; Post comment enabled). Copy verb + result: P ("Archive project", "Post comment", "Pause rollout"); "Export" — (verb alone, object implied by selection). Same height in one row: F (T2).

**Checkbox.** Whole row target: — (table rows: the row is the label). Mixed for some: P (`mixed` after one row). Anatomy 16, radius-xs: P. Label-less in tables: P (`aria-label` "Select 4.2.0 iOS").

**Combobox (Approvers).** Chips wrap, input keeps room: P. Loose match, first match ready, empty copy: — (not opened in this review). Radius: F (S1).

**Input.** Label above, example inside: P (Name, Bundle ID, Comment). Hint not repeating label: P ("Set by the App Store."). Read-only in ink: P. Search with magnifier, label hidden: P (convention, recorded in LK#43). Anatomy 32 tall: P; radius: F (S1).

**Radio.** Default chosen: P. One Tab stop: — (kit). Column; inline for 2–3 one-word: P. Descriptions say what it means: P. Acts on the spot → segmented: — (settings that save themselves, per C31).

**Segmented control.** Slides one thumb: — (kit). Equal widths: P (73/73/73, 66×4, 54×2). Raised not coloured: P. Words only: P. Height matches buttons beside it: P in Ship (32 by 32 Select). Pill → look radius: F (D2). Segments that do nothing: F (D1). Changing main content: P (filters a list, sets a range).

**Select.** Opens over trigger: — (T4, flips for room). Useful default: P (Any platform, the current look). Up-down chevrons: P. Check on current, fill for keyboard: P. Two to four options in sight: — (R5, recorded).

**Switch.** Takes effect: P (no Save). Label names the setting: P. Settings row trailing column: P. No On/Off text: P.

**Table.** Numbers right, tabular, header too: P. Lines not stripes: P. One arrow: P. Secondary muted: P (Owner, Updated). Name pinned: — (no sideways scroll at 784px+). Anatomy header 32 sunken, row 36, line between rows none after last: P. Selected `accent-soft`: P. Bar names the count: P. Status as colour alone: P. Actions per row: P (none). Name truncated: P. Row click vs checkbox: P (name link opens, box selects). Empty cells en dash: P (Properties "–"). Same value every row: F (R4).

**Tabs.** Weight stays: P. Ink bar: P. One row: P. Count in a chip: P. No side padding, on the content's edge: P. Single tab, reset tabs: P. Copy nouns: P.

**Toast.** Undo instead of asking: P (Pause). Colour on icon only: P (neutral). Three at most: — (one). Width 320–440: P (328). Pill, 40 tall: P. Look values: P (Inter, look's `surface-raised`). Copy past tense with object: P. One verb action: P. Toast not the only feedback: P (Status changes). Focus after its action: F (L1).

**Tooltip.** Names icon-only control, same words: P (by source, `Button.tsx:71`). Not on labelled buttons: P.

**Icon.** One library, 16px, text colour: P. Status icons named: F (L4).

**Work tool.** 13–14px body, 12px labels: P (Linear 13 everywhere; Playbook 14 body, 13 sidebar). Controls 32 / 24: F (T2). Targets ≥ 24: P (Clear selection 24×24). 4px grid: P. Radius 4–10 on fields: F in Primer (12, S1). Surfaces white or grey, one step: P. One accent: P, with D5 open. Rows not 10–11px grey: P. Brand colour as panel: P. Tagline under title: P.

**Looks (Playbook, Linear, Primer pages).** Colours from the look: P (info re-set on the panel; toast, badges, buttons, charts read the look). Type from the look: P (Inter in Linear and its toast; Geist only in the gallery chrome). Radii from the look: F (D2, S1). The page's contrast promise ("text holds 4.5:1… against `accent-soft` laid on each" surface): F for Linear on a selected row (R0).

**The lightest boundary that holds.** Sections by heading and space: P. Lines between repeated rows only: P. One box where it differs: P (Danger zone). No box in box: P. Figures one row, one surface: P, F at 1× in Linear (D3). Indent only real hierarchy: P (no indents; Platforms rows keep the icon column).

**Space groups by ratio.** Headings nearer what they head: P (12 below, 32 above). Groups 16 apart in the sidebar, heading 4 above rows: P. One left edge for labels: P (sidebar labels x = 40 with or without icons; page x = 264).

**Concentric radius.** Toast pill-in-pill: P. Danger box 10–12 with a 6px/pill button at 16 inset: P (inset larger than the radius). Segmented thumb in track: P in pills; F in Primer as a consequence of D2.

**A shadow says how high.** No shadow at rest on any surface in Ship: P. Toast and Select list cast one: P.

**Colour means one thing.** Accent only on the primary action and selection: P, D5 open. Hover neutral: P. Red only for wrong: F in Clay (R6). Accent text is a link: P (row links are ink, underline on hover, C13).

**Grey until it matters.** Chrome grey: P. Status colours with their words: P. Content exception: — (D5, see Gaps).

**Every line does a job.** A status says what's true: F (D1, T3). Same words every row: F (R4). Duplicate facts: F nit (L6). No *Your*, no *please*: P. One word for one thing: P ("release", "rollout").

**Who before what.** Faces grey, never accent: P. Face visible as a circle: F in Primer (D4).

**Where the eye goes.** The change answers where the click was: P for Pause (button becomes Resume), F for Copy (T1). Information scent: P (place names, crumb).

**Nothing shifts.** Selection bar swaps at the same height: P. Copy button narrows: F (T1). Scrollbar gutter stable: P.

**Owner's rules (CLAUDE.md).** One grid, one left edge: P (264 for title, bar, table, foot, page). Trailing meta right-aligned in one column: P (sidebar counts, Recent times, Check times, legend counts). Lightest boundary: P. Empty states name the next step: F (R1). Focus follows the action, never `<body>`: F (L1); P for Clear selection, look switch, Pause, empty Post. Main area reflects the last action: F (D1); P elsewhere. Way back: P (crumb link, sidebar, browser Back per the plan). Frame time: — (C43, out of scope this round). Reference depth (Linear, Vercel, Play Console): Halted with no Resume falls short (L2).

## Gaps in the playbook

1. **C16 versus fields.** C16 says controls in a look take `radius-control`, but Linear's `radius-control` is 9999px (pills) while its text fields are 8px. Applied literally, Linear's fields would become pills. Fields need their own look value (or C16 should say "buttons and segmented controls take `radius-control`; fields take `radius-md`").
2. **`info` in a warm palette.** C13 keeps `info` as a badge tone and the gallery sets it to the look's `accent-text`. In Clay that accent is a rust that sits next to `danger`'s crimson, so "Rolling out" reads as a failure. No page says where `info` comes from when the accent is warm.
3. **Contrast on stacked tints.** The look pages promise text holds on `accent-soft` laid on each surface, but a badge's `*-soft` on a selected row's `accent-soft` is two layers, and no page or probe covers it. C28 should name "badge on a selected row" as a surface.
4. **A single-series chart in the accent.** Colour means one thing and Grey until it matters exempt "a chart's categories" as content. A one-series bar chart in the accent beside the one accent button isn't categories; no page says whether it is content (accent allowed) or chrome (grey).
5. **Sub-pixel hairlines.** Linear's `line-width` is 0.5px. Used as a grid gap it vanishes at 1×; as a border Chrome rounds it to 1 device pixel. The lightest-boundary page could say a line drawn as a gap needs `max(1px, …)`.
6. **Focus after a toast's action.** C39 covers removed rows. A toast's Undo removes the focused button by design; no page says where focus goes (the Toast page could say: back to what was focused before the toast took focus).

