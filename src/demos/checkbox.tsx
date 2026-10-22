import { useState } from 'react';
import { Checkbox, CheckboxGroup, checkboxClasses as cs } from '../ui/Checkbox';
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
    <Frame label="Notifications" height={220}>
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
        <div className={s.leftStack}>
          <BoxOnly label="Keep me signed in" defaultChecked />
          <BoxOnly label="Show hidden files" />
        </div>
      }
      after={
        <div className={s.leftStack}>
          <Checkbox label="Keep me signed in" defaultChecked />
          <Checkbox label="Show hidden files" />
        </div>
      }
      beforeNote={
        <>
          The eye lands on the words, but only a 16px box answers; the smaller the target, the longer it takes to hit (
          <a href="https://www.nngroup.com/articles/fitts-law/">Fitts’s law</a>).
        </>
      }
      afterNote="A <label> around box and words makes the whole row the target."
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
      beforeNote="It says on while half its children are off, so a click meant to turn everything on turns it all off."
      afterNote={
        <>
          A dash means some. Clicking it turns them all on, then all off, as{' '}
          <a href="https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/examples/checkbox-mixed/">WAI-ARIA</a> defines the mixed state.
        </>
      }
    />
  );
}

/** Alignment and edge, held still and magnified. */
export function CheckboxAnatomy() {
  return (
    <Frame label="At 2×" height={0}>
      <div className={s.anatomyPair}>
        <figure className={s.anatomyItem}>
          <div className={s.magnify}>
            <Checkbox label="Send me a weekly summary of what changed" defaultChecked className={s.anatomyCheck} />
          </div>
          <figcaption className={s.anatomyCaption}>On the first line, not the middle: (20 − 16) / 2 = 2 down.</figcaption>
        </figure>
        <figure className={s.anatomyItem}>
          <div className={s.magnify}>
            <Checkbox label="Mentions" />
          </div>
          <figcaption className={s.anatomyCaption}>
            Off is an empty box, so its edge holds at least 3:1 against the page (
            <a href="https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html">WCAG 1.4.11</a>).
          </figcaption>
        </figure>
      </div>
    </Frame>
  );
}

export function CheckboxPreview() {
  return <Notifications />;
}
