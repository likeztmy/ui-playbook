import s from './Wall.module.scss';
import c from './Stats.module.scss';

/** Two numbers with their trend: how the release is landing. */
export function Stats() {
  return (
    <section className={s.card} aria-label="Release health">
      <div className={c.pair}>
        <div>
          <p className={s.meta}>Crash-free sessions</p>
          <div className={s.big}>99.82%</div>
          <p className={s.meta}>
            <span data-tone="success">+0.12</span> since 4.1.3
          </p>
        </div>
        <div>
          <p className={s.meta}>Adoption</p>
          <div className={s.big}>64%</div>
          <div className={c.bar} role="progressbar" aria-label="Adoption" aria-valuenow={64}>
            <span style={{ width: '64%' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
