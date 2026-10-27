import { Menu as BaseMenu } from '@base-ui/react/menu';
import { Check } from 'lucide-react';
import type { ReactElement, ReactNode } from 'react';
import { menuClasses as m } from '../../ui/Menu';
import { usePortalContainer } from '../../ui/portal';
import s from './PickMenu.module.scss';

export type Option = { value: string; label: string; lead?: ReactNode };

type Common = {
  /** The control that opens it; it's rendered as the menu's trigger. */
  trigger: ReactElement;
  options: Option[];
  side?: 'bottom' | 'top' | 'right' | 'left';
  align?: 'start' | 'center' | 'end';
};

type PickMenuProps = Common &
  ({ multiple?: false; value: string | null; onPick: (v: string) => void } | { multiple: true; value: string[]; onPick: (v: string[]) => void });

/**
 * A menu of values with their marks, the current one checked at the row's end: status, priority,
 * labels. One closes on a pick; several (labels) stay open to flip more.
 */
export function PickMenu(props: PickMenuProps) {
  const { trigger, options, side = 'bottom', align = 'start' } = props;
  const container = usePortalContainer();
  const row = (o: Option, on: boolean) => (
    <>
      {o.lead && <span className={s.lead}>{o.lead}</span>}
      <span className={m.text}>{o.label}</span>
      <span className={m.check} data-off={on ? undefined : ''}>
        <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
      </span>
    </>
  );
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal container={container}>
        <BaseMenu.Positioner className={m.positioner} side={side} align={align} sideOffset={6}>
          <BaseMenu.Popup className={`${m.popup} ${s.popup}`}>
            {props.multiple ? (
              options.map((o) => {
                const on = props.value.includes(o.value);
                return (
                  <BaseMenu.CheckboxItem
                    key={o.value}
                    label={o.label}
                    className={m.item}
                    checked={on}
                    closeOnClick={false}
                    onCheckedChange={(v) => props.onPick(v ? [...props.value, o.value] : props.value.filter((x) => x !== o.value))}
                  >
                    {row(o, on)}
                  </BaseMenu.CheckboxItem>
                );
              })
            ) : (
              <BaseMenu.RadioGroup value={props.value} onValueChange={(v) => props.onPick(v as string)}>
                {options.map((o) => (
                  <BaseMenu.RadioItem key={o.value} value={o.value} label={o.label} className={m.item} closeOnClick>
                    {row(o, props.value === o.value)}
                  </BaseMenu.RadioItem>
                ))}
              </BaseMenu.RadioGroup>
            )}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}
