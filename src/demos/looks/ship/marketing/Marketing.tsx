import type { MouseEvent } from 'react';
import { buttonClass } from '../../../../ui/Button';
import { at } from '../model';
import { PlaceLink } from '../PlaceLink';
import { Faq } from './Faq';
import { Features } from './Features';
import { Hero } from './Hero';
import { Pricing } from './Pricing';
import m from './Marketing.module.scss';

const links = [
  ['Product', 'ship-product'],
  ['Pricing', 'ship-pricing'],
  ['Questions', 'ship-faq'],
];

// The sections are in this page's own scroller: scroll it there, and leave the gallery's address alone.
const jump = (e: MouseEvent<HTMLAnchorElement>) => {
  const id = e.currentTarget.hash.slice(1);
  const el = e.currentTarget.closest('[data-pane]')?.querySelector(`#${id}`);
  if (!el) return;
  e.preventDefault();
  el.scrollIntoView({ block: 'start' });
};

/**
 * Ship's website: the same look carrying a page meant to sell, not to work in. It takes the whole
 * window, as a website does, and scrolls as one; Sign in goes back into the app.
 */
export function Marketing() {
  return (
    <div className={m.site} data-pane role="region" aria-label="Ship website" tabIndex={0}>
      <header className={m.nav}>
        <span className={m.brand}>Ship</span>
        <nav className={m.links} aria-label="Site">
          {links.map(([label, id]) => (
            <a key={id} href={`#${id}`} onClick={jump}>
              {label}
            </a>
          ))}
        </nav>
        <span className={m.navEnd}>
          <PlaceLink className={buttonClass({ size: 'sm', variant: 'ghost' })} to={at('dashboard')}>
            Sign in
          </PlaceLink>
          <a className={buttonClass({ size: 'sm', variant: 'primary' })} href="#ship-pricing" onClick={jump}>
            Start free
          </a>
        </span>
      </header>
      <Hero onStart={jump} />
      <Features />
      <figure className={m.quote}>
        <blockquote>
          “We used to ship on Thursdays and pray. Now a release goes to 1% at lunch, and the dashboard tells us by dinner whether it goes further.”
        </blockquote>
        <figcaption>
          <strong>Priya Nair</strong> · Head of mobile, Fieldnote
        </figcaption>
      </figure>
      <Pricing />
      <Faq />
      <footer className={m.footer}>
        <span className={m.brand}>Ship</span>
        <span>© 2026 Ship</span>
      </footer>
    </div>
  );
}
