# Mail, direction one: reading and writing

Direction one has a good list and almost nothing past it: a message is a few plain paragraphs and writing is three fields. Reading and writing are what a mail app is for, and both are real needs, so they are the next work. Order: reading first (a reply opens inside a conversation, so writing sits on it), then writing.

## Phase 1 · Reading

### What it shows

- **Conversations.** Messages on one subject stack in one view. Older ones collapse to a line (avatar, sender, first line, time); the newest and any unread are open. Click a collapsed line to open it; click an open header to collapse it. "Expand all" when three or more are collapsed together, shown as "3 earlier messages" (one line standing in for a run).
- **Quoted history.** A reply's quoted earlier text is folded behind "···" and opens in place.
- **People.** Sender with name and address; recipients as "to me, Priya and 2 others", which opens to the full To / Cc list. Avatars are initials on a colour fixed per person (same colour everywhere they appear); a photo where one exists.
- **Long content.** Headings, lists, quotes, code, links, images and a table in a message set for reading: a measure of about 70 characters, inline images fitted to the measure, wide tables scroll inside their own box instead of the pane. Signatures recede. One newsletter-style message with its own layout shows how foreign HTML is held: in its own box, never wider than the pane.
- **Attachments.** A row of cards (icon or thumbnail, name, size); images as thumbnails.

### State transitions

| Trigger | Main area | Selection / focus | Feedback | Way back |
| --- | --- | --- | --- | --- |
| Open a conversation | Thread: older collapsed, newest open, scrolled to the first unread | Focus on the thread's first unread message header | Conversation marked read | Back (U) to the list, same scroll position and row |
| Click a collapsed message | It opens in place; nothing above it moves | Focus stays on its header | — | Click its header |
| "3 earlier messages" | The run opens in place | First of them focused | — | Collapse each |
| "···" in a reply | Quoted text opens below it | — | — | "···" again |
| "to me, Priya and 2 others" | Popover: To and Cc lists with addresses | Focus in the popover; Esc returns | — | Esc / click away |
| Image in a message | Opens larger in a Dialog | Focus moves to the dialog | — | Esc returns focus to the image |
| Wide table | Scrolls inside its box | — | Edge shade while more is hidden | — |

Empty and loading: a conversation's messages arrive at once; images load into fixed boxes (Nothing shifts), with a spinner only past 300 ms (How waiting feels).

## Phase 2 · Writing (TipTap 3, MIT)

- **Recipients.** To / Cc / Bcc as chips; type for suggestions (Combobox); Backspace on an empty field selects the last chip, again removes it; an invalid address is flagged when you leave the field, not while typing (Error timing).
- **Text.** Bold, italic, lists, quote, link via a formatting toolbar (Toolbar + Tooltip with keys) and Markdown-style shortcuts (`**`, `- `, `> `); a link is added in a Popover.
- **@mentions.** `@` opens contact suggestions; the mentioned person is added to To, as Outlook does ("prompt Outlook to add them to the To line", support.microsoft.com, checked 2026-10-26).
- **Attachments.** Drop or pick; each uploads with its own progress; Send says what it's waiting for while one is unfinished.
- **Drafts and sending.** "Saved" appears after a pause in typing, not on every key; Send with ⌘↵; the sent toast offers Undo for a few seconds.
- **Replies** open inline at the foot of the conversation, quoting the message they answer behind "···".

### Reference behaviour (checked 2026-10-26)

- Gmail ("Write and send email", support.google.com/mail/answer/9259768): "Gmail automatically saves messages you're working on in a label named Drafts"; recipients can be added with "+" or "@" and a contact's name in the text; Undo is offered in the "Message sent" notification, for 5, 10, 20 or 30 seconds (support.google.com/mail/answer/2819488).
- Outlook: an @mention adds the person to To (support.microsoft.com, checked earlier the same day).

### Where it lives

- **New message**: takes the main area in place of the list, as an open conversation does, with the same bar on top (Back, then Discard). Owner's call, 2026-10-26: Gmail's docked window can already grow to fill the window, and one place for writing is simpler than a window over the list. The same on a phone.
- **Reply / Reply all / Forward**: inline at the foot of the conversation, under the message answered.

### State transitions

| Trigger | Main area | Focus | Feedback | Way back |
| --- | --- | --- | --- | --- |
| Compose (button, C) | Composer replaces the list in the main area | To field | — | Back (Esc): to the list, saved to Drafts if anything was written; focus back on Compose |
| Reply (button, R) / Reply all (A) | Reply opens at the conversation's foot, scrolled into view; To filled; the answered message quoted behind "···" | Body | — | Discard, or Close (kept as a draft on that conversation) |
| Forward (F) | As Reply, To empty, the original quoted open; its attachments carried | To field | — | As Reply |
| Type in To / Cc / Bcc | Suggestions from people in the mail (Combobox) | Stays in field; arrows move the highlight | — | Esc closes suggestions |
| Enter / Tab / comma / paste of several addresses | Each becomes a chip | Field, after the chips | An invalid address is a red chip, marked when you leave it, not while typing | × on the chip; Backspace on empty field selects the last chip, again removes it |
| Select text, ⌘B / ⌘I / toolbar | Mark applied; toolbar button shows pressed | Stays in text, selection kept | — | ⌘Z |
| ⌘K or link button | Popover at the selection with the URL field | URL field | — | Esc: back to the text with the selection as it was |
| `**text**`, `- `, `1. `, `> ` | Turns into bold, list, quote as typed | Caret stays | — | ⌘Z undoes the conversion, leaving the typed characters |
| `@` or `+` and a name | Suggestions at the caret | Arrows/Enter pick | Mention appears in text; the person joins To as a chip | Remove the chip in To (the mention text stays) |
| Attach (button) / drop a file | File card with its own progress; drop target highlights while dragging over the composer | Unchanged | Progress per file | × cancels or removes |
| Send (button, ⌘↵) with nothing in To | Composer stays | To field | "Add a recipient" under To | — |
| Send while a file is uploading | Composer stays | Send button | Button reads "Sending when ready…" and sends when the upload finishes | Click again to cancel the wait |
| Send | Composer closes; a reply joins the conversation at once; the message goes to Sent | Back where it was (the conversation, or the list) | Toast "Message sent", Undo for 5 s | Undo: the message leaves Sent/the conversation and the composer reopens as it was, caret at the end |
| Pause in typing (≈1 s) | — | — | Footer "Saved" | — |
| Discard (trash) | Composer closes | Back where it was | Toast "Draft discarded", Undo | Undo reopens it |
| Open a draft in Drafts | Composer with its content (a reply draft opens in its conversation) | End of body | — | Back |

Empty states: Drafts with none says "No drafts"; Sent with none says "Nothing sent yet".

Other decisions (owner, 2026-10-26): Markdown input rules only for lists and quotes; Send during an upload waits and sends; drafts are kept in localStorage, so they survive a reload (the rest of the sample mail resets).

Deviation, kept: recipient suggestions open under the field at the chips' left edge, not under the caret as Gmail's do, so names and addresses line up with the chips they become.

### Step 2 · Formatting (state table)

Reference: Gmail's formatting row sits over Send; ⌘B / ⌘I / ⌘K / ⌘⇧7 / ⌘⇧8 as in Gmail; tools show pressed for the marks at the caret. Post offers only what a message can hold and the reader renders: bold, italic, bulleted and numbered lists, quote, link.

| Trigger | Main area | Focus | Feedback | Way back |
| --- | --- | --- | --- | --- |
| Caret or selection moves | — | Stays in text | Tools for the marks there show pressed | — |
| Click a tool / ⌘B ⌘I ⌘⇧8 ⌘⇧7 ⌘⇧B | Mark or block applied to the selection | Back in the text, selection kept | Tool pressed | Same again, or ⌘Z |
| Link tool / ⌘K, text selected | Popover under the tool: the address field | Address field | — | Esc: back to the text, selection as it was |
| Link tool / ⌘K, caret in a link | Popover with its address and Remove | Address field, address selected | — | Remove unlinks; Esc leaves it |
| Enter in the address | Link applied (an empty selection inserts the address as its text) | Text, after the link | Link underlined | ⌘Z |

The row sits on the footer's line, between Send and Discard, in both a new message and a reply; on a phone it stays one line.

### Build order

1. Composer shell, recipients chips, send / undo / Drafts folder, reply inline.
2. TipTap body: toolbar, shortcuts, Markdown input rules, link popover.
3. @mentions into To; attachments with simulated progress.

Each step ships, deployed, with its rows in `/lab/mail-states` and its flows under `layoutProblems`. TipTap is fetched right after the app's first render: never on the reading path, but in hand before anyone writes, so keys typed straight after R land in the body.

## Gaps this opens in the playbook

Avatar, a chips (token) input and a rich-text editor have no component pages. Each is written when the build reaches it, after its own research, so the page and the app's use of it agree.

## Checks

Every new part joins `/lab/mail-states` (message header open/collapsed/unread, chips, avatars), every new flow gets `layoutProblems` after each step, and the finished phase goes through the independent screenshot review before it's called done.
