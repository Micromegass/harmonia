import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { riseIn, viewportOnce } from "./motion";

/** Scroll-linked entrance on the count. Renders statically under reduced motion. */
export function Reveal({
  children,
  beats = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  beats?: number;
  className?: string;
  as?: "div" | "section" | "li" | "p";
}) {
  const reduced = useReducedMotion();
  const Tag = motion[as];
  if (reduced) {
    const Static = as;
    return <Static className={className}>{children}</Static>;
  }
  return (
    <Tag className={className} variants={riseIn(beats)} initial="hidden" whileInView="visible" viewport={viewportOnce}>
      {children}
    </Tag>
  );
}
