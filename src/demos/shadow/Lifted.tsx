import type { CSSProperties } from 'react';
import s from './shadow.module.scss';

/** A card on a desk, lifted by the shadow it's given. `dark` sets the desk and card as dark mode does. */
export function Lifted({ shadow, surface, label = 'Q4 roadmap' }: { shadow: string; surface?: string; label?: string }) {
  return (
    <div className={s.desk}>
      <div className={s.card} style={{ boxShadow: shadow, background: surface } as CSSProperties}>
        <span className={s.thumb} aria-hidden />
        <span className={s.name}>{label}</span>
        <span className={s.meta}>Edited 2 hours ago</span>
      </div>
    </div>
  );
}
