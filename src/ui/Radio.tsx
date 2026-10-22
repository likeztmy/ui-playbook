import { Radio as BaseRadio } from '@base-ui/react/radio';
import { RadioGroup as BaseGroup } from '@base-ui/react/radio-group';
import { useId, type ComponentProps, type ReactNode } from 'react';
import { cx } from './cx';
import s from './Radio.module.scss';

export { s as radioClasses };

type RadioProps = Omit<ComponentProps<typeof BaseRadio.Root>, 'className' | 'children'> & {
  label: ReactNode;
  /** One quiet line under the label. */
  description?: ReactNode;
  /** Holds a state still for display: "hover", "active", "focus". */
  pin?: string;
  className?: string;
  /** Shown under the row while this one is chosen, e.g. a field for "Custom". */
  children?: ReactNode;
};

/** One option of a RadioGroup. Click the words or the circle. */
export function Radio({ label, description, pin, className, children, ...props }: RadioProps) {
  return (
    <div className={cx(s.option, className)}>
      <label className={s.row} data-disabled={props.disabled || undefined}>
        <BaseRadio.Root {...props} className={s.circle} data-pin={pin}>
          <BaseRadio.Indicator keepMounted className={s.dot} />
        </BaseRadio.Root>
        <span className={s.text}>
          <span>{label}</span>
          {description && <span className={s.description}>{description}</span>}
        </span>
      </label>
      {children && <div className={s.more}>{children}</div>}
    </div>
  );
}

type GroupProps = Omit<ComponentProps<typeof BaseGroup>, 'className'> & {
  /** Names the set. */
  label: string;
  /** Side by side, for two or three short labels. */
  inline?: boolean;
  className?: string;
};

/** Radios under one name. Tab reaches the chosen one; arrows move and choose. */
export function RadioGroup({ label, inline, children, className, ...props }: GroupProps) {
  const id = useId();
  return (
    <BaseGroup {...props} aria-labelledby={id} className={cx(s.group, className)}>
      <span id={id} className={s.groupLabel}>
        {label}
      </span>
      <div className={cx(s.options, inline && s.inline)}>{children}</div>
    </BaseGroup>
  );
}
