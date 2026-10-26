import { Link, Mail, MessageCircle, Download, Share2 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../../ui/Button';
import { Sheet } from '../../../ui/Sheet';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

const ic = { size: 16, strokeWidth: 1.5, 'aria-hidden': true } as const;
const ACTIONS = [
  { label: 'Copy link', done: 'Link copied', icon: Link },
  { label: 'Message', done: 'Sent in Messages', icon: MessageCircle },
  { label: 'Mail', done: 'Added to a new mail', icon: Mail },
  { label: 'Save to Files', done: 'Saved to Files', icon: Download },
];

/** A photo with Share: a short modal sheet of actions, each of which closes it with its result in place. */
export function Share() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  return (
    <Sheet.Root open={open} onOpenChange={setOpen} kind="modal" snapPoints={['300px']}>
      <Sheet.Area className={s.phone}>
        <div className={c.page}>
          <div className={c.photo} aria-hidden />
          <p className={c.count}>The harbour at 8:10</p>
          <div className={c.shareRow}>
            <Button
              ref={trigger}
              size="sm"
              onClick={() => {
                setDone(null);
                setOpen(true);
              }}
            >
              <Share2 {...ic} />
              Share…
            </Button>
            <span className={c.meta} aria-live="polite">
              {done}
            </span>
          </div>
        </div>
      </Sheet.Area>
      <Sheet.Popup title="Share" finalFocus={trigger}>
        <div className={c.stack}>
          {ACTIONS.map((x) => (
            <Sheet.Close
              key={x.label}
              render={<Button variant="ghost" className={c.action} />}
              onClick={() => setDone(x.done)}
            >
              <x.icon {...ic} />
              {x.label}
            </Sheet.Close>
          ))}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
