import { CloudOff, Package, Plus, RotateCw } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { TextField } from '../../../../ui/Field';
import { at } from '../model';
import { useNav } from '../nav';
import { PlaceLink } from '../PlaceLink';
import t from './States.module.scss';

/**
 * The states a list goes through, held side by side: empty, loading, failed, and before signing in.
 * Four screens read together, so one surface with a line between them, none round the outside. Each
 * screen's action leads where it would: the list once it loads, the app once signed in.
 */
export function States() {
  const { go } = useNav();
  return (
    <div className={t.page}>
      <div className={t.grid}>
        <section className={t.centred} aria-labelledby="ship-empty">
          <span className={t.icon}>
            <Package size={20} aria-hidden />
          </span>
          <h3 id="ship-empty">No releases yet</h3>
          <p className={t.note}>Connect a repository and Ship drafts a release from its next tag.</p>
          <Button size="sm" variant="primary" onClick={() => go(at('releases'))}>
            <Plus size={16} aria-hidden /> Connect repository
          </Button>
        </section>
        <section aria-labelledby="ship-loading" aria-busy="true">
          <div className={t.head}>
            <h3 id="ship-loading">Releases</h3>
            <span className={t.meta}>Loading…</span>
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
        <section className={t.centred} aria-labelledby="ship-error">
          <span className={t.icon} data-tone="danger">
            <CloudOff size={20} aria-hidden />
          </span>
          <h3 id="ship-error">Couldn’t load releases</h3>
          <p className={t.note}>The App Store didn’t answer in 30 seconds. Nothing was changed.</p>
          <Button size="sm" onClick={() => go(at('releases'))}>
            <RotateCw size={16} aria-hidden /> Try again
          </Button>
        </section>
        <section className={t.signin} aria-labelledby="ship-signin">
          <h3 id="ship-signin">Sign in to Ship</h3>
          <TextField label="Work email" type="text" inputMode="email" placeholder="you@company.com" autoComplete="off" />
          <TextField label="Password" type="password" autoComplete="off" />
          <Button variant="primary" onClick={() => go(at('dashboard'))}>
            Sign in
          </Button>
          <p className={t.meta}>
            New to Ship? <PlaceLink to={at('marketing')}>See plans</PlaceLink>
          </p>
        </section>
      </div>
    </div>
  );
}
