import { ToggleGroup } from '@base-ui/react/toggle-group';
import { Toggle } from '@base-ui/react/toggle';
import s from './Dial.module.scss';

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
