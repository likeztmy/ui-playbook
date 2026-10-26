import { VISION, type Vision } from './maths';

/** An SVG filter that shows its contents as a colour-blind eye would: Machado et al. 2009, severity 1. */
export function VisionFilter({ id, vision }: { id: string; vision: Exclude<Vision, 'typical'> }) {
  const values = VISION[vision].map((row) => `${row.join(' ')} 0 0`).join(' ') + ' 0 0 0 1 0';
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      {/* feColorMatrix works in linear RGB by default, where the matrices are defined. */}
      <filter id={id}>
        <feColorMatrix type="matrix" values={values} />
      </filter>
    </svg>
  );
}
