import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import getColorClass, { type ColorVariant } from "@/constants/color-variant";

export type AnimationType = "draw" | "rotate" | "none";

type Props = {
  size?: number | string;
  color?: string;
  variant?: ColorVariant;
  strokeWidth?: number;
  className?: string;
  title?: string;
  smooth?: number;
  n?: number;
  step?: number;
  animation?: AnimationType;
  animationDuration?: number;
} & React.SVGProps<SVGSVGElement>;

export default function StarIcon({
  size = 24,
  color,
  variant = "default",
  strokeWidth = 2,
  className,
  title = "Star",
  smooth = 0.45,
  n = 9,
  step = 4,
  animation = "draw",
  animationDuration = 5,
  ...props
}: Props) {
  const colorClass = getColorClass(variant);
  const pathRef = useRef<SVGPathElement>(null);
  const cx = 12,
    cy = 12,
    R = 9.8;

  const verts: [number, number][] = Array.from({ length: n }, (_, i) => {
    const k = (i * step) % n;
    const angle = (2 * Math.PI * k) / n - Math.PI / 2;
    return [cx + R * Math.cos(angle), cy + R * Math.sin(angle)];
  });

  const toPath = (pts: [number, number][]) => {
    const closed = pts.slice();
    closed.unshift(pts[pts.length - 1]);
    closed.push(pts[0], pts[1]);

    const t = Math.max(0, Math.min(1, smooth));
    const d: string[] = [];
    d.push(`M ${pts[0][0].toFixed(3)} ${pts[0][1].toFixed(3)}`);

    for (let i = 1; i < closed.length - 2; i++) {
      const [p0x, p0y] = closed[i - 1];
      const [p1x, p1y] = closed[i];
      const [p2x, p2y] = closed[i + 1];
      const [p3x, p3y] = closed[i + 2];

      const c1x = p1x + ((p2x - p0x) / 6) * (1 + t);
      const c1y = p1y + ((p2y - p0y) / 6) * (1 + t);
      const c2x = p2x - ((p3x - p1x) / 6) * (1 + t);
      const c2y = p2y - ((p3y - p1y) / 6) * (1 + t);

      d.push(
        `C ${c1x.toFixed(3)} ${c1y.toFixed(3)}, ${c2x.toFixed(3)} ${c2y.toFixed(3)}, ${p2x.toFixed(3)} ${p2y.toFixed(
          3,
        )}`,
      );
    }
    d.push("Z");
    return d.join(" ");
  };

  const pathD = toPath(verts);

  useEffect(() => {
    if (!pathRef.current || animation === "none") {
      return;
    }

    const path = pathRef.current;
    const length = path.getTotalLength();
    const svgElement = path.closest("svg");

    // Add the keyframes to the document if they don't exist yet
    if (!document.getElementById("star-animation-style")) {
      const style = document.createElement("style");
      style.id = "star-animation-style";
      style.textContent = `
        @keyframes starDrawAnimation {
          0% { stroke-dashoffset: ${length}; }
          50% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: ${-length}; }
        }
        
        @keyframes starRotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `;
      document.head.appendChild(style);
    }

    // Clean up any existing animations
    path.style.animation = "";
    path.style.strokeDasharray = "";
    path.style.strokeDashoffset = "";
    if (svgElement) {
      svgElement.style.animation = "";
    }

    if (animation === "rotate") {
      // Only do rotation animation
      if (svgElement) {
        svgElement.style.animation = `starRotation ${animationDuration}s linear infinite`;
        svgElement.style.transformOrigin = "center";
      }
    } else if (animation === "draw") {
      // Set up the starting position for drawing animation
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;

      // Define the animation
      path.style.animation = `starDrawAnimation ${2 * animationDuration}s linear infinite`;

      // No automatic transition to rotation animation
    }

    return () => {
      // Clean up animations
      if (path) {
        path.style.animation = "";
        path.style.strokeDasharray = "";
        path.style.strokeDashoffset = "";
      }
      if (svgElement) {
        svgElement.style.animation = "";
      }

      // Remove style if this is the last animated star
      if (
        document.getElementById("star-animation-style") &&
        document.querySelectorAll("[data-star-animated]").length <= 1
      ) {
        document.getElementById("star-animation-style")?.remove();
      }
    };
  }, [animationDuration, animation]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || undefined}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(colorClass, className)}
      role="img"
      aria-label={title}
      data-star-animated={animation !== "none" ? "true" : undefined}
      data-animation-type={animation}
      {...props}
    >
      <title>{title}</title>
      <path ref={pathRef} d={pathD} />
    </svg>
  );
}
