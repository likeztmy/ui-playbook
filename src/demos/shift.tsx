import { RotateCcw } from 'lucide-react';
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
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

const RECENT = ['Buttons', 'Colour tokens', 'Dialogs', 'Menus', 'Spacing', 'Typography'];
const INDEX = [
  ...RECENT,
  'Badges', 'Breadcrumbs', 'Cards', 'Checkboxes', 'Colour contrast', 'Combobox', 'Dark mode', 'Data tables', 'Date picker',
  'Drag and drop', 'Empty states', 'Error messages', 'Focus rings', 'Forms', 'Icons', 'Inputs', 'Keyboard shortcuts',
  'Loading states', 'Motion', 'Navigation', 'Notifications', 'Pagination', 'Popovers', 'Radio buttons', 'Search', 'Select',
  'Sliders', 'Switches', 'Tabs', 'Toasts', 'Toolbars', 'Tooltips', 'Undo',
];
const RECENT_MAX = 4;
const PAGES_MAX = 3;

const matches = (title: string, q: string) => title.toLowerCase().includes(q.trim().toLowerCase());

/** The server's ranking: titles that start with the query, then words that do, then the rest; A–Z within each. */
function rank(q: string) {
  const v = q.trim().toLowerCase();
  const tier = (t: string) => (t.toLowerCase().startsWith(v) ? 0 : t.toLowerCase().split(' ').some((w) => w.startsWith(v)) ? 1 : 2);
  return INDEX.filter((t) => matches(t, v)).sort((a, b) => tier(a) - tier(b) || a.localeCompare(b));
}

type Group = { name: string; titles: string[] };

/**
 * Docs search. Recent pages that match show at once; the best pages from
 * the whole index arrive 700ms after the last key, as a group of their own.
 * `keep` puts that group after the rows already shown instead of above them.
 */
export function DocSearch({ keep }: { keep?: boolean }) {
  const [q, setQ] = useState('');
  const [groups, setGroups] = useState<Group[]>([{ name: 'Recent', titles: RECENT.slice(0, RECENT_MAX) }]);
  const [active, setActive] = useState(0);
  const [opened, setOpened] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const id = useId();
  useEffect(() => () => clearTimeout(timer.current), []);
  const rows = groups.flatMap((g) => g.titles);

  const type = (v: string) => {
    setQ(v);
    setOpened(null);
    const recent = (v.trim() ? RECENT.filter((t) => matches(t, v)) : RECENT).slice(0, RECENT_MAX);
    const shown: Group = { name: 'Recent', titles: recent };
    setGroups(recent.length ? [shown] : []);
    setActive(0);
    clearTimeout(timer.current);
    if (!v.trim()) return;
    timer.current = setTimeout(() => {
      const pages: Group = { name: 'Pages', titles: rank(v).filter((t) => !recent.includes(t)).slice(0, PAGES_MAX) };
      if (!pages.titles.length) return;
      setGroups(recent.length ? (keep ? [shown, pages] : [pages, shown]) : [pages]);
    }, 700);
  };
  const open = (title: string) => setOpened(title);
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const d = e.key === 'ArrowDown' ? 1 : -1;
      setActive((i) => (i + d + rows.length) % Math.max(rows.length, 1));
    } else if (e.key === 'Enter' && rows[active]) {
      open(rows[active]);
    }
  };

  let i = -1;
  return (
    <Measured status={opened && `Opened “${opened}”`}>
      <div className={s.docSearch}>
        <input
          className={s.docSearchInput}
          role="combobox"
          aria-label="Search docs"
          aria-expanded
          aria-controls={`${id}-list`}
          aria-activedescendant={rows[active] ? `${id}-${active}` : undefined}
          placeholder="Search docs"
          value={q}
          onChange={(e) => type(e.target.value)}
          onKeyDown={onKey}
        />
        <div className={s.docSearchList} role="listbox" id={`${id}-list`} aria-label="Pages">
          {groups.map((g) => (
            <div key={g.name} role="group" aria-labelledby={`${id}-${g.name}`} className={s.docSearchGroup}>
              <div id={`${id}-${g.name}`} className={s.docSearchHead}>
                {g.name}
              </div>
              {g.titles.map((title) => {
                const n = ++i;
                return (
                  <div
                    key={title}
                    id={`${id}-${n}`}
                    role="option"
                    aria-selected={n === active}
                    className={s.docSearchRow}
                    onMouseMove={() => setActive(n)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => open(title)}
                  >
                    {title}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Measured>
  );
}

export function ShiftSearch() {
  return (
    <Compare
      height={0}
      before={<DocSearch />}
      after={<DocSearch keep />}
      beforeNote={
        <>
          The best pages from the whole index land 0.7 seconds after the last key, as a group above the recent ones. By then the pointer
          is on its way to a recent page, and the row it reaches, or the one Enter would open, is something else. A shift that late no
          longer answers the key, and <a href="https://web.dev/articles/cls">CLS</a> counts it.
        </>
      }
      afterNote="The same group, after the rows already on screen. What the reader was aiming at stays where it was; the better matches are one glance further down, and the next key can rank them first."
    />
  );
}

// ── Bold that pushes ─────────────────────────────────────

const NAV = ['Overview', 'Issues', 'Pull requests', 'Releases', 'Settings'];

export function BoldNav({ reserve }: { reserve?: boolean }) {
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

type Line = readonly [who: string, text: string];

const THREAD: Line[] = [
  ['Priya', 'Draft is up. Comments welcome.'],
  ['Kenji', 'Left a few on the welcome screen.'],
  ['Ana', 'Most of them taken. One question back to you.'],
  ['Kenji', 'Answered.'],
  ['Ana', 'Pushed the new onboarding copy.'],
  ['Kenji', 'Reading it now.'],
  ['Kenji', 'Step two still says “workspace”; we call it a team everywhere else.'],
  ['Ana', 'Good catch. Fixed.'],
  ['Priya', 'Can we drop the third screen? Nobody reads it.'],
  ['Ana', 'Sure, if the invite step moves up.'],
  ['Kenji', 'Moved. Screenshots in the doc.'],
  ['Priya', 'Looks right. Ship it Thursday?'],
  ['Ana', 'Thursday.'],
];

const EARLIER: Line[] = [
  ['Priya', 'Kickoff notes are in the doc.'],
  ['Ana', 'I’ll take the copy.'],
  ['Kenji', 'I’ll take the screenshots.'],
  ['Priya', 'First draft by Monday?'],
  ['Ana', 'Monday works.'],
];

/** A chat thread, opened at its latest message; earlier ones load when the reader nears the top. */
function ThreadPane({ anchored }: { anchored?: boolean }) {
  const pane = useRef<HTMLDivElement>(null);
  const [earlier, setEarlier] = useState(false);
  const loading = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useLayoutEffect(() => {
    pane.current!.scrollTop = pane.current!.scrollHeight;
    return () => clearTimeout(timer.current);
  }, []);
  // Load a screen before the top, as threads do: at offset zero the browser has no anchor to keep.
  const onScroll = () => {
    const el = pane.current!;
    if (earlier || loading.current || el.scrollTop > el.clientHeight) return;
    loading.current = true;
    timer.current = setTimeout(() => setEarlier(true), 150);
  };
  const lines = earlier ? [...EARLIER, ...THREAD] : THREAD;
  return (
    <div ref={pane} className={cx(s.threadPane, !anchored && m.noAnchor)} onScroll={onScroll} tabIndex={0} role="log" aria-label="Onboarding thread">
      <div className={s.threadTop}>{earlier ? 'Start of the thread' : 'Loading earlier messages…'}</div>
      {lines.map(([who, text]) => (
        <div key={text} className={s.threadLine}>
          <span className={s.threadWho}>{who}</span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}

function Thread({ anchored }: { anchored?: boolean }) {
  const [run, setRun] = useState(0);
  return (
    <Measured onReplay={() => setRun((n) => n + 1)}>
      <ThreadPane key={run} anchored={anchored} />
    </Measured>
  );
}

export function ShiftAnchor() {
  return (
    <Compare
      height={0}
      before={<Thread />}
      after={<Thread anchored />}
      beforeNote={
        <>
          With <code>overflow-anchor: none</code>, the earlier messages load in above the one being read and push it down out of the
          window: the reader lands back at the kickoff and has to find their place again.
        </>
      }
      afterNote={
        <>
          The default. The browser picks a message on screen as its{' '}
          <a href="https://drafts.csswg.org/css-scroll-anchoring/">anchor</a> and scrolls by exactly what was added above it. It can’t at
          the very top, where there is nothing above to keep, so the thread loads a little before the reader gets there. Every engine
          anchors only since 2026 (<a href="https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-anchor">MDN</a>).
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

/** The search with its groups, held still. */
export function ShiftPreview() {
  const group = (name: string, titles: string[], first?: boolean) => (
    <div className={s.docSearchGroup}>
      <div className={s.docSearchHead}>{name}</div>
      {titles.map((t, i) => (
        <div key={t} className={s.docSearchRow} aria-selected={first && i === 0}>
          {t}
        </div>
      ))}
    </div>
  );
  return (
    <div className={cx(s.docSearch, s.shiftStill)} aria-hidden>
      <span className={s.docSearchInput}>b</span>
      <div className={s.docSearchList}>
        {group('Recent', ['Buttons'], true)}
        {group('Pages', ['Badges', 'Breadcrumbs', 'Radio buttons'])}
      </div>
    </div>
  );
}
