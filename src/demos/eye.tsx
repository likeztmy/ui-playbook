import { useState } from 'react';
import { Button } from '../ui/Button';
import { cx } from '../ui/cx';
import { TextField } from '../ui/Field';
import { Switch } from '../ui/Switch';
import { Compare } from './shell';
import m from './mistakes.module.scss';
import s from './demos.module.scss';

const NN_LAYER = 'https://www.nngroup.com/articles/layer-cake-pattern-scanning/';

// ── One entry point ──────────────────────────────────────

/** A project's settings: a title, three sections, one action. */
function ProjectSettings({ flat }: { flat?: boolean }) {
  return (
    <div className={cx(s.settingsPage, flat && m.flatType)}>
      <div className={s.settingsHead}>
        <span className={s.settingsTitle}>Project settings</span>
        <Button variant="primary" size="sm">
          Save changes
        </Button>
      </div>
      <section className={s.settingsSection}>
        <span className={s.settingsHeading}>General</span>
        <TextField label="Name" defaultValue="Q4 roadmap" />
        <Switch label="Public link" description="Anyone with the link can view." defaultChecked />
      </section>
      <section className={s.settingsSection}>
        <span className={s.settingsHeading}>Members</span>
        {[
          ['Ana Ruiz', 'Owner'],
          ['Kenji Mori', 'Editor'],
        ].map(([name, role]) => (
          <div key={name} className={s.memberRow}>
            <span>{name}</span>
            <span className={s.memberRole}>{role}</span>
          </div>
        ))}
      </section>
      <section className={s.settingsSection}>
        <span className={s.settingsHeading}>Danger zone</span>
        <div className={s.memberRow}>
          <span>Delete this project and its 24 files.</span>
          <Button size="sm" variant="danger">
            Delete…
          </Button>
        </div>
      </section>
    </div>
  );
}

export function EyeEntry() {
  return (
    <Compare
      stacked
      height={0}
      before={<ProjectSettings flat />}
      after={<ProjectSettings />}
      beforeNote="Every line weighs the same, so nothing says where to start; the eye reads top to bottom and hopes."
      afterNote={
        <>
          The title lands first, then the three headings, then the fields: one way in, then steps down. Headings stand out by weight and
          space, not by shouting; made too loud, they get skipped as promotions (
          <a href={NN_LAYER}>NN/g</a>).
        </>
      }
    />
  );
}

// ── Groups before items ──────────────────────────────────

const SHIPPING = ['Full name', 'Street', 'Postal code', 'City'];
const BILLING = ['Card number', 'Expiry', 'Name on card', 'Billing postal code'];

function Checkout({ grouped }: { grouped?: boolean }) {
  const fields = (labels: string[]) => labels.map((l) => <TextField key={l} label={l} />);
  return grouped ? (
    <div className={s.checkoutGrouped}>
      <div className={s.checkoutGroup}>{fields(SHIPPING)}</div>
      <div className={s.checkoutGroup}>{fields(BILLING)}</div>
    </div>
  ) : (
    <div className={s.checkoutFlat}>{fields([...SHIPPING, ...BILLING])}</div>
  );
}

export function EyeGroups() {
  return (
    <Compare
      height={0}
      before={<Checkout />}
      after={<Checkout grouped />}
      beforeNote="Evenly spaced, eight fields read as one list: where does shipping end and paying begin?"
      afterNote={
        <>
          Space inside a group smaller than between groups, and the eye sorts the fields before reading a word. A shared region, a card or
          a fill, groups even more strongly (<a href="https://www.nngroup.com/articles/common-region/">NN/g</a>).
        </>
      }
    />
  );
}

// ── The word that differs comes first ────────────────────

const ALERTS = [
  ['mentions', 'Mentions', 'Send me an email when someone mentions me', 'When someone @-mentions you.'],
  ['assigned', 'Assignments', 'Send me an email when a task is assigned to me', 'When a task is given to you.'],
  ['comments', 'Comments', 'Send me an email when someone comments on my file', 'On files you own.'],
  ['digest', 'Weekly digest', 'Send me an email with a weekly summary', 'Every Monday morning.'],
] as const;

function EmailAlerts({ frontLoaded }: { frontLoaded?: boolean }) {
  const [on, setOn] = useState<string[]>(['mentions', 'assigned']);
  return (
    <div className={s.settingsList}>
      {ALERTS.map(([key, word, sentence, detail]) => (
        <Switch
          key={key}
          label={frontLoaded ? word : sentence}
          description={frontLoaded ? detail : undefined}
          checked={on.includes(key)}
          onCheckedChange={(v) => setOn((l) => (v ? [...l, key] : l.filter((x) => x !== key)))}
        />
      ))}
    </div>
  );
}

export function EyeFrontLoad() {
  return (
    <Compare
      height={0}
      before={<EmailAlerts />}
      after={<EmailAlerts frontLoaded />}
      beforeNote="Each label starts “Send me an email”, so the eye skips the start it has already seen and has to reach the end of every line."
      afterNote={
        <>
          The word that differs comes first, and what they share moves to the group or the description. Lead with the information-bearing
          words (<a href={NN_LAYER}>NN/g</a>).
        </>
      }
    />
  );
}

// ── Labels that smell of what's behind them ──────────────

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
          <a href="https://doi.org/10.1037/0033-295X.106.4.643">information foraging</a>. Specific labels are followed; vague ones are opened
          one by one.
        </>
      }
    />
  );
}

export function EyePreview() {
  return (
    <div className={s.colourStill}>
      <ProjectSettings />
    </div>
  );
}
