# Task: what each product publishes about its design system

Research only. Change no code, no page and no component. The deliverables are two new files:

- `docs/research/2026-11-01-product-design-systems.md`
- `docs/research/2026-11-01-product-design-systems.json`

## Why

The Skill will offer "looks": whole token sets an agent builds to, some after real products
(plan: `docs/plans/2026-11-01-looks-and-vague-words.md`). The owner's condition: every value is
one the product itself publishes. A look is shipped only from what is published; nothing is
guessed.

## What counts as a source

- **Allowed:** the product's design-system site, its official token or component package (its
  source in the company's own repository), its official brand guidelines, its own engineering or
  design posts, its official developer docs (for example Raycast's extension UI guidelines).
- **Not allowed:** values read off screenshots, computed styles or the product's CSS bundle;
  third-party write-ups, "X-inspired" kits, Dribbble, clones; your memory. If a value isn't in an
  allowed source you opened and read, it's a gap.
- Cite each value with the URL (and for a repository, the file path at a commit or tag) where it
  appears. Quote at most a line where the wording matters.

## Products, in this order

1. Apple: Human Interface Guidelines, iOS and macOS (system colours light and dark, text styles,
   materials, corner radius guidance, motion guidance).
2. Linear: anything Linear has published about its interface, theme generation and colours.
3. Claude / Anthropic: brand guidelines, and Anthropic's own published skills or docs that state
   brand colours and type (for example the `brand-guidelines` skill in the `anthropics/skills`
   repository, if present).
4. Vercel: Geist (vercel.com/geist and the `geist` font repository).
5. GitHub: Primer (`primer/primitives`).
6. Google: Material Design 3.
7. Microsoft: Fluent 2.
8. Stripe: whatever Stripe publishes (Stripe Apps UI toolkit and design guidelines, brand pages).
9. Notion: whatever Notion publishes.
10. Raycast: its published extension or API UI guidelines.
11. Atlassian Design System.
12. Ant Design 5 (design tokens).
13. TDesign (Tencent).
14. Arco Design (ByteDance).

`docs/research/2026-10-29-design-system-numbers.md` already holds sizes and targets for Apple,
Material 3, Fluent 2, Carbon, Primer and Polaris: link to it rather than redo those numbers.

## For each product, record

- **Status:** full system published / partial / brand only / nothing found. One line on what
  exists.
- **Colour:** neutral ramp, one accent, status colours (success, warning, danger, info), each in
  light and dark, as published (hex, or the published space such as LCH or OKLCH).
- **Type:** typeface and fallback, and the licence terms for using it on the web (open licence,
  platform-only, paid). Sizes, weights and line heights of the text styles.
- **Shape and space:** radius steps, spacing scale, control heights.
- **Elevation:** shadow values or the elevation model.
- **Motion:** durations and easing curves.
- **Icons:** the icon set and its licence.
- **Terms:** any stated restriction on reusing the tokens, names or brand.
- **Gaps:** each field above the product doesn't publish.

Leave a field empty and list it under Gaps rather than fill it with a likely value.

## Deliverables

- The `.md`: a summary table (product × status × which fields are published), then one section
  per product with values and citations, then **Not verified**: anything you looked for and
  couldn't open or confirm.
- The `.json`: one object per product with the same fields, every value carrying its `source` URL.
  Gaps are `null`.

## Acceptance

- Every value in the JSON has a source URL from the allowed list.
- Every product has a status and a gaps list.
- Font licence is stated for each typeface.
- No file outside the two deliverables changes. No `pnpm verify` needed.

## Report

The final message lists: products with enough published for a whole look (colour, type, radius,
shadow, motion), products with partial systems and what each lacks, and anything uncertain.
