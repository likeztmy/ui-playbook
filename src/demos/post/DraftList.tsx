import { PencilLine, Trash2 } from 'lucide-react';
import { useRef, type CSSProperties } from 'react';
import { Button } from '../../ui/Button';
import { Tip } from '../../ui/Tooltip';
import type { Draft } from './draft';
import { participants } from './people';
import { useFromWidth, type Chrome } from './List';
import type { Compose } from './useCompose';
import s from './List.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

const when = (ms: number) => {
  const d = new Date(ms);
  return d.toDateString() === new Date().toDateString()
    ? `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`
    : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

/** One draft, on the list's columns: "Draft" and who it's to, the subject and its start, when it last changed. */
function DraftLine({ d, compose }: { d: Draft; compose: Compose }) {
  const to = [...d.to, ...d.cc, ...d.bcc];
  return (
    <div className={s.line} role="listitem" data-row={d.id}>
      <span />
      <button type="button" className={s.main} onClick={() => compose.open(d)}>
        <span className={s.from} data-from="">
          <span className={s.draft}>
            <PencilLine size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
            Draft
          </span>
          {to.length > 0 && <span className={s.names}>To {participants(to)}</span>}
        </span>
        <span className={s.text}>
          <span className={s.subject}>
            {d.kind === 'new' ? d.subject.trim() || '(no subject)' : `${d.kind === 'forward' ? '' : 'Re: '}${d.subject}`}
          </span>
          <span className={s.snippet}>{d.text}</span>
        </span>
        <span className={s.time}>{when(d.edited)}</span>
      </button>
      <span className={s.actions}>
        <Tip label="Discard draft">
          <Button variant="ghost" size="sm" icon aria-label="Discard draft" onClick={() => compose.discard(d.id)}>
            <Trash2 {...ic} />
          </Button>
        </Tip>
      </span>
    </div>
  );
}

/** The Drafts folder: what's being written, newest first. */
export function DraftList({ compose, chrome }: { compose: Compose; chrome: Chrome }) {
  const drafts = [...compose.drafts].sort((a, b) => b.edited - a.edited);
  const box = useRef<HTMLDivElement>(null);
  // Subjects start where the senders end, measured as the other lists are.
  const fromWidth = useFromWidth(box, [drafts.length]);
  return (
    <section className={s.list} aria-label="Drafts">
      <div className={s.bar}>
        <span className={s.check} />
        <span className={s.title}>Drafts</span>
        <span className={s.where}>{chrome.folders}</span>
        <span className={s.barActions}>{chrome.actions}</span>
      </div>
      {chrome.outbox}
      <div ref={box} className={s.rows} role="list" style={{ '--from': `${fromWidth}px` } as CSSProperties}>
        {drafts.map((d) => (
          <DraftLine key={d.id} d={d} compose={compose} />
        ))}
        {drafts.length === 0 && (
          <div className={s.empty}>
            <p>No drafts.</p>
            <Button size="sm" onClick={compose.compose}>
              Compose
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
