// Chinese notes for the Nothing shifts demos. Written from the meaning, not
// sentence by sentence from the English. The demos themselves stay in
// English, so the notes name what's on screen as it appears there.

export const zh = {
  searchBefore: (
    <>
      最后一次按键 0.7 秒后，完整的搜索结果才到，整组插在 Recent 上方。这时指针正要点某个最近看过的页面，等它落下，那一行已经换了内容；按
      Enter 也会打开另一页。位移来得这么晚，已经不是在回应按键，所以 <a href="https://web.dev/articles/cls">CLS</a> 会把它算进去。
    </>
  ),
  searchAfter: '同样一组结果，排到已显示的行后面。用户想点的那一行留在原处；更准的结果就在下方，下一次按键时再排到前面。',
  boldBefore: '粗体比常规字体宽。指针扫过时，每个链接依次变宽，后面的链接跟着往右挪，想点的那个就这么跑了。',
  boldAfter: (
    <>
      每个链接里还藏着一份隐形的粗体文字，提前把最宽时的位置占好（
      <a href="https://css-tricks.com/bold-on-hover-without-the-layout-shift/">CSS-Tricks</a>
      ）。更省事的办法是悬停只改底色，字重压根不变。
    </>
  ),
  scrollbarBefore: (
    <>
      输入“an”后，列表不再溢出，滚动条消失，右边一列角色整体右移 12px。Mac 和手机的滚动条浮在内容上、不占宽度，开发者自己往往从没见过这个问题。可在
      Windows 上，或者任何常驻显示滚动条的环境里，人人都会碰到。
    </>
  ),
  scrollbarAfter: (
    <>
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter">
        <code>scrollbar-gutter: stable</code>
      </a>{' '}
      让滚动条不管在不在，位置都留着。浮动滚动条本来就不占位置，这条规则对它不起作用，也用不着起作用。
    </>
  ),
  anchorBefore: (
    <>
      设了 <code>overflow-anchor: none</code>
      ，更早的消息加载进来，插在正在读的那条上方，把它挤出窗口。用户一下子回到开头的讨论，得重新找刚才读到哪儿。
    </>
  ),
  anchorAfter: (
    <>
      这是默认行为。浏览器在屏幕上挑一条消息当<a href="https://drafts.csswg.org/css-scroll-anchoring/">锚点</a>
      ，上方新增多少内容，就同步滚动多少，看起来什么都没动。滚到最顶端时上方没有参照，锚定就失效了，所以聊天应用会在用户翻到顶之前就开始加载。直到
      2026 年，主流浏览器引擎才全部支持锚定（<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>）。
    </>
  ),
  fontBefore: '网页字体加载完之前，文字先用 Arial 显示，它比 Geist 窄 2.5% 左右。换成 Geist 后，折行位置变了，段落下面的东西全跟着挪。',
  fontAfter: (
    <>
      这里的备用字体还是 Arial，但用 <code>size-adjust</code> 缩放到和 Geist 一样宽。换字体时只有字形在变，折行不变（
      <a href="https://web.dev/articles/css-size-adjust">web.dev</a>）。Next.js 加载字体时，默认就会生成这种备用字体（
      <a href="https://nextjs.org/docs/app/api-reference/components/font">adjustFontFallback</a>）。
    </>
  ),
};
