import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { cx } from '../../ui/cx';
import { Tip } from '../../ui/Tooltip';
import { Compare, localized } from '../shell';
import s from './interrupt.module.scss';

/**
 * A settings page with an Edit profile sheet. `keyframes` slides it with
 * two @keyframes, as shadcn/ui's Sheet does; otherwise with a transition.
 * Both take shadcn's timing: 500 ms in, 300 ms out, ease-in-out. Either way
 * focus moves to the first field, the page behind is inert while it's open,
 * and closing gives focus back to Edit profile.
 */
function Sheet({ keyframes }: { keyframes?: boolean }) {
  const [open, setOpen] = useState(false);
  const [touched, setTouched] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLInputElement>(null);
  const set = (next: boolean) => {
    setOpen(next);
    setTouched(true);
  };
  // After the render that lifts or sets `inert`: nothing inside an inert subtree takes focus.
  // preventScroll, or the stage would scroll to the sheet while it is still off its edge.
  useEffect(() => {
    if (!touched) return;
    if (open) {
      first.current?.focus({ preventScroll: true });
      first.current?.select();
    } else opener.current?.focus({ preventScroll: true });
  }, [open, touched]);
  const state = { 'data-open': open ? '' : undefined, 'data-touched': touched ? '' : undefined };
  return (
    <div className={cx(s.intSheetStage, keyframes ? s.intSheetKeys : s.intSheetFluid)} onKeyDown={(e) => e.key === 'Escape' && open && set(false)}>
      <div className={s.intPage} inert={open}>
        <span className={s.intPageTitle}>Account</span>
        <span className={s.intPageMeta}>Ada Lovelace · @ada</span>
        <Button ref={opener} size="sm" className={s.intOpen} onClick={() => set(true)}>
          Edit profile
        </Button>
      </div>
      <div className={s.intOverlay} {...state} onClick={() => set(false)} />
      <div className={s.intSheet} role="dialog" aria-modal={open} aria-label="Edit profile" inert={!open} {...state}>
        <span className={s.intPageTitle}>Edit profile</span>
        <input ref={first} className={s.intField} aria-label="Name" defaultValue="Ada Lovelace" />
        <input className={s.intField} aria-label="Username" defaultValue="@ada" />
        <Tip label="Close">
          <Button variant="ghost" size="sm" icon className={s.intClose} aria-label="Close" onClick={() => set(false)}>
            <X size={16} aria-hidden />
          </Button>
        </Tip>
      </div>
    </div>
  );
}

export const InterruptKeyframes = localized(function InterruptKeyframes() {
  return (
    <Compare
      beforeLabel="Two keyframe animations"
      afterLabel="One reversible transition"
      height={0}
      motion
      before={<Sheet keyframes />}
      after={<Sheet />}
      beforeNote={
        <>
          shadcn/ui’s <a href="https://ui.shadcn.com/docs/components/sheet">Sheet</a> slides in and out with two keyframe animations. Open it, then
          close it at once: the closing animation starts from its own first frame, so the sheet snaps fully open before it slides away.
        </>
      }
      afterNote={
        <>
          A transition only knows where it is and where it’s going, so the sheet turns back from where it got to. The way back is shorter, too: a
          reversed transition is cut by how far it went, the spec’s <a href="https://www.w3.org/TR/css-transitions-1/">reversing shortening factor</a>
          . In Chrome, a 1000 ms move reversed at its midpoint came back in 508 ms.
        </>
      }
    />
  );
});
