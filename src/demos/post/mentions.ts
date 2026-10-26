// @mentions in the body: "@" or "+" and a name picks a contact, who joins To, as Gmail and Outlook do.
import Mention from '@tiptap/extension-mention';
import { PluginKey } from '@tiptap/pm/state';
import { useMemo, useRef, useState } from 'react';
import type { Person } from './model';
import { findContacts } from './people';

type Open = {
  items: Person[];
  active: number;
  /** Where the caret's query is, in viewport coordinates. */
  rect: DOMRect | null;
  insert: (attrs: { id: string; label: string }) => void;
};

/** The extension, and the suggestion list's state for the body to draw. */
export function useMentions(onMention: (email: string) => void) {
  const [menu, setMenu] = useState<Open | null>(null);
  // The extension is made once; it reads these as they are now.
  const live = useRef({ menu, onMention });
  live.current = { menu, onMention };

  const pick = (p: Person) => {
    live.current.menu?.insert({ id: p.email, label: p.name });
    live.current.onMention(p.email);
  };

  const extension = useMemo(
    () =>
      Mention.configure({
        HTMLAttributes: { 'data-mention': '' },
        renderText: ({ node }) => `${node.attrs.mentionSuggestionChar ?? '@'}${node.attrs.label}`,
        suggestions: ['@', '+'].map((char) => ({
          char,
          pluginKey: new PluginKey(`mention-${char}`),
          items: ({ query }: { query: string }) => findContacts(query),
          render: () => {
            const show = (p: { items: Person[]; clientRect?: (() => DOMRect | null) | null; command: Open['insert'] }) =>
              setMenu((m) =>
                p.items.length
                  ? { items: p.items, active: Math.min(m?.active ?? 0, p.items.length - 1), rect: p.clientRect?.() ?? null, insert: p.command }
                  : null,
              );
            return {
              onStart: show,
              onUpdate: show,
              onExit: () => setMenu(null),
              onKeyDown: ({ event }: { event: KeyboardEvent }) => {
                const m = live.current.menu;
                if (!m) return false;
                if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                  const by = event.key === 'ArrowDown' ? 1 : -1;
                  setMenu({ ...m, active: (m.active + by + m.items.length) % m.items.length });
                  return true;
                }
                if (event.key === 'Enter' || event.key === 'Tab') {
                  pick(m.items[m.active]);
                  return true;
                }
                if (event.key === 'Escape') {
                  // Closes the list only: the composer around it doesn't hear this Esc.
                  event.stopPropagation();
                  setMenu(null);
                  return true;
                }
                return false;
              },
            };
          },
        })),
      }),
    [],
  );

  return { extension, menu, pick, setActive: (active: number) => menu && setMenu({ ...menu, active }) };
}
