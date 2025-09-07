import { cn } from "@/lib/utils";
import StarIcon from "./star-icon";
import { useState } from "react";

interface DocListItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onClick"> {
  docTitle: string;
  active?: boolean;
  onClick?: (event: React.MouseEvent<Element, MouseEvent>) => void;
}

export default function DocListItem({ docTitle, active = false, ...props }: DocListItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (event: React.MouseEvent<Element, MouseEvent>) => {
    if (props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <div
      {...props}
      className={cn(
        "py-1 transition-colors duration-200",
        active ? "text-primary font-medium" : "hover:cursor-pointer",
      )}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
          <StarIcon
            className={cn(active ? "stroke-primary" : isHovered && "stroke-primary/50")}
            animation="none"
            strokeWidth={1}
          />
        </div>
        <a onClick={handleClick} className={cn("px-2 line-clamp-3 text-sm")}>
          {docTitle}
        </a>
      </div>
    </div>
  );
}
