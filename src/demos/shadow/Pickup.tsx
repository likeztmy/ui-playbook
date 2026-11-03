import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { Compare } from '../shell';
import s from './shadow.module.scss';

// Dark values after the kit's dark shadows, as in Layers. Held takes `shadow-lg`'s drop: longer, the same 8%.
const REST = `0 0 0 1px light-dark(oklch(0.3 0.01 75 / 0.08), oklch(1 0 0 / 0.09)), 0 1px 2px light-dark(oklch(0.3 0.01 75 / 0.06), oklch(0 0 0 / 0.4))`;
const HELD = `0 0 0 1px light-dark(oklch(0.3 0.01 75 / 0.08), oklch(1 0 0 / 0.09)), 0 2px 4px light-dark(oklch(0.3 0.01 75 / 0.05), oklch(0 0 0 / 0.3)), 0 12px 24px light-dark(oklch(0.3 0.01 75 / 0.08), oklch(0 0 0 / 0.5))`;

// Held from the keyboard, the card is carried up over its neighbour, about where a drag would take it.
const KEY_LIFT = { x: 24, y: -40 };

/**
 * A card to drag around its desk; it springs back when let go. `lifts` raises it while held.
 * Space held does the same from the keyboard; Enter picks it up and puts it down.
 */
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
  const keyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (held) up();
      else {
        setHeld(true);
        setAt(KEY_LIFT);
      }
      return;
    }
    if (e.key !== ' ') return;
    e.preventDefault();
    if (e.repeat) return;
    setHeld(true);
    setAt(KEY_LIFT);
  };
  const keyUp = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === ' ') up();
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
          role="button"
          aria-pressed={held}
          tabIndex={0}
          data-dragging={held ? '' : undefined}
          style={{ '--card-shadow': lifts && held ? HELD : REST, translate: `${at.x}px ${at.y}px` } as CSSProperties}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          onPointerCancel={up}
          onKeyDown={keyDown}
          onKeyUp={keyUp}
          onBlur={up}
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
      beforeLabel="Same shadow while held"
      afterLabel="Longer drop while held"
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
