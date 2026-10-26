import { useState } from 'react';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import { Lifted } from './Lifted';
import s from '../demos.module.scss';

type Kind = 'Shadow' | 'Light patch';

// The slope people's judgements followed: perceived lift ≈ 1.31 × the shadow's offset (Cavanagh,
// Casati & Elder 2021), nearly regardless of blur.
const SLOPE = 1.31;

/** One card, its shadow's offset and blur set apart: the offset lifts it, the blur barely does. */
export function ShadowRaise() {
  const [y, setY] = useState(4);
  const [blur, setBlur] = useState(8);
  const [kind, setKind] = useState<Kind>('Shadow');
  const shadow = kind === 'Shadow' ? `0 ${y}px ${blur}px oklch(0.3 0.01 75 / 0.2)` : `0 ${y}px ${blur}px oklch(1 0 0 / 0.95)`;
  return (
    <Tweak
      height={300}
      readout={
        <code className={s.readout}>
          {kind === 'Shadow' ? `0 ${y}px ${blur}px · reads ≈ ${Math.round(SLOPE * y)}px up` : 'a light patch · no lift'}
        </code>
      }
      stage={<Lifted shadow={shadow} />}
      controls={
        <>
          <SegmentedControl
            label="What's under it"
            value={kind}
            onValueChange={setKind}
            segments={[
              { value: 'Shadow', label: 'Shadow' },
              { value: 'Light patch', label: 'Light patch' },
            ]}
            className={s.fill}
          />
          <Slider label="Offset" value={y} onValueChange={setY} max={24} unit="px" />
          <Slider label="Blur" value={blur} onValueChange={setBlur} max={48} unit="px" />
        </>
      }
    />
  );
}
