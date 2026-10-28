# Principle: how much colour, and what decoration costs

Status: plan, awaiting the owner's sign-off on the decisions at the end.

## Why

In the agent eval's pilot (`docs/plans/2026-10-28-agent-eval.md`), both arms built busy screens.
The sign-up page gave half its width to an illustration, slogans and an invented brand. The tracker
gave every label chip its own hue and tinted the sidebar. The Skill didn't hold this back because no
page says it. `lightness-first` covers how to choose a colour, and `colour-means-one-thing` says each
colour has one meaning. Neither covers how much colour a screen should carry, or what decoration
costs.

Research: `docs/research/2026-10-28-colour-amount-and-decoration.md` (sections cited as §n).

## The rule (draft)

**Grey carries the screen; colour is kept for what someone has to notice.** Every extra hue in the
chrome is one more thing the eye checks before it finds the one that matters. Decoration is anything
whose words or picture could be swapped for others without changing what it's for.

## What makes it more than "use colour sparingly"

1. **Variety hides the unexpected, not the known** (§1). People looking for "the red Bug chip" barely
   slow down with eight hues on screen: "variety count had almost no impact" (Haroz & Whitney 2012).
   Noticing something nobody told you to look for, such as the overdue issue, the error, or the one
   accent, gets slower and less accurate as hues are added at random. Colour carries about seven
   categories before outlier search breaks (Giovannangeli et al. 2021). Grouping by colour wins most
   of the cost back. A word or glyph beside the colour makes the target immune to variety.
   Mechanism: Duncan & Humphreys 1989, restated in Guided Search 6.0 (Wolfe 2021).
2. **Decoration has a definition** (§7). WCAG's "pure decoration" provides "no information" and
   "Text is only purely decorative if the words can be rearranged or substituted without changing
   their purpose". "Big ideas. Beautiful beginnings." passes that test. This gives a usable test:
   if a screen-reader user loses nothing when it's skipped, sighted users pay for it in attention
   and space only.
3. **Skipped decoration still costs** (§4, §2). A graphic the eye avoids still slows the task
   (Burke et al. 2005: 2,169 vs 2,040 ms against a grey box of the same size, about 6%). Interesting
   but irrelevant additions pull time toward themselves (seductive details: Harp & Mayer 1998,
   Kienitz 2023; small, g ≈ −0.16 in Wu et al. 2026). The page states these at their size: small,
   real, and paid on every visit.
4. **The honest counterweight** (§3, §8). The 50 ms first impression is driven by visual complexity
   far more than colour (Reinecke et al. 2013: complexity d = 2.0; colourfulness peaks mid-scale,
   d = 0.3–0.8). Beauty raising usability has been "overplayed" (Hassenzahl & Monk 2010), with no
   performance effect at N = 331 (Thielsch et al. 2019). Decorative pictures do lift mood and lower
   perceived difficulty (Lenzner 2013). So the page doesn't say colour is ugly. It says where
   colour and decoration pay (the impression, the welcome) and where they don't (the working
   surface).
5. **Current practice agrees and names the cost** (§9). Apple's HIG: brand colour used too broadly
   can "dilute its impact"; "Ensure branding always defers to content." Fluent, Carbon, Atlassian
   and Primer: neutrals carry surfaces, hue is for action, status and meaning. Linear's March 2026
   refresh is the eval's fix shipped: a sidebar "a few notches dimmer", and it "removes unnecessary
   visual treatments like colored team icon backgrounds", under "Don't compete for attention you
   haven't earned". No system gives a ratio, so no 60-30-10.

## Sections and demos

Each demo pair varies one thing.

- **The rule.** Lead demo: the same 20-row tracker with one overdue issue in the accent.
  - Avoid: every label chip filled in its own hue.
  - Prefer: chips in one neutral fill, the label's colour as a small dot.
  - The caption carries the task, "Which issue is overdue?", and the Haroz & Whitney result.
- **Details.**
  - *A named target survives, a surprise doesn't.* Prose and numbers (§1). No second demo: the lead
    demo already is this.
  - *Group it or word it.* Grouping by label, or a word beside the colour, removes the cost (§1).
    Short; it points to `colour-means-one-thing` for the word.
  - *What counts as decoration.* The WCAG definition and the swap test (§7). Demo: the same sign-up
    form.
    - Avoid: half the width given to an illustration, a slogan and an eyebrow line.
    - Prefer: the form alone, with the product's name and one line that says what the account is for.
  - *Skipping it isn't free.* Burke's 6% and seductive details, at their size (§2, §4).
  - *A big tint is a colour too.* A large panel in the accent's hue family is one more distractor
    beside every accent mark (§6, stated as inference). Material's own default surface is lavender
    `#f3edf7`; a tool that takes the defaults gets a tinted screen without choosing one. Short, no
    demo.
- **When it doesn't apply.**
  - Content: a chart's categories, label colours someone picked (shown as a dot), photos. This
    already appears in `colour-means-one-thing`; link it rather than repeat it.
  - Moments whose job is the impression: a welcome screen, an empty state, a marketing page. One per
    flow, never beside the form (§8).
  - First impressions: a fairly colourful page is liked best (Reinecke & Gajos 2014). The page is
    about working surfaces.
- **Where the playbook applies it.** Track and Post: grey chrome, the accent only on the primary
  action and selection, status as icons. Check each claim against the built apps before writing it.

## In the eval

New measured checks in `eval/walk.mjs`, each tied to this page. Thresholds start uncalibrated and get
set against the owner's blind picks.

- Hue families among chrome elements (DOM computed colours, OKLCH C ≥ 0.03, outside content and
  photos). Flag more than 2: the accent and danger.
- Area of the first screen under tinted surfaces (C > 0.008).
- Area of the first screen under decoration: `alt=""`, `aria-hidden`, `role="presentation"`, CSS
  background images.

The brief footer's "as you would ship it" may also invite polish. It's the same for both arms, so it
stays. If the re-run pilot still shows heavy decoration in arm B, the cause is the Skill's wording,
not the brief.

## Steps

1. Write the page: one MDX file plus one demo component per pair, in their own folder.
2. Before showing it, check its own measurements: one left edge, the demos inside their stage, and
   both themes.
3. Deploy. The Skill export picks the page up on its own.
4. Add the three checks to the walk and re-walk the 12 pilot builds, so the old numbers exist.
5. Re-run the pilot: 12 builds with the new Skill.
6. Compare arm B before and after on the three checks. Then the owner picks the new pairs.

## Decisions for the owner

1. **Title.** (a) *Grey until it matters* (recommended: says the rule in four words, sits beside
   *Colour means one thing*); (b) *Colour is for noticing*; (c) *Decoration costs attention*.
2. **One page or two.** (a) One page covering colour amount and decoration together (recommended:
   the eval's failure was both at once, and the swap test and the hue cost share one argument,
   attention spent on what isn't the task); (b) two pages, with decoration as its own principle.
3. **Lead demo.** (a) The tracker's overdue issue among hued chips (recommended: it's the
   counterintuitive part, and the task comes from the content); (b) the sign-up form with and
   without the illustration (more obvious, less surprising).
