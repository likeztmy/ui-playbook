# Rule review 2: principles, part 1b

Routes: `/principles/every-line-does-a-job`, `/principles/grey-until-it-matters`, `/principles/hover-forgives`,
`/principles/how-waiting-feels`.

Method: `.claude/agents/ui-rule-review.md`. Decisions in `../decisions.md` are binding. Reviewed 2026-11-03 against the
dev server through `pnpm shoot` only. Each reference's source is `src/pages/principles/<slug>.mdx`.

Shots: `shots/review2/principles-1b/<slug>-<1280|375>-<light|dark>.png`; crops are `x-*.png`.

Written route by route; the combined findings table and the shared ledger are at the end.

## Route 1: `/principles/every-line-does-a-job`

Shots: `every-line-does-a-job-{1280,375}-{light,dark}.png`, all four looked at whole; Prefer stages cropped at 2×
(`x-every-line-fig4-light.png`, `x-every-line-fig6-dark.png`, `x-every-line-fig8-light.png`,
`x-every-line-lead-375-dark.png`). Probe (every text node in `main`, 1280 and 375, both themes): no sideways scroll,
no text under 4.5:1; under 12px only the two Avoid eyebrows ("Make it happen", "Issue details", 11px), which are the
mistake each Avoid shows. "Words by place" fits 343px at 375 (scrollWidth = clientWidth = 343); list markers inside the
gutter (ul at 16, li text at 36).

### Findings

| severity | where | rule | evidence | fix |
| --- | --- | --- | --- | --- |
| nit | "Three lines before the first field / The task, then the field" (`src/demos/copy/Lead.tsx:7-15`, stage centres its content) | Owner's rule: one grid; the Avoid note: "each is read before the Title field it pushes down" | Both panels are centred in a 420 stage, so the Avoid's Title input sits at y 726 against the Prefer's 698: the 56px push the note describes shows as 28. | Top-align both panels in their stages (same top inset), so the Title fields differ by the full height of the three lines. |

No must or should on this route.

### Ledger

- The rule (every line names a thing, an action or a state) / Avoid: Three lines before the first field / Prefer: The
  task, then the field: **pass**. Prefer heading "New issue" repeats the opening button's words; Cancel + one primary
  "Create issue". Avoid shows eyebrow, slogan title and sub-line only. Alignment nit.
- The first two words carry the line / Avoid: Every row starts "Manage" / Prefer: The word that differs first:
  **pass**. Labels on one left edge with the "Workspace" heading (both 8px inset); meta right-aligned in one column,
  `ink-muted` 13px, tabular (`x-every-line-fig4-light.png`).
- A slogan costs the task: **n/a** (prose).
- The line above a heading names its parent / Avoid: An eyebrow / Prefer: Where it sits: **pass**. Prefer caption is
  sentence case, `ink-muted`, 13px, status icon + "In progress · ORB-142" (C4). The status icon is shape-only and stands
  beside its word (C9). C35 (in-progress takes `info`) is about a badge tone; the Track mark is shape-only grey by its
  own stated rule (`src/demos/track/icons.module.scss:1`), so **n/a**.
- An error says what failed, where it failed / Avoid: Under the terms box / Prefer: With the action that failed:
  **pass**. Prefer message names what failed, why and the next step, no please/sorry; it sits 16px above the button and
  24px below the checkbox, so it groups with the button (space groups by ratio). Danger ink with a Lucide icon at 14.
- A specific verb lets people skip the question: **pass**: every button on the page's stages names its result
  (Create issue, Create account); Cancel is the dismiss.
- A confirmation stops being read the second time: **n/a**: no confirmation on the page.
- Sentence case: **pass** for every Prefer string. The Avoid eyebrows are `text-transform: uppercase` over
  sentence-case strings, as the rule asks a capitals label to be built.
- Words by place table, every row: **pass** where it shows on the page (heading, line above a heading, button, field
  label, error); the rest **n/a** here (no menu, hint, placeholder, empty state, toast or confirmation on a stage).
- Across all of them: no we/please/sorry/oops/exclamation in Prefer copy **pass**; no "Your" **pass**; one word for one
  thing **pass**; contractions **pass**.
- When it doesn't apply: **n/a**.
- C5 at 375 (Avoid / Prefer switch, Prefer first, verdict in the caption): **pass** (`x-every-line-lead-375-dark.png`).
- component-button, component-input (TextField), component-checkbox in the stages: **pass**: library parts, field labels
  above, 32px fields.
