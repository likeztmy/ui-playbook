# Rule review 2: principles, part 2

Routes: `/principles/lightness-first`, `/principles/never-too-busy-to-listen`, `/principles/nothing-shifts`,
`/principles/reading-text`, `/principles/space-groups-by-ratio`, `/principles/the-faster-way`,
`/principles/the-lightest-boundary-that-holds`, `/principles/where-the-eye-goes`, `/principles/who-before-what`.

Method: `.claude/agents/ui-rule-review.md`. Decisions in `../decisions.md` are binding. Reviewed 2026-11-02 against the
dev server through `pnpm shoot` and a Playwright script using the project's own `@playwright/test` (no server started or
stopped). The machine went `busy` twice; shooting paused before each route until it read `ok` or a minute had passed.

Shots: `shots/review2/principles-2/<route>-<1280|375>-<light|dark>.png` (36 full-page shots, all looked at whole, long
ones in 1150px slices). Interaction and zoom shots are the `x-*.png` files in the same folder.

## 1. Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | `/principles/space-groups-by-ratio`, first comparison, **Prefer** side ("85% above, 15% below"), and the "More space doesn't fix it" stage. `src/demos/ratio.tsx:45-48`, `src/demos/demos.module.scss:1963` (`.ratRow` is `display: flex; gap: 8`) | principle-space-groups-by-ratio: "Subjects share one left edge" (C18: labels in a list on one left edge) | Subject left edges on the Prefer side at 1280: 754, 753, 787, 766, 776, 751px, six edges for six rows. The page's own third demo calls this layout the Avoid. `space-groups-by-ratio-1280-light.png`, `x-compare-375-key.png` | Give `.ratRow` the RatioEdge grid: a sender column as wide as the longest sender, then the subject, then the time. |
| must | Every Tweak demo below 720px: lightness-first (4), reading-text (3), space-groups-by-ratio (1), where-the-eye-goes (1), who-before-what (1). `src/demos/shell.module.scss:491-493` | principle-space-groups-by-ratio: "A gap only separates when it's clearly bigger than the gaps around it" | At 375 the dial panel sits 48–60px below the stage it controls and 32px above the next paragraph (lightness-first: 60/32, 48/32, 48/32, 48/32). The dials read as part of the prose below. `lightness-first-375-light.png`, `reading-text-375-dark.png`, `who-before-what-375-dark.png` | Scope the `margin-top: calc(var(--caption) + 8px)` rule to `(min-width: 721px)`, where the panel sits beside the stage. Below that, the panel follows the stage at the grid's 16px gap. |
| should | `/principles/never-too-busy-to-listen` at 375 (all three comparisons). `src/demos/frame/Compare.tsx:44` | Owner's rule: "layout changes re-home context rather than hiding it" | At 1280 each caption carries the `0.1×` slow-motion switch; at 375 it is gone, because toggle mode passes `measuring` to `Frame` but not `slowing`. `never-too-busy-to-listen-375-dark.png` | Pass `{...slowing}` to the toggled `Frame` as well. |
| should | `/principles/never-too-busy-to-listen`: the hand note "three clicks, fast" (`src/components/note/Note.astro`, `note.ts`). It is also used on how-waiting-feels and attention-wears-off | component-icon floor: no SVG drawn by hand. icon.mdx:41: the home page "carries the one exemption" (C7) | Rough.js draws an arrow path and a RoughNotation circle (`.note-arrows path` present). The note is set in accent blue `rgb(0,102,204)`, which colour-means-one-thing reserves for links. `x-note-1280.png` | Either widen the exemption on the Icon page to name these notes (owner's call, see Gaps), or drop the drawn arrow and circle here. Set the note in `ink-muted`, not accent. |
| should | `/principles/reading-text`, "Leading is for the trip back" stage. `src/demos/reading/reading.module.scss:60` (`.rows` border-top), `:68` (every `.row` border-bottom) | principle-the-lightest-boundary-that-holds: "Lines are for rows"; a line "never [splits] a heading from what it heads". component-table: "none after the last" | There is a line above the first row, between the letter and the list, and a line under the last row. `reading-text-1280-light.png` slice 3; `reading-text-375-dark.png` | Remove the `.rows` border-top. Use `.row + .row { border-top }` in place of the border-bottom on every row. |
| should | Prose tables: lightness-first "Lightness by role" (Decorative lines row: two empty cells); reading-text "Interface text" (Numbers / Reading text) and "The playbook's type" (`body` / Measure); who-before-what "The playbook's faces" (seven empty cells) | C41 / component-table Copy: "Empty cells show an en dash, –, not N/A or nothing" | The cells render blank at both widths. `lightness-first-1280-light.png` slice 1; `reading-text-1280-light.png` slice 3; `who-before-what-1280-light.png` slice 3 | Where nothing applies, write `–`. In the faces table, where a blank means "same as Comfortable", write the value or "same". A blank can't tell those two apart. |
| should | `/principles/nothing-shifts` demo notes: `scrollbar-gutter: stable`, `overflow-anchor: none`, `size-adjust`. `src/styles/_reading.scss:188` (`code { font-size: 0.85em }`) inside `.note` at 13px | system-work-tool: "Labels and meta: 12px; nothing smaller in a row someone reads". C27 implies a 12px floor | Measured: 11.05px for all three code chips (`getComputedStyle`), light and dark. | Floor the chip: `font-size: max(12px, 0.85em)`. Or set code in a note at 12px. |
| should | `/principles/the-faster-way` Prefer: the key caps shown while Option is held. `src/demos/demos.module.scss:2089` (`.fkKey { font-size: 10px }`) | system-work-tool: 12px floor; component-tooltip Anatomy: key text 12 | The caps E, S and I render at 10px. `x-faster-prefer-held.png` | Set them at 12px and 16px tall. They are absolutely placed, so nothing shifts. |
| should | `/principles/nothing-shifts`, "Bold is wider", both sides. `src/demos/demos.module.scss:1792` (`.boldNav { flex-wrap: wrap }`) | component-tabs: "Views of one thing, one row" | At 1280 and 375 the project nav wraps, so Settings (and Releases at 375) drop to a second line. A bold change can then move a link between lines, which isn't the shift the caption describes. `nothing-shifts-1280-light.png` slice 1; `nothing-shifts-375-light.png` | `flex-wrap: nowrap` with `overflow-x: auto`, or drop one link so the row fits the half-column stage. |
| should | `/principles/where-the-eye-goes`, first comparison, both sides: the cart button. `src/demos/eye.tsx:35` | component-button: "An icon-only button always has a tooltip with the same words as its aria-label" | Ghost icon button `aria-label="Cart, 0 items"` with no `Tip` (grep: no `<Tip` in eye.tsx). | Wrap it in `<Tip label="Cart">`. |
| should | `/principles/who-before-what`, "Checkbox in its own column" (Prefer), with a row ticked. `src/demos/faces/faces.module.scss` (no selected style) | component-table Anatomy: "Hover · selected: fill-hover · accent-soft"; the page itself: the accent's "pale tint marks the chosen row" | Ticking Sam's row changes only the checkbox; the row keeps the surface. `x-faces-prefer-selecting.png` | Give a checked row `accent-soft`, as Post does. |
| should | `/principles/space-groups-by-ratio`, "A fill beats any gap" (stripe per transaction) | C2: "Each page names the other" (stripes per multi-line record vs Table's lines, not stripes) | Neither the mdx nor the demo note links Table or says why stripes are allowed here. grep `stripe` in `space-groups-by-ratio.mdx`: none. | Add one line after the demo: a list whose records span two lines may stripe per record; a table of one-line rows takes lines ([Table](/components/table)). |
| nit | `/principles/space-groups-by-ratio`, "More space doesn't fix it", gaps overlay (`src/demos/frame/Measured.tsx`) | Owner's rule, generated visuals: no overlaps | The "15 · 1.0×" pills overlap the time column by 24–32 × 2–3px on every row pair at 375 and 1280. `x-ratio-scale-375.png`; `space-groups-by-ratio-375-light.png` | Inset the pill from the band's right edge by the time column's width, or centre it in the band. |
| nit | `/principles/where-the-eye-goes`, "Promo-style band on top" (Avoid). `src/demos/eye.tsx:173` | component-icon: "An icon button with no name"; an Avoid breaks only its own rule | The band's dismiss X is a bare `<X aria-label="Dismiss">`: not a button, not focusable, does nothing. That is beyond the band-look mistake this side shows. | Make it a ghost icon `Button` with `aria-label="Dismiss"` and a tooltip. |
| nit | `/principles/lightness-first` in dark: "Status colours part by lightness" and "Greys carry a trace of hue" | C15: a specimen in the other theme sets the theme on its stage only | The status lists and the tint preview stay light while their stage turns dark. A light specimen ends up inside a dark stage. `lightness-first-1280-dark.png` slice 2 | Pin those stages with `defaultTheme="light"` (as the light/dark button demo does), or derive the specimen from the stage's theme. |

Checked and clean: text contrast on all nine routes in both themes. A canvas walk of every text node found failures only
in deliberate specimens: the HSL "Aa" swatches, the 62% "Send" in "Two standards", carousel captions whose photo
background the probe can't read (they sit on a dark scrim), and the Avoid promo band. No page scrolls sideways at 375.
Prose tables fit at 343px. Hydration and console were clean.

## 2. Ledger

pass = holds on every route where it applies. fail = a finding above. n/a = why.

### Floors (SKILL.md)
- Text holds 4.5:1: **pass**. See the probe note above; muted captions, table headers, kind line, readouts and verdicts all pass in both themes.
- Icons from one library, at one stroke, no symbols, no hand-drawn SVG: **fail**: the Note's Rough.js arrow and circle (never-too-busy). Lucide everywhere else; verdict marks are `CheckIcon`/`CrossIcon` from `ui/icons`.
- App window holds still; panes scroll: **n/a**: these are reading pages, which scroll as one. In-stage scroll panes (members, thread) have `tabindex="0"` and a name.

### principle-lightness-first (route)
- Lightness by role table (text 4.5, controls 3:1, fill with white label): **pass** on the page's own colours (probe).
- Eight hues demo shows the HSL mistake and the OKLCH fix: **pass**. The failing swatches are the point; numbers below 4.5 are red *and* written.
- A scale bends / greys carry a trace / a theme is three inputs (Tweaks): **pass** at 1280; at 375 **fail** (panel gap, must #2).
- Status colours part by lightness, each with its word: **pass**.
- Re-map rather than invert (button on light and dark): **pass**.
- Two standards, one button: **pass**. The red readout marks the failing standard, and the text says which.
- "The playbook's colours" table: **pass**. Numbers left-aligned; see Gaps.
- When it doesn't apply: **n/a**: text only.

### principle-never-too-busy-to-listen (route)
- Avoid: Drops clicks mid-slide / Prefer: Each click moves the target: **pass**. Three fast clicks: Avoid "Photo 2 of 5", Prefer "Photo 4 of 5".
- Avoid: Two keyframe animations / Prefer: One reversible transition: **pass**. The sheet demo has `role="dialog"`, a named close button with a tooltip, and first-field focus (`Sheet.tsx:45-50`).
- Avoid: Timed ease from rest / Prefer: Spring carries the velocity: **pass**. The trace is a canvas, `aria-hidden`, with the prose explaining it.
- Slow-motion tool available on motion comparisons: **fail** at 375 (should #3).
- Reduced motion: **n/a**: not testable from a shot; carousel and sheet use the shared tokens.

### principle-nothing-shifts (route)
- Avoid: Pages land above Recent / Prefer: below Recent: **pass**. After typing "but", Prefer keeps Buttons under Recent and adds Pages below (`x-shift-search-prefer.png`).
- Avoid: Bold widens the link / Prefer: Width reserved for bold: **pass** for width. The row wraps (should #9).
- Avoid: Gutter comes and goes / Prefer: kept: **pass**. "an" moves Owner 561→573 on the Avoid side, 929→929 on the Prefer side.
- Avoid: Scroll anchoring off / Prefer: on: **pass**. Replay works; the thread is `role="log"`, focusable, named.
- Avoid: Plain Arial fallback / Prefer: Arial sized to Geist: **pass**.
- Measure it (shift counter under each demo): **pass**: "0 shifts · 0.0000" in mono, right-aligned.

### principle-reading-text (route, and every route as a reading page)
- One 45em column (720px) shared by prose, demos and tables: **pass**. Every h1, p, h2, ul, table and figure on all nine routes starts at x=280 at 1280, 720 wide.
- Reading text 16/26: **pass**. Body 16px, 26px leading.
- Below 640px a table scrolls inside its box: **pass**. All prose tables are 343/343 at 375, so none needs to scroll.
- List markers inside the 16px gutter: **pass** at 375 (bullet x≈24).
- Comparison switch reads Avoid / Prefer, verdict in the caption (C5): **pass** at 375 on every comparison.
- Count characters, not `ch` / measure demo, angle demo, leading demo, fastest face: **pass** at 1280; at 375 **fail** (panel gap, must #2). The leading demo's list lines **fail** (should #5).
- Interface-text table (13–14px rows, 12px labels): **fail** in two places: code chips at 11.05px (should #7) and keycaps at 10px (should #8).

### principle-space-groups-by-ratio (route)
- Avoid: Half above, half below / Prefer: 85% above, 15% below: the ratio itself **pass**; the Prefer's subject edge **fail** (must #1).
- More space doesn't fix it (Tweak): **pass** for the ratio; overlay overlap nit #13; panel gap at 375 (must #2).
- Avoid: Stripe per line / Prefer: Stripe per transaction: **pass** under C2; cross-reference **fail** (should #12).
- Avoid: Subjects start after sender / Prefer: share one edge: **pass**.
- Give it more space on the side it doesn't belong to: **pass** in page chrome. Caption→stage 8, stage→note 12, note→next heading ≥32.

### principle-the-faster-way (route)
- Avoid: Keys one tooltip at a time / Prefer: Modifier shows every key: **pass**. The tooltip reads "Archive E" on hover; holding Option shows all three caps with no layout shift (`x-faster-avoid-hover.png`, `x-faster-prefer-held.png`). Keycap size **fail** (should #8).
- After a pointer command, focus returns to the list; when the list empties, focus stays on it: **pass** (C39).
- Empty state names the next step: **pass**: "All done." with **Restore inbox** (`x-faster-prefer-empty.png`).
- Touch first: **pass**. The hint is hidden under `(hover: none) and (pointer: coarse)`.

### principle-the-lightest-boundary-that-holds (route, and every route's demos)
- Avoid: Every section a card / Prefer: Headings and space; one box: **pass**. The section action (Invite) sits on the heading row.
- Avoid: Three equal tiles / Prefer: One row of figures: **pass**. The separators are `line`, inside a `line-strong` edge.
- Avoid: One group boxed / Prefer: All on the page's edge: **pass**. One left edge and one right edge.
- Avoid: A rule under everything / Prefer: Lines between rows, lighter than the edge: **pass**. Lines start at the text (C21), `line` inside `line-strong`.
- Never a box per section, never a box inside a box (demos, C3): **pass**. Each stage is a figure; the UI inside holds one box each.
- No header or footer bands: **pass**, read loosely. The faster demo's hint row is a status line under a hairline, not a filled band.
- Lines split repeated rows only: **fail** in the reading-text leading demo (should #5).
- Section actions on the heading row: **pass**.

### principle-where-the-eye-goes (route)
- Avoid: Count changes in the corner / Prefer: Button says "Added": **pass**. The button stays 112px before and after; the cart badge shows 1 (`x-eye-prefer-added.png`). Cart tooltip **fail** (should #10).
- Avoid: First screen ends at the band / Prefer: Fold cuts through the plans: **pass**.
- Avoid: Promo-style band / Prefer: Note beside the card: **pass** for the rule; dismiss X nit #14. "Expires 31 Oct" in warning colour carries its words.
- Avoid: 12 between everything / Prefer: 4 within, 20 between: **pass**.
- Avoid: Resources, Solutions, More / Prefer: Invoices and refunds, API: **pass**.
- Check it yourself (squint Tweak): **pass** at 1280; panel gap at 375 (must #2).

### principle-who-before-what (route)
- Find a message by who sent it: **pass**. Start moves focus to "Show the list"; the caption reads "1 of 15 · Coloured initials" (`x-faces-find-started.png`).
- Avoid: Checkbox replaces the face / Prefer: Checkbox in its own column: **pass**. The checkbox column appears on hover and while selecting, and no face gives way (`x-faces-prefer-selecting.png`). Selected tint **fail** (should #11).
- Identity in pastel, state in colour (Tweak): **pass**. The unread dot is the one saturated mark; company faces are grey squares. Panel gap at 375 (must #2).
- Faces 36 comfortable / 28 compact (C22): **pass**. 28px rows on desktop, 36px on phone (`faces.module.scss:33,170`).
- Faces table: **fail** for empty cells (should #6).

### principle-every-line-does-a-job
- Avoid/Prefer: Three lines before the first field: **pass**. No demo opens with lines above its first field.
- Avoid/Prefer: Every row starts "Manage": **pass**. List rows lead with the differing word.
- Avoid/Prefer: An eyebrow / Where it sits (C4): **pass**. The kind line "Principle" is sentence case, `ink-muted`, text size.
- Avoid/Prefer: Error under the terms box: **n/a**: no form submits on these routes.
- Buttons name their result: **pass**: Save changes, Delete project, Update card, Add to cart, Restore inbox, Start the test, Show the list, Edit profile, Open history, Replay, Invite.
- No we, please, sorry, oops, exclamation marks; no "Your": **pass** in UI strings. ("Your system's serif" is a font label describing the reader's own font, not chrome.)
- Sentence case: **pass**.
- Empty state: what goes here and the action: **pass** (faster demo).

### principle-grey-until-it-matters
- Avoid/Prefer: Every label in its own colour: **pass**. Chrome is grey; hue goes to verdicts, the accent and status.
- Avoid/Prefer: A slogan and a panel of shapes: **n/a**: no decorative panels.
- No tinted panels in chrome: **pass**. Stages are surface plus a hairline.

### principle-colour-means-one-thing
- Avoid/Prefer: Accent on every current state: **pass**. Segments are raised, not filled; the current row is `accent-soft`.
- Avoid/Prefer: Hover in the selection tint: **pass**. Hover is `fill-hover` (Help nav, Recent rows).
- Avoid/Prefer: Counts in red: **pass**. The cart count is ink.
- Avoid/Prefer: Accent text is a link: **fail**: the hand note is set in accent blue (should #4).
- Measurement overlay in solid accent: no rule, see Gaps.

### principle-concentric-radius
- Avoid/Prefer: Don't copy the outer radius: **pass**. Tweak panel 18, inset 8, slider rows 10.
- Avoid/Prefer: The border is part of the gap: **n/a**: no embedded keys in fields here.
- Stage 18 with 24 padding: the inset exceeds the radius, so inner UI keeps its own radius: **pass**.
- C16, pill in a non-pill panel takes radius minus inset: **pass**. The Accent's/Opposite segmented control in the Tint panel is 10.
- Common mistakes (uneven inset, one radius for everything): **pass**.

### principle-a-shadow-says-how-high
- Avoid/Prefer: Shadows on everything: **pass**. Stages, panels, tables and rows carry no shadow (`.frame[data-box]` sets `box-shadow: none`).
- Avoid/Prefer: Same shadow while held: **n/a**: nothing is dragged.
- Avoid/Prefer: One dark 24px drop: **n/a**.
- In the dark, depth is lightness: **pass**. Raised panels are lighter in dark shots.
- Tooltip and popups over content: **pass** (tooltip shot).

### principle-attention-wears-off-waiting-doesnt
- Avoid/Prefer: 450ms flight, press waits: **pass**. Faster demo: E repeated six times empties the list at once; nothing blocks.
- Avoid/Prefer: Confetti on every tick: **n/a**.
- Frequent motion ≤120ms and never blocking: **pass** for segment and switch (shared tokens). Carousels follow their own page's demo.

### principle-how-waiting-feels
- All rules: **n/a**: no network waits on these routes. The Add to cart confirmation is instant.

### principle-hover-forgives
- All rules: **n/a**: no submenus. Tooltips use `TipGroup` (shared).

### principle-error-timing
- All rules: **n/a**: no field validates. The eye form and Filter members don't check input.

### component-button
- Height 32 / 24 / 40, pill, 12 padding, label 14/500: **pass** (Add to cart, Save changes, Start the test). Small secondaries (Invite, Update card, Edit profile) are `size="sm"` 24.
- An icon-only button always has a tooltip: **fail**: the eye cart (should #10). The Avoid promo X isn't a button (nit #14). Frame tools, carousel, sheet close and faster tools all pass.
- Busy state: **n/a**.
- Common mistakes (shadow, colour as rank, disabled without reason): **pass**.
- Copy (verb names result, sentence case): **pass**.

### component-icon
- 16 beside 14px text, Lucide stroke (C6): **pass** (faster toolbar, search, cart, card icon).
- Colour: `currentColor`, muted at rest: **pass**.
- Common mistakes: a symbol or emoji: **pass**. Two libraries: **pass**. Unnamed icon button: **fail** (should #10, nit #14). 24px beside 14px: **pass**. Bigger icon for a bigger target: **pass**.
- Hand-drawn: **fail** (should #4).

### component-tooltip
- Ink on bg, 12/500, radius 6, name then key dimmed: **pass**: "Archive E" (`x-faster-avoid-hover.png`).
- Nothing clickable, no sentences, not on labelled buttons: **pass**.

### component-segmented-control
- Track pill, inset 2, raised thumb, 13/500 labels: **pass**. Compare switch, Typical/Deutan/Protan, Phone/Laptop/Monitor, Interface/Reading, Billing/Pricing.
- Radio-group keyboard (Tab to the chosen segment, arrows choose): **pass**. ArrowRight moved Avoid→Prefer, the caption updated, and a focus-visible ring showed (`x-compare-375-key.png`).
- Common mistakes: label repeating options: **pass** (`aria-label="Compare"`). Six segments on narrow: **pass**. Segments that act: **pass**. Changing the page's main content: **pass** under C5 (it switches one figure).
- Copy (nouns, similar length): **pass**. "Accent's / Opposite" is borderline but short.

### component-slider
- Row 32, radius 10 in an 18 panel, label 13/500 muted, value mono right: **pass** (measured).
- Handle 3×16 ink: present, opacity 0 at rest (component's own choice, not this route's).
- No visible value / precise number / steps finer than pixels: **pass**.
- Copy (property noun, value with unit): **pass**: Hue 256°, Size 15px, Distance 50cm, Line height 150%, Blur 4px. "Contrast 30" and "Tint 6" are bare numbers whose unit isn't obvious; see Gaps.

### component-switch
- Track 32×20, knob 16, off `line-strong`, on accent: **pass** ("Without colour", "Join them").
- Label names the setting, never the state: **pass**.
- Labels left, switches in a right column: **n/a**: a single switch under a stage, not a settings list.

### component-checkbox
- 16 box, radius 4, accent fill on, 12px check: **pass** (`x-faces-prefer-selecting.png`).
- Named: **pass** (`aria-label="Select …"`).
- Common mistakes: **pass**.

### component-input
- 32 tall, radius 10, `line-strong` edge, label 12/500 muted, 4 apart: **pass** (eye form Prefer, Filter members, boundary General).
- Focus recolours the edge to accent: **pass** (`x-shift-search-prefer.png`).
- Placeholder is an example, not an instruction (C17): **pass** under Combobox Copy, see Gaps. "Search docs" names what can be typed.
- Label is a noun: "Filter members" is a verb phrase. **nit-level pass**, see Gaps.

### component-combobox (Search docs in nothing-shifts)
- Opening empty: **pass**. Recent shows before typing.
- Field anatomy: **pass**.
- Keep the list's own order: the demo's point. **pass** on the Prefer side.

### component-table (prose tables, and lists in stages)
- Lighter prose style (C25): **pass**.
- Divider between rows, none after the last: **fail** in the reading-text leading demo (should #5).
- Numbers right-aligned: **n/a** for prose tables of mixed text; see Gaps. Stage lists right-align times, amounts and roles: **pass**.
- Hover · selected: **fail**: the faces demo has no selected tint (should #11).
- Empty cells en dash (C41): **fail** (should #6).
- Status as colour alone: **pass**.

### component-tabs (the "Bold is wider" project nav)
- One row: **fail** (should #9).
- Current tab changes colour and weight without shifting: **pass** on the Prefer side. The Avoid side breaks it on purpose.

### component-sheet (Keyframes demo)
- Title, close as an icon with its label, focus to the first field: **pass** (`Sheet.tsx`).
- Panel radius, shadow and height: **pass**, scaled to the stage.

### component-card (Prev/Next and plan cards)
- Prev/Next pair as units, `radius-xl`-like corner, no buttons inside: **pass**.
- Fold plan card cut by the fold: the demo's point. **pass**.

### component-badge
- Cart count: ink, a number, no colour: **pass**.

### system-work-tool (tool-like stage contents: faster inbox, boundary settings, members, help nav)
- 14px text, 13px dense rows, 12px labels and nothing smaller: **fail** for the keycaps at 10px (should #8). Everything else is 12–14.
- 32 controls, 24 in toolbars: **pass**.
- Radius 4–10 on fields and panels: **pass**.
- One accent: **pass**.
- Common mistakes: rows in 10–11px grey **pass**; brand panel **pass**; tagline **pass**; large radii on dense parts **pass**; two control heights in a row **pass**.

### system-consumer-app (shop and pricing stages)
- **n/a** for sizes: the stages are miniatures on a reading page. Colour in content (product image placeholder) **pass**.

### Owner's rules (CLAUDE.md, Product and UI judgment)
- One grid / one left edge: **pass** in page chrome (x=280 for everything at 1280, 16px gutter at 375). **fail** inside the ratio demos (must #1).
- Trailing meta in one right-aligned column: **pass**: times, roles, amounts, slider values, shift counters.
- The lightest boundary that holds: **pass** in chrome; **fail** for the leading list lines (should #5).
- Empty states name the next step: **pass** (faster "All done." + Restore inbox).
- Focus follows the action: **pass**: faster (to the list), the find test (to Show the list), the Compare switch (stays on the segment). Never `<body>` in any flow tried.
- Layout changes re-home context rather than hide it: **fail** for the 0.1× tool at 375 (should #3). The eye demo's nav hides at 375, which is the demo's own responsive design.
- Accept by hand with real pointer events: done with Playwright clicks and hover. Frame time was not measured (C43 puts it out of scope).

## 3. Gaps in the playbook

1. **C5 says 768px; the build and the page say 640px.** `decisions.md` C5: "Below 768px a comparison's switch reads Avoid / Prefer". `src/demos/box.ts:30` switches at `max-width: 640px`, and reading-text.mdx:79 says "Below 640px". At 700px the pair sits side by side at 318px each and reads fine (`x-compare-700.png`). One of the three should change to match the others.
2. **C17 against Combobox Copy.** C17: "A placeholder shows only a format example." Combobox Copy: "Placeholder: what you can type… **Search cities or countries**." A search field's placeholder ("Search docs") follows the second and breaks the first, read literally. C17 needs an exception for search and combobox fields.
3. **The icon floor's "one exemption" against the Note component.** icon.mdx:41 and C7 exempt only the home hero's hand-drawn notes. The same Note (Rough.js arrow and circle, accent ink) runs on three principle pages. Either the exemption names Note wherever it appears (and says whether accent ink is allowed for annotation), or the notes leave these pages.
4. **Numbers in prose tables.** Table's "numbers right-aligned" and C25's "lighter prose style" don't say whether prose tables right-align figures. The lightness-first colours table ("L 21%, 17.7:1") and the faces table ("36px") are left-aligned.
5. **Measurement overlays.** The Gaps tool draws solid accent pills over the content (`Measured.tsx`). No rule covers instrument overlays. They break "one solid accent" if read as UI, and no page says they are exempt.
6. **Bare slider values.** Slider Copy allows a bare number "when the unit is obvious from the label". "Contrast 30" and "Tint 6" (lightness-first) have no unit an outsider can infer. The rule doesn't say what to do with a unitless scale: show its range ("30 / 100"), or name it.
7. **Labels that are verbs.** Input Copy says a label is a noun. "Filter members" is the common label for a filter field in shipping tools. A filter or search field may need its own line in Input or Combobox.
