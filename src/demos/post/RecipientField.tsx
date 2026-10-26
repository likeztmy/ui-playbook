import { X } from 'lucide-react';
import { useId, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode, type Ref } from 'react';
import { valid } from './draft';
import { findContacts, person } from './people';
import { Suggestions } from './Suggestions';
import s from './RecipientField.module.scss';

type Props = {
  label: string;
  value: string[];
  onChange: (next: string[]) => void;
  inputRef?: Ref<HTMLInputElement>;
  /** After the input, on the field's line: e.g. Cc and Bcc. */
  trailing?: ReactNode;
  /** Said inside the field, under its chips. */
  error?: string | null;
};

/**
 * Addresses as chips. Type for suggestions; Enter, Tab or a comma makes a chip; Backspace on an
 * empty field selects the last chip, again removes it. A malformed address is marked when it
 * becomes a chip, never while it's being typed.
 */
export function RecipientField({ label, value, onChange, inputRef, trailing, error }: Props) {
  const id = useId();
  const [text, setText] = useState('');
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState(false);
  const [focused, setFocused] = useState(false);

  const matches = findContacts(text, value);
  const open = focused && matches.length > 0;

  const commit = (raw: string) => {
    const parts = raw
      .split(/[,;\s]+/)
      .map((p) => p.trim())
      .filter(Boolean);
    const fresh = parts.filter((p) => !value.includes(p));
    if (fresh.length) onChange([...value, ...fresh]);
    setText('');
    setActive(0);
  };

  const pick = (email: string) => {
    onChange([...value, email]);
    setText('');
    setActive(0);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace') setSelected(false);
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length);
    } else if ((e.key === 'Enter' || e.key === 'Tab') && open) {
      e.preventDefault();
      pick(matches[active].email);
    } else if ((e.key === 'Enter' || e.key === ',' || e.key === ';') && text.trim()) {
      e.preventDefault();
      commit(text);
    } else if (e.key === 'Tab' && text.trim()) {
      commit(text);
    } else if (e.key === 'Escape' && open) {
      // Closes the suggestions only; the composer doesn't hear it.
      e.stopPropagation();
      setText('');
    } else if (e.key === 'Backspace' && !text && value.length) {
      e.preventDefault();
      if (selected) onChange(value.slice(0, -1));
      setSelected(!selected);
    }
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData('text');
    if (!/[,;\n]/.test(pasted) && (pasted.match(/@/g) ?? []).length < 2) return;
    e.preventDefault();
    commit(text + pasted);
  };

  return (
    <div className={s.field}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div className={s.chips}>
        {value.map((a, i) => {
          const p = person(a);
          return (
            <span
              key={a}
              className={s.chip}
              data-invalid={valid(p.email) ? undefined : ''}
              data-selected={selected && i === value.length - 1 ? '' : undefined}
              title={p.email}
            >
              {p.name}
              <button type="button" className={s.remove} aria-label={`Remove ${p.name}`} onClick={() => onChange(value.filter((x) => x !== a))}>
                <X size={12} strokeWidth={1.75} nonScalingStroke aria-hidden />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          id={id}
          className={s.input}
          value={text}
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? `${id}-list` : undefined}
          aria-activedescendant={open ? `${id}-${active}` : undefined}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => {
            setText(e.target.value);
            setActive(0);
            setSelected(false);
          }}
          onKeyDown={onKeyDown}
          onPaste={onPaste}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            setSelected(false);
            // Leaving the field turns what's typed into a chip, and only now is it checked.
            if (text.trim()) commit(text);
          }}
        />
      </div>
      {trailing}
      {error && (
        <p className={s.error} role="alert">
          {error}
        </p>
      )}
      {open && (
        <Suggestions
          id={id}
          label={`Suggestions for ${label}`}
          items={matches}
          active={active}
          onPick={(p) => pick(p.email)}
          onActive={setActive}
          className={s.list}
        />
      )}
    </div>
  );
}
