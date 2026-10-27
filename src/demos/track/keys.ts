import type { KeyboardEvent } from 'react';
import type { Track } from './useTrack';

/**
 * The keys on the issues, list or board: arrows move focus and leave ticks alone; Space ticks;
 * Enter opens; Delete deletes what's ticked, or the focused one; Esc lets go of the nearest thing.
 * Shift with an arrow ticks as it goes, as in a file list.
 */
export function onIssueKeys(e: KeyboardEvent, track: Track, open: (n: number | null) => void, focusOn: (n: number) => void) {
  // The row the key was pressed on: what has focus is the truth, whatever state last heard.
  const own = Number((e.target as HTMLElement).dataset.n);
  const at = track.order.includes(own) ? own : null;
  const move = (step: number) => {
    const i = at == null ? (step > 0 ? -1 : track.order.length) : track.order.indexOf(at);
    const next = track.order[Math.max(0, Math.min(track.order.length - 1, i + step))];
    if (next == null) return;
    if (e.shiftKey) {
      if (at != null && !track.checked.has(at)) track.tick(at);
      if (!track.checked.has(next)) track.tick(next);
    }
    track.setFocus(next);
    focusOn(next);
    // With an issue open, the panel follows: the next one is read without leaving the list.
    if (track.open != null) track.setOpen(next);
  };
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault();
      return move(1);
    case 'ArrowUp':
      e.preventDefault();
      return move(-1);
    case 'Home':
      e.preventDefault();
      return move(-track.order.length);
    case 'End':
      e.preventDefault();
      return move(track.order.length);
    case 'Enter':
      if (at != null) open(at);
      return;
    case ' ':
      e.preventDefault();
      if (at != null) track.tick(at);
      return;
    case 'Delete':
    case 'Backspace':
      e.preventDefault();
      if (track.checked.size) track.remove([...track.checked]);
      else if (at != null) track.remove([at]);
      return;
    case 'Escape':
      if (track.checked.size) track.setChecked(new Set());
      else if (track.open != null) open(null);
      return;
  }
}
