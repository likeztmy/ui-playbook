import { Check, Plane } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { useTimers } from '../novelty/useTimers';
import { Compare, localized } from '../shell';
import { Spinner } from './Spinner';
import { useBusy } from './useBusy';
import s from './wait.module.scss';

export const AIRLINES = ['Lufthansa', 'KLM', 'British Airways', 'Air France', 'Iberia', 'SWISS'];
const FLIGHTS = [
  ['07:10', 'KLM', '€184'],
  ['09:45', 'Lufthansa', '€212'],
  ['13:20', 'SWISS', '€239'],
] as const;
const SEARCH = 3600;

/** A flight search that takes the same time either way; `open` shows which airline it's asking. */
function FlightSearch({ open }: { open?: boolean }) {
  const [phase, setPhase] = useState<'idle' | 'search' | 'done'>('idle');
  const [asked, setAsked] = useState(0);
  const busy = useBusy(phase === 'search');
  const later = useTimers();
  const search = () => {
    if (phase === 'search') return;
    setPhase('search');
    setAsked(0);
    AIRLINES.forEach((_, i) => later(() => setAsked(i + 1), ((i + 1) * SEARCH) / (AIRLINES.length + 1)));
    later(() => setPhase('done'), SEARCH);
  };
  return (
    <div className={s.waitFlights}>
      <div className={s.waitHead}>
        <span className={s.waitTitle}>
          <Plane size={16} aria-hidden /> Berlin to Amsterdam, Fri
        </span>
        <Button size="sm" variant="primary" onClick={search} loading={busy} loadingLabel="Searching">
          Search
        </Button>
      </div>
      <div className={s.waitFlightBody}>
        {phase === 'idle' && <span className={s.waitIdle}>Search to see Friday’s flights.</span>}
        {phase === 'search' &&
          (open ? (
            <div className={s.waitChecks}>
              {AIRLINES.map((a, i) => (
                <span key={a} className={s.waitCheck} data-state={i < asked ? 'done' : i === asked ? 'now' : undefined}>
                  {i < asked ? <Check size={16} aria-hidden /> : i === asked ? <Spinner /> : <span className={s.waitDot} />}
                  {i < asked ? `Checked ${a}` : `Checking ${a}`}
                </span>
              ))}
            </div>
          ) : (
            <span className={s.waitCentre}>
              <Spinner /> Searching…
            </span>
          ))}
        {phase === 'done' &&
          FLIGHTS.map(([time, airline, price]) => (
            <div key={time} className={s.waitRow}>
              <span>
                {time} · {airline}
              </span>
              <span className={s.waitPrice}>{price}</span>
            </div>
          ))}
      </div>
    </div>
  );
}

export const WaitLabor = localized(function WaitLabor() {
  return (
    <Compare
      beforeLabel="“Searching…” for 3.6 s"
      afterLabel="Names each airline as asked"
      height={0}
      before={<FlightSearch />}
      after={<FlightSearch open />}
      beforeNote="A spinner for 3.6 seconds. Nothing says what is happening, so the wait is only a wait."
      afterNote={
        <>
          The same 3.6 seconds, naming each airline as it’s asked. In Buell and Norton’s experiments, people shown the work could prefer a site with a
          longer wait to one that answered at once, even when the results were identical (
          <a href="https://doi.org/10.1287/mnsc.1110.1376">The Labor Illusion</a>, 2011).
        </>
      }
    />
  );
});
