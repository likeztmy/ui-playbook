# UI Playbook 选题库

Review 2 后保留 **35 个候选：9 component / 19 principle / 7 site**。按明确的删除与合并决定，从原 48 条减去 13 个独立条目；不为凑原先 40–60 的目标补薄题。前 10 条均有单变量 Before / After、自然入口和验收边界，仅补写新进入前十的条目及本次明确修订的场景。

这是 2026-10-25 的定向 evidence review 与局部 browser audit，不是用户实验。评分与 demo 是编辑判断 / 待验证方案。**verified 表示读到该来源对应内容，不表示拟议 demo 已做或当前产品行为已测试。** MIT 原始 finding 已下载并读到正文；其 HTTP 重定向和过期 TLS 证书的读取条件在末尾单列。

## Scope and ranking

- Repo baseline：`src/entries.ts` 是 19 components + 6 principles；线上另有 How waiting feels，已用 Chrome 打开并读到 Details，因此列为本地 planned / live already，不重提。
- Inputs：method digest、good-interface-design、notes 全部 3 份、plans 全部 6 份已读。3 notes / 6 plans 均可映射，unmapped shapes = 0；本次再对 Toast、Dialog、Radio、Checkbox、Switch、Button、Tooltip、Combobox、Menu 的重叠细节去重。
- Scope：Apple HIG、Material 3、Radix / Base UI、shadcn/ui、Linear、Raycast；论文、W3C、Unicode、NN/g 与作者原文。JS-only Apple / Material 正文在 Chrome 读取。Motion 两题共用已核实的 WWDC18，分别限定中途输入与离场路径。
- Scores（1–5）：depth = 意外程度；felt = 无操作说明也能感到差异的潜力；coverage = 缺口；effort = inverse cost（5 最省，1 最贵）。这些是编辑评分，不是测量结果。
- **Priority = 3 × depth + 3 × felt + tool bonus**；新增可复用工具 +2，否则 +0，满分 32。coverage、effort 仅依次用于同分排序，最后按 English title 字母序。复用 squint blur / slow motion 等已有工具不加分。
- 评分复核：Focus 改为预选行 + 点击 Search 的指针入口，depth 4 / felt 4；Press、Role、Tree、Split pane、Status 的 felt 均降为 2。日期选择与 Command 的 felt 取 4。合并后的 external memory 取 depth 4 / felt 4，并计 mobile Compare 新工具；字体 glyph flash 计新工具。Defaults 保持 felt 3；Review 2 的评分理由逐项写在条目内，字体 felt 2、边缘目标 felt 3、Number field depth 3。
- 所有 Before 都标明来源与年代；没有当前行为证据时写 no named product。主 demo 只变一件事，普通控件和内容构成入口，不用“请这样操作”制造差异。实现后必须实测，才能把计划文字写成行为事实。

## Existing and planned

现有 component：Button, Menu, Toolbar, Tooltip, Popover, Dialog, Input, Select, Combobox, Checkbox, Radio, Switch, Tabs, Slider, Segmented control, Card, Badge, Table, Toast。

现有 principle：Concentric radius, Colour means one thing, Where the eye goes, Nothing shifts, Hover forgives, Error timing。已有工具：squint blur、live layout-shift count、slow motion + first-frame outline、safe-triangle overlay。

| Plan file | Status | Backlog treatment |
| --- | --- | --- |
| 2026-10-22-pilot-input-and-errors.md | Implemented in local pages | 不重提 Input / Error timing；保留无指令 demo 的修正 |
| 2026-10-23-rollout.md | Component rollout largely implemented; earlier principle candidates were not full page plans | 不重提组件改版；Undo 归已覆盖；Target、Motion source、Frequency 保留并划清边界 |
| 2026-10-23-where-the-eye-goes-v2.md | Implemented | 不重提 attention 主场景或 squint tool |
| 2026-10-23-nothing-shifts.md | Implemented | 不重提 CLS、anchoring、font shift 或 counter |
| 2026-10-23-chinese-edition.md | Planned; owner-managed | 不纳入，且不编辑 Chinese site copy |
| 2026-10-25-how-waiting-feels.md | Planned in local baseline; verified live already | 不纳入；spinner delay、progress pacing / ribbing、labor illusion、skeleton vs spinner、optimistic updates 全部归这页 |

Skeleton / Progress：**planned coverage**，可在 waiting 页完成后评估是否需要独立 component anatomy / states 页；本次不占 ranked entries。Avatar 只保留身份槽的 image/fallback 生命周期，若计划阶段发现仍重复则并入 waiting 的组件引用。


### Already covered or common knowledge

- Undo instead of asking — 已有 Toast `src/pages/components/toast.mdx:15` 的同名 Detail / ToastUndo，Dialog 也讲 habituation；删除独立题。
- Words can invert a state — Checkbox `checkbox.mdx:51` 与 Switch `switch.mdx:29` 已讲负向标签；删除。
- A disabled action needs an explanation — Button `button.mdx:67` 与 Tooltip `tooltip.mdx:41` 已覆盖；删除。旧来源应称 Shopify app-home web components 的 Button / Limitations，不是 Polaris accessibility guidance。
- Errors need a next step — 常识且重叠 Combobox / Error timing；删除。
- Password field — “可显示密码”本身没有新增机制；删除薄题。
- File upload — “保留 Choose file”是基本要求；删除薄题。旧 GOV.UK 段落关注 Dragon voice 用户，不归因为键盘问题。
- Breadcrumbs — “hierarchy, not history”不足以单独成页；删除薄题。
- Pagination — pagination / infinite scroll 的一般取舍没有独特机制；删除薄题。
- Empty state → Filter bar — 合成 query-caused zero results 一题；与 `combobox.mdx:27` 的 no-match 状态区分，不再独立讲 first-use 空态。
- Accordion → Keep the comparison in sight — 折叠把所需对比藏起来，是 external memory 的一个场景；不再独立占 component 页。
- Compare in one viewport → Keep the comparison in sight — 窄屏比较与同一机制、同一工具交付合并，不另占 site 排名；保留 reference strip 的移动 Compare 方案。

- Density is not just padding — 辅助元数据的视觉强调已属 Where the eye goes（`src/pages/principles/where-the-eye-goes.mdx`）；删除独立题。
- One-time code — 大小写不匹配的 Before 仅由 API 推断，没有产品证据；删除独立题。

## Coverage and remaining gaps

### Component comparison

目录有该组件，不等于它值得独立一页；按任务家族对照。

| Reference | Existing overlap | Ranked next / treatment | Remaining gap |
| --- | --- | --- | --- |
| [Apple HIG, Components](https://developer.apple.com/design/human-interface-guidelines/components) — **verified**；[Apple HIG, Selection and input](https://developer.apple.com/design/human-interface-guidelines/selection-and-input) — **verified** | Buttons、menus、input、selection、tabs、slider、dialog / popover | Drawer / Sheet、Date picker、Number field | time / timezone 与 color picker 尚缺独特场景；平台差异不能抹平 |
| [Material 3, Components](https://m3.material.io/components) — **verified** | Buttons、menus、dialogs、text fields、selection、cards | Sheet、Date picker、Carousel；Progress 留 planned waiting | Navigation rail / bar、FAB 尚待任务机制，不凑目录 |
| [Base UI, component navigation](https://base-ui.com/react/overview/quick-start) — **verified**；[Radix Primitives, Introduction and component navigation](https://www.radix-ui.com/primitives/docs/overview/introduction) — **verified** | 大部分核心 primitives 已有 | Avatar、Number Field、Drawer；Accordion 并入 external memory | Tree / Split pane 用 APG 补合同；Scroll area 等不够独立厚度 |
| [shadcn/ui, Components](https://ui.shadcn.com/docs/components) — **verified** | 核心表单、overlay、data display | Command、Drawer / Sheet、Calendar、Resizable、Carousel；Empty 并 Filter bar | Breadcrumb、Pagination、Password、File upload 暂不成薄页；Sidebar、rich text、charts 仍缺研究 |
| [Raycast, Action Panel](https://manual.raycast.com/action-panel) — **verified**；[Linear, A new command menu (2019-12-19; URL slug is 2019-12-18)](https://linear.app/changelog/2019-12-18-new-command-menu) — **verified**；[Linear, Filters](https://linear.app/docs/filters) — **verified** | Menu、Combobox、Table 已有基础 | Command current-item actions、Filter bar；Focus / selection 归原则 | 命令学习与复杂跨对象作用域仍需产品测试 |

Component group still missing：time / timezone、color picker、rich-text editor、charts、navigation system、复杂数据网格与 touch gestures。Context menu / Alert dialog / Range slider 先归既有变体。Skeleton / Progress 已 planned，不重提。

### Seven-step loop

| Step | Existing foothold | Ranked additions | Still missing |
| --- | --- | --- | --- |
| see | Where the eye goes; Colour; Concentric radius | #20 Small text needs different shapes; #6 A colour changes with its neighbours | 长文阅读与跨语言 typography 原始实验 |
| understand | 标签、状态、组件语义 | #16 Make the mode visible; #24 Filter bar; #12 Motion has a source; #3 Count what the reader sees | 复杂权限、跨系统 mental models |
| decide | Select / Radio / Combobox | #7 Keep the comparison in sight; #13 Defaults make a recommendation; #17 More choices can be easier; #10 Date picker | 风险与不确定性表达的真实场景 |
| act | Button、Slider、Hover forgives | #4 Command menu; #8 The target is the whole thing; #34 Press is not commit; #1 Let motion change its mind; #2 Preview the destination | touch / pen 与多人同时操作 |
| feedback | Toast、Nothing shifts、waiting planned/live | #30 Feedback without stealing focus; #9 Focus is not selection; #15 Keep meaning without motion | 多后台任务的聚合反馈 |
| recover | Toast Undo、Dialog、Error timing、Combobox | #24 Filter bar; #34 Press is not commit | 离线 / 冲突 / 跨会话恢复，不重复基本 Undo |
| learn | 组件细节与 shortcut | #25 Teach at the moment of need; #28 Follow the mechanism; #29 Trace a claim to its evidence | 长期迁移与记忆测量，demo 不能代替 |

| Cross-cutting area | Treatment |
| --- | --- |
| Motion | #1 Let motion change its mind; #12 Motion has a source; #11 The more often, the less motion; #15 Keep meaning without motion |
| Typography | #20 Small text needs different shapes; #3 Count what the reader sees |
| Colour | #6 A colour changes with its neighbours |
| Density | Where the eye goes 已覆盖视觉强调；可调空间分配见 #32 Split pane |
| Keyboard and focus | #9 Focus is not selection; #33 Tree view; #31 A role is a keyboard promise; #30 Feedback without stealing focus; #19 See the input path |
| Mobile and input | #5 Drawer / Sheet; #14 Input is not screen size; #7 Keep the comparison in sight |
| Undo, errors and copy | Toast Undo、Dialog、Error timing、Checkbox / Switch 与 Combobox 已覆盖；只补 query recovery 和 grapheme 单位，复杂 undo transaction 仍待研究。 |
| Perceived performance | How waiting feels 已 planned / live；Avatar 只讲身份槽生命周期，interruptibility 只讲第二次输入。 |

Principle group still missing：长文与跨语言感知证据、复杂 undo transaction、协作冲突和离线状态。菜单性能仅核实作者库 abstract；MIT 原站的 TLS 读取条件单列，不能把证据强弱藏在评分里。

### Site audit and opportunities

2026-10-25 的既有 live audit 使用 `pnpm shoot --base https://ui-playbook.suspense.site`；移动 viewport 390×844 CSS px。局部源码用于确认范围，未修改页面。

| Before | After | Why |
| --- | --- | --- |
| 首页已有搜索；lost focus 无结果，focus ring 找到 Button；Clear 恢复 26 条并聚焦搜索框 | 扩展症状词与 detail-level results | 补用户词汇与页面术语的距离，不重做已有搜索 |
| Hover forgives 窄屏第一对图不能同屏完整比较；无横向溢出 | external memory 条目的 mobile reference strip | 合并成一个机制与工具，不再提第二篇 Compare 页面 |
| 本地 Entry pager 按注册顺序；正文已有部分应用链接 | 少量机制相关链接与 loop index | 相邻页不总解释同一问题 |
| 已有 theme / slow-motion 控件，未见通用 focus trace / fixture preset | 按需显示两类工具 | 观察截图看不见的输入过程与长内容条件 |
| 未找到专用 print 样式，未实测全站分页 | 先验证一个静态对照输出 | 关键变化需转换为关键帧，不先宣布打印损坏 |

Site group still missing：无访谈、搜索日志、留存统计；未做全站打印、窄屏、真实触摸与 screen reader 审计。7 个 site 候选是待验证改进。Mobile 比较仍保留，在 external memory 条目内交付。

## Ranked backlog

字段固定；每项工具决定进入公式。前十深写只属于本次重新排序后的十项。

### Let motion change its mind

Rank: 1 · ID: interrupt

- **Kind:** principle
- **Working title:** Let motion change its mind
- **The mechanism:** Apple 的 fluid interfaces 把 interruption / redirection 视为输入的一部分：动画没结束不应意味着系统停止听人操作。当前轨迹继续响应，比播放完一段预制影片更接近直接操纵。
- **The Before:** no named product。展开动画期间忽略关闭或反向拖动，下一次操作只能排队；依据 Apple WWDC18 的中途反向和重定向演示。
- **Demo idea:** 一个可展开面板；仅改变动画能否从当前值重新定向，时长和终点相同。快速反复点触发器就能感觉是否被拦住。New reusable tool: no；复用慢放。
- **Primary sources:** [Apple WWDC18, Designing Fluid Interfaces, transcript](https://developer.apple.com/videos/play/wwdc2018/803/) — **verified**
- **Reference product:** Apple WWDC18 展示 app launch 中途回 Home / 转 multitasking 的设计目标；不声称所有 Apple 控件都如此。
- **Scores (1–5):** depth 5; felt 5; coverage 4; effort 2 (inverse cost)
- **Score rationale:** coverage 5→4：新版仍只比较展开过程是否接收第二次输入，未新增覆盖领域；保留 felt 5，因为原位触发器的连续点击直接暴露吞输入。
- **Priority:** 30 = 3×5 + 3×5 + 0 (tool bonus)
- **Coverage / boundary:** act / feedback / motion；不同于现有 origin 与 easing 细节，关注第二次输入。

**Top-10 page-plan brief.**

- **Before / After:** Before 在展开 / 收起期间锁住下一次输入，After 从当下位置立即接收新目标。时长、终点、按钮位置、视觉曲线相同，只改变是否接受中途重定向。
- **Felt demo:** 面板触发器始终可见。读者连续开关就能感觉 Before 吞掉点击，After 跟着意图改变；第一下看起来相同，第二下才揭示机制。复用慢放只是帮助观察，不用长时长制造问题。
- **Acceptance and limits:** 先验收快速反向、重复点击、键盘与 reduced motion。Apple WWDC18 是 interruptibility 的直接依据；不以 spring 名称替代输入时序验证。

### Preview the destination

Rank: 2 · ID: preview

- **Kind:** principle
- **Working title:** Preview the destination
- **The mechanism:** 拖动时的反馈不只证明“拿起来了”，还可预告释放后的结果。预留插入位置让读者在提交前校正，而不是放下后再撤销。
- **The Before:** no named product。列表拖动只显示浮起的对象，不显示最终插入缝；依据 NN/g 对 grabbed feedback 与结果 preview 的区分。
- **Demo idea:** 可重排播放队列；只变是否显示最终落点的覆盖式插入标记，拖动阈值、命中算法、条目布局和动画一致。New reusable tool: no。
- **Primary sources:** [NN/g, Drag-and-Drop (2020)](https://www.nngroup.com/articles/drag-drop/) — **verified**；[Atlassian Design, Pragmatic drag and drop design guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines) — **verified**
- **Reference product:** NN/g 的 Trello drop-zone preview 是 2020 年历史记录。当前 Atlassian design guidelines 明确 drop indicator 表达释放位置，但其 Trello 特例只说明拖动影像的旋转，不能据此确认 Trello 当前占位预览。
- **Scores (1–5):** depth 5; felt 5; coverage 4; effort 2 (inverse cost)
- **Score rationale:** felt 保留 5（Review 1 的 4→5）：覆盖式落点标记在每次自然拖动时都呈现释放结果，不依赖误点或特定键序；coverage 5→4：新版只澄清同一个 act / feedback 场景，没有扩大覆盖缺口。
- **Priority:** 30 = 3×5 + 3×5 + 0 (tool bonus)
- **Coverage / boundary:** act / feedback；区别于 Nothing shifts 的意外布局移动：这里的预览是由操作驱动的解释。

**Top-10 page-plan brief.**

- **Before / After:** 同一播放队列，Before 直到释放才说明插入位置，After 拖动中显示插入标记；只切换 destination preview，可拖手柄、拖动影像、命中算法和实际落点完全一致。
- **Felt demo:** 读者拖动熟悉的队列项目时就要判断放在哪，标记直接消除犹豫。预览采用覆盖层，不同时改变磁吸范围或让其他项目重新布局；慢放可用于检查标记与最终落点是否一致。
- **Acceptance and limits:** 松手后的顺序必须与预览吻合；无拖拽的等价操作另行验收。Trello 仅作标明年代的史例，当前产品 Before 仍为 no named product。

### Count what the reader sees

Rank: 3 · ID: graphemes

- **Kind:** principle
- **Working title:** Count what the reader sees
- **The mechanism:** 程序中的 code unit、Unicode code point 和用户感知的字符不是同一单位；一个可见字形可能由多个码点构成。计数和截断若用错单位，会让“还剩几个字”违背眼前的内容。
- **The Before:** no named product。姓名字段把组合字符或 emoji 按 code units 计数，甚至截断组合；依据 Unicode grapheme boundary 规范。
- **Demo idea:** 同一有字符限额的短签名，只换计数单位；初始内容含组合字符，编辑时计数差异直接出现。New reusable tool: yes，可复用 text segmentation inspector；默认只显示读者熟悉的计数。
- **Primary sources:** [Unicode UAX #29, Text Segmentation](https://www.unicode.org/reports/tr29/) — **verified**；[GOV.UK Design System, Character count](https://design-system.service.gov.uk/components/character-count/) — **verified**
- **Reference product:** GOV.UK Character count 提供计数反馈参考；不指认它当前存在 emoji 缺陷。
- **Scores (1–5):** depth 5; felt 4; coverage 4; effort 1 (inverse cost)
- **Priority:** 29 = 3×5 + 3×4 + 2 (tool bonus)
- **Coverage / boundary:** understand / typography / copy；UAX #29 的默认 grapheme cluster 是近似单位，仍有语言和产品策略差异。

**Top-10 page-plan brief.**

- **Before / After:** 短签名已含一个带组合符号的字母与一个组合 emoji。Before 按 code units 计数，After 按 extended grapheme clusters；字段、额度、内容与字体相同，只变计数单位。
- **Felt demo:** 同一签名旁的剩余额度在首次看到时就不一致，编辑一个可见字符后差异继续出现。可选 segmentation inspector 把该字符对应的 code units / code points / clusters 展开，让原因可检查。
- **Acceptance and limits:** 主对照不同时变截断策略。对组合附加符、ZWJ、旗帜等样例检查边界；UAX #29 默认 cluster 是近似，不声称所有语言中都等于一个“字”。

### Command menu

Rank: 4 · ID: command

- **Kind:** component
- **Working title:** Command menu
- **The mechanism:** Raycast 的 Action Panel 跟随当前项目：↵ 执行该项目的第一个 primary action，⌘K 打开它的全部动作，快捷键显示在右侧。结果高亮改变时，动作对象也要随之改变，否则“正在看什么”与“接下来会做什么”脱节。
- **The Before:** no named product。结果列表的高亮已换到另一个项目，Action Panel 仍显示同一组全局动作；依据 Raycast 的当前项目动作合同重建这个作用域不匹配场景，不虚构 Enter 打开动作面板的产品行为。
- **Demo idea:** 搜索结果旁已有 Action Panel，读者自然点击不同文件 / 文件夹行；只改变面板是否跟随当前项目。Before 始终是全局动作，After 是该项目自己的动作；两侧 ↵ 都直接执行各自列表的第一个动作，⌘K 入口与右侧快捷键展示规则相同。New reusable tool: no。
- **Primary sources:** [Raycast, Action Panel](https://manual.raycast.com/action-panel) — **verified**；[Linear, A new command menu (2019-12-19; URL slug is 2019-12-18)](https://linear.app/changelog/2019-12-18-new-command-menu) — **verified**
- **Reference product:** Raycast 当前官方文档确认 ↵、⌘K 与右侧快捷键。Linear 2019-12-19 changelog 根据当前 focus 或 view 排序，不是根据“selected issue”；该历史来源不证明当前实现。
- **Scores (1–5):** depth 5; felt 4; coverage 5; effort 3 (inverse cost)
- **Priority:** 27 = 3×5 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** act / learn；menu.mdx:40 的 context menu 管右键 / 长按打开对象动作；本页管 searchable command entry 的高亮结果与 Action Panel 的作用域绑定，以及该项目的 primary action，不重讲右键触发或动作分组。

**Top-10 page-plan brief.**

- **Before / After:** 同一搜索结果与已打开的 Action Panel。Before 无论高亮哪个项目，都是 New file、Open workspace、Settings；After 随当前文件 / 文件夹显示其 Open、Copy path 等动作。唯一变量是动作集合是否绑定当前项目。
- **Felt demo:** 读者点另一条搜索结果时，高亮变化与动作是否跟随同时可见，无需先读键盘说明。两侧 ↵ 均直接执行第一个动作，After 的第一个动作就是该项目的 primary action；不再以 Enter 打开面板制造差异。
- **Acceptance and limits:** 验收点击与键盘移动高亮后，动作及其目标同步更新；↵、⌘K、Escape 和焦点恢复遵守同一合同。两侧保留相同面板尺寸、刷新时机与快捷键列，不把布局或打开速度混入作用域变量。

### Drawer / Sheet

Rank: 5 · ID: drawer

- **Kind:** component
- **Working title:** Drawer / Sheet
- **The mechanism:** Sheet 的关键是父任务能否继续交互，不是面板从哪边滑出。Material 的 standard / modal 区分，以及 Apple 在不同平台对 sheets 的限制，决定它更像工具还是打断。
- **The Before:** no named product。要边看主画面边调参数，却用遮罩锁住主画面；依据 Material 的 standard / modal 用途和 Apple 对重复操作的 panel 建议。
- **Demo idea:** 地图配路线详情面板；只切换 modality，面板尺寸和起落动画不变。New reusable tool: no。
- **Primary sources:** [Material 3, Bottom sheets guidelines](https://m3.material.io/components/bottom-sheets/guidelines) — **verified**；[Apple HIG, Sheets](https://developer.apple.com/design/human-interface-guidelines/sheets) — **verified**
- **Reference product:** Material standard sheet 可与主内容同时使用；modal sheet 暂停背景。Apple 的 sheet 规则随平台不同，不能把 iOS 非模态特例套给 macOS。
- **Scores (1–5):** depth 4; felt 5; coverage 4; effort 3 (inverse cost)
- **Priority:** 27 = 3×4 + 3×5 + 0 (tool bonus)
- **Coverage / boundary:** act / mobile；超出已有 Dialog 的短暂停顿模式。

**Top-10 page-plan brief.**

- **Before / After:** 同样大小的地图路线详情面板，Before 是 modal，After 是 standard / nonmodal；只改变 modality，相同位置、内容与开合动效。背景的语义不可交互状态与 focus trap 随 modality 一起落实。
- **Felt demo:** 地图仍露出其他地点，读者自然想边看路线边点另一处；Before 被挡住，After 能继续。拖动 detent 不放进主对照，它是另一条独立细节。
- **Acceptance and limits:** 验证背景的指针、键盘与 AT 一致性，关闭后的焦点、滚动归属及未保存修改。Material 与 Apple 的平台边界分别标明，不把所有 drawer 都推荐为 nonmodal。

### A colour changes with its neighbours

Rank: 6 · ID: colour

- **Kind:** principle
- **Working title:** A colour changes with its neighbours
- **The mechanism:** Adelson 的 checker-shadow 图中 A 与 B 是同一灰值，却看起来不同。界面推论是：孤立 token 数值相同，不保证放到不同背景后仍被看成相同；这里不把所有色觉错觉归为一个已证实的简单原因。
- **The Before:** no named product。只看孤立 swatch 就断言两个界面区域中的灰色按钮会显得一样；finding 来自 Adelson / MIT 的同灰值 A、B，界面应用是本选题推论。
- **Demo idea:** 两个完全相同的灰色按钮，只改变周围背景；连接两块色片时恒定数值可见。New reusable tool: no。
- **Primary sources:** [Edward H. Adelson / MIT, Checker Shadow Illusion](http://persci.mit.edu/gallery/checkershadow) — **verified**；[The Illusions Index, Adelson’s Checker-Shadow Illusion](https://www.illusionsindex.org/i/adelson-s-checker-shadow-illusion) — **secondary only**
- **Reference product:** MIT 原站正文确认 A、B 同灰值；本次已下载并读取，TLS 限制单列。无已核实的四产品对应实现。
- **Scores (1–5):** depth 5; felt 4; coverage 2; effort 3 (inverse cost)
- **Priority:** 27 = 3×5 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** see / colour；primary finding 已核实，界面版效果仍须实测；不把 checker-shadow 当成任意深色主题的定量结论。

**Top-10 page-plan brief.**

- **Before / After:** 同一灰值的按钮放在两个不同 surround 中；只改变周围背景，按钮的像素、位置、大小与文字保持一致。Before / After 表达语境变化，不给其中一种色觉反应贴“错”标签。
- **Felt demo:** 两块同色片之间可显示一条同值连接带，直接揭示数值相同；读者先看见差别，再检查原因。界面化 surround 若不能稳定产生可感差异，应回到原始棋盘场景，不能靠改按钮颜色制造效果。
- **Acceptance and limits:** 明确区分 primary 的 A/B 同值事实与 secondary 的解释。MIT HTTP 本次重定向到证书过期的 HTTPS；读取的是原站 HTML，不声称 HTTP 返回 200 或 TLS 校验成功。

### Keep the comparison in sight

Rank: 7 · ID: comparison

- **Kind:** principle
- **Working title:** Keep the comparison in sight
- **The mechanism:** 外部画面能重新读取，工作记忆却不适合精确保留多组参数；把比较对象藏起来，会把比较变成回忆。Accordion 一次只开一项、窄屏把 Before / After 放到不同屏，都是同一个 external memory 问题。
- **The Before:** no named product。配置器每次只显示一个方案，切换后上个方案消失；依据 NN/g working memory 与 desktop accordion 分析。本站 Hover forgives 的 390×844 样本中，两幅完整对照也不能同时进入一屏；这是局部比较条件，不是全站 responsive 故障。
- **Demo idea:** 同一方案比较，只变先前方案的关键字段是否继续可见，字体、数值和顺序相同。New reusable tool: yes，mobile Compare mode：窄屏固定一个 reference strip，另一方案在相邻区域切换且保留状态；同样可用于本站视觉对照，单纯 A/B 隐藏切换不能冒充外部记忆。
- **Primary sources:** [NN/g, Working Memory and External Memory](https://www.nngroup.com/articles/working-memory-external-memory/) — **verified**；[NN/g, Accordions on Desktop](https://www.nngroup.com/articles/accordions-on-desktop/) — **verified**；[UI Playbook, Hover forgives, live browser audit 2026-10-25](https://ui-playbook.suspense.site/principles/hover-forgives) — **verified**
- **Reference product:** NN/g 的 Accordion 论述支持在比较任务中同时保留所需内容；不据此宣布所有 accordion 都不适合桌面。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 3 (inverse cost)
- **Priority:** 26 = 3×4 + 3×4 + 2 (tool bonus)
- **Coverage / boundary:** decide / mobile；将原 Keep the comparison in sight、Accordion、Compare in one viewport 合成一条 principle，并吸收 mobile 工具交付；不再各占一页或一个 site 排名。

**Top-10 page-plan brief.**

- **Before / After:** 同一方案配置器，Before 切换方案就替换旧参数；After 保留已固定方案的 reference strip。只变前一方案的关键字段是否仍可见，参数值、字段顺序、字号和选择逻辑相同。
- **Felt demo:** 方案有交叉优势：一个价格更低，另一个备份保留更久。读者自然要比较两组参数；保留的字段减少回看，不要求先记住数据。Accordion 的单开、窄屏纵向分离都作为同机制的应用，不再各开页面。
- **Acceptance and limits:** mobile Compare 工具必须让所需 reference 字段与当前方案同时可见，切换不重置状态；仅做 A/B 隐藏切换不满足 external memory。验收窄屏、长字段与键盘路径，不用一次操作宣称记忆容量或效率提升。

### The target is the whole thing

Rank: 8 · ID: target

- **Kind:** principle
- **Working title:** The target is the whole thing
- **The mechanism:** 屏幕边缘会挡住鼠标，沿接近方向的目标宽度因此可视为无限；这不是把按钮画得更大。NN/g 同时指出：若扩大命中区却不让人看见，人仍会朝可见的小目标减速瞄准，真实范围与感知范围是两回事。
- **The Before:** no named product。桌面工具栏把目标与物理屏幕边缘隔开一道缝，快速甩向边缘反而越过按钮；依据 NN/g Fitts’s Law 的屏幕边缘与 hidden padding 分析。
- **Demo idea:** 边缘工具栏；只改变目标是否贴到有鼠标止挡的边界，目标自身尺寸和点击结果相同。New reusable tool: yes，edge-target simulator + hit-area overlay；拟验证受限模拟指针能否在自然点击中呈现越过 / 停住。真实指针不会被容器边缘挡住，Pointer Lock 的浏览器提示也破坏无指令入口；needs a feasibility spike before planning。
- **Primary sources:** [NN/g, Fitts’s Law](https://www.nngroup.com/articles/fitts-law/) — **verified**
- **Reference product:** NN/g 解释桌面 screen edge 的无限目标效应；不推广到触屏或跨显示器仍可穿过的边界。
- **Scores (1–5):** depth 5; felt 3; coverage 4; effort 3 (inverse cost)
- **Score rationale:** felt 4→3：容器边缘挡不住真实指针，Pointer Lock 又有浏览器提示；模拟器能否在无指令入口中呈现边缘优势尚未验证，needs a feasibility spike before planning。
- **Priority:** 26 = 3×5 + 3×3 + 2 (tool bonus)
- **Coverage / boundary:** act；不重讲 Radio / Checkbox 的整行标签。第二个独立 detail 固定同一扩大 hit area，只变其可见提示，解释为什么隐藏 padding 不能省掉减速。

**Top-10 page-plan brief.**

- **Before / After:** Before 的工具距离止挡一小段；After 只移到止挡处。模拟指针、移动映射、按钮大小、起点与动作相同，点击后的轻量结果自然引出下一次工具选择。
- **Felt demo:** 拟议模拟器中，Before 需要回头找按钮，After 抵达边界即处于目标上；这个无指令入口尚未成立，先做 feasibility spike。overlay 只帮助观察真实 hit area；隐藏 padding 的可见性仍另做一对，不与边缘位置一起改。
- **Acceptance and limits:** felt 为 3；needs a feasibility spike before planning。先证明模拟指针与真实指针的关系无需说明即可理解，不能用 Pointer Lock 提示替代自然入口；若做不到就不进入页面计划。真实屏幕边缘、触屏与跨屏边界需分别验证，不从小 demo 估算 Fitts 参数。

### Focus is not selection

Rank: 9 · ID: focus

- **Kind:** principle
- **Working title:** Focus is not selection
- **The mechanism:** 焦点是接收下一次键盘输入的位置，选择是持续的对象状态；二者可能同时出现在不同项目上。只用一种高亮会让批量操作的对象变得不确定。
- **The Before:** no named product。列表把移动焦点画得像已选中，离开列表后又丢掉选中提示；依据 W3C APG 对 dual focus 的说明。
- **Demo idea:** 文件列表先选中一行，旁边有自然可点的 Search 输入。点击搜索框后，caret 表示输入焦点，已选文件仍是批量操作对象；只改变离开列表后是否保留 selection 高亮，两侧 selection 数据和焦点逻辑相同。New reusable tool: no。
- **Primary sources:** [W3C APG, Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) — **verified**；[Linear, Select issues](https://linear.app/docs/select-issues) — **verified**
- **Reference product:** Linear 文档区分 highlight 与 select，方向键移动、X 选择、Escape 清空；这是文档规定，未登录实测。
- **Scores (1–5):** depth 4; felt 4; coverage 5; effort 4 (inverse cost)
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** act / feedback；预选行 + pointer click 显示两种状态，无需 Tab / 方向键说明。不制造鼠标点击后的假 focus-visible ring；键盘与辅助技术另行验收。

**Top-10 page-plan brief.**

- **Before / After:** 列表预先选中一行，两侧有同一个 Search 输入。读者点击搜索框后焦点都移入输入，选择数据不变；Before 清掉行的选择高亮，After 保留。唯一变量是离开列表后是否继续显示 selection。
- **Felt demo:** Search 的 caret 与仍选中的行同时出现，直接表明下一次输入的位置和批量动作的对象可以不同。入口是正常点击搜索框，不要求先 Tab 或按方向键，也不伪造鼠标 focus-visible ring。
- **Acceptance and limits:** 检查两侧选中对象始终一致，差异只在持久高亮；真实键盘与辅助技术另验。单选中 selection follows focus 可以合理，本页不把多选模型推广到所有控件。

### Date picker

Rank: 10 · ID: date

- **Kind:** component
- **Working title:** Date picker
- **The mechanism:** 近日期是空间选择问题，远日期或记住的日期是直接输入问题。把两者都强迫变成逐月翻页，会把一个值变成漫长的导航过程。
- **The Before:** no named product。出生日期只能从当前月份逐月回退；依据 NN/g Date-Input 的近日期 / 远日期任务区分。
- **Demo idea:** 预约表单中的 Birthday；只改变日期输入路径：calendar-only / 可输入且有 calendar。相同日期、格式提示和验证规则。New reusable tool: no。
- **Primary sources:** [NN/g, Date-Input Form Fields (2017)](https://www.nngroup.com/articles/date-input/) — **verified**；[Apple HIG, Selection and input](https://developer.apple.com/design/human-interface-guidelines/selection-and-input) — **verified**
- **Reference product:** Apple HIG 有 Pickers；Material 有 Date pickers；具体 web 实现应先核对本地化和键盘行为。
- **Scores (1–5):** depth 4; felt 4; coverage 5; effort 3 (inverse cost)
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** decide / act；Input 与 Select 没有覆盖日期跨度和日历导航。

**Top-10 page-plan brief.**

- **Before / After:** Birthday 字段两侧打开同一个当前月日历。Before 只能逐月回退，After 保留日历并允许直接输入日期；只变输入路径，日期、格式提示与验证规则相同。
- **Felt demo:** 字段本身给出远日期语境，读者填出生日期就会遇到翻月成本，无需“输入某个年份”的操作说明。近日期预约留作另一独立场景，解释日历何时更有价值。
- **Acceptance and limits:** 检查 locale、模糊和无效日期、键盘及屏幕阅读器网格导航；不将两种日期任务混成一条“总用文本框”规则，也不发布未经测量的速度数字。

### The more often, the less motion

Rank: 11 · ID: frequency

- **Kind:** principle
- **Working title:** The more often, the less motion
- **The mechanism:** 同一动画在初见时传达关系，在高频工作中却会反复征收等待成本。Kowalski 把键盘操作和常用动作视为应减少甚至取消动画的场景；这是实践经验，不是固定毫秒阈值。
- **The Before:** no named product。快速浏览连续邮件时，每次 Next 都播完相同的内容过渡，反复拖住任务节奏；Kowalski 的高频动画分析为依据，其 Raycast 延迟例子是假设。
- **Demo idea:** 邮件预览有固定位置的 Next 按钮；只改变每次更新的过渡时长，内容、加载时间与输入接受时机相同。读者连续点 Next 就感到视觉是否跟上操作。New reusable tool: no。
- **Primary sources:** [Emil Kowalski, Great Animations](https://emilkowal.ski/ui/great-animations) — **verified**
- **Reference product:** Raycast 仅作命令入口语境；作者的延迟示例是假设。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 4 (inverse cost)
- **Score rationale:** felt 5→4：固定位置的 Next 虽提供自然连续点击，但把 keyboard-initiated 经验迁移到 pointer click 仍是 inference，尚无理由给这个新版指针 demo 更高分。
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** act / motion；Kowalski 此处讨论 keyboard-initiated actions；将其应用到本 demo 的 pointer click 是 inference，需实施验证，不把鼠标 Next 场景当成原文直接证实的行为。

### Motion has a source

Rank: 12 · ID: origin

- **Kind:** principle
- **Working title:** Motion has a source
- **The mechanism:** 进入与离开使用一致的 offscreen path，会让对象在视野外仍有稳定的位置；从右进入却从下离开，会打断这个空间模型。Apple WWDC18 用 spatial consistency 解释这一点，本页讨论来路与去路，不是浮层从触发器放大。
- **The Before:** no named product。详情从右侧进入，返回时却向下方离开，下一次又从右侧出现；依据已核实的 Apple WWDC18 spatial consistency 论述。
- **Demo idea:** 邮件列表打开详情，两侧均从右侧进入；只改变离场路径：Before 向下方离开，After 沿来路退出到右侧。内容、入场路径、位移长度、时长与曲线相同，正常打开 / Back 即可看到往返关系。New reusable tool: no，复用 slow motion。
- **Primary sources:** [Apple WWDC18, Designing Fluid Interfaces, transcript](https://developer.apple.com/videos/play/wwdc2018/803/) — **verified**
- **Reference product:** Apple WWDC18 Designing Fluid Interfaces 中的 spatial consistency；历史设计说明，不声称已测试当前所有 Apple 导航。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 3 (inverse cost)
- **Score rationale:** felt 5→4：返回后的空间路径关系需要经历一次打开 / Back 才成立，卡片起点场景的提分不适用于这个修订后的离场路径 demo。
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** understand / motion；与 Let motion change its mind 共用 WWDC18，但本页固定输入响应，只变离场路径；前者固定路径，只变中途重定向。Popover 的 It grows from its trigger 已覆盖缩放起点，不再以卡片 / 中心起点对照重复它。

### Defaults make a recommendation

Rank: 13 · ID: defaults

- **Kind:** principle
- **Working title:** Defaults make a recommendation
- **The mechanism:** Default 不只是省点击，也会被解读成系统建议。Johnson / Goldstein 的研究讨论推荐与切换成本；其跨国实际捐赠回归控制了捐赠倾向、基础设施、教育、宗教及年份等变量，报告 +16.3%（p<0.02），不是未控制的简单相关。
- **The Before:** no named product。通知设置悄悄预选最打扰的模式，却把未修改当明确偏好；来源为 Science 的 default 研究，产品应用是推论。
- **Demo idea:** 同一通知表单，只改变初始选择；读者提交前看到选中的含义。New reusable tool: no；这是反思型 demo，不能测出论文效应，felt 因此较低。
- **Primary sources:** [Johnson and Goldstein, Do Defaults Save Lives? Science (2003), author PDF](https://www.dangoldstein.com/papers/DefaultsScience.pdf) — **verified**
- **Reference product:** 无已核实的四产品直接案例；不将公共政策研究推广成转化优化处方。
- **Scores (1–5):** depth 5; felt 3; coverage 4; effort 2 (inverse cost)
- **Priority:** 24 = 3×5 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** decide；补默认值机制。保留明确选择与可撤销设置，不做欺骗性默认。

### Input is not screen size

Rank: 14 · ID: input

- **Kind:** principle
- **Working title:** Input is not screen size
- **The mechanism:** 宽屏也可能触摸，窄屏也可能接鼠标；pointer / hover 反映输入能力而非视口尺寸。any-hover 为真还不能证明所有输入都能 hover，也不能检测键盘。
- **The Before:** no named product。桌面宽度才提供 hover-only 动作，触摸笔记本因此没有可见入口；依据 CSS Media Queries 的多输入设备说明。
- **Demo idea:** 固定宽度的列表，只切换动作是否必须 hover 才能访问；在触摸仿真下轻触即可暴露缺口。New reusable tool: no；真实混合设备仍需验收。
- **Primary sources:** [W3C, Media Queries Level 4, interaction media features](https://www.w3.org/TR/mediaqueries-4/) — **verified**
- **Reference product:** W3C MQ4 为能力模型来源；不能从一个浏览器返回值断言用户只用某种输入。
- **Scores (1–5):** depth 5; felt 3; coverage 4; effort 2 (inverse cost)
- **Priority:** 24 = 3×5 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** act / mobile；Hover forgives 已讲菜单路径，本页限定能力检测与混合输入。

### Keep meaning without motion

Rank: 15 · ID: reduced

- **Kind:** principle
- **Working title:** Keep meaning without motion
- **The mechanism:** 减少位移不必删除变化的含义；反馈可以保留而不把整片视野推走。W3C 对非必要 interaction animation 的指导要求用户能关闭，不代表一切动画都要同样处理。
- **The Before:** no named product。reduced motion 时直接删除状态反馈，用户不知道卡片已展开；依据 W3C 的 essential / nonessential 区分，替代编码是本选题推论。
- **Demo idea:** 在已开启 reduced motion 的同一场景中，只变状态提示是否保留静态层级与标签；New reusable tool: no。
- **Primary sources:** [W3C, Understanding Animation from Interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html) — **verified**
- **Reference product:** W3C 对应 AAA criterion；不可写成所有动画均违反 AA。
- **Scores (1–5):** depth 4; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** feedback / accessibility / motion；与高频减动画分别回答偏好与任务频率。

### Make the mode visible

Rank: 16 · ID: mode

- **Kind:** principle
- **Working title:** Make the mode visible
- **The mechanism:** Mode error 是同样输入因模式不同做了另一件事。NN/g 用 Photoshop 工具与 Reply All 说明这种错位，并建议至少两个视觉指标，例如当前工具高亮与 cursor shape；只在进入模式时提醒一次不够。
- **The Before:** no named product。绘图工具切换后只在不显眼的工具栏标一下，下一次画布操作意外变成选择；来源是 NN/g 对 Photoshop Brush / Quick Selection 和邮件 Reply All 的历史例子，非当前产品指控。
- **Demo idea:** 简化绘图器有 Brush / Select，工具栏的当前项高亮两侧均保留；只变 cursor shape 是否随模式切换，形成第二个持续线索。New reusable tool: no。
- **Primary sources:** [NN/g, Modes](https://www.nngroup.com/articles/modes/) — **verified**
- **Reference product:** NN/g 文章中的 Photoshop 与 Reply All 是注明出处的例子，未验证当前版本，不冒充 Apple / Linear 的实现。
- **Scores (1–5):** depth 4; felt 4; coverage 3; effort 3 (inverse cost)
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** understand / act；不用未在该来源出现的 Hand-mode 场景，不把提示位置说成 next to the pointer；主变量是 cursor shape，非同时增加两种提示。

### More choices can be easier

Rank: 17 · ID: choices

- **Kind:** principle
- **Working title:** More choices can be easier
- **The mechanism:** 菜单选择既可能是新手的视觉搜索，也可能是熟练者的已知目标选择；不能把 Hick–Hyman 或工作记忆数字机械变成项目上限。多一层抽象分类可能比长一点的具体列表更难找。
- **The Before:** no named product。为凑少量顶层选项，把具体目的藏进含糊分类；NN/g 反对把记忆容量直接变成菜单条数，菜单模型论文区分 novice / expert。
- **Demo idea:** 同一组目的地，只变信息层级；从具体名称可直接找到目标，抽象分组需要再进入。New reusable tool: no。
- **Primary sources:** [NN/g, Short-Term Memory and Web Usability](https://www.nngroup.com/articles/short-term-memory-and-web-usability/) — **verified**；[Cockburn, Gutwin and Greenberg, A Predictive Model of Menu Performance (2007), repository abstract](https://ir.canterbury.ac.nz/items/fd5ec0a7-03bf-4b08-a1a9-ba211be3d837) — **verified**
- **Reference product:** 无当前四产品比较；论文这里只核实 repository abstract，不引用正文公式或效果量。
- **Scores (1–5):** depth 5; felt 3; coverage 3; effort 3 (inverse cost)
- **Priority:** 24 = 3×5 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** decide；覆盖选择复杂度，但不宣传“越多越好”。

### Carousel

Rank: 18 · ID: carousel

- **Kind:** component
- **Working title:** Carousel
- **The mechanism:** NN/g 2013 年 Siemens 案例中，那一项折扣只在 20% 的时间可见，carousel 每 5 s 前进；这两个数字描述曝光窗口，不是点击率。读者刚找到促销就可能被换走：机器的轮换节奏与人的阅读节奏错开。
- **The Before:** no named product（当前行为）。Before 重建 NN/g 记录的 Siemens 历史促销轮播，明确标 2013；本次 UK 主页浏览未重现该自动轮播，不把史例写成当前缺陷。
- **Demo idea:** 同样五项促销与导航，主变量仅 autoplay 开 / 关，自动侧采用史例的 5 s 间隔；读者浏览报价时可直接感受内容被换走。New reusable tool: no；不要求读者恰好误点，也不靠极短间隔夸大问题。
- **Primary sources:** [NN/g, Auto-Forwarding Carousels (2013)](https://www.nngroup.com/articles/auto-forwarding/) — **verified**
- **Reference product:** Material 有 Carousel，但不等于推荐 autoplay。Siemens 只用于明确年代的 NN/g finding；当前来源与核查限制另列。
- **Scores (1–5):** depth 4; felt 4; coverage 2; effort 4 (inverse cost)
- **Priority:** 24 = 3×4 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** see / act；手动控制、焦点不落到隐藏 slide 为边界；避免靠极短间隔造 strawman。

### See the input path

Rank: 19 · ID: trace

- **Kind:** site
- **Working title:** See the input path
- **The mechanism:** 最后一张截图看不见焦点是怎样丢的；事件先后和当前输入接收者才解释中断。一个可选的焦点轨迹能让键盘问题可检查，同时保留真实交互。
- **The Before:** no named product。只看到“最后没反应”，无法区分事件没触发还是焦点已移走；来源是 APG 对焦点持久性和删除 / 关闭后焦点管理的要求。
- **Demo idea:** 同一 dialog 关闭场景只变诊断 overlay 的可见性；New reusable tool: yes，focus path + bounded event trace，记录控件名称而非输入值。
- **Primary sources:** [W3C APG, Developing a Keyboard Interface](https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/) — **verified**；[W3C APG, Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — **verified**
- **Reference product:** 没有核实的四产品同类工具；不冒充 screen reader 模拟器。
- **Scores (1–5):** depth 4; felt 3; coverage 5; effort 2 (inverse cost)
- **Priority:** 23 = 3×4 + 3×3 + 2 (tool bonus)
- **Coverage / boundary:** site / keyboard tooling；与现有 slow motion、safe triangle 互补，需用真实键盘确认事件顺序。

### Small text needs different shapes

Rank: 20 · ID: type

- **Kind:** principle
- **Working title:** Small text needs different shapes
- **The mechanism:** Sitka 的 brief single-letter recognition 实验中，Small / Banner 在 9 pt 的正确率为 48% / 39%，在 36 pt 为 56% / 49%；Small 的优势 F=29.3, p=.0001。反直觉处是：大字号专用 cut 在大字号也没有更好认；作者没有得到可靠的 reading-speed 改善。
- **The Before:** no named product。把 display 字形缩到紧凑表格里，假设只要字号相同就同样易读；依据 Sitka 研究的 size-specific comparison。
- **Demo idea:** 同一字号短暂闪现单个字母，随后显示可点的字母选项与揭晓；只切换 optical master，曝光时长、字母序列、遮罩和对比度相同。New reusable tool: yes，timed glyph flash；可复用于字体辨认与相似字形研究，+2 tool bonus；不承诺十次试验能体验到正确率优势。
- **Primary sources:** [Larson and Carter, Sitka: a collaboration between type design and science (2015), PDF](https://www.microsoft.com/en-us/research/uploads/prod/2021/06/Larson-Carter-2015-Sitka.pdf) — **verified**
- **Reference product:** Microsoft 的字体研究是直接参考；未核实的 Apple 字体行为不加入。
- **Scores (1–5):** depth 5; felt 2; coverage 4; effort 2 (inverse cost)
- **Score rationale:** felt 4→2：论文的正确率差距为 7–9 个百分点，单个读者的十次短闪不足以可靠感到优势；保留 timed glyph flash 的 +2 工具价值，不以新工具替代可感性证据。
- **Priority:** 23 = 3×5 + 3×2 + 2 (tool bonus)
- **Coverage / boundary:** see / typography；需合法字体文件。Small / Banner 的 x-height 差异是该 master 处理的一部分，不同时缩放来人为配平；不同字号的实验曝光重新校准过，不能横向比较两组正确率。

### Stress the same scene

Rank: 21 · ID: stress

- **Kind:** site
- **Working title:** Stress the same scene
- **The mechanism:** 演示的默认数据会掩盖布局与交互假设；更真实的内容条件能揭露只对样例成立的规则。Linear 的设计记录明确把环境、外观、层级分别用于 stress tests。
- **The Before:** no named product。只有短英文标签的 demo 很容易隐藏长名称问题；Linear 提供 stress-testing 的设计依据，本站具体损坏尚未逐页验证。
- **Demo idea:** 先只提供 Short labels / Long labels 这一轴，其他内容与行为不变；New reusable tool: yes，shared fixture preset；之后每次只增加一个独立条件。
- **Primary sources:** [Linear, How we redesigned the Linear UI](https://linear.app/now/how-we-redesigned-the-linear-ui) — **verified**
- **Reference product:** Linear 的方法是参考，不是声明本站应复制其产品布局。
- **Scores (1–5):** depth 3; felt 4; coverage 4; effort 2 (inverse cost)
- **Priority:** 23 = 3×3 + 3×4 + 2 (tool bonus)
- **Coverage / boundary:** site / tools；不重新发明已有 slow motion；locale、zoom、reduced motion 后续各自单独验证。

### Share a demo state

Rank: 22 · ID: share

- **Kind:** site
- **Working title:** Share a demo state
- **The mechanism:** 链接通常只定位页面，不能定位让人理解问题的那组参数。把可复现的公开预设随链接保存，能把“看这页”变成“看这个差异”。
- **The Before:** no named product。本地 Compare / Frame 的 theme、slow 状态保存在 React 内存，未连接 URL；没有据此断言每个 demo 都不能分享。Linear 文档说明可分享部分 view filters，提供对照模型。
- **Demo idea:** 只变分享链接是否携带一个安全的 preset；另一窗口打开后能否看见同一对照自然可见。New reusable tool: yes，bounded preset URL serializer。
- **Primary sources:** [Linear, Filters](https://linear.app/docs/filters) — **verified**
- **Reference product:** Linear 明确限定不是所有 view 的过滤都可由 URL 保存；本站也应逐类声明支持。
- **Scores (1–5):** depth 3; felt 4; coverage 3; effort 2 (inverse cost)
- **Priority:** 23 = 3×3 + 3×4 + 2 (tool bonus)
- **Coverage / boundary:** site / collaboration；只编码白名单预设，不保存输入的姓名、密码或任意文本。

### Search by symptom

Rank: 23 · ID: search

- **Kind:** site
- **Working title:** Search by symptom
- **The mechanism:** 知道问题的人未必知道组件名；检索词与知识标题之间存在 vocabulary gap。把症状连接到具体 detail，才能让已有搜索替读者翻译问题。
- **The Before:** UI Playbook：首页 live 搜索 lost focus 无结果，而 focus ring 命中 Button；本地 Home.astro 仅在标题、摘要与 keywords 拼接串中匹配。来源为本次 browser audit。
- **Demo idea:** 只改变索引与结果定位粒度，保留搜索外观；相同症状词从零结果到有关 detail。New reusable tool: no；这是现有搜索的扩展。
- **Primary sources:** [UI Playbook home, live browser audit 2026-10-25](https://ui-playbook.suspense.site/) — **verified**；[NN/g, Information Scent](https://www.nngroup.com/articles/information-scent/) — **verified**
- **Reference product:** Linear Search 文档区分 workspace 与 view 范围，可参考明确的检索边界。
- **Scores (1–5):** depth 3; felt 4; coverage 5; effort 3 (inverse cost)
- **Priority:** 21 = 3×3 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** site / discover；先用有限症状词与 detail anchors 验证，不引入外部模型或未经测量的智能搜索。

### Filter bar

Rank: 24 · ID: filters

- **Kind:** component
- **Working title:** Filter bar
- **The mechanism:** 零结果可以是查询的结果，而非“尚未创建内容”。把生效条件留在眼前，读者才能把零与自己设置的条件连起来；NN/g 空态文章对 no results 的明确建议是状态文字，并没有推荐 clear filters 按钮。
- **The Before:** no named product。已完成的查询显示 No results，但关闭弹层后看不见哪些筛选仍生效；依据 Linear 的过滤模型与 NN/g 的 no-results 状态说明。
- **Demo idea:** 相同查询、相同 No results 状态和相同 Filters / Reset 入口；只变生效条件是否持续可见。读者看见互相收紧的条件后能自然回到 Filters 调整。New reusable tool: no；Reset 是本方案的恢复入口，两侧均有，不归为 NN/g 的建议。
- **Primary sources:** [Linear, Filters](https://linear.app/docs/filters) — **verified**；[NN/g, Designing Empty States](https://www.nngroup.com/articles/empty-state-interface-design/) — **verified**
- **Reference product:** Linear 文档有属性过滤及高级 AND / OR，并说明部分 view 的过滤可由 URL 保留。
- **Scores (1–5):** depth 4; felt 3; coverage 4; effort 3 (inverse cost)
- **Score rationale:** felt 4→3：新版把零结果与活动条件同时呈现，但读者仍需主动检查条件并打开 Filters 调整，尚未证明比旧方案更强的无指令体验。
- **Priority:** 21 = 3×4 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** understand / recover；吸收原 Empty state，只讨论 query-caused zero results，不做 first-use 空态。combobox.mdx:27 已覆盖搜索无匹配提示，本页新增多条件在弹层关闭后的可见因果。

### Teach at the moment of need

Rank: 25 · ID: teach

- **Kind:** principle
- **Working title:** Teach at the moment of need
- **The mechanism:** 提前看懂功能不等于需要时能回忆出来；教学与动作相隔太远，会把理解转换成记忆负担。上下文帮助把线索放在可马上使用的位置。
- **The Before:** no named product。首次打开被迫看完教程，真正要做时入口又藏起来；依据 NN/g 对 onboarding tutorials 的案例。
- **Demo idea:** 同一个裁剪功能与同一句帮助，只变出现时机：初次打开 / 首次进入裁剪。New reusable tool: no。
- **Primary sources:** [NN/g, Onboarding Tutorials](https://www.nngroup.com/articles/onboarding-tutorials/) — **verified**
- **Reference product:** Raycast Action Panel 的动作旁快捷键是相关的渐进学习参考，详见 Command menu；不是相同实验。
- **Scores (1–5):** depth 4; felt 3; coverage 4; effort 3 (inverse cost)
- **Priority:** 21 = 3×4 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** learn；只在真实需要解释的功能演示，不能借此给每个 demo 加教程。

### Number field

Rank: 26 · ID: number

- **Kind:** component
- **Working title:** Number field
- **The mechanism:** 步进可以是“在当前值上加一格”，也可以先吸附到 step 网格；相同的 + 按钮可能表达不同的数值模型。Base UI 文档明确 snapOnStep；locale 与 format 只按其展示 / 配置合同引用，不据此推断 typed input 的本地化解析。
- **The Before:** no named product。网格对齐的数值控制从非对齐初值继续保持偏移，让用户难回到整格；依据 Base UI snapOnStep 的合同推导，不称未吸附在所有任务里都错误。
- **Demo idea:** 布局间距字段预置非 step 整倍数，旁边有 + / −；只变 snapOnStep，step、初值、locale、format 相同。New reusable tool: no。
- **Primary sources:** [Base UI, Number Field](https://base-ui.com/react/components/number-field) — **verified**
- **Reference product:** Base UI Number Field；不引用浏览器 type=number 的未经测试差异。
- **Scores (1–5):** depth 3; felt 4; coverage 3; effort 3 (inverse cost)
- **Score rationale:** depth 4→3：非对齐初值的 + / − 只揭示 snapOnStep 的局部数值合同，惊讶程度不足以支持原先的 4；demo 与其余评分不变。
- **Priority:** 21 = 3×3 + 3×4 + 0 (tool bonus)
- **Coverage / boundary:** act；用“吸附网格”与“相对微调”任务解释取舍。先浏览器验证非对齐初值的双向步进，暂态输入与边界另验，不声称 locale 自动保证解析。

### Print a useful reference

Rank: 27 · ID: print

- **Kind:** site
- **Working title:** Print a useful reference
- **The mechanism:** 交互解释依赖状态变化，纸面只能留下一个时刻；有用的 print view 应把变化压成关键帧，而不是只隐藏按钮。它还需保留条件和来源，避免清单变成无语境的规则。
- **The Before:** no named product。本地样式检索未发现专用 print 规则，但未实测整个站点的打印分页，不能称当前打印损坏；MDN 提供 print media 的技术边界。
- **Demo idea:** 同一个 Compare 只改变导出表达：当前帧 / 标注差异的前后关键帧；New reusable tool: yes，static demo snapshot + print stylesheet。
- **Primary sources:** [MDN, Printing](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Media_queries/Printing) — **verified**；[Olah and Carter, Research Debt (2017)](https://distill.pub/2017/research-debt/) — **verified**
- **Reference product:** 无已核实四产品的同类 print 参考；方案由本站教学任务推导。
- **Scores (1–5):** depth 3; felt 3; coverage 4; effort 3 (inverse cost)
- **Priority:** 20 = 3×3 + 3×3 + 2 (tool bonus)
- **Coverage / boundary:** site / print；先挑一个纯视觉 demo 验证，输出 cheat sheet 仍需附适用条件，不能声称取代交互版。

### Follow the mechanism

Rank: 28 · ID: trails

- **Kind:** site
- **Working title:** Follow the mechanism
- **The mechanism:** 一个组件上的细节可来自多个机制；仅按组件前后翻页会让同一机制散落各处。按问题串联的少量相关链接可以提供更具体的信息线索。
- **The Before:** UI Playbook：Entry.astro 用 entries 数组的相邻项生成 Previous / Next；live Hover forgives 也显示相邻页导航。不是全站完全没有内文互链。
- **Demo idea:** 只改变页尾推荐的关联逻辑，保持链接数量和样式；从一个焦点问题直接进入相关机制。New reusable tool: no。
- **Primary sources:** [UI Playbook, Hover forgives, live browser audit 2026-10-25](https://ui-playbook.suspense.site/principles/hover-forgives) — **verified**；[NN/g, Information Scent](https://www.nngroup.com/articles/information-scent/) — **verified**
- **Reference product:** 不照搬某产品的复杂 sidebar；保留当前组件 / 原则双入口，增加少量语义路径。
- **Scores (1–5):** depth 3; felt 3; coverage 5; effort 4 (inverse cost)
- **Priority:** 18 = 3×3 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** site / reading flow；进一步的七步循环索引是同一条目的导航方案，不另计一条。

### Trace a claim to its evidence

Rank: 29 · ID: evidence

- **Kind:** site
- **Working title:** Trace a claim to its evidence
- **The mechanism:** 链接可证明“有人写过”，不自动证明当前产品仍这样工作。把每条行为主张连到测试日期、环境和来源范围，能防止历史案例在后续编辑中变成现在时。
- **The Before:** no named product。本任务发现 local planned 的 How waiting feels 已 live，说明文档快照与站点会漂移；这不是页面错误。GOV.UK 要求明确已测试的适用环境。
- **Demo idea:** 只改变来源说明能否追到具体 claim 与验证范围；同一句话可以立即看出是论文、规范还是当前 browser observation。New reusable tool: no，先做编辑用 evidence record。
- **Primary sources:** [UI Playbook, How waiting feels, live browser audit 2026-10-25](https://ui-playbook.suspense.site/principles/how-waiting-feels) — **verified**；[GOV.UK Design System, Contribution criteria](https://design-system.service.gov.uk/community/contribution-criteria/) — **verified**
- **Reference product:** GOV.UK contribution criteria 区分有用、独特、可用与适用范围；参考其证据边界，不复制审批流程。
- **Scores (1–5):** depth 3; felt 3; coverage 5; effort 3 (inverse cost)
- **Priority:** 18 = 3×3 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** site / trust；公开页只露简短适用条件与来源，运行日志留给作者，避免把工程记录塞进阅读流程。

### Feedback without stealing focus

Rank: 30 · ID: status

- **Kind:** principle
- **Working title:** Feedback without stealing focus
- **The mechanism:** 状态更新不必把焦点移过去才能被获知；否则用户的下一次输入会落在意料之外的位置。W3C 区分 status message 与新交互上下文，结果数量可被宣布而不接管任务。
- **The Before:** no named product。搜索每返回一批结果就把焦点移到计数，正在输入的查询被打断；依据 W3C Status Messages。
- **Demo idea:** 同一即时筛选，只改变结果更新是否抢焦点；继续键入时是否断流可直接感受。New reusable tool: no；screen reader 输出必须实听，不能用日志冒充。
- **Primary sources:** [W3C, Understanding Status Messages](https://www.w3.org/WAI/WCAG22/Understanding/status-messages.html) — **verified**
- **Reference product:** W3C 是直接依据；四产品未做当前 screen reader 审计。
- **Scores (1–5):** depth 4; felt 2; coverage 5; effort 1 (inverse cost)
- **Priority:** 18 = 3×4 + 3×2 + 0 (tool bonus)
- **Coverage / boundary:** feedback / focus；不重讲视觉显著性或 Toast 布局，注意不要每次输入都过度播报。 felt = 2：效果依赖特定输入路径或主动操作，不能靠说明词把体验潜力计为高分。

### A role is a keyboard promise

Rank: 31 · ID: role

- **Kind:** principle
- **Working title:** A role is a keyboard promise
- **The mechanism:** ARIA role 告诉辅助技术这是什么，却不会替作者生成它该有的交互。一个看似正确的 role=button 可以在键盘上仍是死的。
- **The Before:** no named product。把 div 标成 button，只有 click handler；依据 APG “role is a promise”的说明。
- **Demo idea:** 两张相同的操作卡片，只变键盘行为是否兑现角色；Tab 后按 Enter 的结果直接可见。New reusable tool: no；可接 input path 工具。
- **Primary sources:** [W3C APG, Read Me First](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/) — **verified**
- **Reference product:** W3C APG 是行为合同而非即用即合规保证；页面需实际 AT 测试。
- **Scores (1–5):** depth 4; felt 2; coverage 4; effort 2 (inverse cost)
- **Priority:** 18 = 3×4 + 3×2 + 0 (tool bonus)
- **Coverage / boundary:** act / keyboard；不把所有可点击区域都变成 button，链接仍需导航语义。 felt = 2：效果依赖特定输入路径或主动操作，不能靠说明词把体验潜力计为高分。

### Split pane

Rank: 32 · ID: split

- **Kind:** component
- **Working title:** Split pane
- **The mechanism:** 分隔线既是两个区域的边界，也是有值的控件。看得见的细线不该意味着只能用精确拖动改变布局。
- **The Before:** no named product。只能拖一条细线，键盘无入口；APG Window Splitter 给出 separator 的可调模型，但该模式仍标为未完成审查。
- **Demo idea:** 文件列表 / 预览窗；只变 divider 是否有键盘 resize 路径，拖动手感相同。New reusable tool: no。
- **Primary sources:** [W3C APG, Window Splitter (incomplete pattern)](https://www.w3.org/WAI/ARIA/apg/patterns/windowsplitter/) — **verified**
- **Reference product:** shadcn/ui Resizable 是候选实现；APG 的未完成状态必须保留，不能当已验证组件保证。
- **Scores (1–5):** depth 4; felt 2; coverage 4; effort 2 (inverse cost)
- **Priority:** 18 = 3×4 + 3×2 + 0 (tool bonus)
- **Coverage / boundary:** act / density；需先做键盘与辅助技术原型，再定页面实现。 felt = 2：效果依赖特定输入路径或主动操作，不能靠说明词把体验潜力计为高分。

### Tree view

Rank: 33 · ID: tree

- **Kind:** component
- **Working title:** Tree view
- **The mechanism:** Tree 的横向键负责层级，纵向键负责可见项目；展开、焦点和选择不是同一动作。把普通列表键盘行为直接套上树会丢掉层级方向感。
- **The Before:** no named product。左右键只移动文本光标或无效，折叠节点后焦点落到隐藏子项；依据 W3C APG Tree View 模式。
- **Demo idea:** 文件树只变左右键的层级导航策略；选中状态和展开动画固定。New reusable tool: no。
- **Primary sources:** [W3C APG, Tree View](https://www.w3.org/WAI/ARIA/apg/patterns/treeview/) — **verified**
- **Reference product:** W3C APG 为参考合同；没有核实的 Apple / Linear / Raycast / Material 当前 tree 行为。
- **Scores (1–5):** depth 4; felt 2; coverage 4; effort 2 (inverse cost)
- **Priority:** 18 = 3×4 + 3×2 + 0 (tool bonus)
- **Coverage / boundary:** act / keyboard；与 Focus is not selection 相互引用，避免重复讲视觉高亮。 felt = 2：效果依赖特定输入路径或主动操作，不能靠说明词把体验潜力计为高分。

### Press is not commit

Rank: 34 · ID: press

- **Kind:** principle
- **Working title:** Press is not commit
- **The mechanism:** 按下可以立即反馈，但提交推迟到释放时，用户才有移出目标取消的机会。响应速度与取消空间不是互斥条件。
- **The Before:** no named product。pointerdown 就归档，手指划开仍已提交；W3C Pointer Cancellation 给出了释放触发与撤回的边界。
- **Demo idea:** 归档按钮只改变 commit event；同一 pressed 反馈，按下后移出自然暴露能否取消。New reusable tool: no。
- **Primary sources:** [W3C, Understanding Pointer Cancellation](https://www.w3.org/WAI/WCAG22/Understanding/pointer-cancellation.html) — **verified**
- **Reference product:** 规范是直接依据；不宣称某一参考产品的所有按钮实现。
- **Scores (1–5):** depth 4; felt 2; coverage 4; effort 1 (inverse cost)
- **Priority:** 18 = 3×4 + 3×2 + 0 (tool bonus)
- **Coverage / boundary:** act / recover；独立于 Undo：这里讨论提交之前。 felt = 2：效果依赖特定输入路径或主动操作，不能靠说明词把体验潜力计为高分。

### Avatar

Rank: 35 · ID: avatar

- **Kind:** component
- **Working title:** Avatar
- **The mechanism:** 图片“已经存在于 DOM”不等于已可展示；fallback 的显示与图像加载生命周期需要协调。Base UI 先加载图像，并允许延迟 fallback，避免短暂 initials 闪现。
- **The Before:** no named product。每次图像载入都先闪 initials，再换头像；来源是 Base UI 的 Image / Fallback 生命周期合同，不是某产品失败率。
- **Demo idea:** 相同固定载入延迟，唯一变量是 fallback 出现策略；反复切换成员时能看到闪现。New reusable tool: no。
- **Primary sources:** [Base UI, Avatar](https://base-ui.com/react/components/avatar) — **verified**
- **Reference product:** Base UI 的 Avatar 是实现参考；延迟不是所有网络条件的通用常数。
- **Scores (1–5):** depth 3; felt 3; coverage 3; effort 4 (inverse cost)
- **Priority:** 18 = 3×3 + 3×3 + 0 (tool bonus)
- **Coverage / boundary:** see / feedback；仅研究头像身份槽的生命周期；低优先级，若与 planned waiting 重叠则合并到其组件引用，不另发原则。

## Evidence limits and handoff

### Current-product checks requested in Review 1

| Product | Opened source / observation | Result and use |
| --- | --- | --- |
| Google Calendar | [Google Calendar Help, Delete an event (current recovery documentation)](https://support.google.com/calendar/answer/37113?hl=en-GB) — **verified** | 当前官方帮助说明普通已删除事件可从 Bin 恢复，保留 30 天；特定 recurring 删除有例外。没有证实当前 warning / toast 组合，旧 Raskin 的 no-undo 不能作为现在时证据；Undo 题已因重复删除。 |
| Siemens Home UK | [Siemens Home UK, homepage (browser observation 2026-10-25)](https://www.siemens-home.bsh-group.com/uk/en) — **verified**；[NN/g, Auto-Forwarding Carousels (2013)](https://www.nngroup.com/articles/auto-forwarding/) — **verified** | Chrome 拒绝非必要 cookies 后看到单幅 hero 与下方可手动切换的分类条；本次未重现 2013 自动促销轮播。20% / 5 s 只属于 NN/g 的历史观察；当前 Before 维持 no named product。 |
| Trello | [Atlassian Support, Trello supported browsers (current drag-and-drop documentation)](https://support.atlassian.com/trello/docs/what-browsers-and-mobile-platforms-does-trello-support/) — **verified**；[Atlassian Design, Pragmatic drag and drop design guidelines](https://atlassian.design/components/pragmatic-drag-and-drop/design-guidelines) — **verified**；[NN/g, Drag-and-Drop (2020)](https://www.nngroup.com/articles/drag-drop/) — **verified** | 当前支持文档确认 card drag-and-drop；设计系统确认通用 drop indicator，Trello 特例只说明拖动影像旋转。未找到或实测当前 Trello destination preview，不能由此升级旧占位预览为现在时；保留 2020 历史来源。 |
| Raycast / Linear | [Raycast, Action Panel](https://manual.raycast.com/action-panel) — **verified**；[Linear, A new command menu (2019-12-19; URL slug is 2019-12-18)](https://linear.app/changelog/2019-12-18-new-command-menu) — **verified** | Raycast 三项动作合同均见当前官方文档；未操作 native app。Linear 记录发布日期 2019-12-19，URL slug 为前一天，依据 focus / current view；不写 selected issue。Windows 10 Hide notifications 随旧 copy 题删除，不再核查。 |

### Source limits

- MIT Checker Shadow：**verified**，已下载并读取原站正文，确认 A、B 同灰值。本次 HTTP 两种路径均 302 到 HTTPS，默认 TLS 校验因证书过期失败；随后仅对此公开、无认证页面用 curl --insecure 读取 HTML，与原站检索摘录及评审提供的原文一致。未修改浏览器或系统安全设置，不声称 HTTP 200 或证书有效。旧 description 地址未重用，未据它证明额外的知觉解释。
- `https://www.nngroup.com/articles/line-length-readability/`：unverified / 404，未引用最佳行长数字。`https://www.nngroup.com/articles/disabled-buttons/`：unverified / 读取失败，旧 disabled 题已删除。
- `https://linear.app/docs/command-menu` 与 `https://www.raskincenter.org/rchi/core-principles`：unverified / 读取失败；分别使用已读 Linear changelog、NN/g Modes，不推导未读原文。
- Apple / Material 3 的 JS-only 原文已通过浏览器读，不把网页抓取 shell 当作证据；Motion 两题沿用已核实的 WWDC18 不同机制。
- Canterbury 菜单性能论文只读到作者库 abstract：verified abstract only，未引用全文实验数字。APG Window Splitter 标为 incomplete pattern，实施前需原型与 AT 验证。
- Sitka 的 Small / Banner 数据属于 brief single-letter recognition；不同字号重校准曝光，不能比较字号间百分比，也不能推成读速提升。Defaults 的 +16.3% 是有控制变量的回归结果，不是百分点，不把公共政策结果推广为通知设置的预测。

主 Agent 下一步：按排名挑场景，重开来源，先验证主变量在真实交互中成立，再写页面。edge simulator、timed glyph flash、合法 optical masters 与界面版色觉效果需要先做可行性原型；低 felt 项不能靠操作说明补高分。当前产品证据不足的题，保持 no named product，直到有独立来源或复测。

结构、评分、去重及 Review 1 回归检查：[self-check — shots/topic-backlog/validate_backlog.py](../../shots/topic-backlog/validate_backlog.py)。
