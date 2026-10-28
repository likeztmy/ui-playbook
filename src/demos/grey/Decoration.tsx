import { Compare } from '../shell';
import { SignUp } from './SignUp';

/** What counts as decoration: the same form, with and without what could say anything else. */
export function GreyDecoration() {
  return (
    <Compare
      stacked
      height={0}
      beforeLabel="A slogan and a panel of shapes"
      afterLabel="The form, and what joining means"
      before={<SignUp decorated />}
      after={<SignUp />}
      beforeNote="Swap either slogan for any other and the page does the same job: by WCAG’s own test, that’s decoration. A screen reader skips the panel; everyone else gives it half the width."
      afterNote="One line that only this page could say: which workspace the account joins. The form starts where the eye does."
    />
  );
}
