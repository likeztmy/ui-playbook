# Eval: does the playbook make an agent's UI better?

Status: signed off 2026-10-28: neutral React starter, Codex with GPT-6.1-Sol at medium effort, two arms, the owner's
blind picks. Tasks run from a single component to a whole app.

## The question

When a coding agent builds everyday UI with the playbook available, is the result better than
without it, by how much, on which rules, and does it get worse anywhere? The answer decides which
pages to rewrite, which to cut, and which new topics to write (the mistakes agents keep making).

## What others found, and what we take from it

- **Pairwise, blind, against a baseline.** WebDev Arena has people pick between two anonymous apps
  built from one prompt, with "tie" and "both bad" allowed, scored with Bradley-Terry
  ([LMArena](https://news.lmarena.ai/webdev-arena)). A study of app-generation tools chose blinded
  pairwise expert judgements because absolute ratings are noisy
  ([arXiv 2512.18080](https://arxiv.org/pdf/2512.18080)). We compare *with* against *without*, in pairs.
- **Run it, then judge what it does, not the code.** ArtifactsBench runs each artifact, takes three
  screenshots across an interaction, and scores a 10-item checklist per task with an MLLM judge;
  90.95% pairwise agreement with experts on 280 items
  ([arXiv 2507.04952](https://arxiv.org/abs/2507.04952v2)). We script each task's interaction and
  judge states, not a single screenshot.
- **Model judges are only partly right.** Agreement with people varies by dimension
  ([MLLM as a UI Judge, arXiv 2510.08783](https://arxiv.org/html/2510.08783v1)); designers agree
  with each other only fairly, Fleiss κ 0.29 ([UICrit, arXiv 2407.08850](https://arxiv.org/abs/2407.08850v3));
  and much disagreement is personal weighting ([DesignPref, arXiv 2511.20513](https://arxiv.org/html/2511.20513v1)).
  So: measured checks where a rule can be measured, the owner's blind picks as the verdict, and the
  model judge trusted only on dimensions where it agrees with the owner.
- **Skills can hurt, and runs are noisy.** Baseline every case without the skill; flag checks that
  pass in both arms as non-discriminating (Anthropic's skill-creator loop, which ships a blind
  comparator we can reuse). One harness measured ±17.6% run-to-run noise on agentic tasks
  ([skill-harness](https://pypi.org/project/skill-harness/)), and skills can regress agents
  ([arXiv 2607.22520](https://arxiv.org/pdf/2607.22520)): several runs per task, and report losses as
  plainly as wins.

## 1. The playbook in a form agents read

A Skill generated from the pages at build time, so the site stays the one source:

- `SKILL.md`: what it is, then one line per page: its rule and when to reach for it (the
  description lists the branches: dialogs, forms and errors, loading, motion, lists and selection…).
- `references/<slug>.md` per page: the rule, Details, When it doesn't apply, Anatomy and States
  tables, Common mistakes, Copy. Demos drop out; each file links to its page.
- Pages already share fixed headings (principles: *The rule / Details / When it doesn't apply*;
  components: *When to use / Kinds / Details / Anatomy / States / Common mistakes / Copy*), so the
  export is a parse, not a rewrite. A test fails the build if the Skill is stale.
- Later, the same export can serve `llms.txt` and a download on the site.

## 2. Tasks

From a single component to a whole app: a page-sized demo can be gamed by a rule list, a working
app can't, so the gap has to hold at every size. Each task is a short brief in product terms, as a
PM would write it: what it's for, what's in it, the names of its controls. It never names a rule
or the playbook. Named controls let one script walk every build.

| Size | Task |
| --- | --- |
| Component | Confirm deleting a project |
| Component | A command menu |
| Component | An expandable details panel |
| Flow | Sign up, checking what's typed |
| Flow | A settings page whose changes save |
| Flow | A list that loads from a slow API, searchable and filterable |
| Flow | A table with bulk actions |
| App | A project tracker: issues list, issue detail, new issue, filters |
| App | A mail client: inbox, reading, compose, notifications |
| App | A shop's product grid, product page and cart |

Each task has a Playwright script that walks it through its states (open, type, fail, load, undo…)
and captures screenshots for the judges.

## 3. Arms and runs

- **A, without:** the agent and the starter, nothing else.
- **B, with:** the same, plus the generated Skill.
- **Agent:** Codex CLI headless: `codex exec -m gpt-6.1-sol -c model_reasoning_effort="medium"
  --ephemeral --json -C <run dir>`, from `/Applications/ChatGPT.app/Contents/Resources/codex-cli/bin/codex`.
- **Isolation:** each run gets its own `HOME` and `CODEX_HOME` holding only a copy of the login
  (`auth.json`), so the owner's `~/.codex/AGENTS.md` (UI taste rules), `~/.codex/skills` and
  `~/.agents/skills` (better-ui and others) reach neither arm. Arm B's Skill goes in that
  `CODEX_HOME/skills`, so the project files the judges see are the same shape in both arms. Builds
  live outside this repo (`~/code/ui-playbook-eval-runs`), each its own git root, so neither this
  repo's `AGENTS.md` nor its `node_modules` is found above them. A smoke run asks each arm what
  instructions and skills it has, before anything is scored. `eval/run.mjs` does all of this.
- **Scale:** 5 runs per arm for components and flows, 3 for apps: (7 × 5 + 3 × 3) × 2 = 88 builds.
  Pilot first: one component, one flow, one app, × 2 arms × 2 runs = 12.
- **Cost recorded per run:** time and tokens, with and without.

## 4. Scoring

**Measured checks**, each tied to the page that states the rule, so a result points at a page:

| Check | How | Page |
| --- | --- | --- |
| Focus moves into a dialog onto the safe choice, returns on close, never falls to `body` | Playwright `activeElement` per step | Dialog |
| Errors don't appear while typing, do on leave or submit | script types, blurs, submits | Error timing |
| No layout shift while loading or on image arrival | `PerformanceObserver` layout-shift sum | Nothing shifts |
| No spinner flash on fast loads; progress on slow ones | throttle API to 100 ms and 3 s | How waiting feels |
| Motion is short and retargets on a second press | `getAnimations()` durations; press twice mid-way | Never too busy to listen, Attention wears off |
| Nested radii are concentric | computed radius and padding of nested boxes | Concentric radius |
| One solid accent fill per view; selection a tint | count elements whose background is the accent | Colour means one thing |
| Contrast, names, roles | axe-core | Lightness first, components |
| A submenu or tooltip survives a diagonal move toward it | pointer path through the gap | Hover forgives |
| A checkbox or radio's label is part of its target | click the label, read the state | Checkbox, Radio |
| Destructive actions offer Undo or confirm the decision by name | script + DOM text | Toast, Dialog |

**Model judge:** blind pairs (A/B order swapped per pair to cancel position bias), the task's
screenshots, a 10-item checklist per task, a preference with "tie" and "both bad". Two
judges: Claude, plus GPT through Codex.

**Owner's blind picks:** a local review page shows one pair's screenshots at a time, step by step and side by side,
without arms named; pick, tie or both bad, with an optional note. About 40 pairs, chosen across
tasks. The judge's agreement with these picks, per dimension, says where it can be trusted.

**Report:** win rate of B over A with 95% intervals, overall and per task; per-check pass rates
and deltas; checks that never discriminate; tasks where B lost; cost delta. Then: rewrite pages
whose checks don't move, and turn repeated failures into topics.

## 5. Steps

1. Skill export and its freshness test.
2. Starter, runner, task scripts, the checks.
3. Pilot (12 builds); fix the harness and drop broken checks.
4. Full run (88 builds), one or two at a time, when the machine is free.
5. Judges, then the owner's review page.
6. Report in `docs/research/`, and the changes it calls for.

Lives in `eval/` in this repo; results aren't deployed.
