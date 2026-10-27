import { useState } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { Switch } from '../ui/Switch';
import { Compare, Frame, Gallery, StateGrid, statePin, type State } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

/** A canvas the settings act on, so their effect shows at once. */
function Canvas({ grid, rulers }: { grid: boolean; rulers: boolean }) {
  return (
    <div className={s.canvas} data-grid={grid || undefined} data-rulers={rulers || undefined} aria-label="Canvas preview" role="img">
      <div className={s.canvasShape} />
    </div>
  );
}

export function SwitchLive() {
  const [grid, setGrid] = useState(true);
  const [rulers, setRulers] = useState(false);
  return (
    <Frame label="Canvas" height={220}>
      <div className={s.settingsDemo}>
        <div className={s.settingsList}>
          <Switch label="Show grid" checked={grid} onCheckedChange={setGrid} />
          <Switch label="Show rulers" checked={rulers} onCheckedChange={setRulers} />
        </div>
        <Canvas grid={grid} rulers={rulers} />
      </div>
    </Frame>
  );
}

function SnapSettings() {
  const [snap, setSnap] = useState(true);
  return (
    <div className={s.settingsList}>
      <Switch label="Snap to grid" description="Moved objects land on grid lines." checked={snap} onCheckedChange={setSnap} />
      <div className={s.subSettings}>
        <Switch label="Snap to objects" defaultChecked disabled={!snap} />
        <Switch label="Snap to pixels" disabled={!snap} />
      </div>
    </div>
  );
}

export function SwitchVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Settings row',
          use: 'Label and description lead; the switch trails, in a column at the edge.',
          render: () => (
            <div className={s.settingsList}>
              <Switch label="Autosave" description="Changes are saved as you type." defaultChecked />
            </div>
          ),
        },
        {
          name: 'Leading',
          use: 'Inside a form or a panel, read left to right with the other controls.',
          render: () => <Switch label="Public link" placement="start" defaultChecked />,
        },
        {
          name: 'Master and subordinate',
          use: 'One switch governs a group; the group waits, disabled, while it’s off.',
          render: () => <SnapSettings />,
        },
        {
          name: 'Without a label',
          use: 'In a table cell whose column already names the setting.',
          render: () => <Switch aria-label="Notifications for Design team" defaultChecked />,
        },
      ]}
    />
  );
}

export function SwitchStates() {
  const row = (name: string, checked: boolean) => ({
    name,
    render: (state: State) => (
      <Switch checked={checked} aria-label={`${name}, ${state}`} pin={statePin[state]} disabled={state === 'Disabled'} />
    ),
  });
  return <StateGrid rows={[row('Off', false), row('On', true)]} />;
}

// ── Comparisons ──────────────────────────────────────────

/** The mistake: a switch that waits for Save, like a checkbox in disguise. */
function DeferredSwitch() {
  const [draft, setDraft] = useState(false);
  const [saved, setSaved] = useState(false);
  return (
    <div className={s.settingsDemo}>
      <div className={s.settingsList}>
        <Switch label="Show grid" checked={draft} onCheckedChange={setDraft} />
        <Button size="sm" variant="primary" onClick={() => setSaved(draft)}>
          Save
        </Button>
      </div>
      <Canvas grid={saved} rulers={false} />
    </div>
  );
}

function ImmediateOrForm() {
  const [grid, setGrid] = useState(false);
  return (
    <div className={s.settingsDemo}>
      <div className={s.settingsList}>
        <Switch label="Show grid" checked={grid} onCheckedChange={setGrid} />
      </div>
      <Canvas grid={grid} rulers={false} />
    </div>
  );
}

export function SwitchImmediate() {
  return (
    <Compare
      beforeLabel="Waits for Save"
      afterLabel="Applies at once"
      height={200}
      before={<DeferredSwitch />}
      after={<ImmediateOrForm />}
      beforeNote="Until Save, the switch says on while the canvas says off: two answers to one question."
      afterNote={
        <>
          A switch is a light switch. A choice that waits for Save is a Checkbox, as <a href="https://developer.apple.com/design/human-interface-guidelines/toggles">Apple’s toggles</a> split them.
        </>
      }
    />
  );
}

function StateLabel() {
  const [on, setOn] = useState(true);
  return (
    <div className={s.settingsList}>
      <Switch label={on ? 'Grid on' : 'Grid off'} checked={on} onCheckedChange={setOn} />
    </div>
  );
}

export function SwitchLabel() {
  return (
    <Compare
      beforeLabel="Label shows the state"
      afterLabel="Label names the setting"
      height={140}
      before={<StateLabel />}
      after={
        <div className={s.settingsList}>
          <Switch label="Show grid" defaultChecked />
        </div>
      }
      beforeNote="Is “Grid off” what it is, or what pressing it will do?"
      afterNote="The label names the setting and never changes; the knob’s side and colour show the state."
    />
  );
}

const SETTINGS: [string, boolean][] = [
  ['Autosave', true],
  ['Show grid', false],
  ['Snap to grid', true],
  ['Show rulers', false],
];

/** Settings with their switches in one column, held still. */
export function SwitchAnatomy() {
  return (
    <Frame label="A settings list" height={0}>
      <figure className={s.anatomyItem}>
        <div className={cx(s.settingsList, s.settingsWide)}>
          {SETTINGS.map(([l, on]) => (
            <Switch key={l} label={l} defaultChecked={on} />
          ))}
        </div>
        <figcaption className={s.anatomyCaption}>Labels on the left edge, switches in one column on the right: what’s on reads top to bottom.</figcaption>
      </figure>
    </Frame>
  );
}

export function SwitchPress() {
  return (
    <Compare
      beforeLabel="Knob holds its shape"
      afterLabel="Knob stretches 4 px"
      height={120}
      before={<Switch aria-label="Show grid, before" pin="active" thumbClassName={m.rigidThumb} />}
      after={<Switch aria-label="Show grid, after" pin="active" />}
      beforeNote="On a small control, the finger covers the only sign that the press registered."
      afterNote="The knob stretches 4px toward where it’ll go, as on iOS and macOS, then slides over on release."
    />
  );
}

export function SwitchPreview() {
  return (
    <div className={s.settingsList}>
      <Switch label="Autosave" defaultChecked />
      <Switch label="Show grid" />
    </div>
  );
}
