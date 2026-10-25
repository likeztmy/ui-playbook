import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronLeft,
  Inbox,
  LoaderCircle,
  Mail,
  MailOpen,
  Search,
  Send,
  SquarePen,
  Star,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { Dialog } from '../ui/Dialog';
import { TextField } from '../ui/Field';
import { ContextMenu, Menu } from '../ui/Menu';
import { ToastProvider, useToast } from '../ui/Toast';
import { Tip, TipGroup } from '../ui/Tooltip';
import { cx } from '../ui/cx';
import { Compare } from './shell';
import s from './mail.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

// ── Data ─────────────────────────────────────────────────

type Folder = 'inbox' | 'starred' | 'sent' | 'archive';

type Msg = {
  id: string;
  folder: Exclude<Folder, 'starred'>;
  from: string;
  subject: string;
  snippet: string;
  body: string[];
  time: string;
  unread?: boolean;
  starred?: boolean;
  /** Its attachment preview takes a while to load. */
  slow?: boolean;
};

const MAIL: Msg[] = [
  {
    id: 'roadmap',
    folder: 'inbox',
    from: 'Mira Okafor',
    subject: 'Q4 roadmap: final draft',
    snippet: 'Attached the version we agreed on Thursday. Two open questions at the end.',
    body: [
      'Hi all,',
      'Attached the version we agreed on Thursday. I moved search to January and kept the offline work in Q4.',
      'Two open questions at the end: who owns the migration, and do we ship the beta to everyone or behind a flag?',
      'Mira',
    ],
    time: '9:41',
    unread: true,
  },
  {
    id: 'lisbon',
    folder: 'inbox',
    from: 'Atlas Travel',
    subject: 'Your trip to Lisbon is confirmed',
    snippet: 'Booking ref K7Q2. Check-in opens 24 hours before departure.',
    body: ['Your booking is confirmed.', 'Booking ref K7Q2 · Thu 14 Nov, 07:25 → 10:05.', 'Check-in opens 24 hours before departure.'],
    time: '8:15',
    unread: true,
  },
  {
    id: 'invoice',
    folder: 'inbox',
    from: 'Northwind Billing',
    subject: 'Invoice #2041 is ready',
    snippet: 'Your October invoice is available. Amount due: $48.00.',
    body: ['Your October invoice is available.', 'Team plan, 4 seats · $48.00', 'It will be charged to the card ending 4242 on 1 November.'],
    time: 'Yesterday',
    slow: true,
  },
  {
    id: 'lunch',
    folder: 'inbox',
    from: 'Daniel Brooks',
    subject: 'Lunch Friday?',
    snippet: 'There’s a new ramen place by the office. 12:30?',
    body: ['There’s a new ramen place by the office. 12:30?', 'D'],
    time: 'Yesterday',
  },
  {
    id: 'review',
    folder: 'inbox',
    from: 'Priya Natarajan',
    subject: 'Design review notes',
    snippet: 'Mostly small things. The empty state needs a next step, and the table numbers should line up.',
    body: [
      'Mostly small things.',
      'The empty state needs a next step, and the table numbers should line up on the right.',
      'Happy to pair on it tomorrow.',
    ],
    time: 'Mon',
    starred: true,
  },
  {
    id: 'notes',
    folder: 'inbox',
    from: 'Field Notes',
    subject: 'This week: the case for slower software',
    snippet: 'Three essays on doing less, and one on doing it well.',
    body: ['Three essays on doing less, and one on doing it well.', 'Read time: 12 minutes.'],
    time: 'Mon',
  },
  {
    id: 'offsite',
    folder: 'inbox',
    from: 'Sam Lee',
    subject: 'Photos from the offsite',
    snippet: 'Shared album is up. 148 photos, mostly of the lake.',
    body: ['Shared album is up. 148 photos, mostly of the lake.', 'Sam'],
    time: 'Sun',
  },
  {
    id: 'oncall',
    folder: 'archive',
    from: 'Ops Calendar',
    subject: 'Reminder: on-call handover',
    snippet: 'Handover is Monday at 10:00. Bring the open incidents.',
    body: ['Handover is Monday at 10:00. Bring the open incidents.'],
    time: 'Sat',
  },
  {
    id: 'welcome',
    folder: 'archive',
    from: 'Post',
    subject: 'Welcome to Post',
    snippet: 'Archive what’s done. Everything stays searchable.',
    body: ['Archive what’s done. Everything stays searchable.'],
    time: 'Oct 2',
  },
  {
    id: 'sent-1',
    folder: 'sent',
    from: 'To: Daniel Brooks',
    subject: 'Re: Lunch Friday?',
    snippet: 'Yes! 12:30 works.',
    body: ['Yes! 12:30 works.'],
    time: 'Yesterday',
  },
];

/** The message that arrives when new mail is played. */
const INCOMING = {
  folder: 'inbox',
  from: 'Mira Okafor',
  subject: 'Re: Q4 roadmap: final draft',
  snippet: 'One more thing: can you check slide 12 before the meeting?',
  body: ['One more thing: can you check slide 12 before the meeting?', 'M'],
  time: 'Now',
  unread: true,
} satisfies Omit<Msg, 'id'>;

const FOLDERS: { id: Folder; label: string; icon: LucideIcon }[] = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'archive', label: 'Archive', icon: Archive },
];

const inFolder = (m: Msg, f: Folder) => (f === 'starred' ? !!m.starred : m.folder === f);
const label = (f: Folder) => FOLDERS.find((x) => x.id === f)!.label;

// ── Small parts ──────────────────────────────────────────

/** Marks every match of `q` in `text`. */
function Marked({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'));
  return <>{parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</>;
}

/** spin-delay: nothing for 300 ms, then a spinner that stays at least 500 ms. */
function useSlowLoad(key: string, slow: boolean) {
  const [state, setState] = useState<'ready' | 'waiting' | 'spinning'>(slow ? 'waiting' : 'ready');
  useEffect(() => {
    if (!slow) {
      setState('ready');
      return;
    }
    setState('waiting');
    let shownAt = 0;
    let done: ReturnType<typeof setTimeout>;
    const show = setTimeout(() => {
      shownAt = performance.now();
      setState('spinning');
    }, 300);
    const arrive = setTimeout(() => {
      clearTimeout(show);
      const wait = shownAt ? Math.max(0, shownAt + 500 - performance.now()) : 0;
      done = setTimeout(() => setState('ready'), wait);
    }, 1200);
    return () => [show, arrive, done].forEach(clearTimeout);
  }, [key, slow]);
  return state;
}

// ── The app ──────────────────────────────────────────────

type Api = ReturnType<typeof useMail>;

function useMail() {
  // The first message starts open, so it starts read.
  const [mail, setMail] = useState(() => MAIL.map((m) => (m.id === 'roadmap' ? { ...m, unread: false } : m)));
  const [folder, setFolder] = useState<Folder>('inbox');
  const [selected, setSelected] = useState<string | null>('roadmap');
  const [query, setQuery] = useState('');
  const [everywhere, setEverywhere] = useState(false);
  const [pending, setPending] = useState<Msg[]>([]);
  const [reading, setReading] = useState(false);
  const arrivals = useRef(0);
  const toast = useToast();

  const q = query.trim().toLowerCase();
  const list = useMemo(
    () =>
      mail.filter((m) =>
        q
          ? (everywhere || inFolder(m, folder)) && [m.from, m.subject, m.snippet].some((t) => t.toLowerCase().includes(q))
          : inFolder(m, folder),
      ),
    [mail, folder, q, everywhere],
  );
  const current = mail.find((m) => m.id === selected && list.includes(m)) ?? null;

  const patch = (id: string, change: Partial<Msg>) => setMail((all) => all.map((m) => (m.id === id ? { ...m, ...change } : m)));

  const open = (id: string) => {
    setSelected(id);
    patch(id, { unread: false });
    setReading(true);
  };

  const step = (by: number) => {
    const i = list.findIndex((m) => m.id === selected);
    const next = list[Math.min(list.length - 1, Math.max(0, i + by))];
    if (next) open(next.id);
  };

  const archive = (id: string) => {
    const i = list.findIndex((m) => m.id === id);
    const msg = mail.find((m) => m.id === id);
    if (!msg || msg.folder !== 'inbox') return;
    // The next message opens, as Gmail does; the last one falls back to the one above.
    const next = list.filter((m) => m.id !== id)[Math.min(i, list.length - 2)];
    patch(id, { folder: 'archive' });
    setSelected(next?.id ?? null);
    if (next) patch(next.id, { unread: false });
    else setReading(false);
    toast({
      title: 'Archived',
      action: {
        label: 'Undo',
        onClick: () => {
          patch(id, { folder: 'inbox' });
          setSelected(id);
        },
      },
    });
  };

  const star = (id: string) => setMail((all) => all.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
  const markUnread = (id: string) => patch(id, { unread: true });

  const arrive = () => setPending((p) => [...p, { ...INCOMING, id: `new-${++arrivals.current}` }]);
  const showPending = () => {
    setMail((all) => [...pending, ...all]);
    setPending([]);
  };

  const go = (f: Folder) => {
    setFolder(f);
    setQuery('');
    setEverywhere(false);
    const first = mail.find((m) => inFolder(m, f));
    setSelected(first?.id ?? null);
    setReading(false);
  };

  const send = (to: string, subject: string, body: string) => {
    const id = `sent-${Date.now()}`;
    setMail((all) => [
      { id, folder: 'sent', from: `To: ${to || 'nobody'}`, subject: subject || '(no subject)', snippet: body, body: [body], time: 'Now' },
      ...all,
    ]);
    toast({ title: 'Message sent', action: { label: 'Undo', onClick: () => setMail((all) => all.filter((m) => m.id !== id)) } });
  };

  return {
    mail,
    list,
    current,
    folder,
    query,
    setQuery: (v: string) => {
      setQuery(v);
      setEverywhere(false);
    },
    everywhere,
    searchEverywhere: () => setEverywhere(true),
    pending,
    reading,
    setReading,
    open,
    step,
    archive,
    star,
    markUnread,
    arrive,
    showPending,
    go,
    send,
    unread: mail.filter((m) => m.folder === 'inbox' && m.unread).length + pending.length,
  };
}

function Compose({ onSend, iconOnly }: { onSend: Api['send']; iconOnly?: boolean }) {
  const [open, setOpen] = useState(false);
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const trigger = iconOnly ? (
    <Button variant="ghost" icon aria-label="Compose" data-spot="colour" />
  ) : (
    <Button variant="primary" className={s.compose} data-spot="colour" />
  );
  return (
    <Dialog.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) [setTo, setSubject, setBody].forEach((f) => f(''));
      }}
    >
      <Dialog.Trigger render={trigger}>
        <SquarePen {...ic} />
        {!iconOnly && 'Compose'}
      </Dialog.Trigger>
      <Dialog.Popup
        title="New message"
        actions={
          <>
            <Dialog.Close render={<Button />}>Discard</Dialog.Close>
            <Button
              variant="primary"
              onClick={() => {
                onSend(to, subject, body);
                setOpen(false);
              }}
            >
              Send
            </Button>
          </>
        }
      >
        <TextField label="To" value={to} onValueChange={setTo} />
        <TextField label="Subject" value={subject} onValueChange={setSubject} />
        <TextField label="Message" multiline value={body} onValueChange={setBody} />
      </Dialog.Popup>
    </Dialog.Root>
  );
}

function Row({ m, api, pinned, rowRef }: { m: Msg; api: Api; pinned: boolean; rowRef: (el: HTMLButtonElement | null) => void }) {
  const q = api.query.trim();
  const selected = api.current?.id === m.id;
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        render={
          <div
            className={s.row}
            data-selected={selected ? '' : undefined}
            data-unread={m.unread ? '' : undefined}
            data-pin={pinned ? 'hover' : undefined}
            data-row={m.id}
          />
        }
      >
        <button type="button" ref={rowRef} className={s.rowMain} aria-current={selected || undefined} onClick={() => api.open(m.id)}>
          <span className={s.rowTop}>
            <span className={s.dot} data-spot={m.unread ? 'colour' : undefined} aria-label={m.unread ? 'Unread' : undefined} />
            <span className={s.from}>
              <Marked text={m.from} q={q} />
            </span>
            <span className={s.time}>{m.time}</span>
          </span>
          <span className={s.subject}>
            <Marked text={m.subject} q={q} />
          </span>
          <span className={s.snippet}>
            <Marked text={m.snippet} q={q} />
          </span>
        </button>
        {/* In the time's place: the row never grows or reflows when they appear. */}
        <span className={s.rowActions}>
          {m.folder === 'inbox' && (
            <Tip label="Archive" keys={['E']}>
              <Button variant="ghost" size="sm" icon aria-label="Archive" onClick={() => api.archive(m.id)}>
                <Archive {...ic} />
              </Button>
            </Tip>
          )}
          <Tip label={m.starred ? 'Unstar' : 'Star'} keys={['S']}>
            <Button variant="ghost" size="sm" icon aria-label={m.starred ? 'Unstar' : 'Star'} onClick={() => api.star(m.id)}>
              <Star {...ic} className={s.star} data-on={m.starred ? '' : undefined} />
            </Button>
          </Tip>
        </span>
        {m.starred && <Star {...ic} className={cx(s.star, s.rowStar)} data-on="" />}
      </ContextMenu.Trigger>
      {/* A context menu carries no shortcuts; the toolbar's tooltips do. */}
      <ContextMenu.Popup>
        {m.folder === 'inbox' && (
          <Menu.Item icon={Archive} onClick={() => api.archive(m.id)}>
            Archive
          </Menu.Item>
        )}
        <Menu.Item icon={Star} onClick={() => api.star(m.id)}>
          {m.starred ? 'Unstar' : 'Star'}
        </Menu.Item>
        {m.unread ? (
          <Menu.Item icon={MailOpen} onClick={() => api.open(m.id)}>
            Open
          </Menu.Item>
        ) : (
          <Menu.Item icon={Mail} onClick={() => api.markUnread(m.id)}>
            Mark as unread
          </Menu.Item>
        )}
      </ContextMenu.Popup>
    </ContextMenu.Root>
  );
}

function List({ api, pinned, rows }: { api: Api; pinned: string | null; rows: RefObject<Map<string, HTMLButtonElement>> }) {
  const scroller = useRef<HTMLDivElement>(null);
  const q = api.query.trim();
  const where = api.everywhere ? 'All mail' : label(api.folder);
  return (
    <section className={s.list} aria-label="Messages">
      <header className={s.listHead}>
        <Menu.Root>
          <Menu.Trigger render={<Button variant="ghost" size="sm" className={s.folderMenu} />}>
            {label(api.folder)}
            <ChevronDown {...ic} />
          </Menu.Trigger>
          <Menu.Popup>
            {FOLDERS.map((f) => (
              <Menu.Item key={f.id} icon={f.icon} onClick={() => api.go(f.id)}>
                {f.label}
              </Menu.Item>
            ))}
          </Menu.Popup>
        </Menu.Root>
        <label className={s.search} data-spot="search">
          <Search {...ic} />
          <input
            value={api.query}
            placeholder={`Search ${label(api.folder)}`}
            aria-label="Search mail"
            onChange={(e) => api.setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') api.setQuery('');
              e.stopPropagation();
            }}
          />
          {api.query && (
            <Button variant="ghost" size="sm" icon aria-label="Clear search" className={s.clear} onClick={() => api.setQuery('')}>
              <X {...ic} />
            </Button>
          )}
        </label>
        <span className={s.phoneOnly}>
          <Compose onSend={api.send} iconOnly />
        </span>
      </header>
      {/* Floats over the list: the rows under the pointer stay where they are. */}
      {api.pending.length > 0 && api.folder === 'inbox' && !q && (
        <button
          type="button"
          className={s.pill}
          data-spot="arrive"
          onClick={() => {
            api.showPending();
            scroller.current?.scrollTo({ top: 0 });
          }}
        >
          {api.pending.length === 1 ? '1 new message' : `${api.pending.length} new messages`}
        </button>
      )}
      <div ref={scroller} className={s.rows}>
        {api.list.map((m) => (
          <Row
            key={m.id}
            m={m}
            api={api}
            pinned={pinned === m.id}
            rowRef={(el) => {
              if (el) rows.current.set(m.id, el);
              else rows.current.delete(m.id);
            }}
          />
        ))}
        {api.list.length === 0 &&
          (q ? (
            <div className={s.empty} data-spot="search">
              <p>
                No messages match “{q}” in {where}.
              </p>
              {!api.everywhere && (
                <Button size="sm" onClick={api.searchEverywhere}>
                  Search all mail
                </Button>
              )}
            </div>
          ) : (
            <div className={s.empty}>
              <p>{api.folder === 'inbox' ? 'You’re all caught up.' : `Nothing in ${label(api.folder)}.`}</p>
              {api.folder === 'inbox' && (
                <Button size="sm" onClick={() => api.go('archive')}>
                  Open Archive
                </Button>
              )}
            </div>
          ))}
      </div>
    </section>
  );
}

function Reader({ api }: { api: Api }) {
  const m = api.current;
  const load = useSlowLoad(m?.id ?? '', !!m?.slow);
  if (!m) {
    return (
      <section className={s.reader} aria-label="Message">
        <div className={s.empty}>
          <p>Select a message to read it.</p>
        </div>
      </section>
    );
  }
  return (
    <section className={s.reader} aria-label="Message">
      <TipGroup>
        <header className={s.toolbar}>
          <Button variant="ghost" size="sm" className={cx(s.back, s.phoneOnly)} onClick={() => api.setReading(false)}>
            <ChevronLeft {...ic} />
            {label(api.folder)}
          </Button>
          <span className={s.tools}>
            {m.folder === 'inbox' ? (
              <Tip label="Archive" keys={['E']} side="bottom">
                <Button variant="ghost" icon aria-label="Archive" data-spot="archive" onClick={() => api.archive(m.id)}>
                  <Archive {...ic} />
                </Button>
              </Tip>
            ) : (
              m.folder === 'archive' && (
                <Tip label="Move to Inbox" side="bottom">
                  <Button variant="ghost" icon aria-label="Move to Inbox" onClick={() => api.go('inbox')}>
                    <ArchiveRestore {...ic} />
                  </Button>
                </Tip>
              )
            )}
            <Tip label={m.starred ? 'Unstar' : 'Star'} keys={['S']} side="bottom">
              <Button variant="ghost" icon aria-label={m.starred ? 'Unstar' : 'Star'} data-spot="star" onClick={() => api.star(m.id)}>
                <Star {...ic} className={s.star} data-on={m.starred ? '' : undefined} />
              </Button>
            </Tip>
            <Tip label="Mark as unread" side="bottom">
              <Button variant="ghost" icon aria-label="Mark as unread" onClick={() => api.markUnread(m.id)}>
                <Mail {...ic} />
              </Button>
            </Tip>
          </span>
        </header>
        <article className={s.message}>
          <h3 className={s.messageSubject}>{m.subject}</h3>
          <p className={s.messageFrom}>
            <span className={s.avatar} aria-hidden>
              {m.from.replace('To: ', '')[0]}
            </span>
            <span>{m.from}</span>
            <span className={s.messageTime}>{m.time}</span>
          </p>
          {m.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {m.slow && (
            <div className={s.attachment} data-spot="slow">
              {load === 'ready' ? (
                <>
                  <span className={s.attachmentName}>Invoice-2041.pdf</span>
                  <span className={s.attachmentMeta}>1 page · 84 KB</span>
                </>
              ) : (
                load === 'spinning' && <LoaderCircle {...ic} className={s.spin} aria-label="Loading attachment" />
              )}
            </div>
          )}
        </article>
      </TipGroup>
    </section>
  );
}

function Sidebar({ api }: { api: Api }) {
  return (
    <nav className={s.sidebar} aria-label="Folders">
      <Compose onSend={api.send} />
      {FOLDERS.map((f) => (
        <button
          key={f.id}
          type="button"
          className={s.folder}
          aria-current={api.folder === f.id || undefined}
          onClick={() => api.go(f.id)}
        >
          <f.icon {...ic} />
          <span>{f.label}</span>
          {f.id === 'inbox' && api.unread > 0 && <span className={s.count}>{api.unread}</span>}
        </button>
      ))}
    </nav>
  );
}

type Spot = 'archive' | 'hover' | 'context' | 'arrive' | 'slow' | 'star' | 'search' | 'colour';

/** Each decision: what it is, where it's explained, and how to play it in the app. */
const DECISIONS: { spot: Spot; text: ReactNode }[] = [
  {
    spot: 'archive',
    text: (
      <>
        Archive acts at once and the toast offers Undo; nothing asks first. <a href="/components/toast">Toast: Undo instead of asking</a>
      </>
    ),
  },
  {
    spot: 'hover',
    text: (
      <>
        Row actions appear on hover in the time’s place, so the row never changes size.{' '}
        <a href="/principles/hover-forgives">Hover forgives: actions that appear on hover</a>
      </>
    ),
  },
  {
    spot: 'context',
    text: (
      <>
        Right-click a row for its actions. The menu carries no shortcuts; the toolbar’s tooltips do (E, S).{' '}
        <a href="/components/menu">Menu: a context menu carries no shortcuts</a>
      </>
    ),
  },
  {
    spot: 'arrive',
    text: (
      <>
        New mail waits behind “1 new message” instead of pushing the list down under the pointer.{' '}
        <a href="/principles/nothing-shifts">Nothing shifts</a>
      </>
    ),
  },
  {
    spot: 'slow',
    text: (
      <>
        A slow attachment shows nothing for 300 ms, then a spinner that stays at least 500 ms.{' '}
        <a href="/principles/how-waiting-feels">How waiting feels</a>
      </>
    ),
  },
  {
    spot: 'star',
    text: (
      <>
        Star fills the moment you press it; the server can catch up. <a href="/principles/how-waiting-feels">How waiting feels: don’t wait at all</a>
      </>
    ),
  },
  {
    spot: 'search',
    text: (
      <>
        A search with no results says what was searched, where, and offers All mail.{' '}
        <a href="/components/combobox">Combobox: an empty list says what was searched</a>
      </>
    ),
  },
  {
    spot: 'colour',
    text: (
      <>
        Unread is bold and a dot; blue is kept for the one primary action, Compose.{' '}
        <a href="/principles/colour-means-one-thing">Colour means one thing</a>
      </>
    ),
  },
];

function App({ onRoot }: { onRoot: (el: HTMLDivElement | null) => void }) {
  const api = useMail();
  const root = useRef<HTMLDivElement | null>(null);
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const [spot, setSpot] = useState<Spot | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Focus follows the selection when the keyboard moved it.
  const keyed = useRef(false);
  useEffect(() => {
    if (keyed.current && api.current) rows.current.get(api.current.id)?.focus();
    keyed.current = false;
  }, [api.current]);

  const keys = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, [role="dialog"]')) return;
    const id = api.current?.id;
    const act: Record<string, () => void> = {
      j: () => api.step(1),
      k: () => api.step(-1),
      e: () => id && api.archive(id),
      s: () => id && api.star(id),
      u: () => api.setReading(false),
    };
    if (!act[e.key]) return;
    e.preventDefault();
    keyed.current = true;
    act[e.key]();
  };

  const play = (which: Spot) => {
    clearTimeout(timer.current);
    root.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    setSpot(which);
    setPinned(null);
    timer.current = setTimeout(() => {
      setSpot(null);
      setPinned(null);
    }, 2400);
    const inbox = () => {
      if (api.folder !== 'inbox' || api.query) api.go('inbox');
    };
    if (which === 'archive') {
      inbox();
      const first = api.mail.find((m) => m.folder === 'inbox');
      if (first) {
        api.open(first.id);
        setTimeout(() => api.archive(first.id), 500);
      }
    } else if (which === 'hover') {
      inbox();
      setPinned(api.mail.filter((m) => m.folder === 'inbox')[1]?.id ?? null);
    } else if (which === 'context') {
      inbox();
      // After the folder switch has rendered, right-click the third row.
      setTimeout(() => {
        const row = root.current?.querySelectorAll<HTMLElement>('[data-row]')[2];
        const r = row?.getBoundingClientRect();
        if (row && r) row.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: r.left + 80, clientY: r.top + 30 }));
      }, 50);
    } else if (which === 'arrive') {
      inbox();
      api.arrive();
    } else if (which === 'slow') {
      inbox();
      api.open('invoice');
    } else if (which === 'star') {
      if (api.current) api.star(api.current.id);
    } else if (which === 'search') {
      api.setQuery('refund');
    }
  };

  return (
    <>
      <div
        ref={(el) => {
          root.current = el;
          onRoot(el);
        }}
        className={s.app} data-spot={spot ?? undefined} data-reading={api.reading ? '' : undefined} onKeyDown={keys}>
        <Sidebar api={api} />
        <div className={s.panes}>
          <List api={api} pinned={pinned} rows={rows} />
          <Reader api={api} />
        </div>
      </div>
      <ol className={s.decisions}>
        {DECISIONS.map((d, i) => (
          <li key={d.spot} className={s.decision} data-active={spot === d.spot ? '' : undefined}>
            <span className={s.decisionNo}>{i + 1}</span>
            <span className={s.decisionText}>{d.text}</span>
            <Button size="sm" onClick={() => play(d.spot)}>
              Show
            </Button>
          </li>
        ))}
      </ol>
    </>
  );
}

/** The mail app with its decisions. Toasts rise inside the app. */
export function MailExample() {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={s.example}>
      <ToastProvider container={container} contained>
        <App onRoot={setContainer} />
      </ToastProvider>
    </div>
  );
}

/** The inbox, held still. */
export function MailPreview() {
  return (
    <div className={s.preview} aria-hidden>
      {MAIL.slice(0, 3).map((m) => (
        <div key={m.id} className={s.previewRow} data-unread={m.unread ? '' : undefined}>
          <span className={s.dot} />
          <span className={s.from}>{m.from}</span>
          <span className={s.time}>{m.time}</span>
          <span className={s.subject}>{m.subject}</span>
        </div>
      ))}
    </div>
  );
}

// ── Before and after ─────────────────────────────────────

const FEW = MAIL.filter((m) => m.folder === 'inbox').slice(1, 5);

/**
 * A short inbox. Mail arrives 1.2 s after the pointer comes in, while you're
 * aiming. `push` puts it straight at the top; otherwise it waits behind a pill.
 */
function Arrivals({ push }: { push?: boolean }) {
  const [list, setList] = useState(FEW);
  const [waiting, setWaiting] = useState(0);
  const [opened, setOpened] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const count = useRef(0);
  const arrive = () => {
    const m = { ...INCOMING, id: `in-${++count.current}` };
    if (push) setList((l) => [m, ...l]);
    else setWaiting((w) => w + 1);
  };
  return (
    <div className={s.mini}>
      <div
        className={s.miniList}
        onPointerEnter={() => (timer.current = setTimeout(arrive, 1200))}
        onPointerLeave={() => clearTimeout(timer.current)}
      >
        {waiting > 0 && (
          <button
            type="button"
            className={s.pill}
            onClick={() => {
              setList((l) => [...Array.from({ length: waiting }, (_, i) => ({ ...INCOMING, id: `w-${count.current}-${i}` })), ...l]);
              setWaiting(0);
            }}
          >
            {waiting === 1 ? '1 new message' : `${waiting} new messages`}
          </button>
        )}
        {list.slice(0, 4).map((m) => (
          <div key={m.id} className={s.row} data-unread={m.unread ? '' : undefined}>
            <button type="button" className={s.rowMain} onClick={() => setOpened(m.subject)}>
              <span className={s.rowTop}>
                <span className={s.dot} />
                <span className={s.from}>{m.from}</span>
                <span className={s.time}>{m.time}</span>
              </span>
              <span className={s.subject}>{m.subject}</span>
            </button>
          </div>
        ))}
      </div>
      <p className={s.miniStatus}>{opened ? `Opened: ${opened}` : 'Open a message'}</p>
    </div>
  );
}

export function MailArrivals() {
  return (
    <Compare
      height={0}
      before={<Arrivals push />}
      after={<Arrivals />}
      beforeNote="Move to a message to open it. A second later new mail lands at the top and every row drops one place: the click meant for one message opens the one above it."
      afterNote="New mail waits behind a pill over the list. Nothing under the pointer moves until you ask for it."
    />
  );
}

/** One row. `inline` adds its hover actions to the line, pushing the time out; otherwise they take the time's place. */
function HoverRow({ inline }: { inline?: boolean }) {
  const m = MAIL[1];
  const actions = (
    <span className={inline ? s.inlineActions : s.rowActions}>
      <Button variant="ghost" size="sm" icon aria-label="Archive">
        <Archive {...ic} />
      </Button>
      <Button variant="ghost" size="sm" icon aria-label="Star">
        <Star {...ic} />
      </Button>
    </span>
  );
  return (
    <div className={cx(s.miniList, s.miniOne)}>
      <div className={cx(s.row, inline && s.rowInline)} data-unread="">
        <div className={s.rowMain}>
          <span className={s.rowTop}>
            <span className={s.dot} />
            <span className={s.from}>{m.from}</span>
            {inline && actions}
            <span className={s.time}>{m.time}</span>
          </span>
          <span className={s.subject}>{m.subject}</span>
          <span className={s.snippet}>{m.snippet}</span>
        </div>
        {!inline && actions}
      </div>
    </div>
  );
}

export function MailHoverActions() {
  return (
    <Compare
      height={0}
      before={<HoverRow inline />}
      after={<HoverRow />}
      beforeNote="The actions join the line when the pointer arrives. The sender’s name is cut short and the row grows taller, every time the pointer passes over it."
      afterNote="The actions take the time’s place, in the same box, so the row keeps its shape whether the pointer is on it or not."
    />
  );
}
