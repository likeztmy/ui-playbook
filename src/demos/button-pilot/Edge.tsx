import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { Compare } from '../shell';
import s from './pilot.module.scss';

// What the eye reads in a press is the edge moving in, about 1.5px on a 100px button at 0.97.
// Past a button's width, a press moves the edge no further than that; it never goes deeper than 0.97.
const EDGE = 1.5;
const DEEPEST = 0.97;

const TILES = [
  { name: 'Tag', size: s.chip },
  { name: 'Open', size: s.small },
  { name: 'Q4 roadmap · final draft', size: s.card },
];

/** A tile that presses by a scale, or by one that moves its edge no more than EDGE pixels; it says how far its edge moved. */
function Tile({ name, size, byEdge }: { name: string; size: string; byEdge?: boolean }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [w, setW] = useState(0);
  useLayoutEffect(() => setW(ref.current?.offsetWidth ?? 0), []);
  const scale = byEdge && w ? Math.max(DEEPEST, 1 - (2 * EDGE) / w) : DEEPEST;
  const moves = (w * (1 - scale)) / 2;
  return (
    <div className={s.tileCell}>
      <button ref={ref} type="button" className={`${s.tile} ${size}`} style={{ '--press': scale } as CSSProperties}>
        {name}
      </button>
      <span className={s.tileMeta}>
        {scale.toFixed(3)} · edge {moves.toFixed(1)} px
      </span>
    </div>
  );
}

function Tiles({ byEdge }: { byEdge?: boolean }) {
  return (
    <div className={s.tiles}>
      {TILES.map((t) => (
        <Tile key={t.name} {...t} byEdge={byEdge} />
      ))}
    </div>
  );
}

/** Press a tag, a button and a card: one scale for all, or one edge for all. */
export function PilotEdge() {
  return (
    <Compare
      height={260}
      beforeLabel="0.97 for all"
      afterLabel="No edge moves more than 1.5 px"
      before={<Tiles />}
      after={<Tiles byEdge />}
      beforeNote="The card's edges travel nearly four times as far as the button's, so it lurches while the tag barely moves."
      afterNote="Small things keep 0.97; the card's scale is worked out from its width, so its edge moves no further than a button's."
    />
  );
}
