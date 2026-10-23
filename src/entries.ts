// Everything the home page lists. Order is the gallery order: components by
// how often they're used, then principles.

export type Entry = {
  slug: string;
  kind: 'component' | 'principle';
  title: string;
  summary: string;
  details: number;
  keywords: string[];
};

export const entries: Entry[] = [
  {
    slug: 'button',
    kind: 'component',
    title: 'Button',
    summary: 'Runs an action now. A filled pill that answers the press: quick down, soft back.',
    details: 5,
    keywords: ['primary', 'secondary', 'ghost', 'hover', 'focus ring', 'action'],
  },
  {
    slug: 'menu',
    kind: 'component',
    title: 'Menu',
    summary: 'Actions or choices that open from a trigger: pull-down, context menu, or choice.',
    details: 8,
    keywords: ['dropdown', 'pull-down', 'context menu', 'right-click', 'sort', 'choice', 'shortcut', 'popup'],
  },
  {
    slug: 'toolbar',
    kind: 'component',
    title: 'Toolbar',
    summary: 'A floating panel of tools, concentric with everything inside it.',
    details: 2,
    keywords: ['panel', 'palette', 'tools', 'toggle', 'inset'],
  },
  {
    slug: 'tooltip',
    kind: 'component',
    title: 'Tooltip',
    summary: 'Names an icon-only control and its shortcut. One line, never clickable.',
    details: 2,
    keywords: ['hint', 'label', 'hover', 'shortcut', 'icon button', 'title'],
  },
  {
    slug: 'popover',
    kind: 'component',
    title: 'Popover',
    summary: 'A small panel from a button: a short job or an explanation. Grows from its trigger, keeps your draft.',
    details: 4,
    keywords: ['popover', 'popup', 'panel', 'flyout', 'share', 'picker', 'info', 'light dismiss'],
  },
  {
    slug: 'dialog',
    kind: 'component',
    title: 'Dialog',
    summary: 'Stops everything for a decision or a short job. Rarely the right call.',
    details: 3,
    keywords: ['modal', 'alert', 'confirm', 'alert dialog', 'sheet', 'popup', 'delete'],
  },
  {
    slug: 'input',
    kind: 'component',
    title: 'Input',
    summary: 'A labelled field for typed text. Checked when you leave it, not while you type.',
    details: 4,
    keywords: ['text field', 'textarea', 'form', 'label', 'placeholder', 'validation', 'error', 'search'],
  },
  {
    slug: 'select',
    kind: 'component',
    title: 'Select',
    summary: 'Picks one value from a short list. Opens over its trigger, marks the current value with a check.',
    details: 4,
    keywords: ['dropdown', 'pop-up button', 'picker', 'options', 'form', 'choice'],
  },
  {
    slug: 'combobox',
    kind: 'component',
    title: 'Combobox',
    summary: 'A Select you can type into. Forgiving matches, the first one ready for Enter, the match in bold.',
    details: 4,
    keywords: ['combobox', 'autocomplete', 'typeahead', 'search', 'filter', 'chips', 'multi-select', 'picker'],
  },
  {
    slug: 'checkbox',
    kind: 'component',
    title: 'Checkbox',
    summary: 'On, off or mixed, sent with the form. The whole row is the target.',
    details: 2,
    keywords: ['check box', 'tick', 'mixed', 'indeterminate', 'select all', 'form', 'option'],
  },
  {
    slug: 'radio',
    kind: 'component',
    title: 'Radio',
    summary: 'Exactly one of a few, all in sight. One is always chosen; arrows move and choose.',
    details: 4,
    keywords: ['radio button', 'radio group', 'option', 'choice', 'one of', 'form'],
  },
  {
    slug: 'switch',
    kind: 'component',
    title: 'Switch',
    summary: 'A setting that takes effect the moment it flips. Label names the setting, never the state.',
    details: 3,
    keywords: ['toggle', 'on off', 'setting', 'preference', 'knob'],
  },
  {
    slug: 'tabs',
    kind: 'component',
    title: 'Tabs',
    summary: 'Views of one thing, one row. An ink bar slides under the current tab; nothing else moves.',
    details: 4,
    keywords: ['tab', 'tab bar', 'sections', 'views', 'underline', 'indicator', 'segmented'],
  },
  {
    slug: 'slider',
    kind: 'component',
    title: 'Slider',
    summary: 'The whole row is the control. A drag follows, a click glides, the ends give a little.',
    details: 5,
    keywords: ['range', 'dial', 'property panel', 'value', 'drag', 'rubber band', 'dialkit'],
  },
  {
    slug: 'segmented-control',
    kind: 'component',
    title: 'Segmented control',
    summary: 'One of two to five modes, all in sight. A single thumb slides to the choice.',
    details: 4,
    keywords: ['segmented', 'toggle group', 'radio group', 'view switcher', 'mode', 'thumb'],
  },
  {
    slug: 'card',
    kind: 'component',
    title: 'Card',
    summary: 'A frame around a grey stage, words beneath. Only cards that open lift.',
    details: 4,
    keywords: ['card', 'tile', 'grid', 'gallery', 'project', 'thumbnail', 'stagger', 'hover lift'],
  },
  {
    slug: 'badge',
    kind: 'component',
    title: 'Badge',
    summary: 'A word or two for a state or an attribute. The words carry it; colour only helps.',
    details: 3,
    keywords: ['badge', 'tag', 'label', 'status', 'pill', 'chip', 'dot'],
  },
  {
    slug: 'table',
    kind: 'component',
    title: 'Table',
    summary: 'Many things by the same attributes. Lines, not stripes; numbers line up on the right.',
    details: 5,
    keywords: ['table', 'data table', 'grid', 'rows', 'columns', 'sort', 'select', 'bulk actions'],
  },
  {
    slug: 'toast',
    kind: 'component',
    title: 'Toast',
    summary: 'A one-line confirmation that offers Undo. Rises from below, colour on the icon only.',
    details: 3,
    keywords: ['toast', 'snackbar', 'notification', 'undo', 'message', 'alert'],
  },
  {
    slug: 'concentric-radius',
    kind: 'principle',
    title: 'Concentric radius',
    summary: 'Inner radius = outer radius − inset. Nested corners share one centre.',
    details: 2,
    keywords: ['border radius', 'corners', 'nesting', 'padding', 'inset'],
  },
  {
    slug: 'colour-means-one-thing',
    kind: 'principle',
    title: 'Colour means one thing',
    summary: 'Blue says “do this now”. Current states speak in shape and shade, so one solid blue is left to find.',
    details: 4,
    keywords: ['colour', 'color', 'accent', 'selected', 'current', 'pop-out', 'preattentive', 'greyscale', 'wcag'],
  },
  {
    slug: 'where-the-eye-goes',
    kind: 'principle',
    title: 'Where the eye goes',
    summary: 'The eye guesses before it reads: it misses changes away from the click, stops where a page looks finished and skips what looks like an ad.',
    details: 4,
    keywords: ['visual hierarchy', 'change blindness', 'false floor', 'illusion of completeness', 'banner blindness', 'proximity', 'gestalt', 'information scent', 'squint test', 'scanning'],
  },
  {
    slug: 'nothing-shifts',
    kind: 'principle',
    title: 'Nothing shifts',
    summary: 'Nothing moves unless it was asked to. A layout that shifts under the pointer sends the click somewhere else.',
    details: 4,
    keywords: ['layout shift', 'cls', 'cumulative layout shift', 'scrollbar-gutter', 'scroll anchoring', 'overflow-anchor', 'size-adjust', 'font fallback', 'bold', 'misclick'],
  },
  {
    slug: 'hover-forgives',
    kind: 'principle',
    title: 'Hover forgives',
    summary: 'The pointer is on its way somewhere. Judge it by where it’s heading, not by the row it happens to cross.',
    details: 2,
    keywords: ['hover', 'submenu', 'safe triangle', 'menu aim', 'diagonal problem', 'steering law', 'hover intent', 'tooltip delay', 'touch'],
  },
  {
    slug: 'error-timing',
    kind: 'principle',
    title: 'Error timing',
    summary: 'Wait until they’ve finished to say it’s wrong; say it’s right the moment it is.',
    details: 1,
    keywords: ['validation', 'inline validation', 'error', 'form', 'blur', 'feedback', 'password rules'],
  },
];

export const href = (e: Entry) => `/${e.kind === 'component' ? 'components' : 'principles'}/${e.slug}`;

// Chinese titles and summaries. Component names stay in English, as the
// ecosystem names them; principles are translated.
const zh: Record<string, { title?: string; summary: string }> = {
  button: { summary: '立刻执行一个操作。一颗实心胶囊，按下时有回应：按下要快，弹回要柔。' },
  menu: { summary: '从触发按钮打开的一组操作或选项：下拉菜单、右键菜单，或选择菜单。' },
  toolbar: { summary: '浮动的一排工具，和里面的每一样东西都同心。' },
  tooltip: { summary: '为只有图标的控件写出名字和快捷键。只有一行，永远不可点。' },
  popover: { summary: '从按钮弹出的小面板：做一件小事，或解释一句。从触发按钮长出来，不丢你写了一半的内容。' },
  dialog: { summary: '为一个决定或一件小事叫停一切。很少是对的选择。' },
  input: { summary: '带标签的文本输入框。离开时才检查，打字时不打扰。' },
  select: { summary: '从一份短列表里选一个值。盖在触发按钮上打开，用对勾标出当前值。' },
  combobox: { summary: '能打字的 Select。匹配宽容，第一项按 Enter 就选，匹配的部分加粗。' },
  checkbox: { summary: '开、关或半选，随表单一起提交。整行都可点。' },
  radio: { summary: '几个选项里恰好选一个，全都摆在眼前。总有一个被选中，方向键边移动边选择。' },
  switch: { summary: '一拨即生效的设置。标签写设置名，不写状态。' },
  tabs: { summary: '同一样东西的几种视图，排成一行。一条墨色指示条滑到当前标签下，别的都不动。' },
  slider: { summary: '整行都是控件。拖动时紧跟，点击时滑过去，到头还能稍微拉一下。' },
  'segmented-control': { summary: '二到五种模式里选一种，全都摆在眼前。一个滑块滑到选中的那一段。' },
  card: { summary: '一个边框围着灰色舞台，文字在下面。只有能打开的卡片才会浮起。' },
  badge: { summary: '用一两个词标出状态或属性。意思靠文字，颜色只是帮衬。' },
  table: { summary: '用同一组属性比较许多东西。用分隔线，不用斑马纹；数字靠右对齐。' },
  toast: { summary: '一行确认，附一个撤销。从下方升起，颜色只放在图标上。' },
  'concentric-radius': { title: '同心圆角', summary: '内圆角 = 外圆角 − 内边距。嵌套的角共用一个圆心。' },
  'colour-means-one-thing': { title: '一种颜色只说一件事', summary: '蓝色只说“现在做这个”。当前状态靠形状和深浅表达，于是屏幕上只剩一块实心蓝，一眼就能找到。' },
  'where-the-eye-goes': { title: '眼睛往哪看', summary: '眼睛先猜再读：它会漏掉点击之外的变化，停在看起来已经结束的地方，跳过看起来像广告的东西。' },
  'nothing-shifts': { title: '界面不乱跳', summary: '没人要求，就什么都别动。指针下的布局一挪，点击就落到了别处。' },
  'hover-forgives': { title: '悬停要宽容', summary: '指针正在去某个地方的路上。按它要去哪儿来判断，而不是按它碰巧经过的那一行。' },
  'error-timing': { title: '报错的时机', summary: '等用户填完再说错了；一旦对了，马上说对了。' },
};

export const titleIn = (e: Entry, lang: 'en' | 'zh') => (lang === 'zh' && zh[e.slug]?.title) || e.title;
export const summaryIn = (e: Entry, lang: 'en' | 'zh') => (lang === 'zh' && zh[e.slug]?.summary) || e.summary;
