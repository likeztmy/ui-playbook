# Rule review: looks gallery, Ship's specimen pages

Date: 2026-11-03. Method: `.claude/agents/ui-rule-review.md`, with the owner's change: the gallery is desk-only (hidden under 760px), so each route was shot at **1280 and 1024**, light and dark, and the phone notice once at 375 in each theme. Server: http://localhost:4321 (dev, another session's), through `pnpm shoot` only. The Astro dev toolbar in the shots is ignored. The machine's memory level was read before every screen; shots waited whenever it wasn't `ok`.

Routes: `/systems/looks?look=<look>&page=` `components` (and its alias `cards`), `overlays`, `states`, `marketing`, in `look=linear` and `look=playbook`, with `look=primer` spot-checked; `/systems/looks` at 375.

Source: `src/pages/systems/looks.astro`, `src/components/look/Gallery.astro`, `src/demos/looks/**` (Gallery, Panel, address, looks, `ship/**`), and `src/ui/*` where a page draws a kit part. Binding answers: `docs/research/audit-2026-11-02/decisions.md`. Old findings checked for recurrence: `docs/research/audit-2026-11-02/looks.md` (LK#1–48).

Shots: `shots/review2/gallery-specimens/<look>-<page>-<width>-<theme>.png`, crops beside them.

Written screen by screen as the review went; the findings table and ledger at the end gather them.

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
