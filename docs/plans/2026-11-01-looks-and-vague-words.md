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

## 5. The eval goes multi-turn

A case runs as a conversation: the brief, then a follow-up such as "make it more premium". The
walk measures both builds; the look numbers it already takes (hue families, decoration, boxes,
small text) should move the way the table says.

## Order

1. Research the products' published systems (Codex).
2. The brief (3) and the vague-word table (4), with a multi-turn practice round (5).
3. The looks (1) and libraries (2), from the research.
