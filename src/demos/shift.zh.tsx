// Chinese notes for the Nothing shifts demos, written the way Chinese
// developers talk: from the meaning, not sentence by sentence, and with the
// ecosystem's English terms kept (layout shift, CLS, scroll anchoring,
// fallback font). The demos stay in English, so the notes name what's on
// screen as it appears there.

export const zh = {
  searchBefore: (
    <>
      最后一次按键 0.7 秒后，完整结果才回来，整组插到 Recent 上面。这时指针正往某个最近看过的页面去，落下时那一行已经换成别的了；按 Enter
      打开的也不是原来那页。这么晚的 shift 已经不算在回应按键，<a href="https://web.dev/articles/cls">CLS</a> 会把它算进去。
    </>
  ),
  searchAfter: '同一组结果，排在已有的行下面。用户瞄着的那一行原地不动；更好的结果就在下面，等下一次按键再往前排。',
  boldBefore: '粗体比常规字宽。指针扫过去，链接一个个变宽，后面的跟着往右挪，正要点的那个就跑了。',
  boldAfter: (
    <>
      每个链接里藏一份看不见的粗体文字，先把最宽时的位置占好（
      <a href="https://css-tricks.com/bold-on-hover-without-the-layout-shift/">CSS-Tricks</a>
      ）。更省事的做法是 hover 只换背景色，字重压根不动。
    </>
  ),
  scrollbarBefore: (
    <>
      输入 “an” 后列表不再溢出，滚动条没了，右边 Owner、Editor 那一列整体右跳 12px。Mac 和手机的滚动条浮在内容上，不占宽度，做的人自己多半没见过这个问题。可在
      Windows 这种滚动条常驻的环境里，每个用户都会碰到。
    </>
  ),
  scrollbarAfter: (
    <>
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter">
        <code>scrollbar-gutter: stable</code>
      </a>{' '}
      让滚动条不管出不出现，都留着它的位置。浮动滚动条本来就不占地方，这条规则对它没用，也用不着。
    </>
  ),
  anchorBefore: (
    <>
      设了 <code>overflow-anchor: none</code>
      ，更早的消息加载出来，插在正在读的那条上面，把它挤出了视野。用户一下回到最早的讨论，只能重新找刚才读到哪儿。
    </>
  ),
  anchorAfter: (
    <>
      这是浏览器默认的 <a href="https://drafts.csswg.org/css-scroll-anchoring/">scroll anchoring</a>
      ：它在屏幕上挑一条消息当 anchor，上面加了多少内容，就跟着滚多少，看起来什么都没动。滚到最顶上时没有 anchor 可挑，就不生效了，所以聊天应用都会在用户滚到顶之前开始加载。主流浏览器到
      2026 年才全部支持（<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>）。
    </>
  ),
  fontBefore: 'Web font 加载完之前，文字先用 Arial 显示，它比 Geist 窄 2.5% 左右。换成 Geist 后折行位置变了，段落下面的东西全跟着挪。',
  fontAfter: (
    <>
      这里的 fallback font 还是 Arial，但用 <code>size-adjust</code> 缩放到和 Geist 一样宽。换字体时只是字形变了，折行不变（
      <a href="https://web.dev/articles/css-size-adjust">web.dev</a>）。Next.js 加载字体时默认就会生成这种 fallback font（
      <a href="https://nextjs.org/docs/app/api-reference/components/font">adjustFontFallback</a>）。
    </>
  ),
};
