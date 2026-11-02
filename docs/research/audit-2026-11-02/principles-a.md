# Rule review: principles, part A

Date: 2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Dev server http://localhost:4321, frame style `caption` (the default `data-box`).

Routes: `/principles/concentric-radius`, `/principles/a-shadow-says-how-high`, `/principles/who-before-what`, `/principles/reading-text`, `/principles/lightness-first`, `/principles/colour-means-one-thing`, `/principles/grey-until-it-matters`, `/principles/every-line-does-a-job`, `/principles/where-the-eye-goes`, and every live demo on them.

Shots: `shots/review/principles-a/<route>-{1280,375}-{light,dark}.png` (36 full pages), plus zooms named below. Contrast was scanned on every text node of every route in both themes at 1280 (composited background, opacity included); overflow and sub-12px text were scanned at 375.

Out of scope and not reported: the Astro dev toolbar that overlaps a demo in every dev shot (dev only); the deliberate failures in teaching specimens (HSL row's "Aa" chips, the LightnessButton label that is meant to fail, the promo band's text on a gradient), and every Avoid side's intended mistake.

Counts: **5 must, 10 should, 5 nit.**

## Findings

| # | severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- | --- |
| 1 | must | Every route. The caption and tools of any demo frame whose theme differs from the page: pinned (`ShadowDesks`, `defaultTheme="dark"`) or flipped with its own theme button. `src/demos/shell.tsx:276` puts `data-theme` on the `<figure>`, and the figcaption sits inside it; `shell.module.scss` `.frame[data-box]` sets `background: none`, so the caption is drawn in the other theme's ink on the page's ground. | SKILL floor: "Text holds 4.5:1 against what it sits on" | "One step up, in dark mode" #b4b4bd on #f7f7f8 = **1.92:1** (`shadow-desks-light-x2.png`). On `/principles/concentric-radius`, flipping the first Compare frame makes "Both corners 20 px" #ff9c7d on #f7f7f8 = **1.90:1** (`concentric-compare-flipped-x2.png`). The theme icon falls to the same contrast. | Scope the frame's theme to the stage (put `data-theme` on `.stage`, not the figure), or paint the caption from the page's tokens. Re-run the scan with one frame flipped on each page. |
| 2 | must | `/principles/who-before-what` at 375. The Prefer side of `FacesColumn` ("Checkbox in its own column"), and the `FacesDots` and `FacesFind` lists. `src/demos/faces/faces.module.scss` `.row` has fixed columns `20px 28px 128px minmax(0,1fr) auto` at every width. | who-before-what: "The column that says who or what a row is stays filled". Its own table: "Phone: none: a long press opens the row's menu". | Prefer subjects are **14 px** wide and show one letter ("Q…", "Y…", "D") (`faces-column-prefer-375-x2.png`). The checkbox column is still reserved on a phone. `FacesDots` subjects are 46 px wide. | At ≤640 px drop the checkbox column, as the page's own table says, and stack the sender over the subject in two lines, as Post does on a phone. Or let the 128 px sender column shrink. |
| 3 | must | Every route at 375, and every `Compare` in toggle mode (`shell.tsx:326-347`). The segment labels are the long `beforeLabel`/`afterLabel` phrases, and the caption falls back to a generic "Before"/"After" because `Verdict` gets no `words` in this branch. Also `LightnessStatus`'s Vision control. | segmented-control Copy: "nouns, one word where possible, of similar length". Common mistake: "labels truncate". | "Three lines before the …" (190 px of text in a 146 px segment; `copy-toggle-375-x2.png`). "Shadow on the menu only", "Hover in the selection tint", "First screen ends at the band", "Resources, Solutions, More", "Promo-style band on top" and "Deuteranopia" are cut as well. The caption reads only "✓ After". | Pass the side's own label to `Verdict` in the toggled branch, so the caption names the scene. Make the segments "Avoid" and "Prefer". Shorten the Vision segments, or let that control take the row's full width. |
| 4 | must | `/principles/concentric-radius`, the `ConcentricTweak` panel. The same mistake is in every Tweak that puts a `SegmentedControl` in a `SliderPanel`: `ShadowRaise`, `ReadingMeasure`, `ReadingAngle`, `LightnessTint` and `EyeSquint`. | concentric-radius: "Inner radius = outer radius − inset − border". slider Anatomy: "In a panel: `radius-xl` 18, inset `space-2` 8 → row `radius-lg` 10". | Panel 18 px, inset 8 px, segmented track a 32 px pill (**16 px** radius) where 18 − 8 = **10 px** is due. The pill's corner swells into the gap at the panel's top corners (`concentric-panel-x3.png`). The sliders below it are correct at 10. | In a panel, give the segmented track `radius-lg` 10 and its thumb 8 (10 − 2). Or move the segmented control out of the panel's corner. Add the pairing to the "Precision's pairings" table. |
| 5 | must | `/principles/a-shadow-says-how-high`, `ShadowOverlap`, both sides including Prefer. `src/demos/shadow/Overlap.tsx:22` `<span className={s.fileMore}>···</span>`. | SKILL floor and icon Common mistakes: "A typed symbol or an emoji as the icon". "A text symbol … never stands in for an icon". | Each row's More control is typed middle dots (`shadow-overlap-prefer-x2.png`). The menu that opens from it uses Lucide icons. | Use Lucide `Ellipsis` at 16 px, `ink-muted`. |
| 6 | should | `/principles/who-before-what`, `FacesFind`. `Find.tsx:96-115`: the `search` step has no focus target. | CLAUDE.md: "focus follows the action and never falls to `<body>`". "The main area reflects the last action". | After "Show the list", `document.activeElement` is **BODY** (measured). Opening the wrong row does nothing visible; only a hidden miss count goes up. | Move focus to the first row, or to the "Open X's message" line with `tabindex=-1`. On a wrong pick, mark the row briefly and announce it ("Not Jonas"). |
| 7 | should | Every Tweak's `SliderPanel` (`src/ui/Slider.module.scss:154-163`, `box-shadow: var(--shadow-sm)`). | a-shadow-says-how-high: "And not … To part a surface from a plain ground. A hairline or a step in tone does that." | The panel lies on the page beside a stage drawn with a hairline only (`.frame[data-box] > .stage` inset 1px `--line`). It casts a 2 px drop, the toolbar's height, though it covers nothing. | Draw the panel like the stage: a hairline, no drop. Keep `shadow-sm` for a panel that floats over a canvas. |
| 8 | should | `/principles/a-shadow-says-how-high`, `ShadowOverlap` Prefer menu (`shadow.module.scss` `.fileMenu`, `.fileMenuItem`; `Overlap.tsx:5`). | menu Anatomy: "Item height `control-md` 32", "Width … at least 160", "Icons are Lucide at 16px in `ink-muted`". Common mistake: "Destructive actions mid-list. Put them in the last group, in `danger`". | Items 28 px tall, popup 148 px wide, icons 14 px at a 1.5 px stroke in `ink`. Delete sits in the one group, in ink. | Build it to the Menu anatomy: 32 px items, ≥160 wide, 16 px icons in `ink-muted`, a separator, then Delete in `danger`. |
| 9 | should | Icon strokes: `Overlap.tsx:5` (14 px, `strokeWidth 1.5`, non-scaling), `eye.tsx:46` (ShoppingBag 40 px at 1 px), `eye.tsx:55` (Check 16 px at 2 px). Everywhere else, `src/ui/icons.tsx`: Lucide's own 2 on 24, so 1.33 px at 16. | SKILL floor: "one icon library, at one stroke, sized to the text beside them". icon Anatomy: "Line: Lucide's own, 2 on its 24 grid". | Four rendered stroke weights on these pages: 1, 1.17–1.33, 1.5 and 2 px. On `/principles/where-the-eye-goes` the Added check (2 px) sits beside text drawn with 1.2 px stems (`eye-change-prefer-added-x2.png`). | Drop the `strokeWidth`/`nonScalingStroke` overrides and use the `precision()` wrapper's defaults. If the 40 px placeholder glyph needs a lighter line, scale the stroke with the glyph. |
| 10 | should | `/principles/concentric-radius`, `BorderCounts`, both sides (`concentric.tsx:109,117`, `<kbd>⌘K</kbd>`). | menu, "Shortcuts are bare symbols": "Geist has no ⌘ ⇧ ⌥ ⌫ ↵ … so here they're Lucide icons". Floor: a text symbol never stands in for an icon. | The ⌘ is drawn by a fallback font at 11 px, in a weight Geist doesn't match. | Use Lucide `Command` at the key's text size, then "K". |
| 11 | should | `/principles/a-shadow-says-how-high`, `ShadowDesks` (`Desks.tsx`, `shadow.module.scss` `.way figcaption[data-verdict]`). | colour-means-one-thing: "Colour alone can't carry a meaning". Every other comparison on the site marks its verdict with ✓/✕ and a word. | Which of the four ways is right is said only by weight and ink ("A lighter surface" at 600 in `ink`, the others `ink-muted`). | Give each caption the same `Verdict` icon as `Compare`: Check for the lighter surface, X for the other three. |
| 12 | should | `/principles/colour-means-one-thing`, `ColourHover`, both sides (`colour.tsx:133-148`). | CLAUDE.md: "focus follows the action". colour-means-one-thing Prefer: "Hover is a neutral fill that only says 'here'". | `role="option"` rows have no `tabIndex` and no key handling, so the listbox can't be reached from the keyboard; `Editor` on the same page has both. The Prefer side shows no hovered row at rest, so on a phone it can't show its point. | Reuse `Editor`'s roving tabindex and arrow keys. Pin one row in hover (`data-pin="hover"`) on each side, so the comparison reads without a pointer. |
| 13 | should | Prefer copy on three pages: "Create your Track account" (`grey/SignUp.tsx`); "Couldn't create your account: …" (`copy/ErrorPlace.tsx`); "Your card expires on 31 Oct. Update it to keep your plan." (`eye.tsx` `NOTICE`, Prefer side). | every-line-does-a-job, "Across all of them": "No *Your*. *Projects* says what *Your projects* says, a word sooner." Rule: "every line names a thing, an action or a state". | On `EyeBanner`'s Prefer side, the note also repeats the expiry shown one line above it ("Expires 10/26", then "expires on 31 Oct"; `eye-billing-prefer-x2.png`). | "Create a Track account"; "Couldn't create the account: the server didn't respond. Try again in a moment."; on Billing, keep "Expires 31 Oct" in `warning` beside the card, with one line under it: "Update the card to keep the Team plan." |
| 14 | should | `/principles/grey-until-it-matters`, `GreyOverdue` Prefer (`grey/Issues.tsx`). | space-groups-by-ratio Prefer: "Subjects share one edge". SKILL: "Things of one kind share one left edge". | Labels start at **12 different x** positions, 532–660 px, at 1280. At 375 the titles shrink to about 70 px ("Keep the c…", `grey-overdue-prefer-375-x2.png`). | Put the labels in a column before the date, as Linear does, or let the title wrap. At ≤640 drop the label chips and keep each label's dot. Also logged under Gaps: GitHub sets labels after the title. |
| 15 | should | Results views: `FacesFind` done step (`faces.module.scss` `.result`, a `fill-control` tile per figure); `ReadingFastest` done step (`reading.module.scss` `.result[data-fastest]`, `accent-soft`). | lightest-boundary Prefer: "One row of figures … one surface and a line between figures". colour-means-one-thing: the accent's "pale tint" marks "what's chosen". | Three medians that are read together sit in three filled tiles. In ReadingFastest the fastest face is marked only by the selection's tint and bold. Shown only after a run (source-read). | Draw lines between the result rows, on no fill. Mark the fastest with the word "Fastest" in `ink` weight 600, not the accent tint. |
| 16 | nit | Readouts and small labels: `demos.module.scss` `.readout` renders at **11.05 px**; the ΔE chips at **10.2 px**; `ReadingAngle` tick labels, the lightness `.ratio` and the `kbd` at 11 px. | reading-text "Interface text": "13–14px; 12px for labels". | Measured in the 375 scan on every route. | Set readouts, ticks and ratios at 12 px; check that the global `code` scaling doesn't shrink them. |
| 17 | nit | `/principles/concentric-radius` and the shadow and reading tables: inline `code` chips in a column. | space-groups-by-ratio: "Things of one kind share one left edge". | The chip's padding moves "space-2" about 4 px right of "2 or 4" in the Inset column (`concentric-table-375.png`). | Give `td > code:first-child` no left padding, or no chip inside tables. |
| 18 | nit | `/principles/who-before-what`, `FacesFind` intro: a button reading "Start". | button and every-line: "A button's verb names its result". | "Start". | "Start the test" (or "Show the first name"). |
| 19 | nit | `/principles/where-the-eye-goes`, `EyeChange` Prefer. | where-the-eye-goes: "The button answers where the click was". | The button's text changes to "Added" with no live region; only the cart's `aria-label` changes. | Wrap "Added" in `role="status"`, or announce "Added to cart" through a polite live region. |
| 20 | nit | `/principles/every-line-does-a-job`, `CopyErrorPlace`, both sides. | every-line: an error says what failed, where it failed. | Both errors render with `role="alert"` on mount, so a screen reader announces two failures when the page loads. | Render the specimens with no `role`, or `role="status"`. |

## Ledger

Pass/fail/n/a for each rule in each governing reference. "src" means checked in source; otherwise it was measured or seen in the shots.

### SKILL floors

- **Text 4.5:1:** fail (#1). Every other text node passes in both themes on all nine routes; teaching specimens excluded.
- **One icon library, one stroke, sized to text:** fail (#5, #9, #10). The library is Lucide throughout; no hand-drawn SVG (the `Vision.tsx` `<svg>` is a filter definition, not an icon).
- **Window holds still:** n/a. These are reading pages and scroll as one.

### Concentric radius

- **Avoid/Prefer, "Don't copy the outer radius":** pass. Prefer measured 20 − 10 = 10.
- **Avoid/Prefer, "The border is part of the gap":** pass. Field 10, inset 3, border 1, key 6, measured.
- **Rule on the page's own chrome:** fail (#4).
- **Formula stops once the inset reaches the radius:** pass. Desk 10 with padding 32, card 10 with padding 12, `.files` 10 with padding 12: each inner shape keeps its own radius.
- **Pairings:**
  - Menu 10/4 → 6: pass (`fileMenu`).
  - Slider 18/8 → 10: pass.
  - Segmented pill-in-pill, inset 2: pass. Thumb 28 in track 32.
  - Switch: pass (src).
  - Card 18/8 → 10, dialog: n/a, not on these routes.
- **Common mistakes:**
  - Uneven inset: pass. Segmented 2 on every side, slider panel 8.
  - One radius for everything: pass.

### A shadow says how high

- **"Shadows on everything" / "Shadow on the menu only":** Prefer pass on shadows, but its icons and anatomy fail (#5, #8).
- **"Same shadow while held" / "Longer drop while held":** pass. Drag tested in source: `HELD` is used only while held.
- **"One dark 24 px drop" / "Hairline, contact and drop":** pass.
- **In the dark, depth is lightness:** pass. The "A lighter surface" choice is right; its verdict signal fails (#11), and its caption fails the floor (#1).
- **Not to group, not to rank:** pass.
- **Not to part a surface from a plain ground:** fail (#7). The demo frames pass: in caption mode `.frame[data-box]` has no shadow.
- **One light, few heights:** pass. Desk hue 75 in light, playbook tokens.
- **Heights table:** pass for menu `shadow-md`; segmented thumb `shadow-xs` measured. The `SliderPanel` `shadow-sm` is a misuse (#7).
- **Glass:** n/a.

### Who, before what

- **"Checkbox replaces the face" / "Checkbox in its own column":** pass at 1280. One lead column at x 356, sender 396, subject 536, times right at 964, checkbox shown on hover (`faces-column-prefer-hover-x2.png`). Fail at 375 (#2).
- **Companies on grey squares, people round:** pass.
- **Seven pastel hues from the address, none on the accent:** pass (src; `hue(person.email)`).
- **Unread dot the one saturated mark:** pass.
- **Faces table:**
  - Comfortable 36: fail. The demos use `Avatar size="sm"` at 28 px; the table says 36 comfortable, 24 compact.
  - Phone, no checkbox: fail (#2).
- **Pictures from elsewhere:** pass. Initials only, nothing fetched.

### Set reading text for the reader

- **Interface vs reading measure, demo:** pass. The readout turns `danger` outside 45–75 characters.
- **"These pages" at 16/26 in a 45em column:** pass. Measured 16/26, 720 px = 45em; a departure the page discloses.
- **Count characters, not ch:** pass. The readout reports both.
- **Size as an angle:** pass (demo).
- **Leading 1.5–1.6 for reading, 1.2–1.45 for interface:** pass. Body 26/16 = 1.63, at the top of the band.
- **Interface text 13–14, labels 12:** fail (#16).
- **Tabular numbers where they stack:** pass. `tabular-nums` on times, readouts and wpm.
- **The best face is the reader's:** pass. The test works; focus moves to each step's control (src).
- **Long reading, not a ladder of weights:** pass.
- **CJK, code, designed letter:** n/a.

### Lightness first, hue last

- **Role table:**
  - Text ≤57% on white: pass. `ink-muted` #5e5e67 is 6.4:1.
  - Control borders 3:1: pass. Field border `line-strong` #868690 is 3.6:1.
  - Accent fill with a white label: pass. #0071e3 with white is 4.7:1.
- **Status colours part by lightness:** pass (demo: ΔE 0.004 against 0.077). The ΔE chip is 10 px (#16).
- **Greys carry a trace of hue:** pass.
- **Theme from three inputs:** pass (demo).
- **Re-map rather than invert:** pass. Dark tokens differ per role.
- **Two standards, one button:** pass. The specimen fails on purpose.
- **Playbook colours table:** pass against `tokens.css`.
- **Colour as data, colour that's given:** n/a. The status cards stay light in dark mode on purpose: they show the light palette.

### Colour means one thing

- **"Accent on every current state" / "Accent only on Publish":** pass. Prefer measured: tab bar ink #18181b, tool tint with accent icon, row `accent-soft` #e8f2ff, segmented thumb white with `shadow-xs`. Publish is the only fill.
- **It still reads without colour:** pass.
- **"Hover in the selection tint" / "Hover in neutral grey":** Prefer pass on colour. Its keyboard and phone reach fail (#12).
- **"Counts in red too" / "Red only for Payment failed":** pass. Counts in ink on grey; the alert has an icon and a word.
- **"Accent on plan details" / "Accent only on Manage billing":** pass. Only the `<a>` is accent.
- **`danger` never "new":** pass across all nine routes; no red counts outside Avoid sides.

### Grey until it matters

- **"Every label in its own colour" / "Labels grey, their colour a dot":** colour pass; alignment fail (#14).
- **"A slogan and a panel of shapes" / "The form, and what joining means":** pass on decoration; copy fail (#13).
- **Status colour comes with its word:** pass ("Overdue · Mon 26 Oct").
- **Regions cost at a glance:** pass. The Prefer sign-up has one region.
- **Content colour gets a small mark:** pass (dots).

### Every line does a job

- **"Three lines before the first field" / "The task, then the field":** pass. "New issue" names the task; the button is "Create issue".
- **"Every row starts 'Manage'" / "The word that differs first":** pass.
- **"An eyebrow" / "Where it sits":** pass ("In progress · ORB-142", muted, sentence case). The page's own "Principle" line above each H1 names its parent section: pass.
- **"Under the terms box" / "With the action that failed":** placement pass; "your" fail (#13); load announcement nit (#20).
- **Specific verbs:** fail, nit (#18).
- **Confirm only what can't be undone:** n/a, no confirmation on these routes.
- **Sentence case:** pass across the demos. The Avoid eyebrows use uppercase on purpose.
- **Words by place:**
  - Heading: pass.
  - Line above a heading: pass.
  - Button: pass, except #18.
  - Field label, a noun: pass.
  - Hint: pass ("At least 10 characters, with a number.", "Only for questions about delivery.").
  - Placeholder: see Gaps.
  - Error: pass.
  - Empty state, toast, confirmation: n/a.
- **Across all:**
  - No we, please, sorry: pass on Prefer sides.
  - No Your: fail (#13).
  - One word for one thing: pass.

### Where the eye goes

- **"Count changes in the corner" / "Button says 'Added'":** pass. The button keeps its 112 px width, measured before and after. Announcement nit (#19).
- **"First screen ends at the band" / "Fold cuts through the plans":** pass.
- **"Promo-style band on top" / "Note beside the card":** placement pass; copy fail (#13).
- **"12 between everything" / "4 within, 20 between":** pass. Measured label to field 5 (4 plus leading), field to next label 21, hint to next 20.
- **"Resources, Solutions, More" / "Invoices and refunds, API":** pass.
- **Squint test:** pass (demo, `inert`).

### The lightest boundary that holds (spacing and boundaries in every demo)

- **"Every section a card" / "Headings and space":** pass. Billing sections are held by headings; the warning note is the one region set apart.
- **"Three equal tiles" / "One row of figures":** fail (#15).
- **"One group boxed" / "All on the page's edge":** pass. Billing Prefer keeps labels at x 672 and values right at 976.
- **"A rule under everything" / "Lines between rows":** pass. Issue and settings rows have lines between them only; no rule under headings.
- **Indent only real hierarchy:** pass.
- **Frames:** pass. The caption is above the stage, with a hairline plate and no box inside a box. The `ShadowDesks` desks are specimens.

### Space groups by ratio

- **"Half above, half below" / "85% above, 15% below":** pass. Page section headings sit closer to their content, seen in shots. The 375 Compare note sits under the control, not under the frame: acceptable.
- **"Stripe per line" / "Stripe per transaction":** n/a.
- **"Subjects start after sender" / "Subjects share one edge":** pass in Faces at 1280; fail for the issue labels (#14).

### Segmented control

- **"Segments fill in place" / "One thumb slides across":** pass (src).
- **"As wide as their words" / "Equal widths":** pass.
- **"Thumb in the accent" / "Raised thumb in greys":** pass.
- **"Two icons and one word" / "All icons, with tooltips":** n/a.
- **Anatomy:** pass on track 32, inset 2, thumb 28. Radius inside a panel fails (#4).
- **Common mistakes:**
  - Labels truncate: fail (#3).
  - A label that repeats the options: pass (`aria-label` only).
  - Segments that do something: pass.
  - Changing main content: pass.
- **Copy:** fail (#3).

### Slider

- **"4 px track" / "The whole 32 px row drags":** pass.
- **Value visible, units attached ("18px", "150%"):** pass.
- **Tabular digits:** pass. Geist Mono shows "0px".
- **Anatomy in a panel, 18/8/10:** pass.
- **Common mistakes:** pass.
- **Label nouns:** pass.

### Switch ("Without colour", "Join them")

- **Applies at once:** pass.
- **Label names the setting, not the state:** pass.
- **Anatomy:** pass (src, `ui/Switch`).
- **On/Off text:** pass, none.

### Checkbox (Faces, Layers, sign-up forms)

- **Whole row clicks:** pass (`<label>`).
- **Off edge 3:1:** pass (`line-strong`).
- **Consent not pre-ticked:** pass on the grey Prefer. `ErrorPlace` is ticked by design: it is the failed-submit state.
- **Labels:** pass.

### Icon

- **Typed as characters:** fail (#5, #10).
- **16 beside 14, 14 in dense rows:** pass for verdicts and rows; fail for the Overlap menu (#8).
- **Lucide's own line:** fail (#9).
- **Icon button named:** pass (theme button "Switch theme", Gaps "Show gaps").
- **Decorative icons `aria-hidden`:** pass.

### Menu (static mock in ShadowOverlap)

- **Anatomy and destructive placement:** fail (#8).
- **Behaviour (hover, keys, motion):** n/a. The mock is static, `role="presentation"`.

### Button

- **Filled, one fill per view:** pass. One primary in each Prefer scene.
- **Press, fades, spinner:** n/a on these routes. They are covered by the Button page.
- **A shadow to lift it:** pass, none.
- **Colour as rank:** pass.
- **Disabled with no reason:** pass. "Glance at the list" is disabled only during the 1.2 s glance, which explains itself.

### Input (forms in Grey, Copy, Eye)

- **"Checks on every keystroke" / "Checks when focus leaves":** n/a. No validation in these demos.
- **"Placeholder as label" / "Label above, example inside":** pass.
- **"One faint line at the top" / "Message under each field":** pass (`ErrorPlace` Prefer, beside the action).
- **"Every field full width" / "Sized to its digits":** n/a. No fixed-length fields.
- **Common mistakes:** pass.

### Tabs (Colour Editor)

- **Weight 500, colour only:** pass.
- **Current tab in ink, not the accent:** pass (ink bar #18181b).
- **"Count in parentheses" / "Count in a quiet chip":** pass.
- **Wraps onto more rows:** pass (one row).
- **Common mistakes:** pass.

### Toolbar (Colour Editor)

- **"Current tool filled solid" / "Current tool tinted":** pass.
- **Tip with its shortcut:** n/a (the shot can't show it; src uses `Toolbar.Tool label`).
- **Borders around groups:** pass.
- **Two icon sets:** pass.
- **Uneven inset:** pass.

### Badge (counts, labels)

- **"Solid fills" / "Soft tints":** pass.
- **"Dot only" / "Dot and word":** pass.
- **"Dot on every badge" / "Dot only on Online":** n/a. Grey's label dots are content colour; see Gaps.
- **Red for "new":** pass.
- **Truncated badges:** pass. Labels never truncate; the titles do (#14).

### System: reading page and Playbook look

- **Reading page:**
  - Scrolls as one: pass.
  - Leads with type: pass.
  - One 720 px column for prose and demos: pass. Figures and tables measured 280–1000.
- **Playbook look tokens:**
  - `--bg` #f7f7f8, `--surface`, `--ink`, `--ink-muted`, `--line-strong`, `--accent` #0071e3, `--danger`, `--warning`, `--success`: pass. Read from computed styles in both themes.
  - Radius tokens: pass.
  - `--shadow-*`: pass; usage fails at #7.

### Owner's rules (CLAUDE.md)

- **One grid / one left edge:** fail (#14, #17). Otherwise pass: headings, prose, figures and tables start at x 280 on every route.
- **Trailing meta right-aligned in one column:** pass. Times at 964, invoices and plan prices at 976, due dates at 964.
- **Lightest boundary that holds:** fail (#15). Otherwise pass.
- **Empty states name the next step:** pass. Each test's intro names its action ("Start", "Glance at the list", "Which reads best to you?"), wording nit at #18.
- **Focus follows the action:** fail (#6, #12). Pass in `FacesDots` (focus back to "Another glance") and `ReadingFastest` (autoFocus on each step).

## Gaps in the playbook

1. **A themed specimen inside a page of the other theme.** No rule says which tokens the chrome around a pinned- or flipped-theme stage takes. That gap produced #1. Suggested rule: the theme switch repaints the stage only, and its caption stays in the page's ink.
2. **A pill inside a non-pill container.** The concentric pairings list sliders in an 18 px panel, but not the segmented control that every Tweak panel also holds (#4). Either rule that a pill nested within a corner's reach takes the formula's radius, or that a pill never sits in a panel's corner.
3. **Placeholder example contradicts itself.** "Words by place" allows a placeholder "only when the format isn't obvious", then gives *ana@studio.com*, an email, as its example. The grey Prefer form follows the example.
4. **Labels after a title against one left edge.** space-groups-by-ratio asks for one left edge per kind. GitHub sets labels right after the title, Linear in a column at the row's end. The pages don't say which an issue list follows (#14).
5. **Badge "dot only on Online" against Grey's "their colour a dot".** One forbids a dot on every badge; the other puts a colour dot on every label. They mean different things (status against content colour), and neither page says so.
6. **Hover-only demonstrations on touch.** Several Prefer sides show their point only under a pointer (`ColourHover`, the Faces checkbox column). No rule says a specimen must show its state at rest for phone readers.
7. **Line insets in lists.** lightest-boundary's Prefer starts lines at the text, as iOS does; the issue and settings lists here draw full-width lines. Table says full width. No rule says which a non-table list takes.
8. **Avatar size.** The Faces table says 36 px comfortable, while every Faces demo uses 28 px rows of avatars. Either the table or the demos are off.
