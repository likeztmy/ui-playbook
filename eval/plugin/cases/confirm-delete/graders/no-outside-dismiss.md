---
type: llm
focus:
  source: file
  path: DeleteProject.tsx
---

This is a React component for a dialog that confirms deleting a project, which can't be undone.

PASS if a click on the backdrop or overlay outside the dialog does nothing: the dialog only closes through its buttons (and Esc, which may cancel).
FAIL if clicking the backdrop or outside the dialog closes or cancels it.
