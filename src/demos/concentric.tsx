import { useState } from 'react';
import { Choice, Dial } from '../ui/Dial';
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

/** inner = outer − inset − border, floored at radius-xs (4). */
export function innerRadius(outer: number, pad: number, border: number) {
  const r = outer - pad - border;
  return r > 0 ? Math.max(r, Math.min(4, outer)) : Math.min(4, outer);
}

export function ConcentricTweak() {
  const [outer, setOuter] = useState(16);
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
            {outer} − {pad} − {border} = {inner}px
          </code>
        ) : (
          <code className={s.readout}>inner = outer = {outer}px</code>
        )
      }
      stage={<Nest outer={outer} inner={inner} pad={pad} border={border} />}
      controls={
        <>
          <Choice label="Inner radius" value={mode} options={['Concentric', 'Same radius'] as const} onChange={setMode} />
          <Dial label="Outer radius" value={outer} onChange={setOuter} max={40} unit="px" />
          <Dial label="Inset" value={pad} onChange={setPad} max={32} unit="px" />
          <Dial label="Border" value={border} onChange={setBorder} max={6} unit="px" />
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
            <kbd className={s.key} style={{ borderRadius: 8 }}>⌘K</kbd>
          </div>
        </div>
      }
      after={
        <div className={s.magnify}>
          <div className={s.field}>
            <span>Search</span>
            <kbd className={s.key} style={{ borderRadius: 3 }}>⌘K</kbd>
          </div>
        </div>
      }
      beforeNote="Shown at 2×. The key copies the field's 8px corner. Inset is 4px plus a 1px border, so the key's corner bulges into the gap."
      afterNote="8 − 4 inset − 1 border = 3. The border is part of the gap; leave it out and the result is off by a pixel per side."
    />
  );
}
