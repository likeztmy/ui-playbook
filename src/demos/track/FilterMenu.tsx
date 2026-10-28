import { CircleUserRound, ListFilter, SignalHigh, Tag } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Menu } from '../../ui/Menu';
import type { Filter, Priority } from './model';
import { LABEL_OPTIONS, PEOPLE_OPTIONS, PRIORITY_OPTIONS } from './options';
import { PickChecks } from './PickMenu';
import s from './FilterMenu.module.scss';

/**
 * One button for every way to narrow the issues, each way a submenu of its values. What's set
 * shows under the header, as chips; nothing set takes no room.
 */
export function FilterMenu({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  return (
    <Menu.Root>
      <Menu.Trigger render={<Button variant="ghost" size="sm" aria-label="Filter" className={s.button} />}>
        <ListFilter size={16} strokeWidth={1.5} aria-hidden />
        <span className={s.word}>Filter</span>
      </Menu.Trigger>
      <Menu.Popup align="end">
        <Menu.Submenu icon={CircleUserRound} label="Assignee">
          <PickChecks options={PEOPLE_OPTIONS} value={filter.assignee} onPick={(v) => onChange({ ...filter, assignee: v })} />
        </Menu.Submenu>
        <Menu.Submenu icon={Tag} label="Label">
          <PickChecks options={LABEL_OPTIONS} value={filter.label} onPick={(v) => onChange({ ...filter, label: v })} />
        </Menu.Submenu>
        <Menu.Submenu icon={SignalHigh} label="Priority">
          <PickChecks options={PRIORITY_OPTIONS} value={filter.priority} onPick={(v) => onChange({ ...filter, priority: v as Priority[] })} />
        </Menu.Submenu>
      </Menu.Popup>
    </Menu.Root>
  );
}
