import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Popover } from '../../ui/Popover';
import { useToast } from '../../ui/Toast';
import { Toolbar } from '../../ui/Toolbar';

const LINK = 'https://example.com/s/wireframes';

/** The canvas's Share: a popover from the button with Copy link, then a toast that says it worked. */
export function Share() {
  const [open, setOpen] = useState(false);
  const toast = useToast();
  const copy = async () => {
    setOpen(false);
    try {
      await navigator.clipboard.writeText(LINK);
      toast({ title: 'Link copied', type: 'success' });
    } catch {
      toast({ title: 'Couldn’t copy the link: the browser blocked it', type: 'error' });
    }
  };
  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      trigger={<Toolbar.Action primary>Share</Toolbar.Action>}
      title="Share “Wireframes”"
      description="Anyone with the link can view."
      side="top"
      align="end"
      actions={
        <Button size="sm" onClick={copy}>
          Copy link
        </Button>
      }
    />
  );
}
