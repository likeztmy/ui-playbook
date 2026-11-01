# Plan: looks, a design brief, and what vague words mean

Status: directions agreed by the owner on 2026-11-01; the research is out to Codex.

## Why

Round 1 (see [real cases](2026-10-31-real-cases.md)) shows the Skill lifts the floors (contrast,
targets, panes) but leaves the look to the agent: Codex picks faint greys, Claude picks a safe
plain screen. People don't build in one shot either. They build, look, and say "make it nicer",
"smoother", "more premium", words an agent can't act on.

## 1. Looks

A look is a whole set of tokens an agent can build to: neutrals and accent in light and dark,
status colours, typefaces with sizes, weights and line heights, radius, spacing, shadow, motion
and control heights. The Skill ships two kinds:

- **Ours:** the site's five palettes ([palettes](../research/2026-10-27-palettes.md)), each made
  whole with type, radius, shadow and motion.
- **Products':** taken only from what each product publishes: its design-system site, its token
  package, its brand guidelines, its own posts about its design. Nothing inferred from screenshots
  or computed styles; what a product doesn't publish stays a gap, written as one. Candidates:
  Apple (HIG), Linear, Claude, Vercel (Geist), GitHub (Primer), Google (Material 3), Microsoft
  (Fluent 2), Stripe, Notion, Raycast, Atlassian, Ant Design, TDesign, Arco. The research decides
  which have enough published to ship.

Fonts follow their licences: SF Pro, for one, is licensed for Apple platforms, so an Apple look on
the web uses the system font stack.

**Decided 2026-11-01:** a product that publishes part of its system still gets a look. What it
publishes is used as published; what it doesn't is filled from the playbook, and the look marks
each token's source (the product's page, or Playbook). The research is
[product design systems](../research/2026-11-01-product-design-systems.md), audited: 22 values
checked against their sources, all found.

| Look | From the product | Filled from the playbook |
| --- | --- | --- |
| Primer, Fluent 2, TDesign, Arco, Atlassian | colour, type, radius, shadow, motion | fonts whose web licence is unverified fall back to the system stack |
| Material 3 | the same | success, warning and info |
| Ant Design | the same; dark from its published dark algorithm | |
| Apple | system colours light and dark, text styles (system font stack) | radius, spacing, shadow, motion, status mapping |
| Linear | brand neutrals, Inter and Inter Display, its LCH theme approach | the rest |
| Claude | the brand palette, Poppins and Lora | the rest |
| Vercel | Geist fonts, radii by material | colours, motion |
| Stripe | spacing | the rest (its radii appear only in example CSS) |

Notion and Raycast get none: they publish too little that's visual, so the look would be almost
all ours under their name. Ours are the site's own palettes, made whole the same way.

Each look is one reference page: its tokens in a table with a Source column, a `:root` block for
light and dark ready to paste, and its font licence. It is named "after" the product, and a look
never carries the product's logo or wordmark.

## 2. Component libraries

The project's own library wins. With none, the agent asks which to use, offering Base UI and
shadcn/ui first; when it can't ask, it uses shadcn/ui and says so.

## 3. A design brief before code

Step 2 of the Skill becomes a short brief: who it's for, phone or desktop, how dense, which look,
which component library, and the product it should feel like. The agent asks only what would
change the whole design, three questions at most; when it can't ask, it writes its assumptions and
builds on them.

## 4. What vague words mean

A table in SKILL.md: each word people use for the look ("nicer", "premium", "smoother", "cleaner",
"more lively", and their Chinese) turned into changes that can be checked, each from a playbook
page that already argues it. A word about the whole look ("premium") gets two or three directions
built on the same content to pick from, not a guess.

### Draft table

The words are matched in English and Chinese; the rule is written once, in English.

| Asked for | What it means | From |
| --- | --- | --- |
| nicer, better looking (好看、漂亮) | Check the floors and the moments first: one left edge per kind, gaps by ratio, text at 4.5:1, one icon set. Most of "not nice" is one of these. | space-groups-by-ratio, the-lightest-boundary-that-holds, lightness-first, component-icon |
| premium, classy, refined (高级、有质感、精致) | Fewer things, each saying more: grey surfaces and one accent; hierarchy from weight and space, not more sizes or colours; no gradient, glow, emoji or ornament; boundaries one step lighter or gone. A word about the whole look: build two or three directions on the same content and let them pick. | grey-until-it-matters, every-line-does-a-job, the-lightest-boundary-that-holds |
| smoother, snappier (丝滑、流畅、顺滑) | Answer at once and never make them wait for the animation: what repeats is about 120 ms and takes the next press; an animation turns from where it is; nothing shifts under the pointer; the result shows before the server answers when the action rarely fails and undoes cheaply. | attention-wears-off-waiting-doesnt, never-too-busy-to-listen, nothing-shifts, how-waiting-feels |
| cleaner, simpler (简洁、干净、清爽) | Take away before restyling: lines that do no job, a box per section, a second accent. Group by space first, then a line, a box last. | every-line-does-a-job, the-lightest-boundary-that-holds |
| livelier, younger (活泼、年轻、有活力) | The consumer system: colour may enter the content, larger targets and radius, a spring on what's picked up and thrown. Art only when the brief supplies it. | system-consumer-app, colour-means-one-thing, never-too-busy-to-listen |
| more professional, serious (专业、稳重) | The work-tool system: 14 px text, 32 px controls, denser rows, grey surfaces, one accent, numbers on the right. | system-work-tool, component-table |

No page argues these yet, so they stay out until one does: a time limit for "at once" (the
100 ms usually quoted), and animating only `transform` and `opacity`.

## 5. The eval goes multi-turn

A case runs as a conversation: the brief, then a follow-up such as "make it more premium". The
walk measures both builds; the look numbers it already takes (hue families, decoration, boxes,
small text) should move the way the table says.

## Order

1. Research the products' published systems (Codex).
2. The brief (3) and the vague-word table (4), with a multi-turn practice round (5).
3. The looks (1) and libraries (2), from the research.
