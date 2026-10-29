# Principle: the lightest boundary that holds

Status: signed off 2026-10-30, all four as proposed: a new principle page; hairlines between repeated rows; a new wording of the owner's global rule for their approval; the three look metrics.

Research: `docs/research/2026-10-29-boundaries.md` (sections cited as §n). Fourth topic of
`docs/plans/2026-10-29-direction-systems.md` ("grouping by space rather than boxes").

## What it owns

*Space groups by ratio* owns the gaps (a gap separates when it's clearly bigger than its
neighbours; a fill outranks a gap). *Card* owns the card (one unit in a set browsed by sight; no
cards in cards). Neither says which boundary a group of content should get, and the eval shows the
agents' default is "section = card", playbook or not (§7: settings builds at 4–6 boxes with the
Skill, 6 without; sign-up worse with it). This page owns that choice.

## Title and summary (draft)

**The lightest boundary that holds.** A heading and space bound a section as fast as a box does.
A line splits repeated rows; a box holds one unit of a set. Boxing every section adds regions and
walls each one off.

## Sections

**The rule**, with the lead demo: a project's settings screen as the agents built it (General,
Access, Danger zone each a card with its own header band and footer band: three regions a
section, §7 ex. 1) against sections bounded by heading and space, rows split by hairlines inside
one group, and the danger zone the one region set apart (§7 ex. 5, b-2). Compare, stacked.

**Details**, three with demos, three as text:

1. *Space is a boundary, not a weaker one* (text). Proximity groups "as fast and efficient as"
   a connected region (Han et al. 1999, §1). Apple's grouped style, Fluent, GOV.UK and Android
   all separate sections with a heading and space (§4, §5).
2. *A box around the wrong things costs* (demo). A project overview's three equal stat tiles
   (§7 ex. 2) against one row of figures in one surface, split by hairlines (b-4's own
   counter-example). Boxes sped search only for real groups of six; around unrelated items they
   made it 14% slower, 4.51 s against 3.95 s (Brumby & Zhuang 2015, §2).
3. *The innermost box wins, and walls its contents off* (demo). A section boxed inside a page:
   its labels pushed in by the box's padding, off the page's left edge, against the same section
   on the page's own edge. Common region "is dominated by the smallest background area" (Palmer
   1992) and blocks grouping across its edge (Vickery 2008, §1). Links to *Space groups by ratio*'s
   one left edge.
4. *Lines are for rows, and lighter than the edge* (demo). A card with a rule under its heading
   and between paragraphs, against rules only between repeated rows, inset to the text, lighter
   than the card's edge. Polaris reserves dividers for tables; Primer, Polaris and Material all
   draw dividers lighter than container borders (measured, §4); Fluent puts a divider above a
   header, never under it.
5. *Every box is one more region to sort* (text). The count of space-separated regions tracked
   rated complexity, r = .5, and the number of text groups carried weight in the model (Reinecke
   et al. 2013, §2). Links to *Grey until it matters*.
6. *An indent claims a parent* (text). Unindented code took 179% longer to read (Morzeck et al.
   2023), but depth had no measurable effect (Bauer et al. 2019); Apple's `goto fail` was two lines
   at one indent (§6). Indent only what belongs to the line above.

**Which boundary** (table): heading and space · a line between repeated rows · an inset or filled
group · a card · a separate surface (dialog, sheet). For each: what it holds, an example, and the
page with the detail.

**When it doesn't apply.** A data table (lines carry the columns) · a set of cards browsed by sight
· a canvas of objects people move.

**Skill.** One line under Floors or Systems: a section is bounded by its heading and space; a line
splits repeated rows; a box holds one unit of a set, never a section, never another box.

## Decisions for the owner

1. **Kind and title.** A new principle page, *The lightest boundary that holds* (proposed), or new
   details added to *Space groups by ratio*?
2. **Dividers inside a card.** Hairlines between repeated rows, as iOS and Primer do (proposed,
   and your own rule), or Polaris's "only in tables"?
3. **Your global rule.** It says "Every section has a visible boundary: a card, or a hairline
   divider inside one card." The sources add a third boundary, a heading and space, and narrow the
   hairline to repeated rows. Update the rule's wording (you edit it, or I propose the text), or
   leave it?
4. **Eval metrics.** Add `boxDepth`, `equalTiles` and `soloBox` to `eval/walks/look.mjs` (§7), so the
   next eval run can see nesting and tile grids? Small, separate from the page.
