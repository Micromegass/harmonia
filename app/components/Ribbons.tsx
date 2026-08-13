import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { BEAT, EASE_DANCE } from "./motion";

/** Skirt-trail ribbons behind the hero: three thick flowing paths that draw in
 *  on the count, breathe continuously, and drift with scroll. The signature
 *  moment of the world — static composition under prefers-reduced-motion. */
export function Ribbons() {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const drift = useSpring(useTransform(scrollYProgress, [0, 1], [0, -120]), { stiffness: 60, damping: 20 });
  const driftSlow = useSpring(useTransform(scrollYProgress, [0, 1], [0, -60]), { stiffness: 60, damping: 20 });

  const ribbons = [
    {
      color: "var(--color-fucsia)",
      width: 90,
      opacity: 0.9,
      d: "M-100,520 C240,380 420,660 760,520 C1080,390 1240,560 1560,430",
      y: drift,
      dur: 11,
    },
    {
      color: "var(--color-coral)",
      width: 56,
      opacity: 0.8,
      d: "M-100,640 C300,540 520,760 900,620 C1180,520 1360,660 1560,560",
      y: driftSlow,
      dur: 13,
    },
    {
      color: "var(--color-sol)",
      width: 30,
      opacity: 0.85,
      d: "M-100,430 C260,330 500,540 840,430 C1140,340 1300,470 1560,360",
      y: drift,
      dur: 9,
    },
  ];

  return (
    <div ref={ref} aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" className="h-full w-full" focusable="false">
        {ribbons.map((r, i) => (
          <motion.g key={i} style={{ y: reduced ? 0 : r.y }}>
            <motion.path
              d={r.d}
              fill="none"
              stroke={r.color}
              strokeWidth={r.width}
              strokeLinecap="round"
              opacity={r.opacity}
              initial={reduced ? false : { pathLength: 0, y: 0 }}
              animate={
                reduced
                  ? { pathLength: 1 }
                  : { pathLength: 1, y: [0, -14, 0] }
              }
              transition={
                reduced
                  ? undefined
                  : {
                      pathLength: { duration: 1.6, ease: [...EASE_DANCE], delay: BEAT * i * 2 },
                      y: { repeat: Infinity, duration: r.dur, ease: "easeInOut" },
                    }
              }
            />
          </motion.g>
        ))}
      </svg>
      {/* soft vignette so the type stays readable over the trails */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--color-noche)_95%)]" />
    </div>
  );
}
