// Chinese notes for the Nothing shifts demos. Plain, spec-style Chinese
// written from the meaning: full sentences, no slogans, an English term
// given once beside its Chinese name. The demos stay in English, so the
// notes name what's on screen as it appears there.

export const zh = {
  searchBefore: (
    <>
      完整搜索结果在最后一次按键 0.7 秒后才返回，作为一组插在 Recent 上方。这时指针正移向某个最近浏览的页面，落下时那一行已经换成了别的内容，按
      Enter 打开的也不是原来那一页。这次偏移离按键太远，不再算作对按键的响应，<a href="https://web.dev/articles/cls">CLS</a> 会把它计入。
    </>
  ),
  searchAfter: '同一组结果排在已有内容下方。用户正要点的那一行位置不变；更匹配的结果就在下面，下一次按键时再排到前面。',
  boldBefore: '粗体比常规字体宽。指针经过时，链接依次变宽，后面的链接随之右移，用户正要点的链接也跟着移走了。',
  boldAfter: (
    <>
      每个链接内放一份不可见的粗体文字，预先占住加粗后的宽度（
      <a href="https://css-tricks.com/bold-on-hover-without-the-layout-shift/">CSS-Tricks</a>
      ）。更简单的做法是悬停时只改变背景色，不改变字重。
    </>
  ),
  scrollbarBefore: (
    <>
      输入 “an” 后列表不再溢出，滚动条消失，右侧 Owner、Editor 一列整体右移 12px。Mac 和手机上的滚动条浮在内容上方，不占宽度，开发者自己很少遇到这个问题。但在
      Windows 等始终显示滚动条的环境中，每个用户都会遇到。
    </>
  ),
  scrollbarAfter: (
    <>
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter">
        <code>scrollbar-gutter: stable</code>
      </a>{' '}
      会始终为滚动条预留宽度，不论它是否出现。浮动滚动条本身不占宽度，所以这条规则对它没有影响。
    </>
  ),
  anchorBefore: (
    <>
      设置 <code>overflow-anchor: none</code>
      后，较早的消息加载出来，插在正在阅读的消息上方，把它推出了可见区域。用户回到了对话开头，需要重新寻找刚才读到的位置。
    </>
  ),
  anchorAfter: (
    <>
      这是浏览器的默认行为，称为滚动锚定（<a href="https://drafts.csswg.org/css-scroll-anchoring/">scroll anchoring</a>
      ）。浏览器在屏幕上选一条消息作为锚点，上方增加了多少内容，就同步滚动多少，所以阅读位置保持不变。滚动到最顶部时没有锚点可选，锚定不会生效，因此聊天应用会在用户滚到顶部之前就开始加载。主流浏览器从
      2026 年起才全部支持这项功能（<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>）。
    </>
  ),
  fontBefore: '网页字体加载完成前，文字先用 Arial 显示，它比 Geist 窄约 2.5%。换成 Geist 后换行位置改变，段落下方的内容随之移动。',
  fontAfter: (
    <>
      这里的后备字体（fallback font）仍是 Arial，但用 <code>size-adjust</code> 缩放到与 Geist 同宽。切换字体时只有字形变化，换行位置不变（
      <a href="https://web.dev/articles/css-size-adjust">web.dev</a>）。Next.js 加载字体时默认会生成这样的后备字体（
      <a href="https://nextjs.org/docs/app/api-reference/components/font">adjustFontFallback</a>）。
    </>
  ),
};
