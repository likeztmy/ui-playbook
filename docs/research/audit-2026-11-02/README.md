# Rule audit 2026-11-02: consolidated

Seven reviewers audited the whole site against the playbook's own rules. This file merges their reports for the owner and for the agents who will fix things. Read it top to bottom: the counts, the root causes in shared code (fix these first), the page-specific findings, the rule conflicts that need a decision, then the fix order.

Reports, and the short names used below:

| Code | Report | Routes |
|---|---|---|
| CA | [components-a.md](components-a.md) | button, menu, toolbar, tooltip, icon, popover, dialog, sheet, app-shell, input, select |
| CB | [components-b.md](components-b.md) | combobox, checkbox, radio, switch, tabs, slider, segmented-control, card, badge, table, toast |
| PA | [principles-a.md](principles-a.md) | concentric-radius, a-shadow-says-how-high, who-before-what, reading-text, lightness-first, colour-means-one-thing, grey-until-it-matters, every-line-does-a-job, where-the-eye-goes |
| PB | [principles-b.md](principles-b.md) | nothing-shifts, how-waiting-feels, never-too-busy-to-listen, attention-wears-off, space-groups-by-ratio, the-lightest-boundary-that-holds, the-faster-way, hover-forgives, error-timing |
| SY | [systems.md](systems.md) | `/`, work-tool, consumer-app, the four look pages |
| LK | [looks.md](looks.md) | `/systems/looks` gallery and the Ship pages |
| PR | [practice.md](practice.md) | `/practice/mail`, `/practice/mail/app`, `/lab/track` |

A reference such as `CA#5` is finding 5 in components-a. principles-b doesn't number its rows, so they are numbered here in table order: `PB-m1`–`m4` (must), `PB-s1`–`s16` (should), `PB-n1`–`n9` (nit). The order is listed under the PB row of the count table.

## 1. Counts

| Report | must | should | nit | total |
|---|---|---|---|---|
| components-a | 4 | 13 | 9 | 26 |
| components-b | 2 | 7 | 8 | 17 |
| principles-a | 5 | 10 | 5 | 20 |
| principles-b | 4 | 16 | 9 | 29 |
| systems | 7 | 9 | 7 | 23 |
| looks | 10 | 17 | 21 | 48 |
| practice | 4 | 12 | 11 | 27 |
| **As reported** | **36** | **84** | **70** | **190** |
| Duplicates removed | −4 | −9 | −2 | −15 |
| **After merging** | **32** | **75** | **68** | **175** |

A duplicate is the same element failing the same rule, reported twice. It keeps the highest severity it was given. Eight issues were reported more than once:

- Menu shortcut contrast: CA#1, SY#4, LK#7.
- Compare toggle at 375: CA#8, CA#9, CB#2, PA#3, PB-s2.
- Shiki light code colours: CA#4, SY#2.
- Field and Button text at 15px: CA#5, PB-s9.
- The "Component / Principle / System" line above the H1: CA#16, SY#8, PB-n9.
- Icon stroke overrides: CA#6, PA#9, PB-n1, PR#6.
- Slide labels on gradients: PB-m1, SY#11.
- Linear `accent-text`: LK#8, SY#10.

The same mistake on different elements, such as two toasts or two missing tooltips, is not a duplicate. It is grouped under one root cause in section 2 and still counted once per element.

Of the 175 merged findings, **68 sit under one of 30 root causes** (section 2). **107 are page-specific** (section 3): 8 must, 47 should, 52 nit.

PB numbering, in table order. m1 slide labels; m2 Export/Upload/Search width and focus; m3 dark placeholder; m4 typed →. s1 icon-only buttons without Tip; s2 Compare at 375; s3 submenu clipped at 375; s4 star error placement; s5 sheet focus and inert; s6 More at 0.45 opacity; s7 file tiles with a generic icon; s8 password rules not tied by ARIA; s9 md Button and Field at 15px; s10 idle captions; s11 Lines subtitle; s12 shadcn sheet copy; s13 typed ⌥; s14 truncated subject; s15 stacked notes too wide; s16 checkboxes that save on the spot. n1 stroke overrides; n2 "Name" placeholder; n3 doc search without label; n4 Delete without separator; n5 "Save"; n6 tile anatomy; n7 keyed prose colours; n8 flight idle empty; n9 page head repeats the parent.

## 2. Root causes

### 2a. Shared code

Each row is one cause in shared code. "Verified" means I read the cited lines in the source on 2026-11-02 and they say what the report says. Line numbers are from that read.

| # | Cause | File(s) to change | Routes affected | Rule it breaks | Sev | Fix | Clears | Verified |
|---|---|---|---|---|---|---|---|---|
| 1 | At narrow widths, Compare puts the long verdict phrases into the segmented control, and the caption gets no `words`, so it reads only "After" / "Before" | `src/demos/shell.tsx` (Compare's toggle branch, `<Verdict good={good} />` and `segments` from `beforeLabel`/`afterLabel`). Same pattern in `src/demos/post/Arrivals.tsx:59-60` and PA's `LightnessStatus` Vision control | Every component and principle page with a Compare at ≤640px; `/practice/mail` | segmented-control: "Segments: nouns, one word where possible"; "labels truncate" | must | Segments read Avoid / Prefer (or Before / After). Pass `words={good ? afterLabel : beforeLabel}` to the caption so the phrase sits where it can wrap. Shorten the Arrivals and Vision labels | CA#8, CA#9, CB#2, PA#3, PB-s2, PR#14 | Yes |
| 2 | Menu shortcuts are set in `ink-disabled` (2.4:1 light, 1.9:1 dark) | `src/ui/Menu.module.scss:173`; the Menu page's Anatomy row "Shortcut … `ink-disabled`" | `/components/menu`, home Menu preview, `/systems/looks?page=overlays`, every menu with shortcuts | SKILL Floors: "Text holds 4.5:1 … hints included" | must | `ink-muted`. Dim further only on an unavailable row. Change the Menu Anatomy row in the same commit (conflict C1) | CA#1, SY#4, LK#7 | Yes |
| 3 | Lucide strokes are overridden per call (`strokeWidth 1.5` or `1.75` with `nonScalingStroke`), so four weights render side by side | 45 files. In `src/ui`: `Menu.tsx:71`, `Select.tsx:82` (1.75), plus `Combobox`, `Checkbox`, `Table`, `Tooltip`. In demos: `toolbar`, `popover`, `button`, `wait`, `faster`, `interrupt`, `hover`, `eye`, `error-timing`, `shadow/Overlap`, `sheet/*`, every `post/*` and `track/*` file through a shared `ic` object | Most routes; both practice apps | icon Anatomy: "Line: Lucide's own, 2 on its 24 grid" | should | Drop `strokeWidth` and `nonScalingStroke`. Use the `precision()` wrapper in `src/ui/icons.tsx`. Write any kept exception (shortcut glyphs, checks) on the Icon page first (C6) | CA#6, PA#9, PB-n1, PR#6 | Yes (grep: 45 files) |
| 4 | Shiki `github-light` token colours fail on `surface-sunken` (3.04:1 and 3.98:1) | `astro.config.mjs:25`, `src/components/look/Look.astro:63`, `src/styles/global.scss:88-91` | Every route with a code block in light theme: app-shell, the four look pages, others | SKILL Floors: "Text holds 4.5:1 against what it sits on" | must | Map Shiki's light tokens onto the playbook's `accent-text`, `danger`, `success` and `ink-muted`, or pick a light theme that clears 4.5:1 on `#efeff1`. Re-probe | CA#4, SY#2 | Yes |
| 5 | A frame's own theme is set on the `<figure>`, and the caption sits inside it with no background, so a flipped frame paints its caption in the other theme's ink on the page | `src/demos/shell.tsx:276` (`data-theme` on the figure); `src/demos/shell.module.scss:363-371` (`.frame[data-box] { background: none }`) | Every route: any frame pinned to a theme (ShadowDesks) or flipped with its theme button | SKILL Floors: "Text holds 4.5:1 against what it sits on" | must | Put `data-theme` on `.stage`, not the figure, so the caption keeps the page's ink | PA#1 | Yes |
| 6 | Prose styles: the table's last row keeps its line; inline `code` wraps mid-token; Anatomy value cells wrap mid-value at 375; list markers hang 4px from the screen edge at 375; a `code` chip's padding moves the first token off its column's edge | `src/styles/_reading.scss`: tables `:169-195` (`border-bottom` on every `td`), inline code `:157-162` (no `nowrap`), Anatomy value column `:199-204`, lists `:62-66` (`padding-left: 0`, deliberate) | Every reading page | table Anatomy: "Divider … none after the last"; owner: 16px side gutter | nit | `tr:last-child td { border-bottom: 0 }`. `white-space: nowrap` on inline code and on Anatomy value cells. Give lists a narrow-width `padding-left` (C25). No left padding on `td > code:first-child` | CA#21, CA#22, CA#23, CA#24, PA#17 | Yes |
| 7 | Every entry page prints its kind ("Component", "Principle", "System") above the H1, right under a back link that already names the parent | `src/layouts/Entry.astro:32` (`<p class={s.kind}>`) | Every component, principle and system page | every-line-does-a-job Avoid: an eyebrow; SKILL: "No eyebrows" | should | Drop `.kind`, or make the back link the only parent line. Needs decision C4 first: CB, PA and PR judged this line a pass | CA#16, SY#8, PB-n9 | Yes |
| 8 | md Button and TextField use `font: inherit` and pick up the demo wrapper's 15/24 | `src/ui/Field.module.scss:99`, `src/ui/Button.module.scss:17`; the source of the 15/24 is `src/styles/_reading.scss:97-98` | `/components/input`, `/components/select`, every principle demo with an md Button or field | input Anatomy: "Text 14 / 20"; button Anatomy: "Label … 14 / 20" | should | Set 14px/20px on the md Button and on `.control`. Keep 16px under `pointer: coarse` | CA#5, PB-s9 | Yes |
| 9 | Demo frame chrome. Gallery row lines are the same colour as the frame edge. Every Gallery is captioned "Variants" under a "Variants" heading. Stacked notes run about 120 characters a line | `src/demos/shell.module.scss:225-227` (row `--line`) vs `:370` (edge `--line`); `src/demos/shell.tsx:459` (`label = 'Variants'`); `src/demos/shell.module.scss:91` (`.note` has no max width) | button, toolbar, popover, input, select and every Gallery; hover-forgives and lightest-boundary for notes | lightest-boundary: "Lines between rows, lighter than the edge"; every-line: names a thing | should | Row lines one step lighter (`color-mix(in oklab, var(--line), transparent 40%)`). Name the Gallery by what it shows, or drop the caption. Cap `.note` at about 75ch when stacked | CA#7, CB#15, PB-s15 | Yes |
| 10 | Text under 12px in shared chrome | `src/demos/shell.module.scss:180` (state-grid heads 11px), `src/ui/Field.module.scss:143` (field key 11px), `src/ui/Menu.module.scss` `.label` (11px); app-shell avatar 11px; `.readout`, ΔE chips, tick labels, `.ratio`, `kbd` | button, toolbar, input, app-shell, every principle with readouts | work-tool: "Labels and meta 12px; nothing smaller" | nit | 12px. `.readout` is 12px in source but measured 11.05px, so check how Geist Mono scales | CA#18, PA#16 | Partly: the 11px rules yes; `.readout`'s 11.05px not found in source |
| 11 | The Tweak `SliderPanel` casts `shadow-sm` while it rests on the page, and the segmented pill inside it ignores the 18 − 8 = 10 formula | `src/ui/Slider.module.scss:153-163` (`.panel` `box-shadow: var(--shadow-sm)`); `src/ui/SegmentedControl.module.scss:16,26` (`radius-full`) | concentric-radius, a-shadow-says-how-high, reading-text (Measure, Angle), lightness-first, where-the-eye-goes | concentric-radius: "Inner radius = outer radius − inset − border" | must | Panel: a hairline, no drop. A segmented control inside a panel takes `radius-lg` 10 with an 8px thumb, or moves out of the corner. Add the pairing to the page's table (C16) | PA#4, PA#7 | Yes |
| 12 | The sheet grabber's focus style is invalid: `outline: 2px solid var(--focus-ring)`, where `--focus-ring` is a box-shadow list | `src/ui/Sheet.module.scss:108-110`; `--focus-ring` in `src/styles/tokens.css:98` | `/components/sheet` and every sheet, Post's composer at 375 included | button States: focus shows on `:focus-visible` | must | `box-shadow: var(--focus-ring)`, as Button does | CA#3 | Yes |
| 13 | TextField validates on blur by default, `required` included, so leaving an empty field shows an error before any submit | `src/ui/Field.tsx:49` (`validationMode = 'onBlur'`); `src/demos/input.tsx:75,77,80` | `/components/input` and any form with a required field | SKILL validating: "'required' waits for submit" | must | Run `required` only on submit. Keep on-blur for format checks | CA#2 | Yes |
| 14 | Under 320px a toast truncates its one-line title, so the object is lost. Two screens draw their own toast instead of the kit's | `src/ui/Toast.module.scss:37-39,127-128` (`min-width: min(320px,100%)`, `nowrap` + ellipsis); Ship's `src/demos/looks/ship/Overlays.module.scss` `.toast`; home `ToastPreview` in `src/demos/toast.tsx` | `/components/toast` at 375, `/systems/looks?page=overlays` at 375, home | toast Copy: "Say what happened, past tense, with its object" | should | Let the title wrap to two lines below 320. Point Ship and the home preview at the kit's Toast. On the preview, drop the success icon from the Undo kind | CB#4, LK#21, SY#12 | Yes (kit); the copies not read |
| 15 | Scrolling code blocks are Tab stops with no visible focus and no name | `src/styles/global.scss:75-77` (`:focus-visible { outline: none }`); `src/styles/_reading.scss:145` (`pre` has no focus style); Shiki adds `tabindex="0"` | Every page with a code block | app-shell States: a scroller is a Tab stop, its ring drawn inside | must | `pre:focus-visible { box-shadow: inset var(--focus-ring) }`; `role="region"` and an `aria-label` per block | SY#3 | Yes (CSS); Shiki's tabindex taken from the report |
| 16 | The look Values table is `table-layout: fixed` with a 26% name column and `word-break: break-all`, so names overlap their swatches at 375 and hex values split. A white swatch's edge is 1.2:1 | `src/components/look/Look.module.scss:2-24` (table), `:27-35` (chip edge `--line`) | The four look pages | table: "Truncating the name column … the column people scan" | must | Below about 600px, scroll the table in a named region with names `nowrap` and pinned, or stack each variable as a block. Break after commas, never mid-hex. Edge the swatch with `line-strong` | SY#1, SY#17, SY#18 | Yes |
| 17 | Home gallery cards have a header band, an edge-to-edge stage and a footer band. Section heads carry a rule. Hover tints only the band | `src/pages/index.module.scss:10-17` (`.groupHead` border), `:44-91` (`.card`, `.cardHead`), `:116-133` (`.cardStage`, `.cardSummary`) | `/` | card: "A frame around a grey stage, words beneath" | must | 18px frame, 8px inset, `fill-control` stage at radius 10, title and summary beneath with no hairlines. No rule under section heads. Hover lifts the whole card to 1.01 and `shadow-sm` | SY#6, SY#7, SY#16 | Yes |
| 18 | Every system card on the home page casts its slug to `'work-tool' \| 'consumer-app'`, so five look cards fall through to the same consumer phone mock | `src/components/Home.astro:109` (the report says :117); `src/demos/systems/Preview.tsx` | `/` | card: "a card whose stage is a generic icon is a list row in disguise" | must | Draw each look's stage from its own values: its button, field and badge in its accent and radius | SY#5 | Yes |
| 19 | Slide labels are white 13px on light gradients (1.8 to 3.8:1); the text shadow doesn't lift them | `src/demos/demos.module.scss:2347-2358` (`.intSlide`); `src/demos/interrupt.tsx:14-18` | `/principles/never-too-busy-to-listen`, home preview | SKILL Floors: "Text holds 4.5:1 against what it sits on" | must | Put the place name under the image in ink, or lay a dark scrim (to about L 0.45) under the bottom 40px | PB-m1, SY#11 | Yes |
| 20 | Look colours were derived and probed on white only. Linear's `accent-text` fails on `accent-soft` and `surface-sunken`. Apple's `line-strong`, accent and status text fail on `surface-sunken` | `src/looks/linear.ts:56-60`; `src/looks/apple.ts` | `/systems/look-linear`, `/systems/look-apple`, `/systems/looks?look=linear` | SKILL Floors: "Text holds 4.5:1 … badges … included" | must | Darken each derived value one step. Probe every text role on all four surfaces and on `accent-soft`, and write the measured ratio into the note | LK#8, SY#9, SY#10 | Linear yes; Apple not read |
| 21 | **Rebuild candidate.** The looks gallery and Ship scroll as one window. Rail and bar hold only by `sticky`, and Ship's sidebar and header scroll away | `src/demos/looks/Gallery.module.scss:5,14,110`; `src/demos/looks/ship/Shell.module.scss:6` | `/systems/looks` (every page and look) | SKILL floor: "An app's window holds still; each pane scrolls" | must | `100dvh` shell, `minmax(0,1fr)` rows, `min-height: 0` on each layer, rail and stage each `overflow-y: auto` and named; Ship's sidebar and page scroll inside a bounded stage. On a phone, scroll as one | LK#1, LK#2, LK#47 | Yes |
| 22 | **Rebuild candidate.** Ship draws a box per section: four stat tiles, a card per settings group, cards inside the bordered and shadowed `.main` window, a table frame inside a card. Static panels carry `shadow-sm` on top of a border, which draws two edges | `src/demos/looks/ship/Page.module.scss:26-36` (`.card`), `ship/Shell.module.scss:120-128` (`.main`), `ship/Dashboard.tsx:44-57`, `ship/Settings.tsx:20-64`, `wall/History.tsx:20`, `wall/Wall.module.scss:21` | Dashboard, Settings, States, Overlays, Cards | lightest-boundary: "never a box inside a box"; Avoid "Every section a card" | must | Rebuild on headings, space and lines: one surface with lines for figures, a box only on Danger zone, the table as its card's own frame. Border or ring, not both, and no shadow at rest | LK#3, LK#4, LK#5, LK#14 | Yes (`.card`, `.main`); the TSX lines taken from the report |
| 23 | List rows draw a line under every row, the last one included | `src/demos/demos.module.scss:987-994` (`.issueRow`), `:614` (`.toastFiles`); the Icon page's hero list | `/components/badge`, `/components/toast`, `/components/icon` | table Anatomy: "Divider … none after the last" | nit | `:not(:last-child)` on the row border. Drop the line under the Icon hero's title row | CB#12, CA#25 | Yes (`.issueRow`) |

### 2b. Repeated patterns (no single file)

The same mistake, made separately in several files. Fix each instance, and add the shared helper or rule named in the Fix column so it doesn't come back.

| # | Pattern | Instances (file) | Rule it breaks | Sev | Fix | Clears | Verified |
|---|---|---|---|---|---|---|---|
| 24 | After an action, focus falls to `<body>`. The causes: a button that goes `disabled` while busy, a control that unmounts, a row that is removed, or a step with no focus target | `src/demos/wait.tsx:174,219,273` (Export, Upload, Search `disabled`); `src/demos/looks/ship/Releases.tsx:85` (Clear selection); `src/demos/post/Line.tsx:116` (Archive), `src/demos/track/Panel.tsx:131` (Delete), plus hover and bulk Archive; `src/demos/faces/Find.tsx:96-115` | owner: "focus follows the action and never falls to `<body>`" | must | Busy buttons use `Button loading loadingLabel=…`, which keeps width and focus. One helper for removals: focus the next row, else the previous, else the list (C27). Clear selection focuses select-all. Find's search step focuses the first row | PB-m2, LK#10, PR#2, PA#6 | Yes (wait, Releases, Line, Panel); Find from the report |
| 25 | Typed symbols stand in for icons: ⌘, ⌥, →, ··· | `src/demos/concentric.tsx:109,117` (`⌘K`); `src/demos/faster.tsx:23,139` (⌥); `src/demos/wait.tsx:271` (→); `src/demos/shadow/Overlap.tsx:22` (···); `src/demos/looks/ship/Shell.tsx:35` (`⌘K`); `src/pages/components/tooltip.mdx:52` (⇧⌘Z in prose) | SKILL Floors: "A text symbol … never stands in for an icon" | must | Use the existing `FieldKey` (`src/ui/Field.tsx:92-101` draws ⌘ as Lucide `Command`) or `TipKeys` for keys; Lucide `Ellipsis`; "to" instead of → | PA#5, PB-m4, PA#10, PB-s13, LK#13, CA#19 | Helper yes; instances from the reports |
| 26 | Icon-only buttons without a tooltip | `src/demos/wait.tsx:72,490`, `interrupt.tsx:55,58,127`, `hover.tsx:192` (none of the three imports `Tip`); `ship/Shell.tsx:66`, `ship/Releases.tsx:85`, `ship/Overlays.tsx:100` | button: "An icon-only button always has a tooltip" | should | Wrap each in `Tip` with the `aria-label`'s words. Better: let `Button icon` take `label` and render the Tip itself (`src/ui/Button.tsx:11` only says "Needs an aria-label and a Tip") | PB-s1, LK#12 | Yes (no `Tip` import in five of the six files) |
| 27 | Narrow layouts hide navigation and nothing brings it back | `src/demos/app-shell/app-shell.module.scss:37` (`@container (width < 480px)`); `ship/Shell.module.scss:14-19`; Ship `marketing` `.links { display: none }` | owner: "layout changes re-home context rather than hiding it" | should | A sidebar button that opens the places in a sheet, or keep a narrow sidebar. Footer links wrap instead of hiding. Ship is a rebuild candidate (C33) | CA#13, LK#23, LK#26 | Yes (app-shell, Ship shell) |
| 28 | Empty states repeat the query but name no next step | `src/demos/badge.tsx:90`; `src/demos/combobox.tsx` (Multiple); `src/demos/post/List.tsx:175`; `src/demos/track/AssigneePicker.tsx:48` | owner: "empty states name the next step" | should | Add the step: "Try a state or an ID.", "Try a team name.", New message, "Invite them from Members." | CB#7, CB#8, PR#10 | From the reports |
| 29 | Placeholders give an instruction, not an example | `src/demos/input.tsx:134` (Multiline); `src/demos/shift.tsx:363` ("Name"); Track and Post ("Type a command…", "Assign to…", "Leave a comment…") | input Copy: "Placeholder: an example, not an instruction" | should | Use an example or no placeholder. For Post and Track, record mail's and Linear's convention if kept (C17) | CA#17, PB-n2, PR#25 | From the reports |
| 30 | Checkboxes and radios that save on the spot | `src/demos/wait.tsx:500`, `hover.tsx` SubmenuDemo; `src/demos/looks/wall/Notify.tsx` | checkbox: "A checkbox that saves on the spot … it's a Switch" | should | `Switch`. For a one-of-few choice on an auto-saving page, decide C31 | PB-s16, LK#20 | From the reports |

## 3. Page-specific findings

One line each: route · element · rule · fix · file · report. Ship pages marked **rebuild** would change if causes 21–22 are rebuilt rather than patched. Fix them as part of the rebuild, not before it.

### Must (8)

- **Components** · `/components/segmented-control` · Prefer side "Segments share one width" shows "Assigned t…" · "Past five, labels truncate" · words of similar length (All / Mine / In review) · `src/demos/segmented.tsx:127-131` · CB#1
- **Principles** · `/principles/who-before-what` at 375 · Faces rows keep the checkbox column; subjects are 14px wide · "the column that says who … stays filled" · drop the checkbox column at ≤640, stack sender over subject · `src/demos/faces/faces.module.scss:33-53` · PA#2
- **Principles** · `/principles/nothing-shifts` dark · doc search placeholder is the browser's #757575 (3.9:1) · Floors 4.5:1 · `::placeholder { color: var(--ink-muted) }` · `src/demos/demos.module.scss:1784` · PB-m3
- **Looks** · `?page=cards` Publish 4.2.0 · Email subscribers is a Switch in a form with Publish · switch: "A switch in a form with a Submit" · Checkbox · `wall/Publish.tsx:29` · LK#6
- **Looks** · `?page=overlays` at 375 · menu runs 31px past the scene, shortcuts cut · owner: inspect clipped geometry · right-anchor the menu under 640 · `ship/Overlays.module.scss:22` · LK#9
- **Practice** · `/practice/mail(/app)` at 375 · New message sheet scrolls itself off screen when To is focused · sheet: focus moves in, header visible · `focus({ preventScroll: true })` or `overflow: clip` · `post/Shell.tsx:182`, `Shell.module.scss:141` · PR#1
- **Practice** · Track pickers · check sits at the row's right end · menu Prefer: "Check in a leading column" · 16px leading column as `ui/Menu` · `track/PickMenu.tsx:22-30`, `AssigneePicker.tsx:55` · PR#3
- **Practice** · Post search field · pill, filled, no edge, ring around on focus · input Anatomy: radius 10, edge `line-strong` · radius 10, 1px edge, accent edge on focus · `post/Find.module.scss:2-28` · PR#4

### Should (47)

**Components**
- `/components/sheet` · sheet gap at full height is 32, anatomy says 12 · sheet Anatomy "Gap … 12" · make code and anatomy agree (C42) · `src/ui/Sheet.module.scss:49` · CA#10
- `/components/sheet` · Close 24×24 and desktop sizes on a phone sheet · consumer: "Targets 44 × 44px" · 44px target under `pointer: coarse` · sheet demos · CA#11
- `/components/app-shell` · title bar 36px · Anatomy "Title bar … 48" · 48, or document 36 (C42) · `src/demos/app-shell/app-shell.module.scss:21` · CA#12
- `/components/menu` · hero Files rows each in their own box · lightest-boundary: "never a box per section" · one group with hairlines · `src/demos/menu.tsx` ~227 · CA#14
- `/components/icon` · status icons are `aria-hidden` and the only status signal · colour-means-one-thing: not one channel · `aria-label` with the status word · `src/demos/track/StatusIcon.tsx:16` · CA#15
- `/components/segmented-control` · 2× Anatomy specimen truncates at 375 · "labels truncate" · scale the specimen to the column · `src/demos/segmented.tsx` · CB#3
- `/components/slider` · Radius reads "12" with no unit · slider Copy: "the number with its unit" · "12px" · `src/demos/slider.tsx` · CB#5
- `/components/table` at 375 · Name column scrolls away on the live demo and Prefers · table Prefer "Name column pinned" · `stickyFirst` · `src/demos/table.tsx:86-92` · CB#6
- `/components/badge` dark · solid Avoid badges at about 2:1 · Floors 4.5:1 · `on-*` ink on solid fills · badge demo · CB#9

**Principles**
- `/principles/a-shadow-says-how-high` · Overlap menu: 28px items, 148 wide, 14px icons, Delete mid-group in ink · menu Anatomy · build to Menu anatomy · `shadow.module.scss`, `Overlap.tsx:5` · PA#8
- `/principles/a-shadow-says-how-high` · Desks' verdict shown only by weight and ink · "Colour alone can't carry a meaning" · `Verdict` icons · `Desks.tsx` · PA#11
- `/principles/colour-means-one-thing` · Hover listbox unreachable by keyboard, no state at rest · owner: focus follows the action · roving tabindex as `Editor`; pin one row in hover · `colour.tsx:133-148` · PA#12
- `/principles/grey-…`, `/every-line-…`, `/where-the-eye-goes` · Prefer copy uses "Your" and repeats the expiry · every-line: "No *Your*" · reword, see report · `grey/SignUp.tsx`, `copy/ErrorPlace.tsx`, `eye.tsx` · PA#13
- `/principles/grey-until-it-matters` · labels start at 12 different x; titles truncate at 375 · "Things of one kind share one left edge" · labels in a column (C18) · `grey/Issues.tsx` · PA#14
- `/principles/who-before-what`, `/reading-text` · results drawn as filled tiles; fastest marked by accent tint · lightest-boundary "One row of figures" · lines, no fill; "Fastest" in ink 600 · `faces.module.scss .result`, `reading.module.scss` · PA#15
- `/principles/hover-forgives` at 375 · Prefer submenu clipped past the stage · menu: popup visible in full · flip left or below when it overflows · `demos.module.scss:1545-1550` · PB-s3
- `/principles/how-waiting-feels` · star error shows 102px below its row · every-line: "beside the button that failed" · inline on the row · `wait.tsx:496` · PB-s4
- `/principles/never-too-busy-to-listen` · sheet leaves focus behind the dim; page not `inert` · sheet: "Focus moves in; what's behind is inert" · focus in, `inert`, return focus · `interrupt.tsx:107-130` · PB-s5
- `/principles/hover-forgives` · More at 0.45 opacity, about 2:1 · lightness-first: state icons 3:1 · drop the opacity · `demos.module.scss:1619` · PB-s6
- `/principles/hover-forgives` · file tiles' stage is a generic icon · card: "a list row in disguise" · real thumbnail, or list rows · `hover.tsx:176-183` · PB-s7
- `/principles/error-timing` · password rules not tied to the field · SKILL: "aria-describedby, aria-invalid" · wire both · `error-timing.tsx:101` · PB-s8
- `/principles/how-waiting-feels` · idle captions say "Exporting 248 files" before any press · every-line: "a status what's true" · "248 files" until running · `wait.tsx:147,217` · PB-s10
- `/principles/the-lightest-boundary-that-holds` · Prefer side keeps a section subtitle · SKILL: "No … section subtitles" · drop it on Prefer · `boundary/Lines.tsx:11` · PB-s11
- `/principles/never-too-busy-to-listen` · "Make changes to your profile here." copied from shadcn · every-line: a swappable line is a slogan · drop it · `interrupt.tsx:124` · PB-s12
- `/principles/space-groups-by-ratio` · Prefer subject cut at "Deploy to production fa…" · every-line: the differing word goes first · widen or shorten senders · `ratio.tsx` Stream · PB-s14

**Systems and home**
- `/` · Looks and Playbook look cards read "0 details" · every-line: names a thing or state · hide at 0 or count values · `src/entries.ts:355,363` · SY#13
- System pages · tick rail buttons 40×20 on a 20px pitch · work-tool: "at least 24 × 24px" · ticks 24 tall · `src/components/ticks/Ticks.module.scss:41-49` · SY#14
- `/` hero · Rough.js arrow and circle · Icon floor: no hand-drawn SVG · record the owner's lab-B exception (C7) or use Lucide · `src/components/note/note.ts:4-21` · SY#15

**Looks gallery and Ship**
- Ship logo · "S" in an accent tile drawn for the occasion · icon floor: a logo is supplied or set in type · **Ship** in type · `ship/Shell.tsx:27`, `marketing/Marketing.tsx:16,51` · LK#11
- Amber means both "In review" and "Running" · "Each colour says one thing" · neutral or info for Running (C35) · `ship/data.ts:165`, `wall/Checks.tsx:7`, `ship/Donut.tsx:8` · LK#15
- Avatars in `accent-text` on `accent-soft` · who-before-what: "Not on a face: the accent's hue" · pastel from address, or grey · `wall/Team.module.scss:8`, `ship/Release.module.scss:62` · LK#16
- `?page=overlays` · confirm dialog for an undoable Halt · dialog: confirming the undoable · confirm an irreversible action; Halt as toast with Undo · `ship/Overlays.tsx:77-86` · LK#17
- Gallery look list and page bar are buttons, not links · tabs: views with a URL are navigation · `<a href aria-current>` · `Gallery.tsx:59,73` · LK#18 · **rebuild**
- `?page=cards` · First rollout is a slider for an exact number · slider: "A number people know exactly wants a field" · field · `wall/Publish.tsx:28` · LK#19
- Gallery at 375 · chrome fills 560px, Ship redraws below the fold · owner: main area reflects the last action · looks in a Select, drop the summary · gallery chrome · LK#22 · **rebuild**
- `?page=marketing` · accent eyebrow above the hero · SKILL marketing tells: label above a heading · fold into the lede (C32) · `marketing/Hero.tsx:10` · LK#24
- `?page=marketing` · pricing as three identical rounded shadowed cards · SKILL marketing tells · columns on one surface with lines · `Marketing.module.scss .plan` · LK#25 · **rebuild**
- `?page=releases` · sort by Updated puts 5h above 2h · a state line must be true · sort on a real timestamp · `ship/Releases.tsx:43` · LK#27

**Practice apps**
- Post and Track · current place's icon in the accent · icon States: "the row's full ink" · `ink` · `post/Shell.module.scss:139-141`, `track/Sidebar.module.scss:142` · PR#5
- Track · row labels outlined, panel labels filled · badge Neutral: `ink-muted` on `fill-control` · fill as the panel · `track/Row.module.scss:117-127` · PR#7
- Track · no-assignee and no-priority marks hidden at rest · who-before-what: "the column is always filled" · keep them visible (C41) · `track/Row.module.scss:153-155` · PR#8
- Track and Post · no-priority and star marks at about 2.4:1 · lightness-first: state icons 3:1 · `ink-muted`; darker star stroke · `track/icons.module.scss:20`, `post/List.module.scss .starred` · PR#9
- Post · New message tooltip on a labelled button · tooltip: "Tooltips on labelled buttons" · `label` only when icon-only · `post/Shell.tsx:154` · PR#11
- `/practice/mail` · ten buttons all named "Show" · every-line: a button reads on its own · `aria-describedby` or "Show 3" · `post/Example.tsx:102` · PR#12
- `/practice/mail` · frame 10px around an 18px card at 8px inset · concentric: inner = outer − inset − border · frame 27px, or card 1px (C3) · `post/Example.module.scss:43` · PR#13
- Track · PR mark states differ only by colour; reason in native `title` · colour not the only signal · a shape per state, `Tip` · `track/PrMark.tsx:17-18` · PR#15
- Track · status groups as tinted bands with a hairline · lightest-boundary: heading and space first · heading plus space, or record the Linear departure (C36) · `track/Group.module.scss:6-18` · PR#16

### Nits (52)

- **Components**: CA#20 select options 13px under a 14px trigger (`src/ui/Select`). CA#26 Icon Kinds copy names rings that aren't there (`icon.mdx`). CB#10 Switch Anatomy says `surface-sunken`, code uses `fill-control` (`Switch.module.scss:88-94`, C42). CB#11 table header measures 33, not 32 (C42). CB#13 checkbox Variants list boxed inside the gallery box. CB#14 badge Tones specimen shows states without dots. CB#16 tabs specimen and gallery divider stack two rules at 375. CB#17 "Conversion 65.78" has no %.
- **Principles**: PA#18 button reads "Start". PA#19 "Added" not announced. PA#20 `role="alert"` specimens announce on load. PB-n3 doc search has no label and no magnifier (`shift.tsx:209`). PB-n4 Delete shares a group with no separator (`hover.tsx:202-206`). PB-n5 "Save" → "Save changes" (`boundary/Settings.tsx:57`). PB-n6 tile stage `surface-sunken`, icon 20px (`demos.module.scss:1594`). PB-n7 keyed prose colours sit on accent and danger hues (`src/components/key/Key.module.scss:6-8`, C13). PB-n8 flight idle body is empty (`wait.tsx:276`).
- **Systems and home**: SY#19 previews shrink text to 6.8–10px (C27). SY#20 hero search is 40px at 15px. SY#21 "Playbook." full stop in the From column. SY#22 After Apple has no specimen link or gallery entry. SY#23 tick labels named after the first characters of a code block.
- **Looks gallery and Ship**: LK#28 three-option Selects. LK#29 two fills on Release and States. LK#30 sidebar lights Releases on Overlays and States. LK#31 breadcrumb isn't a link. LK#32 header 52, sidebar 220, rows 14px (C42, **rebuild**). LK#33 dialog 323 wide, not 400. LK#34 popover gap 4 and title mismatch. LK#35 counts and names contradict the data. LK#36 gallery bar wraps to two rows (**rebuild**). LK#37 "The playbook's own" ×5 and a 4-line rail summary (C34, **rebuild**). LK#38 Primer segmented stays a pill beside 6px controls (C16). LK#39 inert sidebar rows hover. LK#40 marketing anchors with no target. LK#41 `type="email"`. LK#42 "Archive" → "Archive project". LK#43 filter search label hidden. LK#44 marketing headline and section titles both 35px at 375. LK#45 failure toast says why, not what. LK#46 Comment disabled with no reason. LK#48 hidden donut centre label.
- **Practice apps**: PR#17 status and priority choice menus carry icons (C37). PR#18 Track tabs overflow their root by 8px at 375. PR#19 sidebar rows 34 and 28 (C42). PR#20 top bars 56 and 44 (C42). PR#21 Track tabs 13px, title 15px. PR#22 Post rows radius 12. PR#23 new-mail and updates pills 28 and 30 tall. PR#24 floating toolbar gap 4, not 2. PR#26 command menu group labelled "Track"; "No issue selected" chip. PR#27 native `title` on time and sub-issue cells.

## 4. Rule conflicts and gaps in the playbook

Merged across the seven reports. Each needs a decision from the owner before the matching fix lands. "Pages" are references in `skill/ui-playbook/references/`.

| # | Conflict or gap | Pages that disagree | Decision needed | Raised by |
|---|---|---|---|---|
| C1 | Menu Anatomy sets shortcuts in `ink-disabled`; the floor says hints hold 4.5:1 | component-menu (Anatomy, "a step lighter, as macOS") vs SKILL Floors | Change Menu to `ink-muted` (WCAG backs the floor), or exempt shortcut glyphs | CA-A, SY, LK-1 |
| C2 | Table says "lines between rows, not stripes"; ratio's Prefer is "Stripe per transaction" | component-table vs principle-space-groups-by-ratio | When a fill per record beats a line (likely: records of two or more lines). Write it on one page | PB-1 |
| C3 | Demo stages, app frames and gallery chrome read as "a box inside a box", and nothing says whether concentric radius applies to them | principle-the-lightest-boundary ("When it doesn't apply" lists cards, tables, canvases) vs every demo frame, `/practice/mail`, the looks gallery | Is a frame a window in miniature (exempt from box-in-box, bound by concentric radius)? Which shell's floor applies when a tool frames another app? | CB-1, PB-2, PR-5, LK-6 |
| C4 | Do product-copy rules cover reading pages? The kind line above each H1 | principle-every-line-does-a-job ("In a product") vs SKILL "No eyebrows" (no scope) | Exempt docs pages, or drop the kind line. Reviewers split: CA, SY, PB fail it; CB, PA, PR pass it | CA-C, SY, PB-n9 |
| C5 | No rule for what a comparison shows below 768px | principle-reading-text ("These pages") vs component-segmented-control Copy | One line: verdict words in the caption, Avoid/Prefer in the switch. Also covers demo chrome sizes (11px heads) | CB-4, PB-7, CA-E |
| C6 | Icon stroke exceptions undocumented: 1.25 (shortcuts, Menu), 1.5 and 1.75 (checks) used across the kit | component-icon ("1.33 at 16") vs component-menu and the code | One stroke everywhere, or a written list of exceptions | CA-D |
| C7 | Hand-drawn Rough.js notes on the home hero vs the no-hand-drawn floor | SKILL Floors, component-icon vs the owner's lab-B choice (2026-10-27) | Record the exception for the playbook's own annotations, or replace them | SY |
| C8 | A value picker as a choice Menu, a Popover or a Select; one chevron or two on a value trigger | component-menu (Choice), component-popover (Sort), component-select (Select-or-Menu table, chevrons) | When each applies, and which chevron a value trigger takes | CA-B, PR-3 |
| C9 | A standalone status icon needs an accessible name; colour-only states | component-icon (Status kind), principle-colour-means-one-thing | Add "a status icon alone carries its word as its name" | CA-G |
| C10 | Code blocks: contrast of the syntax theme, and a scrolling `pre` as a pane | SKILL Floors ("text"), component-app-shell (panes) | Say both apply to code blocks | CA-H, SY |
| C11 | The exported Skill drops Gallery and StateGrid content, so `## Variants` and `## States` are empty | build/export vs the site | Export galleries as text | CA-F |
| C12 | Badge column in a list without a header | component-badge ("needs a header") vs the `/badge` live list | Limit the rule to tables, or extend it to lists | CB-2 |
| C13 | Colour collisions: `info` text equals `accent-text` (link colour); prose key colours sit on accent and danger hues; legend hues at equal lightness | principle-colour-means-one-thing, principle-lightness-first vs component-badge (info), `Key.module.scss` | Give `info` its own step; a rule for legend colours in prose | CB-3, PB-5 |
| C14 | Width and truncation on a phone: Toast's 320–440 can't fit a 343px stage; Card truncates while the consumer app wraps | component-toast, component-card vs system-consumer-app | Which gives way, the width or the object; one truncation rule across systems | CB-5, SY |
| C15 | A themed specimen inside a page of the other theme | none covers it | "The theme switch repaints the stage only; the caption keeps the page's ink" | PA-1 |
| C16 | A pill inside a non-pill container; a look's control radius vs a component's fixed `radius-full` | principle-concentric-radius (pairings), component-segmented-control / tabs / toast vs system-look-primer (`--radius-control: 6px`, `--radius-lg: 12px` outside work-tool's 4–10) | Does a nested pill take the formula? Do components follow `--radius-control`? Record Primer's 12px as a departure | PA-2, LK-2 |
| C17 | Placeholder rules contradict: "only when the format isn't obvious", then an email as the example; mail and Linear use instruction placeholders | principle-every-line-does-a-job (Words by place), component-input | One placeholder rule, and whether reference-product conventions win | PA-3, PR#25 |
| C18 | Labels after a title vs one left edge (GitHub after the title, Linear in a column) | principle-space-groups-by-ratio | Which an issue list follows | PA-4 |
| C19 | "Dot only on Online" vs "their colour a dot" on every label | component-badge vs principle-grey-until-it-matters | Say status dots and content-colour dots are different things | PA-5 |
| C20 | Hover-only and pointer-only demos (no state at rest on a phone, no keyboard path) | principle-hover-forgives ("Essentials") | "A specimen shows its state at rest"; a rule for gesture-only controls | PA-6, PB-3 |
| C21 | Line insets in non-table lists: lines start at the text (iOS) vs full width (Table) | principle-the-lightest-boundary vs component-table | Which a list takes | PA-7 |
| C22 | Avatar size: Faces table says 36 comfortable; every Faces demo uses 28 | principle-who-before-what (table vs demos) | Fix the table or the demos | PA-8 |
| C23 | Busy vs disabled: only the owner's rule catches a disabled button dropping focus | component-button ("stays focusable") vs principle-how-waiting-feels | Add "never disable the button that's waiting" to How waiting feels | PB-4 |
| C24 | 13px notes stretched across a 720px column | principle-reading-text | A measure for notes in stacked comparisons | PB-6 |
| C25 | Tables and lists inside reading pages: Table's product anatomy vs the lighter prose tables; no narrow-width rule; hanging bullets 4px from the screen edge | component-table vs principle-reading-text | Which a reading page's table follows; how close a marker may come to the edge | SY |
| C26 | Photo stand-ins and text on them | SKILL ("Art only when the brief supplies it") | A rule for placeholder imagery and its labels | PB-8 |
| C27 | Scaled-down previews: are 6.8–10px thumbnails pictures (exempt) or text (12px floor)? | system-work-tool vs the home previews | Decide, and say it on the reading-page system | SY |
| C28 | Look pages promise 4.5:1 "on every surface", but only greys were checked | the four look pages | Which surfaces accent and status text must hold on (include `accent-soft`) | SY |
| C29 | Live result counts and empty filters aren't announced | none | An `aria-live` rule for filters | SY |
| C30 | No look publishes `shadow-xs`, yet Card, Segmented and the shadow table call for it; looks' `shadow-sm` bakes in a ring that doubles any border | principle-a-shadow-says-how-high, component-card vs the look values | Add `shadow-xs` to every look; warn about the ring | LK-3 |
| C31 | A one-of-few choice on a settings page that saves itself | component-radio ("waits for the form"), component-checkbox, component-segmented-control, component-select | One line (macOS uses radios there) | LK-4 |
| C32 | A single sentence-case line above a marketing headline: exempt or a tell? | principle-every-line-does-a-job (marketing exemption) vs SKILL marketing tells | Say which wins | LK-5 |
| C33 | A desktop work tool on a phone: how a hidden sidebar comes back, where tool chrome goes | component-app-shell ("one pane at a time") vs owner's re-home rule | Button, sheet or back link | LK-7, CA#13 |
| C34 | A secondary line identical on every row ("The playbook's own" ×5) | principle-every-line-does-a-job ("Manage" rule covers starts only) | Extend the rule | LK-8 |
| C35 | Which tone an in-progress state takes | component-badge (tones) | Name one (neutral or info) | LK-9 |
| C36 | Reference product vs lightest boundary: Linear's tinted group bands | owner's "copy the reference product" vs principle-the-lightest-boundary | Which wins in an In practice app; record the departure | PR-1 |
| C37 | Choice menu values that are drawn by a mark elsewhere (status, priority) | component-menu (Choice: "No icons") | Exception for values that have a shape | PR-2 |
| C38 | Inverse means "a label, not a control", but Post's and Track's overlaid pills are inverse buttons | component-tooltip | How an overlaid pill-shaped action is drawn | PR-4 |
| C39 | Where focus goes when the focused or acted-on row is removed | component-toast, component-table, component-app-shell (all silent) | Next row, else previous, else the list. Enables fix 24 | PR-6 |
| C40 | `focus()` scrolls a clipped ancestor | component-sheet, component-app-shell | "Initial focus with `preventScroll`; clip, don't hide" | PR-7 |
| C41 | Hiding empty values at rest in non-face columns | principle-who-before-what (faces only), component-table (en dash, tables only) | Extend to every column | PR-8 |
| C42 | Anatomy numbers that no build meets: App shell toolbar 48 (demo 36, Ship 52, Post 56, Track 44), sidebar rows 32 (34, 28), sidebar 240 (220); Sheet gap 12 (code 32); Switch disabled `surface-sunken` (code `fill-control`); Table header 32 (33 with its line) | component-app-shell, component-sheet, component-switch, component-table vs their code | Per row: fix the code or fix the page. A window title bar may need its own row | CA#10, CA#12, CB#10, CB#11, LK#32, PR#19, PR#20 |
| C43 | Not covered by this audit | — | Frame time and long tasks weren't measured (PB, PR-9: CPU at 97%). Not shot: Post's recipients popover, Track board and inbox, the New issue dialog, Post compact. `pnpm shoot --full` repeats content past 16 384px. Segmented thumbs drawn stale once under load and couldn't be reproduced (`SegmentedControl.tsx:47` measures once): run a throttled-CPU test | PB, PR-9, SY, CB-6 |

## 5. Suggested fix order

Shared code first, because each change clears findings on many routes at once. Then patterns, then each area. Sizes: small is under an hour, medium is a few hours, large is a day or more. Decisions from section 4 that gate a step are named on it.

1. **Menu shortcut colour** (cause 2). One line plus the Menu Anatomy row. Clears 3 merged findings on 3+ routes. Gate: C1. *Small.*
2. **Demo frame chrome in `shell.tsx` / `shell.module.scss`** (causes 1, 5, 9, and the 11px heads in 10). Compare's narrow branch, the frame theme on the stage, gallery row lines, the Gallery caption, note width. Clears findings on every component and principle page. Gate: C5, C15. *Medium.*
3. **Kit pass in `src/ui`** (causes 8, 11, 12, 13, 14, the rest of 10). Field and Button 14/20, SliderPanel edge and segmented radius, Sheet grabber ring, required-on-submit, toast wrapping, 12px labels. Gate: C14 for toasts, C16 for the panel radius. *Small to medium.*
4. **Reading-page styles** (causes 4, 6, 15, 16, 23). Shiki token colours, last-row lines, inline code, list markers, `pre` focus and names, look Values tables. Gate: C10, C25. *Small to medium.*
5. **Icon strokes** (cause 3). Mechanical across 45 files once the exception list is decided. Gate: C6. *Medium.*
6. **Entry kind line** (cause 7). Gate: C4. *Small.*
7. **Patterns** (24–30). Add a removal-focus helper and use `Button loading` for busy buttons. Let `Button icon` render its own Tip. Use `FieldKey`/`TipKeys` for every typed key. Then the empty-state, placeholder and checkbox-to-switch copy fixes. Gate: C39, C23, C17, C31. *Medium.*
8. **Home** (causes 17, 18, 19, then SY page items). Card anatomy, look previews drawn from their values, slide labels, "0 details", tick targets. Gate: C7, C27. *Medium.*
9. **Look colours** (cause 20). Re-derive Linear and Apple text roles, probe all surfaces, update notes. Gate: C28. *Small.*
10. **Components page items** (section 3: CB#1, then CA and CB shoulds and nits). Gate: C42 for the anatomy rows. *Small to medium.*
11. **Principles page items** (PA#2, PB-m3, then the shoulds). The Faces phone layout and the sheet focus and inert are the largest. Gate: C18, C20, C22. *Medium.*
12. **Practice apps** (PR#1, #3, #4, then the shoulds). Post's sheet focus, Track's leading checks, Post's search field, then icons, labels and empty values. Gate: C36, C37, C41. *Medium.*
13. **Looks gallery and Ship: rebuild** (causes 21, 22; then LK must and should items, with **rebuild** items folded into the new build). A bounded `100dvh` shell with scrolling panes, Ship pages drawn on headings, space and lines, links for looks and pages, a phone layout that re-homes the sidebar. Patch LK#6, #9 and the copy and data nits only if the rebuild is deferred. Gate: C3, C30, C33. *Large.*

After each step: `pnpm verify`, then the rule review (`.claude/agents/ui-rule-review.md`) on the changed routes at 1280 and 375, light and dark. Measure frame time on the practice apps and the gallery, which this audit couldn't do (C43).
