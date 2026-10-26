# Site polish: what the audit found, in the order to fix it

2026-10-27. Three independent screenshot-and-use reviews (components, principles, home + chrome + Post), plus mechanical checks: internal and external links, axe-core on every page in light and dark, load performance at 4× CPU throttle. Raw reports with screenshots are in the session scratchpad; this is the merged list.

Mechanical results first, because they are short:

- Internal links: none broken. External: 58 checked, one dead to the public (Healey's perception page now needs the NC State VPN); the 403s from APA, INFORMS and PMC are bot walls and open in a browser.
- Performance: at 4× throttle the worst page (home) has 75 ms total blocking time; no layout shift anywhere; no frame over 16.8 ms in any animation; no long task in any Post action at 1×.
- No horizontal scroll, console error or mis-anchored popup on any page, at 1440 or 390, light or dark.

## Batch 1 — Every page: keyboard and accessibility basics (P1)

| # | Problem | Fix |
| --- | --- | --- |
| 1.1 | Links show nothing when focused (`global.scss` removes `:focus-visible` outlines; links never add one back), and are told apart from text by colour alone (axe `link-in-text-block` on 20+ pages; the Colour page cites WCAG 1.4.1 while doing it) | `a:focus-visible` gets the focus ring; links in prose and captions get an underline in a quiet colour that turns ink on hover |
| 1.2 | Focus falls to `<body>`: a dialog's scrim click (focus trap broken while open); deleting a row in the Toast demos (Undo unreachable); in Post after unfolding earlier messages, collapsing a message, Undo on a toast, Search all mail | Each action names where focus lands: scrim keeps focus where it was; the neighbouring row's Delete; the first unfolded message; the same header; the restored row; the search field |
| 1.3 | Static specimens are live Tab stops (64 on Checkbox, 20 on Button; some toggle); home previews take ~45 Tabs before the 16th card | `inert` on specimen grids and home previews; each home card is one link |
| 1.4 | On /practice/mail, page-wide keys act on the embedded app: reading the decisions and pressing E archives mail and jumps the page; / and C pull the page to the app | Post's letter keys go (the owner: no shortcuts for now); the editor keeps its text-editing keys (⌘B, ⌘K, ⌘↵, Esc) |
| 1.5 | axe: two `main` landmarks on /practice/mail; dot-only badges with `aria-label` and no role; a focusable element inside `aria-hidden` (Where the eye goes, squint); scrollable tables not focusable and with no ring; empty first `th` in comparison tables; heading levels skipped on Card and Badge; duplicate region names | Post's main area is `main` only at full screen; `role="img"`; `inert` instead of `aria-hidden`; `tabindex=0` + ring on scrollers; a visually hidden header; heading levels; unique labels |
| 1.6 | Healey's perception page is dead to the public | Cite the paper (Healey & Enns 2012, IEEE TVCG) |

## Batch 2 — Demos that contradict their own text (P1)

| Page | Problem | Fix |
| --- | --- | --- |
| error-timing | Tabbing out of an empty password field turns all three rules red; the paragraph above says leaving an empty field is exploring, not a mistake | Rules stay neutral until something is typed or the form is submitted |
| how-waiting-feels | "Skeleton for a page, spinner for a part": the After puts a skeleton on one card, which its own cited rule assigns a spinner | The After loads a whole panel with a skeleton beside one card refreshing with a spinner |
| space-groups-by-ratio | At "All spacing 2×" the demo's badges read 1.6× / 1.7× (from 1.4× / 1.5×); the text says doubling keeps every ratio | The scale multiplies the measured gaps only, so the badges hold |
| toast | "Three at most, the rest wait": photos 1–3 are dropped, never shown | Queue them: each waits for a place |
| hover-forgives | The After still hides More until hover; the next paragraph says keep the often-needed in sight | More shows quietly at rest |
| nothing-shifts | Scroll-bar demo: on overlay scroll bars (Mac, phones) the Before shifts nothing | Draw a classic 12 px bar inside the demo |
| the-faster-way | "teaches almost no one" against the page's 35% and 28.9%; the emptied inbox can't be reset; "Hold ⌥" shows on phones | "leaves most commands on the slow way"; Restore inbox in the empty state; no ⌥ hint without a keyboard |
| let-motion-change-its-mind | "timed curves can't; transitions can" — a transition is a timed curve | Split: redirect (a transition or spring can); keep the speed (only a spring can) |
| concentric-radius | The summary drops "− border", which the rule and a whole section rest on | Add it |

## Batch 3 — Post as a product (P1–P2)

| # | Problem | Fix (argued from) |
| --- | --- | --- |
| 3.1 | An invalid address sends: `notanemail` becomes a normal chip, Send shows Sending, the message lands in Sent | Validate a chip when it's made; an invalid one is marked; Send stops on it, focuses it and says why (*Error timing*: tell them when they're done) |
| 3.3 | Shift-click on a checkbox doesn't select the range and paints a text selection across rows | Range from the last ticked row; no text selection on the checkbox column |
| 3.4 | A reply sent now reads "Mon 14:16", earlier than the message it answers (the sample "today" is a Thursday); Sent's Yesterday is out of order | The app's "now" is the sample's now; sort each folder newest first |
| 3.5 | Sent shows "me" on every row | Sent shows whom it went to |
| 3.6 | Toasts say "Archived" with no object (the Toast page's own copy rule: what happened, with its object) | "Archived “Q4 roadmap: final draft”"; "3 conversations archived" |
| 3.7 | Attachment cards look clickable and do nothing | Images open large; files open a preview with Download |
| 3.8 | Phone: after Reply opens, Send is below the screen | The reply scrolls itself into view, its Send above the keyboard |
| 3.9 | /practice/mail: every Show jumps the page to the app, leaving the reader far from the next decision; Show 5 really archives the Q4 thread, which Shows 7–8 then open while Inbox stays highlighted | The app stays beside or above the list while reading it (sticky on wide screens); a Show leaves the app as it found it |
| 3.10 | Smaller: hover actions cut the snippet with no ellipsis; Search all mail keeps Inbox highlighted; ↓ in search doesn't reach results; phone folder menu lacks counts and the current mark; select-all shows on an empty list; @ alone shows no list; a 22-byte .txt reads "DOC · 1 KB"; Drafts cuts recipients with no ellipsis | One by one |

## Batch 4 — Visual consistency (P2–P3)

- Before/After pairs of unequal height: Radio, Tabs, Input ×2, Menu, the-faster-way, where-the-eye-goes. One stage height per pair.
- Combobox, Menu and Popover scenes put the control in the top-left of a large empty stage; the pairs look identical until clicked. Centre them; size the stage to the popup; start the motion pairs open or play once on entering.
- The Tooltip page reuses the Toolbar page's opening scene; give it its own.
- Phone: Button and Toolbar States grids are cut at the right; table demos hide the column they discuss; checkbox, radio, switch rows are 20 px tall to tap (24 minimum, 44 for touch); the failure toast truncates its reason.
- Scrollable tables give no sign they scroll: an edge fade, then drop "Try scrolling both".
- An invalid field looks the same focused and not: keep the red edge, add the ring.
- Select's trigger text is 13 px beside 14 px inputs, though the page says "as Input".
- Dark mode: Concentric's outer shape and the ratio stripes nearly vanish.
- Slider ticks cut through the label and touch the value.
- Home: a two-line card title pushes its preview 22 px below its row; the Table preview touches its right edge; stage heights vary (248–316). One title line, one stage height.
- Way back: "All components / principles / examples" go to the top of the home page, not the section; the pager crosses sections without saying so; the 404 has one link and no search.

## Batch 5 — Copy and sources (P2–P3)

- "Precision" is cited on four pages as an authority and never introduced; "Precision's README" points at nothing the reader can see. Say "the playbook's tokens" or link a page that introduces it.
- Authoring notes in reader text: `data-instant`, `data-highlighted`, "Without script…". Demo chrome that labels the obvious: "Select files to act on them", "Click to refresh", "Nothing opened yet", "Try scrolling both".
- `ana@studio.com` auto-links to `mailto:` on Input.
- Grammar and typography: Button "Quick down, soft back" caption; straight apostrophes on three captions; wrong examples bold on Button, italic elsewhere; orphans in narrow columns (`text-wrap: pretty`); tokens breaking mid-word in phone tables.
- Repetition: the proximity argument and its Input line appear on both Where the eye goes and Space groups by ratio; keep it on the ratio page.
- Section structure differs (error-timing has no Details or "applies it"; concentric uses "Common mistakes").
- Sources: Fitts's law cites an NN/g explainer (cite Fitts 1954 / MacKenzie 1992); Tooltip, Card, Menu, Popover, Table and Toolbar make mechanism claims with no source.
- Names: the section is "In practice", its back link "All examples", the page "Mail", the app "Post". One name each.
- No share image on any page (`og:image`), which marketing will need.

## Decided (2026-10-27)

1. Order: batches 1 → 2 → 3 → 4 → 5, each verified and deployed.
2. Links in prose and captions: always a quiet underline, darker on hover.
3. Post has no letter keys for now (J/K and the rest are removed, with what depended on them).
4. /practice/mail: the app sticks at the top on wide screens while the decisions scroll under it; each Show leaves the app as it found it. Home cards: previews are inert and the whole card is the link.

## Done (2026-10-27)

Batches 1–5 shipped: 71625b5, 3597170, 2fd594d, c7ce979 and the batch 5 commit. Left open:

- Mechanism claims with no source on Tooltip, Card, Menu, Popover, Table and Toolbar: needs reading, not editing.
- Section structure differs between principle pages (error-timing, concentric-radius).
- Combobox, Menu and Popover pairs still look identical until clicked (start open, or play once on entering).
- A share image (`og:image`) for every page.
- axe leftovers judged not to need change: disabled menu items (WCAG exempts inactive controls), an empty corner cell in comparison tables, Card's h3 title.
