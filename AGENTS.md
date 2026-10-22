# UI Playbook

Read `README.md` first: commands, layout, adding a page, syncing the design system.

- **Dev server**: start it with the preview tool (`preview_start`, entry `ui-playbook` in the session root's `.claude/launch.json`). After a `pnpm add`, and often after `pnpm check` or a build (they re-optimize the Vite cache the dev server shares), restart it and clear `node_modules/.vite`: stale deps fail hydration silently with `504 Outdated Optimize Dep`, which `pnpm shoot` reports.
- **Seeing the page**: use `pnpm shoot` for screenshots and measurements. The in-app browser pane stops hydrating `client:visible` islands and rendering frames while hidden.
- **Reviewing** a diff: apply `CODING_STANDARDS.md`.
- **Done** means `pnpm verify` passes; then `pnpm run deploy` (it re-runs verify) with `CLOUDFLARE_ACCOUNT_ID` set to the personal account.
