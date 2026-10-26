// Post, the In practice mail app: its data types and the pure helpers that read them.

export type Folder = 'inbox' | 'starred' | 'sent' | 'drafts' | 'archive';

export type Person = {
  id: string;
  name: string;
  email: string;
  /** The reader's own account. */
  me?: boolean;
  /** A company or service rather than a person: named in full, never by first name. */
  org?: boolean;
};

/** A run of text, plain or with one mark. */
export type Inline = string | { text: string; href?: string; bold?: boolean; italic?: boolean; code?: boolean };

/** One block of a message's body. Typed, so nothing arrives as raw HTML. */
export type Block =
  | { kind: 'p'; text: Inline[] }
  | { kind: 'h'; text: string }
  | { kind: 'ul' | 'ol'; items: Inline[][] }
  | { kind: 'quote'; text: Inline[] }
  | { kind: 'code'; text: string }
  /** `tint` is the placeholder's colours, shown until `src` loads (or instead of it); `credit` follows the alt in the caption. */
  | { kind: 'image'; alt: string; tint: string; ratio: number; src?: string; credit?: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'rule' }
  | { kind: 'signature'; lines: string[] };

export type Attachment = {
  name: string;
  size: string;
  kind: 'pdf' | 'image' | 'doc' | 'sheet';
  /** For an image: the colours of its placeholder, shown until `src` loads. */
  tint?: string;
  src?: string;
  /** For an image: what it shows, its width over height, and where it comes from. */
  alt?: string;
  ratio?: number;
  credit?: string;
};

export type Message = {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  /** As shown in the message's header, e.g. "Thu 9:41". */
  at: string;
  body: Block[];
  /** The earlier text a reply quotes, folded until asked for. */
  quoted?: Block[];
  /** Whose message the quote is, and when it was sent, to name it on its fold. */
  quotes?: { from: string; at: string };
  attachments?: Attachment[];
  unread?: boolean;
  /** A designed newsletter: shown in its own box, at its own width. */
  letter?: boolean;
};

export type Conversation = {
  id: string;
  subject: string;
  folder: Exclude<Folder, 'starred' | 'drafts'>;
  starred?: boolean;
  /** Days ago the newest message came; 0 is today. */
  day: number;
  /** As shown in the list: a time today, a weekday this week, a date before. */
  time: string;
  messages: Message[];
};

/** A file's type as people name it: its extension, "PDF", "TXT", "XLSX". */
export const fileType = (a: Attachment) => (a.name.includes('.') ? a.name.split('.').pop()!.toUpperCase() : a.kind.toUpperCase());

export const unread = (c: Conversation) => c.messages.some((m) => m.unread);

// The sample mailbox's "now": Thursday at 10:00, just after its newest mail, running on from when the
// page opened. What's sent or arrives here is stamped by it, so it sorts after what it answers.
const OPENED = Date.now();
export const clock = () => {
  const m = 10 * 60 + Math.floor((Date.now() - OPENED) / 60000);
  return `${Math.floor(m / 60) % 24}:${String(m % 60).padStart(2, '0')}`;
};
export const TODAY = 'Thu';

/** Minutes into the day of a list time like "9:41", or null for "Tue" and "17 Oct". */
const minutes = (t: string) => {
  const m = /^(\d{1,2}):(\d{2})$/.exec(t);
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
};

/** Newest first: by day, then by time within a day. */
export const newest = (a: Conversation, b: Conversation) => a.day - b.day || (minutes(b.time) ?? 0) - (minutes(a.time) ?? 0);
export const latest = (c: Conversation) => c.messages[c.messages.length - 1];
/** Sent holds every conversation you wrote in, as Gmail's does; drafts aren't conversations. */
export const inFolder = (c: Conversation, f: Folder) =>
  f === 'starred' ? !!c.starred : f === 'sent' ? c.folder === 'sent' || c.messages.some((m) => m.from === 'me') : c.folder === f;

/** The date section a conversation falls in. */
export const section = (c: Conversation) => (c.day === 0 ? 'Today' : c.day === 1 ? 'Yesterday' : c.day < 7 ? 'This week' : 'Earlier');

/** A conversation's plain text, for search and the list's snippet. */
export const plain = (blocks: Block[]): string =>
  blocks
    .map((b) => {
      const inline = (t: Inline[]) => t.map((x) => (typeof x === 'string' ? x : x.text)).join('');
      if (b.kind === 'p' || b.kind === 'quote') return inline(b.text);
      if (b.kind === 'h' || b.kind === 'code') return b.text;
      if (b.kind === 'ul' || b.kind === 'ol') return b.items.map(inline).join(' · ');
      if (b.kind === 'table') return [...b.head, ...b.rows.flat()].join(' ');
      return '';
    })
    .filter(Boolean)
    // A block that ends without a stop (a list item, a heading) gets one, so the next doesn't run on.
    .reduce((all, t) => (!all ? t : /[.!?:,;]$/.test(all) ? `${all} ${t}` : `${all} · ${t}`), '');

/** The list's preview of a message: what was written in prose, not table cells, headings or signatures. */
export const snippet = (blocks: Block[]) => plain(blocks.filter((b) => b.kind === 'p' || b.kind === 'quote' || b.kind === 'ul' || b.kind === 'ol'));
