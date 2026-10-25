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

State transitions for writing come with phase 2's plan.

## Gaps this opens in the playbook

Avatar, a chips (token) input and a rich-text editor have no component pages. Each is written when the build reaches it, after its own research, so the page and the app's use of it agree.

## Checks

Every new part joins `/lab/mail-states` (message header open/collapsed/unread, chips, avatars), every new flow gets `layoutProblems` after each step, and the finished phase goes through the independent screenshot review before it's called done.
