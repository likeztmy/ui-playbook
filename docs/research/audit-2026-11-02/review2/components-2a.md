# Rule review 2: components, part 2a

Routes: `/components/radio`, `segmented-control`, `select`, `sheet`, `slider`, `switch`. Method:
`.claude/agents/ui-rule-review.md`. Reviewed 2026-11-03 by an agent that did not build these screens.
Decisions in `../decisions.md` are binding: a screen that follows one is not a finding. Each page's source
is `src/pages/components/<slug>.mdx`; where it differs from `skill/ui-playbook/references/`, the `.mdx` wins.

Shots: `shots/review2/components-2a/<route>-<1280|375>-<light|dark>.png` (full page, scale 1, each looked at
whole once), plus the crops named in the evidence column. Measurements were taken with `pnpm shoot --eval`
on the dev server. A generic probe (text contrast against the composited background, text under 12px,
Lucide sizes and strokes, unnamed controls, horizontal overflow) ran on every route at 1280 light and
375 dark; its numbers are quoted as "probe". Known false positives of the probe: Base UI's hidden form
`input`s (1 × 1, `aria-hidden`, `tabindex=-1`), and Lucide icons caught mid-scale (theme toggle's sun,
an un-checked Checkbox's check).

Status: complete for all six routes. Shoots were paused whenever `~/.machine-pulse/state.json` read `busy`.

## Findings

2 must, 5 should, 6 nit. Radio and Switch have no must or should.

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | select: live “Invite people”, Send invite with Email empty or not an address (`src/demos/select.tsx:84-88`) | component-button mistake: “leave the button enabled and explain on press”; component-input Prefer: “Message under each field” | after the click: focus on Email, 0 `aria-invalid`, no error text; no check on leave, so `abc` is invited | Email error on submit (“Enter an email address, like ana@studio.com.”), `aria-invalid`, focus to it; check on leave, clear on the fixing keystroke |
| must | sheet: café pins on every map, case picker chips, case rows (`src/demos/sheet/sheet.module.scss:96-99`, `src/demos/sheet/cases/cases.module.scss:56-59, 118-120`) | component-button: “Focus shows only on `:focus-visible`”; component-badge: “people need … a focus ring” | `outline: 2px solid var(--focus-ring)` is invalid (`--focus-ring` is a box-shadow list): a `:focus-visible` chip measures `outline-style: none`, `box-shadow: none`; `sheet-picker-focus.png` | `box-shadow: var(--focus-ring)`, as the grabber and kit do |
| should | sheet: “What goes in one” case picker (`src/demos/sheet/cases/Cases.tsx`) | component-radio Avoid: “Tab stops on every one … toggles rather than one choice” | 9 `aria-pressed` buttons, 9 Tab stops, one case at a time | A radio group styled as the pills: one Tab stop, arrows choose |
| should | sheet: reopening from **Route** (`src/demos/sheet/Walk.tsx`, `initialFocus={false}`) | sheet Kinds table: focus “moves in when opened from a button” | after Close → Route, focus stays on Route | Move focus into the sheet when Route reopens it; keep `false` only for the sheet open on arrival |
| should | sheet: café pin icon in dark (`src/demos/sheet/sheet.module.scss:70-80`) | lightness-first: “icons that carry state: 3:1” | white on `#eeaa3b`: 2.01:1; `sheet-map-dark.png` | A dark glyph on the amber in dark (≈10:1), or a darker fill |
| should | sheet: body text of every sheet (`src/ui/Sheet.module.scss:55-56`) | system-consumer-app: “Body text 17px on a 22px line” | steps and summary 14/20 at 375, title 17/24 | 17/22 in the sheet, or state on the page which body the demos use and why |
| should | slider: Discrete ticks (`src/ui/Slider.module.scss`, tick rule) | C20: hover demos have “a keyboard path” | ticks wake on hover and drag, not on `:focus-visible` | Add `:focus-visible` and the focus pin to the tick rule |
| nit | segmented: thumb fill vs Anatomy (`src/ui/SegmentedControl.module.scss:27-30, 91-94`) | C42: build and anatomy agree | `surface-raised` + 14% white veil (10% before hydration) | Name the veil in the Anatomy row; one value |
| nit | segmented: live “Tasks” control placement (`src/demos/segmented.tsx` `SegmentedLive`) | segmented table: Sits “Beside what it changes” (Tabs: “Above”) | centred above the grid it changes | Put it on the stage's toolbar row, or reword the table (Gap 3) |
| nit | sheet: pins in `--warning` | colour-means-one-thing: “Each colour says one thing” | `background: var(--warning)` for cafés | A map token or neutral pin (Gap 5) |
| nit | sheet: covering sheets lack `aria-modal` (`src/ui/Sheet.tsx` `Popup`) | sheet Details: APG asks `aria-modal` “only when both” blocked and obscured | `aria-modal` null while dim and `inert` are on | `aria-modal={covering \|\| undefined}` |
| nit | slider: live preview swatches (`src/demos/demos.module.scss:305-308`) | colour-means-one-thing | six non-interactive squares in `accent` | `ink` or `ink-muted` swatches |
| nit | switch and radio: descriptions inside the `<label>` (`src/ui/Switch.tsx`, `src/ui/Radio.tsx`) | component-input: the hint is tied by `aria-describedby` | names read “AutosaveChanges are saved as you type.”; `aria-describedby` null | Tie the description with `aria-describedby`; keep it out of the name |

## Per route

### /components/radio

Shots looked at whole: all four. Probe at 1280 light and 375 dark: no text under 4.5:1 except the
Disabled column's "Option" (2.36 light, 2.07 dark; WCAG exempts unavailable controls, see Gaps), no text
under 12px, every Lucide icon at stroke 2 (16 and 14), no horizontal overflow; unnamed controls: only
Base UI's hidden inputs.

Measured (1280 light): circle 16 × 16, radius 9999; off edge `rgb(134,134,144)` on white, 3.60:1 (dark:
`rgb(108,109,118)` on `rgb(22,23,26)`, 3.49:1); dot 6 × 6 `on-accent`; row gap 8, label 14/20, row 20
tall; circle `margin-top: 2px`; follow-up `.more` indent `16px + space-2` = 24; inline group's second
option starts 19.9 after the first ends (20). Group label 12/16/500 `ink-muted`. Tab stops: only the
chosen radio has `tabindex=0` in every group (`[-1,0,-1,-1]` with 2× chosen). Pressed: `scale: 0.9`,
dot from `scale 0.4` on `ease-spring-smooth`, fade `duration-fast`, reduced motion keeps the fade only
(`src/ui/Radio.module.scss:79-150`). The label wraps the circle, so the whole row is the target; under
`pointer: coarse` the row grows to 44. The live readout is `aria-live="polite"`.

Findings: none.

Ledger, `component-radio`:

| rule | mark | why |
| --- | --- | --- |
| Avoid “Nothing chosen” / Prefer “Standard already chosen” | pass | Prefer has `defaultValue`; Avoid has none, on purpose |
| Avoid “Three buttons, three Tab stops” / Prefer “One group, one Tab stop” | pass | Prefer: one `tabindex=0` per group; Avoid builds `button`s on purpose |
| Avoid “Inline, 16px apart” / Prefer “One column” | pass | Avoid `column-gap: space-4`; Prefer a column |
| Avoid “Square checkboxes” / Prefer “Round radios” | pass | |
| Detail: pressed 0.9, dot from 0.4 on smooth spring, fade `duration-fast`, reduced motion fades | pass | CSS as above |
| Anatomy: circle 16, `radius-full` | pass | 16 × 16, 9999 |
| Anatomy: off `surface`, `line-strong` edge ≥ 3:1 | pass | 3.60 light, 3.49 dark |
| Anatomy: on `accent` fill | pass | |
| Anatomy: dot `on-accent`, 6 | pass | 6 × 6, white |
| Anatomy: circle to label 8 | pass | gap 8 |
| Anatomy: label 14/20 | pass | |
| Anatomy: circle offset 2 | pass | `margin-top: 2px` |
| Anatomy: follow-up indent 24 | pass | `16px + space-2` |
| Anatomy: inline gap 20 | pass | 19.9 measured |
| Anatomy note: the label wraps the circle, whole row one target | pass | `label.row` wraps `Radio.Root` |
| States: Tab on the chosen radio; arrows move and choose, wrapping | pass | Base UI RadioGroup; tab stops measured |
| States grid: Off/On × Default, Hover, Pressed, Focus, Disabled | pass | all ten cells render in both themes |
| Mistake: no default | pass | every Prefer and every variant has a default |
| Mistake: a radio that acts on the spot | pass | the live readout previews the export size; nothing outside the form changes |
| Mistake: Yes and No as radios | pass | none |
| Mistake: hiding the choice in a Select | n/a | |
| Copy: group label names what is chosen | pass | Export at, Shipping, Line endings, Who can comment, Orientation, Image, Format |
| Copy: option labels parallel, short, sentence case, no full stop | pass | |
| Copy: description says what the choice means | pass | “People in Acme can reply.”, “For Retina screens.” |
| Variants: Group, With descriptions, Inline (2–3 one-word labels), With a follow-up (field only while chosen) | pass | Inline is Portrait/Landscape; Width field renders only for `custom` |
| Input (follow-up Width field): label above, trailing unit | pass | label “Width”, trailing `px` |

### /components/segmented-control

Shots looked at whole: all four; plus `segmented-tooltip-hover.png` (hover on “Align center”) and
`segmented-table-375.png`. Probe at 1280 light and 375 dark: no overflow, no text under 12px, Lucide 16
and 14 at stroke 2, no unnamed control. One low-contrast hit, “Dark 1.13”, is the probe reading the
Avoid “Thumb in the accent” label against the track: the accent thumb is a separate absolutely placed
layer, and the label is `on-accent` on `accent` there (not a finding).

Measured (1280 light): every track 32 tall, `padding: 2px`, radius 9999, `fill-control`
(`rgba(24,24,27,.06)`); thumb 28 tall, radius 9997, `shadow-xs` (`0 1px 2px` + 1px ring at .08) over
`surface-raised` with a 14% white veil (`src/ui/SegmentedControl.module.scss:22-32`); segments equal
(75.2 × 3 in the live demo, 78.6 × 3 in “Equal widths”), padding 0 12, 13/500, `ink-muted`
`rgb(94,94,103)`, chosen `ink`. Icon segments 36 wide with a 16 icon and a 12px tooltip naming them.
In a panel: panel 280 wide, radius 18, padding 8, inset 1px `line` ring; the control inside takes radius
10 and its thumb 8. The thumb transitions `translate` and `width` on the smooth spring only after the
first change (`data-moving`), none under reduced motion; segments change colour only, `duration-fast`.
It's a Base UI RadioGroup with `aria-label` (View, Theme, Text alignment, Layout); no visible group
label. The “Which control” prose table at 375 is 343 wide in a 343 column: it wraps, needs no scroll.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | Anatomy row “Thumb” vs the build (`src/ui/SegmentedControl.module.scss:27-30`, and `:91-94` before hydration) | C42: “Where a build and its anatomy disagree … the other changes” | Anatomy says `surface-raised`; the thumb is `surface-raised` + a 14% white veil (10% before the thumb is measured) | Name the veil in the Anatomy row (“`surface-raised`, lifted 14% in dark”) or make it a token; use one value (14%) for both rules |
| nit | Live demo “Tasks” (`src/demos/segmented.tsx` `SegmentedLive`) vs the page's own “Which control” table | segmented-control table: Sits “Beside what it changes”; Tabs: “Above what it changes” | the control is centred above the grid it changes, the place the table gives Tabs | Put it on the frame's header row, left of the grid's edge or at its right end, as a toolbar does; or word the table row “In the toolbar of what it changes” |

Ledger, `component-segmented-control`:

| rule | mark | why |
| --- | --- | --- |
| Avoid “Segments fill in place” / Prefer “One thumb slides across” | pass | Avoid hides the thumb on purpose; Prefer slides one thumb |
| Avoid “As wide as their words” / Prefer “Equal widths” | pass | 39.9 / 118.2 / 78.6 vs 78.6 × 3 |
| Avoid “Thumb in the accent” / Prefer “Raised thumb in greys” | pass | |
| Avoid “Two icons and one word” / Prefer “All icons, with tooltips” | pass | Prefer: three 36 icon segments, each tipped |
| Which control table | pass | prose style (C25), fits at 375 |
| Anatomy: track `fill-control`, `radius-full`, `control-md` 32 | pass | |
| Anatomy: inset 2 all sides | pass | |
| Anatomy: thumb `surface-raised`, `shadow-xs`, `radius-full`, 28 | pass with nit | the veil (finding 1) |
| Anatomy: segment equal widths, 12 padding | pass | |
| Anatomy: label 13/500, `ink-muted`, chosen `ink` | pass | |
| Anatomy: icon segment Lucide 16, 36 wide, with a tooltip | pass | |
| Anatomy: in a panel 18 − 8 = 10, thumb 10 − 2 = 8 | pass | 18 / 8 / 10 / 8 measured |
| Anatomy note: height matches buttons beside it | pass | 32 = `control-md` = Button md |
| Anatomy figure “At 2×”: pill in a pill, 2 inset | pass | 64 tall track, thumb 56, inset 4 at 2× |
| States: Default, Hover on List, Focus on Board, Disabled segment | pass | hover turns List `ink`; disabled `ink-disabled` (exempt) |
| States: Tab lands on the chosen segment; arrows move and choose | pass | Base UI RadioGroup |
| States: thumb on the smooth spring; text colour only, `duration-fast` | pass | CSS as above |
| Mistake: a label that repeats the options; name with `aria-label` | pass | no visible label anywhere; each group has `aria-label` |
| Mistake: six segments on a narrow screen | pass | at most three |
| Mistake: segments that do something | pass | |
| Mistake: changing the page's main content | pass | live demo changes a preview inside its frame |
| Copy: nouns, one word where possible, similar length | pass | Board/List/Timeline, Light/Dark/Auto; “Assigned to me” only on the Avoid side |
| Copy: sentence case; icon segments' tooltips are nouns | pass with note | tooltips “Align left/center/right” are the Copy rule's own example, verb-first; see Gaps |
| Slider panel (In a panel): concentric radius, hairline not shadow | pass | inset ring `line`, no shadow |

### /components/select

Shots looked at whole: all four; plus `select-open-1280.png` (Prefer “Opens over the trigger”, open) and
`select-open-375.png`. Probe at 1280 light and 375 dark: no overflow, no text under 12px, Lucide 16 and 14
at stroke 2, no unnamed control; low contrast only on the Disabled variant's “Viewer” (2.06 light,
2.27 dark; exempt, see Gaps).

Measured (1280 light): trigger 32 tall, radius 10, 1px `line-strong` `rgb(134,134,144)`, padding 12 / 8,
14px value; chevron `ChevronsUpDown` 16, `ink-muted`, its right edge 9 from the trigger's (8 + border).
Open over the trigger (`data-side="none"`): trigger 176 wide at x 736; list 200 wide at x 713 (176 + 16 +
8), so it still covers the trigger's right edge (913 vs 912); the current option's text starts at x 749,
the trigger's text at x 749; its check hangs at x 725. List radius 10, padding 4, rows 32, 14px, the
current row weight 500 with an `accent-text` check `rgb(0,102,204)`, positioner `z-index: 100`, shadow
`0 6px 12px` + `0 1px 2px` + 1px ring. Focus moves into the list on the current option. Still lists:
Prefer has fill only on the keyboard row, the current row unfilled and 500.

Invite form (the live demo): pressing **Send invite** with Email empty only moves the caret into Email:
no message, no `aria-invalid` (`src/demos/select.tsx:84-88`); the field has no check on leave either, so
`abc` is sent as an invite.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | live demo “Invite people”: Send invite with Email empty or not an address (`src/demos/select.tsx:84-88`, `Invite`) | component-button mistake: “leave the button enabled and explain on press”; component-input Prefer: “Message under each field … focus moves to the first one” | after the click: `activeElement` = Email, 0 `aria-invalid`, no error text; form text unchanged; no check on leave in the source | On submit, set Email's error (“Enter an email address, like ana@studio.com.”) with `aria-invalid` and focus to it; check the address on leave, clear on the fixing keystroke (error-timing) |

Ledger, `component-select`:

| rule | mark | why |
| --- | --- | --- |
| When to use; Select or Menu table | pass | prose table (C25) |
| Avoid “Two fills” / Prefer “One fill, plus a check” | pass | Prefer: current unfilled, 500, check; highlight `fill-active` |
| Avoid “Drops below like a menu” / Prefer “Opens over the trigger” | pass | Prefer `data-side="none"`, text on text; both look alike at rest (Gap 4 of `components-1.md`) |
| Avoid “Select… placeholder” / Prefer “Editor already chosen” | pass | |
| Avoid “One down chevron” / Prefer “Up and down chevrons” | pass on the page; see Gaps on C8 | |
| Variants: with a default, with a placeholder (“Choose a reason”), grouped (labels + separators), disabled with a reason | pass | |
| Anatomy: trigger as Input, 32, `radius-lg`, `line-strong` | pass | 32 / 10 / `line-strong` |
| Anatomy: chevron 16, 8 from the right | pass | |
| Anatomy: list as Menu, radius 10, inset 4, rows 32, text 14 | pass | |
| Anatomy: list width the trigger's, or wider | pass | 176 → 200 over the trigger |
| Anatomy: current option 500, leading `accent-text` check, no fill | pass | |
| Anatomy: keyboard highlight `fill-active` | pass | `rgba(24,24,27,.09)` on the highlighted row |
| Anatomy: layer `z-dropdown` 100 | pass | |
| Anatomy note: list shifts so the current text lands on the trigger's; check hangs left; list widens by that column | pass | 749 = 749; check at 725; +24 |
| States: Space/arrows open, typed letter jumps, Enter picks, Esc keeps the old value | pass | Base UI Select (source); focus lands on the current option |
| Mistake: a Select for Yes / No | pass | none |
| Mistake: a Select that runs commands | pass | |
| Mistake: an empty first option as the placeholder | pass | the placeholder is Base UI's, not an option |
| Mistake: long sentences as options | pass | |
| Copy: label a noun | pass | Role, Reason, Font, Email |
| Copy: options short, sentence case, parallel | pass | |
| Copy: placeholder “Choose a reason”, not “Select…” | pass | “Select…” only on the Avoid side |
| Input (Email): label above, example placeholder (C17), error on submit and on leave | **fail** | finding 1 |
| Button (Send invite): never disabled, explains on press | **fail** | finding 1; the button itself is primary, enabled |
| Menu (list): popup radius, inset, rows, `shadow-md` | pass | |

### /components/sheet

Shots looked at whole: all four (each cut into parts to read: the page is 9154 tall at 1280, 12171 at 375);
plus `sheet-map-dark.png` (hero map, dark, 2×) and `sheet-picker-focus.png`. Probe at 1280 light and 375
dark: no overflow, no text under 4.5:1, none under 12px, Lucide 16 and 14 at stroke 2, no unnamed control.

Measured (1280 light), all nine sheets: panel `rgb(255,255,255)` (`surface-raised`), shadow
`0 12px 24px` + `0 2px 4px` + 1px ring (`shadow-lg`), top corners 18, bottom 0; grabber target 44 × 21,
bar 36 × 5 `line-strong` `rgb(134,134,144)`, 8 from the top, `role=button`, `aria-label="Change height"`,
Enter/Space cycle the heights, focus ring as a box-shadow; header 44, title 17/24/600, padding 20 left,
8 right (the Close icon button); content inset 20. Half height: popup at 260 of a 520 area. At full height
(“What it did shows behind it”) the popup starts 32 below the area's top. Dim `scrim`
`rgba(24,24,27,.32)`, fading in 180 ms (`duration-base`); it and `inert` on what's behind switch on the
same `covering` flag (`src/ui/Sheet.tsx` `Area`): on for “Modal at every height” and both full-height
sheets, off for every half-height standard one. Release settles on `ease-spring-gentle`, scaled by swipe
strength; leaves in `duration-base`, `ease-in`; reduced motion shortens to `duration-fast`. Base UI's
`modal={false}` with `disablePointerDismissal`. Every popup is `role=dialog`; none sets `aria-modal`,
covering or not.

Interaction (programmatic clicks in `--eval`, hero demo): Close → sheet closes, focus on **Route**
(`finalFocus`); **Route** → sheet reopens, focus stays on Route; a café pin → content changes to the café,
focus stays on the pin, the `aria-live="polite"` region reads it. Keyboard focus on the nine “What goes in
one” chips: `:focus-visible` is true, yet outline is `none` and there is no box-shadow.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | café pins on every map (hero, What goes in one, every pair: `src/demos/sheet/sheet.module.scss:96-99`), the case picker chips and case rows (`src/demos/sheet/cases/cases.module.scss:56-59, 118-120`) | component-button: “Focus shows only on `:focus-visible`” (a ring, then); component-badge: “people need a hover and a focus ring” | `outline: 2px solid var(--focus-ring)`, but `--focus-ring` is a box-shadow list (`0 0 0 2px #fff, 0 0 0 4px #0071e3`), so the declaration is invalid: measured `outline-style: none`, `box-shadow: none` on a `:focus-visible` chip (`sheet-picker-focus.png`) | `box-shadow: var(--focus-ring)` as the kit does (the grabber already does), or `outline: 2px solid var(--accent); outline-offset: 2px` |
| should | “What goes in one” case picker (`src/demos/sheet/cases/Cases.tsx`) | component-radio Avoid: “Each circle is a button: Tab stops on every one … three toggles rather than one choice” | 9 `aria-pressed` buttons, 9 Tab stops, for one case at a time | A radio group (Base UI RadioGroup styled as these pills) with one Tab stop and arrows, or a Select at 375 |
| should | hero and every standard sheet: reopening from **Route** (`src/demos/sheet/Walk.tsx`, `initialFocus={false}`) | sheet Kinds table: Focus on open “stays, or moves in when opened from a button”; SKILL moment: “Focus moves in” | after Close → Route, `activeElement` is still Route | Keep `initialFocus={false}` for the sheet that's open on arrival; when Route reopens a closed sheet, move focus to its title or first control |
| should | café pins in dark (`src/demos/sheet/sheet.module.scss:70-80`) | lightness-first: “Control borders, focus rings, icons that carry state: 3:1” | white `Coffee` icon on `--warning` `#eeaa3b`: 2.01:1 (light `#9d5e02`: 5.20:1); `sheet-map-dark.png` | In dark, a dark glyph on the amber (`#0e0f11` on `#eeaa3b` is about 10:1), as `on-accent` already flips to dark in other looks; or a darker pin fill |
| should | every sheet's body: summary, steps, café details (`src/ui/Sheet.module.scss:55-56`, `src/demos/sheet/sheet.module.scss`) | system-consumer-app: “Body text 17px on a 22px line”; this scene is a phone map app | content 14/20 at 375 (`stepFont` 14px, `summaryFont` 14px) while the title is 17/24, iOS's headline over a 17 body | Body 17/22 in the sheet (16 on a desktop browser, per the system), or say on the Sheet page that its demos use the work-tool body and why |
| nit | café pins use `--warning` as a map colour | colour-means-one-thing: “Each colour says one thing” | pin `background: var(--warning)`; the page uses `warning` nowhere else as a warning | A map token (`--map-poi`) or a neutral pin with the accent when picked; or note that content colour on a map is exempt |
| nit | every covering sheet (`src/ui/Sheet.tsx` `Popup`) | sheet Details: “WAI-ARIA asks for `aria-modal` ‘only when both’ … blocked and visibly obscured” | `aria-modal` null on the modal and full-height sheets, while dim and `inert` are on | `aria-modal={covering || undefined}` on `Drawer.Popup`, so the page's own condition is met in full |

Ledger, `component-sheet`:

| rule | mark | why |
| --- | --- | --- |
| What goes in one: standard for what's about the screen; modal for a short pick; not checkout, settings, a sheet on a sheet, unasked messages | pass | the case picker's Good/Bad sets say exactly this; picker itself fails (findings 1, 2) |
| Standard: no dim, no press outside closes it, until it covers | pass | dim off and `inert` false at half; `disablePointerDismissal` |
| Standard: focus stays when content changes | pass | pin press keeps focus on the pin |
| Standard: Close, Escape or a swipe down closes it | pass | Close and Escape (area-scoped) in source; swipe by Base UI Drawer |
| Modal: a dim, and a press on it closes | pass | “Modal at every height”: dim on; `pressDim` closes a modal kind |
| Modal: focus moves in; behind `inert` | pass | `inert` on; Base UI focuses the popup |
| Kinds table: press outside on a covering standard sheet goes back a height | pass | `pressDim` → `below` |
| Kinds table: focus on open moves in when opened from a button | **fail** | finding 3 |
| Avoid “Modal at every height” / Prefer “Standard up to half height” | pass | |
| Avoid “Sheet stays over the map” / Prefer “Sheet lowers to half” | pass | `reveal` lowers to 0.5 on Add stop; both look alike at rest (see Gaps) |
| Avoid “Scrolling raises the sheet” / Prefer “Scrolling scrolls the list” | pass | `scrollGrows` only on Avoid; Prefer content has `data-base-ui-swipe-ignore` |
| Edge follows the window: narrow sheet from the bottom, slider for width | pass | slider sits beside the stage at 1280, under it at 375 |
| Detail: flick vs slow drag, rubber band past top, 6px axis lock | pass by source | Base UI Drawer; not driven by touch here |
| Detail: dim and `inert` change on the same frame | pass | one `covering` flag |
| Keyboard: Escape closes; Tab reaches it after what's behind; content changes announced politely; grabber is a height control | pass | portal after `.behind`; `aria-live`; grabber role/label/keys |
| Anatomy: panel `surface-raised`, `shadow-lg` | pass | |
| Anatomy: top corners 18 | pass | |
| Anatomy: gap at full height 32 | pass | |
| Anatomy: grabber `line-strong`, 8 from top, 36 × 5 | pass | |
| Anatomy: header 44, title 17/24/600, actions trailing | pass | |
| Anatomy: inset 20 | pass | content 20; header 20 left, 8 right for the icon button |
| Anatomy: heights half and full | pass | 0.5, 1 |
| Anatomy: dim `scrim`, `duration-base` | pass | 0.32 ink, 180 ms |
| Anatomy: motion gentle spring, quicker after a fling, leaves in `duration-base` accelerating | pass | |
| Mistake: a modal sheet over a map | pass | only on the Avoid side |
| Mistake: a full-height sheet that doesn't block | pass | full-height standard sheets dim and block |
| Mistake: trusting `modal={false}` | pass | `disablePointerDismissal` set, Escape scoped to the area |
| Mistake: a scroll that grows the sheet | pass | Avoid only |
| Mistake: sheets on sheets | pass | a Bad case |
| Copy: title names what's in it | pass | Walk to the ferry, Harbour Beans, Kettle & Crumb |
| Copy: Close as an icon with its label; a way back names where it goes | pass | `aria-label="Close"`; “Back to route” |
| Button (Route over the map): an overlaid pill button is secondary (C38) | pass | `size="sm"` secondary |
| Button (Add stop / Remove stop): names its result | pass | |
| Tables (Kinds side by side): prose style, fits at 375 | pass | |

### /components/slider

Shots looked at whole: all four. Probe at 1280 light and 375 dark: no overflow, no text under 4.5:1
(label and value `ink-muted` on `fill-control` included), none under 12px, Lucide 16 and 14 at stroke 2,
no unnamed control.

Measured (1280 light, live “Properties”): panel 240 wide, radius 18, padding 8, 1px inset `line` ring
`rgb(228,228,232)`, no shadow; row 224 × 32, radius 10, `fill-control`; fill a second `fill-control`
(hover `fill-control-hover`); label 13/500 `ink-muted` 12 from the left; value Geist Mono `tabular-nums`,
12 from the right; handle 3 × 16, `ink`, radius full, opacity 0 at rest, .4 hover, .85 dragging, .1 when it
would sit on the label or value; ticks 1 × 8 `line-strong`, opacity 0 at rest. 23 sliders, each
`role=slider`, `tabindex=0`, `aria-label` = its label, `aria-valuetext` with the unit (“6px”). Keys:
arrows set at once (Shift ×10), PageUp/Down ×10, Home/End glide; a click glides to a stop or the nearest
tenth; a drag past an end stretches the row by `10 × √(over/range)`, springing back on release; reduced
motion drops every transition (`src/ui/Slider.tsx:95-130`, `Slider.module.scss`). Live preview swatches are
`accent` `rgb(0,113,227)`.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | Discrete sliders (Variants “Discrete”, live “Columns”): ticks (`src/ui/Slider.module.scss` `.slider:hover … .tick`) | C20: “Every hover demo has … a keyboard path; on touch, a tap shows what hover shows” | ticks wake on `:hover`, `[data-dragging]` and the hover pin only; `:focus-visible` wakes label, value and fill but not ticks, so a keyboard user never sees the stops the Variant row promises | Add `.slider:focus-visible` and `[data-pin~='focus']` to the tick rule (the handle may stay hidden) |
| nit | live “Properties” preview swatches (`src/demos/demos.module.scss:305-308`) | colour-means-one-thing: “Each colour says one thing” (accent: what you can act on, where you are) | six `accent` squares that can't be pressed, beside rows that are grey | Paint the swatches `ink` or `ink-muted` (Segmented's preview uses greys), so opacity still reads |

Ledger, `component-slider`:

| rule | mark | why |
| --- | --- | --- |
| Avoid “4 px track, 16 px knob” / Prefer “The whole 32 px row drags” | pass | |
| Avoid “Eases 400 ms behind the drag” / Prefer “Follows the pointer exactly” | pass | `[data-dragging]` drops the transition |
| Avoid “Stops dead at the end” / Prefer “Stretches up to 10 px” | pass | √ falloff, `MAX_STRETCH` |
| Avoid “Handle over the value” / Prefer “Handle fades to 10%” | pass | `[data-dodging]` → .1 |
| Avoid “Proportional digits” / Prefer “Tabular digits” | pass | Geist Mono, `tabular-nums` |
| Variants: Continuous, Fine (0.20), Discrete (ticks on hover, click lands on a stop), In a panel | pass with finding | Discrete ticks have no keyboard path (finding 1) |
| Anatomy: row `control-md` 32, `radius-lg` 10, `fill-control` | pass | |
| Anatomy: fill another `fill-control`; hover `fill-control-hover` | pass | |
| Anatomy: label 13/500, 12 from the left | pass | |
| Anatomy: value Geist Mono, `tabular-nums`, 12 from the right | pass | |
| Anatomy: handle 3 × 16, `radius-full`, `ink` | pass | |
| Anatomy: ticks 1 × 8, `line-strong`, ten stops or fewer | pass | |
| Anatomy: in a panel 18, `line` hairline, no shadow, inset 8 → row 10 | pass | |
| Anatomy note: label and value `ink-muted` at rest, `ink` hovered, dragged or focused | pass | rule includes `:focus-visible` |
| States grid: Default, Hover, Dragging, Focus, Handle steps aside | pass | focus ring `--focus-ring` box-shadow |
| States: 3px before a drag; a click glides on the smooth spring to a stop or tenth; arrows 1, Shift 10, Home/End | pass | source |
| Mistake: no visible value | pass | every slider shows its value |
| Mistake: a slider for a precise number | pass | Fine shows 0.20 for a judged bounce |
| Mistake: steps finer than the pixels | pass | 0–100 on 224, 0–12, 1–6 |
| Mistake: animating keyboard steps | pass | arrows `set` at once |
| Copy: label a noun | pass | Radius, Opacity, Columns, Bounce |
| Copy: value with unit attached, bare when obvious | pass | 6px, 64%, Columns 3 |

### /components/switch

Shots looked at whole: all four. Probe at 1280 light and 375 dark: no overflow, no text under 4.5:1, none
under 12px, Lucide 16 and 14 at stroke 2, no unnamed control (28 switches).

Measured (1280 light): track 32 × 20, radius 9999; knob 16, white `knob`, `0 1px 2px rgba(0,0,0,.18)`
(`shadow-knob`); inset 2 (knob at x 638 off, 650 on: travel 12); off `line-strong` `rgb(134,134,144)`
(3.60:1 on white; dark `rgb(108,109,118)`, 3.49:1), on `accent` `rgb(0,113,227)`; track colour
`transition: background-color 120ms`; knob on `ease-spring-snappy` (a `linear()` curve that never passes
1: no overshoot). Leading placement: label starts 12 after the switch (614.4 → 626.4). Disabled: track
`fill-control` (light `rgba(24,24,27,.06)`, dark `rgba(255,255,255,.09)`), on `accent-soft`, knob
`ink-disabled`. Master and subordinate: the two children are `disabled={!snap}`. Every Base UI switch has
`role=switch` and `aria-checked`.

Findings:

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | every switch with a description (Variants “Settings row”, “Master and subordinate”; `src/ui/Switch.tsx`), and the same build in Radio (`src/ui/Radio.tsx`) | component-input Anatomy: the hint is tied to its field (`aria-describedby`) | the description sits inside the wrapping `<label>`, so it joins the name: “AutosaveChanges are saved as you type.”, “Snap to gridMoved objects land on grid lines.”; `aria-describedby` is null | Give the description an id and point `aria-describedby` at it; take it out of the label's name (`aria-labelledby` on the label text) |

Ledger, `component-switch`:

| rule | mark | why |
| --- | --- | --- |
| Switch or Checkbox table | pass | prose style, fits at 375 |
| Avoid “Waits for Save” / Prefer “Applies at once” | pass | Save only on the Avoid side |
| Avoid “Label shows the state” / Prefer “Label names the setting” | pass | “Grid on” only on the Avoid side |
| Avoid “Knob holds its shape” / Prefer “Knob stretches 4 px” | pass | |
| Variants: settings row (trailing), leading, master and subordinate (children wait, disabled), without a label (`aria-label`) | pass | “Notifications for Design team” names the unlabelled one |
| One placement per context | pass | live, scene and settings list trail; “Leading” shows the form case alone |
| Anatomy: track 32 × 20, `radius-full` | pass | |
| Anatomy: knob 16, `radius-full`, `knob`, `shadow-knob` | pass | |
| Anatomy: inset 2 | pass | |
| Anatomy: off `line-strong` ≥ 3:1 | pass | 3.60 / 3.49 |
| Anatomy: on `accent` | pass | |
| Anatomy: travel 12 | pass | 638 → 650 |
| Anatomy: label to switch 12 | pass | leading 12; trailing rows in a column at the edge |
| Anatomy: disabled `fill-control`, on `accent-soft`, knob `ink-disabled` | pass | both themes |
| Anatomy figure “A settings list”: labels on one left edge, switches in one column | pass | |
| States grid: Off/On × Default, Hover, Pressed, Focus, Disabled | pass | |
| States: Space toggles; snappy spring, no overshoot; track fades `duration-fast` | pass | |
| Mistake: a switch in a form with Submit | pass | only the Avoid side |
| Mistake: On / Off text | pass | none |
| Mistake: a confirmation after flipping | pass | none |
| Mistake: colour as the only difference | pass | knob position differs by 12 |
| Copy: label the setting, never the state | pass | Show grid, Show rulers, Autosave, Public link, Snap to grid … |
| Copy: description says what on means | pass | “Moved objects land on grid lines.”, “Changes are saved as you type.” |

## Shared ledger: principles, systems and neighbouring components

Marked across all six routes from the per-route measurements above. A row that failed on a route points to
that route's finding.

| reference | rule | mark | why |
| --- | --- | --- | --- |
| lightest-boundary | heading and space before a line, a line before a box; no box in a box | pass | figures are stages (C3); panels in slider/segmented are the one unit set apart; Gallery rows split by hairlines |
| lightest-boundary | lines only between repeated rows, lighter than the container's edge | pass | Anatomy and prose tables; sheet step lists have no lines |
| space-groups-by-ratio | inside a group tighter than between groups | pass | radio 8 within, 16 to readout; select label/field/hint 4; switch rows; slider panel 4 between rows, 8 inset |
| every-line-does-a-job | no line that says what the reader can see | pass | no eyebrows or taglines in any demo; kind line above titles per C4 |
| lightness-first | text 4.5:1; control edges and state icons 3:1 | **fail** (should) | sheet café icon 2.01:1 in dark; every text passes (probe), radio and switch edges 3.49–3.60 |
| colour-means-one-thing | each colour says one thing | **fail** (nits) | sheet pins in `warning`; slider preview swatches in `accent` |
| grey-until-it-matters | grey carries the screen | pass | segmented thumb, slider rows, select all grey; accent only on chosen radio/switch, links, checks |
| concentric-radius | inner = outer − inset | pass | segmented in a panel 18 − 8 = 10, thumb 8; slider rows 10 in 18 / 8; switch knob in track by shape |
| a-shadow-says-how-high | floating = shadow; resting panels get a hairline | pass | select list `shadow-md`; sheet `shadow-lg`; slider/segmented panels inset `line`, no shadow; segmented thumb `shadow-xs` (C30: ring + no border) |
| nothing-shifts | nothing moves unless asked | pass | radio follow-up field appears only on choosing Custom; select list over the trigger keeps text in place |
| never-too-busy-to-listen | an animation turns from where it is; no blocked press | pass | segmented thumb, slider glide, switch knob are CSS transitions on transform/translate; keyboard steps land at once |
| attention-wears-off | what repeats is brief (≈120 ms) | pass | colour fades `duration-fast` 120; dim 180 |
| how-waiting-feels | spinner thresholds, skeletons | n/a | no waits on these routes |
| error-timing | check on leave, required waits for submit, error at its field | **fail** (must) | select invite form (Select finding 1) |
| hover-forgives / C20 | hover demos have a rest state and a keyboard path | **fail** (should) | slider ticks hover-only (Slider finding 1) |
| the-faster-way | shortcuts taught on the slow path | n/a | no shortcuts on these routes |
| reading-text / C25 | prose tables lighter, scroll when narrow; 12px floor | pass | Which control, Select or Menu, Kinds side by side, Switch or Checkbox all fit at 375 |
| work-tool | 13 in dense controls, 12 meta, 32 controls | pass | segmented 13, slider 13, radio/switch labels 14 (form body), group labels 12 |
| consumer-app | 17 body, 44 targets | **fail** (should) on text | sheet body 14 (Sheet finding 5); targets pass (Button `::after` 44 under coarse pointer, pins 28 + 8 each side, radio/switch rows +12 under coarse) |
| component-button | never disabled, explain on press; focus ring on `:focus-visible` | **fail** (must) | select invite form; sheet demo focus rings |
| component-input | label above, placeholder an example (C17), error at the field | **fail** (must) on errors | select invite Email; placeholders pass (`ana@studio.com`) |
| component-menu | select list as Menu: radius 10, inset 4, rows 32, check column | pass | |
| component-tooltip | icon-only controls named and tipped | pass | segmented icon segments; sheet Close |
| component-icon / C6 | Lucide only, stroke 2, 16 default, 14 in dense | pass | probe on every route |
| component-radio | one Tab stop, arrows choose, for one-of-few | **fail** (should) | sheet case picker (Sheet finding 2) |

## Owner's rules (`~/.claude/CLAUDE.md`)

| rule | mark | where |
| --- | --- | --- |
| One grid; icons in one column | pass | radio circles, switch tracks, select check column all hold one column; segmented icon segments equal |
| Labels start on one vertical line | pass | radio/select/switch labels share the group's left edge; master/subordinate indents only real children |
| Trailing meta right-aligned in one column | pass | slider values 12 from each row's right; switch tracks in one column in the settings list; Anatomy Value column |
| Lightest boundary that holds; no box in a box | pass | panels hold one unit (slider rows, segmented in a panel) |
| Empty states name the next step | n/a | none on these routes |
| Focus follows the action, never `<body>` | **fail** | sheet: reopening from Route leaves focus on Route; picker and pin focus invisible; select invite moves focus but says nothing |
| A user action needs no Agent gate | pass | |

## Gaps in the playbook

1. **C8 against the Select page.** The decision reads “Choosing one value from a list is a Select, with one
   chevron”; the Select page still prefers “Up and down chevrons” and its table says “Chevron: Up and down”.
   If “one chevron” means one icon (`ChevronsUpDown`), say so in C8; if it means a single down chevron, the
   Select page, its table and `src/ui/Select.tsx` haven't followed it. Reviewed here as the page states it.
2. **Segmented control Copy contradicts itself.** “Icon segments take the same nouns as tooltips: **Align
   left**”: *Align left* is a verb phrase. Either allow “a noun or the action” for icon tooltips, or change
   the example (*Left*, *Centre*, *Right*).
3. **Segmented placement.** The page's table puts a segmented control “Beside what it changes” and Tabs
   “Above”, but the live demo, Linear's Board/List and Apple's view switchers sit above, in the toolbar.
   The table should say “In the toolbar or inspector of what it changes”.
4. **Sheet body text size.** The Sheet Anatomy gives the title 17/24 but no body size; its scenes are phone
   apps, where the consumer system asks 17/22. Name the body size on the Sheet page (with the system it
   follows), so demos and builds stop defaulting to 14.
5. **Content colours in demos.** No rule says which tokens a scene's content may use: maps, previews and
   swatches borrow `warning` and `accent`. A short note on the colour pages (content colour may come from a
   content palette, never from status or accent tokens) would settle it.
6. **Anatomy tables skip the group label and descriptions.** Radio, Select and Switch render a 12/16/500
   `ink-muted` group label and 12/16 descriptions that no Anatomy row names, so they can't be checked.
7. **Still open from `components-1.md`:** disabled text relies on the WCAG exemption (Radio “Option” 2.07,
   Select “Viewer” 2.06) with no floor saying so (its gap 5); and comparisons that differ only on interaction
   look identical at rest (its gap 4): Select “Opens over the trigger”, Sheet “What it did shows behind it”,
   Segmented “One thumb slides”.
8. **A token-shaped trap.** `--focus-ring` is a box-shadow list; used in `outline:` it silently draws nothing
   (Sheet finding 1). `scripts/lint-tokens.mjs` could reject `outline` with `var(--focus-ring)`.
