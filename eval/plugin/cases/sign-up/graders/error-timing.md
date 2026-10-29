---
type: llm
focus:
  source: file
  path: SignUp.tsx
---

This is a React sign-up form. Judge only when its validation errors appear and disappear.

PASS if a field's error first appears when the person leaves the field (blur) or submits the form, not while they are still typing into a field that has shown no error yet; and once an error is showing, it clears as soon as the value becomes valid (on input, without waiting for blur or submit).
FAIL if errors appear on every keystroke from the first character, or only on submit and then stay until the next submit, or once shown don't clear until the field is left again.
