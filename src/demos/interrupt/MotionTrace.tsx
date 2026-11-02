import { useEffect, useRef } from 'react';
import type { MotionValue } from 'motion/react';
import s from './interrupt.module.scss';

/**
 * Plots a motion value over the last few seconds: position up the side,
 * time along the bottom. The scale fits what's on screen, at least `span` tall.
 */
export function MotionTrace({ value, span: least }: { value: MotionValue<number>; span: number }) {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvas.current!;
    const ctx = c.getContext('2d')!;
    const samples: { t: number; v: number }[] = [];
    const span = 3000;
    let raf = 0;
    const draw = () => {
      const now = performance.now();
      samples.push({ t: now, v: value.get() });
      while (samples.length && samples[0].t < now - span) samples.shift();
      const { width, height } = c.getBoundingClientRect();
      const dpr = devicePixelRatio;
      if (c.width !== Math.round(width * dpr)) {
        c.width = Math.round(width * dpr);
        c.height = Math.round(height * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      const css = getComputedStyle(c);
      ctx.strokeStyle = css.getPropertyValue('--line').trim();
      ctx.lineWidth = 1;
      for (const y of [4, height - 4]) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      const vs = samples.map((p) => p.v);
      const mid = (Math.min(...vs) + Math.max(...vs)) / 2;
      const range = Math.max(least, Math.max(...vs) - Math.min(...vs));
      const min = mid - range / 2;
      ctx.strokeStyle = css.getPropertyValue('--ink').trim();
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      samples.forEach(({ t, v }, i) => {
        const x = width - ((now - t) / span) * width;
        const y = height - 4 - ((v - min) / range) * (height - 8);
        if (i) ctx.lineTo(x, y);
        else ctx.moveTo(x, y);
      });
      ctx.stroke();
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [value, least]);
  return <canvas ref={canvas} className={s.intTrace} aria-hidden />;
}
