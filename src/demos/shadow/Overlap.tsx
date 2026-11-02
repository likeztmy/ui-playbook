import { Archive, Copy, Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { cx } from '../../ui/cx';
import { menuClasses as ms, RowContent } from '../../ui/Menu';
import { Compare } from '../shell';
import s from './shadow.module.scss';

const FILES = ['Q4 roadmap', 'Brand guide', 'Metrics', 'Onboarding', 'Pricing', 'Hiring plan'];

/**
 * A file list with a row's menu open. `everywhere` gives every part its own shadow, as a page does
 * when shadow is a style; otherwise only the menu, the one thing lying over the rest, casts one.
 * The menu is drawn from Menu's own parts, so it keeps Menu's rows, icons and last group.
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
          <Ellipsis className={s.fileMore} size={16} aria-hidden />
        </div>
      ))}
      <div className={cx(ms.popup, s.fileMenu)} role="presentation">
        <div className={ms.item}>
          <RowContent icon={Pencil}>Rename</RowContent>
        </div>
        <div className={ms.item}>
          <RowContent icon={Copy}>Duplicate</RowContent>
        </div>
        <div className={ms.item}>
          <RowContent icon={Archive}>Archive</RowContent>
        </div>
        <div className={ms.separator} />
        <div className={cx(ms.item, ms.danger)}>
          <RowContent icon={Trash2}>Delete</RowContent>
        </div>
      </div>
    </div>
  );
}

/** The same open menu, once among shadows everywhere, once the only thing that casts one. */
export function ShadowOverlap() {
  return (
    <Compare
      beforeLabel="Shadows on everything"
      afterLabel="Shadow on the menu only"
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
