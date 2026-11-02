# Rule review: In practice (Post, Track)

2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Routes:

- `/practice/mail`: the page arguing for Post, with Post embedded and the Arrivals compare.
- `/practice/mail/app`: Post, full window.
- `/lab/track`: Track, full window.

Source read: `src/demos/post/`, `src/demos/track/`, `src/pages/practice/mail.mdx`, `src/pages/practice/mail/app.astro`, `src/pages/lab/track.astro`, plus `src/ui/Tooltip.tsx`, `src/ui/Menu.tsx` where a rule depended on them.

## Shots

All shots are in `shots/review/practice/`.

**Base shots.** Each route at 1280 and 375, light and dark, full page:

- `practice-mail-{1280,375}-{light,dark}.png`
- `practice-mail-app-{1280,375}-{light,dark}.png`
- `lab-track-{1280,375}-{light,dark}.png`

**Post states:**

- `post-open-1280-{light,dark}.png`: a conversation open.
- `post-compose-1280-light.png`: the composer.
- `post-context-1280-light.png`: the row's context menu.
- `post-hover-1280-light.png`: row actions on hover.
- `post-newmsg-hover-1280-light.png`: the New message tooltip.
- `post-archive-1280-light.png`: Archive folder.
- `post-nomatch-1280-light.png`: search with no match.
- `post-toast-1280-light.png`: archive toast.
- `post-open-375-light.png`: a conversation open on a phone.
- `post-sheet-375-{light,dark}.png`: the new-message sheet.
- `post-foldermenu-375-light.png`: the folder choice menu.
- `practice-mail-sheet-375-light.png`: the new-message sheet, embedded.

**Track states:**

- `track-open-1280-{light,dark}.png`: an issue open.
- `track-status-1280-light.png`: the status picker.
- `track-assignee-1280-light.png`: the assignee combobox.
- `track-cmd-1280-light.png`: the command menu.
- `track-filter-1280-dark.png`: the filter pull-down.
- `track-toast-1280-light.png`: the delete toast.
- `track-open-375-light.png`: an issue open on a phone.
- `track-drawer-375-dark.png`: the sidebar drawer.
- `track-375-header.png`: the header at 375.
- `track-row-unassigned-1280-light.png`: an unassigned row.

The dark pill at the foot of every shot is Astro's dev toolbar, not the app.

**How states were driven.** Multi-step states (open, then act) were driven with a Playwright script at 2×. It lives at `/private/tmp/claude-501/-Users-polar-code/c3da3f51-7c2d-49c0-86c1-49aa8f6db2db/scratchpad/aud-practice/steps.mjs`. Single-step states used `pnpm shoot --hover/--click`.

## 1. Findings

Counts: **4 must, 12 should, 11 nit.**

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| 1 | must | `/practice/mail/app` and `/practice/mail` at 375: New message sheet. `Shell.tsx:182` (`Sheet.Area`), `Shell.module.scss:141` `.sheetArea` | Sheet, Kinds: "Focus stays where it is, or moves in when opened from a button". Owner rule: focus follows the action. | Focus goes into the To field. The browser then scrolls the overflow-hidden `.sheetArea`: `scrollTop` 248 at full screen, 208 embedded. The sheet's top ends up at −216px (−115 embedded). Its header, To and Subject sit above the window, and the focused field is at y = −134. Only the format bar and Send show, with 250px of nothing under them. See `post-sheet-375-{light,dark}.png` and `practice-mail-sheet-375-light.png`. | Focus the field with `preventScroll: true`, or give `.sheetArea` `overflow: clip` so focus can't scroll it. Check again at 375 in both routes. |
| 2 | must | Post: Archive from a row's context menu (`Line.tsx:113`). Track: Delete in the issue panel (`Panel.tsx:131`). | Owner rule: "focus follows the action and never falls to `<body>`". | After the action, `document.activeElement` is `<body>` in both apps. See `post-toast-1280-light.png` and `track-toast-1280-light.png`. | Put focus on the row that takes the archived or deleted one's place, or on the list when none is left. Do the same for hover-action Archive and bulk Archive. |
| 3 | must | Track: status, priority and label pickers (`PickMenu.tsx:22-30`) and the assignee combobox (`AssigneePicker.tsx:55`) | Menu: "Prefer: Check in a leading column". Combobox anatomy: "`accent-text` check in the leading column". | The check sits at the row's right end (Backlog ✓, Yuki Mori ✓). The checks line up only because the popup has a fixed width. See `track-status-1280-light.png` and `track-assignee-1280-light.png`. | Move the check into a 16px leading column before the status icon or face, as Post's folder menu and `ui/Menu` already do. |
| 4 | must | Post: the search field (`Find.module.scss:2-28`) | Input anatomy: radius `radius-lg` 10, edge `line-strong`, focus means "the edge turns accent, nothing around it". Work tool, Common mistakes: "pill-shaped fields". | Measured: `border-radius: 9999px`, fill `rgba(24,24,27,.06)`, `border-width: 0`. On focus a 2+2px `--focus-ring` is drawn around it (`post-nomatch-1280-light.png`). | Radius 10, a 1px `line-strong` edge, no fill. On focus, recolour the edge to the accent and draw no ring around it. |
| 5 | should | The current place's icon. Post: `Shell.module.scss:139-141`. Track: `Sidebar.module.scss:142`. | Icon, States: "on hover and when current, the row's full ink, with no colour of its own". | The current folder or place's icon is `rgb(0,102,204)` (dark: `rgb(125,187,255)`). Every other icon is `ink-muted`. | Use `ink` for the icon. The raised row and the weight already mark where you are. |
| 6 | should | Both apps: every Lucide icon (`ic = { strokeWidth: 1.5, nonScalingStroke: true }` in Shell, List, Line, Find and Track's Shell, Header, Row) | Icon anatomy: "Line: Lucide's own, 2 on its 24 grid, 1.33 at 16". `absoluteStrokeWidth` "turns a 16px icon as heavy as SemiBold". | The SVG has `stroke-width="1.5"` with `vector-effect="non-scaling-stroke"`, so the line is 1.5px at 16px. That is 13% heavier than the text's stems. | Drop `strokeWidth` and `nonScalingStroke` and let Lucide scale its own line. |
| 7 | should | Track: label chips in rows (`Row.module.scss:117-127`) | Badge anatomy: "Neutral: `ink-muted` on `fill-control`". Button: "A border is how an empty field says it can be typed in". Every line does a job: "One word for one thing". | In rows, labels are outlined pills (`box-shadow: inset 0 0 0 1px var(--line)`, transparent fill). In the issue panel the same labels are filled grey (`track-open-1280-light.png`). The same thing is drawn two ways. | Draw row labels as the panel does: `fill-control`, no edge. |
| 8 | should | Track: rows with no assignee or no priority (`Row.module.scss:153-155`) | Who, before what: "the column is always filled, in every row and every state". | The no-one ring and the no-priority mark have `opacity: 0` at rest. SHOP-55, 58 and 44 show a gap in the face column, and SHOP-52, 49 and 50 a gap in the priority column. See `lab-track-1280-light.png` and `track-row-unassigned-1280-light.png`. | Keep the dashed ring and the no-priority mark visible at rest, quiet but present. |
| 9 | should | Track: the no-priority `Ellipsis` (`icons.module.scss:20`). Post: the starred mark (`List.module.scss`, `.starred`). | Lightness first: "Control borders, focus rings, icons that carry state: 3:1". | `ink-disabled` `#a8a8b0` on white is about 2.4:1; `#4a4b52` on `#16171a` is about 2.0:1. The star's stroke `oklch(0.72 0.15 70)` on white is about 2.5:1. | Use `ink-muted` for no priority. Darken the star's stroke to L ≤ 0.67, keeping the yellow fill. |
| 10 | should | Empty states. Post: `List.tsx:175` ("You’re all caught up." / "Nothing in Starred."). Track: `AssigneePicker.tsx:48` ("No one called “x”"). | Owner rule: "empty states name the next step". Every line does a job: empty state is "What goes here, and the action that adds it". Combobox: "Prefer: Repeats query, names next step". | Neither line names a next step. Post's no-match search state does it right ("Search all mail"). | Post: one line about what lands here, plus New message (Inbox) or a way to Inbox. Assignee: name a next step, e.g. "No one called “x”. Invite them from Members." |
| 11 | should | Post: the New message button at ≥ 761px (`Shell.tsx:154`) | Tooltip, Common mistakes: "Tooltips on labelled buttons". `ui/Tooltip.tsx:40`: leave `label` out on a labelled button. | Hovering shows a tooltip reading "New message" under the button that already says "New message" (`post-newmsg-hover-1280-light.png`). | Pass `label` only below 761px, where the button is icon-only, or keep the Tip keys-only. |
| 12 | should | `/practice/mail`: ten "Show" buttons (`Example.tsx:102`) | Every line does a job: "A button that names its result reads on its own, in a screen reader’s list of controls". | 10 buttons share the accessible name "Show". None has `aria-describedby` or `aria-label`. | Point `aria-describedby` at each decision's text, or name it, e.g. "Show 3". |
| 13 | should | `/practice/mail`: the embedded app frame (`Example.module.scss:43`) around the main card (`Shell.module.scss`, `.main` radius 18) | Concentric radius: "Inner radius = outer radius − inset − border". | The frame is 10px with a 1px border. The main card is 18px, 8px in from the frame. 10 − 8 − 1 = 1, so the card's corner swells inside the frame's at the top right (`practice-mail-1280-light.png`). | Give the frame 18 + 8 + 1 = 27px, or give the embedded card the frame's corner minus the inset. |
| 14 | should | `/practice/mail` at 375: Arrivals switch (`Arrivals.tsx:59-60`) | Segmented control, Copy: "nouns, one word where possible, of similar length". Mistakes: "labels truncate". | The labels read "New mail pushes rows…" and "New mail waits behind…", cut off (`practice-mail-375-light.png`). | Shorter labels, e.g. "Pushes rows" and "Waits". |
| 15 | should | Track: the PR mark (`PrMark.tsx:17-18`, `PrMark.module.scss`) | Colour means one thing / Badge: colour never the only signal (WCAG 1.4.1). Toolbar: "Avoid: Native title tooltip". | Open, in trouble and closed share one glyph per state and differ only in colour (green, red or grey). What went wrong is only in a native `title`. | Give trouble its own shape, from Lucide. Name it in a `Tip`, not `title`. |
| 16 | should | Track: group headers (`Group.module.scss:6-18`) | The lightest boundary that holds: "A section of a page is held by its heading and the space around it". Start at the lightest and go down only when it doesn't hold. | Each status group is a full-width tinted band (accent 3% grey) with a hairline above. Two boundaries hold one heading. | Try heading plus space, with the hairline only where folded groups stack. If the band stays because Linear has it, record that as a departure (see Gaps). |
| 17 | nit | Track: status and priority pick menus | Menu, Choice: "No icons, no shortcuts. Values are words". | Each value carries its status or priority icon (`track-status-1280-light.png`). | Keep them as the values' shapes, but record the departure. See Gaps. |
| 18 | nit | `/lab/track` at 375: the header tabs | Tabs: "the cut-off label says there’s more". | The tab list (65–339) overflows its root (73–331) by 8px on each side. "Backlog 8" is cut flush against Filter at x = 339, with no gap (`track-375-header.png`). | Keep the list inside its root and leave `space-2` before Filter. A fade on the cut edge would also help. |
| 19 | nit | Sidebar rows. Post: `Shell.module.scss`, `.folder` height 34. Track: nav items 28. | App shell anatomy: "Sidebar rows: `control-md` 32". | Measured 34 and 28. | 32 in both. |
| 20 | nit | Top bars. Post list bar: 56. Track header: 44. | App shell anatomy: "Title bar or toolbar: `toolbar-height` 48". | Measured 56 and 44. | 48, or record the departure. |
| 21 | nit | Track: tabs (`Header.module.scss:46-49`) and title (`:22`) | Tabs anatomy: "Tab height 40; Label 14 / 20". Work tool: body 14, 13 in sidebars and dense lists. | Tabs measure 13px and 43–44 tall. The title is 15px, off the scale. | Tabs at 14px. Title at 14 or 16. |
| 22 | nit | Post: list rows (`List.module.scss`, `.line` `border-radius: 12px`) | Work tool: "Radius 4–10px on fields, menus and panels". | 12px is not a token, and is outside the range. | `radius-lg` 10, which is also 18 − 8 against the card. |
| 23 | nit | Post: the new-mail pill (28 tall). Track: the updates pill (30 tall). | Work tool: "Controls 32px by default; 24px in toolbars and table rows". | Measured 28 and 30. | 32, or 24. |
| 24 | nit | Post: the floating conversation toolbar | Toolbar anatomy: "Gap between tools: `space-0-5` 2". | Buttons at x = 248, 284 and 320, each 32 wide: a 4px gap. | 2px. |
| 25 | nit | Placeholders: "Type a command…", "Assign to…", "Leave a comment…", "Reply to Mira…" | Combobox / Input, Copy: "Placeholder: what you can type, not an instruction to type". | See `track-cmd-1280-light.png`, `track-assignee-1280-light.png` and `post-open-1280-light.png`. | "Commands or issues", "Name", and so on. Or leave them, and record mail's and Linear's convention. |
| 26 | nit | Track: the command menu (`CommandMenu.tsx`) | Menu, Mistakes: "A group label that repeats the trigger". Every line does a job. | One group, labelled "Track", the app's own name. A "No issue selected" chip shows with nothing selected. | Drop the label while only one group shows. Show the chip only when there is a target. |
| 27 | nit | Track: the time and sub-issue cells (`Row.tsx:100,117`) | Toolbar: "Avoid: Native title tooltip". | `title=` on `<time>` and on the steps count. | `Tip`. |

## 2. Ledger

P = pass, F = fail (finding #), n/a = doesn't apply, with the reason.

### System: Work tool

The numbers:

- Body 14/20, 13 in dense lists: **P**. Post rows 14, snippets 13. Track rows 14.
- Labels and meta 12: **P**. Times, section heads and counts are 12.
- Text contrast 4.5:1: **P**. `ink-muted` 6.4:1 on white, 5.9 on accent-soft, about 5.8 on the desk. Dark 8.7.
- Controls 32/24/40: **P**, except the pills, which are **F 23**.
- Targets ≥ 24: **P**.
- Spacing on a 4px grid: **P**.
- Radius 4–10 on fields and panels: **F 4, F 22**.
- Surfaces white or plain grey: **P**. The desk is a 4% accent grey, within Lightness first's tint range.
- One accent on the primary action, selection, focus and status: **P**. The current icon is **F 5**.
- Icons 16, one library, the text's colour: library **P**, stroke **F 6**, current colour **F 5**.

Common mistakes:

- Rows in 10–11px grey: **P**.
- Brand colour as a panel: **P**.
- Tagline under the title: **P**.
- Large radii on dense parts: **F 22** (12px rows), **F 4** (pill field).
- Two heights in one row: **P**. The Post bar is 32/32/32. The Track header buttons are 24 and the segmented control 32, which is the toolbar exception.

### System: Playbook look

- Variables used: **P**. Tokens throughout.
- Geist: **P**.
- The palette's accent `#0071e3`: **P**.

### App shell

- Window holds still, panes scroll: **P**. `.frame` is `100dvh` and `.rows` `overflow-y:auto` in both apps.
- `min-height: 0` on every layer: **P**. `.main`, `.page`, `.issues` and `.sheetArea` have it.
- `100dvh`: **P**.
- Anatomy, window: **P**.
- Anatomy, toolbar 48: **F 20**.
- Anatomy, sidebar 240: Track **P**; Post 232, nit, folded into 19/20.
- Anatomy, sidebar rows 32: **F 19**.
- Anatomy, sidebar foot 48: Post "UI Playbook" link at the foot **P**.
- Hairline at the sidebar edge: Track **P**. Post uses the raised card instead: **P**, Shadow says how high names Post's desk as its case.
- Pane is a Tab stop with a name: **P**. The list has `aria-label` "Conversations" and focusable rows.
- Mistakes, overflow with nothing above told: **P**.
- Mistakes, `100vh`: **P**.
- Mistakes, sticky sidebar: **P**.
- Mistakes, scrollbar jump (`scrollbar-gutter`): n/a. Overlay scrollbars on macOS; not seen.
- Mistakes, account in a scrolling sidebar: **P**.
- Copy, panes named by content: **P**.

### Button

Avoid/Prefer:

- Filled not outlined: **P**.
- Hover in at once, out soft: **P**. From `ui/Button`.
- Press 0.97: **P**. From `ui/Button`.
- One fill per view: **P**. New message, Send.
- Loading waits 300ms: n/a. No loading button seen.

Anatomy:

- Height 32/24: **P**.
- Padding 12: **P**.
- Pill: **P**.
- Icon gap 4: **P**.
- Label 14/500: **P**. New message is 14/500.
- Tooltip equals `aria-label` on icon-only buttons: **P**.

Mistakes:

- Shadow to lift: **P**.
- Colour as rank: **P**.
- Disabled with no reason: **P**. Previous and Next in Track's panel are disabled at the ends; the reason is evident.

Copy:

- Verb that names the result: **P**. Send, Comment, Clear filters, Search all mail. "Show" is **F 12**.
- Sentence case: **P**.

### Icon

- Symbol isn't an icon: **P**. All Lucide. `⌥` and `⌘` render as Lucide inside Tip.
- Emoji: **P**.
- Icons beside words for navigation: **P**.
- 16 beside 14: **P**, except the Track priority icons, which are 14 in 14px rows, close to the 13px-row value. **P**.
- Not drawn for the occasion: **P**.

Anatomy:

- Line 1.33: **F 6**.
- Gap 8: Post folders use 12. Nit, not filed separately.
- Colour `currentColor`, ink when current: **F 5**.

States:

- Disabled takes ink-disabled: **P**.

Mistakes:

- Typed symbols: **P**.
- Two libraries: **P**.
- Navigation as icons alone: **P**.
- Icon button without a name: **P**.
- 24px icons: **P**.
- Bigger icon for a target: **P**.

Copy:

- Tooltip equals `aria-label`: **P**.

### Input

- Check on leave: n/a. No validated field.
- Error under the field: n/a.
- Label above, example inside: Post search has `aria-label` and placeholder "Search mail", the convention for a search field. **P**.
- Width says how much: **P**. Search is 320.
- Leading magnifier on search: **P**.
- Trailing clear button: **P**.

Anatomy:

- Height 32: **P**.
- Radius 10: **F 4**.
- Edge `line-strong`: **F 4**.
- Focus recolours the edge: **F 4**.
- Text 14, 16 on touch: Post's search is 14 at 375. Not filed: the window is not a touch device.

Mistakes:

- Hint repeats the label: n/a.
- Clearing on error: n/a.
- Read-only drawn disabled: n/a.

Copy:

- Placeholder is an example, not an instruction: **F 25**.

### Menu

Kinds:

- Context menu (Post row): no title **P**; familiar icons, all rows **P**; no shortcuts **P**; unavailable items hidden **P** (Archive only in Inbox).
- Pull-down (Track Filter): icons on every row **P**; submenus, one level **P**.
- Choice (Post folder menu): radio items, checkmark leads **P**; no icons **P**; closes on pick **P**.
- Choice (Track status and priority): check leads **F 3**; no icons **F 17**.

Details:

- Icons on every row or none: **P**.
- Context menu without shortcuts: **P**.
- Highlight at 9%: **P**. `fill-active` is 0x17, about 9%.
- Destructive stays red: n/a. No destructive item.
- Checkmark leads: **F 3**.
- Shortcuts as bare symbols: n/a. None in menus.
- Grows from the trigger: **P**. `ui/Menu`; the context menu opens at the pointer.

Anatomy:

- Popup radius 10, inset 4, item 32, label 13, `surface-raised` with `shadow-md`: **P**, judged from `post-context` and `track-status`.

Mistakes:

- One or two items: **P**.
- Group label repeats the trigger: **F 26**.
- Destructive mid-list: n/a.
- Closing on a toggle: **P**. Labels use `closeOnClick={false}`.
- Nested submenus: **P**.

Copy:

- Verbs or values: **P**.
- Ellipsis: **P**.
- Sentence case: **P**.

### Popover

All n/a: no popover opened in the states shot. The recipients disclosure ("to you, Priya and Jonas") wasn't opened. Gap in coverage.

### Tooltip

- One shared delay: **P**. `TipGroup` in Post's bar tools.
- Inverse, no shadow: **P**. From `ui/Tooltip`.
- Anatomy: **P**, from `ui/Tooltip`.
- Shows on keyboard focus: **P**, from `ui/Tooltip`.

Mistakes:

- Clickable content: **P**.
- On labelled buttons: **F 11**.
- Sentences: **P**.

Copy:

- Words equal the `aria-label`: **P**.

### Toast

- Undo instead of asking: **P**. Archive and Delete both offer Undo.
- Colour on the icon only: **P**. Neutral.
- Three at most: n/a. Not stressed.

Anatomy:

- Pill: **P**. Measured `9999px`.
- 40 tall: **P**. Measured 40.
- Width 320–440: **P**. Measured 350.
- Bottom centre over the main area: **P**.

Mistakes:

- Errors that vanish: n/a.
- Toast as the only feedback: **P**. The row leaves too.
- Links in it: **P**.
- On page load: **P**.

Copy:

- Past tense with the object: **P**. "Archived “Q4 roadmap: final draft”", "Deleted SHOP-65".
- One-verb action: **P**. Undo.

### Checkbox

- Whole row is the target: n/a. Bare selection boxes; the table pattern.
- Mixed dash on select-all: **P**. `List.tsx`, `indeterminate`.

Anatomy:

- 16 box, line-strong edge, accent when on: **P**. From `ui/Checkbox`.

Mistakes:

- All n/a: no form checkboxes.

Copy:

- `aria-label` "Select …": **P**.

### Segmented control

Track's List/Board control:

- Thumb slides: **P**. From `ui`.
- Equal widths: **P**. Icons, 36 each.
- Raised, not coloured: **P**.
- All icons with tooltips: **P**.
- Height matches its neighbours: **P**.
- `aria-label` "Show as": **P**.

Arrivals switch on `/practice/mail` at 375:

- Label length: **F 14**.

Mistakes:

- Label repeats the options: **P**.
- Six segments: **P**.
- Segments that act: **P**.
- Changes the main content: Track's view switch changes the list region. It sits in the toolbar, where Linear puts it. **P**, with a note.

### Tabs

- Weight stays put: **P**. Weight 500 throughout.
- Bar in ink: **P**.
- One row that scrolls: **P**. Cut edge **F 18**.
- Count in a quiet chip: **P**. Mono 11, `surface-sunken`, pill, 18 tall.

Anatomy:

- Height 40, label 14: **F 21**.
- Bar on the line: **P**.
- No side padding: **P**.

Mistakes:

- Hide required input: n/a.
- Controls above that act on one panel: **P**. Filter acts on every tab.
- Tabs that reset: **P**. Scope is kept in the store.
- Single tab: **P**.

Copy:

- Nouns, sentence case, parallel: **P**. All issues, Active, Backlog.

### Combobox

Track assignee picker, Post recipients:

- Loose match: not tested. n/a.
- First match ready for Enter: **P**. The current value is highlighted on open; `aria-activedescendant` is set in the command menu.
- Matched letters bolder: not tested. n/a.
- Empty list repeats the query and names a next step: query **P**, next step **F 10**.

Anatomy:

- Current option check leads: **F 3**.
- List as a menu: **P**.
- At most nine rows: **P**.

Mistakes:

- Accepts text not in the list: **P**.
- Opens empty: **P**. Shows everyone.
- Sorts by score: not tested.
- Chips push the field: n/a.

Copy:

- Placeholder: **F 25**.
- Empty state: **F 10**.

### Dialog

Track command menu:

- Confirm kind: all n/a.
- Task kind, focus in the first field: **P**. The command input.
- Enter submits: **P**. `aria-activedescendant` on the first command.
- Grows in place: **P**. It sits where it opens.

Anatomy:

- `radius-xl`, `shadow-lg`, scrim: **P**, from `track-cmd`.
- Title: the popup has `aria-label` "Commands" and no visible title. The convention for a command palette; n/a.

Mistakes:

- Confirm the undoable: **P**. Delete is immediate, with Undo.
- Dialog on arrival: **P**.
- Explaining buttons: **P**.
- Dialog that scrolls: **P**.

### Badge

Track labels, applied as the neutral kind:

- Words carry it: **P**.
- Soft, not solid: **P**.
- No dot on attributes: **P**.

Anatomy:

- Height 20: **P**. Measured 20.
- Padding 8: **P**.
- Pill: **P**.
- 12/500: weight not measured; 12 **P**.
- Neutral fill: **F 7**.

Mistakes:

- Truncated badges: **P**. Labels stay whole while the title gives way.
- Badges as buttons: **P**.

### Table

The table inside Post's Q4 message:

- Numbers right-aligned: n/a. Dates, not quantities.
- Lines, not stripes: **P**.
- One sort arrow: n/a.
- Secondary columns muted: **F**, minor and not filed: a mail body is content.
- Name pinned: n/a.
- Frame: 1px line, radius 10, no shadow: **P**.

Track's issue list is a list, not a table, so the table's rows and lines are n/a there.

### Toolbar

Post's floating conversation tools:

- Current tool is a tint: n/a. No modes.
- Every tool named by a tooltip: **P**.
- Panel: pill, `surface-raised`, shadow, inset 4, 40 tall: **P**. Measured 40, padding 4.
- Gap 2: **F 24**.
- Mistakes, borders around groups: **P**.
- Mistakes, two icon sets: **P**.
- Mistakes, uneven inset: **P**.

Post composer format bar:

- Hairline dividers between groups: **P**.

### Card

The Q4 attachment card and the "Previous · After Linear" card on the page:

- Static card doesn't lift: **P**. The attachment opens; Previous is a link.
- Frame: radius not measured. Shot shows radius about 10 with a line edge, closer to Table's frame than Card's 18. n/a, as a file chip rather than a card in a browsed set.
- Mistakes, buttons all over: **P**.
- Mistakes, text on the stage: **P**.

### Sheet

Post's composer at 375:

- Standard sheet, list in use when lowered: **P**, by code: the BAR snap point.
- Focus moves in from a button: **P** in intent; broken by **F 1**.
- What it did shows behind it: n/a. Not tested.
- Drag, scroll, fling: not tested.
- Escape closes: **P**, by code.
- Anatomy, header 44 with actions trailing: hidden by **F 1**.
- Copy, title "New message": **P**.
- Mistakes, modal over a map: n/a.

### Select

- Post's folder trigger: a Menu choice, not a Select. See Gaps on the chevron.
- All other rules: n/a.

### Principles

**Colour means one thing.**

- Accent only on the action and the selection's tint: **P**.
- The current icon in accent: **F 5**.
- Hover not selection: **P**. Hover is `fill-hover`, chosen rows `accent-soft`.
- Red means wrong: **P**. PR trouble is red, with **F 15**.
- Accent text is a link: **P**. Decision links on the page.

**Grey until it matters.**

- Labels grey: **P**. Track labels are grey.
- Decoration: **P**. No slogans.
- The star's yellow and the highlighter mark: content and state. **P**.

**Lightness first.**

- Text 4.5:1: **P**.
- State icons 3:1: **F 9**.
- Greys tinted ≤ 0.046: **P**. The desk is a 4% accent mix.

**The lightest boundary that holds.**

- Post sections held by space: **P**.
- Post rows parted by space and a hover surface: **P**.
- No box per section: Track bands **F 16**.
- No box in a box: the `/practice/mail` Compare stage holding a bordered mock inbox. See Gaps.
- Indent only for real hierarchy: **P**. The Track team's children, under a visible chevron.

**Space groups by ratio.**

- Section headers 24 above, 4 below (12/4 first): **P**.
- One left edge per kind: **P**. Subjects share the senders' edge, and compact mode uses `--from`.
- A fill beats a gap: **P**.

**Concentric radius.**

- Menu 10 / item 6: **P**.
- Toolbar and toast pills: **P**.
- Embedded frame: **F 13**.
- Post row 12 in card 18 at inset 8: nit, see **F 22**.

**A shadow says how high.**

- Only what floats casts a shadow: **P**. Menus, toolbar, toast, the pill, and Post's card on its desk.
- Two shadows, two jobs (hairline plus drop): **P**. `.main`.
- Dark: depth by lightness plus hairline: **P**.

**Every line does a job.**

- No slogans: **P**.
- First words differ: **P**.
- The eyebrow "In practice" names the parent: **P**.
- Specific verbs: "Show" **F 12**.
- Confirm only the irreversible: **P**.
- No we, please or sorry: **P**. "You’re all caught up" is the allowed warmer empty line, but with no next line: **F 10**.
- One word for one thing: **P** in copy.

**How waiting feels.**

- Optimistic star and archive, no spinner: **P**.
- Sending is shown in place with Undo (decision 9): **P**, by code (`Sending`).

**Nothing shifts.**

- New mail waits behind a pill: **P**.
- Track updates wait behind a pill: **P**.
- Selection bar replaces the tabs in the same line: **P**.
- Checkbox column reserved: **P**.
- Unread bold widens only text whose neighbours don't move: **P**.

**Never too busy to listen.**

- Menus and popups from `ui`, reversible: **P**.
- Track sidebar folds by a width transition: **P**.

**Hover forgives.**

- Row actions wait 300ms: **P**.
- The whole row owns the hover: **P**.
- Hidden actions are also in the context menu: **P**.
- On touch, a long press: **P**.

**The faster way.**

- Shortcuts in tips: **P**. ⌘K, ↑↓, Esc.
- Modifier reveal: n/a. Post has no letter keys, by the owner's decision.

**Where the eye goes.**

- Archive's answer is shown where the row was (it leaves) and in the toast: **P**.
- Specific labels: **P**.

**Error timing.** n/a. No validated fields.

**Who, before what.**

- Post: one face column, people round, companies square, checkbox in its own column: **P**.
- Track: column filled in every row: **F 8**.
- Avatars off the accent's hue: **P**.

**Attention wears off.**

- Archive and tick under 120ms, never blocking: **P**. Rows close at once.
- Panels open at once: **P**. `openIssue` flushes synchronously.

**Reading text.**

- Post's open mail at `reading` 16/26 within `reading-max`: **P**. `Blocks.module.scss:4`.
- Page prose 16/26 in a 720 column: **P**.

### Owner's rules (`~/.claude/CLAUDE.md`)

- **One grid:** **P**. Post rows on a dot / check / face / text grid. Track rows on tick / priority / id / status / title / … / face / time.
- **One left edge:** **P**. Post sections, from and subject share an edge. Track group names share the ids' edge.
- **Trailing meta in one right-aligned column:**
  - Post times end at x = 1252 on every row: **P**.
  - Track times are right-aligned: **P**.
  - Track faces are blank on some rows: **F 8**.
- **Lightest boundary that holds:** **F 16**. Otherwise **P**.
- **Empty states name the next step:** **F 10**. Post's search-empty and Track's filter-empty and My-issues-empty states pass.
- **Focus follows the action, never `<body>`:** **F 2**, **F 1**. Back from a conversation re-focuses the row (by code). Opening a Track issue keeps focus on its row. Opening a Post conversation moves focus to the first sender button. **P**.

## 3. Gaps in the playbook

1. **Reference product against the lightest boundary.** Linear draws status groups as tinted bands with hairlines (#16), and the owner's rule says to start from the reference product. The boundary page says to start at heading and space. Nothing says which wins in an In practice app, or that the departure has to be recorded.
2. **Choice menus whose values have shapes.** Menu says a choice menu has no icons, but a status or priority value *is* its shape in the list, and the same icon carries it there (#17). The rule needs an exception for values that are drawn by a mark elsewhere on screen.
3. **The value trigger's chevron.** Select says a single down chevron means "more actions", and a value wants up and down chevrons. Menu's choice kind is "opened from a trigger that shows the current value" and gives no chevron rule. Post's phone folder trigger ("Inbox ˅") is a choice menu with one chevron. The two pages don't agree on which a value trigger takes.
4. **Inverse is "not a control", but the pills are.** Tooltip makes inverse ink mean "a label, not a control". Post's new-mail pill and Track's updates pill are inverse buttons. Nothing covers how an overlaid pill-shaped action is drawn.
5. **A page that frames an app.** `/practice/mail` puts the whole app in a bordered frame on the page, and the Arrivals compare stage holds a bordered mock window. Read literally, both are "a box inside a box". No rule says that a frame standing in for a window is exempt. Concentric radius then applies to that frame (#13), which no page mentions.
6. **Focus after a row leaves.** The owner's rule forbids focus on `<body>`. No component page says where focus goes when the focused or acted-on row is removed: the next row, the previous one, or the list. Toast, Table and App shell are all silent. #2 came from this.
7. **Programmatic focus inside overflow-hidden containers.** App shell covers scrolling panes, not `focus()` scrolling a clipped ancestor. That is what broke the sheet (#1). One line under Sheet or App shell ("initial focus with `preventScroll`; clip, don't hide") would cover it.
8. **Hiding empty values at rest.** Track hides "no priority" and "no one" until hover, to keep rows quiet. Who, before what forbids it for faces, but no rule covers other columns' empty values. Table says empty cells show an en dash, but that is for tables.
9. **Not covered.** Frame-time and long-task measurement, from the owner's acceptance rule, was not run, because the machine was at 97% CPU during the review. The recipients popover, Track board view, Track inbox, the New issue dialog and Post compact density were not shot.
