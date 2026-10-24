// Chinese notes for the Nothing shifts demos. Plain spoken Chinese written
// from the meaning: no stiff connectors (随之, 依次, 因此, 作为), no noun
// repeated where a pronoun or nothing will do, an English term given once
// beside its Chinese name. The demos stay in English, so the notes name
// what's on screen as it appears there.

export const zh = {
  searchBefore: (
    <>
      完整结果要等最后一次按键 0.7 秒后才回来，整组插在 Recent 上面。这时鼠标正要去点某个最近看过的页面，等它落下，那一行已经换成了别的；按 Enter
      打开的也不是原来那页。离按键这么久才发生的偏移，已经不算对按键的响应，<a href="https://web.dev/articles/cls">CLS</a> 会把它算进去。
    </>
  ),
  searchAfter: '同样的结果放到已有内容下面。正要点的那一行留在原地，更匹配的结果就在下面，下次按键时再排到前面。',
  boldBefore: '加粗后字会变宽。鼠标划过导航时，每个链接都会撑宽一点，把后面的链接往右推，想点的那个就被推走了。',
  boldAfter: (
    <>
      每个链接里藏一份看不见的粗体文字，先把加粗后的宽度占住（
      <a href="https://css-tricks.com/bold-on-hover-without-the-layout-shift/">CSS-Tricks</a>
      ）。更省事的办法是悬停时只换背景色，字重不变。
    </>
  ),
  scrollbarBefore: (
    <>
      输入 “an” 后列表不再溢出，滚动条消失，右边 Owner、Editor 那一列整体往右跳了 12px。Mac 和手机上的滚动条浮在内容上，不占宽度，所以开发者自己很少碰到。可在
      Windows 这类一直显示滚动条的系统上，每个用户都会看到。
    </>
  ),
  scrollbarAfter: (
    <>
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter">
        <code>scrollbar-gutter: stable</code>
      </a>{' '}
      会一直给滚动条留出位置，不管它有没有出现。浮动滚动条本来就不占宽度，这条规则对它没有影响。
    </>
  ),
  anchorBefore: (
    <>
      设成 <code>overflow-anchor: none</code>
      后，更早的消息加载出来，插在正在读的那条上面，把它顶出了屏幕。用户一下子回到对话开头，只能重新找刚才读到哪儿。
    </>
  ),
  anchorAfter: (
    <>
      这是浏览器的默认行为，叫滚动锚定（<a href="https://drafts.csswg.org/css-scroll-anchoring/">scroll anchoring</a>
      ）。浏览器会在屏幕上挑一条消息当锚点，上面多出多少内容，就跟着往下滚多少，所以正在读的位置不变。滚到最顶上时没有锚点可挑，锚定就不起作用了，所以聊天应用都会在用户滚到顶之前开始加载。主流浏览器到
      2026 年才全部支持（<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>）。
    </>
  ),
  fontBefore: '网页字体加载完之前，文字先用 Arial 显示，它比 Geist 窄 2.5% 左右。换成 Geist 后，换行的位置变了，段落下面的内容都跟着动。',
  fontAfter: (
    <>
      这里的后备字体（fallback font）还是 Arial，只是用 <code>size-adjust</code> 缩放到和 Geist 一样宽。换字体时字形变了，换行不变（
      <a href="https://web.dev/articles/css-size-adjust">web.dev</a>）。Next.js 加载字体时默认就会生成这种后备字体（
      <a href="https://nextjs.org/docs/app/api-reference/components/font">adjustFontFallback</a>）。
    </>
  ),
};
