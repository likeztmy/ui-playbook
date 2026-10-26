import { Check, Circle, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { TextField } from '../ui/Field';
import { Frame } from './shell';
import s from './demos.module.scss';

const validateEmail = (value: string) => {
  const v = value.trim();
  if (!v) return 'Enter an email address.';
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? null : 'Enter an email address, like ana@studio.com.';
};

type Timing = 'submit' | 'keystroke' | 'blur' | 'blur-fix';

const TIMINGS: { timing: Timing; name: string }[] = [
  { timing: 'submit', name: 'On submit' },
  { timing: 'keystroke', name: 'On every keystroke' },
  { timing: 'blur', name: 'On leaving' },
  { timing: 'blur-fix', name: 'On leaving, cleared on fix' },
];

/** One email field whose error follows the given timing. */
function TimedEmail({ timing }: { timing: Timing }) {
  const [value, setValue] = useState('zoe@laur');
  const [error, setError] = useState<string | null>(null);
  const field = (
    <TextField
      label="Email"
      type="text"
      inputMode="email"
      autoComplete="off"
      value={value}
      onValueChange={(v) => {
        setValue(v);
        if (timing === 'keystroke') setError(validateEmail(v));
        // Once it has spoken, it listens: a fix clears at once, and a
        // different mistake updates the message.
        if (timing === 'blur-fix' && error) setError(validateEmail(v));
      }}
      // Leaving an empty field is looking around, not a mistake: it says nothing until something's typed.
      onBlur={timing === 'blur' || timing === 'blur-fix' ? () => setError(value ? validateEmail(value) : null) : undefined}
      validate={() => null}
      error={error ?? undefined}
    />
  );
  if (timing !== 'submit') return field;
  return (
    <form
      className={s.timingSubmit}
      onSubmit={(e) => {
        e.preventDefault();
        setError(validateEmail(value));
      }}
    >
      {field}
      <div>
        <Button type="submit" size="sm">
          Continue
        </Button>
      </div>
    </form>
  );
}

export function TimingGrid() {
  return (
    <Frame label="Four timings, one field" height={0}>
      <div className={s.timingGrid}>
        {TIMINGS.map(({ timing, name }) => (
          <section key={timing} className={s.timingCell} aria-label={name}>
            <span className={s.timingName}>{name}</span>
            <TimedEmail timing={timing} />
          </section>
        ))}
      </div>
    </Frame>
  );
}

const RULES: { label: string; test: (v: string) => boolean }[] = [
  { label: 'At least 12 characters', test: (v) => v.length >= 12 },
  { label: 'A number', test: (v) => /\d/.test(v) },
  { label: 'A symbol', test: (v) => /[^\p{L}\p{N}\s]/u.test(v) },
];

/** Rules that turn green as they're met, and red only once you've typed and left. */
function NewPassword() {
  const [value, setValue] = useState('');
  const [left, setLeft] = useState(false);
  return (
    <div className={s.formColumn}>
      <TextField
        label="New password"
        type="password"
        autoComplete="new-password"
        value={value}
        onValueChange={setValue}
        onBlur={() => setLeft(value.length > 0)}
      />
      <div className={s.ruleList} role="list">
        {RULES.map((r) => {
          const met = r.test(value);
          const state = met ? 'met' : left ? 'unmet' : 'pending';
          const Icon = met ? Check : left ? X : Circle;
          return (
            <div key={r.label} className={s.rule} data-state={state} role="listitem">
              <Icon size={14} strokeWidth={1.75} nonScalingStroke aria-hidden />
              <span>{r.label}</span>
              <span className={s.srOnly}>{met ? ', met' : left ? ', not met' : ''}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function TimingPassword() {
  return (
    <Frame label="Sign-up" height={220}>
      <NewPassword />
    </Frame>
  );
}

export function ErrorTimingPreview() {
  return (
    <div className={s.formColumn}>
      <TextField label="Email" defaultValue="zoe@laurent" error="Enter an email address, like ana@studio.com." />
    </div>
  );
}
