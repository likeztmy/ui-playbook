# UI Playbook: rules for delegated tasks

- **What this is.** A handbook of UI details: Astro + MDX + React islands, Base UI, SCSS modules, Lucide icons, tokens from the Precision design system. Live at https://ui-playbook.suspense.site. Read `README.md` and `AGENTS.md` first.
- **How pages are judged.** `docs/research/2026-10-25-playbook-method-digest.md` holds the owner's standards and every correction behind them; `docs/research/2026-10-22-good-interface-design.md` holds the research base. A task that proposes or builds pages follows both.
- **Checks.** `pnpm check` (types), `pnpm build`, and Playwright with `--workers=1` (`npx playwright test -g "<page>" --workers=1`). `pnpm verify` runs all three; run it only once, at the end.
- **Protected.**
  - Never run `pnpm run deploy`.
  - Never touch `src/pages/_zh/` or any `*.zh.tsx`: the owner writes the Chinese edition.
  - Never `prettier --write` a whole file you only edited in part. The repo has no Prettier config, and the defaults rewrite its style.
- **Lessons from review.**
  - Every claim on a page needs its source opened and read.
  - Every behaviour claim gets run in the browser first.
  - Unverified numbers stay off the page.
