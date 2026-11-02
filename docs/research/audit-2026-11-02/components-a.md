# Rule review: components A (2026-11-02)

Routes: `/components/button` `/components/menu` `/components/toolbar` `/components/tooltip` `/components/icon` `/components/popover` `/components/dialog` `/components/sheet` `/components/app-shell` `/components/input` `/components/select`, on the dev server (http://localhost:4321). Each route is a reading page whose live demos are the playbook's evidence. Both the page and every demo on it were reviewed.

Method: `.claude/agents/ui-rule-review.md`. All four full-page shots of every route (1280/375 × light/dark) are in `shots/review/components-a/<route>-<width>-<theme>.png`. Interaction shots are in the same folder: `menu-hero-open`, `menu-edit-open`, `toolbar-hero-tip`, `popover-hero-open`, `popover-trigger-open`, `dialog-hero-delete`, `dialog-hero-rename`, `select-hero-open`, `input-hero-errors`, `app-shell-code-light`. Measurements came from `pnpm shoot --eval` with `getComputedStyle` and `getBoundingClientRect`. One contrast pass ran on every text node in `main`, in both themes, and blended translucent fills over the real background. One overflow pass ran at 375 (scrollWidth − innerWidth was 0 on all 11 routes). A Playwright script ran the Input hero's blur/typing check.

The 4.5:1 contrast check skipped deliberate "Avoid" sides and disabled controls.

## 1. Findings

| # | severity | where | rule | evidence | fix |
|---|---|---|---|---|---|
| 1 | must | `/components/menu`: every menu's shortcut glyphs, Prefer sides included (Edit pull-down, "Icons on every row", "Highlight at 9%", "Red highlight", "Check in a leading column", "Bare symbols in a column"); `src/ui/Menu.module.scss:173` `.keys { color: var(--ink-disabled) }` | SKILL.md Floors: "Text holds 4.5:1 … muted and secondary text too … hints included" | Shortcut letters measure 2.36:1 light and 1.90:1 dark. On the highlighted row they drop to 1.97:1 light and 1.40:1 dark. Shots: `menu-edit-open.png`, `menu-1280-dark.png` | Set shortcuts in `ink-muted` (6.4:1 light, 8.7:1 dark) and keep them "a step lighter" by weight or size, not by contrast. Update the Menu Anatomy row "Shortcut … `ink-disabled`" to match (see Gap A). |
| 2 | must | `/components/input`, hero "Shipping address": Full name, Street and City use `required(...)` validators under `validationMode='onBlur'` (`src/demos/input.tsx:75,77,80`; `src/ui/Field.tsx:49`) | SKILL.md "When you're validating a form": "Leaving an empty field is exploring, not a mistake: 'required' waits for submit"; principle-error-timing | When Full name is cleared and Tab leaves it, "Enter your full name." appears at once, before any submit. Shot: `input-hero-errors.png` | Run the required check only on submit. Keep onBlur for format checks such as email and postal code. The email recheck clears on the fixing keystroke, which already passes. |
| 3 | must | `/components/sheet`: the grabber (`role=button`, "Change height", `tabindex=0`) in every sheet demo; `src/ui/Sheet.module.scss:108` `outline: 2px solid var(--focus-ring)` | Sheet: "The grabber is a height control too"; Button States: focus shows on `:focus-visible` | `--focus-ring` is a box-shadow list (`0 0 0 2px #fff, 0 0 0 4px #0071e3`), so the outline declaration is invalid. Focused with `:focus-visible` true, the computed `outline-style` is `none`. A keyboard user gets no focus indicator. | Use `box-shadow: var(--focus-ring)` like Button does, or `outline: 2px solid var(--accent)`. |
| 4 | must | `/components/app-shell`: the CSS code block under "Every layer between gives up its minimum height", light theme. Shiki `github-light` (`astro.config.mjs:25`) on `#efeff1` | SKILL.md Floors: "Text holds 4.5:1" | `--sidebar` in `#e36209` measures 3.04:1, and `dvh` and `fr` in `#d73a49` measure 3.98:1. Dark passes. Shot: `app-shell-code-light.png` | Use a light code theme whose token colours hold 4.5:1 on `surface-sunken`, or darken the two token colours. Every route with code blocks is affected. |
| 5 | should | Input page: every field. Select hero: the Email field beside the Role select. `src/ui/Field.module.scss:99` `.control { font: inherit }` | Input Anatomy: "Text 14 / 20; 16 on touch screens"; Work tool: body 14/20 | Every `input`/`textarea` on `/components/input` computes to 15px/24px (it inherits the page prose). In the Select hero, a 15px email field sits above a 14px select. The Popover's field is 13px, the Dialog's 14px. | Set `.control` to 14px/20px, and keep the existing 16px under `pointer: coarse`. |
| 6 | should | Icons on several routes, stroke weights mixed: Lucide default 1.33px at 16; 1.5px non-scaling in toolbar tools (`src/demos/toolbar.tsx:103`), popover view bar and info (`src/demos/popover.tsx:86,223`), sheet Walk (`src/demos/sheet/Walk.tsx:11`) and Button Variants Download/Settings2 (`src/demos/button.tsx:317,328`); 1.75px on menu/select checks (`src/ui/Menu.tsx:71`, `src/ui/Select.tsx:82`); 1.0px on the sheet Share/Player cases (`strokeWidth 1.5` scaled, `src/demos/sheet/cases/Share.tsx:8`, `Player.tsx:10`) | SKILL.md Floors: "Icons come from one icon library, at one stroke"; Icon Anatomy: "Line … 1.33 at 16" | Audit counts: button 25 icons at 1.33 and 2 at 1.5. In the Button page's own "Leading icon" row, `+ New file` (1.33) sits beside `Download` (1.5), and the "Icon only" row pairs Settings2 (1.5) with Plus (1.33). Toolbar has 52 icons at 1.33 and 10 at 1.5. | Drop the per-demo `strokeWidth`/`nonScalingStroke` and let Lucide's default scale. If a lighter check or shortcut glyph is wanted, put that exception in the Icon page rather than in the components. |
| 7 | should | Variants gallery on button, toolbar, popover, input and select: `src/demos/shell.module.scss` `.galleryRow + .galleryRow { border-top: 1px solid var(--line) }`, inside a stage whose edge is `inset 0 0 0 1px var(--line)` | Lightest boundary: "Lines between rows, lighter than the edge … one step lighter than the group's edge" | The row hairline and the frame edge are the same colour, `rgb(228,228,232)`. | Draw the row lines one step lighter, for example `color-mix(var(--line), transparent 40%)`, or give the frame edge one step more. |
| 8 | should | Every Compare at ≤640px (all 11 routes): `src/demos/shell.tsx:332` `<Verdict good={good} />` is called without `words` | Every line does a job: "every line names a thing, an action or a state" | At 1280 the label names the verdict ("✓ Filled"). At 375 the same label reads "✓ After"/"✕ Before", which names nothing. Shot: `button-375-light.png` | Pass `words={good ? afterLabel : beforeLabel}` in the toggle branch. |
| 9 | should | The Compare toggle segmented control at 375 | Segmented control Common mistakes: "labels truncate"; Copy: "nouns, one word where possible, of similar length" | "Waits 300 ms, keeps i…" (button), "Unavailable items left …" (menu), "Standard up to half he…" (sheet). Shots: `button-375-light.png`, `menu-375-light.png`, `sheet-375-light.png` | Once #8 puts the verdict words in the label, use Before/After as the segments, or let the control wrap to two lines. |
| 10 | should | `/components/sheet`, every sheet demo: `src/ui/Sheet.module.scss:51` `height: calc(100% - var(--space-8))` | Sheet Anatomy: "Gap at full height `space-3` … 12" | The sheet is 488px tall in a 520px area: a 32px gap, not 12. | Make the code and the anatomy agree. Either change the token or change the row (the code comment argues for 32). |
| 11 | should | `/components/sheet`: phone-sized sheet demos. Close is 24×24 (measured), and the rows and "Add stop" use desktop sizes | Consumer app: "Targets 44 × 44px"; Common mistake "Desktop sizes on a phone"; Icon Anatomy: "44 on touch" | Close button 24×24, rows 14px, small pill buttons. The page calls the sheet "for narrow screens". | Give Close and the actions a 44px target on `pointer: coarse`, keeping the 24px visual. Review the body size against the consumer system. |
| 12 | should | `/components/app-shell` demos: `src/demos/app-shell/app-shell.module.scss:21` `.titlebar { height: 36px }` | App shell Anatomy: "Title bar or toolbar `toolbar-height` 48" | The title bar measures 36px. The content bar and the foot are 48px, as specified. | Use 48, or say in the anatomy that a window title bar is 36. |
| 13 | should | `/components/app-shell` at 375: every shell demo hides the sidebar (`@container (width < 480px)`, app-shell.module.scss:37) | Owner's rule: layout changes re-home context rather than hiding it. The page's own claim is "the sidebar keeps the current page lit" | At 375, "The window scrolls" and "Each pane scrolls" render as the same single pane, while their notes describe a sidebar and account that are not on screen. Shot: `app-shell-375-light.png` | Keep a narrow sidebar (icons and words, roughly 120px) in the demo at phone width, or swap the pair for one sentence that sends the reader to a wider window. |
| 14 | should | `/components/menu` hero "Files": three file rows, each in its own bordered box (`src/demos/menu.tsx`, Files scene, around line 227) | Lightest boundary: "Lines split repeated rows … never a box per section" | Three 1px-edged boxes 8px apart for one sorted list. Shot: `menu-1280-light.png` | Put one group with hairlines between rows, or no edges at all on the white stage. |
| 15 | should | `/components/icon` hero: the issue status icons are `aria-hidden` and the only signal of status (`src/demos/track/StatusIcon.tsx:16`) | Colour means one thing: meaning can't rest on one channel (WCAG 1.4.1); Icon Common mistakes: "a decorative icon a screen reader announces" (the reverse case: a meaningful icon hidden) | A screen reader hears each row's title and no status. | Give the icon `aria-label` with its status word (In progress, To do, In review, Done), or add visually hidden text. |
| 16 | should | All 11 routes: the "Component" line above the H1, directly under the "All components" back link (`src/layouts/Entry.astro:32`) | Every line does a job, "The line above a heading names its parent. Avoid: An eyebrow … tells someone looking at an issue that it's an issue"; SKILL.md "No eyebrows" | Two lines above every title say the same thing, and the second one is a category label. | Drop `.kind`, since the back link already names the parent. If the rule isn't meant for reading pages, say so (Gap C). |
| 17 | should | `/components/input` Variants, Multiline: `placeholder="What is this project for?"` (`src/demos/input.tsx:134`) | Input Copy: "Placeholder: an example, not an instruction" | The placeholder is a prompt question. | Use an example ("Ship offline sync to everyone by Q4") or no placeholder. |
| 18 | nit | Text under 12px: state-grid column heads at 11px (`src/demos/shell.module.scss:180`), the field shortcut key "K" at 11px (`src/ui/Field.module.scss:143`), the shell avatar "MC" at 11px (app-shell.module.scss:126), and the menu group label at 11px (`src/ui/Menu.module.scss:192`) | Work tool: "Labels and meta 12px; nothing smaller in a row someone reads" | Measured on button, toolbar, input and app-shell. | Use 12px. |
| 19 | nit | `/components/tooltip` Copy: "**Redo** ⇧⌘Z" typed in prose (`src/pages/components/tooltip.mdx:52`) | Menu: "Geist has no ⌘ ⇧ … a font that borrows them from another face mixes weights"; Floors: no text symbol as an icon | The fallback face draws the glyphs at its own weight. Visible in `tooltip-1280-light.png`. | Render the keys with the same `Keys` component the demos use. |
| 20 | nit | `/components/select`: the list opens over the trigger with x aligned (473 = 473), but option text is 13px and trigger text 14px | Select: "the current option's text lands exactly on the trigger's" | Measured: trigger 14px, option 13px. | Set the list rows in the trigger's size, or note the change. |
| 21 | nit | Anatomy tables at 375, all routes: the Value column wraps mid-value ("32 · / 24 · / 40", "14 / / 20", "0 · / 120") | Owner's rule: trailing meta in one right-aligned column | `button-375-light.png` | `white-space: nowrap` on value cells. |
| 22 | nit | Prose tables, all routes: a hairline under the last row | Table Anatomy: "Divider … none after the last" | Visible under every Anatomy table. | Drop the last row's bottom border. |
| 23 | nit | At 375, all routes: list bullets hang into the 16px gutter (`li` left = 16, `ul` padding 0, `list-style-position: outside`) | Owner's rule: 16px side gutter; one left edge | The marker sits about 4px from the screen edge (`app-shell-375-light.png`, Common mistakes). | Give the list `padding-left` equal to the marker width at narrow widths, or use inside markers. |
| 24 | nit | Inline code wraps mid-token: "aria-/pressed" (toolbar States), "aria-/hidden" (icon Kinds) | Reading text: set for the reader | `toolbar-1280-light.png`, `icon-1280-light.png` | `white-space: nowrap` on inline `code`. |
| 25 | nit | `/components/icon` hero: a hairline under the "My issues" title row and another after the last issue | Lightest boundary: "a line splits repeated things, never a heading from what it heads"; Table: "none after the last" | `icon-1280-light.png` | Keep only the lines between rows. |
| 26 | nit | `/components/icon` Kinds: "the rings in the issue list above: dashed, empty, dotted, ticked" | Every line does a job: the words name what is on screen | The hero shows CircleDot, Circle, CircleEllipsis and CircleCheck. There is no dashed ring, and "dotted" is an ellipsis. | Change the copy to "dot, empty, ellipsis, tick", or add a backlog row. |

Counts: **4 must, 13 should, 9 nit.**

## 2. Ledger

Pass/fail/n/a per rule. "Avoid" sides are judged only by whether they show the mistake they name. Numbers refer to findings above.

### System and look
- **Reading page** (SKILL.md "A reading page"): pass. It scrolls as one (no inner scrollers) and leads with type.
- **Work tool** (the demos for button, menu, toolbar, tooltip, icon, popover, dialog, app shell, input and select): body 14/20 fail on fields (#5); 13px dense rows pass (menu rows, shell sidebar); labels 12px fail at 11px (#18); text contrast fail (#1, #4); controls 32/24/40 pass; targets ≥24 pass; 4px spacing grid pass; radius 4–10 with pill buttons pass; surfaces one step apart pass; one accent pass; icons from one library at 16px fail on stroke (#6); "Rows in 10–11px grey" n/a; "Brand colour as a panel" pass; "Tagline under page title" pass (demos have none); "Large radii on dense parts" pass; "Controls of two heights in one row" pass (Button hero: Preview 32, Publish 32, More 32).
- **Consumer app** (sheet demos as a phone): 44 targets fail (#11); 17px body fail (#11); labels ≥11 pass; 4.5:1 pass; pill buttons pass; sheet radius 18 within 12–28 pass; colour from content (map, café pins) pass; no art drawn for the occasion n/a (a map is content); truncation pass.
- **Playbook look**: all colours resolve to the look's variables, pass, except the Shiki code colours (#4).

### Floors (SKILL.md)
- Text 4.5:1: fail (#1, #4). Everything else in both themes passed the automated pass, including verdict labels, muted captions, hints and placeholders (`ink-muted` 6.4:1).
- One icon library, one stroke, sized to text: library pass (every `svg` in `main` is Lucide apart from the Icon page's Avoid side and the sheet map illustration); stroke fail (#6); size pass (16 beside 14, 14 in 13px rows).
- Window holds still, panes scroll: pass for the app-shell "Each pane scrolls" demo (`100dvh` analogue, `minmax(0,1fr)`, `min-height:0`, `tabindex=0` + `role=region` + `aria-label` on the document pane, inset focus ring). The reading pages scroll as one, which is correct for documents.

### Button
- Filled, never outlined: Prefer pass (fills only).
- Hover in at once, out softly: pass (`Button.module.scss:23–33`, instant on hover, 120ms out).
- Quick down, soft back: pass (0.97 in 80ms, snappy spring back).
- One filled button per view: Prefer pass (one danger fill). Every hero has one fill: pass.
- Loading waits 300ms and keeps its width: Prefer pass (width reserved; "Requests sent" readout).
- Anatomy: height 32/24/40 pass; padding 12 pass; radius pill pass; icon gap 4 pass; label 14/20/500 pass; fill tokens pass; hover 0/120 pass; press 0.97 pass; busy after 300 pass.
- Buttons in one row share one height: pass. Icon-only buttons have a tooltip with the aria-label words: pass (More, Settings, New file, Add).
- States: focus only on `:focus-visible` pass.
- Common mistakes: shadow to lift pass; colour as rank pass; disabled with no reason n/a (only in the state grid).
- Copy: verb naming the result pass (Save changes, Delete project, Publish); sentence case pass; matches dialog title pass (Delete "Q4 roadmap"? → Delete project).

### Menu
- Kinds: pull-down (Edit) pass, with icons in every row of each group, real shortcuts, Undo dimmed; context menu Prefers pass (three groups, destructive last, no shortcuts, unavailable hidden); choice (Sort) pass (radio items, current value checked, no icons or shortcuts, separator between field and order).
- Icons on every row or none: Prefer pass. Context menu has no shortcuts: Prefer pass. Unavailable hidden or dimmed: Prefer pass. Highlight at 9%: pass (`fill-active`). Destructive row stays red: Prefer pass (`danger-soft`). Checkmark leads the row: Prefer pass (16px column kept for every row). Shortcuts as bare symbols in a column: layout pass, contrast fail (#1). Popup grows from its trigger: pass (transform-origin at the trigger, enter-scale/offset, faster `ease-in` close, reduced-motion fade).
- Anatomy: radius 10 pass; inset 4 pass; min width 160 pass; separator inset 12 pass; item radius 6 pass; item 32 pass; padding/gap 8 pass; label 13/18 pass; shortcut `ink-disabled` fail on contrast (#1, Gap A); label to shortcut ≥24 pass; surface-raised + shadow-md pass. Icons 16 in `ink-muted`, turning `ink` on highlight: pass. Check column: pass, but its stroke differs (#6).
- States: arrows, submenu, Space toggles, one highlight: pass (Base UI; source).
- Common mistakes: menu for 1–2 items pass; group label repeating the trigger pass; destructive mid-list pass; closing on every toggle pass (checkbox item stays open, per source); submenus in submenus pass.
- Copy: verbs or values pass; ellipsis only when input follows pass (Share…; Rename has none); sentence case pass; one grammatical form pass.

### Toolbar
- The current tool is a tint, not a fill: Prefer pass (`accent-soft` mixed 16% toward accent, accent-text icon).
- Every tool named by a tooltip with its shortcut: Prefer pass ("Rectangle R", shared delay).
- Anatomy: pill, raised surface, shadow-sm pass; inset 4 on all sides pass (measured); tools 32 pass; gap 2 pass; height 40 pass; divider 1×16 `line` pass; current-tool colour pass.
- States: aria-pressed toggles, arrows: pass (source).
- Common mistakes: borders around groups pass; two icon sets fail on stroke (#6, toolbar 1.5 against 1.33 elsewhere); uneven inset pass.
- Copy: tooltip is the tool then its shortcut, words equal to aria-label: pass.

### Tooltip
- Wait once, then follow the pointer: Prefer pass (`TipGroup`, 500ms, timeout 400).
- Inverse, no shadow: pass (ink ground, bg text, `box-shadow: none`).
- Fades in over `duration-fast` and doesn't travel: pass.
- Anatomy: ground and text pass; radius 6 pass; padding 4×8 pass; text 12/16/500 pass; offset 4 from the toolbar edge pass (measured); delay 500 pass; layer n/a (not measured). Shortcut dimmed at about 7:1 pass.
- States: hover/focus/Esc pass (Base UI). Disabled shows none n/a.
- Common mistakes: clickable content pass; tooltips on labelled buttons pass; sentences pass.
- Copy: name equals aria-label pass; sentence case pass; shortcut after the name pass in demos, page prose nit (#19).

### Icon
- A symbol isn't an icon: Prefer pass.
- Emoji: n/a (no emoji in any Prefer side).
- Most icons need their word: Prefer pass. Hero sidebar keeps words pass.
- Sized to the text: Prefer pass (16 beside 14).
- Drawn for the occasion: Prefer pass (Lucide Eye, Check, ArrowRight).
- Kinds: beside a word pass; alone in an icon button with tooltip pass (hero Search, Filter, New issue, More); status by shape pass visually, fail for assistive tech (#15), copy mismatch (#26); decorative aria-hidden pass.
- Anatomy: 16 beside 14 pass; 14 in 13px rows pass; 20 at 17px n/a; line 1.33 at 16 fail elsewhere (#6); gap 8 pass; `currentColor` muted/ink pass; button 24/32/44 fail on the phone sheet (#11).
- States: muted at rest, ink when current pass (hero sidebar).
- Common mistakes: typed symbol pass in demos, nit in prose (#19); two libraries pass; navigation as icons alone pass; unnamed icon button pass; 24px beside 14 pass; bigger icon for a bigger target pass.
- Copy: tooltip = aria-label naming the action pass.

### Popover
- Grows from its trigger: Prefer pass.
- Focus goes in and comes back: pass (focus on the Email field on open, measured).
- The trigger stays pressed: Prefer pass (`fill-control-hover` while open, measured 0.10).
- A stray click keeps the draft: Prefer pass (source).
- Anatomy: raised surface, shadow-md, radius 10 pass; inset 12 pass; width ≤320 pass (215); gap to trigger 6 pass; title 13/18/600 pass; description 13/18 muted, 2 below the title, pass; 12 between blocks pass; actions right-aligned and small pass; trigger while open pass. No arrow pass.
- Common mistakes: opening on hover pass; popover for a decision pass; nested popovers pass; unneeded Save pass (pickers apply on pick; Share has a typed field, so Invite is needed).
- Copy: title matches its trigger pass (Share "Q4 roadmap"); description is consequence pass; action is a verb pass (Invite).
- Field text 13px against Input's 14: nit, folded into #5.

### Dialog
- Kinds: confirm is an alertdialog, 400 wide, focus on Cancel, measured pass; task is a dialog, 560 wide, focus in the first field with its text selected (0–10), measured pass. Scrim does nothing for confirm, and cancels an untouched task only: pass (`disablePointerDismissal={draft !== name}`). Rename is disabled until valid: pass.
- The title is the decision: Prefer pass. Focus on the safe choice: Prefer pass. Grows in place: Prefer pass.
- Anatomy: scrim pass; panel raised + shadow-lg pass; radius 18 pass; padding 20 pass; title 18/26/600 pass; body to actions 24 pass; between buttons 8 pass (7–8 measured, subpixel); pill buttons pass. Buttons trail right with the likeliest last: pass.
- States: focus trapped and returned: pass (Base UI).
- Common mistakes: confirming the undoable pass; dialog on arrival pass; explaining the buttons pass; dialog that scrolls pass.
- Copy: title pass; body pass; Cancel + verb pass; trigger ellipsis pass ("Delete…", "Rename…").

### Sheet
- What goes in one: pass (cases picker).
- Standard: no dim, no outside close, Escape/Close/swipe: pass (source; not driven by touch). Modal: pass (source).
- It blocks exactly when it covers: Prefer pass. What it did shows behind it: Prefer pass. The edge follows the window: pass. Scrolling scrolls the list: Prefer pass.
- Keyboard and screen readers: Escape pass (source); Tab order pass; polite announce not verified; grabber as a height control: control present, focus ring fail (#3).
- Anatomy: panel raised + shadow-lg pass; top corners 18 pass; gap at full height fail (#10); grabber 36×5 `line-strong` 8 from the top pass; header 44 with title 17/24/600 pass; inset 20 pass; heights half/full pass; dim and motion pass (source).
- Common mistakes: modal sheet over a map pass; full height that doesn't block pass; trusting `modal={false}` pass; scroll grows the sheet pass; sheets on sheets pass.
- Copy: titles pass ("Walk to the ferry"); Close is an icon with aria-label "Close" pass; "Back to route" pass. The sheet is `role=dialog` without `aria-modal` at half height: pass (matches "only when both").

### App shell
- The sidebar stays where you left it: Prefer pass at 1280, fail at 375 (#13).
- Every layer gives up its minimum height: pass (`min-height:0`, `minmax(0,1fr)`); the switch demo pass.
- Full height you can see (`100dvh`): n/a for the demo (fixed-height window inside a frame).
- Anatomy: window n/a; title bar 48 fail (#12); sidebar 240 on `surface-sunken` pass; rows 32 pass; foot 48 pass; panes `overflow-y:auto` pass; hairlines at the sidebar edge and above the foot pass.
- States: pane is a Tab stop with a name and an inner ring: pass.
- Common mistakes: all five pass (`scrollbar-gutter: stable` on the body; the account at the foot).
- Copy: panes named by content pass (nav "Pages", region "Release process").

### Input
- Check when they leave: Prefer pass for format checks. The hero breaks the required-field rule (#2).
- The error sits under its field: Prefer pass (focus moves to the first error with the caret at the end, per source).
- Label above, example inside: Prefer pass.
- Width says how much to write: Prefer pass.
- Variants: leading magnifier on search pass; one trailing item at most pass (⌘K or "px").
- Anatomy: height 32 pass; radius 10 pass; edge `line-strong` 1px pass; padding 12 pass (13 including the border); trailing inset 4 and key 24 with radius 6 pass; label 12/16/500 muted pass; label, field and hint 4 apart pass; focus recolours the edge pass; text 14/20 fail (#5).
- Known issues: 16px on coarse pointers pass; `type=text` with `inputMode=email` pass.
- Common mistakes: hint repeating the label pass ("For delivery updates only."); clearing on error pass; read-only drawn as disabled pass (ink text).
- Copy: labels are nouns pass; placeholder is an example, fails in Multiline (#17), nit in Search ("Search files"); error says what to do pass ("Enter an email address, like ana@studio.com.").

### Select
- Current option is a check, not a fill: Prefer pass (the fill sits on the keyboard row; on open, the check and highlight share the current row, which is expected).
- Opens over the trigger: pass (current option top 510 = trigger top 510, text x 473 = 473), with a size mismatch (#20).
- Start with a useful default: Prefer pass (Editor).
- Two chevrons: Prefer pass.
- Anatomy: trigger as Input pass; chevron 16 pass; list as Menu: radius and rows pass; list wider than the trigger by the check column pass (216 against 200); current option weight 500 with accent check pass; keyboard highlight `fill-active` pass; layer n/a.
- States: keyboard behaviour pass (Base UI).
- Common mistakes: all four pass (Disabled says why: "Only admins can change roles.").
- Copy: label noun pass (Role, Reason, Font); options parallel pass; placeholder "Choose a reason" pass.

### Components on screen in demo chrome
- **Segmented control** (Compare toggle, ≤640px): equal widths pass; raised grey thumb pass; one thumb slides pass; truncation fail (#9); copy fail (#9).
- **Switch** (app-shell "min-height: 0 on the layout"): applies at once pass; label names the setting pass; anatomy not measured.
- **Radio** (popover Sort, Filter and Group): default chosen pass; one column pass; one group pass.
- **Slider** ("Window width 360px" on the sheet page): value visible pass; tabular value pass by look; not measured further.
- **Badge** (Button hero "Draft"): dot and word pass; soft neutral pass; dot on a changeable state pass; one word pass.
- **Card** (pager, Dialog hero project, Menu hero files): pager cards open and carry shadow-xs pass; Menu hero file rows boxed as cards fail (#14).
- **Table** (prose Anatomy tables): numbers right-aligned pass; secondary columns n/a; no line after the last row fail, nit (#22); wrapping at 375, nit (#21).

### Principles
- **Reading text**: 16/26 prose and the 45em column pass; inline code wraps, nit (#24); 375 bullets, nit (#23).
- **Every line does a job**: demo copy pass across routes; eyebrow fail (#16); "After" label fail (#8); copy mismatch, nit (#26). No please/sorry/we/Your in the demos: pass. "Please check the highlighted information." sits only on an Avoid side.
- **The lightest boundary that holds**: page sections held by headings and space pass; galleries fail on line weight (#7); Menu hero boxes fail (#14); Icon hero lines, nit (#25); no box inside a box: the demo frames' inner phone, window and canvas are drawn devices, which the "canvas" exception covers, pass.
- **Space groups by ratio**: label, field and hint 4 with 16 between fields pass; menu group label 8 above and 4 below pass; one left edge per kind pass (gallery names, the Anatomy columns).
- **Grey until it matters**: pass (grey chrome; the colour sits in content such as the map, the café pins and the label colour dot).
- **Colour means one thing**: one solid accent per view pass; danger only for destruction pass; accent text only on links pass; hover neutral pass; meaning not by colour alone fail (#15).
- **Lightness first**: the tokens' own contrast pass; `ink-disabled` used as text fail (#1); Shiki colours fail (#4).
- **A shadow says how high**: menu and popover shadow-md pass; dialog and sheet shadow-lg pass; toolbar shadow-sm pass; static demo frames carry an inset hairline only pass; pager cards xs pass.
- **Concentric radius**: menu 10 → 6 pass; field 10 → key 6 pass; toolbar pill-in-pill with an even 4 pass; dialog padding > radius with pill buttons pass.
- **Nothing shifts**: Button reserves its loading width pass; bold-on-hover n/a (menus highlight by fill); `scrollbar-gutter: stable` in the shell pass. CLS not measured beyond demos.
- **Never too busy to listen**: menu and popover close by transition from the current frame pass (CSS transitions, no keyframes); sheet on a transition with spring timing pass.
- **Attention wears off**: hover 0/120 pass; menu close 120 ease-in pass; tooltips instant after the first pass.
- **How waiting feels**: Button busy after 300 pass.
- **Hover forgives**: submenu safe polygon pass (Base UI); tooltip group pass.
- **The faster way**: keys in tooltips and pull-downs only, for reference: pass (the principle allows this as reference).
- **Where the eye goes**: Button and popover answer at the click pass.
- **Error timing**: format checks on leave pass; clear on the fixing keystroke pass; required on leave fail (#2).

### Owner's rules (~/.claude/CLAUDE.md, Product and UI judgment)
- One grid / one left edge: pass at 1280; bullets at 375, nit (#23).
- Trailing meta in one right-aligned column: pass at 1280 (Anatomy "Value", menu shortcuts in a fixed key cell); wraps at 375, nit (#21).
- Lightest boundary that holds: see the principle above (#7, #14).
- Empty states name the next step: n/a (no empty states on these routes; the demo stages are empty only until a trigger is pressed, and the trigger is in view).
- Focus follows the action: dialogs, popover and select pass; sheet grabber focus invisible fail (#3).
- Layout changes re-home context: app-shell at 375 fail (#13).

## 3. Gaps in the playbook

- **A. Menu shortcuts in `ink-disabled` contradict the 4.5:1 floor.** Menu's Anatomy prescribes `ink-disabled` for shortcuts. Its own Details say "a step lighter, as macOS draws them", while the floor in SKILL.md names hints and secondary text as 4.5:1. One of them has to give. Either the floor exempts shortcut glyphs, which WCAG does not, or the Menu anatomy changes to `ink-muted`.
- **B. Sort as a Menu or as a Popover.** Menu models "Sort: Modified" as a Choice menu with radio items. Popover's "Trigger stays pressed" demo puts Sort, Filter and Group in popovers with radio groups. The Select-or-Menu table on the Select page says a Menu's trigger shows "a fixed label or icon", but Menu's choice kind shows the current value. Nothing says when a value picker is a choice Menu, a Popover picker, or a Select.
- **C. Do product-copy rules apply to reading pages?** Every line does a job says "In a product", but SKILL.md's "No eyebrows, taglines or section subtitles" has no scope. Every reading page carries a "Component" line above its title and a lede below it. Say whether docs pages are exempt.
- **D. Icon stroke exceptions are undocumented.** The Icon page fixes the line at 1.33 at 16. Menu documents a 1.25px exception for shortcut glyphs, but 1.5 (toolbars, popovers, sheets) and 1.75 (checks) appear across the kit with no rule saying when a different stroke is allowed.
- **E. Demo chrome isn't covered.** Verdict labels, Compare toggles, state-grid heads (11px) and frame tools appear on every page, and no rule covers their sizes or words at narrow widths (#8, #9, #18).
- **F. The exported Skill drops galleries.** `component-popover.md`, `component-select.md`, `component-segmented-control.md` and others have empty "## Variants" or "## States" sections, because the site's Gallery and StateGrid demos aren't exported as text. An agent reading the Skill loses the variant list the site shows.
- **G. No rule for status shape and accessible names.** Icon's "Status" kind and Colour means one thing require status to read without colour, but neither says a status icon needs an accessible name when it stands alone (#15).
- **H. Code-block contrast.** The floors cover "text", but nothing tells the site, or an agent, to check a syntax theme's token colours against the code background (#4).
