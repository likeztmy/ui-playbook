import { Switch as BaseSwitch } from '@base-ui/react/switch';
import type { ComponentProps, ReactNode } from 'react';
import { cx } from './cx';
import s from './Switch.module.scss';

export { s as switchClasses };

type SwitchProps = Omit<ComponentProps<typeof BaseSwitch.Root>, 'className' | 'children'> & {
  /** Names the setting, never its state. Omit only with an aria-label. */
  label?: ReactNode;
  description?: ReactNode;
  /** Settings lists put the switch at the end; forms at the start. */
  placement?: 'start' | 'end';
  /** Holds a state still for display: "hover", "active", "focus". */
  pin?: string;
  /** Only for showing the mistake: motion classes for the knob. */
  thumbClassName?: string;
  className?: string;
};

/** An on/off setting that takes effect the moment it flips. */
export function Switch({ label, description, placement = 'end', pin, thumbClassName, className, ...props }: SwitchProps) {
  const track = (
    <BaseSwitch.Root {...props} className={cx(s.track, label == null && className)} data-pin={pin}>
      <BaseSwitch.Thumb className={cx(s.thumb, thumbClassName)} />
    </BaseSwitch.Root>
  );
  if (label == null) return track;
  const text = (
    <span className={s.text}>
      <span>{label}</span>
      {description && <span className={s.description}>{description}</span>}
    </span>
  );
  return (
    <label className={cx(s.row, placement === 'end' && s.end, className)} data-disabled={props.disabled || undefined}>
      {placement === 'end' ? (
        <>
          {text}
          {track}
        </>
      ) : (
        <>
          {track}
          {text}
        </>
      )}
    </label>
  );
}
