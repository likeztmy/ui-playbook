import { ArrowDownUp, Info, ListFilter, Rows3 } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';
import { Popover, popoverClasses as pc } from '../ui/Popover';
import { Radio, RadioGroup } from '../ui/Radio';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const PEOPLE = ['Ana Ruiz', 'Kenji Mori'];

type ShareProps = {
  /** Keep what was typed when a stray click closes it. */
  keepDraft?: boolean;
  /** The mistakes: focus left where it was, on open and on close. */
  noFocus?: boolean;
  popupClass?: string;
};

/** Share a file: a field and one button, and the list it adds to. */
function Share({ keepDraft = true, noFocus, popupClass }: ShareProps) {
  const [open, setOpen] = useState(false);
  const [people, setPeople] = useState(PEOPLE);
  const [kept, setKept] = useState('');
  const [lost, setLost] = useState('');
  const email = keepDraft ? kept : lost;
  const field = useRef<HTMLInputElement>(null);
  const setEmail = keepDraft ? setKept : setLost;
  return (
    <div className={s.shareRow}>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          // Without a kept draft, closing throws the typing away.
          if (!next && !keepDraft) setLost('');
        }}
        trigger={<Button>Share</Button>}
        title="Share “Q4 roadmap”"
        description="People you invite can edit."
        initialFocus={noFocus ? false : undefined}
        finalFocus={noFocus ? false : undefined}
        className={popupClass}
        actions={
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              // Never disabled: an empty address sends the caret back to it.
              if (!email.trim()) return field.current?.focus();
              setPeople((p) => [...p, email.trim()]);
              setEmail('');
              setOpen(false);
            }}
          >
            Invite
          </Button>
        }
      >
        <TextField label="Email" placeholder="name@acme.com" value={email} onValueChange={setEmail} type="text" inputMode="email" autoComplete="off" inputRef={field} />
      </Popover>
      <span className={s.shareList}>Shared with {people.join(', ')}</span>
    </div>
  );
}

export function PopoverLive() {
  return (
    <Frame label="Share" height={300}>
      <div className={s.top}>
        <Share />
      </div>
    </Frame>
  );
}

/** A word with a quiet info button that explains it. */
function StorageInfo() {
  return (
    <span className={s.infoRow}>
      Storage: 4.2 of 10 GB
      <Popover
        trigger={
          <Button variant="ghost" size="sm" icon aria-label="About storage">
            <Info size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
          </Button>
        }
        title="About storage"
        description="Files in Trash count until they’re deleted for good, 30 days after you remove them."
      />
    </span>
  );
}

const TONES = ['neutral', 'info', 'success', 'warning', 'danger'] as const;
type Tone = (typeof TONES)[number];

/** A colour picker: the trigger shows the current colour, a pick closes it. */
function LabelColour() {
  const [tone, setTone] = useState<Tone>('info');
  const [open, setOpen] = useState(false);
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button leading={<span className={s.swatch} data-tone={tone} aria-hidden />}>
          Label colour
        </Button>
      }
      title="Label colour"
      hideTitle
    >
      <div className={s.swatches} role="group" aria-label="Colours">
        {TONES.map((t) => (
          <button
            key={t}
            type="button"
            className={s.swatchButton}
            aria-label={t[0].toUpperCase() + t.slice(1)}
            aria-pressed={t === tone}
            onClick={() => {
              setTone(t);
              setOpen(false);
            }}
          >
            <span className={s.swatch} data-tone={t} />
          </button>
        ))}
      </div>
    </Popover>
  );
}

export function PopoverVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Form',
          use: 'A short job beside its source: one field, one button.',
          render: () => <Share />,
        },
        {
          name: 'Explanation',
          use: 'More than a tooltip can hold, for whoever asks. Opened by a click, so it can be read and selected.',
          render: () => <StorageInfo />,
        },
        {
          name: 'Picker',
          use: 'A small grid of choices. Picking one closes it; the trigger shows the result.',
          render: () => <LabelColour />,
        },
      ]}
    />
  );
}

// ── Comparisons ──────────────────────────────────────────

export function PopoverOrigin() {
  return (
    <Compare
      motion
      height={300}
      before={
        <div className={s.top}>
          <Share popupClass={m.centerScale} />
        </div>
      }
      after={
        <div className={s.top}>
          <Share />
        </div>
      }
      beforeNote="Grown from its own centre, the panel seems to come from nowhere. At 0.96 to 1 the two starts differ by a few pixels, which is why it takes slow motion to see: the dashed box is the first frame, the dot the point it grows from."
      afterNote="Grown from the trigger’s corner, it is plainly that button’s panel."
    />
  );
}

export function PopoverFocus() {
  return (
    <Compare
      height={300}
      before={
        <div className={s.top}>
          <Share noFocus />
        </div>
      }
      after={
        <div className={s.top}>
          <Share />
        </div>
      }
      beforeNote="Focus stays behind: keystrokes go to the page, and after closing, Tab starts again from the top."
      afterNote="Focus goes to the field and comes back to Share, so keyboard work carries on where it was."
    />
  );
}

const VIEW = [
  { label: 'Filter', icon: ListFilter, options: ['All files', 'Shared with me', 'Starred'] },
  { label: 'Sort', icon: ArrowDownUp, options: ['Name', 'Last modified', 'Size'] },
  { label: 'Group', icon: Rows3, options: ['None', 'Type', 'Owner'] },
];

/** A view bar of icon buttons, each opening its own popover. */
function ViewBar({ buttonClass }: { buttonClass?: string }) {
  return (
    <div className={s.leftRow}>
      {VIEW.map(({ label, icon: Icon, options }) => (
        <Popover
            key={label}
            tip={label}
            trigger={
              <Button variant="ghost" icon aria-label={label} className={buttonClass}>
                <Icon size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
              </Button>
            }
            title={label}
          >
            <RadioGroup label={label} defaultValue={options[0]} className={s.bareGroup}>
              {options.map((o) => (
                <Radio key={o} value={o} label={o} />
              ))}
            </RadioGroup>
          </Popover>
      ))}
    </div>
  );
}

export function PopoverTrigger() {
  return (
    <Compare
      height={240}
      before={
        <div className={s.top}>
          <ViewBar buttonClass={m.noOpenState} />
        </div>
      }
      after={
        <div className={s.top}>
          <ViewBar />
        </div>
      }
      beforeNote="Three identical icons, and nothing says which one this panel belongs to."
      afterNote="The trigger stays filled while its popover is open, as a macOS toolbar button stays pressed."
    />
  );
}

export function PopoverDraft() {
  return (
    <Compare
      height={300}
      before={
        <div className={s.top}>
          <Share keepDraft={false} />
        </div>
      }
      after={
        <div className={s.top}>
          <Share />
        </div>
      }
      beforeNote="A light dismiss shouldn’t cost the work."
      afterNote="Closing keeps the draft; Invite clears it, because then the job is done."
    />
  );
}

/** A still of the Share popover, open under its trigger. */
export function PopoverPreview() {
  return (
    <div className={s.popoverStill}>
      <Button data-popup-open="">Share</Button>
      <div className={pc.popup}>
        <div className={pc.header}>
          <span className={pc.title}>Share “Q4 roadmap”</span>
          <span className={pc.description}>People you invite can edit.</span>
        </div>
        <div className={pc.footer}>
          <Button variant="primary" size="sm">
            Invite
          </Button>
        </div>
      </div>
    </div>
  );
}
