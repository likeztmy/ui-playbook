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
          <Button variant="ghost">Cancel</Button>
          <Button variant="danger">Delete project</Button>
        </div>
      }
      beforeNote="Two filled buttons compete. Cancel looks as important as the action it backs out of."
      afterNote="Cancel steps back to ghost. A destructive action gets danger, not the accent: blue says go."
    />
  );
}
