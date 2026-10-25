import { FileSpreadsheet, FileText } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Dialog } from '../../ui/Dialog';
import type { Attachment } from './model';
import s from './Attachments.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** An image's placeholder: its colours, at the given ratio. */
const swatch = (a: Attachment) => ({ backgroundImage: `linear-gradient(160deg, ${a.tint})` });

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
            <button key={f.name} type="button" className={s.thumb} aria-label={`Open ${f.name}`} style={swatch(f)} onClick={() => setViewing(f)} />
          ))}
        </div>
      )}
      {others.map((f) => (
        <div key={f.name} className={s.card}>
          <span className={s.icon}>{f.kind === 'sheet' ? <FileSpreadsheet {...ic} /> : <FileText {...ic} />}</span>
          <span className={s.text}>
            <span className={s.name}>{f.name}</span>
            <span className={s.meta}>
              {f.kind.toUpperCase()} · {f.size}
            </span>
          </span>
        </div>
      ))}
      <Dialog.Root open={!!viewing} onOpenChange={(o) => !o && setViewing(null)}>
        {viewing && (
          <Dialog.Popup title={viewing.name} actions={<Dialog.Close render={<Button />}>Close</Dialog.Close>}>
            <div className={s.large} role="img" aria-label={viewing.name} style={swatch(viewing)} />
          </Dialog.Popup>
        )}
      </Dialog.Root>
    </div>
  );
}
