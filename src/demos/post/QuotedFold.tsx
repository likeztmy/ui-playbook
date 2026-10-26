import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { Blocks } from './Blocks';
import type { Block } from './model';
import { whose } from './people';
import s from './QuotedFold.module.scss';

const capital = (t: string) => t[0].toUpperCase() + t.slice(1);

/** A reply's quote, folded until asked for, named for whose message it is: the label promises what opening shows. */
export function QuotedFold({ blocks, quotes }: { blocks: Block[]; quotes?: { from: string; at: string } }) {
  const [open, setOpen] = useState(false);
  const what = quotes ? `${whose(quotes.from)} message` : 'quoted text';
  return (
    <>
      <button type="button" className={s.fold} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <ChevronRight size={14} strokeWidth={1.5} nonScalingStroke aria-hidden className={s.chevron} />
        {capital(`${open ? 'hide' : 'show'} ${what}`)}
        {quotes && <span className={s.at}>{quotes.at}</span>}
      </button>
      {open && <Blocks blocks={blocks} className={s.quoted} />}
    </>
  );
}
