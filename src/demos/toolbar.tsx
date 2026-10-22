import { Toolbar } from '../ui/Toolbar';
import { EllipseIcon, PenIcon, PlusIcon, PointerIcon, RectIcon, TextIcon } from '../ui/icons';
import { Bold, Italic, Redo2, Underline, Undo2 } from 'lucide-react';
import { Compare, Frame, Gallery, StateGrid, statePin } from './shell';
import m from './mistakes.module.scss';

const TOOLS = [
  ['select', 'Select', <PointerIcon />, 'V'],
  ['rect', 'Rectangle', <RectIcon />, 'R'],
  ['ellipse', 'Ellipse', <EllipseIcon />, 'O'],
  ['text', 'Text', <TextIcon />, 'T'],
  ['pen', 'Pen', <PenIcon />, 'P'],
] as const;

function DrawToolbar({ rootClass, toolClass, nativeTitle }: { rootClass?: string; toolClass?: string; nativeTitle?: boolean }) {
  return (
    <Toolbar.Root aria-label="Drawing" className={rootClass}>
      <Toolbar.Tools defaultValue={['select']} aria-label="Tools">
        {TOOLS.map(([value, label, icon, key]) => (
          <Toolbar.Tool key={value} value={value} label={label} keys={[key]} className={toolClass} nativeTitle={nativeTitle}>
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
      beforeNote="4px top and bottom, 12px at the sides. The end tools sit off the pill's centre, so the ends look stretched and the gap bulges at each end."
      afterNote="4px on every side: a pill in a pill, concentric by shape. Height falls out of it too: 32 + 4 × 2 = 40."
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

export function ToolbarTips() {
  return (
    <Compare
      height={160}
      before={<DrawToolbar nativeTitle />}
      after={<DrawToolbar />}
      beforeNote="A native title: the browser waits about a second, draws it in the system's style far from the button, has no shortcut, and makes you wait again for every neighbour."
      afterNote="A Tip after delay-tooltip (500ms) with the tool's shortcut. Slide along the row and each label swaps in at once."
    />
  );
}

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

export function ToolbarVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Tools',
          use: 'Modes: what the pointer does next. Exactly one is current, so it shows pressed.',
          render: () => (
            <Toolbar.Root aria-label="Tools">
              <Toolbar.Tools defaultValue={['select']} aria-label="Tools">
                {TOOLS.slice(0, 3).map(([value, label, icon, key]) => (
                  <Toolbar.Tool key={value} value={value} label={label} keys={[key]}>
                    {icon}
                  </Toolbar.Tool>
                ))}
              </Toolbar.Tools>
            </Toolbar.Root>
          ),
        },
        {
          name: 'Toggles',
          use: 'Independent on/off settings, like text styles. Any number can be pressed.',
          render: () => (
            <Toolbar.Root aria-label="Text style">
              <Toolbar.Tools multiple defaultValue={['bold']} aria-label="Text style">
                <Toolbar.Tool value="bold" label="Bold" keys={['⌘', 'B']}>
                  <Bold {...ic} />
                </Toolbar.Tool>
                <Toolbar.Tool value="italic" label="Italic" keys={['⌘', 'I']}>
                  <Italic {...ic} />
                </Toolbar.Tool>
                <Toolbar.Tool value="underline" label="Underline" keys={['⌘', 'U']}>
                  <Underline {...ic} />
                </Toolbar.Tool>
              </Toolbar.Tools>
            </Toolbar.Root>
          ),
        },
        {
          name: 'Actions',
          use: 'One-off commands. Buttons, never pressed; a primary only for the toolbar’s main job.',
          render: () => (
            <Toolbar.Root aria-label="History">
              <Toolbar.Action label="Undo" keys={['⌘', 'Z']}>
                <Undo2 {...ic} />
              </Toolbar.Action>
              <Toolbar.Action label="Redo" keys={['⇧', '⌘', 'Z']}>
                <Redo2 {...ic} />
              </Toolbar.Action>
              <Toolbar.Separator />
              <Toolbar.Action primary>
                <PlusIcon />
                Create
              </Toolbar.Action>
            </Toolbar.Root>
          ),
        },
      ]}
    />
  );
}
