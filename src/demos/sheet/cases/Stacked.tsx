import { useRef, useState } from 'react';
import { Button } from '../../../ui/Button';
import { Sheet } from '../../../ui/Sheet';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

const PLAYLISTS = ['Morning crossing', 'Rainy days', 'Long walks'];

/** A song's options sheet whose Add to playlist opens a second sheet over the first. */
export function Stacked() {
  const [first, setFirst] = useState(true);
  const [second, setSecond] = useState(false);
  const add = useRef<HTMLButtonElement>(null);
  return (
    <Sheet.Root open={second} onOpenChange={setSecond} kind="modal" snapPoints={['240px']}>
      <Sheet.Area className={s.phone}>
        <Sheet.Root open={first} onOpenChange={setFirst} kind="modal" snapPoints={['300px']}>
          <Sheet.Area className={c.fill}>
            <div className={c.page}>
              <p className={c.count}>Library</p>
              <Button size="sm" onClick={() => setFirst(true)}>
                Harbour Lights…
              </Button>
            </div>
          </Sheet.Area>
          <Sheet.Popup title="Harbour Lights" initialFocus={false}>
            <div className={c.stack}>
              <Button ref={add} variant="ghost" className={c.action} onClick={() => setSecond(true)}>
                Add to playlist…
              </Button>
              <Button variant="ghost" className={c.action}>
                Play next
              </Button>
              <Button variant="ghost" className={c.action}>
                Go to album
              </Button>
            </div>
          </Sheet.Popup>
        </Sheet.Root>
      </Sheet.Area>
      <Sheet.Popup title="Add to playlist" finalFocus={add}>
        <div className={c.stack}>
          {PLAYLISTS.map((x) => (
            <Sheet.Close key={x} render={<Button variant="ghost" className={c.action} />}>
              {x}
            </Sheet.Close>
          ))}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
