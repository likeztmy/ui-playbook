import { ArrowUpRight, Check, Star, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Compare } from '../shell';
import { IconButton } from './IconButton';
import s from './icon.module.scss';

/** One issue's quick actions: the marks typed as characters, or drawn by the icon library. */
function Panel({ typed }: { typed?: boolean }) {
  return (
    <div className={s.panel}>
      <div className={s.panelHead}>
        <span>LIN-142</span>
        {typed ? (
          <Button variant="ghost" icon>
            ✕
          </Button>
        ) : (
          <IconButton label="Close" Icon={X} />
        )}
      </div>
      <button type="button" className={s.action}>
        {typed ? <span className={s.glyph}>✓</span> : <Check size={16} aria-hidden />}
        Mark as done
      </button>
      <button type="button" className={s.action}>
        {typed ? <span className={s.glyph}>★</span> : <Star size={16} aria-hidden />}
        Add to favourites
      </button>
      <a href="#" className={s.action} onClick={(e) => e.preventDefault()}>
        Open in new tab
        {typed ? <span className={s.glyph}>↗</span> : <ArrowUpRight size={16} aria-hidden />}
      </a>
    </div>
  );
}

export function IconSymbols() {
  return (
    <Compare
      height={220}
      beforeLabel="Typed as characters"
      afterLabel="From the library"
      before={<Panel typed />}
      after={<Panel />}
      beforeNote={
        <>
          A character is text, so it joins the control’s name and is read out by whatever name the screen reader’s dictionary has: the link becomes
          “Open in new tab up-right arrow” in <a href="https://github.com/unicode-org/cldr/blob/main/common/annotations/en.xml">CLDR</a>’s words, and
          ✓, ★ and ✕ have no English name there at all. Geist contains none of them, so each is drawn by a font the page never chose, at that font’s
          weight.
        </>
      }
      afterNote={
        <>
          The icons are silent (<a href="https://www.w3.org/TR/accname-1.2/">accname</a> skips anything <code>aria-hidden</code>), so the name is the
          words you wrote: <em>Close</em>, <em>Mark as done</em>. Same drawing, same stroke on every system.
        </>
      }
    />
  );
}
