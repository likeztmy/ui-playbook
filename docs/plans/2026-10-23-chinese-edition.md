# Chinese edition

Scope today: 25 pages, ~11k words of MDX prose, ~180 demo notes in `src/demos/*.tsx`, and one summary per entry in `src/entries.ts`.

## Proposal

| Decision | Recommendation | Reference |
| --- | --- | --- |
| URL | English stays at `/`; Chinese under `/zh/…` (Astro i18n routing) | MDN `/zh-CN/` |
| Switching | A language link in the header beside the theme toggle, to the same page in the other language; no automatic redirect by browser language | react.dev's language picker; no redirect |
| What is translated | Prose, demo notes, entry titles and summaries, site chrome | |
| What stays English | What's inside the demos (Share, Search docs, file names), token and component names (`Popover`, `enter-scale`) | Translated docs keep screenshots as shipped |
| Notes mechanism | Notes take their text from a per-demo-file dictionary picked by a locale context the page sets | |
| Typography | Spaces between Chinese and Latin text, full-width punctuation, “” quotes, body line height ~1.75 for CJK | 中文文案排版指北 |
| Source of truth | English; a Chinese page that is missing falls back to the English page | |
| Rollout | Chrome + one pilot page first for review, then the rest in batches of ~6 | Same as the English rollout |

Why demos stay English: several cases are tuned to English text metrics (the 254px font-swap paragraph, the bold-width nav, the "co" search ranking). Translating them means re-tuning each one.
