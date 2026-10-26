import { useLayoutEffect, useState, type RefObject } from 'react';

/**
 * Characters per line as the reader sees them: every character's box is read back from the layout and
 * grouped by the line it landed on. The last line of each paragraph is short by nature and left out.
 */
export function charsPerLine(el: HTMLElement): number {
  const range = document.createRange();
  const full: number[] = [];
  for (const para of el.querySelectorAll('p')) {
    const lines = new Map<number, number>();
    const walker = document.createTreeWalker(para, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const text = node.textContent ?? '';
      for (let i = 0; i < text.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const box = range.getClientRects()[0];
        if (!box) continue;
        const top = Math.round(box.top);
        lines.set(top, (lines.get(top) ?? 0) + 1);
      }
    }
    full.push(...[...lines.values()].slice(0, -1));
  }
  return full.length ? Math.round(full.reduce((a, b) => a + b, 0) / full.length) : 0;
}

/** Re-counts whenever the box changes size or `deps` change. */
export function useCharsPerLine(ref: RefObject<HTMLElement | null>, deps: unknown[]) {
  const [count, setCount] = useState(0);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setCount(charsPerLine(el));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // The web font may arrive after the first count.
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, deps);
  return count;
}
