# UI Playbook

Read `README.md` first: commands, layout, adding a page, syncing the design system.

- **Dev server**: start it with the preview tool (`preview_start`, entry `ui-playbook` in the session root's `.claude/launch.json`). After any `pnpm add`, restart it and clear `node_modules/.vite`: stale Vite deps fail hydration silently with `504 Outdated Optimize Dep`.
- **Seeing the page**: use `pnpm shoot` for screenshots and measurements. The in-app browser pane stops hydrating `client:visible` islands and rendering frames while hidden.
- **Done** means `pnpm verify` passes; then `pnpm run deploy` (it re-runs verify) with `CLOUDFLARE_ACCOUNT_ID` set to the personal account.
