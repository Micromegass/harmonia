import { useEffect, useState } from "react";
import { m, useReducedMotion } from "motion/react";
import { BEAT } from "./motion";

/** La Bailarina — the logo's script "h" comes alive.
 *
 *  The letter draws itself in like a signature, holds a bar, then rises into a
 *  dancer (the same continuous strokes re-choreographed), dances a few bars on
 *  the 8-count, and settles back into the "h". Ghost copies trail fractions of
 *  a beat behind like a long-exposure motion trail. Every pose shares the same
 *  path structure, so the morphs read as one body moving.
 *  Static dancer under prefers-reduced-motion.
 */

type Pose = {
  head: { cx: number; cy: number };
  arm: string; // M + 2C
  arm2: string; // M + 1C
  body: string; // M + 4C
  leg2: string; // M + 2C
  skirtA: string; // M + 1C
  skirtB: string; // M + 1C
};

/** The script letter "h" — stem, arch, underline swash, dot above. */
const POSE_H: Pose = {
  head: { cx: 238, cy: 44 },
  // the h's arch and right leg
  arm: "M 182,382 C 220,338 254,350 254,398 C 254,428 250,456 248,478",
  // entry stroke into the ascender
  arm2: "M 148,122 C 168,92 190,76 216,72",
  // ascender curl → long stem → bottom hook rising toward the arch
  body: "M 216,72 C 186,62 166,88 174,122 C 186,212 182,330 180,420 C 178,458 184,482 198,472 C 212,460 222,436 228,408",
  // underline swash (the logo's flourish)
  leg2: "M 118,512 C 180,534 250,534 310,514 C 322,510 332,502 336,492",
  // exit flourish from the right leg
  skirtA: "M 248,478 C 258,500 282,508 306,498",
  skirtB: "M 244,494 C 258,512 284,518 308,510",
};

/** Dancer, attitude pose. */
const POSE_A: Pose = {
  head: { cx: 188, cy: 86 },
  arm: "M 200,132 C 236,108 258,76 244,46 C 236,29 214,30 210,48",
  arm2: "M 196,138 C 160,150 132,166 112,192",
  body: "M 196,114 C 208,158 194,214 200,258 C 162,300 248,318 226,268 C 238,346 210,438 224,520 C 228,543 242,554 262,554",
  leg2: "M 204,266 C 172,304 150,344 158,396 C 161,414 176,420 186,408",
  skirtA: "M 92,330 C 152,282 232,300 292,254",
  skirtB: "M 102,358 C 162,314 226,328 280,288",
};

/** Dancer, swaying counter-pose. */
const POSE_B: Pose = {
  head: { cx: 192, cy: 84 },
  arm: "M 200,132 C 240,100 266,64 246,36 C 236,21 212,26 212,46",
  arm2: "M 196,138 C 154,142 122,154 100,178",
  body: "M 196,114 C 212,160 200,216 204,258 C 168,302 252,314 228,266 C 246,344 224,436 208,516 C 200,540 214,552 236,556",
  leg2: "M 206,266 C 168,296 140,332 144,386 C 146,406 162,414 174,404",
  skirtA: "M 86,318 C 150,290 236,286 298,268",
  skirtB: "M 96,348 C 158,322 228,316 286,300",
};

const POSES = { H: POSE_H, A: POSE_A, B: POSE_B } as const;
/** The choreography: letter → dance four bars → letter again. */
const STEPS: { pose: keyof typeof POSES; holdBeats: number }[] = [
  { pose: "H", holdBeats: 12 },
  { pose: "A", holdBeats: 5 },
  { pose: "B", holdBeats: 5 },
  { pose: "A", holdBeats: 5 },
  { pose: "B", holdBeats: 5 },
];
const DRAW_MS = 1900; // signature draw-in before the first rise

const PART_STYLE = {
  arm: { stroke: "var(--color-crudo)", width: 9 },
  arm2: { stroke: "var(--color-crudo)", width: 9 },
  body: { stroke: "var(--color-crudo)", width: 9 },
  leg2: { stroke: "var(--color-crudo)", width: 9 },
  skirtA: { stroke: "var(--color-lima)", width: 24, opacity: 0.95 },
  skirtB: { stroke: "var(--color-teal)", width: 14, opacity: 0.9 },
} as const;
type Part = keyof typeof PART_STYLE;
const DRAW_ORDER: Record<Part, number> = { body: 0, arm: 1, arm2: 2, leg2: 3, skirtA: 4, skirtB: 5 };

function Figure({ pose, ghost = false, lag = 0, draw = false }: { pose: Pose; ghost?: boolean; lag?: number; draw?: boolean }) {
  const morph = { duration: BEAT * 4.5, ease: "easeInOut" as const, delay: lag };
  return (
    <>
      <m.ellipse
        initial={false}
        animate={{ cx: pose.head.cx, cy: pose.head.cy }}
        transition={morph}
        rx="22"
        ry="17"
        fill="none"
        stroke={ghost ? "var(--color-teal)" : "var(--color-crudo)"}
        strokeWidth={ghost ? 11 : 9}
        pathLength={1}
        className={draw ? "bailarina-draw" : undefined}
        style={draw ? { animationDelay: "0.55s" } : undefined}
      />
      {(Object.keys(PART_STYLE) as Part[]).map((part) => {
        const st = PART_STYLE[part];
        return (
          <m.path
            key={part}
            initial={false}
            animate={{ d: pose[part] }}
            transition={morph}
            d={POSE_H[part]}
            fill="none"
            stroke={ghost ? (part === "skirtA" ? "var(--color-teal)" : part === "skirtB" ? "var(--color-lima)" : "var(--color-teal)") : st.stroke}
            strokeWidth={ghost ? st.width + 3 : st.width}
            strokeLinecap="round"
            opacity={"opacity" in st ? st.opacity : undefined}
            pathLength={1}
            className={draw ? "bailarina-draw" : undefined}
            style={draw ? { animationDelay: `${0.24 * DRAW_ORDER[part]}s` } : undefined}
          />
        );
      })}
    </>
  );
}

export function Bailarina({ className = "" }: { className?: string }) {
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const holdMs = STEPS[step].holdBeats * BEAT * 1000 + (step === 0 ? DRAW_MS : 0);
    const id = setTimeout(() => setStep((s) => (s + 1) % STEPS.length), holdMs);
    return () => clearTimeout(id);
  }, [step, reduced]);

  if (reduced) {
    return (
      <svg viewBox="0 0 400 640" className={className} aria-hidden="true" focusable="false">
        <Figure pose={POSE_A} />
      </svg>
    );
  }

  const pose = POSES[STEPS[step].pose];
  const sway = {
    repeat: Infinity,
    repeatType: "mirror" as const,
    duration: BEAT * 8,
    ease: "easeInOut" as const,
  };

  return (
    <svg viewBox="0 0 400 640" className={className} aria-hidden="true" focusable="false">
      <m.g
        style={{ originX: "55%", originY: "88%" }}
        initial={{ rotate: -2, opacity: 0 }}
        animate={{ rotate: 2, opacity: 0.15 }}
        transition={{ ...sway, delay: BEAT * 1.2, opacity: { delay: DRAW_MS / 1000 + 0.4, duration: 0.6 } }}
      >
        <Figure pose={pose} ghost lag={BEAT * 1.1} />
      </m.g>
      <m.g
        style={{ originX: "55%", originY: "88%" }}
        initial={{ rotate: -2, opacity: 0 }}
        animate={{ rotate: 2, opacity: 0.3 }}
        transition={{ ...sway, delay: BEAT * 0.6, opacity: { delay: DRAW_MS / 1000 + 0.4, duration: 0.6 } }}
      >
        <Figure pose={pose} ghost lag={BEAT * 0.55} />
      </m.g>
      <m.g
        style={{ originX: "55%", originY: "88%" }}
        initial={{ rotate: -2 }}
        animate={{ rotate: 2 }}
        transition={sway}
      >
        <Figure pose={pose} draw />
      </m.g>
    </svg>
  );
}
