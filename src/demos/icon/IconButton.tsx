import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '../../ui/Button';

/** An icon alone on a button: silent itself, named by the button, the same words in its tooltip. */
export function IconButton({ label, Icon, ...props }: { label: string; Icon: LucideIcon } & ComponentProps<typeof Button>) {
  return (
    <Button {...props} variant="ghost" icon label={label}>
      <Icon size={16} aria-hidden />
    </Button>
  );
}
