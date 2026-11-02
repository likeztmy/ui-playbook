import { LOOKS, lookById } from '../../looks';
import { LookPanel } from './LookPanel';
import s from './systems.module.scss';

const ROWS = [0.7, 0.52, 0.8, 0.6, 0.74, 0.46];

export type SystemSlug = 'work-tool' | 'consumer-app' | 'looks' | `look-${string}`;

/** The home page's card: a work tool's dense rows and small button, an app's card and wide button, or a
 * look's own parts in its values. */
export function SystemPreview({ system }: { system: SystemSlug }) {
  if (system === 'looks')
    return (
      <div className={s.looks} aria-hidden>
        {LOOKS.map((l) => (
          <LookPanel key={l.id} look={l.id === 'playbook' ? undefined : l} field={false} />
        ))}
      </div>
    );
  if (system.startsWith('look-')) {
    const id = system.slice(5);
    return (
      <div className={s.one} aria-hidden>
        <LookPanel look={id === 'playbook' ? undefined : lookById(id)} />
      </div>
    );
  }
  if (system === 'work-tool')
    return (
      <div className={s.work} aria-hidden>
        <div className={s.workHead}>
          <span />
          <span className={s.accent} />
        </div>
        {ROWS.map((w, i) => (
          <div key={i} className={s.workRow}>
            <span style={{ width: `${w * 100}%` }} />
          </div>
        ))}
      </div>
    );
  return (
    <div className={s.app} aria-hidden>
      <span className={s.appImage} />
      <span className={s.appTitle} />
      <span className={s.appLine} />
      <span className={s.appButton} />
    </div>
  );
}
