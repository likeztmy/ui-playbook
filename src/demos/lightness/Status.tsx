import { useId, useState } from 'react';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Frame } from '../shell';
import { css, deltaE, rgb, seenWith, type Lch, type Vision } from './maths';
import { VisionFilter } from './Vision';
import s from './lightness.module.scss';

type Set = { name: string; danger: Lch; warning: Lch; success: Lch };

// The playbook's light status colours before this page, all within 1.5 points of lightness, and after,
// with danger a step darker than warning. Hues unchanged.
const SETS: Set[] = [
  {
    name: 'One lightness',
    danger: { l: 0.529, c: 0.176, h: 35.2 },
    warning: { l: 0.531, c: 0.119, h: 65.1 },
    success: { l: 0.516, c: 0.102, h: 165.9 },
  },
  {
    name: 'Lightness apart',
    danger: { l: 0.46, c: 0.169, h: 33 },
    warning: { l: 0.541, c: 0.12, h: 65.8 },
    success: { l: 0.516, c: 0.102, h: 165.9 },
  },
];

// A dot each, as in a calendar or a compact list, where colour is the cue the eye scans by.
const ROWS = [
  { tone: 'danger', label: 'Payment failed' },
  { tone: 'warning', label: 'Card expires soon' },
  { tone: 'success', label: 'Payment received' },
] as const;

const VISIONS: { value: Vision; label: string }[] = [
  { value: 'typical', label: 'Typical' },
  { value: 'deuteranopia', label: 'Deuteranopia' },
  { value: 'protanopia', label: 'Protanopia' },
];

/** The same three statuses twice, seen through a colour-blind eye: same lightness, or lightness apart. */
export function LightnessStatus() {
  const [vision, setVision] = useState<Vision>('deuteranopia');
  const id = `vision${useId().replace(/[^a-z0-9]/gi, '')}`;
  return (
    <Frame label={`Failed against expiring, ${vision === 'typical' ? 'as most people see them' : `seen with ${vision}`}`} height={0}>
      <div className={s.status}>
        {vision !== 'typical' && <VisionFilter id={id} vision={vision} />}
        <SegmentedControl label="Vision" value={vision} onValueChange={setVision} segments={VISIONS} />
        <div className={s.statusSets}>
          {SETS.map((set) => {
            const gap = deltaE(seenWith(rgb(set.danger), vision), seenWith(rgb(set.warning), vision));
            return (
              <figure key={set.name} className={s.statusSet}>
                <div className={s.statusCard} style={{ filter: vision === 'typical' ? undefined : `url(#${id})` }}>
                  {ROWS.map(({ tone, label }) => (
                    <span key={tone} className={s.statusRow}>
                      <span className={s.statusDot} style={{ background: css(set[tone]) }} />
                      {label}
                    </span>
                  ))}
                </div>
                <figcaption>
                  <span>{set.name}</span>
                  <code className={s.readout} data-fails={gap < 0.02 ? '' : undefined}>
                    ΔE {gap.toFixed(3)}
                  </code>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </Frame>
  );
}
