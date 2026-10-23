import { Check } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { TextField } from '../ui/Field';
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

const ROLE_HINT: Record<string, string> = {
  owner: 'Owners can do anything, including billing and deleting.',
  admin: 'Admins manage members and settings, not billing.',
  editor: 'Editors can change anything but members and billing.',
  commenter: 'Commenters can read and comment, not edit.',
  viewer: 'Viewers can read, nothing more.',
};

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

/** Invite someone with a role; the Select is one field among others. */
function Invite() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<string | null>('editor');
  const [sent, setSent] = useState<{ email: string; role: string }[]>([]);
  const field = useRef<HTMLInputElement>(null);
  const label = (v: string | null) => ROLES.find((r) => r.value === v)?.label ?? '';
  return (
    <form
      className={s.inviteForm}
      onSubmit={(e) => {
        e.preventDefault();
        // Never disabled: an empty address sends the caret back to it.
        if (!email.trim()) return field.current?.focus();
        setSent((l) => [...l, { email: email.trim(), role: label(role) }]);
        setEmail('');
      }}
    >
      <TextField label="Email" placeholder="ana@studio.com" type="text" inputMode="email" autoComplete="off" value={email} onValueChange={setEmail} inputRef={field} />
      <Select label="Role" options={ROLES} value={role} onValueChange={setRole} description={ROLE_HINT[role ?? 'editor']} className={s.inviteRole} />
      <div>
        <Button type="submit" variant="primary">
          Send invite
        </Button>
      </div>
      {sent.length > 0 && (
        <div className={s.inviteSent}>
          {sent.map((x, i) => (
            <span key={i}>
              Invited {x.email} as {x.role}
            </span>
          ))}
        </div>
      )}
    </form>
  );
}

export function SelectLive() {
  return (
    <Frame label="Invite people" height={260}>
      <Invite />
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

/** A select's open list, drawn in place: one row current, one highlighted. */
function Still({ itemClass, hot = 'commenter' }: { itemClass?: string; hot?: string }) {
  return (
    <div className={s.selectStill}>
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
      beforeNote="With the current option filled like the keyboard’s row, two fills compete and Enter’s target is a guess."
      afterNote="The fill means one thing, where the keyboard is; the check marks the value."
    />
  );
}

export function SelectAlign() {
  return (
    <Compare
      height={220}
      before={<Select label="Role" options={ROLES} defaultValue="commenter" alignItemWithTrigger={false} />}
      after={<Select label="Role" options={ROLES} defaultValue="commenter" />}
      beforeNote="Dropped below like a menu, the current option is somewhere down the list, a pointer’s journey away."
      afterNote="Over the trigger, as on macOS, the current option sits under the pointer and its neighbours a row away. On touch it drops below instead."
    />
  );
}

export function SelectDefault() {
  return (
    <Compare
      height={160}
      before={<Select label="Role" options={ROLES} placeholder="Select…" />}
      after={<Select label="Role" options={ROLES} defaultValue="editor" />}
      beforeNote="“Select…” stops everyone, and the form can now fail on a field nobody cared about."
      afterNote={
        <>
          Most people move on; the rest change it.{' '}
          <a href="https://developer.apple.com/design/human-interface-guidelines/pop-up-buttons">Apple</a> asks for a useful default in a pop-up
          button.
        </>
      }
    />
  );
}

export function SelectChevron() {
  return (
    <Compare
      height={160}
      before={<Select label="Role" options={ROLES} defaultValue="editor" chevron="down" />}
      after={<Select label="Role" options={ROLES} defaultValue="editor" />}
      beforeNote="A single down chevron is a menu button’s: more actions here."
      afterNote="Up and down, as macOS draws a pop-up button: one of several values."
    />
  );
}

export function SelectPreview() {
  return <Still />;
}
