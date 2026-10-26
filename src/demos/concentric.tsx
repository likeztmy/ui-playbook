import { useState } from 'react';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Slider } from '../ui/Slider';
import { Compare, Tweak } from './shell';
import s from './demos.module.scss';

type Mode = 'Concentric' | 'Same radius';

function Nest({ outer, inner, pad, border }: { outer: number; inner: number; pad: number; border: number }) {
  return (
    <div
      className={s.nestOuter}
      style={{ borderRadius: outer, padding: pad, borderWidth: border }}
    >
      <div className={s.nestInner} style={{ borderRadius: inner }} />
    </div>
  );
}

/** The inner shape's usual radius, kept once the arcs can no longer meet. */
const OWN_RADIUS = 8;

/**
 * inner = outer − inset − border while the inset is smaller than the outer
 * radius. At or past it the arcs no longer touch, so the inner shape keeps
 * its own radius (radius-md) instead of collapsing to a square.
 */
export function innerRadius(outer: number, pad: number, border: number) {
  const r = outer - pad - border;
  // Its own radius, but never rounder than the shape around it.
  return r > 0 ? r : Math.min(OWN_RADIUS, outer);
}

export function ConcentricTweak() {
  const [outer, setOuter] = useState(18);
  const [pad, setPad] = useState(8);
  const [border, setBorder] = useState(0);
  const [mode, setMode] = useState<Mode>('Concentric');
  const inner = mode === 'Concentric' ? innerRadius(outer, pad, border) : outer;

  return (
    <Tweak
      height={300}
      readout={
        mode === 'Concentric' ? (
          <code className={s.readout}>
            {outer - pad - border > 0
              ? `${outer} − ${pad} − ${border} = ${inner}px`
              : `inset + border ≥ radius: inner keeps its own ${inner}px`}
          </code>
        ) : (
          <code className={s.readout}>inner = outer = {outer}px</code>
        )
      }
      stage={<Nest outer={outer} inner={inner} pad={pad} border={border} />}
      controls={
        <>
          <SegmentedControl
            label="Inner radius"
            value={mode}
            onValueChange={setMode}
            segments={[
              { value: 'Concentric', label: 'Concentric' },
              { value: 'Same radius', label: 'Same radius' },
            ]}
            className={s.fill}
          />
          <Slider label="Outer radius" value={outer} onValueChange={setOuter} max={40} unit="px" />
          <Slider label="Inset" value={pad} onValueChange={setPad} max={32} unit="px" />
          <Slider label="Border" value={border} onValueChange={setBorder} max={6} unit="px" />
        </>
      }
    />
  );
}

export function ConcentricPreview() {
  return (
    <div className={s.row}>
      <Nest outer={20} inner={20} pad={10} border={0} />
      <Nest outer={20} inner={10} pad={10} border={0} />
    </div>
  );
}

export function SameRadius() {
  return (
    <Compare
      before={<Nest outer={20} inner={20} pad={10} border={0} />}
      after={<Nest outer={20} inner={10} pad={10} border={0} />}
      beforeNote="Both corners 20px. The gap is 10px along the edges but swells at every corner: the inner shape looks bloated."
      afterNote="20 − 10 = 10. The arcs share a centre, so the gap is the same width all the way round."
    />
  );
}

export function BorderCounts() {
  return (
    <Compare
      before={
        <div className={s.magnify}>
          <div className={s.field}>
            <span>Search</span>
            <kbd className={s.key} style={{ borderRadius: 10 }}>⌘K</kbd>
          </div>
        </div>
      }
      after={
        <div className={s.magnify}>
          <div className={s.field}>
            <span>Search</span>
            <kbd className={s.key} style={{ borderRadius: 6 }}>⌘K</kbd>
          </div>
        </div>
      }
      beforeNote="Shown at 2×. The key copies the field’s 10px corner. Inset is 3px plus a 1px border, so the key’s corner bulges into the gap."
      afterNote="10 − 3 inset − 1 border = 6. The border is part of the gap; leave it out and the result is off by a pixel per side."
    />
  );
}
