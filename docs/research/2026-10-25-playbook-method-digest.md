# How the playbook is made: method, lessons, sources

Written 2026-10-25 from the work of 2026-10-22 to 10-25. It sits on top of `2026-10-22-good-interface-design.md` (the seven-step loop: see, understand, decide, act, feedback, recover, learn) and its notes in `notes/`. Read both before proposing pages.

## What exists

- **19 component pages**: Button, Menu, Toolbar, Tooltip, Popover, Dialog, Input, Select, Combobox, Checkbox, Radio, Switch, Tabs, Slider, Segmented control, Card, Badge, Table, Toast.
- **6 principle pages**: Concentric radius, Colour means one thing, Where the eye goes, Nothing shifts, Hover forgives, Error timing.
- **Planned, not built**: How waiting feels (`docs/plans/2026-10-25-how-waiting-feels.md`).
- **Named earlier as candidates**: Undo instead of asking, The target is the whole thing (Fitts), Motion has a source, The more often the less motion.
- **Components not yet covered**: command menu (⌘K), Drawer / Sheet, empty state, Skeleton, Accordion, date picker, file upload, pagination, breadcrumbs, avatar, progress.

## What the owner wants from a page

The owner judges by these. Each came from a correction.

1. **Depth, not a textbook.** A page earns its place with a mechanism the reader couldn't have guessed: a named effect, a history, a surprise.
   - Liked: the safe triangle (menu aim), banner blindness, false floor, change blindness, scroll anchoring at offset zero, the 500 ms input exclusion in CLS.
   - Rejected as shallow: "bold the headings", "group related fields".
2. **Felt, not explained.** The reader should feel the effect in the demo before reading the note. If the effect only shows up once the note is read, the demo failed.
   - The first Where-the-eye-goes scene changed only type weight: too quiet.
   - The first Nothing-shifts inbox made the reader hover and wait: "感觉一般".
   - The search-reorder scene went unnoticed until the change grew from a reorder into a whole group pushing in.
   - Origin-of-popover went unnoticed at enter-scale 0.96, so it gained a slow-motion switch and a first-frame outline.
3. **One variable per Before/After.** If a Before changes two things (scale and timing), narrow it. Strawman Befores are out.
4. **Real mistakes, with sources.** A Before should be a mistake a shipping product makes, linked to a verified source. Name a product only when its behaviour is verified now (X's "Show new posts" couldn't be, so it wasn't named).
5. **No over-signposting.** No instruction lines ("Type 'sao' then Enter"), no "Only change:" labels, no narrating what the reader just saw. Frame labels are scene names. Notes say only what the demo can't: why, the source, when it flips.
6. **Copy the reference product first.** Before inventing a pattern, check what Apple, Linear, Raycast or Material does. The Before/After frame copies Material 3's Do/Don't band: white stage, tinted band under it, caption 12 px below.
7. **Verify every claim.** Behaviour claims get run in the browser, and concept claims get read in the primary source.
   - Claims caught as false before shipping:
     - "A disabled button still shows its tooltip" (it doesn't).
     - "Arial runs wider than Geist" (Geist is about 2.5% wider).
     - "People add the tote twice".
     - "75% didn't scroll" (secondary source only).
   - Unverified numbers stay off the page.

## Page shapes

- **Component page**: scene demo first, then a compressed "When to use", then Details (Before/After), then Variants, Anatomy (table plus annotated still at 2×), States, Known issues, Common mistakes, Copy.
- **Principle page**: The rule, then the main Compare, then Details, then a reusable tool if there is one, then "When it doesn't apply", then "Where the playbook applies it".

## Reusable tools built so far

- **Squint test**: a blur slider over a scene (Where the eye goes).
- **Live layout-shift count**: the Layout Instability API, per demo, with the same 500 ms input exclusion as CLS (Nothing shifts).
- **Slow motion at 0.1×**: a first-frame outline plus a transform-origin dot, as a `motion` prop on `Compare` (Popover, Menu).
- **Safe-area overlay**: shows the menu-aim triangle (Hover forgives).

A topic that needs a new tool of this kind (a stopwatch for perceived duration, a hit-area overlay for Fitts) is a strong topic.

## Sources verified in this work

- **Hover and pointing**
  - Ben Kamens, jQuery-menu-aim: https://github.com/kamens/jQuery-menu-aim
  - Floating UI `safePolygon`: https://floating-ui.com/docs/useHover
  - Steering law, Accot & Zhai, CHI 1997.
- **Attention**
  - NN/g change blindness: https://www.nngroup.com/articles/change-blindness-definition/
  - Illusion of completeness: https://www.nngroup.com/videos/illusion-completeness/
  - Banner blindness: https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/
  - Squint test: https://www.nngroup.com/videos/squint-test/
  - Gestalt proximity: https://www.nngroup.com/articles/gestalt-proximity/
  - Information scent: https://www.nngroup.com/articles/information-scent/
  - Pirolli & Card 1999: https://doi.org/10.1037/0033-295X.106.4.643
- **Layout stability**
  - CLS and its 500 ms `hadRecentInput` exclusion: https://web.dev/articles/cls
  - Scroll anchoring spec (no anchor at scroll offset zero): https://drafts.csswg.org/css-scroll-anchoring/
  - `overflow-anchor` (Baseline Sep 2026): https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor
  - `scrollbar-gutter`: https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter
  - Font `size-adjust`: https://web.dev/articles/css-size-adjust
  - Next.js `adjustFontFallback`: https://nextjs.org/docs/app/api-reference/components/font
  - Bold without shift: https://css-tricks.com/bold-on-hover-without-the-layout-shift/
- **Waiting**
  - NN/g response-time limits (0.1 / 1 / 10 s): https://www.nngroup.com/articles/response-times-3-important-limits/
  - NN/g skeleton screens (under 1 s show nothing): https://www.nngroup.com/articles/skeleton-screens/
  - Harrison et al., Rethinking the Progress Bar, UIST 2007 (pauses near the end hurt most; accelerating towards the end is favoured).
  - Harrison, Yeo & Hudson, Faster Progress Bars, CHI 2010 (backwards ribbing reads 11% faster).
  - Buell & Norton, The Labor Illusion, Management Science 2011: https://doi.org/10.1287/mnsc.1110.1376
- **Motion and frames**: Material 3 button guidelines, Do/Don't: https://m3.material.io/components/buttons/guidelines

## What reads as weak

- **A topic whose whole content is a rule everyone knows.**
- **A Before nobody ships.**
- **A demo that needs instructions to show its effect.**
- **Chinese copy written by an agent.** The owner translates the /zh edition personally; agents don't write Chinese site copy.
