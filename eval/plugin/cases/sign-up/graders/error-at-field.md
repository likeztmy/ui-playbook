---
type: llm
focus:
  source: file
  path: SignUp.tsx
---

PASS if each error is shown next to its own field, tied to it for assistive technology (for example aria-describedby or aria-errormessage, with aria-invalid), and says how to fix it (for example "Use at least 8 characters").
FAIL if errors are only collected in one place away from the fields, aren't tied to their field, or only say a value is invalid without saying what's needed.
