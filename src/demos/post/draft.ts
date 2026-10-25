// A message being written: what it is, how a reply or forward starts, and where drafts are kept.
import type { JSONContent } from '@tiptap/react';
import { latest, type Attachment, type Block, type Conversation } from './model';
import { person } from './people';

export type DraftKind = 'new' | 'reply' | 'replyAll' | 'forward';

export type Draft = {
  id: string;
  kind: DraftKind;
  /** The conversation a reply or forward belongs to. */
  conversation?: string;
  /** Addresses, as typed or picked. */
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  /** The editor's document; null until something is typed. */
  body: JSONContent | null;
  /** The body as plain text, for previews and for telling an empty draft. */
  text: string;
  /** What a reply quotes or a forward carries, behind "···". */
  quoted?: Block[];
  attachments?: Attachment[];
  /** When it last changed, ms. */
  edited: number;
};

let n = 0;
const id = () => `draft-${Date.now().toString(36)}-${n++}`;

export const blank = (kind: DraftKind = 'new', fields: Partial<Draft> = {}): Draft => ({
  id: id(),
  kind,
  to: [],
  cc: [],
  bcc: [],
  subject: '',
  body: null,
  text: '',
  edited: Date.now(),
  ...fields,
});

const address = (pid: string) => person(pid).email;
const notMe = (pid: string) => !person(pid).me;

/** A reply answers the newest message: its sender, or, for your own message, whoever you wrote to. Reply all adds everyone else on it. */
export function replyTo(c: Conversation, kind: Exclude<DraftKind, 'new'>): Draft {
  const m = latest(c);
  const fromMe = person(m.from).me;
  if (kind === 'forward') return blank(kind, { conversation: c.id, subject: `Fwd: ${c.subject}`, quoted: m.body, attachments: m.attachments });
  const to = fromMe ? m.to : [m.from];
  const others = kind === 'replyAll' ? [...(fromMe ? [] : m.to), ...(m.cc ?? [])].filter((p) => notMe(p) && !to.includes(p)) : [];
  return blank(kind, { conversation: c.id, to: to.filter(notMe).map(address), cc: others.map(address), subject: c.subject, quoted: m.body });
}

/** Nothing written and no one to send it to: closing it leaves no draft. */
export const empty = (d: Draft) => !d.text.trim() && !d.to.length && !d.cc.length && !d.bcc.length && !d.subject.trim() && d.kind === 'new';

const VALID = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const valid = (a: string) => VALID.test(a);

// Drafts outlive a reload; the rest of the sample mail starts fresh.
const KEY = 'post:drafts';

export function loadDrafts(): Draft[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Draft[]) : [];
  } catch {
    return [];
  }
}

export function storeDrafts(drafts: Draft[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(drafts.filter((d) => !empty(d))));
  } catch {
    // Storage blocked or full: drafts last for this visit only.
  }
}
