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
| C5 | Below 768px a comparison's switch reads **Avoid** / **Prefer**. The verdict phrase moves into the caption, where it can wrap. |
| C6 | One stroke for UI icons: Lucide's own, 2 on its 24 grid (1.33 at 16), as the Icon page's Anatomy says. No `strokeWidth` or `absoluteStrokeWidth` per call. An exception is listed on the Icon page with its reason before the code keeps it. |
| C7 | **Owner's call.** Keep the home hero's hand-drawn notes, which the owner chose in lab B. They are annotation, not icons; the Icon page's floor names them as the one exemption. |
| C8 | Choosing one value from a list is a Select, with one chevron. A Menu is for actions; a Popover is for several controls. |
| C9 | A status icon standing alone has an accessible name, and its state is never colour alone. |
| C10 | Light code switches to a Shiki theme whose tokens hold 4.5:1 on the code background, or the two failing colours are darkened. A scrolling `pre` gets `tabindex="0"` and a name. |
| C11 | Fix the Skill export so Gallery and StateGrid content reaches `## Variants` and `## States`. |
| C12 | A column of badges in a list is a status column: it gets a header, or the list becomes a table. |
| C13 | `info` stays a badge tone. Links keep `accent-text`. Where they meet on one screen, the badge carries a dot and the link an underline on hover; no new hue. |
| C14 | A toast is `min(320px, 100%)` wide and its message wraps to two lines before it truncates. Card titles truncate in the work tool and wrap in the consumer app; each system page says so. |
| C15 | A specimen in the other theme sets the theme on its stage only. The caption and controls keep the page's theme. |
| C16 | A pill inside a container that isn't a pill takes the container's radius minus its inset. In a look, controls take the look's `radius-control`. |
| C17 | A placeholder shows only a format example. Instructions go in the label or a hint. |
| C18 | In lists, labels sit in a column on one left edge. After a title is fine only for a single detail title. |
| C19 | Both hold, each scoped. A dot marks a state that can change. A user-picked label colour is content and shows as a small dot beside its name. |
| C20 | Every hover demo has a visible state at rest and a keyboard path; on touch, a tap shows what hover shows. |
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
