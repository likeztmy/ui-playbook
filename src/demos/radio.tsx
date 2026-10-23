import { useState } from 'react';
import { Checkbox } from '../ui/Checkbox';
import { cx } from '../ui/cx';
import { TextField } from '../ui/Field';
import { Radio, RadioGroup, radioClasses as rs } from '../ui/Radio';
import { Compare, Frame, Gallery, StateGrid, statePin, type State } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const BASE = { w: 1200, h: 800 };
const SCALES = [
  { value: '1', label: '1×' },
  { value: '2', label: '2×', description: 'For Retina screens.' },
  { value: '3', label: '3×' },
];

/** Export size: three scales and a custom width, with the result in pixels. */
function ExportSize() {
  const [scale, setScale] = useState('2');
  const [width, setWidth] = useState('1600');
  const w = scale === 'custom' ? Number(width) || 0 : BASE.w * Number(scale);
  const h = Math.round((w * BASE.h) / BASE.w);
  return (
    <div className={s.radioDemo}>
      <RadioGroup label="Export at" value={scale} onValueChange={(v) => setScale(v as string)}>
        {SCALES.map((o) => (
          <Radio key={o.value} value={o.value} label={o.label} description={o.description} />
        ))}
        <Radio value="custom" label="Custom width">
          {scale === 'custom' && (
            <TextField label="Width" value={width} onValueChange={setWidth} inputMode="numeric" trailing="px" className={s.radioField} />
          )}
        </Radio>
      </RadioGroup>
      <span className={s.readout} aria-live="polite">
        {w.toLocaleString('en')} × {h.toLocaleString('en')} px
      </span>
    </div>
  );
}

export function RadioLive() {
  return (
    <Frame label="Export" height={240}>
      <ExportSize />
    </Frame>
  );
}

export function RadioVariants() {
  return (
    <Gallery
      rows={[
        {
          name: 'Group',
          use: 'Two to five options in one column, the safe one chosen.',
          render: () => (
            <RadioGroup label="Line endings" defaultValue="lf">
              <Radio value="lf" label="LF (macOS, Linux)" />
              <Radio value="crlf" label="CRLF (Windows)" />
            </RadioGroup>
          ),
        },
        {
          name: 'With descriptions',
          use: 'When the labels alone don’t say what each choice does.',
          render: () => (
            <RadioGroup label="Who can comment" defaultValue="team">
              <Radio value="team" label="Your team" description="People in Acme can reply." />
              <Radio value="link" label="Anyone with the link" description="Including guests, once they sign in." />
            </RadioGroup>
          ),
        },
        {
          name: 'Inline',
          use: 'Two or three one-word labels, where a column would waste the row.',
          render: () => (
            <RadioGroup label="Orientation" defaultValue="portrait" inline>
              <Radio value="portrait" label="Portrait" />
              <Radio value="landscape" label="Landscape" />
            </RadioGroup>
          ),
        },
        {
          name: 'With a follow-up',
          use: 'A choice that needs one more value shows its field under it, only while chosen.',
          render: () => <ExportSize />,
        },
      ]}
    />
  );
}

export function RadioStates() {
  const row = (name: string, checked: boolean) => ({
    name,
    render: (state: State) => (
      // A group of one per cell, so every cell can be checked at once.
      <RadioGroup label={name} value={checked ? 'on' : null} className={s.bareGroup}>
        <Radio value={checked ? 'on' : 'off'} label="Option" pin={statePin[state]} disabled={state === 'Disabled'} />
      </RadioGroup>
    ),
  });
  return <StateGrid rows={[row('Off', false), row('On', true)]} />;
}

// ── Comparisons ──────────────────────────────────────────

const SHIPPING = [
  { value: 'standard', label: 'Standard', description: '3–5 days, free' },
  { value: 'express', label: 'Express', description: '1–2 days, $9' },
  { value: 'overnight', label: 'Overnight', description: 'Tomorrow, $24' },
];

export function RadioDefault() {
  return (
    <Compare
      height={200}
      before={
        <RadioGroup label="Shipping">
          {SHIPPING.map((o) => (
            <Radio key={o.value} {...o} />
          ))}
        </RadioGroup>
      }
      after={
        <RadioGroup label="Shipping" defaultValue="standard">
          {SHIPPING.map((o) => (
            <Radio key={o.value} {...o} />
          ))}
        </RadioGroup>
      }
      beforeNote="Once one is picked there’s no way back to none, so the empty start is a state nobody can return to, and the form can go out without an answer."
      afterNote="The safe, common choice is already on; if “none” is a real answer, it gets its own radio."
    />
  );
}

/** The mistake: circles drawn as separate buttons, each its own Tab stop. */
function ButtonRadios() {
  const [value, setValue] = useState('standard');
  return (
    <div className={rs.group}>
      <span className={rs.groupLabel}>Shipping</span>
      <div className={rs.options}>
        {SHIPPING.map((o) => (
          <label key={o.value} className={rs.row}>
            <button
              type="button"
              className={rs.circle}
              aria-pressed={value === o.value}
              data-checked={value === o.value ? '' : undefined}
              onClick={() => setValue(o.value)}
            >
              <span className={rs.dot} />
            </button>
            {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

export function RadioKeys() {
  return (
    <Compare
      height={160}
      before={<ButtonRadios />}
      after={
        <RadioGroup label="Shipping" defaultValue="standard">
          {SHIPPING.map((o) => (
            <Radio key={o.value} value={o.value} label={o.label} />
          ))}
        </RadioGroup>
      }
      beforeNote="Each circle is a button: Tab stops on every one, and a screen reader hears three toggles rather than one choice of three."
      afterNote={
        <>
          One Tab stop, on the chosen radio, and arrows that move and choose: the <a href="https://www.w3.org/WAI/ARIA/apg/patterns/radio/">radio group</a> every platform shares.
        </>
      }
    />
  );
}

const FIT = ['Fit to width', 'Fill the frame', 'Actual size', 'Tile'];

export function RadioColumn() {
  return (
    <Compare
      height={160}
      before={
        <RadioGroup label="Image" defaultValue={FIT[0]} inline className={cx(s.narrowRow, m.tightRadios)}>
          {FIT.map((f) => (
            <Radio key={f} value={f} label={f} />
          ))}
        </RadioGroup>
      }
      after={
        <RadioGroup label="Image" defaultValue={FIT[0]}>
          {FIT.map((f) => (
            <Radio key={f} value={f} label={f} />
          ))}
        </RadioGroup>
      }
      beforeNote={
        <>
          Spaced 16px apart, as <a href="https://getbootstrap.com/docs/5.3/forms/checks-radios/#inline">Bootstrap’s inline radios</a> are, each label sits nearly as close to the next circle as to its own, and the row wraps wherever it likes.
        </>
      }
      afterNote="One column: circles line up and the eye reads straight down. A row suits two or three single words."
    />
  );
}

/** The mistake: square boxes that behave as one-of-many. */
function SquareChoice() {
  const [value, setValue] = useState('pdf');
  return (
    <div className={rs.group}>
      <span className={rs.groupLabel}>Format</span>
      <div className={rs.options}>
        {['pdf', 'png', 'svg'].map((f) => (
          <Checkbox key={f} label={f.toUpperCase()} checked={value === f} onCheckedChange={() => setValue(f)} />
        ))}
      </div>
    </div>
  );
}

export function RadioShape() {
  return (
    <Compare
      height={160}
      before={<SquareChoice />}
      after={
        <RadioGroup label="Format" defaultValue="pdf">
          {['pdf', 'png', 'svg'].map((f) => (
            <Radio key={f} value={f} label={f.toUpperCase()} />
          ))}
        </RadioGroup>
      }
      beforeNote="Square boxes promise any combination, and this set quietly unchecks the last one."
      afterNote="Round says “one of these” before anything is clicked."
    />
  );
}

export function RadioPreview() {
  return (
    <RadioGroup label="Export at" defaultValue="2">
      {SCALES.map((o) => (
        <Radio key={o.value} value={o.value} label={o.label} />
      ))}
    </RadioGroup>
  );
}
