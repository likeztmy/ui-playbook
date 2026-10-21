import { Slider } from '@base-ui/react/slider';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle } from '@base-ui/react/toggle';
import type { ReactNode } from 'react';
import s from './Dial.module.scss';

export function DialPanel({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={[s.panel, className].filter(Boolean).join(' ')}>{children}</div>;
}

type DialProps = {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

/** A whole-row slider: the row is the track, the fill is the value. */
export function Dial({ label, value, onChange, min = 0, max = 100, step = 1, unit = '' }: DialProps) {
  return (
    <Slider.Root value={value} onValueChange={(v) => onChange(v as number)} min={min} max={max} step={step}>
      <Slider.Control className={s.dial}>
        <Slider.Track className={s.track}>
          <Slider.Indicator className={s.fill} />
          <Slider.Thumb className={s.thumb} aria-label={label} />
        </Slider.Track>
        <span className={s.label}>{label}</span>
        <span className={s.value}>
          {value}
          {unit}
        </span>
      </Slider.Control>
    </Slider.Root>
  );
}

type ChoiceProps<T extends string> = {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
};

/** A segmented choice sized to sit among dials. */
export function Choice<T extends string>({ label, value, options, onChange }: ChoiceProps<T>) {
  return (
    <ToggleGroup
      className={s.choice}
      aria-label={label}
      value={[value]}
      onValueChange={(v) => v[0] && onChange(v[0] as T)}
    >
      {options.map((o) => (
        <Toggle key={o} value={o} className={s.segment}>
          {o}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
