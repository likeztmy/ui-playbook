import { useRef, useState } from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PlusIcon } from '../ui/icons';
import { Download, Ellipsis, Settings2 } from 'lucide-react';
import { Tip, TipGroup } from '../ui/Tooltip';
import { Compare, Frame, Gallery, StateGrid, statePin, type State } from './shell';
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

/** A document's header: a draft you can publish. */
function DocHeader() {
  const [busy, setBusy] = useState(false);
  const [published, setPublished] = useState(false);
  const pending = useRef(false);
  const publish = () => {
    if (pending.current) return;
    pending.current = true;
    const shown = setTimeout(() => setBusy(true), 300);
    setTimeout(() => {
      clearTimeout(shown);
      pending.current = false;
      setBusy(false);
      setPublished(true);
    }, 1400);
  };
  return (
    <div className={s.doc}>
      <div className={s.docHeader}>
        <div className={s.docTitle}>
          <span className={s.docName}>Q4 roadmap</span>
          <Badge tone={published ? 'success' : 'neutral'} status>
            {published ? 'Published' : 'Draft'}
          </Badge>
        </div>
        <div className={s.docActions}>
          <Tip label="More">
            <Button variant="ghost" icon aria-label="More">
              <Ellipsis size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
            </Button>
          </Tip>
          <Button>Preview</Button>
          <Button variant="primary" loading={busy} loadingLabel="Publishing" onClick={publish}>
            Publish
          </Button>
        </div>
      </div>
      <div className={s.docBody}>
        Ship offline sync to everyone, cut cold start below a second, and retire the old exporter before the holidays.
      </div>
    </div>
  );
}

export function ButtonScene() {
  return (
    <Frame label="Document" height={0}>
      <DocHeader />
    </Frame>
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
      beforeNote={
        <>
          The same fade in as out, as in{' '}
          <a href="https://getbootstrap.com/docs/5.3/components/buttons/">Bootstrap</a>’s 0.15s both ways. On the way in, any delay reads as
          lag.
        </>
      }
      afterNote="What the pointer is on answers at once; what it has left can take its time."
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
      beforeNote={
        <>
          A border is how an empty field says it can be typed in, so a row of outlines reads as a row of fields.{' '}
          <a href="https://getbootstrap.com/docs/5.3/components/buttons/#outline-buttons">Bootstrap’s outline buttons</a> are the common source.
        </>
      }
      afterNote="A fill needs no line, and a pill inside a pill-shaped toolbar or toast is concentric for free."
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
      beforeNote="At 0.9 the press is something you watch rather than feel, and the label moves under the cursor."
      afterNote="0.97 is felt more than seen. Actions run from a keyboard shortcut, hundreds of times a day, don’t play it at all."
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
      beforeNote="Cancel weighs as much as the action it backs out of."
      afterNote={
        <>
          Blue says go; a destructive confirm is a stop, so its one fill is danger. <a href="/principles/colour-means-one-thing">Colour means one thing</a>.
        </>
      }
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
      beforeNote="A spinner that comes and goes in 150ms reads as a glitch, not progress."
      afterNote="Under delay-loading (300ms) nothing changes. Past it, the width reserved for the longer label keeps the button still under the cursor."
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
