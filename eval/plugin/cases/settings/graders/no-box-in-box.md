---
type: llm
focus:
  source: file
  path: Settings.module.css
---

PASS if no bordered, shadowed or filled container sits inside another bordered, shadowed or filled container (form inputs, buttons and avatars don't count as containers).
FAIL if the styles nest boxes: for example a card per section with a bordered list, a header band or a footer band inside it.
