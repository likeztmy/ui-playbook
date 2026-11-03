# Review 4: owner decisions C44–C53 (8a450e3)

Reviewer did not build these changes. Scope: what 8a450e3 changed (base 70d1ea5), on the routes named in the brief, checked against the playbook's references (`skill/ui-playbook/references/`, built 18:26, plus the page sources the commit edited after that build) and the owner's decisions C44–C53 and the rewritten C8, C16 and C20 in `decisions.md`.

Shots: `shots/review4/` (not committed). Full-page shots of the component and principle routes at 1280 and 375, light and dark (`<section>-<page>-<width>-<theme>.png`); the looks gallery toured page by page at 1024 and 1280 in both themes (`tour-<look>-<page>-<width>-<theme>.png`), and the phone page at 375 (`looks-phone-375-*.png`). Interactions were driven with Playwright real pointer events and keys (`page.click`, `hover`, `keyboard.press`), from scripts in the session scratchpad; the dev server on 4321 was only read. The machine sat at `busy` for most of the run; each shot batch waited for `level: ok` (up to 5 minutes a shot) and the interactive checks ran single-browser in between.

**Counts: 1 must, 3 should, 7 nit.**

## Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | /components/tooltip, live View controls, Undo or Redo once disabled; any disabled `Button label=…` or Toolbar Action with its Tip. `src/ui/Button.module.scss:55`, `:100`, `:121` (`&[data-popup-open]`) | C46 with Button States "Disabled"; Tooltip: "a label, not a control" | Base UI puts `data-popup-open` on a tooltip trigger while its tip shows. Disabled Undo at rest: `color rgb(168,168,176)`, `background transparent`. Hovered or focused with its name-only tip: `data-popup-open`, `color rgb(24,24,27)` (full ink), `background rgba(24,24,27,.06)`: it draws as an enabled, pressed-in button exactly while the pointer or focus is on it (`shots/review4/tooltip-undo-disabled-hover.png`, `tooltip-undo-disabled-focus.png`). Before C46 a disabled button had no tip, so this state never showed | Scope the pressed-in style to popups that are the button's own: `&[data-popup-open]:not([data-base-ui-tooltip-trigger])` (or at least `:not([data-disabled])`) in all three places. A tooltip is a label; it shouldn't press its trigger in, enabled or not |
| should | /components/toolbar and any toolbar: disabled `Toolbar.Tool` / `ToolToggle`, `src/ui/Toolbar.tsx:45-60`, `:73-85` | C46: "A disabled icon-only button still shows its tooltip with its name" | The disabled Rectangle tool (States grid) renders the native `disabled` attribute (`disabled tabindex="0" aria-disabled="false" data-disabled`): no pointer events, so no tip; and `keys` aren't dropped for a disabled tool as they are for Action (`:106`). Only Action and `Button label` got C46 | Pass `focusableWhenDisabled` through the Toggle (or render Toggle with `aria-disabled` instead of `disabled`), and drop `keys` when the tool or its group is disabled, as Action does |
| should | Looks gallery, Clay, Releases with rows selected; `src/ui/Table.module.scss:89-93` | Badge Anatomy: a status is its tone "on its `*-soft`"; Badge: "Soft, not solid" (the tint is the badge's shape) | The ring is for "an info badge's tint is the selection's own". With C53 Clay's info-soft is its own blue (#e4f2fe), so Rolling out keeps a ring it no longer needs, while Halted's danger-soft #feeaed now sits on Clay's accent-soft #ffe9e1 (about 1.0:1, dark #3b1b22 on #3d2014) and loses its pill entirely (`shots/review4/gal-playbook-clay-light-releases-selected.png`, `-dark-`) | Give the ring to any status badge whose soft fill is within a step of `accent-soft` (or to every status badge on a selected row), not to `info` by name |
| should | After Primer values: `--danger` dark, `src/looks/primer.ts:686-691`; "Where it differs from GitHub", `src/pages/systems/look-primer.mdx:13-18` | C53: "Every look uses its own product's values"; the look page lists where it differs | `#fb6358` is not a Primer token (fgColor-danger dark is #f85149), yet it carries `from: theme`, so the page counts it among "50 of 54 values are the product's own" and the differences list doesn't name it (it does name success and attention a step darker) | Add a bullet: "Danger a step lighter on dark: on a selected row's `accent-soft`, #f85149 falls under 4.5:1", and mark the row `from` the playbook so the count is true |
| nit | /systems/looks at 375, the phone notice, `src/pages/systems/looks.module.scss:25-27` | Reading text: read-through text "16px"; the entry pages beside it set body 16 / 26 | The new h1 matches the other entry pages (40px at x 16, 16 above the text, as on /systems/look-primer), but the sentence under it is 14 / 20, the work tool's size, where look-primer's body is 16 / 26 (`shots/review4/looks-phone-375-light.png`, `look-primer-375.png`) | Set the notice in the reading body (the `reading` mixin's paragraph style), so the phone page reads like the pages it links to |
| nit | /principles/attention-wears-off-waiting-doesnt, confetti, `src/demos/novelty/Burst.tsx:6` | C49: content colours, "never a status's or the accent"; the site's content set (`Key.module.scss`: hues 300, 205, 350, "between the ones the interface has spoken for") | Teal `oklch(0.74 0.12 185)` sits 20° from success (#54cc9e is 0.77 0.13 165) at the same lightness and chroma; yellow 105 sits 30° from warning dark (75). Three ad-hoc values where the site already has a content palette (`shots/review4/confetti-light.png`) | Throw the Key hues (300, 205, 350) at confetti lightness, so decoration and keyed words share one content set |
| nit | Looks gallery: Dashboard Recent vs Releases Updated and Properties, `ship/model.ts:62`, `ship/store.ts:283` | Every line does a job: "One word for one thing" | Same change, same moment: Recent "now", Releases Updated and Properties "Just now", the release history "· now" (eval after Pause and Resume) | One word everywhere ("now" in a time column reads fine) |
| nit | Back to an undone draft, `src/demos/looks/address.ts:38-41`, `Gallery.tsx:31` | Owner: "the way back"; the address names what's shown | Back opens Releases, correctly, but the address stays `?look=linear&page=release&release=d1` (eval), so a copied link names a release that isn't there | When `readPlace` falls back, `write(at(id, place), false)` to replace the entry with the list's address |
| nit | After Primer values, `--info-soft` row (`src/looks/look.ts:654-659`) | The From column names the product token a value took | From reads "Primer themes · accent-soft": a playbook variable named as if it were a Primer token, beside a link to Primer's CSS (Linear's reads "linear.app CSS · accent-soft") | Let a followed value carry its source's note ("bgColor-accent-muted") rather than the variable's name |
| nit | Release history vs store, `ship/release/Release.tsx:38-39,79` | Every line does a job: one word for one thing | The store now says who acts (`ME`); the history still hard-codes 'Mira Chen' and words it "paused the rollout at 25%" where Recent says "paused 4.2.0 iOS at 25%" | Read `ME`; the two wordings are each fine where they sit |
| nit | `src/demos/table.tsx:118` (BarProps doc) | — (code comment) | "Where focus goes once the bar's buttons go quiet": they no longer go quiet, they leave | "once the actions leave with the selection" |

## What passed, measured

- **C44, Table.** No actions before a selection (0 buttons in the bar); one row ticked: "1 selected", Move… at x 855–912 and Delete 920–976, the bar 24 tall before and after, so nothing below moves. Delete → toast "Deleted 1 file", focus on "Select all rows". Gallery Releases already swaps its filter bar for the selection bar (no disabled bulk actions anywhere in scope; the pager's Previous/Next stay disabled, which C44 doesn't cover).
- **C45, Tabs.** Count chips mono 12 (Geist Mono), line 18, 18 tall, 26.4 wide for "12", centred on the label (offset 0); radius pill (`shots/review4/tabs-live.png`).
- **C46, Tooltip demo.** Starts with Undo and Redo enabled (history 75% ← 100% → 125%). Undo once: Undo turns `aria-disabled`, keeps focus, its tip reads "Undo" with no shortcut; a press on it leaves 75%; Redo twice ends at 125% with Redo disabled and focused. Enabled Redo's tip still shows ⇧⌘Z. Fails only in how the disabled button draws (must above).
- **C16 / field radius plumbing.** Site unchanged: Input box 10, key 6; Select trigger 10; Combobox box 10, chevron 6, chip 6, chip remove 4; `--radius-field` and `--control-edge` unset on `:root`; site buttons `outline-style: none`. Primer: Name, Bundle ID, Approvers, Search, Select 6 (measured), comment textarea 6 (shot); combobox chevron and chips 2 (6 − 4), remove 2. Linear: search 8, chips 4, remove 2. Buttons and segmented control in Primer 6.
- **C16, toasts.** Site toast 10003px (pill), buttons 9999px, 40 × 320. Primer: Archive toast 10 around 6px buttons, 40 tall, buttons inset 4; Overlays stills 10 (one and two lines). Linear and Clay stay pills.
- **C53, info.** Primer info #0969da (dark #4da0ff); Linear #4450b2 = its accent-text on light (dark a step lighter, noted); Clay #427097 / #8bbce7 (OKLCH hue 246) against danger #a21a44 (hue 10) and the rust accent (hue 42): Rolling out reads blue, Halted crimson.
- **Primer control edge.** Website nav and Pricing secondary buttons: fill #f6f8fa on #f6f8fa with a 1px #d1d9e0 outline, inset (`outline-offset −1`); primary and ghost transparent (`shots/review4/gal-primer-light-marketing-nav-zoom.png`).
- **Ship state.** Bulk Pause of 4.2.0 iOS: row reads Paused · Just now and sorts first under Updated ↓; Dashboard Recent leads "Mira Chen paused 4.2.0 iOS at 25% · now". Resume of halted 4.1.3 Android from its page: Updated "Just now", Recent "resumed 4.1.3 Android at 10%", Releases first row. New release: Recent "drafted 4.3.1 iOS"; Undo removes it. Archive → leave for Dashboard → back: "Unarchive project" still shown. Draft Notes: "Notes are written when a release is sent for review." in meta 12. Back to an undone draft opens Releases (pane "Releases", sidebar current Releases 12); Forward returns to Dashboard.
- **Linear gap lines.** At 1x, Dashboard figures, Components pairs and States grid gaps all 1px (measured between children), so none falls between device pixels.
- **C48 notes.** Hand and arrow `ink-muted` (#5e5e67 light, #b4b4bd dark) on How waiting feels and the home hero (`shots/review4/note-waiting-*.png`, `note-home-light.png`).
- **C49 confetti.** No accent or status variable left in Burst; colours as noted above.
- **C51.** At 390, To, Subject and the message all 17px (`shots/review4/post-sheet-390-typed.png`); labels on one edge (x 20), inputs at 84; the message keeps a 26px line (see Gaps).
- **Space groups, gap labels.** Centred in their bands (label centre = band centre: 456 at 1280, 188 at 375), 12 tall in gaps of 13–30, clear of the trailing time column (`shots/review4/gaps-*.png`).
- **New copy lines.** Hover forgives (submenu 100 ms: Base UI 1.9.0 `MenuSubmenuTrigger` default `delay = 100`, true), Colour means one thing (series and confetti), How waiting feels (the refresh demo keeps rows at full strength: `Files` renders the same rows with a spinner by the title, no opacity), Concentric radius (toast = buttons + inset), Toast, Tooltip and Table texts all match what the code does.

## Ledger

Rules on parts the commit didn't touch were not re-audited (n/a: untouched).

**Table.** Numbers right, lines not stripes, one arrow, secondary muted, name pinned: n/a untouched. States "bar names the count, and the bulk actions appear beside it": P. Common mistakes (status as colour alone, actions in every row, truncating name, row vs checkbox): n/a untouched. Copy: n/a. Anatomy: n/a untouched; selected `accent-soft` with a ringed info badge: F should (Clay).

**Tabs.** Weight stays put, ink bar, one row, count in a quiet chip: P. Anatomy Count mono 12, `surface-sunken`, pill, 18: P. Others n/a untouched.

**Tooltip.** Wait once then follow; inverse no shadow: P (unchanged, re-seen in the live demo). Anatomy: P. States "a disabled icon button still shows its name, without the shortcut": P for the tip; F must for how the trigger draws. Common mistakes (clickable inside, labelled buttons, sentences): P. Copy name = aria-label: P ("Undo").

**Toolbar.** Current tool tint, Tip with shortcut: n/a untouched. Every tool named by a tooltip (C46 when disabled): F should (Tool/ToolToggle). Anatomy, Common mistakes, Copy: n/a untouched.

**Toast.** Undo instead of asking, colour on the icon, three at most: P (Archive, Pause, Resume, Draft, table Delete all offer Undo). Anatomy Shape `radius-control` + 4: P (site pill; Primer 10 / 6). Height 40, inset 4: P. Width 320: P. Copy past tense with object: P ("Deleted 1 file", "Archived Ship mobile", "Drafted 4.3.1 iOS"). Common mistakes: n/a untouched.

**Input.** Anatomy Radius `radius-lg` 10 (site): P; key 10 − 4 = 6: P; in a look `radius-field` and its − 4: P (C16). Other rules n/a untouched.

**Select.** Trigger "as Input": P (site 10, Primer 6, Linear 8). C8 up-and-down chevron: P (unchanged). Others n/a untouched.

**Combobox.** Field as Input, trigger 24 at 4 from the edge with field − 4, chip 24 with field − 4: P in the site and both product looks. Others n/a untouched.

**Button.** Filled, never outlined: P on the site; Primer's edge is C53 (see Gaps). Variants by weight: P (primary and ghost drop the edge). Disabled: F must (pressed-in under a tip). Icon-only has a tooltip with the aria-label's words: P. Anatomy radius `radius-full` (site) / `radius-control` (looks, C16): P. Others n/a untouched.

**Badge.** Words with dot, soft not solid, dot for states: P. Status tones: P (C53: Clay info blue, Primer and Linear their own). Red for "new": n/a. Soft fill holds as the badge's shape on a selected row: F should (Clay Halted).

**Hover forgives.** The new submenu line: P (100 ms is the Menu's). Other rules n/a untouched.

**Colour means one thing.** Content line (series, confetti): P. "Decoration … never a status's or the accent": P in variables; F nit on hue distance (teal near success). Others n/a untouched.

**How waiting feels.** The new refresh line: P (rows kept at full strength, spinner by the title). Others n/a untouched.

**Concentric radius.** Inner = outer − inset − border: P (Primer field 6 / chevron 2; Linear 8 / chip 4; site 10 / 6; chip remove 6 − 2 = 4). Toast = buttons + inset: P. Pairings table: P for the site (toast `radius-full` there).

**Attention wears off.** Confetti on the last tick only: P (unchanged). C49: see above.

**Space groups by ratio.** Gap labels inside their gap, clear of the trailing column: P.

**Every line does a job.** A status says what's true: P (Recent and Updated now follow pauses, resumes and drafts; Archive remembered). One word for one thing: F nit (now / Just now; history wording). Empty state names the next step: P (draft Notes).

**The lightest boundary that holds; Nothing shifts.** Bulk bar keeps 24 with and without actions: P. Linear lines 1px: P.

**Work tool.** Labels and meta 12, nothing smaller: P (tab count 11 → 12; Notes meta 12). Controls 32 / 24: P.

**Consumer app.** 17px body in the phone composer: P; "17px on a 22px line" against the message's 17 / 26: see Gaps (Reading text gives a draft 26).

**Reading text.** Read-through text 16: F nit (looks phone notice 14 / 20). Draft at the reading leading: P.

**Looks phone page (375).** One h1, the entry pages' title style (40 / 48, x 16), no overflow (scrollWidth − innerWidth 0), links to the three look pages: P.

**Look pages.** Primer `radius-field` 6, `control-edge`, info from Primer tokens: P. Primer danger dark from the product: F should. Linear `radius-field` 8 (measured), info noted as derived: P. Playbook Clay info blue, stated in When to use: P. From column for followed values: F nit.

**Decisions.** C8: P (unchanged chevrons). C16: P. C20: n/a (no hover demo changed). C44: P. C45: P. C46: P in behaviour, F must in drawing, F should for toolbar tools. C47: P (copy; Base UI default 100). C48: P. C49: P with nit. C50: P. C51: P with nit. C52: P (copy only; no chart changed). C53: P with should (Primer danger) and should (selected-row ring).

**Owner's rules.** One grid, one left edge: P (composer labels at 20; bulk actions on the table's right edge, 976 vs the table at 975). Trailing meta in one right column: P (Recent times; tab counts). Lightest boundary: P. Empty states name the next step: P. Focus follows the action, never `<body>`: P (table Delete → Select all; disabled Undo keeps focus; draft Undo → the Dashboard link that had it; Back → the Dashboard link, not body). Main area reflects the last action: P.

## Gaps in the playbook

- **Button "Filled, never outlined" vs a product that edges its buttons.** Primer's `control-edge` puts a 1px line round the secondary button, which the Button page's first Avoid names as the outline mistake. C53 settles it for looks, but the Button page doesn't say so; one sentence there ("a look whose product edges its default button keeps the edge, inside the fill") would stop the next review from flagging it.
- **C53 covers a warm accent beside danger, not a green one beside success.** Playbook Moss keeps info = its accent-text (#536228, hue 122) beside success #127a5a (hue 166): Rolling out olive next to Live green, unchanged by this commit. The same reasoning that gave Clay a blue applies.
- **Which tip states press a trigger in.** Button's `[data-popup-open]` was written for menus and popovers; nothing says a tooltip isn't one. The Tooltip page could say its trigger never changes state while the tip shows.
- **Two-line toast in a pill look.** A 52-tall failed toast in Clay is a pill around 32-tall buttons inset 10 top and bottom, so "concentric by construction" only holds for one line. C14 (wrap to two lines) and the toast's pill shape meet without a rule.
- **Menu doesn't state its submenu delay.** Hover forgives now cites "100 ms, the Menu's", but the Menu page's Anatomy has no delay row.
- **The phone composer's leading.** C51 made the message 17px like To and Subject; it keeps Blocks' 26px line, so it is 17 / 26 beside fields at 17 / 22. Consumer app says "17px on a 22px line"; Reading text's table gives "a draft" the reading 16 / 26. Both can't hold for a draft on a phone; one sentence on either page would settle it.
- **The exported Skill is behind the commit.** `skill/ui-playbook` was built at 18:26 and lacks the toast sentence on Concentric radius; a rebuild picks it up.
