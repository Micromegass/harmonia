/** The ruffle hem — the world's section divider. A scalloped skirt edge in the
 *  color of the field above, laid over the top of the field below. */
export function RuffleDivider({ from, flip = false }: { from: "noche" | "petrol" | "crudo" | "lima"; flip?: boolean }) {
  const fills: Record<string, string> = {
    noche: "var(--color-noche)",
    petrol: "var(--color-petrol)",
    crudo: "var(--color-crudo)",
    lima: "var(--color-lima)",
  };
  // 12 scallops across the width, like a gathered hem.
  const scallops = Array.from({ length: 12 }, (_, i) => `q ${60},${flip ? -52 : 52} ${120},0`).join(" ");
  return (
    <div aria-hidden="true" className="relative -mt-px h-8 w-full sm:h-10" style={{ lineHeight: 0 }}>
      <svg
        viewBox="0 0 1440 52"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        focusable="false"
      >
        <path d={`M0,0 L0,0 ${scallops} L1440,0 Z`} fill={fills[from]} />
      </svg>
    </div>
  );
}
