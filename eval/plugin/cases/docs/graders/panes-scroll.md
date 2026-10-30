---
type: llm
focus:
  source: file
  path: Docs.module.css
---

This is the stylesheet of a documents app: a sidebar of documents beside the open document.

PASS if the layout holds the window still and lets each pane scroll on its own: the outer shell is the viewport's height (100vh, 100dvh, or the html/body/root chain at 100%) and doesn't let the page scroll; the sidebar's list and the document area each have `overflow-y: auto` (or `scroll`); and every flex or grid item between the shell and a scrolling area that isn't itself the scroller has `min-height: 0` (or the scroller is itself the direct flex/grid item), so a long document can't stretch it past the window.
FAIL if the page as a whole scrolls (no fixed-height shell), so the sidebar moves with the document; or if the shell is fixed but a scrolling area sits inside a flex or grid item with no `min-height: 0`, so it grows with its content and never scrolls; or if either pane has no scrolling of its own.
