import type { ReactNode } from 'react';
import { cx } from '../../ui/cx';
import { Frame } from './Frame';
import s from '../shell.module.scss';

type GalleryProps = {
  /** What the gallery shows, when the heading above doesn't already say it. */
  label?: string;
  rows: { name: string; use: string; render: () => ReactNode }[];
  /** Text above each live instance, for instances that need the full width. */
  stacked?: boolean;
};

/** Variants side by side: what each one is for, and a live instance of it. */
export function Gallery({ label, rows, stacked }: GalleryProps) {
  return (
    <Frame label={label} height={0}>
      <div className={s.gallery}>
        {rows.map((row) => (
          <div key={row.name} className={cx(s.galleryRow, stacked && s.stacked)}>
            <div className={s.galleryText}>
              <span className={s.galleryName}>{row.name}</span>
              <span className={s.galleryUse}>{row.use}</span>
            </div>
            <div className={s.galleryLive}>{row.render()}</div>
          </div>
        ))}
      </div>
    </Frame>
  );
}
