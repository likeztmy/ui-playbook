# Plan: real cases, and a Skill that asks, assumes and tries the extremes

Status: draft for sign-off. The owner agreed the directions on 2026-10-31; the decision points at
the end are open.

## Why

- **The cases read like specs, and some give the answer away.** `01-confirm-delete` says the button
  "asks before doing it"; `details-panel` passes without the Skill, so it measures nothing.
- **Real prompts are a paragraph in plain words.** The two doc apps the owner built from one such
  paragraph (Paper, Folio) found the sidebar bug no case had.
- **The Skill is tuned on the cases it's scored on.** Four rounds of wording against the same five
  briefs can fit the briefs, not the work.
- **The bugs were in states nobody tried.** Both doc apps looked right with their sample content;
  they broke once a document ran past the window.

## 1. The cases

Each case is one paragraph, written the way the owner writes to an agent, in Chinese. Six are
practice, used to tune the Skill; three are the exam, run every few rounds and never read while
changing the wording. Each names the kind of product (work tool, consumer app, reading), so every
system is covered.

### Practice

| Case       | Kind      | Prompt                                                                                                                                                                                                                                                                                                         |
| ---------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `docs`     | work tool | 帮我做一个在浏览器里用的文档 app，有点像 Craft 或 Notion，但只给我自己用，简单一点。左边是文档列表，右边是正在写的文档。要能新建、搜索、加星标、删除（删错了要能找回来），写的时候支持常用的 Markdown 快捷输入：标题、列表、待办、引用、代码块。数据存在浏览器里就行。先放二三十篇示例文档，其中几篇写长一点。 |
| `tasks`    | work tool | 我们 6 个人在做一个手机 app，想要一个简单的任务看板，替代现在的表格。能按状态分组看所有任务（待办、进行中、待验收、完成），按人、按标签筛选；点开任务能改状态和负责人，能留言；新建任务要快，用键盘就能搞定。先造 40 条左右的任务，存在浏览器里。                                                              |
| `money`    | consumer  | 做一个手机上用的记账小应用，网页版就行，主要在 iPhone 上打开。记一笔要快：金额、分类、备注，日期默认今天。首页看这个月花了多少、各分类占多少，下面是流水，能改能删。先造两个月的数据。                                                                                                                         |
| `settings` | work tool | 给我们的 SaaS 做团队空间的设置页：个人资料、通知偏好、外观（浅色、深色、跟随系统）、成员管理（邀请、改角色、移除），最后是删除空间。                                                                                                                                                                           |
| `join`     | consumer  | 一个健身 app 的注册流程：先注册（名字、邮箱、密码），然后两三步问一下目标和每周想练几天，最后进到首页。邮箱已经注册过要提示，密码至少 10 位、带数字。用假接口模拟网络延迟。                                                                                                                                    |
| `article`  | reading   | 做一个技术博客的文章页，放一篇四千字左右的长文，有目录、代码块、图片、引用和脚注，手机和电脑上读着都要舒服。                                                                                                                                                                                                   |

`docs` and `settings` also run as a one-liner, to see what the Skill does with a brief that
decides nothing: 「做一个文档 web app。」 and 「做一个设置页。」

### Exam (held out)

| Case       | Kind              | Prompt                                                                                                                                                                                                                                                                      |
| ---------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `music`    | consumer, desktop | 做一个电脑上用的音乐客户端，网页版就行。左边是资料库：歌曲、专辑、歌手、歌单；右边是当前选中的内容；底部一直有播放条，能播放暂停、上一首下一首、拖进度、调音量。能搜索，能新建歌单、把歌加进歌单、调整顺序。造 300 首左右的曲库和几个很长的歌单。播放用假的，不用真的出声。 |
| `order`    | consumer, phone   | 做一个奶茶店的手机点单页：菜单分类，选规格（大小、甜度、冰量），购物车，下单。用假接口，下单要一两秒。                                                                                                                                                                      |
| `handbook` | reading           | 给一个开源命令行工具做文档站：左边章节导航，中间正文，右边本页目录，能搜索。放 15 页左右的示例文档，有几页很长。                                                                                                                                                            |

The exam has no work tool, since practice has three. Its two consumer apps differ by device:
`music` on the desktop, `order` on the phone.

The briefs say what the product does, never how a rule should come out: nothing about confirming,
when errors show, cards or scrolling. The old `eval/tasks` stay for the record; their results keep
their names.

## 2. Two arms, two agents, built and walked

- **Arms:** the prompt alone, and the prompt with the Skill. Everything else is the same: the
  starter, the footer, the model.
- **Agents:** Codex, as now, and Claude, through the same runner: `claude -p` in a fresh starter
  copy, its config isolated as Codex's is, then the same walk. `claude plugin eval` stays for the
  quick loop on wording, since it can't render what it scores.
- **A shared extremes walk**, run on every build after its own flow:

  | Extreme  | What it does                                                   | Pass                                                                                            |
  | -------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
  | Long     | Fills or opens the longest content and wheel-scrolls each pane | Only that pane moves; it scrolls back (the docs walk, made generic)                             |
  | Empty    | Clears the browser's storage and reloads                       | The empty screen names the next step and offers it                                              |
  | Narrow   | 375 px wide                                                    | No sideways scroll; targets 44 px in a consumer app                                             |
  | Keyboard | Tab from the top, Enter, Esc                                   | Focus is always visible, reaches the main action, never lands on `body`; Esc closes what opened |
  | Dark     | `prefers-color-scheme: dark`                                   | Text still holds 4.5:1, whichever scheme the build chose to offer                               |

  Each case adds its own flow: create, edit, delete and undo, the error a form shows, what a click
  opens. Judges still read the screenshots for what can't be measured.

## 3. The Skill

1. **Ask, or state the assumption.** Step 2 (the design stated before code) gets an _Assumptions_
   line. Ask only what changes the whole design and has no sound default: who it's for, phone or
   desktop, a brand or design system to follow, how much data. Everything the playbook already
   answers (confirming, error timing, boundaries) is decided, not asked. When the agent can't ask
   (one shot, or told to go ahead), it builds on the stated assumptions.
2. **An extremes checklist, before and after.** The five extremes above, as a short list in
   SKILL.md: before code, decide what each looks like; before finishing, try each in the browser.
3. **Look at it.** The last step opens the build in a browser, screenshots each state and the
   extremes, and checks them against the moments, the way the research's best method does.
4. **Recipes for the traps the eval found.** A few lines of correct code where wording alone failed:
   the dialog's first focus after `showModal()`, the app shell's `min-height: 0`.

Each change is measured on practice first; the exam runs after every second change.

## Order

1. Cases and prompts (this plan), the Claude runner, the extremes walk; one round of both arms on
   both agents as the new baseline.
2. Skill: assumptions and the extremes checklist. Practice round.
3. Skill: look at it, and the recipes. Practice round, then the exam.

## As built

- **Cases** are `eval/cases/<case>/`: `cn.md`, `en.md` and `case.json` (`set`, `kind`: app or
  reading, `device`: desktop or phone), with an optional `walk.mjs` for the case's own flow and its
  `long` state. `docs-short` and `settings-short` are the one-liners.
- **Runner:** `node eval/run.mjs <case> <a|b> <n> --agent codex|claude --lang cn|en`; builds are
  `<agent>-<arm>-<lang>-<n>`. `eval/batch.sh` reads the same five fields per line.
- **Builds live in `/Users/Shared/ui-playbook-eval-runs`**, outside the owner's home: Claude Code
  reads `.claude/CLAUDE.md` in every folder above the one it runs in, so a build under `~` was
  given the owner's own instructions (seen in the smoke run). Old runs stay in
  `~/code/ui-playbook-eval-runs`.
- **Claude** is Sonnet 5.5 (as the plugin eval), with `--setting-sources project,local`,
  `--strict-mcp-config`, no auto-memory, and the Skill as a `--plugin-dir` for arm b. The smoke run
  confirms it sees no CLAUDE.md, none of the owner's skills, and the Skill only in arm b. Edits are
  accepted in the build folder; the shell is limited to the commands a build needs.
- **Extremes walk:** `eval/walks/extremes/`, checked against synthetic pages (a good shell, a page
  that scrolls as one, a stuck flex pane, a wide page with hidden focus and faint text): each fails
  only what it should. Stuck panes are caught as text no scrolling reaches (`long-in-reach`).
- **Case flows** beyond the long state (create, delete and undo, form errors) come after the
  baseline; the judges read the screenshots meanwhile.

## Decision points

1. **Claude in the same runner.** Done; the plugin eval stays for wording. The smoke run logged in
   and saw only what it should.
2. **Runs per round.** Practice: 2 per arm per agent, over 8 briefs with the one-liners: 64 builds.
   The smoke builds took 14½ minutes on Claude (70 turns, $1.55 at API prices) and 8 on Codex, so
   a practice round is about 12 hours one at a time and about $50 of Claude. Exam: 3 each (36
   builds, about 7 hours), every second change.
3. **Prompts in both languages** (decided 2026-10-31). Each case is written in Chinese and in
   English, saying the same things; a round's runs alternate between them (practice: one of each
   per arm; exam: cn, en, cn), so the build count doesn't grow and a Skill tuned to one language
   shows.
