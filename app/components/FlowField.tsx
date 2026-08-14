/** Estela — the hero's silk-trail field. Two mirrored sheaves of thin flowing
 *  lines sweep diagonally through the night.
 *
 *  Chrome-calm architecture: the base lines are completely static (no repaint,
 *  no anti-aliasing shimmer). The sense of current comes from a few "runner"
 *  comets — short bright dashes drifting along every fourth line — plus one
 *  imperceptible GPU-composited drift of the whole field. Repaint cost per
 *  frame: ~14 short strokes instead of 52 full-width dash patterns.
 *  Reduced motion: the global kill-switch freezes runners and drift.
 */

const COUNT = 26;

/** Deterministic per-index variation (no Math.random — hydration-stable). */
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function trailColor(i: number): string {
  if (i % 5 === 0) return "var(--color-lima)";
  if (i % 3 === 0) return "var(--color-crudo)";
  return "var(--color-teal)";
}

export function sheafPaths(position: 1 | -1) {
  const y0 = position === -1 ? 430 : 0;
  return Array.from({ length: COUNT }, (_, i) => ({
    id: i,
    d: `M${-420 - i * 6 * position} ${y0 + 120 + i * 9}C${-200 - i * 7 * position} ${y0 + 80 + i * 10} ${180 - i * 5 * position} ${y0 + 420 - i * 7} ${640 - i * 6 * position} ${y0 + 330 - i * 8}C${1100 - i * 7 * position} ${y0 + 240 - i * 9} ${1320 - i * 5 * position} ${y0 + 560 - i * 6} ${1900 - i * 6 * position} ${y0 + 420 - i * 7}`,
    width: 1 + i * 0.14,
    opacity: 0.07 + i * 0.022,
  }));
}

function Sheaf({ position }: { position: 1 | -1 }) {
  const paths = sheafPaths(position);
  return (
    <>
      {/* static silk — never repaints */}
      {paths.map((p) => (
        <path
          key={p.id}
          d={p.d}
          stroke={trailColor(p.id)}
          strokeWidth={p.width}
          strokeOpacity={p.opacity}
          strokeLinecap="round"
          fill="none"
        />
      ))}
      {/* runners — soft comets drifting along every fourth line */}
      {paths
        .filter((p) => p.id % 4 === 2)
        .map((p) => (
          <path
            key={`run-${p.id}`}
            className="trail-runner"
            d={p.d}
            pathLength={1}
            stroke={p.id % 3 === 0 ? "var(--color-lima)" : "var(--color-crudo)"}
            strokeWidth={p.width + 0.8}
            strokeLinecap="round"
            fill="none"
            style={
              {
                "--runner-o": Math.min(0.5, p.opacity * 2.4),
                "--runner-dur": `${(22 + jitter(p.id, position) * 16).toFixed(2)}s`,
                "--runner-delay": `${(-jitter(p.id, position + 5) * 30).toFixed(2)}s`,
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
        className="field-drift h-full w-full"
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
