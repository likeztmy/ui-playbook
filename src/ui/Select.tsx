import { Select as BaseSelect } from '@base-ui/react/select';
import { Check, ChevronDown, ChevronsUpDown, ChevronUp } from 'lucide-react';
import { Fragment, type ReactNode } from 'react';
import { cx } from './cx';
import { fieldClasses as f } from './Field';
import { menuClasses as m } from './Menu';
import { usePortalContainer } from './portal';
import s from './Select.module.scss';

export { s as selectClasses };

export type Option = { value: string; label: string; disabled?: boolean };
export type OptionGroup = { label?: string; options: Option[] };

type SelectProps = {
  label: string;
  /** Flat options, or labelled groups divided by separators. */
  options: Option[] | OptionGroup[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  /** Shown while nothing is chosen. Prefer a useful default instead. */
  placeholder?: string;
  description?: ReactNode;
  /** macOS: the list opens over the trigger, the current option on its text. */
  alignItemWithTrigger?: boolean;
  disabled?: boolean;
  name?: string;
  /** Holds a state still for display: "hover", "focus". */
  pin?: string;
  /** Only for showing the mistake: a menu's single chevron. */
  chevron?: 'updown' | 'down';
  className?: string;
};

const isGrouped = (o: Option[] | OptionGroup[]): o is OptionGroup[] => o.length > 0 && 'options' in o[0];

/** Pick one value from a short, flat list. */
export function Select({
  label,
  options,
  placeholder,
  description,
  alignItemWithTrigger = true,
  pin,
  chevron = 'updown',
  className,
  ...root
}: SelectProps) {
  const container = usePortalContainer();
  const groups = isGrouped(options) ? options : [{ options }];
  const items = groups.flatMap((g) => g.options);
  return (
    <div className={cx(f.field, className)}>
      <BaseSelect.Root {...root} items={items}>
        <BaseSelect.Label className={f.label}>{label}</BaseSelect.Label>
        <BaseSelect.Trigger className={s.trigger} data-pin={pin}>
          <BaseSelect.Value className={s.value} placeholder={placeholder} />
          <BaseSelect.Icon className={s.chevron}>
            {chevron === 'updown' ? (
              <ChevronsUpDown size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
            ) : (
              <ChevronDown size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
            )}
          </BaseSelect.Icon>
        </BaseSelect.Trigger>
        <BaseSelect.Portal container={container}>
          <BaseSelect.Positioner className={s.positioner} sideOffset={6} alignItemWithTrigger={alignItemWithTrigger}>
            <BaseSelect.Popup className={cx(m.popup, s.popup)}>
              <BaseSelect.ScrollUpArrow className={s.scrollArrow}>
                <ChevronUp size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
              </BaseSelect.ScrollUpArrow>
              <BaseSelect.List className={s.list}>
                {groups.map((g, i) => (
                  <Fragment key={g.label ?? i}>
                    {i > 0 && <BaseSelect.Separator className={m.separator} />}
                    <BaseSelect.Group>
                      {g.label && <BaseSelect.GroupLabel className={m.label}>{g.label}</BaseSelect.GroupLabel>}
                      {g.options.map((o) => (
                        <BaseSelect.Item key={o.value} value={o.value} disabled={o.disabled} className={cx(m.item, s.item)}>
                          <BaseSelect.ItemIndicator keepMounted className={m.check}>
                            <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
                          </BaseSelect.ItemIndicator>
                          <BaseSelect.ItemText className={m.text}>{o.label}</BaseSelect.ItemText>
                        </BaseSelect.Item>
                      ))}
                    </BaseSelect.Group>
                  </Fragment>
                ))}
              </BaseSelect.List>
              <BaseSelect.ScrollDownArrow className={s.scrollArrow}>
                <ChevronDown size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
              </BaseSelect.ScrollDownArrow>
            </BaseSelect.Popup>
          </BaseSelect.Positioner>
        </BaseSelect.Portal>
      </BaseSelect.Root>
      {description && <p className={f.hint}>{description}</p>}
    </div>
  );
}
