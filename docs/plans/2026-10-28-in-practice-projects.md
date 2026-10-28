# In practice: Projects

The second In practice example: a project tracker for one small team, "Track". It replaces a photo library ("Roll"), dropped on 2026-10-28: a photo library has too few acts to prove much, and three consumer directions for it didn't hold up.

Like Post, everything works, every decision under it points at the page it comes from, and Show plays the moment in the app. It argues from the playbook's principles, not from "Linear does it". Where the reference products agree, Track follows them; where it differs, the row says so and why.

## Why a project tracker

Topics #4 and #7–#10 in `2026-10-27-topic-priorities.md` scored low on "Post" because a mail app can't show them. A tracker shows every one of them in its ordinary use:

| Topic (priority) | Where Track shows it |
| --- | --- |
| Focus is not selection (#4) | Arrow keys move a focus ring through issues; ticked issues stay ticked; the open issue is a third state |
| Preview the destination (#7) | An issue opens as a panel beside the list that grows from its row; status menus show the column the issue will land in |
| Command menu (#8) | ⌘K does every action on the focused or ticked issues |
| Keep the comparison in sight (#9) | The open issue sits beside the list, so the next one is a click away without losing your place |
| Count what the reader sees (#10) | Group counts count what the filter shows, and say so when a filter hides some |

It also reuses most component pages (Menu, Combobox, Select, Segmented, Tabs, Table, Dialog, Toast, Tooltip, Sheet, Checkbox) and the earlier principles (Nothing shifts, How waiting feels, Hover forgives, Who before what, Colour means one thing, Space groups by ratio, Error timing).

## Page

`/practice/projects`, same frame as Mail; `/practice/projects/app` full screen, with the way back.

1. One paragraph: what Track is. Everything works; changes are kept in this browser, with a Reset.
2. The app.
3. Decisions: a numbered list, each one sentence, a link to its page, and Show.
4. Two Before/After pairs, one variable each:
   - **Focus is not selection:** arrow keys tick as they move vs a focus ring apart from the ticks. Same list, same keys.
   - **Nothing shifts:** a teammate's change reorders your list under the pointer vs it waits behind "2 updates".

## Version 1

**In:**
- **One team, one project.** About 40 issues across five statuses (Backlog, Todo, In progress, In review, Done), five people, a handful of labels.
- **List view.** Grouped by status, each group collapsible with its count. Row: priority, ID, title, labels, assignee face, updated.
- **Board view.** The same groups as columns. Drag a card to another column or reorder within one. List / Board is a segmented control; the choice is kept.
- **Issue panel.** Click a row: the issue opens beside the list. Title and description edit in place; status, priority, assignee and labels from the side. An activity line per change. Esc closes and returns focus to the row.
- **Edit in place.** Status, priority and assignee from the row itself (a menu at the cell); assignee is a searchable list with faces.
- **Selection.** A tick on each row; shift-click for a range; the bar becomes "N selected" with Status, Assignee, Priority, Delete. Esc clears.
- **Filter.** One filter bar: by assignee, label, priority, plus "Mine". Counts follow the filter.
- **Create.** A New issue button opens a dialog: title required, the rest optional, defaults from the current group.
- **Teammates.** A simulated teammate changes an issue now and then. Your list doesn't move under you; the change waits behind a pill, and the changed row marks itself once applied.
- **Delete.** At once, Undo in the toast. No confirm.
- **Phone.** List only; tap opens the issue full screen with Back; actions in a sheet.
- **Dark mode and every palette.**

**Out (later or never):** comments as a thread, cycles / sprints, roadmap or timeline, sub-issues, notifications inbox, several projects or teams, real sync, attachments.

## Decisions and their pages

| # | Decision | Page |
| --- | --- | --- |
| 1 | Arrow keys move a focus ring; ticking is a separate act; leaving the list keeps the ticks | **Focus is not selection** (new) |
| 2 | The issue panel grows from its row and shrinks back into it | **Preview the destination** (new) |
| 3 | The open issue sits beside the list, so moving to the next one keeps your place | **Keep the comparison in sight** (new) |
| 4 | ⌘K acts on what's focused or ticked and says which in its first line | **Command menu** (new) |
| 5 | Group counts count what you can see; a filter adds "3 hidden by filter" | **Count what the reader sees** (new) |
| 6 | A teammate's change waits behind "2 updates" instead of moving the row you're about to click | Nothing shifts |
| 7 | Status, priority and assignee change at once; the server catches up, and a failure puts it back with a toast | How waiting feels: Don't wait at all |
| 8 | Delete at once, Undo in the toast; no confirm | Toast: Undo instead of asking |
| 9 | A row's quick actions appear on hover in the "updated" column's place; the row never changes size | Hover forgives |
| 10 | Status is a shape (circle filling up), priority is bars; colour is kept for the one primary button and the ticks | Colour means one thing |
| 11 | Faces in the assignee column and picker, so "whose is this" reads before the title | Who, before what |
| 12 | Space between groups is a step larger than between rows; no rule lines | Space groups by ratio |
| 13 | The assignee list filters as you type; nothing found says what was typed | Combobox: An empty list says what was searched |
| 14 | New issue: an empty title is a problem only when you submit or leave the field, and clears as soon as it's fixed | Error timing |
| 15 | The panel's menus and the ⌘K list sit above the panel; the panel sits above the list with one shadow step | A shadow says how high |

## State transitions

Reference columns: Linear (web) and GitHub Projects. A cell marked "check" is not yet confirmed; it gets checked during the build, before that row is implemented.

| Trigger | Main area | Active / selection | Focus | Feedback | Way back | Linear | GitHub Projects |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Open the app | List view, groups open, Done collapsed | — | First row on first Tab | — | — | Same | Table view |
| Click a row | Panel opens beside the list, the title flying over from the row | Row marked open | Stays on the row, so ↑ ↓ walk the issues and the panel follows (phone: Back) | — | Esc / ×: title flies back, focus on the row | Opens full page (check peek) | Side panel |
| ↑ ↓ in the list | Focus ring moves; panel follows if open | Ticks unchanged | Moves | — | — | Moves selection (check) | check |
| Enter on a focused row | Opens it in the panel | Row open | Panel | — | Esc | Same | check |
| Space on a focused row | Toggles its tick | Count updates | Stays | — | Again | x ticks | — |
| Click a tick / shift-click | Bar becomes "N selected" | Range ticked | That row | — | Esc or ×: clears | Same | Same |
| Change status from a row's menu | Row moves to its new group at once; the list scrolls so it stays in view only if it was open | Row keeps focus | Back on the row's status cell | Toast only on failure | Change again | Moves at once | Same |
| Bulk status (bar or ⌘K) | Ticked rows move | Ticks cleared | Bar | Toast "4 moved to In review" + Undo | Undo puts them back, reticked | Same | Same |
| Assignee picker, type a name nobody has | List says "No one called 'x'" | — | Field | — | Clear | check | check |
| ⌘K | Command list over everything; first line names the target ("SUP-12" or "3 issues") | — | Search field | — | Esc returns focus where it was | Same | Has one (check scope) |
| Drag a card to another column | Card lifts, a gap opens where it'll land, others slide | — | Card | — | Esc while dragging: back to start | Same | Same |
| Switch List / Board | Same issues in the other view, scrolled to the focused one | Ticks kept | The focused issue | — | Switch back | Same | Same |
| Filter by assignee | Groups show their matches; each count is what's shown, with "3 hidden" | — | Stays in the bar | — | Clear filter | Count of matches (check) | check |
| Filter leaves a group empty | Group header stays with "None match"; empty groups collapse | — | — | — | Clear filter | check | check |
| Teammate changes an issue | Pill "2 updates" at the list top; nothing moves | Unchanged | Unchanged | — | Click pill: applied, changed rows marked for 2 s | Applies live | Applies live |
| New issue | Dialog over the list | — | Title | — | Esc / Cancel: focus to the button | Dialog | Inline row |
| Submit with an empty title | Dialog stays; "Give it a title" under the field | — | Title | Error clears on first character | Type | check | check |
| Create | Dialog closes; issue in its group, focused and marked for 2 s | New issue focused | New row | Toast "SUP-41 created" + Open | Undo | Toast + View | Same |
| Delete (row menu, bar, ⌘K, Delete key) | Row leaves; panel shows the next, or closes | Ticks cleared | Next row | Toast "Deleted SUP-12" + Undo, 6 s | Undo puts it back in place | Same | Confirm first |
| Status change fails (simulated offline) | Row goes back to its group | — | Unchanged | Toast "Couldn't save: SUP-12 is back in Todo" + Retry | Retry | check | check |
| Empty project (after Reset to empty) | "No issues yet" + New issue | — | The button | — | — | Same | Same |
| Phone: tap a row | Issue full screen | — | — | — | Back: to the row | Same | Same |
| Phone: long-press | Selection starts with it ticked | 1 selected | — | — | Done | check | — |

## New pages written along the way

Each of #4, #7–#10 becomes a principle page as Track reaches it, with its own research pass (primary sources, recent ones paired with classics). The backlog (`docs/research/2026-10-25-topic-backlog.md`) holds the starting sources for each. Command menu may be a component page instead; decided when it's written.

## Built (2026-10-28)

Version 1 landed in one pass after the owner asked for a fuller first cut than step 1. Deviations from the table above:
- Focus stays in the list when an issue opens (row "Click a row"), as in Post's reading pane.
- No simulated save failure yet (row "Status change fails"); every change succeeds.
- Phone long-press to tick isn't built yet; on a phone there's no way to tick.
- Show buttons and the two Before/After pairs on the page are still to come; the decisions are listed with their pages.

## Build order

1. Data (team, issues, statuses) and the List view grouped by status (decisions 10, 11, 12).
2. Issue panel beside the list, grow / shrink (2, 3, 15).
3. Focus, ticks and the selection bar (1); edit in place (7, 9, 13); delete with Undo (8).
4. Filter and counts (5).
5. Board view with drag.
6. ⌘K (4); New issue (14).
7. Teammates and updates pill (6).
8. Phone layout.
9. The page: decisions with Show, two Before/After pairs.

Each step is verified in the real page before the next, and deployed as it lands.

## Owner decisions (2026-10-28)

1. **Name:** Track.
2. **Keys:** arrows, Enter, Esc, Space, Delete and ⌘K. No letter keys.
3. **Board** is in version 1.
4. **Content:** a small team shipping a shop app (catalogue, cart, checkout, payments).
5. **Roll's assets** moved out of the repo, kept with their credits for later.

## Second pass (2026-10-28, after the owner's review)

The owner's review of version 1: the faces were wrong at 16px, New issue was a bare form, folded groups looked broken, and the app had no navigation. Their rulings:
- A tool is **flat**: no raised card for the page. The sidebar sits on Post's desk, then a hairline, then the page edge to edge. The sidebar **folds away** with a button that stays in one spot (Hide in the sidebar, Show in the header, both 8px from the edge, focus moving between them; the choice is kept).
- **Don't copy Linear's look.** Structure and behaviour may follow trackers in general; the visuals are the playbook's and Post's family: Space Grotesk titles, Post's desk and its lifted current place, the playbook's own Tabs with counts, a four-step ring for status rather than a filling pie, Open Peeps faces, made-up names (Fernhill, Shipyard).
- **The issue is the product's depth**: what blocks it, its sub-issues, the pull requests on GitHub with their checks and review, the build on the release platform, a cycle, due date and estimate, and comments.
- Unbuilt places show and go nowhere: Inbox, Projects, Views, Members, Cycles, Storefront.

Built:
- **Sidebar**: workspace menu (Reset, back to the site), Search (⌘K), New issue as its one filled button, Inbox, My issues (works), Workspace places, teams with Shop app's Issues (works). Phone: a drawer from the left, focus on the current place, Esc back to Show.
- **Header**: the place's name, tabs All issues / Active / Backlog with what each holds under the filter, List / Board.
- **Groups**: a strip of the desk, full width; empty statuses have no header; folded groups stack into a plain list; a + on each starts a new issue in that status.
- **Composer**: New issue in Shop app; title at the issue's own size; description; Status, Priority, Assignee, Labels chips; Create more; ⌘↵. Closing with text keeps it as a draft, with Discard in the toast.
- **Issue panel**, top to bottom by what you need first: the parent ("Sub-issue of"), title, properties (with Cycle, Due, Estimate read-only), Blocked by (the one danger-hued block), description, Sub-issues with done count, Pull requests (state by mark; failing check and changes-asked in red; the rest neutral), Release on Shipyard (Build, QA, Rollout %, Released), Activity with integrations as actors and comments as blocks, and a comment box. Copy branch name in the bar.
- **Rows** show sub-issue progress and the most telling pull request's mark before the labels.
- The tab title follows the place, tab and open issue.
- Teammates' changes no longer replay into the history on each visit.
- Stored issues moved to `track:issues:v2`; v1 is dropped.
- Lives at `/lab/track` until the owner signs off; the In practice page and its entry are held back (copy kept in the scratchpad, to restore with the Decisions list).

Open: Inbox fed by teammates' changes; a right-click menu on rows mirroring ⌘K; the page's Decisions list rewritten for this pass; research on app-shell and guidance topics (`docs/research/2026-10-28-app-shell-and-guidance.md`) to fold in.

## Third pass (2026-10-28): the list read as cluttered

The owner found the list "乱糟糟". The causes, measured at 1720px:

- Labels sat right-aligned at the far end, each row's pills starting at a different x, about 1000px from the title they describe. They now follow the title, outlined rather than filled; the right edge holds only steps and code, face, time, each a fixed column.
- Five dashed or dotted marks competed: filter pills, the empty face, no priority, the backlog ring. Only the backlog ring means something; no priority and no one now draw nothing until the pointer or keys are on the row, and the filter pills are gone.
- Four bands stacked above the first row: header, filter row, group bar, rows. Filter is now one button in the header with a submenu per property; the filter row appears only while a filter is set, as chips plus Clear. Ticking swaps the header's tabs and tools for the selection's actions in the same line, so the list never moves.
- The group bar's fold sat alone in the tick column, about 100px from the status it folds. Fold, status and name now sit together on the rows' first columns, one step out from the titles.
- Rows went from 40px to 36px.
