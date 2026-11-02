# Rule review: home and the system pages

Date: 2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Server: http://localhost:4321 (dev).

Routes: `/`, `/systems/work-tool`, `/systems/consumer-app`, `/systems/look-playbook`, `/systems/look-primer`, `/systems/look-apple`, `/systems/look-linear`. The home page is the site's front page: a reading/marketing page whose cards each hold an inert preview of a component, principle, system or practice page. Every preview was reviewed as evidence, against its own reference. The system pages are reading pages (one 45em column, scrolls as one). Their values tables and paste blocks are reviewed against the components and floors they show.

Source read: `src/components/Home.astro`, `src/components/Hero.astro`, `src/components/note/*`, `src/pages/index.module.scss`, `src/layouts/{Base,Entry}.astro`, `src/layouts/Entry.module.scss`, `src/components/look/Look.{astro,module.scss}`, `src/components/ticks/Ticks.module.scss`, `src/styles/{global,_reading}.scss`, `src/demos/systems/Preview.tsx`, `src/demos/interrupt.tsx`, `src/ui/Menu.module.scss`, `src/entries.ts`, `src/looks/*.ts`, the six MDX pages.

Shots, in `shots/review/systems/`:
- Full-page shots at 1280 and 375, light and dark: `<route>-<width>-<theme>.png` (28 files; `home` for `/`).
- `home-375-tail-16000-light-dark.png`. Chrome tiles a full-page capture past 16 384px, so the 375 home shots repeat the hero below y≈16 380. The tail (y 16 000–21 410) was shot again by scrolling, with the dev toolbar hidden.
- Close-ups: `header-hover-palette.png`, `header-palette-open.png`, `ticks-hover.png`, `look-playbook-375-pre-focus.png` (the paste block focused by Tab), `look-playbook-375-values-table.png`, `home-empty-1280-light.png` (search with no match).

Probes:
- Contrast: every visible text node composited over its real background chain, WCAG 2.2 ratio, on all 7 routes in both themes at 1280.
- Token contrast of each look's role pairs, from the reference tables.
- Effective text size inside each home preview (font size × transform scale).
- Geometry, focus and the search flow, read with `pnpm shoot --eval` and Playwright.

The Astro dev toolbar floating in the shots is dev-only and ignored.

Count: **7 must, 9 should, 7 nit.**

## 1. Findings

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| 1 | must | All four look pages at 375, Values table (`src/components/look/Look.module.scss:2-24`; `table-layout: fixed`, name column 26% = 89px) | component-table: "Truncating the name column … It's the column people scan." / "The name stays when the rest scroll." | `--surface-raised` code runs to x=138 while its cell ends at x=105. The light swatch sits at x=105, on top of the name. Names read "--surface-ra s #ffff", "--ink-disabl d", "--accent-hov r". Hex values split as "#f7f7 / f8". Shots: `look-*-375-*.png`, `look-playbook-375-values-table.png`. | Under ~600px, put the table in a horizontally scrolling region with a name (`role="region"`, `aria-label`, `tabindex="0"`), names `nowrap` and the name column pinned, as Table's "Name column pinned" does. Or stack each variable as a block: name, then Light and Dark values, then From. |
| 2 | must | Paste blocks on all four look pages, light theme (`Look.astro:63`, Shiki `github-light`; colours applied in `global.scss:88-91`) | SKILL floor: "Text holds 4.5:1 against what it sits on". | Probe on `surface-sunken` #efeff1: every property name (`--bg` …) is 3.04:1. Units (`px`, `ms`, `%`) and `@media`, `=` are 3.98:1. Dark passes. | Use a light theme whose token colours hold 4.5:1 on `surface-sunken`, or map Shiki's light tokens onto the playbook's `accent-text`, `danger`, `success` and `ink-muted`. Then re-probe. |
| 3 | must | Paste blocks (`<pre tabindex="0">`) on all four look pages (`global.scss:75` `:focus-visible { outline: none }`; `_reading.scss:145` gives `pre` no focus style) | component-app-shell States: a scrolling pane is a Tab stop; "draw its focus ring inside". Owner: focus follows the action and is seen. Floor: a pane with no links "gets `tabindex="0"` and a name". | Reached by Tab, the block computes `outline: none`, `box-shadow: none`, with nothing visible (`look-playbook-375-pre-focus.png`). It also has no `role` or `aria-label`, so it is announced without a name. | `pre:focus-visible { box-shadow: inset var(--focus-ring) }` (inside, as App shell asks). Give it `role="region"` and a name, e.g. `aria-label="CSS variables for After Primer"`. |
| 4 | must | Home, Menu preview: shortcut keys (`src/ui/Menu.module.scss:173` `color: var(--ink-disabled)`) | SKILL floor: "Text holds 4.5:1 … muted and secondary text too … hints included." | Probe: C, R, G 2.36:1 and D 1.96:1 on the highlighted row (light); 1.90 and 1.39:1 (dark). The same keys appear on every Menu demo; `looks.md` #7 found the same root. The Menu reference's Anatomy row asks for `ink-disabled` (see Gaps). | Shortcuts in `ink-muted`. Dim further only on an unavailable row. Then change the Menu page's Anatomy row to match. |
| 5 | must | Home, Systems section: Looks, Playbook look, After Primer, After Apple, After Linear (`Home.astro:117` casts every system slug to `'work-tool' \| 'consumer-app'`; `src/demos/systems/Preview.tsx:21` falls through to the phone mock) | component-card When to use: "a card whose stage is a generic icon is a list row in disguise". SKILL marketing tells: "identical rounded cards". | Five cards show the identical consumer-app phone mock with the playbook's blue button (`home-1280-*.png` segment 7). After Linear is an indigo work-tool look, and After Primer has 6px corners, yet both draw a blue pill on a phone. | Give each look a stage drawn from its own values: its `accent`, `radius-control`, surfaces and font, e.g. a row of the look's button, field and badge. Or, if there is nothing to show, make these list rows, not cards. |
| 6 | must | Home, every gallery card (`src/pages/index.module.scss:63-70` `.cardHead` border-bottom; `:126-133` `.cardSummary` border-top; `:44-52`; `:116-124`) | component-card: "A frame around a grey stage, words beneath." Anatomy: frame `radius-xl` 18, inset 8, stage `fill-control` `radius-lg` 10. SKILL: "no header or footer bands"; boundary: a line is "never a heading from what it heads". | Each card is a header band (title and meta, 47px, hairline under it), an edge-to-edge stage, then a footer band (summary, hairline over it). Measured: frame radius 10px, stage inset 0/0, stage radius 0, stage background `bg`. | Inset the stage 8px with radius 10 on `fill-control` inside an 18px frame. Put the title row (title and "n details") and the summary beneath the stage, with no hairlines. Card's "Truncate to one line" still holds for the title. |
| 7 | must | Home, section heads Components / Principles / Systems / In practice (`index.module.scss:10-17` `.groupHead` `border-bottom: 1px solid var(--line)`) | principle-the-lightest-boundary Avoid: "A rule under everything … Don't underline headers with dividers"; "a line splits repeated things, never a heading from what it heads". | A full-width hairline under each section heading, 8px below it. The 48px above (`space-12`) already holds each section. | Remove the border. Keep the count on the heading row, right-aligned. |
| 8 | should | Every system page (and every entry): "System" line above the H1 (`src/layouts/Entry.astro:32`, `.kind` 13px `ink-muted`) | principle-every-line-does-a-job Avoid "An eyebrow … tells someone looking at an issue that it's an issue". SKILL: "No eyebrows". | "← All systems" sits 44px above it and already names the parent. "System" says only that the page is a system. | Drop the kind line on entry pages. The back link names where the page sits. If a caption is wanted, make it the parent link itself. |
| 9 | should | Look tables: After Apple (`src/looks/apple.ts`) | principle-lightness-first roles: text 4.5:1; "Control borders, focus rings … 3:1". SKILL floor. | Token probe, light: `line-strong` #8e8e93 is 2.92:1 on `bg` and 2.60:1 on `surface-sunken`. On `surface-sunken` #e5e5ea, `accent-text` is 4.43, `success` 4.23 and `warning` 4.14. The page says text holds "4.5:1 on every surface". That holds for `ink` and `ink-muted` only. | Darken `line-strong`, and the light `accent-text`, `success` and `warning`, one step each. Or state in the From note which surface each pair holds on. Re-probe on all four surfaces. |
| 10 | should | Look tables: After Linear (`src/looks/linear.ts`) | As #9. | `accent-text` light #5a68cf: 4.9:1 on white (as noted) but 4.42:1 on `surface-sunken` #f4f4f4. | Derive `accent-text` a step darker (the same fix as `looks.md` #8 covers this). |
| 11 | should | Home, Never too busy to listen preview (`src/demos/interrupt.tsx:14-18`; `demos.module.scss:2347-2358`, white 13px label) | SKILL floor 4.5:1. principle-lightness-first: a white label needs a fill "about 55% or less". component-card: "Text on the stage … lose contrast". | "Lisbon" and "Kyoto" sit in white on gradients from L 0.80 to L 0.60: 1.8 to 3.8:1 across the label, and a 0.25 text-shadow does not lift it to 4.5. | Put the place name under the image, or lay a dark scrim (to about L 0.45) behind the bottom 40px. |
| 12 | should | Home, Toast preview (`ToastPreview`, `_toastStill_`) | component-toast Kinds: "With Undo · Icon —". Anatomy: "Width: fits the text, 320 to 440". | The undo toast carries a success `circle-check` icon in `success` green. Measured width: 270px. | Drop the icon on the undo kind, or change the Kinds table if both are meant. Set `min-width: 320px`. |
| 13 | should | Home, Looks and Playbook look cards: "0 details" (`src/entries.ts:355`, `:363`) | principle-every-line-does-a-job: "every line names a thing, an action or a state". | Two cards' meta reads "0 details". It looks like an empty page, not a values page. | Hide the meta at 0, or count what the page holds ("49 values"). |
| 14 | should | Every system page, the tick rail (`src/components/ticks/Ticks.module.scss:41-49`, `width: 40px; height: var(--tick-h)` = 20px) | system-work-tool Targets: "at least 24 × 24px" (WCAG 2.2, 2.5.8). | 9 to 18 buttons per page at 40×20, stacked on a 20px pitch, so the 24px spacing exception can't apply. | Make each tick 24px tall. `ticks.ts` already thins ticks on long pages. Keep the 2px mark inside. |
| 15 | should | Home hero, "press / from anywhere" note: Rough.js arrow and RoughNotation circle (`src/components/note/note.ts:4-21`) | SKILL floor / component-icon: "no SVG is drawn by hand: status, priority and arrows are in the library too". | A wobbly drawn arrow and circle at 1280 and wider (hidden at 375). The owner chose these notes in lab B (memory, 2026-10-27), so this is a recorded conflict, not a regression. | Either write the exception into the Icon page ("annotations on the playbook's own pages may be hand-drawn"), or draw the arrow with Lucide's `ArrowUpLeft` and a plain ring. |
| 16 | should | Home gallery cards on hover (`index.module.scss:85-88`) | component-card: "Only a card that opens lifts". Prefer "Up to 1.01, small shadow … `shadow-sm` on the gentle spring". | Every card opens a page. On hover only the head band tints (`fill-hover`); `transform: none` and the shadow stay `shadow-xs`. | With #6, hover lifts the whole card to 1.01 and `shadow-sm`. Drop the band tint. |
| 17 | nit | Look tables at 1280: shadows and font stacks (`Look.module.scss:21-24` `word-break: break-all`) | principle-reading-text, When it doesn't apply: "Code. Its lines are as long as the code; wrapping it changes what it says." | `0 2px 4px #18181b0` / `f, 0 0 0 1px …` and `"PingFang S` / `C"`: tokens split mid-hex and mid-name. | `overflow-wrap: anywhere` with breaks after `, ` (or `<wbr>` after commas) so a hex or a name never splits. |
| 18 | nit | Look tables: swatch of a white or near-white value (`Look.module.scss:27-35`, edge `inset 0 0 0 1px var(--line)`) | principle-lightness-first: "Control borders … icons that carry state: 3:1". | The `#ffffff` and `#f7f7f8` swatches on a white or `#f7f7f8` page have a 1.2:1 edge and read as missing (`look-*-1280-light.png`). | Edge the swatch with `line-strong` at 50%, or a 1px `ink` ring at 20%, so a white chip shows. |
| 19 | nit | Home previews: Colour means one thing, Where the eye goes, Nothing shifts, Space groups by ratio, The faster way (scaled-down screens) | system-work-tool: "Labels and meta 12px; nothing smaller in a row someone reads". | Effective text sizes: 6.8 to 8.7px (Colour, Eye), 9.6 to 10.4px (Nothing shifts), 10px (ratio chips, key badges). | Crop the demo to fewer elements at a larger scale, or accept it as a picture and record that (see Gaps). |
| 20 | nit | Home hero search (`Hero.astro:17-21`) | component-input Anatomy: "Height `control-md` 32 … Text 14 / 20". system-work-tool: 40 "for a dialog's main action". | 40px tall, 15px text, 420px wide. | Accept it as the page's one main field and record the departure, or set it to 32/14. |
| 21 | nit | Look tables, From column (`Look.astro:52`) | principle-every-line-does-a-job: "One word for one thing", one form per place. | Sourced cells end without a full stop ("Primer themes bgColor-inset"). Unsourced cells read "Playbook." with one. | "Playbook" without the full stop. |
| 22 | nit | `/systems/look-apple` (`look-apple.mdx` has no `part="specimen"`; `Gallery.astro:24-25` lists only Primer and Linear) | Consistency with its siblings; Card copy "the one fact that helps choose". | It is the only look page without "See it on the screens", and the gallery can't show it. | Add Apple to the gallery and the link, or say on the page why it isn't there. |
| 23 | nit | Tick rail labels for code blocks (`ticks.ts`) | component-tooltip Copy: the name is the control's `aria-label`, short; every-line-does-a-job. | Tick buttons are named "Paste: :root { --bg: #ffffff; --surface: #ffffff; --surface-raised:". | Name a `pre` tick by its section ("Paste: CSS variables"), not by its first characters. |

Checked and fine, so no finding: horizontal overflow on every route at 375 (`scrollWidth − innerWidth = 0`); body text 16/26 in a 720px column (Reading text, "These pages"); "/" focuses search; Esc clears it; the no-match state reads "Nothing matches “zzqx”." with **Clear search**, which returns focus to the field; the palette menu takes focus on open; the theme and palette buttons have Tips matching their `aria-label`s; card focus draws one ring around the whole card; table preview numbers are right-aligned and `tabular-nums`; dark-theme text contrast is clean on every route except #4.

## 2. Ledger

`pass` = checked and holds. `fail #n` = a finding above. `n/a` = nothing on these routes it could apply to, with the reason. Home previews are inert (`inert` stage). Rules about states, motion, timing and keyboard inside a component are n/a for them here: each is reviewed on its own page, by the components and principles audits.

### Floors (SKILL.md)
- Text 4.5:1: fail #2, #4, #11. Pass otherwise (probe, both themes).
- One icon library, no symbols or hand-drawn SVG: fail #15. Lucide everywhere else (BackIcon, SearchIcon, menu, toolbar, toast). `⌘ ⇧` in menu and tooltip previews are shortcut glyphs, not icons: pass.
- Window holds still / reading page scrolls as one: pass. These are documents, so they scroll as one. The floor's "a pane with no links … gets `tabindex="0"` and a name": fail #3 (the `pre` has the tabindex, no name).

### Systems
**system-work-tool** (governs the system pages' controls and the home chrome, by posture; the page's own numbers are its content):
- Numbers. Body 14/20: n/a (reading page, 16/26 per Reading text). Labels and meta 12px minimum: pass for chrome (card meta 12, count 12); fail #19 for previews. Text contrast: see Floors. Controls 32: pass (header buttons 32×32, slider rows 32, toolbar tools 32, menu rows 32); search 40: nit #20. Targets ≥ 24: fail #14 (ticks 40×20). Spacing 4-grid: pass (16 card padding, 12 summary padding, 48 between sections). Radius 4–10, button a pill: pass. Surfaces one step apart: pass (`bg` #f7f7f8 / `surface` white). One accent: pass. Icons 16 in the text's colour: pass (back arrow and search icon 16, `ink-muted`).
- Common mistakes. Rows in 10–11px grey: fail #19 (previews only). Brand colour as a panel: pass. Tagline under the page title: pass on system pages (the summary names the system's numbers); home lede is n/a (front page, "the marketing site" exception). Large radii on dense parts: pass. Controls of two heights in a row: pass (header 32/32).
- When it gives way: n/a.

**system-consumer-app**: n/a for these routes. No route here is a consumer app. Its page's own claims were read as content: "Several coloured buttons", "art drawn for the occasion" and "truncating at large sizes" have no instance on the page.

**system-look-playbook**, values as published:
- Each pair holds its role: pass. Token probe: every text role ≥ 4.5 on all four surfaces, `on-accent` 4.7, `line-strong` 3.6 / 3.5.
- Paste block contains every variable: pass.
- "Blue is the default" link and palettes: pass.

**system-look-primer**:
- Role pairs: pass. Token probe: all text roles ≥ 4.5 on all surfaces; `line-strong` ≥ 3.
- The three stated departures (one accent, field edges at 3:1, motion length): pass. The table matches the text.
- "45 of 49 values are the product's own": pass (4 rows read "Playbook.").

**system-look-apple**:
- Role pairs: fail #9.
- "System font, never its files": pass (`-apple-system` stack, no SF files).
- Text greys 4.5:1 on every surface: pass for `ink` and `ink-muted`; fail #9 for accent and status text on sunken.
- Specimen and gallery: nit #22.

**system-look-linear**:
- Role pairs: fail #10.
- 2px focus ring: pass. Derived hover and text: pass (stated as derived).
- "One radius is a guess": stated, pass.

### Components (home previews, and the page chrome where noted)
**component-app-shell**:
- Prefer "Each pane scrolls": n/a. Pages are documents, its "When to use" exception.
- `min-height: 0` / `100dvh`: n/a.
- States, scroller as a Tab stop with a name and an inside ring: fail #3.
- Common mistakes: n/a (no app shell). Preview (sidebar and pane drawing): pass as a picture.
- Copy (name each pane): fail #3 (unnamed `pre`).

**component-badge** (Badge preview, Table preview):
- Dot and word: pass. Soft not solid: pass. Dot only on states: pass (Beta has none; Shipped and In review have dots).
- Anatomy: height 20 pass; padding 8 pass; pill pass; 12/16 pass; status on `*-soft` pass; dot 6: pass by sight.
- Mistakes: a badge per row in a status column with a header: pass (Table "Status"). Red for new: pass. Truncated: pass. Badge as button: pass.
- Copy: pass (In review, Shipped, Scheduled, Beta).

**component-button** (Button, Dialog, Popover, Toolbar, Toast previews; header buttons):
- Filled not outlined: pass. Hover in/out and press scale: n/a (inert; header ghost buttons not timed here). One filled button per view: pass (Save changes; Delete project is the one danger fill). Loading: n/a.
- Anatomy: height 32 pass; padding 12 pass (toast Undo `0 12px`); pill pass; label 14/500 pass; fill-control pass.
- Mistakes: shadow on a button pass; colour as rank pass; disabled with no reason n/a.
- Copy: verbs pass (Save changes, Delete project, Invite, Create issue, Add to cart, Undo, Clear search).

**component-card** (the gallery cards themselves; Card preview):
- Only an opening card lifts: fail #16 (gallery). Card preview pass (static).
- Small lift 1.01: fail #16. Arrive together, capped at 8: n/a (no entrance on the gallery; nothing staggers). Numbers swap with a blur: n/a.
- Anatomy: frame radius 18 fail #6 (10); inset 8 fail #6 (0); stage `fill-control` radius 10 fail #6 (`bg`, 0); title 14/500: fail #6 (15/600, and above the stage); subtitle 13/18 `ink-muted` pass (summary 13/18 `ink-muted`); meta padding pass; hover fail #16; entrance n/a. Card preview: pass by sight (inset stage, words beneath).
- States, one target with one name: pass (head link stretched by `::after`; one focus ring on the card).
- Mistakes: buttons all over pass; text on the stage pass for the gallery, fail #11 in a preview; uneven heights pass (title truncated to one line with a `title`, stage fixed at 300); staggering on re-render pass (none); stage copying the corner fail #6 (no inset at all).
- Copy: title is the thing's name pass; subtitle is one fact: the gallery's summary is a sentence, a deliberate catalogue line, pass with note.

**component-checkbox** (preview):
- Whole row clicks: n/a (inert); markup is a label row by sight. Dash for some: pass.
- Anatomy: box 16 pass; on = accent and mark pass; children indent 24 pass; label 14/20 pass.
- Mistakes: n/a.
- Copy: group label "Email me about" pass; labels true when checked pass.

**component-combobox** (preview):
- Matching, first match ready, bold match, empty list wording: n/a (closed field in the preview). The home search's empty state passes the "repeats query, names next step" rule.
- Anatomy: field 32 pass; chevrons up and down pass.
- Copy: label "Time zone" pass.

**component-dialog** (preview):
- Confirm kind: Cancel and a verb pass; focus and scrim n/a (inert); danger fill pass.
- Title names the decision: pass. Grows in place: n/a.
- Anatomy: radius 18 pass; padding 20 pass; title 18 pass by sight; buttons pill pass.
- Mistakes: pass.
- Copy: "Delete “Q4 roadmap”?" / "The project and its 24 files are deleted for everyone. This can't be undone." / Cancel / Delete project: pass.

**component-icon** (whole site):
- Symbol vs library: pass. Emoji: pass.
- Icons beside words: pass. Header icon buttons are the conventional few, with Tips: pass.
- Sized to text: pass (16 beside 14). Drawn for the occasion: fail #15.
- Anatomy: 16 / gap 8 / `currentColor` `ink-muted`: pass.
- States: n/a.
- Mistakes: two libraries pass; icon button with no name pass (palette, theme labelled).
- Copy: tooltip equals `aria-label` pass.

**component-input** (preview; home search):
- Check on leave and error under the field: preview shows the post-leave state, pass. Label above and example inside: preview pass; home search uses its placeholder as its name, which suits a search field (Variants, "a magnifier on a search"): pass. Width says how much: n/a.
- Anatomy: height 32: preview pass, search nit #20; radius 10 pass; edge `line-strong` pass (search #868690); text 14: search nit #20.
- Mistakes: pass.
- Copy: error "Enter an email address, like ana@studio.com." pass.

**component-menu** (preview; header palette menu):
- Icons on every row of a group: pass. Unavailable dimmed in a pull-down (Undo): pass. Highlight visible: pass.
- Destructive row last and red: pass. Check in a leading column: pass (Snap to grid; palette menu).
- Shortcuts as bare symbols in a column: pass in layout; colour fail #4. Grows from trigger: n/a.
- Anatomy: radius 10 / inset 4 / item 32 / label 13: pass by sight; shortcut `ink-disabled`: the anatomy is followed, which is fail #4 against the floor.
- Mistakes: pass. Palette menu (choice kind) has trailing swatches: values shown as their colour, pass.
- Copy: verbs pass; "Move to" ellipsis rule pass.

**component-popover** (preview):
- Trigger stays filled: pass ("Share" filled). Other pairs n/a.
- Anatomy: title 13/600, description 13 `ink-muted`, action right-aligned small: pass.
- Copy: Share “Q4 roadmap” / People you invite can edit. / Invite: pass.

**component-radio** (preview):
- One chosen: pass (2×). Column: pass. Round: pass. Tab and arrows: n/a.
- Anatomy: 16 circle, 8 gap, 14/20 label: pass by sight.
- Copy: "Export at", parallel options: pass.

**component-segmented-control** (preview):
- Equal widths: pass (75/75/75). Raised, not coloured: pass. Words only: pass. Thumb slides: n/a.
- Anatomy: track 32 pill, inset 2: pass by sight.
- Copy: Board / List / Timeline: pass.

**component-select** (preview):
- Check not fill: pass (check on Editor, fill on Commenter as keyboard). Over the trigger, chevrons, default: n/a (open list only shown).
- Anatomy: list radius 10, rows 32: pass by sight.
- Copy: Owner / Admin / Editor / Commenter / Viewer: pass.

**component-sheet** (preview drawing):
- All rules: n/a. The preview is a static picture of a panel with a grabber, and its rules are behavioural.

**component-slider** (preview):
- Whole row is the control: pass (rows 264×32). Label and value inside: pass. Tabular digits: pass by sight. Drag and ends: n/a.
- Anatomy: row 32 radius 10 `fill-control`: pass. In a panel 18/8 → 10: pass.
- Copy: Radius 12 / Opacity 64% / Columns 3: pass.

**component-switch** (preview):
- Applies at once: n/a. Label names the setting: pass (Autosave, Show grid). Knob stretch: n/a.
- Anatomy: track 32×20 pass; inset 2 pass; off `line-strong` pass; on `accent` pass; switches in one column on the right pass.
- Copy: pass.

**component-table** (Table preview; look Values tables; "The numbers" tables):
- Numbers on the right, tabular: preview pass. Values tables mix hex, px and stacks in one column, so the rule is n/a there.
- Lines not stripes: pass. One sort arrow: n/a. Secondary columns muted: preview pass.
- Name column pinned: fail #1 (looks at 375).
- Anatomy: preview pass (header 32, rows 36, frame). Docs tables have no frame or sunken header; see Gaps.
- Mistakes: status as colour alone pass (badges with words); actions per row n/a; truncating the name column fail #1.
- Copy: headers nouns pass (Variable, Light, Dark, From; Name, Status, Size). Units in cells pass ("18.4 MB").

**component-tabs** (preview):
- Weight stays 500: pass by sight. Bar is ink: pass. One row: pass. Count in a quiet chip: pass ("12", mono 11).
- Anatomy: pass by sight.
- Copy: Overview / Issues / Activity / Settings: pass.

**component-toast** (preview):
- Undo instead of asking: pass. Colour on the icon only: pass. Three at most: n/a.
- Kinds, With Undo has no icon: fail #12.
- Anatomy: pill, height 40, inset 4 / 16, text 14 pass; width 320–440 fail #12 (270); `shadow-lg` pass.
- Copy: "Deleted “Q4 roadmap”" / Undo: pass.

**component-toolbar** (preview):
- Current tool tinted, not filled: pass (tint plus accent icon; Create the one fill). Tooltip with shortcut: n/a.
- Anatomy: panel pill 40, inset 4, tools 32, divider: pass.
- Mistakes: pass.

**component-tooltip** (preview; header Tips):
- Inverse, no shadow: pass. Shared delay: n/a.
- Anatomy: 12/500, `ink` on `bg`: pass by sight.
- Copy: "Redo ⇧⌘Z" pass; header "Palette", "Switch to dark theme" pass.

### Principles (home previews, and the pages' own chrome where noted)
**principle-the-lightest-boundary-that-holds**:
- Every section a card → headings and space: fail #6 (header and footer bands inside each card).
- Three equal tiles: n/a.
- Innermost box wins: pass (no box inside a gallery card's stage edge; previews draw their own components).
- A rule under everything → lines between rows: fail #7 (section heads); pass for docs tables (lines between rows only).
- Indent claims a parent: pass. Checkbox children are the only indent. Hanging list bullets sit outside the text edge; see Gaps.
- Which boundary: pager links are two boxed units, pass. Preview: pass.

**principle-space-groups-by-ratio**:
- Header gaps: pass. Section heads have 48 above and 16 below (the hairline is #7). h2 / h3 on system pages: more space above than below, pass by sight.
- Fill beats gap: pass.
- One left edge per kind: pass. Title, back link, kind, headings and prose share x=280 at 1280 and x=16 at 375.
- Preview: pass.

**principle-every-line-does-a-job**:
- Three lines before the first field: n/a. Word that differs first: pass (card titles).
- Eyebrow: fail #8.
- Error says what failed: pass (input previews).
- Specific verbs: pass.
- Words by place: empty state pass (repeats the query, Clear search); toast pass; confirmation pass.
- No we / please / sorry: pass.
- "0 details": fail #13. "Playbook." full stop: nit #21.
- When it doesn't apply: home lede is front-page copy, n/a.

**principle-grey-until-it-matters**:
- Labels grey, colour a dot: pass. A slogan and a panel of shapes: home lede is n/a (front page).
- Content colour (Lightness preview swatches, Card preview bars) is content: pass.

**principle-colour-means-one-thing**:
- Accent only on the one action: pass (previews: Publish, Save changes, Create, Invite). The palette dot in the header is the palette's own swatch: pass.
- Hover neutral: pass (card hover `fill-hover`). Red only for wrong: pass (danger only on Delete and errors).
- Accent text is a link: pass. Accent text is used only for links and Clear search.

**principle-lightness-first**:
- Roles: text 4.5 fail #2, #4, #9, #10, #11; borders 3:1 fail #9 (Apple `line-strong`), nit #18 (swatch edges).
- Dark re-mapped: pass. Status colours part by lightness: pass (playbook danger 46%, warning 54%, success 52%).

**principle-reading-text** (system pages):
- 16/26: pass (measured). Measure 45em / 720px: pass.
- Leading 1.5–1.6: pass. Narrow screens run short: pass.
- Code is not wrapped: nit #17 (values cells). Paste blocks scroll and don't wrap: pass.

**principle-where-the-eye-goes**:
- Change at the point of focus: pass. Search filters in place, and counts update in each section head.
- Illusion of completeness: pass. Home's first screen cuts through the first row of cards.
- Ad-shaped bands: pass (none). Gaps 4 within, 20 between: pass (input previews). Words' promise: pass.
- Preview: nit #19.

**principle-concentric-radius**:
- Card 18 / 8 / 10: fail #6. Menu 10 / 4 / 6, toolbar pill / 4 / pill, toast pill / 4 / pill, switch, slider panel: pass.
- Field and key: pass (search 10, key 6 by sight).
- Dialog 18 / 20 / pill: pass.
- Preview: pass.

**principle-a-shadow-says-how-high**:
- Shadows on floating things only: pass (menu, popover, dialog, toast and toolbar previews carry them; table and fields don't).
- Gallery card at rest has `shadow-xs`, which the playbook's heights table allows for "a card at rest": pass. Lift under the pointer: fail #16.
- Two shadows, two jobs: pass by computed values. Dark depth is lightness: pass.

**principle-who-before-what** (preview):
- Every row keeps a mark in one column: pass.
- Faces 36 / 24: preview initials at 11px, n/a (picture).
- Pastel identity, no accent on faces: pass.

**principle-nothing-shifts**:
- Search filtering: cards hide on the user's own keystroke, pass ("a move the user asked for").
- Bold widening: pass (tabs weight constant; card hover is a fill).
- Scrollbar gutter: n/a (page scroll).
- Font fallback: n/a (not measured here).
- Preview: pass.

**principle-how-waiting-feels**: n/a. No waits on these routes. The preview shows "show the work": pass as a picture.

**principle-attention-wears-off-waiting-doesnt**: n/a. No repeated motion; card hover tint is 120ms out and instant in: pass. Hand-drawn circle plays once on first sight: pass ("rarely").

**principle-never-too-busy-to-listen**: preview n/a (inert). Contrast in its preview: fail #11.

**principle-hover-forgives**: preview (safe triangle) pass as a picture; card hover owned by the whole card (`.card:hover`): pass.

**principle-the-faster-way**:
- Shortcut taught on the path: pass. The "/" key sits in the search field, and the note points to it on first sight.
- Preview: pass.

**principle-error-timing**: input previews show the after-leave state: pass. Other rules n/a.

### Owner's rules (`~/.claude/CLAUDE.md`, Product and UI judgment)
- One grid: pass (home grid `minmax(320px,1fr)`, one column at 375).
- One left edge: pass (see ratio).
- Trailing meta right-aligned in one column: pass (card "n details", section counts).
- Lightest boundary that holds: fail #6, #7.
- Empty states name the next step: pass (search: Clear search).
- Focus follows the action: pass for search, Clear, Esc and the palette menu; fail #3 (focus lands on the `pre` unseen).
- Inspect rendered geometry: fail #1 (overlap at 375).

## 3. Gaps in the playbook

- **Menu Anatomy contradicts the text floor.** component-menu: "Shortcut … `ink-disabled`". The floor: "Text holds 4.5:1 … hints included". `ink-disabled` is 2.4:1 light and 1.9:1 dark. One has to change; `looks.md` #7 found the same thing.
- **Hand-drawn annotations vs the Icon floor.** The floor bans hand-drawn SVG and arrows. The owner chose Rough.js notes for the playbook's own pages (lab B). Neither page records the exception.
- **Tables inside reading pages.** component-table's Anatomy (1px frame, `radius-lg`, 32px header on `surface-sunken`, 36px rows at 13px) is written for product tables. The docs tables ("The numbers", the look Values tables) use a lighter prose style with no frame, a plain header and 14px. No rule says which a reading page's table follows. Nothing covers narrow widths either: Table's pinned-name rule assumes horizontal scroll, which these tables don't have.
- **Scrolling code blocks.** The App shell floor covers panes. A horizontally scrolling `pre` in a document is a scroller too, and needs a name and an inside focus ring, but no page says so.
- **Scaled-down screens as previews.** The home cards shrink whole demos to 6.8–10px text. The work tool's 12px floor is written for rows someone reads. Nothing says whether a thumbnail is a picture (exempt, like content) or text (bound by the floors).
- **Eyebrow rule scope.** every-line-does-a-job is scoped "in a product". A reading page's kind label ("System", "Component") sits in that gap. It reads as an eyebrow, yet the marketing exception doesn't obviously cover docs.
- **Truncation disagrees by system.** Card: "Truncate to one line; show the rest in a tooltip". The consumer app: "labels wrap instead of truncating". Neither page names the other.
- **Look values' guarantees.** The look pages say each text grey holds 4.5:1 "on every surface". No rule says which surfaces accent and status text must hold on. Apple and Linear fail only on `surface-sunken`.
- **Live result counts.** Nothing covers announcing a filter's result or its empty state to screen readers. The home search updates counts and shows "Nothing matches" with no `aria-live`.
- **Hanging list markers at 375.** System page bullets hang outside the 16px text edge (`ul` padding 0, markers at x≈4–8). That keeps one left edge, but nothing says how close a marker may come to the screen edge.
- **Tooling.** `pnpm shoot --full` on a page taller than 16 384 CSS px at scale 1 repeats content past that height (home at 375 is 21 410px). Shots of long pages need segmenting.
