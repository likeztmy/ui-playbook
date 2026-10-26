import { useRef, useState, type PointerEvent } from 'react';
import { Compare } from '../shell';
import s from './shadow.module.scss';

const REST = '0 0 0 1px oklch(0.3 0.01 75 / 0.08), 0 1px 2px oklch(0.3 0.01 75 / 0.06)';
const HELD = '0 0 0 1px oklch(0.3 0.01 75 / 0.08), 0 2px 4px oklch(0.3 0.01 75 / 0.05), 0 12px 24px oklch(0.3 0.01 75 / 0.12)';

/** A card to drag around its desk; it springs back when let go. `lifts` raises it while held. */
function Draggable({ lifts }: { lifts?: boolean }) {
  const [at, setAt] = useState({ x: 0, y: 0 });
  const [held, setHeld] = useState(false);
  const from = useRef<{ x: number; y: number } | null>(null);
  const down = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    from.current = { x: e.clientX, y: e.clientY };
    setHeld(true);
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (from.current) setAt({ x: e.clientX - from.current.x, y: e.clientY - from.current.y });
  };
  const up = () => {
    from.current = null;
    setHeld(false);
    setAt({ x: 0, y: 0 });
  };
  return (
    <div className={s.desk}>
      <div className={s.stack}>
        <div className={s.card} style={{ boxShadow: REST }}>
          <span className={s.thumb} aria-hidden />
          <span className={s.name}>Brand guide</span>
          <span className={s.meta}>Edited yesterday</span>
        </div>
        <div
          className={s.card}
          data-dragging={held ? '' : undefined}
          style={{ boxShadow: lifts && held ? HELD : REST, translate: `${at.x}px ${at.y}px` }}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
        >
          <span className={s.thumb} aria-hidden />
          <span className={s.name}>Q4 roadmap</span>
          <span className={s.meta}>Drag me</span>
        </div>
      </div>
    </div>
  );
}

/** Picked up: a card dragged over another, once flat in the hand, once lifted while it's held. */
export function ShadowPickup() {
  return (
    <Compare
      height={0}
      before={<Draggable />}
      after={<Draggable lifts />}
      beforeNote="Dragged, the card keeps its resting shadow. Pulled over its neighbour it reads as printed on top of it, not carried above it, and nothing says it’s in your hand."
      afterNote={
        <>
          Held, it lifts: a longer drop, the same darkness, so it reads as above the rest until it’s let go. Material keeps its highest levels for
          exactly this, a thing under the pointer or being dragged (
          <a href="https://m3.material.io/styles/elevation/overview">Material 3, Elevation</a>).
        </>
      }
    />
  );
}
