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
 * A value's row: the check in the leading column when it's on, as Menu draws it, then the value's
 * mark (the shape it has in the list), then its name.
 */
function PickRow({ option: o, on }: { option: Option; on: boolean }) {
  return (
    <>
      <span className={m.check} data-off={on ? undefined : ''}>
        <Check size={16} aria-hidden />
      </span>
      {o.lead && <span className={s.lead}>{o.lead}</span>}
      <span className={m.text}>{o.label}</span>
    </>
  );
}

type ChecksProps = { options: Option[]; value: string[]; onPick: (v: string[]) => void };

/** Several values, each flipped on its own, the menu staying open: labels, or a filter's values. */
export function PickChecks({ options, value, onPick }: ChecksProps) {
  return options.map((o) => {
    const on = value.includes(o.value);
    return (
      <BaseMenu.CheckboxItem
        key={o.value}
        label={o.label}
        className={m.item}
        checked={on}
        closeOnClick={false}
        onCheckedChange={(v) => onPick(v ? [...value, o.value] : value.filter((x) => x !== o.value))}
      >
        <PickRow option={o} on={on} />
      </BaseMenu.CheckboxItem>
    );
  });
}

/**
 * A menu of values with their marks, the current one checked in the leading column: status,
 * priority, labels. One closes on a pick; several (labels) stay open to flip more.
 */
export function PickMenu(props: PickMenuProps) {
  const { trigger, options, side = 'bottom', align = 'start' } = props;
  const container = usePortalContainer();
  return (
    <BaseMenu.Root>
      <BaseMenu.Trigger render={trigger} />
      <BaseMenu.Portal container={container}>
        <BaseMenu.Positioner className={`${m.positioner} ${s.positioner}`} side={side} align={align} sideOffset={6}>
          {/* A pick inside a row is the row's value, not a click on the row: it opens nothing. */}
          <BaseMenu.Popup className={`${m.popup} ${s.popup}`} onClick={(e) => e.stopPropagation()}>
            {props.multiple ? (
              <PickChecks options={options} value={props.value} onPick={props.onPick} />
            ) : (
              <BaseMenu.RadioGroup value={props.value} onValueChange={(v) => props.onPick(v as string)}>
                {options.map((o) => (
                  <BaseMenu.RadioItem key={o.value} value={o.value} label={o.label} className={m.item} closeOnClick>
                    <PickRow option={o} on={props.value === o.value} />
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
