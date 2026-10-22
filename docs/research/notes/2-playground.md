# 用 Playground 教会判断，而不只是展示组件

调研日期：2026-10-22。每条结论后附来源 URL。标 **[未验证]** 的，是没能直接读到一手原文、只靠二手转述的内容。

## 结论先行

UI Playbook 现在的三种 demo（变体 gallery、状态网格、Before/After）都在“展示组件”。要让读者学会判断，每个 demo 要从“看”变成“做 → 看到后果 → 再读解释”。最关键的四点：

1. **先让读者亲手触发问题，再给解释。** 先体验、后讲解，读者听讲时学得更多（Schwartz & Bransford）。
2. **一次只变一个变量，其余全部固定。** 读者能看出差别，正是因为别的都没变（Tufte、变异理论）。
3. **后果要出现在真实场景里。** 一个设置项要改动画布，一条错误提示要挂在真实表单上（Brad Frost、Bret Victor）。
4. **Before 必须是真实产品真的发布过的错误。** 写出产品名，而且它要“看起来合理”。不能是故意做丑的稻草人（NN/g 的做法）。

---

## 一、交互式讲解为什么能教会人

### 1. 读者先动手，再读答案（prediction / time for telling）

- **是什么**：在揭晓之前，先让读者猜，或先让读者操作。
- **为什么有效**：Distill 综述引用了 Kim 等人的研究：NYT 的 “You Draw It” 让读者先画出自己预测的趋势，再看真实数据，回忆和理解都更好。综述还引用了 Chi 等人的研究：自我解释（self-explanation）能提升学习效果。https://distill.pub/2020/communicating-with-interactive-articles/
  Schwartz & Bransford（1998）让学生先面对一组 contrasting cases（对照案例，自己去找规律），再听讲座。这组学生学到和迁移的，都比“先读总结再听讲”的学生多。讲解要等读者有了准备性体验才有用，论文称之为 “a time for telling”。https://www.wright.edu/sites/www.wright.edu/files/uploads/2017/Feb/event/Schwartz_Bransford_1998_TimeForTelling.pdf （只读到摘要级内容，实验细节 **[未验证]**）
- **真实例子**：Josh Comeau 的 Flexbox 指南在揭晓前先问读者 “What do you *think* will happen…”，然后用下拉框让读者自己验证。https://www.joshwcomeau.com/css/interactive-guide-to-flexbox/
- **对 UI Playbook 的含义**：每个 Before/After 的 note 默认折叠，或者放在“试一下”之后。demo 上方只放一句任务，例如“快速连点三次 Save”“把窗口拖窄到 360px”。读者先在 Before 里踩到坑，note 再说明原因。

### 2. 一次只控制一个参数，在具体和抽象之间来回

- **是什么**：Bret Victor 在 “Up and Down the Ladder of Abstraction” 里，用一辆沿弯路行驶的小车讲这件事。第一步，让每个参数都能直接调（“direct, interactive control of each parameter”）。第二步，往上走：画出参数取所有值时的整体图景。第三步，往下走：回到一个具体值，追查原因。他认为洞见存在于层级之间的切换。http://worrydream.com/LadderOfAbstraction/
- **为什么有效**：变异理论（Marton）的说法是，一个方面变化、其他方面不变时，变化的那个方面才会被“看见”。学习是区分，不是堆积。https://kb.edu.hku.hk/approaches_variation_theory/ （二手综述 **[未验证]** Marton 原文）
- **真实例子**：Emil Kowalski 在 “7 Practical Animation Tips” 里，把 ease-in 和 ease-out 两个下拉菜单放在一起，时长都是 300ms，只有曲线不同。另一组是 180ms 对 400ms，曲线相同。https://emilkowal.ski/ui/7-practical-animation-tips
- **对 UI Playbook 的含义**：
  - 每对 Before/After 只允许一个差异，并在标题里点名，例如“唯一区别：transform-origin”。
  - 状态网格是“往上走”的那一层，让读者一眼看全所有状态。每个格子要能点开成可操作的单例，这是“往下走”。
  - 需要连续变化的参数（时长、圆角、间距），给一个 scrubber，不要只给离散的几格。

### 3. 后果要在上下文里显示出来

- **是什么**：Victor 的 “Explorable Explanations” 提出了 reactive document。读者改一个假设，例如州立公园的 $18 车辆费，文中的预算和游客数会跟着变。https://worrydream.com/ExplorableExplanations/
  “Learnable Programming” 也说，一行代码算出了什么，就应该立刻能看到；孤立的单个数据点很少够用，要并排比较。http://worrydream.com/LearnableProgramming/
- **为什么有效**：读者看到的是“我的操作造成了什么”，而不是“组件长什么样”。因果链条是完整的。
- **真实例子**：Red Blob Games 的做法是让读者改算法的输入（拖动线段端点），直接看输出，而且每张图只加入算法的一步。https://www.redblobgames.com/making-of/line-drawing/
  六边形网格页面里，悬停一个格子就显示到它的路径，点击可以切换墙。https://www.redblobgames.com/grids/hexagons/
- **对 UI Playbook 的含义**：Settings 类组件的 demo 旁边要有一块被它影响的画布。拿 Slider 来说，要展示它改变的东西（图片亮度、列表密度），而不是只展示滑块本身。

### 4. 有引导的探索，最后才开放 sandbox

- **是什么**：Nicky Case 的做法分几步：
  - 先让读者在熟悉的场景里动手，例如 *Parable of the Polygons* 里拖动形状。
  - 再从具体一步步走到抽象，步骤之间用 “BUT / THEREFORE” 衔接，而不是 “and then”。
  - 最后给一个开放 sandbox，让学生能超越老师。

  https://blog.ncase.me/how-i-make-an-explorable-explanation/
  他还强调要“Do & Show & Tell”配合使用：文字适合抽象概念，交互适合过程、系统和模型。https://blog.ncase.me/explorable-explanations/
- **对 UI Playbook 的含义**：一页的顺序应该是：一个真实问题 → 引导式 Before/After（一次一个变量）→ 页底一个参数全开的 playground，供读者自己找边界。gallery 不应该放在第一屏。

### 5. 交互不是越多越好

- Distill 综述提醒，交互可能分散注意力，也可能根本没人用（“interactivity may be distracting”），而且“不是所有东西都需要交互”。它还引用了 Mayer 的冗余原则：文字和图形应当互补，不要重复同一信息。https://distill.pub/2020/communicating-with-interactive-articles/
- **对 UI Playbook 的含义**：note 不要复述 demo 里一眼就能看到的东西，例如“After 更圆润”。note 只讲 demo 看不出来的内容：原因、代价、什么时候不适用。纯静态的差异（例如对齐），用一张标注图就够了，不要为它做交互。

---

## 二、好的 UI-craft 站点怎么讲交互细节

| 站点 | 展示什么 | 顺序 / 保真度 | Storybook 做不到的地方 |
|---|---|---|---|
| Rauno “Invisible Details of Interaction Design” https://rauno.me/craft/interaction-design | 几乎每个例子都来自真实产品：iOS 的 App Switcher、Dynamic Island，macOS 的 Cmd+Tab，Logitech MX Master 3 的滚动劫持 | 先讲原则，再放真实产品录屏。真实反例和正例点名对比，例如 iOS Settings 的返回手势不能打断动画，App Switcher 却可以。只有 radial menu 是可以上手玩的 demo | 讲“为什么”和“什么时候不要做”，例如高频菜单不该做动画 |
| Rauno craft 索引 https://rauno.me/craft | 每个条目链接到 Prototype / Production / Essay 三种形态之一 | 原型和生产环境分开放 | 能看到同一个想法放进生产后的样子（具体格式靠推断 **[部分未验证]**） |
| Emil “You Don't Need Animations” https://emilkowal.ski/ui/you-dont-need-animations ；“7 Practical Animation Tips” https://emilkowal.ski/ui/7-practical-animation-tips | 有动画和无动画对比，用 Shift 切换；180ms 对 400ms | 读者自己触发。按 S 键放慢，可以拖动时间轴。用 Raycast、Linear 当判断依据 | 读者亲手感受“快不快、烦不烦”，demo 内容是一个仿真的 command menu |
| Apple WWDC18 “Designing Fluid Interfaces” https://developer.apple.com/videos/play/wwdc2018/803/ | 用真实 iOS 场景（Control Center、Music 的 Now Playing）说明 response、interruptibility、rubberbanding | 把物理效果放慢演示；30fps 和 60fps 并排；还演示“没有这条原则会怎样” | 展示行为，不只是静态外观 |
| NN/g 错误信息指南 https://www.nngroup.com/articles/error-message-guidelines/ | 带标注的截图，标题以 Good/Bad 开头并写明公司名，例如 Instagram（Bad）错误提示离字段太远，Amazon（Good）多重提示 | 静态截图、真实发布过的产品 | Before 有名有姓，可信，读者没法说“谁会这么做” |
| GOV.UK Error message https://design-system.service.gov.uk/components/error-message/ | 示例用真实服务语境，例如“When was your passport issued?” | 示例 → 何时用 → 何时不用 → 怎么工作 → 组件的用户研究 → 变更记录 | 写明“何时不用”，并给出研究证据（在真实服务里测过） |
| Vercel Web Interface Guidelines https://vercel.com/design/guidelines | 一行一条规则，例如 “Never `transition: all`.” | 几乎没有 demo，只有文案部分用 “Instead of… say…” | 可以检索、可以当 checklist，但单读规则体会不到 |
| Laws of UX（Fitts's Law）https://lawsofux.com/fittss-law/ | 定义 → takeaways → 起源 → 延伸阅读 | 页面上没有 demo，也没有产品例子 | 适合当反面参照：只有定义，读者记得住，但不会用 |

**共同点**：好的站点都是先给真实场景或真实产品，再讲原则。差异由读者自己触发，必要时放慢。都会讲什么时候不该这么做。Storybook 的 story 被定义为“如何渲染组件的一个对象”，args 可以实时调，适合穷举状态，但它不回答“为什么”和“在哪儿用”。https://storybook.js.org/docs/writing-stories

Refactoring UI 的 Before/After 原文（Medium）返回 403，没能读到，具体做法 **[未验证]**。Apple HIG 的 best practices 页面也没有抓取 **[未验证]**。

---

## 三、什么时候用真实场景，什么时候用孤立样本

- **一手论点**：
  - Brad Frost 在 Atomic Design 中写道，“interface atoms don't exist in a vacuum”。他认为 pages 层要放上“real representative content”，才能检验设计系统是否有效；孤立地设计按钮再指望它们拼得好，是愚蠢的。https://atomicdesign.bradfrost.com/chapter-2/
  - Storybook 也有专门的页面级 story，并建议用 args composition “build realistic scenarios”。https://storybook.js.org/docs/writing-stories/build-pages-with-storybook
  - NN/g 的高低保真文章把“包含最终设计会出现的全部内容”算作高保真的标志。https://www.nngroup.com/articles/ux-prototype-hi-lo-fidelity/
  - NN/g 的 AI 原型文章记录了 Ramp 的案例：用参与者自己的（脱敏）数据做原型，才发现了一个原本发现不了的可用性问题。https://www.nngroup.com/articles/test-earlier-with-ai/
  - NN/g 专门谈 lorem ipsum 的文章没找到。其他 UX 站点的说法是，占位文本会让测试者分心，也容易做出装不下真实内容的设计。https://uxmatters.com/mt/archives/2012/10/tips-on-prototyping-for-usability-testing.php （非 NN/g **[未验证 NN/g 立场]**）
- **判断规则**（根据以上来源归纳）：
  - **用孤立样本**：差异是组件自身的属性，在任何场景里都成立。例如 focus ring 的对比度、按下态的 scale、圆角的同心关系。这时场景只是噪音，状态网格最合适。
  - **必须用真实场景**：差异只在任务里才显现。例如：
    - 错误提示的位置（要有一个真实表单）；
    - 菜单动画是否烦人（要高频重复使用，Emil 和 Rauno 都拿频率作判断依据）；
    - 截断和换行（要有真实长度的中文、德文、用户名）；
    - 一个设置项的意义（要有它改变的画布）；
    - 加载和乐观更新（要有真实延迟）。
- **对 UI Playbook 的含义**：每页至少一个“场景 demo”，用真实任务和真实数据：真实长度的文件名、带 emoji 的用户名、3G 延迟。gallery 和状态网格当作参考层放在后面，不是教学的主体。

---

## 四、Before/After 的陷阱

1. **稻草人 Before**：Before 如果丑得明显，读者学到的只是“别做丑东西”。NN/g 的做法是用 Instagram、Disney World 这类真实发布过的错误，并写明名字。https://www.nngroup.com/articles/error-message-guidelines/
   Rauno 也拿 iOS Settings 和 Logitech 的真实行为作反例。
   **含义**：Before 要写出来源（某产品、某版本），而且它在静态截图里应该看起来完全合理，只有动手操作时才露馅。

2. **一次改了好几个变量**：Tufte 的观点是，设计保持恒定，读者才会把注意力放在数据的变化上，而不是图形的变化上。他还有那个问题：“Compared to what?” https://www.r-bloggers.com/2018/04/why-you-should-master-the-small-multiple-chart/ （二手引用《The Visual Display of Quantitative Information》，页码 **[未验证]**）
   **含义**：Before 和 After 共用同一份数据、尺寸和主题。用 diff 列出唯一的改动，例如 `transition-timing-function: ease-in → ease-out`。如果真的要演示组合效果，就像变异理论说的那样，先逐项对比，最后再合在一起（fusion）。

3. **只比静态差异**：交互细节的差异发生在时间和操作里：速度、打断、重复、键盘。WWDC 专门演示“没有这条原则会怎样”，Emil 提供放慢和拖动时间轴。
   **含义**：Before/After 必须能自己触发，并提供 0.25× 慢放。“重复 10 次”的按钮可以用来体验高频操作的代价。

4. **Note 只是说，读者没感受到**：Distill 提醒，文字不要和图形重复。Schwartz 的研究也说明，讲解要放在体验之后。
   **含义**：note 的结构建议固定为三行：
   - 你刚才遇到了什么，指向读者的操作；
   - 为什么，背后的机制或原则，附来源；
   - 什么时候反过来，After 不适用的情况。

5. **只有两格**：只放一好一坏，读者会以为“只有对错”。Tufte 的 small multiples 展示的是“the range of alternatives”。
   **含义**：对连续参数（时长、阻尼、间距），用 3–5 格 small multiples 或一个 scrubber，标出“太慢 / 合适 / 太快”的区间，比只放一对好坏更能教会判断。

---

## 给 UI Playbook 的 demo 规格（汇总）

- **页面顺序**：真实问题（一句话）→ 场景 demo（先动手）→ 逐项 Before/After（一次一个变量）→ 状态网格（往上走一层）→ 开放 playground（sandbox）。
- **Before**：真实产品发布过的错误，写出产品名，静态下看起来合理。
- **差异**：每对只改一处，在标题或 diff 里点名。
- **触发**：读者亲手触发；提供慢放；需要时提供“重复 N 次”。
- **note**：默认折叠或放在操作之后，按“遇到什么 / 为什么 / 何时反过来”三行写，不复述画面。
- **内容**：真实长度、真实语言、真实延迟，不用 lorem ipsum。
- **不做**：不为纯静态差异硬做交互（Distill 提醒交互会分散注意力）。
