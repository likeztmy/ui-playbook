import { useEffect, useRef, useState } from 'react';
import { useToast } from '../../ui/Toast';
import { toBlocks } from './doc';
import { blank, empty, loadDrafts, replyTo, storeDrafts, type Draft, type DraftKind } from './draft';
import type { Conversation, Message } from './model';
import type { Post } from './usePost';

const at = (d: Date) => `${d.toLocaleDateString('en-GB', { weekday: 'short' })} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;

/** Writing: the drafts, the one open in the main area, and sending them. Replies live in their conversation. */
export function useCompose(post: Post) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [writing, setWriting] = useState<string | null>(null);
  const [saved, setSaved] = useState(0);
  const loaded = useRef(false);
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
      attachments: d.attachments,
    };
    const undo = post.deliver(m, d.subject, d.conversation);
    remove(id);
    if (writing === id) setWriting(null);
    toast({
      title: 'Message sent',
      action: {
        label: 'Undo',
        onClick: () => {
          undo();
          add(d);
          open(d);
        },
      },
    });
  };

  return {
    drafts: drafts.filter((d) => !empty(d)),
    writing: drafts.find((d) => d.id === writing) ?? null,
    /** The reply being written in a conversation, if any. */
    replyIn: (c: string) => drafts.find((d) => d.conversation === c) ?? null,
    saved,
    open,
    compose,
    reply,
    update,
    close,
    discard,
    send,
    /** Leaves the main-area draft, e.g. for another folder. */
    leave: () => writing && close(writing),
  };
}

export type Compose = ReturnType<typeof useCompose>;
