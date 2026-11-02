import { Check } from 'lucide-react';
import { Badge } from '../../../../ui/Badge';
import { Button } from '../../../../ui/Button';
import m from './Marketing.module.scss';

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
    cta: 'Talk to us',
    items: ['SSO and audit log', 'Own data region', 'A named engineer'],
  },
];

/** Three plans, the middle one marked as the usual choice. */
export function Pricing() {
  return (
    <section className={m.section} aria-labelledby="ship-pricing-title" id="ship-pricing">
      <h2 id="ship-pricing-title" className={m.sectionTitle}>
        Pricing
      </h2>
      <ul className={m.plans}>
        {plans.map((p) => (
          <li key={p.name} className={m.plan} data-featured={p.featured || undefined}>
            <div className={m.planHead}>
              <h3>{p.name}</h3>
              {p.featured && <Badge tone="info">Most teams</Badge>}
            </div>
            <p className={m.price}>
              {p.price} <span>{p.per}</span>
            </p>
            <ul className={m.ticks}>
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
