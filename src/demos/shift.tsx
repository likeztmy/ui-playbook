import { Archive, RotateCcw } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { TextField } from '../ui/Field';
import { Compare } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

// ── The browser's own measure ────────────────────────────

type ShiftEntry = PerformanceEntry & { value: number; hadRecentInput: boolean; sources?: { node: Node | null }[] };

/**
 * Sums the Layout Instability API's shift scores for nodes inside `root`,
 * leaving out shifts within 500ms of a click, tap or key, as CLS does.
 * Chromium only; elsewhere `supported` stays false.
 */
function useShiftScore(root: React.RefObject<HTMLElement | null>) {
  const [supported, setSupported] = useState(false);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!PerformanceObserver.supportedEntryTypes?.includes('layout-shift')) return;
    setSupported(true);
    const po = new PerformanceObserver((list) => {
      let add = 0;
      let n = 0;
      for (const e of list.getEntries() as ShiftEntry[]) {
        if (e.hadRecentInput) continue;
        if (!e.sources?.some((src) => src.node && root.current?.contains(src.node))) continue;
        add += e.value;
        n += 1;
      }
      if (n) {
        setScore((v) => v + add);
        setCount((c) => c + n);
      }
    });
    po.observe({ type: 'layout-shift' });
    return () => po.disconnect();
  }, [root]);
  return {
    supported,
    score,
    count,
    reset: () => {
      setScore(0);
      setCount(0);
    },
  };
}

/** A demo with its shift score and, optionally, a status and a way to run it again. */
function Measured({ children, status, onReplay }: { children: ReactNode; status?: ReactNode; onReplay?: () => void }) {
  const root = useRef<HTMLDivElement>(null);
  const { supported, score, count, reset } = useShiftScore(root);
  return (
    <div className={s.shiftDemo}>
      <div ref={root} className={s.shiftStage}>
        {children}
      </div>
      <div className={s.shiftFoot}>
        <span className={s.aimStatus} aria-live="polite">
          {status ?? ' '}
        </span>
        {supported && (
          <span className={s.shiftScore} data-shifted={count ? '' : undefined}>
            {count === 1 ? '1 shift' : `${count} shifts`} · {score.toFixed(4)}
          </span>
        )}
        {onReplay && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              reset();
              onReplay();
            }}
          >
            <RotateCcw size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
            Replay
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Nothing moves unasked ────────────────────────────────

type Mail = readonly [from: string, subject: string, time: string];

const MAIL: Mail[] = [
  ['Ana Ruiz', 'Q4 roadmap review', '9:41'],
  ['Billing', 'Your October invoice', '9:12'],
  ['Kenji Mori', 'Re: brand guide', 'Yesterday'],
  ['Issues', '3 issues assigned to you', 'Yesterday'],
  ['Weekly digest', 'What happened this week', 'Mon'],
];

const NEW: Mail[] = [
  ['Priya Shah', 'Lunch on Friday?', '9:58'],
  ['Calendar', 'Design review moved to 3 pm', '9:57'],
];

/** An inbox where two messages arrive while the pointer rests on it. `hold` keeps them behind a pill. */
function Inbox({ hold }: { hold?: boolean }) {
  const [mail, setMail] = useState(MAIL);
  const [waiting, setWaiting] = useState(false);
  const [archived, setArchived] = useState<string | null>(null);
  const [run, setRun] = useState(0);
  const arrived = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);
  const arrive = () => {
    if (arrived.current) return;
    timer.current = setTimeout(() => {
      arrived.current = true;
      if (hold) setWaiting(true);
      else setMail((list) => [...NEW, ...list]);
    }, 700);
  };
  const replay = () => {
    clearTimeout(timer.current);
    arrived.current = false;
    setMail(MAIL);
    setWaiting(false);
    setArchived(null);
    setRun((n) => n + 1);
  };

  return (
    <Measured status={archived && `Archived “${archived}”`} onReplay={replay}>
      <div key={run} className={s.inbox} onPointerEnter={arrive} onPointerLeave={() => clearTimeout(timer.current)}>
        {waiting && (
          <Button
            size="sm"
            className={s.inboxPill}
            onClick={() => {
              setMail((list) => [...NEW, ...list]);
              setWaiting(false);
            }}
          >
            2 new messages
          </Button>
        )}
        {mail.map(([from, subject, time]) => (
          <div key={subject} className={s.inboxRow}>
            <span className={s.inboxFrom}>{from}</span>
            <span className={s.inboxSubject}>{subject}</span>
            <span className={s.inboxTime}>{time}</span>
            <Button
              variant="ghost"
              size="sm"
              icon
              aria-label={`Archive “${subject}”`}
              onClick={() => {
                setMail((list) => list.filter((x) => x[1] !== subject));
                setArchived(subject);
              }}
            >
              <Archive size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
            </Button>
          </div>
        ))}
      </div>
    </Measured>
  );
}

export function ShiftInbox() {
  return (
    <Compare
      stacked
      height={0}
      before={<Inbox />}
      after={<Inbox hold />}
      beforeNote={
        <>
          The new messages land while the pointer is already on its way to an Archive button, and the button it reaches belongs to
          another message. This is the shift <a href="https://web.dev/articles/cls">CLS</a> counts against a page: one nobody asked for.
        </>
      }
      afterNote="The messages wait behind a pill that floats over the list and takes no room. The list moves when the pill is clicked, which is a move the reader asked for, and the browser’s own measure leaves it out."
    />
  );
}

// ── Bold that pushes ─────────────────────────────────────

const NAV = ['Overview', 'Issues', 'Pull requests', 'Releases', 'Settings'];

function BoldNav({ reserve }: { reserve?: boolean }) {
  const [current, setCurrent] = useState('Issues');
  return (
    <Measured>
      <nav className={cx(s.boldNav, reserve && s.boldReserve)} aria-label="Project">
        {NAV.map((n) => (
          <a
            key={n}
            href="#project"
            data-text={n}
            aria-current={n === current ? 'page' : undefined}
            onClick={(e) => {
              e.preventDefault();
              setCurrent(n);
            }}
          >
            {n}
          </a>
        ))}
      </nav>
    </Measured>
  );
}

export function ShiftBold() {
  return (
    <Compare
      height={0}
      before={<BoldNav />}
      after={<BoldNav reserve />}
      beforeNote="Bold glyphs are wider. Each link the pointer crosses grows, and every link after it moves along: the one being aimed at slides away."
      afterNote={
        <>
          Each link also holds an invisible bold copy of its own name, so it is as wide as it will ever get (
          <a href="https://css-tricks.com/bold-on-hover-without-the-layout-shift/">CSS-Tricks</a>). Hover by a fill instead, and the weight
          need never change.
        </>
      }
    />
  );
}

// ── The scroll bar you never see ─────────────────────────

const PEOPLE: [string, string][] = [
  ['Ana Ruiz', 'Owner'],
  ['Ben Okafor', 'Editor'],
  ['Chen Wei', 'Editor'],
  ['Dara Kim', 'Viewer'],
  ['Elif Demir', 'Editor'],
  ['Femi Ade', 'Viewer'],
  ['Gus Lind', 'Viewer'],
  ['Hana Sato', 'Editor'],
  ['Ivo Petrov', 'Viewer'],
  ['Jo Park', 'Viewer'],
];

function Members({ stable }: { stable?: boolean }) {
  const [q, setQ] = useState('');
  const shown = PEOPLE.filter(([name]) => name.toLowerCase().includes(q.trim().toLowerCase()));
  return (
    <div className={s.members}>
      <TextField label="Filter members" placeholder="Name" value={q} onValueChange={setQ} />
      <div className={cx(s.membersList, stable && s.membersStable)} tabIndex={0} role="region" aria-label="Members">
        {shown.map(([name, role]) => (
          <div key={name} className={s.memberRow}>
            <span>{name}</span>
            <span className={s.memberRole}>{role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ShiftScrollbar() {
  return (
    <Compare
      height={0}
      before={<Members />}
      after={<Members stable />}
      beforeNote={
        <>
          Type “an”: the list stops overflowing, its scroll bar goes, and every role jumps 12px right. On a Mac or a phone the bar floats
          over the content and takes no room, so whoever built it never saw this; on Windows, and wherever bars are always shown, everyone
          does.
        </>
      }
      afterNote={
        <>
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-gutter">
            <code>scrollbar-gutter: stable</code>
          </a>{' '}
          keeps the bar’s room whether it’s there or not. Overlay bars take none, so it changes nothing where there was nothing to fix.
        </>
      }
    />
  );
}

// ── The browser holds your place ─────────────────────────

const ARTICLE = [
  'Release notes are read twice: once when they land, and once months later by someone trying to find out when a thing changed.',
  'Write for the second reader. Lead with what changed for them, not with what the team did, and link each change to its issue.',
  'A screenshot earns its place when the change is visual. One per change, cropped to the part that moved, with the old version beside it if the difference is small.',
  'Keep the date in the heading. Readers scanning months of notes look for dates first and titles second.',
  'And say what to do: if a setting moved, name its new home; if a shortcut changed, give the new one.',
];

function Article({ anchored }: { anchored?: boolean }) {
  const pane = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [run, setRun] = useState(0);
  useEffect(() => {
    setLoaded(false);
    // Start mid-article, as if the reader had scrolled; the screenshot above loads late.
    requestAnimationFrame(() => pane.current && (pane.current.scrollTop = 190));
    const t = setTimeout(() => setLoaded(true), 1200);
    return () => clearTimeout(t);
  }, [run]);
  return (
    <Measured onReplay={() => setRun((n) => n + 1)}>
      <div ref={pane} className={cx(s.anchorPane, !anchored && m.noAnchor)} tabIndex={0} role="region" aria-label="Release notes">
        <p>{ARTICLE[0]}</p>
        <p>{ARTICLE[1]}</p>
        <div className={s.anchorImage} style={{ height: loaded ? 120 : 0 }} aria-hidden />
        {ARTICLE.slice(2).map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
    </Measured>
  );
}

export function ShiftAnchor() {
  return (
    <Compare
      height={0}
      before={<Article />}
      after={<Article anchored />}
      beforeNote={
        <>
          With <code>overflow-anchor: none</code>, a screenshot that loads above the line being read pushes the line out of the window.
          Ads and images loading late are why the browser learned to stop this.
        </>
      }
      afterNote={
        <>
          The default. The browser picks a line on screen as its{' '}
          <a href="https://developer.chrome.com/blog/scroll-anchoring">anchor</a> and scrolls by exactly what grew above it, so nothing
          seems to move. Every engine does it only since 2026 (
          <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>); it works as long as nothing turns it off.
        </>
      }
    />
  );
}

// ── The font that arrives late ───────────────────────────

const PARAGRAPH = 'Every change to a shared file is kept for thirty days. Restore any version from the history panel, or copy it into a new file.';

function FontSwap({ matched }: { matched?: boolean }) {
  const [swapped, setSwapped] = useState(false);
  const [run, setRun] = useState(0);
  useEffect(() => {
    setSwapped(false);
    const t = setTimeout(() => setSwapped(true), 1200);
    return () => clearTimeout(t);
  }, [run]);
  return (
    <Measured status={swapped ? 'Geist' : 'Fallback'} onReplay={() => setRun((n) => n + 1)}>
      <div className={s.fontCard}>
        <p className={cx(s.fontPara, swapped ? s.fontWeb : matched ? s.fontMatched : s.fontPlain)}>{PARAGRAPH}</p>
        <Button size="sm">Open history</Button>
      </div>
    </Measured>
  );
}

export function ShiftFont() {
  return (
    <Compare
      height={0}
      before={<FontSwap />}
      after={<FontSwap matched />}
      beforeNote="Until the web font arrives, the text is set in Arial, about 2.5% narrower than Geist. When Geist swaps in, the lines break in new places, and everything under the paragraph moves."
      afterNote={
        <>
          The fallback is Arial scaled with <code>size-adjust</code> to Geist’s width, so the swap changes the letters, not the lines (
          <a href="https://web.dev/articles/css-size-adjust">web.dev</a>). Next.js builds such a fallback by default for the fonts it loads (
          <a href="https://nextjs.org/docs/app/api-reference/components/font">adjustFontFallback</a>).
        </>
      }
    />
  );
}

/** The inbox with its pill, held still. */
export function ShiftPreview() {
  return (
    <div className={cx(s.inbox, s.shiftStill)} aria-hidden>
      <span className={s.inboxPill} data-still="">
        2 new messages
      </span>
      {MAIL.slice(0, 4).map(([from, subject, time]) => (
        <div key={subject} className={s.inboxRow}>
          <span className={s.inboxFrom}>{from}</span>
          <span className={s.inboxSubject}>{subject}</span>
          <span className={s.inboxTime}>{time}</span>
        </div>
      ))}
    </div>
  );
}
