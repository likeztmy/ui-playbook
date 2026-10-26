import { Check, LoaderCircle } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Button } from '../../ui/Button';
import { TIMEOUT } from '../../ui/Toast';
import s from './Sending.module.scss';

/**
 * A message just sent, where it landed: that it's going, the way back, and how long the way back
 * lasts, as a bar draining along the top of whatever holds it (positioned). Once the window ends:
 * that it went.
 */
export function Sending({ onUndo, done }: { onUndo: () => void; done?: boolean }) {
  if (done)
    return (
      <span className={s.status} role="status">
        <Check size={14} strokeWidth={1.75} nonScalingStroke aria-hidden />
        Sent
      </span>
    );
  return (
    <>
      <span className={s.status} role="status" data-spot="undo">
        <LoaderCircle size={14} strokeWidth={1.75} nonScalingStroke aria-hidden className={s.spin} />
        Sending
        <Button size="sm" onClick={onUndo}>
          Undo
        </Button>
      </span>
      <span className={s.window} style={{ '--window': `${TIMEOUT.action}ms` } as CSSProperties} aria-hidden />
    </>
  );
}
