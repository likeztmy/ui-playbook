import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { PlusIcon } from '../ui/icons';
import { Download, Settings2 } from 'lucide-react';
import { Tip, TipGroup } from '../ui/Tooltip';
import { Compare, Gallery, StateGrid, statePin, type State } from './shell';
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

export function ButtonShape() {
  return (
    <Compare
      before={
        <div className={s.row}>
          <Button className={m.outlined}>Cancel</Button>
          <Button className={m.outlined}>Duplicate</Button>
          <Button variant="primary" className={m.outlined}>
            Save
          </Button>
        </div>
      }
      after={
        <div className={s.row}>
          <Button>Cancel</Button>
          <Button>Duplicate</Button>
          <Button variant="primary">Save</Button>
        </div>
      }
      beforeNote="Outlined rectangles. Every button draws a line, and a row of them reads like a row of empty inputs: a border is how a field says “type here”."
      afterNote="Filled pills. Fill says “press me” without a line, and a pill nested in a pill-shaped toolbar or toast is concentric by construction."
    />
  );
}

export function PressFeel() {
  return (
    <Compare
      before={
        <div className={s.row}>
          <Button className={m.bigPress}>Duplicate</Button>
          <Button variant="primary" className={m.bigPress}>
            Save
          </Button>
        </div>
      }
      after={
        <div className={s.row}>
          <Button>Duplicate</Button>
          <Button variant="primary">Save</Button>
        </div>
      }
      beforeNote="Down to 0.9 over 250ms and back the same way. The button visibly shrinks, lags the click, and the label jumps under the cursor."
      afterNote="Down to press-scale (0.97) in 80ms, back on the snappy spring. Quick to answer the finger, soft to let go; too small to move the label."
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
  // One filled button per view: Rename is secondary beside Publish.
  const one = (r: Request, label: string, busyLabel: string, variant: 'secondary' | 'primary') =>
    careful ? (
      <Button variant={variant} loading={r.shown} loadingLabel={busyLabel} onClick={r.run}>
        {label}
      </Button>
    ) : (
      // The naive version: swap the label in place, react at once, accept every press.
      <Button variant={variant} onClick={r.run} leading={r.shown ? <span className={s.naiveSpin} /> : undefined}>
        {r.shown ? busyLabel : label}
      </Button>
    );
  return (
    <div className={s.stack}>
      <div className={s.row}>
        {one(fast, 'Rename', 'Renaming', 'secondary')}
        {one(slow, 'Publish', 'Publishing', 'primary')}
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

export function ButtonVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Primary',
          use: 'The one action this view exists for. One per view.',
          render: () => <Button variant="primary">Save changes</Button>,
        },
        {
          name: 'Secondary',
          use: 'Every other action. The default when in doubt.',
          render: () => <Button>Export</Button>,
        },
        {
          name: 'Ghost',
          use: 'Steps back: toolbars, and quiet actions in dense rows.',
          render: () => <Button variant="ghost">Cancel</Button>,
        },
        {
          name: 'Danger',
          use: 'A destructive action among ordinary ones. Red text on the secondary fill.',
          render: () => <Button variant="danger">Delete</Button>,
        },
        {
          name: 'Danger fill',
          use: 'The single confirm of a destructive dialog. Nowhere else.',
          render: () => <Button variant="danger-fill">Delete project</Button>,
        },
        {
          name: 'Leading icon',
          use: 'When the icon speeds recognition. Every button in the row, or none.',
          render: () => (
            <>
              <Button leading={<PlusIcon />}>New file</Button>
              <Button leading={<Download size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />}>Download</Button>
            </>
          ),
        },
        {
          name: 'Icon only',
          use: 'Icons everyone knows, where space is tight. Always with a tooltip.',
          render: () => (
            <TipGroup>
              <Tip label="Settings">
                <Button icon aria-label="Settings">
                  <Settings2 size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
                </Button>
              </Tip>
              <Tip label="New file" keys={['⌘', 'N']}>
                <Button icon aria-label="New file">
                  <PlusIcon />
                </Button>
              </Tip>
            </TipGroup>
          ),
        },
        {
          name: 'Sizes',
          use: 'sm in toolbars and table rows; md everywhere else; lg for a dialog’s primary or onboarding.',
          render: () => (
            <>
              <Button size="sm">Small</Button>
              <Button>Medium</Button>
              <Button size="lg">Large</Button>
            </>
          ),
        },
      ]}
    />
  );
}
