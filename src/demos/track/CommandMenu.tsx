import { Dialog } from '@base-ui/react/dialog';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePortalContainer } from '../../ui/portal';
import { find, type Command } from './commands';
import s from './CommandMenu.module.scss';

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Says what the commands act on, first: "SHOP-12 Dark mode…", "3 issues". */
  target: string;
  commands: Command[];
};

/**
 * Every action in one list you type into. Its first line names what it acts on, so "Delete" is never
 * a guess. The first match is ready for Enter.
 */
export function CommandMenu({ open, onOpenChange, target, commands }: Props) {
  const container = usePortalContainer();
  const [q, setQ] = useState('');
  const [at, setAt] = useState(0);
  const list = useRef<HTMLDivElement>(null);
  const found = useMemo(() => find(commands, q), [commands, q]);
  useEffect(() => {
    if (open) setQ('');
  }, [open]);
  useEffect(() => setAt(0), [q, open]);
  useEffect(() => {
    list.current?.querySelector('[data-highlighted]')?.scrollIntoView({ block: 'nearest' });
  }, [at]);

  const run = (c: Command | undefined) => {
    if (!c) return;
    onOpenChange(false);
    c.run();
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal container={container}>
        <Dialog.Backdrop className={s.backdrop} />
        <Dialog.Popup className={s.popup} aria-label="Commands">
          <div className={s.target}>{target}</div>
          <input
            className={s.input}
            placeholder="Type a command…"
            aria-label="Command"
            role="combobox"
            aria-expanded
            aria-controls="track-commands"
            aria-activedescendant={found[at] ? `cmd-${found[at].id}` : undefined}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                setAt((a) => Math.min(found.length - 1, a + 1));
              } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setAt((a) => Math.max(0, a - 1));
              } else if (e.key === 'Enter') {
                e.preventDefault();
                run(found[at]);
              }
            }}
          />
          <div ref={list} id="track-commands" className={s.list} role="listbox" aria-label="Commands">
            {found.map((c, k) => [
              (k === 0 || found[k - 1].group !== c.group) && (
                <div key={`g-${c.group}`} className={s.group} role="presentation">
                  {c.group}
                </div>
              ),
              <div
                key={c.id}
                id={`cmd-${c.id}`}
                role="option"
                aria-selected={k === at}
                className={s.item}
                data-highlighted={k === at ? '' : undefined}
                onPointerMove={() => setAt(k)}
                onClick={() => run(c)}
              >
                <span className={s.lead}>{c.lead ?? (c.icon && <c.icon size={16} strokeWidth={1.5} aria-hidden />)}</span>
                {c.label}
              </div>,
            ])}
            {found.length === 0 && <p className={s.empty}>No command matches “{q.trim()}”</p>}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
