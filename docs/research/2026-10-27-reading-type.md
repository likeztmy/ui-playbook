# Reading type: a reading face is not a UI face

Research for topic T4 in `2026-10-27-human-modern-references.md`. The claim: text that is read at length (a mail body, an article) needs its own size, measure (line length), leading (line height) and perhaps face, while interface text (labels, list rows, menus) needs compactness and scanning. Post already splits the two: the conversation column is `max-width: 760px`, body prose is 15px/25px (`src/demos/post/Blocks.module.scss`), the subject is 26px, and list rows are 14px/20px (`src/demos/post/List.module.scss`).

Not repeated here:
- Font-swap layout shift is covered by `src/pages/principles/nothing-shifts.mdx`.
- Spacing ratios are covered by `space-groups-by-ratio`.
- Text contrast and APCA are in `2026-10-27-colour-system.md`; positive-polarity summaries are in `2026-10-27-colour-and-unread.md`.
- Optical-size masters (Sitka Small vs Banner) are backlog #20, *Small text needs different shapes* (`2026-10-25-topic-backlog.md`). §5 only says how they relate to this topic.

**Labels.**
- **Verified**: read in the primary source this session (the paper's full text, the spec or the design system's own page or source code).
- **Secondary**: known only from an abstract on a non-publisher page, a search snippet, or a summary by someone other than the author.
- **Unverified**: from memory or inference. Keep it off pages.
- **Measured**: taken in the browser on the live site (https://ui-playbook.suspense.site, 2026-10-26, 1440×900 viewport) with the Range API and canvas `measureText`, using the site's own Geist Variable.
- **Computed**: worked out here from published numbers, with the assumptions stated.

R8 (Rello et al. 2016) was **secondary** in the earlier note. The full paper was read this session from the author's site, so it is now **verified**.

---

## 1. Line length (measure)

### Where "45–75 characters" comes from

- Robert Bringhurst, *The Elements of Typographic Style*, §2.1.2, as reproduced in Richard Rutter's adaptation, http://webtypography.net/2.1.2. **Verified** (quoted text):
  - "Anything from 45 to 75 characters is widely regarded as a satisfactory length of line for a single-column page set in a serifed text face in a text size."
  - "The 66-character line (counting both letters and spaces) is widely regarded as ideal."
  - Multi-column: "40 to 50 characters."
- The rule cites no experiment. It is a convention ("widely regarded"), and its scope is serif text on a printed page.
- Older print research (Tinker) points the same way. Dyson 2004 reports that Rayner and Pollatsek read Tinker's data as an optimum of 52 characters per line, and that Spencer (1968) advised "not exceed about 70" (Dyson 2004, below). Tinker's own studies are not read here.

### Screen evidence: speed, comprehension and preference come apart

- **Dyson 2004 review.** Mary C. Dyson, *How physical text layout affects reading from screen*, Behaviour & Information Technology 23(6):377–393, doi:10.1080/01449290410001715714. Full text: https://stu.westga.edu/~ssynan1/literacy/Dyson.pdf. **Verified.**
  - Characters per line is "the critical variable", not physical width.
  - Dyson & Kipping 1998a (48 participants, 10 pt Arial, 25–100 cpl): "the longest line read faster than the shortest line tested". Scrolling time does not fully account for the difference.
  - Speed: "Although longer line lengths may be read faster, people prefer a more moderate length."
  - Preference (Dyson & Kipping): "A medium line length of 55 characters per line was rated as easiest to read, but was not read the fastest." Readers' perceptions "did not correlate with their performance".
  - Comprehension: Dyson & Haselgrove 2001 found "55 characters per line producing better comprehension scores than the longest line length (100 characters per line)", with "no speed-accuracy trade-off".
  - Upper limit: Bernard et al. 2002 found no speed gain at 132 cpl. "Studies to date have not identified a limit."
  - Leading and measure: long lines "are said to need more interlinear spacing", but "this has not been explored and limited studies from the early 1980s are inconclusive."
- **Dyson & Haselgrove 2001**, *The influence of reading speed and line length on the effectiveness of reading from screen*, IJHCS 54:585–612, https://doi.org/10.1006/ijhc.2001.0458. The paper itself was not reachable (publisher 403; the author-copy link is dead). Its results above come from Dyson's own 2004 review, which is **verified**. A summary on a non-author page says 55 cpl was also read faster than short lines. That part is **secondary**.
- **Dyson 2021, author's own update.** *Line length revisited: following the research*, Design Regression, 8 Sep 2021, https://designregression.com/article/line-length-revisited-following-the-research. **Verified.**
  - On screen studies: "in no case were long lines read more slowly than shorter lines."
  - The classic print study is flawed: Tinker & Paterson 1929 "failed to separate the potential effects of the line length from effects of the content of the texts."
  - On preference: "A moderate line length is preferred which would also be the most familiar format."
  - Return sweeps. After the long jump to the next line, the eye often lands short. That "undersweep" fixation lasts "about 130 ms rather than 250 ms", and words are still processed during it. This line of work is Slattery, Parker and colleagues, 2019–2021 (*Psychonomic Bulletin & Review* 26(6); *Vision Research* 183). It is cited by Dyson; the papers were not read here, so treat it as **secondary**.
  - Her conclusion is cautious: "I am hesitant to unreservedly recommend their use on screen to support efficient reading." She means long lines.
- **Shaikh 2005**, *The effects of line length on reading online news*, Usability News 7(2). **Secondary** (summary only, https://www.researchgate.net/publication/253615156_The_Effects_of_Line_Length_on_Reading_Online_News). Reported: 20 students; 35/55/75/95 cpl; 95 cpl was read fastest; no comprehension effect; preferences split between the shortest and longest lines.
- **Schneps et al. 2013**, *Shorter lines facilitate reading in those who struggle*, PLoS ONE 8(8):e71161, https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0071161. **Verified** (page text).
  - 27 high-school students with dyslexia. Glyph size was matched in visual angle.
  - About 12.7 cpl (iPod) vs 67.2 cpl (iPad). The short lines were read about 27% faster, with about half the regressions. Comprehension did not fall.
  - This is the counterweight to "long lines are fine": for readers who struggle, short lines help.
- **2015+ screen studies of line length.** Several searches found no well-powered post-2015 experiment on Latin text, desktop or mobile, that varies characters per line and measures comprehension. The 2019–2021 return-sweep work studies the mechanism, not settings. **This is a real gap.** Pages should say the evidence is old and mixed, and should not cite a modern number that doesn't exist.

**Summary.**
- On screens, speed tends to rise up to about 100 cpl.
- Comprehension was best at about 55 cpl in the one study designed to detect it.
- Preference is moderate and tracks familiarity.
- "45–75" is a print convention that happens to sit inside the comprehension and preference zone.

### The `ch` unit is not a character (measured)

- **CSS Values 4 §6.1.1**, https://www.w3.org/TR/css-values-4/. **Verified.** `ch` is "the used advance measure of the "0" (ZERO, U+0030) glyph". The `ic` unit uses "水" for CJK.
- **Measured** in Geist at 15px:
  - "0" is 9.94–10.06 px wide (0.66–0.67 em).
  - The average character of real English prose (3,464 characters of the playbook's own *Nothing shifts* page, spaces included) is 6.73 px (0.449 em).
  - So **1ch ≈ 1.48 average characters**, and `max-width: 68ch` ≈ 45 em ≈ **101 characters of prose**.
- Geist's figures are wide, so "68ch" sounds like a reading measure but sets close to the 100-cpl condition that lost on comprehension in Dyson & Haselgrove 2001.
- For comparison at 16px: Georgia's average character is 6.93 px and Arial's 7.01 px (measured). The ch-to-character ratio depends on the face.

---

## 2. Line height (leading) and letter spacing

### Rello, Pielot & Marcos 2016

*Make It Big! The Effect of Font Size and Line Spacing on Online Readability*, CHI '16:3637–3648, https://doi.org/10.1145/2858036.2858204. Full text from the second author's site: https://pielot.org/pubs/Rello2016-Fontsize.pdf. **Verified.**

- **Set-up:**
  - 104 participants, aged 14–54 (mean 30). Spanish Wikipedia articles in Arial.
  - Tobii 1750 eye tracker with a 17-inch, 1024×768 monitor, at about 60 cm.
  - Line spacing 0.8 / 1.0 / 1.4 / 1.8 × Firefox's default, which "equals 120%". In CSS terms that is line-height 0.96, 1.2, 1.68 and 2.16.
  - Line spacing was between-subjects (24–29 people per group). Font size was within-subjects.
  - Line length was not controlled: "we used a fixed line length, as the browser window was maximized". So characters per line fell as size rose.
- **Line-spacing results:**
  - No effect on mean fixation duration: F(3, 89) = 0.064, p = .978. Means were .224 / .220 / .220 / .223 s.
  - Comprehension was lower at 0.8 than at every other spacing.
  - Subjective comprehension was higher at 1.0 than at 1.8.
  - The authors' recommendation: "it is best not to deviate too much from the standard line spacing (1.0)", while "the widely used 1.5 spacing … might be equally well."
- **Reading.** Between CSS line-height of about 1.2 and 1.7, these data can't tell settings apart. Only the extremes hurt (0.96 hurts comprehension; 2.16 feels worse). Leading is a weak lever for single paragraphs at a fixed, wide measure.

### What leading is for: the return sweep (synthesis)

- Dyson 2004 (**verified**) frames line length as a trade-off between information per fixation and "difficult" return sweeps. She notes that more interlinear space "might help in more accurate return sweeps" but is untested.
- Slattery & Vasilev 2019 (via Dyson 2021, **secondary**): bolding the first word of each line made return sweeps more accurate but did not make reading faster.
- Apple HIG *Typography* (**verified**, below) states the design rule directly:
  - "when you display text in wide columns or long passages, more space between lines (loose leading) can make it easier for people to keep their place while moving from one line to the next."
  - For "a list row — decreasing the space between lines (tight leading) can help the text fit well."
- **Inference (unverified as a tested claim):** leading serves the trip back to the start of the next line. A one-line list row has no trip back, so tight leading costs it nothing. A long measure has the longest trip, so it needs the most leading. That is why the right leading depends on the measure, not on the font size alone.

### WCAG text-spacing values and where they come from

- **SC 1.4.12 Text Spacing (AA)**, https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html. **Verified.**
  - Content must survive a user override to line height 1.5×, paragraph spacing 2×, letter spacing 0.12× and word spacing 0.16× the font size.
  - These are minimums the page must *tolerate*, not values it must use.
  - Origin: "The grounds for this SC are based on research". The metrics "are based on the McLeish study" (2007; letter spacing from .04 to .25 em, where reading speed "started to flatten at .20"), as translated by Wayne Dick.
- **SC 1.4.8 Visual Presentation (AAA)**, https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html. **Verified.**
  - "Width is no more than 80 characters or glyphs (40 if CJK)".
  - Line spacing "at least space-and-a-half".
  - It asks for "a mechanism" to reach these values, not that the default meets them.
  - The rationale is people "with some reading or vision disabilities". The cited works (Legge et al. 1985 and others) are listed without being tied to the 80.

### Letter spacing

- **Chung 2002**, *The effect of letter spacing on reading speed in central and peripheral vision*, IOVS 43:1270–1276, PMID 11923275 (https://europepmc.org/article/MED/11923275). **Verified** (abstract).
  - Reading speed rose with spacing "up to a critical letter spacing", which "was very close to the standard letter spacing".
  - "Increased letter spacing beyond the standard size … does not lead to an increase in reading speed in central or peripheral vision."
  - Classic; six observers; RSVP; Courier. It is paired below with recent work showing who does benefit.
- **Who benefits.**
  - Schneps 2013 (**verified**): wider letter spacing raised comprehension for the weaker readers (about 97.7% vs 85.4%).
  - Beier, Oderkerk, Bay & Larsen 2021, *Increased letter spacing and greater letter width improve reading acuity in low vision readers*: 20 AMD patients; a "small but measurable" effect near the critical print size. **Secondary** (search snippet only).
- **Rule.** Default tracking is right for body text. Extra tracking is an accessibility setting, which 1.4.12 requires the layout to survive.

---

## 3. Font size for reading on screens

### Rello 2016: bigger reads better up to about 18–22 "points"

Source as in §2. **Verified.**

- **Fixation duration** by size, mean in seconds: 10 → .255, 12 → .241, 14 → .224, 18 → .208, 22 → .199, 26 → .204.
  - Main effect: F(5, 445) = 66.8, η² = .159.
  - Each size up to 18 was significantly worse than every larger size. 18 was worse than 22 (p = .003). Nothing differed above 22.
- **Comprehension.** 10 and 12 were below 18; 12 was below 26.
- **Subjective readability** peaked at 18. 26 was rated worse than 18.
- **Recommendation:** "at least 18-point font size for the text body".
- **Caveat 1, units.** The paper says "points" throughout, but its conclusion calls the browser default "16 points". That reads like CSS px. The text doesn't say which unit was set, so both readings are computed below.
- **Caveat 2, line length.** Line length fell as size rose. Some of the plateau may be lines getting too short; the authors say so ("less and less text in a single line").

### The same number is not the same size: visual angle (computed)

The experiment's display had a pixel pitch of 0.337 mm (17-inch 4:3 at 1024×768) at about 60 cm. Arial's x-height is 0.519 em (measured on canvas: 8.30 px at 16 px).

| Rello size | x-height if px | x-height if CSS pt |
| --- | --- | --- |
| 10 | 0.167° | 0.223° |
| 14 | 0.234° | 0.312° |
| 18 | **0.301°** | 0.401° |
| 22 | 0.368° | 0.490° |

Geist's x-height is 0.530 em (measured: 7.95 px at 15 px). Under the assumptions below, Geist reaches these x-height angles at:

| Setting | 15px | 16px | 18px | px for 0.30° |
| --- | --- | --- | --- | --- |
| MacBook Air 13.6", default scaling (1470 CSS px across 301 mm), 50 cm | 0.187° | 0.199° | 0.224° | about 24 |
| 27" QHD at 1× (0.233 mm/px), 60 cm | 0.177° | 0.189° | 0.212° | about 25 |
| iPhone at 3× and 460 ppi (0.166 mm/CSS px), 32.2 cm | 0.234° | 0.250° | 0.281° | about 19 |

The viewing distances are assumptions. 32.2 cm is the average phone distance cited by Kong et al. 2025.

- **What this means.** The study's "18" subtended about 0.30° of x-height. On a typical laptop, a 15px Geist body subtends about 0.19°, which is closer to Rello's **10–12** conditions, the ones that lost on fixation duration and comprehension.
- Modern CSS pixels are smaller than the study's 2012 pixels. Copying "18px" from the paper gives a smaller retinal image than the study tested.

### Fluent range and critical print size

- **Legge & Bigelow 2011**, *Does print size matter for reading? A review of findings from vision science and typography*, Journal of Vision 11(5):8, https://pmc.ncbi.nlm.nih.gov/articles/PMC3428264/. **Verified** (full text in browser).
  - "The fluent range extends over a factor of 10 in angular print size (x-height) from approximately 0.2° to 2°."
  - Critical print size, below which reading speed "begins to decline sharply", "typically lies in the range from about 0.15° to 0.3° depending on the individual".
  - Screens: the mean x-height fraction rises from 0.42 in hardcover book faces to 0.52 in "digital typefaces designed for screens". Larger x-height fractions go with greater on-screen legibility (Sheedy et al. 2005, cited there).
  - Classic review, paired with the 2025 work below.
- **Computed consequence.** At 15px, Geist on a laptop (about 0.19°) sits *inside* the critical-print-size band of 0.15–0.3°. For some readers it is below their CPS, with little reserve. At 17–18px (0.21–0.22°) it clears the 0.2° bottom of the fluent range on both desktop set-ups above.
- **Sawyer, Rashid, Palmen, Kucuk & Atilgan 2025**, *Font Size, X-Height, and Readability*, VSS abstract, Journal of Vision 25(9):2645, https://doi.org/10.1167/jov.25.9.2645. **Verified** (abstract).
  - N = 60. Print size affected reading speed (p < .05); x-height alone did not (p = .134).
  - At small sizes, a larger x-height was read marginally faster: 248 vs 232 WPM.
  - Conference abstract, not a full paper.
- **Kong, Wobbrock, Cai & Bylinskii 2025**, *Supporting Mobile Reading While Walking with Automatic and Customized Font Size Adaptations*, CHI '25, https://faculty.washington.edu/wobbrock/pubs/chi-25.01.pdf. **Verified** (full text).
  - 45 participants on an iPhone 11 Pro Max. Baseline "iOS default body text font size (14 pt)", as the paper states.
  - The distance-based recommended size averaged 29.7 pt.
  - Walking: the large size read **21.1% faster**.
  - Sitting: the same large size read **20.3% slower**.
  - Preferred size grew with exposure: 16.8 pt before reading, 17.5 pt during, 22.5 pt after.
  - **The point:** bigger is not monotonic. The best size depends on the situation, and people's own settings drift once they have seen the alternative.

### Design-system guidance on body sizes

- **Apple HIG, *Typography*.** https://developer.apple.com/design/human-interface-guidelines/typography (JSON source: https://developer.apple.com/tutorials/data/design/human-interface-guidelines/typography.json). **Verified.**
  - Default / minimum sizes: iOS and iPadOS 17 / 11 pt; macOS 13 / 10 pt; visionOS 17 / 12 pt; watchOS 16 / 12 pt.
  - The body style "support[s] a comfortable reading experience over multiple lines of text".
  - **iOS Body at the Large default is 17 pt with 22 pt leading (1.29).** **macOS Body is 13 pt with 16 pt leading (1.23).** Even Apple's "Body" is set tight. The loose-leading advice above is how Apple says to adapt it for long passages.
  - On weight: "avoid Ultralight, Thin, and Light font weights, which can be difficult to see, especially when text is small."
  - Dynamic Type: iOS Body runs 14 → 23 pt across xSmall–xxxLarge, and up to 53 pt at AX5 (table in the JSON). Apple adds: "they don't always want to increase the size of every word on the screen". Reading content should scale; chrome can scale less.
  - Optical size: system fonts "support dynamic optical sizes, which merge discrete optical sizes (like Text and Display)".
  - SF Pro tracking (iOS table):
    - +41/1000 em at 6 pt; +12 at 10 pt; +6 at 11 pt; 0 at 12 pt.
    - −6 at 13 pt; −16 at 15 pt; −26 at 17 pt.
    - It reaches −23 at 20 pt and then **climbs back to +3 by 24 pt**, holding about +10 to +14 from 26–40 pt.
    - The turn around 20–24 pt matches the Text-to-Display switch.
    - **Inference (unverified):** the Display design is drawn tighter, so it gets tracking added back. The table is specific to SF Pro and not a rule for other faces.
- **Material 3, *Applying type*.** https://m3.material.io/styles/typography/applying-type (rendered in browser). **Verified.**
  - "Body styles are used for longer passages of text in your app." Use "typefaces intended for body styles"; "Avoid expressive or decorative fonts for body text".
  - "Label styles are smaller, utilitarian styles, used for things like the text inside components"; "Label styles should enable quick reading at small sizes, such as in buttons".
  - Values (Compose `TypeScaleTokens.kt`, https://github.com/androidx/androidx/blob/androidx-main/compose/material3/material3/src/commonMain/kotlin/androidx/compose/material3/tokens/TypeScaleTokens.kt, **verified**):
    - Body large 16/24 sp (+0.5 tracking); body medium 14/20 (+0.2); body small 12/16 (+0.4), all Regular.
    - Label large 14/20 (+0.1); label medium 12/16 (+0.5); label small 11/16 (+0.5), all **Medium**.
    - Title medium 16/24 Medium.
  - Only body large reaches 1.5 leading. Labels are told apart by weight, not by size.
- **Fluent 2, *Typography*.** https://fluent2.microsoft.design/typography. **Verified** (via fetch summary of the ramp).
  - Web: Body 1 14/20, Caption 1 12/16, Subtitle 2 16/22.
  - Windows: Body 14/20, Body large 18/24.
  - No guidance on line length or reading.

**Pattern across systems.** Every system's default "body" is *interface* body (13–17 pt, leading 1.23–1.43). None ships a long-form reading style with a measure. Apple says to loosen leading for long passages, and Material says body styles are for "longer passages". So a reading style is the product's job.

---

## 4. Interface text: scanning, not reading

- **NN/g, F-pattern.** Kara Pernice, *F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant (Even on Mobile)*, 12 Nov 2017 (original finding 2006), https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/. **Verified** (fetched summary with quotes).
  - The F-pattern is "the default pattern when there are no strong cues"; it is "bad for users and businesses".
  - It is observed on desktop and mobile.
  - The fix is formatting: front-load, informative headings, bold key phrases.
- **NN/g, *Text Scanning Patterns: Eyetracking Evidence*.** Kara Pernice, 25 Aug 2019, https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/. **Verified.**
  - Patterns: F, spotted, layer-cake, and **commitment**, where "users fixate on all or most content words".
  - Commitment happens when users "are very interested or very motivated". It "usually leads to the best comprehension, even though it is the most time consuming."
- **Mapping to Post (inference).** The list is scanned: spotted and layer-cake patterns over sender, subject and time. The open message is where commitment reading happens. The two surfaces carry different reading modes, so they deserve different type.
- **Glance legibility: face matters more when time is short.**
  - Reimer et al. 2014, *Assessing the impact of typeface design in a text-rich automotive user interface*, Ergonomics, https://pmc.ncbi.nlm.nih.gov/articles/PMC4267594/. **Verified** (abstract). For men, a humanist menu face cut total glance time by 10.6% vs a square grotesque. The effect was modest or absent for women.
  - Dobres et al. 2016, *Utilising psychophysical techniques…*, Ergonomics, https://pmc.ncbi.nlm.nih.gov/articles/PMC5213401/. **Verified** (abstract). Humanist was "significantly more legible than a square grotesque", and "black-on-white text is significantly more legible than white-on-black" for glance reading.
- **Weight at small sizes.** Beier & Oderkerk 2019, *Smaller visual angles show greater benefit of letter boldness than larger visual angles*, Acta Psychologica 199:102904, https://adk.elsevierpure.com/en/publications/smaller-visual-angles-show-greater-benefit-of-letter-boldness-tha. **Verified** (abstract). Boldness helped recognition at small visual angles, not at large ones. Very thin and extremely bold both hurt at every size.
  - This supports Medium-weight labels (Material) and Apple's "avoid … Light … especially when text is small".
- **Tabular figures.** Geist at 15px, **measured**: proportional "1111" is 21.24 px and "0000" is 40.23 px; with `font-variant-numeric: tabular-nums` both are 36 px. Without tabular figures, times and counts in a column don't line up. Post already uses `tabular-nums` on list times and counts.
- **Tracking at small sizes.** Apple adds tracking below 12 pt (+6 to +41/1000 em). Material adds +0.4 to +0.5 sp to 11–12 sp styles. Both systems open small text up. That fits the crowding account in Chung 2002, though Chung tested reading, not labels (inference).

---

## 5. Face choice: small and individual effects

- **Wallace et al. 2022**, *Towards Individuated Reading Experiences: Different Fonts Increase Reading Speed for Different Individuals*, ACM TOCHI 29(4):38, https://doi.org/10.1145/3502222. Full text: https://jeffhuang.com/papers/Readability_TOCHI22.pdf. **Verified.**
  - **Set-up:**
    - 352 crowdworkers after filtering (500 recruited), aged 18–71.
    - 16 fonts, normalized by x-height, height or width to Times at 16px.
    - Fixed 420px reading column; "fixed-line spacing of 1.5". Each person read in five fonts.
  - **Speed:** "participants read 35% faster in their fastest font compared to their slowest font (232 WPM, on average)". The fastest font averaged 314 WPM; the preferred font 275 WPM (+14%).
  - **Preference vs performance:** people read fastest in their preferred font "20% of the time", which is "precisely at chance level" out of five. Yet "73% of participants believed their most preferred font would also be their most effective".
  - **No winner:** "there was not a single font that increased reading speed for everyone." Comprehension was flat.
  - **Age:** for readers 35 and older, EB Garamond and Montserrat were faster on average, and Avant Garde and Open Sans slower.
  - **Earlier finding:** perceived size drives preference, which is why sizes were normalized.
  - **Caveats:**
    - Remote and crowdsourced, so internal validity is lower; the authors say so.
    - **Inference:** taking the fastest of five noisy measurements inflates the gain (regression to the mean), so 35% is an upper bound for one sitting.
- **Serif vs sans is the wrong axis.** Minakata & Beier 2022, *The dispute about sans serif versus serif fonts: An interaction between the variables of serif and stroke contrast*, Acta Psychologica 228:103623, https://adk.elsevierpure.com/en/publications/the-dispute-about-sans-serif-versus-serif-fonts-an-interaction-be/. **Verified** (abstract).
  - Four purpose-built fonts. Low stroke contrast gave lower size thresholds.
  - The interaction: low-contrast sans did best, but serifs did better with *high* contrast.
  - Conclusion: "Sans serif fonts with low stroke contrast yield better performance".
  - The follow-up with low-vision readers reverses part of it. Minakata et al. 2023, Acta Psychologica 232:103810, https://doi.org/10.1016/j.actpsy.2022.103810. **Verified** (full text). 19 patients with ADOA: serif plus uniform stroke did best (d′ 1.47 vs 1.15).
  - These are word-recognition threshold tasks, not paragraph reading.
- **Width.** Minakata & Beier 2021, *The effect of font width on eye movements during reading*, Applied Ergonomics 97:103523, https://doi.org/10.1016/j.apergo.2021.103523. **Verified** (abstract). With n = 25 and four Univers widths, eye movements changed but "no reading-speed differences were observed".
- **Text vs display cuts.**
  - Apple merges optical sizes continuously (§3).
  - Sitka found the Small master more recognisable at 9 pt (backlog #20, **verified** there) but no reliable reading-speed gain.
  - **Geist Variable as shipped has only `wght` and `ital` axes** (`node_modules/@fontsource-variable/geist/metadata.json`, read). There is no `opsz`, so the 13px label and the 26px subject use the same drawing.
- **Product evidence (design rationale, not experiment).** Bear rebuilt its face because Avenir "could be tiring to read" at body sizes. Bear Sans has a larger x-height and larger apertures (R26, https://blog.bear.app/2023/08/learn-about-our-new-custom-font-bear-sans/).

**Honest summary.** Face effects on paragraph reading are small on average and large per person. The robust population-level levers are size (angular x-height) and measure. A face choice should rest on x-height, aperture, weight and contrast, not on serif vs sans.

---

## 6. Dark mode and polarity (2020+)

- No 2020+ primary study that measures *paragraph* reading speed or comprehension under polarity on modern displays was found and read.
- ***Immediate Effects of Light Mode and Dark Mode Features on Visual Fatigue in Tablet Users*, 2025** (IJERPH 22(4):609; authors not recorded), https://pmc.ncbi.nlm.nih.gov/articles/PMC12027292/. **Verified** (abstract). 30 tablet users: "No statistically significant difference in visual fatigue" between light and dark modes. Differences appeared in critical flicker frequency and dry-eye symptoms.
- The glance study above (Dobres 2016) favours black-on-white. Older positive-polarity work is already summarised (NN/g, secondary) in `2026-10-27-colour-and-unread.md`.
- **For pages:** don't claim dark mode helps or hurts reading. The only safe statement is that the evidence doesn't show a reading benefit either way.

## 7. CJK (brief)

- **WCAG 1.4.8** (**verified**): 40 CJK characters per line, against 80 for Latin, because CJK characters "are approximately twice as wide". CSS has an `ic` unit (the "水" advance) for CJK measures (CSS Values 4, **verified**).
- **W3C clreq** (Group Note Draft, 7 Oct 2026, https://www.w3.org/TR/clreq/, **verified** in part):
  - §7.1.1.5: "Line length should be multiples of the font size".
  - §5.6.1 gives line-gap minimums (½ and ⅝ of the font size). Its context could not be confirmed in the part read; it may concern interlinear annotation, so don't cite it as a body-leading rule yet.
- The playbook's own tokens already set Chinese prose looser (`prose` 14/24 = 1.71; `Entry.module.scss` 15/26 for `:lang(zh)`). No primary study was read to back the exact values.

---

## Synthesis for the playbook

### Counterintuitive mechanisms worth a principle page

1. **What reads fastest is not what feels best.** Speed, comprehension and preference point to different settings.
   - Line length: speed favours about 100 cpl; comprehension about 55; preference is moderate and familiar (Dyson 2004; Dyson & Haselgrove 2001; Dyson 2021).
   - Font: people's preferred font is their fastest only at chance, 20% of five (Wallace 2022).
   - Size: preferred size rose from 16.8 to 22.5 pt after exposure, while a large static size slowed seated reading by 20.3% (Kong 2025).
   - For reading text, set a default from performance evidence and let people adjust. Don't settle it by asking which looks best.
2. **A size is an angle, not a number.**
   - Rello's best "18" was about 0.30° of x-height. 15px Geist on a laptop is about 0.19°, which is Rello's losing 10–12 range and inside the 0.15–0.3° critical-print-size band (Legge & Bigelow 2011; computed).
   - The same CSS px is physically smaller now than on the study's monitor, and a phone held at 32 cm makes it larger.
   - Reading text needs a bigger nominal size on a laptop than on a phone. Interface text, which is glanced at rather than read, can stay small.
3. **Leading is for the trip back.**
   - In a single paragraph at a fixed measure, line spacing from 1.2 to 1.7 made no measurable difference (Rello 2016, p = .978). Only the extremes hurt.
   - Leading's job is the return sweep (Dyson 2004; Apple HIG's loose-for-long-passages, tight-for-list-rows). It should grow with the measure.
   - A one-line list row has no return sweep, so tight leading costs it nothing.
   - This is the mechanism behind "reading text wants more leading than UI text at the same size". The cause is the measure, not the size.
4. **The best font depends on the reader.** A 35% spread between a reader's fastest and slowest fonts, no single font that is faster for everyone, and serif vs sans flipping with stroke contrast and with vision (Wallace 2022; Minakata & Beier 2022, 2023). A reading view should offer a choice of face. Interface text gains little from that.
5. **`ch` is not a character** (smaller, can live inside mechanism 1 or 2's page). `68ch` in Geist is about 101 characters of prose, because `ch` is the width of a wide "0" (CSS Values 4; measured).

### Rules with values

**Reading text (an open mail body, a long article)**

- **Size:** aim for an x-height of at least 0.2° at the device's usual distance, with a little reserve.
  - In Geist that means **17px on desktop and laptop** (0.21° on a MacBook Air at 50 cm; 0.20° on a 27" QHD at 60 cm) and **16–17px on phone** (0.25–0.27°).
  - Going toward Rello's 0.30° means about 24px on a laptop. Offer that as a reader setting rather than the default, given Kong's seated slowdown at large sizes.
- **Measure:** **55–75 characters, counted as real characters**, about 65 ideally.
  - Set it in em from the face's average character, not in `ch`. For Geist, cpl × 0.449em: 55 → 25em, 65 → 29em, 75 → 34em. At 17px, 29em is about 495px.
  - On narrow screens, let the line run edge to edge with padding, as short lines help struggling readers (Schneps 2013).
- **Leading:** about **1.5–1.6** at that measure; never below about 1.2 or above about 2.
  - At 17px, use 26–27px.
  - Grow leading with the measure if the measure grows.
- **Paragraphs:** spacing at least equal to one line, and the layout must survive 2× (WCAG 1.4.12).
- **Tracking:** 0 at body size. The layout must survive 0.12em letter and 0.16em word spacing (1.4.12).
- **Face:** a text face with a large x-height (about 0.5 em or more), open apertures and low contrast if sans. Regular weight, never Light. Offer a face choice in a reading view.
- **Scale with the reader's text-size setting.** Chrome can scale less (Apple HIG).

**Interface text (list rows, menus, labels, toolbars)**

- **Size:** 13–14px on desktop is the norm (macOS Body 13 pt; Fluent and Material 14). 12px for labels, 11px only for metadata that is never read as a sentence (matches the Precision caption note).
- **Leading:** 1.2–1.45. One-line rows can be tight. In multi-line rows, tight leading saves height (Apple HIG).
- **Hierarchy by weight:** Medium or Semibold for labels and subjects at small sizes (Material labels are Medium; Beier & Oderkerk 2019). Avoid Light.
- **Tracking:** slightly positive below 12px (+0.01 to +0.04em), 0 at 12–14px, and negative only on large display text.
- **Numbers:** `tabular-nums` wherever figures stack or update.
- **Copy for scanning:** front-load the distinguishing words, because list rows are read in spotted and layer-cake patterns (NN/g 2019).

### Demo ideas (hands-on, using Post)

1. **The same mail, two settings (Before/After, with a Tweak).**
   - One long Post message read in place.
   - Before: the open message set like the list, 14/20 at the full column width.
   - After: the reading style, 17/26 at about 29em.
   - A **measure slider** shows a **live characters-per-line readout**, counted from the rendered lines with the Range API, so it is real characters and not `ch`. A second readout says "68ch = 101 characters" to make the `ch` trap visible.
   - Shaded bands mark 55 (best comprehension in Dyson & Haselgrove), 45–75 (convention) and 100 (fastest in some screen studies).
   - **Content gap:** Post's longest current paragraph is 123 characters (`conversations.ts`), so no mail body ever wraps more than twice. The demo needs one real long letter, for example a full newsletter issue.
2. **Your fastest font (Tweak).**
   - First the reader picks a favourite from four faces at matched x-height.
   - Then they read four short passages, one per face, each followed by one comprehension question; time per passage gives WPM.
   - Reveal the fastest face next to the favourite. In Wallace et al., these matched only 20% of the time.
   - State the honest caveat on the page: one sitting is noisy, so it is a demonstration and not a measurement.
   - Optional: carry the winner into Post's reading view.
3. **Leading is for the trip back (Tweak).**
   - One line-height slider drives two panes: a long-measure paragraph (about 95 cpl) and a Post list row.
   - At about 1.0 on the long measure, the next line is easy to miss. At 2.0 the paragraph falls apart.
   - On the list row the same slider only changes row height.
   - Optional "return sweep" cue: briefly highlight the first word of each line, which is Slattery & Vasilev's bolding manipulation. It shows return-sweep targeting without claiming a speed gain.
4. **A size is an angle (Tweak).**
   - The reader chooses a device (laptop, external monitor, phone) and a distance.
   - The demo converts the reading text's px size to x-height degrees and places it on a band: below 0.15° is below most people's critical print size; 0.15–0.3° is the CPS band; 0.2–2° is the fluent range. It also marks where Rello's "18" fell.
   - The default 15px on a laptop lands in the CPS band. The reading-style default should clear 0.2°.

### Audit: Precision type tokens and Post

All values come from `src/tokens/precision.json`, the SCSS files named, and the live measurements above.

**What holds**

- **The UI ramp is a proper interface ramp.**
  - body 14/20, body-sm 13/18, label 12/16 at 500 weight with +0.01em, caption 11/14 at 500 with +0.02em. Hierarchy comes from weight and negative tracking at title sizes (title-lg 24/32 at −0.02em).
  - This matches Material labels (Medium, positive tracking) and Apple (tracking opens at small sizes).
- **Post's list is interface text** at 14/20 with a 600-weight subject, a 13px snippet and tabular-numeral times. That is correct for spotted and layer-cake scanning.
- **Post already splits reading from UI.** Prose is 15/25 (1.67) in its own block. The subject is 26px with −0.01em and `text-wrap: balance`.
- **Designed newsletters keep their own 600px box** (`Message.module.scss .letter`). That is the sender's measure, which is right.
- **Chinese prose gets more leading** than Latin (`prose` 14/24; `Entry` 15/26 for `:lang(zh)`).

**What doesn't**

1. **Post's measure is about 96–101 characters, not a reading measure.**
   - `.prose { max-width: 68ch }` is 676px in Geist at 15px. The column (760px minus 32px padding on each side minus a 48px avatar indent) caps it at 648px.
   - At Geist's average of 6.73px per character, that is **about 96 characters per line** (computed).
   - It is above Bringhurst's 75, above WCAG 1.4.8's 80 (an AAA mechanism, not a default requirement), and next to the 100-cpl condition that lost on comprehension in Dyson & Haselgrove 2001.
   - **The playbook's own pages measure 87–93 characters per line** (640px, 15/24; measured on *Nothing shifts*).
   - Fix: set the reading measure in em from the face (about 29em) rather than `ch`.
2. **15px reading text is small in angular terms.** It is about 0.19° x-height on a laptop at 50 cm, inside the CPS band and below the fluent-range floor of about 0.2°. Rello's comparable conditions (10–12) lost. Raise reading text to 17px and keep the list at 14px.
3. **Leading will need to follow.** 25px at 17px is 1.47; at a 29em measure, about 26px (1.53) fits the evidence. The current 1.67 at 15px is fine but was paired with a 96-character line.
4. **There is no reading token.** The `body` token (14/20) is named like Apple's and Material's "body" but documented as "界面默认文字：按钮、列表、表单" (default interface text: buttons, lists, forms). The only long-form token, `prose` (14/24), is described for Chinese paragraphs. Post hard-codes 15/25 in `Blocks.module.scss`.
   - Fix: add a Latin `reading` style (17/26, measure about 29em, Regular) next to `prose`, and consider renaming `body` to `ui`, so "body" doesn't mean two things.
5. **One drawing for every size.** Geist ships without `opsz`, so 11px captions and the 26px subject share the same design. The small-size tracking in the tokens (+0.01 to +0.02em) is the only compensation.
   - This is not wrong, but the playbook can't show optical sizing with this face. Backlog #20 needs Sitka or another face that ships an opsz axis or size masters.
6. **Post's mail bodies are too short to test any of this.** No paragraph wraps beyond two lines, so measure and leading never show their effect in the product.

### Folklore vs evidence

| Claim | Status |
| --- | --- |
| 45–75 characters per line is research-based | **Convention.** Bringhurst, for serif print text, no study cited. Screen studies: speed rises to about 100 cpl; comprehension was best at 55 in one study; preference is moderate (Dyson 2004, 2021) |
| Long lines slow reading | **Not on screen.** "in no case were long lines read more slowly" (Dyson 2021). They may cost comprehension (55 vs 100 cpl) and are disliked |
| Short lines are always worse | **Not for struggling readers.** About 13 cpl was read 27% faster by students with dyslexia (Schneps 2013) |
| 1.5 is the optimal line height | **Unsupported as an optimum.** 1.2 to 1.7 were indistinguishable on fixations; only about 0.96 and 2.16 hurt (Rello 2016). 1.5 is WCAG's tolerance and AAA target, not an optimum |
| Bigger text is always more readable | **Up to a point.** Gains plateaued at 18–22 (Rello); a large static size slowed seated phone reading by 20% (Kong 2025) |
| 16px is big enough for body text | **Depends on the angle.** 16px Geist is about 0.20° on a laptop at 50 cm, the floor of the fluent range |
| Serif is more readable for body; sans is better on screens | **Neither as a rule.** Serif interacts with stroke contrast, and the result flips for low vision (Minakata & Beier 2022, 2023). Per-person differences dominate (Wallace 2022) |
| Your favourite font is your most readable one | **False on average.** It was the fastest only at chance, 20% (Wallace 2022) |
| More letter spacing helps reading | **Not for typical readers.** The critical spacing is about the standard spacing (Chung 2002). It helps some low-vision and dyslexic readers (Schneps 2013; Beier 2021, secondary) |
| `max-width: 65ch` gives 65 characters | **False.** `ch` is the "0" advance. In Geist, 1ch ≈ 1.48 characters, so 68ch ≈ 101 characters (CSS Values 4; measured) |
| System "body" styles are reading styles | **False.** iOS Body is 17/22 and macOS Body 13/16. Apple says to loosen leading for long passages |
| Dark mode is easier to read | **No 2020+ reading evidence either way.** No fatigue difference on tablets (2025); glance legibility favours positive polarity (Dobres 2016) |
| People read on the web | **Mostly they scan.** Full "commitment" reading happens when they are motivated, and gives the best comprehension (NN/g 2019) |

---

## Sources not verified, kept off pages

- Dyson & Haselgrove 2001 full text: publisher 403, author-copy link dead. Results are used only as reported in Dyson 2004.
- Shaikh 2005, *The effects of line length on reading online news*: summary only.
- Slattery & Vasilev 2019 and Parker & Slattery 2019–2021 (return sweeps): cited through Dyson 2021, not read.
- Beier, Oderkerk, Bay & Larsen 2021 (letter spacing in low vision): search snippet only.
- Minakata & Beier 2022 full text: PDF 403. Abstract, plus the authors' own summary in Minakata et al. 2023, both read.
- McLeish 2007 (the basis for WCAG 1.4.12): known only through the WCAG Understanding page.
- Tinker 1963 / Paterson & Tinker: through Dyson only.
- Any 2015+ experiment on line length for Latin text on desktop or mobile: none found in several searches. Recorded as a gap, not as an absence of effect.
- clreq §5.6.1 line-gap minimums: context unconfirmed.
- The reason SF Pro's tracking turns positive above about 20 pt (the Display design being tighter): inference.
