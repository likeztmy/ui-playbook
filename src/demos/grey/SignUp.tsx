import { Button } from '../../ui/Button';
import { Checkbox } from '../../ui/Checkbox';
import { TextField } from '../../ui/Field';
import s from './grey.module.scss';

/** The form both versions share: what the person came to do. */
function Form() {
  return (
    <form className={s.form} onSubmit={(e) => e.preventDefault()}>
      <TextField label="Name" autoComplete="name" />
      <TextField label="Email" type="email" placeholder="ana@studio.com" autoComplete="email" />
      <TextField label="Password" type="password" description="At least 10 characters, with a number." autoComplete="new-password" />
      <Checkbox label="I agree to the Terms" />
      <Button variant="primary" type="submit">
        Create account
      </Button>
    </form>
  );
}

/**
 * A sign-up page. `decorated` adds what the eval's builds added: an eyebrow, a slogan for a title,
 * and half the width given to a tinted panel of shapes and a second slogan.
 */
export function SignUp({ decorated }: { decorated?: boolean }) {
  if (!decorated)
    return (
      <div className={s.signupBox}>
        <div className={s.signup}>
          <div className={s.column}>
            <header className={s.signupHead}>
              <h3>Create your Track account</h3>
              <p>You’ll join the Shop app workspace as a member.</p>
            </header>
            <Form />
          </div>
        </div>
      </div>
    );
  return (
    <div className={s.signupBox}>
      <div className={s.signup} data-decorated="">
        <div className={s.column}>
          <header className={s.signupHead}>
            <span className={s.eyebrow}>Great things start here</span>
            <h3>A little you. A lot of possibility.</h3>
            <p>Create your free account. See where your ideas go.</p>
          </header>
          <Form />
        </div>
        <div className={s.art} aria-hidden>
          <span className={s.eyebrow}>A space for big ideas</span>
          <div className={s.shapes}>
            <span />
            <span />
            <span />
          </div>
          <p className={s.slogan}>Big ideas. Beautiful beginnings.</p>
        </div>
      </div>
    </div>
  );
}
