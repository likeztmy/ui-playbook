# Brief for the fix agents

You fix one part of the site-wide audit. Five agents work in the same checkout at the same time, each on its own files.

## Read first

- `AGENTS.md`, then `CODING_STANDARDS.md`.
- `docs/research/audit-2026-11-02/README.md`: the rows your prompt names. Each row gives the file, the rule and the fix.
- `docs/research/audit-2026-11-02/decisions.md`: the answers to the rule questions (C1–C43). Use them; don't reopen them. Where a decision changes a rule, change the page that states the rule too, if you own it. If another agent owns it, put the change in your report.
- The audit's per-group reports in the same folder, for the evidence behind a finding ID (CA = components-a.md, CB = components-b.md, PA = principles-a.md, PB = principles-b.md, SY = systems.md, LK = looks.md, PR = practice.md).

## Steps

1. **Brief.** For each screen you change, list the component, principle and system pages that govern it, from the index in `skill/ui-playbook/SKILL.md`. Read each one whole in `skill/ui-playbook/references/`. Write the list at the top of your report.
2. **Build** to those pages. Fix the finding at its root: in the shared component when the shared component is wrong. A departure from a rule goes into your report with its reason. An Avoid side of a comparison breaks its own rule on purpose; leave that break, and fix whatever else is wrong on it.
3. **Look.** Shoot every route you changed at 1280 and 375, light and dark, and look at each shot whole:
   ```
   pnpm shoot "<route>" --width 375 --theme dark --full --scale 1 --out shots/fix/<you>/<name>-375-dark.png
   ```
   Measure rather than eyeball, with `--eval` (`getBoundingClientRect`, `getComputedStyle`). Use `--selector`, `--scale 2`, `--hover`, `--click` for close-ups and states. `pnpm shoot --help` lists the flags.
4. **Check.** At the end, run `pnpm check` once (types, stylelint, SVG and token lints). Fix what it reports in your files.

You are done when every finding your prompt names is fixed with measured evidence, or listed in your report with the reason it isn't.

## Ground rules

- **Your files only.** Your prompt names them. A fix that needs someone else's file goes in your report, with the exact change.
- The dev server at http://localhost:4321 belongs to another session. Use it only through `pnpm shoot`; it reloads on save. Start, stop or restart no server.
- Don't commit, stash, reset, check out or push. Don't run `pnpm verify`, `pnpm build` or the e2e tests: the machine is shared. Before `pnpm check`, read `~/.machine-pulse/state.json`; if `level` isn't `ok`, wait a minute and read it again.
- No new dependencies. No Chinese site copy. One component per file; split a file that grows past about 300 lines before adding to it. Match the surrounding code: its naming, idiom and comment density.
- Run `prettier --write` only on a file you changed, and never on these, which weren't prettier-clean at HEAD: `tests/interactions.spec.ts`, `src/entries.ts`, `scripts/export-skill.mjs`, `eval/run.mjs`, `src/pages/systems/look-linear.mdx`.
- Icons: Lucide through `src/ui/icons.tsx` or plain Lucide imports, with Lucide's own stroke (decision C6). No hand-drawn SVG, no emoji or typed symbol standing in for an icon. Keys use `FieldKey` or `TipKeys`.
- No over-signposting: don't label the obvious, don't add text explaining our own care.
- Never invent a source or a measurement.

## Report

Short, in English:

1. The governing pages you read.
2. A table: finding ID · what changed (`file:line`) · evidence (measured value or shot path).
3. Findings left, each with its reason.
4. Changes needed in files you don't own.
5. Rule departures, each with its reason.
