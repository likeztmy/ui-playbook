import { useMemo, useRef, useState } from 'react';
import { useToast } from '../../ui/Toast';
import { CONVERSATIONS, incoming } from './conversations';
import { clock, inFolder, newest, plain, unread, type Conversation, type Folder, type Message } from './model';
import { person } from './people';

/** Post's state and the actions on it. Views read it and call its actions; they hold only view state. */
export function usePost(seed: Conversation[] = CONVERSATIONS) {
  const [mail, setMail] = useState(seed);
  const [folder, setFolder] = useState<Folder>('inbox');
  const [query, setQuery] = useState('');
  const [everywhere, setEverywhere] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  // Mail that has arrived but waits behind a pill: rows don't move under the pointer on their own.
  const [waiting, setWaiting] = useState<Conversation[]>([]);
  const arrived = useRef(0);
  const toast = useToast();

  const q = query.trim().toLowerCase();
  const list = useMemo(
    () =>
      mail
        .filter((c) => {
          if (!q) return inFolder(c, folder);
          const text = [c.subject, ...c.messages.map((m) => `${person(m.from).name} ${plain(m.body)}`)].join(' ').toLowerCase();
          return (everywhere || inFolder(c, folder)) && text.includes(q);
        })
        .sort(newest),
    [mail, folder, q, everywhere],
  );
  const open = mail.find((c) => c.id === openId) ?? null;

  const update = (ids: string[], change: (c: Conversation) => Conversation) => setMail((all) => all.map((c) => (ids.includes(c.id) ? change(c) : c)));
  const setUnread = (ids: string[], on: boolean) =>
    // Marking unread marks the newest message; reading marks them all.
    update(ids, (c) => ({ ...c, messages: c.messages.map((m, i) => ({ ...m, unread: on ? i === c.messages.length - 1 : false })) }));

  const show = (id: string) => {
    setOpenId(id);
    setUnread([id], false);
  };

  /** The conversation `by` rows from `from` (default: the open one). */
  const step = (by: number, from = openId) => {
    const i = list.findIndex((c) => c.id === from);
    const next = list[Math.min(list.length - 1, Math.max(0, i + by))];
    if (next) show(next.id);
  };

  /** Moves conversations between Inbox and Archive, with Undo. An open one gives way to the next in the list. */
  const move = (ids: string[], to: 'inbox' | 'archive') => {
    const before = new Map(mail.filter((c) => ids.includes(c.id)).map((c) => [c.id, c.folder]));
    if (openId && ids.includes(openId)) {
      const rest = list.filter((c) => !ids.includes(c.id));
      const i = list.findIndex((c) => c.id === openId);
      const next = rest[Math.min(i, rest.length - 1)];
      if (next) show(next.id);
      else setOpenId(null);
    }
    update(ids, (c) => ({ ...c, folder: to }));
    setChecked(new Set());
    const n = ids.length;
    toast({
      // What happened, to what: Undo then says what it brings back.
      title:
        n === 1
          ? `${to === 'archive' ? 'Archived' : 'Moved to Inbox'} “${mail.find((c) => c.id === ids[0])?.subject}”`
          : `${n} conversations ${to === 'archive' ? 'archived' : 'moved to Inbox'}`,
      action: {
        label: 'Undo',
        onClick: () => {
          setMail((all) => all.map((c) => (before.has(c.id) ? { ...c, folder: before.get(c.id)! } : c)));
          // The toast that held focus goes; focus goes to the row that came back.
          requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-row="${ids[0]}"] > button`)?.focus());
        },
      },
    });
  };

  // The last row ticked or unticked: a shift-click runs from it.
  const anchor = useRef<string | null>(null);
  /** Ticks a row, or with `range` every row from the last one ticked, to the same state. */
  const tick = (id: string, on: boolean, range = false) => {
    const from = range && anchor.current ? list.findIndex((c) => c.id === anchor.current) : -1;
    const to = list.findIndex((c) => c.id === id);
    const ids = from >= 0 && to >= 0 ? list.slice(Math.min(from, to), Math.max(from, to) + 1).map((c) => c.id) : [id];
    const next = new Set(checked);
    for (const x of ids) {
      if (on) next.add(x);
      else next.delete(x);
    }
    setChecked(next);
    anchor.current = id;
  };

  const star = (ids: string[], on: boolean) => update(ids, (c) => ({ ...c, starred: on }));

  /** Puts a sent message at the end of its conversation, or starts a conversation in Sent. Returns how to take it back. */
  const deliver = (m: Message, subject: string, into?: string) => {
    const time = clock();
    const was = into ? mail.find((c) => c.id === into) : undefined;
    const id = was?.id ?? `c-${m.id}`;
    if (was) setMail((all) => all.map((c) => (c.id === id ? { ...c, day: 0, time, messages: [...c.messages, m] } : c)));
    else setMail((all) => [{ id, subject: subject.trim() || '(no subject)', folder: 'sent', day: 0, time, messages: [m] }, ...all]);
    return () =>
      setMail((all) =>
        was
          ? all.map((c) => (c.id === id ? { ...c, day: was.day, time: was.time, messages: c.messages.filter((x) => x.id !== m.id) } : c))
          : all.filter((c) => c.id !== id),
      );
  };

  const arrive = () => {
    setWaiting((w) => [incoming(++arrived.current, clock()), ...w]);
  };
  /** What has arrived joins the top of the list, when asked for. */
  const letIn = () => {
    setMail((all) => [...waiting, ...all]);
    setWaiting([]);
  };

  const go = (f: Folder) => {
    setFolder(f);
    setQuery('');
    setEverywhere(false);
    setOpenId(null);
    setChecked(new Set());
  };

  /** Everything a demo can change, to put back afterwards. */
  const snapshot = () => ({ mail, folder, query, everywhere, openId, checked, waiting });
  const restore = (x: ReturnType<typeof snapshot>) => {
    setMail(x.mail);
    setFolder(x.folder);
    setQuery(x.query);
    setEverywhere(x.everywhere);
    setOpenId(x.openId);
    setChecked(x.checked);
    setWaiting(x.waiting);
  };

  return {
    snapshot,
    restore,
    mail,
    list,
    open,
    folder,
    query,
    everywhere,
    checked,
    setChecked,
    tick,
    search: (v: string) => {
      setQuery(v);
      setEverywhere(false);
      setChecked(new Set());
    },
    searchEverywhere: () => setEverywhere(true),
    show,
    close: () => setOpenId(null),
    step,
    archive: (ids: string[]) => move(ids, 'archive'),
    unarchive: (ids: string[]) => move(ids, 'inbox'),
    star,
    deliver,
    waiting: waiting.length,
    arrive,
    letIn,
    setUnread,
    go,
    unreadCount: mail.filter((c) => c.folder === 'inbox' && unread(c)).length,
  };
}

export type Post = ReturnType<typeof usePost>;
