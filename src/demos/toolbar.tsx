import { Toolbar } from '../ui/Toolbar';
import { PlusIcon, RectIcon } from '../ui/icons';
import { Bold, Italic, Redo2, Underline, Undo2 } from 'lucide-react';
import { CanvasScene, TOOLS } from './canvas';
import { Compare, Frame, Gallery, StateGrid, statePin } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

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
  return <CanvasScene />;
}

export function ToolbarAnatomy() {
  return (
    <Frame label="Inset" height={0}>
      <figure className={s.anatomyItem}>
        <div className={s.magnify}>
          <Toolbar.Root aria-label="Tools, magnified">
            <Toolbar.Tools defaultValue={['select']} aria-label="Tools">
              {TOOLS.slice(0, 3).map(([value, label, icon]) => (
                <Toolbar.Tool key={value} value={value} label={label}>
                  {icon}
                </Toolbar.Tool>
              ))}
            </Toolbar.Tools>
          </Toolbar.Root>
        </div>
        <figcaption className={s.anatomyCaption}>4 on every side: a pill in a pill, so the centres coincide and the height falls out of it, 32 + 4 × 2 = 40.</figcaption>
      </figure>
    </Frame>
  );
}

export function ToolbarPressed() {
  return (
    <Compare
      beforeLabel="Current tool filled solid"
      afterLabel="Current tool tinted"
      before={<DrawToolbar toolClass={m.solidPressed} />}
      after={<DrawToolbar />}
      beforeNote="The current tool is filled with the accent, the same weight as Create. Two things now shout for attention."
      afterNote="A tint and an accent icon mark the mode; the one solid fill is left for Create. The tint is mixed a little toward the accent, so it is also a shade and still reads in greyscale and in dark mode."
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
      beforeLabel="Native title tooltip"
      afterLabel="Tip with its shortcut"
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
