import { useState } from 'react';
import { Switch } from '../../ui/Switch';
import { Frame } from '../shell';
import { useTimers } from './useTimers';
import s from './novelty.module.scss';

/** How long the blocking switch holds its next press. */
const HOLD = 500;

type Kind = 'expressive' | 'standard' | 'blocking';

const KINDS: { kind: Kind; label: string; description: string }[] = [
  { kind: 'expressive', label: 'Expressive', description: '350 ms, overshoots' },
  { kind: 'standard', label: 'Standard', description: '350 ms, settles' },
  { kind: 'blocking', label: 'Blocking', description: '500 ms, holds the next press' },
];

function Row({ kind, label, description, onLost }: (typeof KINDS)[number] & { onLost: () => void }) {
  const [on, setOn] = useState(false);
  const [busy, setBusy] = useState(false);
  const later = useTimers();
  const flip = (next: boolean) => {
    if (busy) return onLost();
    setOn(next);
    if (kind !== 'blocking') return;
    setBusy(true);
    later(() => setBusy(false), HOLD);
  };
  return <Switch label={label} description={description} checked={on} onCheckedChange={flip} thumbClassName={s[kind]} />;
}

/** Three switches to flip twenty times each: the bounce costs nothing, the hold does. */
export function NoveltySwitches() {
  const [lost, setLost] = useState(0);
  return (
    <Frame height={240} label={<code className={s.readout}>{lost === 1 ? '1 press lost' : `${lost} presses lost`}</code>}>
      <div className={s.switches}>
        {KINDS.map((k) => (
          <Row key={k.kind} {...k} onLost={() => setLost((n) => n + 1)} />
        ))}
      </div>
    </Frame>
  );
}
