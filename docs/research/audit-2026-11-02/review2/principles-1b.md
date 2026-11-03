# Rule review 2: principles, part 1b

Routes: `/principles/every-line-does-a-job`, `/principles/grey-until-it-matters`, `/principles/hover-forgives`,
`/principles/how-waiting-feels`.

Method: `.claude/agents/ui-rule-review.md`. Decisions in `../decisions.md` are binding. Reviewed 2026-11-03 against the
dev server through `pnpm shoot` only. Each reference's source is `src/pages/principles/<slug>.mdx`.

Shots: `shots/review2/principles-1b/<slug>-<1280|375>-<light|dark>.png`; crops are `x-*.png`.

Written route by route; the combined findings table and the shared ledger are at the end.

## Route 1: `/principles/every-line-does-a-job`

Shots: `every-line-does-a-job-{1280,375}-{light,dark}.png`, all four looked at whole; Prefer stages cropped at 2×
(`x-every-line-fig4-light.png`, `x-every-line-fig6-dark.png`, `x-every-line-fig8-light.png`,
`x-every-line-lead-375-dark.png`). Probe (every text node in `main`, 1280 and 375, both themes): no sideways scroll,
no text under 4.5:1; under 12px only the two Avoid eyebrows ("Make it happen", "Issue details", 11px), which are the
mistake each Avoid shows. "Words by place" fits 343px at 375 (scrollWidth = clientWidth = 343); list markers inside the
gutter (ul at 16, li text at 36).

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | "Three lines before the first field / The task, then the field" (`src/demos/copy/Lead.tsx:7-15`, stage centres its content) | Owner's rule: one grid; the Avoid note: "each is read before the Title field it pushes down" | Both panels are centred in a 420 stage, so the Avoid's Title input sits at y 726 against the Prefer's 698: the 56px push the note describes shows as 28. | Top-align both panels in their stages (same top inset), so the Title fields differ by the full height of the three lines. |

No must or should on this route.

### Ledger

- The rule (every line names a thing, an action or a state) / Avoid: Three lines before the first field / Prefer: The
  task, then the field: **pass**. Prefer heading "New issue" repeats the opening button's words; Cancel + one primary
  "Create issue". Avoid shows eyebrow, slogan title and sub-line only. Alignment nit.
- The first two words carry the line / Avoid: Every row starts "Manage" / Prefer: The word that differs first:
  **pass**. Labels on one left edge with the "Workspace" heading (both 8px inset); meta right-aligned in one column,
  `ink-muted` 13px, tabular (`x-every-line-fig4-light.png`).
- A slogan costs the task: **n/a** (prose).
- The line above a heading names its parent / Avoid: An eyebrow / Prefer: Where it sits: **pass**. Prefer caption is
  sentence case, `ink-muted`, 13px, status icon + "In progress · ORB-142" (C4). The status icon is shape-only and stands
  beside its word (C9). C35 (in-progress takes `info`) is about a badge tone; the Track mark is shape-only grey by its
  own stated rule (`src/demos/track/icons.module.scss:1`), so **n/a**.
- An error says what failed, where it failed / Avoid: Under the terms box / Prefer: With the action that failed:
  **pass**. Prefer message names what failed, why and the next step, no please/sorry; it sits 16px above the button and
  24px below the checkbox, so it groups with the button (space groups by ratio). Danger ink with a Lucide icon at 14.
- A specific verb lets people skip the question: **pass**: every button on the page's stages names its result
  (Create issue, Create account); Cancel is the dismiss.
- A confirmation stops being read the second time: **n/a**: no confirmation on the page.
- Sentence case: **pass** for every Prefer string. The Avoid eyebrows are `text-transform: uppercase` over
  sentence-case strings, as the rule asks a capitals label to be built.
- Words by place table, every row: **pass** where it shows on the page (heading, line above a heading, button, field
  label, error); the rest **n/a** here (no menu, hint, placeholder, empty state, toast or confirmation on a stage).
- Across all of them: no we/please/sorry/oops/exclamation in Prefer copy **pass**; no "Your" **pass**; one word for one
  thing **pass**; contractions **pass**.
- When it doesn't apply: **n/a**.
- C5 at 375 (Avoid / Prefer switch, Prefer first, verdict in the caption): **pass** (`x-every-line-lead-375-dark.png`).
- component-button, component-input (TextField), component-checkbox in the stages: **pass**: library parts, field labels
  above, 32px fields.

## Route 2: `/principles/grey-until-it-matters`

Shots: `grey-until-it-matters-{1280,375}-{light,dark}.png`, all four looked at whole; crops
`x-grey-overdue-prefer-1280-light.png`, `x-grey-overdue-prefer-375-light.png` (the sticky site header and the dev
toolbar overlap this crop; it's the shot, not the page), `x-grey-signup-prefer-1280-dark.png`. Probe (1280 and 375,
both themes): no sideways scroll, no text under 4.5:1; under 12px only the Avoid's eyebrow "Great things start here"
(11px, the mistake shown; the art panel is `aria-hidden`).

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | Both issue lists, "Every label in its own colour" and "Labels grey, their colour a dot", id column (`src/demos/grey/grey.module.scss:15,29,38-42`) | Owner's rule: for generated visuals, no clipped text or overlaps; component-table: one-line rows | At 1280 every id breaks over two lines, "SHOP-" / "48": the id span is 46px wide in a 64px track (the row's 12px padding on a `subgrid` row eats the first track), so it is 48px tall in a 36px row and the row line runs through the number. `x-grey-overdue-prefer-1280-light.png` | `white-space: nowrap` on `.id`, and widen the first track to the id's width (`max-content`, or 72px), or move the row padding off the subgrid row onto the list. |
| should | Same lists at 1280, due column (`grey.module.scss:15,86-96`) | Owner's rule: trailing meta right-aligned in one column; the file's own comment "the dates keep one right edge" | Every date span is 843–964, text left-aligned in it, so the right edges of "Thu 29 Oct", "Mon 2 Nov" and "Overdue · Mon 26 Oct" differ. At 375 (container query) they are right-aligned. | `justify-self: end` / `text-align: end` on `.due` at every width. |

### Ledger

- The rule (grey carries the screen) / Avoid: Every label in its own colour / Prefer: Labels grey, their colour a dot:
  **pass** on colour: Prefer chrome is grey; labels are grey outlined pills with a 6px dot in the label's hue (C19);
  the one coloured line is "Overdue · Mon 26 Oct" in `danger`, weight 500, with its word, so not colour alone (C9).
  Avoid shows ten hues and nothing else wrong except the id wrap (must, shared). Labels start on one left edge in their
  own column (C18). Dates: should.
- A colour you were told to find survives; a surprise doesn't: **n/a** (prose).
- Group it, or say it in words: **pass**: the status colour comes with its word.
- What counts as decoration / Avoid: A slogan and a panel of shapes / Prefer: The form, and what joining means:
  **pass**. Prefer: one heading naming the task, one line only this page could say, label, field, hint, checkbox, one
  full-width primary button; labels and fields on one left edge at x 328. Avoid's art panel is `aria-hidden`, as the
  note says a screen reader skips it. Placeholder is a format example (C17); hint under the password states the
  constraint.
- Looking past it isn't free; At a glance, regions cost: **n/a** (prose).
- When it doesn't apply (content colour, impression moments, the one thing to do): **pass**: the label dots are content;
  one accent, the submit button, per stage.
- Where the playbook applies it (Badge, Toast, Button, Colour means one thing): one filled button per view **pass** on
  both sign-up stages; the rest **n/a** here.
- component-badge (label pills): **pass** for tone (grey, outlined, 12px, 20 high, full radius); C12 (a column of
  badges in a list is a status column with a header) **n/a**: these are labels, not status, and the list has no header
  row by design (it's an excerpt of Track's list).
- C21 (lines start at the text in lists, full width in tables): this list is laid out as a table (four aligned
  columns) and its lines run the row's full width: **pass** read as a table; see Gaps.
- C14 (work-tool titles truncate): **pass** at 375: titles truncate with an ellipsis, labels wrap under them.
- component-input, component-checkbox, component-button in the sign-up: **pass**.

## Route 3: `/principles/hover-forgives`

Shots: `hover-forgives-{1280,375}-{light,dark}.png`, all four looked at whole; crops with the pointer on "Move to"
(`x-hover-submenu-prefer-light.png`) and on the first Prefer tile (`x-hover-tiles-prefer-dark.png`). Probe (1280 and
375, both themes): no sideways scroll, nothing under 12px outside the `aria-hidden` thumbnails (C27), no text under
4.5:1.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | "Closes on any row crossed / Holds while heading to it", both menus (`src/demos/hover.tsx:101-139`) | C20: every hover demo has a visible state at rest and a keyboard path | Rows and folders are `div`s under `role="presentation"`, driven only by `onMouseMove` / `onClick`. With the pointer on Move to the submenu opens (2 popups), but the only focusable things in the figure are the frame's theme button and the "Show the safe area" switch: a keyboard user can't open Move to, reach a folder, or see "Moved to …". | Give the rows `role="menuitem"`, a roving `tabindex`, and the Menu's keys (↓/↑ between rows, → or Enter opens Move to and focuses Inbox, ← closes it, Enter on a folder moves). Or build both sides from `ui/Menu` with a submenu and only override the hover policy on the Avoid side. |
| should | "Holds while heading to it" (`hover.tsx:61-74`) | hover-forgives, How long to wait: "wait 0.3 to 0.5 seconds for the pointer to settle before revealing" | The submenu opens on the first `mousemove` over Move to, with no settle time. A pointer passing down through Move to toward Copy link flashes the submenu open, the twin of the mistake this page is about. | Open Move to after the pointer rests about 100–300 ms (Base UI's submenu `delay`), and at once on click or →. |
| nit | Both menus, folder click (`hover.tsx:131`) | component-menu: choosing an item closes the menu | Clicking a folder writes "Moved to Archive" under the stage but leaves the menu and submenu open. | Close both popups on choice (`setOpen(false); setHot(null)`), keep the status line. |

### Ledger

- The rule (judge the pointer by where it's heading) / Avoid: Closes on any row crossed / Prefer: Holds while heading
  to it: **pass** for the safe triangle with the pointer (submenu holds inside the triangle; "Show the safe area" draws
  it; the submenu's first row lines up with Move to, and it overlaps the menu by its 4px inset). **Fail** on keyboard
  (must) and settle time (should). Avoid shows only its mistake.
- Steering law paragraph: **n/a** (prose).
- Actions that appear on hover / Avoid: Content owns the hover / Prefer: Whole card owns the hover: **pass**. Prefer's
  More button is in sight at rest in `ink-muted` (3:1 or better for an icon), turns `ink` while the card is hovered or
  its menu is open, is a focusable `Button` with `aria-label="More actions for Q4 roadmap"` and a Tip with the same
  words, and is always shown under `@media (hover: none)` (C20). Menu: Rename, Duplicate, separator, Delete in danger.
- Revealed actions: keep frequent ones in sight, reveal only extras; always shown on touch: **pass** (see above).
- How long to wait: feedback within 0.1 s **pass** (row highlight on the first move); 0.3–0.5 s settle **fail**
  (should); keep for 0.5 s after leaving: **n/a** for the demo (it closes when the pointer leaves the stage, which is
  outside the triangle by definition).
- When it doesn't apply (clicks open popovers; essentials never hidden by hover): **pass**: the More menu opens on
  click; every hover-revealed thing on the Prefer side is also in sight.
- Where the playbook applies it: Menu safe area / Tooltip / Card More button in sight: Tip and in-sight More **pass**;
  Menu safe area is on the component page.
- C3 / C16 concentric radius in the tiles: **pass**: tile 18, inset 8, thumbnail 10; the 24px More button at inset 4 is
  a circle (pill on a 24 square, 12 effective, under the 14 the formula allows).
- C27: the thumbnails' 5–8px page text is `aria-hidden`, a picture, with the file name beside it: **pass**.
- component-card (tile surface `shadow-xs`, the More button always in sight), component-menu, component-switch,
  component-tooltip, component-button: **pass** for the parts shown.
- C5 at 375: these comparisons are stacked; both sides show: **pass**.

## Route 4: `/principles/how-waiting-feels`

Shots: `how-waiting-feels-{1280,375}-{light,dark}.png`, all four looked at whole (the full shots catch the Skeleton
demo mid-load; measured, it settles to rows 1.5 s after it hydrates); crops
`x-wait-skeleton-prefer-refreshing-light.png`, `x-wait-optimistic-prefer-dark.png`. Probe (1280 and 375, both themes):
no sideways scroll, no text under 4.5:1 at rest; under 12px only `delay-loading` in the Flash caption (11.05px). "Three
limits" fits 343px at 375 (343/343). The Note sits at x 1028–1199, inside 1280, hidden below 1180px.

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | "Waits 300 ms, stays 500 ms" and "Spinner at once", rows while the spinner shows (`src/demos/wait/wait.module.scss` `.waitRow[data-stale] { opacity: 0.5 }`) | SKILL.md floor: text holds 4.5:1; and this page's own Skeleton Prefer: "refreshing one list keeps its rows" | In light the file names drop to 3.38:1 (13px `ink` at 50% on white) for at least 500 ms each refresh; dark holds 4.64:1. The page's later Prefer says a refreshed list keeps its rows as they were. | Drop the dim; the spinner in the Refresh button is the sign. If a stale sign is wanted, `ink-muted` (holds 4.5:1). |
| should | Profile avatar in "Page spinner / Page skeleton" (`wait.module.scss` `.waitAvatar`: `accent-soft` fill, `accent-text` initials) | principle-who-before-what Anatomy: "Not on a face: the accent's hue" | "AR" sits on the accent's pale tint in the accent's text colour, on both sides. | One of the seven pastel hues from the person's address, or the grey Fluent default. |
| should | The Note "refresh a few times" (`src/pages/principles/how-waiting-feels.mdx:13`, `src/components/note/Note.astro`) | component-icon: "The playbook's home page carries the one exemption: its hand-drawn notes"; C7 | A Rough.js arrow and circle in `accent-text` on a principle page; C7 exempts the home hero only. Same as attention-wears-off in part 1a. | Owner's call, as in part 1a's gap 2: widen the exemption on the Icon page to principle-page notes, or drop the drawn arrow and circle here. |
| nit | "A bar that moves backwards feels faster", both bars (`src/demos/wait/Ribbing.tsx:26`) | No playbook page names it (see Gaps); WCAG 4.1.2 name, role, value, as the Stall demo on this page already does | The Stall bars carry `role="progressbar" aria-label="Export" aria-valuenow`; the Ribbing bars are bare `div`s, so a screen reader hears nothing of the upload but the button's "Uploading". | Same attributes as Stall, with `aria-valuetext` for the time-based fill (or `aria-valuenow` from elapsed time). |
| nit | Flash caption, `delay-loading` (`src/demos/wait/Flash.tsx:87`) | 12px floor (system-work-tool; C27) | Inline code at 0.85em in a 13px caption renders at 11.05px. | Inline code in captions at 1em of the caption (12–13px), or set code's size in px with a 12px floor. |
| nit | "Waits 0.9 s for the server" Avoid star (`Optimistic.tsx:56`) | This page: "Show nothing for the first 300 ms" (Avoid sides break only their own rule) | The Avoid's mistake is waiting for the server; its spinner also shows at 0 ms, which is the Flash demo's mistake added on. | Pass the pending state through `useBusy` so the spinner appears at 300 ms. |
| nit | Refresh and star buttons (`Flash.tsx:56-58`, `Optimistic.tsx:55-56`) | C23: a busy button uses `Button loading` | Both swap their icon for `Spinner` by hand. They keep width and focus and are never disabled, so nothing visible breaks. | `<Button icon loading={spin} leading={<RefreshCw/>}>` (the Button puts its spinner in the leading slot). |
| nit | "Fail the next request" in "Don't wait at all" (`Optimistic.tsx:62`, `.waitFail { margin-top: 12px }`) | principle-space-groups-by-ratio: a gap separates only when clearly bigger than those around it | The demo's control sits 12px under the last 36px row, on the rows' edges, and reads as a fourth row of the list. `x-wait-optimistic-prefer-dark.png` | Move it out of the list, as the submenu demo puts its switch in a foot under the stage, or give it a gap of 24 or more. |

### Ledger

- The rule / Avoid: Spinner at once / Prefer: Waits 300 ms, stays 500 ms: **pass** on timing (`DELAY` 300, `MIN` 500;
  latencies 160–1600 cover all three cases). Refresh is a ghost icon button with `aria-label` and a Tip of the same
  word; `aria-busy` while running. Stale dim: should.
- Three limits table, four rows: **pass** as the page's own content; the demos sit within it (Flash under 1 s shows
  nothing; Stall, Ribbing, Labor up to 10 s show a bar or the work; no demo runs over 10 s, so the cancel row is **n/a**).
- The end counts most / Avoid: Stalls 1 s at 90% / Prefer: Stalls 1 s at the start: **pass**. Progressbar with name and
  value; Export uses `Button loading` (C23); focus moves to the first guess button when Export goes (`useKeepFocus`),
  never to `<body>` (owner's focus rule).
- A bar that moves backwards feels faster / Avoid: Solid fill / Prefer: Stripes drifting backwards: **pass** on motion
  (stripes stop under `prefers-reduced-motion`); a11y nit.
- Show the work / Avoid: "Searching…" for 3.6 s / Prefer: Names each airline as asked: **pass**. Idle state names the
  next step ("Search to see Friday's flights."); the body reserves the tallest state's height, so nothing shifts
  (principle-nothing-shifts); checks in a column with icons in one column (done tick, current spinner, waiting dot);
  prices tabular and bold in a right-aligned column.
- Skeleton for a page, spinner for a part / Avoid: Page spinner, list bones / Prefer: Page skeleton, list spinner:
  **pass**. Bones keep the card's shapes (round avatar bone); refresh keeps rows and adds a spinner by "Recent files";
  `aria-busy` on the stage while loading; the button pressed says it's busy, the first load doesn't. The stage's own
  1px frame is the page being loaded (one region), not a box per section: **pass** (C3). Avatar colour: should.
- Don't wait at all / Avoid: Waits 0.9 s / Prefer: Stars at once, rolls back: **pass**. Star is `aria-pressed` with
  "Star / Unstar Q4 roadmap"; on failure the star reverts and the reason shows on its row in a `role="status"` line
  ("Couldn't star: the server didn't respond. Try again.", no please/sorry). Avoid nit; switch placement nit.
- When it doesn't apply (the wait is the point; honesty about failure): **pass**: the optimistic demo shows the
  failure on the row it belongs to.
- Where the playbook applies it: Button `delay-loading`, width reserved, never disabled **pass** in Stall, Ribbing,
  Labor and Skeleton (`useBusy` + `loadingLabel`); Flash and Optimistic hand-roll it (nit). Toast and Nothing shifts are
  on their own routes.
- C5 at 375: switch reads Avoid / Prefer, Prefer first, verdict in the caption: **pass**.
- component-button, component-switch, component-tooltip: **pass** for the parts shown.

## All findings, most severe first

| severity | route | finding |
| --- | --- | --- |
| must | grey-until-it-matters | Both issue lists: every id breaks over two lines ("SHOP-" / "48") and overflows its 36px row; the row line runs through it. |
| must | hover-forgives | Both submenu demos have no keyboard path: rows are `div`s; nothing in the menu can be focused (C20). |
| should | grey-until-it-matters | Due dates at 1280 are left-aligned in their column; trailing meta should share one right edge. |
| should | hover-forgives | The Prefer submenu opens on first contact, with none of the 0.3–0.5 s settle the page itself asks for. |
| should | how-waiting-feels | Rows dim to 50% while refreshing: 3.38:1 in light, and against the page's own "keeps its rows". |
| should | how-waiting-feels | The profile avatar is in the accent's hue, which who-before-what keeps off faces. |
| should | how-waiting-feels | Hand-drawn Note on a principle page; C7 exempts only the home hero (same as part 1a). |
| nit | every-line-does-a-job | Lead panels are centred, so the Avoid's Title field shows half the push its note describes. |
| nit | hover-forgives | Choosing a folder leaves the menu and submenu open. |
| nit | how-waiting-feels | Ribbing bars have no `progressbar` role, name or value (the Stall bars do). |
| nit | how-waiting-feels | `delay-loading` in the Flash caption renders at 11.05px. |
| nit | how-waiting-feels | The "Waits 0.9 s" Avoid also shows its spinner at 0 ms, a second mistake. |
| nit | how-waiting-feels | Refresh and star buttons hand-roll their spinner instead of `Button loading` (C23). |
| nit | how-waiting-feels | "Fail the next request" reads as a fourth row of the starred list. |

## Shared ledger (every route)

### Floors (SKILL.md)
- Text holds 4.5:1: **pass** at rest on all four routes, 1280 and 375, light and dark (probe of every text node in
  `main`, layered backgrounds composited). **Fail** in one transient state (wait rows dimmed, should).
- 12px floor: **pass** except the Avoid eyebrows (their mistake), `aria-hidden` thumbnails (C27) and the 11.05px
  caption code (nit).
- Icons from one library, one stroke, no symbols, no hand-drawn SVG: **pass** (Lucide throughout: `CircleAlert`,
  `ChevronRight`, `Ellipsis`, `RefreshCw`, `LoaderCircle`, `Plane`, `Check`, `Star`; no `strokeWidth` per call, C6)
  except the Note on how-waiting-feels (should).
- App window holds still: **n/a**: reading pages scroll as one.

### Reading page (principle-reading-text)
- One 720px column; comparison halves 352 + 16 + 352 at x 280 / 648 (measured on every-line-does-a-job); stacked
  comparisons span the 720: **pass**.
- Tables fit at 343px or scroll in their frame; markers inside the 16px gutter (C25): **pass** ("Words by place" and
  "Three limits" both 343/343; list text at 36, ul at 16).
- C4 kind line "Principle" above each title: **pass** (kept by decision).
- C5: **pass** wherever a comparison uses the switch; stacked comparisons show both.
- C15: **n/a**: no specimen pinned to the other theme on these routes; each stage's theme button flips its own stage.

### Owner's rules (`~/.claude/CLAUDE.md`)
- One grid / one left edge: **pass** for the page column and inside every Prefer stage (labels and fields at one x on
  the sign-up; labels column on the issue lists; settings rows and heading at one inset). Nits: Lead panels centred;
  the Optimistic switch.
- Trailing meta right-aligned in one column: **pass** on the settings list, flight prices, wait list heads; **fail**
  on the grey issue dates at 1280 (should).
- The lightest boundary that holds: **pass**: rows split by hairlines, no box per section, no band; the Skeleton
  stage's frame is the one region it stands for.
- Empty states name the next step: **pass** ("Search to see Friday's flights."); "Not refreshed" is a status, not an
  empty state.
- Focus follows the action: **pass** on Stall (focus moves to the first guess, then Run again); Ribbing, Labor,
  Skeleton keep the same pressed button; **fail** on hover-forgives in the sense that the menu can't take focus at all
  (must).
- Generated visuals, no clipped text or overlaps: **fail** on the grey issue ids (must); elsewhere **pass**.

### Governing references read
principle-every-line-does-a-job, principle-grey-until-it-matters, principle-hover-forgives,
principle-how-waiting-feels (from their `.mdx`); principle-reading-text; principle-who-before-what (faces);
principle-space-groups-by-ratio, principle-nothing-shifts and principle-colour-means-one-thing for the parts they
govern; system-work-tool (type sizes, 12px floor); component-button, component-input, component-checkbox,
component-switch, component-menu, component-tooltip, component-card, component-badge, component-icon, component-table
for the parts shown in the demos; `decisions.md`.

## Gaps in the playbook

1. **Hand-drawn notes on principle pages** (still open from part 1a, gap 2). C7 and the Icon page exempt the home hero
   only; how-waiting-feels carries a Rough.js arrow and circle in `accent-text`. Needs the owner's ruling, and a
   colour ruling against "Accent text is a link".
2. **Progress bars have no page.** The wait page builds four bars and the playbook has no Progress reference: no
   Anatomy (height, fill colour, radius), no rule on role/name/value, no rule for a time-based fill. Two demos on one
   page disagree (Stall has `role="progressbar"`, Ribbing doesn't).
3. **A list laid out as a table.** C21 says lines start at the text in lists and run full width in tables. The grey
   issue list is a `ul` with four aligned columns and no header; it reads as a table and its lines run full width.
   Say which wins: the markup, or the layout.
4. **Hover timing vs a submenu.** hover-forgives quotes NN/g's 0.3–0.5 s settle for anything revealed on hover, while
   the Menu page relies on Base UI's submenu and its own default delay (not checked here). One number (or a range per case:
   tooltip, submenu, revealed action) should be stated once and the demos should match it.
5. **Stale content while refreshing.** The page's two demos treat it differently (Flash dims rows to 50%, Skeleton
   keeps them as they are). Nothing says whether stale content may be dimmed, and if so to what floor.
6. **"Text size" in the caption rule.** C4 and the caption note say the line above a heading is "text size"; the issue
   heading's caption is 13px over a 14px body. System-work-tool gives both 13 and 14 as body. Name the token.

Machine: shooting paused twice while `~/.machine-pulse/state.json` read `busy`, resumed at `ok`.
