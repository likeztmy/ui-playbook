# 试点方案：Input 页重做 + 一页底层原则

日期：2026-10-22（修订版）。依据是 `docs/research/2026-10-22-good-interface-design.md`。这份是方案，确认后才动手。

## 修订：别此地无银三百两

第一版把研究里的做法直接搬到了页面上，结果处处在替读者把话说尽，等于默认读者看不懂。这一版的原则是：**研究方法是我们写页面时的纪律，不是贴在页面上的标签。** 删改如下：

| 第一版 | 问题 | 改成 |
|---|---|---|
| demo 上方加一行任务：“输入 ana@stu，按 Tab……” | 手把手地带，像在做实验 | 删掉。demo 自己邀请读者动手：字段里已经填了一个写了一半的邮箱，读者自然会去补完、离开。只有操作不容易被发现时，才沿用现在 Frame 上那种简短标签 |
| 标题下写 **Only change: …** | 不打自招，标题本身已经点明 | 删掉。“只改一个量”是写 demo 时的纪律，页面上不写 |
| 说明默认折叠进 “Why”，等读者动手后再看 | 预设读者会偷看答案，把人当学生 | 删掉折叠。说明照常显示，但只写 demo 看不出来的东西：原因、出处、什么时候反过来。不复述读者刚才看到的现象 |
| 说明固定三行：“你刚才遇到了什么……” | 替读者描述感受 | 删掉模板。说明能一句说完就一句 |
| Before 上方标出“出处：Instagram”，没出处时标“研究中的模式” | 像点名批评，又像在自证清白 | 出处只在说明里放一个链接，像脚注一样 |
| #4 标“二手引用” | 把我们自己的不确定贴给读者看 | 核实不了的结论不上页面。#4 先不做 |
| 原则页的“被冤枉 / 被晾着”计数器 | 替读者打分，告诉读者该有什么感受 | 删掉。四种时机并排放，读者自己就能感觉到 |
| 原则页标题 “Late to accuse, quick to forgive” | 太俏皮 | 用平实的：**Error timing** |

---

## 一、Input 页：新顺序

```
标题 + 一句话
① 场景：一张寄送地址表单（先用一次）
② 逐项细节 ×4（Before | After，一句话说明）
③ 参考层：Variants · Anatomy（含两张标注图） · States
④ Known issues
⑤ Common mistakes · Copy（和 ② 重复的删掉）
```

When to use 压成三行，放在 ① 下面。

### ① 场景：Shipping address

- **内容**：一张真实的表单，字段有 Full name、Email、Street、Postal code、City，再加一个 Continue 按钮。用真实长度的内容，比如 “Zoë Laurent”、“Torstraße 1”。Email 里预填了一个没写完的地址。
- **点 Continue**：
  - 有错误时，错误显示在各自字段下面，焦点跳到第一个出错的字段；
  - 没有错误时，表单换成一张摘要卡，可以点 Edit 回去改。
- **没有额外的提示文字。**

### ② 四项细节

每项只放 Before 和 After，下面一句话说明，出处做成链接。

| # | 标题 | Before | 说明要讲的（demo 看不出来的部分） |
|---|---|---|---|
| 1 | Check when they leave, not while they type | 边输入边校验 | 这么做为什么伤人；研究数字（完成时间少 42%）；链接到原则页（[Wroblewski](https://alistapart.com/article/inline-validation-in-web-forms/)） |
| 2 | The error sits under its field | 错误显示在表单顶部，样式很淡 | 注意力在按钮上，所以离得远的变化会被漏看；Instagram 就是这样做的（[NN/g](https://www.nngroup.com/articles/error-message-guidelines/)） |
| 3 | A label above, an example inside | 用 placeholder 代替标签 | 文字一消失，就只能靠记忆；回头检查时认不出哪一格是哪一格（[NN/g](https://www.nngroup.com/articles/form-design-placeholders/)） |
| 4 | Width says how much to write | 所有字段一样宽 | 宽度不对时，测试者会怀疑自己读错了标签，CVV 一类的字段最明显（[Baymard](https://baymard.com/blog/form-field-usability-matching-user-expectations)） |

下划线输入框那一项，等 Google 的研究原文核实后再加。

现在页面上的 “Focus is the edge” 和 “An embedded key is concentric”，改成 Anatomy 里的两张静态标注图。它们讲的是几何关系，不是行为。

### ④ Known issues

只写事实，每条一句话：

- **iOS Safari 会放大页面。** 输入框字号小于 16px 时，聚焦就会放大。我们现在是 14px，所以要先在模拟器上确认，再修掉。修完以后，这条作为写给读者的提醒留下。
- **`type="email"` 会抢先报错。** 浏览器用自己的语言提示，而且比我们的提示先出来。
- **自动填充的背景色**、**密码管理器图标盖住尾部**：这两条先查，确认存在才写进页面。

### 测试

保留现有测试。新增一条：场景表单提交后，焦点落在第一个出错的字段上。

---

## 二、原则页：Error timing

放在 Principles 下面，slug 是 `error-timing`。

1. **一句话**：等写完再报错，一改对就消掉。
2. **四种时机并排**：同一个邮箱字段，分四格——提交时校验、每次按键校验、离开时校验、离开时报错且按键时消错。字段里预填同一个没写完的地址，读者自己去试。
3. **一段说明**：讲清两种代价各自的原因，并附研究数字（[Wroblewski](https://alistapart.com/article/inline-validation-in-web-forms/)，[Baymard](https://baymard.com/blog/inline-form-validation)，[NN/g](https://www.nngroup.com/articles/error-message-guidelines/)）。
   - 提前报错：还没写完就被判错。
   - 改对后错误还挂着。
4. **同一条原则在别处**：
   - 密码规则，满足一条就当场变绿；
   - 数字超出范围，离开时再提示。
5. **什么时候反过来**：
   - 定长字段一到长度就校验；
   - 用户名被占用，停止输入后就可以提示，因为这是用户想知道的信息。
6. **反向链接**：链回 Input、Combobox。

---

## 三、要你决定的（三点）

1. **原则页选哪个题目？** 推荐 **Error timing**，它和 Input 直接相连，证据最硬。备选是“一次只让一种特征说话”。
2. **找不到具名产品的 Before 怎么办？** 推荐：只要研究支持就照做，出处做成链接，页面上不额外说明。比如 #3 的 placeholder 当标签就是这样。
3. **页面语言。** 推荐保持英文。

确认后的顺序：改 `Compare`（说明里支持出处链接）→ 重做 Input 页 → 做原则页 → 验收、测试、部署。
