import { CircleAlert, CircleCheck, Copy, Ellipsis, Pause, Pencil, Trash2, X } from 'lucide-react';
import { Button, buttonClass } from '../../../ui/Button';
import { cx } from '../../../ui/cx';
import { dialogClasses as ds } from '../../../ui/Dialog';
import { TextField } from '../../../ui/Field';
import { RowContent, menuClasses as ms } from '../../../ui/Menu';
import { popoverClasses as pc } from '../../../ui/Popover';
import { toastClasses as ts } from '../../../ui/Toast';
import { TipKeys, tooltipClasses as tt } from '../../../ui/Tooltip';
import { Shell } from './Shell';
import o from './Overlays.module.scss';

const menu = [
  { id: 'edit', label: 'Edit notes', icon: Pencil, keys: ['E'] },
  { id: 'copy', label: 'Copy link', icon: Copy, keys: ['⌘', 'L'] },
  { id: 'pause', label: 'Pause rollout', icon: Pause },
];

/** Every floating surface held open in its own scene, so their fills, edges, shadows and the scrim show. */
export function Overlays() {
  return (
    <Shell section="releases" place="Overlays">
      <div className={o.grid}>
        <section className={o.scene} aria-label="Menu and tooltip">
          <div className={o.toolbar}>
            <div className={o.tipStill}>
              <div className={tt.popup}>
                Copy link
                <TipKeys keys={['⌘', 'L']} />
              </div>
              <Button size="sm" variant="ghost" icon aria-label="Copy link">
                <Copy size={16} aria-hidden />
              </Button>
            </div>
            <div className={o.menuStill}>
              <Button size="sm" variant="ghost" icon aria-label="More" data-popup-open="">
                <Ellipsis size={16} aria-hidden />
              </Button>
              <div className={ms.popup} role="presentation">
                {menu.map((m, i) => (
                  <div key={m.id} className={ms.item} data-highlighted={i === 0 ? '' : undefined}>
                    <RowContent icon={m.icon} keys={m.keys}>
                      {m.label}
                    </RowContent>
                  </div>
                ))}
                <div className={ms.separator} />
                <div className={cx(ms.item, ms.danger)}>
                  <RowContent icon={Trash2}>Delete release</RowContent>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className={o.scene} aria-label="Popover">
          <div className={o.popoverStill}>
            <Button size="sm" data-popup-open="">
              Rollout 25%
            </Button>
            <div className={pc.popup}>
              <div className={pc.header}>
                <span className={pc.title}>Raise the rollout</span>
                <span className={pc.description}>Crash-free is 99.82% at 25%.</span>
              </div>
              <div className={pc.body}>
                <TextField label="Share of users" defaultValue="50%" />
              </div>
              <div className={pc.footer}>
                <Button size="sm">Cancel</Button>
                <Button size="sm" variant="primary">
                  Raise
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className={cx(o.scene, o.dim)} aria-label="Dialog">
          <div className={o.scrim} />
          <div className={cx(ds.popup, ds.sm, o.dialog)} role="presentation">
            <h3 className={ds.title}>Halt 4.1.3 for Android?</h3>
            <p className={ds.description}>No one new gets it; the 10% who have it keep it. You can resume later.</p>
            <div className={ds.footer}>
              <Button>Cancel</Button>
              <Button variant="danger-fill">Halt rollout</Button>
            </div>
          </div>
        </section>
        <section className={cx(o.scene, o.toasts)} aria-label="Toasts">
          <div className={cx(ts.toast, o.toast)}>
            <CircleCheck className={ts.icon} size={16} aria-hidden style={{ color: 'var(--success)' }} />
            <span className={ts.title}>4.2.0 is live for 25%</span>
            <span className={ts.actions}>
              <span className={buttonClass({ size: 'sm' })}>Undo</span>
            </span>
          </div>
          <div className={cx(ts.toast, o.toast)}>
            <CircleAlert className={ts.icon} size={16} aria-hidden style={{ color: 'var(--danger)' }} />
            <span className={ts.title}>Couldn’t reach the Play Store</span>
            <span className={ts.actions}>
              <Button variant="ghost" icon aria-label="Dismiss">
                <X size={16} aria-hidden />
              </Button>
            </span>
          </div>
        </section>
      </div>
    </Shell>
  );
}
