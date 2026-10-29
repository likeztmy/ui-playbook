# Interface copy: why tool text is short, plain and literal, and what an eyebrow costs

Research for the new principle page on **interface copy**: the words inside a product's UI. That means button and menu labels, headings, field labels and hints, empty states, error messages, confirmations, toasts and tooltips.

The page has two jobs:
- stop agents writing marketing copy inside tools (slogans, uppercase eyebrows above headings, taglines, "Welcome back! Let's get you set up");
- teach the positive craft of short UI text.

This file collects the mechanisms and numbers behind it, from primary sources only.

Not repeated here:
- Icon-only vs labelled controls, and symbol characters as names, are in `2026-10-29-icons.md` §1, §2 and §5. §10 below only cross-references them.
- The WCAG / WAI definition of decoration ("pure decoration") is in `2026-10-28-colour-amount-and-decoration.md` §7.
- Contrast of placeholder and hint text is a colour question. See `2026-10-27-colour-system.md` and the Skill's 4.5:1 floor.

**Labels.**
- **Verified**: read in the primary source this session (2026-10-29). That's full text where the page or PDF was read, or the abstract (OpenAlex, PubMed, the publisher's page) where marked "abstract". It also covers a design system's own page or docs source.
- **Secondary**: known only from a citing page or a search snippet.
- **Unverified**: from memory or inference. Keep these off pages.
- **Measured**: read from a source repo, a code search or the eval outputs on 2026-10-29. The path is given.
- **Computed**: worked out here, with the method stated.

Access notes:
- Apple HIG pages render client-side, so they were read from their JSON source (`developer.apple.com/tutorials/data/design/human-interface-guidelines/<page>.json`).
- m3.material.io and fluent2.microsoft.design were read in a real browser.
- Primer, Carbon and Polaris were read from their docs repos (`primer/design`, `carbon-design-system/carbon-website`, `Shopify/polaris`).
- GOV.UK's writing guidance has moved to `guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/`, and the old gov.uk URLs 301 there.
- Throwaway scripts are in the session scratchpad (`copy/oa.py` fetches OpenAlex abstracts, `copy/hig.py` flattens HIG JSON, `copy/pdftxt.py` pulls text out of a PDF). They aren't part of the repo.

---

## 0. What the playbook already says, and what's new

**Existing `## Copy` sections** (`src/pages/components/*.mdx`, one line each):
- **Badge**: one or two words, sentence case. States are adjectives or past participles (*Failed*), not verbs.
- **Button**: a verb that names the result (*Save changes*, not *OK*/*Submit*), in sentence case. It matches the dialog's title.
- **Card**: the title is the thing's own name. The subtitle is the one fact that helps choose between cards (*Edited 2 hours ago*).
- **Checkbox**: the label says what's true when checked, with no full stop. The description gives the consequence.
- **Combobox**: the label says what's chosen, and the placeholder says what you can type. The empty state repeats the query and gives a next step.
- **Dialog**: the title is the decision, specific (*Delete "Q4 roadmap"?*), never *Are you sure?*. The buttons are *Cancel* plus a verb. The trigger ends in an ellipsis.
- **Icon**: the tooltip and `aria-label` are the same words, naming the action. A decorative icon says nothing.
- **Input**: the label is a noun with no colon. The placeholder is an example, not an instruction. The error says what to do, never *Invalid input*.
- **Menu**: commands are verbs and choices are values. An ellipsis means more input follows. Sentence case "unlike Apple's title case". One grammatical form per menu.
- **Popover**: the title matches its trigger, the description is one sentence of consequence, and the action is a verb.
- **Radio**: the group label says what's chosen. Options are parallel. The description says what the choice means.
- **Segmented control**: nouns of similar length. Icon segments use the same nouns as tooltips.
- **Select**: the label is a noun, options are parallel, and the placeholder is *Choose a reason*, not *Select…*.
- **Sheet**: the title is what the screen behind would call it. A way back names where it goes.
- **Slider**: the label is the property. The value carries its unit.
- **Switch**: the label is the setting, never the state (*Grid on*). The description says what *on* means.
- **Table**: short noun headers. Units go in the cells when scales mix, and an en dash fills an empty cell.
- **Tabs**: one- or two-word nouns, parallel.
- **Toast**: past tense with the object (*Deleted "Q4 roadmap"*). Failures give the cause. The action is one verb.
- **Toolbar / Tooltip**: the name equals the `aria-label` word for word, with the shortcut after it.
- `pilot/button.mdx` repeats Button.

**The Skill's current copy rule** (`scripts/export-skill.mjs`, lines 139–142):
- Every line of copy names a thing, an action or a state.
- A line that could be swapped for any other and do the same job ("an eyebrow, a tagline under a title or a section's subtitle") belongs on a marketing page. It links to *Grey until it matters*.

**What no page owns yet (what this page adds):**
- tone in a tool versus a marketing site;
- page and section headings;
- capitalisation as a rule with its evidence, including ALL CAPS;
- error-message anatomy beyond one input example;
- empty-state copy beyond the combobox;
- the habituation cost of confirmations;
- placeholder-versus-hint policy;
- length and reading level;
- *please*, *we*, *sorry*, exclamation marks;
- one term per thing across a product;
- when an eyebrow is legitimate.

**Conflicts with existing pages that the new page must settle (details in the sections below):**
- **Ellipsis on triggers.** Dialog and Menu follow Apple, but Material 3 says to omit ellipses from buttons and menu items that open a dialog (§2).
- **Placeholder as an example.** Input follows the HTML spec, but GOV.UK says not even for examples (§8).
- **The "swap test" in the Skill** has no source. It's our own authoring rule. The sources below back it from three sides: Morkes & Nielsen on promotional text, Polaris on subcopy, and the GOV.UK caption as the legitimate eyebrow.

**Eval evidence (measured).**
- An element with class `eyebrow` appears in 6 of 6 A-side (without the Skill) and 13 of 14 B-side (with the Skill) `src/App.tsx` files under `/Users/polar/code/ui-playbook-eval-runs/`. The count is `grep -l eyebrow`.
- **Caveat:** the runs are dated 2026-10-28, but `scripts/export-skill.mjs` was last modified 2026-10-29 17:59. The B runs may predate the current eyebrow sentence. Don't claim the current rule failed until a re-run.

---

## 1. How people read UI text: the first two words of each line, then the left edge

- **Mechanism.** People scan for the next thing to act on. They don't read prose, and on a list they take in roughly the first two words of each line.
  - With no strong cues, the eye falls into an F shape: the top lines, then down the left edge.
  - Lines that all start with the same word get their first words skipped.
  - The opening words of a heading, label or row carry nearly all of what's read. A word placed *above* the heading, like an eyebrow, sits in the most-read spot. If it carries nothing, the reader pays for that.
- **Classic.**
  - Nielsen, *How Users Read on the Web*, NN/g, 1997-09-30 (https://www.nngroup.com/articles/how-users-read-on-the-web/, **verified**): "79 percent of our test users always scanned"; "only 16 percent read word-by-word". The page gives no sample size or method.
  - Nielsen, *F-Shaped Pattern For Reading Web Content*, NN/g, 2006-04-16 (https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content-discovered/, **verified**). It eyetracked 232 users across thousands of pages and calls the F "a rough, general shape". Readers see the first two words of a line far more than the third.
  - Nielsen, *First 2 Words: A Signal for the Scanning Eye*, NN/g, 2009-04-06 (https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/, **verified**).
    - The study had 80 participants and 20 links from 20 sites, each truncated to its first 11 characters.
    - "Users typically see about 2 words for most list items".
    - For 35% of links, users seeing only the first 11 characters had no idea where the link went.
    - Best: Ann Taylor's "Gift Cards " (85% predicted it, and 100% picked it among distractors). Worst: Chase's "Introducing" (15% picked it).
    - The 11 characters were a test choice, not a measured span.
- **Recent.**
  - Pernice, *F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant*, NN/g, 2017-11-12, reviewed 2026-08-19 (https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/, **verified**). Named patterns:
    - **layer-cake**: "eyes scan headings and subheadings and skip the normal text below";
    - **spotted**: skipping big chunks while looking for something specific;
    - **marking**: eyes stay in one place while the page scrolls;
    - **bypassing**: occurs "when multiple lines of text in a list start all with the same word(s)", and readers skip those words;
    - **commitment**: fixating on almost everything.
    - The F is the default "when there are no strong cues to attract the eyes towards meaningful information". The advice is to "Start headings and subheadings with the words carrying most information."
  - Pernice, *Text Scanning Patterns: Eyetracking Evidence*, NN/g, 2019-08-25 (https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/, **verified**). Spotted reading lands on words that "visually stand out" (links, bold, bullets) or resemble the target, such as digits when you're after a number. It gives no full method.
- **How much text gets read.**
  - Weinreich, Obendorf, Herder & Mayer, *Not Quite the Average: An Empirical Study of Web Use*, ACM Transactions on the Web 2(1), 2008, doi:10.1145/1326561.1326566 (**verified, abstract**). It was a long-term client-side study of 25 participants: "Web browsing is a rapid activity even for pages with substantial content". The abstract gives no percent-read figure.
  - Nielsen, *How Little Do Users Read?*, NN/g, 2008 (https://www.nngroup.com/articles/how-little-do-users-read/, **verified**). This is Nielsen's analysis of the Weinreich data:
    - 45,237 page views after filtering 59,573.
    - Visit time ≈ 25 s + 4.4 s per 100 words, at an assumed 250 words a minute.
    - The average page had 593 words. Users "have time to read at most 28%" of the words, and "20% is more likely".
    - **Caveat:** 20–28% is an upper bound from dwell time and an assumed reading speed. It isn't a measured share of words read.
  - GOV.UK, *Create a clear structure for your content* (guidance.publishing.service.gov.uk, **verified**). It repeats this as "most people will … only read 20 to 28% of text on a webpage", without the derivation.
- **Systems.**
  - Material 3, *Style guide › UX writing best practices* (**verified**): "People scan UI text in search of the most meaningful content to them."
  - GOV.UK clear structure (**verified**): headings should be "frontloaded" and not "be questions – they're hard to frontload".
  - Apple HIG, *Writing* (**verified**): "put the most important information first."
- **Implications for the page.**
  - Put the distinguishing word first: *Delete project*, *Export as CSV*, *Members*.
  - In a list or menu, don't start every row with the same word (*Manage members / Manage billing / Manage roles*; *Your projects / Your issues*). Readers bypass the shared word, so it's dead weight on every row.
  - An eyebrow above an H1 gets the first fixation. A slogan there (*A LITTLE PROGRESS, EVERY DAY* over *Issues*) spends the most-read line on nothing. This is **inference** from the F and first-two-words findings; no study tested eyebrows.

## 2. Button and action labels: name the result, but know when a specific verb lets people skip reading

- **Mechanism.** A specific label lets people answer without reading the rest. That's the point for routine actions, and a risk for confirmations. "OK" is ambiguous: does it mean "do it" or "I understand"? A verb plus its object names the outcome, so the button reads correctly out of context (in a screen reader's control list, or in voice control).
- **Systems.**
  - **Apple HIG, *Alerts*** (JSON source, **verified**).
    - "Aim for a one- or two-word title that describes the result of selecting the button."
    - "Avoid using OK as the default button title unless the alert is purely informational."
    - On OK's ambiguity: "OK, I want to complete the action" or "OK, I now understand the negative results".
    - "Always use 'Cancel'" for the cancelling button. Button titles use title-style capitalization with no ending punctuation.
    - **Counterintuitive:** use the destructive style for "a destructive action people didn't deliberately choose". When people pick *Empty Trash* themselves, the confirming *Empty Trash* button is *not* styled destructive, because it "performs the person's original intent".
    - "If you want to encourage people to read an alert … avoid making any button the default button."
  - **Apple HIG, *Writing*** (**verified**): "it's almost always best to use a verb"; "just saying 'Send' often works better than 'Let's do it!'"
  - **Apple HIG, *Menus*** (**verified**): "Remove articles like a, an, and the from menu-item labels". Append an ellipsis "when the action requires more information before it can complete".
  - **Material 3, *Dialogs › Guidelines*** (browser, **verified**): a full-screen dialog's confirmation "should be clear about what happens next, like Send or Create. Avoid using vague terms like Done, OK, or Close."
  - **Material 3, *Style guide › Grammar and punctuation*** (**verified**): "Omit ellipses from menu items or buttons that open a dialog or start a process." This directly contradicts Apple and our Dialog and Menu pages.
  - **Polaris, *Empty state › Content guidelines*** (`Shopify/polaris`, **verified**).
    - Use "the {verb}+{noun} format on buttons except in the case of common actions like Save, Close, Cancel, or OK".
    - *Create order* is a Do and *New order* a Don't. *Add menu item* is a Do and *Add a menu item* a Don't.
  - **Primer, *Content*** (`primer/design`, `content/foundations/content.mdx`, **verified**).
    - Action labels "should start with an imperative verb", but they "can be shortened to only include an adjective and a noun", as in *New issue*.
    - This conflicts with Polaris's *New order* Don't.
  - **Carbon, *Action labels*** (`carbon-website/src/data/guidelines/glossary.js`, **measured**: 65 defined entries). For *OK*: "Use OK only when such a label is not available."
- **The counterpoint (Microsoft, Windows UX guidelines).** *Confirmations*, Windows 7 era, page updated 2025-07-24 (https://learn.microsoft.com/en-us/windows/win32/uxguide/mess-confirm, **verified**).
  - Specific commit buttons let "users … read a minimum amount of text to proceed", which is "counterproductive for confirmations". Right after the user chose *Uninstall*, an *Uninstall* button gets clicked "without giving it a second thought".
  - The fix is to add "anyway" (*Uninstall anyway*), or to use Yes/No, which "forces users to at least read the main instruction".
  - "Never use OK and Cancel for confirmations."
- **Measured effect of wording on clicks.**
  - Böhme & Köpsell, *Trained to accept? A field experiment on consent dialogs*, CHI 2010, doi:10.1145/1753326.1753689 (**verified, abstract**). A consent dialog in 2 × 2 × 3 variations was shown to 80,000 users of a privacy tool.
    - Polite requests and button texts "pointing to a voluntary decision decrease the probability of consent". That's the opposite of the social-psychology prediction.
    - People "blindly accept terms the more their presentation resembles a EULA".
    - Effect sizes aren't in the abstract.
  - A controlled study giving error rates for *OK* versus verb-labelled dialog buttons: **not found** in this pass. Search hits were all guidelines and opinion.
- **Implications for the page.**
  - Routine actions get verb + object (*Create project*, *Export 3 files*).
  - Use *OK* only to acknowledge information.
  - A confirmation's button repeats the verb. When the risk isn't obvious from the title, the title, not the button, must carry it. Our Dialog page's *Delete "Q4 roadmap"?* + **Delete project** already does this.
  - The ellipsis rule needs a decision: Apple (ellipsis) or Material (none). The playbook currently follows Apple, so the page should say so and name the deviation.

## 3. Marketing copy, slogans and eyebrows inside a tool: measured as a usability cost

- **Mechanism.**
  - Promotional language is extra words that carry no task information. It also costs credibility: readers discount boasting, and needless complexity makes the writer seem *less* competent.
  - In a tool, every line competes with the line the user came for. A swappable line (*Every detail. One shared direction.*) is noise by construction.
- **Classic.**
  - Morkes & Nielsen, *Concise, SCANNABLE, and Objective: How to Write for the Web*, 1997 (https://www.nngroup.com/articles/concise-scannable-and-objective-how-to-write-for-the-web/, **verified**, full text).
    - Study 3 had 51 experienced users at SunSoft, using five versions of a "Travel Nebraska" site with the same information.
    - The control was promotional ("exaggeration, subjective claims, and boasting").
    - Overall usability versus the control: concise (half the words) **+58%**, scannable **+47%**, objective (no promotional language) **+27%**, all three combined **+124%**.
    - Usability is the geometric mean of normalised task time, task errors, memory, sitemap time and satisfaction.
    - Users "detest anything that seems like marketing fluff", which the authors call "marketese".
  - Morkes & Nielsen, *Applying Writing Guidelines to Web Pages*, NN/g, 1998-01-06 (https://www.nngroup.com/articles/applying-writing-guidelines-web-pages/, **verified**).
    - Two Sun whitepapers were rewritten concise, scannable and objective at 54% of the original length. 21 technical users took part, between subjects.
    - The rewrite was "159% better" overall. Task time averaged 315 s against 637 s, the error score 0.10 against 0.91, and memory 0.65 against 0.33.
    - **Computed:** the published per-measure percentages don't all match the means (637/315 implies about +102%, while the page says +80%). Quote the overall figure, not the per-measure ones.
  - Oppenheimer, *Consequences of erudite vernacular utilized irrespective of necessity*, Applied Cognitive Psychology 20(2), 2006 (online 2005), doi:10.1002/acp.1178 (**verified, abstract**). Five experiments: more complex text produced a "negative relationship between complexity and judged intelligence", mediated by processing fluency.
- **Replication.** No independent replication of the 1997 effect sizes was found. NN/g published the study materials for replication (search snippet; **secondary**).
- **Systems on tone in a tool.**
  - **Polaris, *Fundamentals*** (`Shopify/polaris`, last changed 2025-02-11, **verified**).
    - "Too much content makes a tool feel cheap and that it's hard to use."
    - "not every situation calls for subcopy, even if the component has been designed to include it".
    - "Could this header, subcopy, and button just be a button?"
  - **Fluent 2, *Content design*** (browser, **verified**): content "can be friendly and inviting on a dashboard or just-the-facts in navigation menus and headers"; "Prune every excess word."
  - **Carbon, *Writing style*** (`carbon-website`, **verified**). Conversation is highest in the "discover, try, and buy" phases and lowest in error messages, "where an economy of words is desirable".
  - **Primer, *Content*** (**verified**): "Be brief, remove unnecessary words like adjectives and adverbs." Humour "isn't welcome" in errors, while waiting, or when something fails.
  - **Apple, *Writing*** (**verified**).
    - "'Favorites' conveys the same message as 'Your Favorites'".
    - "Avoid using we altogether". The example is *We're having trouble loading this content*, and "Unable to load content" is clearer.
  - **Material 3, *Word choice*** (**verified**): "we" or "I" "may come across as robotic or disconcerting". On exclamation marks: "Avoid using exclamation marks for empty states and common tasks."
  - **GOV.UK, *Use clear language*** (**verified**). Buzzwords lead to "empty, meaningless text". The A to Z *Words to avoid* list (**verified**) reads like a marketing glossary: *deliver*, *empower*, *facilitate*, *foster*, *key*, *leverage*, *robust*, *streamline*, *tackle*.
  - **WCAG 2.2, *Understanding 3.3.2 Labels or Instructions*** (**verified**): "Too much information or instruction can be just as harmful as too little."
- **Eyebrows (kickers, overlines).**
  - **No product design system read here defines one.**
  - GitHub code search for `eyebrow` on 2026-10-29 (**measured**):
    - `carbon-design-system/carbon-for-ibm-dotcom`, IBM's *marketing-site* system: 96 hits, such as `card-eyebrow.ts` and `content-item-row-eyebrow.ts`.
    - `carbon-design-system/carbon`, the product system: 0.
    - `primer/react`, `Shopify/polaris`, `material-components/material-web`, `alphagov/govuk-frontend`, `adobe/react-spectrum`: 0 each.
    - `microsoft/fluentui`: 3, all in story CSS or a migration doc.
    - Search counts are approximate.
    - So the same company keeps the eyebrow in its marketing kit and leaves it out of its product kit.
  - **Material 2 had one; Material 3 removed it.**
    - MDC's M2 `overline` style is 12 px, `text-transform: uppercase`, letter-spacing `get-letter-spacing_(2, 0.75)` (**measured**, `material-components-web/packages/mdc-typography/_typography.scss`, last commit 2022-11-05).
    - **Computed:** that's 2 / (0.75 × 16) ≈ 0.167 em, five times the caption's 0.4 / 12 ≈ 0.033 em.
    - Material 3's type scale is 15 baseline styles, "from Display Large to Label Small" (*Type scale & tokens*, browser, **verified**), and none of them is an overline (**computed**: the names are display, headline, title, body and label in three sizes each).
    - Material Web's list item keeps an `overline` *slot* (`labs/item/item.ts`, **measured**). That's a data field inside a row, not a heading ornament.
  - **The legitimate eyebrow is GOV.UK's caption.**
    - *Headings › Headings with captions* (design-system.service.gov.uk, **verified**): use it when "a page is part of a larger section or group". *Question pages* (**verified**): "If you need to show the high-level section, you can use the govuk-caption style. For example, 'About you'".
    - `.govuk-caption-l` is 24 px in the secondary-text colour, with no `text-transform` or `letter-spacing` anywhere in the typography mixin (**measured**, `govuk-frontend/packages/govuk-frontend/src/govuk/core/_typography.mixin.scss`).
    - It names the parent. It's in sentence case. It isn't a slogan.
  - **Linters now flag it.** React Doctor's rule `no-hero-eyebrow-chip`, "Hero uses a decorative eyebrow label", is filed as "Creative-direction review" (https://www.react.doctor/docs/rules/react-doctor/no-hero-eyebrow-chip, **verified**). It gives no rationale and says to keep intentional choices.
- **Implications for the page.**
  - In a tool, the word above a heading must name its parent: section, project, record ID or status. Our tracker eval's `08-tracker/b-5/src/App.tsx:898–901` (status icon, status, `ORB-{id}`) is the good case.
  - A sentence or slogan there is marketing. So is a subtitle that restates the heading, or a closing line like *Let's make something great*.
  - The page can argue this from 124% / 159% (Morkes & Nielsen), Oppenheimer's fluency effect, and Polaris's "feel cheap". It doesn't need taste.

## 4. Sentence case, title case and ALL CAPS: the evidence is weaker and stranger than the rule

- **Mechanism.**
  - All-caps running text reads slower, mostly because we've had less practice with it. The "word shape" story isn't the reason.
  - Short uppercase labels are not illegible. At small sizes, capitals are *more* legible because they're bigger at the same point size.
  - The real costs of caps in a tool:
    - proper nouns stop standing out (Carbon);
    - it reads as shouting (GOV.UK);
    - it needs more width;
    - literal uppercase in the source string changes what's copied, and can change what some screen readers say for short words (an **unverified** inference, see the list at the end).
  - Sentence case wins in systems for consistency and translation, not measured speed.
- **Classic.**
  - Tinker & Paterson, *Influence of type form on speed of reading*, Journal of Applied Psychology 12(4):359–368, 1928, doi:10.1037/h0073699. The metadata is **verified** (OpenAlex, Crossref). No abstract is available: PsycNET didn't render. Its all-caps slowdown figure is **unverified**.
  - Larson (Microsoft), *The Science of Word Recognition*, an ATypI 2003 talk on Microsoft Learn, page dated 2018-02-05 (https://learn.microsoft.com/en-us/typography/develop/word-recognition, **verified**, full text).
    - Lowercase was read "faster with the lowercase text by a 5-10% speed difference" in Smith 1969 and Fisher 1975. Those originals are **secondary** via Larson.
    - That difference "is entirely a practice effect": readers forced to read uppercase speed up to the lowercase rate.
    - Word shape "is no longer a viable model of word recognition".
    - So Carbon's stated reason (caps have "no ascenders or descenders") is the word-shape explanation psychologists dropped.
- **Recent.**
  - Arditi & Cho, *Letter case and text legibility in normal and low vision*, Vision Research 47(19):2499–2505, 2007, doi:10.1016/j.visres.2007.06.010 (**verified, abstract**, PubMed 17675131).
    - Lowercase size thresholds were "roughly 0.1 log unit higher than upper".
    - Reading was faster for upper- than mixed-case "at sizes twice acuity size". At larger sizes "the upper-case advantage disappeared".
    - Upper case "is more legible … especially for visually-impaired readers".
- **Systems.**
  - **Material 3** (*Style guide*, **verified**): "All text, including titles, headings, labels, menu items, navigation components, app bars, and buttons should use sentence-style capitalization." And "Don't use caps blocks … they're not accessible." It gives no mechanism.
  - **Material 2 → 3:** the M2 `button` style had `text-transform: uppercase` (**measured**, MDC `_typography.scss`). M3 moved buttons to sentence case.
  - **Fluent 2** (*Content design*, **verified**): sentence case "because its easier for people to read and it's easier for translators to localize content". Title case on iOS and macOS, to match the platform.
  - **Primer** (**verified**): "Use sentence case, and when in doubt, don't capitalize."
  - **Carbon** (*Writing style*, **verified**).
    - Sentence case for all UI text. Don't use title case: it relies on judging what's "important" and "can also slow reading".
    - Don't use all caps: it "has been shown to be slower to read", with no citation, and proper nouns get lost.
    - "Carbon does not consider UI elements within a product to be proper nouns."
  - **Polaris** (*Grammar and mechanics*, **verified**): sentence case for headings, subheadings, buttons and card titles. *Create purchase order*, not *Create Purchase Order*.
  - **GOV.UK** (A to Z, **verified**): "DO NOT USE BLOCK CAPITALS FOR LARGE AMOUNTS OF TEXT AS IT'S QUITE HARD TO READ." (The entry is itself set in capitals.) "Always use sentence case, even in page titles and service names." The tone page (**verified**) adds that caps "can be understood as shouting."
  - **Apple** (**verified**): title-style capitalization for buttons and menu items. *Writing* frames case as voice ("Title case is generally considered formal") and asks for one style per element type.
  - **Windows UX guide** (*Confirmations*, **verified**): dialog titles in title case, main instructions in sentence case.
  - **WCAG 2.5.3 Understanding** (**verified**): capitalization is "generally ignored" by speech input, but "capitalization can impact meaning" for screen readers, for example in abbreviations.
- **Implications for the page.**
  - Sentence case everywhere, and Apple's title case only when matching the platform. The existing pages already say so.
  - The page shouldn't claim caps are illegible. The evidence (Arditi & Cho) says short caps are legible. The argument is that an uppercase label is a typographic *signal*, and the signal is usually the only thing the eyebrow carries.
  - If a small label truly needs caps, keep the source string in sentence case and apply `text-transform`. The evals typed `WORKSPACE` and `ISSUE` literally into JSX.

## 5. Error messages: what happened and how to fix it, next to the field, without *please*, *sorry* or *invalid*

- **Mechanism.**
  - The user needs three things: which field, what's wrong, and the exact fix, in the words the label used.
  - Apology, humour and jargon add reading and remove none of the work. *Please* turns a requirement into a request.
  - Where and when an error appears matters as much as its words: people in "completion mode" ignore errors that appear while they're still filling a form.
- **Standard.**
  - WCAG 2.2 **3.3.1 Error Identification** (A, **verified**): "the item that is in error is identified and the error is described to the user in text."
  - **3.3.3 Error Suggestion** (AA, **verified**): if "suggestions for correction are known, then the suggestions are provided", unless that would jeopardise security or purpose.
- **Systems.**
  - **GOV.UK, *Error message*** (design-system.service.gov.uk, **verified**).
    - "explain what went wrong and how to fix it".
    - Don't use: jargon; *forbidden*, *illegal*, *you forgot*, *prohibited*; "'please' because it implies a choice"; "'sorry' because it does not help fix the problem"; "'valid' and 'invalid' because they do not add anything"; *oops*.
    - Avoid generic messages like *An error occurred* and *This field is required*.
    - Errors "should directly include language from the question or fieldset label". The example is *How many hours do you work a week?* → *Enter how many hours you work a week*.
    - Use an instruction for empty fields (*Enter your first name*) and a description for limits (*First name must be 35 characters or less*), consistently.
    - "Do not clear any form fields". A hidden "Error:" prefix is read aloud.
    - Research note: the messages were tested in live services and users "knew how to fix the problem". That's qualitative, with no numbers.
  - **Apple, *Writing*** (**verified**): put the error "as close to the problem as possible, avoid blame". *That password is too short* is weaker than *Choose a password with at least 8 characters*. "oops!" or "uh-oh" "can sound insincere". Avoid *Invalid name*.
  - **Polaris, *Error messages*** (**verified**).
    - Avoid "error jargon like 'invalid'". Don't overapologise or bring "us"/"we" in "unless Shopify caused the problem".
    - Do: *To save this product, make 2 changes: Enter title, Add weight*. Don't: *There are 2 errors on this page*.
    - Do: *Couldn't deposit payout* with the button *Update bank account*. Don't: *Invalid bank account* with *Next*.
    - With no solution, the Do is "Something went wrong. Refresh your browser to try again." So a generic line is acceptable only with a next step.
  - **Primer** (**verified**): Do *Enter a name*. Don't *You forgot to add your name*, *Field required*, *Sorry, all checks failed*, *Oops, some checks failed*.
  - **Material 3, *Dialogs*** (**verified**): field errors "should always appear inline". General errors go in a dialog when the confirming action fails. "Show all errors on the page at once."
- **Studies (placement and timing are measured; wording barely is).**
  - Seckler, Tuch, Opwis & Bargas-Avila, *User-friendly locations of error messages in web forms*, Interacting with Computers 24(3), 2012, doi:10.1016/j.intcom.2012.03.002 (**verified, abstract**). With n = 303 and six locations, messages near the field beat the top or bottom of the form, and the right side was rated most satisfying.
  - Bargas-Avila, Oberholzer, Schmutz, de Vito & Opwis, *Usable error message presentation in the World Wide Web: Do not show errors right away*, Interacting with Computers 19(3), 2007, doi:10.1016/j.intcom.2007.01.003 (**verified, abstract**). In two studies (77 and 90 participants), immediate feedback "showed the worst performance". Users "often simply ignored the messages". This is the "Modal Theory of Form Completion".
  - Wroblewski, *Inline Validation in Web Forms*, A List Apart, 2009-09-01 (https://alistapart.com/article/inline-validation-in-web-forms/, **verified**).
    - Etre tested 22 users on six form versions.
    - The best inline version beat the control: success **+22%**, errors **−22%**, satisfaction **+31%**, completion time **−42%**, fixations **−47%**.
    - "After" (on blur) beat "while typing". Commenters flagged learning bias from within-subjects exposure.
    - Reconciled with Bargas-Avila: validate once a field is finished, never mid-typing.
  - Seckler, Heinz, Bargas-Avila, Opwis & Tuch, *Designing usable web forms*, CHI 2014, doi:10.1145/2556288.2557265 (**verified, abstract**). N = 65, eyetracked: 20 form guidelines together gave faster completion, "fewer form submission trials" and fewer eye movements. The abstract gives no numbers.
  - **Wording alone, mixed (programming domain):**
    - Denny, Luxton-Reilly & Carpenter, *Enhancing syntax error messages appears ineffectual*, ITiCSE 2014, doi:10.1145/2591708.2591748 (**verified, abstract**): "no significant effect".
    - Becker et al., *Effective compiler error message enhancement for novice programming students*, Computer Science Education 26(2–3), 2016, doi:10.1080/08993408.2016.1225464 (**verified, abstract**): fewer errors and repeated errors.
  - Shneiderman, *Designing computer system messages*, CACM 25(9), 1982, doi:10.1145/358628.358639 (**verified, abstract**, partial). It names "violent" (*FATAL ERROR, RUN ABORTED*), "vague" (*ILLEGAL CMD*) and "obscure" codes. The experimental numbers in his related work are **not read**.
- **Implications for the page.**
  - Error = label words + what to do + the constraint (*Enter a password with at least 10 characters*), placed under the field and shown once the field is done.
  - Never *please*, *sorry*, *oops*, *invalid*, *we*.
  - A server failure says what failed and the next step (*Couldn't create your account. Try again.*) and sits on the form, not on a random field. The evals put it on the terms checkbox (§11).
  - Don't overclaim. Wording studies are thin; placement and timing are where the numbers are.

## 6. Empty states and first-run text: the one place warmth is allowed, and it still names the action

- **Mechanism.**
  - An empty region is the only content on screen, so its title is read. If it doesn't name the next action, the user has to find it.
  - Systems split empties into three kinds, each with its own copy:
    - **first use**: say what goes here and give the create action;
    - **no results**: repeat the filter or query and offer a way out;
    - **error**: say what failed and how to recover.
  - First use is the one place every system sanctions a friendlier tone.
- **Systems.**
  - **Apple, *Writing*** (**verified**): "Provide clear next steps on any blank screens". Give people "a button or link to do so if possible". "empty states are usually temporary, so don't show crucial information that could then disappear."
  - **Primer, *Empty states*** (`primer/design/content/ui-patterns/empty-states.mdx`, **verified**).
    - A first-use empty state should "sound welcoming and human".
    - For a system error, "the graphic should not attempt to bring delight or be playful".
    - The secondary text should let users "understand what steps they might take next". One primary action.
    - On errors, "There was a problem" is too vague, and a database-cluster explanation is too literal.
  - **Carbon, *Empty states*** (`carbon-website/src/pages/patterns/empty-states-pattern/index.mdx`, **verified**).
    - The title is "a positive statement": *Start by adding data assets* beats *You don't have any data assets*.
    - The body explains "the next action to populate the space".
    - Types: no data, user action (no search results, completion) and error.
    - "More content doesn't necessarily mean it's a better solution".
  - **Polaris, *Empty state*** (`Shopify/polaris/.../empty-state.mdx`, **verified**).
    - The title is "action-oriented": *Create orders and send invoices*, not *Orders and invoices*.
    - "Use only one primary call-to-action button". "never make merchants feel unsuccessful or guilty".
  - **Material 3:** no empty-state page was found. The only rule seen is no exclamation marks in empty states (*Grammar and punctuation*, **verified**).
- **Implications for the page.**
  - The empty title names what's missing or the action (*No issues match "login"*; *Create your first project*). The body is one sentence, and there's one button.
  - Warmth is allowed on first use only, and it's still specific. *A little space for big ideas* isn't warmth, it's a slogan.
  - The eval's `No projects found` / `Try another name or filter.` is a fair "no results" state (§11).

## 7. Confirmation dialogs and destructive actions: the confirmation habituates after two exposures

- **Mechanism.**
  - A dialog shown for routine actions trains people to dismiss it without reading. The brain's visual response to a repeated warning drops sharply from the second exposure.
  - So the copy rule (title names the consequence, button repeats the verb) only works if the dialog is rare.
  - What survives habituation is making the decisive fact unavoidable: retyping a name, or a changing appearance. Better adjectives don't.
- **Systems.**
  - **Apple, *Alerts*** (**verified**).
    - "Avoid displaying alerts for common, undoable actions, even when they're destructive".
    - The title "clearly and succinctly describes the situation". Not "Error" or "Error 329347 occurred".
    - Cancel is never the default button.
  - **Material 3, *Dialogs*** (**verified**).
    - The headline is "a brief, clear statement or question". Avoid apologies ("Sorry for the interruption"), alarm ("Warning!") and ambiguity ("Are you sure?").
    - "Dialogs should contain a maximum of two actions."
  - **Windows UX guide, *Confirmations*** (**verified**).
    - The original *Are you sure?* was "a very bad start". Users "dismiss them as quickly as possible, often without reading".
    - If one answer is chosen "98 percent of the time, the confirmation is clearly unnecessary".
    - Don't put "warning" or "caution" in the text. Use "permanently" when the action can't be undone.
    - "Don't show this message again" never justifies an unnecessary confirmation.
    - Name objects in full.
  - **Polaris, *Error messages › Settings warning*** (**verified**): Do *Changing store currency will affect reporting, pricing, and more*. Don't *Are you sure you want to change your currency?*.
  - **Primer, *Content › Subject*** (**verified**): first person is allowed to "confirm a destructive action", as in *I understand, convert this issue to a discussion*.
- **Habituation studies.**
  - Anderson, Kirwan, Jenkins, Eargle, Howard & Vance, *How Polymorphic Warnings Reduce Habituation in the Brain*, CHI 2015, doi:10.1145/2702123.2702322 (**verified, abstract**). fMRI showed "a dramatic drop in the visual processing centers of the brain after only the second exposure to a warning". A polymorphic warning that changes appearance resisted this.
  - Anderson, Vance, Kirwan, Jenkins & Eargle, *From Warning to Wallpaper*, JMIS 33(3), 2016, doi:10.1080/07421222.2016.1243947 (**verified, abstract**). fMRI with n = 25, plus a field test with mouse tracking and n = 80: polymorphic warnings reduced habituation.
  - Vance, Jenkins, Anderson, Bjornn & Kirwan, *Tuning Out Security Warnings*, MIS Quarterly 42(2), 2018, doi:10.25300/MISQ/2018/14124 (**verified, abstract**).
    - fMRI and eye tracking over a five-day workweek: attention declined and "recovers at least partially between workdays".
    - In a three-week field study of app permission warnings, adherence "substantially decreased". With polymorphic warnings it dropped "at a substantially lower rate".
  - Bravo-Lillo, Komanduri, Cranor, Reeder, Sleeper, Downs & Schechter, *Your Attention Please*, SOUPS 2013, doi:10.1145/2501604.2501610 (**verified**, full text via author PDF).
    - "Attractors" in install and permission dialogs were tested with Mechanical Turk workers. The *Type* attractor makes people retype the salient field (the publisher name) before the risky button enables.
    - After artificial habituation, participants with inhibitive attractors "were two to three times more likely to make an informed decision".
    - The cost: all inhibitive attractors delayed people, and *Swipe* still added 3–4 s after learning.
    - A *Short options* condition shortened the button text to *install the software* and moved the advice into an instruction. Its result couldn't be reliably extracted from the chart text: **not used**.
  - Akhawe & Felt, *Alice in Warningland*, USENIX Security 2013 (https://www.usenix.org/conference/usenixsecurity13/technical-sessions/presentation/akhawe, **verified, abstract page**).
    - The study covered over 25 million warning impressions.
    - Chrome SSL warnings were clicked through 70.2% of the time, Firefox SSL about a third, and malware/phishing a tenth to a quarter.
    - A warning's user experience "significantly" affects behaviour.
  - Böhme & Köpsell 2010 (§2): EULA-like dialogs get accepted blindly.
- **Implications for the page.**
  - Confirm only rare, irreversible, non-obvious actions. Otherwise do it and offer **Undo** (Toast page).
  - The title asks about the object by name and states the consequence the user might not know (*Delete "Q4 roadmap" and its 42 issues?*). The button repeats the verb.
  - Never *Are you sure?*, *Warning!*, or a sorry.
  - For the truly dangerous case, make people retype the name (GitHub-style). That's the one copy-adjacent technique with a measured effect after habituation (Bravo-Lillo 2013).

## 8. Placeholders, hints and labels: the label is always visible, and the hint is one short sentence

- **Mechanism.**
  - A placeholder disappears on the first keystroke, so it can't hold anything the user needs while typing or when checking answers. Not all screen readers read it, and it's grey by default.
  - Hint text is read out in full every time the field is focused, so a long hint taxes screen-reader users on every visit.
- **Standards.**
  - **HTML Standard, *the placeholder attribute*** (html.spec.whatwg.org/multipage/input.html, **verified**).
    - It "represents a short hint (a word or short phrase)": "a sample value or a brief description of the expected format".
    - It "should not be used as an alternative to a label."
    - The label is shown "at all times", the placeholder "before the user enters a value".
  - **WCAG 2.2, *Understanding 2.5.3 Label in Name*** (**verified**): "placeholder text within an input field is not considered an appropriate means of providing a label."
  - **WCAG 2.2, *Understanding 3.3.2*** (**verified**): instructions can be shown "only when the individual control has focus", and "Too much information … can be just as harmful as too little."
- **Systems.**
  - **GOV.UK, *Text input*** (**verified**).
    - "Do not use placeholder text in place of a label, or for hints or examples". It "vanishes when the user starts typing", which hurts "users with memory conditions or when reviewing answers". "not all screen readers read it out", and browser defaults often fail 1.4.3.
    - Hint text: "a single short sentence, without any full stops". No links, because screen readers "usually do not tell users the text is a link".
    - Don't hint at anything longer than "a short, simple sentence", because "Screen readers read out the entire text".
    - Labels go above the input, "short, direct and written in sentence case", with no colon.
  - **Primer, *Forms*** (`primer/design/content/ui-patterns/forms/overview.mdx`, **verified**). Labels should "aim for no more than 3 words". Placeholder "is never an acceptable substitute for a label". The caption should not be "redundant with the label".
  - **Apple, *Text fields*** (**verified**). It is weaker than the others: placeholder "such as 'Email' or 'Password'", and "it can also be useful to include a separate label".
  - **NN/g**, Sherwin, *Placeholders in Form Fields Are Harmful*, 2014-05-11 (https://www.nngroup.com/articles/form-design-placeholders/, **verified**). Seven costs: memory, checking work, fixing errors, keyboard users, less noticeable fields, mistaken for defaults, manual deletion. These are qualitative usability findings with no numbers.
- **Implications for the page.**
  - A visible label, one to three words, always. The hint goes under the label as one short sentence with no full stop and no link.
  - **Decision needed.** Our Input page allows a placeholder *example* (HTML spec: "sample value"). GOV.UK bans even that. The defensible middle: an example may sit in the placeholder only if the format isn't required to answer. If the format matters (dates, IDs), it goes in the hint.

## 9. Length and plain language: shorter text tested better, and experts prefer it too

- **Mechanism.**
  - Every extra word is read by fewer people (§1), and every long word costs fluency (Oppenheimer).
  - Plain language isn't "for low-literacy users". The higher the reader's expertise, the stronger their stated preference for it.
- **Measured.**
  - Concise text at half the words: **+58%** usability (Morkes & Nielsen 1997, §3).
  - Rewritten pages at 54% of the length: **+159%** (1998, §3).
  - GOV.UK *Use clear language* (**verified**) cites legal-language research. "80% of people preferred sentences written in clear English". "the more educated the person and the more specialist their knowledge, the greater their preference for plain English". The source is SSRN 1843415, Trudeau, which returned 403: the study itself is **secondary**.
  - Loranger, *Plain Language Is for Everyone, Even Experts*, NN/g, 2017-10-08 (https://www.nngroup.com/articles/plain-language-experts/, **verified**). Qualitative quotes from domain experts. It suggests "6th–8th grade" levels for general audiences and "10th–12th" for experts, with no data.
- **Targets in systems.**
  - **Primer** (**verified**): "Aim for a seventh-grade or below reading level."
  - **Polaris, *Fundamentals*** (**verified**): "Aim for a 7th grade reading level". Use contractions (*don't*, not *do not*).
  - **GOV.UK, *Use clear language*** (**verified**).
    - "Plain English is mandatory".
    - Literacy: "1 in 6 adults in England have very poor literacy skills".
    - "Try to split up sentences that are over 25 words long". Paragraphs of no more than 5 sentences.
    - "avoid negative contractions like 'can't' or 'don't'", because many users "misread them as the opposite". That conflicts with Polaris and Material 3.
    - The current pages give no "reading age 9" figure (**not found**).
  - **Apple alerts** (**verified**): titles shouldn't wrap "to more than two lines". **Apple menus**: drop articles. **Polaris buttons**: drop articles.
  - **Carbon** (**verified**): "avoiding terms of politeness such as please and thank you in a UI", because they can be "inappropriate or offensive in some cultural contexts". GOV.UK says the same about *please* for a different reason (§5).
- **Numbers.**
  - Nielsen, *Show Numbers as Numerals*, NN/g, 2007-04-15 (https://www.nngroup.com/articles/web-writing-show-numbers-as-numerals/, **verified**): "numerals often stop the wandering eye and attract fixations". The evidence is qualitative gaze replays with no counts.
  - **Polaris** (**verified**): "Use numerals", as in *You have 5 orders to fulfill*.
  - **GOV.UK** (**verified**): numerals "including 2 to 9". The word "one" is used except for steps, dates and list points. A comma goes above 999.
  - **Material 3** (**verified**): commas from 1,000, and "M" for millions when giving a sense of volume.
- **Implications for the page.**
  - Numbers for the page: labels of 1–3 words (Primer), alert buttons of 1–2 words (Apple), one-sentence hints (GOV.UK), sentences under 25 words, a 7th-grade target (Primer, Polaris).
  - Digits, not words, for counts (*3 files*).
  - No *please*.
  - Pick one contractions rule. The playbook's own copy uses *don't* and *isn't*, so it follows Polaris and Material 3. Name GOV.UK as the dissent.

## 10. Words vs icons, and one word for one thing

- **Mechanism.**
  - Users learn a product's vocabulary once, then search for those words. A second word for the same action reads as a different action.
  - Voice-control users say the visible label. If the accessible name doesn't start with it, the command fails.
- **Icons.** See `2026-10-29-icons.md`.
  - The label carries meaning on first use (Wiedenbeck 1999). The tooltip is the label being learned.
  - Symbol characters are not labels (*Understanding 2.5.3*).
  - New tension: Polaris *Fundamentals* (**verified**) says "Let visuals and icons do the talking wherever you can ('+' not '+ Add')". That's acceptable under our Icon page only with a tooltip and `aria-label`.
- **Consistency of terms.**
  - **Apple, *Writing*** (**verified**): "Create a list of common terms, and reference that list".
  - **Carbon** (**verified**): "Create a terminology list of words for your product". The *Action labels* glossary defines 65 actions (**measured**).
    - *Delete* "Destroys an existing object". *Remove* takes an object "from the current context but the object is not destroyed". *Clear* clears fields or selections.
    - Each is paired with its object where appropriate (*Delete row*, *Remove user*).
  - **Primer** (**verified**).
    - "Refer to the same actions, sections, labels … the same way across the product."
    - Feedback uses the trigger's term: *Issue transfer in progress* after **Transfer**, not *Moving the issue*.
    - *sign in*, not *log in*. "'Pull request' should never be abbreviated."
  - **Polaris, *Naming*** (**verified**): "Features should always have descriptive names". Don't capitalise descriptive feature names (*Order entry*).
  - **Carbon** (**verified**): UI elements aren't proper nouns, so *My network page*, not *My Network page*.
  - **WCAG 2.2, 3.2.4 Consistent Identification** (AA, **verified**): "Components that have the same functionality within a set of web pages are identified consistently."
- **Label in name.** WCAG 2.2, *Understanding 2.5.3* (A, **verified**).
  - When labels and names don't match, a command like "move to Password" fails for speech users.
  - "A best practice is to have the text of the label at the start of the name": *Search for a value* starts with *Search*.
  - Case and most punctuation are ignored: *First Name:* matches *first name*.
- **Implications for the page.**
  - One verb per action across the product. The button, the toast and the undo all use it: **Archive** → *Archived "Q4 roadmap"* → **Undo**, never *Moved to archive*.
  - Delete, remove and clear mean different things, so pick by what happens to the object.
  - Any `aria-label` starts with the visible words.

---

## 11. Eval examples for demos

From `/Users/polar/code/ui-playbook-eval-runs/*/src/App.tsx` (**measured**, read-only). Side A was built without the Skill and side B with it (`docs/plans/2026-10-28-agent-eval.md`). The runs are dated 2026-10-28 and may predate the Skill's eyebrow sentence (§0).

| # | File:line | Side | Copy | What's wrong |
|---|---|---|---|---|
| 1 | `04-sign-up/b-2/src/App.tsx:152–157` | B | Eyebrow **FROM FIRST SPARK TO FINAL MASTERPIECE** over *Big ideas. / Beautiful beginnings.* | Slogan eyebrow over a slogan heading on a sign-up form |
| 2 | `04-sign-up/b-2/src/App.tsx:111, 152, 337, 364, 547` | B | **MAKE SOMETHING**, **FROM FIRST SPARK…**, **YOU'RE RIGHT WHERE YOU BELONG**, **GREAT THINGS START HERE**, **FORMA · THE SMALL PRINT** | Five uppercase kicker labels on one sign-up flow (the "5 eyebrows" page) |
| 3 | `04-sign-up/b-2/src/App.tsx:364–368` | B | **GREAT THINGS START HERE** / *A little you. A lot of possibility.* | The form's own heading names no task (it should be *Create your account*) |
| 4 | `04-sign-up/a-1/src/App.tsx:391–392` | A | **LESS FRICTION. MORE CREATION.** | Tagline eyebrow above the form heading |
| 5 | `04-sign-up/a-1/src/App.tsx:645–658` | A | *Welcome back.* + button **Let's get you started** | The button closes a dialog and focuses a field. The label promises something else (Apple: "Send" beats "Let's do it!") |
| 6 | `04-sign-up/b-1/src/App.tsx:310, 528` | B | **YOU'RE IN GOOD COMPANY**; **THE SMALL PRINT, SIMPLIFIED** | Eyebrows above a welcome heading and a legal dialog title |
| 7 | `04-sign-up/b-1/src/App.tsx:292`; `04-sign-up/b-3/src/App.tsx:66` | B | *Something went wrong. Please try again.* stored as the **terms** field's error | A server failure shown on an unrelated checkbox, with *please* (GOV.UK) and no cause (Polaris) |
| 8 | `01-confirm-delete/a-1/src/App.tsx:948–949` | A | Dialog title *Start something great.* / *Give your next project a place to grow.* | The dialog title should be the task (*Create project*), per the Dialog page |
| 9 | `01-confirm-delete/b-5/src/App.tsx:30, 32, 46` | B | **WORKSPACE**, **YOUR PROJECTS**, eyebrow **WORKSPACE** over *Projects*, subtitle *All your team's work, in one place.* | Literal caps, a possessive (Apple: *Favorites*, not *Your Favorites*), and a subtitle that restates the heading |
| 10 | `01-confirm-delete/b-1/src/App.tsx:819–821`; `01-confirm-delete/a-1/src/App.tsx:817`; `08-tracker/a-2/src/App.tsx:470` | B, A, A | *Great work starts with a great team.*; *Your next steps, all in one place.* (×3 runs) | Three separate runs wrote the identical subtitle: the swap test, failed in the wild |
| 11 | `08-tracker/b-1/src/App.tsx:802–806` | B | Visible eyebrow **ISSUE DETAILS**, real heading `FRM-{id}: {title}` set `sr-only` | The decoration is visible and the information is hidden |
| 12 | `08-tracker/b-1/src/App.tsx:1009–1013` | B | **MAKE IT HAPPEN** / *Every improvement starts here.* / *Give your next step a little clarity.* | Three lines of filler before the *Title* field of a new-issue form |
| 13 | `08-tracker/a-1/src/App.tsx:452`; `08-tracker/a-2/src/App.tsx:416–417` | A | **A LITTLE PROGRESS, EVERY DAY** over *Issues*; *A little progress, every day.* / *Here's where the mobile app stands.* | A slogan in a tracker's page header |
| 14 | `08-tracker/a-1/src/App.tsx:655–659` | A | Column headers **ISSUE / LABELS / ASSIGNEE / PRIORITY** typed in caps | Caps in the source string (Table page: short sentence-case nouns) |
| 15 | `01-confirm-delete/a-2/src/App.tsx:466–469, 709` | A | Sidebar note *A little space for big ideas. / Good work starts with a clear plan. / Let's make something great.*; tab heading *Every detail. One shared direction.* | Marketing block in an app sidebar, and a slogan heading on a settings tab |

Good counter-examples from the same runs:
- `08-tracker/b-5/src/App.tsx:898–901`: the "eyebrow" is status icon + status + `ORB-{id}`. It names the record, GOV.UK-caption style.
- `01-confirm-delete/b-1/src/App.tsx:793–794`: *No projects found* / *Try another name or filter.* A no-results state that names the way out.
- *Got it* on purely informational help dialogs (e.g. `01-confirm-delete/a-2/src/App.tsx:971`) is acceptable: Apple allows OK-type acknowledgement for informational alerts.

---

## Strongest counterintuitive points for the page

1. **Promotional text is a measured usability cost, not a style choice.** Morkes & Nielsen 1997 (n = 51): removing promotional language alone gave +27%, half the words +58%, and all three changes together +124%. A 1998 rewrite at 54% of the length scored +159% with technical users. Oppenheimer 2006 adds that needless complexity makes the writer seem *less* intelligent.
2. **The same company keeps the eyebrow in its marketing kit and out of its product kit.** `eyebrow` appears in 96 code hits in IBM's Carbon for IBM.com and 0 in Carbon (also 0 in Primer, Polaris, Material Web, GOV.UK Frontend and React Spectrum; measured). Material 2's uppercase, 0.167 em-tracked `overline` style is gone from Material 3's 15-style scale. The one product eyebrow, GOV.UK's caption, names the parent section (*About you*), in sentence case, with no tracking.
3. **People read about two words of each line, and they skip a first word that repeats.** NN/g 2009 (n = 80): "about 2 words for most list items", and for 35% of links the first 11 characters gave no idea of the destination. NN/g 2017 defines "bypassing" for lists whose lines all start with the same word(s). An eyebrow takes the first-read slot above the heading.
4. **Caps aren't illegible; at small sizes they're more legible.** Arditi & Cho 2007: lowercase size thresholds were 0.1 log unit higher, and the uppercase advantage held at twice acuity size. Lowercase's 5–10% speed edge in running text is "entirely a practice effect" (Larson, Microsoft). So the reason for sentence case is consistency, translation and not shouting (Fluent, Carbon, GOV.UK). It isn't word shape.
5. **A specific verb lets people skip the question, which is why confirmations need something more.** Microsoft's Windows guide: a bare *Uninstall* gets clicked "without giving it a second thought". Use *Uninstall anyway*, or Yes/No to force reading the question. Apple: don't style a deliberately chosen *Empty Trash* as destructive.
6. **Confirmations go blind after the second view.** fMRI shows "a dramatic drop" in visual processing "after only the second exposure" (Anderson et al. 2015). Over three weeks, adherence to permission warnings "substantially decreased" (Vance et al. 2018). Chrome SSL warnings were clicked through 70.2% of the time (Akhawe & Felt 2013, 25 M impressions). What survives habituation is making people retype the critical fact: 2–3× more informed decisions (Bravo-Lillo et al. 2013).
7. **Politeness backfires.** "Please" "implies a choice" (GOV.UK) and can offend across cultures (Carbon). In a field test with 80,000 users, polite requests and voluntary-sounding buttons *lowered* consent, and users accepted anything shaped like a EULA (Böhme & Köpsell 2010).
8. **For errors, placement and timing are measured; wording barely is.** Near the field beats the top of the form (n = 303). Immediate errors are ignored mid-form (n = 77 + 90). On-blur inline validation gave −42% completion time (22 users). Studies of "better wording" alone split: no effect (Denny 2014) versus fewer errors (Becker 2016), both in compiler messages. The page should lead with where and when, then the GOV.UK word list.

## Not verified, kept off pages

- Tinker & Paterson 1928's all-caps slowdown figure (often quoted as about 12%). Only the metadata was read.
- Smith 1969 and Fisher 1975 (5–10% lowercase advantage): seen only via Larson. They are **secondary**.
- Trudeau's legal-language study (80% prefer clear English): seen only via GOV.UK; SSRN returned 403.
- Nielsen 1997's 79% / 16% scanning figures: the page gives no sample or method.
- The 20–28% "words read" figure: an upper bound computed from dwell time, not a measurement. Don't present it as "people read 20%".
- Any controlled study of *OK* versus verb button labels and error rates: **not found**.
- Any study testing eyebrows or kicker labels in product UI: **not found**. The first-fixation cost of an eyebrow is inference from F-pattern / first-two-words.
- Bravo-Lillo 2013's *Short options* result (shorter button text): not reliably extracted from the PDF chart text.
- Böhme & Köpsell 2010 effect sizes. Only the abstract was read.
- Seckler et al. 2014 and Seckler et al. 2012 numeric results. Only the abstracts were read.
- Shneiderman's 1982 experimental results on message wording. Only the CACM abstract was read.
- Whether screen readers spell out short all-caps strings like "WORKSPACE" or "ISSUE" (JAWS / NVDA / VoiceOver behaviour): not tested, not looked up. WCAG 2.5.3 only notes that case "can impact meaning" for screen readers.
- That `text-transform: uppercase` versus literal capitals changes copy-paste output: browser behaviour not tested here.
- GOV.UK's old "reading age of 9" target: not on the current guidance pages.
- plainlanguage.gov / digital.gov Federal Plain Language Guidelines: not opened.
- Mailchimp, Atlassian and Fluent dialog-specific content guidance: not read this pass.
- Material 3 empty-state guidance: none found. Material 2's empty-states page didn't render to the fetch tool.
- NN/g's claim that placeholders are harmful rests on qualitative testing with no numbers. Usable as reasoning, not as a statistic.
- Wroblewski 2009 percentages: a small sample (22) and within-subjects exposure; commenters flagged learning bias. Quote with that caveat or not at all.
