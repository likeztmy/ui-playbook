# Post, argued from the playbook: where it reads as a Gmail copy, and what replaces it

Owner's rule (2026-10-27): Post proves the playbook. A choice is justified by a playbook principle or its research, never by "Gmail does it"; a replica persuades no one. This audit lists what in Post today reads as Gmail, sorts it, and proposes replacements argued from the principles. Nothing changes before sign-off.

Sorting:

- **Signature**: something people recognise as Gmail's own. These make the demo look traced; replace.
- **Convention**: shared by nearly every mail client (folders, a search field, To/Cc/Subject). Keep, but justify by need, not by precedent.

## Signatures, with replacements

| # | Today (Gmail's) | Replace with | Argued from |
| --- | --- | --- | --- |
| 1 | The frame: grey canvas, a pill **Compose** atop the folders, a search bar across the top, the mail in a rounded white card | No top bar. **Search and New message move into the list's own bar**, over the list they act on; the sidebar is the brand and the folders. The list gets the 56px the top bar took | *Where the eye goes*: the eye works one spot and misses changes elsewhere — an action sits where its result appears (search filters this list; a new message opens in this area) |
| 2 | Hovering a row swaps its **time for action icons** | The time stays put. Actions come **after the pointer rests** on a row (≈300 ms) and sit beside the time, not over it; E, the context menu and the selection bar remain | *Hover forgives*: judge intent by dwell, not contact. *Nothing shifts*: sweeping the pointer down the list now flickers every row's time |
| 3 | A **star column** on every row (empty outlines on hover) | No star column. A starred row carries a small filled mark after the time; star from S, the context menu or the conversation | *Where the eye goes*: 18 identical marks are scanned past; a mark only where it means something is found. *Colour means one thing*: the mark stays the one yellow |
| 4 | A **checkbox column** always shown | Checkboxes appear when the pointer rests on the left edge, and stay for every row once one is ticked (selection mode); select-all stays in the bar | Same as 3: a column of empty boxes on a list you mostly read is noise; selection is the rarer task |
| 5 | A thread's folded run as **a circled number**, "3 earlier messages" | The run as **who wrote it**: stacked avatars and names, "Mira, Priya, you · 3 earlier" | *Where the eye goes*: the eye follows the label that promises what it wants — a count promises nothing, names say whether to open it |
| 6 | Quoted text behind a bare **"···" pill** | A text button naming what's folded: "Show Mira's message of Tue 17:05" | Same: a label that promises; the independent review found the pill unreadable |
| 7 | **"to me, Priya and 1 other ▾"** | The recipients as names, in full while they fit, "+2" only when they don't; the popover only for addresses | *Where the eye goes*: what's hidden is missed; show what fits rather than summarise it |
| 8 | **Reply / Reply all / Forward pills** at the thread's foot | A **reply field already there** at the foot, "Reply to Daniel…": typing in it is replying. Reply all and Forward sit at its end | *The faster way*: the path is reading to the end; the action is where the reading stops |
| 9 | **"Message sent · Undo"** toast | Undo **where the message lands**: a sent reply appears in its thread marked "Sending · Undo" for the undo window; a new message, as the first row of Sent with the same | *Where the eye goes*: the eye is on the thread it just answered, not the screen's foot. *How waiting feels*: the wait is shown on the thing waited for |
| 10 | The **"1 of 18 ‹ ›" pager** | At the thread's end, the next conversation by name, "Next: Your trip to Lisbon is confirmed", J/K kept | A label that promises beats a position count |
| 11 | Drafts marked with **red "Draft"** | "Draft" in ink with a pencil mark | *Colour means one thing*: red means something is wrong; a draft isn't |

## Conventions, kept (and why)

- **Folders, search, To/Cc/Bcc/Subject**: what mail is; a demo that hid them would be harder to use, not more original.
- **Date sections** (Today, Yesterday, This week): not Gmail's; *Space groups by ratio* and the time-grouping research.
- **Unread dot**: argued in docs/research/2026-10-27-colour-and-unread.md (a mark on the target; blue survives colour blindness).
- **Keys** (J/K/E/S/X/U/C/R/A/F): invisible until asked for; kept so the app is fast to drive. Not a reason in itself; revisit if a page on shortcuts argues otherwise.

## Decisions for the owner

1. Take all of 1–11, or a subset? Recommended: all; 1, 2, 5, 8, 9 change the app's look most.
2. Item 1: New message and search in the list bar, or New message in the sidebar's head (still out of a pill)? Recommended: the list bar.
3. Item 9: inline Undo replaces the toast for sending only; archive and discard keep their toast at the main area's foot (the row they acted on is gone, so there is no "where it lands"). Agree?

## Order, once agreed

1. Frame (1), rows (2, 3, 4), drafts (11) — the list.
2. Thread (5, 6, 7, 10) — reading.
3. Reply field and inline Undo (8, 9) — writing.

Each step: state-table rows in the reading/writing plan rewritten from principles, tests and `layoutProblems` per flow, the independent screenshot review, deploy.
