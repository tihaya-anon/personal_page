import { useState } from "react";
import StarIcon from "#/star-icon";
import type { ColorVariant } from "@/constants/color-variant";
import type { Position4S as Position } from "@/constants/position";
import { cn } from "@/lib/utils";

type StarRouterProps = {
  size?: number | string;
  color?: string;
  position?: Position;
  variant?: ColorVariant;
  strokeWidth?: number;
  className?: string;
  title?: string;
  smooth?: number;
  rotate?: number;
  onClick?: () => void;
  hidden?: boolean;
};

export function StarRouter({
  size = "100%",
  variant = "primary",
  strokeWidth = 0.2,
  className,
  title = "StarRouter",
  smooth = 0.45,
  position = "B",
  rotate = 0,
  hidden = false,
}: StarRouterProps & React.HTMLAttributes<HTMLDivElement>) {
  let positionClass = "";
  let baseRotate = 0;
  switch (position) {
    case "T":
      positionClass = "top-[-53.5%]";
      baseRotate = 180;
      break;
    case "L":
      positionClass = "left-[-57.5%]";
      baseRotate = 90;
      break;
    case "B":
      positionClass = "bottom-[-53.5%]";
      baseRotate = 0;
      break;
    case "R":
      positionClass = "right-[-57.5%]";
      baseRotate = -90;
      break;
  }

  // Calculate rotation degree directly from props
  const starClassName = cn(className, positionClass, "fixed max-w-md z-[-1]");

  return (
    <div className="flex flex-col items-center justify-center" style={{ display: hidden ? "none" : "flex" }}>
      <StarIcon
        size={size}
        variant={variant}
        animation="none"
        strokeWidth={strokeWidth}
        n={9}
        step={4}
        className={starClassName}
        style={{
          transform: `rotate(${baseRotate + rotate}deg)`,
          transition: "all 0.5s ease",
        }}
        title={title}
        smooth={smooth}
      />
    </div>
  );
}

type UseStarRouterReturn = {
  rotate: number;
  rotateLeft: () => void;
  rotateRight: () => void;
};

export default function useStarRouter(): UseStarRouterReturn {
  const [rotate, setRotate] = useState(0);
  const rotateLeft = () => {
    const prevRotate = rotate - 40;
    setRotate(prevRotate);
  };
  const rotateRight = () => {
    const nextRotate = rotate + 40;
    setRotate(nextRotate);
  };
  return {
    rotate,
    rotateLeft,
    rotateRight,
  };
}
