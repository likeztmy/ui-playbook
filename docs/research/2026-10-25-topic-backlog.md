# UI Playbook 选题库

48 个按优先级排序的候选：**16 component / 24 principle / 8 site**。优先补命令上下文、可逆操作、目标范围、焦点、输入日期及可中断交互；这些既有可讲的机制，也能做自然发生的 Before / After。前 10 条附可直接交给主 Agent 的场景、单变量和验收边界。

这是 2026-10-25 的定向 evidence review 与小范围 browser audit，不是系统综述，也不是用户实验。评分和 demo 都是编辑判断 / 待验证方案；本次只写选题，不实现页面。**verified 表示所述来源已打开并读到对应内容，不表示 demo 已做、产品当前行为已测，或来源因果结论可推广。**

## Scope and ranking

- Repo baseline：本 worktree 的 `src/entries.ts` 是 19 components + 6 principles。在线快照多了 How waiting feels：用 Chrome 打开该页并读到完整 Details 标题；因此它仍列为本地 **planned**，但注明 **live already**，不再次提案。
- Local inputs：已读 method digest、good-interface-design、notes 下全部 3 个文件、plans 下全部 6 个文件。3 份 notes 与 6 份 plans 均可映射，**unmapped shapes = 0**。它们是编辑约束和去重基线，不能代替外部出处。
- 外部范围：Apple HIG、Material 3、Radix / Base UI、shadcn/ui 的目录与相关组件文档；Linear / Raycast 官方设计与使用文档；W3C、Unicode、论文、NN/g、作者原始论述。JS-only 的 Apple / Material 正文通过 Chrome accessibility tree 读；其他用网页正文 / PDF。Exa 工具不可用，Jina 匿名读取被拒后使用网页工具，没有绕过授权。
- 纳入：机制可指名、可以固定单一自变量、与现有 / 已计划内容有明确边界。排除：只有常识口号、没有来源的效果数字、仅为凑齐组件目录而提的薄页。所有 Before 都是待重建的场景；外部产品没有当前实际操作证据时统一写 **no named product**。历史截图只说明原文观察过，不作为现在时指控。
- Scores：depth = 机制的意外程度；felt = 无指令体验差异的潜力；coverage = 补缺范围；effort = inverse cost（5 最省，1 最贵）。各 1–5。
- **Priority = 3 × depth + 3 × felt + 2 × coverage + effort**，满分 45；同分按 coverage 高、effort 高、English title 字母序。分数不是实测效果量，也不是排期承诺；secondary-only 条目仍须先补证据。
- 页内统一底线：一次只改变一件事；读者的自然任务触发效果；说明留给机制、出处和反例，不加“请点这里试试”。拟议 demo 都需实现后再 browser-test 才能写成行为事实。

## Existing and planned

现有 component：Button, Menu, Toolbar, Tooltip, Popover, Dialog, Input, Select, Combobox, Checkbox, Radio, Switch, Tabs, Slider, Segmented control, Card, Badge, Table, Toast。

现有 principle：Concentric radius, Colour means one thing, Where the eye goes, Nothing shifts, Hover forgives, Error timing。已有工具：squint blur、live layout-shift count、slow motion + first-frame outline、safe-triangle overlay。本 backlog 复用它们，不按“新增工具”重计。

| Plan file | Status | Backlog treatment |
| --- | --- | --- |
| 2026-10-22-pilot-input-and-errors.md | Implemented in local pages | 不重提 Input / Error timing；保留无指令 demo 的修正 |
| 2026-10-23-rollout.md | Component rollout largely implemented; earlier principle candidates were not full page plans | 不重提组件改版；Undo、Target、Motion source、Frequency 四候选在下文重新评估 |
| 2026-10-23-where-the-eye-goes-v2.md | Implemented | 不重提 attention 主场景或 squint tool |
| 2026-10-23-nothing-shifts.md | Implemented | 不重提 CLS、anchoring、font shift 或 counter |
| 2026-10-23-chinese-edition.md | Planned; owner-managed | 不纳入，且不编辑 Chinese site copy |
| 2026-10-25-how-waiting-feels.md | Planned in local baseline; verified live already | 不纳入；spinner delay、progress pacing / ribbing、labor illusion、skeleton vs spinner、optimistic updates 全部归这页 |

Skeleton / Progress：**planned coverage**，可在 waiting 页完成后评估是否需要独立 component anatomy / states 页；本次不占 ranked entries。Avatar 只保留身份槽的 image/fallback 生命周期，若计划阶段发现仍重复则并入 waiting 的组件引用。

## Coverage and remaining gaps

### Component comparison

目录存在不等于每个项目都应成为一页；下面按任务家族比较，不把平台专属名称强行一一对应。

| Reference | Existing overlap | Missing / next | Limit |
| --- | --- | --- | --- |
| [Apple HIG, Components](https://developer.apple.com/design/human-interface-guidelines/components) — **verified**；[Apple HIG, Selection and input](https://developer.apple.com/design/human-interface-guidelines/selection-and-input) — **verified** | 按钮、菜单、输入、选择、tabs、sliders、dialog / popover 等 | Sheets、date / number input 的不同任务；ranked Drawer / Sheet、Date picker、Number field | HIG 是多平台 guidance；sheet modality 要按平台读 |
| [Material 3, Components](https://m3.material.io/components) — **verified** | buttons、menus、dialogs、text fields、selection、tabs、cards 等 | Bottom / side sheets、date pickers、carousel；progress 留给 planned waiting | Navigation rail / bar、FAB、snackbar 与本站分类不完全同名 |
| [Base UI, component navigation](https://base-ui.com/react/overview/quick-start) — **verified**；[Radix Primitives, Introduction and component navigation](https://www.radix-ui.com/primitives/docs/overview/introduction) — **verified** | 大部分已覆盖的 primitives | Accordion、Avatar、Number / OTP Field、Drawer（Base UI）；Tree / Split pane 用 APG 补行为合同 | Radix 与 Base UI 分开核对；不能因为某库没有命名组件就断言模式不存在 |
| [shadcn/ui, Components](https://ui.shadcn.com/docs/components) — **verified** | 已有核心表单、overlay、data-display 家族 | Command、Drawer / Sheet、Empty、Calendar / Date Picker、Pagination、Breadcrumb、Resizable、Carousel | Skeleton / Progress 已计划；Sidebar 属于导航系统而非只换容器 |
| [Linear command-menu redesign (2019)](https://linear.app/changelog/2019-12-18-new-command-menu) — **verified**；[Linear, Filters](https://linear.app/docs/filters) — **verified**；[Raycast, Action Panel](https://manual.raycast.com/action-panel) — **verified** | Menu、Combobox、Table、快捷键细节有基础 | Command context、Filter bar、highlight vs select、学习路径 | 依据官方文档；没有访问用户 workspace 或当前登录产品 |

Component group still missing after this pass：time / timezone picker、color picker、rich-text editor、charts、navigation system（sidebar / rail / top-level navigation）、复杂数据网格和 touch gestures。没有足够独特机制与可控场景前先不排成薄页；Context menu / Alert dialog / Range slider 先归现有页的变体，避免重复命名。Separator、Scroll area 等小 primitives 暂不足以独立成页。

### Seven-step loop

| Step | Existing foothold | Ranked additions | Still missing |
| --- | --- | --- | --- |
| see | Where the eye goes; Colour; Concentric radius | #17 Small text needs different shapes; #31 Density is not just padding; #28 A colour changes with its neighbours | 真正读长文的 typography 实验；本次不推固定最佳行长 |
| understand | 标签、状态、基础组件语义 | #32 Make the mode visible; #27 Words can invert a state; #42 Breadcrumbs; #38 Filter bar | 复杂权限与跨系统 mental model，尚无已核实场景 |
| decide | Select / Radio / Combobox | #8 Keep the comparison in sight; #22 Defaults make a recommendation; #33 More choices can be easier; #5 Date picker | 风险 / 不确定性表达；不把政策研究直接当商业选择模板 |
| act | Button、Slider、Hover forgives | #2 Command menu; #3 The target is the whole thing; #13 Press is not commit; #6 Let motion change its mind; #10 Preview the destination | 复杂 touch / pen 手势和多人同时操作 |
| feedback | Toast、Nothing shifts；waiting planned/live | #14 Feedback without stealing focus; #4 Focus is not selection; #24 Keep meaning without motion | 多后台任务的聚合反馈；无需再建一个 spinner 原则 |
| recover | Error timing、Dialog | #1 Undo instead of asking; #30 Errors need a next step; #7 Empty state | 离线与冲突恢复、跨会话恢复，需独立产品证据 |
| learn | 组件细节、菜单 shortcut | #39 Teach at the moment of need; #36 Follow the mechanism; #41 Trace a claim to its evidence | 长期迁移 / 记忆的测量，不能用一次 demo 宣称学会 |

| Cross-cutting area | Treatment |
| --- | --- |
| Motion | #6 Let motion change its mind; #15 Motion has a source; #11 The more often, the less motion; #24 Keep meaning without motion |
| Typography | #17 Small text needs different shapes; #12 Count what the reader sees |
| Colour | #28 A colour changes with its neighbours |
| Density | #31 Density is not just padding; #43 Split pane |
| Keyboard and focus | #4 Focus is not selection; #25 Tree view; #20 A role is a keyboard promise; #14 Feedback without stealing focus; #29 See the input path |
| Undo, errors and copy | #1 Undo instead of asking; #30 Errors need a next step; #27 Words can invert a state; #37 A disabled action needs an explanation |
| Mobile and input | #9 Drawer / Sheet; #23 Input is not screen size; #21 Compare in one viewport |
| Perceived performance | How waiting feels 已计划且 live；不重提。Animation interruption 讨论输入响应，Avatar 讨论单个身份槽生命周期。 |

Principle group still missing：更强的原始感知实验、跨语言可读性、复杂 undo transaction、协作冲突、离线状态。Colour 条目 primary evidence 未闭合；菜单模型只读到作者库 abstract。这些限制会影响发布前的证据强度，不应被高分掩盖。

### Site audit and opportunities

以下是可行动的只读审查。Live 测试使用 `pnpm shoot --base https://ui-playbook.suspense.site`；移动 viewport 是 390×844 CSS px，Chrome 截图及 DOM 测量。局部源码仅用于确认实现范围，未改变它。

| Before | After | Why |
| --- | --- | --- |
| 首页已有搜索；lost focus 无结果，focus ring 找到 Button；Clear 恢复 26 条并把焦点放回搜索框 | 扩展症状词和 detail-level results | 保留已工作的搜索，补用户词汇与页面术语的距离 |
| 390px 页面无横向溢出；Hover forgives 第一对图纵向分开，无法同屏完整比较 | 可选同舞台 Before / After 切换，保留状态 | 改善比较，不把 responsive 误称为坏了 |
| 本地 Entry pager 按注册顺序；正文已有部分应用链接 | 少量语义相关链接和可选 loop index | 相邻页并不总解释同一个问题 |
| 已有 theme / slow-motion 控件，未见通用 focus trace 或 fixture presets | 添两种按需工具 | 解释截图看不见的输入过程，覆盖真实内容条件 |
| 本地未找到专用 print 样式；尚未实测打印分页 | 先验证一个静态对照的 print / cheat-sheet 输出 | 交互的关键变化要转换成可读关键帧，不能先宣布全站打印故障 |

Site group still missing：尚无读者访谈、搜索日志或使用统计，无法声称哪项最影响留存；未完成全站打印、所有窄屏、真实触摸 / screen reader 审计。8 个 site 候选是待验证改进，不是 8 个已证实缺陷。

## Ranked backlog

字段顺序固定。Primary sources 中的标签按本次读取结果标注；secondary only 不升级为 primary。所有组件都写明一至两个值得独立成页的交互细节；额外 states / anatomy 在页面计划里补，不让它们污染单变量 demo。

### Undo instead of asking

Rank: 1 · ID: undo

- **Kind:** principle
- **Working title:** Undo instead of asking
- **The mechanism:** 重复确认会训练人跳过警告；可逆操作把恢复放在犯错之后，才与 slip 的发生时机对齐。Raskin 的原文是设计论证与历史案例，不是确认框失败率实验。
- **The Before:** no named product。反复点确认仍删错一项、之后没有恢复入口；依据 Raskin 的警告习惯化论证。未把其 2007 年产品截图当作当前事实。
- **Demo idea:** 文件列表里连续 Archive；只变更恢复策略：确认后执行 / 执行后可撤回。误操作发生时，保留位置和内容的恢复直接可见。New reusable tool: no；复用 Toast，但需实际恢复数据。
- **Primary sources:** [Aza Raskin, Never Use a Warning When You Mean Undo (2007)](https://alistapart.com/article/neveruseawarning/) — **verified**
- **Reference product:** 原文中的历史 Gmail 用 Undo / Trash 提供恢复；当前产品未复测。
- **Scores (1–5):** depth 5; felt 5; coverage 5; effort 4 (inverse cost)
- **Priority:** 44 = 3×5 + 3×5 + 2×5 + 4
- **Coverage / boundary:** recover；补上跨组件的可逆性边界，不重讲 Toast 位置或 Dialog 样式。

**Top-10 page-plan brief.**

- **Before / After:** 同一文件、动作和命中区；Before 每次中断确认但无法撤回；After 归档后有可逆操作记录。初始列表使用容易辨认但相近的文件名，避免用提示语要求读者故意点错。
- **Felt demo:** 一轮自然的批量整理后，Undo 原位恢复，列表不重排。保持动画、文字密度相同；两侧唯一处理变量是错误恢复策略。
- **Acceptance and limits:** 页面计划必须分清可逆归档和不可逆外部动作；不能把 Undo 当成对付款、公开发送等动作的普遍替代。实现时验证键盘撤回、连续操作顺序及有限的历史保留。

### Command menu

Rank: 2 · ID: command

- **Kind:** component
- **Working title:** Command menu
- **The mechanism:** 同一条命令脱离当前对象会变得含糊；命令菜单实际是带上下文的动作入口，不只是一个模糊搜索框。Raycast 把当前项目的主动作与其他动作分层，Linear 的重设计按上下文组织命令。
- **The Before:** no named product。全局动作与当前项目动作混在同一结果中，Enter 的对象不清楚；依据 Raycast 的上下文动作结构和 Linear 的官方设计记录。
- **Demo idea:** 选中一条 issue 后打开命令菜单；只切换动作是否按当前对象分组，查询、排序算法和动画相同。New reusable tool: no。
- **Primary sources:** [Raycast, Action Panel](https://manual.raycast.com/action-panel) — **verified**；[Linear command-menu redesign (2019)](https://linear.app/changelog/2019-12-18-new-command-menu) — **verified**
- **Reference product:** Raycast Action Panel 显示当前项目可执行的动作和快捷键；Linear 2019 年记录可供结构参考，不是当前截图复刻。
- **Scores (1–5):** depth 5; felt 5; coverage 5; effort 3 (inverse cost)
- **Priority:** 43 = 3×5 + 3×5 + 2×5 + 3
- **Coverage / boundary:** act / learn；既有 Menu 管触发与选项，Combobox 管选值；本页管命令对象和作用域。

**Top-10 page-plan brief.**

- **Before / After:** 场景是小型 issue 列表，当前 issue 标题一直可见。Before 把 Change status、Create issue 等动作平铺；After 保留同一集合，按当前 issue / workspace 分组。
- **Felt demo:** 展开菜单后，读者应直接知道动作落在哪个对象上。不要同时添加 fuzzy match、预览窗与新快捷键，把收益误归给分组。空查询状态也要成立。
- **Acceptance and limits:** 第二个独立 detail 可做快捷键在右侧的渐进学习；先验证 Enter、Escape、返回子菜单、焦点恢复，再决定是否值得另一组 Compare。

### The target is the whole thing

Rank: 3 · ID: target

- **Kind:** principle
- **Working title:** The target is the whole thing
- **The mechanism:** Fitts’s law 关心可命中的范围和移动距离；视觉上像同一行的对象，若只有小图标可点，最后的精确瞄准仍然昂贵。隐藏放大命中区也未必改变用户对目标大小的预期。
- **The Before:** no named product。设置行看起来整体可点，实际上只响应小 checkbox；依据 NN/g 对 hit area 与 perceived target 的区分。
- **Demo idea:** 同一组选项、同一行高；只改变可点击范围。点击标签和空白处立即暴露差异。New reusable tool: yes，hit-area overlay；默认关闭，诊断时显示真实区域。
- **Primary sources:** [NN/g, Fitts’s Law](https://www.nngroup.com/articles/fitts-law/) — **verified**
- **Reference product:** Apple HIG 的输入组件是参考族；具体命中行为仍需页面实现时实测，不能仅凭外观断言。
- **Scores (1–5):** depth 5; felt 5; coverage 4; effort 4 (inverse cost)
- **Priority:** 42 = 3×5 + 3×5 + 2×4 + 4
- **Coverage / boundary:** act；从 Checkbox / Slider 已有细节上升到可见范围、距离和输入设备的机制。

**Top-10 page-plan brief.**

- **Before / After:** Before 与 After 的像素布局完全相同，前者只有方框可点，后者标签整行属于同一控件。不能通过同时增大字体或行距制造优势。
- **Felt demo:** 使用有明确开关含义的设置列表，读者自然点标签。overlay 显示视觉边界与交互边界，不把一次点击数当作 Fitts 实验结论。
- **Acceptance and limits:** 桌面屏幕边缘能挡住鼠标，与触屏边缘不是同一条件；页面需讲这个反例。嵌套链接不能被整行命中区吞掉。

### Focus is not selection

Rank: 4 · ID: focus

- **Kind:** principle
- **Working title:** Focus is not selection
- **The mechanism:** 焦点是接收下一次键盘输入的位置，选择是持续的对象状态；二者可能同时出现在不同项目上。只用一种高亮会让批量操作的对象变得不确定。
- **The Before:** no named product。列表把移动焦点画得像已选中，离开列表后又丢掉选中提示；依据 W3C APG 对 dual focus 的说明。
- **Demo idea:** 可多选的文件列表；状态逻辑一致，只变焦点与选择的视觉编码。移动焦点时已选文件仍可辨认。New reusable tool: no；可后续接入 See the input path。
- **Primary sources:** [W3C APG, Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) — **verified**；[Linear, Select issues](https://linear.app/docs/select-issues) — **verified**
- **Reference product:** Linear 文档区分 highlight 与 select，方向键移动、X 选择、Escape 清空；这是文档规定，未登录实测。
- **Scores (1–5):** depth 5; felt 4; coverage 5; effort 4 (inverse cost)
- **Priority:** 41 = 3×5 + 3×4 + 2×5 + 4
- **Coverage / boundary:** act / feedback；补齐跨 Tree、Table、Command menu 的状态模型，不重做焦点环颜色教程。

**Top-10 page-plan brief.**

- **Before / After:** 两侧同样支持方向键、Space 和多选。Before 两种状态共用背景；After 焦点用边框、选择用填充。其他间距和颜色总量保持一致。
- **Felt demo:** 列表内预置一项选中，首个 Tab 落到另一项；立即看见两个状态，而不是放一段键盘操作说明。正常控件标签说明动作，图例只作为后读说明。
- **Acceptance and limits:** 需用真实键盘和辅助技术验证，DOM focus 跟踪只能协助诊断。单选中 selection follows focus 有时合理，远程加载的 tabs 则需单独评估。

### Date picker

Rank: 5 · ID: date

- **Kind:** component
- **Working title:** Date picker
- **The mechanism:** 近日期是空间选择问题，远日期或记住的日期是直接输入问题。把两者都强迫变成逐月翻页，会把一个值变成漫长的导航过程。
- **The Before:** no named product。出生日期只能从当前月份逐月回退；依据 NN/g Date-Input 的近日期 / 远日期任务区分。
- **Demo idea:** 预约表单中的 Birthday；只改变日期输入路径：calendar-only / 可输入且有 calendar。相同日期、格式提示和验证规则。New reusable tool: no。
- **Primary sources:** [NN/g, Date-Input Form Fields (2017)](https://www.nngroup.com/articles/date-input/) — **verified**；[Apple HIG, Selection and input](https://developer.apple.com/design/human-interface-guidelines/selection-and-input) — **verified**
- **Reference product:** Apple HIG 有 Pickers；Material 有 Date pickers；具体 web 实现应先核对本地化和键盘行为。
- **Scores (1–5):** depth 4; felt 5; coverage 5; effort 3 (inverse cost)
- **Priority:** 40 = 3×4 + 3×5 + 2×5 + 3
- **Coverage / boundary:** decide / act；Input 与 Select 没有覆盖日期跨度和日历导航。

**Top-10 page-plan brief.**

- **Before / After:** 表单字段本身给出 Birthday 语境。Before 打开当前月，只能逐月翻；After 同一日历保留，同时允许直接填日期。不是把一个好看的日历换成另一个。
- **Felt demo:** 远年日期的操作成本自然显现；第二个独立场景换成下周预约，展示日历何时更有价值。不能把两种任务的结果混成“永远不用日期选择器”。
- **Acceptance and limits:** 计划应写出 locale、模糊日期拒绝策略、无效日期及屏幕阅读器网格导航。Demo 中日期跨度是固定示例，不发布速度提升百分比。

### Let motion change its mind

Rank: 6 · ID: interrupt

- **Kind:** principle
- **Working title:** Let motion change its mind
- **The mechanism:** Apple 的 fluid interfaces 把 interruption / redirection 视为输入的一部分：动画没结束不应意味着系统停止听人操作。当前轨迹继续响应，比播放完一段预制影片更接近直接操纵。
- **The Before:** no named product。展开动画期间忽略关闭或反向拖动，下一次操作只能排队；依据 Apple WWDC18 的中途反向和重定向演示。
- **Demo idea:** 一个可展开面板；仅改变动画能否从当前值重新定向，时长和终点相同。快速反复点触发器就能感觉是否被拦住。New reusable tool: no；复用慢放。
- **Primary sources:** [Apple WWDC18, Designing Fluid Interfaces, transcript](https://developer.apple.com/videos/play/wwdc2018/803/) — **verified**
- **Reference product:** Apple WWDC18 展示 app launch 中途回 Home / 转 multitasking 的设计目标；不声称所有 Apple 控件都如此。
- **Scores (1–5):** depth 5; felt 5; coverage 4; effort 2 (inverse cost)
- **Priority:** 40 = 3×5 + 3×5 + 2×4 + 2
- **Coverage / boundary:** act / feedback / motion；不同于现有 origin 与 easing 细节，关注第二次输入。

**Top-10 page-plan brief.**

- **Before / After:** Before 锁住正在运行的展开 / 收起；After 从当下位置接受新目标。首轮单击看起来相同，第二次点击才暴露交互模型。
- **Felt demo:** 按钮始终在原位且可达，读者无需追逐控件；自然连续开关即可感到响应差异。慢放只是放大诊断，不让夸张时长承担全部效果。
- **Acceptance and limits:** 验证连点、反向拖动、键盘与 reduced motion。若要讲速度连续性，需明确 spring / transition 的状态，并实测，不能仅以 CSS 属性名称保证流畅。

### Empty state

Rank: 7 · ID: empty

- **Kind:** component
- **Working title:** Empty state
- **The mechanism:** 同样的零条数据可能代表还没创建、筛选过严、没有权限或加载未结束；空白并不能让读者推断原因。空态的价值是暴露可改变的条件，而非补一张插画。
- **The Before:** no named product。筛选出零条结果，却显示第一次使用才适合的 Create 提示；依据 NN/g 对空态语境和行动入口的分析。
- **Demo idea:** 固定一组不匹配的 filters；只换空态内容：泛化文案 / 指出筛选条件并提供清除动作。New reusable tool: no。
- **Primary sources:** [NN/g, Designing Empty States](https://www.nngroup.com/articles/empty-state-interface-design/) — **verified**
- **Reference product:** shadcn/ui 有 Empty 组合；Material 的模式可用于视觉参考，但这里不推断其默认文案。
- **Scores (1–5):** depth 4; felt 4; coverage 5; effort 5 (inverse cost)
- **Priority:** 39 = 3×4 + 3×4 + 2×5 + 5
- **Coverage / boundary:** understand / recover；不重复 How waiting feels 的加载态。

**Top-10 page-plan brief.**

- **Before / After:** 场景保留可见的筛选 chips。Before 用“Nothing here”与 Create；After 表明没有匹配项目并允许清除筛选。数据、筛选和布局高度相同。
- **Felt demo:** 读者直接沿空态动作回到列表；自然发现问题在条件而非数据不存在。第一使用空态另做独立 detail，不同时换插图、排版和按钮样式。
- **Acceptance and limits:** 计划需区分空、错、加载、无权限；不能泄露无权查看的数据。此页只演示已完成查询的 no-results 状态。

### Keep the comparison in sight

Rank: 8 · ID: comparison

- **Kind:** principle
- **Working title:** Keep the comparison in sight
- **The mechanism:** 人可以在外部画面上重新读取差异，却不能可靠地把几组参数精确保存在工作记忆里。把对比信息移出视野，会把比较任务偷偷变成回忆任务。
- **The Before:** no named product。配置器每次只展示一个方案，切换后上个方案的值消失；依据 NN/g 的 working memory / external memory 分析。
- **Demo idea:** 选择两种云存储方案；只改变前一方案是否留在比较区，字段和值相同。New reusable tool: no。
- **Primary sources:** [NN/g, Working Memory and External Memory](https://www.nngroup.com/articles/working-memory-external-memory/) — **verified**
- **Reference product:** 没有已核实的 Apple / Linear / Raycast / Material 对应产品实例；以研究机制为依据。
- **Scores (1–5):** depth 5; felt 4; coverage 4; effort 4 (inverse cost)
- **Priority:** 39 = 3×5 + 3×4 + 2×4 + 4
- **Coverage / boundary:** decide；补全七步循环中的比较，非 Where the eye goes 的显著性。

**Top-10 page-plan brief.**

- **Before / After:** Before 的单一详情面板随选项替换；After 在同一宽度中保留已固定方案。维持相同的参数顺序、字体和强调规则。
- **Felt demo:** 方案存在交叉优势：一个更便宜、另一个备份更久；读者自然要往返检查，不需要“记住这些值”的指令。只记录是否还需回看，不伪造认知容量测量。
- **Acceptance and limits:** 窄屏应保留比较字段，而不是把两整张卡推远。与 Accordion 的多开和移动端 Compare 工具可共享设计，但本页讲外部记忆机制。

### Drawer / Sheet

Rank: 9 · ID: drawer

- **Kind:** component
- **Working title:** Drawer / Sheet
- **The mechanism:** Sheet 的关键是父任务能否继续交互，不是面板从哪边滑出。Material 的 standard / modal 区分，以及 Apple 在不同平台对 sheets 的限制，决定它更像工具还是打断。
- **The Before:** no named product。要边看主画面边调参数，却用遮罩锁住主画面；依据 Material 的 standard / modal 用途和 Apple 对重复操作的 panel 建议。
- **Demo idea:** 地图配路线详情面板；只切换 modality，面板尺寸和起落动画不变。New reusable tool: no。
- **Primary sources:** [Material 3, Bottom sheets guidelines](https://m3.material.io/components/bottom-sheets/guidelines) — **verified**；[Apple HIG, Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) — **verified**
- **Reference product:** Material standard sheet 可与主内容同时使用；modal sheet 暂停背景。Apple 的 sheet 规则随平台不同，不能把 iOS 非模态特例套给 macOS。
- **Scores (1–5):** depth 4; felt 5; coverage 4; effort 3 (inverse cost)
- **Priority:** 38 = 3×4 + 3×5 + 2×4 + 3
- **Coverage / boundary:** act / mobile；超出已有 Dialog 的短暂停顿模式。

**Top-10 page-plan brief.**

- **Before / After:** Before 路线面板挡住地图点击；After 同样面板仍显示，但地图可操作。主画面有自然可点的其他地点，操作意图不靠说明文字制造。
- **Felt demo:** 第二个独立 detail 再研究 detent：拖动和点 grabber 到达相同停靠点。不要把“是否可拖”和“是否模态”放在一对 Compare 中。
- **Acceptance and limits:** 必须核对背景可访问性、scroll ownership、关闭后的焦点及未保存修改。modal 的 focus trap 与 nonmodal 的焦点路径是两套明确模型。

### Preview the destination

Rank: 10 · ID: preview

- **Kind:** principle
- **Working title:** Preview the destination
- **The mechanism:** 拖动时的反馈不只证明“拿起来了”，还可预告释放后的结果。预留插入位置让读者在提交前校正，而不是放下后再撤销。
- **The Before:** no named product。列表拖动只显示浮起的对象，不显示最终插入缝；依据 NN/g 对 grabbed feedback 与结果 preview 的区分。
- **Demo idea:** 可重排播放队列；只变是否显示最终落点，拖动阈值和命中算法一致。New reusable tool: no。
- **Primary sources:** [NN/g, Drag-and-Drop (2020)](https://www.nngroup.com/articles/drag-drop/) — **verified**
- **Reference product:** NN/g 记录了 Trello 的 drop-zone preview，属于 2020 年观察；没有当前产品测试。
- **Scores (1–5):** depth 5; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 37 = 3×5 + 3×4 + 2×4 + 2
- **Coverage / boundary:** act / feedback；区别于 Nothing shifts 的意外布局移动：这里的预览是由操作驱动的解释。

**Top-10 page-plan brief.**

- **Before / After:** Before 松手后列表才改变；After 移动过程中出现占位缝。相同条目、拖动影像和最终位置，只有 destination preview 不同。
- **Felt demo:** 队列项目有清晰顺序，读者看到手柄会自然重排。不得改变磁吸范围来偷偷提高命中；移动动画可以复用 slow motion 检查。
- **Acceptance and limits:** 必须提供按钮或键盘重排路径，不能要求拖拽才能完成任务。论文式结论需要实验，此处只是有来源的机制和待实现的示范。

### The more often, the less motion

Rank: 11 · ID: frequency

- **Kind:** principle
- **Working title:** The more often, the less motion
- **The mechanism:** 同一动画在初见时传达关系，在高频工作中却会反复征收等待成本。Kowalski 把键盘操作和常用动作视为应减少甚至取消动画的场景；这是实践经验，不是固定毫秒阈值。
- **The Before:** no named product。每次键盘切换搜索结果都播放完整过渡；依据作者对高频交互的分析，不能把其假设的 Raycast 延迟写成真实问题。
- **Demo idea:** 有连续结果的快速打开器；只切换键盘结果更新的过渡时长，指针交互不变。New reusable tool: no。
- **Primary sources:** [Emil Kowalski, Great Animations](https://emilkowal.ski/ui/great-animations) — **verified**
- **Reference product:** Raycast 仅作命令入口语境；作者的延迟示例是假设。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 4 (inverse cost)
- **Priority:** 36 = 3×4 + 3×4 + 2×4 + 4
- **Coverage / boundary:** act / motion；评估 digest 旧候选，保留为跨组件原则。

### Count what the reader sees

Rank: 12 · ID: graphemes

- **Kind:** principle
- **Working title:** Count what the reader sees
- **The mechanism:** 程序中的 code unit、Unicode code point 和用户感知的字符不是同一单位；一个可见字形可能由多个码点构成。计数和截断若用错单位，会让“还剩几个字”违背眼前的内容。
- **The Before:** no named product。姓名字段把组合字符或 emoji 按 code units 计数，甚至截断组合；依据 Unicode grapheme boundary 规范。
- **Demo idea:** 同一有字符限额的短签名，只换计数单位；初始内容含组合字符，编辑时计数差异直接出现。New reusable tool: yes，可复用 text segmentation inspector；默认只显示读者熟悉的计数。
- **Primary sources:** [Unicode UAX #29, Text Segmentation](https://www.unicode.org/reports/tr29/) — **verified**；[GOV.UK Design System, Character count](https://design-system.service.gov.uk/components/character-count/) — **verified**
- **Reference product:** GOV.UK Character count 提供计数反馈参考；不指认它当前存在 emoji 缺陷。
- **Scores (1–5):** depth 5; felt 4; coverage 4; effort 1 (inverse cost)
- **Priority:** 36 = 3×5 + 3×4 + 2×4 + 1
- **Coverage / boundary:** understand / typography / copy；UAX #29 的默认 grapheme cluster 是近似单位，仍有语言和产品策略差异。

### Press is not commit

Rank: 13 · ID: press

- **Kind:** principle
- **Working title:** Press is not commit
- **The mechanism:** 按下可以立即反馈，但提交推迟到释放时，用户才有移出目标取消的机会。响应速度与取消空间不是互斥条件。
- **The Before:** no named product。pointerdown 就归档，手指划开仍已提交；W3C Pointer Cancellation 给出了释放触发与撤回的边界。
- **Demo idea:** 归档按钮只改变 commit event；同一 pressed 反馈，按下后移出自然暴露能否取消。New reusable tool: no。
- **Primary sources:** [W3C, Understanding Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) — **verified**
- **Reference product:** 规范是直接依据；不宣称某一参考产品的所有按钮实现。
- **Scores (1–5):** depth 4; felt 5; coverage 4; effort 1 (inverse cost)
- **Priority:** 36 = 3×4 + 3×5 + 2×4 + 1
- **Coverage / boundary:** act / recover；独立于 Undo：这里讨论提交之前。

### Feedback without stealing focus

Rank: 14 · ID: status

- **Kind:** principle
- **Working title:** Feedback without stealing focus
- **The mechanism:** 状态更新不必把焦点移过去才能被获知；否则用户的下一次输入会落在意料之外的位置。W3C 区分 status message 与新交互上下文，结果数量可被宣布而不接管任务。
- **The Before:** no named product。搜索每返回一批结果就把焦点移到计数，正在输入的查询被打断；依据 W3C Status Messages。
- **Demo idea:** 同一即时筛选，只改变结果更新是否抢焦点；继续键入时是否断流可直接感受。New reusable tool: no；screen reader 输出必须实听，不能用日志冒充。
- **Primary sources:** [W3C, Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — **verified**
- **Reference product:** W3C 是直接依据；四产品未做当前 screen reader 审计。
- **Scores (1–5):** depth 4; felt 4; coverage 5; effort 1 (inverse cost)
- **Priority:** 35 = 3×4 + 3×4 + 2×5 + 1
- **Coverage / boundary:** feedback / focus；不重讲视觉显著性或 Toast 布局，注意不要每次输入都过度播报。

### Motion has a source

Rank: 15 · ID: origin

- **Kind:** principle
- **Working title:** Motion has a source
- **The mechanism:** 对象离开和回来的路径会塑造同一个空间模型；不对称路径让读者重新推断它去了哪里。Apple 将其描述为 spatial consistency，而不是每个浮层都加放大动画。
- **The Before:** no named product。详情从右进入却向下消失，返回时又从左出现；依据 Apple WWDC18 的空间一致性说明。
- **Demo idea:** 邮件列表与详情；仅改变返回路径是否逆转进入路径，速度、距离和内容相同。New reusable tool: no，复用 slow motion / first-frame outline。
- **Primary sources:** [Apple WWDC18, Designing Fluid Interfaces, transcript](https://developer.apple.com/videos/play/wwdc2018/803/) — **verified**
- **Reference product:** Apple WWDC18 用 iOS 导航的对称路径解释空间一致性。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 3 (inverse cost)
- **Priority:** 35 = 3×4 + 3×4 + 2×4 + 3
- **Coverage / boundary:** understand / motion；不重复 Popover 已有 transform-origin 单点细节。

### One-time code

Rank: 16 · ID: otp

- **Kind:** component
- **Working title:** One-time code
- **The mechanism:** 视觉上多个格子，用户收到的却是一整段可粘贴代码；逐格输入模型不该阻碍整段编辑。空白处理与完整值事件应由一个值模型负责。
- **The Before:** no named product。粘贴完整验证码只填第一格；Base UI 的 OTP Field 明确定义 paste、完整值和 normalization 路径。
- **Demo idea:** 模拟短信卡片带 Copy code，输入区同样分格；只变 paste 是否分发到整个代码值。New reusable tool: no。
- **Primary sources:** [Base UI, OTP Field](https://base-ui.com/react/components/otp-field) — **verified**
- **Reference product:** Base UI 有 OTP Field，shadcn/ui 有 Input OTP；需浏览器验证 autofill，不能凭库名担保。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 3 (inverse cost)
- **Priority:** 35 = 3×4 + 3×4 + 2×4 + 3
- **Coverage / boundary:** act；自然复制粘贴暴露差异，不在页面要求读者键入指定字符。

### Small text needs different shapes

Rank: 17 · ID: type

- **Kind:** principle
- **Working title:** Small text needs different shapes
- **The mechanism:** Optical sizing 不只是缩小相同轮廓；Sitka 研究发现，为大字号设计的形状也未必在大字号更易认读，可能主要服务优雅感。字母辨认优势更不能自动换算成阅读速度优势。
- **The Before:** no named product。把 display 字形缩到紧凑表格里，假设只要字号相同就同样易读；依据 Sitka 研究的 size-specific comparison。
- **Demo idea:** 同一串相似字符、同一字号和容器，只变 optical master；正常读短编号即可察觉字形差别。New reusable tool: no。
- **Primary sources:** [Larson and Carter, Sitka: a collaboration between type design and science (2015), PDF](https://www.microsoft.com/en-us/research/uploads/prod/2021/06/Larson-Carter-2015-Sitka.pdf) — **verified**
- **Reference product:** Microsoft 的字体研究是直接参考；未核实的 Apple 字体行为不加入。
- **Scores (1–5):** depth 5; felt 4; coverage 3; effort 2 (inverse cost)
- **Priority:** 35 = 3×5 + 3×4 + 2×3 + 2
- **Coverage / boundary:** see / typography；需要可合法使用且有 optical axis 的字体。论文未得到可靠 reading-speed 改善，页面必须保留负结果。

### File upload

Rank: 18 · ID: upload

- **Kind:** component
- **Working title:** File upload
- **The mechanism:** 拖拽区的视觉面积很大，却可能把唯一可用的普通文件选择入口藏起来。文件上传首先是选择输入方式的问题，随后才是传输状态。
- **The Before:** no named product。上传区只接收 drop，键盘用户找不到选择文件的动作；GOV.UK 的组件把选择文件保留为明确路径。
- **Demo idea:** 同一附件区只切换是否有可聚焦的 Choose file 路径；键盘 Tab 到空白区或真实入口的差异直接可见。New reusable tool: no。
- **Primary sources:** [GOV.UK Design System, File upload](https://design-system.service.gov.uk/components/file-upload/) — **verified**
- **Reference product:** GOV.UK 是已核实参考；未核实四个指定产品的上传实现。
- **Scores (1–5):** depth 3; felt 4; coverage 5; effort 3 (inverse cost)
- **Priority:** 34 = 3×3 + 3×4 + 2×5 + 3
- **Coverage / boundary:** act；页面另列选择 / 上传 / 服务端接受的状态合同，但不在一组 demo 同时改变它们。

### Search by symptom

Rank: 19 · ID: search

- **Kind:** site
- **Working title:** Search by symptom
- **The mechanism:** 知道问题的人未必知道组件名；检索词与知识标题之间存在 vocabulary gap。把症状连接到具体 detail，才能让已有搜索替读者翻译问题。
- **The Before:** UI Playbook：首页 live 搜索 lost focus 无结果，而 focus ring 命中 Button；本地 Home.astro 仅在标题、摘要与 keywords 拼接串中匹配。来源为本次 browser audit。
- **Demo idea:** 只改变索引与结果定位粒度，保留搜索外观；相同症状词从零结果到有关 detail。New reusable tool: no；这是现有搜索的扩展。
- **Primary sources:** [UI Playbook home, live browser audit 2026-10-25](https://ui-playbook.suspense.site/) — **verified**；[NN/g, Information Scent](https://www.nngroup.com/articles/information-scent/) — **verified**
- **Reference product:** Linear Search 文档区分 workspace 与 view 范围，可参考明确的检索边界。
- **Scores (1–5):** depth 3; felt 4; coverage 5; effort 3 (inverse cost)
- **Priority:** 34 = 3×3 + 3×4 + 2×5 + 3
- **Coverage / boundary:** site / discover；先用有限症状词与 detail anchors 验证，不引入外部模型或未经测量的智能搜索。

### A role is a keyboard promise

Rank: 20 · ID: role

- **Kind:** principle
- **Working title:** A role is a keyboard promise
- **The mechanism:** ARIA role 告诉辅助技术这是什么，却不会替作者生成它该有的交互。一个看似正确的 role=button 可以在键盘上仍是死的。
- **The Before:** no named product。把 div 标成 button，只有 click handler；依据 APG “role is a promise”的说明。
- **Demo idea:** 两张相同的操作卡片，只变键盘行为是否兑现角色；Tab 后按 Enter 的结果直接可见。New reusable tool: no；可接 input path 工具。
- **Primary sources:** [W3C APG, Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — **verified**
- **Reference product:** W3C APG 是行为合同而非即用即合规保证；页面需实际 AT 测试。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 34 = 3×4 + 3×4 + 2×4 + 2
- **Coverage / boundary:** act / keyboard；不把所有可点击区域都变成 button，链接仍需导航语义。

### Compare in one viewport

Rank: 21 · ID: mobile

- **Kind:** site
- **Working title:** Compare in one viewport
- **The mechanism:** 同一对画面离得足够远，就会从视觉比较变成记忆比较。移动端可用固定大小舞台在 Before / After 间切换，保留对象位置和输入状态。
- **The Before:** UI Playbook：390×844 live Hover forgives 的首对 figure 顶部约为 530 / 968 CSS px，均高 356 px；本次样本不能同时完整放进一屏。没有横向溢出。
- **Demo idea:** 只改变对照展示方式：纵向分离 / 同舞台切换；内容、状态、输入及大小不变。New reusable tool: yes，mobile Compare mode；桌面模式保留。
- **Primary sources:** [UI Playbook, Hover forgives, live browser audit 2026-10-25](https://ui-playbook.suspense.site/principles/hover-forgives) — **verified**；[NN/g, Working Memory and External Memory](https://www.nngroup.com/articles/working-memory-external-memory/) — **verified**
- **Reference product:** 没有声称任何参考产品采用相同工具；这是基于外部记忆机制的站点方案。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 34 = 3×4 + 3×4 + 2×4 + 2
- **Coverage / boundary:** site / mobile；测量仅为本次样本，不能当所有页面都有此数值。切换不可重置 demo 或偷走焦点。

### Defaults make a recommendation

Rank: 22 · ID: defaults

- **Kind:** principle
- **Working title:** Defaults make a recommendation
- **The mechanism:** Default 不只是省一次点击，也可能被解读成系统建议，并改变人对现状的判断。Johnson / Goldstein 分析了推荐、切换成本等解释，不能把跨国相关性全当默认项的因果效应。
- **The Before:** no named product。通知设置悄悄预选最打扰的模式，却把未修改当明确偏好；来源为 Science 的 default 研究，产品应用是推论。
- **Demo idea:** 同一通知表单，只改变初始选择；读者提交前看到选中的含义。New reusable tool: no；这是反思型 demo，不能测出论文效应，felt 因此较低。
- **Primary sources:** [Johnson and Goldstein, Do Defaults Save Lives? Science (2003), author PDF](https://www.dangoldstein.com/papers/DefaultsScience.pdf) — **verified**
- **Reference product:** 无已核实的四产品直接案例；不将公共政策研究推广成转化优化处方。
- **Scores (1–5):** depth 5; felt 3; coverage 4; effort 2 (inverse cost)
- **Priority:** 34 = 3×5 + 3×3 + 2×4 + 2
- **Coverage / boundary:** decide；补默认值机制。保留明确选择与可撤销设置，不做欺骗性默认。

### Input is not screen size

Rank: 23 · ID: input

- **Kind:** principle
- **Working title:** Input is not screen size
- **The mechanism:** 宽屏也可能触摸，窄屏也可能接鼠标；pointer / hover 反映输入能力而非视口尺寸。any-hover 为真还不能证明所有输入都能 hover，也不能检测键盘。
- **The Before:** no named product。桌面宽度才提供 hover-only 动作，触摸笔记本因此没有可见入口；依据 CSS Media Queries 的多输入设备说明。
- **Demo idea:** 固定宽度的列表，只切换动作是否必须 hover 才能访问；在触摸仿真下轻触即可暴露缺口。New reusable tool: no；真实混合设备仍需验收。
- **Primary sources:** [W3C, Media Queries Level 4, interaction media features](https://www.w3.org/TR/mediaqueries-4/) — **verified**
- **Reference product:** W3C MQ4 为能力模型来源；不能从一个浏览器返回值断言用户只用某种输入。
- **Scores (1–5):** depth 5; felt 3; coverage 4; effort 2 (inverse cost)
- **Priority:** 34 = 3×5 + 3×3 + 2×4 + 2
- **Coverage / boundary:** act / mobile；Hover forgives 已讲菜单路径，本页限定能力检测与混合输入。

### Keep meaning without motion

Rank: 24 · ID: reduced

- **Kind:** principle
- **Working title:** Keep meaning without motion
- **The mechanism:** 减少位移不必删除变化的含义；反馈可以保留而不把整片视野推走。W3C 对非必要 interaction animation 的指导要求用户能关闭，不代表一切动画都要同样处理。
- **The Before:** no named product。reduced motion 时直接删除状态反馈，用户不知道卡片已展开；依据 W3C 的 essential / nonessential 区分，替代编码是本选题推论。
- **Demo idea:** 在已开启 reduced motion 的同一场景中，只变状态提示是否保留静态层级与标签；New reusable tool: no。
- **Primary sources:** [W3C, Understanding Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) — **verified**
- **Reference product:** W3C 对应 AAA criterion；不可写成所有动画均违反 AA。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 34 = 3×4 + 3×4 + 2×4 + 2
- **Coverage / boundary:** feedback / accessibility / motion；与高频减动画分别回答偏好与任务频率。

### Tree view

Rank: 25 · ID: tree

- **Kind:** component
- **Working title:** Tree view
- **The mechanism:** Tree 的横向键负责层级，纵向键负责可见项目；展开、焦点和选择不是同一动作。把普通列表键盘行为直接套上树会丢掉层级方向感。
- **The Before:** no named product。左右键只移动文本光标或无效，折叠节点后焦点落到隐藏子项；依据 W3C APG Tree View 模式。
- **Demo idea:** 文件树只变左右键的层级导航策略；选中状态和展开动画固定。New reusable tool: no。
- **Primary sources:** [W3C APG, Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) — **verified**
- **Reference product:** W3C APG 为参考合同；没有核实的 Apple / Linear / Raycast / Material 当前 tree 行为。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 34 = 3×4 + 3×4 + 2×4 + 2
- **Coverage / boundary:** act / keyboard；与 Focus is not selection 相互引用，避免重复讲视觉高亮。

### Accordion

Rank: 26 · ID: accordion

- **Kind:** component
- **Working title:** Accordion
- **The mechanism:** 折叠省下的是屏幕空间，可能增加的是反复找内容和记忆的成本。只有一项可开的设置尤其会破坏跨段比较。
- **The Before:** no named product。每打开一段说明就强制关掉前一段；NN/g 的 desktop accordion 研究含这种比较受阻的观察。
- **Demo idea:** 两段退款条件；只改变是否 exclusive-open，文案与动画一致。New reusable tool: no。
- **Primary sources:** [NN/g, Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/) — **verified**
- **Reference product:** Base UI、Radix 和 shadcn/ui 都有 Accordion；库提供能力不代表每个内容适合折叠。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 4 (inverse cost)
- **Priority:** 34 = 3×4 + 3×4 + 2×3 + 4
- **Coverage / boundary:** decide；一页讲多开策略与内容可发现性，不复制 Tabs。

### Words can invert a state

Rank: 27 · ID: copy

- **Kind:** principle
- **Working title:** Words can invert a state
- **The mechanism:** 一个可见的 Off 仍可能难以解释：当设置名是 Hide notifications，读者还得执行一次否定。状态可见不等于状态可理解，这是 gulf of evaluation 的具体表现。
- **The Before:** no named product。负向设置名与 Off 叠加成双重否定；依据 NN/g 2018 年 two gulfs 的实例分析，不宣称当前 Windows 仍如此。
- **Demo idea:** 同一通知设置，只改变标签的语义极性，并保持实际效果对应一致；预览区显示通知结果。New reusable tool: no。
- **Primary sources:** [NN/g, The Two UX Gulfs (2018)](https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/) — **verified**
- **Reference product:** 历史截图只作机制出处；既有 Switch 页可互链，本页不能只是重复“标签不写 On”。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 4 (inverse cost)
- **Priority:** 34 = 3×4 + 3×4 + 2×3 + 4
- **Coverage / boundary:** understand / copy；场景必须验证两种文案在相同实际状态的准确映射。

### A colour changes with its neighbours

Rank: 28 · ID: colour

- **Kind:** principle
- **Working title:** A colour changes with its neighbours
- **The mechanism:** 相同的灰值放在不同视觉语境中，可能看起来并不相同；lightness constancy 与局部对比共同参与，不能用一个简单滤镜解释所有错觉。界面 token 的数值相等不保证感知相等。
- **The Before:** no named product。只比较孤立 swatch 就宣称两个界面状态等亮；依据 Illusions Index 对 checker-shadow 的解释。MIT 原始页面未能打开。
- **Demo idea:** 两个完全相同的灰色按钮，只改变周围背景；连接两块色片时恒定数值可见。New reusable tool: no。
- **Primary sources:** [The Illusions Index, Adelson’s Checker-Shadow Illusion](https://www.illusionsindex.org/i/adelson-s-checker-shadow-illusion) — **secondary only**
- **Reference product:** 没有已核实的四产品对应实现。用自绘的简单 surround 演示，不擅自复制原始图。
- **Scores (1–5):** depth 5; felt 4; coverage 2; effort 3 (inverse cost)
- **Priority:** 34 = 3×5 + 3×4 + 2×2 + 3
- **Coverage / boundary:** see / colour；provisional：secondary only。发布前补 primary evidence，并实测界面版效果，不能把论文错觉直接等同任意深色模式。

### See the input path

Rank: 29 · ID: trace

- **Kind:** site
- **Working title:** See the input path
- **The mechanism:** 最后一张截图看不见焦点是怎样丢的；事件先后和当前输入接收者才解释中断。一个可选的焦点轨迹能让键盘问题可检查，同时保留真实交互。
- **The Before:** no named product。只看到“最后没反应”，无法区分事件没触发还是焦点已移走；来源是 APG 对焦点持久性和删除 / 关闭后焦点管理的要求。
- **Demo idea:** 同一 dialog 关闭场景只变诊断 overlay 的可见性；New reusable tool: yes，focus path + bounded event trace，记录控件名称而非输入值。
- **Primary sources:** [W3C APG, Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) — **verified**；[W3C APG, Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — **verified**
- **Reference product:** 没有核实的四产品同类工具；不冒充 screen reader 模拟器。
- **Scores (1–5):** depth 4; felt 3; coverage 5; effort 2 (inverse cost)
- **Priority:** 33 = 3×4 + 3×3 + 2×5 + 2
- **Coverage / boundary:** site / keyboard tooling；与现有 slow motion、safe triangle 互补，需用真实键盘确认事件顺序。

### Errors need a next step

Rank: 30 · ID: errors

- **Kind:** principle
- **Working title:** Errors need a next step
- **The mechanism:** “知道失败了”和“知道如何继续”是不同任务；错误信息如果只给结果，仍把诊断工作留给用户。把可改变的条件说清楚，才能形成恢复路径。
- **The Before:** no named product。搜索失败只显示玩笑或代码，不说哪些条件能改；NN/g Error Message Guidelines 记录了这类消息。
- **Demo idea:** 同一失败查询、同一按钮，只换消息的可行动内容。New reusable tool: no。
- **Primary sources:** [NN/g, Error Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — **verified**
- **Reference product:** NN/g 是依据；没有当前四产品的负面案例。
- **Scores (1–5):** depth 3; felt 4; coverage 4; effort 4 (inverse cost)
- **Priority:** 33 = 3×3 + 3×4 + 2×4 + 4
- **Coverage / boundary:** recover / copy；Error timing 已讲何时反馈，此页只讲失败后怎样继续。

### Density is not just padding

Rank: 31 · ID: density

- **Kind:** principle
- **Working title:** Density is not just padding
- **The mechanism:** 同样数量的数据可以被更多边框、背景和容器切碎；界面密度的感受不只由行距决定。Linear 的重设计把视觉噪声、层级和 chrome 当作结构问题处理。
- **The Before:** no named product。紧凑列表每一格都有边框与底色，即使行距不小仍难扫读；依据 Linear 自述的降噪设计目标，效果是待验证推论。
- **Demo idea:** 同一 issue 列表固定行高和字号，只改变分隔线的重复程度；New reusable tool: no，复用 squint blur 观察主次。
- **Primary sources:** [Linear, How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — **verified**
- **Reference product:** Linear 官方重设计记录，非量化可用性实验。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 3 (inverse cost)
- **Priority:** 33 = 3×4 + 3×4 + 2×3 + 3
- **Coverage / boundary:** see / density；只保留结构密度这个缺口，不重复 Where the eye goes 的单一重点。

### Make the mode visible

Rank: 32 · ID: mode

- **Kind:** principle
- **Working title:** Make the mode visible
- **The mechanism:** Mode error 发生在同样输入因隐藏状态而做了另一件事；用户记住了动作，却未意识到系统换了语境。持续的模式线索把状态重新放到操作点上。
- **The Before:** no named product。画布的 Hand 模式关闭面板后仍激活，拖动不再移动对象；依据 NN/g 的 mode / mode error 分析。
- **Demo idea:** 画布已有 Pan / Select，行为完全相同；只改变当前模式是否在指针旁持续显示。New reusable tool: no。
- **Primary sources:** [NN/g, Modes](https://www.nngroup.com/articles/modes/) — **verified**
- **Reference product:** NN/g 用编辑器和绘图工具解释 modes；不是对当前 Apple / Linear 的审计。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 3 (inverse cost)
- **Priority:** 33 = 3×4 + 3×4 + 2×3 + 3
- **Coverage / boundary:** understand / act；不把“按住键的 quasimode 必然更好”写成未找到原文的结论。

### More choices can be easier

Rank: 33 · ID: choices

- **Kind:** principle
- **Working title:** More choices can be easier
- **The mechanism:** 菜单选择既可能是新手的视觉搜索，也可能是熟练者的已知目标选择；不能把 Hick–Hyman 或工作记忆数字机械变成项目上限。多一层抽象分类可能比长一点的具体列表更难找。
- **The Before:** no named product。为凑少量顶层选项，把具体目的藏进含糊分类；NN/g 反对把记忆容量直接变成菜单条数，菜单模型论文区分 novice / expert。
- **Demo idea:** 同一组目的地，只变信息层级；从具体名称可直接找到目标，抽象分组需要再进入。New reusable tool: no。
- **Primary sources:** [NN/g, Short-Term Memory and Web Usability](https://www.nngroup.com/articles/short-term-memory-and-web-usability/) — **verified**；[Cockburn, Gutwin and Greenberg, A Predictive Model of Menu Performance (2007), repository abstract](https://ir.canterbury.ac.nz/items/fd5ec0a7-03bf-4b08-a1a9-ba211be3d837) — **verified**
- **Reference product:** 无当前四产品比较；论文这里只核实 repository abstract，不引用正文公式或效果量。
- **Scores (1–5):** depth 5; felt 3; coverage 3; effort 3 (inverse cost)
- **Priority:** 33 = 3×5 + 3×3 + 2×3 + 3
- **Coverage / boundary:** decide；覆盖选择复杂度，但不宣传“越多越好”。

### Number field

Rank: 34 · ID: number

- **Kind:** component
- **Working title:** Number field
- **The mechanism:** 数值字段既是可读的本地化字符串，又是可计算的值；格式化与步进不是同一个动作。Base UI 区分输入的 locale、步长，以及 step 是否吸附到网格。
- **The Before:** no named product。把输入当纯数字字符串，逗号小数无法按当前 locale 解释；依据 Base UI 的 locale / format 合同。
- **Demo idea:** 费用字段固定 locale，只变是否按该 locale 解释输入；输入正常的本地小数即显现差异。New reusable tool: no。
- **Primary sources:** [Base UI, Number Field](https://base-ui.com/react/components/number-field) — **verified**
- **Reference product:** Base UI Number Field；不引用浏览器 type=number 的未经测试差异。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 3 (inverse cost)
- **Priority:** 33 = 3×4 + 3×4 + 2×3 + 3
- **Coverage / boundary:** act；Input 之外的解析 / 步进边界。计划需测试暂态文本、边界和 decimal，不做多个同时变化的 demo。

### Pagination

Rank: 35 · ID: pagination

- **Kind:** component
- **Working title:** Pagination
- **The mechanism:** 页码除了限制内容量，还提供可重访的位置和有限集合的边界。无限滚动减少点击，却可能让找回一个项目更困难；收益取决于探索还是定位任务。
- **The Before:** no named product。结果不断追加，返回后无法定位刚看过的一组；依据 NN/g 对 goal-oriented finding 的分析。
- **Demo idea:** 同一静态结果集，只切换是否保留可寻址的页位置；打开项目再返回即感到位置是否还在。New reusable tool: no。
- **Primary sources:** [NN/g, Infinite Scrolling (2014)](https://www.nngroup.com/articles/infinite-scrolling/) — **verified**
- **Reference product:** shadcn/ui 提供 Pagination 组合；位置恢复仍由应用负责。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 3 (inverse cost)
- **Priority:** 33 = 3×4 + 3×4 + 2×3 + 3
- **Coverage / boundary:** decide / recover；非加载速度主题，不把分页宣布为所有列表的赢家。

### Follow the mechanism

Rank: 36 · ID: trails

- **Kind:** site
- **Working title:** Follow the mechanism
- **The mechanism:** 一个组件上的细节可来自多个机制；仅按组件前后翻页会让同一机制散落各处。按问题串联的少量相关链接可以提供更具体的信息线索。
- **The Before:** UI Playbook：Entry.astro 用 entries 数组的相邻项生成 Previous / Next；live Hover forgives 也显示相邻页导航。不是全站完全没有内文互链。
- **Demo idea:** 只改变页尾推荐的关联逻辑，保持链接数量和样式；从一个焦点问题直接进入相关机制。New reusable tool: no。
- **Primary sources:** [UI Playbook, Hover forgives, live browser audit 2026-10-25](https://ui-playbook.suspense.site/principles/hover-forgives) — **verified**；[NN/g, Information Scent](https://www.nngroup.com/articles/information-scent/) — **verified**
- **Reference product:** 不照搬某产品的复杂 sidebar；保留当前组件 / 原则双入口，增加少量语义路径。
- **Scores (1–5):** depth 3; felt 3; coverage 5; effort 4 (inverse cost)
- **Priority:** 32 = 3×3 + 3×3 + 2×5 + 4
- **Coverage / boundary:** site / reading flow；进一步的七步循环索引是同一条目的导航方案，不另计一条。

### A disabled action needs an explanation

Rank: 37 · ID: disabled

- **Kind:** principle
- **Working title:** A disabled action needs an explanation
- **The mechanism:** 禁用控件通常也从键盘焦点路径中消失；如果原因只藏在它的 tooltip，最需要解释的人可能根本到不了那里。可见原因应位于操作旁或其前置条件处。
- **The Before:** no named product。禁用 Save 的唯一说明依赖悬停；Shopify Polaris 明确要求在可见文字中说明原因。
- **Demo idea:** 同一禁用按钮，只变前置条件说明是否可见；New reusable tool: no。
- **Primary sources:** [Shopify Polaris, Button accessibility guidance](https://shopify.dev/docs/api/app-home/latest/web-components/actions/button) — **verified**
- **Reference product:** Shopify Polaris 为已核实官方依据；不重复未经验证的“disabled 还能弹 tooltip”说法。
- **Scores (1–5):** depth 3; felt 4; coverage 4; effort 3 (inverse cost)
- **Priority:** 32 = 3×3 + 3×4 + 2×4 + 3
- **Coverage / boundary:** understand / copy / keyboard；计划应分别核实 native disabled 与 aria-disabled，而不是混为一个保证。

### Filter bar

Rank: 38 · ID: filters

- **Kind:** component
- **Working title:** Filter bar
- **The mechanism:** 筛选后的空列表不是数据本身为空，而是查询条件的结果。把生效条件留在视野内，才能让用户推断自己限制了什么。
- **The Before:** no named product。关闭过滤弹层后活动条件消失，列表只显示零项；依据 Linear 的显式过滤模型和 NN/g 空态分析。
- **Demo idea:** 同一查询与列表，只变活动条件是否持续显示；可从可见条件直接放宽查询。New reusable tool: no。
- **Primary sources:** [Linear, Filters](https://linear.app/docs/filters) — **verified**；[NN/g, Designing Empty States](https://www.nngroup.com/articles/empty-state-interface-design/) — **verified**
- **Reference product:** Linear 文档有属性过滤及高级 AND / OR，并说明部分 view 的过滤可由 URL 保留。
- **Scores (1–5):** depth 4; felt 3; coverage 4; effort 3 (inverse cost)
- **Priority:** 32 = 3×4 + 3×3 + 2×4 + 3
- **Coverage / boundary:** understand / recover；Empty state 管零结果后的动作，此页管零结果之前的查询可见性。

### Teach at the moment of need

Rank: 39 · ID: teach

- **Kind:** principle
- **Working title:** Teach at the moment of need
- **The mechanism:** 提前看懂功能不等于需要时能回忆出来；教学与动作相隔太远，会把理解转换成记忆负担。上下文帮助把线索放在可马上使用的位置。
- **The Before:** no named product。首次打开被迫看完教程，真正要做时入口又藏起来；依据 NN/g 对 onboarding tutorials 的案例。
- **Demo idea:** 同一个裁剪功能与同一句帮助，只变出现时机：初次打开 / 首次进入裁剪。New reusable tool: no。
- **Primary sources:** [NN/g, Onboarding Tutorials](https://www.nngroup.com/articles/onboarding-tutorials/) — **verified**
- **Reference product:** Raycast Action Panel 的动作旁快捷键是相关的渐进学习参考，详见 Command menu；不是相同实验。
- **Scores (1–5):** depth 4; felt 3; coverage 4; effort 3 (inverse cost)
- **Priority:** 32 = 3×4 + 3×3 + 2×4 + 3
- **Coverage / boundary:** learn；只在真实需要解释的功能演示，不能借此给每个 demo 加教程。

### Carousel

Rank: 40 · ID: carousel

- **Kind:** component
- **Working title:** Carousel
- **The mechanism:** 自动前进由机器掌握阅读节奏；移动的内容会让用户在刚定位到信息时失去目标。NN/g 的历史 usability case 展示了这种错位，不证明所有 carousel 都失败。
- **The Before:** no named product。读到一半的促销被下一张替换；依据 NN/g 2013 年 auto-forwarding 的观察，当前产品未复测。
- **Demo idea:** 同一组有实际不同内容的 slides，只改变 autoplay；读者准备点击时内容是否仍在由场景自然暴露。New reusable tool: no。
- **Primary sources:** [NN/g, Auto-Forwarding Carousels (2013)](https://www.nngroup.com/articles/auto-forwarding/) — **verified**
- **Reference product:** Material 有 Carousel；本页不把其存在当作自动轮播的推荐。
- **Scores (1–5):** depth 4; felt 4; coverage 2; effort 4 (inverse cost)
- **Priority:** 32 = 3×4 + 3×4 + 2×2 + 4
- **Coverage / boundary:** see / act；手动控制、焦点不落到隐藏 slide 为边界；避免靠极短间隔造 strawman。

### Trace a claim to its evidence

Rank: 41 · ID: evidence

- **Kind:** site
- **Working title:** Trace a claim to its evidence
- **The mechanism:** 链接可证明“有人写过”，不自动证明当前产品仍这样工作。把每条行为主张连到测试日期、环境和来源范围，能防止历史案例在后续编辑中变成现在时。
- **The Before:** no named product。本任务发现 local planned 的 How waiting feels 已 live，说明文档快照与站点会漂移；这不是页面错误。GOV.UK 要求明确已测试的适用环境。
- **Demo idea:** 只改变来源说明能否追到具体 claim 与验证范围；同一句话可以立即看出是论文、规范还是当前 browser observation。New reusable tool: no，先做编辑用 evidence record。
- **Primary sources:** [UI Playbook, How waiting feels, live browser audit 2026-10-25](https://ui-playbook.suspense.site/principles/how-waiting-feels) — **verified**；[GOV.UK Design System, Contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/) — **verified**
- **Reference product:** GOV.UK contribution criteria 区分有用、独特、可用与适用范围；参考其证据边界，不复制审批流程。
- **Scores (1–5):** depth 3; felt 3; coverage 5; effort 3 (inverse cost)
- **Priority:** 31 = 3×3 + 3×3 + 2×5 + 3
- **Coverage / boundary:** site / trust；公开页只露简短适用条件与来源，运行日志留给作者，避免把工程记录塞进阅读流程。

### Breadcrumbs

Rank: 42 · ID: breadcrumb

- **Kind:** component
- **Working title:** Breadcrumbs
- **The mechanism:** Breadcrumb 表达对象在结构中的位置，不是用户刚走过的历史。通过不同入口到同一项目，祖先关系仍应稳定。
- **The Before:** no named product。把 Search results 放进祖先链，外部直达时又生成不同层级；依据 NN/g 对 hierarchy 与 history 的区分。
- **Demo idea:** 同一资源从搜索或目录进入，只切换 breadcrumb 是否跟随访问历史；自然 Back 与祖先导航产生不同预期。New reusable tool: no。
- **Primary sources:** [NN/g, Breadcrumbs](https://www.nngroup.com/articles/breadcrumbs/) — **verified**
- **Reference product:** shadcn/ui 有 Breadcrumb；UI Playbook 当前层级浅，不因此强加站点面包屑。
- **Scores (1–5):** depth 3; felt 3; coverage 4; effort 5 (inverse cost)
- **Priority:** 31 = 3×3 + 3×3 + 2×4 + 5
- **Coverage / boundary:** understand；补定位机制。移动端截断需单独验证，不能用长链压下标题。

### Split pane

Rank: 43 · ID: split

- **Kind:** component
- **Working title:** Split pane
- **The mechanism:** 分隔线既是两个区域的边界，也是有值的控件。看得见的细线不该意味着只能用精确拖动改变布局。
- **The Before:** no named product。只能拖一条细线，键盘无入口；APG Window Splitter 给出 separator 的可调模型，但该模式仍标为未完成审查。
- **Demo idea:** 文件列表 / 预览窗；只变 divider 是否有键盘 resize 路径，拖动手感相同。New reusable tool: no。
- **Primary sources:** [W3C APG, Window Splitter (incomplete pattern)](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) — **verified**
- **Reference product:** shadcn/ui Resizable 是候选实现；APG 的未完成状态必须保留，不能当已验证组件保证。
- **Scores (1–5):** depth 4; felt 3; coverage 4; effort 2 (inverse cost)
- **Priority:** 31 = 3×4 + 3×3 + 2×4 + 2
- **Coverage / boundary:** act / density；需先做键盘与辅助技术原型，再定页面实现。

### Stress the same scene

Rank: 44 · ID: stress

- **Kind:** site
- **Working title:** Stress the same scene
- **The mechanism:** 演示的默认数据会掩盖布局与交互假设；更真实的内容条件能揭露只对样例成立的规则。Linear 的设计记录明确把环境、外观、层级分别用于 stress tests。
- **The Before:** no named product。只有短英文标签的 demo 很容易隐藏长名称问题；Linear 提供 stress-testing 的设计依据，本站具体损坏尚未逐页验证。
- **Demo idea:** 先只提供 Short labels / Long labels 这一轴，其他内容与行为不变；New reusable tool: yes，shared fixture preset；之后每次只增加一个独立条件。
- **Primary sources:** [Linear, How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — **verified**
- **Reference product:** Linear 的方法是参考，不是声明本站应复制其产品布局。
- **Scores (1–5):** depth 3; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 31 = 3×3 + 3×4 + 2×4 + 2
- **Coverage / boundary:** site / tools；不重新发明已有 slow motion；locale、zoom、reduced motion 后续各自单独验证。

### Password field

Rank: 45 · ID: password

- **Kind:** component
- **Working title:** Password field
- **The mechanism:** 遮蔽保护旁观者视线，也会阻止用户检查自己输入的内容。按需 reveal 把检查权交回用户；重复确认字段并非唯一的防错手段。
- **The Before:** no named product。只能重输一遍密码来检查，不能看见原输入；依据 GOV.UK 的 show / hide 与避免重复确认指导。
- **Demo idea:** 同一密码字段，只切换是否允许 reveal；保持输入、验证与默认遮蔽不变。New reusable tool: no。
- **Primary sources:** [GOV.UK Design System, Password input](https://design-system.service.gov.uk/components/password-input/) — **verified**
- **Reference product:** GOV.UK Password input 是直接参考；真实密码不进入 demo、日志或共享 URL。
- **Scores (1–5):** depth 3; felt 4; coverage 3; effort 4 (inverse cost)
- **Priority:** 31 = 3×3 + 3×4 + 2×3 + 4
- **Coverage / boundary:** act / recover；与普通 Input 的验证时机分开，需覆盖 reveal 按钮名称和键盘焦点。

### Print a useful reference

Rank: 46 · ID: print

- **Kind:** site
- **Working title:** Print a useful reference
- **The mechanism:** 交互解释依赖状态变化，纸面只能留下一个时刻；有用的 print view 应把变化压成关键帧，而不是只隐藏按钮。它还需保留条件和来源，避免清单变成无语境的规则。
- **The Before:** no named product。本地样式检索未发现专用 print 规则，但未实测整个站点的打印分页，不能称当前打印损坏；MDN 提供 print media 的技术边界。
- **Demo idea:** 同一个 Compare 只改变导出表达：当前帧 / 标注差异的前后关键帧；New reusable tool: yes，static demo snapshot + print stylesheet。
- **Primary sources:** [MDN, Printing](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing) — **verified**；[Olah and Carter, Research Debt (2017)](https://distill.pub/2017/research-debt/) — **verified**
- **Reference product:** 无已核实四产品的同类 print 参考；方案由本站教学任务推导。
- **Scores (1–5):** depth 3; felt 3; coverage 4; effort 3 (inverse cost)
- **Priority:** 29 = 3×3 + 3×3 + 2×4 + 3
- **Coverage / boundary:** site / print；先挑一个纯视觉 demo 验证，输出 cheat sheet 仍需附适用条件，不能声称取代交互版。

### Share a demo state

Rank: 47 · ID: share

- **Kind:** site
- **Working title:** Share a demo state
- **The mechanism:** 链接通常只定位页面，不能定位让人理解问题的那组参数。把可复现的公开预设随链接保存，能把“看这页”变成“看这个差异”。
- **The Before:** no named product。本地 Compare / Frame 的 theme、slow 状态保存在 React 内存，未连接 URL；没有据此断言每个 demo 都不能分享。Linear 文档说明可分享部分 view filters，提供对照模型。
- **Demo idea:** 只变分享链接是否携带一个安全的 preset；另一窗口打开后能否看见同一对照自然可见。New reusable tool: yes，bounded preset URL serializer。
- **Primary sources:** [Linear, Filters](https://linear.app/docs/filters) — **verified**
- **Reference product:** Linear 明确限定不是所有 view 的过滤都可由 URL 保存；本站也应逐类声明支持。
- **Scores (1–5):** depth 3; felt 4; coverage 3; effort 2 (inverse cost)
- **Priority:** 29 = 3×3 + 3×4 + 2×3 + 2
- **Coverage / boundary:** site / collaboration；只编码白名单预设，不保存输入的姓名、密码或任意文本。

### Avatar

Rank: 48 · ID: avatar

- **Kind:** component
- **Working title:** Avatar
- **The mechanism:** 图片“已经存在于 DOM”不等于已可展示；fallback 的显示与图像加载生命周期需要协调。Base UI 先加载图像，并允许延迟 fallback，避免短暂 initials 闪现。
- **The Before:** no named product。每次图像载入都先闪 initials，再换头像；来源是 Base UI 的 Image / Fallback 生命周期合同，不是某产品失败率。
- **Demo idea:** 相同固定载入延迟，唯一变量是 fallback 出现策略；反复切换成员时能看到闪现。New reusable tool: no。
- **Primary sources:** [Base UI, Avatar](https://base-ui.com/react/components/avatar) — **verified**
- **Reference product:** Base UI 的 Avatar 是实现参考；延迟不是所有网络条件的通用常数。
- **Scores (1–5):** depth 3; felt 3; coverage 3; effort 4 (inverse cost)
- **Priority:** 28 = 3×3 + 3×3 + 2×3 + 4
- **Coverage / boundary:** see / feedback；仅研究头像身份槽的生命周期；低优先级，若与 planned waiting 重叠则合并到其组件引用，不另发原则。

## Evidence limits and handoff

所有 ranked entry 的引用都在本次打开后使用。技术规范和 API 文档只证明合同，不证明某个实现已达成；NN/g 的案例有年代与样本限制；作者设计文章不是控制实验；拟议 demo 不带虚构统计。没有通过摘要推导效果量，也没有把一次观察外推成普遍比例。

| Source / route | Result | Consequence |
| --- | --- | --- |
| https://web.mit.edu/persci/people/adelson/checkershadow_description.html | **unverified**：本次 timeout / 访问失败 | Colour 只保留 secondary only，并列发布前补证据条件 |
| https://persci.mit.edu/gallery/checkershadow/description | **unverified**：备用地址返回失败 | 未把两个地址的同一原始来源算成两份证据 |
| https://www.nngroup.com/articles/line-length-readability/ | **unverified**：404 | 不引用最佳行长数字；typography 改用已读 Sitka PDF |
| https://www.nngroup.com/articles/disabled-buttons/ | **unverified**：读取失败 | Disabled 条目改用已读 Shopify 官方 guidance |
| https://linear.app/docs/command-menu | **unverified**：读取失败 | 改用已读官方 changelog、Search、Select issues 文档 |
| https://www.raskincenter.org/rchi/core-principles | **unverified**：读取失败 | 不引用 quasimode 的原始论证；模式条目只用已读 NN/g |
| Apple / Material web text fetch | JS shell，单靠抓取不足 | canonical 页面已在 Chrome 打开并读到正文，故目录 / Sheets 来源标 verified |
| Canterbury menu-performance paper | **verified abstract only** | 仅用 novice / expert 模型范围，不引用全文实验或公式 |
| APG Window Splitter | **verified, incomplete pattern** | 保留官方未完成审查说明，先做实现与 AT 验证 |
| UI Playbook waiting page web fetch | 网页工具读取失败，Chrome 成功加载且 hydrate | 以实际 browser observation 确认 live 状态，不把 web tool 失败误判为页面不存在 |

主 Agent 的下一步：按排名挑一个场景，重开其来源与参考产品；写出单一变量和反例；先让真实交互成立，再形成页面文字。前 10 条已有最小场景与验收边界，其余条目也都有可独立计划的 demo。Colour、Split pane、font optical master 的证据 / 实现限制需先解除。对于同机制的 component 与 principle，用互链划清 anatomy 与解释，避免发布重复页。

本次浏览器证据不是所有候选的最终验收：没有登录 Linear / Raycast 工作区，没有测试 native Apple app 的当前行为，也没有把 JS render 的文档当作控件交互测试。来源日期与审计日期分开保留。

## Reproducible acceptance check

为遵守 research-only 与不改 tests 的限制，文档边界回归检查放在本附录。以下 Python 只读本文件；检查字段、来源标签、排序、去重和 top-10 深度，并用 7 个破坏样本确认检查能失败。它不能自动证明来源内容真实，引用仍需人工复核。运行环境：仓库根目录、Python 3。

```python
from pathlib import Path
from collections import Counter
import re

PATH = Path('docs/research/2026-10-25-topic-backlog.md')
FIELDS = ['Kind', 'Working title', 'The mechanism', 'The Before', 'Demo idea',
          'Primary sources', 'Reference product', 'Scores (1–5)', 'Priority',
          'Coverage / boundary']

def validate(text):
    body = text.split('## Ranked backlog\n', 1)[1].split('## Evidence limits', 1)[0]
    chunks = re.findall(r'^### ([^\n]+)\n(.*?)(?=^### |\Z)', body, re.M | re.S)
    assert 40 <= len(chunks) <= 60, 'entry count'
    rows = []
    verified = 0
    for rank, (title, chunk) in enumerate(chunks, 1):
        meta = re.search(r'^Rank: (\d+) · ID: ([a-z]+)$', chunk, re.M)
        assert meta and int(meta[1]) == rank, 'continuous rank'
        fields = dict(re.findall(r'^- \*\*([^\n]+?):\*\* (.+)$', chunk, re.M))
        assert all(key in fields and fields[key].strip() for key in FIELDS), 'required fields'
        assert fields['Working title'] == title, 'title consistency'
        assert fields['Kind'] in {'component', 'principle', 'site'}, 'kind'
        assert 'no named product' in fields['The Before'] or fields['The Before'].startswith('UI Playbook：'), 'Before provenance'
        assert 'New reusable tool:' in fields['Demo idea'], 'tool decision'
        links = re.findall(r'\[[^\]]+\]\(https://[^)]+\) — \*\*(verified|secondary only)\*\*', fields['Primary sources'])
        assert links, 'tagged source'
        assert fields['Primary sources'].count('](https://') == len(links), 'every source tagged'
        verified += 'verified' in links
        score = re.fullmatch(r'depth ([1-5]); felt ([1-5]); coverage ([1-5]); effort ([1-5]) \(inverse cost\)', fields['Scores (1–5)'])
        assert score, 'score range'
        d, f, c, e = map(int, score.groups())
        priority = 3*d + 3*f + 2*c + e
        assert fields['Priority'] == f'{priority} = 3×{d} + 3×{f} + 2×{c} + {e}', 'priority formula'
        assert ('**Top-10 page-plan brief.**' in chunk) == (rank <= 10), 'top ten depth'
        rows.append((priority, c, e, title, fields['Kind'], meta[2]))
    assert len(rows) == 48, 'declared total'
    assert Counter(r[4] for r in rows) == {'component': 16, 'principle': 24, 'site': 8}, 'declared kinds'
    assert len({r[3] for r in rows}) == len({r[5] for r in rows}) == len(rows), 'unique titles / ids'
    assert rows == sorted(rows, key=lambda r: (-r[0], -r[1], -r[2], r[3])), 'ranking order'
    assert verified >= 20, 'verified minimum'
    assert not {'How waiting feels', 'Skeleton', 'Progress'} & {r[3] for r in rows}, 'planned deduplication'
    for n, title in re.findall(r'#(\d+) ([^|;\n]+)', text.split('## Ranked backlog')[0]):
        assert rows[int(n)-1][3] == title.strip(), 'coverage rank reference'
    return len(rows), verified

text = PATH.read_text()
count, verified = validate(text)
print(f'PASS: {count} entries, 47 verified-source entries expected: {verified}')
mutations = {
    'missing backlog': '',
    'missing required field': text.replace('- **The mechanism:**', '- **Omitted mechanism:**', 1),
    'wrong priority': text.replace('44 = 3×5', '43 = 3×5', 1),
    'broken rank': text.replace('Rank: 2 ·', 'Rank: 1 ·', 1),
    'missing verification tag': text.replace(' — **verified**', '', text.count(' — **verified**')),
    'missing top-ten brief': text.replace('**Top-10 page-plan brief.**', '**Brief omitted.**', 1),
    'missing final entry': re.sub(r'^### Avatar\n.*?(?=^## Evidence limits)', '', text, flags=re.M | re.S),
}
for name, mutant in mutations.items():
    try:
        validate(mutant)
    except (AssertionError, IndexError):
        print(f'PASS negative control: {name} rejected')
    else:
        raise AssertionError(f'Negative control accepted: {name}')
print('8 tests passed; 0 failed (1 acceptance + 7 negative controls).')
```
