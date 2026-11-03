# Decisions for the audit's rule questions

Default answers to section 4 of `README.md`, so every fix uses the same ones. Written 2026-11-02 by the
agent running the fixes. **Owner's call** marks a question of taste: the default holds until the owner
changes it. Where a decision changes a rule, the page that states the rule changes in the same commit.

| # | Decision |
| --- | --- |
| C1 | The floor wins. Shortcuts take `ink-muted`; Menu's Anatomy row changes with the CSS. |
| C2 | **Owner's call.** Both hold, each scoped. A table of one-line rows takes lines. A list whose records span two or more lines may take a stripe per record. Each page names the other. |
| C3 | A demo stage is a figure on the page, not a box in the UI, and needs no concentric radius against the page. Inside a stage, the UI follows every rule, box-in-box included. The gallery's own chrome is rebuilt (step 13). |
| C4 | **Owner's call.** Keep the kind line above each title. It names where the page sits, as the Prefer side of "Every line does a job" asks: sentence case, `ink-muted`, text size. |
| C5 | Below 640px a comparison's switch reads **Avoid** / **Prefer**. The verdict phrase moves into the caption, where it can wrap. |
| C6 | One stroke for UI icons: Lucide's own, 2 on its 24 grid (1.33 at 16), as the Icon page's Anatomy says. No `strokeWidth` or `absoluteStrokeWidth` per call. An exception is listed on the Icon page with its reason before the code keeps it. |
| C7 | **Owner's call.** Keep the home hero's hand-drawn notes, which the owner chose in lab B. They are annotation, not icons; the Icon page's floor names them as the one exemption. |
| C8 | Choosing one value from a list is a Select, with one chevron icon: the up-and-down one, as on macOS. A Menu is for actions; a Popover is for several controls. |
| C9 | A status icon standing alone has an accessible name, and its state is never colour alone. |
| C10 | Light code switches to a Shiki theme whose tokens hold 4.5:1 on the code background, or the two failing colours are darkened. A scrolling `pre` gets `tabindex="0"` and a name. |
| C11 | Fix the Skill export so Gallery and StateGrid content reaches `## Variants` and `## States`. |
| C12 | A column of badges in a list is a status column: it gets a header, or the list becomes a table. |
| C13 | `info` stays a badge tone. Links keep `accent-text`. Where they meet on one screen, the badge carries a dot and the link an underline on hover; no new hue. |
| C14 | A toast is `min(320px, 100%)` wide and its message wraps to two lines before it truncates. Card titles truncate in the work tool and wrap in the consumer app; each system page says so. |
| C15 | A specimen in the other theme sets the theme on its stage only. The caption and controls keep the page's theme. |
| C16 | A pill inside a container that isn't a pill takes the container's radius minus its inset. In a look, buttons and segmented controls take the look's `radius-control`, and fields take its `radius-field` (the product's own; `radius-lg` when a look doesn't say). A toast takes its buttons' radius plus its inset, so it is a pill only where controls are. |
| C17 | A placeholder shows only a format example. Instructions go in the label or a hint. |
| C18 | In lists, labels sit in a column on one left edge. After a title is fine only for a single detail title. |
| C19 | Both hold, each scoped. A dot marks a state that can change. A user-picked label colour is content and shows as a small dot beside its name. |
| C20 | Every hover demo has a visible state at rest and a keyboard path. On touch, a demo of hover timing replays itself (as the tooltip delay walk does) rather than making the real component answer a tap it never would. |
| C21 | Lines between rows start at the text in lists (iOS) and run full width in tables. |
| C22 | Faces use the table's sizes: 36 comfortable, 28 compact, in the Faces demos and in Post's compact density alike. |
| C23 | A busy button uses `Button loading`. It keeps its width and focus, and is never `disabled`. |
| C24 | Notes keep the 720 column; a note's own measure is set in the note's style, never by narrowing the column. |
| C25 | Tables in reading pages use the lighter prose style and scroll inside their frame when narrow. List markers stay inside the 16px gutter. |
| C26 | Text on a photo sits on a scrim that brings it to 4.5:1, or below the photo. |
| C27 | Scaled previews are pictures: `aria-hidden`, exempt from the 12px floor, with a text equivalent beside them. |
| C28 | Probe every look's text roles on every surface. Fix the values that fail; the look page's promise names what was checked. |
| C29 | Result counts and empty filter states are announced with `aria-live="polite"`. |
| C30 | Every look publishes `shadow-xs`. `shadow-sm` keeps its hairline ring, as the shadow page says; a surface that already has a border takes no ringed shadow, so its edge is never drawn twice. |
| C31 | A settings page that saves itself uses Switch for on/off, and Radio for one-of-few that applies on choice. Neither has a Save button. |
| C32 | **Owner's call.** Keep the line above a marketing headline only when it says something the headline doesn't. |
| C33 | A desktop work tool on a phone puts its sidebar behind a button in the header. Tool chrome folds into a menu. |
| C34 | Drop a secondary line that is the same on every row. |
| C35 | An in-progress state takes `info`. |
| C36 | **Owner's call.** The lightest boundary wins in our own apps, including Post and Track. A look reproducing a product may show that product's bands. |
| C37 | A choice menu shows each value's mark (status icon, priority bars) in the leading column. |
| C38 | An overlaid pill that is a button uses the secondary button style. Inverse is for labels only. |
| C39 | When the focused or acted-on row is removed, focus moves to the next row, else the previous, else the list itself. |
| C40 | Focusing inside a clipped ancestor uses `focus({ preventScroll: true })`, then scrolls the right pane. |
| C41 | In a table, an empty value shows an en dash. In a face column, the empty face shows at rest as a muted placeholder. |
| C42 | Where a build and its anatomy disagree, the better value wins and the other changes; each change says which and why. |
| C43 | Out of scope this round. Frame time on the practice apps and the gallery is measured after the fixes. |
| C44 | **Owner's call.** Bulk actions appear once something is selected, as in Gmail and Linear; they never wait greyed out. |
| C45 | **Owner's call.** A tab's count is mono 12, the work tool's floor (C42). |
| C46 | **Owner's call.** A disabled icon-only button still shows its tooltip with its name, without the shortcut. |
| C47 | **Owner's call.** A submenu opens after 100 ms, the Menu's; 0.3–0.5 s is for what hover reveals in passing. |
| C48 | **Owner's call.** The page's hand-drawn notes are in `ink-muted`: the page speaking, not a control. |
| C49 | **Owner's call.** Decoration such as confetti takes content colours, never a status's or the accent. |
| C50 | **Owner's call.** A list being refreshed keeps its rows at full strength; the spinner is the sign. |
| C51 | **Owner's call.** In Post's phone composer, To, Subject and the message are all 17px. |
| C52 | **Owner's call.** A chart's series is content, a single one in the accent included. |
| C53 | **Owner's call.** Every look uses its own product's values. `info` is one of them: it defaults to the accent, and a look or palette whose accent is warm, beside `danger`, brings a blue. |
| C54 | **Owner's call.** An archived Ship project says so in a flat row across the top of the window, on every page, with Unarchive project and no close: GitHub's archived banner sits above the repository's name and tabs, Primer puts page-wide banners "above the page headline", Atlassian's are "not dismissible". The row spans the sidebar too, so the sidebar's name and the header keep their line. GitHub's banner has no action; ours carries the way back. Archiving pauses what is rolling out; the project is read-only (no New release, Pause, Resume or comment box) until it is brought back, and Unarchive restarts nothing. |
| C55 | **Owner's call.** The Button page keeps "Filled, never outlined" and says why Primer edges its button: an opaque fill that matches a surface disappears there, so a hairline marks where the fill ends. A line with no fill is still the mistake. |
| C56 | **Owner's call.** Moss's `info` is a blue (Clay's `#427097` / `#8bbce7`), apart from its green success. |
| C57 | **Owner's call.** Ink darkens `success` and `warning` a step in light (`#007152`, `#925400`, same hue) so they hold 4.5:1 on its `accent-soft`, the selected row. |
| C58 | **Owner's call.** A rollout paused by archiving says so in its history: "archived the project, pausing … at 25%", until it is resumed by hand or the archive undone. |
| C59 | **Owner's call.** Ink brings a blue `info` too (`#39678e` / `#8bbce7`, a step darker than Clay's in light to hold 4.5:1 on its grey selection), so an info badge isn't told from a neutral one by darkness alone. |
| C60 | **Owner's call.** The App shell page says where a state of the whole window goes: a row across its top, no close, its way back as its one action; a state you can lift yourself is a word beside the title. |
