# Review 3: components A (commit f52c877)

Rule review of the changes in f52c877 to the component pages app-shell … switch, per
`.claude/agents/ui-rule-review.md`. The fix agent's intent is `review2/fixes-components-a.md`; this checks each
change against the rules and for what it broke on its route. Untouched parts of the pages are not re-audited.
Shots in `shots/review3/components-a/`.

## Scope

- Shared: `src/ui/Button.module.scss`, `Combobox.tsx`, `Field.tsx`, `Radio.tsx`, `SegmentedControl.module.scss`,
  `Sheet.module.scss`, `Slider.module.scss`, `Switch.tsx`.
- Demos: app-shell foot, badge, card, checkbox, combobox, input, segmented, sheet (Walk, cases, pins), slider,
  icon Nav; `demos.module.scss` rows `.cardTiny`, `.swatchGrid`, `.comboNote` only (its other hunks are other
  fix agents').
- Pages: `button.mdx`, `segmented-control.mdx`, `sheet.mdx`.

## Routes

(written route by route below)

### /components/sheet

Shots: `sheet-walk-{1280-light,375-dark}.png`, `sheet-cases-{1280-light,375-dark,375-light}.png`,
`sheet-case-{narrival,ilterslive,hatsplaying}-375-light.png`, `sheet-walk-pin-375-dark.png`.

| change | check | result |
| --- | --- | --- |
| Case picker as one RadioGroup | 9 `role=radio` (SPAN), 1 with `tabIndex ≥ 0`, group `aria-label="Case"`; ArrowRight from the first moves focus *and* choice to “Filters, live”; checked pill `ink` fill, 24 tall, 13px; `.pick:focus-visible` keeps its ring | pass (radio: “One Tab stop; arrows choose”) |
| Route reopens → focus in | arrival: focus stays on `<body>`; Close → focus on Route, sheet closed; Route → focus on **Close** inside the dialog; a pin click → focus stays on the pin, outside | pass (sheet table: “stays, or moves in when opened from a button”) |
| Pins neutral | light `rgb(255,255,255)` / `rgb(24,24,27)`; dark `rgb(30,31,35)` / `rgb(236,236,239)`; picked `ink` fill, `aria-pressed=true` | pass (colour-means-one-thing: current states in shade, `warning` left to warnings) |
| Sheet body 17/22 | dialog 17px/22px; Walk details all 17 (title 17/24); no text overflows a 295-wide sheet in any of the 9 cases | pass for the prose |
| …but controls in the same sheets | Filters: title 17, the three switch labels 14; On arrival: paragraph 17, buttons 14; Sheet on a sheet: 17 + three 14s | **should**, see findings: the body is now the Consumer app's while the rows that *are* the body stay at the Work tool's 14 |
| Close icon beside a 17 title | 16 (icon-only button) | n/a: icon-only buttons are 16 by the Button page; the Icon page's “beside 17px text: 20” is for icon + word |

Spot-check, shared `Sheet.module.scss` on Post (`/practice/mail/app`, 390 × 844, New message): `post-sheet-390-light.png`.
To and Subject inherit 17/22, the message body is 16/26 (its touch-screen size), Cc/Bcc 13. One composer now sets
its three text fields at two sizes, 17 and 16. **should**, see findings.

### /components/app-shell

Shots: `app-shell-1280-light.png`, `app-shell-375-dark-open.png` (sidebar opened from Pages).

| change | check | result |
| --- | --- | --- |
| Foot: avatar centred on the icon column, name on the labels' line | 1280: icon centres 329.0, avatar centre 329.0, labels 345.0, name 345.0. 375 (opened): icon centres 65.0 = avatar 65.0; labels 81.0 = name 81.0 | pass (owner: icons in one column, labels on one line). The avatar's left edge (317 / 53) is 4 left of the icon column and the workspace name; recorded by the fix agent as a departure, and the reason (12px initials need 24) holds |
| Share icon 14 beside its sm label | Share svg 14, Settings / Pages (icon-only sm) 16 | pass (button.mdx Icon row) |

### /components/button (+ shared `Button.module.scss`)

Shots: `button-anatomy-375-dark.png`, `eye-cart-1280-light.png`.

| change | check | result |
| --- | --- | --- |
| Anatomy Icon row, Label row | rows read “Lucide 16; beside an sm label, 14 · 16” and “body, weight 500; sm 13, as in dense rows · 14 / 20”; md buttons compute 14px | pass |
| `.sm:not(.icon) svg` 14 | the only sm button with an svg on this page is the frame's Switch theme (icon-only, 16) | pass on the route |
| Spot-check, `/principles/where-the-eye-goes` | the shop's cart (`src/demos/eye.tsx:36`) is icon-only (`label={cart}`, a count badge only when non-zero) but doesn't pass `icon`, so the new rule shrinks its ShoppingBag to **14** (`svg=14`, button 30 × 24) | **should**: an icon-only button now draws 14, against the row's own “Lucide 16” |

Other sm buttons with a label and an icon now at 14, as intended: App shell's Share, the Sheet's Route and Share…,
Menu's Sort chevron, novelty Inbox's Archive.

### /components/icon

Shots: `icon-live-1280-light.png`, `icon-live-375-dark.png` (at 375 the scene hides its sidebar, as before).

| change | check | result |
| --- | --- | --- |
| Sidebar 13px words, 14px icons | all five rows `fs=13px svg=14`, 32 tall, none overflows; the rail (icon-only) keeps 16 | pass (icon.mdx Anatomy “Size in dense rows (13px): 14”; work-tool “13px in … sidebars”) |
| Comment | `src/demos/icon/icon.module.scss:12` still says “Icon 16px, 8px to its word” above the rule that now sets 13/14 | **nit** |

### /components/card

Shots: `card-stagger-1280-light.png`, `card-stagger-375-dark.png`.

| change | check | result |
| --- | --- | --- |
| Stagger cards show their title again | 1280: 24 tiny cards, 64 wide, titles 12/16, 0 truncated; 375: 12 cards, 88 wide, 0 truncated; stage 343 × 404 scrolls neither way | pass (card: “Truncate to one line”, no ragged grid) |
| `SHORT` one-word titles | Plan, Brand, Mobile, Grid, Type, Metrics: each matches its stage art | pass (card Copy: “the thing's own name”) |
| Static subtitle “Geist, 8 styles” | 3 occurrences, 13/18 muted | pass (card Copy: “the one fact that helps choose between cards”) |

### /components/checkbox

Shots: `checkbox-live-1280-light.png`, `checkbox-target-375-dark.png`, `checkbox-target-1280-light.png`.

| change | check | result |
| --- | --- | --- |
| Live group waits for **Save changes** | form; Save changes primary, 32 tall, left 566 = the parent box's left 566; `role=status` empty → “Saved” after submit → empty after the next change | pass (checkbox: “If nothing waits for a Save or Submit, it's a Switch”; button Copy: verb + result) |
| Target pair ends in **Create account** | both sides: two rows then the button; second label “Email me about updates”, unchecked | pass (checkbox Copy and “Consent ticked in advance”) |
| …spacing in that form | rows 336–356, 368–388, button 400–432: the button sits **12** below the last row, the same 12 as between rows (`s.leftStack`, gap 12), so it reads as a third row of the group. The live form, by the same agent, puts 20 (`space-5`) there | **should** (space-groups-by-ratio: one gap ~1.6× the other before people group by it) |
| Unlabeled rows share the columns | box lefts per gallery row: Single 40, With description 40, Group 40, Parent 40/64, Without a label 40 (375) | pass (owner: one left edge) |

### /components/combobox (+ shared `Combobox.tsx`)

Shots: `combobox-live-{1280-light,375-dark}.png`.

| change | check | result |
| --- | --- | --- |
| Scene note is now the field's hint | the two live Time zone inputs carry `aria-describedby` → “Meetings shown in Lisbon time”; hint 4 below the box, on its left edge (78 = 78; 40 = 40), 12px `ink-muted`; inputs without a description carry none | pass (input Anatomy: label, field, hint `space-1` apart) |
| Chevron name “Show list” | 8 triggers, all `aria-label="Show list"` | pass |
| Empty hint “Pick a city” | moved, not new: with no value the hint is an instruction that restates the label | **nit** (input: a hint is “for a format, a limit, or a consequence”); e.g. no hint until a city is chosen |

### /components/input (+ shared `Field.tsx`)

Shots: `input-scene-1280-light.png`, `input-search-375-dark.png`.

| change | check | result |
| --- | --- | --- |
| Hint leaves `aria-describedby` while the error shows | Email: before → “For delivery updates only.”; `ana@studio` + blur → only “Enter an email address, like ana@studio.com.”, and only the error is visible; `ana@studio.com` → back to the hint | pass (input: “the error takes the hint's line”) |
| ⌘ in FieldKey | both `kbd svg` → `role=img`, `aria-label=Command` | pass |
| Search placeholders “Brand refresh” | gallery Search row and the 2× anatomy; an example query (a project in the Card demos), muted | pass (input Copy: “an example, not an instruction”) |

### /components/badge

Shot: `badge-scene-375-dark.png`.

| change | check | result |
| --- | --- | --- |
| Filter placeholder “PB-131” | an ID in the data (Dark mode for charts); muted, so it doesn't read as typed | pass (input Copy). At 375 the ID column starts off-screen to the right, so the example names a column you can't see yet; it's still the shortest true example, so no finding |

### /components/segmented-control (+ shared `SegmentedControl.module.scss`)

Shots: `segmented-live-1280-dark.png`, `segmented-live-375-light.png`, `segmented-table-375-dark.png`.

| change | check | result |
| --- | --- | --- |
| Live control leads the board as a toolbar row | control left 520 = board left 520, 12 above it (1280); 68 = 68, 12 above (375) | pass (segmented: “belongs in a toolbar or an inspector”; owner: one left edge) |
| One veil value, 14% | thumb `linear-gradient(rgba(255,255,255,0.14)…)` over `surface-raised` in both themes; in dark the thumb `rgb(30,31,35)` + 14% white sits above the 9% white track, visible in the shot | pass |
| Table “Sits” cell | “In the toolbar or inspector of what it changes” agrees with Common mistakes; at 375 it wraps to five lines beside two- and three-line neighbours, no overflow (343 = 343) | **nit**: “In a toolbar or inspector” says the same in half |

### /components/slider (+ shared `Slider.module.scss`)

Shots: `slider-discrete-1280-light.png`, `slider-discrete-375-dark.png`, `slider-live-1280-light.png`.

| change | check | result |
| --- | --- | --- |
| Ticks on keyboard focus | Discrete row: 3 ticks, opacity 0 at rest; after `focus()` (`:focus-visible` true) and the 180ms fade, opacity 1 | pass (slider States; the Variants text reads “on hover and focus”) |
| Swatches `ink-muted` | `rgb(94,94,103)`, the six squares grey at the Opacity value | pass (colour-means-one-thing: the accent isn't content) |

### /components/radio, /components/switch (+ shared `Radio.tsx`, `Switch.tsx`)

Shots: `radio-top-1280-light.png`, `switch-top-1280-light.png`; spot-checks `looks-settings-1280-{dark,light}.png`
(`/systems/looks?look=linear&page=settings`), `novelty-switches-375-light.png` (`/principles/attention-wears-off-waiting-doesnt`).

| change | check | result |
| --- | --- | --- |
| Name = label, description tied as a hint | switch: “Autosave” / “Changes are saved as you type.”; radio: “2×” / “For Retina screens.”, “Standard” / “3–5 days, free”, “Express” / “1–2 days, $9”, “Overnight” / “Tomorrow, $24”; options without a description keep no `aria-describedby` | pass |
| Other pages | Ship settings: “1% of users” / “Slowest; catches rare crashes first.”, “Everyone” / “For hotfixes.”; switches without descriptions unchanged. Novelty: “Expressive” / “350 ms, overshoots” and its two siblings | pass |

Shared `Field.tsx` and `Combobox.tsx` on Ship settings: Bundle ID (read-only, valid) keeps its hint “Set by the App
Store.” in `aria-describedby`; the Approvers combobox renders. Pass.

`.comboNote` is gone from all three places in `demos.module.scss` and nothing references it; the case-picker
tests use `getByRole('radio')` (`tests/interactions.spec.ts:1968,1971`).

Coverage note: theme-sensitive changes (sheet pins, segmented veil, checkbox and app-shell scenes) were shot in both
themes; the others at 1280 light and 375 dark, per the brief's preference for crops over four full pages. The machine
was busy for most of the run; every batch waited for `level: ok`.

## Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | `/principles/where-the-eye-goes`, the shop's cart, `src/demos/eye.tsx:36` | button.mdx Icon row: “Lucide 16; beside an sm label, 14” | icon-only (`label={cart}`, no text at 0 items) but no `icon` prop, so the new `.sm:not(.icon) svg` rule draws ShoppingBag at 14 (button 30 × 24) | pass `icon` to that Button (it is icon-only; the count badge is positioned), or scope the rule to buttons with a text node |
| should | `/components/sheet` cases Filters, On arrival, Sheet on a sheet; `src/ui/Sheet.module.scss:56` | consumer-app: “Body text 17px on a 22px line”; sheet.mdx Body row 17 / 22 | inside one sheet the prose is 17 while the rows that are the sheet's body (Switch labels “Pets allowed”…, buttons “Open the App Store”, “Not now”) are 14 | decide one size for a sheet's content: either the Consumer app's 17 for its rows too (Switch/Radio/Button labels inside `Sheet.Popup`), or keep 17 for the title only and say so in the Anatomy row. See gap 1 |
| should | `/practice/mail/app` at 390, New message sheet (inherits `Sheet.module.scss`) | consumer-app body 17; input: “16 on touch screens” | To and Subject 17/22, message body 16/26, Cc/Bcc 13: two sizes for the composer's three text fields | set To/Subject to the editor's size (or the editor to 17) in `src/demos/post/Composer.module.scss`; the Post owner's call |
| should | `/components/checkbox` target pair, `src/demos/checkbox.tsx:148` `SignUp` (`s.leftStack`, gap 12) | space-groups-by-ratio: a gap ~1.6× the other before people group by it | rows 12 apart and Create account 12 below the last row, so the submit reads as a third option | give the form `cl.form` (gap `space-5`, as the live scene) or a `margin-top: var(--space-2)` on the button |
| nit | `src/demos/icon/icon.module.scss:12` | — (stale source comment) | says “Icon 16px, 8px to its word” above a 13/14 rule | update the comment |
| nit | `/components/combobox` Time zone, `src/demos/combobox.tsx:66` | input Common mistakes: a hint is for “a format, a limit, or a consequence” | empty state hint “Pick a city” restates the label as an instruction | no hint until a city is picked, or a consequence (“Meetings show in your own time until you pick one”) |
| nit | `/components/segmented-control` table, `segmented-control.mdx:19` | every-line-does-a-job | “In the toolbar or inspector of what it changes” wraps to five lines at 375 beside two-line cells | “In a toolbar or inspector” |

Counts: must 0, should 4, nit 3.

## Ledger

Only the rules a change in f52c877 touches are marked; every other rule in these references is **n/a: untouched by the
commit** (the brief excludes re-auditing untouched parts).

- **component-sheet**: Focus on open (stays / moves in from a button) pass; Kinds table, standard below the top height pass (pins tappable while open); Anatomy Header 17/24 pass; Anatomy Body 17/22 (new) fail in part, see finding 2; Copy (Close icon with label, Back to route) pass.
- **component-radio**: One Tab stop, arrows choose pass (case picker); Anatomy label 14/20 pass; Variants With descriptions pass (name + hint); A radio that acts on the spot: n/a in spirit, see gap 2.
- **component-switch**: Variants Settings row pass (name + hint); Copy description pass.
- **component-checkbox**: A checkbox that saves on the spot pass (now waits for Save changes); Consent ticked in advance pass; Copy label, group label pass; Anatomy box to label 8 pass; Children indent 24 pass (40 → 64).
- **component-button**: Anatomy Icon (new) pass on the route, fail on where-the-eye-goes (finding 1); Label sm 13 pass; One filled button per view pass (live checkbox form); Copy verb + result pass (Save changes, Create account).
- **component-combobox**: Copy placeholder pass; Anatomy field / trigger unchanged pass.
- **component-input**: error takes the hint's line pass; Label, field, hint 4 apart pass; Copy placeholder pass (Brand refresh, PB-131); A hint that repeats the label: nit (Pick a city).
- **component-segmented-control**: Sits in a toolbar or inspector pass; Raised thumb in greys pass (14% veil, both themes); Anatomy Thumb row pass.
- **component-slider**: Discrete variant ticks on hover and focus pass; Label/value `ink` when focused unchanged.
- **component-app-shell**: Sidebar foot 48, hairline above pass; owner's one column / one line pass.
- **component-icon**: Size in dense rows (13px): 14 pass (Nav); Size beside 14px: 16 pass (rail, issues).
- **component-card**: Truncate to one line pass; Copy title and subtitle pass; Concentric stage (10 − 4 = 6) pass.
- **component-badge**: Copy (placeholder only touched) pass.
- **system-consumer-app**: Body 17/22 pass for sheet prose, fail for sheet rows (finding 2) and Post composer (finding 3).
- **system-work-tool**: 13px in sidebars pass (icon Nav); Icons 16 beside 14 pass.
- **principle-colour-means-one-thing**: Current states in shade (picked pin ink) pass; content isn't accent (slider swatches) pass; warning only for warnings (pins) pass.
- **principle-space-groups-by-ratio**: fail, finding 4.
- **principle-the-lightest-boundary-that-holds**: sheet pins shadow-only edge pass.
- **owner's rules (CLAUDE.md)**: one grid / one left edge pass (app-shell foot, checkbox rows, segmented toolbar row, combobox hint); focus follows the action pass (Route → Close); empty states name the next step: n/a.

## Gaps in the playbook

1. **A system's body size vs a component's own.** Consumer app sets body 17/22; Switch, Radio, Checkbox and Button
   anatomies set their labels at 14 (13 for sm). The pages don't say which wins when a component sits in a consumer
   surface, so a sheet now mixes 17 prose with 14 rows. One sentence on each component page, or one on the system
   page (“controls take the system's body size”), would settle it.
2. **One choice of six or more that acts at once.** The sheet case picker (nine pills, changes the scene immediately)
   is semantically a radio group, but Radio says a radio that acts on the spot is a Segmented control, which stops at
   five, and Tabs stop at six. No page names the chip-style single choice it now is.
3. **App shell's sidebar vs Icon's dense-row size.** The App shell demo's sidebar is 13px words with 16px icons; the
   Icon page now draws its sidebar at 13/14, per its own Anatomy. One of the two pages should move (the fix agent
   flagged this too; untouched here, so not a finding).
4. **Sheet content in a wide column.** Edge follows the window shows the same content as a 14/20 side column on wide
   screens and a 17/22 sheet on narrow ones; Consumer app allows 16 on a desktop browser but says nothing of 14.
