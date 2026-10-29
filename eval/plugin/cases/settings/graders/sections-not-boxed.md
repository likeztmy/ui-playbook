---
type: llm
focus:
  source: file
  path: Settings.module.css
---

This is the stylesheet of a settings page with several sections (Profile, Notifications, Appearance, Region, Members, Delete workspace).

PASS if the ordinary sections are held apart by their headings and spacing alone: the rule shared by the sections draws no border, no box-shadow and no background different from the page. A single region set apart (for example the delete area, or the members list as one bordered group) is fine.
FAIL if every section, or nearly every one, is drawn as its own card or panel: a border, a box-shadow or its own background fill on each section.
