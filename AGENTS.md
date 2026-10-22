# UI Playbook

Read `README.md` first: commands, layout, adding a page, syncing the design system.

- **Dev server**: start it with the preview tool (`preview_start`, entry `ui-playbook` in the session root's `.claude/launch.json`). It keeps its own Vite cache (`node_modules/.vite-dev`), so checks and builds no longer break it. After a `pnpm add`, restart it and clear that folder: stale deps fail hydration silently with `504 Outdated Optimize Dep`, which `pnpm shoot` reports.
- **Seeing the page**: use `pnpm shoot` for screenshots and measurements. The in-app browser pane stops hydrating `client:visible` islands and rendering frames while hidden.
- **Reviewing** a diff: apply `CODING_STANDARDS.md`.
- **Done** means `pnpm verify` passes; then `pnpm run deploy` (it re-runs verify) with `CLOUDFLARE_ACCOUNT_ID` set to the personal account.
