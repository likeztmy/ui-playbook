import { Check, CreditCard, ShoppingBag, Sparkles, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { TextField } from '../ui/Field';
import { SegmentedControl } from '../ui/SegmentedControl';
import { Slider } from '../ui/Slider';
import { Compare, Tweak } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

// ── It misses what changes elsewhere ─────────────────────

/** A product page. `near` puts the feedback where the click was, too. */
function Shop({ near }: { near?: boolean }) {
  const [count, setCount] = useState(0);
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const add = () => {
    setCount((c) => c + 1);
    if (!near) return;
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 2000);
  };
  return (
    <div className={s.shop}>
      <div className={s.shopBar}>
        <span className={s.shopBrand}>Field Supply</span>
        <span className={s.shopNav} aria-hidden>
          <span>Bags</span>
          <span>Bottles</span>
          <span>Journals</span>
        </span>
        <Button variant="ghost" size="sm" aria-label={`Cart, ${count} ${count === 1 ? 'item' : 'items'}`} className={s.shopCart}>
          <ShoppingBag size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
          {count > 0 && (
            <span key={near ? count : undefined} className={cx(s.shopCount, near && s.shopBump)}>
              {count}
            </span>
          )}
        </Button>
      </div>
      <div className={s.shopBody}>
        <div className={s.shopImage} aria-hidden>
          <ShoppingBag size={40} strokeWidth={1} nonScalingStroke />
        </div>
        <div className={s.shopInfo}>
          <span className={s.shopName}>Canvas tote</span>
          <span className={s.shopPrice}>$38</span>
          <span className={s.shopBlurb}>Waxed canvas, leather handles. Ships in 2 days.</span>
          <Button variant="primary" onClick={add} className={s.shopAdd}>
            {added ? (
              <>
                <Check size={16} strokeWidth={2} nonScalingStroke aria-hidden />
                Added
              </>
            ) : (
              'Add to cart'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function EyeChange() {
  return (
    <Compare
      stacked
      height={0}
      before={<Shop />}
      after={<Shop near />}
      beforeNote={
        <>
          The count changes in the corner while the eye is on the button. A change outside the point of focus, with no motion to pull the eye, goes
          unseen: <a href="https://www.nngroup.com/articles/change-blindness-definition/">change blindness</a>. Was it added? The only way to know is
          to look away from the button.
        </>
      }
      afterNote="The button answers where the click was, and the count moves as it changes, so the eye that glances up finds it. The button keeps its width, so nothing shifts under the pointer."
    />
  );
}

// ── It stops at what looks like an end ───────────────────

const PLANS = [
  ['Solo', '$0', 'One person, three projects.'],
  ['Team', '$12', 'Per seat. Shared projects and roles.'],
  ['Business', '$24', 'Per seat. SSO, audit log, support.'],
] as const;

/** A pricing page in a short window. `cut` lets the fold fall through the plans. */
function Pricing({ cut }: { cut?: boolean }) {
  return (
    <div
      className={s.floorPane}
      tabIndex={0}
      role="region"
      aria-label={cut ? 'Pricing page, the fold through the plans' : 'Pricing page, the first screen ending with the band'}
    >
      <div className={cx(s.floorHero, cut && s.floorHeroShort)}>
        <span className={s.floorTitle}>Simple pricing</span>
        <span className={s.floorLead}>One plan per team. Change or cancel any time.</span>
        <Button variant="primary" size="sm">
          Start free
        </Button>
      </div>
      <div className={s.floorPlans}>
        {PLANS.map(([name, price, line]) => (
          <div key={name} className={s.floorPlan}>
            <span className={s.floorPlanName}>{name}</span>
            <span className={s.floorPlanPrice}>
              {price}
              <span> / month</span>
            </span>
            <span className={s.floorPlanLine}>{line}</span>
          </div>
        ))}
      </div>
      <div className={s.floorFaq}>
        <span className={s.settingsHeading}>Questions</span>
        <span>Can I change plans later? Yes, from Billing, at any time.</span>
        <span>Do you offer refunds? Within 30 days, no questions asked.</span>
      </div>
    </div>
  );
}

export function EyeFloor() {
  return (
    <Compare
      height={0}
      before={<Pricing />}
      after={<Pricing cut />}
      beforeNote={
        <>
          The band ends where the window does, and the first screen looks finished: the{' '}
          <a href="https://www.nngroup.com/videos/illusion-completeness/">illusion of completeness</a>. Scroll bars that hide until used, as on the
          Mac and on phones, leave no other hint.
        </>
      }
      afterNote="The fold cuts through the plans. Half a card can only mean there is more, so the page asks to be scrolled without an arrow saying so."
    />
  );
}

// ── It skips what looks like an ad ───────────────────────

const NOTICE = 'Your card expires on 31 Oct. Update it to keep your plan.';

function Billing({ inline }: { inline?: boolean }) {
  return (
    <div className={s.billing}>
      {!inline && (
        <div className={m.promoBand}>
          <Sparkles size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
          <span>{NOTICE}</span>
          <Button size="sm">Update card</Button>
          <X size={16} strokeWidth={1.5} nonScalingStroke aria-label="Dismiss" />
        </div>
      )}
      <span className={s.settingsTitle}>Billing</span>
      <section className={s.settingsSection}>
        <span className={s.settingsHeading}>Plan</span>
        <div className={s.memberRow}>
          <span>Team · 5 seats</span>
          <span className={s.memberRole}>$60 / month</span>
        </div>
      </section>
      <section className={s.settingsSection}>
        <span className={s.settingsHeading}>Payment method</span>
        <div className={s.memberRow}>
          <span className={s.billingCard}>
            <CreditCard size={16} strokeWidth={1.5} nonScalingStroke aria-hidden />
            Visa •••• 4242
            <span className={inline ? s.billingExpiring : s.memberRole}>Expires 10/26</span>
          </span>
          {inline && <Button size="sm">Update card</Button>}
        </div>
        {inline && <span className={s.billingWarn}>{NOTICE}</span>}
      </section>
      <section className={s.settingsSection}>
        <span className={s.settingsHeading}>Invoices</span>
        {['1 Oct', '1 Sep'].map((d) => (
          <div key={d} className={s.memberRow}>
            <span>{d}</span>
            <span className={s.memberRole}>$60.00</span>
          </div>
        ))}
      </section>
    </div>
  );
}

export function EyeBanner() {
  return (
    <Compare
      height={0}
      before={<Billing />}
      after={<Billing inline />}
      beforeNote={
        <>
          A bright, rounded band with a sparkle and a close button is how promotions look, and people have learned to look past them: in NN/g’s
          eye-tracking, <a href="https://www.nngroup.com/articles/banner-blindness-old-and-new-findings/">banner blindness</a> holds for anything
          ad-shaped, whatever it says.
        </>
      }
      afterNote="The same words, in the interface’s own voice, beside the card they’re about. The eye reaches them on its way through Payment method, the one place it goes when it cares about the card."
    />
  );
}

// ── It sorts before it reads ─────────────────────────────

const CONTACT = [
  ['Name', undefined],
  ['Email', undefined],
  ['Phone', 'Only for questions about delivery.'],
  ['Company', undefined],
] as const;

function Contact({ tight }: { tight?: boolean }) {
  return (
    <div className={cx(s.contact, !tight && s.contactEven)}>
      {CONTACT.map(([label, hint]) => (
        <TextField key={label} label={label} description={hint} className={tight ? undefined : m.evenField} />
      ))}
    </div>
  );
}

export function EyeProximity() {
  return (
    <Compare
      height={0}
      before={<Contact />}
      after={<Contact tight />}
      beforeNote="Every gap is 12. Each label sits as near the field above as the one below, and the line about delivery could belong to Phone or to Company: the eye groups by distance before it reads a word."
      afterNote={
        <>
          4 between a label, its field and its hint; 20 between fields. Inside a group the space is clearly smaller than between groups, so each label
          points one way (<a href="https://www.nngroup.com/articles/gestalt-proximity/">NN/g, proximity</a>).
        </>
      }
    />
  );
}

// ── It follows the words' promise ────────────────────────

const VAGUE = ['Getting started', 'Resources', 'Solutions', 'Account', 'More'];
const SPECIFIC = ['Getting started', 'Invoices and refunds', 'Team and roles', 'Import and export', 'API'];

function HelpNav({ labels }: { labels: string[] }) {
  return (
    <nav className={s.helpNav} aria-label="Help">
      <span className={s.helpHeading}>Help centre</span>
      {labels.map((l, i) => (
        <a key={l} href="#help" className={s.helpLink} aria-current={i === 0 ? 'page' : undefined} onClick={(e) => e.preventDefault()}>
          {l}
        </a>
      ))}
    </nav>
  );
}

export function EyeScent() {
  return (
    <Compare
      height={0}
      before={<HelpNav labels={VAGUE} />}
      after={<HelpNav labels={SPECIFIC} />}
      beforeNote="Where would a refund be? Resources, Solutions, Account and More could each hold it, so the only way to know is to open them all."
      afterNote={
        <>
          People judge a link by what its words promise before they click: its{' '}
          <a href="https://www.nngroup.com/articles/information-scent/">information scent</a>, from Pirolli and Card’s{' '}
          <a href="https://doi.org/10.1037/0033-295X.106.4.643">information foraging</a>. Specific labels are followed; vague ones are opened one by
          one.
        </>
      }
    />
  );
}

// ── Check it yourself ────────────────────────────────────

type Squinted = 'Billing' | 'Pricing';

export function EyeSquint() {
  const [blur, setBlur] = useState(4);
  const [page, setPage] = useState<Squinted>('Billing');
  return (
    <Tweak
      height={0}
      readout={<code className={s.readout}>filter: blur({blur}px)</code>}
      stage={
        <div className={s.squint} style={{ filter: blur ? `blur(${blur}px)` : undefined }} inert>
          {page === 'Billing' ? (
            <>
              <Billing />
              <Billing inline />
            </>
          ) : (
            <>
              <Pricing />
              <Pricing cut />
            </>
          )}
        </div>
      }
      controls={
        <>
          <SegmentedControl
            label="Page"
            value={page}
            onValueChange={setPage}
            segments={[
              { value: 'Billing', label: 'Billing' },
              { value: 'Pricing', label: 'Pricing' },
            ]}
            className={s.fill}
          />
          <Slider label="Blur" value={blur} onValueChange={setBlur} max={10} unit="px" />
        </>
      }
    />
  );
}

export function EyePreview() {
  return (
    <div className={s.colourStill}>
      <Shop near />
    </div>
  );
}
