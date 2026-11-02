import { cx } from '../../ui/cx';
import s from './wait.module.scss';

/** Ana's profile card, or its skeleton: the same boxes, in the same places. */
export function Profile({ bones }: { bones?: boolean }) {
  if (bones)
    return (
      <div className={s.waitProfile} aria-hidden>
        <span className={cx(s.waitAvatar, s.waitBone)} />
        <div className={s.waitProfileText}>
          <span className={s.waitBone} style={{ width: 96, height: 16 }} />
          <span className={s.waitBone} style={{ width: 140, height: 12 }} />
        </div>
        <div className={s.waitBio}>
          <span className={s.waitBone} style={{ width: '100%', height: 12 }} />
          <span className={s.waitBone} style={{ width: '70%', height: 12 }} />
        </div>
      </div>
    );
  return (
    <div className={s.waitProfile}>
      <span className={s.waitAvatar} aria-hidden>
        AR
      </span>
      <div className={s.waitProfileText}>
        <span className={s.waitTitle}>Ana Ruiz</span>
        <span className={s.waitMeta}>Design lead · Lisbon</span>
      </div>
      <p className={s.waitBio}>Runs the design system and the weekly critique. Ask her about type.</p>
    </div>
  );
}
