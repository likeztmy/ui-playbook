// The demo frames every page imports: a stage, a pair to compare, a stage with dials, and the
// variant and state specimens. Each lives in ./frame; this file keeps the one import path.
export { localized, useLang, type Lang } from './frame/lang';
export { Measured } from './frame/Measured';
export { Frame } from './frame/Frame';
export { Compare } from './frame/Compare';
export { Tweak } from './frame/Tweak';
export { StateGrid, STATES, statePin, type State } from './frame/StateGrid';
export { Gallery } from './frame/Gallery';
