# Rule review: looks gallery and Ship

Date: 2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Server: http://localhost:4321 (dev).

Routes: `/systems/looks?look=playbook&page=` cards, dashboard, releases, release, settings, overlays, states, marketing; spot-checks `look=linear&page=releases` and `look=primer&page=dashboard`. The gallery's own chrome (rail, page bar, theme switch, Copy) is a full-window work tool. Ship's pages are a work tool's working screens, except Marketing, which is a marketing page. Looks reviewed: Playbook (Blue), After Linear, After Primer.

Source: `src/pages/systems/looks.astro`, `src/components/look/Gallery.astro`, `src/demos/looks/` (Gallery.tsx, Panel.tsx, wall/, ship/), plus `src/ui/*` where a Ship screen draws a kit part.

Shots: `shots/review/looks/<look>-<page>-{1280,375}-{light,dark}.png` (40 full-page shots), close-ups `zoom-stat-card.png`, `zoom-menu.png`, `zoom-history.png`, and `playbook-releases-filters-1280-light.png` (after Clear selection). The contrast probe (every visible text node composited over its real background, WCAG 2.2 ratio) ran on all eight Ship pages in Playbook light and dark, and on Linear releases/cards/dashboard and Primer dashboard/cards/releases in both themes. Geometry, focus and scroll were read with `pnpm shoot --eval`. The Astro dev toolbar floating in the shots is dev-only and ignored.

Count: **10 must, 17 should, 21 nit.**

## 1. Findings

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| 1 | must | Gallery chrome, every route (`Gallery.module.scss:5` `min-height: calc(100dvh - 65px)`, `:14` and `:110` `position: sticky`) | SKILL floor / component-app-shell: "An app's window holds still; each pane scrolls on its own." Common mistake: "A sticky sidebar on a page that scrolls." | The document scrolls as one: Dashboard is 1605px tall in an 800px window; no element is a scroll container (`scrollers: []`). The rail and page bar only stay by `sticky`; the rail's right hairline stops at y=572. | Make the gallery a `100dvh` shell: `grid-template-rows: auto minmax(0,1fr)`, `min-height: 0` on each layer, rail and stage each `overflow-y: auto` with `tabindex="0"` and a name (the stage named for the page it shows). On a phone (≤760) let it scroll as one, as App shell allows. |
| 2 | must | Every Ship work page (`ship/Shell.module.scss:6` `min-height: 100%`; `.main` has no scroll) | component-app-shell Avoid "The window scrolls … the sidebar goes with it"; floor as #1 | Scrolled to the end of Dashboard, Ship's sidebar moves from y=165 to y=−640 and its header with **New release** to y=−639. Settings: −115. | Give Ship's shell `height: 100%` of a stage that is itself bounded (needs #1), sidebar and `.page` each `overflow-y: auto`, `min-height: 0` between. The header stays above `.page`. |
| 3 | must | `?page=dashboard`, the four figures (`ship/Dashboard.tsx:44-57`) | principle-the-lightest-boundary Avoid "Three equal tiles … a tile per figure"; SKILL: "Figures read together sit in one row on one surface, a line between them." | Four bordered, shadowed tiles (each 357×136 at 1280) for Live releases, Crash-free, Adoption, Time to roll out. At 375 they stack as four boxes of ~130px. The Cards page's own `Stats` does it right: two figures on one surface. | One surface with the four figures in a row and a `line` between them (2×2 with lines at ≤900 container, a stacked list with lines at ≤520). |
| 4 | must | `?page=settings`, every group (`ship/Settings.tsx:20-64`, `s.card` per group) | principle-the-lightest-boundary Avoid "Every section a card"; Prefer "Headings and space; one box where it's needed … the danger zone is the one region set apart" | General, Rollouts and Danger zone each sit in a bordered card. This is the page's own Avoid example, rebuilt. | Drop the card from General and Rollouts; hold each by its heading and space on one left edge. Keep the box only on Danger zone. |
| 5 | must | `?page=cards` Releases card (`wall/History.tsx:20`, Table not `flush`), and Ship's cards inside its window panel (`ship/Shell.module.scss:120-128` `.main` box; `Page.module.scss:28-36` `.card`) on Dashboard, Settings, States and Overlays | principle-the-lightest-boundary: "never a box inside a box"; component-card: "cards don't go inside cards" | `zoom-history.png`: the table's own frame (1px line, radius 10, sunken header) inside the card's frame. Dashboard/States/Settings: a 1px-bordered, shadowed card inside the 1px-bordered, shadowed `.main` panel, inside the gallery stage. | History: pass `className={s.flush}` (or the Page flush class) so the card is the table's frame. Ship: either drop `.main`'s box and let the sidebar/content split be a hairline (Linear, Primer do this), or keep `.main` and draw the pages' groups by heading, space and lines (with #3 and #4 most boxes go anyway). |
| 6 | must | `?page=cards`, Publish 4.2.0 (`wall/Publish.tsx:29`) | component-switch Common mistake: "A switch in a form with a Submit button." | **Email subscribers** is a Switch in a form that ends in Save draft / Publish. | Make it a Checkbox: "Email subscribers when it's published". |
| 7 | must | `?page=overlays`, menu shortcuts **E** and **⌘ L** (`src/ui/Menu.module.scss:173` `color: var(--ink-disabled)`) | SKILL floor: "Text holds 4.5:1 … muted and secondary text too … hints included." | Probe: "E" 1.96:1 and "L" 2.36:1 on the menu (light), 1.39 and 1.90 (dark). `zoom-menu.png`. The Menu page's own Anatomy asks for `ink-disabled` here (see Gaps). | Set shortcuts in `ink-muted` (6.4:1) and keep "a step lighter than the label" by weight or by staying a step from `ink`; dim further only for an unavailable row. Then fix the Menu page's Anatomy row. |
| 8 | must | `look=linear`, info badges and avatars (`src/looks/linear.ts:56-60`, `accent-text` light `#5a68cf`) | SKILL floor: "Text holds 4.5:1 … badges … included." | Probe, Linear light: "Rolling out" badge 4.04:1, and 3.42:1 on a selected row (Releases); avatar initials MC/JB/AO 4.04:1 at 11px (Cards). Linear dark: "Rolling out" 4.49:1. The look's note says "4.9:1 on white", but the badge sits on `accent-soft`, not white. | Derive `accent-text` light a step darker (e.g. `color-mix(in oklab, #5a68cf, #000 18%)`) and dark a step lighter, then re-probe on `accent-soft` and on a selected row; record the measured ratio in the note. |
| 9 | must | `?page=overlays` at 375, Menu scene (`ship/Overlays.module.scss:22` `overflow: hidden`) | owner: "inspect the rendered geometry: overlaps, clipped text"; component-menu Anatomy "Width: the widest row" | `playbook-overlays-375-*.png`: the menu runs 31px past the scene (`scrollWidth − clientWidth = 31`); the shortcut column (E, ⌘ L) and the right edge are cut off. | At narrow widths anchor the menu to the right of its trigger or move the trigger left (`.menuStill` `justify-items: end` under 640px container), so the whole popup sits inside the scene. |
| 10 | must | `?page=releases`, **Clear selection** (`ship/Releases.tsx:85`) | owner: "focus follows the action and never falls to `<body>`." | Clicking the X removes it with the bulk bar; `document.activeElement` is then `BODY`. | After clearing, move focus to the select-all checkbox (or the filter control that replaces the bar). |
| 11 | should | Ship's logo mark, `ship/Shell.tsx:27`, `marketing/Marketing.tsx:16`, `:51` | SKILL floor / component-icon: "A logo is … supplied by its owner, or set in type." | An "S" in an accent-filled 20–22px rounded square, drawn for the occasion, on every Ship page and twice on Marketing. | Set the name in type only: **Ship** in `weight-strong`, no tile. |
| 12 | should | Icon-only buttons with no tooltip: Notifications (`ship/Shell.tsx:66`), Clear selection (`Releases.tsx:85`), Dismiss (`Overlays.tsx:100`) | component-button: "An icon-only button always has a tooltip with the same words as its aria-label."; `src/ui/Button.tsx:11` "Needs an aria-label and a Tip." | Hovering any of them shows nothing. | Wrap each in the kit's Tip with the same words. |
| 13 | should | Ship sidebar search, `ship/Shell.tsx:35` `<kbd>⌘K</kbd>` | SKILL floor: "A text symbol … never stands in for an icon"; component-menu: "Geist has no ⌘ … here they're Lucide icons." | ⌘ is a typed character, drawn by a fallback font. The kit already has the fix: `src/ui/Field.tsx:98` renders ⌘ as Lucide `Command`. | Use the Field key helper (or `TipKeys`) for ⌘K. |
| 14 | should | Static cards and the window panel carry `shadow-sm` plus a border: `Page.module.scss:35`, `wall/Wall.module.scss:21`, `ship/Shell.module.scss:126` | principle-a-shadow-says-how-high: shadows are for what covers, floats or is picked up, "not … to part a surface from a plain ground"; table: `shadow-sm` is "A toolbar, a card under the pointer"; component-card: "Only cards that open lift". | Computed on Dashboard: `border 1px #e4e4e8` and `box-shadow: 0 2px 4px …, 0 0 0 1px rgba(24,24,27,.07)`. The look's `shadow-sm` already includes a hairline ring, so every card draws two edges (`zoom-stat-card.png`: a 2px grey rim). None of these cards opens. | Static panels: border only, no shadow. If a resting lift is wanted for a real card, use one edge (border or the ring, not both) at the `shadow-xs` height. |
| 15 | should | Amber (`warning`) means two things: "In review" (`ship/data.ts:165`, `wall/History.tsx:8`) and "Running" (`wall/Checks.tsx:7`, `ship/Release.tsx:21`, `ship/Donut.tsx:8`) | principle-colour-means-one-thing: "Each colour says one thing." | On the Cards page the same amber marks a running build and a release waiting for review; neither is a warning. | Give "Running" the neutral or info tone (it's progress, not a caution), and keep amber for one meaning. |
| 16 | should | Avatars in the accent: `wall/Team.module.scss:8`, `ship/Release.module.scss:62` | principle-who-before-what: "Not on a face: the accent's hue"; principle-colour-means-one-thing: "Accent text is a link" | MC, JB, AO and SR are `accent-text` on `accent-soft`: they read as links and spend the accent on identity. | Initials on the pastel set from the address (Post's), or grey; never the accent hue. |
| 17 | should | `?page=overlays` Dialog, "Halt 4.1.3 for Android?" (`ship/Overlays.tsx:77-86`) | component-dialog: "Confirming the undoable. Every extra Are you sure? trains people to click through"; Confirm is "for an uncommon action that can't be undone." | Its own body says "You can resume later." | Show a confirm for something that can't be undone (e.g. "Delete 4.1.3 for Android?" … "Its rollout history is lost."), and show Halt as a toast with Undo. |
| 18 | should | Gallery: the look list and the page bar (`Gallery.tsx:59`, `:73`) | component-tabs: "views with their own URL are navigation; past about six, a sidebar or a Select"; principle-where-the-eye-goes (information scent) | Both are `<button aria-pressed>` that rewrite `?look=` / `&page=`; each view has its own URL, but they can't be opened in a new tab, copied or middle-clicked. | Render them as links (`<a href="?look=…&page=…" aria-current="page">`), intercepting the plain click to keep the client-side swap. |
| 19 | should | `?page=cards`, Publish 4.2.0 "First rollout" (`wall/Publish.tsx:28`) | component-slider: "A number people know exactly wants a field"; the slider is for "a value you judge by eye while watching the result." | A release's starting share is an exact number. Overlays' popover asks for the same value in a text field ("Share of users 50%"). | Use the same field here (or a field beside the slider), as the popover does. |
| 20 | should | `?page=cards`, Notifications (`wall/Notify.tsx`) | component-checkbox: "A checkbox that saves on the spot. If nothing waits for a Save or Submit, it's a Switch"; component-radio: "the choice waits for the form to be sent." | Three checkboxes and a radio group with no Save. | Switches for the three events (applies at once) and a segmented control or Select for "Send to"; or add a Save row. |
| 21 | should | `?page=overlays` at 375, toasts (`ship/Overlays.module.scss` `.toast`) | component-toast Anatomy "Width: fits the text, 320 to 440"; Copy: "Failures say what failed and why." | At 375 each toast is 275px and the failure reads "Couldn't reach the Play S…". | Let the toast wrap to two lines under 320, or shorten the text; keep the object whole. |
| 22 | should | Gallery at 375, picking a look or a page | principle-where-the-eye-goes Avoid "Count changes in the corner … goes unseen"; owner: "the main area reflects the last action." | The rail (title, 4-line summary, seven looks in two columns), the page row, the theme row and the links row fill the first ~560px of an 812px screen; tapping a look redraws Ship below the fold. | On a phone, put the looks in a Select (or one scrolling row) in the bar and drop the summary, so Ship starts in the first screen. |
| 23 | should | Ship below a 720px container (`ship/Shell.module.scss:17-19` `.sidebar { display: none }`) | component-app-shell: "a phone screen … shows one pane at a time"; owner: "layout changes re-home context rather than hiding it." | At 375 the sidebar (places, Inbox, counts) is gone and nothing opens it. | Add a sidebar button in Ship's header that opens the places as a sheet, or a back link to them. |
| 24 | should | `?page=marketing`, hero (`marketing/Hero.tsx:10`, class `eyebrow`) | SKILL marketing tells: "an uppercase label above every heading"; principle-every-line-does-a-job Avoid "An eyebrow" | "Staged rollouts for iOS, Android and the web": 12px, 600, `accent-text`, above the headline. Sentence case and only once, but it is the pattern, in the accent. | Fold the fact into the lede ("Staged rollouts for iOS, Android and the web: Ship rolls each release …") and drop the line. |
| 25 | should | `?page=marketing`, Pricing (`Marketing.module.scss` `.plan`) | SKILL marketing tells: "identical rounded cards with one soft shadow" | Three equal rounded cards, each `shadow-sm`; the featured one adds an accent ring and `shadow-md`. | Set the plans as columns on one surface with lines between (as figures read together), and mark Team by its fill button and badge alone. |
| 26 | should | `?page=marketing` at ≤640 container (`Marketing.module.scss` `.links { display: none }`) | owner: "layout changes re-home context rather than hiding it." | At 375 Product, Pricing, Changelog and Docs vanish from the header, and Privacy, Terms, Status from the footer, with no menu. | Keep the footer links (wrap them), and give the header a menu button that lists the links. |
| 27 | should | `?page=releases`, sort by Updated ↓ (`ship/Releases.tsx:43`, `sortBy: -r.age`) | component-table: the sorted column's arrow states the order; principle-every-line-does-a-job: a state line must be true | First row "5h ago", second "2h ago" under "Updated ↓" (both `age: 0`). | Sort on a real timestamp (minutes ago) so ties can't invert. |
| 28 | nit | Selects for three options: Settings "Default channel" (`Settings.tsx:26`), Publish "Channel" (`Publish.tsx:20`) | component-select: "Two to four options are better all in sight as a Segmented control or Radios." | Stable / Beta / Nightly in a Select. | Radios (settings) or a segmented control. |
| 29 | nit | `?page=release` and `?page=states`: more than one fill | component-button: "One filled button per view." | Release: **New release** and **Comment** (once typed). States: New release, Connect repository, Sign in. | Make the header's New release secondary on detail and state pages, or drop it from pages whose own action is the point. |
| 30 | nit | Ship sidebar current item on Overlays and States (`Overlays.tsx:22`, `States.tsx:9` `section="releases"`) | owner: the active item reflects the last action | The header says Overlays/States, the sidebar lights Releases. | Pass no current section for these sample pages, or name them in the header as Releases sub-views. |
| 31 | nit | `?page=release`, breadcrumb "Releases" (`Release.tsx:44`) | owner: every state names "the way back" | The crumb is a muted `<span>`; nothing leads back. | Make it a link (even to `?page=releases`). |
| 32 | nit | Ship shell anatomy (`Shell.module.scss`) | component-app-shell Anatomy "Title bar or toolbar 48", "Sidebar 240"; system-work-tool "13px in … sidebars" | Header 52px tall; sidebar 220 wide; sidebar rows 14px. | 48 / 240 / 13px, or record the departure. |
| 33 | nit | `?page=overlays` Dialog width | component-dialog: Confirm `dialog-sm` (400) | 323px at 1280 (scene caps it at 360). | Let the scene take 400 + padding, or note the cap. |
| 34 | nit | `?page=overlays` Popover | component-popover Anatomy "Gap to trigger 6"; Copy "Title: what the panel is for, matching its trigger" | Gap 4px (trigger bottom 275, popup top 279). Trigger "Rollout 25%", title "Raise the rollout". | 6px; title "Rollout" or trigger "Raise rollout". |
| 35 | nit | Data that contradicts itself (`ship/data.ts`, `Shell.tsx:15-19`, `Dashboard.tsx:11-24`, `Release.tsx:13-18`, `wall/Team.tsx:9`) | principle-every-line-does-a-job: "a status what's true"; "One word for one thing" | Sidebar platforms 5/4/3 vs 4/4/4 rows in data; "Live releases 9" vs 8 Live rows; timeline "finished checks: 3 passed, 1 changed" while Checks shows one still running and one failed; "Ade Okafor" on Cards vs "Ada Okafor" elsewhere; Recent runs 2h, 1d, 1d, 4d, 5h. | Derive counts from `releases`; fix the strings; sort Recent by time. |
| 36 | nit | Gallery bar at 1280 (`Gallery.module.scss:108-124`) | owner: "Panels and lists need a grid"; work-tool: one row of controls | The bar wraps: Values and sources + Copy :root sit alone on a second row, making it 92px tall. | Let the page row scroll (it already can) so the bar stays one row, or move the link and Copy into the rail. |
| 37 | nit | Gallery rail copy (`Gallery.astro`, `item(... 'The playbook’s own')`) | principle-every-line-does-a-job Avoid "Every row starts …" (same words on every row); system-work-tool "A tagline under the page title" | "The playbook's own" five times under five palettes; a 4-line summary under "Looks". | Second line names what differs (the accent: "Blue #0071e3"), and the summary goes to the look pages. |
| 38 | nit | Primer look, segmented controls stay pills while Primer controls are 6px (`--radius-control: 6px`) | system-look-primer: the look's values drive the components; component-segmented Anatomy "radius-full" | Primer dashboard: "7 days / 14 days / 30 days" track and thumb are pills beside 6px buttons. | Have SegmentedControl read `--radius-control` (inner = outer − 2). See Gaps. |
| 39 | nit | Ship sidebar rows are `<span>` with a hover fill (`Shell.tsx:42-49`, `.item:hover`) | component-card: "Lift is a promise only a link or a button can keep" (hover promises a click) | Rows highlight under the pointer and do nothing; the search box is a `div`. | Drop the hover on inert rows, or make them links to the matching `?page=`. |
| 40 | nit | Marketing anchors (`Marketing.tsx:26`, `:56`) | owner: no dead ends | `#ship-changelog`, `#ship-docs`, `#ship-privacy`, `#ship-terms`, `#ship-status` have no target. | Point only to sections that exist, or render the rest as plain text. |
| 41 | nit | `?page=states` sign-in Email (`States.tsx:46`) | component-input Known issue: "`type="email"` answers first … Use `type="text"` with `inputMode="email"`." | `type="email"`. | As the page says. |
| 42 | nit | `?page=settings` "Archive" (`Settings.tsx:56`) | component-button Copy: "Start with a verb that names the result: … Create project" | Button reads "Archive". | "Archive project". |
| 43 | nit | `?page=releases` search and platform filter (`Releases.tsx:113-120`, `s.bare`) | component-input Avoid "Placeholder as label" | The Search label is visually hidden; once typed, nothing names the box but the magnifier. | Acceptable for a filter search by convention; record it, or keep the magnifier and add a clear button. |
| 44 | nit | `?page=marketing` at 375 | principle-where-the-eye-goes (weight decides where the eye lands) | Headline and every section title are both 35px. | Keep the hero a step above the section titles at the clamp's floor. |
| 45 | nit | `?page=overlays` failure toast copy | component-toast Copy: "Failures say what failed and why: Couldn't export: the file is locked" | "Couldn't reach the Play Store" says why, not what. | "Couldn't publish 4.1.3: the Play Store didn't answer". |
| 46 | nit | `?page=release` Comment button disabled while empty | component-button: "Disabled with no reason." | Grey "Comment" with no reason nearby. | Common practice (GitHub does it); record it, or leave enabled and focus the field on press. |
| 47 | nit | `linear` look, the stage's foot | owner: "inspect the rendered geometry" | Linear releases 1280: Ship's white window ends ~10px above the stage's foot, leaving a strip of the gallery's grey (y≈790–800). | Fold away with #1/#2 (the panel fills a bounded stage). |
| 48 | nit | `ship/Donut.tsx` centre label | owner: dead parts | The centre `<span>` with the pass rate is rendered and hidden (`Charts.module.scss` `.donut > span { display: none }`). | Remove it, or show it. |

Not reported: the Avoid patterns the gallery shows on purpose do not exist here; every screen is meant as a Prefer. Hover and press states of kit parts were not re-reviewed; they have their own component audits.

## 2. Ledger

pass = measured or read in source and holds; fail = finding #; n/a = with reason. Measured at 1280 light unless noted.

### Floors (SKILL.md)
- Text 4.5:1: **fail #7, #8**. All other text on 8 pages × 2 themes (Playbook) and 6 pages × 2 themes (Linear, Primer) passes; disabled text (Previous, Comment) exempt.
- One icon library, one stroke, sized to text, no symbols: **fail #13** (⌘ typed). Lucide everywhere else; 16 beside 14px, 14 beside 12px deltas, 18 beside 16px feature titles.
- No hand-drawn SVG; logo supplied or in type: **fail #11**. Charts are data marks (bars, polyline, conic donut), not icons: pass.
- Window holds still, panes scroll: **fail #1, #2**.
- `100dvh`, not `100vh`: gallery uses `100dvh` in a `min-height` (pass on unit, fail on structure #1).
- Pane with no links gets tabindex and a name: n/a until #1 (no pane scrolls).

### What you're building
- Work tool for the gallery and Ship pages; marketing for Marketing: classified as such. Work tool lead "grey surfaces, one accent, no entrance motion": pass (no entrance motion; one accent; grey surfaces). Marketing tells: **fail #24, #25**; "→ after every link": pass (one arrow, on the hero CTA); gradient washes: pass (hero mask is a fade, not a wash); "one word accented in a headline": pass.
- Sign-up/empty screen takes the product's system: pass (States).

### While you build (SKILL moments)
- Sections: **fail #4, #5**. Section actions on the heading row: pass (Checks "Re-run failed", Releases bulk bar).
- Figures together: **fail #3**; Cards `Stats`: pass.
- Spacing and aligning: pass (Settings labels on one edge; table columns; Releases bar 32px controls).
- Labels/buttons/messages: **fail #42, #45** (nit); no please/sorry/we: pass; no eyebrows in product screens: pass; Marketing eyebrow #24.
- Confirming: **fail #17**; Undo toast: pass.
- Validating a form: n/a (no field validates on these screens).
- Sign-up/empty: pass (one icon, words name the next step: Connect repository, New hotfix, Try again).
- Opening dialog/sheet: n/a (held-open stills, no live open; initial focus not exercised).
- Waiting: pass (skeleton for a list load; pulse off under reduced motion). 300 ms delay: n/a (static state).
- Animating: pass (no entrance motion, no layout shift on hover; tabs and segmented change colour only).
- Colour: **fail #15, #16**; accent defined once as a variable per look: pass.
- Shadow / radius: **fail #14**; concentric: pass (see principle).
- Offering a choice: **fail #6, #19, #20, #28**.
- List or table: pass (lines not stripes, numbers right, name column filled).
- Menus and hover: n/a (still menu; no submenu).
- Shortcuts: n/a (shown in menu and tooltip only; no shortcut system on these pages).

### component-app-shell
- Avoid "window scrolls" / Prefer "each pane scrolls": **fail #1, #2**.
- min-height 0 on every layer, rows `minmax(0,1fr)`: **fail #1** (`.stage` is `auto 1fr`).
- Full height is `dvh`: pass on unit.
- Anatomy: window 100dvh **fail #1**; toolbar 48 **fail #32** (52); sidebar 240 **fail #32** (220); sidebar rows 32 pass; sidebar foot 48 n/a (Ship has no foot); panes overflow auto **fail #2**; hairline at sidebar edge: Ship uses the panel's border, pass.
- States: pane tab stop: n/a until panes scroll.
- Common mistakes: overflow on pane only n/a; 100vh pass; sticky sidebar on a scrolling page **fail #1**; content jumps (scrollbar-gutter) n/a (no pane scrolls); account in a scrolling sidebar n/a (none).
- Copy: name each pane: Ship sidebar `aria-label="Ship"` pass; content pane unnamed (n/a until it scrolls).

### component-badge
- Avoid dot only / Prefer dot and word: pass. Soft not solid: pass. Dot for states, none for attributes: pass ("Most teams" has no dot; statuses do).
- Anatomy: height 20 pass (20); padding 8 pass; pill pass; 12/500 pass; status tones pass; neutral (Draft) pass; dot 6 pass by eye.
- States, both themes: pass in Playbook and Primer; **fail #8** in Linear.
- Common mistakes: badge per row → status column with header: pass; red for new: pass; truncated: pass; badges as buttons: pass.
- Copy: one or two words, adjectives/participles: pass ("Rolling out" is a progressive; acceptable).

### component-button
- Filled not outlined: pass. Hover in/out timings, press 0.97, busy: n/a (kit, not re-measured).
- One filled button per view: **fail #29** (nit); dialog's one fill is danger: pass.
- Anatomy: 32/24/40 heights pass (Ship bars 24, filter bar 32, hero 40); pill pass (Primer 6px is the look's); label 500 pass.
- Icon-only has a tooltip: **fail #12**.
- Common mistakes: shadow to lift pass; colour as rank pass; disabled with no reason **#46** (nit).
- Copy: verb names the result: **fail #42** (nit); "View" on the Cards alert is an allowed toast-style verb but a card button: nit folded into #42's spirit, not counted; sentence case pass; dialog verb matches title ("Halt … ?" / "Halt rollout"): pass.

### component-card
- When to use: units browsed by sight. The Wall's and Dashboard's "cards" are panels, not Card units: judged under boundaries (#3–#5).
- Only a card that opens lifts / no hover on static card: pass (no hover lift). Resting shadow on non-opening cards: **fail #14**.
- Small lift, stagger, blur numbers: n/a (no card opens; no number change).
- Anatomy (frame 18, stage, meta): n/a (no Card component on these pages).
- Common mistakes: buttons all over pass; text on stage n/a; uneven heights n/a (masonry by design); stagger n/a; stage radius n/a.
- "cards don't go inside cards": **fail #5**.

### component-checkbox
- Whole row is target: pass (label wraps). Mixed parent: pass (select-all is mixed with 2 selected).
- Anatomy 16, radius 4, accent fill, Lucide mark, gap 8, 14/20: pass by eye.
- Common mistakes: saves on the spot **fail #20**; negative labels pass; consent pre-ticked n/a; disabling without reason n/a.
- Copy: label true when checked pass.

### component-combobox (Approvers)
- When to use: several values from one list as chips: pass (4 people, multiple).
- Forgiving match, first ready for Enter, bold match, empty names next step: n/a (not opened on this page; kit reviewed elsewhere).
- Anatomy field 32, chips 24: pass by eye. Common mistakes: chips wrap inside field pass (375 wraps). Copy: label noun "Approvers" pass; placeholder "Add a person" pass.

### component-dialog
- Kind: Confirm. Undoable confirmed **fail #17**.
- Title is the decision with its object: pass. Cancel and a verb: pass. Fill danger: pass. Focus on Cancel / Esc / scrim does nothing: n/a (still image).
- Anatomy: scrim pass; surface-raised + shadow-lg pass; radius 18 pass; padding 20 pass; title 18/26/600 pass; width 400 **fail #33**; buttons trail right, Cancel first pass.
- Common mistakes: dialog on arrival n/a; explaining buttons pass; scrolls pass.

### component-icon
- Symbol isn't an icon **fail #13**; emoji none pass; icons beside words pass; sized to text pass; drawn for the occasion **fail #11** (logo).
- Kinds: alone only for conventional controls (bell, X, more, copy) pass; status shapes (CircleCheck/CircleX/LoaderCircle) pass.
- Anatomy: 16 beside 14 pass; 14 in dense rows pass; currentColor muted/ink pass; button around it 24/32 pass.
- Common mistakes: two libraries pass; icon nav alone pass (sidebar has words); icon button with no name pass (aria-labels present); 24 beside 14 pass.

### component-input
- Check on leave: n/a. Error under field: n/a. Label above, example inside: pass except **#43** (nit). Width says how much: pass enough (full-width settings fields; Invite field sized).
- Anatomy: 32, radius 10, line-strong edge, padding 12, label 12/500 muted, 4 apart: pass by eye and measure (filter field 30 + border = 32).
- Known issues: 16px on touch n/a (375 shots are not touch-emulated); `type=email` **fail #41**.
- Common mistakes: hint repeats label pass ("Set by the App Store; read only."); read-only keeps ink pass.
- Copy: placeholders as examples pass ("you@company.com", "name@company.com"); "Leave a comment" is an instruction (nit, not counted separately; same as #43 family).

### component-menu (Overlays, pull-down)
- Icons on every row of a group: pass. Shortcuts only where the command has one: pass. Unavailable dimmed: n/a.
- Highlight 9%: pass by eye. Destructive row stays red, last group: pass. Check leading column: n/a. Bare symbols in a column: pass in form, **fail #7** in contrast. Grows from trigger: n/a (still).
- Anatomy: radius 10 pass; inset 4 pass; width ≥160 pass (200); separator inset pass; item radius 6 pass; item 32 pass; label 13 pass; shortcut `ink-disabled` **fail #7** (against the floor); label-to-shortcut 24 pass; surface-raised + shadow-md pass.
- Common mistakes: all pass. Copy: verbs, sentence case pass.
- Geometry at 375: **fail #9**.

### component-popover
- Grows from trigger, focus in/out, draft kept: n/a (still). Trigger stays filled: pass.
- Anatomy: surface-raised, shadow-md, radius 10 pass; width ≤320 pass (209); gap 6 **fail #34**; title 13/600 pass; description muted pass; actions right, small, 8 apart pass.
- Common mistakes: hover open n/a; decision in popover pass; nesting pass; unnecessary Save pass (typed field).
- Copy: title matches trigger **fail #34**; action verb "Raise" pass.

### component-radio
- One chosen from the start: pass (10%, Email). One tab stop/arrows: kit, n/a. Column not row: pass (Settings); row for two single words: pass (Notify).
- Anatomy: pass by eye. Common mistakes: no default pass; acts on the spot: Settings page has no Save at all (see Gaps); Notify **fail #20**; Yes/No as radios pass.
- Copy: group label pass; option labels parallel pass; descriptions not restatements pass.

### component-segmented-control (Theme, Range, Show)
- One thumb that slides: kit, n/a. Equal widths: pass (Range 73/73/73; Show 64×4; Theme 54/54). Raised not coloured: pass. Words or icons: pass.
- Anatomy: track 32 pass; thumb raised pass; label 13/500 pass; height matches buttons beside: pass. Primer radius **#38**.
- Common mistakes: label repeats options pass (aria-label only); six segments pass; segments that do something pass; changing the page's main content: Show filters the table (a view mode, beside the table) pass.
- Copy: nouns, similar length pass.

### component-select
- Current option check, opens over trigger, useful default, two chevrons: pass by eye (closed); default chosen pass.
- Anatomy trigger 32, radius 10, line-strong: pass.
- When to use 2–4 options **fail #28**. Common mistakes: Yes/No pass; commands pass; empty first option pass; long options pass.
- Copy: label noun pass ("Default channel", "Platform").

### component-sheet
- n/a: no sheet on any Ship page. (#23's fix would add one.)

### component-slider (Publish)
- When to use **fail #19**. Whole row drags, label and value inside, tabular digits: pass by eye. Common mistakes: visible value pass; precise number **#19**. Copy: "First rollout" noun-ish pass; value with unit "25%" pass.

### component-switch
- Takes effect or it's a checkbox: **fail #6**; Settings switches pass.
- Label names the setting: pass. Anatomy 32×20, trailing in settings lists: pass (Settings trailing; Publish trailing in a form, which should be leading if it stayed).
- Common mistakes: switch in a form **#6**; On/Off text pass; confirmation after flipping pass.
- Copy: pass.

### component-table (Releases, History)
- Numbers right, tabular: pass (Rollout right, `tabular-nums`, header right). Lines not stripes: pass. One arrow on the sorted column: pass. Secondary columns muted: pass (Owner, Updated). Name pinned when scrolling: n/a (optional columns drop instead of scrolling at 375).
- Anatomy: frame line, radius 10, no shadow: History pass, Releases flush pass; header 32 sunken pass; row 36 at 13px pass; cell padding 12 pass; numbers right pass; hover/selected accent-soft pass.
- States: aria-sort present (descending on Updated) pass; select-all mixed pass; bar names the count pass.
- Common mistakes: status colour alone pass (badges with words); actions in every row pass; truncating name pass; row click vs checkbox n/a.
- Copy: headers nouns pass; empty cell en dash n/a (none empty); sort truth **fail #27**.
- Box inside a box (History in a card): **fail #5**.

### component-tabs (Release; Changelog card)
- Weight stays put: pass (500 throughout). Bar is ink: pass. One row: pass. Count in a quiet chip: pass ("4").
- Anatomy: tab 40, gap 16, label 14/500, bar 2px ink, line full width: pass by eye.
- Common mistakes: tabs hide required input pass; controls above that act on one panel pass; tabs that reset n/a; single tab pass.
- Copy: nouns, parallel pass (Overview/Checks/Notes; Write/Preview are verbs, parallel with each other).
- Gallery page bar as a navigation strip: **#18**.

### component-toast
- Undo instead of asking: pass (live-for-25% with Undo). Colour on icon only: pass. Three at most: pass.
- Kinds: Done with Undo pass; Failed stays until closed with X pass (still).
- Anatomy: pill pass; height 40 pass; width 320–440 pass at 1280 (320), **fail #21** at 375 (275); icon 16 kind colour pass; text one line **#21**; shadow-lg pass.
- Common mistakes: errors that disappear n/a; links and paragraphs pass; toasts on load n/a (demo).
- Copy: past tense with object: "4.2.0 is live for 25%" is a state, acceptable; failure what+why **fail #45** (nit).

### component-toolbar
- n/a: no floating toolbar. The Overlays "toolbar" is a layout row for the tooltip and menu stills.

### component-tooltip
- Inverse ink, no shadow: pass. One line, name then shortcut glyphs dimmed: pass (⌘ as Lucide icon via `TipKeys`). Offset 4: pass by eye. Shared delay: n/a (still).
- Common mistakes: clickable inside pass; tooltips on labelled buttons pass; sentences pass.
- Copy: tooltip = aria-label ("Copy link") pass.
- Missing tooltips elsewhere: **#12**.

### principle-a-shadow-says-how-high
- Shadow only on what covers/floats: **fail #14** (static cards, window panel); menu, popover, dialog, toasts pass.
- Not to group/rank/part from a plain ground: **fail #14**.
- Offset says how high; two shadows two jobs: look values pass (hairline + contact + drop on md/lg).
- Dark: depth is lightness: pass (surface #16171a over bg #0e0f11; raised #1e1f23 popups).
- One light, few heights: pass.
- Heights table: card at rest `shadow-xs` → Ship uses `shadow-sm` **#14**; menu/popover md pass; dialog/toast lg pass.

### principle-attention-wears-off-waiting-doesnt
- Frequent actions ≤120 ms, never hold the next press: pass (page and look switches are instant; no transitions on swap). Rare-moment delight: n/a.

### principle-colour-means-one-thing
- Accent only on "do this now": pass (New release, Publish, Sign in, Connect repository, Start a trial). Current states in shape/shade: pass (fills, ink tab bar, raised segment).
- Hover isn't selection: pass. Red only for wrong: pass (Halted, Failed, Delete, danger zone). Accent text is a link: **fail #16** (avatars); info badge text is Badge-sanctioned; marketing feature icons and pricing ticks in `accent-text` (marketing, not counted).
- Each status colour one meaning: **fail #15**.

### principle-concentric-radius
- Inner = outer − inset − border: pass (menu 10/4/6; toast pill in pill; dialog 18 with 20 padding keeps pill buttons; segmented pill in pill). Uneven inset: pass. One radius for everything: pass. Primer segmented vs 6px controls: **#38** (consistency, not concentricity).

### principle-error-timing
- n/a: no field validates on these screens; the sign-in form doesn't submit.

### principle-every-line-does-a-job
- Every line names a thing, action or state: pass in product screens except **#35** (lines that state something false). Word that differs first: pass. No eyebrow in product: pass; marketing **#24**. Error says what failed where: pass (States error card); toast **#45**. Specific verb: **#42**. Confirm only what can't be undone: **#17**. Sentence case: pass.
- Words by place: headings pass; buttons pass; menu items pass; field labels nouns pass; hint constraint pass; placeholder example pass; empty state "No releases yet · Connect repository" pass; toast pass; confirmation **#17**.
- No we/please/sorry/Your: pass. One word for one thing: **#35** (Ade/Ada; History "Failed" vs Releases "Halted" for 4.1.x is data, folded into #35).
- Gallery chrome: **#37**.

### principle-grey-until-it-matters
- Grey carries the screen: pass. Decoration (swap test): marketing allowed; the gallery's rail summary **#37**.
- Regions cost: **#3, #4, #5**.

### principle-hover-forgives
- n/a: no submenus or hover-revealed actions. Hover never hides the only way: pass.

### principle-how-waiting-feels
- Skeleton for a page/list load: pass (States). Delay 300/min 500: n/a (static). Optimistic result: n/a.

### principle-lightness-first
- Text roles meet contrast: Playbook pass; Linear **#8**; menu shortcuts **#7**. Status colours part by lightness: Playbook pass (danger 46, warning 54, success 52 in L). Dark re-mapped not inverted: pass. Accent fill with white label: pass all three looks.

### principle-never-too-busy-to-listen
- n/a for these stills; segmented thumb and tabs bar are kit transitions (reversible). Pass by source.

### principle-nothing-shifts
- Bold widens: pass (tabs and page bar change fill/colour only). Gutter: n/a (no scrolling pane; becomes relevant after #1/#2: add `scrollbar-gutter: stable`). Late font: n/a. Copy → Copied keeps width? The label grows from "Copy :root" to "Copied" (shrinks); trailing button so nothing after it moves: pass.

### principle-reading-text
- n/a: no reading text (Release Notes tab is 14px, 60ch: interface text, pass).

### principle-space-groups-by-ratio
- Label/field/hint 4, fields further: pass (Settings, Publish). Headings nearer their group: pass (Settings 12 below, 24 above). One left edge per kind: pass within Ship; Settings column centred at 640 sits on a different edge from the panel header (deliberate settings column, pass).

### principle-the-faster-way
- Keys shown on the slow path: pass (menu rows carry their keys). Tooltip-only teaching: n/a.

### principle-the-lightest-boundary-that-holds
- Avoid every section a card: **fail #4**. Avoid three equal tiles: **fail #3**. Innermost box wins / box inside box: **fail #5**. Lines lighter than the edge, only between rows: pass (rows `line`, none after last in Recent, Checks, Legend). Indent only real hierarchy: pass.
- Which boundary table: pass for Releases (lines), Danger zone (one box), plans (cards, but see #25).

### principle-where-the-eye-goes
- Changes away from the click: **fail #22** (phone). Illusion of completeness: pass (hero product shot cut at the fold). Banner blindness: pass (Cards alert is a plain soft panel). Sort before read (4 within, 20 between): pass. Information scent: pass; gallery links **#18**.

### principle-who-before-what
- Face column filled every row: pass (Team, Release composer only). Accent on faces: **fail #16**. Companies square: n/a. Size 24–36: pass (28).

### system-work-tool
- Body 14/20 pass; 13 in rows pass; 13 in sidebars **#32**; labels 12 pass; contrast **#7, #8**; controls 32/24/40 pass; targets ≥24 pass (smallest 24×24 bell); 4px spacing grid pass; radius 4–10 pass in Playbook/Linear, Primer panels 12 (see Gaps); surfaces one step per layer pass; one accent pass; icons 16 text colour pass.
- Common mistakes: rows in 10–11px grey pass; brand colour as panel pass; tagline under the page title: Ship pass, gallery rail **#37**; large radii on dense parts pass; two heights in a row pass (Releases bar 32/32/32).
- When it gives way: marketing not covered (pass, judged as marketing).

### system-consumer-app
- n/a: no consumer screen. (At 375 the gallery is a desktop tool on a phone; App shell's phone rule applies, #22–#23.)

### system-look-playbook (Blue)
- Values pasted as variables, components read only them: pass (Panel sets every var; Team avatar's 11px/600 is hard-coded, folded into #16's fix). Accent only for what's noticed: pass. Five palettes in the rail: pass.

### system-look-linear
- Values match the published table: pass (spot read: 13px body, 500 weight, 0.5px lines, pill controls, Inter). Derived `accent-text` holds contrast: **fail #8**. "Never carries the product's logo or name": pass.

### system-look-primer
- Values from @primer/primitives: pass (spot read: 6px controls, 12px panels, Mona Sans fallback, #0969da). One accent: pass (blue primary). Field edges 3:1: pass. Segmented radius: **#38**.

### system-look-apple
- n/a: After Apple isn't in the gallery (`Gallery.astro` comment: "it stays on its own page").

### Owner's rules (~/.claude/CLAUDE.md, Product and UI judgment)
- One grid: **#36** (nit). One left edge: pass in Ship; Marketing sections and footer share one edge, pass.
- Trailing meta in one right-aligned column: pass (sidebar counts, Recent times, Checks states, Legend counts, table Rollout).
- Lightest boundary: **#3, #4, #5, #14**.
- Empty states name the next step: pass (No releases yet → Connect repository; No hotfixes → New hotfix; Couldn't load → Try again).
- Focus follows the action, never `<body>`: **fail #10**. Page and look switches keep focus on the pressed button: pass.
- Main area reflects the last action: pass at 1280; **#22** at 375.
- Layout changes re-home context: **#23, #26**.
- Way back: **#31**.
- Rendered geometry (overlaps, clipping): **#9, #21, #47**.
- Reference product first: Ship's shell follows Linear (sidebar on window colour, raised work panel, filter bar, bulk bar) — pass on structure, with #2 and #5 as the departures that break rules.

## 3. Gaps in the playbook

1. **Menu Anatomy contradicts the floor.** `component-menu` sets shortcuts in `ink-disabled` ("present, never competing"), which measures 1.96:1 in light and 1.39:1 in dark; the SKILL floor says every hint and secondary text holds 4.5:1. One of them has to change; the floor is the one with a standard behind it. (#7)
2. **A look's values vs a component's fixed anatomy.** Segmented control, Tabs and Toast fix `radius-full` in their anatomy; Primer's look sets `--radius-control: 6px` and its buttons follow it. No page says which wins when a look's control radius isn't a pill. (#38) Likewise Primer's `--radius-lg: 12px` sits outside the work tool's "4–10px on … panels", and the look page doesn't flag it as a departure.
3. **No look carries `shadow-xs`.** Card and Segmented anatomy and the shadow table name `shadow-xs` for "a card at rest"; the looks publish only `shadow-sm` and `shadow-md`, so a screen built from a look has no resting height to use and reaches for `shadow-sm` (#14). The looks' `shadow-sm` also bakes in a 1px ring, which doubles any element that already has a border; no page warns about it.
4. **Settings that save themselves.** Radio says "the choice waits for the form"; Checkbox says a box that saves on the spot is a Switch. A settings page with no Save button (Ship's, macOS's) has nowhere to put a one-of-three choice: Segmented is for "a view or a mode", Select for 5–15. The playbook needs one line for an auto-saving settings page's one-of-few choice (macOS uses radios there).
5. **Marketing exemption vs the tells.** `principle-every-line-does-a-job` exempts the marketing site ("a tagline is the work"), while SKILL's marketing section lists the label above the heading as a generated-page tell. A single sentence-case line above the hero headline sits between the two; say which wins. (#24)
6. **Gallery chrome around a product.** Nothing covers a tool that frames another app (a theme/look switcher, a component playground): which shell's floor applies, the frame's or the framed app's, and whether nested window chrome (gallery stage → Ship window → cards) counts as "a box inside a box". (#1, #2, #5)
7. **Phone layout of a desktop work tool.** App shell says a phone "shows one pane at a time", but no page says how the hidden sidebar comes back (button, sheet, back link) or where a tool's own filter/look chrome goes on a phone. (#22, #23, #26)
8. **Repeated identical secondary lines.** The "Manage" rule covers lines that start the same; nothing covers a secondary line that is identical on every row ("The playbook's own" ×5). (#37)
9. **Status colour for "in progress".** Badge lists success, warning, danger, info, neutral, but no page says which tone a running/in-progress state takes, so amber gets used for both "waiting for review" and "running". (#15)
