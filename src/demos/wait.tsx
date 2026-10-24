import { Check, LoaderCircle, Plane, RefreshCw, Star } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { cx } from '../ui/cx';
import { Compare, localized } from './shell';
import s from './demos.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

function Spinner({ className }: { className?: string }) {
  return <LoaderCircle {...ic} className={cx(s.waitSpin, className)} />;
}

/** Clears every timer it was given when the component goes. */
function useTimers() {
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  return (fn: () => void, ms: number) => {
    timers.current.push(setTimeout(fn, ms));
  };
}

// ── A spinner that flashes ───────────────────────────────

/** Show a spinner only after this long, as delay-loading does. */
const DELAY = 300;
/** Once shown, keep it this long, so it can't flash out again (spin-delay's minDuration). */
const MIN = 500;
/** Request times, in turn: mostly quick, one just past the delay, one slow. */
const LATENCY = [160, 340, 1600, 220, 380, 900];

const FILES = ['Q4 roadmap', 'Brand guide', 'Onboarding', 'Pricing'];

/** A file list with Refresh. `patient` waits before showing the spinner, then keeps it a moment. */
function Refresh({ patient }: { patient?: boolean }) {
  const [busy, setBusy] = useState(false);
  const [spin, setSpin] = useState(false);
  const [n, setN] = useState(0);
  const [updated, setUpdated] = useState(0);
  const later = useTimers();

  const refresh = () => {
    if (busy) return;
    const latency = LATENCY[n % LATENCY.length];
    setN((x) => x + 1);
    setBusy(true);
    if (!patient) {
      setSpin(true);
      later(() => {
        setSpin(false);
        setBusy(false);
        setUpdated((u) => u + 1);
      }, latency);
      return;
    }
    const shownAt = latency > DELAY ? DELAY : null;
    if (shownAt !== null) later(() => setSpin(true), shownAt);
    const end = shownAt === null ? latency : Math.max(latency, shownAt + MIN);
    later(() => {
      setSpin(false);
      setBusy(false);
      setUpdated((u) => u + 1);
    }, end);
  };

  return (
    <div className={s.waitList}>
      <div className={s.waitHead}>
        <span className={s.waitTitle}>Files</span>
        <span className={s.waitMeta}>{updated ? `Updated ${updated === 1 ? 'once' : `${updated} times`}` : 'Not refreshed'}</span>
        <Button variant="ghost" size="sm" icon aria-label="Refresh" aria-busy={busy || undefined} onClick={refresh}>
          {spin ? <Spinner /> : <RefreshCw {...ic} />}
        </Button>
      </div>
      {FILES.map((f) => (
        <div key={f} className={s.waitRow} data-stale={spin ? '' : undefined}>
          {f}
        </div>
      ))}
    </div>
  );
}

export const WaitFlash = localized(function WaitFlash() {
  return (
    <Compare
      height={0}
      before={<Refresh />}
      after={<Refresh patient />}
      beforeNote={
        <>
          The spinner shows the moment Refresh is pressed. Most refreshes take under a third of a second, so it blinks on and off, and a
          blink reads as a glitch rather than as work. Under a second, NN/g advises showing{' '}
          <a href="https://www.nngroup.com/articles/skeleton-screens/">no indicator at all</a>.
        </>
      }
      afterNote={
        <>
          Nothing shows for the first 300 ms (<code>delay-loading</code>), so quick refreshes just land. Past that, the spinner stays at
          least half a second, so a request that ends just after the delay can't flash it either: the second half of the rule, from{' '}
          <a href="https://github.com/smeijer/spin-delay">spin-delay</a>.
        </>
      }
    />
  );
});

// ── The end counts most ──────────────────────────────────

/** 5.5 s in all, as in Harrison et al.'s study; one second of it stands still. */
const TOTAL = 5500;
const STALL = 1000;

/** Progress at time t (0–TOTAL) for a bar whose stall starts at `stallAt` (0–1 of the moving time). */
function progressAt(t: number, stallAt: number) {
  const moving = TOTAL - STALL;
  const stallStart = stallAt * moving;
  const m = t < stallStart ? t : t < stallStart + STALL ? stallStart : t - STALL;
  return Math.min(1, m / moving);
}

const GUESSES = [4, 5, 6, 7, 8];

/** A progress bar that stands still for a second, early or late, then asks how long it took. */
function Stall({ early }: { early?: boolean }) {
  const [t, setT] = useState<number | null>(null);
  const [guess, setGuess] = useState<number | null>(null);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const run = () => {
    setGuess(null);
    const start = performance.now();
    const tick = () => {
      const now = performance.now() - start;
      setT(Math.min(now, TOTAL));
      if (now < TOTAL) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const p = t === null ? 0 : progressAt(t, early ? 0.04 : 0.92);
  const done = t !== null && t >= TOTAL;
  return (
    <div className={s.waitBarDemo}>
      <span className={s.waitMeta}>Exporting 248 files</span>
      <div className={s.waitBar} role="progressbar" aria-label="Export" aria-valuenow={Math.round(p * 100)} aria-valuemin={0} aria-valuemax={100}>
        <span className={s.waitFill} style={{ width: `${p * 100}%` }} />
      </div>
      {done ? (
        guess === null ? (
          <div className={s.waitGuess}>
            <span className={s.waitMeta}>How long did it take?</span>
            <div className={s.waitChips}>
              {GUESSES.map((g) => (
                <Button key={g} size="sm" onClick={() => setGuess(g)}>
                  {g} s
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className={s.waitGuess}>
            <span className={s.waitMeta}>
              You said {guess} s. It took {TOTAL / 1000} s, the same as the other one.
            </span>
            <Button size="sm" variant="ghost" onClick={run}>
              Run again
            </Button>
          </div>
        )
      ) : (
        <Button size="sm" onClick={run} disabled={t !== null}>
          {t === null ? 'Export' : 'Exporting…'}
        </Button>
      )}
    </div>
  );
}

export const WaitStall = localized(function WaitStall() {
  return (
    <Compare
      height={0}
      before={<Stall />}
      after={<Stall early />}
      beforeNote={
        <>
          The bar stands still for a second at 90%, just when the end seemed near. In Harrison et al.’s study people disliked a pause towards
          the end most of all (
          <a href="https://www.chrisharrison.net/index.php/Research/ProgressBars">Rethinking the Progress Bar</a>, UIST 2007).
        </>
      }
      afterNote="The same second, spent at the start, before anyone is watching closely. The study’s advice: front-load the slow, uncertain stages and let the bar speed up towards the end, which people favoured most."
    />
  );
});

// ── A bar that moves backwards ───────────────────────────

const RIB_TIME = 6000;

/** A 6 s linear bar; `ribbed` adds stripes that drift backwards, slowing as they go. */
function Ribbed({ ribbed }: { ribbed?: boolean }) {
  const [run, setRun] = useState(0);
  const [running, setRunning] = useState(false);
  const later = useTimers();
  const start = () => {
    setRun((r) => r + 1);
    setRunning(true);
    later(() => setRunning(false), RIB_TIME);
  };
  return (
    <div className={s.waitBarDemo}>
      <span className={s.waitMeta}>Uploading video</span>
      <div className={s.waitBar}>
        {run > 0 && <span key={run} className={cx(s.waitFill, s.waitLinear, ribbed && s.waitRibs)} />}
      </div>
      <Button size="sm" onClick={start} disabled={running}>
        {run ? 'Upload again' : 'Upload'}
      </Button>
    </div>
  );
}

export const WaitRibbing = localized(function WaitRibbing() {
  return (
    <Compare
      height={0}
      before={<Ribbed />}
      after={<Ribbed ribbed />}
      beforeNote="A solid bar, filling at a steady rate for six seconds."
      afterNote={
        <>
          The same six seconds, with stripes drifting against the fill and slowing as they go. The motion against the bar makes it seem to move
          faster: perceived duration was 11% shorter in Harrison, Yeo and Hudson’s tests (
          <a href="https://www.chrisharrison.net/index.php/Research/ProgressBars2">Faster Progress Bars</a>, CHI 2010).
        </>
      }
    />
  );
});

// ── Show the work ────────────────────────────────────────

const AIRLINES = ['Lufthansa', 'KLM', 'British Airways', 'Air France', 'Iberia', 'SWISS'];
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
  const later = useTimers();
  const search = () => {
    setPhase('search');
    setAsked(0);
    AIRLINES.forEach((_, i) => later(() => setAsked(i + 1), ((i + 1) * SEARCH) / (AIRLINES.length + 1)));
    later(() => setPhase('done'), SEARCH);
  };
  return (
    <div className={s.waitFlights}>
      <div className={s.waitHead}>
        <span className={s.waitTitle}>
          <Plane {...ic} /> Berlin → Amsterdam, Fri
        </span>
        <Button size="sm" variant="primary" onClick={search} disabled={phase === 'search'}>
          Search
        </Button>
      </div>
      <div className={s.waitFlightBody}>
        {phase === 'search' &&
          (open ? (
            <div className={s.waitChecks}>
              {AIRLINES.map((a, i) => (
                <span key={a} className={s.waitCheck} data-state={i < asked ? 'done' : i === asked ? 'now' : undefined}>
                  {i < asked ? <Check {...ic} /> : i === asked ? <Spinner /> : <span className={s.waitDot} />}
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
      height={0}
      before={<FlightSearch />}
      after={<FlightSearch open />}
      beforeNote="A spinner for 3.6 seconds. Nothing says what is happening, so the wait is only a wait."
      afterNote={
        <>
          The same 3.6 seconds, naming each airline as it’s asked. In Buell and Norton’s experiments, people shown the work could prefer a
          site with a longer wait to one that answered at once, even when the results were identical (
          <a href="https://doi.org/10.1287/mnsc.1110.1376">The Labor Illusion</a>, 2011).
        </>
      }
    />
  );
});

// ── Skeleton for a page, spinner for a part ──────────────

const PAGE = 1500;

function ProfileCard() {
  return (
    <div className={s.waitProfile}>
      <span className={s.waitAvatar} aria-hidden>
        AR
      </span>
      <div className={s.waitProfileText}>
        <span className={s.waitTitle}>Ana Ruiz</span>
        <span className={s.waitMeta}>Design lead · Lisbon</span>
      </div>
      <p className={s.waitBio}>Runs the design system and the weekly critique. Ask her about type.</p>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className={s.waitProfile} aria-hidden>
      <span className={cx(s.waitAvatar, s.waitBone)} />
      <div className={s.waitProfileText}>
        <span className={s.waitBone} style={{ width: 96, height: 16 }} />
        <span className={s.waitBone} style={{ width: 140, height: 12 }} />
      </div>
      <div className={s.waitBio}>
        <span className={s.waitBone} style={{ width: '100%', height: 12 }} />
        <span className={s.waitBone} style={{ width: '70%', height: 12 }} />
      </div>
    </div>
  );
}

/** A profile that takes 1.5 s; `skeleton` holds its shape while it loads. */
function Profile({ skeleton }: { skeleton?: boolean }) {
  const [loading, setLoading] = useState(true);
  const later = useTimers();
  const load = () => {
    setLoading(true);
    later(() => setLoading(false), PAGE);
  };
  useEffect(load, []);
  return (
    <div className={s.waitProfileDemo}>
      <div className={s.waitProfileStage} aria-busy={loading || undefined}>
        {!loading ? (
          <ProfileCard />
        ) : skeleton ? (
          <ProfileSkeleton />
        ) : (
          <span className={s.waitCentre}>
            <Spinner />
          </span>
        )}
      </div>
      <Button size="sm" variant="ghost" onClick={load} disabled={loading}>
        Reload
      </Button>
    </div>
  );
}

export const WaitSkeleton = localized(function WaitSkeleton() {
  return (
    <Compare
      height={0}
      before={<Profile />}
      after={<Profile skeleton />}
      beforeNote="A spinner in the middle of the panel says something is coming, but not what or where, and the content then appears all at once."
      afterNote={
        <>
          A skeleton in the shape of the profile shows the layout before the words, and holds the space the content will take. NN/g keeps
          skeletons for full-page loads and spinners for a single part, a card or a video (
          <a href="https://www.nngroup.com/articles/skeleton-screens/">Skeleton screens</a>).
        </>
      }
    />
  );
});

// ── Don't wait at all ────────────────────────────────────

const SAVE = 900;
const STARRED = ['Q4 roadmap', 'Brand guide', 'Onboarding'];

/** Starring files. `optimistic` stars at once and takes it back if the server says no. */
function Stars({ optimistic }: { optimistic?: boolean }) {
  const [starred, setStarred] = useState<string[]>(['Brand guide']);
  const [pending, setPending] = useState<string[]>([]);
  const [fail, setFail] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const later = useTimers();

  const toggle = (f: string) => {
    if (pending.includes(f)) return;
    const on = !starred.includes(f);
    const failing = fail;
    setFail(false);
    setError(null);
    const apply = (v: boolean) => setStarred((l) => (v ? [...l, f] : l.filter((x) => x !== f)));
    if (optimistic) apply(on);
    else setPending((p) => [...p, f]);
    later(() => {
      setPending((p) => p.filter((x) => x !== f));
      if (failing) {
        if (optimistic) apply(!on);
        setError(`Couldn’t ${on ? 'star' : 'unstar'} “${f}”. Try again.`);
      } else if (!optimistic) apply(on);
    }, SAVE);
  };

  return (
    <div className={s.waitList}>
      {STARRED.map((f) => {
        const on = starred.includes(f);
        return (
          <div key={f} className={s.waitRow}>
            <span>{f}</span>
            <Button variant="ghost" size="sm" icon aria-label={on ? `Unstar ${f}` : `Star ${f}`} aria-pressed={on} onClick={() => toggle(f)}>
              {pending.includes(f) ? <Spinner /> : <Star {...ic} className={on ? s.waitStarOn : undefined} />}
            </Button>
          </div>
        );
      })}
      <span className={s.waitError} role="status">
        {error ?? ' '}
      </span>
      <Checkbox label="Fail the next request" checked={fail} onCheckedChange={setFail} />
    </div>
  );
}

export const WaitOptimistic = localized(function WaitOptimistic() {
  return (
    <Compare
      height={0}
      before={<Stars />}
      after={<Stars optimistic />}
      beforeNote="The star waits for the server: a spinner for most of a second on an action that almost never fails."
      afterNote={
        <>
          The star fills at once, and the request runs behind it. If the server refuses, the star goes back and says why. React builds this in
          as <a href="https://react.dev/reference/react/useOptimistic">useOptimistic</a>. It suits actions that rarely fail and are cheap to
          undo; a payment still waits.
        </>
      }
    />
  );
});

/** The flight search mid-way, held still. */
export function WaitPreview() {
  return (
    <div className={cx(s.waitFlights, s.waitStill)} aria-hidden>
      <div className={s.waitChecks}>
        {AIRLINES.slice(0, 4).map((a, i) => (
          <span key={a} className={s.waitCheck} data-state={i < 2 ? 'done' : i === 2 ? 'now' : undefined}>
            {i < 2 ? <Check {...ic} /> : i === 2 ? <LoaderCircle {...ic} /> : <span className={s.waitDot} />}
            {i < 2 ? `Checked ${a}` : `Checking ${a}`}
          </span>
        ))}
      </div>
    </div>
  );
}
