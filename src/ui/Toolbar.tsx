import { Toolbar as BaseToolbar } from '@base-ui/react/toolbar';
import { Toggle } from '@base-ui/react/toggle';
import { ToggleGroup } from '@base-ui/react/toggle-group';
import type { ComponentProps, ReactNode } from 'react';
import { buttonClass } from './Button';
import { cx } from './cx';
import { Tip, TipGroup } from './Tooltip';
import s from './Toolbar.module.scss';

function Root({ className, ...props }: ComponentProps<typeof BaseToolbar.Root>) {
  return (
    <TipGroup>
      <BaseToolbar.Root {...props} className={cx(s.toolbar, className as string)} />
    </TipGroup>
  );
}

/** A set of mutually exclusive tools, e.g. Select / Rectangle / Pen. */
function Tools({ className, ...props }: ComponentProps<typeof ToggleGroup>) {
  return <ToggleGroup {...props} className={cx(s.group, className as string)} />;
}

type ToolProps = {
  value: string;
  label: string;
  children: ReactNode;
  /** Its shortcut, shown in the tooltip. */
  keys?: string[];
  className?: string;
  /** Holds a state still for display; see styles/_states.scss. */
  pin?: string;
  /** Demo only: name the tool with a native title instead of a Tip. */
  nativeTitle?: boolean;
};

/** One tool in a Tools group: an icon toggle, named by its tooltip. */
function Tool({ value, label, keys, children, className, pin, nativeTitle }: ToolProps) {
  const button = (
    <BaseToolbar.Button
      render={<Toggle value={value} />}
      aria-label={label}
      title={nativeTitle ? label : undefined}
      data-pin={pin}
      className={cx(buttonClass({ icon: true }), s.tool, className)}
    >
      {children}
    </BaseToolbar.Button>
  );
  return nativeTitle ? (
    button
  ) : (
    <Tip label={label} keys={keys}>
      {button}
    </Tip>
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
