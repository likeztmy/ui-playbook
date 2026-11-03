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
| Looks gallery: specimens | components, overlays, states, website, phone notice | `gallery-specimens.md` | — | Review running |

Shoulds and nits in the reports are not fixed yet.

Still to do:

1. Fix the specimens musts when that review lands.
2. Fix the shoulds and nits, and the gaps where a page has to change. Gaps that need the owner: bulk actions disabled vs. Button's "a disabled button says why"; Tabs count 11px vs. the 12px floor (C42); Tooltip on disabled icon buttons; C20 "a tap shows what hover shows" vs. Tooltip "no tooltips on touch"; C16 for inputs in a pill look (Linear).
3. Frame time on the practice apps and the gallery (C43).
