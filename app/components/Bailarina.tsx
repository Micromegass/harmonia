import { m, useReducedMotion } from "motion/react";
import { BEAT } from "./motion";

/** La Bailarina — the logo's continuous-line dancer, alive.
 *
 *  She draws herself in like a signature (CSS stroke-dashoffset, staggered),
 *  then dances on the 8-count: framer morphs every path between two poses
 *  while the whole figure sways from the standing foot. Two ghost copies lag
 *  fractions of a beat behind, leaving the motion trail of a long exposure.
 *  Static, fully-drawn figure under prefers-reduced-motion.
 */

const POSE_A = {
  // arm curling above the head (the logo's curl)
  arm: "M 200,132 C 236,108 258,76 244,46 C 236,29 214,30 210,48",
  // arm opening to the side
  arm2: "M 196,138 C 160,150 132,166 112,192",
  // torso arc → hip loop (the glyph) → standing leg → foot flick
  body: "M 196,114 C 208,158 194,214 200,258 C 162,300 248,318 226,268 C 238,346 210,438 224,520 C 228,543 242,554 262,554",
  // back leg in attitude, curling up behind
  leg2: "M 204,266 C 172,304 150,344 158,396 C 161,414 176,420 186,408",
  // twirling skirt through the hips
  skirtA: "M 92,330 C 152,282 232,300 292,254",
  skirtB: "M 102,358 C 162,314 226,328 280,288",
};
const POSE_B = {
  arm: "M 200,132 C 240,100 266,64 246,36 C 236,21 212,26 212,46",
  arm2: "M 196,138 C 154,142 122,154 100,178",
  body: "M 196,114 C 212,160 200,216 204,258 C 168,302 252,314 228,266 C 246,344 224,436 208,516 C 200,540 214,552 236,556",
  leg2: "M 206,266 C 168,296 140,332 144,386 C 146,406 162,414 174,404",
  skirtA: "M 86,318 C 150,290 236,286 298,268",
  skirtB: "M 96,348 C 158,322 228,316 286,300",
};

const LOOP_BEATS = 8;
type Part = "arm" | "arm2" | "body" | "leg2" | "skirtA" | "skirtB";
const LINE_PARTS: { part: Part; drawOrder: number }[] = [
  { part: "body", drawOrder: 0 },
  { part: "arm", drawOrder: 1 },
  { part: "leg2", drawOrder: 2 },
  { part: "arm2", drawOrder: 3 },
  { part: "skirtA", drawOrder: 4 },
  { part: "skirtB", drawOrder: 5 },
];

function partStyle(part: Part, ghost: boolean): { stroke: string; width: number; opacity?: number } {
  if (part === "skirtA") return { stroke: ghost ? "var(--color-teal)" : "var(--color-lima)", width: ghost ? 30 : 26, opacity: 0.95 };
  if (part === "skirtB") return { stroke: ghost ? "var(--color-lima)" : "var(--color-teal)", width: ghost ? 18 : 15, opacity: 0.9 };
  return { stroke: ghost ? "var(--color-teal)" : "var(--color-crudo)", width: ghost ? 11 : 9 };
}

function Figure({ ghost = false, phase = 0, draw = false }: { ghost?: boolean; phase?: number; draw?: boolean }) {
  return (
    <>
      <ellipse
        cx="188"
        cy="86"
        rx="22"
        ry="17"
        transform="rotate(-12 188 86)"
        fill="none"
        stroke={ghost ? "var(--color-teal)" : "var(--color-crudo)"}
        strokeWidth={ghost ? 11 : 9}
        pathLength={1}
        className={draw ? "bailarina-draw" : undefined}
        style={draw ? { animationDelay: "0.5s" } : undefined}
      />
      {LINE_PARTS.map(({ part, drawOrder }) => {
        const st = partStyle(part, ghost);
        return (
          <m.path
            key={part}
            initial={{ d: POSE_A[part] }}
            animate={{ d: POSE_B[part] }}
            transition={{
              repeat: Infinity,
              repeatType: "mirror",
              duration: BEAT * LOOP_BEATS,
              ease: "easeInOut",
              delay: 1.7 + phase,
            }}
            fill="none"
            stroke={st.stroke}
            strokeWidth={st.width}
            strokeLinecap="round"
            opacity={st.opacity}
            pathLength={1}
            className={draw ? "bailarina-draw" : undefined}
            style={draw ? { animationDelay: `${0.22 * drawOrder}s` } : undefined}
          />
        );
      })}
    </>
  );
}

export function Bailarina({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <svg viewBox="0 0 400 640" className={className} aria-hidden="true" focusable="false">
        <StaticFigure />
      </svg>
    );
  }

  const sway = (delay: number) => ({
    repeat: Infinity,
    repeatType: "mirror" as const,
    duration: BEAT * LOOP_BEATS,
    ease: "easeInOut" as const,
    delay: 1.7 + delay,
  });

  return (
    <svg viewBox="0 0 400 640" className={className} aria-hidden="true" focusable="false">
      {/* ghost echoes lag behind the lead figure — the motion trail */}
      <m.g
        style={{ originX: "55%", originY: "88%" }}
        initial={{ rotate: -2.4, opacity: 0 }}
        animate={{ rotate: 2.4, opacity: 0.16 }}
        transition={{ ...sway(BEAT * 1.2), opacity: { delay: 2.2, duration: 0.6 } }}
      >
        <Figure ghost phase={BEAT * 1.2} />
      </m.g>
      <m.g
        style={{ originX: "55%", originY: "88%" }}
        initial={{ rotate: -2.4, opacity: 0 }}
        animate={{ rotate: 2.4, opacity: 0.3 }}
        transition={{ ...sway(BEAT * 0.6), opacity: { delay: 2.2, duration: 0.6 } }}
      >
        <Figure ghost phase={BEAT * 0.6} />
      </m.g>
      {/* lead figure: draws in via CSS dashoffset, then dances */}
      <m.g
        style={{ originX: "55%", originY: "88%" }}
        initial={{ rotate: -2.4 }}
        animate={{ rotate: 2.4 }}
        transition={sway(0)}
      >
        <Figure draw />
      </m.g>
    </svg>
  );
}

function StaticFigure() {
  return (
    <>
      <ellipse cx="188" cy="86" rx="22" ry="17" transform="rotate(-12 188 86)" fill="none" stroke="var(--color-crudo)" strokeWidth="9" />
      {LINE_PARTS.map(({ part }) => {
        const st = partStyle(part, false);
        return (
          <path key={part} d={POSE_A[part]} fill="none" stroke={st.stroke} strokeWidth={st.width} strokeLinecap="round" opacity={st.opacity} />
        );
      })}
    </>
  );
}
