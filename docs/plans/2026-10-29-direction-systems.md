# Direction: rules for any product, and a few systems to build in

Status: signed off 2026-10-29, as proposed, one topic at a time. First: the Work tool and Consumer
app systems. They are site pages (text and tables), not Skill-only files, since the Skill is made
from the site; that serves decisions 3 and 4 at once. Then, in order: an Icon page, interface copy,
and grouping by space rather than boxes.

## Why

The agent eval (`docs/plans/2026-10-28-agent-eval.md`) showed three things:

- **What the playbook leaves open, the model fills with its own taste.** Eighteen isolated builds
  came out moss green, most users were "Alex Morgan" and every sign-up product was "Forma".
- **A hard, measurable rule holds; a default with exceptions gets argued around.** Under the 4.5:1
  floor, faint text fell from 0.30–0.68 of characters to under 0.15 in five of six builds. Under
  "plain surfaces, except marketing pages", one sign-up page decided it was a marketing page.
- **The defaults in SKILL.md describe one kind of product.** 13–14px text and grey panels suit a
  tracker, not a shopping app or a reading app.

The owner's decision (2026-10-29): the playbook serves consumer and business products alike, fixes
no brand colour or typeface, and offers norms, best practices, and a few common design systems:
both our own, by product type, and the key rules of the public ones.

## Three layers

1. **Floor.** Holds on every product and in every system, and a brief can't lower it. Only rules
   that can be measured: text contrast (WCAG 2.2 1.4.3), non-text contrast (1.4.11), target size
   (2.5.8), focus visible and not obscured (2.4.7, 2.4.11), reflow at 320px (1.4.10).
2. **Practices.** The component and principle pages, as now: each gives its rule, the reason and
   where it gives way, and none fixes a look. Where a number depends on the kind of product (body
   size, density, how much colour), the page gives the range and says which system takes which end.
3. **Systems.** A complete look for one kind of product. Each fills what the practices leave open:
   type scale, control height and density, the grey ramp, how much colour and where, radius,
   shadow, motion, the voice of the copy. **Brand colour and typeface are slots**: the brief fills
   them, or the agent picks; the system says how much of the brand colour appears and where.

## Our systems (draft)

| System | For | Near | Notes |
|---|---|---|---|
| Work tool | Trackers, admin, editors, settings: B2B and productivity | Linear, macOS; Fluent 2, Carbon, Primer, Polaris | The site's own Precision. Today's SKILL.md defaults move here. In practice: Track. |
| Consumer app | Social, commerce, personal apps | iOS (HIG), Material 3 | Larger text and targets, more colour in content and brand moments, illustration in onboarding and empty states. In practice: Post. |
| Reading | News, docs, long articles | — | Body size and measure from Set reading text for the reader; the type does the work, chrome recedes. |
| Marketing | Landing and launch pages | — | Brand expression is the job; imagery and large type. The floor still holds. |

A sign-up or settings screen takes the system of the product it belongs to. That settles the case
of the sign-up page that turned itself into a marketing page.

Each system's numbers come from the public systems it is near, cited to their own docs. The numbers
that come to mind (HIG body 17pt and 44pt targets; Material 3 body large 16sp and 48dp targets;
Fluent 2, Carbon and Primer body 14px) are leads to confirm against the sources, not yet facts.

## Public systems (draft)

One reference per public system: where it applies, its type scale and density, its colour roles,
the components that differ from the playbook's and why, with links to its own pages. The agent uses
it when the brief names the platform or the system (an Android app → Material 3; an app inside
Microsoft 365 → Fluent 2; a Shopify admin extension → Polaris).

First four, by how often a brief would name them: Apple HIG, Material 3, Fluent 2, Carbon. Primer
and Polaris after.

## What changes

- **SKILL.md.** Floor first. Then a new first step: pick the system from the brief (by product
  type, or the public system its platform names) and read it. Then the steps as now. Today's three
  defaults move into the Work tool system.
- **Site.** A Systems section beside Components and Principles: one page per system, ours and
  public. Ours show the same real content (a list, a form, an empty state) built in each, so the
  difference is visible; Track and Post link to theirs.
- **Eval.** Briefs stay unconstrained: no system, colour or name given. A build passes the system
  check if it picked the system the product calls for and met that system's numbers. One consumer
  task joins the eight so the Consumer app system gets tested.
- **Every build that looks wrong is a finding.** When the owner finds a build unpleasant, name
  what the playbook didn't say, or said too softly, and fix the page or system that should have
  said it. The pilot's sign-up page, with its eyebrows and slogans, is how the copy rule was found.

## Decisions for the owner

1. Are the four systems the right set? For example, is a dense data dashboard its own system or
   part of Work tool?
2. Are Apple HIG, Material 3, Fluent 2 and Carbon the right first public systems?
3. Order: SKILL.md and system references first, measured by the eval, then site pages? (Proposed:
   yes, since the Skill is cheap to change and the eval tells us whether it works.)
4. On the site, do our systems start as text pages with tables, with live specimens later?
