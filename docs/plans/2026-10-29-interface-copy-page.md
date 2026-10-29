# Principle: interface copy

Status: signed off 2026-10-29, all four as proposed: a principle page *Every line does a job*; ellipsis kept; placeholder may be an example; four demos and three text details.

Research: `docs/research/2026-10-29-interface-copy.md` (sections cited as §n). Third topic of
`docs/plans/2026-10-29-direction-systems.md`.

## What it owns

Every component page already has a `## Copy` section for its own words (§0). This page owns what
none of them can: tone in a tool, headings, the word above a heading, capitalisation, errors and
empty states across components, confirmations, *please* / *we* / *sorry*, and one term per thing.
Component Copy sections stay, and link here.

## Title and summary (draft)

**Every line does a job.** In a tool, a line of text names a thing, an action or a state. A line
that could be swapped for any other belongs on the marketing site.

## Sections

**Lead demo.** Eval example 12 (§11): a tracker's *New issue* panel with *MAKE IT HAPPEN* /
*Every improvement starts here.* / *Give your next step a little clarity.* above the Title field,
against the panel with the field first. Compare, stacked.

**When it applies.** Product screens: apps, tools, settings, flows. The marketing site is another
genre with other rules; the line between them is the sign-in.

**Details**, four with demos, three as text:

1. *The first two words carry the line* (demo). A settings list whose rows all start
   *Manage…* / *Allow…* against rows that start with what differs. People see about two words per
   list item, and skip a first word every row shares (NN/g 2009, 2017; §1).
2. *A slogan costs the task* (demo). A tracker header from eval 13 (*A LITTLE PROGRESS, EVERY
   DAY* over *Issues*) against the plain header. Removing promotional language alone made a site
   27% more usable; halving the words, 58%; both with scannable layout, 124% (Morkes & Nielsen
   1997; §3). Polaris: too much content "makes a tool feel cheap".
3. *The word above a heading names its parent* (demo). Eval 11's visible *ISSUE DETAILS* eyebrow
   with the real title hidden, against *Backlog · ORB-142* above the title (GOV.UK's caption,
   eval b-5's good case). Product systems don't have an eyebrow at all; IBM's marketing kit has
   96 references and its product kit none; Material 3 dropped Material 2's overline (§3).
4. *An error says what happened, where it happened* (demo). Eval 7: *Something went wrong.
   Please try again.* under the terms checkbox, against the cause next to the form's action with
   the way out. Placement and timing are what's measured (§5); *please* "implies a choice"
   (GOV.UK), and polite, voluntary wording lowered compliance in an 80,000-user field test (§5).
5. *A specific verb lets people skip the question* (text). Name the result, *Delete 3 files*, but
   when the dialog must be read, Microsoft's *Uninstall anyway* (§2). Links to Dialog.
6. *A confirmation stops being read by the second time* (text). Habituation from the second
   exposure (Anderson et al. 2015), click-through 70.2% on Chrome's SSL warning (Akhawe & Felt
   2013); retyping the critical fact gave 2–3× more informed decisions (Bravo-Lillo et al. 2013).
   Prefer undo; confirm only what can't be undone, and then ask for the fact (§7).
7. *Sentence case, for a different reason than you'd think* (text). Short all-caps isn't harder to
   read, and at small sizes it's easier (Arditi & Cho 2007); lowercase's edge in running text is a
   practice effect. The reasons that hold: one case across the product, translation, and caps
   read as shouting. Caps are a style (`text-transform`), never typed into the string (§4).

**Words by place** (table): heading, button, menu item, field label, hint, placeholder, error,
empty state, toast, confirmation. One line each: what it is (noun / verb / state), length, and the
component page that has the detail.

**Common mistakes.** A slogan, tagline or subtitle that restates the heading · an eyebrow that
names nothing · *we*, *please*, *sorry*, exclamation marks · every row starting with the same
word · *Your projects* (Apple: *Favorites*, not *Your Favorites*) · caps typed into the string ·
two words for one thing (*project* here, *workspace* there) · a generic error under the wrong field.

**Skill.** The copy rule in `scripts/export-skill.mjs` links to this page instead of Grey, and
gains two lines: the word above a heading names its parent; errors name the cause and sit where
it happened.

## Decided here (no sign-off needed; tell me if not)

- **Contractions** stay (*don't*, *can't*), as Polaris and Material 3 and this site's own voice
  do. GOV.UK's worry is misreading negatives in legal text.
- **New issue** stays: the product's own noun after *New* is what Linear and GitHub use.

## Decisions for the owner

1. **Kind and title.** A principle page, *Every line does a job* (proposed), or a separate
   *Writing* section with one page per surface (errors, empty states, confirmations)?
2. **Ellipsis on triggers that open a dialog.** Dialog and Menu follow Apple (*Share…*); Material 3
   says leave it off. Keep Apple's (proposed: it says more input follows, and the site already
   teaches it), or switch?
3. **Placeholders.** Input allows an example (the HTML spec does); GOV.UK bans even that. Keep
   "an example when the format isn't obvious, never the instruction" (proposed), or ban?
4. **Four demos and three text details.** Enough, or more demos (5 and 6 could be dialogs)?
