import { Field } from '@base-ui/react/field';
import { CircleAlert, Command } from 'lucide-react';
import { useCallback, useEffect, useRef, type ComponentProps, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { cx } from './cx';
import s from './Field.module.scss';

export { s as fieldClasses };

type FieldRootProps = ComponentProps<typeof Field.Root>;

type TextFieldProps = {
  label: string;
  /** One line under the field: a format, a limit, a consequence. */
  description?: ReactNode;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  /** Returns the error message, or null when valid. Format checks: an empty field is `required`'s. */
  validate?: FieldRootProps['validate'];
  /**
   * The message for an empty field. Checked only once its form has been
   * submitted: leaving an empty field is exploring, not a mistake.
   */
  required?: string;
  /** When to validate. Default: when focus leaves the field. */
  validationMode?: FieldRootProps['validationMode'];
  /** An icon naming the field's purpose. */
  leading?: ReactNode;
  /** A unit, a shortcut key, a clear button. */
  trailing?: ReactNode;
  multiline?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  name?: string;
  type?: string;
  inputMode?: HTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  inputRef?: Ref<HTMLInputElement>;
  /** Ids of more text that describes the field, such as a rule list; joined with its own hint and error. */
  'aria-describedby'?: string;
  /** Invalid by a rule the field doesn't check itself. */
  'aria-invalid'?: boolean;
  /** Shows this error now, whatever the value: for server errors and stills. */
  error?: string;
  /** Holds a state still for display: "hover", "focus". */
  pin?: string;
  className?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

/** A labelled single-line field (or multiline), with its hint or error. */
export function TextField({
  label,
  description,
  validate,
  required,
  validationMode = 'onBlur',
  leading,
  trailing,
  multiline,
  disabled,
  error,
  pin,
  className,
  inputRef,
  onValueChange,
  ...control
}: TextFieldProps) {
  const own = useRef<HTMLInputElement | null>(null);
  const submitted = useRef(false);
  const ref = useCallback(
    (el: HTMLInputElement | null) => {
      own.current = el;
      if (typeof inputRef === 'function') inputRef(el);
      else if (inputRef) inputRef.current = el;
    },
    [inputRef],
  );
  // A native listener on the form runs before Base UI's onSubmit validates.
  useEffect(() => {
    const form = own.current?.form;
    if (!required || !form) return;
    const mark = () => {
      submitted.current = true;
    };
    form.addEventListener('submit', mark);
    return () => form.removeEventListener('submit', mark);
  }, [required]);
  const check: FieldRootProps['validate'] = required
    ? (value, values) => (String(value ?? '').trim() ? (validate?.(value, values) ?? null) : submitted.current ? required : null)
    : validate;
  return (
    <Field.Root
      className={cx(s.field, className)}
      validate={check}
      validationMode={validationMode}
      disabled={disabled}
      invalid={error ? true : undefined}
    >
      <Field.Label className={s.label}>{label}</Field.Label>
      <div className={cx(s.box, multiline && s.multiline)} data-pin={pin}>
        {leading}
        <Field.Control
          {...control}
          ref={ref}
          aria-required={required ? true : undefined}
          render={multiline ? <textarea /> : undefined}
          className={s.control}
          onValueChange={onValueChange ? (v) => onValueChange(String(v ?? '')) : undefined}
        />
        {trailing}
      </div>
      <Field.Error className={s.error} match={error ? true : undefined}>
        <CircleAlert size={14} aria-hidden />
        {error ?? <Field.Validity>{(v) => v.error}</Field.Validity>}
      </Field.Error>
      {description && <Field.Description className={s.hint}>{description}</Field.Description>}
    </Field.Root>
  );
}

/** A shortcut key sitting inside a field, e.g. ⌘K on a search box. */
export function FieldKey({ keys, className }: { keys: string[]; className?: string }) {
  return (
    <kbd className={cx(s.key, className)}>
      {keys.map((k, i) => (k === '⌘' ? <Command key={i} size={12} aria-label="⌘" /> : <span key={i}>{k}</span>))}
    </kbd>
  );
}

export function FieldSuffix({ children }: { children: ReactNode }) {
  return <span className={s.suffix}>{children}</span>;
}
