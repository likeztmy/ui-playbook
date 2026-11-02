import { ArrowRight } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { Releases } from '../Releases';
import m from './Marketing.module.scss';

/** The promise, the two ways in, and the product itself underneath. */
export function Hero() {
  return (
    <section className={m.hero} aria-labelledby="ship-hero">
      <p className={m.eyebrow}>Staged rollouts for iOS, Android and the web</p>
      <h2 id="ship-hero" className={m.headline}>
        Release to 1% first. Let the numbers decide the rest.
      </h2>
      <p className={m.lede}>
        Ship rolls each release out in steps, watches crashes and adoption as it goes, and halts on its own when a number turns.
      </p>
      <div className={m.ctas}>
        <Button size="lg" variant="primary">
          Start free <ArrowRight size={16} aria-hidden />
        </Button>
        <Button size="lg">Book a demo</Button>
      </div>
      <div className={m.shot} inert aria-hidden>
        <Releases />
      </div>
    </section>
  );
}
