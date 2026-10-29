import { ArrowRight, Check, Eye } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Compare } from '../shell';
import s from './icon.module.scss';

// The marks an agent drew for its sign-up page, copied as it drew them: the mistake on show.
const drawn = {
  eye: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden>
      <path d="m4 8 2.5 2.5L12 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  arrow: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const library = {
  eye: <Eye size={16} aria-hidden />,
  check: <Check size={16} aria-hidden />,
  arrow: <ArrowRight size={16} aria-hidden />,
};

/** The password step of a sign-up form, with a show button, a note and the next step. */
function Form({ marks }: { marks: typeof library }) {
  return (
    <div className={s.form}>
      <span className={s.formLabel}>Password</span>
      <span className={s.field}>
        <span className={s.dots}>••••••••••</span>
        <Button variant="ghost" icon size="sm" aria-label="Show password">
          {marks.eye}
        </Button>
      </span>
      <span className={s.note}>
        {marks.check}
        At least 8 characters
      </span>
      <Button variant="primary">
        Continue
        {marks.arrow}
      </Button>
    </div>
  );
}

export function IconDrawn() {
  return (
    <Compare
      height={240}
      beforeLabel="Drawn for this page"
      afterLabel="From the library"
      before={<Form marks={drawn} />}
      after={<Form marks={library} />}
      beforeNote="Three marks an agent drew while building this form. Close enough to pass, which is the trouble: two sizes, lines of 1.13, 1.28 and 1.31px, and nothing that keeps the next screen’s marks like these."
      afterNote={
        <>
          Lucide’s eye, tick and arrow, drawn to one <a href="https://lucide.dev/contribute/icons/specification">specification</a>: a 24px grid, a 2px
          line, round joins and ends. <a href="https://developer.apple.com/design/human-interface-guidelines/icons">Apple</a> asks for “a consistent
          size, level of detail, stroke thickness” in every icon, its own and yours.
        </>
      }
    />
  );
}
