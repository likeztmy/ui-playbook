import { FileSpreadsheet, FileText, X } from 'lucide-react';
import type { CSSProperties } from 'react';
import { Tip } from '../../ui/Tooltip';
import type { DraftFile } from './draft';
import { fileType } from './model';
import s from './Uploads.module.scss';

const ic = { size: 16, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;

/** A draft's files: each card fills with its own upload, then says what it is. */
export function Uploads({ files, onRemove }: { files: DraftFile[]; onRemove: (id: string) => void }) {
  return (
    <ul className={s.uploads} aria-label="Attachments">
      {files.map((f) => {
        const up = f.progress !== undefined;
        const pct = Math.round((f.progress ?? 1) * 100);
        return (
          <li key={f.id} className={s.card} data-uploading={up ? '' : undefined}>
            <span
              className={s.icon}
              style={f.kind === 'image' ? ({ backgroundImage: `linear-gradient(160deg, ${f.tint})` } as CSSProperties) : undefined}
            >
              {f.kind === 'image' ? f.src && <img src={f.src} alt="" /> : f.kind === 'sheet' ? <FileSpreadsheet {...ic} /> : <FileText {...ic} />}
            </span>
            <span className={s.text}>
              <span className={s.name}>{f.name}</span>
              <span className={s.meta}>{up ? `Uploading · ${pct}%` : `${fileType(f)} · ${f.size}`}</span>
            </span>
            <Tip label={up ? 'Cancel upload' : 'Remove'}>
              <button
                type="button"
                className={s.remove}
                aria-label={`${up ? 'Cancel upload of' : 'Remove'} ${f.name}`}
                onClick={() => onRemove(f.id)}
              >
                <X size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />
              </button>
            </Tip>
            {up && (
              <span
                className={s.bar}
                role="progressbar"
                aria-label={`Uploading ${f.name}`}
                aria-valuenow={pct}
                aria-valuemin={0}
                aria-valuemax={100}
                style={{ '--p': f.progress } as CSSProperties}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}
