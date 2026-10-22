import { useState, type CSSProperties } from 'react';
import { Slider, SliderPanel } from '../ui/Slider';
import { cx } from '../ui/cx';
import { Compare, Frame, Gallery } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

type Spec = { label: string; min: number; max: number; step: number; unit?: string; initial: number };

const OPACITY: Spec = { label: 'Opacity', min: 0, max: 100, step: 1, unit: '%', initial: 64 };
const RADIUS: Spec = { label: 'Radius', min: 0, max: 48, step: 1, initial: 12 };
const BOUNCE: Spec = { label: 'Bounce', min: 0, max: 1, step: 0.01, initial: 0.2 };
const COLUMNS: Spec = { label: 'Columns', min: 1, max: 6, step: 1, initial: 3 };

/** A slider that keeps its own value. */
function Own({ spec, className, pin, value: fixed }: { spec: Spec; className?: string; pin?: string; value?: number }) {
  const [value, setValue] = useState(fixed ?? spec.initial);
  return (
    <Slider
      label={spec.label}
      value={value}
      onValueChange={setValue}
      min={spec.min}
      max={spec.max}
      step={spec.step}
      unit={spec.unit}
      pin={pin}
      className={className}
    />
  );
}

export function SliderLive() {
  const [radius, setRadius] = useState(RADIUS.initial);
  const [opacity, setOpacity] = useState(OPACITY.initial);
  const [columns, setColumns] = useState(COLUMNS.initial);
  return (
    <Frame label="Live · drag, click, pull past an end, or use the arrow keys" height={260}>
      <div className={s.settingsDemo}>
        <SliderPanel className={s.sliderPanel}>
          <Slider label="Radius" value={radius} onValueChange={setRadius} max={48} />
          <Slider label="Opacity" value={opacity} onValueChange={setOpacity} unit="%" />
          <Slider label="Columns" value={columns} onValueChange={setColumns} min={1} max={6} />
        </SliderPanel>
        <div className={s.swatchGrid} style={{ '--cols': columns } as CSSProperties} aria-label="Preview" role="img">
          {Array.from({ length: columns * 2 }, (_, i) => (
            <span key={i} style={{ borderRadius: radius / 2, opacity: opacity / 100 }} />
          ))}
        </div>
      </div>
    </Frame>
  );
}

export function SliderVariants() {
  return (
    <Gallery
      rows={[
        { name: 'Continuous', use: 'A value with a unit, judged by eye: opacity, size.', render: () => <Own spec={OPACITY} className={s.sliderRow} /> },
        { name: 'Fine', use: 'A small range in hundredths. The value shows the precision.', render: () => <Own spec={BOUNCE} className={s.sliderRow} /> },
        { name: 'Discrete', use: 'Ten stops or fewer. Ticks appear on hover; a click lands on a stop.', render: () => <Own spec={COLUMNS} className={s.sliderRow} /> },
        {
          name: 'In a panel',
          use: 'Stacked in a property panel: radius-xl 18 inset 8, so each row takes radius-lg 10.',
          render: () => (
            <SliderPanel className={s.sliderPanel}>
              <Own spec={RADIUS} />
              <Own spec={OPACITY} />
            </SliderPanel>
          ),
        },
      ]}
    />
  );
}

const STATES: [string, string | undefined, number][] = [
  ['Default', undefined, 64],
  ['Hover', 'hover', 64],
  ['Dragging', 'drag', 64],
  ['Focus', 'focus', 64],
  ['Handle steps aside', 'drag', 96],
];

export function SliderStates() {
  return (
    <Frame label="All states" height={0}>
      <div className={s.sliderStates}>
        {STATES.map(([name, pin, value]) => (
          <div key={name} className={s.sliderState}>
            <span>{name}</span>
            <Own spec={OPACITY} pin={pin} value={value} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

// ── Comparisons ──────────────────────────────────────────

/** The mistake: a thin track and a round knob, label and value outside it. */
function ClassicSlider({ spec }: { spec: Spec }) {
  const [value, setValue] = useState(spec.initial);
  return (
    <label className={m.classicSlider}>
      <span>{spec.label}</span>
      <input type="range" min={spec.min} max={spec.max} step={spec.step} value={value} onChange={(e) => setValue(+e.target.value)} />
      <output>
        {value}
        {spec.unit}
      </output>
    </label>
  );
}

export function SliderRow() {
  return (
    <Compare
      height={150}
      before={
        <div className={s.sliderStack}>
          <ClassicSlider spec={RADIUS} />
          <ClassicSlider spec={OPACITY} />
        </div>
      }
      after={
        <SliderPanel className={s.sliderPanel}>
          <Own spec={RADIUS} />
          <Own spec={OPACITY} />
        </SliderPanel>
      }
      beforeNote="A 4px track and a 16px knob. The target is the knob, the label and value sit outside, and three columns compete for a narrow panel."
      afterNote="The whole 32px row is the control: grab it anywhere. The label and value live inside it, so a panel of them reads as one list."
    />
  );
}

export function SliderFollow() {
  return (
    <Compare
      height={120}
      before={<Own spec={OPACITY} className={cx(s.sliderRow, m.laggySlider)} />}
      after={<Own spec={OPACITY} className={s.sliderRow} />}
      beforeNote="Every change eases over 400ms, drags included. The fill trails behind the pointer, so the value you see isn't the one under your hand."
      afterNote="A drag follows the pointer exactly. Only a click or Home/End glides, on the smooth spring: then the motion says where it went."
    />
  );
}

export function SliderEdge() {
  return (
    <Compare
      height={120}
      before={<Own spec={OPACITY} className={cx(s.sliderRow, m.rigidSlider)} />}
      after={<Own spec={OPACITY} className={s.sliderRow} />}
      beforeNote="Drag past either end and it just stops. Did it reach the end, or did the drag stop registering?"
      afterNote="Past an end the row stretches, harder the further you pull (square root, at most 10px), and springs back on release: you've hit the end."
    />
  );
}

export function SliderDodge() {
  return (
    <Compare
      height={120}
      before={<Own spec={OPACITY} value={96} pin="drag" className={cx(s.sliderRow, m.noDodge)} />}
      after={<Own spec={OPACITY} value={96} pin="drag" className={s.sliderRow} />}
      beforeNote="Near the end the handle sits on the value and cuts through the digits you're trying to read."
      afterNote="Within 8px of the label or the value, the handle fades to 10%. The fill's edge still shows where you are."
    />
  );
}

export function SliderDigits() {
  return (
    <Compare
      height={120}
      before={<Own spec={BOUNCE} className={cx(s.sliderRow, m.proportionalValue)} />}
      after={<Own spec={BOUNCE} className={s.sliderRow} />}
      beforeNote="Proportional digits: 0.11 is narrower than 0.88, so the value jitters sideways as you drag."
      afterNote="Geist Mono with tabular-nums. Every digit is the same width; only the number changes."
    />
  );
}

export function SliderPreview() {
  return (
    <SliderPanel className={s.sliderPanel}>
      <Own spec={RADIUS} />
      <Own spec={OPACITY} />
      <Own spec={COLUMNS} />
    </SliderPanel>
  );
}
