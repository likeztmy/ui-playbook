import { Route, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../../ui/Button';
import { Sheet } from '../../ui/Sheet';
import { Details } from './Details';
import { Map } from './Map';
import { place } from './data';
import s from './sheet.module.scss';

const POINTS = [0.5, 1];
const ic = { size: 16, 'aria-hidden': true } as const;

type Props = {
  kind?: 'standard' | 'modal';
  /** Opens at full height, covering the map. */
  tall?: boolean;
  /** Offers a stop on the way, from inside the sheet. */
  stop?: boolean;
  /** Adding the stop lowers the sheet so the new walk shows on the map. */
  reveal?: boolean;
  /** Lists everything along the way, more than fits at half height. */
  long?: boolean;
  /** Scrolling that list raises the sheet first, Apple's default. */
  scrollGrows?: boolean;
};

/** A phone's worth of map with the walk to the ferry in a sheet over it. */
export function Walk({ kind = 'standard', tall, stop, reveal, long, scrollGrows }: Props) {
  const [open, setOpen] = useState(true);
  const [point, setPoint] = useState<number | string | null>(tall ? 1 : 0.5);
  const [picked, setPicked] = useState<string | null>(null);
  const [via, setVia] = useState(false);
  // Route reopening a closed sheet moves focus in; the sheet open on arrival, or opened from the map, leaves it.
  const [fromRoute, setFromRoute] = useState(false);
  const route = useRef<HTMLButtonElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  const pick = (id: string) => {
    setPicked(id);
    if (!open) setFromRoute(false);
    setOpen(true);
  };
  const toggleStop = () => {
    setVia((v) => !v);
    if (reveal) setPoint(0.5);
  };
  const p = place(picked);

  return (
    <Sheet.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setPoint(tall ? 1 : 0.5);
      }}
      kind={kind}
      snapPoints={POINTS}
      snapPoint={point}
      onSnapPointChange={setPoint}
      scrollGrows={scrollGrows}
    >
      <Sheet.Area className={s.phone}>
        <Map picked={picked} onPick={pick} via={via} />
        <Button
          ref={route}
          size="sm"
          className={s.reopen}
          onClick={() => {
            setPicked(null);
            if (!open) setFromRoute(true);
            setOpen(true);
          }}
        >
          <Route {...ic} />
          Route
        </Button>
      </Sheet.Area>
      <Sheet.Popup
        title={p ? p.name : 'Walk to the ferry'}
        // Open on arrival, it is the page's business, not a reason to pull focus into the demo.
        initialFocus={fromRoute ? close : false}
        finalFocus={route}
        actions={
          p ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setPicked(null);
                // The button goes with the café; focus moves to the one that takes its place.
                requestAnimationFrame(() => close.current?.focus());
              }}
            >
              Back to route
            </Button>
          ) : (
            <Sheet.Close render={<Button ref={close} size="sm" variant="ghost" icon label="Close" />}>
              <X {...ic} />
            </Sheet.Close>
          )
        }
      >
        <Details picked={picked} via={via} onStop={stop ? toggleStop : undefined} long={long} />
      </Sheet.Popup>
    </Sheet.Root>
  );
}
