import { Bold, Italic, Underline } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Sheet } from '../../../ui/Sheet';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

const ic = { size: 16, strokeWidth: 2, 'aria-hidden': true } as const;
const STYLES = [
  { id: 'bold', label: 'Bold', icon: Bold },
  { id: 'italic', label: 'Italic', icon: Italic },
  { id: 'underline', label: 'Underline', icon: Underline },
] as const;
type Style = (typeof STYLES)[number]['id'];

/** A note with a word selected, and a short standard sheet of styles that change it in place. */
export function Format() {
  const [on, setOn] = useState<Style[]>([]);
  const toggle = (x: Style) => setOn((all) => (all.includes(x) ? all.filter((y) => y !== x) : [...all, x]));
  return (
    <Sheet.Root open onOpenChange={() => {}} snapPoints={['140px']}>
      <Sheet.Area className={s.phone}>
        <div className={c.page}>
          <p className={c.note}>
            The ferry leaves at 8:30 from gate 2. Coffee first at the{' '}
            <mark className={c.picked} data-styles={on.join(' ') || undefined}>
              harbour
            </mark>
            , then the walk along Quay Street. Bring the tickets.
          </p>
        </div>
      </Sheet.Area>
      <Sheet.Popup title="Format" initialFocus={false}>
        <div className={c.tools}>
          {STYLES.map((x) => (
            <Button key={x.id} icon aria-label={x.label} aria-pressed={on.includes(x.id)} onClick={() => toggle(x.id)}>
              <x.icon {...ic} />
            </Button>
          ))}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
