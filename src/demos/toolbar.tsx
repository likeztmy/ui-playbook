import { Toolbar } from '../ui/Toolbar';
import { EllipseIcon, PenIcon, PlusIcon, PointerIcon, RectIcon, TextIcon } from '../ui/icons';
import { Compare, Frame, StateGrid, statePin } from './shell';
import m from './mistakes.module.scss';

const TOOLS = [
  ['select', 'Select', <PointerIcon />],
  ['rect', 'Rectangle', <RectIcon />],
  ['ellipse', 'Ellipse', <EllipseIcon />],
  ['text', 'Text', <TextIcon />],
  ['pen', 'Pen', <PenIcon />],
] as const;

function DrawToolbar({ rootClass, toolClass }: { rootClass?: string; toolClass?: string }) {
  return (
    <Toolbar.Root aria-label="Drawing" className={rootClass}>
      <Toolbar.Tools defaultValue={['select']} aria-label="Tools">
        {TOOLS.map(([value, label, icon]) => (
          <Toolbar.Tool key={value} value={value} label={label} className={toolClass}>
            {icon}
          </Toolbar.Tool>
        ))}
      </Toolbar.Tools>
      <Toolbar.Separator />
      <Toolbar.Action primary>
        <PlusIcon />
        Create
      </Toolbar.Action>
    </Toolbar.Root>
  );
}

export function ToolbarPreview() {
  return <DrawToolbar />;
}

export function ToolbarLive() {
  return (
    <Frame label="Live" height={140}>
      <DrawToolbar />
    </Frame>
  );
}

export function ToolbarInset() {
  return (
    <Compare
      before={<DrawToolbar rootClass={m.unevenInset} />}
      after={<DrawToolbar />}
      beforeNote="4px top and bottom, 12px at the sides. The 16px outer corner and the 8px tool corners can't share a centre, so the ends look pinched."
      afterNote="8px on every side: radius-xl 16 − space-2 8 = radius-md 8. Height falls out of it too: 32 + 8 × 2 = 48."
    />
  );
}

export function ToolbarPressed() {
  return (
    <Compare
      before={<DrawToolbar toolClass={m.solidPressed} />}
      after={<DrawToolbar />}
      beforeNote="The current tool is filled with the accent, the same weight as Create. Two things now shout for attention."
      afterNote="A tint (accent-soft) and a blue icon (accent-text) mark the mode. The one solid fill is left for the action."
    />
  );
}

export function ToolbarStates() {
  return (
    <StateGrid
      rows={[false, true].map((pressed) => ({
        name: pressed ? 'Current' : 'Tool',
        render: (state) => (
          <Toolbar.Root aria-label="Tool state" style={{ boxShadow: 'none', padding: 0, background: 'none' }}>
            <Toolbar.Tools defaultValue={pressed ? ['rect'] : []} aria-label="Tools" disabled={state === 'Disabled'}>
              <Toolbar.Tool value="rect" label="Rectangle" pin={statePin[state]}>
                <RectIcon />
              </Toolbar.Tool>
            </Toolbar.Tools>
          </Toolbar.Root>
        ),
      }))}
    />
  );
}
