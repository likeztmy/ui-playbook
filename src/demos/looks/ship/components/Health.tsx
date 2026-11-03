import { Section } from '../Section';
import h from './Health.module.scss';

/** Two numbers read together: one surface, a line between them (the lightest boundary). */
export function Health() {
  return (
    <Section title="Release health">
      <dl className={h.pair}>
        <div>
          <dt>Crash-free sessions</dt>
          <dd className={h.big}>99.82%</dd>
          <dd className={h.note}>
            <span className={h.up}>+0.12</span> since 4.1.3
          </dd>
        </div>
        <div>
          <dt>Adoption</dt>
          <dd className={h.big}>64%</dd>
          <dd>
            <span className={h.bar} role="progressbar" aria-label="Adoption" aria-valuenow={64}>
              <span style={{ width: '64%' }} />
            </span>
          </dd>
        </div>
      </dl>
    </Section>
  );
}
