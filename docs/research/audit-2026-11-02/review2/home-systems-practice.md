# Rule review 2: home, systems, practice

Date: 2026-11-02. Method: `.claude/agents/ui-rule-review.md`. Decisions C1–C43 in `../decisions.md` are binding; where a skill reference and its `.mdx` differ, the `.mdx` was used.

Routes: `/`, `/systems/work-tool`, `/systems/consumer-app`, `/systems/look-apple`, `/systems/look-linear`, `/systems/look-playbook`, `/systems/look-primer`, `/practice/mail`, `/practice/mail/app` (Post), `/lab/track` (Track).

Shots: `shots/review2/home-systems-practice/`
- 40 base shots, `<name>-<1280|375>-<light|dark>.png` (home, work-tool, consumer-app, look-apple, look-linear, look-playbook, look-primer, mail, mail-app, track), each looked at whole.
- Flows: `flow-post-archive-1280-light`, `flow-post-context-1280-light`, `flow-post-open-1280-light`, `flow-post-new-375-light|dark`, `flow-track-open-1280-light`, `flow-track-status-1280-light`, `flow-track-delete-1280-light`.
- Detail: `post-compact-1280-light`, `post-foldermenu-375-light`, `track-375-viewport-light`, `home-ratio-stage-2x`, `home-table-stage-2x`.

Measurements were taken with `pnpm shoot --eval` (`getBoundingClientRect`, `getComputedStyle`), a contrast probe compositing each text colour over its ancestor backgrounds, an icon stroke/3:1 probe, and a probe reading each look's Values table. Frame time is out of scope (C43).

## Findings

| Severity | Where | Rule | Evidence | Fix |
| --- | --- | --- | --- | --- |
| must | `/lab/track`, row status cell pick menu (`src/demos/track/Row.tsx` PickMenu → store update; `refocus.ts` runs only on remove) | Owner: focus follows the action, never falls to `<body>`; C39 | Choosing a new status moves the row to another group; React remounts it, the trigger disconnects, `document.activeElement` is `BODY` for the whole ~1 s trace (12 samples, `rowConnected: false`). `flow-track-status-1280-light.png`. The panel's status pick returns focus correctly. | After an update that changes the row's group, focus the row by issue id (same path as `refocus` on remove), or keep the row's node and move it. |
| must | `/lab/track` at 375 (`src/demos/track/Shell.tsx:49` `useState(false)` for `narrow`; `Shell.module.scss` `@container` max-width 760) | nothing-shifts: “Nothing moves unless it was asked to” | First frame renders the sidebar stacked above the list; once the ResizeObserver sets `narrow`, the sidebar is removed and the list jumps ~430px up. `track-375-viewport-light.png` vs `track-375-light.png`. | Hide the sidebar with CSS inside the same container query (as Post does), so the first paint already matches; keep the JS flag only for the header button. |
| should | `/lab/track` rows (`Row.tsx`, `Row.module.scss:99-127`) | C18 labels in lists sit in a column; Table: “Truncating the name column” | Labels follow the title inside `.what`: their left edges fall at 12 different x values. With the panel open, titles truncate while labels stay whole (“Dark mode product photos look wa…” beside “Design”), `flow-track-open-1280-light.png`. | Give labels their own column on one left edge; truncate labels before the title. |
| should | `/practice/mail/app` New message sheet at 375 (`src/demos/post/Composer.tsx`) | Owner: one left edge; Sheet anatomy inset | Title “New message” at x=20; To, Subject and Send at x=16. `flow-post-new-375-light.png`. | Put the composer body on the sheet's 20 inset (or the title on 16); one left edge. |
| should | `/practice/mail/app` at 375, folder menu (`Shell.tsx`) | app-shell `.mdx`: a narrow window that drops the sidebar puts its parts behind a header button; owner: re-home, don't hide | The sidebar's “UI Playbook” back link exists at 1280 and is gone at 375; the folder menu holds Inbox, Starred, Sent, Drafts, Archive only. `post-foldermenu-375-light.png`. | Add the back link to the folder menu after a separator. |
| should | `/` search counts and `#empty` (`Home.astro`); Post search empty (`src/demos/post/List.tsx:158+`); Track filter empty (`Shell.tsx:207`) | C29: counts and empty filter states use `aria-live` polite | No `aria-live` in any of them (eval `live: []` on home; source for Post and Track). | Wrap the count and empty text in a polite live region. |
| should | `/` hero search field (`Hero.astro`) | Input: Avoid “Placeholder as label”; C17 placeholder is only a format example | Placeholder “Search the playbook” is an instruction and the field's only accessible name; the label's visible text is “/”, `aria-hidden`. | `aria-label="Search"` on the field; drop the placeholder or make it an example of what to type. |
| should | `/practice/mail/app` compact density (`List.module.scss`) | C2: a table of one-line rows takes lines; lightest-boundary “Lines between rows” | Compact rows are one line, 44px tall, no line between them. `post-compact-1280-light.png`. Gmail's compact view draws lines. | Hairline `line` between compact rows, starting at the text (C21). If compact isn't a table, record that under C2 (see Gaps). |
| should | `/` Table card preview | Table anatomy: cell padding 12; owner: inspect clipped geometry | Table box 846–1169 inside a stage 837–1168: the frame stops ~9px short of the right edge and the Size column's right padding is cut; numbers touch the frame. `home-table-stage-2x.png`. | Scale or size the preview table to fit inside the stage with its full frame. |
| should | `/practice/mail` “New mail waits its turn” stage; `/` Mail card preview | lightest-boundary Avoid: “A rule under everything”; C21 lines start at the text | A rule sits under the “Inbox” heading; row lines run from the box edge, not the text. `mail-1280-light.png`, `home-1280-light.png`. | Drop the heading rule; inset row lines to the text's left edge. |
| should | `/lab/track` command menu empty state (`CommandMenu.tsx`); Board empty column (`Board.tsx`) | Combobox Copy: “repeat the query and give a next step”; owner: empty states name the next step | “No command matches “q”” ends there; empty board column says “No issues”. | Add the step: “Try a shorter word”, and for the column a “New issue” action or “Drag an issue here”. |
| nit | `/lab/track` header tabs count chip | work-tool: 12px “nothing smaller in a row someone reads” | Chip is mono 11 (the Tabs `.mdx` says 11). | Settle the conflict (Gaps); then 12 if work-tool wins. |
| nit | `/lab/track` at 375, “Show sidebar” button (`Header.module.scss`) | work-tool: targets at least 24 × 24 | Flex shrink squeezes it to 21 × 24. | `flex: none` on the button. |
| nit | `/` card headings (`Home.astro`) | Toolbar Avoid: “Native title tooltip” | Each card `h3` carries `title=`. | Remove `title=`; the full name is already visible or use the playbook Tooltip. |
| nit | `/` “Space groups by ratio” card preview | Card: stage inset; owner: inspect clipped geometry | Preview runs edge to edge; its readout chips sit ~1px from the stage edge. `home-ratio-stage-2x.png`. | Give the preview the stage's inner padding. |
| nit | `/practice/mail` decisions list | C21 lines start at the text | Row lines start at the number column, not the text. | Inset the line to the text column. |
| nit | `/systems/look-linear`, `look-playbook`, `look-primer` Values | Lightness first: control borders 3:1 | `line-strong` over accent-soft composites: Linear light 2.75 (sunken), dark 2.65 (raised); Playbook dark 2.93 (bg); Primer dark 2.87. Every text role passes on every look. | Darken/lighten `line-strong` a step in those looks, or say the 3:1 check covers the four surfaces only (Gaps). |
| nit | `/lab/track` panel delete button (`Panel.tsx`) | Icon Copy: the label names the action | `aria-label="Delete"` without its object. | “Delete issue”. |

## Focus after each flow

| Flow | Where focus lands | Mark |
| --- | --- | --- |
| Post: open a conversation | First message's sender button; Back returns focus to the row | P |
| Post: archive a row (hover action) | Next row; toast “Archived “Q4 roadmap: final draft”” with Undo | P (C39) |
| Post: archive from the context menu | Next row | P |
| Post: New message at 375 | To field, focus-visible; sheet top y=32, gap 32, area scrollTop 0, behind inert (`Sheet.tsx` `inert={covering}`) | P |
| Track: open an issue | Row keeps focus (the list's one Tab stop), panel opens; at 375 Back gets focus (source) | P |
| Track: change status from the row's pick menu | `<body>` | **F (must)** |
| Track: change status from the panel's pick | Trigger | P |
| Track: delete an issue | Next issue (SHOP-61); toast “Deleted SHOP-55” with Undo | P (C39) |

## Owner's rules

| Rule | Mark | Note |
| --- | --- | --- |
| One grid | P | System pages, /practice/mail, home grid hold their columns at 1280 and 375. |
| One left edge | F | Post sheet at 375 (20 vs 16); Track labels after titles (12 x positions). |
| Trailing meta right-aligned in one column | P | Post times, Track dates and avatars, sidebar counts align right (measured). |
| Lightest boundary that holds | F | Post compact rows lack lines (C2); heading rules in the mail stage and home Mail preview. Track groups and Post sidebar pass (C36). |
| Empty states name the next step | F | Track command menu, Track board column; Post search and home search pass. |
| Focus follows the action, never `<body>` | F | Track status change from the row. Every other flow passes. |
| Layout changes re-home context | F | Post 375 drops the back link; Track 375 shows then removes the sidebar. |
| Main area reflects the last action | P | Archive, delete, open all update the main area. |

## Fixed since the last audit (verified)

- Track: group headings use heading and space (C36); labels filled grey; empty faces and no-priority marks shown at rest; no native titles; header 48, tabs 14px; tabs scroll at 375 with 8px before Filter.
- Post: current folder icon in ink; search radius 10 with a `line-strong` edge; top bar 48; rows radius 10; compact faces 28 (C22).
- Both apps: sidebar rows 32; Lucide at stroke 2, every state icon 3:1+; pick menu check in the leading column, then the value's mark (C37).
- `/practice/mail`: frame radius 27 = 18 + 8 + 1; Show buttons named “Show decision N”; compare switch reads Avoid/Prefer at 375.
- Home: card anatomy (frame 18, inset 8, stage 10 `fill-control`, title 14/500, meta 12 `ink-muted`, summary 13/18); look previews drawn from each look's values; hero search 40 tall at 14px.
- System pages: ticks 40 × 24; code block a named Tab stop (“CSS variables for After X”); Values tables stack at 375 with chip edges in `line-strong`; no horizontal overflow; list markers in the gutter; last table row has no line.
- Text contrast: no text under 4.5:1 on any route in either theme (the home slide labels on a gradient sit on a scrim, inside an `aria-hidden` picture).
- Placeholders “Search mail”, “Type a command…”, “Leave a comment…”, “Add description…”, “Issue title” are treated as recorded departures after Gmail and Linear.

## Ledger

Mark meaning: **P** the screen keeps the rule (for an Avoid line: the screen does not do it), **F** the screen breaks it, **n/a** nothing on these routes it can apply to. Each reference lists where it was checked; a note appears where a row differs from that default or needs evidence.

### component-app-shell

Default: Post and Track, 1280 and 375.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: The window scrolls. | P | avoided: panes scroll, window does not (P, T) |
| Avoid/Prefer | Prefer: Each pane scrolls. | P | list, conversation and Track panel scroll alone |
| Anatomy | Window | P | 100dvh frame, no page scroll in /practice/mail/app, /lab/track |
| Anatomy | Title bar or toolbar | P | top bar 48 in Post and Track |
| Anatomy | Sidebar | F | Track at 375: sidebar stacked above the list until ResizeObserver runs, then removed; ~430px jump |
| Anatomy | Sidebar rows | P | 32 in both apps (measured) |
| Anatomy | Sidebar foot | F | Post at 375 drops the "UI Playbook" back link; folder menu holds folders only (.mdx: put them behind a header button) |
| Anatomy | Panes | P | list + reading pane; Track list + panel |
| Common mistake | `overflow: auto` on the pane, and nothing above it told | P | each pane is the scroller; nothing above it relies on window scroll |
| Common mistake | `height: 100vh` on phones | P |  |
| Common mistake | A sticky sidebar on a page that scrolls | n/a | no sticky sidebar on a scrolling page |
| Common mistake | Content that jumps when it gets long | F | Track 375 first frame then jump (see must #2) |
| Common mistake | The account in a sidebar that scrolls | P | Track workspace switcher in sidebar head, not in the scrolling list |
| Copy | Name each pane by what’s in it: Pages, or the open document’s title. That’s what | P | aria-label Conversations, Drafts; Track list labelled by view |

### component-badge

Default: home Badge preview; Track labels read as neutral badges.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Dot only. | P | avoided: Track labels carry their word |
| Avoid/Prefer | Prefer: Dot and word. | P |  |
| Avoid/Prefer | Avoid: Solid fills. | P | avoided: labels filled grey (C36 fix) |
| Avoid/Prefer | Prefer: Soft tints. | P |  |
| Avoid/Prefer | Avoid: Dot on every badge. | P | avoided |
| Avoid/Prefer | Prefer: Dot only on Online. | P |  |
| Anatomy | Height | P |  |
| Anatomy | Padding | P |  |
| Anatomy | Shape | P |  |
| Anatomy | Text | P |  |
| Anatomy | Status | P |  |
| Anatomy | Neutral | P |  |
| Anatomy | Dot | P |  |
| Anatomy | Dot to text | P |  |
| Common mistake | A badge per row in every column | P | Track shows labels only where set |
| Common mistake | Red for “new” | P | no red "new" badges |
| Common mistake | Truncated badges | P | labels never truncate; the title does (Table finding) |
| Common mistake | Badges as buttons | P | labels not interactive in rows |
| Copy | One or two words, sentence case: In review, Shipped, Beta. | P |  |
| Copy | States as adjectives or past participles: Failed, Scheduled. Not verbs: *Fail*,  | P |  |

### component-button

Default: Post New message, Show buttons on /practice/mail, Undo in toasts, home preview; ui/Button.module.scss.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Outlined. | P |  |
| Avoid/Prefer | Prefer: Filled. | P |  |
| Avoid/Prefer | Avoid: Fades both ways. | P |  |
| Avoid/Prefer | Prefer: In at once, out softly. | P | hover in instant, out softer (Button.module.scss:28-37) |
| Avoid/Prefer | Avoid: Down to 0.9. | P |  |
| Avoid/Prefer | Prefer: Down to 0.97. | P | --press-scale |
| Avoid/Prefer | Avoid: Two fills. | P | one filled button per view (New message) |
| Avoid/Prefer | Prefer: One fill, and it’s danger. | n/a | no destructive confirm on these routes (Track delete uses Undo) |
| Avoid/Prefer | Avoid: Spinner at once. | n/a | no busy buttons in these flows |
| Avoid/Prefer | Prefer: Waits 300 ms, keeps its width. | n/a | no busy buttons in these flows |
| Anatomy | Height | P |  |
| Anatomy | Horizontal padding | P |  |
| Anatomy | Radius | P |  |
| Anatomy | Icon gap | P |  |
| Anatomy | Label | P |  |
| Anatomy | Fill | P |  |
| Anatomy | Hover | P |  |
| Anatomy | Press | P |  |
| Anatomy | Busy | n/a | not reached |
| Common mistake | A shadow to lift it | P |  |
| Common mistake | Colour as rank | P |  |
| Common mistake | Disabled with no reason | P | none seen |
| Copy | Start with a verb that names the result: Save changes, Create project, not *OK*  | P |  |
| Copy | Sentence case: Create project, not *Create Project*. | P |  |
| Copy | Match the dialog’s title: a dialog called *Delete project?* confirms with Delete | n/a | no confirmation dialog on these routes |

### component-card

Default: home cards (frame 18, inset 8, stage 10 fill-control, title 14/500, meta 12 ink-muted, measured).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Static card lifts on hover. | P |  |
| Avoid/Prefer | Prefer: Static card stays still. | P |  |
| Avoid/Prefer | Avoid: Up to 1.05, heavy shadow. | P | avoided |
| Avoid/Prefer | Prefer: Up to 1.01, small shadow. | P | home card hover |
| Avoid/Prefer | Avoid: 120 ms apart, uncapped. | P | avoided |
| Avoid/Prefer | Prefer: 30 ms apart, capped at 8. | P | home entrance stagger capped |
| Avoid/Prefer | Avoid: Swaps in one frame. | n/a | no changing counts on cards |
| Avoid/Prefer | Prefer: Digits rise, 30 ms apart. | n/a | no changing counts on cards |
| Anatomy | Frame | P |  |
| Anatomy | Inset | P |  |
| Anatomy | Stage | P |  |
| Anatomy | Title | P |  |
| Anatomy | Subtitle | P | meta 12 ink-muted |
| Anatomy | Meta padding | P |  |
| Anatomy | Hover | P |  |
| Anatomy | Entrance | P |  |
| Common mistake | Buttons all over the card | P |  |
| Common mistake | Text on the stage | P | previews are pictures; table preview frame clipped by stage, see should "Home Table preview" |
| Common mistake | Uneven heights | P | grid rows equal |
| Common mistake | Staggering every re-render | P |  |
| Common mistake | The stage copying the card’s corner | P |  |
| Copy | Title: the thing’s own name: Q4 roadmap, not *Project: Q4 roadmap*. | P |  |
| Copy | Subtitle: the one fact that helps choose between cards, usually when it changed: | P | meta 12 ink-muted |

### component-checkbox

Default: Post select-all checkbox; home preview.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Only the 16 px box clicks. | P |  |
| Avoid/Prefer | Prefer: The whole row clicks. | P |  |
| Avoid/Prefer | Avoid: Parent ticked if any is. | P | avoided |
| Avoid/Prefer | Prefer: Parent dashed if some are. | P | Post select-all shows mixed when some rows chosen |
| Anatomy | Box | P |  |
| Anatomy | Off | P |  |
| Anatomy | On, mixed | P |  |
| Anatomy | Mark | P |  |
| Anatomy | Box to label | P |  |
| Anatomy | Label | P |  |
| Anatomy | Box offset | P |  |
| Anatomy | Children indent | n/a | no nested lists |
| Common mistake | A checkbox that saves on the spot | n/a | no settings checkboxes |
| Common mistake | Negative labels | n/a | none |
| Common mistake | Consent ticked in advance | n/a | none |
| Common mistake | Disabling instead of explaining | n/a | none |
| Copy | Label: what’s true when it’s checked, sentence case, no full stop: Keep me signe | P |  |
| Copy | Group label: what the set is about: Email me about, Export. | n/a | none |
| Copy | Description: the consequence, in a short sentence: Anyone with the link can repl | n/a | none |

### component-combobox

Default: home search, Post search, Track command menu.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Exact match, cities only. | P |  |
| Avoid/Prefer | Prefer: Loose match, countries too. | P |  |
| Avoid/Prefer | Avoid: Nothing highlighted. | P |  |
| Avoid/Prefer | Prefer: First match highlighted. | P |  |
| Avoid/Prefer | Avoid: Plain rows. | P |  |
| Avoid/Prefer | Prefer: Matched letters bolder. | P |  |
| Avoid/Prefer | Avoid: “No results”. | F | Track command menu says "No command matches “q”" with no next step (CommandMenu.tsx) |
| Avoid/Prefer | Prefer: Repeats query, names next step. | F | Track command menu repeats query but names no step; Post and home name one |
| Anatomy | Field | P |  |
| Anatomy | Trigger | P |  |
| Anatomy | List | P |  |
| Anatomy | Current option | P |  |
| Anatomy | Match | P |  |
| Anatomy | Trailing detail | P | Track command menu shortcuts trail in ink-muted |
| Anatomy | Chip | n/a | no chips on these routes |
| Anatomy | List height | P |  |
| Common mistake | Accepting text that isn’t in the list | n/a | search, not a choice field |
| Common mistake | Opening empty | P |  |
| Common mistake | Sorting the matches by score | P |  |
| Common mistake | Chips that push the field off the row | n/a | no chips |
| Copy | Label: what’s being chosen: Time zone, Assignees. | P |  |
| Copy | Placeholder: what you can type, not an instruction to type: Search cities or cou | F | home "Search the playbook" is an instruction (C17); Post/Track placeholders are recorded departures after Gmail/Linear |
| Copy | Empty: repeat the query and give a next step: No city matches “Atlantis”. Try th | F | Track command menu; see should |

### component-dialog

Default: no dialog in the flows driven; home Dialog preview matches its anatomy.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Base UI part | P | home preview |
| Table row | Width | n/a |  |
| Table row | Title | P | home preview: names the thing |
| Table row | Initial focus | n/a |  |
| Table row | Enter | n/a |  |
| Table row | Scrim click | n/a |  |
| Table row | Fill | n/a |  |
| Avoid/Prefer | Avoid: Generic title, OK button. | P | preview avoids |
| Avoid/Prefer | Prefer: Names project, Delete button. | P | preview |
| Avoid/Prefer | Avoid: Focus on Delete. | n/a |  |
| Avoid/Prefer | Prefer: Focus on Cancel. | n/a |  |
| Avoid/Prefer | Avoid: Drops in from 50 px above. | n/a |  |
| Avoid/Prefer | Prefer: Grows in place. | n/a |  |
| Anatomy | Scrim | n/a |  |
| Anatomy | Panel | P | home preview radius 18 |
| Anatomy | Radius | P | home preview |
| Anatomy | Padding | n/a |  |
| Anatomy | Title | P | home preview: names the thing |
| Anatomy | Body to actions | n/a |  |
| Anatomy | Between buttons | n/a |  |
| Anatomy | Button radius | n/a |  |
| Anatomy | Layer | n/a |  |
| Common mistake | Confirming the undoable | P | Track delete and Post archive use Undo, no confirm |
| Common mistake | A dialog on arrival | P | none on arrival |
| Common mistake | Explaining the buttons | n/a |  |
| Common mistake | A dialog that scrolls | n/a |  |
| Copy | Title: the decision or the task, specific: Delete “Q4 roadmap”?, Rename project. | P | home preview: names the thing |
| Copy | Body: what happens, in a sentence, only if the title doesn’t already say it. | n/a |  |
| Copy | Buttons: Cancel, always that word, and a verb for the action. The trigger ends i | n/a |  |

### component-icon

Default: Lucide on every route at stroke 2, no strokeWidth override; state icons 3:1+ (probe).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Typed as characters. | P |  |
| Avoid/Prefer | Prefer: From the library. | P |  |
| Avoid/Prefer | Avoid: Icons, named on hover. | P | Post sidebar and Track sidebar icons beside words |
| Avoid/Prefer | Prefer: Icons beside their words. | P |  |
| Avoid/Prefer | Avoid: 24px, Lucide’s default. | P |  |
| Avoid/Prefer | Prefer: 16px beside 14px text. | P |  |
| Avoid/Prefer | Avoid: Drawn for this page. | P |  |
| Avoid/Prefer | Prefer: From the library. | P |  |
| Anatomy | Size beside 14px text | P |  |
| Anatomy | Size in dense rows (13px) | P |  |
| Anatomy | Size beside 17px text, [Consumer app](https://ui-playbook.suspense.site/systems/consumer-app) | n/a | no consumer screens drawn at 17 |
| Anatomy | Line | P |  |
| Anatomy | Gap to the word | P |  |
| Anatomy | Colour | P |  |
| Anatomy | Button around it | P |  |
| Common mistake | A typed symbol or an emoji as the icon | P |  |
| Common mistake | Two libraries on one screen | P |  |
| Common mistake | Navigation as icons alone | P | Post at 375 header buttons are named and tipped |
| Common mistake | An icon button with no name | P | all icon buttons named; Track panel "Delete" lacks its object, nit |
| Common mistake | A 24px icon beside 14px text | P |  |
| Common mistake | A bigger icon to make a bigger target | P |  |
| Copy | The tooltip and the `aria-label` are the same words, naming the action: Search,  | P | Post row actions tooltip = aria-label |
| Copy | A decorative icon says nothing; its word already said it. | P |  |

### component-input

Default: home search 40/14, Post search radius 10 line-strong, composer fields.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Checks on every keystroke. | n/a | no validated fields |
| Avoid/Prefer | Prefer: Checks when focus leaves. | n/a | no validated fields |
| Avoid/Prefer | Avoid: One faint line at the top. | n/a | no form errors |
| Avoid/Prefer | Prefer: Message under each field. | n/a | no form errors |
| Avoid/Prefer | Avoid: Placeholder as label. | F | home search: placeholder is the only name; label text "/" is aria-hidden |
| Avoid/Prefer | Prefer: Label above, example inside. | F | home search: no label, instruction placeholder |
| Avoid/Prefer | Avoid: Every field full width. | n/a | no fixed-length fields |
| Avoid/Prefer | Prefer: Sized to 16, 4 and 3 digits. | n/a | no fixed-length fields |
| Anatomy | Height | P |  |
| Anatomy | Radius | P |  |
| Anatomy | Edge | P |  |
| Anatomy | Padding | P |  |
| Anatomy | Trailing inset | P |  |
| Anatomy | Embedded key | P | home search "/" key radius 6 = 10-3-1 |
| Anatomy | Label | P |  |
| Anatomy | Label, field, hint | n/a | no hinted fields |
| Anatomy | Focus | P |  |
| Anatomy | Text | P |  |
| Common mistake | A hint that repeats the label | n/a | no hints |
| Common mistake | Clearing the field on error | n/a | no errors |
| Common mistake | Read-only drawn as disabled | n/a | none |
| Copy | Label: a noun, sentence case, no colon: Email, Postal code. | P | Post composer: To, Subject |
| Copy | Placeholder: an example, not an instruction: ana@studio.com, not *Enter your ema | F | home "Search the playbook" (C17); Post/Track ones recorded after Gmail/Linear |
| Copy | Error: what to do, with an example if the format is the problem: Enter a 5-digit | n/a | no errors |

### component-menu

Default: Post context and folder menus, Track pick menu (popup r10 inset 4, rows 32 r6, 13px, shadow-md, measured).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Icon | P |  |
| Table row | Shortcut | P | ink-muted per .mdx |
| Table row | Unavailable item | P |  |
| Table row | Checkmark | P |  |
| Table row | Submenu | n/a | no submenus |
| Table row | Group label | P | Post folder menu has none repeating its trigger |
| Table row | Ellipsis | P | none needed |
| Avoid/Prefer | Avoid: Icons on two rows. | P |  |
| Avoid/Prefer | Prefer: Icons on every row. | P |  |
| Avoid/Prefer | Avoid: Six shortcuts. | P | avoided |
| Avoid/Prefer | Prefer: No shortcuts. | P | Post context menu shortcuts only where real, ink-muted (.mdx) |
| Avoid/Prefer | Avoid: Two items dimmed. | P | avoided |
| Avoid/Prefer | Prefer: Unavailable items left out. | P |  |
| Avoid/Prefer | Avoid: Highlight at 5%. | P |  |
| Avoid/Prefer | Prefer: Highlight at 9%. | P |  |
| Avoid/Prefer | Avoid: Grey highlight, red text. | P |  |
| Avoid/Prefer | Prefer: Red highlight, red text. | P |  |
| Avoid/Prefer | Avoid: Check after the label. | P | avoided: Track pick menu check in leading column, then the value mark (C37) |
| Avoid/Prefer | Prefer: Check in a leading column. | P | Track pick menu |
| Avoid/Prefer | Avoid: A box per key. | P |  |
| Avoid/Prefer | Prefer: Bare symbols in a column. | P |  |
| Avoid/Prefer | Avoid: Grows from its centre. | P | avoided: transform-origin var(--transform-origin) (Menu.module.scss:26) |
| Avoid/Prefer | Prefer: Grows from the trigger. | P | Menu.module.scss:26 |
| Anatomy | Popup radius | P |  |
| Anatomy | Popup inset | P |  |
| Anatomy | Width | P |  |
| Anatomy | Separator | P |  |
| Anatomy | Item radius | P |  |
| Anatomy | Item height | P |  |
| Anatomy | Item padding, icon gap | P |  |
| Anatomy | Label | P |  |
| Anatomy | Shortcut | P | ink-muted per .mdx |
| Anatomy | Label to shortcut | P |  |
| Anatomy | Surface | P |  |
| Common mistake | A menu for one or two items | P | none |
| Common mistake | A group label that repeats the trigger | P | none |
| Common mistake | Destructive actions mid-list | P | Post context menu: Delete last after separator |
| Common mistake | Closing on every toggle | n/a | no toggles |
| Common mistake | Submenus inside submenus | n/a | none |
| Copy | Commands are verbs or verb phrases: Duplicate, Move to. Choices are the values t | P | Post: Archive, Star, Mark as unread; Track choices are values |
| Copy | An ellipsis means more input follows before the action completes: Share… opens a | P | none misused |
| Copy | Sentence case, unlike Apple’s title case: every label in the playbook is in sent | P |  |
| Copy | Keep one grammatical form within a menu. | P |  |

### component-popover

Default: Track filter popover; home preview; Popover.module.scss:27 origin.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Grows from its centre. | P |  |
| Avoid/Prefer | Prefer: Grows from the trigger. | P |  |
| Avoid/Prefer | Avoid: Focus stays on the page. | P | avoided |
| Avoid/Prefer | Prefer: Focus to field and back. | P | Track filter field focused, returns to Filter |
| Avoid/Prefer | Avoid: Trigger unchanged when open. | P |  |
| Avoid/Prefer | Prefer: Trigger stays filled. | P |  |
| Avoid/Prefer | Avoid: Closing clears the draft. | n/a | no drafts in popovers here |
| Avoid/Prefer | Prefer: Closing keeps the draft. | n/a | no drafts in popovers here |
| Anatomy | Popup | P |  |
| Anatomy | Inset | P |  |
| Anatomy | Width | P |  |
| Anatomy | Gap to trigger | P |  |
| Anatomy | Title | n/a | no titled popover in apps |
| Anatomy | Description | n/a | none needed |
| Anatomy | Between blocks | P |  |
| Anatomy | Actions | P |  |
| Anatomy | Trigger while open | P |  |
| Common mistake | Opening on hover | P | click only |
| Common mistake | A popover for a decision | P | none |
| Common mistake | Popovers inside popovers | P | none |
| Common mistake | A Save that isn’t needed | P | filters apply at once |
| Copy | Title: what the panel is for, matching its trigger: Share “Q4 roadmap”, About st | n/a | no titled popover in apps |
| Copy | Description: one sentence of consequence: People you invite can edit. | n/a | none needed |
| Copy | Action: a verb for the job, not *OK*: Invite, Apply. | n/a | no action button |

### component-radio

Default: only as a home card preview; preview matches the rule.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Nothing chosen. | n/a |  |
| Avoid/Prefer | Prefer: Standard already chosen. | n/a |  |
| Avoid/Prefer | Avoid: Three buttons, three Tab stops. | n/a |  |
| Avoid/Prefer | Prefer: One group, one Tab stop. | n/a |  |
| Avoid/Prefer | Avoid: Inline, 16px apart. | n/a |  |
| Avoid/Prefer | Prefer: One column. | n/a |  |
| Avoid/Prefer | Avoid: Square checkboxes. | n/a |  |
| Avoid/Prefer | Prefer: Round radios. | n/a |  |
| Anatomy | Circle | n/a |  |
| Anatomy | Off | n/a |  |
| Anatomy | On | n/a |  |
| Anatomy | Dot | n/a |  |
| Anatomy | Circle to label | n/a |  |
| Anatomy | Label | n/a |  |
| Anatomy | Circle offset | n/a |  |
| Anatomy | Follow-up indent | n/a |  |
| Anatomy | Inline gap | n/a |  |
| Common mistake | No default | n/a |  |
| Common mistake | A radio that acts on the spot | n/a |  |
| Common mistake | Yes and No as radios | n/a |  |
| Common mistake | Hiding the choice in a Select | n/a |  |
| Copy | Group label: what is being chosen: Shipping, Export at. | n/a |  |
| Copy | Option labels: parallel, short, sentence case, no full stop: Your team, Anyone w | n/a |  |
| Copy | Description: what the choice means, not a restatement: Including guests, once th | n/a |  |

### component-segmented-control

Default: Track list/board switch, /practice/mail Avoid/Prefer switch at 375, home preview.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Chooses | P |  |
| Table row | Options | P |  |
| Table row | Sits | P |  |
| Avoid/Prefer | Avoid: Segments fill in place. | P |  |
| Avoid/Prefer | Prefer: One thumb slides across. | P |  |
| Avoid/Prefer | Avoid: As wide as their words. | P |  |
| Avoid/Prefer | Prefer: Equal widths. | P |  |
| Avoid/Prefer | Avoid: Thumb in the accent. | P | avoided |
| Avoid/Prefer | Prefer: Raised thumb in greys. | P | Track view switch, mail compare switch |
| Avoid/Prefer | Avoid: Two icons and one word. | P | avoided |
| Avoid/Prefer | Prefer: All icons, with tooltips. | P | Track list/board icons tipped |
| Anatomy | Track | P |  |
| Anatomy | Inset | P |  |
| Anatomy | Thumb | P |  |
| Anatomy | Segment | P |  |
| Anatomy | Label | P |  |
| Anatomy | Icon segment | P |  |
| Common mistake | A label that repeats the options | P | none |
| Common mistake | Six segments on a narrow screen | n/a | two segments |
| Common mistake | Segments that do something | P | none act |
| Common mistake | Changing the page’s main content | P | Track view switch changes the view by design (Linear); mail switch swaps the demo |
| Copy | Segments: nouns, one word where possible, of similar length: Board, List, Timeli | P |  |
| Copy | Sentence case. Icon segments take the same nouns as tooltips: Align left. | P |  |

### component-select

Default: no Select on these routes outside the home preview; Track status uses a Menu choice kind (C37; see Gaps on C8).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Trigger shows | n/a |  |
| Table row | Picking a row | n/a |  |
| Table row | Chevron | n/a |  |
| Table row | Opens | n/a |  |
| Table row | Rows | n/a |  |
| Avoid/Prefer | Avoid: Two fills. | n/a |  |
| Avoid/Prefer | Prefer: One fill, plus a check. | n/a |  |
| Avoid/Prefer | Avoid: Drops below like a menu. | n/a |  |
| Avoid/Prefer | Prefer: Opens over the trigger. | n/a |  |
| Avoid/Prefer | Avoid: “Select…” placeholder. | n/a |  |
| Avoid/Prefer | Prefer: Editor already chosen. | n/a |  |
| Avoid/Prefer | Avoid: One down chevron. | n/a |  |
| Avoid/Prefer | Prefer: Up and down chevrons. | n/a |  |
| Anatomy | Trigger | n/a |  |
| Anatomy | Chevron | n/a |  |
| Anatomy | List | n/a |  |
| Anatomy | List width | n/a |  |
| Anatomy | Current option | n/a |  |
| Anatomy | Keyboard highlight | n/a |  |
| Anatomy | Layer | n/a |  |
| Common mistake | A Select for Yes / No | n/a |  |
| Common mistake | A Select that runs commands | n/a |  |
| Common mistake | An empty first option as the placeholder | n/a |  |
| Common mistake | Long sentences as options | n/a |  |
| Copy | Label: what the value is, a noun: Role, Font. | n/a |  |
| Copy | Options: short, sentence case, parallel in form: Owner, Admin, Editor. | n/a |  |
| Copy | Placeholder, when there is one: Choose a reason, not *Select…*. | n/a |  |

### component-sheet

Default: Post New message at 375 (top y=32, gap 32, To focused, behind inert via Sheet.tsx).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | What’s behind, below the top height | P |  |
| Table row | What’s behind, at the top height | P |  |
| Table row | Press outside | P |  |
| Table row | Focus on open | P | To focused, focus-visible |
| Table row | Heights | P |  |
| Avoid/Prefer | Avoid: Modal at every height. | n/a | composer has one height |
| Avoid/Prefer | Prefer: Standard up to half height. | n/a | composer has one height |
| Avoid/Prefer | Avoid: Sheet stays over the map. | n/a | no map |
| Avoid/Prefer | Prefer: Sheet lowers to half. | n/a | no map |
| Avoid/Prefer | Avoid: Scrolling raises the sheet. | P |  |
| Avoid/Prefer | Prefer: Scrolling scrolls the list. | P |  |
| Anatomy | Panel | P |  |
| Anatomy | Top corners | P |  |
| Anatomy | Gap at full height | P | 32 (.mdx) |
| Anatomy | Grabber | P |  |
| Anatomy | Header | F | see Inset: header text and body differ by 4px |
| Anatomy | Inset | F | title "New message" at x=20; To, Subject, Send at x=16 (one left edge) |
| Anatomy | Heights | P |  |
| Anatomy | Dim | P |  |
| Anatomy | Motion | P |  |
| Common mistake | A modal sheet over a map | n/a | no map |
| Common mistake | A full-height sheet that doesn’t block | P |  |
| Common mistake | Trusting `modal={false}` | P |  |
| Common mistake | A scroll that grows the sheet | P |  |
| Common mistake | Sheets on sheets | P | none |
| Copy | Title: what’s in it, as the screen behind would name it: Walk to the ferry, Harb | P | "New message", as Gmail names it |
| Copy | Actions: Close as an icon with its label; a way back within the sheet names wher | P | Close is an icon with its label |

### component-slider

Default: only as a home card preview; preview matches the rule.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: 4 px track, 16 px knob. | n/a |  |
| Avoid/Prefer | Prefer: The whole 32 px row drags. | n/a |  |
| Avoid/Prefer | Avoid: Eases 400 ms behind the drag. | n/a |  |
| Avoid/Prefer | Prefer: Follows the pointer exactly. | n/a |  |
| Avoid/Prefer | Avoid: Stops dead at the end. | n/a |  |
| Avoid/Prefer | Prefer: Stretches up to 10 px. | n/a |  |
| Avoid/Prefer | Avoid: Handle over the value. | n/a |  |
| Avoid/Prefer | Prefer: Handle fades to 10%. | n/a |  |
| Avoid/Prefer | Avoid: Proportional digits. | n/a |  |
| Avoid/Prefer | Prefer: Tabular digits. | n/a |  |
| Anatomy | Row | n/a |  |
| Anatomy | Fill | n/a |  |
| Anatomy | Label | n/a |  |
| Anatomy | Value | n/a |  |
| Anatomy | Handle | n/a |  |
| Anatomy | Ticks | n/a |  |
| Anatomy | In a panel | n/a |  |
| Common mistake | No visible value | n/a |  |
| Common mistake | A slider for a precise number | n/a |  |
| Common mistake | Steps finer than the pixels | n/a |  |
| Common mistake | Animating keyboard steps | n/a |  |
| Copy | Label: the property, a noun: Opacity, Radius, Columns. | n/a |  |
| Copy | Value: the number with its unit attached: 64%, 12px. A bare number when the unit | n/a |  |

### component-switch

Default: only as a home card preview; preview matches the rule.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Takes effect | n/a |  |
| Table row | Typical home | n/a |  |
| Table row | Mixed state | n/a |  |
| Table row | Hierarchy | n/a |  |
| Table row | Placement | n/a |  |
| Avoid/Prefer | Avoid: Waits for Save. | n/a |  |
| Avoid/Prefer | Prefer: Applies at once. | n/a |  |
| Avoid/Prefer | Avoid: Label shows the state. | n/a |  |
| Avoid/Prefer | Prefer: Label names the setting. | n/a |  |
| Avoid/Prefer | Avoid: Knob holds its shape. | n/a |  |
| Avoid/Prefer | Prefer: Knob stretches 4 px. | n/a |  |
| Anatomy | Track | n/a |  |
| Anatomy | Knob | n/a |  |
| Anatomy | Inset | n/a |  |
| Anatomy | Off | n/a |  |
| Anatomy | On | n/a |  |
| Anatomy | Travel | n/a |  |
| Anatomy | Label to switch | n/a |  |
| Anatomy | Disabled | n/a |  |
| Common mistake | A switch in a form with a Submit button | n/a |  |
| Common mistake | On / Off text inside or beside the track | n/a |  |
| Common mistake | A confirmation after flipping | n/a |  |
| Common mistake | Colour as the only difference | n/a |  |
| Copy | Label: the setting, as a noun phrase or a verb phrase that’s true when on: Autos | n/a |  |
| Copy | Never the state: not *Grid on*, not *Enabled*. | n/a |  |
| Copy | Description: what on means, when it isn’t obvious: Moved objects land on grid li | n/a |  |

### component-table

Default: system Values tables, home Table preview; Post compact list (C2) and Track rows by analogy.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Sizes left-aligned. | P |  |
| Avoid/Prefer | Prefer: Sizes right-aligned, tabular. | P |  |
| Avoid/Prefer | Avoid: Zebra stripes. | P | none |
| Avoid/Prefer | Prefer: One line between rows. | F | Post compact: one-line 44px rows with no line (C2) |
| Avoid/Prefer | Avoid: Arrows on every header. | n/a | no sortable tables |
| Avoid/Prefer | Prefer: Arrow on the sorted column. | n/a | no sortable tables |
| Avoid/Prefer | Avoid: Every column in ink. | P |  |
| Avoid/Prefer | Prefer: Secondary columns muted. | P |  |
| Avoid/Prefer | Avoid: Names scroll away. | n/a | no horizontal scroll on these routes |
| Avoid/Prefer | Prefer: Name column pinned. | n/a | no horizontal scroll |
| Anatomy | Frame | F | home Table preview: frame ends ~9px early inside the stage |
| Anatomy | Header | P |  |
| Anatomy | Row | P |  |
| Anatomy | Cell padding | F | home Table preview: table 846-1169 inside stage 837-1168, right padding cut (home-table-stage-2x.png) |
| Anatomy | Divider | P | system tables: last row has no line |
| Anatomy | Numbers | P |  |
| Anatomy | Secondary columns | P |  |
| Anatomy | Hover · selected | P |  |
| Anatomy | Sticky header | n/a | no long tables |
| Common mistake | Status as colour alone | P | Track status icons carry aria-label and the group heading word |
| Common mistake | Actions in every row | P | Post shows row actions on hover |
| Common mistake | Truncating the name column | F | Track with panel open truncates titles, keeps labels whole |
| Common mistake | Row click and checkbox doing different things without saying so | P | Post: row opens, checkbox selects |
| Copy | Headers: a noun, sentence case, short: Name, Owner, Modified. | P |  |
| Copy | Units in the cells, not the header, when values mix scales: 18.4 MB, 812 KB. | n/a | no mixed units |
| Copy | Empty cells show an en dash, –, not *N/A* or nothing. | n/a | none |

### component-tabs

Default: Track view tabs (toolbar height, 14px, count chip mono 11 per .mdx), home preview.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Switches | P |  |
| Table row | Looks like | P |  |
| Table row | Count | P | mono 11 per .mdx; conflicts with work-tool 12 floor (Gaps) |
| Table row | Sits | P |  |
| Avoid/Prefer | Avoid: Current tab goes bold. | P |  |
| Avoid/Prefer | Prefer: Weight 500, colour only. | P |  |
| Avoid/Prefer | Avoid: Current tab in the accent. | P |  |
| Avoid/Prefer | Prefer: Current tab in ink. | P |  |
| Avoid/Prefer | Avoid: Wraps onto more rows. | P | avoided: Track tabs scroll at 375 |
| Avoid/Prefer | Prefer: One row that scrolls. | P | 8px before Filter at 375 |
| Avoid/Prefer | Avoid: Count in parentheses. | P |  |
| Avoid/Prefer | Prefer: Count in a quiet chip. | P |  |
| Anatomy | Tab height | P |  |
| Anatomy | Between tabs | P |  |
| Anatomy | Label | P |  |
| Anatomy | Default | P |  |
| Anatomy | Current | P |  |
| Anatomy | Bar | P |  |
| Anatomy | Line | P |  |
| Anatomy | Count | P | mono 11 per .mdx; conflicts with work-tool 12 floor (Gaps) |
| Anatomy | Panel gap | P | list follows header |
| Common mistake | Tabs that hide required input | n/a | none |
| Common mistake | Controls above the tabs that act on one panel | P | Filter acts on all tabs |
| Common mistake | Tabs that reset | P | view state kept |
| Common mistake | A single tab | P | three tabs |
| Copy | Labels: nouns or short noun phrases, one or two words: Overview, Pull requests. | P |  |
| Copy | Sentence case, as everywhere here; Apple’s title case is the platform’s, not our | P |  |
| Copy | Parallel: all nouns, or all verbs. Not *Overview*, *Manage members*, *Billing*. | P |  |

### component-toast

Default: Post "Archived “Q4 roadmap: final draft”" + Undo; Track "Deleted SHOP-55" + Undo; limit 3 (Toast.tsx:110).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Asks before deleting. | P |  |
| Avoid/Prefer | Prefer: Deletes, offers Undo. | P |  |
| Avoid/Prefer | Avoid: Filled with colour. | P |  |
| Avoid/Prefer | Prefer: Neutral, with an icon. | P |  |
| Avoid/Prefer | Avoid: All six stack up. | P |  |
| Avoid/Prefer | Prefer: Three at most, oldest out. | P |  |
| Table row | Kind | P |  |
| Table row | Done | P |  |
| Table row | With Undo | P |  |
| Table row | Needs attention | n/a | not raised |
| Table row | Failed | n/a | not raised |
| Anatomy | Shape | P |  |
| Anatomy | Height | P |  |
| Anatomy | Inset | P |  |
| Anatomy | Width | P |  |
| Anatomy | Icon | P |  |
| Anatomy | Text | P |  |
| Anatomy | Actions | P |  |
| Anatomy | Place | P |  |
| Common mistake | Errors that disappear | n/a | no errors raised |
| Common mistake | Toasts as the only feedback | P | row leaves the list and focus moves |
| Common mistake | Links and paragraphs | P |  |
| Common mistake | Toasts on page load | P | none on load |
| Copy | Say what happened, past tense, with its object: Deleted “Q4 roadmap”, Link copie | P |  |
| Copy | Failures say what failed and why: Couldn’t export: the file is locked. | n/a | no failures raised |
| Copy | The action is one verb: Undo, Retry, View. | P |  |

### component-toolbar

Default: Post hover row actions; home preview.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Current tool filled solid. | n/a | no current tool |
| Avoid/Prefer | Prefer: Current tool tinted. | n/a | no current tool |
| Avoid/Prefer | Avoid: Native title tooltip. | F | home card h3 elements carry native title= (nit) |
| Avoid/Prefer | Prefer: Tip with its shortcut. | P | Post row action tips |
| Anatomy | Panel | P |  |
| Anatomy | Panel inset | P |  |
| Anatomy | Tools | P |  |
| Anatomy | Gap between tools | P |  |
| Anatomy | Panel height | P |  |
| Anatomy | Divider | n/a | no divided groups |
| Anatomy | Current tool | n/a | no current tool |
| Common mistake | Borders around groups | P |  |
| Common mistake | Two icon sets | P |  |
| Common mistake | Uneven inset | P |  |
| Copy | Tooltips name the tool, then its shortcut: Rectangle R. The name matches the `ar | P |  |

### component-tooltip

Default: shared provider, DELAY 500 (Tooltip.tsx:9,32); inverse ink.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Each waits 500 ms. | P |  |
| Avoid/Prefer | Prefer: One shared 500 ms delay. | P |  |
| Avoid/Prefer | Avoid: Raised surface, shadow. | P |  |
| Avoid/Prefer | Prefer: Inverse ink, no shadow. | P |  |
| Anatomy | Ground and text | P |  |
| Anatomy | Radius | P |  |
| Anatomy | Padding | P |  |
| Anatomy | Text | P |  |
| Anatomy | Offset from trigger | P |  |
| Anatomy | Delay | P |  |
| Anatomy | Layer | P |  |
| Common mistake | Anything clickable inside | P | none |
| Common mistake | Tooltips on labelled buttons | P | none on labelled buttons in apps |
| Common mistake | Sentences | P | none |
| Copy | The tooltip’s name is the control’s `aria-label`, word for word: Zoom out, not * | P |  |
| Copy | Sentence case, no full stop. Shortcut after the name: Redo ⇧⌘Z. | P |  |

### principle-a-shadow-says-how-high

Default: shadows only on menus, popovers, toasts, sheet; cards flat.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Shadows on everything. | P |  |
| Avoid/Prefer | Prefer: Shadow on the menu only. | P |  |
| Avoid/Prefer | Avoid: Same shadow while held. | n/a | no drag |
| Avoid/Prefer | Prefer: Longer drop while held. | n/a | no drag |
| Avoid/Prefer | Avoid: One dark 24 px drop. | P |  |
| Avoid/Prefer | Prefer: Hairline, contact and drop. | P |  |
| Table row | Height | P |  |
| Table row | shadow-xs | P |  |
| Table row | shadow-sm | P |  |
| Table row | shadow-md | P |  |
| Table row | shadow-lg | n/a | no dialog opened |

### principle-attention-wears-off-waiting-doesnt

Default: archive, delete, status change act at once.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: 450 ms flight, press waits. | P |  |
| Avoid/Prefer | Prefer: 120 ms close-up, no wait. | P |  |
| Avoid/Prefer | Avoid: Confetti on every tick. | n/a | no milestone moments |
| Avoid/Prefer | Prefer: Confetti on the last tick. | n/a | no milestone moments |
| Table row | How often | P |  |
| Table row | Many times a minute: archive, tick, switch, tab | P |  |
| Table row | A few times a session: open a panel, a sheet, a dialog | P |  |
| Table row | Rarely: a day’s last task, a launch, a milestone | n/a | none |

### principle-colour-means-one-thing

Default: accent on New message, unread dot, selection; red not used for counts.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Accent on every current state. | P |  |
| Avoid/Prefer | Prefer: Accent only on Publish. | P |  |
| Avoid/Prefer | Avoid: Hover in the selection tint. | P |  |
| Avoid/Prefer | Prefer: Hover in neutral grey. | P |  |
| Avoid/Prefer | Avoid: Counts in red too. | P |  |
| Avoid/Prefer | Prefer: Red only for Payment failed. | P |  |
| Avoid/Prefer | Avoid: Accent on plan details. | n/a | no billing |
| Avoid/Prefer | Prefer: Accent only on Manage billing. | n/a | no billing |

### principle-concentric-radius

Default: home card 18/8/10; menu 10/4/6; field key 10-3-1=6; /practice/mail frame 27=18+8+1.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Both corners 20 px. | P |  |
| Avoid/Prefer | Prefer: Inner 20 − 10 = 10 px. | P |  |
| Avoid/Prefer | Avoid: Key corner 10 px. | P |  |
| Avoid/Prefer | Prefer: Key corner 10 − 3 − 1 = 6 px. | P |  |
| Table row | Card radius-xl 18 | P |  |
| Table row | Property panel radius-xl 18 | n/a | none on these routes |
| Table row | Menu radius-lg 10 | P |  |
| Table row | Field radius-lg 10 | P |  |
| Table row | Toolbar, segmented, toast radius-full | P |  |
| Table row | Switch track radius-full | n/a | preview only; matches |
| Table row | Dialog radius-xl 18 | n/a | not opened |
| Common mistake | Uneven inset | P |  |
| Common mistake | One radius for everything | P |  |

### principle-error-timing

Default: no validated input on these routes.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Rule | Fixed-length answers | n/a |  |
| Rule | Availability | n/a |  |
| Rule | Typed confirmations | n/a |  |

### principle-every-line-does-a-job

Default: page copy, labels, toasts.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Three lines before the first field. | P | avoided |
| Avoid/Prefer | Prefer: The task, then the field. | P |  |
| Avoid/Prefer | Avoid: Every row starts “Manage”. | P |  |
| Avoid/Prefer | Prefer: The word that differs first. | P |  |
| Avoid/Prefer | Avoid: An eyebrow. | P | "In practice" on /practice/mail says where it sits |
| Avoid/Prefer | Prefer: Where it sits. | P |  |
| Avoid/Prefer | Avoid: Under the terms box. | n/a | no forms |
| Avoid/Prefer | Prefer: With the action that failed. | n/a | no failures |
| Table row | Place | P |  |
| Table row | Heading | P |  |
| Table row | Line above a heading | P |  |
| Table row | [Button](https://ui-playbook.suspense.site/components/button) | P |  |
| Table row | [Menu item](https://ui-playbook.suspense.site/components/menu) | P |  |
| Table row | [Field label](https://ui-playbook.suspense.site/components/input) | P |  |
| Table row | [Hint](https://ui-playbook.suspense.site/components/input) | P |  |
| Table row | [Placeholder](https://ui-playbook.suspense.site/components/input) | F | home "Search the playbook" is an instruction (C17) |
| Table row | [Error](https://ui-playbook.suspense.site/components/input) | P |  |
| Table row | [Empty state](https://ui-playbook.suspense.site/components/combobox) | F | Track command menu and board column "No issues" name no next step |
| Table row | [Toast](https://ui-playbook.suspense.site/components/toast) | P |  |
| Table row | [Confirmation](https://ui-playbook.suspense.site/components/dialog) | n/a | none |

### principle-grey-until-it-matters

Default: Track labels grey (C36); no accent spent on panels.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Every label in its own colour. | P |  |
| Avoid/Prefer | Prefer: Labels grey, their colour a dot. | P |  |
| Avoid/Prefer | Avoid: A slogan and a panel of shapes. | n/a | no sign-up form |
| Avoid/Prefer | Prefer: The form, and what joining means. | n/a | no sign-up form |

### principle-hover-forgives

Default: Post row actions hold within the row; home cards own their hover.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Closes on any row crossed. | P |  |
| Avoid/Prefer | Prefer: Holds while heading to it. | P |  |
| Avoid/Prefer | Avoid: Content owns the hover. | P |  |
| Avoid/Prefer | Prefer: Whole card owns the hover. | P |  |

### principle-how-waiting-feels

Default: no waits on these routes beyond instant local actions.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Spinner at once. | n/a |  |
| Avoid/Prefer | Prefer: Waits 300 ms, stays 500 ms. | n/a |  |
| Table row | Time | n/a |  |
| Table row | Under 0.1 s | P | archive, delete, status change are instant |
| Table row | Under 1 s | n/a |  |
| Table row | Up to 10 s | n/a |  |
| Table row | Over 10 s | n/a |  |
| Avoid/Prefer | Avoid: Stalls 1 s at 90%. | n/a |  |
| Avoid/Prefer | Prefer: Stalls 1 s at the start. | n/a |  |
| Avoid/Prefer | Avoid: Solid fill. | n/a |  |
| Avoid/Prefer | Prefer: Stripes drifting backwards. | n/a |  |
| Avoid/Prefer | Avoid: “Searching…” for 3.6 s. | n/a |  |
| Avoid/Prefer | Prefer: Names each airline as asked. | n/a |  |
| Avoid/Prefer | Avoid: Page spinner, list bones. | n/a |  |
| Avoid/Prefer | Prefer: Page skeleton, list spinner. | n/a |  |
| Avoid/Prefer | Avoid: Waits 0.9 s for the server. | P | Post star applies at once |
| Avoid/Prefer | Prefer: Stars at once, rolls back. | P | Post star |

### principle-lightness-first

Default: contrast probe: all text 4.5:1 in both themes on every route.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Text, any size the reader reads | P |  |
| Table row | Control borders, focus rings, icons that carry state | F | looks: line-strong under 3:1 on accent-soft composites (Linear 2.75/2.65, Playbook dark 2.93, Primer dark 2.87); nit, see Gaps |
| Table row | A fill with a white label | P | New message 4.5:1+ |
| Table row | Decorative lines | n/a | no requirement |

### principle-never-too-busy-to-listen

Default: menus, popovers use reversible transitions.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Drops clicks mid-slide. | P |  |
| Avoid/Prefer | Prefer: Each click moves the target. | P |  |
| Avoid/Prefer | Avoid: Two keyframe animations. | P |  |
| Avoid/Prefer | Prefer: One reversible transition. | P |  |
| Avoid/Prefer | Avoid: Timed ease from rest. | n/a | no draggable surfaces here |
| Avoid/Prefer | Prefer: Spring carries the velocity. | n/a | no draggable surfaces here |

### principle-nothing-shifts

Default: Post new mail waits behind a pill; scrollbar gutter kept.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Pages land above Recent. | F | Track 375: list jumps ~430px when the sidebar is removed after first paint |
| Avoid/Prefer | Prefer: Pages land below Recent. | F | same |
| Avoid/Prefer | Avoid: Bold widens the link. | P |  |
| Avoid/Prefer | Prefer: Width reserved for bold. | P |  |
| Avoid/Prefer | Avoid: Gutter comes and goes. | P |  |
| Avoid/Prefer | Prefer: Gutter always kept. | P | stable |
| Avoid/Prefer | Avoid: Scroll anchoring off. | P |  |
| Avoid/Prefer | Prefer: Scroll anchoring on. | P |  |
| Avoid/Prefer | Avoid: Plain Arial fallback. | P |  |
| Avoid/Prefer | Prefer: Arial sized to Geist. | P | fallback metrics set |

### principle-reading-text

Default: prose 16/26, 45em; interface 13-14; tabular times in Post.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Line | P |  |
| Table row | Leading | P |  |
| Table row | Weight | P |  |
| Table row | Numbers | P |  |

### principle-space-groups-by-ratio

Default: Post day headings more space above than below.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Half above, half below. | P |  |
| Avoid/Prefer | Prefer: 85% above, 15% below. | P |  |
| Avoid/Prefer | Avoid: Stripe per line. | P | avoided |
| Avoid/Prefer | Prefer: Stripe per transaction. | n/a | no transactions |
| Avoid/Prefer | Avoid: Subjects start after sender. | P | avoided: Post subjects share one edge |
| Avoid/Prefer | Prefer: Subjects share one edge. | P | Post rows |

### principle-the-faster-way

Default: Track command menu shows shortcuts; Post keys tipped (Post has no letter keys by owner decision).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Keys one tooltip at a time. | P |  |
| Avoid/Prefer | Prefer: Modifier shows every key. | P |  |

### principle-the-lightest-boundary-that-holds

Default: Track groups heading and space (C36); system pages heading and space.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Every section a card. | P |  |
| Avoid/Prefer | Prefer: Headings and space; one box where it’s needed. | P |  |
| Avoid/Prefer | Avoid: Three equal tiles. | n/a | no figures |
| Avoid/Prefer | Prefer: One row of figures. | n/a | no figures |
| Avoid/Prefer | Avoid: One group boxed. | P |  |
| Avoid/Prefer | Prefer: All on the page’s edge. | P |  |
| Avoid/Prefer | Avoid: A rule under everything. | F | /practice/mail Arrivals stage and home Mail preview draw a rule under "Inbox" |
| Avoid/Prefer | Prefer: Lines between rows, lighter than the edge. | F | same stages: lines start at the box edge, not the text (C21) |
| Table row | Boundary | P |  |
| Table row | A heading and space | P |  |
| Table row | A line between rows | F | Post compact rows have none (C2); mail decisions list lines start at number column |
| Table row | One group, inset or outlined | P |  |
| Table row | A card | P |  |
| Table row | A separate surface | P |  |

### principle-where-the-eye-goes

Default: toasts and focus near the action.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Count changes in the corner. | P |  |
| Avoid/Prefer | Prefer: Button says “Added”. | P |  |
| Avoid/Prefer | Avoid: First screen ends at the band. | n/a | no pricing |
| Avoid/Prefer | Prefer: Fold cuts through the plans. | n/a | no pricing |
| Avoid/Prefer | Avoid: Promo-style band on top. | n/a | none |
| Avoid/Prefer | Prefer: Note beside the card. | n/a | none |
| Avoid/Prefer | Avoid: 12 between everything. | P |  |
| Avoid/Prefer | Prefer: 4 within, 20 between. | P |  |
| Avoid/Prefer | Avoid: Resources, Solutions, More. | P | nav names things |
| Avoid/Prefer | Prefer: Invoices and refunds, API. | P | nav names things |

### principle-who-before-what

Default: Post faces lead rows; checkbox in its own column; compact faces 28 (C22).

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Avoid/Prefer | Avoid: Checkbox replaces the face. | P |  |
| Avoid/Prefer | Prefer: Checkbox in its own column. | P |  |
| Table row | Person | P |  |
| Table row | Company | P | Atlas Travel initial |
| Table row | Checkbox | P |  |
| Table row | Not on a face | P |  |

### system-consumer-app

Default: /systems/consumer-app page itself (values, prose); no consumer app on these routes.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Body text | P |  |
| Table row | Text size | P |  |
| Table row | Labels and meta | P |  |
| Table row | Text contrast | P |  |
| Table row | Targets | P |  |
| Table row | Controls | P |  |
| Table row | Spacing | P |  |
| Table row | Radius | P |  |
| Table row | Colour | P |  |
| Table row | Images | n/a | page content only |
| Rule | The same app on a desktop browser | n/a | page content only |
| Rule | Onboarding, an empty state, a finished order | n/a | page content only |
| Rule | A dense screen inside the app | n/a | page content only |
| Common mistake | Desktop sizes on a phone | n/a | page content only |
| Common mistake | Several coloured buttons in one view | n/a | page content only |
| Common mistake | The default theme as the brand | n/a | page content only |
| Common mistake | Art drawn for the occasion | n/a | page content only |
| Common mistake | Truncating at large text sizes | n/a | page content only |

### system-look-apple

Default: look probe: all text roles 4.5:1 on four surfaces and accent-soft, both themes.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Rule | The system colours aren’t text on the web | P |  |
| Rule | The system font, never its files | P |  |
| Rule | Text greys are the playbook’s | P |  |
| Values | Values: text and muted text 4.5:1 on bg, surface, sunken, raised, accent-soft | P |  |
| Values | Values: line-strong 3:1 | P | all composites 3:1+ |

### system-look-linear

Default: look probe: text roles pass.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Rule | The focus ring is 2px | P |  |
| Rule | The accent’s hover and text colours are derived, not read | P | derived |
| Rule | One radius is a guess | P |  |
| Values | Values: text roles 4.5:1 on four surfaces and accent-soft | P |  |
| Values | Values: line-strong 3:1 | F | light 2.75 (sunken+accent-soft), dark 2.65 (raised+accent-soft) |

### system-look-playbook

Default: look probe.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Values | Values: text roles 4.5:1 on four surfaces and accent-soft | P |  |
| Values | Values: line-strong 3:1 | F | dark 2.93 (bg+accent-soft) |
| Values | Home look preview drawn from the look’s values | P |  |

### system-look-primer

Default: look probe.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Rule | One accent | P |  |
| Rule | Field edges at 3:1 | F | line-strong dark 2.87 over accent-soft composite (nit; promise ambiguous, Gaps) |
| Rule | Motion’s length is the playbook’s | P |  |
| Values | Values: text roles 4.5:1 on four surfaces and accent-soft | P |  |
| Values | Values: line-strong 3:1 | F | dark 2.87 over accent-soft |

### system-work-tool

Default: Post and Track measured.

| Kind | Rule | Mark | Note |
| --- | --- | --- | --- |
| Table row | Body text | P |  |
| Table row | Labels and meta | F | Track tab count chips 11px (Tabs .mdx says 11; conflicts, Gaps; nit) |
| Table row | Text contrast | P |  |
| Table row | Controls | P |  |
| Table row | Targets | F | Track 375 "Show sidebar" squeezed to 21x24 (nit) |
| Table row | Spacing | P |  |
| Table row | Radius | P |  |
| Table row | Surfaces | P |  |
| Table row | Colour | P |  |
| Table row | Icons | P |  |
| Rule | A view the brief calls dense | n/a | none |
| Rule | Touch | n/a | 375 shots are desktop-pointer emulation of narrow windows |
| Rule | A welcome screen or an empty state | n/a | none |
| Rule | The product’s marketing site | n/a | none |
| Common mistake | Rows in 10–11px grey | P |  |
| Common mistake | The brand colour as a panel | P |  |
| Common mistake | A tagline under the page title | P | none |
| Common mistake | Large radii on dense parts | P |  |
| Common mistake | Controls of two heights in one row | P |  |

### SKILL floors (`skill/ui-playbook/SKILL.md`)

| Rule | Mark | Note |
| --- | --- | --- |
| Text 4.5:1, muted included | P | contrast probe, every route, both themes |
| State icons and control edges 3:1 | P | apps; look Values have the `line-strong` nit above |
| 12px floor for read text | F | Track tab count 11 (nit; conflict with Tabs `.mdx`). Scaled previews exempt (C27). |
| Targets 24 × 24 | F | Track 375 “Show sidebar” 21 × 24 (nit) |
| One icon library | P | Lucide only |
| Sentence case | P | all labels checked |

## Gaps in the playbook

1. **C8 against C37 and the Menu “Choice” kind.** C8 says choosing one value is a Select and a Menu is for actions; C37 and the Menu `.mdx` now allow a choice menu with each value's mark. Track's status pick is the second kind. One rule should name when a choice is a Menu and when a Select.
2. **Tabs count chip at 11 vs work-tool's 12 floor.** The Tabs `.mdx` says the count chip is mono 11; work-tool says nothing in a row someone reads is under 12. Either the chip is exempt (a count, not read text) or it is 12.
3. **What the looks' `line-strong` 3:1 promise covers.** The look pages say `line-strong` was checked at 3:1 against the four surfaces and accent-soft; composites (surface + accent-soft) fall to 2.65–2.93 in three looks. Say whether accent-soft counts on its own or over each surface.
4. **Is a one-line compact mail list a table under C2?** Post's compact density is one-line rows without lines. If C2 covers it, Post fails; if not, C2 should say what separates a list from a table.
5. **First paint of narrow layouts.** No rule says a layout decided by a container query must not wait for JS to measure. Track shows the desktop layout for a frame, then jumps. Nothing-shifts covers it in spirit; a line in App shell (“the narrow layout is CSS, not a measured flag”) would make it checkable.
6. **Does a status change that moves a row count as removal under C39?** C39 covers a removed row. A row that leaves its group and lands elsewhere is not named; the owner's “focus never falls to `<body>`” catches it, but C39 should say whether focus follows the row or stays at its old place.
7. **Departure record for placeholders not found.** I could not find the file that records the Post and Track placeholders as departures after Gmail and Linear in `docs/research/audit-2026-11-02/`. I treated them as recorded per the brief; the record should live next to the decisions so a reviewer can cite it.
8. **Frame time is out of scope this round (C43)**, so the owner's 16 ms per frame check was not run.
9. **Home search has no label rule for a hero field.** Input requires a visible label; a hero search with only an icon and a key hint is common (and the playbook's own). Input could name the exception: an icon-led search field takes `aria-label` and an example placeholder.
