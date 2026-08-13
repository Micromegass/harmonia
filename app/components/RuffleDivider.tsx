import { m, useReducedMotion } from "motion/react";

/** The ruffle hem — the world's section divider, now alive. The scalloped
 *  skirt edge breathes between two wave phases and sways gently sideways
 *  while in view, so every section change moves like fabric mid-turn.
 *  Static hem under prefers-reduced-motion. */
export function RuffleDivider({ from, flip = false }: { from: "noche" | "petrol" | "crudo" | "lima"; flip?: boolean }) {
  const reduced = useReducedMotion();
  const fills: Record<string, string> = {
    noche: "var(--color-noche)",
    petrol: "var(--color-petrol)",
    crudo: "var(--color-crudo)",
    lima: "var(--color-lima)",
  };
  const dir = flip ? -1 : 1;
  // 12 scallops; phase A = even hem, phase B = traveling wave (alternating depth).
  const hem = (amps: number[]) =>
    `M0,0 L0,0 ${amps.map((a) => `q ${60},${dir * a} ${120},0`).join(" ")} L1440,0 Z`;
  const phaseA = hem(Array.from({ length: 12 }, () => 52));
  const phaseB = hem(Array.from({ length: 12 }, (_, i) => (i % 2 === 0 ? 38 : 64)));

  return (
    <div aria-hidden="true" className="relative -mt-px h-8 w-full overflow-hidden sm:h-10" style={{ lineHeight: 0 }}>
      <m.svg
        viewBox="0 0 1440 52"
        preserveAspectRatio="none"
        className="absolute inset-x-[-2%] inset-y-0 h-full w-[104%]"
        focusable="false"
        {...(!reduced && {
          initial: { x: "-0.6%" },
          whileInView: { x: "0.6%" },
          viewport: { amount: 0.1 },
          transition: { repeat: Infinity, repeatType: "mirror" as const, duration: 7, ease: "easeInOut" as const },
        })}
      >
        <m.path
          d={phaseA}
          fill={fills[from]}
          {...(!reduced && {
            whileInView: { d: phaseB },
            viewport: { amount: 0.1 },
            transition: { repeat: Infinity, repeatType: "mirror" as const, duration: 3.4, ease: "easeInOut" as const },
          })}
        />
      </m.svg>
    </div>
  );
}
