import { CircleAlert } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { TextField } from '../../ui/Field';
import { Compare } from '../shell';
import s from './copy.module.scss';

/** A sign-up whose request failed: the message under the terms box, or with the action that failed. */
function SignUp({ misplaced }: { misplaced?: boolean }) {
  const message = (text: string) => (
    <p className={s.error} role="alert">
      <CircleAlert size={14} aria-hidden />
      {text}
    </p>
  );
  return (
    <form className={s.form} onSubmit={(e) => e.preventDefault()}>
      <TextField label="Email" type="email" defaultValue="ana@studio.com" />
      <div>
        <Checkbox label="I agree to the Terms" defaultChecked />
        {misplaced && message('Something went wrong. Please try again.')}
      </div>
      {!misplaced && message('Couldn’t create your account: the server didn’t respond. Try again in a moment.')}
      <Button variant="primary" type="submit">
        Create account
      </Button>
    </form>
  );
}

export function CopyErrorPlace() {
  return (
    <Compare
      height={260}
      beforeLabel="Under the terms box"
      afterLabel="With the action that failed"
      before={<SignUp misplaced />}
      after={<SignUp />}
      beforeNote="Two agents’ sign-up builds stored the server’s failure as the terms checkbox’s error. It reads as a fault in the box that was ticked, gives no cause, and asks politely for what the person has no choice about."
      afterNote={
        <>
          What failed, why, and the next step, beside the button that failed.{' '}
          <a href="https://github.com/Shopify/polaris/blob/main/polaris.shopify.com/content/content/error-messages.mdx">Polaris</a> allows a generic
          cause only with a next step.
        </>
      }
    />
  );
}
