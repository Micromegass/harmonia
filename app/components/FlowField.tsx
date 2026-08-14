/** Estela — the hero's silk-trail field. Two mirrored sheaves of thin flowing
 *  lines sweep diagonally through the night. Motion is a calm, seamless
 *  current: each line carries a long dash that drifts along its own curve
 *  (dashoffset loops by exactly one period, so nothing ever pops or vanishes)
 *  at constant opacity, with one soft fade-in on arrival.
 *
 *  Deliberately framer-free: the drift is pure CSS (see .trail in app.css),
 *  so 52 endless animations cost no main-thread work, the prerendered markup
 *  matches hydration byte-for-byte, and the global reduced-motion kill-switch
 *  freezes everything into the static composition.
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
  // The mirrored sheaf sweeps through the lower half so the field frames the
  // whole viewport instead of pooling at the top.
  const y0 = position === -1 ? 430 : 0;
  const paths = Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    d: `M${-420 - i * 6 * position} ${y0 + 120 + i * 9}C${-200 - i * 7 * position} ${y0 + 80 + i * 10} ${180 - i * 5 * position} ${y0 + 420 - i * 7} ${640 - i * 6 * position} ${y0 + 330 - i * 8}C${1100 - i * 7 * position} ${y0 + 240 - i * 9} ${1320 - i * 5 * position} ${y0 + 560 - i * 6} ${1900 - i * 6 * position} ${y0 + 420 - i * 7}`,
    width: 1 + i * 0.14,
    opacity: 0.07 + i * 0.022,
    duration: (26 + jitter(i, position) * 18).toFixed(2),
    delay: (jitter(i, position + 3) * 2).toFixed(2),
  }));

  return (
    <>
      {paths.map((p) => (
        <path
          key={p.id}
          className="trail"
          d={p.d}
          pathLength={1}
          stroke={trailColor(p.id)}
          strokeWidth={p.width}
          strokeLinecap="round"
          fill="none"
          style={
            {
              "--trail-o": p.opacity,
              "--trail-drift": `${p.duration}s`,
              "--trail-delay": `${p.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
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
