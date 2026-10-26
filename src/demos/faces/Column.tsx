import { useState } from 'react';
import { Checkbox } from '../../ui/Checkbox';
import { Avatar } from '../post/Avatar';
import { Compare } from '../shell';
import { FaceRow } from './FaceRow';
import { INBOX } from './data';
import s from './faces.module.scss';

const ROWS = INBOX.slice(0, 9);

/**
 * Rows you can tick. `before` is the common way: faces only for people, the companies' text starting at
 * the edge, and the checkbox in the face's place, which every face gives up once one row is ticked. The
 * After gives the checkbox a column of its own, before the face.
 */
function Ticking({ before }: { before?: boolean }) {
  const [ticked, setTicked] = useState<string[]>([]);
  const selecting = ticked.length > 0;
  return (
    <div className={s.column} data-selecting={selecting ? '' : undefined}>
      {ROWS.map((r) => {
        const on = ticked.includes(r.id);
        const box = (
          <Checkbox
            aria-label={`Select ${r.subject}`}
            checked={on}
            onCheckedChange={(v) => setTicked((t) => (v ? [...t, r.id] : t.filter((x) => x !== r.id)))}
          />
        );
        if (!before) return <FaceRow key={r.id} row={r} check={<span data-on={on ? '' : undefined}>{box}</span>} />;
        const face = r.org ? null : <Avatar id={r.face} size="sm" />;
        const lead = (
          <span className={s.swap} data-show={on || selecting ? 'check' : undefined}>
            <span className={s.swapFace}>{face}</span>
            <span className={s.swapCheck}>{box}</span>
          </span>
        );
        return <FaceRow key={r.id} row={r} lead={r.org && !selecting ? 'none' : lead} />;
      })}
    </div>
  );
}

/** Faces where only some rows have them and selection hides them, against a column that's always there. */
export function FacesColumn() {
  return (
    <Compare
      stacked
      height={0}
      before={<Ticking before />}
      after={<Ticking />}
      beforeNote="Faces on people’s rows only, so the text starts in two places down the list. Tick a row and every face turns into a checkbox, just when you’re picking messages by who sent them."
      afterNote="Every row keeps a mark in one column: people in circles, companies on grey squares. The checkbox has a column of its own before the face, shown where the pointer rests and on every row once you’re selecting, so no face ever gives way."
    />
  );
}
