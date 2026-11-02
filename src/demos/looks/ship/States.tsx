import { CloudOff, Package, Plus, RotateCw } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { TextField } from '../../../ui/Field';
import { Shell } from './Shell';
import s from './Page.module.scss';
import t from './States.module.scss';

/** The four states every list goes through, side by side: empty, loading, failed, and before signing in. */
export function States() {
  return (
    <Shell section="releases" place="States">
      <div className={t.grid}>
        <section className={`${s.card} ${t.state}`} aria-label="Empty">
          <span className={t.icon}>
            <Package size={20} aria-hidden />
          </span>
          <h3>No releases yet</h3>
          <p className={s.meta}>Connect a repository and Ship drafts a release from its next tag.</p>
          <Button size="sm" variant="primary">
            <Plus size={16} aria-hidden /> Connect repository
          </Button>
        </section>
        <section className={s.card} aria-label="Loading" aria-busy="true">
          <div className={s.head}>
            <h3>Releases</h3>
            <span className={s.meta}>Loading…</span>
          </div>
          <ul className={t.skeleton} aria-hidden>
            {[72, 56, 64, 48, 60].map((w, i) => (
              <li key={i}>
                <span className={t.box} />
                <span className={t.line} style={{ width: `${w}%` }} />
                <span className={t.chip} />
              </li>
            ))}
          </ul>
        </section>
        <section className={`${s.card} ${t.state}`} aria-label="Error">
          <span className={t.icon} data-tone="danger">
            <CloudOff size={20} aria-hidden />
          </span>
          <h3>Couldn’t load releases</h3>
          <p className={s.meta}>The App Store didn’t answer in 30 seconds. Nothing was changed.</p>
          <Button size="sm">
            <RotateCw size={16} aria-hidden /> Try again
          </Button>
        </section>
        <section className={`${s.card} ${t.signin}`} aria-label="Sign in">
          <div>
            <h3>Sign in to Ship</h3>
            <p className={s.meta}>Use your work email.</p>
          </div>
          <TextField label="Email" type="email" placeholder="you@company.com" autoComplete="off" />
          <TextField label="Password" type="password" autoComplete="off" />
          <Button variant="primary">Sign in</Button>
          <p className={s.meta}>
            New to Ship? <a href="#ship-signup">Create an account</a>
          </p>
        </section>
      </div>
    </Shell>
  );
}
