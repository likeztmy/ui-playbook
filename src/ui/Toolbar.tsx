import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps, ReactNode } from 'react';
import { buttonClass } from './Button';
import { cx } from './cx';
import s from './Toolbar.module.scss';

function Root({ className, ...props }: ComponentProps<typeof BaseToolbar.Root>) {
  return <BaseToolbar.Root {...props} className={cx(s.toolbar, className as string)} />;
}

/** A set of mutually exclusive tools, e.g. Select / Rectangle / Pen. */
function Tools({ className, ...props }: ComponentProps<typeof ToggleGroup>) {
  return <ToggleGroup {...props} className={cx(s.group, className as string)} />;
}

type ToolProps = {
  value: string;
  label: string;
  children: ReactNode;
  className?: string;
  /** Holds a state still for display; see styles/_states.scss. */
  pin?: string;
};

/** One tool in a Tools group: an icon toggle named by its label. */
function Tool({ value, label, children, className, pin }: ToolProps) {
  return (
    <BaseToolbar.Button
      render={<Toggle value={value} />}
      aria-label={label}
      title={label}
      data-pin={pin}
      className={cx(buttonClass({ icon: true }), s.tool, className)}
    >
      {children}
    </BaseToolbar.Button>
  );
}

type ActionProps = ComponentProps<typeof BaseToolbar.Button> & { primary?: boolean };

function Action({ primary, className, ...props }: ActionProps) {
  return (
    <BaseToolbar.Button
      {...props}
      className={cx(buttonClass({ variant: primary ? 'primary' : 'secondary' }), !primary && s.tool, className as string)}
    />
  );
}

function Separator() {
  return <BaseToolbar.Separator className={s.separator} />;
}

export const Toolbar = { Root, Tools, Tool, Action, Separator };
