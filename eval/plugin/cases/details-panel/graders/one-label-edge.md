---
type: llm
focus:
  source: file
  path: DetailsPanel.module.css
---

This is the stylesheet of an issue's details panel with property rows (status, priority, assignee, labels, due date, created, updated).

PASS if property labels share one left edge and values start on one shared vertical line, for example a grid or a fixed-width label column.
FAIL if each value simply follows its label inline at a varying position, so the values don't line up.
