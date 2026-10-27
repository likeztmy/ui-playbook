import { Face } from './Face';
import { LABELS, NOBODY, PRIORITIES, STATUSES } from './model';
import type { Option } from './PickMenu';
import { TEAM } from './people';
import { PriorityIcon } from './PriorityIcon';
import { StatusIcon } from './StatusIcon';

// Each property's values as menu rows, with the mark the list draws for them.
export const STATUS_OPTIONS: Option[] = STATUSES.map((st) => ({ value: st.id, label: st.name, lead: <StatusIcon status={st.id} /> }));
export const PRIORITY_OPTIONS: Option[] = PRIORITIES.map((p) => ({ value: p.id, label: p.name, lead: <PriorityIcon priority={p.id} /> }));
export const LABEL_OPTIONS: Option[] = LABELS.map((l) => ({ value: l, label: l }));
/** You first, as you're the likeliest pick; then the team; then no one. */
export const PEOPLE_OPTIONS: Option[] = [
  ...TEAM.map((p) => ({ value: p.id, label: p.me ? `${p.name} (you)` : p.name, lead: <Face id={p.id} size="sm" /> })),
  { value: NOBODY, label: 'No one', lead: <Face size="sm" /> },
];
