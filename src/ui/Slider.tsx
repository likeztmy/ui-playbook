import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from './cx';
import s from './Slider.module.scss';

export { s as sliderClasses };

type SliderProps = {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  /** Holds a state still for display: "hover", "focus", "drag". */
  pin?: string;
  className?: string;
};

const DRAG_THRESHOLD = 3;
const MAX_STRETCH = 10;
/** Pointer travel past an end at which the stretch reaches its maximum. */
const STRETCH_RANGE = 200;

const decimals = (step: number) => (String(step).split('.')[1] ?? '').length;

/**
 * A whole-row slider for a property panel. A drag follows the pointer
 * exactly; a click glides to the nearest stop (≤ 10 stops) or tenth; past
 * an end the row stretches like rubber and springs back.
 */
export function Slider({ label, value, onValueChange, min = 0, max = 100, step = 1, unit = '', pin, className }: SliderProps) {
  const row = useRef<HTMLDivElement>(null);
  const labelEl = useRef<HTMLSpanElement>(null);
  const valueEl = useRef<HTMLSpanElement>(null);
  const press = useRef<{ x: number; rect: DOMRect; dragging: boolean } | null>(null);
  const glideTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [dragging, setDragging] = useState(pin?.includes('drag') ?? false);
  const [gliding, setGliding] = useState(false);
  const [stretch, setStretch] = useState({ width: 0, left: 0 });
  const [dodging, setDodging] = useState(false);

  const stops = Math.round((max - min) / step);
  const discrete = stops <= 10;
  const dec = decimals(step);
  const snap = (v: number) => Number(Math.min(max, Math.max(min, Math.round((v - min) / step) * step + min)).toFixed(dec));
  const pct = ((value - min) / (max - min)) * 100;
  const text = `${value.toFixed(dec)}${unit}`;

  const set = (v: number) => {
    const next = snap(v);
    if (next !== value) onValueChange(next);
  };

  /** Glide to a value on the smooth spring: clicks and Home/End. */
  const glide = (v: number) => {
    const el = row.current;
    const ms = el ? parseFloat(getComputedStyle(el).getPropertyValue('--spring-smooth-duration')) || 620 : 620;
    setGliding(true);
    clearTimeout(glideTimer.current);
    glideTimer.current = setTimeout(() => setGliding(false), ms);
    set(v);
  };

  // The handle steps aside when it would sit on the label or the value.
  useLayoutEffect(() => {
    const el = row.current;
    const l = labelEl.current;
    const r = valueEl.current;
    if (!el || !l || !r) return;
    const x = (pct / 100) * el.offsetWidth;
    setDodging(x < l.offsetLeft + l.offsetWidth + 8 || x > r.offsetLeft - 8);
  }, [pct, text]);

  const valueAt = (clientX: number, rect: DOMRect) => min + Math.min(1, Math.max(0, (clientX - rect.left) / rect.width)) * (max - min);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    press.current = { x: e.clientX, rect: e.currentTarget.getBoundingClientRect(), dragging: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    if (!p.dragging) {
      if (Math.abs(e.clientX - p.x) <= DRAG_THRESHOLD) return;
      p.dragging = true;
      setDragging(true);
      setGliding(false);
    }
    set(valueAt(e.clientX, p.rect));
    const over = e.clientX < p.rect.left ? p.rect.left - e.clientX : e.clientX > p.rect.right ? e.clientX - p.rect.right : 0;
    // Square-root falloff: the further you pull, the harder it gets.
    const amount = over > 0 ? MAX_STRETCH * Math.sqrt(Math.min(over / STRETCH_RANGE, 1)) : 0;
    setStretch({ width: amount, left: e.clientX < p.rect.left ? -amount : 0 });
  };

  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const p = press.current;
    if (!p) return;
    press.current = null;
    setDragging(false);
    setStretch({ width: 0, left: 0 });
    if (p.dragging) return;
    const raw = valueAt(e.clientX, p.rect);
    // A click lands on a stop, or on the nearest tenth of a long range.
    glide(discrete ? raw : min + (Math.round(((raw - min) / (max - min)) * 10) / 10) * (max - min));
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const by = step * (e.shiftKey ? 10 : 1);
    const keys: Record<string, () => void> = {
      ArrowRight: () => set(value + by),
      ArrowUp: () => set(value + by),
      ArrowLeft: () => set(value - by),
      ArrowDown: () => set(value - by),
      PageUp: () => set(value + step * 10),
      PageDown: () => set(value - step * 10),
      Home: () => glide(min),
      End: () => glide(max),
    };
    const run = keys[e.key];
    if (!run) return;
    e.preventDefault();
    run();
  };

  const style = {
    '--pct': `${pct}%`,
    '--stretch': `${stretch.width}px`,
    '--stretch-left': `${stretch.left}px`,
  } as CSSProperties;

  return (
    <div
      ref={row}
      role="slider"
      tabIndex={0}
      aria-label={label}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-valuetext={text}
      aria-orientation="horizontal"
      className={cx(s.slider, className)}
      style={style}
      data-pin={pin}
      data-dragging={dragging || undefined}
      data-gliding={gliding || undefined}
      data-dodging={dodging || undefined}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onKeyDown={onKeyDown}
    >
      <span className={s.fill} />
      {discrete &&
        Array.from({ length: stops - 1 }, (_, i) => (
          <span key={i} className={s.tick} style={{ left: `${((i + 1) / stops) * 100}%` }} />
        ))}
      <span className={s.handle} />
      <span ref={labelEl} className={s.label}>
        {label}
      </span>
      <span ref={valueEl} className={s.value}>
        {text}
      </span>
    </div>
  );
}

/** A property panel: sliders and other controls stacked, concentric with it. */
export function SliderPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cx(s.panel, className)}>{children}</div>;
}
