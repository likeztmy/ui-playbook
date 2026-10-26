import { FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Dialog } from '../../ui/Dialog';
import type { CSSProperties } from 'react';
import { fileType, type Attachment } from './model';
import s from './Attachments.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** An image's placeholder: its colours, at its own ratio, until the picture loads. */
const swatch = (a: Attachment) => ({ backgroundImage: `linear-gradient(160deg, ${a.tint})`, '--ratio': a.ratio ?? 4 / 3 }) as CSSProperties;

/** A message's files: images as thumbnails that open larger, the rest as cards. */
export function Attachments({ files }: { files: Attachment[] }) {
  const [viewing, setViewing] = useState<Attachment | null>(null);
  const images = files.filter((f) => f.kind === 'image');
  const others = files.filter((f) => f.kind !== 'image');
  return (
    <div className={s.attachments}>
      {images.length > 0 && (
        <div className={s.thumbs}>
          {images.map((f) => (
            <button key={f.name} type="button" className={s.thumb} aria-label={`Open ${f.name}`} style={swatch(f)} onClick={() => setViewing(f)}>
              {f.src && <img src={f.src} alt="" loading="lazy" decoding="async" />}
            </button>
          ))}
        </div>
      )}
      {others.map((f) => (
        <button key={f.name} type="button" className={s.card} aria-label={`Open ${f.name}`} onClick={() => setViewing(f)}>
          <span className={s.icon}>{f.kind === 'sheet' ? <FileSpreadsheet {...ic} /> : <FileText {...ic} />}</span>
          <span className={s.text}>
            <span className={s.name}>{f.name}</span>
            <span className={s.meta}>
              {fileType(f)} · {f.size}
            </span>
          </span>
        </button>
      ))}
      <Dialog.Root open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        {viewing && (
          <Dialog.Popup title={viewing.name} actions={<Dialog.Close render={<Button />}>Close</Dialog.Close>}>
            {viewing.kind !== 'image' ? (
              // A sample file has no pages to show; its first page is drawn in its shape.
              <figure className={s.figure}>
                <div className={s.page} data-kind={viewing.kind} role="img" aria-label={`First page of ${viewing.name}`}>
                  {Array.from({ length: viewing.kind === 'sheet' ? 8 : 9 }, (_, i) => (
                    <span key={i} />
                  ))}
                </div>
                <figcaption>
                  {fileType(viewing)} · {viewing.size}
                </figcaption>
              </figure>
            ) : (
              <figure className={s.figure}>
                <div
                  className={s.large}
                  role={viewing.src ? undefined : 'img'}
                  aria-label={viewing.src ? undefined : viewing.name}
                  style={swatch(viewing)}
                >
                  {viewing.src && <img src={viewing.src} alt={viewing.alt ?? viewing.name} decoding="async" />}
                </div>
                {viewing.alt && (
                  <figcaption>
                    {viewing.alt}
                    {viewing.credit && ` · ${viewing.credit}`}
                  </figcaption>
                )}
              </figure>
            )}
          </Dialog.Popup>
        )}
      </Dialog.Root>
    </div>
  );
}
