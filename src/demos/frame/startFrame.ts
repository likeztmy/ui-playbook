import { useEffect, useState } from 'react';

type Box = { x: number; y: number; w: number; h: number };

// Popups whose entrance is worth slowing down; tooltips and backdrops aren't.
const POPUPS = '[role="dialog"], [role="menu"], [role="listbox"], [role="alertdialog"]';

/**
 * While `on`, outlines the first frame of each popup that opens inside
 * `portal` and marks its transform origin. The popup's resting box is its
 * positioner's (which is never scaled); the first frame is that box scaled
 * by enter-scale about the origin and pushed enter-offset away from the
 * trigger, as the popups' own starting style does.
 */
export function useStartFrame(on: boolean | undefined, stage: HTMLElement | null, portal: HTMLElement | null) {
  const [start, setStart] = useState<Box | null>(null);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  useEffect(() => {
    setStart(null);
    setOrigin(null);
    if (!on || !stage || !portal) return;
    const measure = (el: HTMLElement) => {
      const f = stage.getBoundingClientRect();
      const box = (el.parentElement ?? el).getBoundingClientRect();
      const css = getComputedStyle(el);
      const [ox, oy] = css.transformOrigin.split(' ').map(parseFloat);
      const scale = parseFloat(css.getPropertyValue('--enter-scale')) || 1;
      const offset = parseFloat(css.getPropertyValue('--enter-offset')) || 0;
      const side = el.dataset.side;
      const [tx, ty] =
        side === 'bottom' ? [0, -offset] : side === 'top' ? [0, offset] : side === 'right' ? [-offset, 0] : side === 'left' ? [offset, 0] : [0, 0];
      const o = { x: box.left - f.left + ox, y: box.top - f.top + oy };
      setOrigin(o);
      setStart({
        x: o.x - ox * scale + tx,
        y: o.y - oy * scale + ty,
        w: box.width * scale,
        h: box.height * scale,
      });
    };
    const seen = (el: Element) => {
      if (!(el instanceof HTMLElement) || !el.matches(POPUPS)) return;
      if (el.hasAttribute('data-ending-style')) {
        setStart(null);
        setOrigin(null);
      } else if (el.hasAttribute('data-starting-style')) {
        // Two frames: the positioner places the popup after it mounts.
        requestAnimationFrame(() => requestAnimationFrame(() => measure(el)));
      }
    };
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === 'attributes') seen(r.target as Element);
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          seen(n);
          n.querySelectorAll(POPUPS).forEach(seen);
        });
      }
    });
    mo.observe(portal, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-starting-style', 'data-ending-style'] });
    return () => mo.disconnect();
  }, [on, stage, portal]);
  return { start, origin };
}
