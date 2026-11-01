# Owner's references: tool apps that look right, and Anthropic's published UI prompts

Research date: 2026-11-01. Two inputs for the looks and the vague-word table
([plan](../plans/2026-11-01-looks-and-vague-words.md)).

## 1. Four screens the owner picked

Screenshots the owner sent of ChatGPT (a conversation, and its library list), Claude (the Code
tab) and Craft (all documents), on macOS. They aren't kept in the repo: they show the owner's own
titles and accounts. What follows is what they show, observed by eye; it is a reference for the
register, not a source of any product's tokens (those come only from
[what products publish](2026-11-01-product-design-systems.md)).

What the four share:

- **No colour on surfaces.** White and a near-white grey; text in black and one or two greys. Colour
  appears only where something asks to be noticed (an unread dot, a switch that's on) or where it's
  content (an avatar, a document's thumbnail).
- **Sidebar rows are icon and label, nothing else.** One icon column, one label edge. The current
  item is a grey rounded fill; no border, no bar. Section labels (Pinned, Projects, Recent) are
  small grey sentence case, not capitals.
- **Lists are rows with hairlines.** A header row of small grey column names, rows split by one
  line each, no stripes and no cards. Trailing meta (source, time) is grey and sits in aligned
  columns. Craft groups the rows by time: Today, Last 7 days, then months.
- **One filled action per screen.** ChatGPT's library has one dark pill (Create); the search field
  beside it is an outlined pill. View switches are icon buttons sharing one grey segment.
- **Big page title, few sizes.** A large bold title, body text, and smaller grey meta: about three
  sizes on a screen, all in the system face.
- **A conversation reads like a document.** The person's message is a grey bubble on the right; the
  reply has no bubble and reads at a column's width. Tool activity folds into one grey line each
  with an icon ("Ran command"). The composer is one rounded surface with its controls on its
  bottom row and a round dark send button.
- **A side panel is sections on one grid.** Claude's right panel: each section a heading on the
  left with its value right-aligned on the same row, hairlines between sections, rows of icon,
  label and trailing meta.
- **Loading has the shape of what's coming.** ChatGPT's sidebar shows grey bars where rows will be.
- **A limit is a bar, not a dialog.** Claude's usage notice sits above the composer with one action
  and a close button.

Each is a rule the playbook already states: grey until it matters, the lightest boundary that
holds, who before what, one primary action, and how waiting feels. Together they are what
"premium" means for a tool: restraint, and the shapes people already know.

## 2. What Anthropic publishes about UI

Three first-party sources, all in Anthropic's GitHub organisation:

- [`anthropics/skills`: frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design),
  a Skill for "distinctive, intentional visual design".
- [`anthropics/skills`: theme-factory](https://github.com/anthropics/skills/tree/main/skills/theme-factory),
  ten preset colour and font themes for slides, docs and landing pages, picked from a showcase.
- [`anthropics/claude-cookbooks`: Prompting for frontend aesthetics](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb),
  a system-prompt section and before-and-after generations. The same skill also ships as
  [`claude-plugins-official`: frontend-design](https://github.com/anthropics/claude-plugins-official/tree/main/plugins/frontend-design).

What they agree with us on:

- **Structure is information.** Numbering, eyebrows, dividers and labels must encode something
  true about the content; numbered markers only for a real sequence.
- **Words are design.** Name things as users know them; a button says what happens ("Save
  changes", not "Submit") and keeps that name through the flow; errors say what went wrong and how
  to fix it, without apology; an empty screen invites the next action.
- **Plan, then check the plan, then build, then look.** frontend-design asks for a token plan
  (4–6 colours, type roles, layout, principles) reviewed against the brief before code, and
  screenshots to critique the result. Our step 2 and step 5 do the same.
- **The tells of generated design**, named: one word accented in a headline, all-caps labels,
  eyebrows above every heading, identical rounded cards with the same soft shadow, gradient washes,
  "A · B · C" meta strings, a "→" on every link.

Where they part from us, and why it matters:

- **Their goal is distinctiveness; a tool's is familiarity.** frontend-design casts the agent as a
  studio whose client "rejected proposals that felt cliché"; the cookbook says to avoid Inter,
  Roboto, Arial and system fonts, to layer gradients for "atmosphere", and to stagger a page-load
  reveal. That fits a landing page or a reading page. The four screens above do the opposite: the
  system face, flat surfaces, no entrance motion. For a work tool, the playbook's rule stands: start
  from the product people already know.
- **theme-factory's themes are for documents and decks**, not app chrome.

So the Skill takes their tells list and their writing rules, and takes their distinctiveness only
for reading and marketing pages.
