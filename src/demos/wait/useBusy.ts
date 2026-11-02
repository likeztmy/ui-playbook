import { useEffect, useState } from 'react';

/** Show a spinner only after this long, as delay-loading does. */
export const DELAY = 300;

/**
 * Whether a running job's button shows it's busy: only once the job has run past delay-loading,
 * so a quick one never flashes the spinner. It goes the moment the job ends.
 */
export function useBusy(running: boolean) {
  const [late, setLate] = useState(false);
  useEffect(() => {
    if (!running) return setLate(false);
    const t = setTimeout(() => setLate(true), DELAY);
    return () => clearTimeout(t);
  }, [running]);
  return running && late;
}
