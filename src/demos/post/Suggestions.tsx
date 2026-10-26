import type { CSSProperties } from 'react';
import { Avatar } from './Avatar';
import type { Person } from './model';
import s from './Suggestions.module.scss';

type Props = {
  /** The owning field's id: the list is `${id}-list`, option i is `${id}-${i}` (for aria-activedescendant). */
  id: string;
  label: string;
  items: Person[];
  active: number;
  onPick: (p: Person) => void;
  onActive: (i: number) => void;
  /** Where it sits; the caller knows what it's anchored to. */
  className?: string;
  style?: CSSProperties;
};

/** People to pick from, for a recipients field or an @mention: avatar, name, address. */
export function Suggestions({ id, label, items, active, onPick, onActive, className, style }: Props) {
  return (
    <ul id={`${id}-list`} role="listbox" aria-label={label} className={`${s.list} ${className ?? ''}`} style={style} data-overlay>
      {items.map((p, i) => (
        <li
          key={p.id}
          id={`${id}-${i}`}
          role="option"
          aria-selected={i === active}
          className={s.option}
          // Picking mustn't take focus from the field or the text first.
          onPointerDown={(e) => e.preventDefault()}
          onClick={() => onPick(p)}
          onPointerMove={() => onActive(i)}
        >
          <Avatar id={p.id} size="sm" />
          <span className={s.name}>{p.name}</span>
          <span className={s.email}>{p.email}</span>
        </li>
      ))}
    </ul>
  );
}
