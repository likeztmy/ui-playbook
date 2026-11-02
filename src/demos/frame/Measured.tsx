import { createContext, useContext, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../ui/cx';
import s from '../shell.module.scss';

/** Whether the frame's Gaps switch is on. */
export const GapsOn = createContext(false);

type Band = { top: number; height: number; px: number; ratio: number };

/**
 * The vertical gaps between its children's text, drawn when the frame's Gaps
 * switch is on: each in pixels and as a multiple of the smallest, the way
 * grouping by proximity compares them. Text is measured by its em box, so a
 * line's leading doesn't count as space.
 */
export function Measured({
  children,
  className,
  show,
}: {
  children: ReactNode;
  className?: string;
  /** Always on, for a playground with no switch. */ show?: boolean;
}) {
  const on = useContext(GapsOn) || !!show;
  const ref = useRef<HTMLDivElement>(null);
  const [bands, setBands] = useState<Band[]>([]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!on || !el) {
      setBands([]);
      return;
    }
    const measure = () => {
      const top0 = el.getBoundingClientRect().top;
      const extents = [...el.children]
        .filter((c) => !c.hasAttribute('data-gap-band'))
        .map((c) => {
          let t = Infinity;
          let b = -Infinity;
          const walker = document.createTreeWalker(c, NodeFilter.SHOW_TEXT);
          for (let n = walker.nextNode(); n; n = walker.nextNode()) {
            if (!n.textContent?.trim()) continue;
            const size = parseFloat(getComputedStyle(n.parentElement!).fontSize);
            const range = document.createRange();
            range.selectNodeContents(n);
            for (const r of range.getClientRects()) {
              const mid = r.top + r.height / 2;
              t = Math.min(t, mid - size / 2);
              b = Math.max(b, mid + size / 2);
            }
          }
          return Number.isFinite(t) ? { t: t - top0, b: b - top0 } : null;
        })
        .filter((x): x is { t: number; b: number } => !!x);
      const gaps = extents.slice(1).map((e, i) => ({ top: extents[i].b, height: e.t - extents[i].b }));
      const least = Math.max(1, Math.min(...gaps.map((g) => g.height)));
      setBands(gaps.map((g) => ({ ...g, px: Math.round(g.height), ratio: g.height / least })));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [on, children]);
  return (
    <div ref={ref} className={cx(s.measured, className)}>
      {children}
      {bands.map((b, i) => (
        <span key={i} className={s.gapBand} data-gap-band="" style={{ top: b.top, height: b.height }} aria-hidden>
          <span className={s.gapLabel}>
            {b.px} · {b.ratio.toFixed(1)}×
          </span>
        </span>
      ))}
    </div>
  );
}
