import { ChevronDown, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { NO_FILTER, NOBODY, priorityName, type Filter, type Priority } from './model';
import { LABEL_OPTIONS, PEOPLE_OPTIONS, PRIORITY_OPTIONS } from './options';
import { PEOPLE } from './people';
import { PickMenu } from './PickMenu';
import s from './Filters.module.scss';

const ic = { size: 14, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** What a filter button says: its name alone, or what it's narrowed to, two at most then a count. */
function said(name: string, picked: string[]) {
  if (!picked.length) return name;
  return `${name}: ${picked.length > 2 ? `${picked.length} chosen` : picked.join(', ')}`;
}

const personName = (id: string) => (id === NOBODY ? 'No one' : PEOPLE[id].me ? 'You' : PEOPLE[id].name.split(' ')[0]);

/**
 * The filters that are set, each a chip that says what it narrows to and opens to change it.
 * Each is "any of"; together, all of them. Filter in the header adds one; Clear takes them all off.
 */
export function Filters({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  const chip = (name: string, picked: string[]) => (
    <button type="button" className={s.filter}>
      {said(name, picked)}
      <ChevronDown {...ic} />
    </button>
  );
  return (
    <div className={s.filters} role="group" aria-label="Filters">
      {filter.assignee.length > 0 && (
        <PickMenu
          multiple
          options={PEOPLE_OPTIONS}
          value={filter.assignee}
          onPick={(v) => onChange({ ...filter, assignee: v })}
          trigger={chip('Assignee', filter.assignee.map(personName))}
        />
      )}
      {filter.label.length > 0 && (
        <PickMenu multiple options={LABEL_OPTIONS} value={filter.label} onPick={(v) => onChange({ ...filter, label: v })} trigger={chip('Label', filter.label)} />
      )}
      {filter.priority.length > 0 && (
        <PickMenu
          multiple
          options={PRIORITY_OPTIONS}
          value={filter.priority}
          onPick={(v) => onChange({ ...filter, priority: v as Priority[] })}
          trigger={chip('Priority', filter.priority.map((p) => priorityName(p)))}
        />
      )}
      <Button variant="ghost" size="sm" onClick={() => onChange(NO_FILTER)}>
        <X {...ic} />
        Clear
      </Button>
    </div>
  );
}
