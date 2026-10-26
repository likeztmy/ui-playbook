import type { ReactNode } from 'react';
import type { Control } from './Shell';

/** How a decision plays in the app: it reads Post as it is now, and can hold a row as though the pointer rested on it. */
type Play = { get: () => Control; pin: (row: string | null) => void };

export type Decision = {
  /** What `data-spot` in the app it outlines once played. */
  spot: string;
  text: ReactNode;
  play: (p: Play) => Promise<void>;
};

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Back to the inbox at its top, with nothing open: every decision plays from the same place. */
async function inbox({ get }: Play) {
  get().compose.leave();
  get().post.go('inbox');
  await wait(50);
  get().root?.querySelector('[role="list"]')?.scrollTo({ top: 0 });
}

/** Scrolls the pane around `el` to centre it, leaving the page where it is. */
function reveal(el: Element | null | undefined) {
  let pane = el?.parentElement;
  while (pane && !/auto|scroll/.test(getComputedStyle(pane).overflowY)) pane = pane.parentElement;
  if (!el || !pane) return;
  const top = el.getBoundingClientRect().top - pane.getBoundingClientRect().top + pane.scrollTop - pane.clientHeight / 2;
  pane.scrollTo({ top, behavior: 'smooth' });
}

const row = (get: Play['get'], i: number) => get().root?.querySelectorAll<HTMLElement>('[data-row]')[i];

/** Each decision: what Post does, the principle it comes from, and how to play it. */
export const DECISIONS: Decision[] = [
  {
    spot: 'colour',
    text: (
      <>
        Unread is a blue dot on the row and a heavier line; blue means nothing else in the list.{' '}
        <a href="/principles/colour-means-one-thing">Colour means one thing</a>
      </>
    ),
    play: inbox,
  },
  {
    spot: 'sections',
    text: (
      <>
        Today, Yesterday, This week: each header has more space above than below, so it joins the rows it names, with no line.{' '}
        <a href="/principles/space-groups-by-ratio">Space groups by ratio</a>
      </>
    ),
    play: inbox,
  },
  {
    spot: 'dwell',
    text: (
      <>
        A row’s actions come once the pointer rests on it, beside the time, never over it: sweeping down the list changes nothing.{' '}
        <a href="/principles/hover-forgives">Hover forgives</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      const id = row(p.get, 1)?.dataset.row;
      if (id) p.pin(id);
    },
  },
  {
    spot: 'context',
    text: (
      <>
        Right-click a row for the same actions, where the pointer already is. <a href="/components/menu">Menu</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      const r = row(p.get, 2);
      const box = r?.getBoundingClientRect();
      if (r && box)
        r.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: box.left + 160, clientY: box.top + 22 }));
    },
  },
  {
    spot: 'archive',
    text: (
      <>
        Archive acts at once, and the toast offers Undo; nothing asks first. <a href="/components/toast">Toast: Undo instead of asking</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      const first = p.get().post.list[0];
      p.pin(first?.id ?? null);
      await wait(600);
      p.pin(null);
      if (first) p.get().post.archive([first.id]);
    },
  },
  {
    spot: 'arrive',
    text: (
      <>
        New mail waits behind “1 new message” rather than pushing the rows down under the pointer.{' '}
        <a href="/principles/nothing-shifts">Nothing shifts</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      p.get().post.arrive();
    },
  },
  {
    spot: 'run',
    text: (
      <>
        Earlier messages fold into one line that names who wrote them; names tell you whether to open it, a count doesn’t.{' '}
        <a href="/principles/where-the-eye-goes">Where the eye goes</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      p.get().post.show('roadmap');
      await wait(50);
    },
  },
  {
    spot: 'reply',
    text: (
      <>
        Where the reading ends, a reply is already waiting: typing in it is replying. <a href="/principles/the-faster-way">The faster way</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      p.get().post.show('roadmap');
      await wait(100);
      reveal(p.get().root?.querySelector('[data-spot~="reply"]'));
      await wait(300);
    },
  },
  {
    spot: 'undo',
    text: (
      <>
        A sent reply lands in its conversation saying it’s sending, with Undo there, where the eye already is.{' '}
        <a href="/principles/how-waiting-feels">How waiting feels</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      const { post, compose } = p.get();
      const c = post.mail.find((x) => x.id === 'lunch')!;
      post.show(c.id);
      compose.reply(c, 'reply');
      await wait(300);
      const d = p.get().compose.replyIn(c.id);
      if (!d) return;
      const text = 'Friday works. See you at 12:30.';
      p.get().compose.update(d.id, { text, body: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text }] }] } });
      await wait(400);
      p.get().compose.send(d.id);
      await wait(100);
      reveal(p.get().root?.querySelector('[data-spot~="undo"]'));
    },
  },
  {
    spot: 'search',
    text: (
      <>
        A search that finds nothing says what was searched and where, and offers all mail.{' '}
        <a href="/components/combobox">Combobox: an empty list says what was searched</a>
      </>
    ),
    play: async (p) => {
      await inbox(p);
      p.get().post.search('handover');
    },
  },
];
