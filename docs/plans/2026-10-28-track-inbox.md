# Track: Inbox

Status: built 2026-10-28 with the three recommended choices (pill kept, opening reads, a number).

## The problem

Inbox is the second row of Track's sidebar and goes nowhere. Teammates already change issues during a
visit (`teammates.ts`, one change at 15 s, then one every 30 s), but every change is handled the same
way: it waits behind the "N updates" pill over the list. Nothing tells you which changes are about
you, so you either watch everything or miss what was for you.

## The rule it argues

From `docs/research/2026-10-28-app-shell-and-guidance.md` §6 (*Interrupt only for me*):

- Deliver only what is addressed to the person; a change to something already on screen needs no
  notification (Apple HIG, Notifications).
- Hold arrivals until a break in the task (Iqbal & Bailey 2008).
- Don't go silent instead: no notifications did worse than batched ones (Fitz et al. 2019).
- No toast for a teammate's activity: an alert cost 10+ minutes of diversion plus 10+ to get back
  (Iqbal & Horvitz 2007).

## Reference: Linear's Inbox (linear.app/docs/inbox, read 2026-10-28)

- You're subscribed to an issue you created, are assigned to, or are mentioned in; key events on those
  issues reach Inbox.
- Opening a notification shows the issue beside it, editable, with Inbox actions.
- `U` read / unread, `⌥U` all read, `Backspace` delete, `⇧Backspace` delete all read, `H` snooze,
  `J`/`K` or arrows move.
- GitHub (docs, read 2026-10-28) is the same shape: a reason per notification (assigned, mentioned,
  participating), Done removes it, Read only changes its state.

## What Track builds

**What reaches Inbox.** An event on an issue that is yours: assigned to you, created by you, or one
that mentions you. Kinds: assigned to you, a comment, a mention, a status change, a priority change.
Everything else stays out, and keeps going behind the "N updates" pill as now.

**One entry per issue**, newest event on top, so five changes to one issue are one line, not five
(Apple: "Avoid sending multiple notifications for the same thing").

**The list.** Same grid discipline as the issue list, two lines per entry as in Post:

| Column | Content |
| --- | --- |
| unread | accent dot, empty when read (Post's dot, `colour-and-unread.md`) |
| who | the teammate's face |
| what | line 1: issue ID and title; line 2: "Ana commented: Should the default be…" |
| when | relative time, right-aligned |

**Beside it.** Opening an entry opens the existing issue panel, as from the list. Opening marks it
read.

**Keys.** `↑↓`/`J K` move, `↵` opens, `U` read / unread, `⌥U` all read, `Backspace` deletes it (with
Undo in a toast, as Track's delete). Header row: "Mark all as read".

**Sidebar.** Inbox shows the unread count in the row's trailing column, ink-muted; nothing when zero.

**Breakpoint.** While New issue is open or a comment box has focus, arrivals are held: the count
doesn't move until it closes.

**Never empty on first visit.** It starts with three entries from yesterday, two unread, so there's
something to look at.

**Script.** `teammates.ts` gains four events addressed to you among the existing six:

- Kofi hands you SHOP-60 (Apple Pay on the web);
- Ana comments on your SHOP-53 (Saved addresses);
- Kofi mentions you on his SHOP-51 (3-D Secure redirect): does it keep the cart, your SHOP-54?
- Yuki moves your SHOP-43 from In review to Done.

One existing event already counts: Tom takes SHOP-49, which you created (the sample data makes you
the creator of every unassigned issue). The other five stay out of Inbox. Comments carry a body,
shown in the Activity block as now.

Inbox entries and read state are kept in localStorage with the issues; "Reset sample issues" restores
them.

## State transitions

| Trigger | Main area | Active item | Selection / focus | Empty / error | Way back | Linear |
| --- | --- | --- | --- | --- | --- | --- |
| Click Inbox | Inbox list | Inbox row lifted | focus stays on the sidebar row; the first entry is the list's Tab stop | "Nothing new." + link to My issues | sidebar | same |
| Event for you arrives | list gains entry on top, rows under the pointer don't move | — | focus stays | — | — | same |
| Arrives while composing | nothing until it closes | — | stays in the field | — | — | n/a |
| Click / `↵` entry | issue panel beside list; entry read; its waiting changes let in | entry highlighted | focus to panel title | issue deleted: its entry goes with it | `Esc` → focus back on entry | same |
| `U` | dot toggles; count follows | — | stays | — | `U` again | same |
| `Backspace` | entry leaves; next entry takes focus | — | next entry, or the empty state's link | — | Undo in toast | same, without Undo |
| Mark all as read | dots clear, count clears | — | stays | — | none (reversible per entry) | `⌥U` |
| Phone | list full width; entry opens panel full screen | — | as list | — | Back | n/a |

## Deviations from Linear, kept

- One entry per issue: Linear doesn't document its grouping; GitHub groups by thread.
- No snooze: a visit lasts minutes; a snooze can't be felt in it.
- No Priority tab: with four or five entries a split adds nothing.
- Undo after Backspace: Track's other deletes have it.

## Decisions for the owner

1. **Others' changes:** keep the "N updates" pill (list never moves under you), or apply them in
   place when the pointer isn't on the list? Recommend: keep the pill.
2. **Opening marks read:** yes (Gmail, Slack), or only `U` (Linear doesn't say)? Recommend: yes.
3. **Count style:** a number in the trailing column (Linear, Slack), or a dot? Recommend: number.

## Files

- `inbox.ts`: entry type, seed, which events count as yours.
- `useInbox.ts`: entries, read state, held arrivals; `useTrack.ts` passes events through (it's 320
  lines, so Inbox state goes in its own hook).
- `Inbox.tsx`, `InboxRow.tsx`, their `.module.scss`.
- `Sidebar.tsx` (count), `Shell.tsx` (place `inbox`), `teammates.ts` (events for you).
- Tests: an event for you lands in Inbox and the count; one for others doesn't; opening reads it; `U`;
  `Backspace` with Undo; held while New issue is open.

## As built

- Entries are derived from each issue's history plus the changes still waiting behind the pill
  (`notifications.ts`); the only stored state is one mark per issue (`useInbox.ts`). A deleted issue's
  entry goes with it.
- "Something you did since" counts as read; at the same moment, the teammate's event still counts.
- The panel's arrows and ↑↓ follow Inbox's order while you're in it, and read what they open.
- Found on the way: Track's clock wrote UTC beside the sample's local times, so in UTC+8 a change you
  had just made read "8h"; it now writes local time. On a phone, focus now reaches Back when an issue
  opens (the title's view transition ran after the frame that focused it), and Back names where it goes.
