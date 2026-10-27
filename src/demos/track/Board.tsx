import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { createPortal } from 'react-dom';
import { Card } from './Card';
import type { Status } from './model';
import { StatusIcon } from './StatusIcon';
import type { Track } from './useTrack';
import s from './Board.module.scss';

type Drag = {
  n: number;
  /** Where the pointer holds the card, from its corner. */
  dx: number;
  dy: number;
  w: number;
  h: number;
  x: number;
  y: number;
  /** Where it would land: a column, and the card it would go before (null: last). */
  status: Status;
  before: number | null;
};

// A press becomes a drag only past this: a click that wobbles a pixel still opens the card.
const SLOP = 4;

type Props = { track: Track; onOpen: (n: number) => void; onKeys: (e: KeyboardEvent) => void };

/** The same issues as columns, one per status. Drag a card to move it: a gap opens where it will land. */
export function Board({ track, onOpen, onKeys }: Props) {
  const [drag, setDrag] = useState<Drag | null>(null);
  const press = useRef<{ n: number; x: number; y: number; el: HTMLElement; id: number } | null>(null);
  const dropped = useRef(false);
  const root = useRef<HTMLDivElement>(null);

  /** The column under the pointer, and the first card in it whose middle is below the pointer. */
  const target = (x: number, y: number, n: number): Pick<Drag, 'status' | 'before'> | null => {
    const cols = [...(root.current?.querySelectorAll<HTMLElement>('[data-column]') ?? [])];
    const col = cols.find((c) => {
      const r = c.getBoundingClientRect();
      return x >= r.left && x <= r.right;
    });
    if (!col) return null;
    const cards = [...col.querySelectorAll<HTMLElement>('[data-n]')].filter((c) => Number(c.dataset.n) !== n);
    const below = cards.find((c) => {
      const r = c.getBoundingClientRect();
      return y < r.top + r.height / 2;
    });
    return { status: col.dataset.column as Status, before: below ? Number(below.dataset.n) : null };
  };

  const down = (n: number) => (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || e.pointerType === 'touch') return;
    press.current = { n, x: e.clientX, y: e.clientY, el: e.currentTarget, id: e.pointerId };
  };

  useEffect(() => {
    const move = (e: globalThis.PointerEvent) => {
      const p = press.current;
      if (!p) return;
      if (!drag && Math.hypot(e.clientX - p.x, e.clientY - p.y) < SLOP) return;
      const r = p.el.getBoundingClientRect();
      setDrag((d) => {
        const base = d ?? { n: p.n, dx: p.x - r.left, dy: p.y - r.top, w: r.width, h: r.height, x: 0, y: 0, status: 'todo' as Status, before: null };
        const t = target(e.clientX, e.clientY, p.n);
        return { ...base, x: e.clientX, y: e.clientY, ...(t ?? { status: base.status, before: base.before }) };
      });
    };
    const up = () => {
      press.current = null;
      if (drag) {
        track.move(drag.n, drag.status, drag.before);
        dropped.current = true;
      }
      setDrag(null);
    };
    const key = (e: globalThis.KeyboardEvent) => {
      // Esc while dragging: the card goes back where it was.
      if (e.key === 'Escape' && press.current) {
        press.current = null;
        setDrag(null);
        dropped.current = true;
      }
    };
    addEventListener('pointermove', move);
    addEventListener('pointerup', up);
    addEventListener('keydown', key, true);
    return () => {
      removeEventListener('pointermove', move);
      removeEventListener('pointerup', up);
      removeEventListener('keydown', key, true);
    };
  }, [drag, track]);

  const lifted = drag ? track.get(drag.n) : undefined;
  return (
    <div
      ref={root}
      className={s.board}
      data-dragging={drag ? '' : undefined}
      data-ticking={track.checked.size ? '' : undefined}
      onKeyDown={(e) => e.target instanceof HTMLElement && e.target.matches('[role="listitem"]') && onKeys(e)}
      onClickCapture={(e) => {
        // The click that ends a drag isn't a click on the card.
        if (dropped.current) {
          dropped.current = false;
          e.stopPropagation();
        }
      }}
    >
      {track.groups.map((g) => {
        const where = drag ? (drag.status === g.id ? drag : null) : null;
        const cards = g.issues.filter((i) => i.n !== drag?.n);
        const gapAt = where ? (where.before == null ? cards.length : cards.findIndex((i) => i.n === where.before)) : -1;
        return (
          <section key={g.id} className={s.column} aria-label={g.name} data-column={g.id} data-over={where ? '' : undefined}>
            <h2 className={s.header}>
              <StatusIcon status={g.id} />
              <span className={s.name}>{g.name}</span>
              <span className={s.count}>{g.issues.length}</span>
              {g.hidden > 0 && <span className={s.hidden}>{g.hidden} hidden</span>}
            </h2>
            <div className={s.cards} role="list">
              {cards.map((i, k) => [
                k === gapAt && <div key="gap" className={s.gap} style={{ height: drag!.h }} />,
                <Card key={i.n} issue={i} track={track} onOpen={onOpen} onPointerDown={down(i.n)} />,
              ])}
              {gapAt === cards.length && <div className={s.gap} style={{ height: drag!.h }} />}
              {g.issues.length === 0 && !where && <p className={s.empty}>{g.hidden ? 'None match the filter' : 'No issues'}</p>}
            </div>
          </section>
        );
      })}
      {drag &&
        lifted &&
        createPortal(
          <div className={s.lift} style={{ width: drag.w, left: drag.x - drag.dx, top: drag.y - drag.dy }}>
            <Card issue={lifted} lifted />
          </div>,
          document.body,
        )}
    </div>
  );
}
