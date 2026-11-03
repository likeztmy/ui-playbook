import { Check } from 'lucide-react';
import { Badge } from '../../../../ui/Badge';
import { Button } from '../../../../ui/Button';
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
    items: ['SSO and audit log', 'Own data region', 'A named engineer'],
  },
];

/** Three plans read across, as columns on one surface with lines between; Team is marked by its fill and a badge. */
export function Pricing() {
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
            <Button variant={p.featured ? 'primary' : 'secondary'}>{p.cta}</Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
