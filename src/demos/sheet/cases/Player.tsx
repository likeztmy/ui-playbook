import { Pause, Play } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Sheet } from '../../../ui/Sheet';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

const SONGS = ['Harbour Lights', 'Gate Two', 'Quay Street', 'Low Tide', 'The 8:30', 'Salt and Rope', 'Last Ferry'];
const POINTS = ['58px', 1];
const ic = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const;

/** A library with the song playing in a sheet: a bar under the list, the whole player when pulled up. */
export function Player() {
  const [song, setSong] = useState(SONGS[0]);
  const [playing, setPlaying] = useState(true);
  const [point, setPoint] = useState<number | string | null>(POINTS[0]);
  const toggle = (
    <Button size="sm" variant="ghost" icon aria-label={playing ? 'Pause' : 'Play'} onClick={() => setPlaying((p) => !p)}>
      {playing ? <Pause {...ic} /> : <Play {...ic} />}
    </Button>
  );
  return (
    <Sheet.Root open onOpenChange={() => setPoint(POINTS[0])} snapPoints={POINTS} snapPoint={point} onSnapPointChange={setPoint}>
      <Sheet.Area className={s.phone}>
        <div className={c.page}>
          <p className={c.count}>Library</p>
          {SONGS.map((x) => (
            <button key={x} type="button" className={c.rowButton} aria-current={x === song || undefined} onClick={() => setSong(x)}>
              {x}
              <span className={c.meta}>Ana Ruiz</span>
            </button>
          ))}
        </div>
      </Sheet.Area>
      <Sheet.Popup title={song} actions={toggle} initialFocus={false}>
        <div className={c.cover} aria-hidden />
        <p className={c.meta}>Ana Ruiz · Low Tide</p>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
