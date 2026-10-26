import { Archive, Copy, Pencil, Trash2 } from 'lucide-react';
import { Compare } from '../shell';
import s from './shadow.module.scss';

const ic = { size: 14, strokeWidth: 1.5, nonScalingStroke: true, 'aria-hidden': true } as const;
const FILES = ['Q4 roadmap', 'Brand guide', 'Metrics', 'Onboarding'];

/**
 * A file list with a row's menu open. `everywhere` gives every part its own shadow, as a page does
 * when shadow is a style; otherwise only the menu, the one thing lying over the rest, casts one.
 */
function Files({ everywhere }: { everywhere?: boolean }) {
  return (
    <div className={s.files} data-everywhere={everywhere ? '' : undefined}>
      <div className={s.filesBar}>
        <span className={s.filesSearch}>Search files</span>
        <span className={s.filesButton}>New file</span>
      </div>
      {FILES.map((f, i) => (
        <div key={f} className={s.fileRow} data-open={i === 1 ? '' : undefined}>
          <span className={s.fileIcon} />
          <span>{f}</span>
          <span className={s.fileMore}>···</span>
        </div>
      ))}
      <div className={s.fileMenu} role="presentation">
        {[
          ['Rename', Pencil],
          ['Duplicate', Copy],
          ['Archive', Archive],
          ['Delete', Trash2],
        ].map(([label, Icon]) => {
          const I = Icon as typeof Pencil;
          return (
            <span key={label as string} className={s.fileMenuItem}>
              <I {...ic} />
              {label as string}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/** The same open menu, once among shadows everywhere, once the only thing that casts one. */
export function ShadowOverlap() {
  return (
    <Compare
      height={0}
      before={<Files everywhere />}
      after={<Files />}
      beforeNote="Every row, field and button casts a shadow, so the open menu is one more raised box among many: the eye has to read the page to find what’s on top."
      afterNote={
        <>
          Only the menu lies over anything, so only it casts a shadow, and it is found at once. Apple draws the same line: controls float on their own
          layer above the content, and “Don’t use Liquid Glass in the content layer” (
          <a href="https://developer.apple.com/design/human-interface-guidelines/materials">Apple, Materials</a>).
        </>
      }
    />
  );
}
