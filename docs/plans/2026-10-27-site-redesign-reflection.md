# Site redesign: reflection and directions

2026-10-27. After the Sheet and novelty-budget pages, and the owner's note that Craft (craft.gustavofior.com) feels more consumer-grade while ours reads "a bit like an internal tool". Two independent passes:

- A fresh-eyes audit of the live site, with screenshots in the session scratchpad `audit/`.
- A study of nine references: Craft, Emil Kowalski, Rauno Freiberg, Josh Comeau, Bartosz Ciechanowski, Laws of UX, Apple HIG, Material 3, Vercel's guidelines. Screenshots are in `refs/`.

The bug-level polish (`2026-10-27-site-polish.md`) is done and not repeated here.

## What's wrong, in one line

The substance is right and the packaging is a design-system's. Three things stack:

- The home page is a catalogue.
- Every page wears a spec-document skeleton.
- Every demo sits in the same specimen frame.

## Where it shows

| # | Problem | Evidence | Severity |
| --- | --- | --- | --- |
| 1 | The home page is a catalogue. The first screen has a title, one line and a search box, then 36 identical cards: components first, principles next, Post last and alone. | "5 details" counts and a mono "20" beside the section heads are admin-dashboard grammar. Button's card is ~300 px of grey around two buttons. The first screen doesn't say who it's for, why it's worth reading, or where to start. | High |
| 2 | Pages read as a design-system doc. | Components always run When to use / Details / Variants / Anatomy / States / Common mistakes / Copy. Anatomy tables list token names (`fill-control`, `ease-spring-snappy`). Principles open with "The rule" and state the conclusion before the reader has felt anything. | High |
| 3 | Openings have no hook; citations crush the argument. | *Who, before what* has six citations in its first paragraph. Pages run 1,300–1,500 words with ~18 links. The most memorable lines are buried mid-paragraph ("waiting doesn't wear off"; "a 36 px face is under 1°"). | High |
| 4 | Body type breaks the site's own *Set reading text* page. | 15/24 Geist on a 510 px measure, left-aligned in an 880 px body, with ~370 px empty on the right while demos run full width. References use 16–19 px on 630–690 px. | Medium-high |
| 5 | Demo chrome is a specimen frame, and many pairs look identical at rest. | Every demo has a white box, a tinted Before/After band and a theme switch. Button has 13 of them; its timing pairs (hover, press) are the same until you guess what to do. Openers don't invite: Sheet's map is static until a pin is tapped; Menu is a small trigger on a big empty stage. | Medium-high |
| 6 | Thin navigation. | On wide screens there's no table of contents and no sense of how far along you are. Search matches titles and summaries only ("loading" doesn't find Button's loading section). Links between principles and components don't show on the home page. | Medium |
| 7 | Phone. | The home page is ~16,000 px of single-column cards. Before/After stacks, and the "Before" label sits at the bottom, so you learn it was the wrong one after looking. | Medium |

## Why we got here (our process, not the reader's view)

- **Research first, page second.** Each page was written from its research note, so it reads like one: claim, citation, claim. The research is what makes the playbook different, but it's presented as evidence, not as the story's turns.
- **One template for honesty.** `Frame` / `Compare` were built so every comparison is fair and side by side. Standardising them made every demo look like a lab specimen, and the tinted Before/After band is close to Craft's Wrong/Right signature.
- **Acceptance checked correctness, not reading.** Tests, axe, overflow and frame time all pass. Nothing checked whether a first-time reader wants the next paragraph. The owner's "还行吧" on Sheet was that missing check.
- **The home page grew by appending.** Each new page added a card; nobody designed the front door after the first five.
- **Same canon as Craft.** Both draw on Emil and Rauno, so topics collide (interruptibility, hover, novelty). Our edges are primary research and Post, and neither is on the first screen.

## Keep

1. Demos that measure the reader. For example: "Waited 0.5 s · 2 presses lost"; the 15-trial face search with "the test is yours".
2. Post, with the Mail page's Show-in-the-app decisions: the most convincing thing on the site.
3. Counterintuitive, sourced claims, and the honest "what the evidence doesn't say".
4. The quiet visual base: concentric lines, consistent sample data, both themes.
5. Every comparison fair: same content, one variable.

## Three directions

Each would be built on the same real content (home, *Attention wears off*, *Button*) before choosing.

### A. Interactive essay

Ciechanowski's and Comeau's shape, our evidence.

- **Opening:** a question you can answer with your hands, then one hero demo. The rule comes after it, as the turn of the story.
- **Body:** 17–18 px on a ~660 px measure, with demos the same width or wider. Citations become numbered notes; the endnotes say in a line what each source found. Section heads read as sentences.
- **Demos:** no per-demo band or theme switch. A small label above says which is which, ideally saying what differs ("Holds the press" / "Takes every press"). One page-level control slows or pauses everything. Timing pairs play once when they come into view.
- **Components:** the argument as an essay. Anatomy, States and Copy move to a collapsible Reference at the end.
- **Home:** a thesis, three ways in, and principles as chapters with a live thumbnail each.
- **Cost:** a rewrite of every opening and a new demo chrome, but no new demos.

### B. Field guide

A specimen book. The furthest from Craft.

- **Page:** one large live specimen per page, with numbered callouts on the details that matter. Hovering or tapping a callout zooms in and plays it.
- **Identity:** each family (motion, colour, space, input) has its colour and emblem.
- **Take-away:** each page ends with "field marks", a short checklist that can be copied or downloaded as a card.
- **Home:** a field-guide index grouped by family, not by component vs principle.
- **Fit:** best for components. Principles need a specimen to hang on, which some don't have.

### C. Casebook led by the product

Post, and the demo apps to come, are the front door.

- **Home:** opens with the live app, full width.
- **Principles:** each is a moment in Post. The page starts from that moment, explains it with the research, and links back to it in the app.
- **Fit:** the strongest marketing, and it matches "In practice proves the playbook".
- **Cost:** it depends on more apps, since today there's one. The argument must stay principle-first, never "Gmail does it".

## Recommendation

A for every page, with C's front door on the home page:

- open the home page on the thesis, then Post, then the chapters;
- borrow B's numbered callouts for component specimens.

A fixes the reading problems (1–5) without new demos. C puts our strongest proof first. B's callouts give components a shape no essay site has.

## Fixes that hold in any direction

- Body type and measure to the site's own *Set reading text* rules.
- Timing pairs that look identical at rest play once on entering view.
- Search covers section headings.
- Drop "N details" and the mono section counts.
- Before/After on a phone: one at a time with a switch, labelled above.

## Learning from Craft

Sharing good choices with Craft is fine, and often a sign of the same taste: Monet in sample content, a press scale, a fair side-by-side pair. We don't avoid them. The line is wording, and copying a page's structure wholesale. Our own ground is the evidence, the angle, and Post. When a topic is the same as one of Craft's, find the angle the research gives us (as *Attention wears off* argues against "less animation"), rather than steering away from the topic.

What Craft's pages do that ours don't yet:

- **One tunable playground.** *Button Press* lets you set the scale (0.97) and the duration (100 ms) on a single button, with guides you can show. You find the amount yourself instead of reading it.
- **A taste range, said plainly.** "I like 0.98 or 0.97… below 0.95 it starts to look like an effect." That's a range with a reason, in the author's voice. Ours state one value and cite it.
- **The neighbouring case.** "Not just buttons": cards press too, but larger surfaces shrink less, because 0.97 of a full-width card moves its edges several pixels. It's one consequence the reader wouldn't have guessed.
- **Take-away with gotchas.** Copyable code (Tailwind, CSS) plus the traps no spec mentions:
  - transition `transform` only;
  - a disabled button shouldn't press;
  - clear iOS's tap highlight;
  - iOS applies `:active` only while something listens for touches.
- **A single specimen with a toggle** (*Nested Border Radius*: one card and menu, Same radius / Nested) for static properties. Our side-by-side pair stays for timing and counts, where both must run at once. Direction A should try both on the same page.
- **Short.** 370–950 words and 3–4 demos per page, against our 1,300–1,500 words.

## Optimization points

The owner named three areas: interaction, cases, and the case box. Others follow. Counts are from the source on 2026-10-27: 114 `Compare` pairs, 59 single `Frame`s, 15 `Gallery`, 13 `Tweak` playgrounds, 5 `StateGrid`.

### 1. Interaction: how a demo gets touched

- **It invites in the first second.** A pair whose difference is in time (hover, press, open, close) plays once when it comes into view, then waits for the reader. Sheet's opener starts open; Menu's starts on its open menu. Reader-driven, never looping.
- **More dials, fewer verdicts.** 114 pairs tell the reader which is right; 13 playgrounds let them find it. Where the claim is an amount (press scale, delay, duration, gap ratio, measure), the main demo becomes a playground with guide marks at the playbook's value and at the edges where it breaks. Button's *Quick down, soft back* is the first: one button, press depth and both durations on dials, a guide at ours.
- **The demo measures the reader.** The site's best moments count something (presses lost, seconds waited, faces found). Every principle page gets one such readout where it has a number to show.
- **Say how to play in the prose**, once, where it's needed ("press and hold", "tap twice, fast"), and never as a label on the stage.
- **One control for the whole page** to slow motion down, instead of one per frame.

### 2. Cases: what the examples are

- **Things everyone has used.** A share sheet, a sort menu, a sidebar, an inbox, a to-do list, a map, a player. Abstract rows of buttons ("Duplicate / Rename / Move") only where the property is truly abstract.
- **A hero object per page.** One case carries the page and comes back in every section (the archive in *Attention wears off*, the walk in *Sheet*), instead of a new specimen per section.
- **The neighbouring case.** Each page ends its argument on one case where the rule bends, with the consequence worked out: a large card presses less than a button; a sheet at full height blocks.
- **Good and bad cases as a set**, as on Sheet: 5 good and 4 bad, each with its one-line reason. It's the most liked addition so far; Menu, Popover, Dialog and Toast get one.
- **Post and future apps as the proof**, linked both ways: from a principle to the moment in the app, and from the app's decision back to the page.

### 3. The case box: the frame around a demo

- **Labels go above, and say what differs.** For example, "Holds the press" / "Takes every press", plus a ✓ / ✕ mark for which is right. The tinted band at the bottom goes: today you learn which was wrong after looking.
- **No chrome on the stage.** The per-frame theme switch and slow-motion switch move to one page-level control. The stage keeps a quiet edge and the page's background, so the demo reads as part of the essay.
- **Pair or toggle.** A side-by-side pair stays for differences in time and counts, where both must run at once. A static property (radius, colour, spacing) becomes one specimen with a two-option toggle under it, so the eye stays in one place.
- **One width, one height per pair.** Demos align with the text column or deliberately break out of it, never left-aligned text beside a full-width box.
- **Phone:** one side at a time with the toggle, label above.

### 4. Others

- **Openings.** A question or a moment you can act on in five seconds, then the hero demo; the rule comes after it, as the turn. "The rule" as a heading goes.
- **Reading type.** Follow our own *Set reading text*: 17–18 px on a ~640 px measure for prose, demos aligned to it.
- **Citations.** Numbered notes in the prose, and endnotes that say in a line what each source found. The number that turns the argument stays in the sentence; the reference moves out of it.
- **Voice and taste.** Say ranges with reasons in the playbook's own voice ("0.96–0.98; below 0.95 it reads as an effect"), with the source behind the edge, not in front of the value.
- **Take-away.** Each page ends with a short copyable implementation in CSS and React and the platform gotchas that specs don't mention. Components keep Anatomy and States as a collapsed Reference below it.
- **Length.** A target of 600–900 words per principle page, with the rest in Details the reader opens.
- **Home.** A thesis, Post, then chapters grouped by what they're about (motion, colour, space, input, reading), each with a live thumbnail. No counts and no search hero; search moves to the header and covers section headings.
- **Way-finding.** A chapter list on wide screens, and where you are in it.

### Order

1. **Pilot one page end to end:** Button, the audit's worst page. It has every problem: a static pair, a timing pair identical at rest, and token tables. The pilot tries the case box, the playground, the opening, the type and the take-away together, in two or three variants of the case box for the owner to pick.
2. Roll the chosen case box and type out to every page. This is mechanical, through `Frame` and `Compare`.
3. Rewrite openings and add cases, page by page, principles first.
4. Home and way-finding last, once the pages it points to have their new shape.
