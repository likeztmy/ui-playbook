# A novelty budget: what repetition does to motion and delight

Research for topic #6 in `docs/plans/2026-10-27-topic-priorities.md`, *A novelty budget* (T5 in `2026-10-27-human-modern-references.md`, P5), merged with backlog #11 *The more often, the less motion* (`2026-10-25-topic-backlog.md`, "### The more often, the less motion"). The working claim to test: motion and novel or decorative design spend attention every time they are seen, so the more often something happens the plainer it should be, and delight belongs to rare moments. Post spends almost no novelty, so the proof will be a new scene (owner: the demo need not use Post).

**Result in one line.** The attention half of the claim is wrong for mild, self-caused motion: attention to a repeated event habituates, faster the more often it occurs. Two costs survive repetition: **time** (an animation that delays the end state or blocks input costs its full duration every time) and **intensity** (strong or looping motion habituates slowly or not at all, and is what people call annoying). A third finding turns the claim around: delight placed on a frequent action is not just costly, it stops being seen, and it comes back only when it is rare, spaced or changed. Sections 2, 4 and 6 give the evidence.

Not repeated here:
- Interruptible motion (springs keep velocity, keyframes restart, a lock that drops clicks) is on `src/pages/principles/let-motion-change-its-mind.mdx`. This note covers motion that *finishes*, and how often it plays. The "don't make people wait" overlap is cited only as the time cost in §4.
- The NN/g response-time limits (0.1 s, 1 s, 10 s), "nothing at all for a quick request" and optimistic results are on `how-waiting-feels.mdx`. §4 only adds the cost of a deliberate animation, which is a wait the product chose.
- Banner blindness ("it skips what looks like an ad") and change blindness outside the working spot are on `where-the-eye-goes.mdx`. §5 adds animated-ad evidence for a different point (animation makes things *more* annoying, and not more seen) and must not re-explain banner blindness.
- Practitioner sources (Emil Kowalski, Rauno Freiberg, Josh Comeau, Dia's "novelty budget", the M3 Expressive research) were verified in `2026-10-27-human-modern-references.md` R1, R9, R11, R15, R25. Cited here by reference; one Emil quote was re-checked (§8).

**Labels.**
- **Verified**: read in the primary source this session: the paper's full text, its abstract on Europe PMC or OpenAlex (marked "abstract"), the design system's own page, a standards page, or the vendor's own help page.
- **Secondary**: known only from a paper citing the claim, press, or a search snippet.
- **Unverified**: from memory or inference. Keep off pages.
- **Measured**: read from this repo's source (2026-10-27).
- **Computed**: worked out here; method stated.

Sources were collected 2026-10-27. Abstracts came from Europe PMC REST and OpenAlex. Full texts were read for Goldstein et al. 2014 (author-hosted PDF), Baudisch et al. 2006 (author PDF), Mark et al. 2016 (Microsoft Research PDF), Dubroy & Balakrishnan 2010 (author PDF), Rankin et al. 2009 (PMC), De Tommaso & Turatto 2023 and Dissegna et al. 2025 (Europe PMC full text). Material, Fluent and Asana pages were read in a browser because they render client-side; Apple HIG came from its JSON (`developer.apple.com/tutorials/data/design/human-interface-guidelines/motion.json`); Carbon and the Web Almanac were fetched as HTML.

---

## 1. What the design systems say about frequency

Only two of four systems tie motion to frequency. The other two tie it to size, direction and product type.

### Apple

- **Apple HIG, *Motion*** (https://developer.apple.com/design/human-interface-guidelines/motion; change log to 9 Sep 2025). **Verified.**
  - "In apps, generally avoid adding motion to UI interactions that occur frequently."
  - For custom elements, avoid making people spend extra time on "unnecessary motion every time they interact with it".
  - Under *Let people cancel motion*: "don't make people wait for an animation to complete before they can do anything". The sentence continues: "especially if they have to experience the animation more than once."
  - "Make motion optional", and don't use it as "the only way to communicate important information".
  - "Aim for brevity and precision in feedback animations."
  - **So Apple names both costs: attention ("paying attention… every time") and time (waiting). It gives no millisecond value.**

### IBM Carbon (the closest match to the working claim)

- **Carbon, *Motion overview*** (https://carbondesignsystem.com/elements/motion/overview/). **Verified.**
  - Two styles. Productive motion is "subtle and out of the way", for "moments when the user needs to focus on completing tasks". Its examples are button states, dropdowns, revealing more information, and rendering data tables.
  - Expressive motion is "enthusiastic, vibrant, and highly visible". The rule: "Reserve expressive motion for occasional, important moments". The reason given is to "capture the user's attention" and offer a rhythmic break.
  - **The examples break the frequency reading.** Expressive is for "opening a new page, clicking the primary action button", system alerts and notifications. A primary button is often the most frequent click on a screen. Carbon assigns expressive motion by *importance*, and says "occasional" without defining it.
  - Evaluation checklist: "The best interface motion may go unnoticed". For motion "frequently noticed by average users", the advice is: "consider removing or minimizing it."
  - Duration tokens: `fast-01` 70 ms (button, toggle), `fast-02` 110 ms (fade), `moderate-01` 150 ms (small expansion), `moderate-02` 240 ms (expansion, toast), `slow-01` 400 ms (large expansion, important notifications), `slow-02` 700 ms (background dimming).
  - Easing: productive `cubic-bezier(0.2, 0, 0.38, 0.9)`, expressive `cubic-bezier(0.4, 0.14, 0.3, 1)`. "Productive motion is significantly faster than expressive motion", and duration grows with distance or size.
  - **Internal inconsistency.** The checklist asks whether micro-interactions fall within "90–120 ms", while the button/toggle token is 70 ms. **Verified** (both on the same page).

### Material 3 (counter-evidence)

- **Material 3, *Motion physics system: how it works*** (https://m3.material.io/styles/motion/overview/how-it-works; May 2025). **Verified.**
  - Two schemes. Expressive overshoots and bounces, and "should be used for most situations, particularly hero moments and key interactions". Standard has "minimal bounce" and "should be used for utilitarian products".
  - The scheme is chosen per **product**. Swapping it per element is listed as an "advanced customization", for example to emphasise key moments.
  - Speeds follow **size**: fast for "Small components, such as switches and buttons", default for partial-screen, slow for full-screen.
  - **Material does not mention frequency.** In an expressive product the switch, clicked constantly, bounces.
- **Material 3, *Motion specs*, web conversion table** (https://m3.material.io/styles/motion/overview/specs). **Verified.**
  - Expressive fast spatial `0.42, 1.67, 0.21, 0.90`, 350 ms; default spatial 500 ms; slow spatial 650 ms.
  - Standard fast spatial 350 ms; default spatial 500 ms; slow spatial 750 ms. Effects tokens are identical in both schemes (150, 200, 300 ms).
  - **Computed.** Expressive and standard take the same time at fast and default speeds; standard slow is 100 ms *longer*. In Material, "plainer" means less overshoot, not less time.
- **Material 3, *Applying easing and duration*** (legacy, "no longer maintained", still used for transitions). **Verified.**
  - Durations follow transition size and direction. Exits are shorter "because they require less attention than the user's next task".
  - Suggested pairs: emphasized 500 ms (on screen), 400 ms (enter), 200 ms (exit); standard 300 / 250 / 200 ms.
  - Standard easing is for "small utility focused transitions that need to be quick".

### Fluent 2

- **Fluent 2, *Motion*** (https://fluent2.microsoft.design/motion). **Verified.**
  - One principle: use motion to "celebrate what they've accomplished". Another, *Appealing*: "Delightful animation draws people in."
  - Duration follows element size and distance. "Aim for a fast and smooth motion without making people wait."
  - **The only frequency-aware rule found in any system.** For staggers on repeated loads: "When loading the same content multiple times, consider using different animation offsets". It continues: "starting with larger gaps and gradually shortening them". This makes an animation shorter the more often it is seen.
  - Accessibility: provide a "no motion" setting. Also: "Keep the motion constrained to the element in focus".

### Standards

- **WCAG 2.2, SC 2.3.3 *Animation from Interactions* (AAA)** (https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html). **Verified.** Motion triggered by interaction "can be disabled", unless essential. The page names vestibular reactions ("dizziness, nausea and headaches") and parallax.

**Verdict on §1.** The rule "frequent → plain" is official only at Apple and Carbon, and Carbon's own examples assign expressive motion by importance. Material puts bounce on frequent controls in expressive products and holds duration constant across schemes. **The working claim needs narrowing:** systems agree on *short and non-blocking* for frequent actions, not on *plain*.

## 2. Habituation: the attention cost fades, faster the more often it occurs

This is the main mechanism, and it reverses the working claim's "every time".

### The classic characteristics (with the 2009 revision)

- **Rankin et al. 2009, *Habituation revisited*** (https://doi.org/10.1016/j.nlm.2008.09.012, PMC2754195). Consensus revision of Thompson & Spencer 1966. **Verified** (full text).
  - Characteristic 4: "more frequent stimulation results in more rapid and/or more pronounced response decrement". Recovery is also faster after high-frequency stimulation.
  - Characteristic 5: the less intense the stimulus, the faster the decrement. "Very intense stimuli may yield no significant observable response decrement."
  - Habituation is told apart from fatigue by stimulus specificity, meaning the response returns for a different stimulus, and by dishabituation.

### Attentional capture habituates (2016–2026, one lab plus EEG)

- **Turatto & Pascucci 2016** (https://doi.org/10.1016/j.nlm.2016.02.010). **Verified** (abstract).
  - A high-luminance peripheral onset distracted people doing a focused discrimination task.
  - With practice, short- and long-term habituation made attention "fully immune to distraction".
  - Once habituated, capture took "from several minutes to days to recover".
- **De Tommaso & Turatto 2023** (https://doi.org/10.3758/s13414-023-02698-1, PMC10600284). **Verified** (full text). Habituation was stronger at a 60% onset rate than at 15%, both at one location and across locations (480 trials in four blocks).
- **Dissegna et al. 2025** (https://doi.org/10.3758/s13414-025-03185-5, PMC12698745). **Verified** (full text).
  - At a 20% onset rate, interference fell across blocks but "remained significant in the last block".
  - At 50% and 80%, capture habituated to zero. After that, onsets *sped* responses, because they let people predict when the target would come.
  - **Counterintuitive and on point:** a frequent, predictable motion can end up as a timing cue. A rare one keeps distracting.
- **Burleson et al. 2025, EEG** (https://doi.org/10.1038/s41598-025-04082-5). **Verified** (abstract). The RT cost of a distractor "exhibited the typical time course of habituation". Pre-stimulus alpha rhythms tuned to when the distractor was expected, which suggests the brain learns to anticipate it.
- **Turatto et al. 2024** (https://doi.org/10.1037/xhp0001236). **Verified** (abstract). Habituation is tied to the configuration (target and distractor layout), not to a retinal or screen position. A layout change can restore capture.
- **Turatto 2023, theory** (https://doi.org/10.1037/xhp0001139). **Verified** (abstract). Turatto links this to Sokolov's model: a stimulus attracts attention "to the extent that it violates the expected sensory input". On this view habituation is high-order prediction, "not… peripheral sensory adaptation or fatigue".

### The same in real UI: security warnings

- **Anderson et al. 2015, fMRI** (BYU ScholarsArchive, https://scholarsarchive.byu.edu/cgi/viewcontent.cgi?article=10197&context=facpub). **Verified** (abstract). Visual-processing activity dropped "dramatically" after the *second* exposure to the same warning. A polymorphic warning, one that changes appearance, resisted habituation.
- **Vance et al. 2018, *Tuning out security warnings*** (https://doi.org/10.25300/misq/2018/14124, MIS Quarterly). **Verified** (abstract).
  - Attention declined over a five-day workweek and recovered partly between workdays.
  - In a three-week field study of mobile permission warnings, adherence dropped. With polymorphic warnings it dropped "at a substantially lower rate".

### What this does to the working claim

- **Killed: "spends attention every time it's seen".** A mild, repeated, predictable event loses its pull on attention, and faster the more often it occurs. **Verified** as a lab and fMRI finding. Not tested on UI animations directly.
- **Kept, sharpened: intensity matters.** Very intense stimuli may not habituate (Rankin #5). A big flourish on a frequent action is the case that keeps costing attention. **Verified** (characteristic); the UI application is inference.
- **New: delight on a frequent action becomes invisible.** It stops being processed, so it buys nothing, while its duration (§4) is still paid. **Inference** from §2 plus §6, and the strongest line for the page.
- **New: rare things keep working.** At a 20% rate capture survives a whole session (Dissegna 2025), and recovery takes minutes to days (Turatto 2016). This is the mechanism behind "delight belongs to rare moments". **Verified** for onsets; transfer to celebrations is inference.
- **Caveat.** These distractors were task-irrelevant and unpredictable in place or time. UI motion is usually caused by the user's own action, so by Sokolov's account it is predicted and captures less from the start. **Unverified**: no study of capture by self-triggered UI animation was found.

## 3. Which motion captures attention in the first place

- **Abrams & Christ 2003, *Motion onset captures attention*** (https://doi.org/10.1111/1467-9280.01458). **Verified** (abstract). Moving letters among static ones had no advantage; "the onset of motion does indeed attract attention". Continuous motion did not.
- **Guo, Abrams, Moscovitch & Pratt 2010** (https://doi.org/10.3758/app.72.5.1311). **Verified** (abstract). Replicated with isoluminant stimuli, so the capture is not just a luminance transient.
- **Franconeri & Simons 2003, *Moving and looming stimuli capture attention*** (https://doi.org/10.3758/bf03194829). **Verified** (abstract). Translating and looming stimuli captured attention; "receding stimuli do not attract attention".
- **Implications (inference, keep as reasoning on a page):**
  - Starting, growing and approaching are what grab attention. A pop-in that scales up is the strong form; a fade-out or shrink-away is the weak form. This fits Material's shorter exits (§1).
  - A looping animation (a spinner, an idle wobble) is continuous motion, so its *onset* is what captures, not the loop. Its cost is more likely annoyance (§5) than capture.
- **Modern pairing.** The 2016–2026 onset-habituation papers in §2 are the recent line. No 2020+ replication of the looming result itself was found.

## 4. Time does not habituate

- **Baudisch et al. 2006, *Phosphor*** (UIST, https://doi.org/10.1145/1166253.1166280; author PDF). **Verified** (full text).
  - Animated transitions "force users to wait for the animation to complete". Phosphor shows the outcome at once and explains it afterwards with an afterglow.
  - Study 2, 12 participants: animations of 125, 250, 500, 1000 and 2000 ms against phosphor. Task time differed across all pairs except phosphor vs 125 ms, 125 vs 250 and 250 vs 500.
  - Error rate differed mainly between 2000 ms and the rest. Below 2000 ms, longer animation bought no accuracy.
  - Preference: "fast" was the favourite in two of three tasks (7 of 11). Slow conditions got "very low satisfaction" despite better error rates. Participants disliked the wait.
  - **On point:** the people who already understood a transition pay its full duration anyway. Phosphor's answer is to show the result instantly and explain it after.
- **Huhtala et al. 2010, CHI** (https://doi.org/10.1145/1753326.1753527). **Verified** (abstract). In an image-to-image transition, "bringing up the next image earlier dominates the perception of a fast transition". What counts is when the result appears, not the total length.
- **Ge et al. 2024, IJHCS** (https://doi.org/10.1016/j.ijhcs.2024.103257). **Secondary** (search snippet only; ScienceDirect blocked the abstract). It is said to find that the delay in each phase of a transition changes perceived fluency.
- **Apple HIG** (§1): don't make people wait, "especially if they have to experience the animation more than once". **Verified.**
- **How often actions repeat (first-party measurements):**
  - **Mark et al. 2016, CHI** (https://doi.org/10.1145/2858036.2858262; MSR PDF). **Verified** (full text). 40 information workers over 12 workdays "checked their email on average 77 times per day". A check is the email client coming to the foreground. They spent almost 1.5 hours a day on email.
  - The same paper cites earlier work: email checked "around 11 times per hour" (Mark et al. ref. 26), and 87 emails received per day (Fisher et al.). **Secondary.**
  - **Dubroy & Balakrishnan 2010, CHI** (https://doi.org/10.1145/1753326.1753426; author PDF). **Verified** (full text). 21 Firefox users, logged for 13–21 days. Most switched tabs more often than they used Back, which makes tab switching the second navigation mechanism after link clicks. The paper reports rates normalised by navigation actions, not per hour.
  - Emil Kowalski: Raycast is opened "hundreds of times a day" (R11). **Verified** in R11; it is an anecdote.
- **Computed costs (method: count × blocking duration; only applies when the animation delays the end state or input).**
  - Opening the mail client 77 times a day with a 300 ms blocking transition: 77 × 0.3 s ≈ **23 s a day**, ≈ **1.6 h a year** over 250 workdays.
  - Archiving 30 messages with a 450 ms blocking flourish: **13.5 s**, against ~3.6 s at 120 ms.
  - Material default spatial (500 ms), blocking, on a 200-a-day action: **100 s a day**.
  - These are small in total. The felt cost is per event: each wait sits between the intent and the next action, and it repeats. The page should argue from the per-event wait, not the yearly total.
- **Verdict.** Attention habituates (§2); waiting doesn't. So the frequency rule is really about **duration and blocking**, which costs the same on the 100th repetition as on the first. **Verified** mechanism (Phosphor, Apple); the habituation contrast is inference that joins two literatures.

## 5. Animation is the top reason people find things annoying

- **Goldstein, McAfee & Suri 2014, *The economic and cognitive costs of annoying display advertisements*** (J. Marketing Research, https://doi.org/10.1509/jmr.13.0439; conference version WWW 2013, https://doi.org/10.1145/2488388.2488429). **Verified** (full text).
  - Each of 72 animated ads was paired with a static variant made from its final frame, so only animation differed.
  - Animated variants were rated more annoying: mean 3.6 vs 2.4 on a 5-point scale (t = 7.6, p < .001). "In no case" was the static version significantly more annoying.
  - The 21 most annoying ads were all animated; the 24 least annoying were all static.
  - In 1,846 free-text reasons, animation was the top category (771 mentions).
  - In the email-categorising task, annoying ads cost $1.53 CPM in lost work against no ads, and $1.15 against good ads. They also lowered classification accuracy.
  - **Caveat.** These ads were not triggered by the user. The paired design makes "animation causes annoyance" causal for ads, not for UI feedback.
- **Lee & Ahn 2012** (Int. J. Electronic Commerce, https://doi.org/10.2753/jec1086-4415170105). **Verified** (abstract). With eye tracking, animated banners "attracts less attention than static ads" and weakened the effect of attention on memory.
  - **Counterintuitive:** making something move to get it seen can make it seen *less*, once people have learned what moving things in that place are. The banner-blindness mechanism itself belongs to `where-the-eye-goes`.

## 6. Delight wears off, and spacing brings it back

- **Galak & Redden 2018, *The properties and antecedents of hedonic decline*** (Annual Review of Psychology, https://doi.org/10.1146/annurev-psych-122216-011542). **Verified** (abstract). Repeated exposure "typically reduces the hedonic response". The review groups the causes into physiological feedback, perceptual change and self-reflection.
- **Nelson & Meyvis 2008, *Interrupted consumption*** (J. Marketing Research, https://doi.org/10.1509/jmkr.45.6.654). **Verified** (abstract).
  - In six studies, breaks made pleasant experiences more enjoyable because they "disrupt hedonic adaptation".
  - People still *avoid* breaks in pleasant experiences. Designers likewise want their delight everywhere.
- **Montoya et al. 2017, mere-exposure meta-analysis** (Psychological Bulletin, https://doi.org/10.1037/bul0000085). **Verified** (abstract). 268 curves from 81 articles: liking follows "an inverted-U shaped curve" with repetition for visual stimuli. The peak exposure count is not in the abstract. **Unverified** (often quoted as 10–20).
- **Schmidt & Eisend 2015, advertising repetition meta-analysis** (J. Advertising, https://doi.org/10.1080/00913367.2015.1018460). **Verified** (abstract). Attitude peaks "at approximately ten exposures"; spaced exposures help attitude; effects decay over time. This is the modern statement of "wear-out".
- **Chmiel & Schubert 2017** (Psychology of Music, https://doi.org/10.1177/0305735617697507). **Verified** (abstract). Of 57 music-preference studies, 50 (87.7%) fit an inverted-U against familiarity and complexity. This pairs Berlyne's classic model with a modern review.
- **Gustafsson et al. 2022** (Learning & Behavior, https://doi.org/10.3758/s13420-021-00484-3). **Verified** (abstract). Adults explored novel pictures more but rated "semi-familiar" ones most positively.
- **Rodrigues et al. 2022, gamification over 14 weeks** (IJETHE, https://doi.org/10.1186/s41239-021-00314-6; N = 756). **Verified** (abstract).
  - The effect started to fall after four weeks, a decline that lasted two to six weeks.
  - It "partially" recovered between six and ten weeks: a U shape, with a familiarisation effect after the novelty effect.
  - **Changes the claim:** wear-off is not a one-way slide to zero. A feature that does a job can recover once the novelty is gone; pure decoration has nothing to recover to (inference).
- **Karapanos et al. 2009, *User experience over time*** (CHI, https://doi.org/10.1145/1518701.1518814). **Verified** (abstract). Six people followed for five weeks after buying an iPhone: early experience was tied to hedonic aspects, prolonged use to how the product "becomes meaningful". Small sample; classic.

## 7. Novelty in visual design: MAYA, and why it doesn't settle repetition

- **Hekkert, Snelders & van Wieringen 2003, "Most advanced, yet acceptable"** (Br. J. Psychology, https://doi.org/10.1348/000712603762842147). **Verified** (abstract). Typicality and novelty jointly predict aesthetic preference but "suppress each other's effect". People prefer novelty as long as it doesn't cost typicality.
- **PLOS ONE 2026, ceramic products** (https://doi.org/10.1371/journal.pone.0342855; N = 200). **Verified** (abstract).
  - MAYA's boundaries depend on the category. Typicality predicts more in "poor" categories (few kinds), novelty more in "rich" ones.
  - The two together explain about 21% of variance (21.8% vases, 20.3% lighting).
- **Scientific Reports 2025, drink packaging** (https://doi.org/10.1038/s41598-025-87741-x). **Verified** (abstract). For "a very formal meeting", typicality, unity and connectedness pleased most. For "a good friend's rave party", novelty and variety did. Context shifts the optimum.
  - **Useful for the page:** a work tool at 10 a.m. on a Tuesday is the formal meeting. A completed project is the party. (Dia's phrase, R25.)
- **Limit.** All MAYA studies are one-shot ratings of products seen briefly. None measures novelty preference across repeated *use*. MAYA supports "novel but recognisable", not "novelty wears off". For wear-off, use §6. **Verified** (by absence in the abstracts read).
- **M3 Expressive research** (R1): expressive layouts made key elements faster to find, and the email Send button four times faster. Removing labels hurt usability. This is about salience, not repetition. Google measured Google. **Verified** in R1.

## 8. What products do for rare vs frequent

- **Asana, *Display settings*** (https://help.asana.com/s/article/display-settings). **Verified** (help page). "Show occasional celebrations" makes "a mythical creature… appear at random" when you complete a task. It is a user setting under Display.
  - Three design moves in one line: it is **occasional** (not every completion), **random** (not predictable, so it resists habituation, §2), and **optional**.
  - The setting's default state is not stated on the page. **Unverified.**
- **Emil Kowalski, *You Don't Need Animations*** (https://emilkowal.ski/ui/you-dont-need-animations). **Verified** (re-read this session).
  - "How often users will see an animation is a key factor".
  - Keyboard-initiated actions: "You should never animate them."
  - Raycast has no open animation. A delightful component works "as long as the user will rarely interact with it".
  - It is practitioner guidance, not measurement.
- **Rauno Freiberg** (R9): frequent animation feels like "cognitive burden". **Josh Comeau** (R15): delight goes "mundane and annoying surprisingly quickly". **Dia** (R25): a novelty budget spent on Chat only. All **Verified** in R-notes; all practitioner.
- **Fluent** shortens stagger offsets on repeated loads (§1). It is the only system rule that adapts motion to repetition.

## 9. Reduced motion: what is and isn't known

- **HTTP Archive Web Almanac 2024, *Accessibility*** (https://almanac.httparchive.org/en/2024/accessibility). **Verified.** 49% of desktop and 50% of mobile sites use the `prefers-reduced-motion` media query, up from 34% in 2022.
- **Web Almanac 2025** (https://almanac.httparchive.org/en/2025/accessibility). **Verified.** 49.99% desktop, 50.55% mobile; "little change".
- **How many users turn reduced motion on:** no primary source found. Apple, Google and Microsoft publish no share. **Unverified**; keep any number off pages.
- **Agrawal et al. 2009, NHANES** (Arch. Intern. Med., https://doi.org/10.1001/archinternmed.2009.66). **Verified** (abstract). 35.4% of US adults aged 40+ had vestibular dysfunction, measured by a balance test (modified Romberg).
  - **It is often misquoted.** It measured standing balance, not sensitivity to on-screen motion. A page must not say "a third of people are made sick by animation".
- **For this page:** reduced motion is a floor (WCAG 2.3.3, Apple "Make motion optional"). The novelty budget is a separate argument that applies to everyone. The page should not lean on accessibility to make the frequency point.

## 10. Revised claim

> **The more often something happens, the shorter it should be and the less it should block. The rarer it is, the more it may say.**

- Frequency decides **duration and blocking**, because waiting doesn't habituate (§4).
- Frequency also decides whether delight is **seen** at all, because attention does habituate (§2, §6). Delight on a frequent action is wasted before it becomes annoying.
- **Intensity** decides whether a frequent motion keeps costing attention: very intense stimuli don't habituate (§2), and animation is the top annoyance (§5).
- **Rarity, spacing and variation** keep delight working: rare onsets keep capturing, breaks restore enjoyment, polymorphic warnings resist habituation, Asana randomises (§2, §6, §8).
- What a frequent action *can* keep is a short, predictable, non-blocking motion. Habituated, it may even help as a timing cue (Dissegna 2025). Material's expressive bounce costs no extra time (§1). "Plain" is the wrong word; **"brief and non-blocking"** is the rule.

### Folklore vs evidence

| Folklore | Evidence | Verdict |
| --- | --- | --- |
| "Every animation costs attention every time." | Capture by repeated onsets habituates, faster at higher rates, to zero at 50–80% (Turatto 2016; De Tommaso 2023; Dissegna 2025; Rankin 2009 #4). | Wrong for mild, frequent motion |
| "So frequent animation is harmless once people are used to it." | Waiting doesn't habituate: task time tracks duration (Phosphor 2006); Apple: don't make people wait. Intense stimuli may not habituate (Rankin #5). | Wrong: time and intensity remain |
| "Make it move and people will notice it." | Animated banners got *less* attention than static ones (Lee & Ahn 2012); animated ads rated 3.6 vs 2.4 annoying (Goldstein 2014). | Wrong once the place is learned |
| "Delight makes a product lovable, so add it everywhere." | Hedonic decline with repetition (Galak & Redden 2018); breaks restore enjoyment (Nelson & Meyvis 2008); attitude peaks ~10 exposures (Schmidt & Eisend 2015). | Wrong: spend it rarely and spaced |
| "Novelty wears off to nothing." | Gamification fell after 4 weeks and partly recovered by 6–10 (Rodrigues 2022). | Too strong: useful things recover |
| "Design systems say frequent = plain." | Apple and Carbon say so; Carbon gives the primary button expressive motion; Material makes expressive (bouncy) the default and the same length as standard. | Partly: they agree on short, not plain |
| "MAYA proves novelty wears off." | MAYA studies are one-shot ratings; context and category shift the optimum (2025, 2026). | Wrong use of MAYA |
| "A third of people get sick from motion." | 35.4% figure is a balance test in adults 40+ (Agrawal 2009). | Misquote |

## Demo ideas

The reader should feel the cost by repeating, not by reading. Every demo keeps content, load time and input acceptance identical, and changes one variable.

1. **Archive thirty (main demo).** A list of 30 items with a fixed-position Archive button (keyboard too).
   - Before: each archive plays a 450 ms flourish (row lifts, flies to a folder icon, a small burst), and input waits for it.
   - After: the row collapses in 120 ms and the next item is ready at once; input is never blocked.
   - A quiet counter at the end shows "time spent waiting: 13.5 s vs 0 s" (§4). By item eight the Before already drags. The demo makes the time cost felt, which habituation can't remove.
2. **Your eyes learn, your clock doesn't.** A short reaction game: click a target that appears in the centre, 40 trials.
   - On every trial a flourish plays in the periphery. A live chart plots the reader's own RT cost (with vs without flourish) by block.
   - The cost shrinks over blocks (habituation, §2), while a second line shows the fixed wait the flourish imposes when it blocks.
   - Then the flourish changes shape (polymorphic) and the cost jumps back. This shows that variation, not volume, wins attention back (Vance 2018).
   - Needs care: real RT measurement in a browser is noisy, so show the reader's own data, not a claim.
3. **Rare delight that works.** A to-do list.
   - Before: confetti on every tick. After: nothing on a tick (a 120 ms check), a celebration only when the day's last task is done, and optionally "occasionally, at random" (Asana, §8).
   - Let the reader tick 15 tasks in each. The Before's confetti is ignored by the fifth tick; the After's single celebration lands.
   - This is the one demo where delight is the point.
4. **Bounce is not the cost.** A switch toggled 20 times with Material's expressive fast spatial (350 ms, overshoot) vs standard (350 ms, no overshoot) vs a 500 ms blocking version. The first two feel equally fast; only the blocking one drags. This refines "plain" to "brief and non-blocking" (§1). Detail section, not the main comparison.
5. **Show the result, explain after (Phosphor).** Reorder a list with keyboard moves. Before: each move animates 400 ms and locks the list. After: the item is in its new place instantly and leaves a 1 s afterglow trail. Fast users don't wait; slow users can still see what moved (§4).

## What a page can honestly claim

- Apple says to avoid motion on frequent interactions and not to make people wait for animations, especially repeated ones. Carbon reserves expressive motion for "occasional, important moments". Verified.
- Material assigns its expressive scheme per product, not per frequency. Its expressive and standard springs take the same time. Verified. So "less motion" in practice means shorter and non-blocking, not necessarily less bounce.
- Attention to a repeated, mild visual event habituates, and faster the more often it occurs. Rare events keep capturing attention. Very intense ones may not habituate. Verified (lab, EEG, fMRI on warnings); its transfer to UI animation is reasoning.
- The time an animation makes people wait does not shrink with repetition. Phosphor measured task time tracking animation duration, and participants disliked slow animations despite fewer errors. Verified.
- Animation causally raised the annoyance of ads (paired static/animated, 3.6 vs 2.4). Animated banners drew less attention than static ones. Verified, for ads.
- Pleasure from a repeated experience declines; breaks and spacing restore it. Verified (review and experiments, not UI-specific).
- A product can make celebrations occasional, random and optional (Asana). Verified.
- It cannot claim: a millisecond threshold for "frequent", any measured habituation to UI animations, how many users enable reduced motion, that MAYA says anything about repeated use, or that a third of people get motion sickness from screens.

## Not verified, kept off pages

- The peak exposure count in Montoya et al. 2017 (not in the abstract).
- Ge et al. 2024 IJHCS findings (abstract blocked; search snippet only).
- Bartram, Ware & Calvert 2003 *Moticons* on peripheral motion as a distractor (no abstract retrieved).
- Asana's default for "Show occasional celebrations", and how "occasional" is scheduled.
- Raycast having no open animation (Emil's account, not Raycast's).
- What macOS and iOS do for their own frequent actions (Cmd-Tab, Spotlight); assumed from use.
- Any share of users with Reduce Motion or `prefers-reduced-motion: reduce` enabled.
- Email "11 times per hour" and "87 emails per day" (cited inside Mark et al. 2016; originals not read).

## Open questions

- **Does self-triggered UI motion capture attention at all?** All capture-habituation work uses task-irrelevant distractors. A UI animation the user caused is predicted from the start, so it may never capture much. Demo 2 could test this on the reader, but a page shouldn't report it as a finding.
- **Where is the line between "frequent" and "rare"?** Dissegna 2025's 20% rate (about one trial in five) still captured at the end of a session; 50% did not. That is a lab rate, not a daily count. A per-session count for the page would be invention.
- **Does a habituated motion still help?** Dissegna 2025 found habituated onsets became timing cues. In UI terms, a consistent 120 ms collapse may help people pace a series of archives. Untested.
- **Carbon vs Material on the primary button.** Carbon makes "clicking the primary action button" expressive; Emil says never animate frequent or keyboard actions. The page should pick a side with a reason: importance can justify salience (the M3E Send-button result), but not duration.
- **Should the main demo be keyboard-driven?** Emil's rule is about keyboard-initiated actions; the backlog note flags that transferring it to pointer clicks is inference. Demo 1 offers both and could show whether the drag is felt equally.
- **Polymorphic delight.** Vance 2018 shows varying a warning resists habituation. Does varying a celebration (Asana's random creatures) do the same for enjoyment? There's no direct study; Galak & Redden's "perceptual change" class suggests yes.
