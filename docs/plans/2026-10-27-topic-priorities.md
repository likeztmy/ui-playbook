# Topic priorities (2026-10-27)

One ranking for everything waiting: the 2026-10-25 backlog (`docs/research/2026-10-25-topic-backlog.md`, still the source of each topic's sources and demo), T1, T2, T4 and T5 from `docs/research/2026-10-27-human-modern-references.md`, the new colour-system topic, and what the site polish left open.

Done since the backlog was written, so not ranked: *Let motion change its mind*, *A shadow says how high* (T3), *Space groups by ratio*, *How waiting feels*.

## How it's scored

The backlog scored depth and felt only. Since then the owner has asked for three more things, so each topic is scored 1–5 on six axes, summed (max 30):

- **Depth**: how counterintuitive the mechanism is.
- **Felt**: can a reader feel the difference in a demo without being told what to do.
- **Sources**: recent primary sources exist (2020+, or a classic with a recent counterpart). The shadow page showed that classics alone read as stale.
- **Post**: the mechanism can be proved in Post, the In practice app, where it doubles as marketing.
- **Fit**: modern, human, consumer-facing, the direction the owner set on 2026-10-27.
- **Effort**: inverse cost (5 is cheapest).

These are editorial judgements, not measurements.

## Ranking

| # | Topic | Kind | Depth | Felt | Sources | Post | Fit | Effort | Total |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Choosing a colour system (absorbs *A colour changes with its neighbours*). **Done:** *Lightness first, hue last* | principle | 5 | 5 | 5 | 5 | 5 | 3 | **28** |
| 2 | A reading face is not a UI face (T4) | principle | 4 | 5 | 3 | 5 | 5 | 4 | **26** |
| 3 | Who, before what: faces in lists (T1, absorbs *Avatar*) | principle | 4 | 4 | 3 | 5 | 5 | 4 | **25** |
| 4 | Focus is not selection | principle | 4 | 4 | 3 | 5 | 3 | 4 | **23** |
| 5 | Drawer / Sheet | component | 4 | 5 | 4 | 3 | 4 | 3 | **23** |
| 6 | A novelty budget (T5, merged with *The more often, the less motion*) | principle | 4 | 4 | 4 | 3 | 5 | 3 | **23** |
| 7 | Preview the destination | principle | 5 | 5 | 3 | 2 | 3 | 2 | **20** |
| 8 | Command menu | component | 5 | 4 | 4 | 1 | 2 | 3 | **19** |
| 9 | Keep the comparison in sight | principle | 4 | 4 | 2 | 2 | 3 | 3 | **18** |
| 10 | Count what the reader sees | principle | 5 | 4 | 4 | 2 | 2 | 1 | **18** |

Ties are ordered by Post, then Fit. Everything below #10 in the backlog keeps its backlog order; none of it scores above 18 on this scale.

### Why this order

1. **Colour system.** The owner asked for it, research is running (`docs/research/2026-10-27-colour-system.md`), and sources are rich and recent: OKLCH (2020), Material HCT (2022), Radix, Tailwind v4, Linear's 2024 theme generator, APCA. Post already proves it: warm tinted ground, one accent, the unread blue. The old *neighbours* topic becomes one section of this page (the same token reads differently on a different ground), not a page of its own.
2. **Reading face.** Post's conversation view already makes the case (760px measure, 25px leading, 26px subject) against a list set for scanning. The demo is one message set both ways. Sources need a reading pass: Rello et al. 2016, Dyson on line length, Apple HIG Typography; recent counterparts to be found.
3. **Faces in lists.** Post just gained faces. The demo is a task ("find Priya's last message") with and without them. Face-detection speed (Crouzet 2010) is classic; Grandjean 2025 is the recent pair. No study of avatar size versus search time exists, so the page must say the demo is the test.
4. **Focus is not selection.** Post has all three states on one row (focus ring, ticked, open), so the proof is ready. Less consumer-flavoured, which is why it sits below the first three.
5. **Drawer / Sheet.** Strong felt demo (map with route details, modal versus not), current Material and Apple guidance. Post's phone layout gives a second case.
6. **Novelty budget.** Fits the owner's taste exactly, but Post deliberately spends almost no novelty, so the proof would be a new scene.
7–10. High depth, weaker fit: they are productivity or engineering mechanisms, and Post cannot show them without new features (drag to a folder, a command menu) that would argue against the no-shortcuts decision.

### Not a page of its own

- **Structure felt, not seen (T2).** The claim overlaps *Space groups by ratio*, and no primary study of rules versus whitespace in list scanning was found. Add a short section to that page, with Post's Two planes list as the case.
- **The target is the whole thing.** Needs a feasibility spike (a real pointer isn't stopped by a container edge) before it can be planned.

## Site upkeep, done between topics

Not topics, but they lower the credibility of every new page while they stay open. One small batch before topic #2:

1. Source the unsourced mechanism claims on Tooltip, Card, Menu, Popover, Table and Toolbar, or cut them.
2. Combobox, Menu and Popover pairs look identical until clicked: start them open or play once on entering.
3. Align section structure on error-timing and concentric-radius with the newer principle pages.
4. Check Post's compact density in dark mode.
5. `og:image` for every page.
