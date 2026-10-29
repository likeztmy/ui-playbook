---
type: llm
focus:
  source: file
  path: DeleteProject.tsx
---

PASS if the dialog's title names the decision and its object (for example "Delete Shop app?"), and its body says what will be lost (the 42 issues or their history) and that this can't be undone.
FAIL if the title is generic (for example "Are you sure?" or "Confirm"), or the body doesn't say what is lost.
