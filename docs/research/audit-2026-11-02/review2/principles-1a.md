# Rule review 2: principles, part 1a

Routes: `/principles/a-shadow-says-how-high`, `/principles/attention-wears-off-waiting-doesnt`,
`/principles/colour-means-one-thing`, `/principles/concentric-radius`, `/principles/error-timing`.

Method: `.claude/agents/ui-rule-review.md`. Decisions in `../decisions.md` are binding. Reviewed 2026-11-03 against the
dev server through `pnpm shoot` only. Each reference's source is `src/pages/principles/<slug>.mdx`.

Shots: `shots/review2/principles-1a/<slug>-<1280|375>-<light|dark>.png`; crops are `x-*.png`.

Written route by route; the combined findings table and the shared ledger (floors, reading page, owner's rules) are
at the end.

## Route 1: `/principles/a-shadow-says-how-high`

Shots: `a-shadow-says-how-high-{1280,375}-{light,dark}.png`, all four looked at whole; 1280 light in five slices, the
375 pair laid out in columns, the dark demos cropped (`x-shadow-dark-demos.png`, `x-shadow-layers-prefer-dark.png`).
Probe (every text node in `main`, both themes): nothing under 12px, no text under 4.5:1, no sideways scroll at 375.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | "Two shadows, two jobs" Prefer (`src/demos/shadow/Layers.tsx:7-9`), and the same in dark on "Longer drop while held" (`Pickup.tsx:5-6`) and the Raise tweak (`Raise.tsx:20`) | a-shadow-says-how-high: "In dark mode the same steps keep their hairline, and the raised surface is the lighter one" | In dark every shadow on these stages is the light-mode one, `oklch(0.3 0.01 75 / 0.08)` hairline and `/0.06`–`/0.22` drops, on a card `rgb(22,23,26)` over a desk `oklch(0.16)`. The hairline and drop vanish: the Prefer card shows no edge, and the Edge / Distance checkboxes change nothing visible. The page's own Desks demo marks exactly this "Light mode's shadow" as the Avoid. `x-shadow-layers-prefer-dark.png` | Give each shadow a `light-dark()` pair, the dark half after the Desks "A lighter surface" way: `0 0 0 1px oklch(1 0 0 / 0.09)` edge, a darker drop, and the card on the raised surface. Or pin these stages `defaultTheme="light"` and say the dark answer is the Desks demo below. |
| should | "Longer drop while held" Prefer, `Pickup.tsx:6` (`HELD`) and its caption `Pickup.tsx:64` | a-shadow-says-how-high: "the darkness stays between 6% and 8%"; the caption: "a longer drop, the same darkness" | Rest drop is `/0.06`; held drop is `0 12px 24px … / 0.12`, twice as dark. The caption says the opposite of the code. | Held: `0 12px 24px / 0.08` (the `shadow-lg` values), or use `var(--shadow-lg)`. |
| should | "Same shadow / Longer drop while held" (`Pickup.tsx:34-44`) | C20: every hover demo has a visible state at rest and a keyboard path (a drag demo is the same case) | The card takes only pointer events: no `tabindex`, no role, no key handler. A keyboard user can't see the lift. | Make the card focusable (`tabindex="0"`, a name such as "Q4 roadmap, drag me") and lift it while Space is held. |
| nit | "Two shadows, two jobs", both sides (`Layers.tsx:16-24`) | Owner's rule: one grid | The Prefer side's checkboxes sit inside its stage, so its desk starts 16px higher than the Avoid's desk (1280 light slice 2: desk tops differ by 16px). The two halves of one comparison don't line up. | Put Edge / Distance in a Tweak panel or under both stages, or give the Avoid side an equal foot. |
| nit | "Shadows on everything / on the menu only" (`Overlap.tsx:14-45`) | C27: a picture of UI is `aria-hidden`, with a text equivalent beside it | The file list is a still picture (spans styled as a field and a "New file" button, `role="presentation"` only on the menu), but a screen reader reads "Search files New file Q4 roadmap … Rename Duplicate Archive Delete" as if it were live. | `aria-hidden` on the stage content; the caption is already the text equivalent. |

### Ledger

- What a shadow is for (lies over, could come away): **pass**: every shadow on the page's stages is on a menu, a held or lying card.
- Avoid: Shadows on everything / Prefer: Shadow on the menu only: **pass**. Prefer: only the menu casts one, `shadow-md` values (6px 12px 7%, 1px 2px 4%, 1px ring). Avoid shows only its own mistake.
- Avoid: Same shadow while held / Prefer: Longer drop while held: **pass** at rest in light; **fail** on darkness (should) and keyboard (should); dark (must).
- When to use: covers / picked up / one thing on a ground: **pass**.
- And not: to group / to rank / to part from a plain ground: **pass**: rows, fields and the "New file" button on the Prefer side cast none.
- How high: the offset (Raise tweak, readout ≈ 1.31 × offset, light patch lifts nothing): **pass** in light; readout 12px mono. Dark: **fail** (must).
- Avoid: One dark 24 px drop / Prefer: Hairline, contact and drop: **pass** in light; Avoid shows its smudge. Dark: **fail** (must). Alignment nit.
- In the dark, depth is lightness (Desks, four ways): **pass**. Stage pinned dark (`defaultTheme="dark"`) with caption and controls in the page's theme (C15). Each way has an icon and its word, so the verdict isn't colour alone (C9).
- One light, few heights; a hover lifts one step, never two: **pass** for tokens (`--shadow-xs…lg`, one colour `#18181b`). The held card jumps from the xs drop to a 12px drop, but that's a pick-up, not a hover.
- The playbook's heights table: **pass** against `src/styles/tokens.css:93-96` (1/2, 2/4, 6/12, 12/24; alphas 6%, 6%, 7%, 8%). Lines between rows, full width, none after the last (C21).
- When it doesn't apply (glass): **n/a**: no glass on the page.
- Where the playbook applies it: **n/a** here; Card, Menu, Dialog and Toast are reviewed on their own routes.
- Concentric radius inside the Raise tweak: **pass**: panel 18 / inset 8 / segmented 10 / thumb inset 2 → 8; slider 10. Menu 10 / inset 4 / item 6.
- component-menu (menu drawn from Menu's parts): **pass**: icons in one column, Delete last after a separator in danger, 32px rows, 13px.
- component-segmented-control, component-slider, component-checkbox (in demo controls): **pass**: library parts; thumb raised at `shadow-xs`, not filled.
- Frame tools: the theme switch is a ghost icon button, `aria-label="Switch theme"`, in a `Tip` with the same words: **pass** (component-button, component-tooltip).
- C5 at 375: switch reads Avoid / Prefer, Prefer shown first, verdict in the caption: **pass**.

## Route 2: `/principles/attention-wears-off-waiting-doesnt`

Shots: `attention-wears-off-waiting-doesnt-{1280,375}-{light,dark}.png`, all four looked at whole; demos cropped in both
themes (`x-attention-demos-{light,dark}.png`), a switch flipped on (`x-attention-switch-on.png`), the Inbox foot at 2×
(`x-attention-inbox-foot.png`). Probe at 1280 and 375, both themes: nothing under 12px, no text under 4.5:1, no sideways
scroll.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | "Bounce is not the cost": the hand note "flip one a few times" (`src/components/note/Note.astro`, `Note.module.scss:17,53`) | SKILL floor and component-icon: no SVG drawn by hand; C7 names the home hero's notes as the one exemption. colour-means-one-thing: "Accent text is a link" | Rough.js draws the arrow and a mark under the first switch (1280, both themes). The note is set in `--accent-text` and is not a link. Already raised in `principles-2.md` (never-too-busy-to-listen); still open, and it's on this route too. | Owner's call (see Gaps): widen C7 on the Icon page to name these notes, or drop the drawn arrow and mark. Either way, set the note in `ink-muted`, not the link colour. |
| should | "450 ms flight / 120 ms close-up", both sides: the Inbox foot (`src/demos/novelty/novelty.module.scss:37-44`, `.rows { overflow: hidden }`) | Owner's rule, generated visuals: no clipped text. the-lightest-boundary-that-holds: a line splits repeated rows, not a row from its own sliver | The sixth row, "Calendar · Reminder: review at 10", is cut 12px into its box: its divider and the tops of its glyphs show between "Design Weekly" and the tally's own top line (`x-attention-inbox-foot.png`). Two lines 12px apart with a sliver of letters between. | Size the list to whole rows (five rows: `height` a multiple of the row height), or fade the last 24px with a mask so the cut reads as "more below". |
| nit | "Delight belongs to rare moments": confetti pieces (`src/demos/novelty/Burst.tsx:5`) | colour-means-one-thing: the accent says "do this now"; each status colour has one meaning | The pieces are `--accent`, `--success` and `--warning`: the action hue and two status hues used as decoration. | Take confetti from the prose key hues (`--key-1…3`), which the colour page keeps clear of action and status, or say on the colour page that a celebration is content. |

### Ledger

- The rule (frequent → short, never holds the next press): **pass**.
- Avoid: 450 ms flight, press waits / Prefer: 120 ms close-up, no wait: **pass**. Prefer closes up in `--duration-fast`; Avoid counts lost presses; the tally is `aria-live="polite"`; Archive is a real `Button`, so a held Enter repeats. Reduced motion handled (`novelty.module.scss:68`). Inbox foot: **fail** (should).
- Bounce is not the cost (three switches: expressive, standard, blocking): **pass**. Each is the library `Switch`, the label row is the target (`LABEL`, 280 × 36), the label names the setting with its description below. On, each fills in its key hue (violet, teal, magenta), matching the keyed words in the prose. Readout "0 presses lost" 12px mono.
- Delight belongs to rare moments (Confetti on every tick / on the last tick): **pass** for the verdict; confetti is `aria-hidden`; library `Checkbox` rows. Colour nit.
- Show the result first: **n/a**: text only.
- How to set it (table): **pass**: lines between rows, full width (C21); fits 343px at 375 without scrolling.
- When it doesn't apply: **n/a**: text only.
- component-switch: label names the setting, never its state: **pass**. component-checkbox: whole row is the target: **pass**. component-button (Archive with leading icon, ghost Reset): **pass**.
- Note on hand-drawn annotation: **fail** (should); hidden at 375, where nothing it says is lost.
- C5 at 375: Avoid / Prefer switch, Prefer first, verdict in the caption: **pass**.

## Route 3: `/principles/colour-means-one-thing`

Shots: `colour-means-one-thing-{1280,375}-{light,dark}.png`, all four looked at whole; demos cropped in both themes
(`x-colour-{a,b}-{light,dark}.png`). Probe at 1280 and 375, both themes: one size under 12px (below); one contrast hit,
"Board" at 1.00 on the Avoid side, is the probe reading the white stage instead of the accent thumb that sits under
the label as a sibling (white on accent, the Avoid's own point). No sideways scroll.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | All three editor specimens: the "Comments 3" tab count (`src/ui/Tabs.module.scss:95`, `font-size: 11px`; demo `src/demos/colour.tsx:37`) | system-work-tool: "Labels and meta: 12px; nothing smaller in a row someone reads" | 11px at 1280 and 375, both themes (probe: `3 @593,607 11px`, `@593,1065`, `@537,1775`). It follows component-tabs Anatomy ("Count: mono 11"), so the two pages disagree (see Gaps). | Per C42, the floor wins: Tabs count mono 12, height 18 → 20, and the Tabs Anatomy row changes with the CSS. |
| nit | "It still reads without colour" (`src/demos/colour.tsx:120-128`, `m.greyscale` + `s.fill`) | Owner's rule: one grid; the specimen is the same picture as the two above it | The two editors above sit centred at x 360–920 in a 720 stage (80 each side). The greyscale one sits at 304–864: 24 left, 136 right. The same picture three times on one page, two left edges. | Centre it like the others (drop `s.fill`, or `justify-content: center` on the greyscale wrapper). |

### Ledger

- The rule (the accent says "do this now"; chosen = pale tint behind a shape): **pass**.
- Avoid: Accent on every current state / Prefer: Accent only on Publish: **pass**. Prefer: tab bar in ink, segmented thumb raised (white, `shadow-xs`), current tool a tint, chosen row `accent-soft`, Publish the only solid fill, at 1280 and 375, both themes. The Avoid shows only its own mistake. Real `Tabs`, `Toolbar`, `SegmentedControl` and a `listbox` with roving `tabIndex` and arrow keys.
- It still reads without colour: **pass** (bar, raised segment and shade read in grey). Alignment nit.
- Avoid: Hover in the selection tint / Prefer: Hover in neutral grey: **pass**. One row shows the hover at rest (`PINNED`), so it reads with no pointer and on touch; arrows move the chosen row (C20).
- Avoid: Counts in red too / Prefer: Red only for Payment failed: **pass**. Counts right-aligned in one column (right edges 548/548/548 and 916/916/916); "Payment failed" has `CircleAlert` and its word, `role="status"` (C9). Prefer counts are `ink-muted` on a 6% fill; the caption's "ink on grey" is loose but the contrast holds.
- Avoid: Accent on plan details / Prefer: Accent only on Manage billing: **pass**. Only the real `<a>` wears `accent-text` (C13).
- When it doesn't apply (content, status beside status): **n/a**: text only.
- Where the playbook applies it: the "These pages" line (key hues violet, teal, magenta): **pass** here; on the attention route the hand note in `accent-text` breaks "Accent text is a link" (Route 2).
- component-tabs, component-toolbar, component-segmented-control (inside the specimens): **pass**, except the 11px count (should).
- Comparison layout: the first comparison stacks Avoid above Prefer at every width and shows both at 375 with no switch; C5 governs switches only, so **n/a**.

## Route 4: `/principles/concentric-radius`

Shots: `concentric-radius-{1280,375}-{light,dark}.png`, all four looked at whole; the two key demos at 2×
(`x-concentric-key-{avoid,prefer}.png`). Probe at 1280 and 375, both themes: nothing under 12px, no text under 4.5:1,
no sideways scroll.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | Every nest specimen: the Tweak, "Both corners 20 px / Inner 20 − 10 = 10 px" (`src/demos/demos.module.scss:43-47`, `.nestInner`) | colour-means-one-thing: where the accent marks what's chosen it is a pale tint; "These pages: a colour keyed into the prose is violet, teal or magenta" | The inner shape is `accent-soft` with a 35% accent ring: the selection tint on a shape nothing has chosen, on the page right before the colour page that reserves it. | Use a key hue (`--key-1` soft) or `surface` with a `line-strong` ring for the inner shape. |

No must or should on this route.

### Ledger

- The rule (inner = outer − inset − border): **pass**. Tweak readout "18 − 8 − 0 = 10px" (12px mono); at inset ≥ radius it says "inner keeps its own 8px" (`concentric.tsx:27-30`), as the prose says.
- Avoid: Both corners 20 px / Prefer: Inner 20 − 10 = 10 px: **pass**; the swollen corner shows at 1280 and 375, both themes (the nest is a step off the stage in dark too).
- Avoid: Key corner 10 px / Prefer: Key corner 10 − 3 − 1 = 6 px: **pass**. Measured under `zoom: 2`: field 150 × 32, 1px border, key 36 × 24, insets 3 top and right; key radius 10 (Avoid) and 6 (Prefer). The difference is visible at 2× (`x-concentric-key-*.png`).
- Precision's pairings table: **pass** against `tokens.css:13-19` (sm 6, md 8, lg 10, xl 18) and the panels measured on Route 1 (panel 18 / 8 / segmented 10 / thumb 8; menu 10 / 4 / item 6).
- Common mistakes: uneven inset / one radius for everything: **pass**: the nest pads evenly, and the page's own controls use four radii.
- Tweak panel concentric: **pass** (as Route 1). Panel sits 16px under the stage at 375.
- Tables: lines between rows, full width; wraps without scrolling at 343px: **pass** (C21, C25).
- C5 at 375: "Don't copy the outer radius" switches Avoid / Prefer; "The border is part of the gap" is a stacked comparison and shows both: **pass**.

## Route 5: `/principles/error-timing`

Shots: `error-timing-{1280,375}-{light,dark}.png`, all four looked at whole. Behaviour driven through `--eval` (native
value setter + `input` events, `focus()` / `blur()`, the submit button clicked), both themes; results below.

### Behaviour measured

| Field | While typing an unfinished address | After leaving | Typing the fix | Leaving it empty |
| --- | --- | --- | --- | --- |
| On submit | nothing | nothing; error only after Continue | old error stays | old error stays |
| On every keystroke | error at once | error | clears at the valid keystroke | "Enter an email address." |
| On leaving | nothing | error | old error stays until leaving | nothing |
| On leaving, cleared on fix | nothing | error | clears at the valid keystroke | nothing |

Each error is tied to its field (`aria-describedby`, `aria-invalid="true"`), sits under it at 12px in `danger`
(`rgb(161,31,1)` light, `rgb(255,156,125)` dark), and says what's needed with an example. Sign-up: a met rule turns
green while typing ("A number, met" for screen readers); unmet ones stay `ink-muted` with a circle until the field is
left, then turn `danger` with an X and the field gets `aria-invalid`. Leaving it empty marks nothing.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | "Four timings, one field", On submit cell (`src/demos/error-timing.tsx:44-54`, a plain `<form>`) | Owner's rule: focus follows the action. The playbook's own `Form` (`src/ui/Form.tsx:5`) moves focus to the first invalid field on a failed submit, and `Field.module.scss:50-51` draws that field's doubled edge for it | After Continue fails, `document.activeElement` is still the Continue button; the invalid field gets its red edge but not focus (`x-error-submit.png`). The timing being shown is "on submit", not "submit and lose your place". | Build the cell on `Form` (or call `focus()` on the field after `setError`), so a failed submit lands in the field it names. |
| nit | "Four timings, one field", On submit cell (`src/demos/error-timing.tsx:58-60`) | component-button: "A button's verb names its result" | The submit button reads "Continue". | "Sign up" or "Save email": the verb that names what submitting does. |

### Ledger

- The rule (wait until finished to say wrong; say right at once): **pass**, all four timings behave as the prose says (table above).
- Good news can't come too early (password rules): **pass**: met turns green on the keystroke, unmet waits for leaving, empty leaving says nothing. State is shape + word, not colour alone (Circle / Check / X, plus hidden ", met" / ", not met") (C9).
- When to check sooner: **n/a**: text only.
- component-input Anatomy: label 12/16 `ink-muted` above, field 32 tall radius 10, `line-strong` edge, focus edge `accent`, invalid edge `danger` focused or not (`src/ui/Field.module.scss:30-58`): **pass**. Copy: label a noun ("Email", "New password"); error says what to do with an example ("Enter an email address, like ana@studio.com."): **pass**. `type="text"` + `inputMode="email"` (Known issues): **pass**.
- component-input: the error takes the hint's line: **pass** (no hint and error together).
- SKILL "When you're validating a form": check on leave, clear on the fixing keystroke, required waits for submit, error at its field and tied to it: **pass** on the Prefer timing.
- component-button: Continue is a secondary `sm` button with a verb: **nit** on the verb.
- Owner's rule, focus follows the action: **fail** on a failed submit (should).
- Probe at 1280 and 375, both themes: nothing under 12px, no text under 4.5:1, no sideways scroll: **pass**.
- At 375 the grid becomes one column; every field keeps one left edge (x 40): **pass**.

## All findings, most severe first

| severity | route | finding (detail in the route's section) |
| --- | --- | --- |
| must | a-shadow-says-how-high | In dark, the Layers, Pickup and Raise stages keep light-mode shadows (`oklch(0.3 …)` hairline and drops). The Prefer card has no visible edge or drop, and the Edge / Distance checkboxes change nothing. The page's own Desks demo calls this the Avoid. |
| should | a-shadow-says-how-high | The held card's drop is 12% dark, twice the resting 6%, under a caption that says "the same darkness" (and outside the page's 6–8%). |
| should | a-shadow-says-how-high | The drag demo has no keyboard path (C20). |
| should | attention-wears-off-waiting-doesnt | The hand-drawn note (Rough.js arrow and mark) is outside C7's one exemption, and it's set in `accent-text` though it isn't a link. Already raised in `principles-2.md`, still open. |
| should | attention-wears-off-waiting-doesnt | The Inbox list clips its sixth row 12px in: a divider and the tops of letters show above the tally's line. |
| should | colour-means-one-thing | The Tabs count is 11px, under the work tool's 12px floor; Tabs Anatomy says 11. |
| should | error-timing | After a failed submit, focus stays on Continue instead of moving to the invalid field, as the playbook's own `Form` does. |
| nit | a-shadow-says-how-high | In "Two shadows", the two halves' desks are 16px out of line. |
| nit | a-shadow-says-how-high | The Overlap file list is a still picture that screen readers read as live UI. |
| nit | attention-wears-off-waiting-doesnt | Confetti uses the accent and status hues as decoration. |
| nit | colour-means-one-thing | The greyscale editor sits left in its stage; the two above are centred. |
| nit | concentric-radius | The nest specimens' inner shape is the selection tint. |
| nit | error-timing | "Continue" doesn't name its result. |

## Shared ledger (every route)

### Floors (SKILL.md)
- Text holds 4.5:1: **pass** on all five routes, 1280 and 375, light and dark (probe of every text node; the one hit is the
  Avoid's white-on-accent "Board", which the probe reads against the wrong layer).
- Icons from one library, one stroke, no symbols, no hand-drawn SVG: **pass** except the Note on attention-wears-off
  (should). Lucide throughout; verdict marks `CheckIcon` / `CrossIcon`; frame tools `lucide-contrast`.
- App window holds still: **n/a**: reading pages scroll as one. No in-stage scroll panes on these routes (the Inbox list
  clips; it doesn't scroll).

### Reading page (principle-reading-text)
- One 720px column at x 280 for headings, prose, lists, tables and figures: **pass** (measured on a-shadow and
  error-timing: 30 and 14 elements at 280/720; comparison halves at 280/352 and 648/352).
- Body 16/26: **pass**.
- Tables fit at 343px or scroll in their frame; markers inside the 16px gutter (C25): **pass** on all five; none scrolls.
- C5 (Avoid / Prefer switch below 640px, verdict in the caption): **pass** wherever a comparison uses the switch;
  stacked comparisons show both.
- C15 (a specimen in the other theme sets it on its stage only): **pass** (Desks).
- C21 (lines start at the text in lists, full width in tables): **pass**.

### Owner's rules (`~/.claude/CLAUDE.md`)
- One grid / one left edge: **pass** for the page column; nits on the Layers desks and the greyscale editor.
- Trailing meta right-aligned in one column: **pass** (sidebar counts 548/548/548; tweak values; readouts).
- The lightest boundary that holds: **pass** in prose. The Inbox foot has two lines 12px apart (should).
- Empty states name the next step: **n/a**: none of these demos reach an empty state that needs one ("Inbox empty",
  "All done for today" are end states with Reset beside them).
- Focus follows the action: **fail** on error-timing's failed submit (should); elsewhere **pass** (listbox roving
  focus on the colour demos).
- Generated visuals, no clipped text: **fail** on the Inbox foot (should).

### Governing references read
principle-a-shadow-says-how-high, principle-attention-wears-off-waiting-doesnt, principle-colour-means-one-thing,
principle-concentric-radius, principle-error-timing (from their `.mdx`); principle-reading-text; system-work-tool
(12px floor); component-tabs, component-input (from `.mdx`), component-menu, component-segmented-control,
component-slider, component-switch, component-checkbox, component-button, component-tooltip, component-toolbar and
component-icon, each for the parts shown in the demos; `decisions.md`.

## Gaps in the playbook

1. **Tabs count size vs the 12px floor.** component-tabs Anatomy says "Count: mono 11"; system-work-tool says nothing
   under 12px in a row someone reads; C27 implies a 12px floor except for scaled previews. Under C42 one should
   change. The colour page's should can't be closed without picking.
2. **Hand-drawn notes on principle pages.** C7 exempts only the home hero's notes. The same Note (Rough.js arrow, accent
   text) is on attention-wears-off, never-too-busy-to-listen and how-waiting-feels. Owner's call: widen the exemption
   on the Icon page, or remove the drawn parts. Colour also needs a ruling: a note in `accent-text` conflicts with
   "Accent text is a link".
3. **Shadows in dark on the shadow page's own demos.** The page says dark depth is lightness, but nothing says whether
   every specimen must answer in both themes or may be pinned light. C15 covers specimens pinned to the *other* theme,
   not specimens that only make sense in one.
4. **The heights table has no row for a dragged item.** "It has been picked up" names the case, and the Pickup demo
   invents its own `0 12px 24px / 12%`. Say which step a held card takes (probably `shadow-lg`, or one above the
   resting step).
5. **Decoration colour.** Nothing says which hues a celebration (confetti) or a neutral diagram shape may use. The
   colour page reserves the accent and the status hues; the key hues are named only for "a colour keyed into the
   prose".

Machine: shooting paused three times while `~/.machine-pulse/state.json` read `busy` (resumed at `ok`); the last
column measurement ran during a short `busy` spell.
