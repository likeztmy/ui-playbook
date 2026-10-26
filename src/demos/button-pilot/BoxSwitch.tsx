import { useEffect, useState } from 'react';
import { Button } from '../../ui/Button';
import { SegmentedControl } from '../../ui/SegmentedControl';
import type { Box } from '../box';
import s from './switch.module.scss';

const SEGMENTS: { value: Box; label: string }[] = [
  { value: 'band', label: 'Today' },
  { value: 'caption', label: 'A · Caption' },
  { value: 'plate', label: 'B · Plate' },
  { value: 'toggle', label: 'C · Toggle' },
];

/** The pilot's one control: which frame every demo wears, and slow motion for the page. */
export function BoxSwitch() {
  const [box, setBox] = useState<Box>('caption');
  const [slow, setSlow] = useState(false);
  // Read once from ?box=, so a link can open on one variant.
  useEffect(() => {
    const q = new URLSearchParams(location.search).get('box') as Box | null;
    if (q && SEGMENTS.some((x) => x.value === q)) setBox(q);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.box = box;
    const url = new URL(location.href);
    url.searchParams.set('box', box);
    history.replaceState(null, '', url);
  }, [box]);
  useEffect(() => {
    if (slow) document.documentElement.dataset.slow = '';
    else delete document.documentElement.dataset.slow;
  }, [slow]);
  return (
    <div className={s.bar} role="toolbar" aria-label="Pilot">
      <SegmentedControl label="Frame" value={box} onValueChange={setBox} segments={SEGMENTS} />
      <Button size="sm" variant="ghost" aria-pressed={slow} className={s.slow} onClick={() => setSlow((x) => !x)}>
        0.1×
      </Button>
    </div>
  );
}
