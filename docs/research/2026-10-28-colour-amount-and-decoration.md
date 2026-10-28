# How much colour, and what decoration costs

Research for a new principle page about the **amount** of colour a tool's screen carries, and the cost of decoration. It comes from the 2026-10-28 agent eval (`docs/plans/2026-10-28-agent-eval.md`). Both arms produced busy screens. The sign-up page gave half its width to an illustration, slogans and invented brand names. The tracker gave every label chip its own hue, tinted the sidebar and coloured the avatars.

Not repeated here:
- How to **choose** a colour (lightness by role, tinted greys at chroma ≤ 0.015, Schloss & Palmer on figure/ground hue) is on `src/pages/principles/lightness-first.mdx`.
- One accent with one meaning, and "a label colour someone picked is content", are on `colour-means-one-thing.mdx`.
- Banner blindness ("it skips what looks like an ad") and the squint test are on `where-the-eye-goes.mdx`. §4 below uses Burke et al. 2005 for a different point: what a skipped graphic still **costs**. Don't re-explain the blindness.
- Wolfe & Horowitz 2004/2017 (guiding attributes, pop-out slopes, priming) are in `2026-10-27-colour-and-unread.md` §1. Material roles, Fluent 2 and Linear 2024 were verified in `2026-10-27-colour-and-unread.md` §4 and `2026-10-27-colour-system.md`, and M3 Expressive in `2026-10-27-human-modern-references.md` R1. They're cited by reference and only re-checked where marked.

**Labels.**
- **Verified**: read in the primary source this session. That's full text where a PDF was opened, the abstract (Europe PMC, OpenAlex, ERIC, a publisher or institutional page) where marked "abstract", or a design system's own page.
- **Secondary**: known only from a citing paper, a press release or a search snippet.
- **Unverified**: from memory or inference. Keep these off pages.
- **Measured**: read from package source or the eval screenshots, 2026-10-28.
- **Computed**: worked out here, with the method stated.

The scripts for the computed numbers are in the session scratchpad (`colourfulness/m3.py`, `shots2.py`). They're throwaway, not part of the repo.

---

## 1. Many hues slow the search for what you didn't know to look for

- **Mechanism.** Search gets harder as the target looks more like the non-targets, **and as the non-targets look less like each other**. A screen of uniform grey rows lets one coloured mark pop out. A screen where every row carries a different hue makes the eye check colours one by one. The counterintuitive part is that a *known* target barely suffers. If you're looking for "the red Bug chip", eight hues hardly slow you down. What suffers is noticing what you weren't looking for: the overdue item, the error, the one accent. That kind of noticing is exactly what a tool's accent and status colours are for.
- **Classic.**
  - Duncan & Humphreys, *Visual search and stimulus similarity*, Psychological Review 96(3):433–458, 1989, doi:10.1037/0033-295X.96.3.433 (**verified, abstract**, OpenAlex). Difficulty "increases with increased similarity of targets to nontargets and decreased similarity between nontargets, producing a continuum of search efficiency". Perceptual grouping allows "spreading suppression of similar nontargets". The abstract gives no ms-per-item numbers.
- **Modern statement.**
  - Wolfe, *Guided Search 6.0: An updated model of visual search*, Psychonomic Bulletin & Review 28:1060–1092, 2021, doi:10.3758/s13423-020-01859-9 (**verified, full text**, PMC8965574). It restates Duncan & Humphreys as the two "most basic principles": guidance is stronger with larger target–distractor differences "and … when the featural differences amongst distractors are smaller (DD similarity)". It adds that these rules are "a decent approximation but not a full account". Numbers in GS6:
    - basic feature search is "near (but typically a little greater than) 0 msec/item";
    - classic inefficient search runs about 90 ms/item on absent trials and half that on present trials;
    - eye-movement-paced search runs about 250–350 ms/item;
    - attention is redeployed "approximately 20 times per second".
- **The known vs unexpected split, measured.**
  - Haroz & Whitney, *How capacity limits of attention influence information visualization effectiveness*, IEEE TVCG 18(12):2402–2410, 2012, doi:10.1109/TVCG.2012.233 (**verified, full text**, Whitney lab PDF). The displays were grids of squares in up to 7 colours, randomly placed or grouped by colour. There were 5 subjects per experiment and 4,800 trials each.
    - Known target: "variety count had almost no impact on performance", and accuracy stayed over 95%. They cite Duncan & Humphreys' "very small performance cost of a few milliseconds per additional category".
    - Oddball (find whatever is unique): accuracy and RT "had a marked decline as variation increased" in random layouts. In grouped layouts, variety "did not affect RT or accuracy".
    - Counting categories at a glance: accuracy is near 100% at 1 variety, then falls off sigmoidally. Grouping gave "roughly 60% higher capacity".
    - Conclusion: "aim to reduce variety in the entire view rather than optimizing small regions".
    - RT values are only in figures, so they weren't extracted.
  - Giovannangeli, Giot, Auber & Bourqui, *Impacts of the Numbers of Colors and Shapes on Outlier Detection: from Automated to User Evaluation*, arXiv:2103.06084, 2021 (**verified, full text**; preprint, venue not confirmed). The task was to find an unknown outlier in an 8×8 random grid, with 21 analysed subjects.
    - With colour as the only cue, error stays low "until 7 #colors, where it dramatically increases", and RT grows "linearly related to #colors until the value 7".
    - "When color is not a relevant dimension … it has no significant effect on performance." So hue variety doesn't slow a search that runs on shape or text.
    - Redundant cues (colour plus shape): 0% errors and RT 1.9–3.4 s whatever the variety.
    - Conjunction targets: 41.1% errors, 15.5 s.
- **Implications for the page.**
  - The cost isn't "colour is noisy". Each extra hue in the chrome is a distractor for the one hue that has to pop. Colour carries only about seven categories before search breaks. Spending them on decoration leaves none for status.
  - Many hued labels are fine for finding a label you name. They hurt the glance that asks "is anything wrong here?". Grouping (sorting or grouping by label) wins most of the cost back, per Haroz & Whitney.
  - A redundant cue (a glyph or word with the colour) makes the target immune to variety, per Giovannangeli. That's another reason status colours come with their word, which `colour-means-one-thing` already requires.
- **Demo pair (one variable).** Use the same 20-row tracker with one overdue issue marked in the accent.
  - Prefer: label chips in one neutral fill with the label's colour as a 6 px dot (or no colour).
  - Avoid: each label chip filled in its own hue.
  - Task from the content: "Which issue is overdue?". Time it with no instruction about what to look for.
- **Eval check.**
  - Count distinct hue families among chrome elements with OKLCH C ≥ 0.03, excluding user content such as avatar photos. Flag more than 2 (accent and danger) outside data or content.
  - Report how many families sit in rows that repeat.
  - The 7 cap is a perception limit, not a target.

## 2. Interesting but irrelevant additions cost understanding

- **Mechanism.** Seductive details are "interesting but irrelevant adjuncts". They pull processing toward themselves (diversion) and load working memory with content that isn't the task. Telling people the details are irrelevant reduces the harm, which points to diversion over disruption.
- **Classic.**
  - Harp & Mayer, *How seductive details do their damage*, J. Educational Psychology 90(3):414–434, 1998, doi:10.1037/0022-0663.90.3.414 (**verified, abstract**, OpenAlex). Across 4 experiments, readers with seductive details "recalled significantly fewer main ideas and generated significantly fewer problem-solving transfer solutions". Highlighting, objectives and signalling "did not reduce the seductive details effect". Placing the details at the beginning "exacerbated" the effect.
- **Meta-analyses.**
  - Rey, *A review of research and a meta-analysis of the seductive detail effect*, Educational Research Review 7(3):216–237, 2012, doi:10.1016/j.edurev.2012.05.003 (**verified, abstract**, ERIC). It covers 39 experimental effects of text, illustrations and other details: "small to medium (retention performance) and medium (transfer performance) effects". The abstract gives no d values.
  - Sundararajan & Adesope, *Keep it Coherent: A Meta-Analysis of the Seductive Details Effect*, Educational Psychology Review 32:707–734, 2020, doi:10.1007/s10648-020-09522-4 (**verified, abstract**, ERIC). Including seductive details "can hinder learning". Moderators include "image type used in comparison, delivery format … learner pacing". The abstract gives no effect size.
    - WSU press release, 19 Mar 2020 (first-party, not the paper): "58 studies involving more than 7,500 students". The effect was worse "when the seductive detail was placed next to informative and relevant diagrams", and worse when it was "constant, such as a static joke or image on a screen". Most studies used "six to 12 minutes" sessions.
    - g = −0.33 is **secondary** (an ACU summary page only).
  - Wu, Wang, Cheng & Wang, *Seductive Details, Cognitive Load, and Academic Achievements: A Multi-level Meta-analysis and MASEM*, AERA 2026 paper (**verified, conference abstract**). There are "177 effect sizes from 50 studies" and a "small but significant negative effect … (g = -0.16)". Extraneous cognitive load is "the primary mediator". They "support minimizing decorative elements". The journal version wasn't found.
- **Recent mechanism test.** Kienitz, Krebs & Eitel, *Seductive details hamper learning even when they do not disrupt*, Instructional Science, 2023 (**verified, abstract**, ERIC). N = 247. Without a prompt, people "regarded seductive details as more relevant and consequently spent more time processing them", and that lowered recall. The authors conclude for "diversion, and not disruption".
- **The counterweight for pictures.** Lenzner, Schnotz & Müller, *The role of decorative pictures in learning*, Instructional Science 41:811–831, 2013, doi:10.1007/s11251-012-9256-z (**verified, abstract**, ERIC). Three experiments with grades 7–8.
  - Eye tracking: decorative pictures get "only a bit initial attention … and are largely ignored afterwards".
  - They "induce better mood, alertness and calmness" and "reduced perceived difficulty".
  - Learning was "neither harmful nor beneficial", but decorative pictures weakened the benefit of instructional pictures, especially for low prior knowledge.
- **Evidence in interfaces specifically.** No study was found testing a decorative illustration on a sign-up or form against a plain one. The closest is §4 (Burke et al. 2005). The seductive-details literature is about learning materials, with sessions of 6–12 minutes.
- **Implications for the page.**
  - The cost is real but small: g somewhere between −0.16 (newest, broadest) and "medium" (Rey). Don't oversell it.
  - Static, adjacent and first-seen details cost the most. That's the sign-up hero: a static illustration with slogans, beside the form, seen first.
  - The words cost more than the picture. The pictures are mostly ignored after a glance (Lenzner); the slogans get read (diversion, Kienitz). Mood and perceived ease are the real benefit, and they're bought with attention, not with space next to the form.
- **Demo pair.** The same sign-up form. Prefer the form alone on a plain surface. Avoid the same form beside a half-screen illustration with two slogans. Task: "Create an account". Measure time to first keystroke in the first field. **No source predicts the size of this gap; the demo must measure it.**
- **Eval check.**
  - Share of the first viewport taken by elements with no role (WCAG "pure decoration", §7): images with `alt=""` or `aria-hidden`, CSS background images, text the task never needs.
  - Count of headline-sized text blocks that aren't the page's title or a control label.

## 3. First impressions: complexity costs much more than colour, and colour has a sweet spot

- **Mechanism.** Appeal is judged in 17–50 ms, before anything is read. **Visual complexity** drives it much more than colourfulness. Too complex costs a lot, too plain costs little. Colourfulness follows a flat inverted U, and people liked fairly colourful sites best. So "less colour looks better" is false for first impressions. The argument against colour in tools has to come from search and meaning (§1), not taste.
- **Speed.**
  - Lindgaard, Fernandes, Dudek & Brown, *Attention web designers: You have 50 milliseconds to make a good first impression!*, Behaviour & IT 25(2):115–126, 2006, doi:10.1080/01449290500330448 (**verified, abstract**, OpenAlex). Ratings at 50 ms and 500 ms were "highly correlated". The abstract gives no r value.
  - Tuch, Presslaber, Stöcklin, Opwis & Bargas-Avila, *The role of visual complexity and prototypicality regarding first impression of websites*, IJHCS 70(11):794–811, 2012, doi:10.1016/j.ijhcs.2012.06.003 (**verified, abstract**, Google Research page). 119 screenshots. Complexity still affected appeal at 17 ms, and prototypicality caught up with longer exposure. "Overall, websites with low VC and high PT were perceived as highly appealing." Here VC is visual complexity and PT is prototypicality: looking like what that kind of site usually looks like.
- **Numbers.**
  - Reinecke, Yeh, Miratrix, Mardiko, Zhao, Liu & Gajos, *Predicting users' first impressions of website aesthetics with a quantification of perceived visual complexity and colorfulness*, CHI 2013, doi:10.1145/2470654.2481281 (**verified, full text**, Gajos lab PDF).
    - 450 websites. 306 participants built the models (colourfulness R² = .78, complexity R² = .65), and 242 rated appeal after 500 ms.
    - The appeal model explains 48% (adj. R²), including quadratic terms.
    - "the perceived colorfulness only plays a minor role". "a high visual complexity results in the largest decrease in appeal, but websites with low levels of complexity are similarly liked to those with a medium complexity".
    - Hasler & Süsstrunk's metric correlates with rated colourfulness and stayed in the final model. Their model "overestimate[s] the influence of bright colors".
  - Reinecke & Gajos, *Quantifying Visual Preferences Around the World*, CHI 2014, doi:10.1145/2556288.2557052 (**verified, full text**, Harvard IIS PDF). This upgrades the "secondary" entry in `2026-10-27-colour-system.md` §7.
    - 2.4 million ratings from nearly 40 thousand people.
    - Complexity: appeal peaks at 4.2 of 10. Peak vs low complexity gives d = 0.6, and peak vs high gives d = 2.0.
    - Colourfulness: appeal "peaks at a colorfulness of 6.1 (of 9)". The peak vs low and high difference is only d = 0.3 and d = 0.8. "colorfulness is an overall less informative predictor for appeal than complexity."
    - Females liked colourful sites more, and higher education lowered that preference.
- **Implications for the page.**
  - Be honest: first-impression data favour moderate-to-high colourfulness and punish complexity. A marketing page can be colourful. The eval's real fault is complexity (many regions, slogans, invented brand furniture), and colour adds to complexity when it adds regions.
  - Prototypicality (Tuch 2012) gives a reason a tool should look like a tool: an issue tracker that looks like other trackers is judged better at a glance.
- **Demo pair.** Same content, same palette. Prefer few regions. Avoid the same colours split across more regions (tinted sidebar, tinted header, a hero panel). This isolates complexity from colour.
- **Eval check.** Complexity first: count regions with distinct backgrounds, and measure edge density (Rosenholtz 2007, §5). Colourfulness second (§5). Pair both with the task, not taste.

## 4. A graphic the eye avoids still costs time

- **Mechanism.** People learn where the non-task graphics are and avoid them, but the graphics still slow the search beside them. A grey box of the same size costs less. This differs from banner blindness (people don't look): the point here is that not looking isn't free.
- **Finding.** Burke, Hornof, Nilsen & Gorman, *High-cost banner blindness: Ads increase perceived workload, hinder visual search, and are forgotten*, ACM TOCHI 12(4):423–445, 2005, doi:10.1145/1121112.1121116 (**verified, full text**, author-hosted PDF).
  - Experiment 2, exact-match headline search, 24 participants: gray rectangles 2,040 ms, static banners 2,169 ms, animated 2,193 ms. Both banner types were slower than gray (p < .005), and equal to each other (p = .65). That's about 6% slower, roughly 130 ms per search.
  - In the harder semantic search the difference wasn't significant (6,065 vs 6,210 vs 6,110 ms).
  - "Gray banner 'placeholders' were fixated as frequently as commercially-designed banners." So the cost came from the graphic's content, not from looking at it.
  - Experiment 1 found no reliable search-time difference, except that a target "sandwiched between two flashing text banners" took 75% (4.3 s) longer. Flashing text gave the highest NASA-TLX workload.
- **Implications for the page.** Swapping a decorative panel for a quiet surface of the same size is the right control, and it still buys about 6% on simple searches. Cite the number as the size it is, not as a headline.
- **Demo pair.** The tracker with its sidebar in a neutral surface vs a tinted surface with coloured team icons. Task: find a named issue. Expect a small gap; the demo is about honesty of size.
- **Eval check.** Share of the viewport, outside the task region, whose pixels have OKLCH C > 0.03 or come from an image.

## 5. A number a screenshot can be checked against

- **Colourfulness.** Hasler & Süsstrunk, *Measuring colourfulness in natural images*, Proc. SPIE 5007:87–95, 2003, doi:10.1117/12.477378 (**verified, full text**, EPFL Infoscience PDF via its API).
  - The experiment: 20 non-expert viewers rated 84 images from 10 scenes into 7 categories, with chroma reduced linearly in CIELab.
  - The sRGB metric: rg = R − G, yb = ½(R + G) − B. **M = √(σ²rg + σ²yb) + 0.3 · √(μ²rg + μ²yb)**, with a correlation of 95.3% with the ratings.
  - Table 2, the bands for this metric: not colourful 0, slightly 15, moderately 33, averagely 45, quite 59, highly 82, extremely 109.
  - Two caveats. It was calibrated on natural photographs, not interfaces. And it "ignored any issues related to hue", so it can't count hues.
- **Clutter.** Rosenholtz, Li & Nakano, *Measuring visual clutter*, Journal of Vision 7(2):17, 2007, doi:10.1167/7.2.17 (**verified, abstract**, Europe PMC).
  - Feature Congestion rests on "the more cluttered a display … the more difficult it would be to add a new item that would reliably draw attention". In other words, clutter is measured as the room left for an accent.
  - It correlates "well with search performance in complex imagery".
  - "color variability, accounted for by Feature Congestion but not the Edge Density measure or the Subband Entropy measure, does matter for visual clutter."
  - MATLAB code: DSpace@MIT, hdl:1721.1/37593 (**verified**, record read). A Python port is `visual-clutter` 1.0.7 on PyPI (community port, not evidence).
- **Computed on synthetic 1280×800 tool screens** (white ground, zinc text bars, one blue button; M3 as above):

  | Screen | M |
  | --- | --- |
  | Neutral, one blue button | 13.5 |
  | + grey chips and grey avatars | 13.5 |
  | + 18 chips in 8 hues | 19.3 |
  | + hued avatars | 22.9 |
  | Neutral + lavender sidebar `#f3edf7` | 14.2 |
  | Chips + avatars + lavender sidebar | 23.5 |
  | Half-screen violet→pink gradient | 98.2 |

  - Hasler's M catches large saturated areas (illustrations, gradients) and, weakly, many hued chips. It hardly sees a pale tinted panel.
  - The panel isn't high-chroma. `#f3edf7` is OKLCH L 0.954, C 0.0147, h 312, the same chroma as Tailwind zinc-600 `#52525b` (C 0.0146), though at a lightness where it reads as lavender.
  - A tint needs its own check: area of light surfaces with C > 0.008.
- **Measured on the eval's first screenshots** (1280×800, `~/code/ui-playbook-eval-runs/<task>/<arm>-<n>.run/shots/01-*.png`, arm a = without Skill, b = with):

  | Task, run | M | Tinted light surface (L > 0.85, C > 0.008) | Hue families (C > 0.03, 30° bins, ≥ 0.02% of screen) |
  | --- | --- | --- | --- |
  | sign-up a-1 / a-2 | 24.5 / 17.4 | 39% / 45% | 5 / 5 |
  | sign-up b-1 / b-2 | 23.7 / 33.2 | 10% / 35% | 6 / 7 |
  | tracker a-1 / a-2 | 4.7 / 6.1 | 5% / 9% | 6 / 5 |
  | tracker b-1 / b-2 | 7.9 / 4.7 | 4% / 7% | 3 / 1 |
  | delete dialog, all four | 5.8–10.7 | 0.3–5% | 2–3 |

  - Every sign-up lands in Hasler's "slightly" to "moderately" band, because white space dominates the average.
  - The tracker's pastel chips (visible in b-1) mostly fall under C 0.03, so the pixel hue count under-reads them.
  - **Use a DOM check, not pixels, for hues.** Read the computed `background-color`, `color` and `border-color` of visible elements, convert to OKLCH, and cluster hues for C ≥ 0.02. Sum the area of elements whose background has C > 0.008. Use pixel M only to catch big images and gradients (flag M > 33, "moderately colourful", for a tool screen). These thresholds are **uncalibrated proposals**; check them against the owner's blind picks before relying on them.

## 6. Large tinted and many-coloured surrounds change how the accent looks

- **Mechanism.** A colour looks "much more vivid and richly colored against low-contrast, gray surrounds than against high-contrast, multicolored surrounds". So the same accent reads weaker in a colourful screen than in a grey one. Later work narrows this down: the effect is local, and strongest when the target is close in colour to its surround.
- **Findings.**
  - Brown & MacLeod, *Color appearance depends on the variance of surround colors*, Current Biology 7(11):844–849, 1997, doi:10.1016/S0960-9822(06)00372-1 (**verified, abstract**, Europe PMC). Changing only the variance of the surround, not its mean, "induces a complementary shift in the perceived contrast and saturation of the test spot's color". Quoted above for vividness.
  - Faul, Ekroll & Wendt, *Color appearance: The limited role of chromatic surround variance in the "gamut expansion effect"*, Journal of Vision 8(3):30, 2008, doi:10.1167/8.3.30 (**verified, abstract**). The effect "diminishes rapidly with increasing color contrast between target and surround". The amount and layout of surround variance play "but a very limited role". The effect "is mainly local", and comparing two uniform surrounds gives "basically the same effect".
  - Ekroll & Faul, *Basic characteristics of simultaneous color contrast revisited*, Psychological Science 23(10):1246–1255, 2012, doi:10.1177/0956797612443369 (**verified, abstract**). The induced shift goes along "the vector from surround to target and not … by the hue complementary to that of the surround". Its size depends on the target–surround difference.
  - Ratnasingam & Anderson, *What predicts the strength of simultaneous color contrast?*, Journal of Vision 17(2):13, 2017, doi:10.1167/17.2.13 (**verified, abstract**). Induction "is larger for larger differences between chromatic targets and surrounds of the same hue". The result is consistent with the direction law.
- **What this does and doesn't support.**
  - It supports a grey, low-contrast ground making the one accent look most vivid. That's Brown & MacLeod, kept by Faul et al. 2008 for low target–surround contrast, which describes a pale accent tint or chip.
  - It doesn't support a claim that a pale tinted panel "dulls" a saturated accent placed on it. The effect fades with target–surround contrast, and no study tested UI panels.
  - The stronger argument against the tinted panel is §1: a large area in the accent's hue family lowers target–distractor difference for every accent mark near it. That's an inference from Duncan & Humphreys, not a tested UI result.
- **Demo pair.** One accent chip, shown as the same chip on a neutral grey card and on a card among six pastel chips of other hues. Show it side by side, static. This is a perception demo, not a task.
- **Eval check.** None beyond §1 and §5. Don't build a check on this mechanism.

## 7. Decoration, by the accessibility definition, carries no information

- **WCAG 2.2** (https://www.w3.org/TR/WCAG22/, **verified**). "Pure decoration" is defined as "serving only an aesthetic purpose, providing no information, and having no functionality". The note: "Text is only purely decorative if the words can be rearranged or substituted without changing their purpose." SC 1.1.1 asks that such content be "implemented in a way that it can be ignored by assistive technology". SC 1.4.3 exempts text that is "pure decoration" from contrast.
- **WAI Images tutorial, Decorative images** (https://www.w3.org/WAI/tutorials/images/decorative/, **verified**). Decorative images "don't add information to the content of a page" and get `alt=""`. The categories include "Illustrative of adjacent text but not contributing information ('eye-candy')". "Whether to treat an image as decorative or informative is a judgment that only the author can make". The technique is H67: null alt and no title.
- **Implications for the page.**
  - A usable test: **if a screen reader user loses nothing when it's skipped, sighted users are paying for it with attention and space only.** Swap test for copy: "Big ideas. Beautiful beginnings." could be replaced by any other slogan without changing its purpose, so by W3C's own note it's decoration.
  - That gives the eval a definition it can compute from the DOM (`alt=""`, `aria-hidden="true"`, `role="presentation"`, CSS background images) instead of a judge's taste.

## 8. Where decoration and colour do pay (the counterweight)

- **Aesthetic-usability, original.**
  - Kurosu & Kashimura, *Apparent usability vs. inherent usability*, CHI '95 Companion, doi:10.1145/223355.223680 (**verified, abstract**, OpenAlex): "the apparent usability is strongly affected by the aesthetic aspects rather than the inherent usability". The number of ATM layouts and participants and the r values are **unverified** (ACM PDF blocked).
  - Tractinsky, Katz & Ikar, *What is beautiful is usable*, Interacting with Computers 13(2):127–145, 2000, doi:10.1016/S0953-5438(00)00031-X (**verified, abstract**, OpenAlex). This upgrades R6 in `2026-10-27-human-modern-references.md`. Aesthetics "affected the post-use perceptions of both aesthetics and usability, whereas the degree of actual usability had no such effect."
- **Weakened since.**
  - Hassenzahl & Monk, *The inference of perceived usability from beauty*, Human–Computer Interaction 25(3):235–260, 2010, doi:10.1080/07370024.2010.500139 (**verified, abstract**). A review of 25 correlations found "remarkably high variability". The beauty–usability link "has been overplayed": the correlation "is wholly mediated by goodness", across four data sets.
  - Tuch, Roth, Hornbæk, Opwis & Bargas-Avila, *Is beautiful really usable?*, Computers in Human Behavior 28(5):1596–1607, 2012, doi:10.1016/j.chb.2012.03.024. **Secondary** (search snippets; abstract not reached). With 80 participants and a 2×2 online shop, aesthetics did not affect perceived usability, but poor usability lowered perceived aesthetics after use.
  - Thielsch, Haines & Flacke, *Experimental investigation on the effects of website aesthetics on user performance in different virtual tasks*, PeerJ 7:e6516, 2019, doi:10.7717/peerj.6516 (**verified, abstract**, Europe PMC). N = 331. Aesthetics showed "neither significant main effects … on performance regarding both accuracy and response times" in search, creative or transfer tasks.
- **Where it did help performance.** Sonderegger & Sauer, *The influence of design aesthetics in usability testing*, Applied Ergonomics 41(3):403–410, 2010, doi:10.1016/j.apergo.2009.09.002 (**verified, abstract**). With 60 adolescents on a simulated phone, the appealing version gave "reduced task completion times". This is one study with a young sample.
- **Where emphasis pays.** M3 Expressive research (by reference, R1; Google measuring Google): the enlarged, prominently placed Send button was found "up to four times faster". That's emphasis spent on **the one target**, the opposite of colour spread across everything. Its own limit: removing text labels from email actions reduced usability.
- **Where decorative pictures pay.** Lenzner et al. 2013 (§2): better mood, alertness and calmness, and lower perceived difficulty, at no learning cost. Reinecke & Gajos 2014 (§3): a fairly colourful page is the best-liked first impression.
- **Implications for the page.** Decoration pays in **mood, first impression and perceived ease**, and the evidence for it raising task performance is mixed (one yes, one null at N = 331). Spend it where the job is the impression: a welcome screen, an empty state, a marketing page, or one moment per flow. Don't spend it on the working surface or beside the form.

## 9. What the design systems and product teams say

- **Apple HIG, *Branding*** (https://developer.apple.com/design/human-interface-guidelines/branding, JSON source read; change log "September 9, 2026: Refined guidance for using brand color"). **Verified.**
  - "Apply your app's accent color judiciously. Using your brand color too broadly can overwhelm your interface and dilute its impact."
  - "Minimize its use on controls and instead use it intentionally for primary actions or status indicators, like badges for unread content or an icon for the selected tab".
  - "Ensure branding always defers to content. Using screen space for an element that does nothing but display a brand asset can mean there's less room for the content people care about."
  - "Resist the temptation to display your logo throughout your app".
- **Apple HIG, *Color*** (JSON source read; change log to December 16, 2025). **Verified.**
  - On Liquid Glass: "Apply color sparingly to the Liquid Glass material". "Refrain from adding color to the background of multiple controls."
  - "too much color can be overwhelming and make control labels more difficult to read. If your app features colorful backgrounds or visually rich content, prefer a monochromatic appearance for toolbars and tab bars".
  - "By contrast, in apps with primarily monochromatic content or backgrounds, choosing your brand color as the app accent color can be an effective way".
  - visionOS: "Use color sparingly, especially on glass."
  - The phrase "use color sparingly" appears only for visionOS. For iOS and macOS, the restraint wording is on Liquid Glass and in *Branding*.
- **Fluent 2, *Color*** (https://fluent2.microsoft.design/color, re-read 2026-10-28). **Verified.** "The neutral palette consists of the black, white, and grays that ground an interface." "Use shared colors sparingly to accent and highlight important areas of an interface." Semantic colours: "Don't use them for decoration". "Avoid overusing brand colors or using them on large surfaces as they can dilute a hierarchy". No proportion or ratio is given.
- **IBM Carbon, *Color overview*** (https://carbondesignsystem.com/elements/color/overview/). **Verified.** "The neutral gray family is dominant in the default themes, making use of subtle shifts in value to organize content into distinct zones. The core blue family serves as the primary action color across all IBM products and experiences. Additional colors are used sparingly and purposefully."
- **Atlassian, *Color*** (https://atlassian.design/foundations/color). **Verified.** "Neutral colors apply to most backgrounds, text, and shapes in our experiences." "Saturated colors can infuse meaning to an experience, highlight UI, or create associations with similar colored UI." "Don't use an accent when the color has semantic meaning." It recommends "a subtle neutral background to indicate state changes".
- **GitHub Primer, *Color usage*** (https://primer.style/product/getting-started/foundations/color-usage/). **Verified.** "The first six steps of the neutral scales are typically used for background colors." "Semantic colors are typically used to communicate status, action, or emphasis. Each semantic color is tied to a role with a specific meaning." Muted fills give "a subtle emphasis".
- **Material 3** (by reference, `2026-10-27-colour-and-unread.md` §4). Surface is "for backgrounds and large, low-emphasis areas", and primary is "for the most prominent components".
  - **Measured** in `@material/web` 2.3.0, `tokens/v0_192`: the baseline light `surface` is `neutral98` `#fef7ff` and `surface-container` is `neutral94` `#f3edf7`, with `primary40` `#6750a4`.
  - Material's own default surfaces are lavender-tinted. A model that reaches for "Material defaults" lands on a lavender panel. That cause is **unverified for the eval runs**; it's a plausible source, not a finding.
- **Linear, 2024** (by reference, `2026-10-27-colour-system.md`; wording re-checked 2026-10-28). They "adjusted the sidebar, tabs, headers, and panels to reduce visual noise". For a "neutral and timeless appearance" they were "limiting how much chrome (blue in our case) was used in the calculations applied to our color system".
- **Linear, 2026.** *A calmer interface for a product in motion*, Charlie Aufmann & Maxime Heckel, 12 Mar 2026, https://linear.app/now/behind-the-latest-design-refresh, and the changelog entry *UI refresh*, https://linear.app/changelog/2026-03-12-ui-refresh. **Verified.**
  - Section heading: "Don't compete for attention you haven't earned".
  - "not every element of the interface should carry equal visual weight", and parts for orientation and navigation "should recede".
  - "The navigation sidebar used to appear bright enough that it remained visually prominent even after a user had reached their destination." In the update "it's a few notches dimmer".
  - "The refresh reduces icon usage, scales their sizes down, and removes unnecessary visual treatments like colored team icon backgrounds."
  - Palette: from "a cool, blue-ish hue" toward "a warmer gray that still feels crisp, but less saturated". "Go too warm, though, and the interface risks looking muddy".
  - Changelog: "Introducing a calmer, more consistent interface", "easier to scan information … and stay focused".
- **Not found.** No first-party Vercel (Geist) or Stripe guidance on colour **amount** or decoration was found in this pass. Stripe's 2019 colour post is about contrast. Leave both out.
- **Implications for the page.** Five systems agree that neutrals carry the screen and that hue is reserved for action, status and meaning. Apple and Fluent name the cost ("dilute its impact", "dilute a hierarchy"). Linear's 2026 refresh is the closest reference product doing exactly the eval's fix: a dimmer sidebar, no coloured team icon backgrounds, fewer icons. None gives a ratio, so don't cite "60-30-10" (no primary source, per `2026-10-27-colour-system.md`).

---

## Not verified, kept off pages

- Duncan & Humphreys 1989 ms-per-item values and their "few milliseconds per category". Only Haroz & Whitney's citation of it was read.
- Haroz & Whitney 2012 RT values (figures only). Giovannangeli et al. is a preprint; its journal venue wasn't confirmed.
- Rey 2012 d values for retention and transfer. Sundararajan & Adesope 2020 g = −0.33 and its moderators' g values (ACU summary only). The journal version of Wu et al. 2026, and the ECNU news figure of 20,683 students.
- Lindgaard 2006 correlation values. Kurosu & Kashimura 1995 sample and r values.
- Tuch et al. 2009 (*Visual complexity of websites: effects on … performance, and memory*, IJHCS 67:703): abstract not reached, so its search-time and memory results are secondary.
- Tuch, Roth et al. 2012 (*Is beautiful really usable?*): search snippets only.
- Any study of decorative illustrations on sign-up pages or forms, rather than learning materials or ads: none found.
- Whether a pale tinted panel reduces a saturated accent's distinctness (§6): inference.
- That the eval's lavender panels came from Material's baseline tokens: plausible, untested.
- The eval-check thresholds (M > 33, C > 0.008 tint area, C ≥ 0.02 hue clusters, more than 2 hue families): uncalibrated.

## The strongest mechanisms for the page, ranked

1. **Variety hurts the unexpected, not the known** (Haroz & Whitney 2012; Giovannangeli 2021; Duncan & Humphreys 1989 via GS6). Colour has about 7 usable categories. Hue variety in random layouts breaks oddball search, while known-target search is "almost" unaffected and grouping removes the cost. This is the counterintuitive core, and it explains why the tracker's rainbow chips hide the one thing that matters.
2. **Neutral chrome is the consensus, and Linear just shipped it** (Apple Branding 2026, Fluent, Carbon, Atlassian, Primer; Linear 2026: dimmer sidebar, "removes … colored team icon backgrounds"). It's first-party and current, but gives no ratio.
3. **Complexity, not colour, drives the 50 ms judgement** (Reinecke 2013/2014, Tuch 2012). Complexity: peak vs high d = 2.0. Colourfulness: peak at 6.1 of 9, d = 0.3–0.8. It's honest, it blocks "colour is ugly", and it moves the argument to regions and task.
4. **Seductive details cost a little, mostly through the words** (Harp & Mayer 1998; Rey 2012; Wu et al. 2026, g = −0.16; Kienitz 2023, diversion; Lenzner 2013, pictures ignored but mood up). Pair it with Burke 2005: a graphic you avoid still costs about 6% (2,169 vs 2,040 ms) against a grey box. Small effects, stated at their size.

Use §7 (WCAG "pure decoration" and its swap test) as the page's working definition, and §8 for "When it doesn't apply": welcome screens, empty states, marketing pages, content colour.
