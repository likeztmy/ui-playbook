# Brief for a task delegated to Codex

You are implementing one task in this repository. The project's own rules
and the task text follow this brief. The main Agent (Claude) will
adversarially review your diff and run the acceptance afterwards. Your job is
a correct, tested implementation with an honest report.

## Rules for every project

- **Read first.** Read the repository's `AGENTS.md` / `CLAUDE.md` and the
  project rules below before changing anything. Decisions stated in the task
  are decided: implement them, don't reopen them. If the task needs a decision
  it does not state, choose what the linked research or plan implies, record
  the choice in your report and keep going.
- **Stay in your worktree.**
  - Work only in this worktree, on its current branch.
  - Commit with messages that name the task (issue number or key) and end
    with `Co-Authored-By: GPT-6 Astra (Codex CLI) <noreply@openai.com>`.
  - Never push, never create, close or edit issues or PRs, never touch other
    branches.
  - Never deploy, publish packages or call real model APIs.
- **Change only what the task names.**
  - Leave pre-existing uncommitted files alone.
  - Don't widen a fix into shared behaviour (shared limits, defaults, other
    features' copy). If something nearby is wrong, say so in the report
    instead.
- **Prove it.**
  - Add regression tests at the boundary you changed. They must fail without
    your change.
  - Run the project's checks listed below.
  - When your code reads files the user already has, run it over the real
    files the task names and report each shape it can't map, with a count.
- **Keep the machine responsive.**
  - Several agents share this machine. Run Vitest with `--maxWorkers=2` and
    Playwright with `--workers=1`.
  - Never run two full suites at once.
  - Don't start servers you don't need, and stop the ones you start.
- **Never touch secrets.** Never read, print or modify credentials: `.env*`,
  tokens, auth files, Keychain items.
- **No defensive programming.**
  - Give each invariant one owner and validate it once, at its trust
    boundary.
  - Don't put `?.`, `??`, `|| []` or early returns on values the types or an
    earlier check guarantee.
  - Don't add optional fields because one internal path lacks them; split the
    type instead.
  - Don't swallow errors.
  - Don't add compatibility shims for unshipped state.
  - Every retention and retry path is bounded.

## Final report (your last message)

1. What you built, file by file (short).
2. Decisions you made that the task did not state.
3. Tests you added and the exact commands you ran, with pass/fail counts,
   including which new tests fail without your change.
4. Anything unfinished, uncertain or risky, including what the main Agent's
   acceptance should check.
5. The commit hashes on your branch.


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


## Task file docs/agents/tasks/topic-backlog.md

# Task: collect the UI Playbook topic backlog

## Outcome

The owner wants the playbook as complete, useful and good-looking as it can be. They want one ranked backlog of what to add next, in a Feishu doc they can read and edit. Each entry must be ready for the main Agent to turn into a page plan.

This is a research task. Change no site code.

## Inputs (read all three first)

- `docs/research/2026-10-25-playbook-method-digest.md`: what exists, the owner's standards, the corrections behind them, and every source already verified.
- `docs/research/2026-10-22-good-interface-design.md` and `docs/research/notes/`: the research base, built on the seven-step loop (see, understand, decide, act, feedback, recover, learn).
- `docs/plans/`: pages already planned. Don't re-propose them; list them as "planned".

## What to collect

Cover three groups, and for each group say what is still missing:

1. **Component pages.**
   - Compare what exists (19 pages) against Apple HIG, Material 3, Radix / Base UI, shadcn/ui, and the patterns Linear and Raycast use.
   - Propose components worth a page, such as a command menu, Drawer / Sheet, empty state or Skeleton.
   - For each, name the one or two details that make it feel right or wrong.
2. **Principle pages.**
   - Find mechanisms that would make a reader say "原来如此": a named effect, a measured finding, a history, a surprise.
   - Walk all seven steps of the loop, plus motion, typography, colour, density, keyboard and focus, perceived performance, undo, errors, and copy.
   - Earlier candidates to evaluate are in the digest.
3. **Site improvements.** Look for ways the playbook itself gets easier to use or better looking: navigation, search, reading flow, mobile, a print or cheat-sheet view, new reusable demo tools. The existing tools are a squint blur, a live layout-shift count, slow motion with a first-frame outline, and a safe-triangle overlay.

## Each entry

- **Kind**: component, principle, or site.
- **Working title**: in English, as the page would be titled.
- **The mechanism**: one or two sentences on what the reader couldn't have guessed.
- **The Before**: a real mistake a shipping product makes, linked to a verified source. If there's no verified product, say "no named product" and give the source of the finding instead.
- **Demo idea**: one variable, and how the reader feels the effect without instructions. Say whether it needs a new reusable tool.
- **Primary sources**: URLs you opened and read, each tagged "verified" or "secondary only".
- **Reference product**: what Apple, Linear, Raycast or Material does, if relevant.
- **Scores (1–5)**: depth (how surprising), felt (how strongly the demo lands), coverage (the gap it fills), effort (inverse cost).
- **Priority**: computed from the scores.

## Rules

- Open every source before citing it. Mark anything you couldn't open or confirm as unverified. Never invent a statistic or put a number in a source's mouth.
- Prefer primary sources: papers (DOI or PDF), specs, official docs, NN/g, the product's own docs. Blog summaries count as secondary.
- Leave out topics whose whole content is a rule everyone knows, unless you can name the surprising mechanism behind it.
- Aim for 40–60 entries, ranked. Write the top 10 in more depth: the mechanism, the demo, and what a Before/After pair would show.

## Output

1. **The repository file.** Write `docs/research/2026-10-25-topic-backlog.md` in this worktree and commit it. Use English for titles and terms, and terse Chinese or English for prose, whichever is clearer per entry.
2. **The Feishu doc.**
   - Create one doc titled `UI Playbook 选题库` with the same content.
   - Use `~/.npm-global/bin/lark-cli` (it isn't on PATH) with `--as user`. Follow `~/.claude/skills/lark-doc/SKILL.md` and its create workflow (`~/.claude/skills/lark-doc/references/lark-doc-create-workflow.md`), and read `~/.claude/skills/lark-shared/SKILL.md` first.
   - This doc is the one external write this task is allowed. Create nothing else in Feishu, and don't share the doc with anyone.
   - If the CLI asks for authorization or confirmation (exit code 10, a verification URL), stop and put that in your report. Don't work around it.
3. **The report.** Give the doc's URL, the entry count by kind, the top 10 titles, and the sources you couldn't verify.

## Non-goals

- No changes to `src/`, `tests/` or any page.
- No deploy, no push.
- No Chinese site copy.

## Acceptance

- The backlog file exists, is committed, and has 40–60 ranked entries with every field filled.
- At least 20 entries carry a source tagged "verified".
- The Feishu doc opens at the reported URL with the same entries.
