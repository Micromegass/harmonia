import { m, useReducedMotion } from "motion/react";

/** The ruffle hem — the world's section divider, visibly alive. The scalloped
 *  edge rolls sideways like fabric being pulled through a turn (seamless
 *  one-scallop travel loop) while its depth breathes between two wave phases.
 *  Runs only while in view; static hem under prefers-reduced-motion. */
export function RuffleDivider({ from, flip = false }: { from: "noche" | "petrol" | "crudo" | "lima"; flip?: boolean }) {
  const reduced = useReducedMotion();
  const fills: Record<string, string> = {
    noche: "var(--color-noche)",
    petrol: "var(--color-petrol)",
    crudo: "var(--color-crudo)",
    lima: "var(--color-lima)",
  };
  const dir = flip ? -1 : 1;
  // 16 scallops (two extra periods each side) so a 240px travel loops seamlessly
  // (amplitudes alternate, so the true period is two scallops = 240px).
  const hem = (amps: number[]) =>
    `M-240,0 L-240,0 ${amps.map((a) => `q ${60},${dir * a} ${120},0`).join(" ")} L1680,0 Z`;
  const phaseA = hem(Array.from({ length: 16 }, (_, i) => (i % 2 === 0 ? 40 : 62)));
  const phaseB = hem(Array.from({ length: 16 }, (_, i) => (i % 2 === 0 ? 62 : 40)));

  return (
    <div aria-hidden="true" className="relative -mt-px h-8 w-full overflow-hidden sm:h-10" style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 52"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        focusable="false"
      >
        {reduced ? (
          <path d={phaseA} fill={fills[from]} />
        ) : (
          <m.path
            d={phaseA}
            fill={fills[from]}
            initial={{ x: 0 }}
            whileInView={{ x: -240, d: phaseB }}
            viewport={{ amount: 0.1 }}
            transition={{
              x: { repeat: Infinity, duration: 8.96, ease: "linear" }, // 8 bars
              d: { repeat: Infinity, repeatType: "mirror", duration: 4.48, ease: "easeInOut" }, // 4 bars
            }}
          />
        )}
      </svg>
    </div>
  );
}
