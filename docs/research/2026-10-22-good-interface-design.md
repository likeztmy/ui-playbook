# 好的界面设计从哪里来：组件、playground 与人的底层

调研日期 2026-10-22。这份是合成稿，三份原始笔记在 `notes/` 里，每条结论都附一手来源链接，核实不了的地方都标了出来：

- `notes/1-component-method.md`：组件怎么设计，token 之外的决定
- `notes/2-playground.md`：playground 怎么教会判断
- `notes/3-perception-guidance.md`：感知、注意、心智、习惯，以及引导

---

## 一句话

Token 回答的是“长什么样”。好界面回答的是另外几件事：人会不会**看见**、能不能**看懂**、敢不敢**动手**、能不能**点对**、错了能不能**挽回**、下次能不能**学会**。这些答案来自人本来就有的能力和习惯：一眼就能分组，被差异吸引，认出比回想容易，按惯例操作，注意力一次只盯一处。设计判断就是在每一步给出对的信号，而且给得**是时候、在注意力所在的地方、刚好够用**。

W3C 对 design token 的定义只是“一个名字加一个值”（https://www.designtokens.org/tr/drafts/format/ ）。Linear 改版时把主题变量从 98 个减到 3 个（https://linear.app/now/how-we-redesigned-the-linear-ui ）。token 是装决定的容器，不是决定本身。

---

## 一、主线：一次交互的七个环节

把 Norman 的“执行鸿沟和评估鸿沟”（https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/ ）展开成七个环节，所谓“引导”，就是在每个环节上替人省力。下面每一环都按“机制 → 手段 → 常见失败”来写。

### 1. 看见

- **分组靠空间和边界。** 靠近的、相似的、在同一底色或边框里的东西，会被自动看成一组。common region（同一区域）的力量比靠近和相似都强（https://www.nngroup.com/articles/common-region/ ）。
  - 手段：组内间距明显小于组间距；间距不够用时才加卡片或底色。
  - 失败：通栏色块造成“假底”，用户以为页面到头了，就不再往下滚。
- **一屏只让一种视觉特征表示“最重要”。** 单一特征的差异，比如颜色、大小、粗细，能在约 200ms 内被并行捕捉。“红色且是圆形”这类组合搜索做不到，人只能逐个去找（Healey，https://www.csc2.ncsu.edu/faculty/healey/PP/ ）。
  - 失败：“未读”用粗体，“错误”用红色，“选中”也用红底，结果哪个都找不快。
- **太醒目反而看不见。** 用户学会了跳过任何长得像广告的东西：顶部横幅、右栏、彩色圆角卡片、带动画的元素（https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/ ）。
  - 手段：重要信息用和正文相同的样式，出现在相关的位置上。
- **注意力之外的变化会被漏掉。** 在 Simons & Chabris 的实验里，46% 的人没看见画面中走过的大猩猩，任务越难，漏看的越多（http://www.chabris.com/Simons1999.pdf ）。
  - 手段：一次只改一处；变化放在注意焦点旁边；用一个短动画指出哪里变了（https://www.nngroup.com/articles/change-blindness-definition/ ）。

### 2. 看懂

- **人读的是线索，不是功能。** Norman 后来强调，设计要提供的是 signifier，也就是“可被感知的那部分 affordance”（https://jnd.org/signifiers-not-affordances/ ）。扁平化之后的问题，往往不是用户不会点，而是没认出那是能点的东西。
- **状态要能被读懂，不只是被显示出来。** 比如 “Hide notifications = Off” 是双重否定，蓝牙开关的方向也会让人读反。手段是用正向的措辞，并让 On 表示“有事在发生”（https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/ ）。
- **人是按层级扫读的。** F 形扫读是遇到无格式长文时的**失败模式**，不应该去迎合。按小标题跳读（layer-cake）才是最有效的扫读方式，前提是小标题和正文区分清楚、关键词放在前面（https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/ ，https://www.nngroup.com/articles/layer-cake-pattern-scanning/ ）。

### 3. 决定

- **认出比回想容易。** 菜单、搜索建议、最近使用，都是把“记住”换成“认出”（https://www.nngroup.com/articles/recognition-and-recall/ ）。命令面板在条目旁边显示快捷键，就是让用户从“认出”慢慢走到“记住”。
- **惯例是用户已经付过的学习成本。** 用户的大部分时间花在别的产品上，所以他们期待你的产品和那些产品一样工作（Jakob's law，https://jakobnielsenphd.substack.com/p/jakobs-law ）。这也是“先照搬参考产品”的理论依据。
- **默认值是最强的引导，也最容易被滥用。** 器官捐献实验：默认“不捐”时 42% 同意，默认“捐”时 82% 同意，要求用户主动选一次时是 79%（https://www.dangoldstein.com/papers/DefaultsScience.pdf ）。“让人自己选一次”几乎和“默认勾上”一样有效，而且更诚实。
- **用渐进披露把选择压到刚好够用。** 常用的放在第一层，展开的入口要让人能预测里面是什么；超过两层，可用性通常会变差（https://www.nngroup.com/articles/progressive-disclosure/ ）。
- **选项多的代价，对新手主要在“找”，不在“选”。** Hick 定律的对数增长主要适用于熟练用户；新手是在逐项视觉搜索，所以解法是排序、分组和搜索，不一定要砍掉选项。

### 4. 动手

- **先定行为，再做动画。** WWDC18 的建议（https://developer.apple.com/videos/play/wwdc2018/803/ ）：
  - 按下就给反馈，抬起才算确认，手指拖出范围可以取消；
  - 动画要能被随时打断，并且能改变方向；
  - 弹簧默认不回弹，只有手势本身带惯性时才加。
- **破坏性动作等手指抬起再触发，可撤回的轻量动作可以中途就出现**（Rauno，https://rauno.me/craft/interaction-design ）。
- **Feedforward：动手之前就让人看见结果。** 比如拖拽时的落点预览、按钮文案写成“删除 3 项”而不是“确定”。它被认为是弥合执行鸿沟最被低估的手段（Vermeulen 等，CHI 2013，https://opus.cloud1.lib.uts.edu.au/handle/10453/26900 ）。
- **消除模式。** 消除不了的，就改成 quasimode，也就是只在用户按住某个键时才存在的模式，比如按住空格平移画布。用户不可能忘记一个自己正按着的状态（Raskin，https://www.raskincenter.org/rchi/core-principles ）。
- **Fitts 定律有适用范围。** 屏幕边缘对鼠标来说是“无限大”的目标，但在触屏上反而更难点。上下文菜单要出现在触发点附近（https://www.nngroup.com/articles/fitts-law/ ）。

### 5. 得到反馈

- **0.1 秒、1 秒、10 秒三道线**（https://www.nngroup.com/articles/response-times-3-important-limits/ ）：
  - 0.1 秒内，人感觉是“我直接操作了它”；
  - 1 秒内，思路不会断；
  - 超过 10 秒，必须显示进度，并允许用户中断。
  - Tognazzini 要求每次点击在 50ms 内都有反馈（https://asktog.com/atc/principles-of-interaction-design/ ）。
- **用得越频繁，越不该加动画。** HIG、Emil、Rauno 的说法一致：命令菜单和右键菜单不做动画，“Raycast has no animations and it feels right”（https://emilkowal.ski/ui/great-animations ）。

### 6. 出错与挽回

- **能撤销的就不要弹确认框。** 确认框点多了就会变成反射动作，到真要拦的时候拦不住。“Never use a warning when you mean undo”（https://alistapart.com/article/neveruseawarning/ ）。只有不可逆、代价大、又不常发生的操作才用确认，而且确认要打断用户的习惯，比如要求输入仓库名才能删库。
- **报错要晚，消错要早。** 用户离开字段时再校验；一旦改对，每次按键都要立刻把错误消掉（Wroblewski，https://alistapart.com/article/inline-validation-in-web-forms/ ；Baymard，https://baymard.com/blog/inline-form-validation ）。离开字段才校验的版本完成时间少 42%，错误少 22%。

### 7. 学会

- **帮助在需要时出现，而不是一开始全推给用户**（push 与 pull，https://www.nngroup.com/articles/onboarding-tutorials/ ）。
  - 开场教程会被跳过，也不能可靠地提升任务表现。
  - 连串的 coach marks 看的时候没法同时操作，内容大约 20 秒就忘了（https://www.nngroup.com/articles/mobile-instructional-overlay/ ）。
- **空状态就是最好的教学位置。** 它要说明“这里为什么是空的”，并给出下一步的入口（https://www.nngroup.com/articles/empty-state-interface-design/ ）。
- **最好的引导是隐式的。** 让产品的结构和行为本身教会用户；显式提示只留给少数与众不同的功能（Krystal Higgins，https://www.kryshiggins.com/explicit-onboarding/ ）。

---

## 二、一个组件到底要设计什么

把最强的几家设计系统并排看，每家都有一块别人没写的东西：

| 维度 | 讲得最好的 | 它在写什么 |
|---|---|---|
| 何时不该用、研究证据、已知坑 | GOV.UK | 字数提示页建议“与其加提示，不如把上限调高”；页面里写明和 17 位用户（含残障用户）测过；已知坑写到具体版本，比如 Chrome 99 上的 JAWS 读屏软件不播报字数。 |
| 角色、输入方式、选哪个组件 | Apple HIG | primary 按钮响应回车，删除这类破坏性操作即使最常用也不能设为 primary；Toggles 页是一张“选哪个组件”的决策表。 |
| 对键盘的承诺 | WAI-ARIA APG | “A role is a promise”：给元素标上某个角色，键盘行为也要跟着兑现。 |
| 时间上的行为 | Carbon | 按变体规定会不会自动消失，消失后去哪里能找回来。 |
| 文案和状态的选择 | Polaris | 异步操作用 loading 而不是 disabled；按钮禁用时要说明原因。 |
| 和邻居的关系 | Material | 同时只显示一个 snackbar，并且要浮在底部导航之上。 |

（链接都在 `notes/1-component-method.md`。）

合起来，一个组件的设计由八件事组成，token 只覆盖其中“外观”这一小块：

1. **意图，以及何时改用别的组件**
2. **核心取舍**：选了什么，放弃了什么，为什么
3. **全部状态**，包括看不见的：计时、页面隐藏、慢网、超长内容、减少动态效果
4. **输入方式**：指针、触摸、键盘各自的承诺，以及读屏软件念出来的话
5. **时间行为**：什么时候触发、能不能打断、使用频率有多高
6. **文案**
7. **邻居**：和其他组件同时出现时谁让谁
8. **已知坑和验证记录**

高手的做法也很一致：

- 从意图和手势出发；
- 把能否打断当作硬性要求；
- 按使用频率决定动不动；
- 第一约束是响应时间；
- 用真实内容做压力测试；
- 用可交互的原型说话（WWDC18：“really worth a million static designs”）。

Tognazzini 补了一句很关键的话：“行为不同的东西必须看起来不同”。token 系统天然追求统一，判断要知道什么时候打破统一。

---

## 三、playground 怎样教会判断，而不只是展示组件

学习研究和最好的 craft 站点都指向同样五条（细节在 `notes/2-playground.md`）：

1. **先动手，后讲解。** 先面对对照案例、自己找规律的学生，再听讲时学到的和能迁移的都更多（Schwartz & Bransford 1998）。NYT 的 “You Draw It” 先让读者画出预测，再揭晓答案。所以说明文字应该放在读者亲手踩坑之后。
2. **一次只变一个量。** 别的都不变，变化的那一项才会被“看见”（变异理论，Tufte 的 small multiples）。Emil 的对比就是这样做的：同样 300ms 只换缓动曲线，或者同样的曲线只换时长。
3. **后果出现在真实场景里。** 读者改一个假设，整份文档跟着变（Bret Victor 的 reactive document）。设置项旁边要有被它改变的画布，错误提示要挂在真实的表单上。
4. **Before 必须是真实产品真的上线过的错误。** 要写出产品名，而且它在静态截图里看起来应该完全合理，只有动手时才露馅。NN/g 标注过 Instagram 的错误提示，Rauno 拿 iOS Settings 当反例。故意做丑的“稻草人”只能教会人“别做丑东西”。
5. **交互细节的差别发生在时间里。** 所以 demo 要能亲手触发，要能慢放（WWDC18 会把物理效果放慢演示，Emil 用 S 键慢放），要能“连做十次”去体会高频操作的代价。纯静态的差别，用一张标注图就够了。

什么时候用孤立样本，什么时候必须放进真实场景？判断规则是：差异如果是组件**自身的属性**，比如焦点环的对比度、按下时的缩放、同心圆角，就用状态网格；差异如果**只在任务里出现**，比如报错的时机、高频操作的动画、截断、设置项的意义、加载过程，就必须放进真实场景。

说明文字建议固定成三行：**你刚才遇到了什么 → 为什么（背后的机制，附来源）→ 什么时候反过来**。不复述画面上一眼就能看到的东西。

---

## 四、拿这把尺子量现在的 Playbook

**已经做对的：**

- 每页都有 When to use，也写了“该改用什么”。
- Input 的“离开时校验、改对就消错”，正好就是 Wroblewski 和 Baymard 的结论。
- Toast 用 Undo 而不是确认框，对应 Aza Raskin 的原则。
- Dialog 的遮罩点击不关闭，以及 Popover 关闭后保留草稿，都在“挽回”这一环上。
- Switch 旁边有一块被它改变的画布；Radio 旁边有导出尺寸的读数。这两个是真实场景 demo。
- 页面上声明的每一条行为都有 Playwright 测试兜底，接近 GOV.UK 公开“证据”的做法。

**主要差距**（举的都是具体页面的例子）：

1. **先讲后做。** 每个 Before/After 的说明文字一直显示在 demo 下方，读者还没动手就先读到了答案。
2. **页面顺序是“目录式”的。** Variants 画廊放在最前，真实场景 demo 排在 States 之后。研究建议的顺序是：问题 → 场景 → 逐项对比 → 状态全览 → 开放 sandbox。
3. **有稻草人。** Popover 的 Before 从 0.5 倍、正中心、300ms 慢慢长出来，没有哪个产品会这样上线。Combobox 的 “No results” 和 Radio 的“用方框做单选”比较接近真实，但都没有写出处。
4. **一次改了不止一个量。** 比如 Popover 的 Before 同时改了起点、缩放、时长和缓动曲线，标题里也没点名改了哪一项。
5. **规则的理由多是“Precision 这么定的”，而不是人的机制。**
   - 例子：“The circle dips to 0.9” 只给了数值，没讲为什么。
   - 应该怎么写：每条规则落到第一节的某个环节上。比如“只让一种特征说话”就属于“看见”。
6. **缺少时间维度的工具。** 没有慢放，没有“连做十次”，没有慢网开关。而 Menu、Toast、Popover 的关键差别恰恰发生在时间里。
7. **缺少“底层”一层。** 原则页只有同心圆角一篇。第一节的七个环节没有自己的页面，组件页的规则也无处可以指回去。
8. **缺少“已知坑”。** 比如 Base UI 的 Combobox 默认第二次按 Esc 会清空已选的值，这次是被我们拦下来的；这类发现应该写进页面。

---

## 五、可以选的方向

都不要求马上动手，下面是几种做法。

- **A. 先补“底层”一层。** 按七个环节写原则页（看见、看懂、决定、动手、反馈、挽回、学会），每页讲一个机制，配一个读者能亲身感受到的 demo。比如：
  - 闪现 200ms 的找目标实验；
  - 连删十封邮件，看确认框会不会被反射性点掉；
  - 四种校验时机的对比。

  组件页的每条规则都链接回对应的机制。这样 Playbook 讲的就是“为什么”，组件页只是这些机制的应用。
- **B. 先改 demo 的规格。** 每个对比改成这样：
  - 上方一句任务；
  - 读者动手之后才展开说明；
  - 标题点名唯一的改动；
  - 加慢放和“连做十次”；
  - Before 换成写明出处的真实产品错误。
- **C. 先改组件页的模板。** 加上“核心取舍”和“已知坑”两块，页面顺序改成先场景、后画廊。

**我的建议：先做一个试点，再决定要不要全面推开。**

- 选一个组件页：Input。它同时涉及校验时机、signifier、报错和消错，最能检验新规格。按 B 和 C 重做这一页。
- 再选一个底层页：“报错要晚，消错要早”或“一次只让一种特征说话”。按 A 做出来。

两页放在一起看，就能判断这套做法是否值得推广到其余页面，也能看出工具（慢放、重复、任务提示）该不该做成通用部件。

---

## 六、流行但站不住的说法

| 说法 | 一手资料实际说的 |
|---|---|
| 工作记忆 7±2，所以菜单不超过 7 项 | Miller 自己怀疑“七”只是巧合；Cowan 估计约 4 个信息块；菜单靠认出来用，长一点也没关系 |
| 用户按 F 形看页面，所以要迎合它 | F 形是无格式长文造成的失败模式，好的设计能避免它 |
| 用户不往下滚 | 2018 年 57% 的浏览时间在首屏，其余在下面；只是第三屏以后很少有人看 |
| 3 次点击规则 | 没有数据支持；超过 3 次点击并不会让更多人流失 |
| Doherty 阈值是 400ms，低于它会“上瘾” | IBM 原报告转载里没有 400ms，也没有“上瘾”；原数据是响应从 3 秒缩到 0.3 秒后，每小时操作次数翻倍 |
| 默认值能让捐献率翻几倍 | 同意率相差近 60 个百分点，但实际捐献只增加了约 16% |
| 选项多就慢，所以要砍选项 | 新手慢在逐项寻找，排序、分组、搜索往往比砍掉选项更有效 |
| 屏幕边缘的目标总是更好点 | 只对鼠标成立，触屏上反而更慢 |

## 七、没能核实的

- Refactoring UI 原文（页面返回 403）。
- Material 3 官网正文（JS 渲染，抓不到）。
- Josh Puckett 的资料（付费库）。
- Vermeulen 2013 的完整 feedforward 分类（论文所在服务器限制访问）。
- push / pull revelations 这对术语的最早出处。
- Doherty 报告扫描版里的图表。
- Tufte 和 Marton 的原书措辞（只读到二手引用）。

详见各笔记的末尾。
