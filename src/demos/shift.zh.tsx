// Chinese notes for the Nothing shifts demos. The demos themselves stay in
// English; the notes name what's on screen as it appears there.

export const zh = {
  searchBefore: (
    <>
      完整搜索结果在最后一次按键 0.7 秒后才到，作为一组插到最近看过的页面上面。这时指针正朝某个最近页面移动，落下时那一行，或者按 Enter
      会打开的那一行，已经换成了别的。这么晚的位移已经不算对按键的回应，
      <a href="https://web.dev/articles/cls">CLS</a> 会把它算进去。
    </>
  ),
  searchAfter: '同一组结果，排在屏幕上已有的行后面。读者瞄准的那一行留在原地；更好的匹配就在下面一眼的距离，下一次按键再把它们排到前面。',
  boldBefore: '粗体字更宽。指针经过的每个链接都会变宽，后面的链接跟着挪：正要点的那一个滑走了。',
  boldAfter: (
    <>
      每个链接里还藏着一份加粗的、看不见的自身文字，所以它一开始就占好了最宽时的宽度（
      <a href="https://css-tricks.com/bold-on-hover-without-the-layout-shift/">CSS-Tricks</a>
      ）。悬停改用底色表示，字重就根本不用变。
    </>
  ),
  scrollbarBefore: (
    <>
      输入“an”：列表不再溢出，滚动条消失，每个角色名向右跳 12px。在 Mac
      和手机上，滚动条浮在内容上方、不占位置，所以做的人从没见过这个问题；在 Windows 上，以及所有一直显示滚动条的地方，每个人都会遇到。
    </>
  ),
  scrollbarAfter: (
    <>
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter">
        <code>scrollbar-gutter: stable</code>
      </a>{' '}
      不管滚动条在不在，都给它留着位置。浮动滚动条本来就不占位置，所以在没有问题的地方它什么也不改变。
    </>
  ),
  anchorBefore: (
    <>
      设了 <code>overflow-anchor: none</code>
      ，更早的消息加载到正在读的那条上面，把它推出窗口：读者回到了最开始的启动讨论，得重新找自己读到哪了。
    </>
  ),
  anchorAfter: (
    <>
      默认行为。浏览器在屏幕上选一条消息作为
      <a href="https://drafts.csswg.org/css-scroll-anchoring/">锚点</a>
      ，上方加了多少内容，就正好滚动多少。在最顶部它做不到，因为上面没有可以保持的东西，所以聊天会在读者翻到顶之前就开始加载。所有浏览器引擎都支持锚定，是
      2026 年才有的事（
      <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>
      ）。
    </>
  ),
  fontBefore: '网页字体到达之前，文字用 Arial 排版，它比 Geist 窄约 2.5%。Geist 换上来时，折行位置变了，段落下面的一切都跟着动。',
  fontAfter: (
    <>
      备用字体是用 <code>size-adjust</code> 缩放到 Geist 宽度的 Arial，所以换字体时变的是字形，不是折行（
      <a href="https://web.dev/articles/css-size-adjust">web.dev</a>）。Next.js 默认会为它加载的字体生成这样的备用字体（
      <a href="https://nextjs.org/docs/app/api-reference/components/font">adjustFontFallback</a>
      ）。
    </>
  ),
};
