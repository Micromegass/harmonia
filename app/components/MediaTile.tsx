import { useTranslation } from "react-i18next";
import type { Locale } from "../i18n/routing";

export type MediaAsset = {
  id: string;
  file: string;
  type: "image" | "video";
  styleTag: string;
  orientation: "portrait" | "landscape";
  placeholder: boolean;
  alt: Record<Locale, string>;
  caption?: Record<Locale, string>;
  width?: number;
  height?: number;
  widths?: number[];
  blurDataURL?: string;
  poster?: string | null;
  formats?: string[];
};

const STYLE_COLORS: Record<string, [string, string]> = {
  salsa: ["var(--color-lima)", "var(--color-teal)"],
  bachata: ["var(--color-teal)", "var(--color-lima)"],
  urbano: ["var(--color-crudo)", "var(--color-lima)"],
  tropical: ["var(--color-lima)", "var(--color-crudo)"],
  kids: ["var(--color-lima)", "var(--color-teal)"],
  contemporaneo: ["var(--color-crudo)", "var(--color-teal)"],
};

/** Deterministic pseudo-random from the asset id, so placeholder art is stable. */
function seedFrom(id: string) {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) h = Math.imul(h ^ id.charCodeAt(i), 16777619);
  return (min: number, max: number) => {
    h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0;
    return min + (h % 1000) / 1000 * (max - min);
  };
}

/** Branded placeholder: ribbon strokes in the style's colors — visibly honest
 *  stand-in until her real photos land (see MEDIA.md). */
export function PlaceholderArt({ asset, styleName }: { asset: MediaAsset; styleName: string }) {
  const [c1, c2] = STYLE_COLORS[asset.styleTag] ?? STYLE_COLORS.salsa;
  const rnd = seedFrom(asset.id);
  const h = asset.orientation === "portrait" ? 500 : 300;
  const paths = Array.from({ length: 3 }, (_, i) => {
    const y = (h / 4) * (i + 1) + rnd(-30, 30);
    return {
      d: `M-40,${y} C ${100 + rnd(-40, 40)},${y - rnd(20, 90)} ${240 + rnd(-40, 40)},${y + rnd(20, 90)} 440,${y + rnd(-40, 40)}`,
      w: rnd(14, 42),
      color: i === 2 ? c2 : c1,
      o: 0.55 + i * 0.18,
    };
  });
  return (
    <svg
      viewBox={`0 0 400 ${h}`}
      className="h-full w-full"
      role="img"
      aria-label={""}
      aria-hidden="true"
      focusable="false"
      style={{ background: "var(--color-noche-2)", display: "block" }}
      preserveAspectRatio="xMidYMid slice"
    >
      {paths.map((p, i) => (
        <path key={i} d={p.d} fill="none" stroke={p.color} strokeWidth={p.w} strokeLinecap="round" opacity={p.o} />
      ))}
      <text
        x="16"
        y={h - 18}
        fill="var(--color-crudo)"
        opacity="0.85"
        style={{ font: "700 13px Archivo, sans-serif", textTransform: "uppercase", letterSpacing: "0.06em" }}
      >
        {styleName}
      </text>
    </svg>
  );
}

/** Renders a manifest asset: processed picture/video when available, branded
 *  placeholder art otherwise. */
export function MediaTile({
  asset,
  locale,
  sizes = "(min-width: 768px) 33vw, 50vw",
  className = "",
}: {
  asset: MediaAsset;
  locale: Locale;
  sizes?: string;
  className?: string;
}) {
  const { t } = useTranslation();
  const styleName = t(`styles.${asset.styleTag}.name`);
  const ratio = asset.orientation === "portrait" ? "aspect-[4/5]" : "aspect-[4/3]";

  if (asset.placeholder) {
    return (
      <div className={`${ratio} overflow-hidden rounded-xl ${className}`} role="img" aria-label={asset.alt[locale]}>
        <PlaceholderArt asset={asset} styleName={styleName} />
      </div>
    );
  }

  if (asset.type === "video") {
    return (
      <video
        className={`${ratio} w-full rounded-xl object-cover ${className}`}
        muted
        loop
        playsInline
        autoPlay
        preload="none"
        poster={asset.poster ? `/media/${asset.poster}` : undefined}
        aria-label={asset.alt[locale]}
      >
        {asset.formats?.includes("webm") && <source src={`/media/${asset.id}.webm`} type="video/webm" />}
        <source src={`/media/${asset.id}.mp4`} type="video/mp4" />
      </video>
    );
  }

  const widths = asset.widths ?? [480];
  const srcSet = (ext: string) => widths.map((w) => `/media/${asset.id}-${w}.${ext} ${w}w`).join(", ");
  const largest = widths[widths.length - 1];
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet("avif")} sizes={sizes} />
      <img
        className={`${ratio} w-full rounded-xl object-cover ${className}`}
        src={`/media/${asset.id}-${largest}.webp`}
        srcSet={srcSet("webp")}
        sizes={sizes}
        alt={asset.alt[locale]}
        loading="lazy"
        decoding="async"
        width={asset.width}
        height={asset.height}
        style={
          asset.blurDataURL
            ? { backgroundImage: `url(${asset.blurDataURL})`, backgroundSize: "cover" }
            : undefined
        }
      />
    </picture>
  );
}
