---
type: llm
focus:
  source: file
  path: DetailsPanel.tsx
---

This is a React component for an issue's details panel with a Properties section and a Linked issues section.

PASS if every section-wide action (such as editing the properties as a set, or adding a linked issue) is a control placed in that section's heading row, beside its heading. Properties edited in place on their own rows need no section action.
FAIL if a section-wide action sits at the bottom of the section, below its rows, or apart from its heading.
