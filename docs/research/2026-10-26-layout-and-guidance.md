# Layout and guidance: mechanisms, sources, page candidates

Written 2026-10-26 to fill the playbook's gap on **content layout** and **guidance**. The immediate test bed is a full-screen mail app: a one-line message list, with a message opening over it. Read with `2026-10-25-playbook-method-digest.md` (house standard), `2026-10-25-topic-backlog.md` (entries *Keep the comparison in sight*, *Teach at the moment of need*, *Make the mode visible*, *Preview the destination*), and `notes/3-perception-guidance.md`, which already covers common region, F-pattern, layer-cake, banner blindness, Cowan's 4 chunks, push/pull revelations and coach marks. None of that is repeated here except where a new primary number changes the verdict.

**Verified** means the claim was read in the source named: full text for papers whose PDF was opened, abstract only where marked. **Unverified** claims stay off pages.

## Mail app weak spots, mapped

| Weak spot | Topic below |
| --- | --- |
| Fixed 200px sender column, big gap before the subject | 1 Grouping by ratio, 2 Alignment |
| No grouping by time | 5 Time sections |
| Toolbar says little about where you are or what you can do | 6 Orientation, 7 Next step |
| Subject and snippet separated only by colour | 4 Row hierarchy |
| Message body left-aligned in a wide pane | 3 Density and line length |
| Shortcuts, bulk select, right-click found only by accident | 8 Discoverability, 9 Teaching |
| Message opens over the list, so the list is gone | 10 External memory |

---

## Layout

### 1. Grouping: space works as a ratio, boxes override it

- **Mechanism.** Proximity grouping depends on *relative* distance, not absolute pixels: what decides whether a sender reads with its subject (a row) or with the sender above it (a column) is the ratio between the horizontal gap and the row pitch. A bounded region (card, row band, hover fill) is a separate, stronger cue that can override spacing outright, and the innermost region wins. So a list can be regrouped by accident in two ways: a gap that grows past the row pitch, or a fill that encloses the wrong things.
- **Strongest finding.**
  - Kubovy, Holcombe & Wagemans, *On the Lawfulness of Grouping by Proximity*, Cognitive Psychology 35:71–98, 1998 (https://lirias.kuleuven.be/retrieve/93542, full text read). The strength of grouping in one direction "approximates a decreasing exponential function of the relative distance between dots in that orientation", and the function holds when the whole lattice is scaled (Exp. 1): distances are scaled to the shortest one. Their attraction function is f(v) = e^(−α(v/a − 1)), with a "representative slope" of 6.6 across observers (the minus sign is lost in the PDF text).
  - Derived, not stated by the paper: with α = 6.6, an alternative grouping whose spacing is 1.25× the nearest is chosen about 0.19× as often; at 1.5× about 0.04×. Small ratio changes flip grouping hard. This applies to dot lattices; text rows are an analogy to test in the demo, not a measured result. Later work reports a vertical orientation bias the law doesn't predict (Esposito 2020 thesis, via search only, unverified).
  - Palmer, *Common region: A new principle of perceptual grouping*, Cognitive Psychology 24:436–447, 1992 (abstract read via Europe PMC, PMID 1516361): common region "is capable of overcoming the effects of other powerful grouping factors such as proximity and similarity", and "it is dominated by the smallest background area".
  - Palmer & Rock, *Rethinking perceptual organization: The role of uniform connectedness*, Psychonomic Bulletin & Review 1:29–55, 1994 (abstract read, PMID 24203413): closed regions of uniform lightness or colour are perceived first as single units, "even when opposed by powerful grouping principles such as proximity and similarity".
  - Material Design 2, *Applying density* (https://m2.material.io/design/layout/applying-density.html, read in browser): "The denser your components become, the larger the margins and gutter widths should be. Combining a dense layout grid with dense components can make differentiating groups of content harder for users." Material 3 Lists (https://m3.material.io/components/lists/guidelines, read in browser): "Limit dividers to uncontained or complex lists, only when a stronger visual separation is necessary."
  - NN/g, Harley, *The Principle of Common Region* (2020, https://www.nngroup.com/articles/common-region/): a boundary "can overpower other grouping principles"; decorative borders "add clutter". No numbers.
- **Later work, checked 2026-10-26.**
  - Wagemans, Elder, Kubovy, Palmer, Peterson, Singh & von der Heydt, *A Century of Gestalt Psychology in Visual Perception I*, Psychological Bulletin 138(6):1172–1217, 2012 (https://pmc.ncbi.nlm.nih.gov/articles/PMC3482144/, full text read). Restates the result as the **pure distance law**: grouping by proximity "depends only on the relative distance between dots in competing organizations, not on the overall configuration". Summarises Kubovy & van den Berg (Psychological Review 115:131–154, 2008): when proximity and similarity act on the same pattern, "the two principles are combined additively". Cites Beck & Palmer 2002 and Palmer & Beck 2007 (repetition discrimination time) as the experimental evidence for common region.
  - Kubovy 1998 also states its own working range: responses for relative distances v/a ≥ 1.59 were excluded because "the floor effect began to influence the data beyond that value", i.e. by about 1.6× the farther organisation is almost never seen. This is the paper's number, unlike the derived ratios above.
  - No recent experiment testing proximity or common region on real UI layouts was found (search 2026-10-26); hits were design blogs, excluded, one quoting a "34%" Palmer figure that appears nowhere in Palmer.
- **Mail app.** A fixed 200px sender column leaves a horizontal gap of well over 100px after short sender names (estimate for this app, not measured), several times a typical one-line row pitch of about 32px, so the list starts to read as two columns. Fix by ratio: sender column sized to content (or a max width with truncation) so the sender–subject gap stays clearly below the row pitch. Date section headers need a gap above them larger than the row pitch, not a divider. A full-row selection fill is uniform connectedness: it binds the whole row, which is right; a fill on only the sender cell would split it.
- **Demo (one variable).** The same 12-row inbox; only the sender column width changes (content-hugging vs fixed 200px). Font, row height, data identical. Reusable tool: a **spacing-ratio overlay** that draws the within-group and between-group gaps and prints their ratio, usable on any demo (forms, cards, menus).
- **Verdict: page-worthy.** "Proximity" alone was rejected as shallow; the ratio law, its scale invariance and the smallest-region rule are not common knowledge, and the overlay is a new tool. Boundary with *Where the eye goes* ("It sorts before it reads"): that detail shows proximity exists; this page is about how much and why boxes win.

### 2. Alignment and scanning: the first words of a line carry the scan

- **Mechanism.** Scanners fixate the start of each line and drop off to the right, so whatever sits at the left of every row is what gets read. When many rows start with the same words, readers learn to skip them. One left edge per element type keeps the eye's return sweep landing on the same column.
- **Strongest finding.**
  - NN/g, Pernice, *F-Shaped Pattern of Reading on the Web: Misunderstood, But Still Relevant* (2017, reviewed 2026, https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/): "Bypassing pattern occurs when people deliberately skip the first words of the line" when several list lines start with the same words. Defined with an example; no frequency or numbers given. NN/g's 2019 *Text Scanning Patterns* article (https://www.nngroup.com/articles/text-scanning-patterns-eyetracking/) lists only F, spotted, layer-cake and commitment, so bypassing is an older, secondary pattern.
  - NN/g, Fessenden, *Horizontal Attention Leans Left* (2017, https://www.nngroup.com/articles/horizontal-attention-leans-left/): over 120 participants, more than 130,000 fixations, "80% of the fixations fell on the left half of the screen" (69% in 2010); on SERPs, 94%. Also: "Centered layouts and wider screens don't imply right fixations."
  - Material 3 Lists: "Place supporting visuals and primary text in the same position in each list item. Don't vary the position of elements within a list."
  - Tullis 1984 dissertation, *Predicting the Usability of Alphanumeric Displays*: number of groups and their average visual angle were the strongest predictors of search time (520 displays, R² = .508; validation r = .80). **Abstract seen only through a search index; CORE returned 403; the "groups of about 5°" figure often quoted could not be found. Unverified.**
- **Mail app.** In a notification-heavy inbox, the sender column repeats ("GitHub", "GitHub", "Linear"), which is exactly the bypassing condition: the eye learns to skip the sender and the real information starts after the gap. Keeping the subject's left edge fixed (one column) matters more than the sender column's width. A ragged start (subject beginning wherever the sender name ends) would break the return sweep.
- **Demo.** Same inbox; only whether the subject starts on one fixed column or right after each sender name. Scan task arises naturally from the content ("which one is the invoice?").
- **Verdict: fold into page 1** as a Detail ("one left edge per kind of thing"). Too thin alone: the bypassing pattern has a definition but no numbers.

### 3. Density and line length

- **Mechanism.** Density helps when the task is scanning and comparing many items, because more of the set is in view at once; it hurts in focused or alert components. For reading prose, what people find comfortable and what is fastest are different things.
- **Strongest finding.**
  - Material 2 *Applying density* (verified, above): denser "lists, tables, and long forms makes information easier to scan, view, and compare"; don't densify focused tasks (pickers) or alerts (dialogs, snackbars); each density step is −4dp in height.
  - Nanavati & Bias, *Optimal Line Length in Reading — A Literature Review*, Visible Language 39(2), 2005 (https://journals.uc.edu/index.php/vl/article/download/5765/4629/7442, full text read). It reports Dyson & Kipping 1998 (24 participants, 25–100 cpl): "100 cpl was read significantly faster than 25 cpl", while 55 cpl was rated easier to read, and preferences "usually did not correlate with their performance". It reports Dyson & Haselgrove 2001 (36 participants, 25/55/100 cpl) recommending 55 cpl for comprehension. **Primary papers not read; numbers are as reported by the review.**
  - WCAG 2.2 SC 1.4.8 (AAA, https://www.w3.org/WAI/WCAG22/Understanding/visual-presentation.html): "Width is no more than 80 characters or glyphs (40 if CJK)"; a narrow block makes it "easier for them to continue on to the next line".
  - NN/g's line-length article remains a 404 (see backlog Source limits).
- **Mail app.** The list should stay dense (scan and compare). The message body should get a measure cap (around 70–80 characters, centered or left-anchored in the pane) rather than running the full pane width. NN/g's left-lean finding says a centered column doesn't push gaze right, so centering the body column is safe.
- **Demo.** The same message; only the body's max width (pane width vs ~75ch).
- **Verdict: common knowledge, skip** as a page. Use the "preference ≠ speed" line as a note on whichever page covers reading. Row height has no primary evidence beyond Material's density scale.

### 4. Hierarchy within a row: grey doesn't make text unread

- **Mechanism.** Lowering contrast barely slows normal-vision reading, so a grey snippet is still read as text. It only loses salience. The boundary between subject and snippet therefore has to be structural (weight, a separator, a position), because colour difference alone is both weak for scanners and expensive for low-vision readers.
- **Strongest finding.**
  - Legge, Rubin & Luebker, *Psychophysics of reading — V. The role of contrast in normal vision*, Vision Research 27:1165–1177, 1987 (abstract read via Europe PMC, PMID 3660667): "for 1 degree letters, reading rate decreased by less than a factor of two for a tenfold reduction in contrast."
  - Rubin & Legge, *Psychophysics of reading — VI. The role of contrast in low vision*, Vision Research 29:79–91, 1989 (abstract, PMID 2788957): in 16 of 19 low-vision observers, critical contrast was "averaging 3.9 times higher" than for normal observers.
  - WCAG 1.4.1 (colour alone can't carry meaning) is already cited on *Colour means one thing*.
- **Mail app.** "Subject  snippet" in one line, split only by grey, reads as one run-on string when scanning. Gmail-style separators, a weight change on the subject, or a fixed snippet column give a boundary that survives greyscale and low vision. Unread state should be weight (bold subject/sender), not a third colour.
- **Demo.** One row style; only the separator between subject and snippet changes (colour only vs colour plus an em dash or a weight step). Squint-test tool reuse.
- **Verdict: fold into *Where the eye goes*** (or *Colour means one thing*) as a Detail: "Grey is still read". The Legge number is a genuine surprise but supports one detail, not a page.

### 5. Time sections: anchor time to things people remember

- **Mechanism.** People recall *when* something happened relative to other events, not as a date. Sections like Today / Yesterday / Last week turn a date column into a few landmarks, and split one long list into a few groups that can be skipped as a whole.
- **Strongest finding.**
  - Ringel, Cutrell, Dumais & Horvitz, *Milestones in Time: The Value of Landmarks in Retrieving Information from Personal Stores*, INTERACT 2003 (https://erichorvitz.com/landmark.pdf, full text read). 12 Microsoft employees, 30 search tasks over their own mail stores (5,844–70,469 messages). Timeline with public and personal landmarks vs dates only: average median search time 18.37 s vs 24.25 s, t(11) = 2.33, p < 0.05. Note the landmarks were holidays, news and calendar events, not relative-date headers. The finding supports "dates alone are a poor retrieval cue", not Today/Yesterday headers specifically.
  - First-party: Microsoft Outlook "automatically groups items by date"; default groups "Today, Yesterday, Last Week, Last Month, and Older" (https://support.microsoft.com/en-us/office/group-or-ungroup-messages-in-your-inbox-c6d17df3-8488-42b2-a773-278686205478). Apple Notes for Mac: "You can group notes by how recently they were created or edited (for example, Today, Yesterday, or Previous 30 Days)" (https://support.apple.com/guide/notes/apd000074a4e/mac). Apple HIG *Lists and tables*: the grouped style "uses headers, footers, and additional space to separate groups of data".
  - Gmail and Apple Mail grouping behaviour not checked; don't name them.
- **Mail app.** Add relative sections (Today, Yesterday, Earlier this week, then months), separated by space larger than the row pitch (topic 1). Rows inside a section can then drop the date and show time only. That removes a repeated column, which is the bypassing condition again.
- **Demo.** The same 30 messages; only whether section headers exist (dates stay in the rows in both). Task arising from content: "the message from the day of the offsite".
- **Verdict: fold into page 1** as a Detail, or into a future List component page. The landmark study is real but tests a different manipulation, so it can't carry a principle page on its own.

## Guidance

### 6. Orientation: where am I

- **Mechanism.** Every view can be the first one people see, so each needs to say what it is and where it sits, using cues that persist rather than a one-time transition.
- **Strongest finding.** NN/g, Farrell, *Navigation: You Are Here* (2015, https://www.nngroup.com/articles/navigation-you-are-here/): "Navigation should not only show where you can go but also where you are now." No study data. WCAG 2.4.2 Page Titled and 2.4.8 Location are the formal versions.
- **Mail app.** The toolbar row should name the mailbox and its count ("Inbox · 3 unread"). With rows selected it should become a selection bar ("2 selected", with bulk actions), which is a mode and must look like one. With a message open, its title row should say which mailbox it came from and offer the way back.
- **Demo.** Same toolbar; only whether the current mailbox name shows.
- **Verdict: common knowledge, skip.** The selection-bar part belongs on the backlog's *Make the mode visible* (NN/g Modes, already verified there).

### 7. The next step: signifiers and empty states

- **Mechanism.** Norman's revision: an affordance is what's possible; what designers control is the **signifier**, "any physically perceivable cue" that says what to do. Weak signifiers don't stop people; they slow everyone down while they check.
- **Strongest finding.**
  - Norman, *Signifiers, Not Affordances*, interactions 15(6):18–19, 2008 (https://www.alice.id.tue.nl/references/norman-2008.pdf, read): "I call any physically perceivable cue a signifier, whether it is incidental or deliberate."
  - NN/g, Moran, *Flat UI Elements Attract Less Attention and Cause Uncertainty* (2017, https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/): 71 participants, 9 page pairs, eyetracking. With weak signifiers people "spent 22% more time" and "had 25% more fixations"; p < 0.05. On one pair, 86% fixated the heading first with strong signifiers vs 50% with weak.
  - NN/g, Kaplan, *Designing Empty States in Complex Applications* (2021, https://www.nngroup.com/articles/empty-state-interface-design/): "Totally empty states cause confusion about how and whether the system is working." No study data.
- **Mail app.** Toolbar icons with labels or tooltips; an empty mailbox or empty search that names the next step ("No messages match 'invoice' — Search all mail"). Rows look clickable through hover and the pointer, already the norm.
- **Demo.** Toolbar buttons; only whether they have a resting signifier (outline or tint) vs flat text-like icons.
- **Verdict: fold.** The 22% / 25% number strengthens *Button* or *Toolbar*; empty states belong in the backlog's *Filter bar* (query-caused zero results). No page.

### 8. Discoverability of hidden features

- **Mechanism.** Hidden is not "slightly less used"; it is a different population of users. Most people never switch to the faster method even after years, and a hint shown where they aren't looking does nothing, because attention is on the task.
- **Strongest finding.**
  - NN/g, Pernice & Budiu, *Hamburger Menus and Hidden Navigation Hurt UX Metrics* (2016, https://www.nngroup.com/articles/hamburger-menus/): 179 participants, 6 sites. On desktop, "people used the hidden menus in only 27% of the cases", against 48% (visible) and 50% (combo); "more than 20% drop in discoverability"; desktop tasks "at least 39% slower".
  - Grossman, Dragicevic & Balakrishnan, *Strategies for Accelerating On-line Learning of Hotkeys*, CHI 2007 (https://www.dgp.toronto.edu/~ravin/papers/chi2007_learninghotkeys.pdf, full text read). Hotkey use: 28.9% control (the hotkey shown in the menu, as usual), 66.6% with audio feedback speaking the hotkey, 72.8% when menu items were disabled so the hotkey had to be used. In the control group "7 of the 14 participants did not make any effort to learn or use the hotkeys". In the pilot, a visual hint that blinked and followed the cursor scored 50% vs 57.1% for control (n.s.). Users "switched their visual attention" back to the task.
  - Lane, Napier, Peres & Sándor, *Hidden Costs of Graphical User Interfaces*, IJHCI 18(2):133–144, 2005: 251 experienced Word users mostly did not use shortcuts for their most frequent commands, though shortcuts were fastest. **Abstract read via a secondary index only; the often-quoted "<10% of the time" figure is unverified.**
  - NN/g, Kaley, *Contextual Menus* (2019, https://www.nngroup.com/articles/contextual-menus/): "users may not know it is available, or how to access it"; the commands must also be in the main menu. NN/g, Li, *Contextual Swipe* (2017): "most users won't discover these actions" (expert analysis, no data).
  - Apple HIG *The menu bar* (JSON source read): list every command in the menu bar, because "Excluding commands from the menu bar — even infrequently used or advanced commands — risks making them difficult for everyone to find"; "Avoid making a dynamic menu item the only way to accomplish a task." The menu bar is where people "discover keyboard shortcuts".
  - Gmail Help (https://support.google.com/mail/answer/6594): shortcuts "won't work unless keyboard shortcuts are turned on"; "?" opens the list. Whether they're off by default isn't stated there.
- **Mail app.** Every row action reachable by right-click also lives in a visible place (the open message's toolbar, a row's More button). The key appears inside the control people already use: in the tooltip, next to the menu item, in the context menu. "?" opens a cheat sheet. Bulk select gets a visible checkbox column on hover or focus plus Shift-click, not Shift-click alone.
- **Demo.** A row's context menu; only whether each item shows its key. A **hotkey-use counter** (share of actions done by key vs pointer, as Grossman measured) under the demo makes the effect felt over a few minutes rather than read.
- **Verdict: page-worthy, merged with topic 9** (see shortlist). Boundary with *Hover forgives*: that page says hover can't hide the only way; this page is about the expert path and why showing it louder doesn't work.

### 9. Teaching at the moment of need

- **Mechanism.** Help works when it's attached to the thing being used, at the moment it's used: memory doesn't carry instructions across the gap, and people skip anything that delays the task (the paradox of the active user).
- **Strongest finding.**
  - Grossman & Fitzmaurice, *ToolClips: An Investigation of Contextual Video Assistance for Functionality Understanding*, CHI 2010 (https://research.autodesk.com/app/uploads/2023/03/toolclips-an-investigation-of.pdf_recbnW20cbxDanglq.pdf, full text read): tooltips extended with short clips; "users successfully completed 7 times as many unfamiliar tasks" than with a commercial help system (completion 70% vs 10%); one week later 83.3% vs 56.7% (n.s.).
  - Kelleher & Pausch, *Stencils-Based Tutorials: Design and Evaluation*, CHI 2005 (abstract read via WUSTL profile): in-place overlays were completed 26% faster with fewer errors than a paper tutorial, but learning was statistically similar. In-context guidance speeds the task; it doesn't by itself teach more.
  - NN/g, Laubheimer, *Onboarding Tutorials vs. Contextual Help* (2023, https://www.nngroup.com/articles/onboarding-tutorials/): tutorials "don't result in better task performance" and users "frequently skip them". NN/g, Harley, *Instructional Overlays and Coach Marks* (2014): that information "fades in about 20 seconds". NN/g, Nielsen, *Paradox of the Active User* (1998), citing Carroll & Rosson 1987: "Users never read manuals but start using the software immediately."
- **Mail app.** No first-run tour. The first time someone archives with the pointer, the toast says "Archived · E"; the shortcut appears in tooltips and menus; "?" lists all of them. Bulk-select hint appears the first time two rows are opened in a row, not before.
- **Demo.** The same Archive hint text; only when it appears (on first open vs in the toast after the first pointer archive).
- **Verdict: merge with topic 8 into one page.** On its own, the backlog scored it felt 3; the hotkey counter and ToolClips' 7× make the merged page stronger than either.

### 10. Keeping comparisons in sight: access cost decides memory use

- **Mechanism.** People prefer to look again rather than memorise, but only while looking is cheap. Add a fraction of a second to each look (a hover delay, a click, a view that replaces the list) and they switch to holding things in memory: fewer, longer looks, and more memory errors. The change is gradual and starts at a few hundred milliseconds, well below what anyone would call "hidden".
- **Strongest finding.**
  - Gray, Sims, Fu & Schoelles, *The Soft Constraints Hypothesis*, Psychological Review 113(3):461–482, 2006 (https://home.cs.colorado.edu/~mozer/Teaching/syllabi/3702/readings/GraySimsSchoellesFu2006.pdf, full text read). Blocks World copy task; the model window opened after a lockout of 0, 200, 400, 800, 1,600 or 3,200 ms (16–18 per group). Mean looks per trial: 5.6, 4.8, 4.5, 3.7, 3.5, 2.9; first-look duration rose from 1,603 to 4,634 ms; blocks placed after the first look rose from 2.00 to 3.58. "As access costs increase, people minimize time per trial by accessing the Target Window less and using memory more."
  - Same paper, reporting Ballard, Hayhoe & Pelz 1995: with everything visible, people looked twice per block (3 s) rather than memorise colour and place in one look (1.5 s); Ballard: "It is surprising that participants choose minimal memory strategies in view of their temporal cost." Same paper, reporting Gray & Fu 2004 (Cognitive Science 28:359–382): "a progressive increase in errors and in trials-to-criterion as the cost of information access increased". **Ballard and Gray & Fu primaries not read; quoted via Gray et al. 2006.**
  - NN/g, Budiu, *Working Memory and External Memory* (2018, https://www.nngroup.com/articles/working-memory-external-memory/): "The screen serves as a natural external memory."
- **Mail app.** A message that opens *over* the list removes the list: which message was next, what's unread nearby, and the subject being replied to. Each look back now costs a close and a reopen, so people start remembering instead. Keep a compact list or a "next/previous" with subject visible beside the open message; keep the list's scroll and selection when returning.
- **Demo.** The backlog's plan plus Gray's variable: the same plan comparison, only the delay before the reference reappears (0 ms vs ~400 ms hover reveal). Or in the mail scene: message over list vs message beside a narrow list. The backlog's mobile Compare tool still applies.
- **Verdict: page-worthy; upgrade the existing backlog entry** *Keep the comparison in sight*. Gray et al. gives the counterintuitive number it lacked: a 200 ms lockout already drops looks from 5.6 to 4.8 per trial.

---

## Not verified, kept off pages

- Tullis 1984 group-size threshold ("about 5°"): not found in any source read; dissertation not accessible (CORE 403).
- Lane et al. 2005 "shortcuts under 10% of the time": seen only on a blog.
- Dyson & Kipping 1998 and Dyson & Haselgrove 2001 numbers: through the 2005 review only.
- Bypassing-pattern frequency: NN/g gives a definition, no rate.
- Malacria et al., *ExposeHK* (CHI 2013, hold a modifier to show all hotkeys): citation confirmed via DBLP, full text not found. Apple's visionOS hold-⌘ shortcut overlay (HIG *Keyboards*, read) is a first-party instance of the same idea.
- Rosenholtz et al. 2007 clutter measures: secondary summaries only.
- Wiedenbeck 1999 icons vs labels: secondary only.

## Ranked shortlist

1. **Keep the comparison in sight** (upgrade of backlog rank 7). The strongest new evidence: Gray et al. 2006 show the switch from looking to remembering starts at a 200 ms access cost (5.6 → 4.8 looks per trial, down to 2.9 at 3.2 s), and Ballard shows people pay double the time to avoid memorising when looking is free. It's counterintuitive (designers treat a hover or a click as free), has numbers, and maps directly onto the mail app's message-over-list. The planned mobile Compare tool still counts.
2. **Space groups by ratio** (new). Kubovy's pure-distance law (relative distance, scale-invariant, steep exponential), Palmer's common region and uniform connectedness (a box beats spacing, the smallest box wins), and Material's "denser components need wider gutters" add up to one mechanism a working designer doesn't know in this form. It fixes the 200px sender gap, date-section spacing and the subject/snippet split, absorbs topics 2 and 5 as Details, and earns a new **spacing-ratio overlay** tool.
3. **The faster way lives on the slow way** (topics 8 + 9, new; absorbs backlog *Teach at the moment of need*). Hidden navigation used 27% vs 48% (NN/g); hotkey use 28.9% with the usual menu label vs 66.6–72.8% when the path itself teaches it, while a louder visual hint did nothing (Grossman 2007); ToolClips' 7× task completion. Fixes shortcuts, right-click and bulk select. A live **hotkey-use counter** makes it felt.
4. **Grey is still read** (topic 4) as a Detail on *Where the eye goes*, not a page. Legge 1987's tenfold-contrast / under-2× speed result and the 3.9× low-vision penalty are a sharp, sourced surprise, but they support one Detail. Time sections (topic 5) go into page 2 for the same reason.
