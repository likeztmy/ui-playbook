import { ArrowRight } from 'lucide-react';
import type { MouseEvent } from 'react';
import { buttonClass } from '../../../../ui/Button';
import { Releases } from '../releases/Releases';
import m from './Marketing.module.scss';

/** The promise, the two ways in, and the product itself underneath. What it covers is in the lede, not a line above the headline (C32). */
export function Hero({ onStart }: { onStart: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <section className={m.hero} aria-labelledby="ship-hero">
      <h2 id="ship-hero" className={m.headline}>
        Release to 1% first. Let the numbers decide the rest.
      </h2>
      <p className={m.lede}>
        Ship rolls each iOS, Android and web release out in steps, watches crashes and adoption as it goes, and halts on its own when a number turns.
      </p>
      <div className={m.ctas}>
        <a className={buttonClass({ size: 'lg', variant: 'primary' })} href="#ship-pricing" onClick={onStart}>
          Start free <ArrowRight size={16} aria-hidden />
        </a>
        <a className={buttonClass({ size: 'lg' })} href="#ship-faq" onClick={onStart}>
          Questions
        </a>
      </div>
      <div className={m.shot} inert aria-hidden>
        <Releases platform="any" onPlatform={() => {}} />
      </div>
    </section>
  );
}
