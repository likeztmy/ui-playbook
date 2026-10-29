---
type: llm
focus:
  source: file
  path: Settings.module.css
---

This is the stylesheet of a settings page. Judge only content containers: cards, panels, sections, lists and groups of rows. Ignore controls and their parts (inputs, selects, buttons, switches and their knobs, segmented controls and their thumbs, avatars, badges), a table's header row, and dialogs or popovers.

PASS if no content container that draws its own edge (a border, a box-shadow or its own background fill) sits inside another content container that draws its own edge.
FAIL if the styles nest them: for example a card per section with a bordered list inside it, or a card with a filled header band or footer band.
