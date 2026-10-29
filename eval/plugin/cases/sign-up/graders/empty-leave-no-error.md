---
type: llm
focus:
  source: file
  path: SignUp.tsx
---

This is a React sign-up form. Judge only what happens when someone moves through a field without typing anything.

PASS if tabbing or clicking out of a field that is still empty and was never typed into shows no error; a "required" error for an empty field appears only on submit (or once the person has typed into it).
FAIL if leaving an untouched empty field shows an error such as "Name is required" or "Enter your email".
