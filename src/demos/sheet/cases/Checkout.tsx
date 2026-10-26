import { useRef, useState } from 'react';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/Field';
import { Sheet } from '../../../ui/Sheet';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

const FIELDS = ['Full name', 'Email', 'Address', 'City', 'Postcode', 'Card number', 'Expiry', 'Security code'];

/** A cart whose checkout is a full-height modal sheet of eight fields: a task of its own, swiped away by mistake. */
export function Checkout() {
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <Sheet.Root open={open} onOpenChange={setOpen} kind="modal" snapPoints={[1]}>
      <Sheet.Area className={s.phone}>
        <div className={c.page}>
          <p className={c.count}>Your basket</p>
          <div className={c.row}>
            <span>Ferry tickets × 2</span>
            <span className={c.meta}>£36</span>
          </div>
          <div className={c.row}>
            <span>Bike on board</span>
            <span className={c.meta}>£12</span>
          </div>
          <Button ref={trigger} variant="primary" className={c.wide} onClick={() => setOpen(true)}>
            Check out
          </Button>
        </div>
      </Sheet.Area>
      <Sheet.Popup title="Check out" finalFocus={trigger}>
        <div className={c.stack}>
          {FIELDS.map((x) => (
            <TextField key={x} label={x} />
          ))}
          <Button variant="primary">Pay £48</Button>
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
