/** The 8-count choreography system. Every animation on the site derives its
 *  timing from BEAT and its feel from these shared curves — motion reads as one
 *  choreography, not scattered effects. */
import type { Variants } from "motion/react";

/** One musical beat, in seconds. Delays are multiples of this. */
export const BEAT = 0.14;

/** Exponential ease-out — the "land the step" curve for entrances. */
export const EASE_DANCE = [0.16, 1, 0.3, 1] as const;

/** Standard entrance: rise and fade, landing on an exact beat. */
export function riseIn(beats = 0): Variants {
  return {
    hidden: { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: BEAT * 4, ease: [...EASE_DANCE], delay: BEAT * beats },
    },
  };
}

export const viewportOnce = { once: true, amount: 0.2, margin: "0px 0px -40px 0px" } as const;
