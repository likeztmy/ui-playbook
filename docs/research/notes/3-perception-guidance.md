# 人的底层：感知、注意、认知、习惯，以及好界面怎样借它们“引导”人

> 调研日期 2026-10-22。每条结论后附来源 URL。标【未核实】的是没能读到原文、只来自二手材料或我自己的观察。标【神话】的是流行但被一手资料否定或夸大的说法。

## 0. 一句话总纲

界面引导的本质是：**用人本来就会的东西（一眼分组、被差异吸引、靠认出而不是回想、按惯例操作），替用户省掉“看懂”和“想好怎么做”的力气**。Token 和公式只决定“长什么样”，这些机制决定“人会不会看见、看懂、敢点、点对”。

---

## 1. 视觉感知：人先“看见结构”，再读内容

### 1.1 Gestalt 分组：近、似、同框、连续

- **机制**：大脑会自动把靠近的、长得像的、在同一个边框/底色里的东西当成一组。NN/g 指出 common region（同一区域）是比 proximity（接近）和 similarity（相似）更强的线索，一个清楚的边界“可以压过”其它分组原则。https://www.nngroup.com/articles/common-region/
- **UI 技法**：组内间距明显小于组间距；只在间距不够用、或要把不同类型的元素装进一组时才加卡片/底色。
- **产品例**：Windows 打印对话框用边框把“打印机 / 页码范围 / 份数”分开，于是三处的“1”不会读混；Food Network 改成卡片后修好了图片和标题因留白过多而“脱钩”的问题。同上来源。
- **副作用**：通栏色块会造成 false floor（假底），用户以为页面到底了不再滚动。同上来源。Proximity 也会“连坐”：NN/g 发现内容一旦挨着广告，会被一起当成广告跳过。https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/
- **Demo**：同一组 8 个表单字段，滑杆调“组内 / 组间间距比”，比例接近 1 时分组消失；再开一个开关加卡片背景，让读者感觉 common region 怎样一下子压过间距。

### 1.2 Preattentive 特征与 pop-out

- **机制**：Healey 的感知页面说，一小组视觉属性能被低层视觉系统极快地、并行地检测到，通常把在多元素画面中 **200–250ms 内**完成的任务算作 preattentive（眼动启动本身就要至少 200ms）。他同时提醒：现在已知注意力在这一阶段也起作用，“preattentive”这个词保留下来只是因为它直观。https://www.csc2.ncsu.edu/faculty/healey/PP/ （原站当时访问不稳，我读的是 Wayback 存档：https://web.archive.org/web/2024/https://www.csc2.ncsu.edu/faculty/healey/PP/ ）
- **特征清单**（Healey 表 1）：方向、长短/粗细、闭合、大小、曲率、密度/对比度、数量估计、色相、亮度、交叉、端点、3D 深度线索、闪烁、运动方向、运动速度。
- **关键限制：conjunction（组合）搜索不是 preattentive**。目标是“红 + 圆”，而干扰项里既有红方块又有蓝圆，人就只能逐个找。同上来源。
- **UI 技法**：一屏只让**一种**特征承担“这里最重要”。如果“未读”用粗体、“错误”用红色、“选中”也用红底，用户找“未读的错误”就成了组合搜索，又慢下来了。
- **产品例**：列表里的未读圆点、diff 里的红绿行、表单里唯一的红框，都是单一特征 pop-out。
- **Demo**：照搬 Healey 的实验：50 个元素闪现 200ms，问“目标在不在”。三种模式：只差颜色 / 只差形状 / 颜色加形状组合。读者会亲身体验到第三种突然变难。然后换成真实 UI：一张有 40 行的消息列表，分别用“只有未读加粗”和“未读加粗 + 部分标红 + 部分高亮”。

### 1.3 视觉层级与扫读：F 形、layer-cake、spotted

- **机制**：NN/g 2006 年起的眼动研究提出了 F 形扫读，但他们自己（2017 文，2026 年复审）说得很清楚：F 形是**没有强线索时的默认行为**，出现条件是：成片文字无格式、用户想求快、不想逐字读。并且“F 形扫读对用户和业务都是坏的”，“好设计可以避免 F 形”。https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/
- **其它模式**：layer-cake（只看标题和小标题）、spotted（找链接、数字、某个词）、marking（眼睛不动、页面在滚）、bypassing（跳过列表项开头重复的词）、commitment（几乎全读，但不应默认用户会这样）。同上来源。
- NN/g 认为除逐字读以外，**layer-cake“是迄今最有效的扫读方式”**，前提是小标题和正文明显不同、样式一致、措辞把关键词放前面；样式做过头又会被当成广告。https://www.nngroup.com/articles/layer-cake-pattern-scanning/
- 【神话】“用户都按 F 形看页面所以重要内容放左上”。F 形是失败模式，不是该去迎合的规律。
- **Demo**：同一篇设置说明，左边一大段文字，右边加了信息型小标题、加粗关键词、关键词前置的列表；叠一层模拟“注视热区”（按 NN/g 描述的模式手动标注即可，不必真做眼动），让读者看到 F 形怎么变成 layer-cake。

### 1.4 Banner blindness 与“醒目反而被忽略”

- **机制**：忽略广告是**学来的**习惯。用户会跳过顶部横幅、右侧栏，以及任何“长得像广告”的东西：小矩形、花哨格式、彩色底、动画。一次糟糕的体验后，用户会回避整个区域（“hot-potato”效应），有例子显示右栏得到的注视比按面积应得的少 33 倍。现象 1997 年首次记录，2007、2018 年眼动复现。https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/
- **对 playbook 的意义**：salience（显著性）不是越强越好。把一条重要通知做成彩色圆角卡片放在右上，恰好命中了“广告”的全部特征。
- **Demo**：一个仪表盘里放三种“新功能提示”：彩色渐变横幅、右栏卡片、和正文同样式、只在相关位置出现的一行文字。请读者先完成一个找数字的任务，再问“你看到新功能提示了吗”。

---

## 2. 注意与记忆：人一次只盯一处，记不住多少

### 2.1 Locus of attention、habituation 与 modes（Jef Raskin）

- **机制**：人在任一时刻只有一个有意识的注意焦点；界面里任何“要求注意”的东西（报错、警告、确认）都会把焦点从工作上抢走。熟练动作会变成自动的（habituation），所以行为一旦变了，熟练用户仍会做旧动作然后出错，Raskin 把这算界面的错。https://www.raskincenter.org/rchi/core-principles
- **Modes**：同一动作因系统状态不同产生不同结果（Caps Lock）。Raskin 的原则是“eliminate all modes”，消除不了就改成 quasimode（只在用户主动按住时存在，例如按住 Shift），因为用户不可能忘记一个自己正按着的状态。同上来源。书的章节结构见 https://www.informit.com/store/humane-interface-new-directions-for-designing-interactive-systems-9780201379372 。（Raskin Center 页面属于转述，不是书的原文。）
- **产品例**：按住空格临时切抓手工具（Figma、Photoshop）就是 quasimode；Vim 的 normal/insert 是经典 mode。【产品例为我的观察】
- **Demo**：同一个画布，分别用“点一下切换到平移模式”和“按住空格平移”完成 10 次“平移 → 选中”交替操作，统计误操作次数。

### 2.2 Change blindness 与 inattentional blindness

- **一手数据**：Simons & Chabris 1999（Perception 28:1059–1074）的 192 名观察者中，**46% 没看到**穿过画面的大猩猩/撑伞女人；任务越难越看不到（易 64% 看到，难 45% 看到）。http://www.chabris.com/Simons1999.pdf 。Simons & Levin 1998 的“门”实验里，约一半行人没发现问路的人被换掉了（这个数字来自二手材料【未核实原文】）。https://www.apa.org/monitor/oct06/eyes
- **UI 机制**：没有运动线索的变化（闪一下、页面重载）很容易被漏掉；同时发生的多个变化会互相掩盖。NN/g 的例子：Aldiko 打开菜单的同时把溢出按钮换成了搜索图标，用户盯着菜单，没看到替换。https://www.nngroup.com/articles/change-blindness-definition/
- **UI 技法**：一次只改一处；变化放在注意焦点附近；用短动画指出“哪里变了”，但不要多个动画抢注意；把不变的区域压暗。同上来源。
- **Demo**：点“保存”后，同时出现顶部成功条和底部计数变化。让读者盯着按钮点击，事后问计数变了没有；再切到“变化出现在按钮旁 + 120ms 位移动画”的版本对比。

### 2.3 Working memory：别再用 7±2

- **原文说了什么**：Miller 1956 讲的是两件不同的事：absolute judgment（一维刺激平均约 2.6 bit，约 6.5 个可分辨等级）和 immediate memory（按 chunk 计）。他明确说这两者是“quite different kinds of limitations”，结尾还怀疑反复出现的七“only a pernicious, Pythagorean coincidence”。http://psychclassics.yorku.ca/Miller/
- **现在的主流估计**：Cowan 2001（BBS 24:87–114）认为 Miller 的七更多是粗略估计和修辞，真实的中央容量限制平均约 **4 个 chunk**（3–5）。https://pubmed.ncbi.nlm.nih.gov/11515286/
- 【神话】“菜单最多 7 项”。NN/g 直接称之为常见误解：菜单是靠认出来用的，不需要记住，长菜单也可以；菜单过短反而让选项变得抽象难懂。https://www.nngroup.com/articles/short-term-memory-and-web-usability/
- **真正的设计含义**：不要求用户**跨屏幕带着信息走**。比较表、购物车、浏览器标签就是“外部记忆”。https://www.nngroup.com/articles/working-memory-external-memory/ 。另外，短期记忆约 20 秒就会消退，这也是连串 coach marks 失效的原因（见 4.6）。
- **Demo**：让读者在 A 页记住 4 个参数，去 B 页填写；对照版在 B 页侧边显示 A 页摘要。比较出错率。

### 2.4 Recognition over recall

- **机制**：recognition 提供更多检索线索，所以选择题比填空题容易。命令行要求 recall，菜单只要求 recognition；搜索建议把写查询的一部分变成 recognition；最近项目、历史记录帮助用户恢复中断的任务；手势界面依赖 recall，所以需要提示和清楚的 signifier。https://www.nngroup.com/articles/recognition-and-recall/
- **产品例**：命令面板（Linear、VS Code 的 ⌘K）把“记住快捷键”变成“打几个字再认出来”，并在条目旁显示快捷键，让 recognition 慢慢变成 recall。【后半句为我的观察】
- **Demo**：同一个“给文字加删除线”任务，三种入口：只有快捷键 / 工具栏图标无文字 / 带搜索的命令面板。

### 2.5 Hick–Hyman 与 Fitts：两条“定律”的真实范围

- **Fitts's law**：T = a + b·log₂(2D/W)，时间随距离和尺寸按对数变化；a、b 依赖指点设备。屏幕边缘对鼠标是近乎无限大的目标（macOS 菜单栏在顶部），但**触屏上的边缘目标反而更慢**；padding 只在用户感知得到时才有用。上下文菜单应靠近触发点。https://www.nngroup.com/articles/fitts-law/
- **Fitts 不管的事**：它只预测“移到目标”的时间，不管“找到目标”和“决定点哪个”。
- **Hick–Hyman**：决策时间随**等概率**选项数按对数增长。但 Cockburn、Gutwin、Greenberg（CHI 2007）的菜单模型把它只用于**专家**的决策时间；**新手**是线性的视觉搜索，再加上 Fitts 指点时间和新手到专家的过渡项。https://www.springerprofessional.de/doi/10.1145/1240624.1240723 （只读到摘要级信息，模型参数【未核实】）
- 【神话】“选项越多越慢，所以砍选项”。对新手来说，慢在“读和找”，解决办法是排序、分组、搜索，不一定是砍；对熟练用户来说，选项多的代价是对数增长，很小。
- **Demo**：一个 Fitts 小实验：读者点击不同大小、不同距离的目标，实时画出 log₂(2D/W) 与耗时的散点；再加一个“目标贴着窗口边缘”的版本（鼠标）。Hick 部分：同一个 16 项菜单，乱序和按字母排序，计时。

### 2.6 响应时间：0.1 / 1 / 10 秒，以及 Doherty threshold 的真相

- **Nielsen 的三个界限**（1993，引用 Miller 1968 和 Card 等 1991）：0.1s 感觉即时，只需显示结果；1s 思路不断，但已失去“直接操作数据”的感觉；10s 是注意力的极限，超过就要给 percent-done 进度并允许中断。2–10s 的任务用完整进度条可能过度，会闪烁。https://www.nngroup.com/articles/response-times-3-important-limits/
- 【神话 / 被夸大】**Doherty threshold “400ms”**。Laws of UX 说 Doherty & Thadani 1982 把目标定为 400ms、低于它用户会觉得“addicting”。https://lawsofux.com/doherty-threshold/ 但我核对了 IBM 报告 *The Economic Value of Rapid Response Time*（GE20-0752，作者拼写是 Thadhani）的全文转载：**原文里没有“400 ms”，也没有“addict”**。原文的数据是 Thadhani 测到：响应 3 秒时程序员每小时约 180 次事务，0.3 秒时升到 371 次（+106%）；文中的历史基准是 Miller 提的 2 秒。https://jlelliotton.blogspot.com/p/the-economic-value-of-rapid-response.html （博客转载 IBM 页面；IBM 原页 https://www.vm.ibm.com/devpages/jelliott/evrrt10.html 当时证书报错打不开。）**可以引用的说法是“亚秒级响应显著提高交互频率”，不是“400ms 阈值”**。400ms 可能来自报告里的图表，扫描版 PDF 我没能提取文字【未核实】。
- **Demo**：同一个筛选列表，把延迟调成 50 / 300 / 1000 / 3000ms，读者连续改 5 次筛选，记录他们在 3000ms 时是否开始“改完就等”而不是“边改边看”。

---

## 3. 心智模型与行动：让人知道能做什么、做了会怎样

### 3.1 Affordance 与 signifier

- Norman 说 affordance 来自 Gibson，而 Gibson 的 affordance 不必可见、甚至不必可知；他 1988 年引入设计时其实指的是“perceivable affordances”。他后来强调设计要提供的是 **signifier**：一个可以被有意义地解读的信号，“The perceivable part of an affordance is a signifier”。他也承认 affordance 这个词被广泛误用。https://jnd.org/signifiers-not-affordances/
- **UI 含义**：按钮“能点”不重要，“看起来能点”才重要。扁平化后的问题常常不是用户不会点链接，而是**没认出那是链接**，NN/g 把这归为 gulf of evaluation 的问题。https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/
- **Demo**：同一行文字依次是：纯文本、只变色、变色 + 下划线、hover 时出现指针和下划线。问读者“哪个能点”。

### 3.2 两道鸿沟：execution 与 evaluation

- Hutchins、Hollan、Norman 1986 提出：gulf of execution 是“想好怎么操作”，gulf of evaluation 是“看懂系统现在什么状态”。NN/g 作者的例子：Windows 10 的蓝牙开关，状态显示了，但标签和开关的运动方向让人读反，花了一小时；“Hide notifications = Off”是双重否定。补救：状态要能**被解读**而不只是被显示；措辞用正向，“On”表示有事在发生；排查时先分清是感知、解读、计划还是操作出了问题。https://www.nngroup.com/articles/two-ux-gulfs-evaluation-execution/
- Mapping（控件与结果的空间对应）、constraints（限制可做的动作）出自 Norman《The Design of Everyday Things》，本次没有抓到在线原文【未核实原文措辞】。
- **Demo**：同一个设置分别用“Hide notifications”开关、“Show notifications”开关、checkbox 三种写法，问读者“现在通知是开还是关”。

### 3.3 Feedforward：在动作之前告诉人结果

- Vermeulen、Luyten、van den Hoven、Coninx 在 CHI 2013（DOI 10.1145/2470654.2466255）里主张：feedforward 和 feedback、perceived affordance 是不同的东西，是弥合 gulf of execution 的、被低估的手段；他们区分了相关原则，提出新的 feedforward 类别和一个帮设计师找机会的参照框架。https://opus.cloud1.lib.uts.edu.au/handle/10453/26900 。后来的文献把它概括为“帮助用户在执行动作之前预见结果的设计” https://arxiv.org/html/2502.14229
- 具体类别（我记得有 hidden / false / sequential / nested feedforward，并沿用 Wensveen 等的 inherent / augmented / functional 划分）**【未核实】**：作者版 PDF 托管在 Hasselt 大学，该服务器目前因爬虫流量限制外部访问。
- **UI 技法与例子**：拖拽时的落点预览、hover 时显示“将删除 3 个文件”、Figma 对齐线在松手前出现、按钮文案写结果（“删除 3 项”而不是“确定”）。【例子为我的整理】
- **Demo**：拖一张卡片到看板列：A 版松手后才跳过去；B 版拖动时目标列出现占位槽。

### 3.4 Direct manipulation（Shneiderman）

- 1982 年提出、1983 年 IEEE Computer 发表的三条：对象和动作的**持续可见表示**；用物理动作或按带标签的对象代替复杂语法；**快速、增量、可撤销**、效果立即可见的操作。https://www.cs.umd.edu/~ben/about.html
- 它和 0.1s 界限（2.6）是同一件事的两面：超过 0.1s，“直接操作”的感觉就开始消失。
- **Demo**：颜色调节：输入数值后点“应用” vs 拖滑杆实时变化 vs 拖滑杆但有 300ms 延迟。

### 3.5 习惯与惯例：Jakob's law

- Nielsen 2000 年提出：用户大部分时间花在**别的**网站上，所以他们希望你的网站和他们已知的那些一样工作；偏离预期会损害可用性，这条也适用于 App。https://jakobnielsenphd.substack.com/p/jakobs-law 、https://nngroup.com/videos/jakobs-law-internet-ux/
- 这正是“先抄参考产品”的理论依据：惯例本身就是用户已经付过的学习成本。
- **Demo**：把 ⌘K、Esc 关弹窗、logo 回首页等惯例故意改掉一项，让读者完成任务，记录第一次失败发生在哪。

---

## 4. 引导：信息引导与交互引导

### 4.1 信息引导：层级、wayfinding、progressive disclosure

- **Progressive disclosure**：先给少数最重要的选项，按需再展开。成功的两个条件：分得对（常用的都在首屏、首屏不乱），以及往下走的路径明显、标签能让人预测展开后是什么。**超过两层**通常会损害可用性。Staged disclosure（向导）只适合步骤之间相互依赖少的任务。https://www.nngroup.com/articles/progressive-disclosure/
- **Wayfinding 与“3 次点击”**：【神话】3-click rule“没有数据支持”。NN/g 引 Porter 2003：超过 3 次点击时流失率和满意度都没有变差。真正重要的是 information scent（标签能让人闻到目标在哪）、面包屑、mega menu、加载速度。https://www.nngroup.com/articles/3-click-rule/
- **滚动**：【神话】“用户不滚动”。2010 年约 80% 的浏览时间在首屏，2018 年降到 57%；74% 在前两屏。但用户仍很少看到第三屏以后，只在有理由时才滚。要提供“下面还有”的信号（例如被截断的内容），避免 false floor。https://www.nngroup.com/articles/scrolling-and-attention/
- **Demo**：打印对话框的两版：全部选项平铺 vs 常用 + “更多设置”。另做一个页面，首屏底部是整齐的通栏色块 vs 露出半张卡片，看读者会不会往下滚。

### 4.2 空状态就是教学

- NN/g 的三条：说明系统状态（是在加载、出错，还是真的没东西）；提升可学习性：空状态在用户接触相关元素时出现，所以“有时被称为 pull revelations”，例如 DataDog 的“Star your favorites to list them here”；给出直达关键任务的入口（Loggly 提供“添加日志源”和“加载演示数据”两条路）。注意别在加载完成前先闪一个“无记录”。https://www.nngroup.com/articles/empty-state-interface-design/
- **Demo**：同一个“收藏”面板的空状态：空白 / “暂无数据” / 一句话说明如何添加 + 按钮。

### 4.3 默认值与 choice architecture

- **一手数据**（Johnson & Goldstein 2003，Science 302:1338）：线上实验 161 人，opt-in 条件同意捐献 **42%**，opt-out **82%**，无默认的中性条件 **79%**，opt-out 与中性无显著差异。欧洲 4 个 opt-in 国家的有效同意率 4.25%–27.5%，6 个 opt-out 国家 85.9%–99.98%，两组相差近 60 个百分点。作者给出的三种解释：默认值被当成推荐；接受默认不费力；改变默认意味着损失（loss aversion）。https://www.dangoldstein.com/papers/DefaultsScience.pdf
- 【常被夸大】同一篇文章里，**实际捐献率**只从每百万人 14.1 升到 16.4（+16.3%），远小于同意率的差距，因为还有家属反对、医生犹豫等因素。https://www.dangoldstein.com/papers/DefaultsScience.pdf ；批评文章还指出西班牙等国实际仍会询问家属，Thaler 本人更倾向 mandated choice（强制选择）。https://blog.jcx.au/posts/does-presuming-you-can-take-a-persons-organs-save-lives
- **UI 含义**：默认值是最强的引导，也最容易滥用（预勾选的订阅）。中性条件 79% 接近 opt-out 的 82%，说明**让人主动选一次**往往就够了，而且更诚实。
- **Demo**：同一个“发送匿名使用数据”选项，三种形态：预勾选 / 不勾选 / 必须二选一才能继续。

### 4.4 Inline validation：时机比有无更重要

- **Wroblewski + Etre**：22 名用户、6 个注册表单版本。最好的 inline 版本对比提交后才校验：成功率 +22%，错误 −22%，满意度 +31%，完成时间 −42%，注视次数 −47%。**“离开字段后”校验最快**；边输入边校验让人打一个字等一下；“输入前 + 输入中”错误率最高、满意度最低。对用户名、密码这类答案不确定的字段帮助最大（80–100% 注意到提示），简单字段只有 30–50% 注意到；简单字段上的绿勾反而让人困惑：是“正确”还是只是“格式有效”？https://alistapart.com/article/inline-validation-in-web-forms/
- **Baymard**：约 31% 的电商站没有 inline validation。不要过早报错；多数字段在 blur 时校验，定长字段（邮编、卡号、CVV）达到长度时校验；**错误一旦修正就要立刻在每次按键时清除**。https://baymard.com/blog/inline-form-validation
- 合起来的规则是一个不对称：**报错要晚（等用户写完），消错要早（一改对就消失）**。
- **Demo**：一个邮箱字段，切换四种策略：提交时 / 按键时 / blur 时 / blur 报错 + 按键消错。读者故意打错再改，感受每种策略“被冤枉”和“被晾着”的时刻。

### 4.5 防错、错误信息、undo 与确认框

- **Raskin（Aza）**：用户点多了“确定”就会形成习惯，反射性地关掉警告，照样丢数据；把警告做得更响、更难关也解决不了，只会更烦。正确做法是让破坏性操作可撤销：“Never use a warning when you mean undo.” 他用 Gmail 删除后的 undo 作正例，Google Calendar 只有警告没有 undo 作反例。https://alistapart.com/article/neveruseawarning/
- **Jef Raskin**：universal undo 让人可以放心尝试，配合自动保存就不需要显式保存。https://www.raskincenter.org/rchi/core-principles
- **怎么选**：可撤销的操作用 undo（toast 里的“撤销”）；真正不可逆、代价大、且不常发生的操作才用确认，而且确认要打断习惯（例如要求输入仓库名，像 GitHub 删库那样）。【GitHub 例子为我的观察】
- **Demo**：连续删除 10 封邮件，其中第 7 封是“重要”的。A 版每次弹确认框，B 版是 undo toast。数一数 A 版里读者有没有反射性点掉第 7 次确认。

### 4.6 Onboarding：push vs pull，coach marks 为什么被忽略

- **NN/g**：把教程、更新弹窗、“What's New”这种脱离上下文的帮助叫 **push revelations**；在信号表明用户此刻需要时才出现的叫 **pull revelations**。教程会打断用户正在做的事，常被跳过，**也不能可靠地提升任务表现**；关掉之后需要时又想不起来。背后是 paradox of the active user：用户只想马上开始用。建议：帮助可关也可找回（Evernote 侧栏保留 What's New）；渐进披露（Photoshop 的 tooltip 带短动画和“Learn how”）；多步流程里每一步就地给帮助；不解释齿轮这种约定俗成的图标。Figma 在用户添加文本框**之后**才提示文本布局，就是对的时机。https://www.nngroup.com/articles/onboarding-tutorials/
- **Coach marks**：用户是来完成任务的，不是来学界面的；看浮层时没法同时操作，只能先记住步骤，而记忆约 20 秒就消退。避免成串的提示（会让 App 显得复杂、被关得更快）；只用于一个独特或不熟悉的功能；提示要和界面在视觉上明显不同，否则用户会以为浮层本身可以点（Wimbledon App 的例子）。https://www.nngroup.com/articles/mobile-instructional-overlay/
- **Krystal Higgins**：先做 implicit onboarding，让产品的结构、设计和行为本身来引导；显式提示只用来点出少数差异化功能；被关掉的引导会被忘记，所以重要功能应在核心界面里被强调；约束条件在出错时再解释，而不是提前讲。https://www.kryshiggins.com/explicit-onboarding/ 。“push / pull revelations”这对术语我在她的站点上**没有找到**，NN/g 使用了这对术语，最早出处【未核实】。
- **Demo**：同一个 App 的首次使用：A 版 5 步 coach marks 连播，B 版在用户第一次进入相关功能时只给一条就地提示。结束后测试“第三步讲的是什么”。

---

## 5. 神话与夸大清单

| 说法 | 一手资料实际说的 |
|---|---|
| 工作记忆 7±2，所以菜单 ≤7 | Miller 讲的是两种不同限制，并怀疑七是巧合；Cowan 估计约 4 chunk；NN/g 称“菜单 ≤7”为误解 |
| 用户按 F 形看页面，要迎合它 | F 形是无格式长文的失败模式；NN/g 说好设计能避免它，layer-cake 更有效 |
| 用户不滚动 | 2018 年 57% 的浏览时间在首屏，其余在下面；但很少看到第三屏以后 |
| 3 次点击规则 | 无数据支持；Porter 2003 发现超过 3 次点击不增加流失 |
| Doherty threshold = 400ms，“上瘾” | IBM 报告转载全文没有 400ms 和 addict；数据是 3s→0.3s 事务数翻倍 |
| 默认值让捐献率翻几倍 | 同意率差近 60 个百分点，但实际捐献只增约 16% |
| Hick's law：选项多就慢，所以砍选项 | 对新手是线性的视觉搜索；对数决策时间主要适用于专家 |
| preattentive = 完全不用注意力 | Healey：已知注意力在早期视觉也起作用，这个词只是沿用 |
| 屏幕边缘目标总是更快 | 鼠标成立；触屏上边缘目标更慢 |

## 6. 未能核实的点

- Doherty 报告扫描版 PDF 的图表（400ms 是否出现在图里）。
- Vermeulen 等 2013 的完整 feedforward 分类（Hasselt 服务器限制外部访问）。
- Simons & Levin 1998 门实验的精确比例（只有二手材料）。
- Norman 关于 mapping / constraints 的原书措辞。
- Cockburn 等 2007 模型的公式和参数。
- “push / pull revelations”术语的最早出处。
- Colin Ware《Information Visualization: Perception for Design》本次没有读到在线原文，preattentive 部分全部依据 Healey。
