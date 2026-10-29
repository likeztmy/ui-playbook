import type { LucideIcon } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Button } from '../../ui/Button';
import { Tip } from '../../ui/Tooltip';

/** An icon alone on a button: silent itself, named by the button, the same words in its tooltip. */
export function IconButton({ label, Icon, ...props }: { label: string; Icon: LucideIcon } & ComponentProps<typeof Button>) {
  return (
    <Tip label={label}>
      <Button {...props} variant="ghost" icon aria-label={label}>
        <Icon size={16} aria-hidden />
      </Button>
    </Tip>
  );
}
