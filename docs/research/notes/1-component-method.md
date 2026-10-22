# 组件怎么才算设计好：token 之外的决定

调研日期 2026-10-22。每条结论后附一手来源 URL。核实不了的地方标了【未核实】。

## 结论先行

token 只回答“长什么样”。W3C 设计 token 草案对 token 的定义是“一个可读名字加一个值”，用来“以与平台无关的方式表达设计决定”（https://www.designtokens.org/tr/drafts/format/ ）。它装得下颜色、间距、圆角，装不下这些问题：什么时候不该用这个组件、按下和松开分别发生什么、动画能不能中途打断、键盘怎么操作、文案怎么写、文字超长或网络很慢时怎么办、旁边有别的组件时谁让谁。最强的设计系统，正是把篇幅花在这些问题上。

对 playbook 的意思：每一页的主角应该是“一个决定和它的理由”，token 只是实现手段。

---

## 一、组件设计由哪些部分组成：看最强的设计系统怎么写组件页

### 1. GOV.UK：写明何时不该用，并公开研究和已知问题

- **是什么**：Character count 页的结构是 When to use → **When not to use** → How it works → Error messages → **Research on this component → Known issues and gaps** → Next steps（https://design-system.service.gov.uk/components/character-count/ ）。
- **具体内容**：“何时不该用”给的建议很反直觉：与其加字数提示，不如把字数上限调高。研究部分写明组件和 17 位用户一起测过，其中包括数字技能较弱的用户和残障用户；2022 年改过一版，原因是部分读屏软件会把字数念两遍。已知问题写到具体版本，比如 Chrome 99 上的 JAWS（一款读屏软件）不会读出预填文本框的字数；emoji 和部分非拉丁字符会被算成多个字符。行为细节也写清楚：读屏用户停止输入后才播报字数；JavaScript 不可用时，显示一段静态说明。
- **准入门槛**：组件发布前必须“在用户研究中测过，并且对有代表性的用户样本有效，其中包括残障用户”，还要在多种浏览器、辅助技术和设备上验证过（https://design-system.service.gov.uk/community/contribution-criteria/ ）。
- **为什么有效**：用户最需要的是“这个组件在什么地方会坏”，而这件事只有 GOV.UK 会公开写。
- **对 playbook**：每页加两个区块：“不该用的时候”和“已知坑”，后者写到具体浏览器和读屏软件。demo 里要能切换“无 JS”“读屏播报文案”这类状态。

### 2. Apple HIG：讲角色、上下文和选哪个组件

- **Buttons 页**：点击区域至少 44×44 pt，visionOS 上是 60×60 pt；文案建议以动词开头；primary 角色给最可能被选的那个按钮，它会响应 Return 键；破坏性操作即使最可能被选，也不能给 primary（https://developer.apple.com/design/human-interface-guidelines/buttons ）。
- **Toggles 页**：基本是一张“选哪个组件”的决策表。iOS 的 switch 只用在列表行里，列表以外用“行为像开关的按钮”；macOS 上单个开关项优先用 checkbox，已有 checkbox 的界面不要换成 switch；互斥选项超过约 5 个时改用 pop-up button；不能只靠颜色区分状态（https://developer.apple.com/design/human-interface-guidelines/toggles ）。
- **HIG 独有的东西**：按平台和输入方式分开写（手指、指针、眼睛、遥控器）；组件的“角色”（primary、cancel、destructive）会决定系统级行为，比如 Return 键触发哪个按钮。
- **对 playbook**：组件页要有“和相邻组件怎么选”的对照表。demo 要覆盖“同一个决定在指针和触摸下不同”的情况。

### 3. WAI-ARIA APG：讲键盘和语义的约定

- Menu Button 页只有四节：About、Examples、**Keyboard Interaction**、**Roles/States/Properties**。规定 Enter 和 Space 打开菜单并把焦点放到第一项；可选地，↓ 打开后聚焦第一项，↑ 打开后聚焦最后一项；`aria-expanded` 跟随菜单的显示状态（https://www.w3.org/WAI/ARIA/apg/patterns/menubutton/ ）。
- 总纲：“No ARIA is better than bad ARIA”；“A role is a promise”，即 ARIA 角色不会替你实现键盘行为（https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/ ）。
- **对 playbook**：Base UI 已经兑现了这些约定。playbook 不用重复讲，但每页应该列出“这个组件对键盘的承诺”，并在 demo 上显示按键提示。

### 4. IBM Carbon：按变体写行为规则，单开无障碍分页

- 组件页分 Guidelines、Specifications、Code、Accessibility 四个 tab。Notification 按变体分别规定是否自动消失：inline 不自动消失；toast 可以 5 秒后消失，但信息必须在别处还能找到；actionable 在用户处理前一直保留，且只允许一个操作；callout 永不消失（https://carbondesignsystem.com/components/notification/usage/ ）。
- Accessibility tab 写明 `status`、`alert`、`log` 和 `alertdialog` 各用在哪种通知；有交互的通知要管理焦点，比如提供一个快捷键直达的通知区，处理完再把焦点还回去（https://carbondesignsystem.com/components/notification/accessibility/ ）。
- **对 playbook**：“时间上的行为”（多久消失、能不能找回来）是一个设计维度，应该像 token 一样写成显式参数。

### 5. Shopify Polaris：讲文案和不该用的状态

- Button 页的 best practices 包括：critical 语气只用于难以撤销的破坏性操作；异步操作用 `loading` 而不是 `disabled`；按钮禁用时要有可见文字说明原因；禁用按钮会退出 tab 顺序，不要指望它能获得焦点。文案规则：强动词、sentence case、去掉冠词、不加标点（https://shopify.dev/docs/api/app-home/polaris-web-components/actions/button ）。
- **Polaris 独有的东西**：把文案规范当成组件规范的一部分。
- **对 playbook**：文案应该是 demo 的输入，before/after 可以只改文案。

### 6. Material：讲与邻居的组合规则

- Android 官方文档：同一时间只显示一个 snackbar，新的出现时旧的先消失；点击操作后 snackbar 自动关闭；用 `setAnchorView` 让它浮在 BottomNavigation 或 BottomAppBar 上方（https://github.com/material-components/material-components-android/blob/master/docs/components/Snackbar.md ）。
- 【未核实】m3.material.io 的页面靠 JS 渲染，抓不到正文，M3 原文没能读到。有搜索结果称官方要求“带操作的 snackbar 不要自动超时”，但我没有在一手页面上确认。
- **对 playbook**：组件不是孤立的。demo 要放进真实的邻居里，比如底部导航、FAB、另一个 toast。

### 各家独有的部分

| 维度 | 最好的范例 |
|---|---|
| 何时不该用、研究证据、已知 bug | GOV.UK |
| 角色、平台、输入方式、选哪个组件 | Apple HIG |
| 键盘和语义约定 | WAI-ARIA APG |
| 时间行为、按变体写的规则、无障碍分页 | Carbon |
| 文案和状态选择（loading 还是 disabled） | Polaris |
| 与相邻组件的组合规则 | Material |

---

## 二、专家怎么设计一个组件或交互：可照做的方法

### 方法 1：从手势和意图出发，不从画面出发
- **是什么**：WWDC18 “Designing Fluid Interfaces”主张把交互当作“你和对象之间的对话”，先想行为再想动画。手势在“按下时”就开始给反馈，但点按要等手指抬起才确认；手指拖出范围可以取消（https://developer.apple.com/videos/play/wwdc2018/803/ ）。
- **为什么有效**：用户在想法和动作上是并行的，界面要能跟上随时变化的意图。
- **例子**：iPhone X 的回到主屏手势“fully redirectable”，可以中途改去切换 app。Rauno 的例子：App Switcher 关闭 app 是破坏性动作，所以等手指抬起才触发；轻量的搜索浮层则可以在滑动途中出现，反向滑动就能撤回（https://rauno.me/craft/interaction-design ）。
- **对 playbook**：每页先写“用户的意图和触发时机”：按下、抬起，还是越过阈值。demo 要能演示“中途反悔”。

### 方法 2：可打断性是硬要求
- **是什么**：HIG Motion 页说：“Let people cancel motion”，尽量不让人等动画放完（https://developer.apple.com/design/human-interface-guidelines/motion ）。
- **例子**：Emil 做 Sonner 时，发现连续加 toast 会让 keyframes 动画跳帧，于是改用能中途换目标的 CSS transition（https://emilkowal.ski/ui/building-a-toast-component ）。Rauno 指出，iOS 设置页误点后想右滑返回，却打断不了推入动画，所以显得迟钝。
- **对 playbook**：before/after demo 的标准做法是“快速连点或反向操作”，并用慢放展示 before 版本的跳变。

### 方法 3：用弹簧描述行为，默认不回弹
- **是什么**：WWDC18 把弹簧简化成 damping 和 response 两个参数，并建议不要用 duration 思考。默认 100% damping，没有过冲；只有手势本身带动量时才加回弹。Music app 点开 Now Playing 用 100%，下滑关闭用 80%。抛出的画中画窗口，按速度推算的落点决定停到哪个角，而不是按离哪个角最近（https://developer.apple.com/videos/play/wwdc2018/803/ ）。
- **对 playbook**：motion token 可以存，但页面要讲“为什么这个场景用 80%”：取决于输入有没有动量。

### 方法 4：按使用频率决定动不动
- **是什么**：HIG 说频繁发生的交互一般不加动画（https://developer.apple.com/design/human-interface-guidelines/motion ）。Emil 说键盘触发、一天几百次的操作不该动画，并举例“Raycast has no animations and it feels right”，多数动画应短于 300ms（https://emilkowal.ski/ui/great-animations ）。Rauno 把命令菜单、macOS 右键菜单列为最好不要动画的场景，他给书签工具的高频操作去掉动画后，感觉更快了。
- **对 playbook**：每页标注“预计使用频率”。高频组件的 after 版本，往往是“去掉动画”。

### 方法 5：响应时间是第一约束
- Tognazzini：所有点击要在 50ms 内给出视觉或声音反馈（https://asktog.com/atc/principles-of-interaction-design/ ）。WWDC18 建议“到处找延迟”，并指出支持双击会让单击延迟约半秒。Vercel 规定加载中的按钮显示指示器，同时保留原文案（https://vercel.com/design/guidelines ）。
- **对 playbook**：demo 加一个“模拟慢网”开关，before/after 对比延迟下的反馈。

### 方法 6：空间一致性和暗示
- WWDC18：元素从哪里来就回哪里去，路径对称；Control Center 模块按下时朝最终状态方向长大，这是 hinting。WWDC17 讲 proximity 和 mapping：控件靠近它影响的对象，形状模仿被控制的东西（https://developer.apple.com/videos/play/wwdc2017/802/ ）。Rauno 的例子：音乐 app 从 Dynamic Island 的图标展开。
- **对 playbook**：popover 和 dialog 页要讲“从触发点长出来”，demo 对比居中淡入和从触发点展开两种做法。

### 方法 7：设计所有状态，包括看不见的
- Sonner 的细节：鼠标悬停或页面隐藏（`visibilitychange`）时暂停计时；用伪元素填住 toast 之间的空隙，免得悬停状态闪断；按速度判断是否滑动关闭；反方向拖动时加阻尼而不是直接卡住。Emil 说“The less details users notice, the better”（https://emilkowal.ski/ui/building-a-toast-component ）。
- Paco Coursey：切换主题时，先临时注入一段禁用所有 transition 的样式，切换完再移除，避免各元素各自渐变造成闪烁（https://paco.me/writing/disable-theme-transitions ）。
- Vercel 的 Web Interface Guidelines 相当于一份状态清单：不要预先禁用提交按钮；错误显示在字段旁，提交时聚焦第一个错误；每个界面都要有下一步，没有死胡同（https://vercel.com/design/guidelines ）。
- **对 playbook**：每页附一张状态表：idle、hover、press、focus、loading、error、empty、超长文本、页面隐藏、减少动态效果。没覆盖到的状态，demo 要显式标出来。

### 方法 8：用真实内容和真实用户压力测试，并用原型说话
- Linear 改版：先在 Figma 里做出上百个画面，再收敛成几个方向；实现前做三类压力测试（运行环境、外观、每种视图在各状态下的层级）；内部开关加 Slack 频道持续自用；主题变量从 98 个减到 3 个（https://linear.app/now/how-we-redesigned-the-linear-ui ）。
- WWDC18 结尾：交互原型“really worth a million static designs”，要自己玩，也要看别人玩。WWDC17 建议找一个第一次用的人，边看边讲 app 怎么工作。
- **对 playbook**：demo 内容用真实文案，包括长中文、长德文单词、emoji。“token 从 98 个减到 3 个”说明 token 应该越少越好，判断放在 token 之外。

### 关于 Josh Puckett
【未核实】他的 Interface Craft 是付费资料库，没有找到可公开读的一手文章，所以本文不引用他的具体主张。

---

## 三、token 系统和设计判断的区别

### 1. 原则讲“为什么”，token 讲“是什么”
WWDC17 的 Mike Stern 说，原则解释的是 why，不是 how；原则之间会冲突，“Too much feedback is annoying. Too much visibility is distracting.” 取舍取决于平台、屏幕、场景和用户熟练度（https://developer.apple.com/videos/play/wwdc2017/802/ ）。token 不能帮你做取舍，判断才能。
**对 playbook**：每页写一句“这里在 X 和 Y 之间取舍，我们选 X，因为……”。

### 2. 一致性要有层级，有时要故意不一致
Tognazzini 说，一致性的重要程度随层级不同：越小、越显眼的控件越要严格一致。另一条是“induced inconsistency”：“Make objects that act differently look different”，行为不同的东西必须看起来不同。还有：不是所有东西都该有默认值；“If the user cannot find it, it does not exist”（https://asktog.com/atc/principles-of-interaction-design/ ）。
**对 playbook**：token 系统天然追求统一，判断要知道什么时候打破它。例如破坏性按钮不能只换个颜色，还要换位置和角色，HIG 规定它不能是 primary。

### 3. 用户看到的是 signifier（提示），不是 token
Norman：signifier 是“some signal in the physical or social world that can be interpreted meaningfully”，用户像侦探一样靠线索建立心智模型（https://jnd.org/signifiers-not-affordances/ ）。WWDC17 也说 affordance 是人和物之间的关系，不是物本身的属性。WWDC18 列举的 signifier 有：被裁切的列表边缘、分页点、抓手、Safari 关闭标签时向左滑走（等于告诉你可以滑）。
**对 playbook**：用 demo 证明“这个视觉提示让人知道能做什么”，不只是证明它好看。

### 4. Rams：少，但要更好，而且每个细节都不随意
“Good design is thorough down to the last detail”，“as little design as possible”，“Less, but better”（https://www.vitsoe.com/us/about/good-design ）。
**对 playbook**：after 版本经常比 before 版本少东西，比如少一个动画、少一行说明、少一个 token。

### 5. 有主见的软件
Linear Method：“Productivity software needs to be designed for purpose”；过度灵活的软件会让团队变大后陷入混乱；“Simple first, then powerful”（https://linear.app/method/introduction ）。组件库的 props 越多越接近“模板”，判断就是替用户删掉选项。

---

## 四、给 playbook 的页面模板建议

每页（一个组件或一个细节）建议包含：

1. **意图和不该用的时候**（GOV.UK、HIG）：一句话说明用途，再写何时改用哪个相邻组件。
2. **决定和取舍**：这一页唯一的核心决定，以及放弃了什么。
3. **状态表**（Vercel、Sonner）：包括计时、页面隐藏、慢网、无 JS、减少动态效果。
4. **输入方式**（HIG、APG）：指针、触摸、键盘的按键承诺、读屏播报文案。
5. **时间行为**（Carbon、WWDC18）：触发时机、能否打断、弹簧参数及理由、使用频率。
6. **文案规则**（Polaris）：动词、长度、真实长文本示例。
7. **邻居**（Material）：和 toast、底部导航、另一个 popover 同时出现时怎么办。
8. **已知坑和验证记录**（GOV.UK）：在哪些浏览器和读屏软件上测过，哪里还有问题。

demo 的标准动作：快速连点和中途反向（看可打断性）、慢放（看跳变）、慢网开关、真实长内容、键盘全程操作、开启减少动态效果。before/after 的差别应该落在这些行为上，而不只是颜色和圆角。

## 未核实或缺口
- Material 3 官网（m3.material.io）靠 JS 渲染，抓不到正文，改用了 Material Android 官方文档。
- Josh Puckett 没有可公开访问的一手文章。
- Paco Coursey 只读到主题切换这一篇，cmdk 的设计思路没有找到他本人的成文资料。
- NN/g 的 affordance 文章链接返回 404，改用 Norman 本人在 jnd.org 的文章。
- Emil 的 great-animations 一文没有明确提“慢放检查”，他的原话是“隔天再看”。慢放是本文的引申。
