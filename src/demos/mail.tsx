import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronLeft,
  FileText,
  Forward,
  Inbox,
  LoaderCircle,
  Mail,
  MailOpen,
  Reply,
  Search,
  Send,
  SquarePen,
  Star,
  Trash2,
  X,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type RefObject, type ReactNode } from 'react';
import { Button } from '../ui/Button';
import { ContextMenu, Menu } from '../ui/Menu';
import { ToastProvider, useToast } from '../ui/Toast';
import { Tip, TipGroup } from '../ui/Tooltip';
import { cx } from '../ui/cx';
import { Compare } from './shell';
import s from './mail.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

// ── Data ─────────────────────────────────────────────────

export type Folder = 'inbox' | 'starred' | 'sent' | 'archive';

export type Msg = {
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

export const MAIL: Msg[] = [
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
    body: ['Your booking is confirmed.', 'Booking ref K7Q2 · Thu\u00a014\u00a0Nov, 07:25\u00a0→\u00a010:05.', 'Check-in opens 24 hours before departure.'],
    time: '8:15',
    unread: true,
  },
  {
    id: 'invoice',
    folder: 'inbox',
    from: 'Northwind Billing',
    subject: 'Invoice #2041 is ready',
    snippet: 'Your October invoice is available. Amount due: $48.00.',
    body: ['Your October invoice is available.', 'Team plan, 4 seats · $48.00', 'It will be charged to the card ending\u00a04242 on 1\u00a0November.'],
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
export const INCOMING = {
  folder: 'inbox',
  from: 'Mira Okafor',
  subject: 'Re: Q4 roadmap: final draft',
  snippet: 'One more thing: can you check slide 12 before the meeting?',
  body: ['One more thing: can you check slide 12 before the meeting?', 'M'],
  time: 'Now',
  unread: true,
} satisfies Omit<Msg, 'id'>;

export const FOLDERS: { id: Folder; label: string; icon: LucideIcon }[] = [
  { id: 'inbox', label: 'Inbox', icon: Inbox },
  { id: 'starred', label: 'Starred', icon: Star },
  { id: 'sent', label: 'Sent', icon: Send },
  { id: 'archive', label: 'Archive', icon: Archive },
];

export const inFolder = (m: Msg, f: Folder) => (f === 'starred' ? !!m.starred : m.folder === f);
export const label = (f: Folder) => FOLDERS.find((x) => x.id === f)!.label;

// ── Small parts ──────────────────────────────────────────

/** Marks every match of `q` in `text`. */
export function Marked({ text, q }: { text: string; q: string }) {
  if (!q) return <>{text}</>;
  const parts = text.split(new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i'));
  return <>{parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p))}</>;
}

/** spin-delay: nothing for 300 ms, then a spinner that stays at least 500 ms. */
export function useSlowLoad(key: string, slow: boolean) {
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

export type Api = ReturnType<typeof useMail>;

type Draft = { kind: 'new' | 'reply' | 'forward'; title: string; to: string; subject: string; body: string };

/** The app's state and actions. `openFirst` starts with the first message open, and so read. */
export function useMail(seed: Msg[] = MAIL, { openFirst = true } = {}) {
  const [mail, setMail] = useState(() => (openFirst ? seed.map((m, i) => (i === 0 ? { ...m, unread: false } : m)) : seed));
  const [folder, setFolder] = useState<Folder>('inbox');
  const [selected, setSelected] = useState<string | null>(openFirst ? seed[0].id : null);
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

  const step = (by: number, from = selected) => {
    const i = list.findIndex((m) => m.id === from);
    const next = list[Math.min(list.length - 1, Math.max(0, i + by))];
    if (next) open(next.id);
  };

  /** Moves a message out of this folder: the next one opens, as Gmail does; the last falls back to the one above. */
  const move = (id: string, to: 'inbox' | 'archive') => {
    const i = list.findIndex((m) => m.id === id);
    const msg = mail.find((m) => m.id === id);
    if (!msg || msg.folder === to) return;
    const from = msg.folder;
    const next = list.filter((m) => m.id !== id)[Math.min(i, list.length - 2)];
    patch(id, { folder: to });
    if (folder !== 'starred') {
      setSelected(next?.id ?? null);
      if (next) patch(next.id, { unread: false });
      else setReading(false);
    }
    toast({
      title: to === 'archive' ? 'Archived' : 'Moved to Inbox',
      action: {
        label: 'Undo',
        onClick: () => {
          patch(id, { folder: from });
          setSelected(id);
        },
      },
    });
  };
  const archive = (id: string) => move(id, 'archive');

  /** Archives from the list: nothing opens, so nothing is marked read on the way. */
  const archiveMany = (ids: string[]) => {
    const before = new Map(mail.filter((m) => ids.includes(m.id)).map((m) => [m.id, m.folder]));
    setMail((all) => all.map((m) => (before.has(m.id) ? { ...m, folder: 'archive' } : m)));
    toast({
      title: ids.length === 1 ? 'Archived' : `${ids.length} archived`,
      action: { label: 'Undo', onClick: () => setMail((all) => all.map((m) => (before.has(m.id) ? { ...m, folder: before.get(m.id)! } : m))) },
    });
  };
  const setUnread = (ids: string[], unread: boolean) => setMail((all) => all.map((m) => (ids.includes(m.id) ? { ...m, unread } : m)));
  const starMany = (ids: string[], starred: boolean) => setMail((all) => all.map((m) => (ids.includes(m.id) ? { ...m, starred } : m)));
  const unarchive = (id: string) => move(id, 'inbox');

  const star = (id: string) => setMail((all) => all.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)));
  const markUnread = (id: string) => patch(id, { unread: true });

  // With nothing in the list there's nothing to push under the pointer, so new mail goes straight in.
  const arrive = () => {
    const m = { ...INCOMING, id: `new-${++arrivals.current}` };
    if (mail.some((x) => x.folder === 'inbox')) setPending((p) => [...p, m]);
    else setMail((all) => [m, ...all]);
  };
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

  // One draft at a time, docked in the corner as Gmail's compose window is.
  const [draft, setDraft] = useState<Draft | null>(null);
  // Where focus was when the draft opened; it goes back there when the draft closes.
  const opener = useRef<HTMLElement | null>(null);
  // A new message closed with Close is kept, and Compose brings it back, as Gmail's drafts.
  const saved = useRef<Draft | null>(null);
  const write = (kind: 'new' | 'reply' | 'forward', m?: Msg | null) => {
    opener.current = document.activeElement as HTMLElement | null;
    if (kind === 'new' && saved.current) {
      setDraft(saved.current);
      saved.current = null;
      return;
    }
    const re = (t: string) => (t.startsWith('Re: ') ? t : `Re: ${t}`);
    setDraft(
      !m || kind === 'new'
        ? { kind: 'new', title: 'New message', to: '', subject: '', body: '' }
        : kind === 'reply'
          ? { kind, title: 'Reply', to: m.from.replace(/^To: /, ''), subject: re(m.subject), body: '' }
          : { kind, title: 'Forward', to: '', subject: `Fwd: ${m.subject}`, body: `\n\nForwarded from ${m.from}:\n${m.body.join('\n')}` },
    );
  };
  const send = () => {
    if (!draft) return;
    const id = `sent-${Date.now()}`;
    const body = draft.body.trim();
    setMail((all) => [
      { id, folder: 'sent', from: `To: ${draft.to || 'nobody'}`, subject: draft.subject || '(no subject)', snippet: body, body: body.split('\n'), time: 'Now' },
      ...all,
    ]);
    setDraft(null);
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
    archiveMany,
    setUnread,
    starMany,
    unarchive,
    star,
    markUnread,
    arrive,
    showPending,
    go,
    draft,
    opener,
    write,
    editDraft: (change: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...change } : d)),
    closeDraft: () => setDraft(null),
    keepDraft: () => {
      saved.current = draft;
      setDraft(null);
      toast({ title: 'Draft saved' });
    },
    send,
    unread: mail.filter((m) => m.folder === 'inbox' && m.unread).length + pending.length,
  };
}

function Compose({ api, iconOnly }: { api: Api; iconOnly?: boolean }) {
  return iconOnly ? (
    <Tip label="Compose">
      <Button variant="ghost" icon aria-label="Compose" data-spot="colour" onClick={() => api.write('new')}>
        <SquarePen {...ic} />
      </Button>
    </Tip>
  ) : (
    <Button variant="primary" className={s.compose} data-spot="colour" onClick={() => api.write('new')}>
      <SquarePen {...ic} />
      Compose
    </Button>
  );
}

/**
 * The draft. A reply or forward sits under the message it answers, as in
 * Gmail; a new message docks in the app's corner. Send or Discard; Esc
 * leaves the field, not the draft.
 */
export function Composer({ api }: { api: Api }) {
  const d = api.draft!;
  const inline = d.kind !== 'new';
  const box = useRef<HTMLElement>(null);
  // A reply opens under a long message: bring it, and its caret, into view.
  useEffect(() => {
    if (inline) box.current?.scrollIntoView({ block: 'nearest' });
  }, [inline]);
  // Focus goes back where it came from when the draft closes.
  useEffect(() => {
    const from = api.opener.current;
    return () => {
      if (from?.isConnected) from.focus();
    };
  }, [api.opener]);
  return (
    <section ref={box} className={inline ? s.composerInline : s.composer} role="dialog" aria-label={d.title} data-overlay={inline ? undefined : ''}>
      {!inline && (
        <header className={s.composerHead}>
          {d.title}
          <Tip label="Save and close">
            <Button variant="ghost" size="sm" icon aria-label="Save and close" onClick={api.keepDraft}>
              <X {...ic} />
            </Button>
          </Tip>
        </header>
      )}
      <label className={s.composerLine}>
        <span>To</span>
        <input value={d.to} autoFocus={!d.to} onChange={(e) => api.editDraft({ to: e.target.value })} />
      </label>
      {/* A reply keeps its thread's subject, so it shows none, as Gmail's inline reply. */}
      {!inline && (
        <label className={s.composerLine}>
          <span>Subject</span>
          <input value={d.subject} onChange={(e) => api.editDraft({ subject: e.target.value })} />
        </label>
      )}
      <textarea
        className={s.composerBody}
        aria-label="Message"
        value={d.body}
        autoFocus={!!d.to}
        onChange={(e) => api.editDraft({ body: e.target.value })}
      />
      <footer className={s.composerFoot}>
        <Button variant="primary" onClick={api.send}>
          Send
        </Button>
        <Tip label="Discard draft">
          <Button variant="ghost" icon aria-label="Discard draft" onClick={api.closeDraft}>
            <Trash2 {...ic} />
          </Button>
        </Tip>
      </footer>
    </section>
  );
}

/** One message in the list. `pin` holds a state still (hover, focus, menu) for the state matrix and for Show. */
function Row({ m, api, pin, rowRef }: { m: Msg; api: Api; pin?: string; rowRef?: (el: HTMLButtonElement | null) => void }) {
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
            data-pin={pin}
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
        {m.folder === 'inbox' && (
          <span className={s.rowActions}>
            <Tip label="Archive" keys={['E']}>
              <Button variant="ghost" size="sm" icon aria-label="Archive" onClick={() => api.archive(m.id)}>
                <Archive {...ic} />
              </Button>
            </Tip>
          </span>
        )}
        {m.folder === 'archive' && (
          <span className={s.rowActions}>
            <Tip label="Move to Inbox">
              <Button variant="ghost" size="sm" icon aria-label="Move to Inbox" onClick={() => api.unarchive(m.id)}>
                <ArchiveRestore {...ic} />
              </Button>
            </Tip>
          </span>
        )}
        {/* One star in one place: always there when on, an outline on hover when off. */}
        <Tip label={m.starred ? 'Unstar' : 'Star'} keys={['S']}>
          <Button
            variant="ghost"
            size="sm"
            icon
            aria-label={m.starred ? 'Unstar' : 'Star'}
            aria-pressed={!!m.starred}
            className={s.rowStar}
            onClick={() => api.star(m.id)}
          >
            <Star {...ic} className={s.star} data-on={m.starred ? '' : undefined} />
          </Button>
        </Tip>
      </ContextMenu.Trigger>
      {/* A context menu carries no shortcuts; the toolbar's tooltips do. */}
      {/* Focus returns to the open message's row, so focus and selection stay one row. */}
      <ContextMenu.Popup finalFocus={() => document.querySelector<HTMLElement>('[data-row][data-selected] button') ?? true}>
        <Menu.Item icon={Reply} onClick={() => (api.open(m.id), api.write('reply', m))}>
          Reply
        </Menu.Item>
        <Menu.Item icon={Forward} onClick={() => (api.open(m.id), api.write('forward', m))}>
          Forward
        </Menu.Item>
        <Menu.Separator />
        {m.folder === 'inbox' && (
          <Menu.Item icon={Archive} onClick={() => api.archive(m.id)}>
            Archive
          </Menu.Item>
        )}
        {m.folder === 'archive' && (
          <Menu.Item icon={ArchiveRestore} onClick={() => api.unarchive(m.id)}>
            Move to Inbox
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
          <Compose api={api} iconOnly />
        </span>
      </header>
      {/* Floats over the list: the rows under the pointer stay where they are. */}
      {api.pending.length > 0 && api.folder === 'inbox' && !q && (
        <button
          type="button"
          className={s.pill}
          data-overlay
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
            pin={pinned === m.id ? 'hover' : undefined}
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
  return (
    <section className={s.reader} aria-label="Message">
      <TipGroup>
        {/* The bar stays when there's no message, so the panes keep one shape. */}
        <header className={s.toolbar}>
          <Button variant="ghost" size="sm" className={cx(s.back, s.phoneOnly)} onClick={() => api.setReading(false)}>
            <ChevronLeft {...ic} />
            {label(api.folder)}
          </Button>
          {m && (
            <span className={s.tools}>
              {m.folder === 'inbox' && (
                <Tip label="Archive" keys={['E']} side="bottom">
                  <Button variant="ghost" icon aria-label="Archive" data-spot="archive" onClick={() => api.archive(m.id)}>
                    <Archive {...ic} />
                  </Button>
                </Tip>
              )}
              {m.folder === 'archive' && (
                <Tip label="Move to Inbox" side="bottom">
                  <Button variant="ghost" icon aria-label="Move to Inbox" onClick={() => api.unarchive(m.id)}>
                    <ArchiveRestore {...ic} />
                  </Button>
                </Tip>
              )}
              <Tip label={m.starred ? 'Unstar' : 'Star'} keys={['S']} side="bottom">
                <Button variant="ghost" icon aria-label={m.starred ? 'Unstar' : 'Star'} data-spot="star" onClick={() => api.star(m.id)}>
                  <Star {...ic} className={s.star} data-on={m.starred ? '' : undefined} />
                </Button>
              </Tip>
              {m.folder !== 'sent' && (
                <Tip label="Mark as unread" side="bottom">
                  <Button variant="ghost" icon aria-label="Mark as unread" onClick={() => api.markUnread(m.id)}>
                    <Mail {...ic} />
                  </Button>
                </Tip>
              )}
            </span>
          )}
        </header>
        {m ? (
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
              // The file's name shows at once; only its preview waits, behind a spinner after 300 ms.
              <div className={s.attachment} data-spot="slow">
                <span className={s.attachmentIcon}>
                  {load === 'ready' ? (
                    <FileText {...ic} />
                  ) : (
                    load === 'spinning' && <LoaderCircle {...ic} className={s.spin} aria-label="Loading preview" />
                  )}
                </span>
                <span className={s.attachmentText}>
                  <span className={s.attachmentName}>Invoice-2041.pdf</span>
                  <span className={s.attachmentMeta}>{load === 'ready' ? 'PDF · 1 page · 84 KB' : '\u00a0'}</span>
                </span>
              </div>
            )}
            {api.draft && api.draft.kind !== 'new' ? (
              <Composer api={api} />
            ) : (
              <div className={s.replyBar}>
                <Button onClick={() => api.write('reply', m)}>
                  <Reply {...ic} />
                  Reply
                </Button>
                <Button onClick={() => api.write('forward', m)}>
                  <Forward {...ic} />
                  Forward
                </Button>
              </div>
            )}
          </article>
        ) : (
          <div className={s.empty}>{api.list.length > 0 && <p>Select a message to read it.</p>}</div>
        )}
      </TipGroup>
    </section>
  );
}

function Sidebar({ api }: { api: Api }) {
  return (
    <nav className={s.sidebar} aria-label="Folders">
      <Compose api={api} />
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
        Unread is bold and a dot. Blue marks only Compose and the open message’s row; hover is grey.{' '}
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
    // Keys act on the row the keyboard is on, else on the open message, as Gmail's cursor does.
    const id = (e.target as HTMLElement).closest('[data-row]')?.getAttribute('data-row') ?? api.current?.id;
    const act: Record<string, () => void> = {
      j: () => api.step(1, id),
      k: () => api.step(-1, id),
      e: () => id && api.archive(id),
      s: () => id && api.star(id),
      r: () => api.write('reply', api.current),
      f: () => api.write('forward', api.current),
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
        ref={root}
        className={s.app} data-spot={spot ?? undefined} data-reading={api.reading ? '' : undefined} onKeyDown={keys}>
        <Sidebar api={api} />
        <div className={s.panes}>
          <List api={api} pinned={pinned} rows={rows} />
          <Reader api={api} />
        </div>
        {api.draft?.kind === 'new' && <Composer api={api} />}
        {/* Toasts rise in their own layer, out of the app's grid. */}
        <div ref={onRoot} className={s.toastLayer} data-overlay />
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
      <ToastProvider container={container} contained align="start">
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
        <div className={s.miniHead}>Inbox</div>
        {waiting > 0 && (
          <button
            type="button"
            className={s.pill}
            data-overlay
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

// ── State matrix (lab) ───────────────────────────────────

const LONG: Msg = {
  ...MAIL[0],
  id: 'long',
  from: 'Alexandra Montgomery-Whitfield',
  subject: 'Re: Re: Fwd: Updated agenda for the quarterly planning offsite in Lisbon',
  time: 'Yesterday',
};

const KINDS: { name: string; m: Msg; query?: string }[] = [
  { name: 'Read', m: { ...MAIL[3] } },
  { name: 'Unread', m: { ...MAIL[1] } },
  { name: 'Read, starred', m: { ...MAIL[3], starred: true } },
  { name: 'Unread, starred', m: { ...MAIL[1], starred: true } },
  { name: 'Archived', m: { ...MAIL[7] } },
  { name: 'Search match', m: { ...MAIL[3] }, query: 'ramen' },
  { name: 'Long', m: { ...LONG, unread: true, starred: true } },
];

const STATES: { name: string; pin?: string; selected?: boolean }[] = [
  { name: 'Rest' },
  { name: 'Hover', pin: 'hover' },
  { name: 'Focus', pin: 'focus' },
  { name: 'Selected', selected: true },
  { name: 'Selected, hover', pin: 'hover', selected: true },
  { name: 'Menu open', pin: 'menu' },
];

/** A stand-in for the app's state: enough for a row to render, and nothing happens. */
const still = (m: Msg, selected?: boolean, query = '') =>
  ({ query, current: selected ? m : null, open() {}, archive() {}, star() {}, markUnread() {} }) as unknown as Api;

/** Every kind of row in every state, held still, for checking side by side. */
export function MailStates() {
  return (
    <div className={s.states}>
      <ToastProvider>
        <div className={s.statesGrid} style={{ gridTemplateColumns: `120px repeat(${STATES.length}, 300px)` }}>
          <span />
          {STATES.map((st) => (
            <span key={st.name} className={s.statesHead}>
              {st.name}
            </span>
          ))}
          {KINDS.map((k) => (
            <div key={k.name} className={s.statesRow}>
              <span className={s.statesName}>{k.name}</span>
              {STATES.map((st) => (
                <div key={st.name} className={s.statesCell}>
                  <Row m={k.m} api={still(k.m, st.selected, k.query)} pin={st.pin} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </ToastProvider>
    </div>
  );
}
