import { ChevronLeft, Ellipsis, Trash2 } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { Button } from '../../ui/Button';
import { Tip, TipGroup } from '../../ui/Tooltip';
import { Attachments } from './Attachments';
import { Blocks } from './Blocks';
import type { Editor } from '@tiptap/react';
import type { BodyHandle } from './Body';
import { empty, valid, type Draft } from './draft';
import { FormatBar } from './FormatBar';
import { person } from './people';
import { RecipientField } from './RecipientField';
import type { Compose } from './useCompose';
import s from './Composer.module.scss';

// Once fetched, the editor renders at once; lazy() would still suspend for a render, and the keys
// typed in it would be lost.
let Loaded: (typeof import('./Body'))['default'] | null = null;
const loadBody = () => import('./Body').then((m) => ((Loaded = m.default), m));
const Lazy = lazy(loadBody);

/**
 * Fetches the editor as soon as the app is up, after its first render: reading never waits for it,
 * and it's in hand before anyone writes, so keys typed straight after R land in the body.
 */
export const preloadBody = () => void loadBody();

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

type Props = {
  d: Draft;
  compose: Compose;
  /** A new message in the main area, with its own bar; otherwise a reply at the foot of its conversation. */
  page?: boolean;
  onBack?: () => void;
};

/** Writing one message: who to, (for a new one) the subject, the body, and Send. */
export function Composer({ d, compose, page, onBack }: Props) {
  const [cc, setCc] = useState(d.cc.length > 0);
  const [bcc, setBcc] = useState(d.bcc.length > 0);
  const [error, setError] = useState<string | null>(null);
  const [quoted, setQuoted] = useState(false);
  const toInput = useRef<HTMLInputElement>(null);
  const body = useRef<BodyHandle>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  // Chosen once: switching from the lazy wrapper to the loaded editor would remount it.
  const [Body] = useState(() => Loaded ?? Lazy);
  // Send reads the draft as it is now, after a chip made by leaving a field has landed.
  const live = useRef({ d, compose });
  live.current = { d, compose };

  // A reply starts in its body; a new message or a forward needs someone to send it to first.
  const startInTo = d.kind === 'forward' || (d.kind === 'new' && !d.to.length);
  useEffect(() => {
    if (startInTo) toInput.current?.focus();
  }, []);

  const set = (patch: Partial<Draft>) => {
    setError(null);
    compose.update(d.id, patch);
  };

  const send = () => {
    const { d, compose } = live.current;
    const all = [...d.to, ...d.cc, ...d.bcc];
    const bad = all.filter((a) => !valid(person(a).email));
    // Names the address, so the message doesn't lean on the chip's colour alone.
    const problem = !all.length
      ? 'Add a recipient'
      : bad.length === 1
        ? `${bad[0]} isn’t a complete address`
        : bad.length
          ? `${bad.length} addresses aren’t complete`
          : null;
    if (problem) {
      setError(problem);
      toInput.current?.focus();
      return;
    }
    compose.send(d.id);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    // Keys from a popover portalled out of the composer (the link's) are that popover's.
    if (!(e.currentTarget as HTMLElement).contains(e.target as Node)) return;
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      // Whatever is half-typed in a recipient field becomes a chip first.
      (document.activeElement as HTMLElement | null)?.blur();
      setTimeout(send);
    } else if (e.key === 'Escape' && page) {
      e.preventDefault();
      onBack?.();
    }
  };

  const saved = !empty(d) && compose.saved >= d.edited;

  const fields = (
    <>
      <RecipientField
        label="To"
        value={d.to}
        onChange={(to) => set({ to })}
        inputRef={toInput}
        error={error}
        trailing={
          (!cc || !bcc) && (
            <span className={s.more}>
              {!cc && (
                <Button variant="ghost" size="sm" onClick={() => setCc(true)}>
                  Cc
                </Button>
              )}
              {!bcc && (
                <Button variant="ghost" size="sm" onClick={() => setBcc(true)}>
                  Bcc
                </Button>
              )}
            </span>
          )
        }
      />
      {cc && <RecipientField label="Cc" value={d.cc} onChange={(v) => set({ cc: v })} />}
      {bcc && <RecipientField label="Bcc" value={d.bcc} onChange={(v) => set({ bcc: v })} />}
      {page && (
        // A label in the recipients' column, so every value starts on one line.
        <label className={s.subject}>
          <span className={s.label}>Subject</span>
          <input value={d.subject} onChange={(e) => set({ subject: e.target.value })} />
        </label>
      )}
      {/* The box holds its height while the editor loads, so nothing below it moves. */}
      <Suspense
        fallback={
          <div
            className={s.loading}
            tabIndex={-1}
            ref={(el) => {
              if (!startInTo) el?.focus();
            }}
          />
        }
      >
        <Body handle={body} content={d.body} autoFocus={!startInTo} onEditor={setEditor} onChange={(doc, text) => set({ body: doc, text })} />
      </Suspense>
      {d.quoted && (
        <>
          <Tip label={quoted ? 'Hide quoted text' : 'Show quoted text'}>
            <button
              type="button"
              className={s.fold}
              aria-label={quoted ? 'Hide quoted text' : 'Show quoted text'}
              aria-expanded={quoted}
              onClick={() => setQuoted((q) => !q)}
            >
              <Ellipsis {...ic} />
            </button>
          </Tip>
          {quoted && <Blocks blocks={d.quoted} className={s.quoted} />}
        </>
      )}
      {d.attachments && <Attachments files={d.attachments} />}
    </>
  );

  const footer = (
    <TipGroup>
      <div className={s.footer}>
        <Tip label="Send" keys={['⌘', '↵']}>
          <Button variant="primary" onClick={send}>
            Send
          </Button>
        </Tip>
        <FormatBar editor={editor} />
        <span className={s.status} aria-live="polite">
          {saved ? 'Saved' : ''}
        </span>
        <Tip label="Discard draft">
          <Button variant="ghost" icon aria-label="Discard draft" onClick={() => compose.discard(d.id)}>
            <Trash2 {...ic} />
          </Button>
        </Tip>
      </div>
    </TipGroup>
  );

  if (!page)
    return (
      <section className={s.inline} aria-label={d.kind === 'forward' ? 'Forward' : 'Reply'} onKeyDown={onKeyDown}>
        {fields}
        {footer}
      </section>
    );

  return (
    <section className={s.page} aria-label="New message" onKeyDown={onKeyDown}>
      <div className={s.bar}>
        <Tip label="Back" keys={['Esc']}>
          <Button variant="ghost" icon aria-label="Back" onClick={onBack}>
            <ChevronLeft {...ic} />
          </Button>
        </Tip>
        <h1 className={s.title}>{d.subject.trim() || 'New message'}</h1>
      </div>
      <div className={s.scroll}>
        <div className={s.column}>{fields}</div>
      </div>
      <div className={s.foot}>{footer}</div>
    </section>
  );
}
