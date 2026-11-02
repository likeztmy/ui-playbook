import { ChevronDown } from 'lucide-react';
import m from './Marketing.module.scss';

const faq = [
  [
    'Does Ship replace the App Store and Play Console?',
    'No. It drives their staged-rollout settings through their APIs, so releases still go out through the stores.',
  ],
  [
    'What happens when a rollout halts?',
    'No one new gets the release. Everyone who has it keeps it, and you choose whether to resume or ship a fix.',
  ],
  ['Can we try it on one app first?', 'Yes. Hobby is free for one app, and a Team trial covers as many as you connect for 14 days.'],
];

/** The questions people ask before they sign up, each opening in place. */
export function Faq() {
  return (
    <section className={m.section} aria-labelledby="ship-faq">
      <h2 id="ship-faq" className={m.sectionTitle}>
        Questions
      </h2>
      <div className={m.faq}>
        {faq.map(([q, a], i) => (
          <details key={q} open={i === 0}>
            <summary>
              {q}
              <ChevronDown size={16} aria-hidden />
            </summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
