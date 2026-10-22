import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { Check } from 'lucide-react';
import { useState } from 'react';
import { Checkbox, CheckboxGroup, checkboxClasses as cs } from '../ui/Checkbox';
import { cx } from '../ui/cx';
import { Compare, Frame, Gallery, StateGrid, statePin, type State } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const ACTIVITY = [
  { value: 'comments', label: 'Comments' },
  { value: 'mentions', label: 'Mentions' },
  { value: 'assignments', label: 'Assigned to me' },
  { value: 'status', label: 'Status changes' },
];
const ALL = ACTIVITY.map((a) => a.value);

function Notifications({ initial = ['mentions', 'assignments'] }: { initial?: string[] }) {
  const [value, setValue] = useState(initial);
  return (
    <CheckboxGroup label="Email me about" parent="All activity" value={value} onValueChange={setValue} allValues={ALL}>
      {ACTIVITY.map((a) => (
        <Checkbox key={a.value} value={a.value} label={a.label} />
      ))}
    </CheckboxGroup>
  );
}

export function CheckboxLive() {
  return (
    <Frame label="Live · a parent box over its children" height={220}>
      <Notifications />
    </Frame>
  );
}

const FILES = ['Brief.pdf', 'Moodboard.fig', 'Notes.md'];

/** Checkboxes with no words beside them: the row names each one. */
function FileList() {
  const [picked, setPicked] = useState(['Moodboard.fig']);
  return (
    <div className={s.checkList}>
      {FILES.map((f) => (
        <div key={f} className={s.checkListRow}>
          <Checkbox
            aria-label={`Select ${f}`}
            checked={picked.includes(f)}
            onCheckedChange={(on) => setPicked((p) => (on ? [...p, f] : p.filter((x) => x !== f)))}
          />
          <span>{f}</span>
        </div>
      ))}
    </div>
  );
}

export function CheckboxVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Single',
          use: 'One option that’s sent with the form, like keeping someone signed in.',
          render: () => <Checkbox label="Keep me signed in" defaultChecked />,
        },
        {
          name: 'With description',
          use: 'A line under the label for the consequence, not a restatement.',
          render: () => (
            <Checkbox label="Allow comments" description="Anyone with the link can reply." />
          ),
        },
        {
          name: 'Group',
          use: 'Several independent options under one name.',
          render: () => (
            <CheckboxGroup label="Export" defaultValue={['pdf']}>
              <Checkbox value="pdf" label="PDF" />
              <Checkbox value="png" label="PNG" />
              <Checkbox value="svg" label="SVG" />
            </CheckboxGroup>
          ),
        },
        {
          name: 'Parent',
          use: 'Turns a group on or off; mixed while the children differ.',
          render: () => <Notifications />,
        },
        {
          name: 'Without a label',
          use: 'Selecting rows in a list or table: the row is the label.',
          render: () => <FileList />,
        },
      ]}
    />
  );
}

export function CheckboxStates() {
  const row = (name: string, props: { checked?: boolean; indeterminate?: boolean }) => ({
    name,
    render: (state: State) => (
      <Checkbox {...props} label="Option" pin={statePin[state]} disabled={state === 'Disabled'} />
    ),
  });
  return <StateGrid rows={[row('Off', { checked: false }), row('On', { checked: true }), row('Mixed', { checked: false, indeterminate: true })]} />;
}

// ── Comparisons ──────────────────────────────────────────

/** The mistake: the words beside the box aren't part of it. */
function BoxOnly({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <div className={m.boxOnlyRow}>
      <Checkbox aria-label={label} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </div>
  );
}

export function CheckboxTarget() {
  return (
    <Compare
      height={140}
      before={
        <div className={s.stack}>
          <BoxOnly label="Keep me signed in" defaultChecked />
          <BoxOnly label="Show hidden files" />
        </div>
      }
      after={
        <div className={s.stack}>
          <Checkbox label="Keep me signed in" defaultChecked />
          <Checkbox label="Show hidden files" />
        </div>
      }
      beforeNote="Only the 16px box responds. Click the words and nothing happens, so people aim for a target smaller than a fingertip."
      afterNote="A <label> wraps the box and the words: the whole row is the target, and hovering the words darkens the box to say so."
    />
  );
}

/** The mistake: a parent that reads "on" when only some children are. */
function NaiveParent() {
  const [value, setValue] = useState(['mentions', 'assignments']);
  const some = value.length > 0;
  return (
    <div className={cs.group}>
      <span className={cs.groupLabel}>Email me about</span>
      <Checkbox
        label="All activity"
        checked={some}
        onCheckedChange={(on) => setValue(on ? ALL : [])}
      />
      <div className={cs.children}>
        {ACTIVITY.map((a) => (
          <Checkbox
            key={a.value}
            label={a.label}
            checked={value.includes(a.value)}
            onCheckedChange={(on) => setValue((v) => (on ? [...v, a.value] : v.filter((x) => x !== a.value)))}
          />
        ))}
      </div>
    </div>
  );
}

export function CheckboxMixed() {
  return (
    <Compare
      height={220}
      before={<NaiveParent />}
      after={<Notifications />}
      beforeNote="Two of four are on, and the parent says on. Click it expecting to turn everything on, and it turns everything off."
      afterNote="A dash: some, not all. Clicking a mixed parent turns them all on; again, all off. Apple and WAI-ARIA both define this mixed state."
    />
  );
}

export function CheckboxAlign() {
  const label = 'Send me a weekly summary of what changed in projects I follow';
  return (
    <Compare
      height={140}
      before={<Checkbox label={label} defaultChecked className={cx(s.narrowRow, m.centeredBox)} />}
      after={<Checkbox label={label} defaultChecked className={s.narrowRow} />}
      beforeNote="Centred on a two-line label, the box floats between the lines and belongs to neither. In a list, the boxes stop forming a column."
      afterNote="The box sits on the first line: 2px down a 20px line. Wrapped labels hang under their own first word, and the boxes stay in one column."
    />
  );
}

/** A still, unlabelled box drawn with a chosen edge colour. */
function EdgeStill({ faint }: { faint?: boolean }) {
  return (
    <div className={s.stack}>
      {['Comments', 'Mentions'].map((l, i) => (
        <label key={l} className={cs.row}>
          <BaseCheckbox.Root className={cx(cs.box, faint && m.faintEdge)} defaultChecked={i === 1}>
            <BaseCheckbox.Indicator keepMounted className={cs.indicator}>
              <Check size={12} strokeWidth={2} nonScalingStroke aria-hidden />
            </BaseCheckbox.Indicator>
          </BaseCheckbox.Root>
          {l}
        </label>
      ))}
    </div>
  );
}

export function CheckboxEdge() {
  return (
    <Compare
      height={120}
      before={<EdgeStill faint />}
      after={<EdgeStill />}
      beforeNote="The off box in the divider colour, line. At about 1.3:1 against the page it nearly vanishes, and an empty box is the whole message."
      afterNote="line-strong, at least 3:1, as WCAG asks of a control’s boundary. Off is an empty box you can see; on is a filled one."
    />
  );
}

export function CheckboxPreview() {
  return <Notifications />;
}
