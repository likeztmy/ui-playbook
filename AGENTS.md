# UI Playbook

Read `README.md` first: commands, layout, adding a page, syncing the design system.

- **Dev server**: start it with the preview tool (`preview_start`, entry `ui-playbook` in the session root's `.claude/launch.json`). It keeps its own Vite cache (`node_modules/.vite-dev`), so checks and builds no longer break it. After a `pnpm add`, restart it and clear that folder: stale deps fail hydration silently with `504 Outdated Optimize Dep`, which `pnpm shoot` reports.
- **Seeing the page**: use `pnpm shoot` for screenshots and measurements. The in-app browser pane stops hydrating `client:visible` islands and rendering frames while hidden.
- **Reviewing** a diff: apply `CODING_STANDARDS.md`.
- **Done** means `pnpm verify` passes and, for anything on screen, the rule review below is clean; then `pnpm run deploy` (it re-runs verify) with `CLOUDFLARE_ACCOUNT_ID` set to the personal account.

## Building anything on screen

Every screen here is the playbook's own evidence, so it is built to the playbook and checked against it, rule by rule. Knowing the rules is not using them: the screens that broke them were written by agents who knew them.

1. **Brief.** Before writing, list the component, principle and system pages that govern what you are building (the index in `skill/ui-playbook/SKILL.md`), and read each whole in `skill/ui-playbook/references/`. In a fresh worktree, where `skill/` is not built yet, read them at https://ui-playbook.suspense.site/skill/ui-playbook/SKILL.md. A screen after a real product starts from that product, read in its own app.
2. **Build** to those pages. A departure from one is written into the plan with its reason.
3. **Rule review.** Before anyone sees it, an agent that did not build it follows `.claude/agents/ui-rule-review.md` on every changed route, at 1280 and 375, light and dark. Fix each `must`; record why for each one left. Overflow, theme and timing checks are not a rule review.

`skill/ui-playbook` is the exported Skill (`pnpm build` writes it; builds never clear it). `~/.claude/skills/ui-playbook` and `~/.codex/skills/ui-playbook` link to it.
