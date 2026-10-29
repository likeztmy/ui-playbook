---
type: llm
focus:
  source: file
  path: DeleteProject.tsx
---

This is a React component for a dialog that confirms deleting a project, which can't be undone.

PASS if, when the dialog opens, keyboard focus is placed on the Cancel button (for example autoFocus or a ref focused on open), so that pressing Enter backs out.
FAIL if focus goes to the delete button, to the dialog container or the first focusable element when that is the delete button, or if the code sets no initial focus at all.
