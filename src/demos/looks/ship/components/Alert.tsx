import { TriangleAlert } from 'lucide-react';
import { buttonClass } from '../../../../ui/Button';
import { at } from '../model';
import { PlaceLink } from '../PlaceLink';
import a from './Alert.module.scss';

/** The danger colours on the one region set apart: a soft fill, its words, and the way to the release. */
export function Alert() {
  return (
    <section className={a.alert} aria-labelledby="ship-alert">
      <TriangleAlert size={16} aria-hidden />
      <div className={a.text}>
        <strong id="ship-alert">4.1.3 Android halted at 10%</strong>
        <p>Crash-free fell to 98.4%.</p>
      </div>
      <PlaceLink className={buttonClass({ size: 'sm' })} to={at('release', { release: 'r5' })}>
        View release
      </PlaceLink>
    </section>
  );
}
