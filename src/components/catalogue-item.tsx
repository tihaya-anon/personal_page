import { cn } from "@/lib/utils";
import type { AstNode } from "./node-renderer";
import { useEffect, useState } from "react";
import StarIcon from "./star-icon";

interface CatalogueItemProps {
  node: AstNode;
  anchor: string;
  active?: boolean;
  onClick?: () => void;
}

export default function CatalogueItem({ node, anchor, active = false, onClick }: CatalogueItemProps) {
  const level = node.attributes?.level as number;
  const [isActive, setIsActive] = useState(active);
  const [isHovered, setIsHovered] = useState(false);

  // Calculate padding based on heading level
  const paddingLeft = level ? level - 1 : 0;

  useEffect(() => {
    setIsActive(active);
  }, [active]);

  // Handle click with smooth scrolling
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById(anchor);
    if (element) {
      // Scroll to element with smooth behavior
      element.scrollIntoView({ behavior: "smooth", block: "start" });

      // Update URL without causing a page jump
      window.history.pushState(null, "", `#${anchor}`);

      // Set this item as active
      setIsActive(true);
    }
    onClick?.();
  };

  return (
    <div
      className={cn(
        "py-1 transition-colors duration-200",
        isActive ? "text-primary font-medium" : "hover:cursor-pointer",
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ paddingLeft: `${paddingLeft * 1}rem` }} className="flex items-center">
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          <StarIcon
            className={cn(isActive ? "stroke-primary" : isHovered && "stroke-primary/50")}
            animation="none"
            strokeWidth={1}
          />
        </div>
        <a onClick={handleClick} className={cn("px-2 line-clamp-3 text-sm")}>
          {node.children && node.children[0].content}
        </a>
      </div>
    </div>
  );
}
