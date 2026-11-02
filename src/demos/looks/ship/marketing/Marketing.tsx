import { Button } from '../../../../ui/Button';
import { Faq } from './Faq';
import { Features } from './Features';
import { Hero } from './Hero';
import { Pricing } from './Pricing';
import m from './Marketing.module.scss';

const links = ['Product', 'Pricing', 'Changelog', 'Docs'];

/** Ship's landing page: the same look carrying a page meant to sell, not to work in. */
export function Marketing() {
  return (
    <div className={m.site}>
      <header className={m.nav}>
        <span className={m.brand}>
          <span className={m.logo} aria-hidden>
            S
          </span>
          Ship
        </span>
        <nav className={m.links} aria-label="Site">
          {links.map((l) => (
            <a key={l} href={`#ship-${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </nav>
        <span className={m.navEnd}>
          <Button size="sm" variant="ghost">
            Sign in
          </Button>
          <Button size="sm" variant="primary">
            Start free
          </Button>
        </span>
      </header>
      <Hero />
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
        <span className={m.brand}>
          <span className={m.logo} aria-hidden>
            S
          </span>
          Ship
        </span>
        <span>© 2026 Ship</span>
        <nav className={m.links} aria-label="Footer">
          {['Privacy', 'Terms', 'Status'].map((l) => (
            <a key={l} href={`#ship-${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  );
}
