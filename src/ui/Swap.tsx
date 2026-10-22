import { useRef, type CSSProperties } from 'react';
import s from './Swap.module.scss';

/**
 * Text that changes with a blur, after Precision's swap: each new character
 * rises out of a blur, one after another by `stagger`. Digits use tabular
 * figures so the width holds.
 */
export function Swap({ value, className }: { value: string; className?: string }) {
  // A new key per value remounts the characters, so each change plays once.
  const version = useRef({ value, n: 0 });
  if (version.current.value !== value) version.current = { value, n: version.current.n + 1 };
  const n = version.current.n;
  return (
    <span className={className} aria-live="polite">
      <span className={s.sr}>{value}</span>
      <span aria-hidden className={s.chars}>
        {[...value].map((c, i) => (
          <span key={`${n}-${i}`} className={n > 0 ? s.char : undefined} style={{ '--i': i } as CSSProperties}>
            {c}
          </span>
        ))}
      </span>
    </span>
  );
}
