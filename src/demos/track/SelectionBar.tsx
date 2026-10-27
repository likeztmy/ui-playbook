import { ChevronDown, Trash2, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Tip } from '../../ui/Tooltip';
import { AssigneePicker } from './AssigneePicker';
import { NOBODY, type Priority, type Status } from './model';
import { PRIORITY_OPTIONS, STATUS_OPTIONS } from './options';
import { PickMenu } from './PickMenu';
import type { Track } from './useTrack';
import s from './SelectionBar.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** What's ticked, then what can be done to all of it at once. Esc or × lets go. */
export function SelectionBar({ track }: { track: Track }) {
  const ns = [...track.checked];
  const menu = (name: string) => (
    <Button variant="ghost" size="sm">
      {name}
      <ChevronDown {...ic} size={14} />
    </Button>
  );
  return (
    <div className={s.bar} role="toolbar" aria-label={`${ns.length} selected`}>
      <Tip label="Clear selection" keys={['Esc']}>
        <Button variant="ghost" icon size="sm" aria-label="Clear selection" onClick={() => track.setChecked(new Set())}>
          <X {...ic} />
        </Button>
      </Tip>
      <span className={s.count}>{ns.length} selected</span>
      <span className={s.tools}>
        <PickMenu options={STATUS_OPTIONS} value={null} onPick={(v) => track.update(ns, { status: v as Status })} trigger={menu('Status')} />
        <PickMenu options={PRIORITY_OPTIONS} value={null} onPick={(v) => track.update(ns, { priority: v as Priority })} trigger={menu('Priority')} />
        <AssigneePicker value="" onPick={(id) => track.update(ns, { assignee: id === NOBODY ? undefined : id })} trigger={menu('Assignee')} />
        <Tip label="Delete" keys={['⌫']}>
          <Button variant="ghost" icon size="sm" aria-label="Delete" onClick={() => track.remove(ns)}>
            <Trash2 {...ic} />
          </Button>
        </Tip>
      </span>
    </div>
  );
}
