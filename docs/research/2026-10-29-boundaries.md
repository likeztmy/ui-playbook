# Boundaries: when a group gets a box, a line, or only a heading and space

Research for the next page, about giving a group of content its boundary. When does a region get a card, when do hairline dividers inside one container do it, and when is a heading plus space enough? And why do agents keep making the same mistake: every section in its own bordered box, boxes inside boxes, dashboards of equal tiles?

Not repeated here (cited by section):
- Kubovy et al. 1998 (pure distance law, floor at about 1.6× relative distance), Wagemans et al. 2012, the Palmer 1992 / Palmer & Rock 1994 abstracts, Material 3 *Lists* ("Limit dividers to uncontained or complex lists…") and NN/g *Common region*. All are in `2026-10-26-layout-and-guidance.md` §1. §1 below adds what those abstracts say about **nested** regions, and the later experiments.
- Reinecke & Gajos 2014 (complexity d = 2.0 vs colourfulness d = 0.3–0.8), Burke et al. 2005 and the Rosenholtz 2007 abstract are in `2026-10-28-colour-amount-and-decoration.md` §3–5. §2–3 below add Reinecke et al. 2013, the paper that defines how complexity is *counted*.
- Polaris, Primer and Fluent radius tokens are in `2026-10-29-design-system-numbers.md`. §4 measures only borders, dividers and card padding.
- Tullis 1984 was marked "unverified" in `2026-10-26-layout-and-guidance.md` §2. §2 below gets as far as the 1983 review's abstract. The 5° figure is still unverified.

**How to read the labels.**
- **Verified**: read in the primary source this session (2026-10-29). That's full text where a PDF was opened, the abstract (Europe PMC, OpenAlex) where marked "abstract", or a design system's own page or docs source.
- **Secondary**: known only from a citing paper or a search snippet.
- **Unverified**: from memory or inference. Keep these off pages.
- **Measured**: read from a source repo, an API doc's JSON, or this repo's eval output, 2026-10-29.
- **Computed**: worked out here, with the method stated.

Throwaway scripts are in the session scratchpad (`bound/oa.py` for OpenAlex abstracts, `bound/epmc.py` for Europe PMC, `bound/hig.py` for Apple HIG JSON, `bound/pdf2txt.js` for PDF text via macOS PDFKit). They aren't part of the repo.

---

## 0. What the playbook already says, and what's new

**Already on pages.**
- *Space groups by ratio* (`src/pages/principles/space-groups-by-ratio.mdx`):
  - a gap separates only when it's clearly bigger than its neighbours;
  - "a shared background or border outranks spacing altogether";
  - one left edge per kind of thing.
  - Its `RatioRegion` demo shows a fill beating a gap.
- *Card* (`src/pages/components/card.mdx`):
  - a card is "one unit in a set people browse by sight";
  - "one block of a page is a section with a heading";
  - a card whose stage is a generic icon is "a list row in disguise";
  - "cards don't go inside cards".
- *Grey until it matters*: at a glance, regions cost (Reinecke & Gajos). "A tinted sidebar, a hero panel and a coloured header split the same content into more pieces."

**What's new here.**
1. **The innermost region wins, and a region also cuts its contents off from the page.**
   - Palmer 1992: common region "is dominated by the smallest background area" and "can follow a hierarchical embedding scheme".
   - Vickery 2008: a common-region boundary blocks grouping from spreading across it.
   - So a card inside a card regroups, and a box around a section stops it lining up with its neighbours (§1).
2. **A box helps only when the group is real and big enough. Around the wrong things it costs.**
   - Brumby & Zhuang 2015, using line boxes: boxes sped search only for semantic groups of 6 (3.04 s vs 3.62 s for groups of 3).
   - Around unrelated items, boxes made search 14% slower (4.51 s vs 3.95 s) (§2).
3. **Proximity is as fast as a connected region.**
   - Han et al. 1999: "grouping by proximity can be as fast and efficient as that by UC".
   - So a heading plus space is a full boundary, not a weaker one (§1, §3).
4. **Complexity is counted in regions.** Reinecke et al. 2013's best counts were:
   - the number of space-separated regions, r = .5 with rated complexity;
   - "number of text groups", β = .344 in a model with R² = .65.
   - Every box adds a region (§2).
5. **The systems disagree on dividers, and the disagreement is the lesson (§4).**
   - Apple iOS: one rounded group per section, hairlines aligned to the text.
   - Primer: one bordered box, rows split by a lighter line.
   - Polaris: "Divider lines are reserved for data and index tables"; split a card with nested surfaces instead.
   - Fluent: put the divider *above* a header, never under it.
   - Apple macOS *Boxes*: a box near the size of its window "becomes less effective", and nested boxes make the interface "feel busy and constrained".
6. **Settings and dashboards: contain groups, not items (§5).**
   - Android: use containment "between groups instead of individual items".
   - GOV.UK: "Do not use summary cards if you only need to show a small amount of related information".
7. **Indentation is a claim about structure (§6).**
   - Its presence has a large effect: 179% more time on unindented code (Morzeck et al. 2023).
   - Its depth had none in a replication (Bauer et al. 2019).
   - When it lies, it hides bugs. Apple's `goto fail` is two lines at one indent (measured).
8. **Eval (§7).**
   - The playbook arm still boxes every settings section (`01-confirm-delete` B: 4–6 boxes per build vs 6 without).
   - In the sign-up task it made more boxes, not fewer (mean 6.4 vs 6.0).
   - The `boxes` count can't see nesting depth or equal tiles.

---

## 1. Common region and connectedness: strong, innermost wins, and it walls the contents off

- **Mechanism.**
  - An enclosing region (a border or a fill) is an *extrinsic* grouping cue. It beats proximity and similarity, the *intrinsic* ones.
  - When regions nest, the smallest one decides what reads together. A card inside a card therefore regroups its contents with each other and away from the outer card.
  - A boundary also stops structure flowing across it. Alignment and rhythm that would tie a section to its neighbours are cut at the border.
  - Good proximity is as fast as a connected region. A box isn't needed for speed, only to override spacing that is wrong or ambiguous.
- **Classic.**
  - Palmer, *Common region: a new principle of perceptual grouping*, Cognitive Psychology 24:436–447, 1992, doi:10.1016/0010-0285(92)90014-s (**verified, abstract**, Europe PMC, PMID 1516361).
    - Common region "is capable of overcoming the effects of other powerful grouping factors such as proximity and similarity".
    - It "is dominated by the smallest background area and … can follow a hierarchical embedding scheme".
    - These are demonstrations, not timed experiments.
  - Palmer & Rock 1994 (uniform connectedness): see `2026-10-26-layout-and-guidance.md` §1.
  - Han, Humphreys & Chen, *Uniform connectedness and classical Gestalt principles of perceptual grouping*, Perception & Psychophysics 61:661–674, 1999, doi:10.3758/BF03205537 (**verified, abstract**, Europe PMC). Global letters were made of circles grouped by proximity, by shape similarity, or by uniform connectedness (UC).
    - Similarity was slower than proximity, and adding UC sped similarity up.
    - Proximity "was unaffected by connecting the local elements".
    - UC beat only *weak* proximity (Exp. 3).
    - The abstract concludes: "grouping by proximity can be as fast and efficient as that by UC".
  - Kimchi, *Uniform connectedness and grouping in the perceptual organization of hierarchical patterns*, JEP:HPP 24(4):1105–1118, 1998, doi:10.1037/0096-1523.24.4.1105 (**verified, abstract**). With many elements, "the entry-level units … were global configuration and texture". Individual elements came later and needed focused attention. A wall of many equal tiles is first seen as one texture, not as tiles.
- **Measured strength and recent replications.**
  - Palmer & Beck, *The repetition discrimination task*, Perception & Psychophysics 69:68–78, 2007, doi:10.3758/BF03194454 (**verified, abstract**). It's an objective timing method that measures grouping by "proximity, color similarity, common region, and element connectedness". The per-factor RT numbers are in the full text, **not read** (Springer PDF behind a cookie wall).
  - Beck & Palmer, *Top-down influences on perceptual grouping*, JEP:HPP 28(5):1071–1084, 2002, doi:10.1037/0096-1523.28.5.1071 (**verified, abstract**). The within-group advantage grew with the share of within-group trials (25/50/75%). The effect was "stronger for extrinsic grouping factors (common region and connectedness)", but the authors trace that to overall search speed.
  - Montoro, Villalba-García, Luna & Hinojosa, *Common region wins the competition between extrinsic grouping cues*, Psychonomic Bulletin & Review 24:1856–1861, 2017, doi:10.3758/s13423-017-1254-3 (**verified, abstract**, PMID 28251594). In an indirect task (no attention to grouping), "grouping by common region dominated" connectedness, "even though the phenomenological strength of the grouping cues was equated for each participant". Numbers are not in the abstract.
  - Pan et al., *Grouping strategies in numerosity perception between intrinsic and extrinsic grouping cues*, Scientific Reports 11:17605, 2021, doi:10.1038/s41598-021-96944-x (**verified, abstract**, OpenAlex). Extrinsic cues (region, connectedness) gave more precise estimates of "how many" than intrinsic ones. A box makes the count of items in it easier to judge.
- **Nested regions.**
  - Vickery, *Induced perceptual grouping*, Psychological Science 19(7):693–701, 2008, doi:10.1111/j.1467-9280.2008.02144.x (**verified, abstract**, PMID 18727785).
    - Structure in one set of items "induces grouping" in a nearby uniform set.
    - "Induced grouping was reduced when grouping between the structured and unstructured sets was weakened by means of a common-region cue."
    - Reading for UI (inference, not tested on UI): a box around a section stops the page's column rhythm carrying into it. That's one reason boxed sections drift out of alignment with each other.
  - Palmer 1992's "hierarchical embedding" and "smallest background area" are the only primary statements on nesting found. **No timed experiment on nested regions in a UI was found** (search 2026-10-29).
- **Implications for the page.**
  - A box is the strongest grouping tool, so it's the one to spend least often. It overrides spacing, so a box around the wrong things wins even when the spacing is right (see §2, Brumby).
  - "The innermost box wins." A card inside a card regroups its contents and adds a second boundary that says nothing new. That's the perceptual reason behind *Card*'s "cards don't go inside cards".
  - A heading with the right space is not a weaker boundary: proximity is as fast as connectedness (Han 1999). Reach for a box when spacing alone can't carry the grouping: a dense grid, content on a busy ground, or one region that has to read as one thing (a dialog, a selectable item).
  - Demo idea (one variable): the same settings content three ways. Four boxed sections; one box with hairlines; headings and space. Use the existing ratio overlay to show the gaps are identical, so only the boundary changes.

## 2. Number and size of groups vs search time: each box is another group to visit

- **Mechanism.**
  - Search through a display is a walk from group to group. Time grows with the number of groups, and inside a group with its size (the eye covers a group of limited size in one or a few fixations).
  - A boundary helps when it lets someone skip a whole group: the group must be real (one kind of thing) and large enough that skipping it saves time.
  - Boxes that cut content into many small groups add stops. Boxes around unrelated things send the eye to the wrong place.
- **Classic (Tullis).**
  - Tullis, *The Formatting of Alphanumeric Displays: A Review and Analysis*, Human Factors 25(6):657–682, 1983, doi:10.1177/001872088302500604 (**verified, abstract**, OpenAlex). It names "four characteristics of display formats … overall density, local density, grouping, and layout complexity", with objective measures for each.
  - Schwartz 1986, a Rice dissertation (**verified, abstract**, OpenAlex), reports that "Tullis (1983, 1984) identified and quantified six conceptually distinct dimensions". It found Tullis's equations predicted perceived difficulty well, but not scanning when locations were known. **Secondary** for Tullis.
  - The often-quoted numbers, **still unverified**:
    - 520 displays, R² = .508 (search index only, `2026-10-26-layout-and-guidance.md` §2);
    - "groups of about 5°", with search time growing with group count below 5° and with group size above it. A search summary attributes the 5° claim to Tullis 1984 and links it to Widdel's visual-lobe size.
    - The 1984 dissertation, the 1986 HFES paper (doi:10.1177/154193128603001218) and the Handbook chapters could not be opened: SAGE and Semantic Scholar returned 403, and Rice's repository returned 403. **Keep 5° off pages.**
  - Parush, Nadir & Shtub, *Evaluating the Layout of Graphical User Interface Screens*, IJHCI 10(4):343–360, 1998, doi:10.1207/s15327590ijhc1004_3 (**verified, abstract**). This is Tullis's approach extended to GUIs.
    - Factors: "element size, local density, alignment, and grouping".
    - "The combination of poor alignment and poor local density had the strongest adverse effect on search time."
    - "Alignment and grouping were found to have more influence on subjective preference."
- **Boxes, measured.**
  - Brumby & Zhuang, *Visual Grouping in Menu Interfaces*, CHI 2015, pp. 4203–4206, doi:10.1145/2702123.2702177 (**verified, full text**, UCL Discovery PDF).
    - Setup: 36 participants; 36-word menus in 3 columns of 12; known-item search.
    - Visual grouping was done with **line boxes**, chosen because boxes don't move items (spacing would).
    - Semantic order helped overall: 3.34 s vs 4.23 s random, ηp² = .70.
    - With boxes and semantic order, large groups (6 groups of 6) were faster than small groups (12 groups of 3): **3.04 s vs 3.62 s**, ηp² = .28. "There was no effect of group size when there was no visual grouping."
    - With random order, boxes made search **slower: 4.51 s vs 3.95 s** (computed: +14%), F(1,34) = 5.00, p = .03.
    - Neither group size nor boxes had a main effect overall. The benefit lives entirely in the interaction.
    - Their words: "Adding visual grouping cues to an already poorly organized menu can make matters worse and should be avoided."
    - They suspect the choice of cue (boxes, space, colour) "will make little difference". That is untested.
  - Bae & Watson, *Reinforcing Visual Grouping Cues to Communicate Complex Informational Structure*, IEEE TVCG 20:1973–1982, 2014, doi:10.1109/TVCG.2014.2346998 (**verified, abstract**). Card sorting plus tree edit distance:
    - structure is "best done with multiple reinforcing grouping cues";
    - "common region (use of containers such as boxes) is particularly effective at communicating structure";
    - "alignment is a weak structural communicator".
- **Modern complexity metrics count regions.**
  - Reinecke, Yeh, Miratrix, Mardiko, Zhao, Liu & Gajos, *Predicting Users' First Impressions of Website Aesthetics With a Quantification of Perceived Visual Complexity and Colorfulness*, CHI 2013, pp. 2049–2058 (**verified, full text**, Harvard PDF).
    - Quadtree leaves correlated only weakly with rated complexity: r = .28 (N = 367).
    - The leaves of a **space-based decomposition** did better: r = .5. That decomposition "recursively divides an image into … content regions … until a region has no visible space divider".
    - The final complexity model (R² = .65) keeps "number of text groups" (β = .344), "number of image areas" (β = .193) and number of leaves (β = .123), alongside text and non-text area.
  - Miniukovich & De Angeli, *Quantification of interface visual complexity*, AVI 2014, doi:10.1145/2598153.2598173 (**verified, abstract**, OpenAlex).
    - "Information organization" includes "symmetry, grid, ease-of-grouping and prototypicality".
    - Their metrics explained "up to 51% of aesthetics ratings and 50% of complexity ratings".
    - Their 2015 CHI paper (doi:10.1145/2702123.2702575, abstract) reached 49% for web pages and 32% for iPhone apps.
  - Putkonen, Jiang, Zeng, Tammilehto, Jokinen & Oulasvirta, *Understanding visual search in graphical user interfaces*, IJHCS 199:103483, 2025, doi:10.1016/j.ijhcs.2025.103483 (**verified, abstract**). 84 participants, 900 real GUIs: "the type of GUI, the absence/presence of the target, and cue type affected search time more than visual complexity did". They describe a "Guess-Scan-Confirm" pattern that starts top-left. This is the honest counterweight: on real screens, complexity is a modest factor in search time.
- **What each extra box does to "number of groups" (computed, by the definitions above).**
  - A box around a section that space already separates adds **no new group**, just a perimeter of edge.
  - A box that splits one real group into two adds a group.
  - A box inside a box adds a region level and its own perimeter. In Reinecke's terms it adds a leaf, because an edge is a divider. That's an inference: the paper says "space divider", and whether a border splits a leaf in their implementation wasn't checked.
  - A grid of n equal tiles is n groups of the same weight, with nothing saying which to visit first.
- **Implications for the page.**
  - State the condition, not the decoration: "A box earns its place when it lets someone skip the whole group: one kind of thing, and more than a few of them."
  - Brumby gives the page its sharpest number: boxes around the wrong groups cost 14%, and boxes around small groups lost to boxes around large ones by 19% (3.62 vs 3.04 s, computed).
  - Honest size: Putkonen 2025 says complexity is not the main driver of search on real GUIs. The case against extra boxes is first impressions (Reinecke) plus wrong grouping (Brumby), not raw search speed.

## 3. Borders vs fills vs dividers vs whitespace

- **Mechanism.**
  - All four can mark a boundary. They differ in what they add.
  - Whitespace adds no edges.
  - A divider adds one line, and it binds the two sides less strongly than a box does.
  - A border adds a closed perimeter.
  - A fill adds a region of different luminance.
  - Clutter measures treat edges and luminance and colour variation as the cost, because clutter is the stand-in for "set size" in search.
- **Direct comparisons.**
  - **No study was found that times border vs fill vs divider vs whitespace for grouping in a UI** (search 2026-10-29).
  - Closest: Brumby 2015 chose boxes over spacing precisely because spacing changes positions. Bae & Watson 2014 rank region above alignment. Han 1999 puts proximity level with connectedness.
  - Rozario, *Effects of grouping command-icons on spatial memory development of commands in graphical interfaces*, University of Regina thesis, 2025, doi:10.82465/5 (**verified, abstract**, OpenAlex). Grouping "based on spatial separation using lines and spaces" improved spatial learning over no grouping. With abstract icons, "spatial separation remained a strong predictor". It's a thesis, not peer-reviewed.
- **Clutter metrics.** Rosenholtz, Li & Nakano, *Measuring visual clutter*, Journal of Vision 7(2):17, 2007, doi:10.1167/7.2.17 (**verified, abstract**, Europe PMC; JoV full text 403).
  - Clutter measures are offered as "a substitute for 'set size'" in search models.
  - Subband Entropy rests on "the visual information in the display".
  - Edge Density comes from Mack & Oliva 2004 "as a measure of subjective visual complexity".
  - Every 1 px border is edge content for both. The abstract doesn't break clutter down by element type.
- **Computed: lines added by each option.**
  - Setup: one settings page, 640 px wide, four sections, each 152 px tall with its padding.
  - Four bordered cards: 4 × 2 × (640 + 152) = **6,336 px of line**; `boxes` = 4.
  - One card with three hairlines: 2 × (640 + 4 × 152) + 3 × 640 = **4,416 px** (−30%); `boxes` = 1.
  - Headings and space: **0 px**; `boxes` = 0.
  - All three show four groups.
- **What the systems do with weight (measured, §4).** Where a system has both, the divider inside a container is lighter than the container's border:
  - Primer: `.Box` border `--borderColor-default`, `.Box-row` divider `--borderColor-muted`.
  - Polaris: `color-border` is gray 8, "The default color for borders on any element". `color-border-secondary` is gray 7, "The color for hr elements or any visual dividers".
  - Material Android: an outlined card uses `colorOutline`, while `MaterialDivider` defaults to `colorOutlineVariant`.
- **Implications for the page.**
  - Order the options by cost: space, then a divider, then a fill, then a border. Escalate only when the cheaper one fails.
  - A divider sits inside a group (between rows), and it is lighter than any container edge.
  - A border that carries nothing else is the most expensive option, so it gets the strictest test.

## 4. What design systems do

All quotes **verified** from the system's own page or docs source on 2026-10-29, unless marked.

- **Apple.**
  - HIG *Boxes* (`/design/human-interface-guidelines/boxes`, JSON):
    - "As a box's size gets close to the size of the containing window or screen, it becomes less effective at communicating the separation of grouped content, and it can crowd other content."
    - "A box's border is a distinct visual element — adding nested boxes to define subgroups can make your interface feel busy and constrained." Instead: "Consider using padding and alignment to communicate additional grouping within a box."
  - HIG *Layout*:
    - "use negative space, container shapes, or separator lines to show which elements are related";
    - people "perceive indented items as subordinate to the item they follow".
  - HIG *Lists and tables*: the grouped style "uses headers, footers, and additional space to separate groups of data"; macOS's bordered style "uses alternating row backgrounds".
  - UIKit `UITableView.Style.insetGrouped`: "A table view where the grouped sections are inset with rounded corners." That's one rounded group per section, which is iOS Settings.
  - UIKit `UICollectionViewListCell.separatorLayoutGuide`: "By default, when you apply a system-provided content configuration to a list cell, the separator automatically aligns to the primary text in the content view." The hairline starts at the label, not at the icon or the cell edge (**measured**, developer docs JSON).
  - SwiftUI `GroupedFormStyle`: "leading aligned labels and trailing aligned controls within visually grouped sections".
  - SwiftUI `ColumnsFormStyle` (classic macOS): "a trailing aligned column of labels next to a leading aligned column of values", no sections.
  - SwiftUI `Form`: on macOS the example "doesn't use sections".
- **Material.**
  - Material Android *Divider* (`material-components-android/docs/components/Divider.md`):
    - "Full width dividers separate larger sections of unrelated content."
    - "Inset dividers separate related content within a section."
    - Dividers "can also be used to imply nested parent/child relationships".
    - Defaults: `1dp` thickness (`8dp` heavy), `?attr/colorOutlineVariant`, insets `0dp` (**measured**).
  - material-web *Divider*: `--md-divider-thickness: 1px`, `--md-divider-color: --md-sys-color-outline-variant` (**measured**).
  - Material Android *Card*: outlined card stroke `1dp`, `?attr/colorOutline`; filled and elevated have 0dp stroke; the example has `android:padding="16dp"` (**measured**).
  - M3 *Lists* (prior note §1): "Limit dividers to uncontained or complex lists".
  - **The m3.material.io card and divider guideline pages are a JS app and returned no text.** Whether M3 says "don't nest cards" is **unverified**.
- **Fluent 2.**
  - *Divider*:
    - "A divider groups sections of content to create visual rhythm and hierarchy. Use dividers along with spacing and headers."
    - "Inset dividers don't extend to the edges of a container and imply closer relationships."
    - "Minimally, default dividers and dividers with content should have 12 pixels of space on top and bottom."
    - And the one to quote: "Put the divider above the header" / "Don't underline headers with dividers".
  - *Card*: "A card is a container that holds information and actions related to a single concept or object". "Real estate is limited so keep card content brief and action oriented."
  - Source (**measured**, `react-card/.../useCardStyles.styles.ts`): padding and gap `8px` / `12px` / `16px` for small / medium (default) / large; the default appearance is `filled` with `shadow4`, not a border. The divider is `strokeWidthThin` in `colorNeutralStroke2` by default.
- **Carbon.**
  - *Tile*: "Tiles reside on the same plane as the page background layer and do not have elevation." "Do not add a drop shadow to tiles." A tile "is a different color than the UI background": a fill, not a border.
  - Under the v12 flag, "A border has been added to the clickable, selectable, and expandable variants of tile to visually indicate they are operable". In Carbon, **a border signals that it can be operated**.
  - *Structured list*: "Nesting items is not recommended" (use a data table).
  - *Color → layering*: "There are four layers within a theme: base layer, layer 01, layer 02, and layer 03." "Each step in UI color … is another layer." That is a hard cap on nesting depth.
  - All from `carbon-website/src/pages/…/usage.mdx`.
- **Polaris** (`polaris.shopify.com/content/…`).
  - *Card*: "Cards are used to group similar concepts and tasks together". "Use headings that set clear expectations about the card's purpose". "only one primary call to action per card". Use "the space in the upper right corner of the card for persistent, optional actions (such as Edit)". Defaults: 8px radius, `--p-shadow-300`, `space-400` (16px) padding.
  - *Spatial organization*: "Divider lines are reserved for data and index tables." "Don't use horizontal lines to divide a surface that isn't a data or index table." Instead, "Nested surfaces can be grouped together within another surface". Also "Avoid nesting a table in a card if it's the only content of that card", and "Reduce the border radius of inset surfaces".
  - *Card layout* pattern: "Place action in the header unless it represents the entire card" (a don't). "Instead, place the action in proximity to what it represents." Call-to-actions go in the footer. List actions go "at the end of the list".
  - *Divider* source: default `border-secondary`, width `025` (**measured**).
- **Primer.**
  - `primer/view_components` `border_box.pcss` (**measured**): `.Box` has one `--borderWidth-thin` border in `--borderColor-default`, radius `--borderRadius-medium`. `.Box-row` is split by a top border in `--borderColor-muted`, padding `--stack-padding-normal`. `.Box-header` is filled `--bgColor-muted`.
  - This is the owner's "one card, hairlines inside" pattern, as GitHub ships it.
  - The Primer docs (`foundations/layout.mdx`, `border-box.mdx`) give **no** prose rule on when to use borders. The phrase "Borders… sparingly" was **not found**.
- **GOV.UK** (*Summary list*, *Check answers*).
  - Summary cards are for "multiple summary lists that all describe the same type of thing, such as people".
  - "Do not use summary cards if you only need to show a small amount of related information. Use summary lists instead, and structure them with headings if needed."
  - "Think carefully before you remove row borders". Row borders exist because "the borders above and below each row help to show which row action is tied to which piece of information".
  - Card actions go in the header: "do not add more than 2 to 3 actions in a header".
- **Linear** (Aufmann & Heckel, *Behind the latest design refresh*, linear.app/now, 12 March 2026).
  - Section heading: "Structure should be felt not seen".
  - Borders and separators "had quietly proliferated across the platform, sometimes appearing without clear reason".
  - The fix was "rounding out their edges and softening the contrast". The caption reads: "fewer separators".
  - Also: "not every element of the interface should carry equal visual weight".
- **Raycast** (API docs, *List*): `List.Section` is "A group of related List.Item" with a "Title displayed above the section". Accessories are "displayed on the right side".
- **Vercel Geist** *Materials*: surface levels by radius (6 / 12 px) only. **Nothing on nesting or borders.**
- **Implications for the page.**
  - The systems agree on three things:
    - a group is one kind of thing (Fluent "single concept", GOV.UK "same type of thing", Polaris "similar concepts");
    - nesting is capped or discouraged (Apple, Carbon, Polaris for single-content cards);
    - the divider is lighter than the container.
  - They disagree on *dividers inside cards*: Apple and Primer yes; Polaris only for tables; Fluent above headings only.
  - The page can teach the deciding fact. A divider is for rows that repeat (a list, a table, a summary list). A distinct sub-part of one card gets space or an inset surface.

## 5. Settings pages and dashboards

- **Settings.**
  - iOS: inset-grouped sections, one rounded group per section, headers and footers outside the group, hairlines aligned to the label (§4).
  - macOS: `Form` renders "as aligned vertical stacks" with no sections in Apple's example. `.grouped` gives "visually grouped sections".
  - HIG *Settings*: "Minimize the number of settings you offer", and put task-specific options in the screens they affect.
  - Android *Settings* pattern (developer.android.com/design/ui/mobile/guides/patterns/settings):
    - "Group settings in smaller relevant groups. Use visual or intrinsic containment and headings between groups instead of individual items."
    - "For 15 or more settings, group related settings under a subscreen."
    - "Don't allow single pane settings items to stretch to full width."
  - Polaris *App settings layout*: the left column holds "glanceable labels and descriptions"; in the right column "settings are grouped in cards". The section's heading sits *outside* the card, on the page.
  - GOV.UK: a summary list per section, with headings; cards only for repeated things of one type.
- **Dashboards.**
  - Carbon *Dashboards*, a "work in progress":
    - "Limit the number of metrics";
    - "reduce a page's complexity by stripping away anything that could distract";
    - "Establish a strong hierarchy … Place the most important at the top".
    - Its line that white space "increases comprehension by almost 20 percent" cites an HFI newsletter. **Secondary; keep off pages.**
  - Carbon defers dashboard *cards* to IBM-internal pattern libraries (`pages.github.ibm.com`, not public, not read).
  - Polaris has no dashboard page in its content tree (`content/` listing checked).
  - Kimchi 1998 (§1) is the perceptual reason equal tiles fail. Many equal elements are first seen as texture, and picking one out "involved focused attention".
- **Implications for the page.**
  - Settings rule from the sources: one boundary per group, never per item. The heading sits outside the boundary, and a section the page's space already separates needs no second frame.
  - Dashboards: equal tiles make hierarchy impossible, because the boundary gives each the same weight. Carbon's "strong hierarchy" and Linear's "not every element … equal visual weight" both say rank first, then box only the first rank, if anything.

## 6. Indentation and hierarchy: indent says "belongs to the line above"

- **Mechanism.** Indentation is read as subordination. When it matches real structure it is one of the strongest layout cues. When it doesn't, it is believed anyway, so it misleads.
- **Sources.**
  - Apple HIG *Layout*: people "perceive indented items as subordinate to the item they follow". HIG *Outline views*: "Expose data hierarchy in the first column only".
  - Morzeck, Hanenberg, Werger & Gruhn, *Indentation in Source Code: A Randomized Control Trial on the Readability of Control Flows in Java Code with Large Effects*, ICSOFT 2023 (**verified, full text**, SciTePress PDF).
    - 20 participants.
    - "indentation has a strong (p < .001) and large (ηp² = .832) positive effect";
    - "179% more time on non-indented code" (142%–269% across treatments).
  - Bauer, Siegmund, Peitek, Hofmeister & Apel, *Indentation: Simply a Matter of Style or Support for Program Comprehension?*, ICPC 2019, doi:10.1109/ICPC.2019.00033 (**verified, full text**, Passau PDF).
    - A replication of Miara et al. 1983 (86 programmers, Pascal, where 2–4 spaces was best).
    - 22 participants, Java, eye tracking: "We did not find any indication that the indentation levels affect program comprehension or visual effort". The largest time difference was 12 s.
    - Together with Morzeck: **whether** something is indented matters a lot; **how far** barely does.
  - GCC `-Wmisleading-indentation` (GCC manual, Warning Options): "Warn when the indentation of the code does not reflect the block structure", enabled by `-Wall`. Example: `bar ();` "is misleadingly indented as if it were guarded by the 'if' conditional".
  - Apple's `goto fail` (CVE-2014-1266; NVD: the function "does not check the signature in a TLS Server Key Exchange message"). **Measured** in `apple-oss-distributions/Security`, tag `Security-55471`, `libsecurity_ssl/lib/sslKeyExchange.c`, lines 629–631. There are two `goto fail;` lines at the same indent under one `if`, and the second always runs. The NVD text doesn't mention indentation; the link is from the source itself.
- **Implications for the page.**
  - Indent only a real child: a nested item of a tree, a dependent setting under its parent switch (Android: "Place a dependent setting below the setting on which it depends").
  - An indent that is padding inside a box, or a section body pushed in under its heading, claims a parent–child relation that isn't there.
  - One step of indent is enough to say "child". The depth doesn't need tuning (Bauer).

## 7. Eval evidence (read-only)

- **The metric.** `eval/walks/look.mjs:116–128` counts as a box any on-screen element at least 48 × 48 px that draws its own edge:
  - a fill differing from its parent;
  - **all four** borders ≥ 1 px;
  - or any shadow.
  - Inputs, buttons, SVG and media are excluded. One-sided dividers don't count, so "one card with hairlines" scores 1.
  - The metric doesn't report nesting depth or equal siblings.
- **`boxes` per build** (**measured**, `ui-playbook-eval-runs/<task>/<arm>-<n>.run/walk.json` → `look.boxes`; A = without the playbook, B = with):

  | Task | A | B | Mean A / B |
  | --- | --- | --- | --- |
  | 01-confirm-delete | 6, 6 | 6, 4, 6, 5, 4 | 6.0 / 5.0 |
  | 04-sign-up | 7, 5 | 4, 8, 10, 0, 10 | 6.0 / 6.4 |
  | 08-tracker | 3, 3 | 2, 3, 2, 2 (no b-3 run) | 3.0 / 2.25 |

  - The sign-up B runs are worse: most of their boxes are a decorative illustration panel.
  - `04-sign-up/b-4` scores 0 boxes but 4 hand-drawn SVGs.
  - The tracker's low counts are partly an artefact. Its list rows are full-width bands that the walk's state doesn't box.
- **Examples** (paths under `/Users/polar/code/ui-playbook-eval-runs/`):
  1. **Every settings section a card, without the playbook.**
     - Cards: `01-confirm-delete/a-1/src/App.tsx:484` (General), `:556` (Project access), `:585` (Danger zone `danger-card`).
     - Each `.card` is border + fill + radius + shadow (`styles.css:602–607`).
     - Inside each card, a bordered header band (`styles.css:608–614`) and a filled, bordered footer band (`:696–704`) make three regions per section.
  2. **Equal stat tiles.**
     - Three `.card` tiles: `01-confirm-delete/a-1/src/App.tsx:642–654` (Total issues 48, Completed 28, Team members 6), then a fourth card for progress at `:656`.
     - The grid is `repeat(3, 1fr)` (`styles.css:873–877`).
  3. **The same in the second A run.** `01-confirm-delete/a-2/src/App.tsx:574, 625, 675` are settings, access and danger cards. Then three bordered stat tiles (`:712`, `styles.css:1019–1028`) and an overview card (`:726`).
  4. **With the playbook, still one card per section.**
     - `01-confirm-delete/b-3/src/App.tsx:68–71`: `settings-card` (General), `settings-card access-card`, `danger-card`, `settings-card member-list`.
     - `overview-stats` is three bordered tiles (`styles.css`: `.overview-stats>div{…border:1px solid…}`).
     - B-4 and B-5 use the same `settings-card` per section (`b-4/src/styles.css`, `b-5/src/style.css`).
  5. **Counter-example inside the same task.**
     - `01-confirm-delete/b-4`'s `overview-stats` is one bordered box with `border-right` hairlines between its cells. That is the owner's pattern, and it scores 1 box instead of 3.
     - `01-confirm-delete/b-2` (4 boxes, the lowest) lays settings out as `settings-section` rows with a heading column, separated by `border-top` (`.access-section`, `.save-row`). Only the danger zone gets a box.
  6. **Boxes four deep.** `04-sign-up/a-1/src/App.tsx:148–176` nests four levels:
     - `.showcase` (fill + border, `styles.css:359–365`);
     - `.canvas-window` (radius 9, `:414`);
     - `.canvas-workspace` (dotted fill, `:457`);
     - `.poster` (fill + border + shadow, `:472–477`).
     - Plus a floating `.palette-card` (`:214`, `styles.css:590`). All of it is decoration in an `aria-hidden` scene.
  7. **The same nesting with the playbook.** `04-sign-up/b-5/src/App.tsx:10` (one long line) has `.showcase` (fill), `.editor` (border + fill + shadow) inside it, a filled `.poster` inside that, and a bordered `.floating-note` with a shadow (`style.css`). It scores 10 boxes.
  8. **Five equal tiles on a tracker overview.**
     - `08-tracker/a-2/src/App.tsx:427–440`: one bordered, filled button per status, in `repeat(5, 1fr)` (`styles.css:1112–1124`).
     - Then a bordered `overview-panel` (`:442`, `styles.css:1136–1140`) whose rows also carry dividers (`.member-row` `border-bottom`, `:1147–1152`).
  9. **A promotional card in the sidebar.** `08-tracker/a-2/src/App.tsx:298` `workspace-card`: border, gradient fill, an icon chip and a bordered footer (`styles.css:296–339`). A region that carries no task.
  10. **A bordered detail panel and project cards on a component task.** `01-confirm-delete/b-5`: `.project-card` (border + fill) and `.detail-panel` (border, padding 26) (`style.css`). The project detail is boxed on a page that is already the project.
- **Implications for the page and the eval.**
  - The agents' default is "section = card". The card page's line "one block of a page is a section with a heading" didn't change it in the B arm. The new page has to name the mistake directly, with the settings screen as its example.
  - Proposed look metrics:
    - `boxDepth`: the deepest chain of boxes;
    - `equalTiles`: three or more sibling boxes of equal size in a row;
    - `soloBox`: a box whose only content is one list or table, Polaris's "only content" rule.

## 8. The owner's rule, tested against the sources

> "Panels and lists need a grid. Every section has a visible boundary: a card, or a hairline divider inside one card. Icons sit in one column. Labels start on one vertical line. Trailing meta is right-aligned in one column. Section actions go on the section's header row. Indent nothing unless the hierarchy is real and visible."

| Clause | Verdict | Sources |
| --- | --- | --- |
| Every section has a visible boundary | **Agree on "visible", refine on "boundary"** | Brumby 2015: boundaries help when the group is real and large enough. But space plus a heading is a boundary too: Apple grouped style ("headers, footers, and additional space"), Fluent ("dividers along with spacing and headers"), GOV.UK ("structure them with headings"), Android ("headings between groups"), Han 1999 (proximity as fast as UC), Kubovy (prior note: ≥1.6× is unambiguous). |
| …a card, or a hairline divider inside one card | **Supported by Apple iOS and Primer; contradicted by Polaris; qualified by Apple macOS** | iOS inset-grouped and Primer `.Box` / `.Box-row` are exactly this. Polaris: "Divider lines are reserved for data and index tables"; split other cards with nested surfaces. Apple *Boxes*: a box approaching the window size "becomes less effective". Refinement: hairlines between *repeating rows*; one card for a set, not around a whole page. |
| (implied) not every section its own card | **Strongly supported** | Android "instead of individual items"; GOV.UK "Do not use summary cards if you only need to show a small amount"; Apple "nested boxes … busy and constrained"; Carbon's four-layer cap; Linear "quietly proliferated". |
| Icons in one column; labels on one vertical line | **Agree, for scanning; not as grouping** | Apple grouped form "leading aligned labels"; UIKit separators align "to the primary text". Parush 1998: poor alignment + local density hurt search most. Bae & Watson: alignment is "a weak structural communicator", so alignment can't replace a boundary. |
| Trailing meta right-aligned in one column | **Agree** | SwiftUI grouped form "trailing aligned controls"; Raycast accessories "on the right side". |
| Section actions on the section's header row | **Agree for whole-section actions; refine** | GOV.UK card actions in the header, at most 2–3. Polaris: header actions only if they represent "the entire card"; next-step CTAs in the footer; item actions on the item; list "add" at the end of the list. |
| Indent nothing unless the hierarchy is real and visible | **Strongly supported** | HIG *Layout* (indented = subordinate); Morzeck 2023 (+179% without indentation); Bauer 2019 (depth doesn't matter); GCC `-Wmisleading-indentation`; `goto fail` (measured). |

Two places the sources go further than the rule:
- Dividers are lighter than container borders: Primer muted vs default, Polaris gray 7 vs 8, Material `outlineVariant` vs `outline` (measured).
- Fluent places dividers above headings, never under them. An underline binds the heading to the content above it, which is the ratio rule again.

---

## Strongest counterintuitive points for the page

1. **A box around the wrong things is worse than no box** (Brumby & Zhuang 2015, N = 36, full text).
   - Boxes around unrelated items made search 14% slower: 4.51 s vs 3.95 s.
   - Around real groups, boxes helped only when groups were large: 3.04 s for groups of 6 vs 3.62 s for groups of 3.
   - Without boxes, group size didn't matter at all.
2. **The innermost box wins, and a box walls its contents off.**
   - Palmer 1992: "dominated by the smallest background area", "hierarchical embedding".
   - Vickery 2008: a common region blocks grouping from spreading across the boundary.
   - A card inside a card regroups, and a boxed section stops lining up with its neighbours.
3. **Space is as fast as a box.**
   - Han et al. 1999: "grouping by proximity can be as fast and efficient as" uniform connectedness.
   - Kubovy: at about 1.6× relative distance the other reading is almost never seen.
   - A heading with the right gap is a full boundary.
4. **A box nearly the size of its window stops working** (Apple HIG *Boxes*). The outer card around a whole settings page adds a perimeter and no information. "adding nested boxes … can make your interface feel busy and constrained."
5. **Complexity is counted in regions, not in pixels of colour** (Reinecke et al. 2013).
   - Space-separated regions correlate r = .5 with rated complexity, against r = .28 for quadtree leaves.
   - "number of text groups" has β = .344.
   - Each extra box is another region in the first half-second, where complexity outweighs colour (Reinecke & Gajos 2014, prior note).
6. **The divider's job is rows, and it's lighter than the box.**
   - Polaris reserves dividers for tables and nests surfaces otherwise.
   - Primer, Polaris and Material all draw the divider lighter than the container border (measured).
   - Fluent: above the header, never under it.
   - GOV.UK keeps row borders because they show which row an action belongs to.
7. **Contain groups, not items** (Android *Settings*: containment "between groups instead of individual items"; GOV.UK: no cards for "a small amount of related information"). The eval shows agents doing the opposite even with the playbook: the B arm averaged 5.0 boxes on a four-section settings page, against 6.0 without.
8. **Whether you indent matters; how far doesn't.** Unindented code took 179% longer (Morzeck 2023, ηp² = .83). Indent depth had no measurable effect (Bauer 2019, a replication of Miara 1983). Indentation that doesn't match structure is believed anyway (GCC's warning; Apple's `goto fail`, measured).

## Not verified, kept off pages

- **Tullis's numbers**: 520 displays, R² = .508, validation r = .80, and especially "groups of about 5° of visual angle". Only the 1983 review's abstract was read. The 1984 dissertation, the 1986 HFES paper and the Handbook chapters were unreachable (SAGE, Semantic Scholar and Rice all returned 403 or rate-limited).
- **Palmer & Beck 2007** per-factor RT differences (common region vs proximity in ms), and **Montoro et al. 2017** effect sizes. Abstracts only; the Springer PDFs sit behind a cookie redirect.
- **Bae & Watson 2014** tree-edit distances per cue (abstract only).
- **Miniukovich & De Angeli 2014/2015/2018**: which metric captures "ease-of-grouping", and its weight (abstracts only).
- Whether a border, as opposed to whitespace, splits a leaf in Reinecke 2013's space-based decomposition (the paper says "space divider"; the implementation wasn't checked).
- Any timed comparison of border vs fill vs divider vs whitespace on UI layouts: **not found**.
- Any timed experiment on **nested** boxes in a UI: **not found**. Palmer 1992's nesting claims are demonstrations.
- **Material 3** card and divider guidance (m3.material.io is a JS app and returned no text), including any "don't nest cards" rule.
- Carbon's "white space increases comprehension by almost 20 percent" (cites an HFI newsletter; secondary).
- Primer "use borders sparingly": not found in Primer's docs.
- IBM dashboard-card patterns (`pages.github.ibm.com`, internal).
- Rozario 2025 (lines and spaces both aid spatial learning): thesis abstract only, not peer-reviewed.
- Vickery 2008 applied to UI alignment across boxed sections: inference.
- The computed line lengths in §3 assume a 640 × 152 px section; they illustrate proportions, not a measured screen.
