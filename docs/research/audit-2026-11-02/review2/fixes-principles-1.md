# Fixes: principles, part 1 (second review, 1a + 1b)

Rows from `review2/principles-1a.md` and `review2/principles-1b.md`, should and nit only (the musts were fixed in
218aa73 and 26ad4dd). Shots in `shots/fix/principles-1/`.

## 1. Governing pages read

principle-a-shadow-says-how-high, principle-attention-wears-off-waiting-doesnt, principle-colour-means-one-thing,
principle-concentric-radius, principle-error-timing, principle-every-line-does-a-job, principle-grey-until-it-matters,
principle-hover-forgives, principle-how-waiting-feels; principle-who-before-what (faces), principle-space-groups-by-ratio,
component-button, component-menu (whole, from `skill/ui-playbook/references/`); `decisions.md`.

## 2. Fixed

| finding | what changed | evidence |
| --- | --- | --- |
| 1a shadow should: held drop 12% | `src/demos/shadow/Pickup.tsx:6`: held drop `0 12px 24px` at 8% (`shadow-lg`'s darkness), dark half unchanged (50%, the kit's dark `shadow-lg`) | held box-shadow measured `… 0 12px 24px oklch(0.3 0.01 75 / 0.08)`; rest drop 6% |
| 1a shadow should: no keyboard path (C20) | `Pickup.tsx`: the draggable card is `role="button"`, `tabIndex=0`; Space held lifts it and carries it 24 / −40 px over its neighbour, release or blur puts it back; `shadow.module.scss` `.stack .card:last-child` takes its shadow from `--card-shadow` and adds `--focus-ring` on `:focus-visible` | keydown Space: `translate 24px -40px`, shadow switches to the held one; keyup: `translate 0px` |
| 1a shadow nit: desks 16 px apart | `Layers.tsx`: the Avoid side gets the Prefer side's switch row, empty, so both desks start on one line | desk tops 3290 / 3290 at 1280 |
| 1a shadow nit: Overlap read as live UI (C27) | `Overlap.tsx`: the file list is `aria-hidden` (the menu's `role="presentation"` dropped with it); the note beside it is the text equivalent | `aria-hidden="true"` on both `.files` |
| 1a attention should: Inbox clips its sixth row | `src/demos/novelty/novelty.module.scss` `.rows`: five whole rows (`calc(5 * 52px)`), and lines only between rows (`.row + .row` border-top; the leave keyframes now zero `border-top-width`), so the head's and the tally's lines close the list | rows box 260 tall; row 5 at 208–260, row 6 starts at 260 = the tally's top (hidden); `shots/fix/principles-1/attention-archive-1280-light.png` |
| 1a colour nit: greyscale editor off-centre | `src/demos/demos.module.scss` `.editor`: `margin-inline: auto`, so it centres in the greyscale copy's full-width wrapper as on the other stages (`m.greyscale` is shared with Badge, left alone) | editor inset from its stage, left/right: 80/80 on all three |
| 1a concentric nit: nest inner in the selection tint | `demos.module.scss` `.nestInner`: `surface` with a `line-strong` inset ring | inner `rgb(22,23,26)` + `rgb(108,109,118)` ring in dark; `concentric-nest-1280-light.png`, `concentric-tweak-375-dark.png` |
| 1a error-timing should: failed submit leaves focus on the button | `src/demos/error-timing.tsx` submit cell: on a failed submit the field takes focus, caret at the end, as `ui/Form` does | after the click: `activeElement` = the On submit input, caret 8/8, `aria-invalid="true"`; `error-submit-{1280,375}-{light,dark}.png` show the doubled edge |
| 1a error-timing nit: "Continue" | same file: the button reads **Save email** | label measured "Save email" |
| 1b every-line nit: Lead panels centred | `src/demos/copy/copy.module.scss` `.panel`: `align-self: start`; `Lead.tsx`: stage 420 → 370, the Avoid panel's height plus the stage's 24 padding, so neither side has a dead foot | Title fields at y 439 (Avoid) and 383 (Prefer): the full 56 px push; Avoid form 24–346 in a 370 stage at 375; `copy-lead-1280-light.png` |
| 1b grey should: due dates left-aligned at 1280 | `src/demos/grey/grey.module.scss` `.due`: `justify-self: end; text-align: end` at every width | right edges of all 24 dates (both lists) = 964 at 1280; `grey-issues-{1280,375}-{light,dark}.png` |
| 1b hover should: submenu opens on first contact | `src/demos/hover.tsx`: Move to highlights at once and opens once the pointer has been on it `SETTLE` = 100 ms (the kit Menu's submenu delay); a click or → / Enter opens it at once; leaving, another row or a key cancels the wait | real pointer, Prefer side: a sweep down through Move to opens nothing (0 submenus); resting on it: 0 at 50 ms, 1 at 200 ms; a click opens it at once; after settling, the diagonal to Archive still holds (1); `hover-submenu-1280-dark.png` |
| 1b hover nit: choosing a folder leaves both open | `hover.tsx` `choose()`: a folder chosen by click or Enter writes the status, closes the submenu and puts focus back on Move to (never `<body>`) | after clicking Clients: "Moved to Clients", 0 submenus, `activeElement` = Move to |
| 1b how-waiting should: rows dim to 50% while refreshing (3.38:1) | `src/demos/wait/wait.module.scss` `.waitRow`: `[data-stale]` dim and its transition removed; `Flash.tsx` no longer sets it. The spinner in Refresh is the sign, as the Skeleton demo's "keeps its rows" says | row opacity 1 while the Before's spinner shows; text back to `ink` on `surface` |
| 1b how-waiting should: avatar in the accent's hue | `wait/Profile.tsx` + `.waitAvatar`: Post's face pastel (`oklch 0.93 0.04 h` / `0.35 0.06 h`, dark `0.36 0.05` / `0.92 0.04`) on the hue `hue('ana@studio.com')` from `post/Avatar` (60) | fill `oklch(0.93 0.04 60)`, initials `oklch(0.35 0.06 60)`; `wait-skeleton-1280-{light,dark}.png` |
| 1b how-waiting nit: Ribbing bars unnamed | `wait/Ribbing.tsx`: `role="progressbar"`, `aria-label="Upload"`, `aria-valuemin/max`, `aria-valuenow` from elapsed time (every 250 ms; 100 at the end), as the Stall bars | 1.6 s into a run: `aria-valuenow` 25 on the running bar, 0 on the idle one |
| 1b how-waiting nit: Avoid star spins at 0 ms | `wait/Optimistic.tsx` `StarButton`: busy through `useBusy`, so the Avoid's spinner appears at 300 ms; its one mistake stays waiting for the server | Avoid star `data-loading` absent at 100 ms, present at 450 ms |
| 1b how-waiting nit: hand-rolled spinners (C23) | `Flash.tsx` Refresh and `Optimistic.tsx` star are `Button loading` with the icon in `leading`; `Spinner` import dropped from both | Prefer Refresh: no `data-loading` at 100 ms of a 340 ms request, present at 400 ms; its svg is Button's `lucide-loader-circle _spinner_` |
| 1b how-waiting nit: "Fail the next request" reads as a fourth row | `Optimistic.tsx`: the switch sits under the list, outside it, in a new `.waitStars` column 24 apart (the `.waitFail` margin removed); the last row now takes no line | switch 24 px under the last row, last row border 0; `wait-optimistic-{1280,375}-{light,dark}.png` |

## 3. Left

| finding | why |
| --- | --- |
| 1a attention should: hand-drawn Note (Rough.js) in `accent-text` | (f) waits for the owner (C7, gap 2 in 1a). The colour half ("set the note in `ink-muted`") is in `src/components/note/`, not mine, and depends on the same ruling. |
| 1b how-waiting should: hand-drawn Note | (f), as above. |
| 1a colour should: Tabs count 11px | (b) waits for the owner (C42 vs. Tabs Anatomy); `src/ui/Tabs.module.scss` isn't mine either. |
| 1a attention nit: confetti in accent and status hues | The report's gap 5 (decoration colour) is the owner's: nothing yet says a celebration may take the key hues, and the colour page keeps those for words keyed into the prose. |

## 4. Changes needed in files I don't own

- **`src/styles/_reading.scss:188`** (1b nit, `delay-loading` in the Flash caption renders 11.05px): inline code in prose and captions is `font-size: 0.85em`, so in a 13px caption it drops under the 12px floor. Change to `font-size: max(12px, 0.85em);`. Every caption with inline code gains it, which is why it isn't patched locally.
- **`tests/interactions.spec.ts:401-416`** (hover forgives, diagonal): Move to now opens once the pointer has rested 100 ms (the should row), so the test's quick sweep onto Move to and away never opens it. After the first `page.mouse.move(…Move to…)`, add
  `await expect(f.getByText('Inbox', { exact: true })).toBeVisible();`
  before measuring Archive. The Before side needs the same line (it opens too, then closes on the first row crossed).
- **`tests/interactions.spec.ts:892-…`** (how waiting feels, spinner): Refresh is now `Button loading` (C23), so its spinner is Button's own, not `[class*="waitSpin"]`. Change the helper to
  `const spinner = (f: typeof before) => f.locator('button[aria-label="Refresh"][data-loading]');`
  The counts the test expects (1 / 0 / 1) stay as they are.

## 5. Rule departures

- **Settle time 100 ms, not 0.3–0.5 s** (hover-forgives should). The page quotes NN/g's 0.3–0.5 s for anything revealed on hover; the demo takes the kit Menu's own submenu delay (Base UI's default, 100 ms) so the demo and the Menu page agree. Which number a submenu should use is the report's gap 4, for the owner; change `SETTLE` in `src/demos/hover.tsx` if it's ruled higher.
- **Stale rows** (how-waiting should): the 50% dim is dropped rather than moved to `ink-muted`, as the Skeleton demo on the same page says a refreshed list keeps its rows. Whether stale content may ever be dimmed is the report's gap 5 in 1b, still the owner's.
- **Refresh `aria-busy`**: Button sets `aria-busy` from `loading`, so in the Prefer Refresh it is now set only once the spinner shows (after 300 ms), not for the quiet first 300 ms.

## Check

`pnpm check` (tokens, `astro check`, lint): 0 errors, 0 warnings, exit 0. Every row above was reproduced before it was
fixed; none had already gone. Machine: the pulse read `busy` for most of the run; two late shot batches
(`wait-*`, and the dark / 375 variants of attention, colour, copy and hover) ran during a short busy spell, the check at `ok`.
Tests were not run (the brief rules them out); the two that need changing are in section 4.
