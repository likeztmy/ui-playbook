# Rule review 3: principles, part 1 (the f52c877 fixes)

Scope: the changes commit f52c877 made for `review2/fixes-principles-1.md`, on the routes that use them:
`/principles/a-shadow-says-how-high`, `attention-wears-off-waiting-doesnt`, `colour-means-one-thing`,
`concentric-radius`, `error-timing`, `every-line-does-a-job`, `grey-until-it-matters`, `hover-forgives`,
`how-waiting-feels`. Untouched parts of these pages are not re-audited.

Method: `.claude/agents/ui-rule-review.md`, scoped to the changed demos. Dev server used only through `pnpm shoot`
(real pointer through `--hover`/`--click`; timed sequences through `--eval` with dispatched events, which reach React's
handlers the same way). Shots: `shots/review3/principles-1/`.

Changed files in scope, confirmed by each page's imports: `src/demos/shadow/{Pickup,Layers,Overlap}.tsx`,
`shadow.module.scss`; `src/demos/novelty/novelty.module.scss`; `src/demos/demos.module.scss` (`.editor`,
`.nestInner` only: the other hunks in that file belong to other fix reports); `src/demos/error-timing.tsx`;
`src/demos/copy/{Lead.tsx,copy.module.scss}`; `src/demos/grey/grey.module.scss`; `src/demos/hover.tsx`;
`src/demos/wait/{Flash,Optimistic,Profile,Ribbing}.tsx`, `wait.module.scss`.

`src/demos/faces/*` is not in scope: no page in this range imports it; its change is `fixes-components-b.md` #11
(who-before-what).

Written route by route; findings table and ledger at the end.

Machine: the pulse was read before each batch and every batch ran at `ok`, except the error-timing batch, which
started on a `busy` read (my mistake; its results are deterministic DOM reads, not timings, so they stand).

## Route 1: `/principles/a-shadow-says-how-high`

Shots: `shadow-{1280,375}-{light,dark}.png` (looked at whole, `m-shadow.png`), crops `c-shadow-a.png`,
`c-shadow-b.png`, `c-shadow-375d.png`. Probe `--eval` (focus, hold Space, release, blur, Enter) on both Pickup cards.

- **Pickup, held drop at 8%** (`Pickup.tsx:8`): held shadow measured `… 0 12px 24px oklch(0.3 0.01 75 / 0.08)`, rest
  `0 1px 2px … / 0.06`. Matches "a longer drop, the same darkness" and the heights table (6–8%). **pass**.
- **Pickup, keyboard path (C20)**: focus → `:focus-visible` true, ring `--focus-ring` + card shadow; Space down →
  `translate 24px -40px`, `z-index 1`, held shadow on the Prefer card, rest shadow kept on the Avoid card; the card
  (top 324) overlaps its neighbour (bottom 352) and stays inside its desk (card right 948, desk right 976 at 1280;
  computed 311 < 335 at 375). Space up → `0px`; blur mid-hold → `0px`. Works. **But**: the card is `role="button"`
  with the name "Q4 roadmap Drag me", no `aria-roledescription`, no description of the key. Enter does nothing (measured
  `translate 0px`), and a screen reader's own activation sends a click, which the card ignores. A button that does
  nothing on activation, with its only key unsaid, is a keyboard path only for someone who already knows it.
  **should** (finding 1).
- **Layers, desks on one line**: desk tops 3290 / 3290 at 1280; the Avoid's empty `.switches` row is a 20 px spacer
  under the desk, so both stages end level (`c-shadow-b.png`). **pass**.
- **Overlap, still picture (C27)**: both `.files` carry `aria-hidden="true"`, no focusable inside, no roles left; the
  captions are the text equivalent. **pass**.
- Owner's rules on the changed demos: one grid, one left edge (cards share the desk's centre line), focus follows the
  action (focus stays on the card through hold and release): **pass**.

## Route 2: `/principles/hover-forgives`

Shots: `hover-*` (whole: `m-hover.png`); real pointer: `--hover` on the Prefer's Move to
(`x-hover-real-1280-light.png`, submenu open after the 800 ms wait) and `--click` on Move to at 375 dark
(`x-hover-click-375-dark.png`, open, no sideways scroll). Probe with dispatched pointer events, both sides:

| check | Before | After |
| --- | --- | --- |
| Move to highlighted at 50 ms / submenu at 50 ms / at 200 ms | yes / 0 / 1 | yes / 0 / 1 |
| sweep Open → Move to (40 ms) → Share… | 0 submenus | 0 submenus |
| several moves inside Move to, 120 ms in | 1 | 1 |
| click on Move to, 16 ms later | 1 | 1 |
| choose Clients by click | 0 submenus, focus Move to, "Moved to Clients", `aria-expanded=false` | same |
| → opens with focus on Inbox; ↓ Enter chooses | focus back on Move to (`:focus-visible`), "Moved to Projects" | same |
| pointer on Move to, then ↓ before the settle | 0 submenus, focus Share… | same |
| After: diagonal across Share… toward Archive after settling | — | holds (1), Clients highlighted |

- **Submenu opens after the pointer settles**: works as the fix report says. The settle is 100 ms, while the page's own
  "How long to wait" says "wait 0.3 to 0.5 seconds for the pointer to settle before revealing anything". The fixer
  recorded this as a departure for the owner (gap 4). The demo and the paragraph under it now disagree on the same
  page. **should** (finding 2), and a playbook gap (below).
- **Choosing a folder closes and returns focus** (never `<body>`): **pass**. Status is in an `aria-live="polite"`
  region: **pass**.
- **C20, touch**: a tap is a click, and a click on Move to opens at once: **pass**.

## Route 3: `/principles/error-timing`

Shots: `error-*`; after a real `--click` on **Save email**: `x-error-submit-{1280,375}-{light,dark}.png`.

- Failed submit: `activeElement` = the On submit input, caret 8/8, `aria-invalid="true"`, `aria-describedby` → "Enter an
  email address, like ana@studio.com.". Empty value + Enter: focus stays in the field, "Enter an email address.".
  Valid value: focus stays on the button, `aria-invalid` cleared. Focus follows the action: **pass**.
- Label **Save email**: verb naming the result, sentence case (component-button Copy): **pass**. Button 82 × 24 (`sm`),
  under the field on the field's left edge; grid cells share tops (547 / 547, 712 / 712) at 1280; one column at 375,
  no sideways scroll. **pass**.

## Route 4: `/principles/how-waiting-feels`

Shots: `wait-*` (whole: `m-wait.png`), crops `c-wait-flash-d.png`, `c-wait-prof-d.png`, `c-wait-375l.png`.
Probe (dispatched clicks, sampled):

| demo | measured |
| --- | --- |
| Refresh, Avoid, 160 ms request | `data-loading` + `aria-busy` at 16 and 100 ms, gone at 200 |
| Refresh, Prefer, 160 ms request | no `data-loading` at 16 / 100 / 200 ms |
| Refresh, Prefer, 340 ms request | none at 100, on at 350 and 700, off at 900 (300 + 500 min) |
| Refresh width | 24 px in every sample |
| Prefer rows while refreshing | opacity 1 on all four |
| Ribbing | idle `aria-valuenow` 0 / 0; 1.6 s into the Prefer run 25; `role="progressbar"`, `aria-label="Upload"`, as Stall's "Export" bars |
| Avatar | `oklch(0.93 0.04 60)` fill, `oklch(0.35 0.06 60)` initials; Post's Avatar formula, not the accent |
| Avoid star | spinner absent at 100 ms, on at 450 and 850, star set at 1000 (`aria-pressed` true, label "Unstar …") |
| Prefer star | `aria-pressed` true at 16 ms, never `data-loading` |
| Stars column | list and switch on one left edge (306 / 306, 674 / 674), switch 24 px under the last row, last row border 0 |

- Flash and Optimistic use `Button loading` with the icon in `leading` (C23); `Spinner` is left only in Labor and
  Skeleton, which still use it. Icon buttons keep a tooltip with their `aria-label`'s words (component-button). **pass**.
- Stale-row dim removed: the Skeleton demo's "keeps its rows" now matches. **pass** (dimming question stays the owner's).
- Avoid star: its spinner shows for 0.6 s of the 0.9 s wait; the caption's "a spinner for most of a second" still
  holds. **pass**.

## Route 5: `/principles/attention-wears-off-waiting-doesnt`

Shots: `attention-*` (whole: `m-attention.png`), crops `c-att-d.png`, `c-att-375l.png`.

- Five whole rows: rows 617–877, row 6 starts at 877 = the tally's top, clipped; the first row has no top line, rows
  2–5 have one, head and tally close the list. Same at 375 (839–1099 / tally 1099). **pass**.
- The inbox is still `height: 332px` (`novelty.module.scss:17`), but head + rows + tally are now 33 + 260 + 27 = 320.
  The tally ends 12 px above the inbox's foot, so the stage shows 24 px over the head and 36 px under the tally
  (stage 560–940, head top 584, tally bottom 904). **nit** (finding 3).
- During a close-up the next row's own top line is not animated: sampled frames of a Prefer archive show row 2's line
  0.5–2 px under the head's line from about 70 ms to 120 ms, a doubled rule for three frames on every archive (a held
  Enter repeats it on each press; not measured). Before this change the line belonged to the leaving row and thinned with it.
  **nit** (finding 4).

## Route 6: `/principles/colour-means-one-thing`

`colour-*`; crop `x-colour-grey-375-dark.png`. Editor inset from its figure, left / right: 80 / 80 on all three at
1280, 24 / 24 at 375 (the greyscale copy included); `.editor` is used only by `colour.tsx`. **pass**.

## Route 7: `/principles/concentric-radius`

`concentric-*`; crops `x-concentric-nest-1280-light.png`, `x-concentric-nest-375-dark.png`. Inner `surface`
(255 / 22,23,26) with a 1 px inset `line-strong` ring (134,134,144 / 108,109,118) on the sunken outer
(239,239,241 / 10,11,12). No accent tint left on an unchosen shape (colour-means-one-thing); the ring is the one line
that draws the inner edge whose corner is being judged. Radii unchanged (18/8 → 10; 20/10 → 10). **pass**.

## Route 8: `/principles/every-line-does-a-job`

`copy-*`; crop `x-copy-lead-1280-light.png`. Both panels 24 from the stage's top; Title fields at y 701 (Avoid) and
645 (Prefer): the full 56 px push the Avoid note describes. Avoid ends 24 above the stage's foot. At 375 the switch
shows one side at a time, no sideways scroll. **pass**.

## Route 9: `/principles/grey-until-it-matters`

`grey-*`; crops `x-grey-375-light.png`, `x-grey-1280-dark.png`. Right edges of all 24 dates 964 (row 976) at 1280 and
323 (row 335) at 375, both themes; "Overdue · Mon 26 Oct" ends on the same edge. Trailing meta in one right-aligned
column (owner's rule): **pass**.

## Findings

0 must, 2 should, 2 nit.

| # | severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- | --- |
| 1 | should | `/principles/a-shadow-says-how-high`, Pickup's draggable card, `src/demos/shadow/Pickup.tsx:53-54` (`role="button"`, `tabIndex={0}`) | decisions C20: "Every hover demo has … a keyboard path"; component-button: "A button runs an action now." | Name "Q4 roadmap Drag me", no `aria-roledescription`, no description; Enter → `translate 0px`; a screen reader's click does nothing. Space-hold works (24 / −40, held shadow). | Say what the key does and what the thing is: `aria-roledescription="draggable card"` and `aria-describedby` on a visually hidden "Hold Space to pick it up" (dnd-kit's pattern); or keep `role="button"` and make Enter/click toggle the lift, so activation does something. |
| 2 | should | `/principles/hover-forgives`, Move to's settle, `src/demos/hover.tsx:20` (`SETTLE = 100`) | principle-hover-forgives: "wait 0.3 to 0.5 seconds for the pointer to settle" | Submenu 0 at 50 ms, 1 at 200 ms; the paragraph under the demo on the same page says 0.3–0.5 s. Fixer's recorded departure (gap 4, owner's). | Owner rules once (gap 1 below); then either `SETTLE` = 300 or the page says submenus take the shorter Menu delay and why. Until then, leave as is. |
| 3 | nit | `/principles/attention-wears-off-waiting-doesnt`, Inbox, `src/demos/novelty/novelty.module.scss:17` | owner's rule: one grid (stage padding equal on all sides) | Content 320 tall in a 332 box: 24 px over the head, 36 px under the tally (both themes, 1280 and 375). | `.inbox { height: 320px }` (head 33 + rows 260 + tally 27), or drop the fixed height now that `.rows` has one. |
| 4 | nit | same, row lines during a close-up, `novelty.module.scss:59` (`& + &` border-top) | principle-the-lightest-boundary-that-holds: one hairline, never two | Row 2's line 0.5–2 px under the head's line for ~50 ms of each 120 ms archive. | Hide the next row's line while the row above leaves: `.row[data-leaving]:first-child + .row { border-top-color: transparent; }`. |

## Ledger

Scoped to what f52c877 changed on these routes; the rest of each reference was audited in review 2 and is not
re-marked here.

- **principle-a-shadow-says-how-high**: Avoid/Prefer "Same shadow while held / Longer drop while held": pass (held
  drop 12/24 at 8%, rest 1/2 at 6%). "Two shadows, two jobs" (Layers desks level): pass. Shadow on the menu only
  (Overlap, now `aria-hidden`): pass. Heights table, darkness 6–8%: pass. One light (same hue `0.3 0.01 75`): pass.
  "A hover lifts a thing one step": n/a (no hover change).
- **principle-hover-forgives**: Avoid/Prefer "Closes on any row crossed / Holds while heading to it": pass (sweep and
  diagonal measured). "How long to wait" 0.3–0.5 s: **fail** (finding 2). Feedback within 0.1 s (highlight at once):
  pass. "Essentials … never hides the only way" (click and → open it): pass. Actions that appear on hover: n/a
  (unchanged).
- **component-menu** (submenu demo): Right opens a submenu: pass. Pointer and keyboard share one highlight: pass.
  One level of submenu: pass. Copy (verbs, sentence case, Share… ellipsis): pass. Anatomy: n/a (unchanged).
- **principle-error-timing**: on-submit cell keeps the old verdict while editing (its Avoid behaviour): pass. Focus
  after a failed submit lands in the field: pass.
- **component-button**: Copy "a verb that names the result" (Save email): pass. Sentence case: pass. Busy after
  `delay-loading`, `loader-circle` in the icon slot (Prefer Refresh, both stars): pass. Keeps its width (24 px): pass.
  Icon-only button has a tooltip with its `aria-label`'s words: pass. Busy stays focusable, ignores presses: pass
  (Button's `onClick` guard; never `disabled`). "A button runs an action now": **fail** for the Pickup card's
  `role="button"` (finding 1).
- **component-input** (error-timing field): error described by `aria-describedby`, `aria-invalid` set: pass.
- **component-switch** (Fail the next request, Show the safe area): label left, switch right, on the list's left
  edge: pass.
- **principle-how-waiting-feels**: Avoid/Prefer "Spinner at once / Waits 300 ms, stays 500 ms": pass (measured).
  "Stalls … / front-load": n/a. "Solid fill / Stripes drifting backwards" (Ribbing now a named progressbar): pass.
  "Page spinner, list bones / Page skeleton, list spinner" (rows keep full ink while refreshing): pass. "Waits 0.9 s /
  Stars at once, rolls back": pass. "The button that's waiting is never disabled": pass.
- **principle-attention-wears-off-waiting-doesnt**: "450 ms flight / 120 ms close-up": unchanged timing, pass. Inbox
  whole rows: pass; foot spacing nit (3); doubled line nit (4).
- **principle-colour-means-one-thing**: one accent for "do this now"; nest inner no longer in the selection tint;
  avatar not in the accent: pass. Greyscale editor centred: pass.
- **principle-concentric-radius**: inner = outer − inset − border (18 − 8 = 10; 20 − 10 = 10): pass. The inner edge
  stays visible in both themes (ring): pass.
- **principle-every-line-does-a-job**: Avoid/Prefer "Three lines before the first field / The task, then the field":
  pass (56 px push now shows).
- **principle-grey-until-it-matters**: "Labels grey, their colour a dot", overdue the one red, now on one right
  edge: pass.
- **principle-the-lightest-boundary-that-holds** (row lines, list/switch gap): lines between rows only: pass;
  transient double rule: nit (4). Switch set apart by space, no box: pass.
- **principle-space-groups-by-ratio** (stars list vs switch, 24 against 0 between rows): pass.
- **principle-who-before-what**: n/a (the faces change is not on these routes).
- **decisions.md**: C20 (keyboard path; tap shows what hover shows): pass on hover, partial on Pickup (finding 1).
  C21 (lines start at the text in lists): not changed by this commit; see gaps. C23: pass. C27: pass. C39/C40 (focus
  on removal, `preventScroll`): pass (`choose()` focuses Move to with `preventScroll`).
- **Owner's rules**: one grid (nit 3), one left edge (stars list and switch 306/306; error button under its field),
  trailing meta right-aligned (grey dates 964/964), lightest boundary (nit 4), focus follows the action (error-timing,
  submenu choose, Pickup hold): pass otherwise. Empty states: n/a.

## Gaps in the playbook

1. **Submenu delay.** principle-hover-forgives says 0.3–0.5 s before revealing on hover; component-menu says nothing,
   and the kit's Menu takes Base UI's 100 ms. The demo now follows the kit. One number, stated on Menu's page, would
   settle it; the hover page could then say submenus are the exception (a short delay because the triangle already
   forgives the path).
2. **Keyboard path for a drag demo.** C20 asks for a keyboard path but no rule says how a draggable says so. Pick one
   pattern (roledescription + described key, as dnd-kit does) and name it once.
3. **C21 vs the Inbox.** The Inbox's row lines run from the row's edge, 8 px left of the text, as before this commit;
   C21 says lines between list rows start at the text. Pre-existing, so not a finding here, but the next pass over
   the novelty demo should take it.
