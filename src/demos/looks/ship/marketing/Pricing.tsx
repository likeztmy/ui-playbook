import { Check } from 'lucide-react';
import { Badge } from '../../../../ui/Badge';
import type { MouseEvent } from 'react';
import { buttonClass } from '../../../../ui/Button';
import { at } from '../model';
import { PlaceLink } from '../PlaceLink';
import m from './Marketing.module.scss';
import pr from './Pricing.module.scss';

const plans = [
  { name: 'Hobby', price: '$0', per: 'free forever', cta: 'Start free', items: ['1 app', 'Staged rollouts', '7 days of history'] },
  {
    name: 'Team',
    price: '$24',
    per: 'per seat a month',
    cta: 'Start a trial',
    featured: true,
    items: ['Unlimited apps', 'Automatic halts', 'Approvals', 'Slack'],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    per: 'billed yearly',
    cta: 'Talk to sales',
    sales: true,
    items: ['SSO and audit log', 'Own data region', 'A named engineer'],
  },
];

/**
 * Three plans read across, as columns on one surface with lines between; Team is marked by its fill and a
 * badge. Starting a plan goes into the app, as Sign in does; Talk to sales goes to the questions.
 */
export function Pricing({ onJump }: { onJump: (e: MouseEvent<HTMLAnchorElement>) => void }) {
  return (
    <section className={m.section} aria-labelledby="ship-pricing-title" id="ship-pricing">
      <h2 id="ship-pricing-title" className={m.sectionTitle}>
        Pricing
      </h2>
      <ul className={pr.plans}>
        {plans.map((p) => (
          <li key={p.name} className={pr.plan}>
            <div className={pr.planHead}>
              <h3>{p.name}</h3>
              {p.featured && <Badge tone="info">Most teams</Badge>}
            </div>
            <p className={pr.price}>
              {p.price} <span>{p.per}</span>
            </p>
            <ul className={pr.ticks}>
              {p.items.map((i) => (
                <li key={i}>
                  <Check size={16} aria-hidden />
                  {i}
                </li>
              ))}
            </ul>
            {p.sales ? (
              <a className={buttonClass({})} href="#ship-faq" onClick={onJump}>
                {p.cta}
              </a>
            ) : (
              <PlaceLink className={buttonClass({ variant: p.featured ? 'primary' : 'secondary' })} to={at('dashboard')}>
                {p.cta}
              </PlaceLink>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
