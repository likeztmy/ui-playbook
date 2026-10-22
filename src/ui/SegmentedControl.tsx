import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import type { LucideIcon } from 'lucide-react';
import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from './cx';
import { Tip } from './Tooltip';
import s from './SegmentedControl.module.scss';

export { s as segmentedClasses };

export type Segment<T extends string> = {
  value: T;
  label: string;
  /** Icon-only segments show this and use `label` for aria-label and tooltip. */
  icon?: LucideIcon;
  disabled?: boolean;
};

type Props<T extends string> = {
  /** Names the group for assistive tech; the segments name themselves. */
  label: string;
  value: T;
  onValueChange: (value: T) => void;
  segments: Segment<T>[];
  /** Holds a segment's state still for display: "hover", "focus". */
  pin?: { value: T; state: string };
  className?: string;
  segmentClassName?: string;
};

/**
 * One choice among two to five, a radio group drawn as a pill. Arrow keys
 * move and select at once; one thumb slides to the chosen segment.
 */
export function SegmentedControl<T extends string>({ label, value, onValueChange, segments, pin, className, segmentClassName }: Props<T>) {
  const root = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<{ x: number; w: number } | null>(null);
  const [moving, setMoving] = useState(false);
  const iconOnly = segments.every((seg) => seg.icon);

  // Measure the checked segment; re-measure when the control resizes.
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    const place = () => {
      const on = el.querySelector<HTMLElement>('[data-checked]');
      if (on) setThumb({ x: on.offsetLeft, w: on.offsetWidth });
    };
    place();
    const ro = new ResizeObserver(place);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  return (
    <RadioGroup
      ref={root}
      aria-label={label}
      value={value}
      onValueChange={(v) => {
        setMoving(true);
        onValueChange(v as T);
      }}
      className={cx(s.root, iconOnly && s.icons, className)}
      data-ready={thumb ? '' : undefined}
      data-moving={moving ? '' : undefined}
      style={thumb ? ({ '--x': `${thumb.x}px`, '--w': `${thumb.w}px` } as CSSProperties) : undefined}
    >
      <span className={s.thumb} aria-hidden />
      {segments.map((seg) => {
        const Icon = seg.icon;
        const radio = (
          <Radio.Root
            key={seg.value}
            value={seg.value}
            disabled={seg.disabled}
            aria-label={Icon ? seg.label : undefined}
            className={cx(s.segment, segmentClassName)}
            data-pin={pin?.value === seg.value ? pin.state : undefined}
          >
            {Icon ? <Icon size={16} strokeWidth={1.5} nonScalingStroke aria-hidden /> : <span className={s.text}>{seg.label}</span>}
          </Radio.Root>
        );
        // Icon segments get a tooltip with the same words as their label.
        return Icon ? (
          <Tip key={seg.value} label={seg.label}>
            {radio}
          </Tip>
        ) : (
          radio
        );
      })}
    </RadioGroup>
  );
}
