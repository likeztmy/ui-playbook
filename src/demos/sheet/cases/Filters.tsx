import { useRef, useState } from 'react';
import { Button } from '../../../ui/Button';
import { Sheet } from '../../../ui/Sheet';
import { Switch } from '../../../ui/Switch';
import { matching, NONE, type Filters as F } from './places';
import { Stays } from './Stays';
import s from '../sheet.module.scss';
import c from './cases.module.scss';

const POINTS = [0.5, 1];

/**
 * Filters over the results. `live`: a standard sheet, and each switch changes the list above it at
 * once. Otherwise a modal one, whose Show applies them and closes.
 */
export function Filters({ live }: { live?: boolean }) {
  const [open, setOpen] = useState(true);
  const trigger = useRef<HTMLButtonElement>(null);
  const [applied, setApplied] = useState<F>(NONE);
  const [draft, setDraft] = useState<F>(NONE);
  const f = live ? applied : draft;
  const set = (patch: Partial<F>) => (live ? setApplied({ ...applied, ...patch }) : setDraft({ ...draft, ...patch }));

  return (
    <Sheet.Root open={open} onOpenChange={setOpen} kind={live ? 'standard' : 'modal'} snapPoints={POINTS}>
      <Sheet.Area className={s.phone}>
        <Stays stays={matching(applied)} />
        <Button ref={trigger} size="sm" className={c.float} onClick={() => setOpen(true)}>
          Filters
        </Button>
      </Sheet.Area>
      <Sheet.Popup title="Filters" initialFocus={false} finalFocus={trigger}>
        <div className={c.stack}>
          <Switch label="Pets allowed" checked={f.pets} onCheckedChange={(pets) => set({ pets })} />
          <Switch label="Under £100" checked={f.cheap} onCheckedChange={(cheap) => set({ cheap })} />
          <Switch label="Free cancellation" checked={f.cancel} onCheckedChange={(cancel) => set({ cancel })} />
          {!live && (
            <Button
              variant="primary"
              onClick={() => {
                setApplied(draft);
                setOpen(false);
              }}
            >
              Show {matching(draft).length} places
            </Button>
          )}
        </div>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
