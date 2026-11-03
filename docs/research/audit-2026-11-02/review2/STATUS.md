# Second rule review: where it stands (2026-11-03)

| Group | Routes | Report | Musts | State |
| --- | --- | --- | --- | --- |
| Components 1 | app-shell … popover (11) | `components-1.md` | 1 (badge lists had no header) | Fixed in 19dbbcc |
| Components 2a | radio … switch | `components-2a.md` | see report | Fixed in 26ad4dd |
| Components 2b | table, tabs, toast, toolbar, tooltip | `components-2b.md` | 4 (table check column at 375; bulk actions did nothing; focus to body after toast Undo/Dismiss; tooltip delay pair invisible at rest, by key and on touch) | Fixed in ae39e80 |
| Principles 1a | a-shadow … | `principles-1a.md` | see report | Fixed in 26ad4dd |
| Principles 1b | … how-waiting-feels | `principles-1b.md` | 2 (grey issue IDs wrapped; hover submenus had no keyboard path) | Fixed in 218aa73 |
| Principles 2 | lightness-first … who-before-what (9) | `principles-2.md` | 2 (ratio subjects off one edge; stacked slider panel far from its stage) | Fixed |
| Home, systems, practice | 10 routes | `home-systems-practice.md` | 2 (Track focus after a status change; Track sidebar flash at 375) | Fixed |
| Looks gallery: app pages | dashboard, releases, release, settings | `gallery-app.md` | 5 (range changed nothing; Primer segmented a pill; Linear Rolling out 4.16:1 on a selected row; empty filter named no next step; focus to body after Undo) | Fixed in ae39e80 |
| Looks gallery: specimens | components, overlays, states, website, phone notice | `gallery-specimens.md` | 2 (Button, Field, Toast, Dialog used the site's type, radius and shadow inside a look; a failure toast cut off at 1024, because its no-clamp rule never matched) | Fixed in 5484f44 |

Shoulds and nits: fixed in f52c877. A third review of those fixes (`../review3/`) found more, fixed in 92d9f8d and 3c1bd4f; the tests that followed the changed demos in 8cbe87e.

Left for the owner (each one sets a page rule against a demo, so either the demo or the rule changes):

- Bulk actions disabled vs. Button's "a disabled button says why".
- Tabs count at 11px vs. the 12px floor (C42).
- Tooltips on disabled icon buttons.
- C20 "a tap shows what hover shows" vs. Tooltip's "no tooltips on touch".
- C16 for inputs in a pill look (Linear).
- C8 "one chevron" vs. Select's up-down chevrons.
- Hover submenu delay: the demo's 100 ms vs. the page's 0.3–0.5 s.
- Rough.js hand-drawn notes vs. "no hand-drawn" icons; confetti colours; dimming stale rows.
- Sheet controls at 17px vs. 14px; Post composer 17/16.
- Gallery reviewer items D5, R6, GS#7, GS#14, and `line-strong` contrast.

Not fixed yet, smaller:

- A gallery pause doesn't reach the Dashboard or the Updated column.
- Archive forgets its state when you leave the page.
- Primer light: the Website's secondary buttons are near invisible.
- The draft Notes empty state names no next step.
- The Avoid banner on "where the eye goes" is gone for good after Dismiss.
- `.gapLabel` sits closer to the wrong neighbour.

Still to do: frame time on the practice apps and the gallery (C43).
