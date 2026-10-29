import { Archive, CopyPlus, Pencil } from 'lucide-react';
import { Compare } from '../shell';
import s from './icon.module.scss';

const ROWS = [
  ['Rename', Pencil],
  ['Duplicate', CopyPlus],
  ['Archive', Archive],
] as const;

/** Three menu rows in 14px text, the icons at Lucide's default 24px or at 16px. */
function Rows({ size }: { size: 16 | 24 }) {
  return (
    <div className={s.rows}>
      {ROWS.map(([label, Icon]) => (
        <div key={label} className={s.row}>
          <Icon size={size} aria-hidden />
          {label}
        </div>
      ))}
    </div>
  );
}

export function IconWeight() {
  return (
    <Compare
      height={180}
      beforeLabel="24px, Lucide’s default"
      afterLabel="16px beside 14px text"
      before={<Rows size={24} />}
      after={<Rows size={16} />}
      beforeNote="Lucide draws a 2px line on a 24px grid. Left at 24px, that’s 2px against the 1.2px stems of 14px Geist: the icons are 1.7× heavier than the words and read first."
      afterNote={
        <>
          At 16px the line scales to 1.33px, within a twentieth of a pixel of Geist Regular’s stems.{' '}
          <a href="https://carbondesignsystem.com/elements/icons/usage/">Carbon</a> pairs 16 and 20px icons with 14 and 16px text, and asks you not to
          change the ratio.
        </>
      }
    />
  );
}
