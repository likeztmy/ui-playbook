import { Search } from 'lucide-react';
import { cx } from '../ui/cx';
import { FieldKey, FieldSuffix, TextField, fieldClasses as f } from '../ui/Field';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const searchIcon = <Search size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />;

const validateEmail = (value: unknown) => {
  const v = String(value ?? '').trim();
  if (!v) return 'Enter an email address.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter an email address, like ana@studio.com.';
};

function EmailField({ mode = 'onBlur' }: { mode?: 'onBlur' | 'onChange' }) {
  return (
    <TextField
      label="Email"
      type="email"
      placeholder="ana@studio.com"
      description="We send the invite here."
      validate={validateEmail}
      validationMode={mode}
    />
  );
}

export function InputLive() {
  return (
    <Frame label="Live · checked when you leave the field" height={180}>
      <div className={s.formColumn}>
        <EmailField />
      </div>
    </Frame>
  );
}

export function InputVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Text',
          use: 'A single line: a name, a title, an address.',
          render: () => <TextField label="Project name" defaultValue="Q4 roadmap" className={s.formColumn} />,
        },
        {
          name: 'Search',
          use: 'A magnifier says what it does; the key says how to reach it.',
          render: () => (
            <TextField
              label="Search"
              placeholder="Search files"
              leading={searchIcon}
              trailing={<FieldKey keys={['⌘', 'K']} />}
              className={s.formColumn}
            />
          ),
        },
        {
          name: 'With unit',
          use: 'A number in a known unit. Sized to the number.',
          render: () => (
            <TextField label="Width" defaultValue="1280" trailing={<FieldSuffix>px</FieldSuffix>} className={s.narrowField} />
          ),
        },
        {
          name: 'Multiline',
          use: 'A sentence or more. Grows by dragging its corner.',
          render: () => (
            <TextField label="Description" placeholder="What is this project for?" multiline className={s.formColumn} />
          ),
        },
      ]}
    />
  );
}

const STATES: [string, { pin?: string; disabled?: boolean; readOnly?: boolean; error?: string }][] = [
  ['Default', {}],
  ['Hover', { pin: 'hover' }],
  ['Focus', { pin: 'focus' }],
  ['Invalid', { error: 'Enter an email address, like ana@studio.com.' }],
  ['Disabled', { disabled: true }],
  ['Read-only', { readOnly: true }],
];

export function InputStates() {
  return (
    <Frame label="All states" height={0}>
      <div className={s.fieldGrid}>
        {STATES.map(([name, props]) => (
          <TextField key={name} label={name} defaultValue={name === 'Invalid' ? 'ana@studio' : 'ana@studio.com'} {...props} />
        ))}
      </div>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

/** The mistake: no label, the placeholder standing in for one. */
function PlaceholderOnly({ value }: { value?: string }) {
  return (
    <div className={s.formColumn}>
      <div className={f.box}>
        <input className={f.control} placeholder="Email address" aria-label="Email address" defaultValue={value} />
      </div>
      <div className={f.box}>
        <input className={f.control} placeholder="Password" aria-label="Password" type="password" defaultValue="hunter22" />
      </div>
    </div>
  );
}

export function InputLabel() {
  return (
    <Compare
      height={160}
      before={<PlaceholderOnly value="ana@studio" />}
      after={
        <div className={s.formColumn}>
          <TextField label="Email" placeholder="ana@studio.com" defaultValue="ana@studio" />
          <TextField label="Password" type="password" defaultValue="hunter22" />
        </div>
      }
      beforeNote="The placeholder is the label, so it disappears the moment there's an answer. Which field was the second one? Grey placeholder text also reads as filled in."
      afterNote="A label above stays put. The placeholder is only an example of the format, and Apple's guidance is the same: a separate label, because the placeholder goes away."
    />
  );
}

export function InputValidation() {
  return (
    <Compare
      height={160}
      before={
        <div className={s.formColumn}>
          <EmailField mode="onChange" />
        </div>
      }
      after={
        <div className={s.formColumn}>
          <EmailField />
        </div>
      }
      beforeNote="Type one letter and you're told you're wrong. Every keystroke until the last one is an error, so the error means nothing."
      afterNote="Checked when focus leaves the field. Once it has said something, it rechecks as you type, so the message clears the moment the address is right."
    />
  );
}

export function InputFocus() {
  return (
    <Compare
      height={140}
      before={
        <div className={s.formColumn}>
          <TextField label="Email" defaultValue="ana@studio.com" pin="focus" className={m.gappedFieldFocus} />
        </div>
      }
      after={
        <div className={s.formColumn}>
          <TextField label="Email" defaultValue="ana@studio.com" pin="focus" />
        </div>
      }
      beforeNote="The button's gapped 2px ring. Around a field it doubles the edge, crowds the label, and floats 2px off a box that's already outlined."
      afterNote="The edge turns accent and a 3px accent-soft halo hugs it, with no gap. The field's outline is its focus: nothing floats off it, nothing shifts."
    />
  );
}

export function InputKey() {
  const field = (keyClass?: string) => (
    <div className={cx(s.magnify, s.magnifiedField)}>
      <TextField
        label="Search"
        placeholder="Search"
        leading={searchIcon}
        trailing={<FieldKey keys={['⌘', 'K']} className={keyClass} />}
      />
    </div>
  );
  return (
    <Compare
      height={180}
      before={field(m.sameKeyRadius)}
      after={field()}
      beforeNote="The key copies the field's 10px radius. Inside a 4px inset its corners swell toward the field's, so the gap is wider at the corners than along the sides."
      afterNote="24 tall in 32, so 4 from the outer edge on three sides; radius-lg 10 − 4 = radius-sm 6. The gap stays even all the way round. Shown at 2×."
    />
  );
}

export function InputWidth() {
  return (
    <Compare
      height={160}
      before={
        <div className={s.formColumn}>
          <TextField label="Postal code" defaultValue="10115" />
          <TextField label="Street" defaultValue="Torstraße 1" />
        </div>
      }
      after={
        <div className={s.formColumn}>
          <TextField label="Postal code" defaultValue="10115" className={s.narrowField} />
          <TextField label="Street" defaultValue="Torstraße 1" />
        </div>
      }
      beforeNote="Every field the full column width. A five-digit code sits at the start of a long empty box, and the form says nothing about how much to write."
      afterNote="The field's width is a hint about the answer: short for a code, long for a street. Apple's guidance: size a field to the text you expect."
    />
  );
}

export function InputPreview() {
  return (
    <div className={s.formColumn}>
      <TextField label="Email" defaultValue="ana@studio" error="Enter an email address, like ana@studio.com." description="We send the invite here." />
    </div>
  );
}
