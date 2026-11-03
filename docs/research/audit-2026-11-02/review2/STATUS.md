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

Owner decisions (2026-11-03): settled as C44–C53, with C8, C16 and C20 rewritten (`../decisions.md`); built in 8a450e3, rule-reviewed in `../review4/owner-decisions.md`, its must and shoulds fixed in 65fa959.

Left open:

- A disabled toolbar tool shows no tooltip: Base UI's Toggle can't stay focusable when disabled, so only its shortcut is dropped (only the Toolbar States specimen has one).
- The Avoid band on "where the eye goes" stays gone after Dismiss: dismissing is the real behaviour.
- Archiving the Ship project changes no other page (Releases still says "Rolling out").
- Review4 gaps for the owner: the Button page's "Filled, never outlined" against Primer's edged button; Moss's olive info beside its green success.
- Ink palette: success and warning text on `accent-soft` are 4.1 and 4.0:1 (as at HEAD before this round).

Still to do: frame time on the practice apps and the gallery (C43).
