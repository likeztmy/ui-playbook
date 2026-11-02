import { LoaderCircle } from 'lucide-react';
import { cx } from '../../ui/cx';
import s from './wait.module.scss';

export function Spinner({ className }: { className?: string }) {
  return <LoaderCircle size={16} aria-hidden className={cx(s.waitSpin, className)} />;
}
