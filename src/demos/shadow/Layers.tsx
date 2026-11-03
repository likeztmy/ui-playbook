import { useState } from 'react';
import { Checkbox } from '../../ui/Checkbox';
import { Compare } from '../shell';
import { Lifted } from './Lifted';
import s from './shadow.module.scss';

// Dark values after the kit's dark shadows: the edge a white hairline, contact and distance deeper black.
const EDGE = `0 0 0 1px light-dark(oklch(0.3 0.01 75 / 0.08), oklch(1 0 0 / 0.09))`;
const CONTACT = `0 1px 2px light-dark(oklch(0.3 0.01 75 / 0.06), oklch(0 0 0 / 0.4))`;
const DISTANCE = `0 6px 12px light-dark(oklch(0.3 0.01 75 / 0.08), oklch(0 0 0 / 0.4))`;

/** The After's layers, each one switchable, to see what it does on its own. */
function Layered() {
  const [edge, setEdge] = useState(true);
  const [distance, setDistance] = useState(true);
  const shadow = [edge && EDGE, edge && CONTACT, distance && DISTANCE].filter(Boolean).join(', ') || 'none';
  return (
    <div className={s.layered}>
      <Lifted shadow={shadow} />
      <div className={s.switches}>
        <Checkbox label="Edge" checked={edge} onCheckedChange={(v) => setEdge(!!v)} />
        <Checkbox label="Distance" checked={distance} onCheckedChange={(v) => setDistance(!!v)} />
      </div>
    </div>
  );
}

export function ShadowLayers() {
  return (
    <Compare
      beforeLabel="One dark 24 px drop"
      afterLabel="Hairline, contact and drop"
      height={0}
      before={
        <div className={s.layered}>
          <Lifted shadow="0 8px 24px light-dark(oklch(0.3 0.01 75 / 0.22), oklch(0 0 0 / 0.7))" />
          {/* The Prefer side's switch row, held empty, so the two desks start on one line. */}
          <div className={s.switches} />
        </div>
      }
      after={<Layered />}
      beforeNote="One shadow does both jobs. Dark enough to draw the card’s edge, its long soft drop is heavy, a smudge around the card; any lighter and the edge melts into the desk."
      afterNote={
        <>
          A hairline and a 1px contact shadow draw the edge; a soft drop, its offset half its blur, says how far. Each is light, and together they
          read as one lift. Fluent builds every shadow this way, and notes that Windows draws the edge with a stroke (
          <a href="https://fluent2.microsoft.design/elevation">Fluent 2, Elevation</a>).
        </>
      }
    />
  );
}
