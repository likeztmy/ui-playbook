import { useState, type CSSProperties } from 'react';
import { Switch } from '../../ui/Switch';
import { Frame } from '../shell';
import s from './lightness.module.scss';

// The playbook's accent, the same value on both desks.
const ACCENT = 'oklch(56.3% 0.193 256.2)';

/** One blue button on a light desk and a dark one. Join them, and the two blues are one strip. */
export function LightnessNeighbours() {
  const [joined, setJoined] = useState(false);
  return (
    <Frame label={joined ? 'One colour, joined across both desks' : 'The same button on a light desk and a dark one'} height={0}>
      <div className={s.neighbours}>
        <div className={s.desksTwo} style={{ '--n-accent': ACCENT } as CSSProperties}>
          <div className={s.deskLight}>
            <span className={s.send}>Send</span>
          </div>
          <div className={s.deskDark}>
            <span className={s.send}>Send</span>
          </div>
          {joined && <span className={s.bridge} />}
        </div>
        <Switch label="Join them" placement="start" checked={joined} onCheckedChange={setJoined} />
      </div>
    </Frame>
  );
}
