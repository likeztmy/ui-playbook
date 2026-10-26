import { useRef, useState } from 'react';
import { Button } from '../../../ui/Button';
import { Sheet } from '../../../ui/Sheet';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

/** An article that greets you with a sheet asking for the app, before a line of it is read. */
export function Arrival() {
  const [open, setOpen] = useState(true);
  const page = useRef<HTMLDivElement>(null);
  return (
    <Sheet.Root open={open} onOpenChange={setOpen} kind="modal" snapPoints={['260px']}>
      <Sheet.Area className={s.phone}>
        <div ref={page} className={c.page} tabIndex={-1}>
          <p className={c.count}>Ferry timetable changes from Monday</p>
          <p className={c.note}>
            From Monday the first crossing leaves at 6:40, twenty minutes earlier, and the last one at 23:10. Bikes
            board first on every crossing, and the 8:30 gains a second deck for cars.
          </p>
        </div>
      </Sheet.Area>
      <Sheet.Popup title="Get the app" finalFocus={page} initialFocus={false}>
        <div className={c.stack}>
          <p className={c.meta}>Tickets, times and alerts, all in one place.</p>
          <Button variant="primary">Open the App Store</Button>
          <Sheet.Close render={<Button variant="ghost" />}>Not now</Sheet.Close>
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
