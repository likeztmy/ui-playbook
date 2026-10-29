import { Ellipsis, OctagonAlert, SignalHigh, SignalLow, SignalMedium, type LucideIcon } from 'lucide-react';
import type { Priority } from './model';
import s from './icons.module.scss';

/** Bars rising like a signal, as many as it matters; urgent is an alert of its own. */
const ICON: Record<Priority, LucideIcon> = {
  urgent: OctagonAlert,
  high: SignalHigh,
  medium: SignalMedium,
  low: SignalLow,
  none: Ellipsis,
};

export function PriorityIcon({ priority }: { priority: Priority }) {
  const Icon = ICON[priority];
  return <Icon className={s.priority} data-priority={priority} size={14} strokeWidth={1.5} nonScalingStroke aria-hidden />;
}
