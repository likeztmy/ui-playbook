import { Rocket } from 'lucide-react';
import { STAGES, type Release } from './model';
import { ago } from './when';
import s from './Details.module.scss';

const NOTE = {
  Build: 'Building',
  QA: 'Being tested',
  Rollout: 'Rolling out',
  Released: 'Out to everyone',
};

/** "for 20h", or past a week, "since Oct 22". */
const howLong = (iso: string) => {
  const a = ago(iso);
  return /\d[mhd]$/.test(a) ? `for ${a}` : `since ${a}`;
};

/**
 * Where its build is on Shipyard, the team's release platform: four stages in order, the current one
 * filled as far as it's got, and in words, how long it's been there.
 */
export function ReleaseProgress({ release }: { release?: Release }) {
  if (!release) return null;
  const at = STAGES.indexOf(release.stage);
  const fill = (i: number) => (i < at || release.stage === 'Released' ? 100 : i === at ? (release.rollout ?? 50) : 0);
  return (
    <section className={s.section} aria-label="Release">
      <h3 className={s.head}>Release</h3>
      <div className={s.release}>
        <div className={s.releaseHead}>
          <Rocket size={16} strokeWidth={1.5} aria-hidden />
          {release.name}
          <span className={s.meta}>Shipyard</span>
        </div>
        <ol className={s.stages}>
          {STAGES.map((st, i) => (
            <li key={st} data-done={i < at ? '' : undefined} data-at={i === at ? '' : undefined} aria-current={i === at ? 'step' : undefined}>
              <span className={s.bar}>
                <span style={{ width: `${fill(i)}%` }} />
              </span>
              {st === 'Rollout' && release.rollout != null && i === at ? `Rollout ${release.rollout}%` : st}
            </li>
          ))}
        </ol>
        <p className={s.releaseNote}>
          {NOTE[release.stage]}
          {release.stage === 'Rollout' && release.rollout != null ? ` to ${release.rollout}% of people` : ''} {howLong(release.since)}
        </p>
      </div>
    </section>
  );
}
