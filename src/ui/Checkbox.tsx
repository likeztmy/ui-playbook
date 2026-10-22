import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { CheckboxGroup as BaseGroup } from '@base-ui/react/checkbox-group';
import { Check, Minus } from 'lucide-react';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from './cx';
import s from './Checkbox.module.scss';

export { s as checkboxClasses };

type CheckboxProps = Omit<ComponentProps<typeof BaseCheckbox.Root>, 'className' | 'children'> & {
  /** Omit only where the row already names it, e.g. a table row; then pass aria-label. */
  label?: ReactNode;
  /** One quiet line under the label. */
  description?: ReactNode;
  /** Holds a state still for display: "hover", "active", "focus". */
  pin?: string;
  className?: string;
};

/** A box that's on, off, or mixed, with its label. Click the words or the box. */
export function Checkbox({ label, description, pin, className, ...props }: CheckboxProps) {
  const box = (
    <BaseCheckbox.Root {...props} className={cx(s.box, label == null && className)} data-pin={pin}>
      <BaseCheckbox.Indicator
        keepMounted
        className={s.indicator}
        render={(p, state) => (
          <span {...p}>
            {state.indeterminate ? (
              <Minus size={12} strokeWidth={2} nonScalingStroke aria-hidden />
            ) : (
              <Check size={12} strokeWidth={2} nonScalingStroke aria-hidden />
            )}
          </span>
        )}
      />
    </BaseCheckbox.Root>
  );
  if (label == null) return box;
  return (
    <label className={cx(s.row, className)} data-disabled={props.disabled || undefined}>
      {box}
      <span className={s.text}>
        <span>{label}</span>
        {description && <span className={s.description}>{description}</span>}
      </span>
    </label>
  );
}

type GroupProps = Omit<ComponentProps<typeof BaseGroup>, 'className'> & {
  /** Names the set. */
  label: string;
  /** Adds a parent checkbox with this label that turns them all on or off. */
  parent?: string;
  className?: string;
};

/** Checkboxes under one name; with `parent`, a mixed-state "all" box above them. */
export function CheckboxGroup({ label, parent, children, className, ...props }: GroupProps) {
  const id = useId();
  return (
    <BaseGroup {...props} aria-labelledby={id} className={cx(s.group, className)}>
      <span id={id} className={s.groupLabel}>
        {label}
      </span>
      {parent ? (
        <>
          <Checkbox parent label={parent} />
          <div className={s.children}>{children}</div>
        </>
      ) : (
        children
      )}
    </BaseGroup>
  );
}
