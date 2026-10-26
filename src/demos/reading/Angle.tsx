import { useState } from 'react';
import { SegmentedControl } from '../../ui/SegmentedControl';
import { Slider } from '../../ui/Slider';
import { Tweak } from '../shell';
import s from './reading.module.scss';

type Device = 'Phone' | 'Laptop' | 'Monitor';

// Millimetres per CSS pixel, and a usual distance in cm: an iPhone at 3× and 460 ppi held at 32 cm
// (Kong et al. 2025), a 13.6" MacBook Air at its default 1470 points across 301 mm, a 27" QHD at 1×.
const DEVICES: Record<Device, { mm: number; cm: number }> = {
  Phone: { mm: 0.1657, cm: 32 },
  Laptop: { mm: 0.2048, cm: 50 },
  Monitor: { mm: 0.233, cm: 60 },
};
// Geist's x-height, as a fraction of its size.
const X = 0.53;
// The scale's right end, in degrees of x-height.
const END = 0.6;

const angle = (px: number, mm: number, cm: number) => (2 * Math.atan((px * X * mm) / 2 / (cm * 10)) * 180) / Math.PI;

function verdict(deg: number) {
  if (deg < 0.15) return 'below most readers’ critical print size';
  if (deg < 0.2) return 'inside the critical print size band';
  if (deg < 0.3) return 'fluent for most, little to spare';
  return 'fluent, with room';
}

/** The same CSS size seen on three devices at their usual distance: what the eye gets is an angle. */
export function ReadingAngle() {
  const [device, setDevice] = useState<Device>('Laptop');
  const [px, setPx] = useState(15);
  const [cm, setCm] = useState(DEVICES.Laptop.cm);
  const deg = angle(px, DEVICES[device].mm, cm);
  const at = (d: number) => `${Math.min(100, (d / END) * 100)}%`;
  return (
    <Tweak
      height={0}
      readout={<code className={s.readout}>{`x-height ${deg.toFixed(2)}° · ${verdict(deg)}`}</code>}
      stage={
        <div className={s.angle}>
          <p className={s.sample} style={{ fontSize: px }}>
            The house sat right above the harbour.
          </p>
          <div className={s.scale}>
            <span className={s.zoneLow} style={{ width: at(0.15) }} />
            <span className={s.zoneBand} style={{ left: at(0.15), width: `calc(${at(0.3)} - ${at(0.15)})` }} />
            <span className={s.tick} style={{ left: at(0.2) }} data-label="0.2° fluent from here" />
            <span className={s.tick} style={{ left: at(0.3) }} data-label="0.3° Rello’s best" data-below />
            <span className={s.marker} style={{ left: at(deg) }} />
          </div>
        </div>
      }
      controls={
        <>
          <SegmentedControl
            label="Device"
            value={device}
            onValueChange={(d) => {
              setDevice(d);
              setCm(DEVICES[d].cm);
            }}
            segments={(['Phone', 'Laptop', 'Monitor'] as const).map((d) => ({ value: d, label: d }))}
            className={s.full}
          />
          <Slider label="Size" value={px} onValueChange={setPx} min={11} max={28} unit="px" />
          <Slider label="Distance" value={cm} onValueChange={setCm} min={20} max={90} unit="cm" />
        </>
      }
    />
  );
}
