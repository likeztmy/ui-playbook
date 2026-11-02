# Rule review: components B

Date: 2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Server: http://localhost:4321 (dev).

Routes: `/components/combobox`, `/checkbox`, `/radio`, `/switch`, `/tabs`, `/slider`, `/segmented-control`, `/card`, `/badge`, `/table`, `/toast`. Each is a reading page, so the system is the reading page (`principle-reading-text`, "These pages" row) in the playbook look. Every live demo on each page was reviewed as a product screen against its component page.

Shots: `shots/review/components-b/<route>-{1280,375}-{light,dark}.png` (44 full-page shots). Close-ups and measurements were taken with `pnpm shoot --scale 2 --selector … --eval …`. The contrast, truncation and overflow probe (every visible text node, composited over its real background) ran on all 44 route × width × theme combinations. The Astro dev toolbar that floats in every shot is dev-only and is ignored.

Count: **2 must, 7 should, 8 nit.**

## 1. Findings

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| 1 | must | `/components/segmented-control`, Details › "Segments share one width", **Prefer** side (`src/demos/segmented.tsx:127-131`, `UNEVEN` labels) | component-segmented-control: "Equal widths… choose words of similar length"; "Past five, labels truncate" | The Prefer control has three 100px segments. "Assigned to me" needs 118px and shows as "Assigned t…" at 1280 and 375, in both themes. Shot: `scratchpad/cb/seg-equal.png`. Probe: `text-overflow` hit at y=1592 (1280) and y=1912 (375). | Give the Prefer side words of similar length, e.g. All / Mine / In review, or keep the Avoid side's words and show that equal widths need shorter words. The page's own example must not truncate. |
| 2 | must | Every Compare demo at ≤ the narrow breakpoint (`src/demos/shell.tsx:330-353`, the toggled branch of `Compare`). Seen on combobox, checkbox, radio, slider, segmented-control, card and toast at 375 | component-segmented-control Copy: "Segments: nouns, one word where possible, of similar length"; Common mistakes: "labels truncate" | At 375 the before/after switch is a SegmentedControl labelled with the verdict phrases, and 16 of them truncate: "Loose match, countrie…", "Repeats query, names…", "Only the 16 px box cli…", "Parent dashed if some…", "Standard already cho…", "Three buttons, three…", "The whole 32 px row…", "Eases 400 ms behind…", "Follows the pointer…", "One thumb slides acro…", "Assigned t…", "Static card lifts on hov…", "Up to 1.05, heavy shad…", "30 ms apart, capped a…", "Three at most, oldest…", "Two icons and one wo…". The frame caption above shows only "After" or "Before", so the phrase is cut short in the one place it is still shown. Probe JSON: `scratchpad/cb/probe-<route>-375-*.json`. | In the narrow layout, label the segments **Before** / **After** and put the verdict phrase (beforeLabel/afterLabel) in the frame caption, where it can wrap. The band layout already does this. |
| 3 | should | `/components/segmented-control`, Anatomy "At 2×" specimen, 375 | component-segmented-control: "Past five, labels truncate and targets shrink" (truncation is the named failure) | At 375 the 2× control reads "B…  List  Ti…". Probe: Board and Timeline truncated at y=3929, both themes. Crop: `scratchpad/cb/s2.png`. | At narrow widths, scale the specimen to fit (`zoom`/`scale` down to the column) or drop to 1.5×; keep the three words whole. |
| 4 | should | `/components/toast`, live "Files" demo and "Deletes, offers Undo" Prefer, 375 | component-toast Copy: "Say what happened, past tense, with its object"; Anatomy: "Width: fits the text, 320 to 440" | After Delete at 375, the toast is 263px wide, under the 320 minimum, and the title truncates to "Deleted “Q4 roadm…”". The object, which is the point of the message, is lost. Title scrollWidth is 162 against 133 visible. Shot: `scratchpad/cb/toast-undo-375.png`. | Let the toast take the stage's full width at narrow sizes, or shorten the file names in the demo, so the object stays whole. If the 320 minimum can't hold on a phone, state the phone rule on the page. |
| 5 | should | `/components/slider`, live "Properties" panel, "The whole 32 px row drags" Prefer, Variants "In a panel" (`src/demos/slider.tsx`) | component-slider Copy: "Value: the number with its unit attached: 64%, 12px" | The Radius row reads "Radius 12" in every place it appears. The page's own copy example for this exact property is "12px". Opacity correctly reads "64%". | Render the Radius value as `12px`. |
| 6 | should | `/components/table`, live "Files" demo and every Prefer table in Details, 375 (`src/demos/table.tsx:86-92`, no `stickyFirst`) | component-table Prefer "Name column pinned": "The name column stays pinned… while the rest scroll under it." | At 375 each table is 481px wide inside a 311px scroller. The live table and the "Sizes right-aligned, tabular" Prefer scroll sideways with the Name column. The Prefer's own point, the right-aligned sizes, sits off-screen ("18.4" is cut at the frame edge). Probe: table right edge at 481. Crop: `scratchpad/cb/t1.png`, `t2.png`. | Turn on `stickyFirst` wherever a table can scroll, at least on the live demo and the Prefer sides; that is what the page teaches. |
| 7 | should | `/components/badge`, live "Issues" demo, empty result (`src/demos/badge.tsx:90`) | Owner: "empty states name the next step"; component-combobox Copy: "Empty: repeat the query and give a next step" | The empty text is "No issue matches “{query}”." It repeats the query but names no next step. | Add the step, e.g. "No issue matches “x”. Try a state or an ID." The filter's placeholder already names the fields. |
| 8 | should | `/components/combobox`, Variants › Multiple (`src/demos/combobox.tsx`, `empty={(q) => <>No one called “{q}” in this workspace.</>}`) | component-combobox: Prefer "Repeats query, names next step"; Copy: "Empty: repeat the query and give a next step" | The empty text names no next step. The page's other comboboxes do ("Try the country instead."). | e.g. "No one called “x” in this workspace. Try a team name." Team is already the trailing detail and is searched. |
| 9 | should | `/components/badge`, Details › "Soft, not solid", **Avoid** side, dark theme | SKILL floor: "Text holds 4.5:1 against what it sits on… badges… included" | In dark, the solid badges put white text on the dark theme's light status colours: Failed 2.04:1, In review 2.01, Shipped 2.00, Scheduled 2.01, Draft 2.06. Probe: `probe-badge-1280-dark.json`, y 2184-2328. Crop: `scratchpad/cb/bd1.png`. The demo was built to show weight and patchwork, not illegible text. | Use each tone's `on-*` ink (`--on-danger` is `#0e0f11` in dark) for solid fills in dark, so the Avoid side fails only for the reason it names. |
| 10 | nit | `/components/switch`, Anatomy "Disabled" row vs `src/ui/Switch.module.scss:88-94` | component-switch Anatomy: "Disabled: track `surface-sunken`" | The off, disabled track renders `rgba(24,24,27,.06)` (`fill-control`). The code comment explains why: "sunken would vanish into a dark page". The page still says `surface-sunken`. | Change the Anatomy row to `fill-control`, keeping the reason, or the reverse. Page and code should agree. |
| 11 | nit | `/components/table`, all tables | component-table Anatomy: "Header 32" | Every `th` measures 33px tall (32 plus its 1px bottom line). | Use `box-sizing: border-box` on the header row, or say "32 + line" in the Anatomy. |
| 12 | nit | `/components/badge` live list and Details lists (`src/demos/demos.module.scss:987-994`, `.issueRow { border-bottom }`); `/components/toast` file lists (`.toastFiles`) | principle-the-lightest-boundary: "Lines only between the repeated rows"; component-table: "none after the last" | Every row, the last included, draws a 1px `line` under itself. Shot: `scratchpad/cb/badge-live.png` (line under "Offline sync"), `toast-Export.png` (line under "Metrics.csv"). | Use `:not(:last-child)` for the row border, or `border-top` on rows after the first. |
| 13 | nit | `/components/checkbox`, Variants › "Without a label" (`.checkList`) | principle-the-lightest-boundary: "never a box inside a box" | The file list is outlined (`inset 0 0 0 1px line`, radius 8) inside the Variants gallery's box. | Drop the outline and let the rows' lines hold the list, as the Table page does. Or treat it as a table specimen and give it the table frame (radius-lg 10). |
| 14 | nit | `/components/badge`, States › "Tones" specimen | component-badge: "A dot marks what can change; what something is goes without" | Each tone is shown twice, with a dot and without, and the words are all states (Failed, In review, Shipped, Scheduled, Draft). The dotless copies are states drawn as attributes. | Pair each tone's dotted state with an attribute word for the dotless copy (Beta, Admin, Pro plan), or show states only. |
| 15 | nit | All 11 routes: frame captions that repeat the section heading ("Variants" under "## Variants", "Kinds" under "## Kinds") | principle-every-line-does-a-job: "every line names a thing, an action or a state" | `Gallery` defaults `label = 'Variants'` (`shell.tsx`, Gallery). The toast page's Kinds frame is labelled "Kinds". The caption line adds nothing the heading above hasn't said. | Name what the frame shows ("Issue list", "Files"), or omit the caption when it would repeat the heading and keep only the theme tool on that row. |
| 16 | nit | `/components/tabs`, Variants at 375 | principle-the-lightest-boundary Avoid "A rule under everything" | Each variant's tab line and the gallery's row divider sit 16px apart: two hairlines in a row, three times. Crop: `scratchpad/cb/tb.png`. | Add space under the tabs (the panel gap, 16) before the divider, or end each tabs specimen with a short panel line so the two rules don't stack. |
| 17 | nit | `/components/card`, Details › "Numbers change with a blur" | component-card Copy: subtitle is "the one fact that helps choose"; Copy rule for values in Slider ("unit attached") | "Conversion 65.78" has no unit: a rate with no %. | Show "65.78%". |

Not reported (deliberate): the Avoid sides' own mistakes, such as truncated "Discussi" on the Tabs scroll Prefer (the cut-off label is the rule), the inline radios 16 apart, the bold tabs, the solid toasts and the six stacked toasts. These are the mistakes each demo was built to show.

## 2. Ledger

pass = measured or read in source and holds; fail = finding #; n/a = with reason. Measurements are at 1280 light unless noted; the probe covered all four variants.

### Floors (SKILL.md)
- Text 4.5:1: **fail #9** (Avoid side, dark only). Every other text node on all 44 variants passes (probe; disabled text exempt).
- One icon library, sized to text, no symbols: pass. All icons are Lucide via `src/ui/icons.tsx` or direct imports; verdict marks are Lucide Check/X at 14 beside 13px captions; no typed ✓/✕ found.
- Window holds still: n/a. These are reading pages that scroll as one.

### Reading page (principle-reading-text, "These pages")
- 16/26 prose, `prose-max` 45em ≈ 720px: pass (column 280→1000 at 1280; every heading, paragraph and figure starts at x=280).
- Demos, code and tables share the column: pass (figures 280–1000; halves 280–632 / 648–1000).
- Short lines on narrow screens: pass (375: 16px gutters, 343 column, no horizontal page overflow on any route; `scrollWidth − innerWidth = 0` everywhere).
- Interface text in demos 13–14, labels 12: pass (sizes found: 12, 13, 14, 16 plus headings; 11.9 and 13.6 are the `code` spans).

### component-combobox
- Avoid/Prefer "Exact match" / "Loose match": pass (source: `strict` only on Avoid).
- "Nothing highlighted" / "First match highlighted": pass (`autoHighlight` default on).
- "Plain rows" / "Matched letters bolder": pass (match weight 600, Anatomy).
- "No results" / "Repeats query, names next step": pass for the four city boxes; **fail #8** in Variants › Multiple.
- Anatomy: Field 32, radius 10, line-strong: pass (Input). Trigger 24×24, 4 in, radius 6: pass (open-state shot `scratchpad/cb/combo-open.png`). List as wide as the field, 6 below: pass (popup top 476 vs field bottom ≈470). Current option 500 with an accent-text leading check: pass (measured 500, `rgb(0,102,204)` check). Match 600: pass (source). Trailing detail muted, right-aligned: pass (shot). Chip 24, radius 6: pass (shot). List ≤ 9 rows / 296: pass (listbox 296 tall).
- Field keeps accent edge while open: pass (shot).
- States (Enter, arrows, Esc, chevron browse): pass (source / Base UI); the open list scrolls to the current value (shot).
- Common mistakes: accepting free text, n/a (items only); opening empty, pass (click shows all 27); sorting by score, pass (list keeps region and alphabetical order); chips pushing field off, pass (375: chips wrap inside the field, input keeps a row).
- Copy: label "Time zone", "Assignees", pass; placeholder "Search cities or countries", pass; empty, **fail #8**.
- Motion (list opens like a Menu; filtering doesn't animate): pass (source).

### component-checkbox
- "Only the 16 px box clicks" / "The whole row clicks": pass (`<label>` wraps box and text; row 20 tall).
- "Parent ticked if any is" / "Parent dashed if some are": pass (live demo shows the mixed dash).
- Anatomy: Box 16×16 radius 4, pass; Off surface + line-strong, pass; On/mixed accent + on-accent, pass; Mark Lucide 12 at 2px, pass (12×12, stroke 2); Box to label 8, pass (582.3→590.3); Label 14/20, pass; Offset 2, pass (box y 422, line 420); Children indent 24, pass (566.3→590.3).
- States: press 0.9, mark spring, Space: pass (source `Checkbox.module.scss`).
- Common mistakes: saves on the spot, n/a (demo has no save); negative labels, pass; consent pre-ticked, n/a; disabling without explaining, n/a (disabled appears only in the state grid).
- Copy: labels sentence case, no stop, pass ("Keep me signed in"); group label "Email me about", "Export", pass; description "Anyone with the link can reply.", pass.
- Variants specimen boxed inside a box: **fail #13**.

### component-radio
- "Nothing chosen" / "Standard already chosen": pass.
- "Three buttons, three Tab stops" / "One group, one Tab stop": pass (only the checked radio has `tabindex=0`).
- "Inline, 16px apart" / "One column": pass (Avoid measured 16; Prefer one column).
- "Square checkboxes" / "Round radios": pass.
- Anatomy: Circle 16 full, pass; Off, pass; On accent, pass; Dot 6, pass (6×6); Circle to label 8, pass; Label 14/20, pass; Offset 2, pass; Follow-up indent 24, pass (hint at 599.7 = circle + gap); Inline gap 20, pass (Orientation 19.9).
- Label wraps circle: pass.
- States (Tab to chosen, arrows wrap): pass (Base UI RadioGroup).
- Common mistakes: no default, pass; acts on the spot, pass; Yes/No as radios, n/a; hidden in a Select, n/a.
- Copy: group labels "Shipping", "Export at", pass; options parallel, pass; descriptions, pass ("Including guests, once they sign in.").

### component-switch
- "Waits for Save" / "Applies at once": pass.
- "Label shows the state" / "Label names the setting": pass.
- "Knob holds its shape" / "Knob stretches 4 px": pass (pressed knob 20 wide; on-state grows leftward).
- Anatomy: Track 32×20 full, pass; Knob 16, pass; Inset 2, pass; Off line-strong `#868690`, pass; On accent, pass; Travel 12, pass (knob x 638→650); Label to switch 12, pass (source `space-3`); Disabled, **fail #10** (token text).
- One placement per context; switches in one column: pass (Variants and "A settings list" specimen: switches at x 748 in one column).
- States (Space, snappy spring, track fade): pass (source).
- Common mistakes: in a form with Submit, n/a; On/Off text, pass; confirmation, pass; colour only, pass (knob position).
- Copy: "Autosave", "Show grid", pass; never the state, pass (only the Avoid side says "Grid on"); description "Moved objects land on grid lines.", pass.

### component-tabs
- "Current tab goes bold" / "Weight 500, colour only": pass (all tabs 500; only colour differs).
- "Current tab in the accent" / "Current tab in ink": pass (bar `rgb(24,24,27)`).
- "Wraps onto more rows" / "One row that scrolls": pass (375: tab row scrolls; page has no horizontal overflow).
- "Count in parentheses" / "Count in a quiet chip": pass (chip 18 tall, Geist Mono 11, surface-sunken).
- Anatomy: Tab height 40, pass; Between tabs 16, pass (461.3→477.3); Label 14/20/500, pass; Default ink-muted, pass; Current ink, pass; Bar 2px ink, full radius, pass (484→486, under the label's full width 61.3); Line 1px, the tabs' width, pass (local content-box background); Count, pass; Panel gap 16, pass (shot).
- No side padding, labels on the content's edge: pass (first label x 400 = panel x 400; the list's 8px padding is given back by its margin).
- States (arrows open, Home/End, bar slides): pass (source).
- Common mistakes: hide required input, n/a; controls above that act on one panel, n/a; tabs that reset, n/a (no navigation); single tab, pass.
- Copy: nouns, sentence case, parallel: pass (Overview, Issues, Activity, Settings).
- Variants at 375, double rule: **fail #16**.

### component-slider
- "4 px track, 16 px knob" / "The whole 32 px row drags": pass (row 224×32).
- "Eases 400 ms" / "Follows the pointer exactly": pass (source).
- "Stops dead" / "Stretches up to 10 px": pass (source).
- "Handle over the value" / "Handle fades to 10%": pass (Prefer shot shows the faded handle).
- "Proportional digits" / "Tabular digits": pass (value: Geist Mono, `tabular-nums`).
- Anatomy: Row 32, radius 10, fill-control, pass; Fill, pass; Label 13/500, 12 from left, pass (528→540); Value mono tabular, 12 from right, pass (740→752); Handle 3×16 full ink, pass; Ticks 1×8 line-strong, ≤10, pass (3 ticks for Columns); In a panel 18 / 8 / 10, pass (panel 18, padding 8, row 10).
- Label/value muted at rest, ink on hover/drag/focus: pass (rest `rgb(94,94,103)`).
- States (3px drag threshold, click glide, arrows/Shift/Home/End): pass (source).
- Common mistakes: no visible value, pass; precise numbers by drag, n/a; steps finer than pixels, pass; animating keyboard steps, pass (source).
- Copy: label nouns, pass; value with unit, **fail #5**.

### component-segmented-control
- "Segments fill in place" / "One thumb slides across": pass.
- "As wide as their words" / "Equal widths": **fail #1** (Prefer truncates).
- "Thumb in the accent" / "Raised thumb in greys": pass (Prefer thumb `surface-raised` + shadow-xs).
- "Two icons and one word" / "All icons, with tooltips": pass (tooltip "Align center": ink ground, bg text, radius 6, 4×8, 12/16/500, no shadow).
- Anatomy: Track fill-control, full, 32, pass; Inset 2, pass; Thumb 28 surface-raised shadow-xs full, pass; Segment equal widths, 12 padding, pass (75.2 ×3 on the live demo); Label 13/500, ink-muted / ink, pass; Icon segment 16 in 36, pass.
- Height matches buttons beside it (32): pass.
- States (radio group, arrows, thumb spring, colour in duration-fast): pass (source; all 17 groups have the thumb at the checked segment in a re-measured shot).
- Common mistakes: label repeating options, pass (`aria-label` only); six segments narrow, **fail #2, #3** (truncation is the named consequence); segments that act, pass; changing main content, n/a.
- Copy: nouns of similar length, **fail #1, #2**; icon tooltips are nouns, pass ("Align left").

### component-card
- "Static card lifts on hover" / "Static card stays still": pass.
- "Up to 1.05" / "Up to 1.01, small shadow": pass (source: `hover-lift`, `shadow-sm`, gentle spring).
- "120 ms apart, uncapped" / "30 ms apart, capped at 8": pass (source: `min(var(--i), 8) * var(--stagger)`).
- "Swaps in one frame" / "Digits rise, 30 ms apart": pass (Swap).
- Anatomy: Frame surface, shadow-xs, 18, pass; Inset 8, pass; Stage fill-control 10, pass; Title 14/20/500, pass; Subtitle 13/18 muted, pass; Meta padding 12 above, 8 sides, pass (`12px 8px 4px`); Hover, pass; Entrance, pass.
- States (one target, title stretched; More button separate, named "More for Q4 roadmap"): pass.
- Common mistakes: buttons all over, pass (one More); text on the stage, pass (the number is the stage's content); uneven heights, pass (one-line titles); staggering every re-render, pass (Replay is explicit); stage copying the corner, pass.
- Copy: titles are names, pass; subtitle "Edited 2 hours ago", pass; unit, **fail #17** (nit).

### component-badge
- "Dot only" / "Dot and word": pass.
- "Solid fills" / "Soft tints": pass for the Prefer; Avoid side contrast **fail #9**.
- "Dot on every badge" / "Dot only on Online": pass.
- Anatomy: Height 20, pass; Padding 8, pass; Shape pill, pass; Text 12/16/500, pass; Status tones on `*-soft`, pass (e.g. `#a11f01` on `#fdeee8`); Neutral ink-muted on fill-control, pass; Dot 6 in text colour, pass; Dot to text 4, pass (dot 848.1–854.1, text after +4 per source).
- States: none; each tone holds in both themes: pass for soft tints (probe); Tones specimen **fail #14** (nit).
- Common mistakes: a badge per row with no header, pass in the table; the live issue list has a status in every row with no header, so see Gaps; red for new, pass; truncated badges, pass; badges as buttons, pass.
- Copy: one or two words, sentence case, adjectives or participles: pass.
- Live demo empty state: **fail #7**.

### component-table
- "Sizes left-aligned" / "Sizes right-aligned, tabular": pass at 1280 (Size `text-align: right`, header too, `tabular-nums`). At 375 the Prefer's column is off-screen: **fail #6**.
- "Zebra stripes" / "One line between rows": pass.
- "Arrows on every header" / "Arrow on the sorted column": pass (`aria-sort` on Modified only).
- "Every column in ink" / "Secondary columns muted": pass (Owner and Modified `ink-muted`).
- "Names scroll away" / "Name column pinned": pass on its own demo; **fail #6** on the live demo and the other Prefers at 375.
- Anatomy: Frame 1px line, radius 10, surface, no shadow, pass; Header 32, **fail #11** (33); label 12/500 muted on surface-sunken, pass; Row 36, 13/18, pass; Cell padding 12, pass; Divider between rows, none after the last, pass (last row `border-bottom: none`); Numbers right/tabular, pass; Secondary muted, pass; Hover fill-hover / selected accent-soft, pass (state grid); Sticky header, pass (source).
- States (sort button, aria-sort, mixed select-all, bulk bar names the count): pass ("5 files" → "n selected", `aria-live`).
- Common mistakes: status as colour alone, pass (Badges with words); actions in every row, pass; truncating the name, pass; row click vs checkbox, pass (checkbox selects; rows don't open).
- Copy: headers nouns, pass; units in cells ("18.4 MB"), pass; empty cells as an en dash, n/a (no empty cells; the Toast page's Kinds table uses "—", a page table, not a demo).

### component-toast
- "Asks before deleting" / "Deletes, offers Undo": pass.
- "Filled with colour" / "Neutral, with an icon": pass (icon in the kind's colour, neutral surface).
- "All six stack up" / "Three at most, oldest out": pass (limit 3).
- Kinds: Done 4s, With Undo 6s, Needs attention 4s, Failed until closed and announced at once: pass (`TIMEOUT`; Base UI 1.9 renders high-priority toasts into a visually hidden `role="alert"` copy). Hover/focus pauses, F6: pass (Base UI viewport).
- Anatomy: Shape surface-raised, shadow-lg, pill, pass; Height 40, pass; Inset 4, 16 before text, pass (`4px 4px 4px 16px`); Width 320–440, pass at 1280, **fail #4** at 375 (263); Icon Lucide 16 in the kind's colour, pass; Text 14/20 ink one line, pass, but **fail #4** (object cut); Actions one pill then Dismiss, pass (Undo 32, Dismiss 32); Place bottom centre, pass.
- Motion (rise 8px, smooth spring, leave in duration-fast): pass (source).
- Common mistakes: errors that disappear, pass; toasts as the only feedback, pass (the row leaves the list); links and paragraphs, pass; on page load, pass.
- Copy: "Deleted “Q4 roadmap.fig”", "Link copied", pass; "Couldn’t export: the file is locked", pass; one-verb action "Undo", pass.
- Focus follows the action: pass (after Delete, focus moves to the next row's Delete).

### component-button (Delete, Copy link, Replay, Move…, frame tools)
- Filled not outlined, pass; hover in at once / out soft, pass (source); press 0.97, pass (source); one danger fill in a confirm, pass (the Avoid confirm uses `danger-fill`); spinner timing, n/a.
- Anatomy: heights 24/32, pill, label 500, fill-control: pass (Delete 24 sm, triggers 32).
- Common mistakes: shadow, pass; colour as rank, pass (danger text marks destruction, which the page allows); disabled with no reason, pass (Move… and Delete are disabled until rows are selected, and the bar says "5 files").

### component-input (combobox field, badge filter)
- Label above, placeholder as example: pass ("Filter" / "Title, state or ID").
- Leading search icon on a search: pass (badge filter).
- Anatomy: 32, radius 10, line-strong, padding 12, label 12/16/500 muted 4 above, focus edge accent: pass (combobox open shot).
- Error timing rules: n/a (no validation on these pages).

### component-menu (the combobox list is a Menu's popup)
- Check in a leading column, pass; radius 10 / inset 4 / item 6 / 32 rows, pass (open shot); highlight 9%, pass (Lisbon row); grows from the trigger, pass (source); shortcuts/icons rules, n/a.

### component-tooltip
- Shared 500ms delay, pass (`TipGroup` in every Frame); inverse, no shadow, 6 radius, 4×8, 12/16/500, pass (measured on "Align center"); no tooltips on labelled buttons, pass (only the icon-only theme switch, gaps ruler and icon segments; the "0.1×" text button has one, which is allowed for a non-word label).

### component-icon
- From the library, silent, pass; beside words, pass; 16 beside 14, 14 beside 13, pass (verdict icons 14 with 13px captions; card More 16; toast icons 16); none drawn by hand, pass; colour `currentColor`, pass.

### principle-the-lightest-boundary-that-holds
- Every section a card / headings and space: pass (page sections are headings plus space; demos are frames; see Gaps).
- Three equal tiles / one row of figures: n/a.
- One group boxed / all on the page's edge: pass (one left edge at 280).
- A rule under everything / lines between rows, lighter than the edge: **fail #12, #16** (nits).
- No box inside a box: **fail #13**; see Gaps for frames around cards and tables.

### principle-space-groups-by-ratio
- Half above / 85% above: pass (h3 has more space above than below on every route).
- More space doesn't fix it: n/a.
- Stripe per line / per transaction: n/a (no stripes outside the Table Avoid).
- One left edge per kind: pass (badge list: IDs, titles and badges each on one edge; table columns).

### principle-every-line-does-a-job
- Three lines before the first field / the task, then the field: pass.
- Every row starts "Manage" / word that differs first: pass.
- Eyebrow / where it sits: pass ("Component" above each H1 names the section the page sits in).
- Error with the action that failed: pass (toast failure).
- No we/please/sorry, no "Your": pass.
- Caption repeating heading: **fail #15** (nit).

### principle-lightness-first, principle-grey-until-it-matters, principle-colour-means-one-thing
- Lightness by role (text ≥ 4.5, control edges ≥ 3): pass except #9 (line-strong `#868690` is 3.6:1 on white; switch off track, radio and checkbox edges use it).
- Every label in its own colour / labels grey: pass.
- Accent on every current state / accent only on the action: pass (tabs ink bar, segmented grey thumb; accent fills only on checked boxes, radios and switches, which are the controls' own state).
- Hover in the selection tint / neutral grey: pass (table hover `fill-hover`, selected `accent-soft`).
- Counts in red / red only for failure: pass (red: Failed badge, failed toast icon, Delete).
- Accent text is a link: see Gaps (info badge text is `accent-text`).

### principle-a-shadow-says-how-high, principle-concentric-radius
- Shadows only on what floats: pass (card shadow-xs, toast shadow-lg, list popup shadow-md; table none). Two shadows, two jobs: pass (hairline ring plus drop).
- Concentric pairings: card 18/8/10, panel 18/8/10, list popup 10/4/6, toast pill-in-pill 4, segmented 2, switch 2: pass (measured).

### principle-nothing-shifts, principle-never-too-busy-to-listen, principle-attention-wears-off
- Bold widens / weight constant: pass (tabs and segments keep 500).
- Scroll gutter: pass (combobox list).
- Interruptible: pass (transitions, not keyframes, on thumb, bar and knob; source).
- What repeats is ≤120ms: pass (colour fades `duration-fast`).

### principle-where-the-eye-goes
- The button answers where the click was: pass (toast "Deleted …" plus the row leaving).
- Fold, ad-band, proximity: pass (labels 4 from fields); scent n/a.

### principle-who-before-what
- The column that says who stays filled in every row: pass (table Name, badge issue titles). It does not stay in view when scrolled: **#6**.

### system-look-playbook
- Values in use match the look (`#0071e3` accent, `#18181b` ink, `#5e5e67` muted, `#e4e4e8` line, `#868690` line-strong, radii 6/10/18): pass.

### Owner's rules (~/.claude/CLAUDE.md)
- One grid / one left edge: pass (x=280 on every route at 1280; 16 at 375).
- Trailing meta in one right-aligned column: pass (Anatomy Value column, badge column, table numbers, slider values).
- Lightest boundary that holds: #12, #13, #16 (nits).
- Empty states name the next step: **fail #7, #8**; pass for the four city comboboxes and the toast demo's "Reset demo".
- Focus follows the action: pass (toast Delete moves focus to the next Delete; combobox keeps focus in the field while open).

## 3. Gaps in the playbook

1. **Demo frames versus "never a box inside a box".** Every live demo is a bordered, rounded frame, and some hold boxes of their own: cards (`/card` live grid), a table frame (`/table` Variants), a property panel (`/slider`). The boundary page lists cards, tables and canvases under "When it doesn't apply", but no rule says a demo stage counts as a window, not a box. Write that down (a frame is a viewport in miniature), or the rule reads as broken on every page.
2. **Badge column in a list.** component-badge says a badge in every row makes a status column that needs a header. The `/badge` live demo is a list, not a table, with a status badge in every row and no header, and that reads fine. The rule should say whether it covers lists, or limit it to tables.
3. **`info` text equals `accent-text`.** The Beta and Scheduled badges are `#0066cc`, the same colour as links (`--accent-text`). Colour-means-one-thing's "Accent text is a link" and the badge's info tone collide. Decide whether `info` needs its own hue or a darker step.
4. **Narrow-screen rule for Compare.** No page says how a two-sided comparison collapses on a phone. The current switch and caption arrangement produced #2. A line in the reading-page system (verdict words in the caption, Before/After in the switch) would settle it.
5. **Toast minimum width on a phone.** "320 to 440" can't hold inside a 343px stage, and no rule says whether the object or the width gives way (#4).
6. **Unconfirmed, needs a timing check.** In the first batch of full-page 375 shots, taken four at a time under load, several segmented-control thumbs on `/segmented-control` were drawn as a small circle at the left end while another segment was checked: "Raised, not coloured" Prefer and toggle, Variants Text and In a panel (`shots/review/components-b/segmented-control-375-light.png`, y≈2150–3300). A re-shoot and a DOM read showed every `--x`/`--w` correct, so I could not reproduce it. `SegmentedControl` measures with `offsetLeft`/`offsetWidth` once and re-measures only when the root resizes, so a segment that changes width without the root changing (late font swap in an equal-width grid) would leave the thumb stale. Worth a throttled-CPU test before calling it clean.
