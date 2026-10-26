import { ChevronLeft, Paperclip, Trash2 } from 'lucide-react';
import { lazy, Suspense, useEffect, useRef, useState, type DragEvent, type KeyboardEvent } from 'react';
import { Button } from '../../ui/Button';
import { Tip, TipGroup } from '../../ui/Tooltip';
import type { Editor } from '@tiptap/react';
import type { BodyHandle } from './Body';
import { empty, valid, type Draft } from './draft';
import { FormatBar } from './FormatBar';
import { QuotedFold } from './QuotedFold';
import { Uploads } from './Uploads';
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
  const toInput = useRef<HTMLInputElement>(null);
  const body = useRef<BodyHandle>(null);
  const [editor, setEditor] = useState<Editor | null>(null);
  const picker = useRef<HTMLInputElement>(null);
  // Files dragged over the composer: entering and leaving its children fire too, so count.
  const [dragging, setDragging] = useState(0);
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

  // A mentioned person joins To, unless they're on the message already.
  const mention = (email: string) => {
    const { d } = live.current;
    if (![...d.to, ...d.cc, ...d.bcc].includes(email)) set({ to: [...d.to, email] });
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

  const files = (e: DragEvent) => e.dataTransfer.types.includes('Files');
  const drop = {
    onDragEnter: (e: DragEvent) => files(e) && setDragging((n) => n + 1),
    onDragLeave: (e: DragEvent) => files(e) && setDragging((n) => Math.max(0, n - 1)),
    onDragOver: (e: DragEvent) => files(e) && e.preventDefault(),
    onDrop: (e: DragEvent) => {
      if (!files(e)) return;
      e.preventDefault();
      setDragging(0);
      compose.attach(d.id, [...e.dataTransfer.files]);
    },
    'data-dragging': dragging > 0 ? '' : undefined,
  };
  const dropHint = dragging > 0 && (
    <div className={s.drop} data-overlay>
      Drop to attach
    </div>
  );

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
        <Body
          handle={body}
          content={d.body}
          autoFocus={!startInTo}
          onEditor={setEditor}
          onMention={mention}
          onChange={(doc, text) => set({ body: doc, text })}
        />
      </Suspense>
      {d.quoted && <QuotedFold blocks={d.quoted} quotes={d.quotes} />}
      {!!d.attachments?.length && <Uploads files={d.attachments} onRemove={(f) => compose.detach(d.id, f)} />}
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
        {/* On a phone the row takes a line of its own, so its tools keep their size. */}
        <span className={s.format}>
          <FormatBar editor={editor} />
        </span>
        <Tip label="Attach files">
          <Button variant="ghost" icon aria-label="Attach files" onClick={() => picker.current?.click()}>
            <Paperclip {...ic} />
          </Button>
        </Tip>
        <input
          ref={picker}
          type="file"
          multiple
          hidden
          aria-label="Files to attach"
          onChange={(e) => {
            if (e.target.files?.length) compose.attach(d.id, [...e.target.files]);
            e.target.value = '';
          }}
        />
        <span className={s.status} aria-live="polite">
          {compose.waiting(d.id) ? (
            <>
              Sends when the files are up ·{' '}
              <button type="button" className={s.cancel} aria-label="Cancel sending" onClick={() => compose.cancelWait(d.id)}>
                Cancel
              </button>
            </>
          ) : saved ? (
            'Saved'
          ) : (
            ''
          )}
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
      <section className={s.inline} aria-label={d.kind === 'forward' ? 'Forward' : 'Reply'} onKeyDown={onKeyDown} {...drop}>
        {dropHint}
        {fields}
        {footer}
      </section>
    );

  return (
    <section className={s.page} aria-label="New message" onKeyDown={onKeyDown} {...drop}>
      {dropHint}
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
