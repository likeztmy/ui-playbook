import { Form } from '../ui/Form';
import { Search } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
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

const required = (message: string) => (value: unknown) => (String(value ?? '').trim() ? null : message);

const validatePostal = (value: unknown) =>
  /^\d{5}$/.test(String(value ?? '').trim()) ? null : 'Enter a 5-digit postal code, like 10115.';

// type="text": a native email check would answer first, in the browser's
// words and language.
const emailProps = { type: 'text', inputMode: 'email', autoComplete: 'email' } as const;

// ── The scene ────────────────────────────────────────────

type Address = { name: string; email: string; street: string; postal: string; city: string };

const START: Address = { name: 'Zoë Laurent', email: 'zoe@laurent', street: 'Torstraße 1', postal: '10115', city: 'Berlin' };

/** A shipping address, sent with Continue; then a summary you can edit. */
function ShippingAddress() {
  const [address, setAddress] = useState(START);
  const [sent, setSent] = useState(false);
  const edit = useRef<HTMLButtonElement>(null);
  const first = useRef<HTMLInputElement>(null);
  const set = (key: keyof Address) => (value: string) => setAddress((a) => ({ ...a, [key]: value }));

  if (sent)
    return (
      <div className={s.addressCard}>
        <div className={s.addressText}>
          <span className={s.addressHeading}>Shipping to</span>
          <span>{address.name}</span>
          <span>{address.street}</span>
          <span>
            {address.postal} {address.city}
          </span>
          <span className={s.addressMuted}>Updates go to {address.email}</span>
        </div>
        <Button
          ref={edit}
          size="sm"
          onClick={() => {
            setSent(false);
            requestAnimationFrame(() => first.current?.focus());
          }}
        >
          Edit
        </Button>
      </div>
    );

  return (
    <Form
      className={s.addressForm}
      onFormSubmit={() => {
        setSent(true);
        requestAnimationFrame(() => edit.current?.focus());
      }}
    >
      <TextField name="name" label="Full name" autoComplete="name" value={address.name} onValueChange={set('name')} validate={required('Enter your full name.')} inputRef={first} />
      <TextField name="email" label="Email" {...emailProps} value={address.email} onValueChange={set('email')} validate={validateEmail} description="For delivery updates only." />
      <TextField name="street" label="Street" autoComplete="street-address" value={address.street} onValueChange={set('street')} validate={required('Enter a street and house number.')} />
      <div className={s.addressRow}>
        <TextField name="postal" label="Postal code" autoComplete="postal-code" inputMode="numeric" value={address.postal} onValueChange={set('postal')} validate={validatePostal} className={s.narrowField} />
        <TextField name="city" label="City" autoComplete="address-level2" value={address.city} onValueChange={set('city')} validate={required('Enter a city.')} className={s.addressCity} />
      </div>
      <div>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </Form>
  );
}

export function InputScene() {
  return (
    <Frame label="Shipping address" height={0}>
      <ShippingAddress />
    </Frame>
  );
}

// ── Reference ────────────────────────────────────────────

export function InputVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Text',
          use: 'A single line: a name, a title, an address.',
          render: () => <TextField label="Project name" defaultValue="Q4 roadmap" className={s.fieldWide} />,
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
              className={s.fieldWide}
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
            <TextField label="Description" placeholder="What is this project for?" multiline className={s.fieldWide} />
          ),
        },
      ]}
    />
  );
}

/** The focus edge and an embedded key, held still and magnified. */
export function InputAnatomy() {
  return (
    <Frame label="Focus and an embedded key, at 2×" height={0}>
      <div className={s.anatomyPair}>
        <figure className={s.anatomyItem}>
          <div className={cx(s.magnify, s.magnifiedField)}>
            <TextField label="Email" defaultValue="ana@studio.com" pin="focus" />
          </div>
          <figcaption className={s.anatomyCaption}>Focus recolours the edge it already has: accent, 1px, nothing around it.</figcaption>
        </figure>
        <figure className={s.anatomyItem}>
          <div className={cx(s.magnify, s.magnifiedField)}>
            <TextField label="Search" placeholder="Search" leading={searchIcon} trailing={<FieldKey keys={['⌘', 'K']} />} />
          </div>
          <figcaption className={s.anatomyCaption}>24 tall in 32, 4 from three edges: radius 10 − 4 = 6.</figcaption>
        </figure>
      </div>
    </Frame>
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

// ── Details ──────────────────────────────────────────────

function EmailField({ mode = 'onBlur' }: { mode?: 'onBlur' | 'onChange' }) {
  return (
    <TextField
      label="Email"
      {...emailProps}
      defaultValue="zoe@laur"
      description="For delivery updates only."
      validate={validateEmail}
      validationMode={mode}
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
      beforeNote="Every keystroke before the last one is an error, so the message stops meaning anything."
      afterNote={
        <>
          Checked when focus leaves, then rechecked as you type, so it clears the moment the address is right. In{' '}
          <a href="https://alistapart.com/article/inline-validation-in-web-forms/">Wroblewski’s tests</a> this cut completion time by 42%. When
          to check sooner: <a href="/principles/error-timing">Error timing</a>.
        </>
      }
    />
  );
}

/** The mistake: the field says nothing; one faint line at the top of the form does. */
function ErrorAtTop() {
  const [error, setError] = useState<string | null>(null);
  return (
    <Form
      className={s.formColumn}
      onSubmit={(e) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get('email');
        setError(validateEmail(email) ? 'Please check the highlighted information.' : null);
      }}
    >
      <p className={m.faintFormError} role="status">
        {error}
      </p>
      <TextField name="email" label="Email" {...emailProps} defaultValue="zoe@laurent" validate={() => null} />
      <TextField name="postal" label="Postal code" defaultValue="10115" className={s.narrowField} validate={() => null} />
      <div>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </Form>
  );
}

function ErrorAtField() {
  return (
    <Form className={s.formColumn} onSubmit={(e) => e.preventDefault()}>
      <TextField name="email" label="Email" {...emailProps} defaultValue="zoe@laurent" validate={validateEmail} />
      <TextField name="postal" label="Postal code" defaultValue="10115" className={s.narrowField} validate={validatePostal} />
      <div>
        <Button type="submit" variant="primary">
          Continue
        </Button>
      </div>
    </Form>
  );
}

export function InputErrorPlace() {
  return (
    <Compare
      height={240}
      before={<ErrorAtTop />}
      after={<ErrorAtField />}
      beforeNote={
        <>
          The eye is on the button it just pressed; a faint line changing at the top happens outside it.{' '}
          <a href="https://www.nngroup.com/articles/error-message-guidelines/">NN/g</a> found Instagram’s settings doing this.
        </>
      }
      afterNote="Each message sits under its field, and focus moves to the first one with the caret at the end, so the next keystroke is already the fix."
    />
  );
}

/** The mistake: no label, the placeholder standing in for one. */
function PlaceholderOnly() {
  return (
    <div className={s.formColumn}>
      <div className={f.box}>
        <input className={f.control} placeholder="Email" aria-label="Email" {...emailProps} />
      </div>
      <div className={f.box}>
        <input className={f.control} placeholder="Phone, for the courier" aria-label="Phone, for the courier" inputMode="tel" />
      </div>
    </div>
  );
}

export function InputLabel() {
  return (
    <Compare
      height={160}
      before={<PlaceholderOnly />}
      after={
        <div className={s.formColumn}>
          <TextField label="Email" placeholder="ana@studio.com" {...emailProps} />
          <TextField label="Phone, for the courier" placeholder="+49 30 1234567" inputMode="tel" />
        </div>
      }
      beforeNote={
        <>
          Once there’s an answer the placeholder is gone, and checking the form means remembering which box was which (
          <a href="https://www.nngroup.com/articles/form-design-placeholders/">NN/g</a>).
        </>
      }
      afterNote="The label stays; the placeholder is only an example of the format."
    />
  );
}

/** Card fields all as wide as the column. */
function CardFields({ sized }: { sized?: boolean }) {
  return (
    <div className={s.formColumn}>
      <TextField label="Card number" placeholder="1234 5678 9012 3456" inputMode="numeric" className={sized ? s.cardNumber : undefined} />
      <div className={sized ? s.addressRow : s.formColumn}>
        <TextField label="Expiry" placeholder="MM / YY" inputMode="numeric" className={sized ? s.narrowField : undefined} />
        <TextField label="CVC" placeholder="123" inputMode="numeric" className={sized ? s.tinyField : undefined} />
      </div>
    </div>
  );
}

export function InputWidth() {
  return (
    <Compare
      height={240}
      before={<CardFields />}
      after={<CardFields sized />}
      beforeNote={
        <>
          When a field’s length doesn’t match the answer, people doubt they read the label right, most of all on unfamiliar ones like a
          CVC (<a href="https://baymard.com/blog/form-field-usability-matching-user-expectations">Baymard</a>).
        </>
      }
      afterNote="The width is the first hint of the answer: sixteen digits, four, three."
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
