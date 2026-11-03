# Fixes: looks gallery, home, systems, practice apps (second round)

Rows fixed from `gallery-app.md` (D, R, L, S, T), `gallery-specimens.md` (#n, written GS#n here) and
`home-systems-practice.md` (written HP: and the row's place). Musts were fixed earlier (ae39e80, 5484f44, 374ad49).

Shots: `shots/fix/gallery-apps/`. The machine sat at busy (memory pressure) for most of an hour, so I shot what each fix changed, light and dark across the set rather than every route in all four combinations, and measured with `--eval`. `pnpm check`: 0 errors, 0 warnings.

## 1. Governing pages read

Read whole in `skill/ui-playbook/references/`: component-app-shell, component-button, component-table, component-toast,
component-badge, component-dialog, component-input, component-combobox (Copy), component-sheet (Anatomy),
principle-the-lightest-boundary-that-holds, system-work-tool; with `decisions.md` C2, C9, C13, C16–C18, C21, C23,
C27, C29, C34, C39. Pages governing each screen, from the reviews' ledgers: Ship (app shell, table, badge, button,
toast, tabs, checkbox, segmented control, select, radio, switch, input, combobox, lightest boundary, space by ratio,
colour means one thing, every line does a job, nothing shifts, work tool, the look pages); Track and Post (table,
menu, combobox, sheet, app shell, lightest boundary, work tool); home (card, input, lightest boundary).

## 2. Fixed

| Finding | What changed | Evidence |
| --- | --- | --- |
| D3, GS#4 sub-pixel lines | `src/demos/looks/Panel.module.scss:11-17` new `--line-gap: max(1px, line-width)`, the look's own width at 2dppx; used by `ship/dashboard/Dashboard.module.scss:23`, `ship/components/Health.module.scss:4`, `ship/states/States.module.scss:10` | Linear 1024 @1x: gap 1px, figure lines and States cross drawn (`linear-dashboard-1024-light.png`, `linear-states-1024-light.png`) |
| D4 Primer face | `ship/Shell.module.scss` `.face` takes a `line` hairline ring | border `rgba(209,217,224,.7)`; `primer-face-zoom-light.png` |
| R2, C29 | `ship/releases/Releases.tsx` polite live region with the count or "No releases match"; `.announce` in `Releases.module.scss` | eval after filtering: region reads "12 releases" |
| R3 bulk actions | new `ship/store.ts` (status changes over the data, each with its Undo); `Releases.tsx` Pause rollout pauses the chosen rolling-out rows and toasts with Undo, says so on press when none is rolling out; Export saves a CSV of the chosen rows | eval: rows 1–2 chosen, Pause → toast "Paused the rollout of 4.2.0 iOS · Undo", row 1 Status "Paused" |
| R4 | `Releases.tsx`: Platform column dropped while a platform is chosen | |
| L2 Halted | `ship/release/Release.tsx`: Halted and Paused show Resume rollout, same Undo path | r5: Resume → Status Rolling out, history "Mira Chen resumed the rollout at 10% · now", focus stays on the button (now Pause rollout); Undo → Halted, focus on Resume rollout |
| L3 | `release/story.ts` Event `id`; `Timeline.tsx` keys on it; comments get `c1, c2…` | |
| L4 | `ship/CheckList.tsx` icon `role="img" aria-label` Passed / Failed / Running | eval: `svg[role=img]` labels Passed, Running, Failed |
| L5 | `Release.tsx`: "Mira Chen paused the rollout at 25% · now" heads the history while paused | `linear-release-r1-paused-1280-light.png` (real click) |
| L6 | `Release.tsx`: the "4.2.0 for iOS · Mira Chen" meta line dropped; the header and Properties say both | same shot |
| L7 | `release/Release.module.scss` `.composer > .face` offset by the label line and centred on the field's first line | face top 548, field top 546 (28 in 32) |
| S2 + dead controls | `settings/Settings.tsx`: Archive project runs, toasts "Archived Ship mobile" with Undo; the box says it is archived and the button becomes Unarchive project | real click: focus on "Unarchive project"; `primer-settings-archived-1280-light.png` |
| T1, T2, T3 | `src/demos/looks/Gallery.tsx`: Copy :root md (32), both labels in one cell, reverts after 2 s; `.swap` in `Gallery.module.scss` | width 112.09 with either label; button 32 = Select 32 |
| GS#3 | `ship/overlays/Overlays.tsx`: `inert` on each still, inside a `role="img"` with a name saying what it shows; the four headings stay readable | eval: headings Menu and tooltip, Popover, Confirmation, Toasts; four named images |
| GS#5, C21 | `ship/Rows.module.scss`: line drawn from `--lead` (icon 16 + 8); `components/Team.module.scss` faces 28 + 8 | lines start at 635 (Checks text 635), 993 (names 993) |
| GS#6 | `ship/Section.module.scss`: a heading row with an action is `height: 1lh`, the button centred over it | Checks heading offset 0 from its section in Linear, Primer, Playbook (was 4 in Linear) |
| GS#8, GS#9 | `overlays/Overlays.module.scss` `.wide`: Confirmation and Toasts take the whole row where the pane is under 960; `.toasts` max 440 | 1024: dialog 400, toasts 333 and 440 (`playbook-overlays-1024-light.png`); 1280 keeps two 480 columns, toasts 333 and 440 |
| GS#10 | `marketing/Marketing.tsx`: the nav's Start free is secondary | fills: hero Start free, Team's Start a trial |
| GS#11 | `marketing/Pricing.module.scss` `.planHead` min-height 20 | Linear: titles 1703.5 ×3, prices 1738.5 ×3 |
| GS#12 | `marketing/Marketing.module.scss` `.faq`: lines between questions only | borders top 0/1/1, bottom 0 |
| GS#13 | `states/States.tsx` + `.note` and `components/Hotfixes.tsx` + `Components.module.scss .note`: explanations at the body size | |
| Dead: New release | `ship/Ship.tsx` NewRelease drafts the next version for the platform in view (`store.ts draft`), opens it, toasts "Drafted 4.3.0 Android" with Undo (Undo discards it and goes back if it is still open); `Sidebar.tsx` counts per render | eval: `?page=release&release=d1`, Undo → `?page=releases&platform=android`, focus on the lit Android link; `playbook-new-release-1280-light.png` |
| Dead: specimen controls | `components/Checks.tsx` Re-run failed (failed check runs for 3 s, button `loading`); `Hotfixes.tsx` New hotfix adds a draft row; `Publish.tsx` Save draft / Publish say so on the heading row (live); `Team.tsx` Invite adds the address (a form; empty focuses the field); `states/States.tsx` Connect repository and Try again open Releases, Sign in opens Dashboard; `marketing/Pricing.tsx` Start free / Start a trial are links into the app, Talk to sales goes to Questions | |
| HP Track labels (C18) | `src/demos/track/_grid.scss`: labels get their own column (`minmax(0,168px)`) after a title column that keeps 160; steps-and-code fixed 64; `Row.tsx` labels out of the title span; `Row.module.scss` `.labels` shows whole labels only (the rest wrap onto a hidden line), the first may shorten | 1280: every label column starts at x=926 (was 12 values); panel open: titles truncate at 160, labels whole or the first shortened (`track-open-1280-dark.png`) |
| HP Post sheet left edge | `src/demos/post/Composer.module.scss`: in a sheet the column and foot take the sheet's 20 inset | 375: title, To, Subject at x=20 (`post-new-375-light.png`) |
| HP Post folder menu back link | `src/demos/post/Shell.tsx` + `.backItem`: "UI Playbook" link after a separator in the phone folder menu, on the folders' text edge, in ink | menu items Inbox…Archive and UI Playbook all at x=44, ink (`post-foldermenu-375-light.png`) |
| HP C29 live regions | `src/components/Home.astro` + `index.module.scss .announce`: polite region with each shown group's name and count, or the empty line; `src/demos/post/List.tsx`: count or "No conversations match"; `src/demos/track/Shell.tsx`: count or "No issues match these filters" while filtering | home eval: "menu" → "Components 1, Principles 1"; "zzzq" → "Nothing matches “zzzq”." |
| HP Post compact lines | `src/demos/post/List.module.scss`: compact one-line rows take a hairline between them, from the sender's edge (C2, C21) | lines at x=340 = sender x 340 (`post-compact-1280-light.png`) |
| HP mail stage and home Mail preview | `src/demos/post/Arrivals.module.scss`: no rule under "Inbox"; row lines between rows only, from the text's 24 inset | `mail-arrivals-1280-light.png` |
| HP Track command menu, board column | `CommandMenu.tsx` "No command matches “q”. Try a shorter word."; `Board.tsx` empty column "Drag an issue here" | |
| HP Track Show sidebar | `Header.module.scss .show` `flex: none` | 375: 24 × 24 |
| HP home card `title=` | `Home.astro`: removed | no card title truncates at 1280 or 375 (eval) |
| HP `/practice/mail` decisions | `src/demos/post/Example.module.scss`: lines between decisions only, from the text column | line starts 980 = text 980; none above the first or after the last |
| HP Track delete | `Panel.tsx`: "Delete issue" (label and Tip) | |
| NAMES info | No change: `Panel.module.scss:5-6` already sets `--info` / `--info-soft` from the look's accent on every panel (C13) | |

## 3. Left

| Finding | Reason |
| --- | --- |
| D5 single-series chart in the accent | Marked "see Gaps" (gap 4): owner's call whether one series is content. |
| R6 Clay `info` beside `danger` | Marked "see Gaps" (gap 2): where `info` comes from in a warm palette is the owner's. |
| R5 platform Select of four | The review says keep it and record a departure: recorded in §5. |
| S1 field radius in Primer / Linear | Excluded (e): C16 radius for inputs in a pill look waits for the owner. |
| T4 Look list opens below | Review marks it n/a (Base UI flips for room). |
| GS#7 Primer toast pill vs 6px buttons | Marked "see Gaps" (gap 2, record in C16): owner's. |
| GS#14 no heading at 375 | Marked "(no rule; see Gaps)": owner's. The fix would be an `h1` "Looks" above the phone notice in `src/pages/systems/looks.astro`. |
| HP Tabs count chip 11 | Excluded (b), C42. |
| HP looks' `line-strong` on accent-soft composites | The row's fix is "or say the 3:1 check covers four surfaces only (Gaps)": gap 3, owner's. |
| HP hero search field label | `src/components/Hero.astro` isn't mine: see §4. |
| HP Table card preview clipped | The preview is `src/demos/table.tsx` `TablePreview`, not mine: see §4. Measured: stage 837–1168, table frame 846–1169 at 1280; 24–351 vs 33–355.7 at 375. |
| HP Ratio card preview edge to edge | `src/demos/ratio.tsx` `RatioPreview`, not mine: see §4. |
| Bulk actions disabled with no reason | Excluded (a). Bulk Pause with no rolling-out row chosen stays enabled and says why on press; no button was disabled. |

## 4. Changes needed in files I don't own

- `src/components/Hero.astro:18` (HP hero search): add an accessible name to `#search` (`aria-label="Search"`; the zh word is the owner's, from `i18n.ts`), and make the placeholder an example of what to type or drop it (C17). The label's visible "/" stays `aria-hidden`.
- `src/demos/table.tsx` `TablePreview` (HP table card): the frame is ~9px wider than the stage's inner width. Drop one more column for the preview (keep Name and Size), or give the preview's wrapper `max-width: 100%` so the frame fits and the table scrolls inside it (C25).
- `src/demos/ratio.tsx` `RatioPreview` / its `.ratPreview` (HP ratio card): give the preview the stage's inner padding so the readout chips don't sit 1px from the stage edge.
- `src/ui/Toast.module.scss` `.still` (GS#9, for every page that holds a toast still): `max-width: min(440px, 100%)` so a still keeps Anatomy's 440 cap without each page capping it; Overlays caps it locally meanwhile.
- Tests: none of my changes break a selector or string in `tests/` that I could find (`getByText('No releases match “zzz”')` still matches the visible line only). Worth adding when tests are next touched: Releases bulk Pause → Status "Paused" + Undo; Release r5 Resume rollout; New release → `release=d1`, Undo returns; Archive project → Unarchive project keeps focus; Track label column one left edge.

## 5. Rule departures

- **R5** Platform filter stays a Select of four beside the status segmented control: a second segmented control beside the first would read as one control (the review's own recommendation).
- **New release** opens the new draft rather than a form: Ship has no release editor, and the draft page is where its history, checks and notes would be filled. The toast offers Undo.
- **Export** downloads a CSV without a toast: the browser's own download shows it, and Toast says a change already plain on screen needs none.
- **Overlays** stay held still (the page shows every floating surface at once); each still is a named picture (C27) and the headings stay readable, rather than wiring live triggers. No visible caption added (no over-signposting).
- **Track labels**: past the first, a label that doesn't fit is hidden rather than shortened, so a row never shows two truncated pills; the issue's panel lists them all.

## 5. Rule departures
