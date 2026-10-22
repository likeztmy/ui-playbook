import { Field } from '@base-ui/react/field';
import { CircleAlert, Command } from 'lucide-react';
import type { ComponentProps, ReactNode, Ref } from 'react';
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
  /** Returns the error message, or null when valid. */
  validate?: FieldRootProps['validate'];
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
  inputRef?: Ref<HTMLInputElement>;
  /** Shows this error now, whatever the value: for server errors and stills. */
  error?: string;
  /** Holds a state still for display: "hover", "focus". */
  pin?: string;
  className?: string;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

/** A labelled single-line field (or multiline), with its hint or error. */
export function TextField({
  label,
  description,
  validate,
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
  return (
    <Field.Root
      className={cx(s.field, className)}
      validate={validate}
      validationMode={validationMode}
      disabled={disabled}
      invalid={error ? true : undefined}
    >
      <Field.Label className={s.label}>{label}</Field.Label>
      <div
        className={cx(s.box, multiline && s.multiline)}
        data-pin={pin}
      >
        {leading}
        <Field.Control
          {...control}
          ref={inputRef}
          render={multiline ? <textarea /> : undefined}
          className={s.control}
          onValueChange={onValueChange ? (v) => onValueChange(String(v ?? '')) : undefined}
        />
        {trailing}
      </div>
      <Field.Error className={s.error} match={error ? true : undefined}>
        <CircleAlert size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
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
      {keys.map((k, i) =>
        k === '⌘' ? <Command key={i} size={11} strokeWidth={1.5} nonScalingStroke aria-label="⌘" /> : <span key={i}>{k}</span>,
      )}
    </kbd>
  );
}

export function FieldSuffix({ children }: { children: ReactNode }) {
  return <span className={s.suffix}>{children}</span>;
}
