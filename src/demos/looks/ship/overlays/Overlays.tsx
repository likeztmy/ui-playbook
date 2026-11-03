import { Copy, Ellipsis, Pause, Pencil, Trash2 } from 'lucide-react';
import { Button } from '../../../../ui/Button';
import { cx } from '../../../../ui/cx';
import { dialogClasses as ds } from '../../../../ui/Dialog';
import { FieldSuffix, TextField } from '../../../../ui/Field';
import { RowContent, menuClasses as ms } from '../../../../ui/Menu';
import { popoverClasses as pc } from '../../../../ui/Popover';
import { ToastStill } from '../../../../ui/Toast';
import { TipKeys, tooltipClasses as tt } from '../../../../ui/Tooltip';
import { Section } from '../Section';
import o from './Overlays.module.scss';

const menu = [
  { id: 'edit', label: 'Edit notes', icon: Pencil, keys: ['E'] },
  { id: 'copy', label: 'Copy link', icon: Copy, keys: ['⌘', 'L'] },
  { id: 'pause', label: 'Pause rollout', icon: Pause },
];

/**
 * Every floating surface held open, so the look's raised fills, edges, shadows and scrim show at once.
 * Each is a section on the page, held by its heading; only the dialog's scrim is a region of its own,
 * because it is the one that dims what's under it. Held still, nothing here takes focus.
 */
export function Overlays() {
  return (
    <div className={o.grid} inert>
      <Section title="Menu and tooltip">
        <div className={o.stage}>
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
                <RowContent icon={Trash2}>Delete release…</RowContent>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Popover">
        <div className={o.stage}>
          <div className={o.popoverStill}>
            <Button size="sm" data-popup-open="">
              Rollout 25%
            </Button>
            <div className={pc.popup}>
              <div className={pc.header}>
                <span className={pc.title}>Rollout</span>
                <span className={pc.description}>Crash-free is 99.82% at 25%.</span>
              </div>
              <div className={pc.body}>
                <TextField label="Share of users" defaultValue="50" inputMode="numeric" trailing={<FieldSuffix>%</FieldSuffix>} />
              </div>
              <div className={pc.footer}>
                <Button size="sm">Cancel</Button>
                <Button size="sm" variant="primary">
                  Raise
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Confirmation">
        <div className={o.scrim}>
          <div className={cx(ds.popup, ds.sm, o.dialog)} role="presentation">
            <h4 className={ds.title}>Delete 4.2.0 iOS?</h4>
            <p className={ds.description}>Its rollout history and notes are lost. People who have it keep it.</p>
            <div className={ds.footer}>
              <Button>Cancel</Button>
              <Button variant="danger-fill">Delete release</Button>
            </div>
          </div>
        </div>
      </Section>
      <Section title="Toasts">
        <div className={o.toasts}>
          <ToastStill title="Paused the rollout of 4.2.0 iOS" action="Undo" />
          <ToastStill type="error" title="Couldn’t publish 4.1.3 Android: the Play Store didn’t answer" action="Retry" />
        </div>
      </Section>
    </div>
  );
}
