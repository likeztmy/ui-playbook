import { Combobox } from '@base-ui/react/combobox';
import { Check } from 'lucide-react';
import { useState, type ReactElement } from 'react';
import { menuClasses as m } from '../../ui/Menu';
import { usePortalContainer } from '../../ui/portal';
import { PEOPLE_OPTIONS } from './options';
import type { Option } from './PickMenu';
import s from './AssigneePicker.module.scss';

type Props = {
  trigger: ReactElement;
  /** A person's id, or NOBODY. */
  value: string;
  onPick: (id: string) => void;
  side?: 'bottom' | 'top';
  align?: 'start' | 'end';
};

/**
 * Whose it is: a list you can type into, the first match ready for Enter. When nobody matches, it
 * says what was typed, so a typo is seen as one.
 */
export function AssigneePicker({ trigger, value, onPick, side = 'bottom', align = 'start' }: Props) {
  const container = usePortalContainer();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const current = PEOPLE_OPTIONS.find((o) => o.value === value) ?? null;
  return (
    <Combobox.Root
      items={PEOPLE_OPTIONS}
      open={open}
      onOpenChange={setOpen}
      value={current}
      autoHighlight
      onInputValueChange={setQuery}
      itemToStringLabel={(o: Option) => o.label}
      isItemEqualToValue={(a: Option, b: Option) => a.value === b.value}
      onValueChange={(o: Option | null) => {
        if (o) onPick(o.value);
        setOpen(false);
      }}
    >
      <Combobox.Trigger render={trigger} />
      <Combobox.Portal container={container}>
        <Combobox.Positioner className={m.positioner} side={side} align={align} sideOffset={6}>
          <Combobox.Popup className={`${m.popup} ${s.popup}`} aria-label="Assignee">
            <Combobox.Input className={s.input} placeholder="Assign to…" aria-label="Assign to" />
            <Combobox.Empty className={s.empty}>No one called “{query.trim()}”</Combobox.Empty>
            <Combobox.List className={s.list}>
              {(o: Option) => (
                <Combobox.Item key={o.value} value={o} className={m.item}>
                  <span className={s.lead}>{o.lead}</span>
                  <span className={m.text}>{o.label}</span>
                  <Combobox.ItemIndicator keepMounted className={m.check}>
                    <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
                  </Combobox.ItemIndicator>
                </Combobox.Item>
              )}
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  );
}
