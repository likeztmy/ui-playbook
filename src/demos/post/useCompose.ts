import { useEffect, useRef, useState } from 'react';
import { TIMEOUT, useToast } from '../../ui/Toast';
import { toBlocks } from './doc';
import { blank, empty, fileFrom, loadDrafts, replyTo, storeDrafts, uploading, type Draft, type DraftKind } from './draft';
import type { Conversation, Message } from './model';
import type { Post } from './usePost';

// Uploads are simulated: a steady rate, and a floor so a small file still shows its bar.
const RATE = 1.5 * 1024 * 1024;
const FLOOR = 1500;
const TICK = 100;

/** A message just sent, while it can still be taken back. */
type Sending = { message: string; conversation?: string; subject: string; to: string[]; undo: () => void; done?: boolean };

const at = (d: Date) => `${d.toLocaleDateString('en-GB', { weekday: 'short' })} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;

/** Writing: the drafts, the one open in the main area, and sending them. Replies live in their conversation. */
export function useCompose(post: Post) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [writing, setWriting] = useState<string | null>(null);
  const [saved, setSaved] = useState(0);
  const loaded = useRef(false);
  const timers = useRef(new Map<string, ReturnType<typeof setInterval>>());
  // Messages just sent, still taken back with Undo where they landed.
  const [sending, setSending] = useState<Sending[]>([]);
  // Drafts whose Send is waiting for their uploads.
  const [waiting, setWaiting] = useState<Set<string>>(new Set());
  const toast = useToast();

  // Read after the first render, so the server's HTML and the first client render agree.
  useEffect(() => {
    setDrafts(loadDrafts());
    loaded.current = true;
  }, []);

  // Saved after a pause in typing, not on every key.
  useEffect(() => {
    if (!loaded.current) return;
    const t = setTimeout(() => {
      storeDrafts(drafts);
      setSaved(Date.now());
    }, 1000);
    return () => clearTimeout(t);
  }, [drafts]);

  const files = (id: string, change: (fs: NonNullable<Draft['attachments']>) => NonNullable<Draft['attachments']>) =>
    setDrafts((all) => all.map((d) => (d.id === id ? { ...d, attachments: change(d.attachments ?? []), edited: Date.now() } : d)));

  /** Adds files to a draft; each uploads on its own. */
  const attach = (id: string, picked: File[]) => {
    const added = picked.map(fileFrom);
    files(id, (fs) => [...fs, ...added]);
    for (const f of added) {
      const steps = Math.max(FLOOR, ((f.bytes ?? 0) / RATE) * 1000) / TICK;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const done = step >= steps;
        files(id, (fs) => fs.map((x) => (x.id === f.id ? { ...x, progress: done ? undefined : step / steps } : x)));
        if (done) {
          clearInterval(timer);
          timers.current.delete(f.id);
        }
      }, TICK);
      timers.current.set(f.id, timer);
    }
  };

  /** Takes a file off a draft, stopping its upload. */
  const detach = (id: string, file: string) => {
    clearInterval(timers.current.get(file));
    timers.current.delete(file);
    files(id, (fs) => {
      const f = fs.find((x) => x.id === file);
      if (f?.src?.startsWith('blob:')) URL.revokeObjectURL(f.src);
      return fs.filter((x) => x.id !== file);
    });
  };

  const add = (d: Draft) => setDrafts((all) => [...all.filter((x) => x.id !== d.id), d]);
  const remove = (id: string) => setDrafts((all) => all.filter((x) => x.id !== id));

  /** Shows a draft where it's written: a new message in the main area, a reply in its conversation. */
  const open = (d: Draft) => {
    if (d.conversation) {
      setWriting(null);
      post.show(d.conversation);
    } else {
      post.close();
      setWriting(d.id);
    }
  };

  const compose = () => {
    const d = blank();
    add(d);
    open(d);
  };

  /** A conversation has at most one reply being written; asking again goes back to it. */
  const reply = (c: Conversation, kind: Exclude<DraftKind, 'new'>) => {
    if (drafts.some((d) => d.conversation === c.id)) return;
    add(replyTo(c, kind));
  };

  const update = (id: string, patch: Partial<Draft>) =>
    setDrafts((all) => all.map((d) => (d.id === id ? { ...d, ...patch, edited: Date.now() } : d)));

  /** Leaves a draft; one with nothing in it is dropped. */
  const close = (id: string) => {
    const d = drafts.find((x) => x.id === id);
    if (d && empty(d)) remove(id);
    if (writing === id) setWriting(null);
  };

  const discard = (id: string) => {
    const d = drafts.find((x) => x.id === id);
    if (!d) return;
    remove(id);
    if (writing === id) setWriting(null);
    toast({ title: 'Draft discarded', action: { label: 'Undo', onClick: () => (add(d), open(d)) } });
  };

  const send = (id: string) => {
    const d = drafts.find((x) => x.id === id);
    if (!d) return;
    const m: Message = {
      id: `m-${d.id}`,
      from: 'me',
      to: d.to,
      cc: d.cc.length ? d.cc : undefined,
      at: at(new Date()),
      body: toBlocks(d.body),
      quoted: d.quoted,
      quotes: d.quotes,
      attachments: d.attachments?.map(({ id: _, progress: __, bytes: ___, ...a }) => a),
    };
    const undeliver = post.deliver(m, d.subject, d.conversation);
    remove(id);
    if (writing === id) setWriting(null);
    // Undo is offered where the message lands (in its thread, or atop the list), not at the screen's
    // foot: the eye is on what it just did. As long as a toast's Undo would last; then it says it's
    // sent, in place, and goes with the next move, so nothing shifts on its own.
    const drop = () => setSending((all) => all.filter((x) => x.message !== m.id));
    const settle = () => setSending((all) => all.map((x) => (x.message === m.id ? { ...x, done: true } : x)));
    const undo = () => {
      drop();
      undeliver();
      add(d);
      open(d);
    };
    setSending((all) => [...all, { message: m.id, conversation: d.conversation, subject: d.subject, to: d.to, undo }]);
    setTimeout(settle, TIMEOUT.action);
  };

  /** Send now, or, while a file is still uploading, once it's up. */
  const sendWhenReady = (id: string) => {
    const d = drafts.find((x) => x.id === id);
    if (!d) return;
    if (!uploading(d)) return send(id);
    setWaiting((w) => new Set(w).add(id));
  };

  const cancelWait = (id: string) =>
    setWaiting((w) => {
      const next = new Set(w);
      next.delete(id);
      return next;
    });

  // The last upload of a waiting draft finishing sends it.
  useEffect(() => {
    for (const id of waiting) {
      const d = drafts.find((x) => x.id === id);
      if (d && uploading(d)) continue;
      setWaiting((w) => {
        const next = new Set(w);
        next.delete(id);
        return next;
      });
      if (d) send(id);
    }
  }, [drafts, waiting]);

  return {
    drafts: drafts.filter((d) => !empty(d)),
    writing: drafts.find((d) => d.id === writing) ?? null,
    /** The reply being written in a conversation, if any. */
    replyIn: (c: string) => drafts.find((d) => d.conversation === c) ?? null,
    saved,
    sending,
    /** Clears what's been sent, on the next move elsewhere. */
    clearSent: () => setSending((all) => all.filter((x) => !x.done)),
    open,
    compose,
    reply,
    update,
    close,
    discard,
    send: sendWhenReady,
    waiting: (id: string) => waiting.has(id),
    cancelWait,
    attach,
    detach,
    /** Leaves the main-area draft, e.g. for another folder. */
    leave: () => writing && close(writing),
  };
}

export type Compose = ReturnType<typeof useCompose>;
