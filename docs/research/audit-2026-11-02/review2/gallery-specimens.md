# Rule review: looks gallery, Ship's specimen pages

Date: 2026-11-03. Method: `.claude/agents/ui-rule-review.md`, with the owner's change: the gallery is desk-only (hidden under 760px), so each route was shot at **1280 and 1024**, light and dark, and the phone notice once at 375 in each theme. Server: http://localhost:4321 (dev, another session's), through `pnpm shoot` only. The Astro dev toolbar in the shots is ignored. The machine's memory level was read before every screen; shots waited whenever it wasn't `ok`.

Routes: `/systems/looks?look=<look>&page=` `components` (and its alias `cards`), `overlays`, `states`, `marketing`, in `look=linear` and `look=playbook`, with `look=primer` spot-checked; `/systems/looks` at 375.

Source: `src/pages/systems/looks.astro`, `src/components/look/Gallery.astro`, `src/demos/looks/**` (Gallery, Panel, address, looks, `ship/**`), and `src/ui/*` where a page draws a kit part. Binding answers: `docs/research/audit-2026-11-02/decisions.md`. Old findings checked for recurrence: `docs/research/audit-2026-11-02/looks.md` (LK#1–48).

Shots: `shots/review2/gallery-specimens/<look>-<page>-<width>-<theme>.png`, crops beside them.

Written screen by screen as the review went; the findings table and ledger at the end gather them. Count: **2 must, 5 should, 7 nit.** The machine sat at `busy` for long stretches; shots waited for `ok` each time.

## Screen notes

### 1. Components (`?page=components`), After Linear

Shots: `linear-components-1280-{light,dark}.png`, `linear-components-1024-{light,dark}.png`.

What holds:
- The gallery is a window: document 800 tall in an 800 window; the only scroller is Ship's page pane (777 in 648), named "Components", `tabindex=0`, ring drawn inside (LK#1, LK#2 fixed). The sidebar keeps Mira Chen at its 48px foot.
- Sections are held by heading and space in three columns, all on the pane's 24px inset; no card round any section (LK#4, LK#5 fixed). The one box is the alert (`radius-lg` 10, `danger-soft`, no shadow); the Releases table carries its own frame (1px `line`, radius 10, no shadow) and nothing round it.
- Release health: two figures on one surface with a hairline between (LK#3's rule).
- Publish: Version field, Channel as radios (LK#28), First rollout as a field with a % suffix (LK#19), Email subscribers as a checkbox (LK#6), Save draft + one fill (Publish). Notifications: switches with no Save, radios for Send to (C31; LK#20 fixed). Faces grey, not the accent (LK#16 fixed). Running takes `info` (C35; LK#15 fixed). Invite field `type=text inputMode=email` (LK#41).
- Contrast probe (every visible text node composited on its real ground): 89 nodes, lowest 4.84:1 light, 4.67:1 dark. No fails (LK#8 fixed: Linear `accent-text` is now `#4e5ac0`).
- Ship's name is set in type, no tile (LK#11). Sidebar 240, header 48, rows 32, foot 48, rows 13px (LK#32 fixed).

What breaks:
- **Type and radius leak from the site into the look.** The kit hard-codes sizes the looks set: `Button.module.scss:20` 14px, `Field.module.scss:102` 14px, `Toast.module.scss:48,125` 14px, `Dialog.module.scss:49` 14px and `:89` 18px. In After Linear (body `--text-md` 13px, measured on the pane) the Publish and Invite buttons and the Version, First rollout, Invite and Release notes fields measure 14px beside 13px labels and rows. The variable probe on the panel shows the site's values reaching inside the look for every name no look publishes: `--radius-xl` 18px, `--radius-xs` 4px, `--shadow-lg`, `--knob`, `--shadow-knob`, `--font-mono`, `--control-sm/lg`. The brief: inside a look, colours, radii and type come from the look.
- **Section heading rows don't share a top in After Linear.** The first headings of the three columns sit at y=176, 180, 176: Checks is 4px low. `Section.module.scss` gives an action row `margin-block: calc((var(--leading-md) - var(--control-sm)) / 2)`; Linear's `--leading-md` is `normal`, so the calc is invalid, the margin drops, and the 24px button row centres the heading. (In Playbook, `--leading-md` is 20px and the row nets 20.)
- **Row lines start at the icon and the face, not the text.** Checks' lines start at x=611, the icon column; the text starts at 635. Release team's start at 957, the face; the names start at 993. C21: "Lines between rows start at the text in lists (iOS)"; the boundary page: "starting at the text as iOS draws them".
- **The line between the two health figures vanishes at 1024 in After Linear.** `Health.module.scss` draws it as the `--line` ground showing through a `gap: var(--line-width)`; Linear's line width is 0.5px, and at 1x the half-pixel gap (x 435.75–436.25) paints nothing (`linear-components-1024-{light,dark}.png`; at 1280 it happens to land on a pixel). A border of 0.5px rounds up to a device pixel; a 0.5px gap doesn't. The same technique draws States' cross (`States.module.scss` `.grid`).

### 2. Components, Playbook Blue (opened as `?page=cards`)

Shots: `playbook-components-{1280,1024}-{light,dark}.png`.

- The old address works: `?look=playbook&page=cards` opens Components, keeps the address as typed, lights Components in the sidebar, and names the pane "Components".
- Body 14/20 Geist 400, the look's own; the kit's hard-coded 14px happens to match here, so the type leak above doesn't show in this look.
- Contrast: 84 nodes at 1280, lowest 4.70:1 light and dark; 69 at 1024, lowest 4.69 light, 4.70 dark. No fails.
- Heading rows share their tops (176/176/176 across the three columns at 1280), since `--leading-md` is 20px here.
- Row lines start at the icon/face (611 and 957; text at 635 and 993), as in Linear.
- At 1024 the line between the health figures shows (`--line-width` 1px).
- The empty Hotfixes line ("No hotfixes yet. A hotfix goes to everyone on 4.2.0 at once.") is a sentence to read, set at `--text-sm` 12px; the work tool keeps 12px for labels and meta.

### 3. Overlays (`?page=overlays`), After Linear and Playbook Blue

Shots: `linear-overlays-{1280,1024}-{light,dark}.png`, `playbook-overlays-{1280,1024}-{light,dark}.png`, `playbook-overlays-look-select-open{,-crop}.png`.

**Nothing on this page opens.** The page is four held stills inside one `inert` grid (`overlays/Overlays.tsx:24`): no menu, dialog, popover or toast can be opened, so focus can't be taken in or brought back on this screen. `inert` also takes the whole grid, its four section headings included, out of the accessibility tree: the pane named "Overlays" announces nothing. Ship has one live overlay of its own (the Release page's toast, `release/Release.tsx:25`) and none on these pages. The plan's "Overlays and States can live where they really happen (a row's menu, an empty filter)" wasn't taken up.

The one live overlay on these routes is the gallery's Look select. Opened with a real click: the list opens over its trigger, its check on Playbook Blue, focus on that option. Picking After Primer (with a click on the option) closes it, focus returns to the trigger (`BUTTON combobox "After Primer"`), the address is replaced with `?look=primer&page=overlays`, Ship redraws in Mona Sans at the same place. Matches the plan's table and Select's States.

Measured on the stills (both looks, light and dark):
- Menu: 200 wide, `radius-lg` 10, inset 4, `shadow-md`, rows 32 at 13px, 6 below its trigger; the ghost trigger keeps `fill-control` while open. Icons on every row of each group; destructive last, red, with an ellipsis. Shortcuts E and ⌘ L are `ink-muted` (Linear `#616261`, Playbook `#5e5e67`): LK#7 / C1 fixed. Pause rollout has none, rightly.
- Tooltip: inverse (`ink` ground), radius 6, 12px, 4 above its trigger and centred on it.
- Popover: 236 wide, radius 10, inset 12, 6 below a filled trigger (`fill-control-hover`); title "Rollout" matches the trigger "Rollout 25%" (LK#34 fixed).
- Confirmation: "Delete 4.2.0 iOS?", a sentence of what is lost, Cancel then **Delete release** in `danger-fill`. Not undoable, so a confirm is right (LK#17 fixed).
- Toasts: "Paused the rollout of 4.2.0 iOS · Undo"; the failure says what and why (LK#45 fixed).
- Contrast: 46 nodes in each of the eight shots, lowest 4.67:1 (Linear dark). No fails.

What breaks:
- **The failure toast truncates at 1024.** "Couldn't publish 4.1.3 Android: the Play Store didn'…" in both looks and themes (`*-overlays-1024-*.png`): the toast is held to its 352px column and its text clips on the second line. Toast Anatomy: "a failure shows it all". This is LK#21 again, now at a desk width.
- **At 1280 the failure toast is 480 wide**, past Anatomy's "320 to 440".
- **The confirm is 320 wide at 1024** (`dialog-sm` is 400): the scene is 352. LK#33 again, at 1024.
- **In After Linear the dialog, toasts and buttons are the site's, not Linear's**: dialog radius 18 (`--radius-xl`, no look sets it), title 18/26 weight 600 (Linear's strong weight is 500 and its sizes are 13/15/24), body and buttons 14px, toast text 14px. Part of the leak in screen 1.

### 4. States (`?page=states`), After Linear and Playbook Blue

Shots: `linear-states-{1280,1024}-{light,dark}.png`, `playbook-states-{1280,1024}-{light,dark}.png`.

What holds:
- Four screens on one surface with a line between them, none round the outside; each half on the pane's 24px inset (left cells start at the inset, right cells 24 past the line). Sidebar lights States and the header names it (LK#30 fixed).
- Empty: one icon, "No releases yet", what goes here, **Connect repository**. Failed: what failed, why, that nothing changed, **Try again**. Both name the next step. Loading: a skeleton for a list's load, "Loading…" on the heading row, `aria-busy`, pulse off under reduced motion.
- Sign in: Work email is `type=text inputMode=email` with an example placeholder (LK#41, C17); "New to Ship? See plans" is a real link to `?page=marketing`, underlined, `accent-text`.
- Two fills on the page (Connect repository, Sign in) are one per screen, four screens held side by side: pass with that reason (LK#29's case on this page).
- Contrast: 33 nodes in each of the eight shots, lowest 4.67:1. No fails.

What breaks:
- **After Linear's States cross is half drawn.** The horizontal line shows; the vertical one between the columns doesn't, at 1280 or 1024, light or dark (`linear-states-*.png`). Same cause as the health figures: the `--line` ground through a 0.5px gap. Playbook (1px) draws both.
- The empty and failed explanations are sentences at 12px (`.meta`, `--text-sm`), as Hotfixes on Components.
- Sign in's fields are 14px in After Linear beside 13px text (the type leak).

### 5. Website (`?page=marketing`), After Linear and Playbook Blue

Shots: `linear-marketing-1280-{light,dark}.png` (top), `linear-marketing-1280-light-pricing.png`, `linear-marketing-1024-light.png` (features), `linear-marketing-1024-dark.png` (pricing, questions), `playbook-marketing-1280-light.png` (top), `playbook-marketing-1280-dark.png` (quote, pricing), `playbook-marketing-1024-light.png` (top), `playbook-marketing-1024-dark.png` (pricing, questions), `linear-marketing-signin-after.png`. The website scrolls inside its own region, so each shot is one scroll position; contrast was probed over the whole site.

What holds:
- It takes Ship's whole window and scrolls as one region ("Ship website", `tabindex=0`, 2354 in 696); the document still doesn't scroll.
- **Sign in returns to the Dashboard with focus on its link.** Clicked with a real pointer: address `?look=linear` (Dashboard is the default place), header "Dashboard", `document.activeElement` is the sidebar's Dashboard link with `aria-current=page`. A history entry is pushed, so Back returns to the website. From States, "See plans" lands on the website with focus on the site region (no sidebar there to light).
- The eyebrow is gone; what the product covers is in the lede (LK#24, C32). Pricing is three columns on one surface with lines between; Team is marked by its fill and a badge (LK#25). Header links point at sections that exist: Product, Pricing, Questions (LK#40). One arrow, on the hero's Start free. No gradient wash; the product shot's fade is a mask on the real Releases page, `inert` and `aria-hidden` (C27).
- Hero 63px/600 (Playbook), 54px/500 (Linear) over section titles 35 and 30: a step above (LK#44's concern).
- Contrast: 59 text nodes across the whole site in each of the eight shots, lowest 4.67:1. No fails.

What breaks:
- **Three fills on one page** (nav Start free, hero Start free, Team's Start a trial). Button: "One filled button per view". The nav and the hero repeat the same action in the same weight.
- **In After Linear, Team's column sits 1–2px low.** The badge is 20 tall in an 18px title row (Linear's line is `normal`), so Team's title is at 228.5 against 227.5 and its price at 263.5 against 261.5 (`linear-marketing-1280-light-pricing.png`). In Playbook the row is 20 and they line up.
- **Questions draws a line above the first question and after the last** (`*-marketing-1024-dark.png`). The boundary page: lines go between repeated rows, "none after the last" (Rows, Table).

### 6. After Primer, spot-check

Shots: `primer-overlays-1280-light.png`, `primer-components-1280-dark.png`.

- Body Mona Sans 14, `--radius-control` 6px on buttons and fields, menu and popover 12 (`--radius-lg`), tooltip 3: the look's own. Contrast: 46 nodes (Overlays light) lowest 5.19:1; 83 nodes (Components dark) lowest 4.63:1. No fails.
- **The confirm dialog is 18px** (the site's `--radius-xl`) beside the look's 12px menu and popover: Primer's overlays are 12. Part of the leak.
- **The toasts stay pills while their Undo and Retry buttons take Primer's 6px** (`primer-overlays-1280-light.png`): a 6px corner 4px inside a 20px arc. Concentric radius: inner = outer − inset, so 16, i.e. a pill; or the toast takes the look's radius. C16 doesn't say which wins for a toast (see Gaps).

### 7. `/systems/looks` at 375, the phone notice

Shots: `phone-notice-375-{light,dark}.png`.

- The gallery doesn't hydrate (`client:media`), the desk block is `display: none`, the document is 375 wide and as tall as the screen. One paragraph on the 16px gutter: "The looks need a wider window. Each one's values are on its own page: Playbook, After Primer, After Linear." 14/20, three lines, links underlined in `accent-text`. It names the next step. Contrast 5.20:1 lowest light, 9.52:1 dark.
- The page has no visible heading: the "Looks" `h1` lives in the hidden toolbar, so at 375 the page's only text is the notice and the document outline is empty (visible `h1`/`h2`: none).

## Findings

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| 1 | must | Every look but Playbook; kit parts inside Ship: `src/ui/Button.module.scss:20`, `Field.module.scss:102`, `Toast.module.scss:48,125`, `Dialog.module.scss:44,49,89` | Brief: inside a look, colours, radii and type come from that look; system-look-linear "13px Inter" | After Linear: buttons, fields, toast and dialog text 14px beside 13px body; dialog title 18/26/600 (Linear's strong weight is 500); dialog radius 18 in Linear and Primer (Primer's menu/popover 12). Panel probe: `--radius-xl`, `--radius-xs`, `--shadow-lg`, `--knob`, `--shadow-knob`, `--font-mono`, `--control-sm/lg` all resolve to the site's values. Shots `linear-components-1280-light.png`, `linear-overlays-1280-*.png`, `primer-overlays-1280-light.png` | Have those parts read the look's variables (`--text-md`, `--weight-strong`, `--text-lg`/`--text-xl`), and either add `radius-xl`, `shadow-lg` (and the knob pair) to `NAMES` with a value in every look, or map them in `Panel` from the look's own (`--radius-xl: var(--radius-lg)` where a look has no larger radius). |
| 2 | must | `?page=overlays` at 1024, failure toast (`overlays/Overlays.tsx:96`, `ToastStill` in a 352px column) | component-toast Anatomy: "wraps to a second line, then truncates; a failure shows it all" | "Couldn't publish 4.1.3 Android: the Play Store didn'…" in all four 1024 shots, both looks. LK#21 again | Let a failure toast wrap to a third line (or drop the line clamp for `type="error"`), or give the Toasts section the full row so it reaches 440. |
| 3 | should | `?page=overlays`, the whole grid `inert` (`overlays/Overlays.tsx:24`) | C27: pictures are hidden with "a text equivalent beside them"; plan A: overlays "live where they really happen" | Nothing opens: no menu, dialog, popover or toast can be opened, so focus in and out can't be exercised here. `inert` also hides the four section headings, so the "Overlays" pane is empty to a screen reader. The pressed "…" and "Rollout 25%" look live and do nothing | Keep `inert` on each still, not on the sections, so the headings stay; add one line per still naming what it shows; or make the triggers real (open the same Menu, Popover, Dialog, and push a toast) so the page can be driven. |
| 4 | should | After Linear: health figures at 1024 (`Health.module.scss` `.pair`) and the States cross (`States.module.scss` `.grid`) | SKILL: "Figures read together sit in one row on one surface, a line between them" | Linear's `--line-width` is 0.5px; a 0.5px gap shows no line: health line gone at 1024 (`linear-components-1024-*.png`); the States vertical line gone at 1280 and 1024, and at 2x too (`linear-states-1280-light-x2-cross.png`) | Draw the line as a border on the second cell (`border-left: var(--line-width) solid var(--line)`), which rounds up to a device pixel, instead of a gap. |
| 5 | should | Components and Release team rows (`Rows.module.scss` `li + li` border) | C21: "Lines between rows start at the text in lists (iOS)"; boundary page: "starting at the text" | Checks: line at x=611, text at 635. Release team: line at 957, names at 993 (both looks, 1280) | Draw the line from the text column (a border on the text span, or an inset pseudo-element starting at icon + gap). |
| 6 | should | After Linear, a Section with an action (`Section.module.scss` `.head[data-action]`) | Owner: one grid; sections "on one left edge", heading rows share a line | Checks heading at y=180 beside Release health and Release team at 176 (`linear-components-1280-light.png`). The `calc(var(--leading-md) - …)` is invalid when `--leading-md` is `normal` | Compute from a length: `calc((1lh - var(--control-sm)) / 2)` on the heading, or set the row `height: var(--control-sm)` with negative margins from a known line height. |
| 7 | should | After Primer, toasts (`Toast.module.scss` pill; buttons take `--radius-control`) | principle-concentric-radius: "Inner radius = outer radius − inset − border"; component-toast: "A pill in a pill" | Pill toast with 6px Undo/Retry buttons 4px inside it (`primer-overlays-1280-light.png`) | Either the toast's buttons stay pills (concentric by construction) or the toast takes `radius-control + 4`; record which in C16. |
| 8 | nit | `?page=overlays` at 1024, confirm | component-dialog: Confirm `dialog-sm` (400) | 320 wide (scene 352). LK#33 again, at 1024 | Let the Confirmation section span both columns below 900px of pane, or note the cap. |
| 9 | nit | `?page=overlays` at 1280, failure toast | component-toast Anatomy: "Width: fits the text, 320 to 440" | 480 wide | `max-width: 440px`; it then wraps (with #2's fix). |
| 10 | nit | `?page=marketing`, nav Start free, hero Start free, Team's Start a trial | component-button: "One filled button per view" | Three fills; the nav and hero repeat one action at one weight | Make the nav's Start free secondary, or drop it while the hero is on screen. |
| 11 | nit | After Linear, Pricing (`Pricing.module.scss` `.planHead`) | Owner: one grid across columns | Team's title 228.5 vs 227.5, price 263.5 vs 261.5: the 20px badge in an 18px row | Give `.planHead` a fixed height of the badge (20) in every column. |
| 12 | nit | `?page=marketing`, Questions (`Marketing.module.scss` `.faq`) | principle-the-lightest-boundary: lines go between repeated rows; Rows/Table "none after the last" | A line above the first question and after the last (`*-marketing-1024-dark.png`) | Lines between the questions only. |
| 13 | nit | Hotfixes, States empty and failed text (`.meta`, `--text-sm`) | system-work-tool: "12px; nothing smaller in a row someone reads"; 12 is for labels and meta | Sentences at 12px | `--text-md` for the explanation, `ink-muted` kept. |
| 14 | nit | `/systems/looks` at 375 (`looks.astro`) | (no rule; see Gaps) | No visible heading: the page's `h1` is inside the hidden desk block | Put "Looks" as an `h1` above the notice in the phone block. |

## Old findings (`looks.md`, LK#1–48) on these routes

Fixed and holding: LK#1, 2 (window and panes), 3's rule (Release health), 4, 5, 6, 7 (C1), 8 (C28), 11, 13 (no ⌘K box any more), 14 (no static card with a shadow; table and alert have one edge), 15 (C35), 16, 17, 19, 20 (C31), 24 (C32), 25, 28, 30, 32, 34, 35 (sidebar 4/4/4 = 12 from data; "Ada Okafor" everywhere), 36 (toolbar one 48px row), 37 (C34), 39 (sidebar rows are links), 40, 41, 44, 45, 47.
Recur: **LK#21** (#2 here, now at a desk width) and **LK#33** (#8, at 1024). LK#29 (two fills) on States passes as four screens side by side; on the website it recurs as #10.
Not on these routes: LK#9, 22, 23, 26, 43 (phone layouts, now desk-only), LK#10, 27, 31, 42, 46, 48 (Releases, Release, Settings, Dashboard). LK#12: the icon-only buttons in these pages are stills (`inert`); not testable. LK#18: the look is a Select by decision (plan A, C8); places are links. LK#38: no segmented control inside Ship on these pages.

## Ledger

pass = measured or read and holds; fail = finding #; n/a = reason. Both looks, both widths, both themes unless noted.

### SKILL floors and kinds
- Text 4.5:1: pass, every shot (lowest 4.63:1, Primer Components dark).
- One icon library at one stroke, sized to text, no symbols, no hand-drawn SVG: pass (Lucide throughout, no `strokeWidth` overrides in `src/demos/looks`; ⌘ in the menu and tooltip comes from the kit's key glyphs). Logo set in type: pass ("Ship").
- Window holds still, panes scroll, `100dvh`, `min-height: 0`, named scrolling pane with `tabindex=0`: pass (document = window; Ship's pane and the website region scroll; both named and focusable, inset ring).
- Kinds: work tool for Components, Overlays, States; marketing for Website; sign-in and empty screens take Ship's system: pass. Marketing tells (accented headline word, uppercase labels, identical shadowed cards, gradient washes, → after every link): pass. Floors on the marketing page: pass.

### While you build
- Sections: pass, except **#5** (row lines) and **#6** (heading row in Linear). Section actions on the heading row: pass (Re-run failed).
- Figures together: pass in Playbook; **#4** in Linear.
- Spacing and aligning: pass (one 24px inset; labels on one edge; meta right-aligned in one column).
- Labels and messages: pass (verbs name results: Delete release, Connect repository, Try again, Invite; no please/sorry/we; no eyebrow).
- Confirming: pass (confirm only for Delete, Undo toast for Pause).
- Validating: n/a (no field validates on these pages).
- Sign-up / empty: pass (one icon, words name the next step).
- Opening a dialog or sheet: n/a here, nothing opens (**#3**).
- Waiting: pass (skeleton for a list's first load, "Loading…", reduced motion stops the pulse).
- Animating: pass (nothing moves on these pages; Select opens in place).
- Colour: pass (accent on the fill, the chosen, links, chart's latest week; status colours with words).
- Shadow and radius: shadows only on floating stills and the toast/dialog: pass; radius **#1, #7**.
- Offering a choice: pass (switches with no Save; radios in the Publish form and Send to; Select for the look).
- List or table: pass (lines not stripes; numbers right; name column filled).
- Menus and hover: n/a (held still).
- Shortcuts: pass (shown in the pull-down and the tooltip only, real ones).

### component-app-shell
Avoid/Prefer (each pane scrolls): pass. Every layer `min-height: 0`: pass. `100dvh`: pass (`calc(100dvh - 56px)`). Anatomy: toolbar 48 pass; sidebar 240 pass; rows 32 pass; foot 48 pass; panes `overflow-y: auto` pass; hairlines at the sidebar edge and above the foot pass. States: pane is a named Tab stop with an inset ring: pass. Common mistakes: overflow on the pane only, pass; `100vh` pass; sticky sidebar pass; `scrollbar-gutter: stable` pass; account in a scrolling sidebar pass; narrow window drops the sidebar: n/a (desk-only by decision; the phone notice replaces it). Copy (name each pane): pass ("Components", "Overlays", "States", "Ship website").

### component-badge
Dot and word: pass. Soft not solid: pass. Dot for states only: pass ("Most teams" has none). Anatomy (20 tall, 8 padding, pill, 12/500, tones, neutral, dot 6): pass. Both themes: pass. Common mistakes: column of badges has a header ("Status"): pass; red for new: pass; truncated: pass; badges as buttons: pass. Copy: pass.

### component-button
Filled not outlined: pass. Hover timings, press 0.97, busy: n/a (kit, not re-measured). One fill per view: pass on Components and Overlays; States pass with reason; **#10** on the website. Variants: danger-fill only in the confirm, pass; leading icon on every button of a row or none: pass. Anatomy: heights 24/32/40 pass; pill pass (Primer's 6 is the look's `radius-control`); label size **#1** in Linear. Icon-only has a tooltip: n/a (stills). Common mistakes: shadow to lift pass; colour as rank pass; disabled with no reason n/a. Copy: verb names the result pass; sentence case pass; dialog verb matches title ("Delete 4.2.0 iOS?" / "Delete release") pass.

### component-card
n/a: no Card on these pages (sections are held by headings; pricing is columns). "Cards don't go inside cards": pass (none).

### component-checkbox
Whole row: pass. Mixed parent: n/a on these pages. Anatomy (16, radius 4, accent, gap 8): pass. Common mistakes: saves on the spot pass (Email subscribers waits for Publish); negative label pass; consent pre-ticked n/a; disabled n/a. Copy: pass ("Email subscribers when it's live").

### component-dialog (the still)
Kind Confirm for a permanent action: pass. Title the decision with its object: pass. Cancel and a verb: pass. `danger-fill`: pass. Focus on Cancel, Esc, scrim does nothing, focus trapped, returns to trigger: n/a (still, **#3**). Anatomy: scrim pass; surface-raised + shadow-lg pass; radius 18 pass in Playbook, **#1** in Linear and Primer; padding 20 pass; title 18/26/600 pass in Playbook, **#1** in Linear; width 400 pass at 1280, **#8** at 1024; buttons trail, Cancel first pass. Common mistakes: undoable confirmed pass; on arrival pass; explaining buttons pass; scrolls pass. Copy: pass.

### component-icon
Library, size beside text (16 at 13–14px, 18 beside feature titles, 20 in the empty-state circles), colour of the text or the state: pass. No symbols or emoji: pass. Logo in type: pass.

### component-input
Label above, example inside: pass (Work email "you@company.com", Invite "name@company.com"). Width says how much: pass (First rollout 96 wide with %, Share of users). Check on leave: n/a. Anatomy: 32 tall pass; radius pass (look's); label 12/500 muted pass; text 14 **#1** in Linear. Known issue `type=email`: pass. Common mistakes: n/a (no hints, no errors). Copy: labels nouns pass ("Version", "Work email", "Share of users").

### component-menu (the still)
Pull-down with icons on every row of each group: pass. Shortcuts only where real: pass. Destructive last, red highlight rule: pass (danger row in `danger`). Checkmark column: n/a (no checkable rows). Bare symbols in a column, `ink-muted`: pass (C1). Grows from trigger: n/a (still). Anatomy: radius 10 (look's) pass; inset 4 pass; width ≥160 pass (200); separator inset pass; item 32 pass; label 13 pass; shadow-md pass. Common mistakes: one or two items pass (four); group label repeats trigger pass; destructive mid-list pass; submenus pass. Copy: verbs, ellipsis on Delete release… pass.

### component-popover (the still)
Grows from trigger, focus in and back, keeps the draft: n/a (still). Trigger stays filled: pass (`fill-control-hover`). Anatomy: radius 10/12 (look's) pass; inset 12 pass; width ≤320 pass (236); gap 6 pass; title 13/600 pass; description muted pass; actions right, small pass. Common mistakes: hover-open n/a; decision in a popover pass (raising a rollout is undoable); nested pass; unneeded Save pass (typed value). Copy: title matches trigger pass; action verb "Raise" pass.

### component-radio
One chosen from the start: pass. One Tab stop: pass (kit). Inline only for two or three short words: pass (Stable/Beta/Nightly, Email/Team chat). Anatomy: pass. Common mistakes: acts on the spot: pass for Channel (waits for Publish); Send to applies at once, as C31 allows on an auto-saving group. Copy: pass.

### component-select (gallery's Look)
Opens over the trigger, check on the current value: pass (crop). Default chosen: pass. Up-and-down chevron: pass. Picking returns focus to the trigger and replaces the address: pass. Seven options, a Select (C8): pass. Copy: label "Look" kept for screen readers, pass.

### component-segmented-control (gallery's Theme)
Two words, equal widths, raised thumb in greys, beside what it changes: pass. Changes a view at once: pass. Label for assistive tech: pass ("Theme").

### component-switch
Applies at once, no Save: pass (Notifications). Label names the setting: pass. Anatomy (32×20, trailing in a settings list, one column on the right): pass. Common mistakes: in a form with Submit: pass (none). Copy: pass.

### component-table (Releases on Components; hero shot)
Numbers right, tabular: pass (Rollout). Lines not stripes: pass. One arrow on the sorted column: pass (Updated ↓). Secondary columns muted: pass. Anatomy: frame 1px line, radius 10, no shadow pass; header 32 muted on sunken pass; rows 36 pass. Common mistakes: status as colour alone pass; actions per row pass; name truncated pass. Copy: headers nouns pass.

### component-tabs (Release notes)
Weight stays 500: pass. Bar in ink: pass. One row: pass. Anatomy: 40 tall, 16 between, panel gap 16: pass. Common mistakes: single tab pass (two). Copy: Write / Preview, parallel: pass.

### component-toast (the stills)
Undo instead of asking: pass. Colour on the icon only: pass. Three at most: pass (two). Anatomy: pill pass (**#7** in Primer); height 40, grows with a second line pass; width **#9** (480 at 1280); text 14 **#1** in Linear; a failure shows it all **#2**. Common mistakes: errors that disappear n/a (still); toasts on load: pass (held still on a specimen page, not a live toast). Copy: past tense with object pass; failure says what and why pass; one verb pass.

### component-tooltip (the still)
Inverse, no shadow: pass. Radius `radius-sm` (look's): pass. 12px, 4 from the trigger, centred: pass. Name then shortcut glyphs: pass. Copy matches the button's `aria-label` ("Copy link"): pass.

### principle-the-lightest-boundary-that-holds
Headings and space, not a card per section: pass. Figures in one row on one surface: pass, **#4** in Linear. Innermost box: pass (no box in a box; the alert is the one region that differs). Lines only between repeated rows, lighter than the edge: pass in Components; **#12** on the website; starting at the text **#5**. Every box one more region: pass. Indent only for a real parent: pass.

### principle-space-groups-by-ratio
Headings nearer their content (12) than the section above (32): pass. Labels 4 from fields, fields 16+ apart: pass. One left edge per kind: pass.

### principle-every-line-does-a-job
Every line names a thing, action or state: pass. Word that differs first: pass. No eyebrow: pass. Errors say what failed and where: pass. Specific verbs: pass. Confirm only the irreversible: pass. Sentence case: pass. No we/please/sorry/Your: pass. One word for one thing: pass (release, rollout). Marketing exemption: used for the hero and the quote.

### principle-colour-means-one-thing
Accent only on the action and the chosen: pass (fills, radios, switches, tab bar in ink). Hover neutral: pass. Red only for what's wrong: pass (Halted, failed check, Delete). Accent text is a link: pass ("See plans", "Values and sources"); badge `info` carries a dot (C13): pass. Content exception (chart's latest week): pass.

### principle-grey-until-it-matters
Grey surfaces, colour for what must be noticed: pass. No decoration panels: pass. Status colours come with words: pass.

### principle-lightness-first
Each text colour on its surface at 4.5:1: pass in every shot (probe). `line-strong` ≥3:1 on empty boxes: pass by the looks' notes; not re-measured.

### principle-a-shadow-says-how-high
Shadows only on what floats (menu, popover `shadow-md`; dialog, toast `shadow-lg`): pass. Not to group or rank or part a surface: pass (table, alert, sections, product shot have none). Dark mode by lightness: pass (raised surfaces lighter in dark). `shadow-lg` is the site's, not the look's: **#1**.

### principle-concentric-radius
Menu 10 − 4 = item 6: pass. Field 10 with an embedded key: n/a. Pill in pill (toast, segmented, switch): pass in Playbook and Linear; **#7** in Primer. Dialog padding ≥ radius, buttons keep their own: pass.

### principle-where-the-eye-goes
Main area reflects the last action (Select pick, Sign in, See plans): pass. Fold cuts through content (hero's product shot at the fold): pass. Weight decides the order (hero above section titles): pass.

### principle-who-before-what
Faces grey, never the accent: pass. One column, filled every row: pass. Compact 28: pass (C22).

### principle-how-waiting-feels
Skeleton for a list's load with its heading kept: pass. 300/500 ms timing: n/a (still).

### principle-nothing-shifts
`scrollbar-gutter: stable` on the pane and the website: pass. Nothing moves under the pointer on these pages: pass. Weight stays put in tabs: pass.

### system-work-tool
Body 14/20 (Playbook) or the look's 13 (Linear): pass. 12px labels and meta: pass; **#13** for sentences. Controls 24/32/40: pass. Spacing on the 4 grid: pass. Radius 4–10 on fields/menus/panels: pass (Primer's 12 is the look's published value). One accent: pass. Icons 16: pass. Common mistakes: rows in 10–11px grey pass; brand colour as a panel pass; tagline under the title pass; large radii on dense parts pass; controls of two heights in a row pass (Invite field and button both 32).

### system-look-playbook
Values pasted as variables and read by the components: pass. Accent only for what's noticed: pass.

### system-look-linear
Values match the table (13px Inter 500, 0.5px lines, pill controls, `accent-text #4e5ac0`, status colours darker on light): pass on what the look sets; **#1** for what it doesn't; 0.5px line width meets a drawing technique that can't show it: **#4**. No Linear logo or name: pass.

### system-look-primer
Mona Sans, 6px controls, 12px panels, Primer blue: pass. **#1** (dialog 18), **#7** (toast).

### Owner's rules (`~/.claude/CLAUDE.md`)
- Copy the reference first: Ship's shell follows Linear/GitHub (sidebar of places, header with the place's name, one pane): pass.
- Don't add what users know: pass (no explanatory lines; labels only).
- State-transition table (checked): pick a look → Ship redraws, focus back on the Select, address replaced: pass. Sign in → Dashboard, its link lit and focused, pushed: pass. See plans → website, focus on its region: pass. Open an overlay → nothing (**#3**).
- Empty states name the next step: pass. Layout changes re-home context: pass at 1024 (columns reflow, nothing hidden); phone: n/a (desk-only, notice links to the look pages).
- Focus follows the action, never `<body>`: pass on every move tested.
- One grid: **#6**, **#11**. One left edge: pass. Trailing meta in one right-aligned column: pass. Lightest boundary: pass, with **#4**, **#5**, **#12**.
- Frame time and long tasks: not measured (C43 puts it after the fixes).
- Rendered geometry (overlaps, clipped text): **#2** (clipped failure toast); nothing else clipped or overlapping in the 41 shots.

## Gaps in the playbook

1. **What a look doesn't publish.** `NAMES` has no `radius-xl`, `radius-xs`, `shadow-lg`, `knob`, `shadow-knob`, `font-mono`, `control-sm/lg`, and the kit hard-codes 14px, 18px and weight 600 in Button, Field, Toast and Dialog. No page says how a part should size itself in a look whose body isn't 14 (#1). The look pages promise "the components read only them"; either the list grows or the page names what stays the playbook's.
2. **A toast's radius in a look whose controls aren't pills.** C16 says controls take `radius-control`; Toast's anatomy fixes the pill and its buttons inside it. In Primer they disagree (#7).
3. **Half-pixel lines.** Linear's `line-width` is 0.5px. Nothing warns that a line drawn as a gap (the "figures on one surface" technique) disappears below 1px, while a border rounds up (#4).
4. **Specimen stills.** C27 covers scaled previews; nothing covers a full-size still of an overlay held open inside a working app: whether it's a picture (inert, with a caption) or must open (#3).
5. **A page with no heading on a phone.** When a desk-only tool hides its own chrome, nothing says the page keeps a heading (#14).
6. **Lines above and below a list.** Rows says "none after the last"; an accordion list (FAQ) isn't named either way (#12).
