// The editor's document, turned into the typed blocks messages are made of.
import type { JSONContent } from '@tiptap/react';
import type { Block, Inline } from './model';

function inline(nodes: JSONContent[] = []): Inline[] {
  return nodes.flatMap((n): Inline[] => {
    if (n.type === 'hardBreak') return ['\n'];
    if (n.type !== 'text' || !n.text) return [];
    const marks = new Map((n.marks ?? []).map((m) => [m.type, m.attrs]));
    const href = marks.get('link')?.href as string | undefined;
    if (!marks.size) return [n.text];
    return [
      { text: n.text, href, bold: marks.has('bold') || undefined, italic: marks.has('italic') || undefined, code: marks.has('code') || undefined },
    ];
  });
}

/** A list item's text: its paragraphs run together. */
const item = (li: JSONContent) => (li.content ?? []).flatMap((p) => inline(p.content));

export function toBlocks(doc: JSONContent | null): Block[] {
  return (doc?.content ?? []).flatMap((n): Block[] => {
    switch (n.type) {
      case 'paragraph':
        return n.content?.length ? [{ kind: 'p', text: inline(n.content) }] : [];
      case 'bulletList':
      case 'orderedList':
        return [{ kind: n.type === 'bulletList' ? 'ul' : 'ol', items: (n.content ?? []).map(item) }];
      case 'blockquote':
        return [{ kind: 'quote', text: (n.content ?? []).flatMap((p) => inline(p.content)) }];
      default:
        return [];
    }
  });
}
