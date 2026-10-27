import { ChevronRight, Plus } from 'lucide-react';
import { Tip } from '../../ui/Tooltip';
import { useId } from 'react';
import type { Issue, Status } from './model';
import { Row } from './Row';
import type { Track } from './useTrack';
import { StatusIcon } from './StatusIcon';
import s from './Group.module.scss';

type GroupProps = {
  status: Status;
  name: string;
  issues: Issue[];
  /** Issues in this status the filter leaves out. */
  hidden: number;
  open: boolean;
  onToggle: () => void;
  track: Track;
  onOpen: (n: number) => void;
  /** A new issue that starts in this status. */
  onAdd: () => void;
};

/** A status's issues under a header that names it, counts them and folds them away. */
export function Group({ status, name, issues, hidden, open, onToggle, track, onOpen, onAdd }: GroupProps) {
  const list = useId();
  return (
    <section className={s.group} aria-label={name}>
      <h2 className={s.heading}>
        <button type="button" className={s.header} aria-expanded={open} aria-controls={list} onClick={onToggle}>
          <ChevronRight className={s.chevron} size={14} strokeWidth={2} aria-hidden />
          <span className={s.spacer} />
          <span className={s.spacer} />
          <StatusIcon status={status} />
          <span className={s.name}>
            {name}
            {/* The count is what you can see; what the filter hides is said apart from it. */}
            <span className={s.count}>{issues.length}</span>
            {hidden > 0 && <span className={s.hidden}>{hidden} hidden by filter</span>}
          </span>
        </button>
        <Tip label={`Add an issue to ${name}`}>
          <button type="button" className={s.add} aria-label={`Add an issue to ${name}`} onClick={onAdd}>
            <Plus size={16} strokeWidth={1.5} aria-hidden />
          </button>
        </Tip>
      </h2>
      <div id={list} role="list" hidden={!open}>
        {issues.map((i) => (
          <Row key={i.n} issue={i} track={track} onOpen={onOpen} />
        ))}
      </div>
    </section>
  );
}
