import { Check, ChevronsUpDown } from 'lucide-react';
import { useState } from 'react';
import { cx } from '../ui/cx';
import { menuClasses as ms } from '../ui/Menu';
import { Select, selectClasses as ss, type Option, type OptionGroup } from '../ui/Select';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const ROLES: Option[] = [
  { value: 'owner', label: 'Owner' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' },
  { value: 'commenter', label: 'Commenter' },
  { value: 'viewer', label: 'Viewer' },
];

const REASONS: Option[] = [
  { value: 'price', label: 'Too expensive' },
  { value: 'features', label: 'Missing a feature' },
  { value: 'switch', label: 'Switching to another tool' },
  { value: 'project', label: 'Project ended' },
  { value: 'other', label: 'Something else' },
];

const FONTS: OptionGroup[] = [
  {
    label: 'Sans',
    options: [
      { value: 'geist', label: 'Geist' },
      { value: 'inter', label: 'Inter' },
    ],
  },
  {
    label: 'Serif',
    options: [
      { value: 'newsreader', label: 'Newsreader' },
      { value: 'source-serif', label: 'Source Serif' },
    ],
  },
  {
    label: 'Mono',
    options: [
      { value: 'geist-mono', label: 'Geist Mono' },
      { value: 'jetbrains', label: 'JetBrains Mono' },
    ],
  },
];

function RoleSelect() {
  const [role, setRole] = useState<string | null>('editor');
  return (
    <div className={s.stack}>
      <Select label="Role" options={ROLES} value={role} onValueChange={setRole} description="Editors can change anything but billing." />
    </div>
  );
}

export function SelectLive() {
  return (
    <Frame label="Live · opens over its trigger" height={200}>
      <RoleSelect />
    </Frame>
  );
}

export function SelectVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'With a default',
          use: 'Most selects. The likeliest answer is already chosen.',
          render: () => <Select label="Role" options={ROLES} defaultValue="editor" />,
        },
        {
          name: 'With a placeholder',
          use: 'Only when no answer is fair to assume, and one is required.',
          render: () => <Select label="Reason" options={REASONS} placeholder="Choose a reason" />,
        },
        {
          name: 'Grouped',
          use: 'Options that fall into kinds. Labels name the kinds; separators divide them.',
          render: () => <Select label="Font" options={FONTS} defaultValue="geist" />,
        },
        {
          name: 'Disabled',
          use: 'Visible but not now: the plan or a permission doesn’t allow it.',
          render: () => <Select label="Role" options={ROLES} defaultValue="viewer" disabled description="Only admins can change roles." />,
        },
      ]}
    />
  );
}

// ── Comparisons ──────────────────────────────────────────

/** A select drawn open: its trigger, then the list. One row current, one highlighted. */
function Still({ itemClass, hot = 'commenter' }: { itemClass?: string; hot?: string }) {
  return (
    <div className={s.selectStill}>
      <div className={ss.trigger} data-pin="focus">
        <span className={ss.value}>Editor</span>
        <span className={ss.chevron}>
          <ChevronsUpDown size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
        </span>
      </div>
      <div className={ms.popup} style={{ minWidth: 0 }}>
        {ROLES.map((r) => (
          <div
            key={r.value}
            className={cx(ms.item, ss.item, itemClass)}
            data-selected={r.value === 'editor' ? '' : undefined}
            data-highlighted={r.value === hot ? '' : undefined}
          >
            <span className={ms.check} data-off={r.value === 'editor' ? undefined : ''}>
              <Check size={16} strokeWidth={1.75} nonScalingStroke aria-hidden />
            </span>
            <span className={ms.text}>{r.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SelectCurrent() {
  return (
    <Compare
      height={260}
      before={<Still itemClass={m.filledSelected} />}
      after={<Still />}
      beforeNote="The current option is filled, and so is the row under the keyboard. Two grey rows: which one is chosen, and which one will Enter choose?"
      afterNote="Current: a leading check in accent and weight 500, no fill. The fill means one thing only, where the keyboard is. Both read at a glance."
    />
  );
}

export function SelectAlign() {
  return (
    <Compare
      height={220}
      before={<Select label="Role" options={ROLES} defaultValue="commenter" alignItemWithTrigger={false} />}
      after={<Select label="Role" options={ROLES} defaultValue="commenter" />}
      beforeNote="Drops below like a menu. The current option is somewhere down the list, and the pointer has to travel to it before it can move to a neighbour."
      afterNote="Opens over the trigger with the current option on the trigger's text, as on macOS. The neighbours are a row away. On touch it drops below instead."
    />
  );
}

export function SelectDefault() {
  return (
    <Compare
      height={160}
      before={<Select label="Role" options={ROLES} placeholder="Select…" />}
      after={<Select label="Role" options={ROLES} defaultValue="editor" />}
      beforeNote="Select… makes everyone stop and choose, even though nearly every invite is for an editor. And the form can now fail for a field nobody cared about."
      afterNote="Editor is chosen already. Most people move on; the rest change it. Apple's guidance: give a pop-up a useful default."
    />
  );
}

export function SelectChevron() {
  return (
    <Compare
      height={160}
      before={<Select label="Role" options={ROLES} defaultValue="editor" chevron="down" />}
      after={<Select label="Role" options={ROLES} defaultValue="editor" />}
      beforeNote="A single down chevron, the same as a menu button. It reads as “more actions here”, not “one of several values”."
      afterNote="Up-and-down chevrons, as macOS draws a pop-up button: the value can move either way through a list. A menu button keeps the single chevron."
    />
  );
}

export function SelectPreview() {
  return <Still />;
}
