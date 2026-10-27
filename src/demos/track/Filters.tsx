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

/** Narrow the issues by whose, which label, how pressing. Each is "any of"; together, all of them. */
export function Filters({ filter, onChange }: { filter: Filter; onChange: (f: Filter) => void }) {
  const any = filter.assignee.length + filter.label.length + filter.priority.length > 0;
  const button = (name: string, picked: string[]) => (
    <button type="button" className={s.filter} data-on={picked.length ? '' : undefined}>
      {said(name, picked)}
      <ChevronDown {...ic} />
    </button>
  );
  return (
    <div className={s.filters} role="group" aria-label="Filter">
      <PickMenu
        multiple
        options={PEOPLE_OPTIONS}
        value={filter.assignee}
        onPick={(v) => onChange({ ...filter, assignee: v })}
        trigger={button('Assignee', filter.assignee.map(personName))}
      />
      <PickMenu multiple options={LABEL_OPTIONS} value={filter.label} onPick={(v) => onChange({ ...filter, label: v })} trigger={button('Label', filter.label)} />
      <PickMenu
        multiple
        options={PRIORITY_OPTIONS}
        value={filter.priority}
        onPick={(v) => onChange({ ...filter, priority: v as Priority[] })}
        trigger={button('Priority', filter.priority.map((p) => priorityName(p)))}
      />
      {any && (
        <Button variant="ghost" size="sm" onClick={() => onChange(NO_FILTER)}>
          <X {...ic} />
          Clear
        </Button>
      )}
    </div>
  );
}
