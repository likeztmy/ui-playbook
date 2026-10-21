import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { PlusIcon } from '../ui/icons';
import { Compare, StateGrid, statePin, type State } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

export function ButtonPreview() {
  return (
    <div className={s.row}>
      <Button>Cancel</Button>
      <Button variant="primary">Save changes</Button>
    </div>
  );
}

export function ButtonStates() {
  const variants = [
    ['Secondary', 'secondary'],
    ['Primary', 'primary'],
    ['Ghost', 'ghost'],
  ] as const;
  return (
    <StateGrid
      rows={[
        ...variants.map(([name, variant]) => ({
          name,
          render: (state: State) => (
            <Button variant={variant} data-pin={statePin[state]} disabled={state === 'Disabled'}>
              Save
            </Button>
          ),
        })),
        {
          name: 'Icon',
          render: (state) => (
            <Button icon aria-label="Add" data-pin={statePin[state]} disabled={state === 'Disabled'}>
              <PlusIcon />
            </Button>
          ),
        },
      ]}
    />
  );
}

export function HoverTiming() {
  return (
    <Compare
      before={
        <div className={s.row}>
          <Button className={m.slowHover}>Duplicate</Button>
          <Button className={m.slowHover}>Rename</Button>
          <Button className={m.slowHover}>Move</Button>
        </div>
      }
      after={
        <div className={s.row}>
          <Button>Duplicate</Button>
          <Button>Rename</Button>
          <Button>Move</Button>
        </div>
      }
      beforeNote="A 250ms fade both ways. Sweep across the row: the highlight trails behind the pointer."
      afterNote="Appears at once (duration-instant), fades out over duration-fast. The highlight is always under the pointer."
    />
  );
}

export function FocusEdge() {
  return (
    <Compare
      before={<Button className={m.ringReplacesEdge} data-pin="focus">Export</Button>}
      after={<Button data-pin="focus">Export</Button>}
      beforeNote="The ring overwrites the box-shadow that drew the button's edge, so the button loses its outline exactly when it's focused."
      afterNote="box-shadow: var(--shadow-xs), var(--focus-ring). The edge stays and the ring sits outside it."
    />
  );
}

export function OnePrimary() {
  return (
    <Compare
      before={
        <div className={s.footer}>
          <Button variant="primary">Cancel</Button>
          <Button variant="primary">Delete project</Button>
        </div>
      }
      after={
        <div className={s.footer}>
          <Button>Cancel</Button>
          <Button variant="danger-fill">Delete project</Button>
        </div>
      }
      beforeNote="Two filled buttons compete. Cancel looks as important as the action it backs out of."
      afterNote="Cancel steps back to secondary. The one fill is danger, not the accent: blue says go, and this is a stop."
    />
  );
}

/**
 * Runs a fake request of `ms`. The careful version waits delay-loading
 * (300ms) before showing it's busy and ignores presses while busy.
 */
function useFakeRequest(ms: number, careful: boolean) {
  const [shown, setShown] = useState(false);
  const [sent, setSent] = useState(0);
  const pending = useRef(false);
  const run = () => {
    if (careful && pending.current) return;
    pending.current = true;
    setSent((n) => n + 1);
    let t: ReturnType<typeof setTimeout> | undefined;
    if (careful) t = setTimeout(() => setShown(true), 300);
    else setShown(true);
    setTimeout(() => {
      clearTimeout(t);
      pending.current = false;
      setShown(false);
    }, ms);
  };
  return { shown, sent, run };
}

type Request = ReturnType<typeof useFakeRequest>;

function LoadingPair({ careful }: { careful: boolean }) {
  const fast = useFakeRequest(150, careful);
  const slow = useFakeRequest(1600, careful);
  const one = (r: Request, label: string, busyLabel: string) =>
    careful ? (
      <Button variant="primary" loading={r.shown} loadingLabel={busyLabel} onClick={r.run}>
        {label}
      </Button>
    ) : (
      // The naive version: swap the label in place, react at once, accept every press.
      <Button variant="primary" onClick={r.run} leading={r.shown ? <span className={s.naiveSpin} /> : undefined}>
        {r.shown ? busyLabel : label}
      </Button>
    );
  return (
    <div className={s.stack}>
      <div className={s.row}>
        {one(fast, 'Rename', 'Renaming')}
        {one(slow, 'Publish', 'Publishing')}
      </div>
      <p className={s.meter}>
        Requests sent: <b>{fast.sent + slow.sent}</b>
      </p>
    </div>
  );
}

export function LoadingState() {
  return (
    <Compare
      before={<LoadingPair careful={false} />}
      after={<LoadingPair careful />}
      beforeNote="Busy the instant it's pressed. Rename flashes a spinner for 150ms, Publish jumps wider as its label changes, and every extra press sends another request."
      afterNote="Nothing for the first 300ms (delay-loading), so fast actions never flash. The width is reserved for the longer label, and presses while busy are ignored."
    />
  );
}
