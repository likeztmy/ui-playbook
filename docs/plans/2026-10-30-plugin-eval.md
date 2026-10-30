# Plan: a Claude-side Skill eval with `claude plugin eval`

Status: signed off 2026-10-30. The owner had Fable decide the five points; its decisions are at
the end.

## Why

The Codex eval (`eval/run.mjs`, `eval/walk.mjs`) is the full test: a whole app, rendered and
measured, then judged by eye. It is slow, and it can't say whether the Skill was opened at all. The
last round left exactly that question open: did agents with the Skill put every section in a card
because they never read the boundary rule, or because they read it and didn't follow it?

`claude plugin eval` (official docs: https://code.claude.com/docs/en/plugin-evals.md) answers it on
the Claude side, and does it fast enough to iterate on the Skill's wording:

- **Two arms, measured.** Every case runs with the plugin and with no plugin at all, and the report
  gives the score difference.
- **Clean isolation.** Each run has a temporary HOME and an empty working folder. The owner's
  CLAUDE.md, memory, Skills and Hooks reach neither arm.
- **Whether the Skill fired.** `tool_used: Skill` is reported in the with-plugin arm and kept out of
  the score.

It doesn't replace the Codex eval:

- **Claude only.** The agent under test is a `claude -p` child.
- **No custom-code graders.** There are only `regex`, `tool_used`, `tool_order`, `file_exists`, `llm`
  and `baseline`. So it can't run Playwright on a rendered page. It judges the code the agent wrote.

## Step 0 (before building anything): read the last Codex round

The Codex run folders keep each build's events. Check whether arm `b` ever opened the references
behind the card mistake: `principle-space-groups-by-ratio.md`, `component-card.md`, and now
`principle-the-lightest-boundary-that-holds.md`. This is read-only and cheap.

- **Never opened:** the problem is reaching the guidance. Wording and placement (the SKILL.md map)
  come first.
- **Opened but not followed:** the problem is the guidance itself. Code examples and a critic come
  first.

**Result (2026-10-30).** The 14 arm-`b` builds, counting files named in the shell commands Codex
started:

- Every build read SKILL.md, and 6 of 14 read nothing else.
- None opened `component-card.md`, `principle-space-groups-by-ratio.md`, `component-dialog.md`
  (confirm-delete) or `principle-error-timing.md` (sign-up). One tracker build opened
  `principle-error-timing.md`.
- The references that were opened were mostly components the brief named: table, tabs, toast,
  sheet, select.

So it is **never opened**. What reaches the agent is SKILL.md's body, so the rules that matter
must be stated there, at the moment they apply. A reference behind a pointer is not enough.
(Caveat: a search across `references/` without file names would not show up in this count.)

## What gets built

1. **A plugin wrapper, generated.** `eval/plugin.mjs` writes `eval/plugin/.build/ui-playbook/` (git-ignored; not in `dist/`, which is deployed):
   - `.claude-plugin/plugin.json`: name, version from `package.json`, description, MIT, the site
     as homepage;
   - `skills/ui-playbook/`: a copy of `dist/skill/ui-playbook/`;
   - `evals/`: a copy of the cases from `eval/plugin/`.

   `dist/skill/` keeps its layout, so the site's copy and the `~/.claude` and `~/.codex` links don't
   change.
2. **Five cases**, in `eval/plugin/<case>/prompt.md` plus `graders/`. Each is the existing brief cut
   down to one screen. The agent writes React + CSS module files into the empty folder. Nothing is
   installed or built, so a run stays well inside the time limits and needs no scaffold script.

   | Case | From | What its graders look for |
   | --- | --- | --- |
   | settings | `05-settings` | Sections held by heading and space, not a card each; one region set apart only where it differs; lines between repeated rows, lighter than the edge |
   | overview | `08-tracker` | Figures read together as one row, not a tile each; no box inside a box |
   | confirm-delete | `01-confirm-delete` | The button names the action; the body says what is lost; no "Are you sure" |
   | sign-up | `04-sign-up` | When errors show (after leaving a field or on submit, not while typing); the error sits at the field and says how to fix it |
   | details-panel | `03-details-panel` | Labels on one edge, values on another; a section's actions on its heading row |

3. **Graders per case.**
   - `tool_used: Skill`: did ui-playbook fire. An indicator, with the plugin only.
   - `tool_used: Read` with `input_match` on the relevant reference file: did it open the page that
     holds the rule. Also an indicator (`arm: with-only`).
   - One `llm` grader per rule in the table above. Each is a yes/no question about the code, with
     the playbook's own wording of the mistake. These are the score.
   - `regex` only for a hard rule that holds everywhere, e.g. no `transition: all`.
4. **A command:** `pnpm eval:plugin` builds the export, then runs
   `claude plugin eval dist/plugin/ui-playbook`. It passes `--output-dir` and `--report` into
   `eval/plugin/results/` (git-ignored), `--no-publish`, the chosen judge, `-j` and a cost ceiling.
   It waits for a 1-minute load under 6, as `eval/batch.sh` does.

## How it gets used

One loop per Skill change: edit the wording → `pnpm eval:plugin` → read three numbers per case: the
fire rate, the reference-read rate and the with/without score. The first changes to test are the
research's cheapest:

- the description written to fire on any interface work;
- the build-moment map in the SKILL.md body;
- a boundary plan before code: one paragraph requiring each box to be justified (research §4).

Only a change that moves these numbers goes on to a Codex round.

## Decision points

1. **Packaging:** a generated `dist/plugin/` copy (recommended), or restructure `dist/skill/` into a
   plugin and re-point the links.
2. **What the agent produces:** code files only, no install or build (recommended). The alternative
   is a scaffolded Vite starter, which hits the 120 s scaffold limit and makes the `llm` graders read
   a whole project.
3. **Judge model:** Sonnet (recommended: the questions are about layout structure in code, too
   subtle for the default), or the default.
4. **Budget:** 3 runs per case per arm (30 runs a round), concurrency 2. The cost ceiling is the
   owner's number.
5. **Cases:** the five above, or a different set.

## Decisions (Fable, 2026-10-30)

1. **Packaging:** a generated `dist/plugin/ui-playbook/` copy. Restructuring `dist/skill/` would
   break Codex, which reads SKILL.md at the folder root, and the site's links. The run passes
   `--trust-plugin`, since `dist/` is generated.
2. **Output:** code only. The agent gets `--allow-tools Write Edit` and no Bash. Without that grant,
   Write and Edit are removed from the session, nothing gets written and both arms score 0. Each
   prompt fixes its file names (e.g. `Settings.tsx`, `Settings.module.css`), because file graders
   find files by path.
3. **Judge:** `--judge-model claude-sonnet-5-5`. The llm graders are the score, and a weaker judge's
   misreads would mix with the Skill's effect.
4. **Budget:** 3 runs per case, cost ceiling $30 a round. The owner wants it run on this machine: the runs are local `claude -p` children under the owner's claude.ai login, so they wait for a 1-minute load under 6 and use `-j 2`. The agent is pinned with
   `--model claude-sonnet-5-5` so it doesn't drift with the owner's default. Fable estimates about
   $22 a round in list-price terms; on the claude.ai login it is drawn from the plan's usage.
5. **Cases:** the five above. `overview` says outright that the figures are bare numbers with no
   sparkline, so the "bare numbers → one row" case is what's tested. Inside a plugin the Skill is
   named `ui-playbook:ui-playbook`, so its `tool_used` grader matches
   `"skill"\s*:\s*"(?:[\w-]+:)?ui-playbook"`.

## Rounds

Passes out of 3, with the Skill vs without. `read-*` and `skill-fired` are with-only indicators.

| Grader | Baseline (202610300333) | Moments in SKILL.md (202610300456) |
| --- | --- | --- |
| settings · sections-not-boxed | 3 vs 0 | 3 vs 0 |
| settings · no-box-in-box | 3 vs 2 | 3 vs 0 |
| settings · read-boundary | 3 | 0 |
| overview · figures-one-row | 3 vs 1 | 3 vs 1 |
| confirm-delete · focus-on-cancel | 3 vs 2 | 3 vs 1 |
| confirm-delete · no-outside-dismiss | 3 vs 1 | 3 vs 1 |
| sign-up · empty-leave-no-error | 0 vs 0 | 3 vs 0 |
| sign-up · read-error-timing | 3 | 3 |
| details-panel · actions-on-heading-row | 3 vs 3 | 2 vs 3 |
| Mean Δ | +0.22 | +0.36 |

- **The body carries the rule.** In the baseline every sign-up build read the error-timing page and
  still showed "required" on leaving an empty field. With the rule stated as a moment line, all
  three held it. On settings no build opened the boundary page, and all three still held the rule.
- **details-panel's one fail was the grader's.** That build edits each property in place on its
  row, so Properties has no section action; the grader now passes that.
- details-panel doesn't tell the arms apart (both pass without the Skill); it needs a harder check.

### Round 3: the design stated before code (202610301554)

Two moments added (sign-up screens; opening a dialog or sheet) and step 2: state the design, with
a source for each part, before code. Claude side: mean Δ +0.37 (was +0.36), every grader as
before; details-panel's one fail is a 2–1 judge split.

The Codex round (`eval/run.mjs`, b-9..11 against b-6..8):

| | b-6..8 | b-9..11 |
| --- | --- | --- |
| Hex colours outside variables, per build | 30–142 | 0 in all 9 |
| Web font loaded | DM Sans in all 9 | DM Sans in 2 (one had stated a system font) |
| Sign-up with drawn art and a tinted half | 3 of 3 | 0 of 3 |
| Design stated before code | — | 8 of 9 |

Asked before building, Codex had named a blue accent, system font and grey surfaces; building, it
shipped forest green and DM Sans. With the statement as a step, what it builds follows what it
says. New-issue focus still fails 3 of 3, and not for want of the rule: each build puts
`autoFocus` on the title, and the `<dialog>`'s `showModal()`, run after it in an effect, moves focus
to the first focusable element, the close button.

### Round 4: the app-window floor, on a docs app

A third floor in SKILL.md (an app's window holds still; each pane scrolls on its own) and a new
task, `eval/tasks/11-docs.md`, whose walk scrolls with the wheel and types a document past the
window. The walk was checked first on three pages: a good shell, a page that scrolls whole, and a
fixed shell whose content pane grows past it.

| Check | Codex, no Skill (a-1, a-2) | Codex, Skill (b-1..3) |
| --- | --- | --- |
| Content scrolls on its own; the window and sidebar hold still | 2 of 2 | 3 of 3 |
| Sidebar scrolls on its own | 1 of 2 | 3 of 3 |
| A document typed past the window shows its end and scrolls back | 2 of 2 | 3 of 3 |

Claude (`docs` case, the judge reading the stylesheet's shell): 3 of 3 with the Skill, 2 of 3
without. The first walk typed at machine speed with `\n` in one burst: every build lost the caret
and some threw React's update-depth error (#185), which a person's typing never triggered. It
now types at a fast typist's pace, a line and then Enter.
