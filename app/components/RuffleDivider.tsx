/** The flow divider — the hero's silk current carried between sections.
 *  A smooth wave edge in the color of the field above travels endlessly left
 *  to right (seamless one-period loop, GPU-composited), while two echo lines
 *  in the brand currents carry runner comets along the seam — the same motion
 *  language as Estela in the hero. Pure CSS; static under reduced motion.
 *
 *  (Component name kept from the earlier ruffle-hem incarnation so call
 *  sites stay untouched.)
 */

const P = 360; // wave period in viewBox units
const W = 1440 + P; // one extra period so a -20% travel loops seamlessly
const H = 64;

/** Smooth sine-like wave from x0 across `width`, centered on `mid`. */
function wave(x0: number, width: number, mid: number, amp: number): string {
  let d = `M${x0},${mid}`;
  for (let x = x0; x < x0 + width; x += P) {
    d += ` C${x + P * 0.25},${mid - amp} ${x + P * 0.25},${mid - amp} ${x + P * 0.5},${mid}`;
    d += ` C${x + P * 0.75},${mid + amp} ${x + P * 0.75},${mid + amp} ${x + P},${mid}`;
  }
  return d;
}

export function RuffleDivider({ from, flip = false }: { from: "noche" | "petrol" | "crudo" | "lima"; flip?: boolean }) {
  const fills: Record<string, string> = {
    noche: "var(--color-noche)",
    petrol: "var(--color-petrol)",
    crudo: "var(--color-crudo)",
    lima: "var(--color-lima)",
  };
  const amp = flip ? -14 : 14;
  // fill = the field above, hanging down to the wave edge
  const fillPath = `${wave(0, W, 26, amp)} L${W},0 L0,0 Z`;
  const echoA = wave(0, W, 40, amp);
  const echoB = wave(0, W, 52, amp * 0.75);

  return (
    <div aria-hidden="true" className="relative -mt-px h-12 w-full overflow-hidden sm:h-14" style={{ lineHeight: 0 }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="divider-travel absolute inset-y-0 left-0 h-full"
        style={{ width: `${(W / 1440) * 100}%` }}
        focusable="false"
      >
        <path d={fillPath} fill={fills[from]} />
        {/* echo currents in the brand inks */}
        <path d={echoA} fill="none" stroke="var(--color-teal)" strokeWidth="1.6" strokeOpacity="0.45" />
        <path d={echoB} fill="none" stroke="var(--color-lima)" strokeWidth="1.4" strokeOpacity="0.4" />
        {/* runner comets flowing left → right along the seam */}
        <path
          className="trail-runner"
          d={echoA}
          pathLength={1}
          fill="none"
          stroke="var(--color-crudo)"
          strokeWidth="2.4"
          strokeLinecap="round"
          style={{ "--runner-o": 0.55, "--runner-dur": "12.5s", "--runner-delay": "-4s" } as React.CSSProperties}
        />
        <path
          className="trail-runner"
          d={echoB}
          pathLength={1}
          fill="none"
          stroke="var(--color-lima)"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ "--runner-o": 0.5, "--runner-dur": "16s", "--runner-delay": "-11s" } as React.CSSProperties}
        />
      </svg>
    </div>
  );
}
