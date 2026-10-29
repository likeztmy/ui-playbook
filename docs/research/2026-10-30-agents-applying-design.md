# Agents applying design guidance: what changes behaviour beyond a rules document

Written 2026-10-30. The question: what actually makes a coding agent (Claude Code, Codex, Cursor, v0-style generators) apply design guidance when it builds UI? Putting rules in a document is not enough. The trigger is the last eval round: with the Skill loaded, agents still put every section in a card.

The owner has already judged three paths weak or insufficient: rules alone in a Skill or AGENTS.md, mood-word design context, and lint on rendered output. This file looks for evidence for and against each, and widens the search.

**Verified** means the claim was read in the source named. Each entry says how much was read: the full HTML text, the abstract only, a first-party doc page, or source code. Every link was checked with `curl -sIL` (HTTP 200/202). ACM DOIs return 403 to scripts, so they were checked through Crossref instead (`api.crossref.org/works/<doi>`). Anything not verified is labelled as such.

## Summary: ranked directions

| # | Direction | Mechanism | Strongest evidence | How it applies to UI Playbook |
| --- | --- | --- | --- | --- |
| 1 | **A separate, calibrated visual critic in the loop** | A second agent screenshots the build and critiques it, calibrated with retrieved examples. It runs 1–3 rounds, and the generator revises. The judge, not a rule, decides context-dependent cases. | Anthropic's harness post: self-grading "reliably skew[s] positive", and a separate evaluator calibrated with few-shot score breakdowns fixed it. WebGen-Agent: screenshot feedback raised appearance 3.0 → 3.6 (GPT-4o-scored). UICrit: similarity-retrieved few-shot critique +55% over zero-shot. Huang et al.: intrinsic self-correction without external signal fails. | Add an eval arm with a critic subagent. It sees the screenshot, the `look.mjs` numbers as evidence, and only the playbook pages that match what it sees. The cards problem becomes a question the critic answers in context, not a lint verdict. |
| 2 | **Show the pictures: contrastive visual exemplars, retrieved per surface** | Agents get the Prefer/Avoid demo *images* (and their code), picked by similarity to the screen being built, not the whole set. | UICrit: visually similar examples 0.44 vs random 0.31. LayoutPrompter: dynamic exemplars beat random on FID/mIoU. Lee et al. CHI 2010: designs made with examples rated higher, and adaptive examples preferred over random. Figma: a screenshot "helps the generated code match the layout more closely". | Export each demo's Prefer/Avoid as a PNG pair beside its reference `.md`. Give the critic (and optionally the generator) the 2–4 pairs relevant to the current surface. Test whether Codex opens image files in a Skill. |
| 3 | **Golden reference code: make the right structure the easiest thing to copy** | Ship small, working pattern files and components that already encode the rule, including the context split (bare numbers → one row with dividers; number + sparkline → tiles). The agent copies code more reliably than it applies prose. | Industry convergence: v0's read-only filesystem of curated samples, Primer's `list_patterns`/`get_pattern`, Carbon's `code_search`, Storybook MCP, Lovable design-system projects copied into the repo. Storybook reports +12.8% "code usage" and 27% fewer tokens (vendor-run, method not given). | The In practice apps are the golden references. Export small pattern files (TSX) from them into `references/patterns/`, one per context-dependent rule, each with the "when this, not that" split in code. |
| 4 | **A structure plan reviewed before code** | Before writing JSX, the agent writes the layout plan: sections, which boundary each gets and why, as text or ASCII. It checks the plan against named defaults ("the SaaS-card kit"), revises, then builds. | Two labs' own skills do this. Anthropic's `frontend-design` names "the SaaS-card kit" as a generated-UI tell and requires a plan → review → build pass. OpenAI's GPT-5.4 guide says "Default: no cards". Neither is measured. | Cheapest to test: one paragraph in SKILL.md that requires a boundary plan (each box justified by an interaction or a distinct object) before code. Measure box count and depth in the eval. |
| 5 | **A tiny always-loaded trigger and index** | Passive context in AGENTS.md (≤ ~8 KB) holds the decision questions plus a file index, so the agent never has to decide to load the Skill. Detail stays in references. | Vercel: Next.js eval 53% baseline, 53% Skill by default (never invoked in 56% of cases), 79% with explicit instruction, 100% with an 8 KB index in AGENTS.md. Against it: Gloaguen et al. (ETH, 2026) found developer-written context files gave only ~4% and cost 20%+ more. IFScale: accuracy falls as instruction count grows (68% at 500). | First check from the Codex event logs whether the agent opened the Skill at all. If it didn't, test a short AGENTS.md block in the eval starter, kept to the 5–10 rules that the eval measures. |
| 6 | **Lints as evidence for the judge; hard gates only for invariants** | Deterministic checks for zero-exception rules (contrast, token use, three-deep nesting) run as a Stop hook. Context-dependent checks ("six boxed sections") are passed to the critic as questions, not failures. | DesignRepair splits hard from soft constraints, and soft constraints repair worse (70.4% vs 92.3% recall). Lovable's adherence checks retry on raw colours and custom components. Claude Code docs: hooks for zero-exception rules, CLAUDE.md for guidelines "Claude is allowed to decide [don't] apply". Impeccable runs a detector but keeps it apart from the design review so it doesn't anchor it. | Keep `look.mjs`, but change what its output does. Floors (4.5:1, icon library, nesting > 2) block via the hook. Box counts and equal tiles go to the critic with the screenshot, and the critic decides. |

**Why this order.** Directions 1 and 2 have the most measured evidence, from several independent research groups. They also answer the owner's objection to lint directly: context-dependence is handled by a judge that sees the screen and relevant examples, not by a threshold. Direction 3 is where industry has converged, but nobody publishes independent measurements. Direction 4 is first-party practice at both labs and costs almost nothing to test, but no one has measured it. Direction 5 has strong numbers, but for API knowledge rather than design taste, and a peer-reviewed study partly contradicts it. Direction 6 reframes something the owner already has; on its own it doesn't change behaviour.

**Not ranked as a direction: training.** Fine-tuning and reward models (UICoder, UIClip, Apple's designer-feedback work, ReLook) have the strongest measured gains, but a Skill can't fine-tune Claude or Codex. Two lessons do transfer. First, designers' sketches and direct edits on concrete outputs produce a far more consistent signal than A/B rankings: 76.1% and 63.6% agreement vs 49.2%, near chance. Second, a reward model can rank n candidate builds (best-of-n). Both are covered in Section 1.

---

## 1. Research: automated critique, violation detection and repair, learned quality models

### 1.1 UIS-Hunter: rule-based guideline-violation detection

- **Source.** Yang, Xing, Xia, Chen, Ye, Li. *Don't Do That! Hunting Down Visual Design Smells in Complex UIs against Design Guidelines*. ICSE 2021, pp. 761–772. doi:[10.1109/ICSE43902.2021.00075](https://doi.org/10.1109/ICSE43902.2021.00075) (Crossref checked). Preprint: https://xin-xia.github.io/publication/icse213.pdf (downloaded, but the text layer couldn't be extracted with the tools available). The abstract was read on the ICSE 2021 programme page.
- **Signal.** Guidelines as text, turned into hand-written detectors. The authors took 93 "don't" guidelines from Material Design, covering seven dimensions (layout, typography, iconography, navigation, communication, color, shape) and four component aspects (anatomy, placement, behavior, usage). The detectors run over extracted component metadata, typography, iconography, colour and edges.
- **Numbers (abstract).** Of 60,756 UIs from 9,286 Android apps, 7,497 UIs from 2,587 apps violate at least one guideline. Precision 0.81, recall 0.90. User studies found it more effective than manual detection.
- **Context-dependence.** Handled only by choosing guidelines that can be checked objectively. How many of the 93 guidelines were automatable was not read (in the PDF body).
- **Limit for us.** When DesignRepair compared against it on *LLM-generated web code*, its recall fell to 32.3% on v0 projects (§1.2). A rule detector built for one platform's components barely transfers.

### 1.2 DesignRepair: retrieval of guideline knowledge, then LLM repair

- **Source.** Yuan et al. *DesignRepair: Dual-Stream Design Guideline-Aware Frontend Repair with Large Language Models*. ICSE 2025. doi:[10.1109/ICSE55347.2025.00109](https://doi.org/10.1109/ICSE55347.2025.00109) (Crossref checked); arXiv [2411.01606](https://arxiv.org/abs/2411.01606) (HTML v2 read); code at https://github.com/UGAIForge/DesignRepair.
- **Signal.** Guidelines as text (Material Design 3), split into a component knowledge base and a system knowledge base, retrieved per component. Inputs are both the code and the rendered page: Playwright extracts DOM data and seven property groups (Group, Clickable, Spacing, Platform, Label, Text, Color). An LLM maps the code's components to knowledge-base names, so there is no hand-written mapping.
- **Context-dependence.** Guidelines are tagged *hard* (do/don't, "Remember this is mandatory") or *soft* (recommended, "regarded as optional"). Repair runs per component and property group, then a merge pass resolves conflicts. There's no other context mechanism.
- **Numbers.**
  - Detection on v0 projects: recall 92.1 / precision 87.3, vs UIS-Hunter's 32.3 / 55.4. On GitHub projects: 83.3 / 90.9 vs 22.9 / 47.8.
  - Repair: recall 89.3%, precision 86.6% (v0); 85.2% and 90.7% (GitHub).
  - Soft constraints repair much worse than hard: 70.4% vs 92.3% recall on v0.
  - User study (26 people): mean rating 3.04 → 3.92 (Wilcoxon p ≈ 7×10⁻⁹). The interview section's "58.7% regarded the before-repair pages as visually superior" contradicts that, so treat the user-study result with caution.
- **Limits stated.** Small dataset (20 v0 projects, 6 GitHub projects). Soft constraints were hard even for annotators. On complex pages the LLM "avoids significant adjustments to prevent introducing new issues". "LLMs tend to predict larger values to ensure accessibility, which can compromise page consistency."
- **For us.** This is the closest research analogue to "retrieve the relevant playbook page, then repair". It works for checkable properties. It degrades on exactly the soft, context-dependent rules where the cards problem lives. No baseline of plain GPT-4 repair was run, so we can't tell what retrieval itself added.

### 1.3 UIClip: a learned UI-quality model

- **Source.** Wu, Peng, Li, Swearngin, Bigham, Nichols. *UIClip: A Data-driven Model for Assessing User Interface Design*. UIST 2024, doi:10.1145/3654777.3676408 (Crossref checked); arXiv [2404.12500](https://arxiv.org/abs/2404.12500) (HTML read up to ~89%).
- **Signal.** A learned model. CLIP B/32 is fine-tuned on JitterWeb: 2.3M synthetic pairs from about 300k crawled pages, each original treated as better than a version "jittered" against the CRAP principles (contrast, repetition, alignment, proximity). It is also tuned on BetterApp: about 1,200 ratings from 12 designers, 892 pairs kept.
- **Numbers.**
  - Pairwise accuracy, overall: UIClip 75.12%; GPT-4V 51.58% (about 10% refused); LLaVA 54.59%; CLIP-objective-only 65.42%.
  - Designers agreed with each other at Krippendorff's α = 0.37.
- **Use in generation.** Best-of-n reranking: n = 5 GPT-3.5 outputs, rendered and scored. **No quantitative effect is reported**, only one example figure.
- **Context-dependence.** Only through the text description paired with the screenshot. The authors: "there are many nuances that cannot be captured by this formulation". It can't localise defects and sees only single screens.
- **For us.** It's evidence that general MLLMs (2024 generation) were near chance at pairwise UI quality, and a small trained model beat them. Whether today's models still lose to it is untested here.

### 1.4 UICoder: automated feedback as a training filter

- **Source.** Wu, Schoop, Leung, Barik, Bigham, Nichols. *UICoder: Finetuning Large Language Models to Generate User Interface Code through Automated Feedback*. NAACL 2024; arXiv [2406.07739](https://arxiv.org/abs/2406.07739) (HTML read).
- **Signal.** A compiler plus a CLIP relevance score, used to filter about 1M self-generated SwiftUI programs. Near-duplicates are removed with DBSCAN, and the model is fine-tuned over 4–5 iterations.
- **Numbers.** UICoder-Filtered: compile rate 0.79, CLIP 0.404, human Elo 1099. GPT-4: 0.81 / 0.419 / 1189. Base StarChat-Beta: 0.03 / 0.334 / 773. The DPO stage "did not lead to significant improvements".
- **Limits stated.** CLIP catches relevance and large quality gaps, not "subtle design choices". Remaining failures: text overflow, inaccessible controls, poor style, contrast. The programs stay "relatively simple".
- **For us.** Cheap automatic signals get code to work. They don't get it to look designed.

### 1.5 Apple: designer feedback beats rankings as a training signal

- **Source.** Wu, Swearngin, Vajjala, Leung, Nichols, Barik. *Improving User Interface Generation Models from Designer Feedback*. arXiv [2509.16779](https://arxiv.org/abs/2509.16779) (HTML v2 read up to ~77%); Apple page: https://machinelearning.apple.com/research/designer-feedback.
- **Signal.** Human designers, giving four kinds of feedback: ranking, comments, sketches (boxes plus a comment each, matched to DOM elements), and direct revisions in Sketch. Each becomes preference pairs that train a reward model (from UIClip), which then tunes Qwen2.5-Coder with ORPO.
- **Numbers.**
  - 21 designers gave 1,460 annotations: 1,063 rankings, 181 sketches, 152 comments, 64 revisions.
  - How often designers agreed with the researchers, by feedback type: revision 76.1%, sketch 63.6%, comment 57.3%, ranking 49.2% ("close to random chance").
  - Arena win rates: sketch-trained 0.59, revision 0.54, UIClip 0.52, base 0.46, comment 0.45, ranking 0.44.
  - Qwen3-Coder + sketch reward: Elo 1242 (win 0.80) vs GPT-5 at 1121 (0.67), "significantly preferred".
- **Why rankings fail (stated).** Designers "often must choose between two flawed options", and a pair offers no way to say what to fix.
- **Limits stated.** One-hour sessions, synthetic (low-quality) UIs, six judges, single screens, Qwen-family generalisation only, may not hold for stronger LLMs.
- **For us.** The owner's own judgments are the scarcest signal in the eval. They're worth most as *marked-up screenshots or direct edits* ("this box should be a divider"), not as A-vs-B picks. 181 sketches were enough to move a model.

### 1.6 UICrit, and GPT-4 heuristic evaluation (Duan et al.)

- **UICrit.** Duan, Cheng, Li, Hartmann, Li. *UICrit: Enhancing Automated Design Evaluation with a UI Critique Dataset*. UIST 2024, doi:10.1145/3654777.3676381 (Crossref checked); arXiv [2407.08850](https://arxiv.org/abs/2407.08850) (HTML read up to ~84%).
  - **Signal.** Human critiques used as few-shot examples. 3,059 critiques and ratings by 7 designers on 983 mobile UIs.
  - **Numbers.**
    - Comment quality: 0.48 vs 0.31 for zero-shot (p = 5e-4), "a 55 percent increase". The winning setup was 8-shot with examples picked by joint task and visual similarity, plus visual prompting (coordinates on the screenshot edge).
    - **Similar examples beat random ones**: visual-similarity 8-shot 0.44, semantic 0.42, random 0.31.
    - Rating accuracy: joint method 0.53, next best ≤ 0.31.
    - Human agreement on critique quality: Fleiss κ ≈ 0.29–0.31.
  - **Limits stated.** 7 critics; single screens; at most 8 shots; "still sometimes hallucinates"; nobody implemented the critiques.
- **Heuristic evaluation with GPT-4.** Duan, Warner, Li, Hartmann. *Generating Automatic Feedback on UI Mockups with Large Language Models*. CHI 2024, doi:10.1145/3613904.3642782 (Crossref checked); arXiv [2403.13139](https://arxiv.org/abs/2403.13139) (HTML read up to ~72%).
  - **Numbers.**
    - Accuracy: 52% accurate, 19% partially, 29% not.
    - Against 12 experts: GPT-4 precision 0.603 vs 0.829 for the average human; recall 0.380 vs 0.336.
    - **Feedback got worse over iterations.** Accurate fell 52% → 39%, and not accurate rose 20% → 35%, as designers improved their mockups.
  - **By guideline.** GPT-4 was best on Consistency and Standards (misalignment, size inconsistency). It was worst on "Aesthetic and Minimalist Design" (generally inaccurate and unhelpful), and Semantic Grouping was least accurate.
  - **Limits.** Overapplication of guidelines was raised by *all 12* participants, and the same feedback repeated for every element of a type.
- **Follow-up.** Duan, Cheng, Hartmann, Li. *Visual Prompting with Iterative Refinement for Design Critique Generation*. arXiv [2412.16829](https://arxiv.org/abs/2412.16829) (abstract only). An iterative pipeline with Gemini-1.5-pro and GPT-4o, with zoomed patches for box refinement. Per the abstract it closes "the gap from human performance by 50% for one rating metric"; the exact metric was not read.
- **For us.** Retrieval of *similar* examples is what made critique work, which supports direction 2. LLM critics overapply rules, the same false-positive problem the owner found with lint. They also lose accuracy once the obvious issues are fixed, which argues for few rounds.

### 1.7 Design2Code: self-revision with a screenshot

- **Source.** Si et al. *Design2Code*. NAACL 2025; arXiv [2403.03163](https://arxiv.org/abs/2403.03163) (HTML v3 read).
- **Signal.** The model compares a screenshot of its own render with the target and revises.
- **Numbers.**
  - GPT-4V: Block-Match 87.6 → 88.8 from text-augmented to self-revision; human win+tie 82% → 85%.
  - Gemini 1.0 Pro Vision: self-revision was slightly *worse* than text-augmented on every metric except Color (unchanged), and human win+tie fell 61% → 60%. "further adding self-revision is not helpful".
- **For us.** Same-model screenshot self-review with no external criteria gives small or zero gains. It's a fidelity task (match a target), which is easier than a taste task, and it still barely helped.

### 1.8 Sketch2Code: multi-turn feedback

- **Source.** Li, Zhang, Yang. *Sketch2Code*. NAACL 2025; arXiv [2410.16232](https://arxiv.org/abs/2410.16232) (HTML read up to ~65%).
- **Numbers.**
  - Feedback following: GPT-4o's visual gain per turn shrinks, +1.99, +0.96, +0.43, +0.43, +0.19.
  - "Most performance gains occurred within the first two rounds of interactions, and performance often plateaued or even deteriorated after three to four rounds".
  - Simulated feedback improved visual similarity by 1.41% per feedback, human experts' by 1.62%.
  - Agent-written questions *hurt* visual similarity (−1.12% per question); expert questions helped (+0.58%).
  - 7 of 8 experts preferred the question-asking agent.
- **For us.** Budget 1–2 critique rounds per build. More rounds risk regression.

### 1.9 Visual-feedback agents and RL with MLLM critics

- **WebGen-Agent.** Lu, Ren et al. ICLR 2026; arXiv [2509.22644](https://arxiv.org/abs/2509.22644) (HTML read up to ~89%).
  - **Signal.** A *separate* VLM (Qwen2.5-VL-32B) scores the landing-page screenshot and suggests fixes. A GUI agent tests functions. Backtracking and best-step selection use both scores.
  - **Ablation (cumulative).**

    | Step | Accuracy | Appearance |
    | --- | --- | --- |
    | Execution-only | 45.9% | 3.0 |
    | + screenshot feedback | 46.6% | **3.6** |
    | + GUI testing | 49.9% | 3.4 |
    | + backtracking | 51.2% | 3.7 |
    | + select-best | 52.6% | 3.8 |

  - Headline: Claude-3.5-Sonnet accuracy 26.4% → 51.9%, appearance 3.0 → 3.9.
  - **Caveat.** Appearance is scored by GPT-4o, not humans. Human-checked accuracy of the feedback scores was 93–96% (screenshot) and 89–93% (GUI).
  - **For us.** Screenshot feedback moved *appearance* and almost nothing else. Functional testing *lowered* appearance until backtracking was added, which suggests the loop needs a "keep the best version" step.
- **ReLook.** Li, Zhang et al. arXiv [2510.11498](https://arxiv.org/abs/2510.11498) (ACL 2026 per the Anthology listing; HTML read).
  - **Signal.** An MLLM critic (Qwen2.5-VL-72B) scores screenshots as the RL reward. Invalid renders get zero reward. "Forced Optimization" accepts only improving revisions.
  - **Numbers.** Qwen2.5-7B on ArtifactsBench-Lite: base 21.59, Web-RL 24.89, ReLook 27.88.
    - Keeping the critic at inference vs a critic-free self-edit: 27.88 vs 25.44, at 123 s vs 18 s per query.
    - Penalising regressions "incentivized the agent to reduce reflection frequency": reward hacking.
  - **Limits.** 7B/8B models only, and training overhead.
- **ArtifactsBench.** arXiv [2507.04952](https://arxiv.org/abs/2507.04952) (abstract read). An MLLM judge works from a 10-dimension checklist per task, over screenshots captured across interactions. It reports "94.4% ranking consistency with WebDev Arena" and over 90% pairwise agreement with human experts. These are the authors' own figures and haven't been independently replicated.

### 1.10 How good are MLLMs as UI judges?

- **Source.** Luera et al. *MLLM as a UI Judge*. arXiv [2510.08783](https://arxiv.org/abs/2510.08783) (HTML read).
- **Setup.** 30 UIs; 9,296 usable ratings from MTurk; GPT-4o, Claude 3.5 Sonnet, Llama-3.2-11B; 9 factors.
- **Numbers.**
  - Absolute ratings: Pearson r ≈ 0.69–0.73 overall. Correlation was strong on Trust, Visual Hierarchy, Memorable and Aesthetic Pleasure, and **near zero on Comfort and Ease of Use**.
  - Pairwise choice: Claude 59.98%, GPT-4o 59.60%. Near chance on Ease of Use (47–52%).
  - Pairwise accuracy rises with the human score gap, to about 90% for clearly different pairs.
- **Limits stated.** Static screens, Western professional designs. "supplement early, low stakes user research – not replace it".
- **For us.** A critic is trustworthy for visual hierarchy and clutter, which covers "every section in a card". It is not trustworthy for usability or flow, and it is only reliable when the difference is large. That favours a critic that compares *against reference pairs* rather than scoring in the abstract.

### 1.11 Does critique turn into repair? UXBench

- **Source.** Wang, Huang et al. *UXBench: Measuring the Actionability of LLM-Generated UX Critiques*. arXiv [2606.16262](https://arxiv.org/abs/2606.16262) (HTML read up to ~94%).
- **Signal.** Models explore runnable fixtures and write a critique. A fixed repair agent applies it, and the "repair lift" is measured.
- **Numbers.**
  - Every critic gave positive lift over the 3.27 baseline, from +0.14 (Gemini 3.1) to +0.22 (GPT-5.4).
  - Pooled lift +0.176 (95% CI 0.140–0.212, Cohen's dz = 0.54).
  - Human validation (6 people) correlated with the automated lift at Spearman ρ = 0.635, p = 0.091 (not significant).
- **Missing.** No no-critique or generic-critique control, and no screenshot-only ablation.
- **For us.** Critique-then-repair does produce measurable improvement, but the effect is moderate and the control we'd most want is missing.

### 1.12 Google's Generative UI: how much the prompt matters

- **Source.** Leviathan, Valevski, Matias et al. *Generative UI: LLMs are Effective UI Generators*. arXiv [2604.09577](https://arxiv.org/abs/2604.09577) (HTML read); blog: https://research.google/blog/generative-ui-a-rich-custom-visual-interactive-user-experience-for-any-prompt/.
- **Numbers.**
  - Prompt ablation (LMArena Elo): full prompt 1553, minimal 1496, with "core philosophy and the corresponding examples" removed 1451. Removing the philosophy *and its examples* hurt more than shortening the prompt.
  - Against human-expert sites: Elo 1736 vs 1800, and "at least comparable in 50% of cases".
  - Nine post-processors fix known error classes, for example hallucinated icons and missing Tailwind directives. Their effect is not measured.
- **For us.** Examples bundled with principles are a measured contributor in a production system. It's also another case where known failure classes are fixed by code after generation, not by asking.

### 1.13 Exemplar retrieval for layout: LayoutPrompter

- **Source.** Lin et al. *LayoutPrompter*. NeurIPS 2023; arXiv [2311.06495](https://arxiv.org/abs/2311.06495) (abstract and ablation description via search; table values not read).
- **Finding.** Dynamic, similarity-based exemplar selection beats random selection on FID and mIoU across tasks, though random has better Align and Overlap in some settings. **Exact table numbers unverified.**

---

## 2. Industry: how products and design-system teams get generated UI to conform

| Product / team | Lever | What the first-party source says | Measured? |
| --- | --- | --- | --- |
| **Anthropic `frontend-design` skill** | Prose, plus a process (plan → review → build → screenshot critique) | Names five generated-UI clusters, including "the SaaS-card kit: content chopped into identical rounded cards…". Requires a token plan first, then a check of the plan against "the generic default you would produce for any similar page", then code. "Critique your own work as you build, taking screenshots". | No |
| **Anthropic blog, *Improving frontend design through Skills*** (12 Nov 2025) | Prose at the "right altitude" | "Distributional convergence": safe defaults dominate training data. Banning fonts moves the model to the next default (Space Grotesk), so they added a closing "vary your choices" line. The general prompt is about 400 tokens. Before/after screenshots only. | No |
| **Anthropic engineering, *Harness design for long-running application development*** (24 Mar 2026) | A separate evaluator agent with Playwright | Self-grading: agents "reliably skew positive". A separate evaluator was "far more tractable" to tune. Calibrated "using few-shot examples with detailed score breakdowns". Criteria: design quality and originality weighted over craft and functionality. 5–15 iterations, up to 4 hours. Scores plateaued "with headroom still remaining", and the author sometimes preferred a middle iteration. Criteria wording ("museum quality") "directly shaped the character of the output". | Author judgment only |
| **Claude Code docs, *Best practices*** | Checks and hooks over instructions | "Give Claude something it can run that comes back pass or fail", including "A browser screenshot next to the mockup". "If something has to happen every time, make it a hook… CLAUDE.md is for guidelines, and Claude is allowed to decide a guideline doesn't apply." Example prompt: "follow the pattern in HotDogWidget.php". | No |
| **OpenAI, *Designing delightful frontends with GPT-5.4*** | Reference images and mood boards, hard constraints, Playwright | "Default: no cards"; cards only as the container for an interaction. Constraints such as one H1, two typefaces, one accent. Playwright "significantly improves the likelihood" of polished output. "low and medium reasoning levels often lead to stronger front-end results". Refers to a `frontend-skill` installed via `$skill-installer`; **I could not find it in `openai/skills` main (unverified)**. | No |
| **OpenAI cookbook, *Frontend with GPT-5*** | Stack defaults plus image input | Recommends Tailwind, shadcn/ui and Radix Themes. Shows GPT-5 matching an existing dashboard's style from a screenshot. | No |
| **OpenAI `figma-implement-design` skill** | A visual target plus component reuse | Step 3: `get_screenshot` is "the source of truth for visual validation". Step 7: validate against it. "ALWAYS use components from the project's design system". | No |
| **v0 (Vercel)** | Retrieval, curated examples and post-generation fixers. These target *correctness*, not design. | *Composite model* (Jun 2025): RAG over docs and UI examples; error-free generation 93.87% (v0-1.5-md) vs 78.43% (claude-4-opus). *How we made v0 an effective coding agent* (7 Jan 2026): dynamic system prompt injected on intent detection; "read-only filesystem" of hand-curated code samples; icon names fixed against lucide exports by embedding search in under 100 ms; AST autofixers in under 250 ms; a "double-digit increase in success rates". | Internal, correctness only |
| **v0 design systems / shadcn registry** | Components and tokens as context | The registry is a way to "pass context from your design system to AI Models". v0 "may struggle with any customizations" because it is trained on default implementations. shadcn MCP lets agents browse, search and install registry items. | No |
| **Figma MCP + Code Connect** | Design context, a screenshot and component mapping | `get_screenshot` "helps the generated code match the layout more closely". "Set up Code Connect for the best component reuse". `create_design_system_rules` writes a rules file. | No |
| **Storybook MCP** (Kyle Gach, Mar 2026) | Component manifest, stories as examples, tests | Reshaped library, baseline vs MCP: "12.8% improved code usage", 2.76× faster, 27% fewer tokens. Task count, scoring and variance not given. Its docs warn the manifest costs tokens and that "excessive or misleading context" degrades performance. | Vendor-run, method not given |
| **Lovable design systems** | Components copied into the repo, rules read every time, adherence checks with retry | Rules are read "on every generation". Lovable "catches raw colors, custom or customized components, and other deviations" and retries before finishing. *Design guidance* asks up to three questions (palette, type, layout) when the prompt leaves the look open. | No |
| **Bolt.diy** (open-source system prompt) | Prose checklist | "Visual: stunning, unique, production-ready"; "8pt grid, 3-5 colors, 4.5:1 contrast"; "Microinteractions; smooth animations". Mood words plus a few numbers. | No |
| **Cursor** | Browser tool | The agent can navigate, click and screenshot, and it is "useful for testing frontend changes and debugging UI issues". No design-specific guidance. | No |
| **Primer (GitHub) MCP** | Patterns, examples, a CSS lint and guidelines on demand | Tools include `list_patterns`/`get_pattern`, `get_component_examples`, `get_component_usage_guidelines`, `lint_css`, `get_color_usage`, `get_typography_usage` and `primer_coding_guidelines`. The guidelines text: "Prefer re-using a component from Primer"; "Follow patterns from Primer when creating new components". | No |
| **Carbon MCP** | Code examples, docs and an audit | `code_search` returns "full example files"; `code_audit` "Validates code against Carbon guidelines". Its rule set isn't described. | No |
| **Atlassian ADS** | llms.txt, ESLint plugins, MCP, an internal skill | llms.txt links token, component and styling docs. Two ESLint plugins enforce design-system and styling standards. There is an ADS MCP server, and an internal `atlassian-design-system` skill "generated from the same content as this file". | No |
| **HeroUI** | MCP, docs agent API | llms.txt links an MCP discovery handshake and React/Native MCP docs. | No |
| **llms.txt adoption** (checked 2026-10-30) | Docs for agents | Serving `llms.txt` as text: Atlassian, Carbon, shadcn/ui, Base UI, HeroUI, USWDS, React Spectrum, Mantine, MUI, Chakra, Ant Design. No llms.txt (404 or HTML): Primer (which ships an MCP instead), Material 3 (m3.material.io), GOV.UK, Adobe Spectrum site, Radix, Fluent 2 (returns HTML), Polaris (HTML). | n/a |
| **Constrained vocabularies** | The model can only emit catalogue components | Vercel Labs `json-render`: "Predefined components and actions for safe, predictable output". Google `a2ui` exists (repo checked, README not read). | No |
| **Impeccable** (pbakaus) | Deterministic detector plus an isolated design review | `critique` requires two assessments, and the detector's findings stay out until the design review is done: "Detector output is deterministic, but it still anchors judgment." Detector rules include `rounded-card`, `icon-tile-stack`, `kicker-above-heading`, `tracked-caps`, `gradient-text` and `flat-type-hierarchy`. | No |

**What the industry lever actually is.** No vendor relies on prose rules alone. Every serious design-system team ships three things together: (a) components and code examples the agent copies (Primer patterns, Carbon `code_search`, Storybook stories, v0's curated sample filesystem, Lovable's copied components); (b) a check that runs without the model choosing to (Lovable adherence retry, Atlassian ESLint, Carbon `code_audit`, Primer `lint_css`, v0 autofixers); and (c) a visual target where one exists (the Figma screenshot, OpenAI's mood boards and Playwright). The design-*taste* layer (Anthropic, OpenAI, Bolt) is still prose. Both labs' answer to its unreliability is a *process*: plan before building, then look at a screenshot. Anthropic's own strongest result came from a separate evaluator, not from better prose. **No vendor publishes an independent, controlled measurement of design quality.** Vercel's numbers are about correctness, and Storybook's about "code usage".

---

## 3. Mechanisms: what the comparisons show

### 3.1 Getting the guidance read at all

- **Skills often aren't invoked.** Vercel, *AGENTS.md outperforms skills in our agent evals* (Jude Gao, 27 Jan 2026, read), on Next.js 16 APIs absent from training:

  | Setup | Pass rate |
  | --- | --- |
  | Baseline, no docs | 53% |
  | Skill, default | 53% (never invoked in 56% of cases) |
  | Skill with explicit instruction | 79% |
  | 8 KB compressed docs index in AGENTS.md | 100% |

  Wording mattered too: "You MUST invoke the skill" made the agent read docs first and miss project context, and "Explore project first, then invoke skill" did better. Their explanation: "No decision point". **Caveat.** This measures API knowledge, which is right-or-wrong. Design taste isn't, and no one has replicated this on design tasks.
- **Context files help less than claimed, and cost more.** Gloaguen, Mündler, Müller, Raychev, Vechev. *Evaluating AGENTS.md*. arXiv [2602.11988](https://arxiv.org/abs/2602.11988), ICLR 2026 (abstract and search summaries; full text not read). LLM-generated context files lowered success by 0.5–2%; developer-written files gave about 4%; inference cost rose 20%+. Agents *did* follow the instructions, but the files didn't reduce steps. Their recommendation: include only minimal requirements. **The numbers are from secondary summaries of the abstract; treat them as unverified.**
- **More rules, lower compliance per rule.** Jaroslawicz et al. *How Many Instructions Can LLMs Follow at Once?* arXiv [2507.11538](https://arxiv.org/abs/2507.11538), NeurIPS 2025 (abstract via search). The best frontier models reached 68% accuracy at 500 simultaneous keyword instructions, with a bias toward earlier instructions. The exported Skill is about 213 KB across 40 references, so any one rule competes with hundreds of others if all are loaded.

**Implication.** Before changing the guidance, find out which failure we have. Either the agent didn't open the relevant reference, or it opened it and overrode it. The Codex event logs in `<arm>-<n>.run` should show which files it read.

### 3.2 Examples vs rules

- **For examples.**
  - UICrit: similar examples 0.44 vs random 0.31; the best few-shot setup was +55% over zero-shot (§1.6).
  - LayoutPrompter: dynamic exemplars beat random (§1.13).
  - Generative UI: removing "philosophy and the corresponding examples" cost about 100 Elo (§1.12).
  - Lee, Srivastava, Kumar, Brafman, Klemmer. *Designing with interactive example galleries*. CHI 2010, doi:10.1145/1753326.1753667 (Crossref checked; abstract via search-result text, since the Stanford page timed out). Independent raters favoured designs made with examples; examples helped novices more; adaptively selected examples were preferred over random ones.
- **Against, or the cost.**
  - Jansson & Smith. *Design fixation*. Design Studies 12(1):3–11, 1991, doi:10.1016/0142-694X(91)90003-F (Crossref checked, abstract **not read**). The commonly reported finding is that designers shown an example reproduce its features, including flaws. That is a risk for golden references: every eval build may end up looking like Track.
  - Anthropic's blog: bans move the model to the next default, so examples and bans both anchor.
- **Code vs prose.** No controlled study for UI was found. The indirect evidence: industry puts the code example in front of the agent (Primer, Carbon, Storybook, v0). Claude Code's docs recommend "follow the pattern in <file>". Storybook's vendor eval measured "code usage" gains. **Unproven for design quality.**

### 3.3 Negative phrasing ("Avoid…")

- Jang, Ye, Seo. *Can Large Language Models Truly Understand Prompts? A Case Study with Negated Prompts*. arXiv [2209.12711](https://arxiv.org/abs/2209.12711) (abstract). Inverse scaling on negated prompts across OPT, GPT-3 and InstructGPT. **These are 2022 models, so it may not hold now.**
- Castricato et al. *Suppressing Pink Elephants with Direct Principle Feedback*. arXiv [2402.07896](https://arxiv.org/abs/2402.07896) (abstract). Prompting alone was weaker than fine-tuning at avoiding a named entity.
- Anthropic's current skill *does* name the defaults to avoid ("the SaaS-card kit"), so the labs don't treat naming as harmful.
- **Net.** Weak evidence that "Avoid: cards on every section" primes cards. It's worth an eval arm where the Avoid text is dropped and only Prefer, with its reason, remains. Don't act on it without measuring.

### 3.4 Critique-then-revise with screenshots

- **Without an external signal, self-correction fails.** Huang et al. *Large Language Models Cannot Self-Correct Reasoning Yet*. ICLR 2024, arXiv [2310.01798](https://arxiv.org/abs/2310.01798) (abstract): performance can drop after intrinsic self-correction. Gou et al. *CRITIC*. ICLR 2024, arXiv [2305.11738](https://arxiv.org/abs/2305.11738) (abstract): tool-based external feedback is "crucial". Design2Code: self-revision gave +3 points for GPT-4V and slightly worse results for Gemini. Anthropic: self-grading skews positive.
- **With a separate critic, calibrated examples and a screenshot, it works.** WebGen-Agent: appearance +0.6. ReLook: critic in the loop 27.88 vs 25.44. UXBench: repair lift +0.18. Anthropic harness: qualitative.
- **Round budget.** Sketch2Code: gains come in rounds 1–2, then plateau or decline. Duan CHI 2024: accuracy falls as designs improve. Anthropic: plateau, and a middle iteration sometimes best. WebGen-Agent and ReLook needed "keep the best" or "only accept improvement" rules.
- **What critics judge well.** Visual hierarchy, aesthetics and "interesting" (r up to 0.85). Not ease of use or comfort, which are near chance (§1.10). Consistency and alignment, not semantic grouping or minimalism (Duan CHI 2024). Note the risk: "every section in a card" is partly an *aesthetic-and-minimalist* judgment, the category GPT-4 handled worst in 2024. A critic needs reference pairs to anchor that judgment, not just the rule text.

### 3.5 Constrained component vocabularies

- Industry uses them for reliability (json-render, Lovable's copied components with retry on custom components, Primer's "Prefer re-using a component"). v0 warns that customised primitives confuse the model.
- **No controlled measurement of design quality was found.** For UI Playbook's case (a product built from scratch in a bare starter), a vocabulary doesn't directly stop over-boxing: a `Card` component used on every section still conforms to any vocabulary. It helps only if the vocabulary's *defaults* encode the rule, for example a `Section` that has no border and a `Card` that requires an interactive child or an `as="object"` prop.

---

## 4. What doesn't work, or is unproven

- **Rules alone, loaded on demand.** Not invoked in 56% of Vercel's cases. Even when read, compliance per rule falls with rule count (IFScale). This confirms the owner's conclusion.
- **Bigger context files.** Developer-written AGENTS.md gave about 4% at 20%+ more cost; LLM-written ones hurt (ETH; numbers from secondary summaries).
- **Mood words.** Not inert: Anthropic's "museum quality" wording "directly shaped the character of the output", and in ways the author "didn't fully anticipate". So mood words *steer*, but uncontrollably and in one direction. That supports the owner's judgment that they're not executable.
- **Same-model self-review with no criteria.** Design2Code: small or no gain. Anthropic: self-praise.
- **Unlimited critique rounds.** Regression after 2–4 rounds (Sketch2Code), declining critic accuracy (Duan), reward hacking when regressions are penalised (ReLook).
- **MLLM judges on usability.** Near chance for ease of use and comfort (Luera et al.). Use a critic for visual structure, not for flows.
- **Designer A/B rankings as signal.** 49.2% agreement, near chance (Apple). The owner's A/B picks in the eval may be less informative than marked-up screenshots.
- **Lint as a verdict on context-dependent rules.** LLM critics also overapply guidelines (all 12 participants in Duan CHI 2024). DesignRepair soft-constraint recall was 70.4%. A threshold can't see that three tiles each hold a number and a sparkline. This confirms the owner's conclusion, and it is why direction 6 turns lint output into evidence for the critic.
- **Best-of-n with a quality model.** Proposed in UIClip; **no effect measured**.
- **Vendor claims.** Storybook (+12.8%, method not given), Carbon, Figma, shadcn, Lovable, Atlassian and HeroUI publish no design-quality measurements. Anthropic's and OpenAI's frontend guidance is qualitative. Industry *convergence* on components, checks and visual targets is the evidence. It is not proof.
- **Code examples beating prose for UI taste.** Plausible, widely practised, and not measured anywhere found.

## 5. Open questions

1. **Not read, or read and overridden?** In the last round, did Codex open `principle-the-lightest-boundary-that-holds.md` or `component-card.md`? The answer decides between direction 5 (get it read) and directions 1–3 (make it bite).
2. **Can Codex see images in a Skill?** Direction 2 assumes the agent opens a PNG in `references/` when told to. Untested for Codex `gpt-6.1-sol`; a `--smoke` run could check.
3. **Critic from a different model family?** Anthropic used a separate agent, and WebGen-Agent and ReLook used different models for generator and critic. Would a Claude critic of Codex builds beat a Codex critic? Is the gain from separation or from model diversity?
4. **Does `look.mjs` evidence anchor the critic?** Impeccable keeps detector output out until the design review is done. Test critic-alone, critic-then-metrics and metrics-first on the same builds.
5. **Fixation.** If agents see Track's screens and code, do all ten tasks converge on Track's look? Measure spread across tasks (hue families, layout) in the golden-reference arm.
6. **Round budget and cost.** One or two critique rounds per build? ReLook: about 7× latency with the critic. Anthropic: up to 4 hours. What is the eval's time budget per build?
7. **Plan before code.** Does a written boundary plan (direction 4) change box count by itself, without a critic? It's the cheapest arm to run.
8. **Negative phrasing.** Does deleting the "Avoid" lines and keeping only "Prefer" plus its reason change card count? The evidence is weak and dated.
9. **Owner feedback format.** If the owner marks up 20–30 eval screenshots ("divider, not box", with a box drawn), can those become the critic's few-shot calibration set, as Anthropic did with score breakdowns and Apple with 181 sketches?
10. **Reasoning effort.** OpenAI says low or medium effort often gives stronger frontends. The eval runs `medium`. Is that a variable worth one arm?

## 6. Suggested eval arms (for the owner to choose from; not built)

Each arm keeps the existing tasks and `look.mjs` measures, and adds one variable:

- **b0.** Current Skill. Also log which reference files the agent opened.
- **b+index.** The same Skill plus a ≤ 8 KB AGENTS.md block in the starter, with the decision questions and the file index (direction 5).
- **b+plan.** The Skill plus a required boundary plan before code (direction 4).
- **b+critic.** The Skill plus 1–2 rounds of a separate critic subagent that sees the screenshot, the relevant pages and the `look.mjs` numbers, with "keep the best version" (directions 1 and 6).
- **b+pictures.** The b+critic arm with Prefer/Avoid PNG pairs given to the critic (direction 2).
- **b+patterns.** The Skill plus `references/patterns/*.tsx` taken from the In practice apps (direction 3). Check task-to-task spread for fixation.

## Sources whose findings rest on less than the primary text

- UIS-Hunter: abstract only (the PDF text layer couldn't be extracted here); per-guideline automation coverage not read.
- LayoutPrompter: exact ablation numbers not read.
- Duan et al. 2412.16829: abstract only; "50%" metric not identified.
- Gloaguen et al. (ETH AGENTS.md): numbers from search summaries of the abstract.
- IFScale: abstract via search.
- Lee et al. 2010: abstract via search-result text (Stanford page timed out).
- Jansson & Smith 1991: citation checked; finding as commonly reported, abstract not read.
- OpenAI `frontend-skill`: referenced in OpenAI's post, not located in `openai/skills`.
- Google a2ui: repository exists; content not read.
