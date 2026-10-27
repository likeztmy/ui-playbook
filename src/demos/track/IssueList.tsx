import type { KeyboardEvent } from 'react';
import { Group } from './Group';
import type { Status } from './model';
import type { Track } from './useTrack';
import s from './IssueList.module.scss';

type Props = {
  track: Track;
  onOpen: (n: number) => void;
  onKeys: (e: KeyboardEvent) => void;
  onAdd: (status: Status) => void;
};

/** The issues here, grouped by status in the order work moves. */
export function IssueList({ track, onOpen, onKeys, onAdd }: Props) {
  return (
    <div className={s.list} onKeyDown={(e) => e.target instanceof HTMLElement && e.target.matches('[role="listitem"]') && onKeys(e)} data-ticking={track.checked.size ? '' : undefined}>
      {/* A status with nothing in it, filtered or not, has no header: an empty bar says nothing. */}
      {track.groups.filter((g) => g.issues.length || g.hidden).map((g) => (
        <Group
          key={g.id}
          status={g.id}
          name={g.name}
          issues={g.issues}
          hidden={g.hidden}
          open={!track.folded.has(g.id)}
          onToggle={() => track.toggle(g.id)}
          track={track}
          onOpen={onOpen}
          onAdd={() => onAdd(g.id)}
        />
      ))}
    </div>
  );
}
