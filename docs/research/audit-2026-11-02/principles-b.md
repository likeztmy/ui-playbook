# Rule review: principles, batch B

Date: 2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Dev server http://localhost:4321.

Routes: `/principles/nothing-shifts`, `/principles/how-waiting-feels`, `/principles/never-too-busy-to-listen`, `/principles/attention-wears-off-waiting-doesnt`, `/principles/space-groups-by-ratio`, `/principles/the-lightest-boundary-that-holds`, `/principles/the-faster-way`, `/principles/hover-forgives`, `/principles/error-timing`.

Shots: `shots/review/principles-b/<route>-{1280,375}-{light,dark}.png` (36 full pages, all looked at), plus `zoom-*.png` for dense parts and interaction states. The dark pill floating over the first demo in every shot is Astro's dev toolbar, not the site.

Measurements came from `pnpm shoot --eval` (contrast was walked over every text node, every figure, every route, at both widths and in both themes; truncation; horizontal overflow; computed type) and from Playwright driving real pointer and keyboard events (focus after each action, button widths before and after, tooltips, ARIA wiring, the submenu's safe triangle, shift scores).

What passes, and isn't repeated below: no route overflows horizontally at 375. Outside the slide labels and the dark placeholder, every text node clears 4.5:1 in both themes. Every Prefer side shows what it claims, measured: Releases holds x=914 while bold is hovered and clicked (it moves 538→542 on the Avoid side); Owner holds x=929 after typing "an" (561→573 on the Avoid side); Recent's first row stays at y=352 when Pages arrives (the Avoid side swaps Buttons for Badges, 1 shift, 0.0027). Errors and fixes in the email fields work: blur-fix clears `aria-invalid` on the fixing keystroke, an empty field left alone stays quiet, and the safe triangle reaches Archive diagonally ("Moved to Archive").

## Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| must | `/principles/never-too-busy-to-listen`, slide labels in all three demos, both sides (`src/demos/demos.module.scss:2347-2358`) | SKILL Floors: “Text holds 4.5:1 against what it sits on” | White 13px/600 “Lisbon” sampled on its gradient: 2.75–3.02:1 (`zoom-carousel.png`). Kyoto and Oslo start lighter. The text-shadow doesn't count. | Put the place name under the photo in the dots row, in ink (Card: “Text on the stage” is a common mistake), or darken the bottom of each stop to L ≤ 0.5 behind the label. |
| must | `/principles/how-waiting-feels`, Export, Upload and Search on both sides (`src/demos/wait.tsx:175, 220, 273`) | button.md: “Waits 300 ms, keeps its width”; “While busy it stays focusable”. Owner: focus never falls to `<body>` | Export grows 56→83 px and Upload 59→86 px when pressed. Pressing Enter on Export or Search leaves `document.activeElement` = BODY because the button goes `disabled`. | Use `Button loading loadingLabel="Exporting"` (width reserved, stays focusable, presses ignored) instead of `disabled` and a swapped label. Do the same for Upload and Search. |
| must | `/principles/nothing-shifts`, the doc search field on both sides, dark theme (`src/demos/demos.module.scss:1784`) | SKILL Floors: muted text and hints hold 4.5:1 | The placeholder “Search docs” is Chrome's default #757575 on `surface` rgb(22,23,26): 3.9:1. This placeholder is the field's only visible label. | Style `.docSearchInput::placeholder { color: var(--ink-muted) }`, as `Field.module.scss:101` does. |
| must | `/principles/how-waiting-feels`, flight header “Berlin → Amsterdam, Fri” on both sides (`src/demos/wait.tsx:271`) | SKILL Floors: “A text symbol … never stands in for an icon… arrows are in the library too” | The typed U+2192 is drawn by a fallback font. A screen reader reads it as “rightwards arrow”. | Write “Berlin to Amsterdam, Fri”, or use Lucide `ArrowRight` with `aria-hidden` and a visually hidden “to”. |
| should | Icon-only buttons with no tooltip: Refresh and Star/Unstar (`wait.tsx:72, 490`); carousel Previous/Next and sheet Close (`interrupt.tsx:55, 58, 127`); “More actions for …” (`hover.tsx:192`) | button.md Anatomy: “An icon-only button always has a tooltip with the same words as its aria-label” | `wait.tsx`, `interrupt.tsx` and `hover.tsx` never import `Tip`. Hovering each button for 900 ms showed no tooltip. | Wrap each in `<Tip label={same as aria-label}>`, as `faster.tsx` does. |
| should | 375px: the Compare toggle's segment labels on 7 routes (`src/demos/shell.tsx:335-344`) | segmented-control.md: “Past five, labels truncate”; Copy: “nouns, one word where possible, of similar length” | 18 labels are clipped at 146 px each. Examples: “Lines between rows, lighter than the edge” is 254 px; “Names each airline as asked” is 173 px; “Waits 300 ms, stays 500 ms” is 173 px. | At narrow widths, label the segments Avoid / Prefer (the frame already shows the verdict sentence), or give `Compare` short `beforeShort`/`afterShort` props. |
| should | `/principles/hover-forgives` at 375, the Prefer submenu (`src/demos/demos.module.scss:1545-1550`) | menu.md: “The popup comes out of its trigger”, visible in full; owner: no clipped content | The submenu sits at a fixed `left: 166px`. Its right edge is at x=366, past the stage's edge, so its border and shadow are cut (`zoom-hover-375-sub.png`). | Narrow the main menu on small stages, or flip the submenu to the left or below when `stage.right < sub.right`. |
| should | `/principles/how-waiting-feels`, “Stars at once, rolls back” (`wait.tsx:496`) | every-line-does-a-job.md: “What failed, why, and the next step, beside the button that failed” | “Couldn't star ‘Q4 roadmap’. Try again.” appears 102 px below the starred row, under the list (`zoom-wait-star-error.png`). | Show the message on the failed row (inline under its name) or in a toast tied to it. |
| should | `/principles/never-too-busy-to-listen`, “One reversible transition” sheet (`interrupt.tsx:107-130`) | sheet.md: “Focus moves in; what's behind is inert”; “A dim without inert … tells eyes and screen readers different things” | Opening with Enter leaves focus on “Edit profile” behind the dim. The next Tab goes to Close. The page behind is not `inert`. | Move focus to the first field (or the title) on open, set `inert` on `.intPage` while open, and return focus to Edit profile on close. |
| should | `/principles/hover-forgives`, “Whole card owns the hover” More button at rest (`demos.module.scss:1619`) | lightness-first.md: “icons that carry state” and control borders need 3:1 | The ellipsis is `ink-muted` at opacity 0.45 on `surface`, about 2.0:1. It is the only sign that the action exists. | Drop the opacity and keep it quiet with `ink-muted` alone (6.4:1), or with `ink-disabled` if that holds 3:1. |
| should | `/principles/hover-forgives`, file tiles on both sides (`hover.tsx:176-183`) | card.md When to use: “a card whose stage is a generic icon is a list row in disguise” | The stage is a 20px Lucide `FileText` on grey. | Give the stage a real thumbnail (a page preview), or show the demo as list rows with a revealed More. |
| should | `/principles/error-timing`, password rules (`error-timing.tsx:101`) | SKILL, validating a form: “The error sits at its field, tied to it (aria-describedby, aria-invalid)” | The input's `aria-describedby` is null. After leaving, two rules turn red (✕) with no tie to the field. | Give the rule list an id, point the input's `aria-describedby` at it, and set `aria-invalid` once an unmet rule turns red. |
| should | Every demo's md Button and TextField (`src/styles/_reading.scss:97`, `ui/Button.module.scss:17`, `ui/Field.module.scss:99`) | button.md Anatomy: “Label: body, weight 500, 14 / 20”; input.md Anatomy: “Text 14 / 20” | Computed 15px/24px on “Save”, “Delete project”, “Shop app” and “zoe@laur”: both use `font: inherit` from the demo container's 15/24. | Set `font-size: 14px; line-height: 20px` in the md Button and the Field control, rather than inheriting. |
| should | `/principles/how-waiting-feels`, idle captions “Exporting 248 files” and “Uploading video” (`wait.tsx:147, 217`) | every-line-does-a-job.md: “a status what's true” | Before any press, the caption says the export is running. | Idle: “248 files” and “video.mov”. Running: “Exporting 248 files”. |
| should | `/principles/the-lightest-boundary-that-holds`, Prefer “Lines between rows” (`boundary/Lines.tsx:11`) | SKILL, writing: “No eyebrows, taglines or section subtitles” | “People who can see and edit this project.” sits under Access on the Prefer side. | Drop it. Access with its rows says it. The Avoid side can keep it to carry its rule. |
| should | `/principles/never-too-busy-to-listen`, sheet on both sides (`interrupt.tsx:124`) | every-line-does-a-job.md: “A line that could be swapped for any other … is a slogan” | “Make changes to your profile here.” is copied from shadcn. | Drop it from the Prefer sheet, which is the playbook's own build. |
| should | `/principles/the-faster-way`, “Hold ⌥ to see shortcuts” (`faster.tsx:23, 139`) | menu.md: “Geist has no ⌘ ⇧ ⌥ … so here they're Lucide icons” | ⌥ is typed into 12px Geist and drawn by a fallback face. | Use Lucide `Option` at 12px with the label “Option”, or write “Option” / “Alt”. |
| should | `/principles/space-groups-by-ratio`, “Subjects share one edge” (`ratio.tsx` Stream) | every-line-does-a-job.md: “the word that tells this line from the next goes first”; table.md: give the scanned column the room | At 1280, “Deploy to production fa…” is cut to 148 px. The truncated word is the one that differs (failed vs passed). The Avoid side shows it whole. | Widen the stream or shorten the senders so the Prefer subjects fit; the demo's point is that the edge costs nothing. |
| should | `/principles/hover-forgives` and `/principles/the-lightest-boundary-that-holds`, notes under stacked comparisons (`shell.tsx:345`, `.note`) | reading-text.md: “55–75 characters”; these pages are about 100 characters at 16px | Stacked notes run 720 px at 13px, about 120 characters a line. | Cap `.note` at `reading-max` (31em) or about 75ch of 13px Geist when the comparison is stacked. |
| should | “Fail the next request” (`wait.tsx:500`) and “Show the safe area” (`hover.tsx` SubmenuDemo) | checkbox.md Common mistakes: “A checkbox that saves on the spot. If nothing waits for a Save or Submit, it's a Switch” | Both take effect the moment they flip. | Use `Switch` with the same labels. |
| nit | Demo icons with `strokeWidth 1.5 nonScalingStroke` (`wait.tsx:9`, `interrupt.tsx:9`, `faster.tsx:8`, `novelty/Inbox.tsx:13`, `hover.tsx:197`) and 1.75 at 14px (`error-timing.tsx:108`) | icon.md Anatomy: “Line: Lucide's own, 2 on its 24 grid: 1.33 at 16” | 1.5px at 16 is about 13% heavier; 1.75 at 14 (Lucide's own is 1.17) is 50% heavier. | Drop `strokeWidth` and `nonScalingStroke`; use `size` alone. |
| nit | `/principles/nothing-shifts`, members filter (`shift.tsx:363`) | input.md Copy: “Placeholder: an example, not an instruction” | Placeholder “Name”. | “Ana Ruiz”, or no placeholder. |
| nit | `/principles/nothing-shifts`, doc search (`shift.tsx:209`) | input.md: “Avoid: Placeholder as label”; Variants: “A magnifier on a search” | The only label is the placeholder; there is no magnifier. | Add Lucide `Search` at the leading end; that is the accepted label for a search field. |
| nit | `/principles/hover-forgives`, both menus (`hover.tsx:12, 202-206`) | menu.md: “Destructive actions … in the last group” | Delete is last but shares a group with Duplicate; there is no separator. | Add a separator before Delete. |
| nit | `/principles/the-lightest-boundary-that-holds`, General's button (`boundary/Settings.tsx:57`) | button.md Copy: “Save changes, … not OK or Submit” | “Save”. | “Save changes”. |
| nit | `/principles/hover-forgives`, tile anatomy (`demos.module.scss:1594`) | card.md Anatomy: stage `fill-control`; icon.md: one size per text | The stage is `surface-sunken`; the icon is 20px beside 13px names. | Use `fill-control` for the stage, and 16px if the icon stays. |
| nit | `/principles/attention-wears-off-waiting-doesnt`, keyed prose words (`components/key/Key.module.scss:6-8`) | colour-means-one-thing.md: “Accent text is a link”; “Red means something is wrong” | key-1 (hue 258) sits beside the accent's hue, so a bold blue word in running text reads as a link. key-3 is danger red. | Give keys hues outside accent and status (for example teal, violet, amber), or mark the word with a swatch dot instead of colouring it. |
| nit | `/principles/how-waiting-feels`, flight search idle (`wait.tsx:276`) | Owner: empty states name the next step | The idle body is about 220 px of nothing under the header. | Add one muted line, such as “Search to see Friday's flights”, or shrink the idle stage. |
| nit | Page head on every route: the “All principles” link, then the “Principle” caption above the H1 | every-line-does-a-job.md: the line above a heading names its parent, once | Two lines name the same parent. | Keep one: the back link, or the caption. |

Totals: 4 must, 16 should, 9 nit.

## Ledger

Marks: pass, fail (→ finding), n/a (reason). A demo's Avoid side is checked only for whether it shows its mistake, and none of those mistakes are reported.

### principle-nothing-shifts (`/principles/nothing-shifts`)
- Rule, Avoid/Prefer “Pages land above/below Recent”: pass (measured y=352 held on Prefer; the Avoid side swaps rows and scores 1 shift).
- Bold is wider: pass (Prefer Releases x=914 constant).
- Scroll bar gutter: pass (Prefer Owner right edge 929→929).
- Scroll anchoring: pass (the Prefer pane keeps its place; Replay works).
- Font fallback: pass (Prefer score 0).
- Measure it, the score under each demo: pass.
- When it doesn't apply: n/a.
- Applied elsewhere, “a button keeps its width while it loads”: **fail on how-waiting-feels** (M2).

### principle-how-waiting-feels
- Spinner at once / waits 300, stays 500: pass (Prefer: no spinner under 300 ms; at least 500 ms once shown, read in source).
- Three limits table: pass.
- Stall at 90% / at the start: pass. The idle caption is a **fail** (should, false state).
- Solid / striped bar: pass.
- Show the work: pass. Typed arrow in the header: **fail** (M4). Empty idle body: nit.
- Page skeleton / list spinner: pass.
- Optimistic star: the star flips at once and rolls back, pass. The error's placement **fails** (should).
- Honesty about failure: pass (the failure is shown in red with its cause).
- Applied, Button `delay-loading` with width reserved: **fail** (M2).

### principle-never-too-busy-to-listen
- Drops clicks / each click moves the target: pass (read in source: the Prefer side updates the target ref on every click).
- Keyframes / reversible transition: pass. The sheet's own focus rules **fail** (should).
- Timed ease / spring with velocity: pass. Keyboard path: none (see gaps).
- Reduced motion: n/a for this audit (not emulated).

### principle-attention-wears-off-waiting-doesnt
- 450 ms flight / 120 ms close-up: pass (source: BRIEF=120, no busy lock).
- Bounce is not the cost (three switches): pass.
- Confetti on every tick / on the last tick: pass.
- How to set it table: pass.
- Keyed legend colours: nit (colour-means-one-thing).

### principle-space-groups-by-ratio
- Half above, half below / 85–15: pass (the Gaps tool shows 1.4× above against 1.0× below).
- More space doesn't fix it (Tweak): pass. The readout updates.
- Stripe per line / per transaction: pass (but see gaps: table.md's no-stripes rule).
- One left edge: the edge passes; the truncated subject **fails** (should).
- When it doesn't apply: n/a.

### principle-the-lightest-boundary-that-holds
- Every section a card / headings and space: pass. Headings share x=380, Invite sits on its heading row, the only box is the danger zone, and the members' lines start at the text.
- Three tiles / one row of figures: pass. Figures use tabular numbers, one surface, and a divider that stops short.
- One group boxed / all on the page's edge: pass.
- A rule under everything / lines between rows, lighter than the edge: lines pass (`line` inside a `line-strong` edge). The subtitle **fails** (should).
- Which boundary table: pass at 375 (343 px, no scroll).
- An indent claims a parent: pass (nothing is indented).

### principle-the-faster-way
- Keys one tooltip at a time / modifier shows every key: pass (holding Alt shows E, S and I in Geist Mono on every button; focus returns to the list after a pointer command).
- Touch first: pass (`.fkHint` is hidden under `hover: none` and `pointer: coarse`).
- ⌥ in Geist: **fail** (should).

### principle-hover-forgives
- Closes on any row / holds while heading: pass (a diagonal reached Archive and moved the file).
- Content owns the hover / whole card owns the hover: pass. The button stays while its menu is open, and Esc returns focus to it. Rest contrast **fails** (should). Tile anatomy: should and nit.
- Revealed actions shown on touch: pass (the at-rest quiet state is always shown).
- 375 submenu clipping: **fail** (should).
- When it doesn't apply: n/a.

### principle-error-timing
- Four timings: pass. Submit says nothing until pressed; keystroke errors while typing; on-leaving ignores an empty field; blur-fix clears on the fixing keystroke, and `aria-describedby` and `aria-invalid` are wired.
- Good news can't come too early: pass (met rules turn green while typing; unmet stay neutral until leaving). The ARIA tie **fails** (should).
- When to check sooner: n/a (no demo).

### principle-reading-text
- These pages 16/26 at 45em: pass (column 720, one left edge at x=280 for h2, prose and figures).
- Measure 55–75 / about 100 for these pages: **fail** for stacked notes (should).
- Interface text 13–14px: **fail** for md Button and Field at 15px (should); rows at 13–14px pass.
- Numbers tabular where they stack: pass (figures, ledger amounts, shift scores).

### principle-every-line-does-a-job
- The task, then the field: pass (Edit profile, New password).
- The word that differs first: pass, except the truncated “failed” (should).
- No eyebrows: “Principle” caption plus back link, nit. No section subtitles: **fail** ×2 (Lines, Sheet).
- An error says what failed, where it failed: **fail** (star error).
- Specific verb: “Save” nit. “Delete project”, “Restore inbox”, “Invite” and “Export” pass.
- No we, please, sorry: pass. “Try again.” is a next step.
- Empty state names the action: pass for “All done.” with Restore inbox. Flight idle is a nit.

### principle-lightness-first (floor)
- Text 4.5:1: **fail** on slide labels (M1) and the dark placeholder (M3); everything else passes, measured.
- Controls and state icons 3:1: **fail** on the More button at rest (should). The switch-off track, checkbox edge and input edge (`line-strong` 3.6:1) pass.
- Status colours part by lightness: pass (the rule list's danger is rgb 161,31,1 and its success is 18,122,90).

### principle-grey-until-it-matters
- Grey chrome, colour for what matters: pass. One primary fill per demo (Save, Search); hue only in content (slides, confetti, keyed switches).
- Decoration: pass (the slides are photo stand-ins; see gaps).

### principle-colour-means-one-thing
- One solid accent per view: pass.
- Hover isn't selection: pass. Menu highlight is grey; the Faster current row is a pale accent tint.
- Red means wrong: pass (danger only on errors, Delete and unmet rules).
- Accent text is a link: nit (keyed words).

### component-icon (floor)
- One library: pass (all Lucide).
- No typed symbols: **fail** for → (M4) and ⌥ (should).
- 16px beside 14px text; line 1.33: **fail** (nit, absolute 1.5 and 1.75 strokes).
- Icon buttons named: pass (each has an `aria-label`). The tooltip half **fails** (should).
- Decorative icons hidden: pass (`aria-hidden` everywhere).

### component-button
- Filled, never outlined: pass.
- Hover in at once, out softly: pass (shared component).
- Press 0.97: pass (shared).
- One fill per view: pass.
- Loading keeps its shape: **fail** (M2).
- Anatomy heights 24/32: pass. Label 14/20: **fail** at md (should). Pill radius: pass.
- Icon-only with tooltip: **fail** (should).
- No shadow, colour not rank: pass.
- Copy (verb with result, sentence case): pass except “Save” (nit).

### component-input
- Check on leave, recheck while typing: pass.
- Error under its field: pass.
- Label above, example inside: **fail** (nits: doc search has no label; “Name” is not an example).
- Anatomy, 32 tall, radius 10, `line-strong`, accent focus edge: pass. Text 14/20: **fail** (15/24, should).
- Error copy: pass (“Enter an email address, like ana@studio.com.”).
- Common mistakes (hint repeats label, clearing on error): pass.

### component-tooltip
- Names an icon-only control: **fail** where missing (should). Faster's toolbar passes (name plus key).
- Inverse, no shadow, one shared delay: pass in Faster.

### component-menu
- Group label, icons all or none, no shortcuts in a context menu: pass.
- Highlight 9%: pass. Destructive row in red: pass.
- Destructive in the last group: nit (no separator).
- Popup radius 10, inset 4, item 32: pass (shared classes).
- Popup out of its trigger, fully visible: **fail** at 375 (should).
- Copy (verbs, ellipsis on Share… only): pass.

### component-card
- Only a card that opens lifts: pass (tiles don't lift).
- Generic-icon stage: **fail** (should). Stage token: nit.
- One primary target, at most one action: pass.

### component-checkbox
- Whole row clicks: pass (label wraps the box).
- Saves on the spot means it's a Switch: **fail** ×2 (should). Task ticks: n/a; marking an item done is the checkbox's own job in a to-do list.
- Anatomy 16px box, 14/20 label: pass (“Fail the next request” is 14/20).

### component-switch (attention page)
- Label names the setting, applies at once: pass (Expressive / Standard / Blocking with descriptions).
- Anatomy 32×20 track, 16 knob: pass (shared). Colour is not the only difference: pass (the knob moves).

### component-segmented-control (Compare toggle at 375)
- Equal widths, raised thumb in grey: pass.
- Labels truncate / one word: **fail** (should).

### component-sheet (interrupt demo)
- Focus moves in; behind is inert: **fail** (should).
- Close as an icon with its label: the label is present; no tooltip (should).

### principle-a-shadow-says-how-high
- Shadow only on what floats: pass (menus `shadow-md`, tiles `shadow-xs`). Stages and rows have none.
- In dark, depth is lightness: pass (the dark stages are lighter than the page).

### principle-concentric-radius
- Menu 10/4/6: pass. Card tile 18/8/10: pass (stage 10).
- Danger zone in its stage: pass (the inset exceeds the radius, so it keeps its own).

### principle-where-the-eye-goes
- Change seen where the click was: pass (shift score, tallies and the “Moved to Archive” status sit beside their demos).
- It sorts before it reads: pass (error-timing cells: heading→label about 16 px, between cells about 30 px, measured at 2×).

### Owner rules (`~/.claude/CLAUDE.md`)
- One grid, one left edge: pass (h2, prose and figures at x=280; settings headings at x=380).
- Trailing meta in one right-aligned column: pass (roles, times, amounts, tallies).
- The lightest boundary that holds: pass for the page itself; demo stages are boxes holding boxed apps (see gaps).
- Empty states name the next step: pass (“All done.” with Restore inbox, “Inbox empty”). Flight idle is a nit.
- Focus follows the action, never `<body>`: **fail** (M2: Export and Search). The sheet's focus stays behind (should). Faster passes; the menu returns focus to its trigger.
- Real pointer events: done with Playwright mouse and keyboard; see the evidence column.
- Frame time: not measured in this pass (no long-task tracing); left for the next round.

## Gaps in the playbook

1. **Stripes against Table.** table.md says “Lines between rows, not stripes”. space-groups-by-ratio's Prefer is “Stripe per transaction”. Neither page says when a fill per record beats a line per record. Two-line records are the likely line between them; state it on one of the two pages.
2. **The demo frame is a box, and most demos put a boxed app inside it.** The lightest-boundary page says “never a box inside a box”, and every Compare stage holds an outlined list, app or page (Members, Inbox, Settings' danger zone, the profile page). No rule says whether a demo stage counts as a region.
3. **Pointer-only demos.** The swiper and the submenu demo can't be reached by keyboard. hover-forgives' “Essentials” covers hover hiding the only way; nothing covers gesture-only controls, or demos that teach a pointer behaviour.
4. **Busy versus disabled.** button.md says a busy button stays focusable, but nothing on a principle page names `disabled` as the thing that drops focus. Only the owner's rule catches it. How waiting feels could say: never disable the button that's waiting.
5. **Legend colours.** `Key.module.scss` sets three legend hues at equal lightness. lightness-first says colours that must be told apart (red and green above all) should part by lightness, and colour-means-one-thing reserves blue for action and red for wrong. No rule covers colour used as a legend in prose.
6. **Notes in a wide column.** reading-text sets the prose column at 45em but says nothing about 13px notes stretched across it in stacked comparisons.
7. **What a comparison shows when narrow.** The toggle reuses the full verdict sentence as a segment label, which segmented-control.md forbids. Nothing says what a compare shows below 768 px.
8. **Photo stand-ins.** The SKILL says “Art only when the brief supplies it”, but demos need images (the carousel). The playbook has no rule for placeholder imagery and the text set on it, so the gradients went in with white labels at 3:1.
