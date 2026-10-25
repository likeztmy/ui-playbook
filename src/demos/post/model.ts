// Post, the In practice mail app: its data types and the pure helpers that read them.

export type Folder = 'inbox' | 'starred' | 'sent' | 'archive';

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
export type Inline = string | { text: string; href?: string; bold?: boolean; code?: boolean };

/** One block of a message's body. Typed, so nothing arrives as raw HTML. */
export type Block =
  | { kind: 'p'; text: Inline[] }
  | { kind: 'h'; text: string }
  | { kind: 'ul' | 'ol'; items: Inline[][] }
  | { kind: 'quote'; text: Inline[] }
  | { kind: 'code'; text: string }
  | { kind: 'image'; alt: string; tint: string; ratio: number }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'rule' }
  | { kind: 'signature'; lines: string[] };

export type Attachment = {
  name: string;
  size: string;
  kind: 'pdf' | 'image' | 'doc' | 'sheet';
  /** For an image: the colours of its placeholder. */
  tint?: string;
};

export type Message = {
  id: string;
  from: string;
  to: string[];
  cc?: string[];
  /** As shown in the message's header, e.g. "Thu 9:41". */
  at: string;
  body: Block[];
  /** The earlier text a reply quotes, folded behind "···". */
  quoted?: Block[];
  attachments?: Attachment[];
  unread?: boolean;
  /** A designed newsletter: shown in its own box, at its own width. */
  letter?: boolean;
};

export type Conversation = {
  id: string;
  subject: string;
  folder: Exclude<Folder, 'starred'>;
  starred?: boolean;
  /** Days ago the newest message came; 0 is today. */
  day: number;
  /** As shown in the list: a time today, a weekday this week, a date before. */
  time: string;
  messages: Message[];
};

export const unread = (c: Conversation) => c.messages.some((m) => m.unread);
export const latest = (c: Conversation) => c.messages[c.messages.length - 1];
export const inFolder = (c: Conversation, f: Folder) => (f === 'starred' ? !!c.starred : c.folder === f);

/** The date section a conversation falls in. */
export const section = (c: Conversation) =>
  c.day === 0 ? 'Today' : c.day === 1 ? 'Yesterday' : c.day < 7 ? 'This week' : 'Earlier';

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
    .reduce((all, t) => (!all ? t : /[.!?:]$/.test(all) ? `${all} ${t}` : `${all} · ${t}`), '');

/** The list's preview of a message: what was written in prose, not table cells, headings or signatures. */
export const snippet = (blocks: Block[]) => plain(blocks.filter((b) => b.kind === 'p' || b.kind === 'quote' || b.kind === 'ul' || b.kind === 'ol'));
