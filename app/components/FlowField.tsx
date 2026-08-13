import { m, useReducedMotion } from "motion/react";

/** Estela — the hero's silk-trail field. Two mirrored sheaves of thin flowing
 *  lines sweep diagonally through the night like ribbons caught in a turn,
 *  perpetually drawing and releasing along their own curves (pathLength +
 *  pathOffset loops). Replaces figurative animation with pure motion: the
 *  trails ARE the dance. Static sheaf under prefers-reduced-motion.
 */

const COUNT = 26;

/** Deterministic per-index variation (no Math.random — hydration-stable). */
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

function trailColor(i: number): string {
  if (i % 5 === 0) return "var(--color-lima)";
  if (i % 3 === 0) return "var(--color-crudo)";
  return "var(--color-teal)";
}

function Sheaf({ position }: { position: 1 | -1 }) {
  const reduced = useReducedMotion();
  // The mirrored sheaf sweeps through the lower half so the field frames the
  // whole viewport instead of pooling at the top.
  const y0 = position === -1 ? 430 : 0;
  const paths = Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    d: `M${-420 - i * 6 * position} ${y0 + 120 + i * 9}C${-200 - i * 7 * position} ${y0 + 80 + i * 10} ${180 - i * 5 * position} ${y0 + 420 - i * 7} ${640 - i * 6 * position} ${y0 + 330 - i * 8}C${1100 - i * 7 * position} ${y0 + 240 - i * 9} ${1320 - i * 5 * position} ${y0 + 560 - i * 6} ${1900 - i * 6 * position} ${y0 + 420 - i * 7}`,
    width: 1 + i * 0.14,
    opacity: 0.06 + i * 0.024,
    duration: 16 + jitter(i, position) * 14,
    delay: jitter(i, position + 3) * 6,
  }));

  return (
    <>
      {paths.map((p) =>
        reduced ? (
          <path
            key={p.id}
            d={p.d}
            stroke={trailColor(p.id)}
            strokeWidth={p.width}
            strokeOpacity={p.opacity}
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          <m.path
            key={p.id}
            d={p.d}
            stroke={trailColor(p.id)}
            strokeWidth={p.width}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0.3, opacity: 0 }}
            animate={{
              pathLength: 1,
              pathOffset: [0, 1, 0],
              opacity: [p.opacity * 0.5, p.opacity * 2.2, p.opacity * 0.5],
            }}
            transition={{
              pathLength: { duration: 2, ease: [0.16, 1, 0.3, 1] },
              pathOffset: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
              opacity: { duration: p.duration, repeat: Infinity, ease: "linear", delay: p.delay },
            }}
          />
        ),
      )}
    </>
  );
}

export function FlowField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
        focusable="false"
      >
        <Sheaf position={1} />
        <Sheaf position={-1} />
      </svg>
      {/* vignette keeps the type in charge */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,var(--color-noche)_96%)]" />
    </div>
  );
}
