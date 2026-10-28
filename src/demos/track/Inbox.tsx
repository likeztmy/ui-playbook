import { useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../ui/Button';
import { InboxRow } from './InboxRow';
import type { Track } from './useTrack';
import s from './Inbox.module.scss';

type Props = {
  track: Track;
  /** Opens an issue beside the list, or closes it with null; open here, it's read (useTrack). */
  onOpen: (n: number | null) => void;
};

/**
 * What's happened to your issues, one line each, newest first. Opening one shows the issue beside
 * the list, as it is now, and reads it. The keys follow Linear's: U for read, ⌥U for all, Backspace
 * to clear.
 */
export function Inbox({ track, onOpen }: Props) {
  const { inbox } = track;
  const order = inbox.entries.map((e) => e.issue.n);
  const [focus, setFocus] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const focusOn = (n: number) => root.current?.querySelector<HTMLElement>(`[data-n="${n}"]`)?.focus();

  const onKeys = (e: KeyboardEvent) => {
    if (!(e.target instanceof HTMLElement) || !e.target.matches('[role="listitem"]')) return;
    const at = Number(e.target.dataset.n);
    const i = order.indexOf(at);
    const move = (to: number) => {
      const next = order[Math.max(0, Math.min(order.length - 1, to))];
      if (next == null) return;
      e.preventDefault();
      focusOn(next);
      // With an issue open, the panel follows, as in the list.
      if (track.open != null) onOpen(next);
    };
    if (e.code === 'KeyU' && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      return e.altKey ? inbox.readAll() : inbox.toggle(at);
    }
    switch (e.key) {
      case 'ArrowDown':
      case 'j':
        return move(i + 1);
      case 'ArrowUp':
      case 'k':
        return move(i - 1);
      case 'Home':
        return move(0);
      case 'End':
        return move(order.length - 1);
      case 'Enter':
        return onOpen(at);
      case 'Delete':
      case 'Backspace': {
        e.preventDefault();
        // Focus goes to the one after, or before it at the end, or to the empty state's way on.
        const next = order[i + 1] ?? order[i - 1];
        inbox.clear(at);
        if (track.open === at) onOpen(null);
        requestAnimationFrame(() => (next != null ? focusOn(next) : root.current?.querySelector<HTMLElement>('button')?.focus()));
        return;
      }
      case 'Escape':
        if (track.open != null) onOpen(null);
        return;
    }
  };

  if (!order.length)
    return (
      <div ref={root} className={s.empty}>
        <p>Nothing new on your issues.</p>
        <Button onClick={() => track.go('mine')}>Go to My issues</Button>
      </div>
    );

  const stop = focus != null && order.includes(focus) ? focus : order[0];
  return (
    <div ref={root} className={s.list} role="list" aria-label="Inbox" onKeyDown={onKeys}>
      {inbox.entries.map((e) => (
        <InboxRow key={e.issue.n} entry={e} tabStop={e.issue.n === stop} current={track.open === e.issue.n} onOpen={onOpen} onFocus={setFocus} />
      ))}
    </div>
  );
}
