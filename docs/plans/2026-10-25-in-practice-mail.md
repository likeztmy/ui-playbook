# In practice: Mail

A third section, In practice: the playbook's rules applied to a whole product. Reference: Material Studies (Reply, Rally, Crane, Shrine), working apps that show a system applied; shadcn's Examples (working apps, no explanation). We add what neither has: each decision is listed under the app and can be played in it.

## Page

`/practice/mail`, layout `Practice.astro` (Entry's frame with "In practice" as the kind and "All examples" as the way back). Home gets a third group.

1. One paragraph: what the app is.
2. The app, full content width (880), 520 tall. A fictional mail app, "Post".
3. Decisions: a numbered list. Each item is one sentence, a link to the page that explains it, and a Show button that plays the moment in the app. Deviation from the agreed "beside the app": at 880 there's no room beside a three-column app; the list sits under it and Show scrolls the app into view.
4. Two Before/After pairs, one variable each: new mail inserted at the top vs held behind a pill; row actions that push the time out vs actions that take its place.

## Decisions

| # | Decision | Page |
| --- | --- | --- |
| 1 | Archive at once, Undo in the toast; no confirm | Toast: Undo instead of asking |
| 2 | Row actions appear on hover in the time's place; the row never changes size | Hover forgives: Actions that appear on hover |
| 3 | Right-click a row for its actions; the menu carries no shortcuts, the toolbar's tooltips do | Menu: A context menu carries no shortcuts; Tooltip |
| 4 | New mail waits behind "1 new message" instead of pushing the list down | Nothing shifts |
| 5 | A slow message shows a spinner only after 300 ms, and keeps it 500 ms | How waiting feels |
| 6 | Starring is instant; the server catches up | How waiting feels: Don't wait at all |
| 7 | Search with no results says what was searched and offers All mail | Combobox: An empty list says what was searched |
| 8 | Unread is bold and a dot; blue is kept for the one primary action | Colour means one thing |

Keyboard (Gmail's: support.google.com/mail/answer/6594): j older, k newer, e archive, s star, u back to the list.

## State transitions

| Trigger | Main area | Selection / focus | Feedback | Way back | Gmail |
| --- | --- | --- | --- | --- | --- |
| Click a row | Reading pane shows it | Row selected; focus stays on the row | Unread → read | Click another | Same |
| j / k | Next / previous message | Moves with it | — | k / j | Same |
| Archive (button, e, menu) | Next message opens | Next row selected and focused; list empty → empty state | Toast "Archived" + Undo, 6 s | Undo restores it in place, reselected | Same, Undo in toast |
| Undo | Message back in its place | Restored row selected | Toast closes | — | Same |
| Star (s, row, pane) | Star fills at once | Unchanged | — | s again | Same |
| Folder click | That folder's list, first message open | First row | Count stays | Click Inbox | Same |
| New mail arrives | Pill "1 new message" at list top; list unmoved | Unchanged | Inbox count +1 | Click pill: inserted at top | Inserts at top |
| Open slow message | Pane keeps the header; body spinner after 300 ms, ≥ 500 ms | Row selected | — | Select another: cancels | — |
| Search typed | List filters, matches marked | First match selected | Zero: "No messages match 'x' in Inbox" + Search all mail | Clear (×, Esc) | Same |
| Right-click row | Context menu at pointer | Row highlighted, not selected | — | Esc / click away | Same |
| Phone: tap row | Message pushes in from the right | — | — | Back (u, button) slides back from where it is | iOS Mail |

Empty states name the next step: an empty Inbox says "Inbox zero" with nothing to do; an empty search offers All mail.
