import { Compare } from '../shell';
import s from './copy.module.scss';

const ROWS = [
  ['Members', '12 people'],
  ['Billing', 'Pro plan'],
  ['Roles', '4 roles'],
  ['Integrations', '3 connected'],
  ['API keys', '2 keys'],
] as const;

/** A workspace's settings, each row a place with its one fact on the right. */
function Settings({ verb }: { verb?: string }) {
  return (
    <div className={s.list}>
      <h3 className={s.listHead}>Workspace</h3>
      {ROWS.map(([label, meta]) => (
        <button key={label} type="button" className={s.listRow}>
          <span>{verb ? `${verb} ${label === 'API keys' ? label : label.toLowerCase()}` : label}</span>
          <span className={s.meta}>{meta}</span>
        </button>
      ))}
    </div>
  );
}

export function CopyFirstWords() {
  return (
    <Compare
      height={280}
      beforeLabel="Every row starts “Manage”"
      afterLabel="The word that differs first"
      before={<Settings verb="Manage" />}
      after={<Settings />}
      beforeNote={
        <>
          When the lines of a list all start with the same word, the eye skips it and starts at the second; NN/g calls it{' '}
          <a href="https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/">bypassing</a>. <em>Manage</em> says nothing a row you can
          open doesn’t.
        </>
      }
      afterNote={
        <>
          People take in about <a href="https://www.nngroup.com/articles/first-2-words-a-signal-for-scanning/">two words</a> of each list item. Here
          both are the place.
        </>
      }
    />
  );
}
