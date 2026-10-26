import { Search, X } from 'lucide-react';
import type { Ref } from 'react';
import { Button } from '../../ui/Button';
import s from './Find.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

type Props = {
  value: string;
  onChange: (q: string) => void;
  inputRef?: Ref<HTMLInputElement>;
};

/** Search, on the bar of the list it filters. Esc clears it. */
export function Find({ value, onChange, inputRef }: Props) {
  return (
    <label className={s.find}>
      <Search {...ic} />
      <input
        ref={inputRef}
        value={value}
        placeholder="Search mail"
        aria-label="Search mail"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange('');
          e.stopPropagation();
        }}
      />
      {value && (
        <Button variant="ghost" size="sm" icon aria-label="Clear search" onClick={() => onChange('')}>
          <X {...ic} />
        </Button>
      )}
    </label>
  );
}
