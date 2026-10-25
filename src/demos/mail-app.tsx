import {
  Archive,
  ArchiveRestore,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  Forward,
  LoaderCircle,
  Mail,
  MailOpen,
  Reply,
  Search,
  SquarePen,
  Star,
  X,
} from 'lucide-react';
import { useEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { ContextMenu, Menu } from '../ui/Menu';
import { ToastProvider } from '../ui/Toast';
import { Tip, TipGroup } from '../ui/Tooltip';
import { Composer, FOLDERS, MAIL, Marked, label, useMail, useSlowLoad, type Api, type Msg } from './mail';
import s from './mail-app.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

type Layout = 'single' | 'split';

// A fuller inbox than the article's, so a full screen has something to scan.
const MORE: Msg[] = [
  ['standup', 'Jonas Weber', 'Standup notes, Tuesday', 'Blocked on the API review. Search ships behind a flag on Thursday.', 'Tue'],
  ['receipt', 'Ferro Coffee', 'Your receipt from Ferro Coffee', 'Flat white, almond croissant · $9.40', 'Tue', true],
  ['interview', 'Hana Sato', 'Interview loop for Friday', 'Four slots booked. Can you take the systems design one at 2:00?', 'Tue', true],
  ['security', 'Post Security', 'New sign-in from Safari on macOS', 'If this was you, there’s nothing to do.', 'Mon'],
  ['books', 'Harbour Books', 'Your order has shipped', 'Thinking in Systems arrives Thursday.', 'Mon'],
  ['retro', 'Chidi Eze', 'Retro: what slowed us down', 'Three themes came up: review queues, flaky tests, and unclear owners.', 'Sun'],
  ['gym', 'Northside Climbing', 'Your membership renews next week', 'Annual plan · $420. Manage it from your account.', 'Sat'],
  ['figma', 'Lena Park', 'Comments on the onboarding flow', 'Left eleven comments. The empty states are the main thing.', 'Sat', true],
  ['tax', 'Ledger & Co', 'Documents needed by 15 November', 'Please upload last year’s statements before the deadline.', 'Fri'],
  ['photos', 'Sam Lee', 'Re: Photos from the offsite', 'Added the ones from the boat too.', 'Fri'],
  ['newsletter', 'The Weekly Diff', 'Issue 112: the cost of a click', 'Why every extra step loses a share of the people who reach it.', 'Thu'],
  ['plants', 'Greenhouse Supply', 'Back in stock: the fiddle-leaf fig', 'The one you saved is available again.', 'Thu'],
].map(([id, from, subject, snippet, time, unread]) => ({
  id: id as string,
  folder: 'inbox' as const,
  from: from as string,
  subject: subject as string,
  snippet: snippet as string,
  body: [snippet as string],
  time: time as string,
  unread: !!unread,
}));

const SEED = [...MAIL.filter((m) => m.folder === 'inbox'), ...MORE, ...MAIL.filter((m) => m.folder !== 'inbox')];

/** Email addresses for the message header, made from the sender's name. */
const address = (from: string) => `${from.replace(/^To: /, '').toLowerCase().replace(/[^a-z]+/g, '.').replace(/^\.|\.$/g, '')}@example.com`;

// ── Rows ─────────────────────────────────────────────────

type RowProps = {
  m: Msg;
  api: Api;
  layout: Layout;
  checked: boolean;
  onCheck: (on: boolean) => void;
  rowRef: (el: HTMLButtonElement | null) => void;
};

/** One message. One line in the single layout, two in the split one. */
function Line({ m, api, layout, checked, onCheck, rowRef }: RowProps) {
  const q = api.query.trim();
  const current = layout === 'split' && api.current?.id === m.id;
  const text = (
    <>
      <span className={s.subject}>
        <Marked text={m.subject} q={q} />
      </span>
      <span className={s.snippet}>
        <Marked text={m.snippet} q={q} />
      </span>
    </>
  );
  return (
    <ContextMenu.Root>
      <ContextMenu.Trigger
        render={
          <div
            className={s.line}
            role="listitem"
            data-row={m.id}
            data-unread={m.unread ? '' : undefined}
            data-checked={checked ? '' : undefined}
            data-current={current ? '' : undefined}
          />
        }
      >
        <span className={s.lineCheck}>
          <Checkbox aria-label={`Select ${m.from}: ${m.subject}`} checked={checked} onCheckedChange={(v) => onCheck(!!v)} />
        </span>
        <Tip label={m.starred ? 'Unstar' : 'Star'} keys={['S']}>
          <Button variant="ghost" size="sm" icon aria-label={m.starred ? 'Unstar' : 'Star'} aria-pressed={!!m.starred} className={s.lineStar} onClick={() => api.star(m.id)}>
            <Star {...ic} className={s.star} data-on={m.starred ? '' : undefined} />
          </Button>
        </Tip>
        <button type="button" ref={rowRef} className={s.lineMain} aria-current={current || undefined} onClick={() => api.open(m.id)}>
          <span className={s.from}>
            <Marked text={m.from} q={q} />
          </span>
          <span className={s.text}>{text}</span>
          <span className={s.time}>{m.time}</span>
        </button>
        {/* Over the time's place, at the row's end. */}
        <span className={s.lineActions}>
          {m.folder === 'inbox' && (
            <Tip label="Archive" keys={['E']}>
              <Button variant="ghost" size="sm" icon aria-label="Archive" onClick={() => api.archiveMany([m.id])}>
                <Archive {...ic} />
              </Button>
            </Tip>
          )}
          {m.folder === 'archive' && (
            <Tip label="Move to Inbox">
              <Button variant="ghost" size="sm" icon aria-label="Move to Inbox" onClick={() => api.unarchive(m.id)}>
                <ArchiveRestore {...ic} />
              </Button>
            </Tip>
          )}
          <Tip label={m.unread ? 'Mark as read' : 'Mark as unread'}>
            <Button variant="ghost" size="sm" icon aria-label={m.unread ? 'Mark as read' : 'Mark as unread'} onClick={() => api.setUnread([m.id], !m.unread)}>
              {m.unread ? <MailOpen {...ic} /> : <Mail {...ic} />}
            </Button>
          </Tip>
        </span>
      </ContextMenu.Trigger>
      <ContextMenu.Popup>
        <Menu.Item icon={Reply} onClick={() => (api.open(m.id), api.write('reply', m))}>
          Reply
        </Menu.Item>
        <Menu.Item icon={Forward} onClick={() => (api.open(m.id), api.write('forward', m))}>
          Forward
        </Menu.Item>
        <Menu.Separator />
        {m.folder === 'inbox' && (
          <Menu.Item icon={Archive} onClick={() => api.archiveMany([m.id])}>
            Archive
          </Menu.Item>
        )}
        <Menu.Item icon={Star} onClick={() => api.star(m.id)}>
          {m.starred ? 'Unstar' : 'Star'}
        </Menu.Item>
        <Menu.Item icon={m.unread ? MailOpen : Mail} onClick={() => api.setUnread([m.id], !m.unread)}>
          {m.unread ? 'Mark as read' : 'Mark as unread'}
        </Menu.Item>
      </ContextMenu.Popup>
    </ContextMenu.Root>
  );
}

// ── List ─────────────────────────────────────────────────

type ListProps = {
  api: Api;
  layout: Layout;
  checked: Set<string>;
  setChecked: (next: Set<string>) => void;
  rows: RefObject<Map<string, HTMLButtonElement>>;
};

function List({ api, layout, checked, setChecked, rows }: ListProps) {
  const shown = api.list.filter((m) => checked.has(m.id));
  const all = api.list.length > 0 && shown.length === api.list.length;
  const ids = shown.map((m) => m.id);
  const anyUnread = shown.some((m) => m.unread);
  const q = api.query.trim();
  return (
    <section className={s.list} aria-label="Messages">
      {/* The bar keeps one height and one place for its count, with or without a selection. */}
      <div className={s.bar}>
        <span className={s.lineCheck}>
          <Checkbox
            aria-label={all ? 'Select none' : 'Select all'}
            checked={all}
            indeterminate={shown.length > 0 && !all}
            onCheckedChange={() => setChecked(all || shown.length ? new Set() : new Set(api.list.map((m) => m.id)))}
          />
        </span>
        {shown.length > 0 ? (
          <TipGroup>
            <span className={s.barTools}>
              {shown.some((m) => m.folder === 'inbox') && (
                <Tip label="Archive" keys={['E']}>
                  <Button
                    variant="ghost"
                    icon
                    aria-label="Archive"
                    onClick={() => {
                      api.archiveMany(ids);
                      setChecked(new Set());
                    }}
                  >
                    <Archive {...ic} />
                  </Button>
                </Tip>
              )}
              <Tip label={anyUnread ? 'Mark as read' : 'Mark as unread'}>
                <Button variant="ghost" icon aria-label={anyUnread ? 'Mark as read' : 'Mark as unread'} onClick={() => api.setUnread(ids, !anyUnread)}>
                  {anyUnread ? <MailOpen {...ic} /> : <Mail {...ic} />}
                </Button>
              </Tip>
              <Tip label="Star">
                <Button variant="ghost" icon aria-label="Star" onClick={() => api.starMany(ids, !shown.every((m) => m.starred))}>
                  <Star {...ic} />
                </Button>
              </Tip>
            </span>
            <span className={s.barTitle}>{shown.length} selected</span>
          </TipGroup>
        ) : (
          <span className={s.barTitle}>{api.everywhere ? 'All mail' : label(api.folder)}</span>
        )}
        <span className={s.count}>
          {api.list.length} {api.list.length === 1 ? 'message' : 'messages'}
        </span>
      </div>
      {api.pending.length > 0 && api.folder === 'inbox' && !q && (
        <button type="button" className={s.pill} data-overlay onClick={api.showPending}>
          {api.pending.length === 1 ? '1 new message' : `${api.pending.length} new messages`}
        </button>
      )}
      <div className={s.rows} role="list" data-layout={layout}>
        {api.list.map((m) => (
          <Line
            key={m.id}
            m={m}
            api={api}
            layout={layout}
            checked={checked.has(m.id)}
            onCheck={(on) => {
              const next = new Set(checked);
              if (on) next.add(m.id);
              else next.delete(m.id);
              setChecked(next);
            }}
            rowRef={(el) => {
              if (el) rows.current.set(m.id, el);
              else rows.current.delete(m.id);
            }}
          />
        ))}
        {api.list.length === 0 &&
          (q ? (
            <div className={s.empty}>
              <p>
                No messages match “{q}” in {api.everywhere ? 'All mail' : label(api.folder)}.
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
            </div>
          ))}
      </div>
    </section>
  );
}

// ── Message ──────────────────────────────────────────────

function Message({ api, layout }: { api: Api; layout: Layout }) {
  const m = api.current;
  const load = useSlowLoad(m?.id ?? '', !!m?.slow);
  const i = m ? api.list.findIndex((x) => x.id === m.id) : -1;
  if (!m) return <section className={s.message} aria-label="Message" />;
  return (
    <section className={s.message} aria-label="Message">
      <TipGroup>
        <div className={s.bar}>
          <Tip label={`Back to ${label(api.folder)}`} keys={['U']}>
            <Button variant="ghost" icon aria-label={`Back to ${label(api.folder)}`} className={s.back} onClick={() => api.setReading(false)}>
              <ChevronLeft {...ic} />
            </Button>
          </Tip>
          <span className={s.barTools}>
            {m.folder === 'inbox' && (
              <Tip label="Archive" keys={['E']}>
                <Button variant="ghost" icon aria-label="Archive" onClick={() => api.archive(m.id)}>
                  <Archive {...ic} />
                </Button>
              </Tip>
            )}
            {m.folder === 'archive' && (
              <Tip label="Move to Inbox">
                <Button variant="ghost" icon aria-label="Move to Inbox" onClick={() => api.unarchive(m.id)}>
                  <ArchiveRestore {...ic} />
                </Button>
              </Tip>
            )}
            <Tip label="Mark as unread">
              <Button
                variant="ghost"
                icon
                aria-label="Mark as unread"
                onClick={() => {
                  api.markUnread(m.id);
                  if (layout === 'single') api.setReading(false);
                }}
              >
                <Mail {...ic} />
              </Button>
            </Tip>
          </span>
          {layout === 'single' && i >= 0 && (
            <span className={s.pager}>
              <span className={s.count}>
                {i + 1} of {api.list.length}
              </span>
              <Tip label="Newer" keys={['K']}>
                <Button variant="ghost" icon aria-label="Newer" disabled={i === 0} onClick={() => api.step(-1)}>
                  <ChevronLeft {...ic} />
                </Button>
              </Tip>
              <Tip label="Older" keys={['J']}>
                <Button variant="ghost" icon aria-label="Older" disabled={i === api.list.length - 1} onClick={() => api.step(1)}>
                  <ChevronRight {...ic} />
                </Button>
              </Tip>
            </span>
          )}
        </div>
      </TipGroup>
      <div className={s.messageScroll}>
        <article className={s.messageBody}>
          <header className={s.messageHead}>
            <h1 className={s.messageSubject}>{m.subject}</h1>
            <Tip label={m.starred ? 'Unstar' : 'Star'} keys={['S']}>
              <Button variant="ghost" icon aria-label={m.starred ? 'Unstar' : 'Star'} onClick={() => api.star(m.id)}>
                <Star {...ic} className={s.star} data-on={m.starred ? '' : undefined} />
              </Button>
            </Tip>
          </header>
          <div className={s.sender}>
            <span className={s.avatar} aria-hidden>
              {m.from.replace('To: ', '')[0]}
            </span>
            <span className={s.senderName}>
              {m.from}
              <span className={s.senderAddress}>{address(m.from)}</span>
            </span>
            <span className={s.time}>{m.time}</span>
          </div>
          <div className={s.prose}>
            {m.body.map((p, k) => (
              <p key={k}>{p}</p>
            ))}
          </div>
          {m.slow && (
            <div className={s.attachment}>
              <span className={s.attachmentIcon}>
                {load === 'ready' ? (
                  <FileText {...ic} />
                ) : (
                  load === 'spinning' && <LoaderCircle {...ic} className={s.spin} aria-label="Loading preview" />
                )}
              </span>
              <span className={s.attachmentText}>
                <span className={s.attachmentName}>Invoice-2041.pdf</span>
                <span className={s.attachmentMeta}>{load === 'ready' ? 'PDF · 1 page · 84 KB' : ' '}</span>
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
      </div>
    </section>
  );
}

// ── Frame ────────────────────────────────────────────────

function Shell({ layout, onToasts }: { layout: Layout; onToasts: (el: HTMLDivElement | null) => void }) {
  const api = useMail(SEED, { openFirst: layout === 'split' });
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const rows = useRef(new Map<string, HTMLButtonElement>());
  const search = useRef<HTMLInputElement>(null);
  const keyed = useRef(false);
  // Single: the message replaces the list. Split: both show, until a phone's width makes it single too.
  const reading = api.reading && !!api.current;

  // Selections belong to a folder and a search; a new list starts with none.
  useEffect(() => setChecked(new Set()), [api.folder, api.query, api.everywhere]);
  // Focus follows a selection the keyboard moved.
  useEffect(() => {
    if (keyed.current && api.current) rows.current.get(api.current.id)?.focus();
    keyed.current = false;
  }, [api.current]);

  const keys = (e: KeyboardEvent) => {
    if (e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest('input, textarea, [role="dialog"], [role="menu"]')) return;
    const row = (e.target as HTMLElement).closest('[data-row]')?.getAttribute('data-row');
    const id = row ?? api.current?.id;
    const m = api.mail.find((x) => x.id === id);
    const act: Record<string, () => void> = {
      j: () => api.step(1, id),
      k: () => api.step(-1, id),
      e: () => m && (layout === 'single' && !api.reading ? api.archiveMany([m.id]) : api.archive(m.id)),
      s: () => m && api.star(m.id),
      x: () => {
        if (!m) return;
        const next = new Set(checked);
        if (next.has(m.id)) next.delete(m.id);
        else next.add(m.id);
        setChecked(next);
      },
      u: () => api.setReading(false),
      r: () => api.write('reply', m),
      f: () => api.write('forward', m),
      '/': () => search.current?.focus(),
    };
    if (!act[e.key]) return;
    e.preventDefault();
    keyed.current = e.key === 'j' || e.key === 'k';
    act[e.key]();
  };

  return (
    <div className={s.app} data-layout={layout} data-view={reading ? 'message' : 'list'} onKeyDown={keys}>
      <header className={s.top}>
        <span className={s.brand}>Post</span>
        <span className={s.phoneOnly}>
          <Menu.Root>
            <Menu.Trigger render={<Button variant="ghost" className={s.folderMenu} />}>
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
        </span>
        <label className={s.search}>
          <Search {...ic} />
          <input
            ref={search}
            value={api.query}
            placeholder="Search mail"
            aria-label="Search mail"
            onChange={(e) => api.setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') api.setQuery('');
              e.stopPropagation();
            }}
          />
          {api.query && (
            <Button variant="ghost" size="sm" icon aria-label="Clear search" onClick={() => api.setQuery('')}>
              <X {...ic} />
            </Button>
          )}
        </label>
        <span className={s.phoneOnly}>
          <Tip label="Compose">
            <Button variant="ghost" icon aria-label="Compose" onClick={() => api.write('new')}>
              <SquarePen {...ic} />
            </Button>
          </Tip>
        </span>
      </header>
      <nav className={s.side} aria-label="Folders">
        <Button variant="primary" className={s.compose} onClick={() => api.write('new')}>
          <SquarePen {...ic} />
          Compose
        </Button>
        {FOLDERS.map((f) => (
          <button key={f.id} type="button" className={s.folder} aria-current={api.folder === f.id || undefined} onClick={() => api.go(f.id)}>
            <f.icon {...ic} />
            <span>{f.label}</span>
            {f.id === 'inbox' && api.unread > 0 && <span className={s.folderCount}>{api.unread}</span>}
          </button>
        ))}
      </nav>
      <main className={s.main}>
        {layout === 'single' ? (
          reading ? (
            <Message api={api} layout={layout} />
          ) : (
            <List api={api} layout={layout} checked={checked} setChecked={setChecked} rows={rows} />
          )
        ) : (
          <>
            <List api={api} layout={layout} checked={checked} setChecked={setChecked} rows={rows} />
            <Message api={api} layout={layout} />
          </>
        )}
      </main>
      {api.draft?.kind === 'new' && <Composer api={api} />}
      <div ref={onToasts} className={s.toastLayer} data-overlay />
    </div>
  );
}

/** The mail app at full size, in one of two layouts. */
export function MailApp({ layout }: { layout: Layout }) {
  const [container, setContainer] = useState<HTMLElement | null>(null);
  return (
    <div className={s.frame}>
      <ToastProvider container={container} contained align="start">
        <Shell layout={layout} onToasts={setContainer} />
      </ToastProvider>
    </div>
  );
}
