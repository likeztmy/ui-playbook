import s from './systems.module.scss';

const ROWS = [0.7, 0.52, 0.8, 0.6, 0.74, 0.46];

/** The home page's card: a work tool's dense rows and small button, or an app's card and wide button. */
export function SystemPreview({ system }: { system: 'work-tool' | 'consumer-app' }) {
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
