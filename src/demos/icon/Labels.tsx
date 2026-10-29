import { Compare } from '../shell';
import { Nav } from './Nav';
import s from './icon.module.scss';

/** Navigation as icons with tooltips, or as icons beside their words. */
export function IconLabels() {
  return (
    <Compare
      height={240}
      beforeLabel="Icons, named on hover"
      afterLabel="Icons beside their words"
      before={
        <div className={s.navStage}>
          <Nav rail />
        </div>
      }
      after={
        <div className={s.navStage}>
          <Nav />
        </div>
      }
      beforeNote={
        <>
          An icon-only version of a program did “much poorer” than labelled ones in the first session and caught up only by the second (
          <a href="https://doi.org/10.1080/014492999119129">Wiedenbeck, 1999</a>). Each place here costs a hover to confirm, and a new teammate hovers
          all five.
        </>
      }
      afterNote={
        <>
          The word is read on the first visit; the icon becomes the quicker cue once it’s familiar.{' '}
          <a href="https://m3.material.io/styles/icons/applying-icons">Material</a>: “navigation items must have labels”. Fluent’s Nav has no
          icon-only layout at all.
        </>
      }
    />
  );
}
