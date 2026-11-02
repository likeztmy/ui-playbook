import { Bell, ChartLine, GitBranch, Hand, Layers, ShieldCheck } from 'lucide-react';
import m from './Marketing.module.scss';

const features = [
  { Icon: Layers, title: 'Staged rollouts', body: 'Go from 1% to everyone in the steps you set, per platform.' },
  { Icon: ShieldCheck, title: 'Automatic halts', body: 'A rollout stops itself when crash-free falls below your line.' },
  { Icon: ChartLine, title: 'Live health', body: 'Crashes, adoption and reviews for each release, as it lands.' },
  { Icon: GitBranch, title: 'From your tags', body: 'Ship drafts a release and its notes from the next tag on main.' },
  { Icon: Hand, title: 'Approvals', body: 'Name who signs off, and Ship waits for them before 100%.' },
  { Icon: Bell, title: 'Where you work', body: 'Every step posts to Slack, with a button to halt from there.' },
];

/** What it does, as six short claims. */
export function Features() {
  return (
    <section className={m.section} aria-labelledby="ship-features" id="ship-product">
      <h2 id="ship-features" className={m.sectionTitle}>
        Everything between merge and everyone
      </h2>
      <ul className={m.features}>
        {features.map(({ Icon, title, body }) => (
          <li key={title}>
            <span className={m.featureIcon}>
              <Icon size={18} aria-hidden />
            </span>
            <h3>{title}</h3>
            <p>{body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
