# Review 5: owner calls C54–C57 and the two left-open fixes (working tree on dccc505)

Reviewer did not build these changes. Scope: the uncommitted diff (Ship archive, the Button States sentence, Moss and Ink palette values, the disabled toolbar tool's tooltip, Reset demo on "where the eye goes"), checked against `skill/ui-playbook/references/` (rebuilt 22:33, so it already carries the Button sentence), `decisions.md` C54–C57 and the owner's rules in `~/.claude/CLAUDE.md`.

Shots: `shots/review5/` (not committed). Full-page shots of /components/button, /components/toolbar, /principles/where-the-eye-goes and /systems/looks at 1280 and 375, light and dark (`<section>-<page>-<width>-<theme>.png`). Ship toured at 1280 with Playwright real pointer events and keys (`ship-<look>-<theme>-<step>.png`): Playbook Blue light and dark in full (Releases, selection, a release page, Settings, Archive, Undo, archived Dashboard / Releases / release, Unarchive by pointer and by keyboard, Settings while archived), After Primer light and After Linear dark in full, Playbook Moss and Ink light and dark for the status badges with and without a selection. Site palettes read with `data-palette` set on /components/badge. Disabled toolbar tool: hovered with the States grid's `inert` lifted in the page (debug only) (`toolbar-disabled-hover-light.png`). The dev server on 4321 was only read; the machine was busy throughout, so runs were single-browser and sequential.

**Counts: 0 must, 3 should, 4 nit.**

## Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | Ship, any page but Settings while archived: the row above the header. `src/demos/looks/ship/Shell.tsx:42-51`, `Shell.module.scss:152-154` | Owner: one grid; "copy the reference product… record each deviation". App shell Anatomy: title bar 48 | The sidebar's "Ship" row (`.name`, 48 tall, y 104–152, centre 128) shared its row with the page header (centre 128) until now. Archived, the row takes y 104–144 (centre 124) and pushes the header to 144–192 (title centre 168): "Ship" sits 4px off the row's text and 40px above the page title it used to line up with, and the shell's top line no longer runs across the window (`ship-playbook-light-archived-releases.png` against `ship-playbook-light-releases.png`; same in Primer and Linear). GitHub, the named reference, puts its archived notice under the repository header and tabs, at the top of the content, not above them | Put the row between the header and the pane (under the header's line, above the page), so the 48px top row stays one line across sidebar and main, as GitHub does; or record the deviation in C54 with its reason |
| should | Ship, archived row's button. `src/demos/looks/ship/Shell.tsx:48` | Every line does a job, Words by place: Button "A verb and its object"; "One word for one thing" | The row says **Unarchive**; the same action in Settings says **Unarchive project** (`Settings.tsx:67`) | **Unarchive project** in the row too |
| should | Ship Settings, Danger zone copy, `src/demos/looks/ship/settings/Settings.tsx:58`, `:63`; and `/systems/look-playbook`, `src/pages/systems/look-playbook.mdx:11` | Every line does a job: a status says what's true, "One word for one thing"; decisions.md: "Where a decision changes a rule, the page that states the rule changes it" | (a) Archiving now pauses rollouts and leaves In review and Draft as they were; Settings still says "Releases are stopped" (archived) and "Releases stop" (before), beside a row that says "its rollouts are paused". (b) The Playbook look page still says only "in Clay a blue for `info`"; after C56 Moss has one too, and after C57 Ink's success and warning differ from the base; neither is named | (a) "Rollouts are paused; the history stays readable." / "Rollouts pause and the history stays readable." (b) "in Clay and Moss a blue for `info`… and in Ink, success and warning a step darker so they hold on its selection" |
| nit | /components/button, States paragraph, `src/pages/components/button.mdx:62` | Every line does a job: a line says what's true | "Primer's `#f6f8fa` is also its window's colour": on github.com the page is `bgColor-default` #ffffff; #f6f8fa is `bgColor-muted` / `bgColor-inset` (headers, sidebars, inset areas). It is the window only in the playbook's After Primer look (`src/looks/primer.ts:26`, `bg` ← bgColor-inset) | "…is also the colour of its headers and inset surfaces, so…" |
| nit | /principles/where-the-eye-goes, Avoid billing, Reset demo. `src/demos/eye.tsx:197` | Owner: focus follows the action | After Reset the band comes back and focus sits on the whole Billing frame (keyboard: ring round the frame, `focusVisible: true`). Not body, so it holds; but what came back is the band, and a keyboard user meets it only by tabbing | Focus the band's Dismiss (or the band) after Reset |
| nit | Ship history after Archive: release page and Dashboard Recent. `src/demos/looks/ship/store.ts:49`, `release/Release.tsx:38-41` | Every line does a job: a status says what's true | The pause that archiving makes reads "Mira Chen paused the rollout at 25%" / "paused 4.2.0 iOS at 25%", as if paused by hand; nothing in history says the project was archived (`ship-playbook-light-archived-release.png`) | Optional: "paused 4.2.0 iOS at 25% (archived)" or an "archived Ship mobile" line in Recent |
| nit | Ship archived row in After Linear | Work tool: body 14 on 20 | The row's text inherits Linear's 13px / weight 500 / `line-height: normal` (16 tall) where the header title beside it is the same; consistent within the look, noted only because the row is the one new text line (`ship-linear-dark-archived-release.png`) | None needed if Linear's body is meant to be 13/500 |

## What passed, measured

- **C54 behaviour.** Archive (Settings, pointer): r1 4.2.0 iOS Rolling out → Paused, Updated "Just now"; the toast offers Undo; focus stays on the same button, now "Unarchive project". Undo: no row, r1 back to Rolling out · 2h ago, New release back. Archived: header actions empty on Dashboard, Releases and the release page (no New release, no Pause/Resume); the bulk bar offers only Export (`["Export"]`); no comment textarea; Settings shows no row (its danger zone says it). Unarchive from the row by pointer: row gone, Resume rollout (not a restart: r1 stays Paused), textarea back, focus on the pane (`aria-label` "4.2.0 iOS"), no ring (`:focus-visible` false). By keyboard: focus on the pane "Dashboard" with its ring. No console errors in any run.
- **Row geometry (Blue light).** Row 40 tall at x 240–1280; icon 16 at x 264 (the title's edge, 264); text at 288 (gap 8, Icon Anatomy); Unarchive 24 tall ending at 1256 (the inset, as New release); icon, text and button centres all 123.5. Row on `--bg` (#f7f7f8, the sidebar's), hairline `--line` below; text `ink` 14/20, icon `ink-muted` (#5e5e67 on #f7f7f8, 5.3:1). Dark: #0e0f11 row, #26272c line, text #ececef. Primer: #f6f8fa row with Primer's line; the button gets its control edge.
- **Where the eye goes (the row).** No sparkle, no close, no colour, a sentence in the interface's voice: P against "Avoid: promo-style band on top". The tint plus a line marks the one region that differs (Lightest boundary: the one region set apart): P.
- **C56 Moss info.** Site (`data-palette="moss"`) and gallery agree: info #427097 / #8bbce7, info-soft #e4f2fe / #0e293d. Rolling out: 4.61:1 on its soft (light), 7.44:1 (dark); on Moss's selection `accent-soft` 4.64 / 7.41. OKLCH hue 246 against the olive accent (122) and success (173): three meanings, three hues. On a selected row the soft fills are within 1.01:1 of each other and every status badge keeps its 1px ring (`ship-playbook-moss-*-releases-selected.png`).
- **C57 Ink success / warning.** #007152 (oklch 0.486 0.101 166) and #925400 (0.507 0.115 63): same hues as #127a5a (166) and #9d5e02 (66), a step darker. On `accent-soft` #e2e2e6: 4.67 and 4.66 (were 4.11 and 4.03); on their own soft fills 5.32 and 5.47; on white 6.03 and 6.02. Dark unchanged (6.49, 6.45 on #303137). Gallery badges read #007152 and #925400 (`ship-playbook-ink-light-*`).
- **Toolbar disabled tool (C46).** The wrapper is 32 × 32 at the tool's own box (span = button at x 900, y 384); the States grid's Disabled column stays centred on its rows (408 and 456, as the other columns). Hovered: tip "Rectangle", no shortcut, the tool stays drawn disabled (transparent, #a8a8b0), `data-popup-open` lands on the span, not the button, so review4's pressed-in must can't recur here. In the page the grid is `inert` as designed, so no visitor sees it.
- **Reset demo.** After Dismiss, Reset demo (sm secondary, 24 tall, 13px) sits at the Billing title's left edge (304) where the band was; Tab from the dismissed band reaches it; Reset brings the band back at its old size (stage 468, title y 448, as before). Same label and size as the existing Reset demo in the Table and Menu demos. The Avoid figure is 38px shorter while dismissed (was 116 before this change): a move the user asked for (Nothing shifts, When it doesn't apply).
- **Button sentence.** 67 words at 16/26, 10 lines at 375, no overflow (scrollWidth − innerWidth 0 on every route and width).
- **Looks at 375.** The phone notice, unchanged (`systems-looks-375-*.png`).

The phone Avoid/Prefer switch on "where the eye goes" wasn't driven (the script's click didn't take the billing figure's Avoid); the Avoid side is the same component as at 1280.

## Ledger

Rules on parts the diff didn't touch: n/a untouched.

**App shell.** Window holds still, panes scroll: P (row is a grid row `auto`, pane stays `minmax(0, 1fr)`). Pane named and focusable: P. Title bar 48: P (header keeps 48). Sidebar, rows, foot: n/a untouched. Common mistakes: n/a (no overflow change). One top line across sidebar and main: F should (row above the header).

**Button.** Filled, never outlined: P (row and Reset are secondary fills; Primer's edge is the look's, now explained on the page). Hover, press, one fill per view, loading: n/a untouched. Variants by weight: P (secondary for Unarchive and Reset). Anatomy sm 24 / 13: P. States sentence: P with nit (window colour). Common mistakes (shadow, colour as rank, disabled with no reason): P; New release, Pause, Resume and the composer are removed, not disabled, and the row says why. Copy, verb names the result: P for Reset demo; F should for Unarchive (object). Match the dialog: n/a.

**Badge.** Dot and word: P (Paused, Rolling out). Soft not solid: P. Dot on states only: P. Anatomy 20 / 12 / pill: n/a untouched. Status tones on their soft: P (Moss info, Ink success and warning measured). Neutral `ink-muted` on `fill-control`: P (Paused). Common mistakes: n/a.

**Table.** Numbers right, lines not stripes, one arrow, muted secondary, pinned name: n/a untouched. Selected `accent-soft` with every status badge ringed: P in Blue, Moss, Ink. Bulk bar actions beside the count: P (Export alone when archived). Common mistakes: n/a.

**Toast.** Undo instead of asking: P (Archive). Neutral with icon, three at most: n/a untouched. Toast not the only feedback: P (the row and the statuses show it). Copy past tense with object: P ("Archived Ship mobile").

**Toolbar.** Every tool named by a tooltip: P (disabled tool now too). Tint for the current tool, Anatomy, Common mistakes: n/a untouched. Copy: name = `aria-label`: P ("Rectangle").

**Tooltip.** Disabled icon button shows its name without the shortcut: P. Keyboard focus shows it: n/a (a natively disabled tool isn't focusable). Inverse, offset, delay: n/a untouched (the grid's tip sits 8 from a bare tool, as for every tool in that grid).

**Icon.** From the library (Lucide `Archive`): P. 16 beside 14, gap 8, `ink-muted`: P. Decorative `aria-hidden`: P. Common mistakes: P.

**Where the eye goes.** Promo band vs note in the interface's voice: P (row). Change beside the click: P (Unarchive removes the row and restores actions where the eye is; Settings button changes in place). Reset demo: P. Fold, proximity, scent: n/a untouched.

**Every line does a job.** Word that differs first: P (row copies GitHub's "This repository…"). No we / please / sorry: P. Button verb and object: F should. One word for one thing / a status says what's true: F should (Settings "stopped"), F nit (history). Toast copy: P.

**The lightest boundary that holds.** Row is the one region that differs, tint and hairline: P. No box per section: P. Line lighter than an edge: P (`line`).

**Grey until it matters.** Row grey, no hue: P. Moss and Ink statuses each one meaning: P.

**Colour means one thing.** Moss info no longer shares the accent's hue: P. Ink info = ink (unchanged): see Gaps.

**Lightness first, hue last.** Moss info L 0.53 beside success 0.52 and warning: P, text at 4.5:1 on every surface measured. Ink's darkened steps keep hue, move L only: P.

**Space groups by ratio.** Row icon 8 to text; Reset 24 above Billing, the sections' own gap: P.

**Nothing shifts.** Row in and out, Reset, Unarchive: moves the user asked for: P. Toolbar wrapper adds no box: P (measured).

**Work tool.** Body 14 / 20 in the row: P (Linear 13, nit). Controls 24 in a row: P. Contrast 4.5:1: P. Surfaces one step: P. Icons 16: P.

**Playbook look (system).** Palette values: P. The page's sentence on which palettes change `info`: F should (stale after C56, C57).

**Decisions.** C54: P in behaviour; F should for placement against GitHub and the copy. C55: P with nit. C56: P (values), F should (look page). C57: P.

**Owner's rules.** One grid: F should. One left edge: P (row icon at the title's 264; Reset at Billing's 304). Trailing meta right-aligned: P (Unarchive at the inset). Lightest boundary: P. Empty states name the next step: n/a (none added). Focus follows the action, never `<body>`: P (Unarchive → pane; Archive → same button; Reset → Billing frame, nit). Main area reflects the last action: P.

## Gaps in the playbook

- **Where a state row goes in an app shell.** App shell's Anatomy has a 48 title bar and a sidebar of 48 head and foot, but nothing on a persistent notice (archived, read-only, offline): above the header, under it, or across the window. GitHub puts it under its header and tabs; macOS puts a read-only state in the title bar. One line in App shell would settle it.
- **Ink's info is its ink.** In Ink, Rolling out is `#18181b` on `#e2e2e6` and Paused is `#5e5e67` on 6% ink: two statuses told apart only by text darkness (and words). C53 and C56 give a blue where the accent collides with a status; an ink accent collides with neutral. Not in this diff; worth a call.
- **Read-only and Settings.** The row says "read-only", yet Settings' fields stay editable while archived (as GitHub's do). Nothing states which writes an archived project keeps; C54 lists what is removed, not what stays.
- **A toast's Undo after the state moved on.** Archive, then Unarchive from the row, then Undo in the still-open toast resumes r1 (read from `store.ts:83-92`, not driven), though C54 says Unarchive restarts nothing. Toast doesn't say whether an Undo should still act once the change has been reversed another way.

---

# Round 2: the working tree on b754418 (C54 rewritten, C58–C60)

Same reviewer, same rules. Scope: the uncommitted diff on b754418 (the archived row across the window's top and on Settings; the archive's history wording; Ink's blue `info`; the App shell section "A state of the whole window goes across its top, and stays" with its Anatomy row; the look-playbook line). Quotes were checked against the live Atlassian, Primer and Notion pages (WebFetch, 2026-11-04).

Correction to round 1: my first should, that the row belonged under the header "as GitHub does", was wrong about GitHub. The new placement answers it better: the sidebar's name and the page header share a line again.

Shots: `shots/review5/r2-*` (not committed). Ship driven at 1280 with Playwright pointer events in Playbook Blue light and dark, After Primer light, After Linear dark and Playbook Ink light: Settings → Archive, Dashboard, Releases, a release, Undo, Archive again, Unarchive from the row on a release, Resume and Pause by hand, Archive with nothing rolling, Unarchive from the row on Settings. Ink's Releases table at scale 2, light and dark. /components/app-shell and /systems/look-playbook full-page at 1280 and 375, light and dark. The dev server was only read; the scripts are deleted.

**Counts: 0 must, 2 should, 4 nit.**

## Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| should | Ship Settings while archived: the row and the danger zone. `src/demos/looks/ship/Shell.tsx:33`, `settings/Settings.tsx:57`, `:67` | The page's own new rule (`app-shell.mdx:43`): "Say it once"; Every line does a job: one word for one thing; Button: one action, one control | Settings now shows **Unarchive project** twice (`["Unarchive project","Unarchive project"]`): one in the row at the top, one in the danger zone at the foot of the page; and "This project is archived" twice: the row, then the danger zone's "This project is archived / Its rollouts are paused…" (`r2-playbook-light-settings-archived.png`). GitHub, the reference, shows its banner with no action and keeps the one Unarchive button in Settings | On Settings, drop the row's button (GitHub's banner has none) or let the danger zone, while archived, keep its text and lose its own button; one control for the one action either way |
| should | /components/app-shell, `src/pages/components/app-shell.mdx:47` | Every line does a job: a line says what's true; the section must not contradict its own example | "A state you can lift for yourself needs only a word beside the title." The section's own case, the archived project, is a state the user lifts for themselves (the row's one action, **Unarchive project**, `:45`), yet it gets a row. Notion's lock differs in other ways: it belongs to one page, not the whole window, and hides nothing (one click and the page is editable) | Name the real line: "A state of one page that takes nothing away needs only a word beside the title. Notion shows…" |
| nit | `src/pages/components/app-shell.mdx:45` | Each quote says what the sentence claims | Primer's line is about *accidental* closure: "If accidental closure of the Banner would leave the user confused or missing something critical, it should not have a close button." The sentence before it argues against closing at all ("Closing a state hides the reason and changes nothing"), and "drops the close wherever closing would leave someone…" leaves out "accidental" | "…wherever closing it by accident would leave someone 'confused or missing something critical'" |
| nit | `src/pages/components/app-shell.mdx:43` against `src/demos/looks/ship/Shell.tsx:22` | Every line does a job: one word for one thing | The page opens "Some news is about everything that's open"; the code that applies it says the row has no close "since it is a state and not news", and the heading says "A state" | "Some states are about everything that's open: …" |
| nit | Ship Dashboard, Recent, while archived. `src/demos/looks/ship/store.ts:55` | Every line does a job: the word that differs first, short lines in a list | "Mira Chen archived the project, pausing 4.2.0 iOS at 25%" wraps to two lines at 1280, the only two-line row in Recent; its "now" centres on the pair (`r2-playbook-light-archived-dashboard.png`) | "Mira Chen archived the project, pausing 4.2.0 iOS" (the release page keeps the 25%), or accept the wrap |
| nit | /systems/look-playbook, `src/pages/systems/look-playbook.mdx:11` | Set reading text for the reader; Every line does a job | The parenthetical in "another palette changes the accent and what follows from it (…)" is now about 70 words: three palettes, three reasons, then Ink's success and warning, before the sentence's main clause resumes. "Ink's black" is its light accent only (dark is #ececef) | Close the parenthetical after "its text", then give the `info` and Ink notes their own sentence: "Clay, Moss and Ink bring a blue for `info`: Clay's rust would sit beside `danger`, Moss's olive beside `success`, and Ink's ink would tell an info badge from a neutral one by darkness alone…" |

## What passed, measured

- **Row across the window (C54).** Row at x 0–1280, y 104–144 (40 tall) in every look and theme toured; the sidebar and the main column both start at 144. Sidebar "Ship" (`.name`, 48 tall) and the page header both centre at y 168, title text at x 264 as before. Icon 16 at x 16, the sidebar name's text edge (16); row text at x 40, the sidebar labels' edge; Unarchive project 24 tall ending at 1256, the header actions' inset. Icon, text and button centres 123.5. Row on `--bg` (the sidebar's colour: #f7f7f8 / #0e0f11, Primer #f6f8fa, Linear #09090a) with `--line` below, so it joins the sidebar on the left and reads as one band of window chrome. Sidebar foot stays at 752–800. No console errors.
- **Every page.** Row on Settings, Dashboard, Releases and a release page. Read-only as before: no New release, no Pause/Resume, no composer, bulk bar Export only.
- **Unarchive.** From the row on a release: row gone, focus on the pane ("4.2.0 iOS"), Resume rollout back, r1 still Paused. From the row on Settings: focus on the pane ("Settings").
- **History (C58).** Archived: the release timeline leads with an Archive icon and "Mira Chen archived the project, pausing the rollout at 25% · now"; Dashboard Recent says "Mira Chen archived the project, pausing 4.2.0 iOS at 25%". Undo from the toast: the line goes, status Rolling out, 2h ago. Unarchive keeps the line (still paused by the archive). Resume by hand: the line goes. Pause by hand afterwards: "paused the rollout at 25%" with the Pause icon. Archive again with nothing rolling: Recent keeps "paused 4.2.0 iOS at 25%", correctly not credited to the archive.
- **Ink info (C59).** Site (`data-palette="ink"`) and gallery agree: #39678e / #8bbce7 on #e4f2fe / #0e293d. Rolling out on its soft 5.26:1 light, 7.44:1 dark; on Ink's selection `accent-soft` 4.64 / 6.45 (Clay's #427097 would be 4.07 there, so the darker step is needed); on white 5.99. Its soft fill is 1.13 / 1.15 from `accent-soft`, and selected rows keep every badge's ring. Rolling out now reads blue against Draft's grey and Paused's grey (`r2-ink-light-releases-table.png`, `r2-ink-dark-releases-table.png`).
- **App shell section (C60).** 720 wide, three paragraphs, no overflow at 375 (scrollWidth − innerWidth 0, all four shots). Quotes as sourced: Atlassian "Use banners sparingly at the top of the screen to display critical messaging…" and "…are not dismissible, and only disappear when no longer required"; Primer "Never use flush banners at the top of a page… as this can create confusion with page-level or system-wide announcements" (so "anything else there is mistaken for a 'page-level or system-wide' announcement" holds); Notion "you'll see `Locked` appear next to the name of your page in the top breadcrumb menu", and unlocking starts by selecting that word ("that word is where it's unlocked" holds, it opens Unlock for me / for everyone). Anatomy row "State row (archived, offline) · `bg`, `line` below · 40" matches what Ship renders (min-height 40, `--bg`, `--line`).
- **Over-signposting.** No line labels the obvious or flags the page's own care; "It has no close." is a claim, not a heading. **Depth.** The section's one mechanism ("each control that's missing is a puzzle again") is argued, not sourced; the rest leans on three design systems' guidance. Acceptable on a component page, where other sections cite Bootstrap and Primer the same way; a principle page would need a study.
- **look-playbook line.** Matches C56, C57 and C59 (Clay, Moss and Ink blue; Ink success and warning a step darker); length is the nit above.

## Ledger (round 2)

Rules on parts this diff didn't touch: n/a untouched; round 1's ledger stands for them.

**App shell.** Window holds still, panes scroll: P (shell rows `auto minmax(0, 1fr)`; pane and sidebar list still scroll; foot fixed). Title bar 48: P. Sidebar 240, rows 32, foot 48: P. New "state row" rule and Anatomy: P in Ship; F should on the rule's own wording (`:47`), nit (`:43`, `:45`). Common mistakes: n/a.

**Button.** Verb and object: P (Unarchive project). One control per action: F should (two on Settings). Variants, Anatomy: P (secondary sm 24).

**Badge.** Status tones on their soft: P (Ink info measured). Neutral `ink-muted` on `fill-control`: P. Words carry it, colour helps: P; Ink's info no longer leans on darkness alone.

**Table.** Selected `accent-soft` with every badge ringed: P in Ink. Others n/a untouched.

**Toast.** Undo puts back status, row and history line: P. Copy: P.

**Icon.** Lucide `Archive` in the row and the timeline, 16, `ink-muted` in the row: P.

**Where the eye goes.** Flat row, no sparkle or close: P. The change shows where it happened (timeline line on the release; Recent on the Dashboard): P.

**Every line does a job.** Say it once: F should (Settings). Line says what's true: F should (`app-shell.mdx:47`). One word for one thing: F nit (news / state). Short list lines: F nit (Recent wrap). Toast and history copy past tense with object: P.

**The lightest boundary that holds.** Row is the one band of window chrome, `bg` and one hairline: P.

**Colour means one thing; Grey until it matters; Lightness first.** Row grey: P. Ink: accent ink, info blue, success green, warning amber, danger red, each one meaning: P. Ink info L 0.50, text at ≥ 4.5:1 on every surface measured: P.

**Set reading text for the reader.** App shell section 720 measure: P. look-playbook sentence length: F nit.

**Work tool.** Row text 14 / 20 (Linear 13, as its body), controls 24, icons 16: P.

**Playbook look (system).** Palette sentence states what each palette changes: P (nit on length).

**Decisions.** C54 (rewritten): P, F should (Settings duplicate). C58: P (all five transitions driven). C59: P. C60: P, F should and two nits on copy.

**Owner's rules.** One grid: P (sidebar name and header share y 168; row icon on the sidebar's text edge, text on the labels' edge, button on the actions' edge). One left edge: P. Trailing meta right: P. Lightest boundary: P. Focus follows the action, never body: P (pane after Unarchive from the row on a release and on Settings). Copy the reference product: P for placement (GitHub, Primer, Atlassian as sourced); the action in the row is a recorded deviation (C54).

## Gaps (round 2)

- **History keeps only the last change.** Archive, Unarchive, then Resume by hand: the release page shows neither the archive nor the resume, as if nothing happened (the timeline only adds an event while the status differs from the seed). C58 says the wording stops "once it's resumed by hand"; nothing says the resume itself should be recorded. Not a regression; the same holds for any pause then resume.
- **Round 1's toast-Undo gap stands.** After Unarchive from the row, Undo in the still-open "Archived Ship mobile" toast now also clears the archive's history marks and resumes r1, which still contradicts "Unarchive restarts nothing" (read from `store.ts`, not driven).
