import StarIcon from "#/star-icon";
import { AUTHOR_NAME } from "@/constants/strings";
import { useState } from "react";
import { cn } from "@/lib/utils";
import useView from "@/hooks/use-view";

export default function Home({ onIconClick }: { onIconClick?: () => void | Promise<void> }) {
  const [duration, setDuration] = useState<number>(5);
  const [starHidden, setStarHidden] = useState<boolean>(false);
  const view = useView();
  const click = async () => {
    if (onIconClick) {
      const result = onIconClick();
      if (result instanceof Promise) {
        await result;
      }
    }
    setTimeout(() => {
      setStarHidden(true);
    }, 750);
  };
  return (
    <div 
      className={cn("flex flex-col items-center justify-center w-full h-[100vh]", starHidden ? "hidden" : "")}
      onClick={view === "narrow" ? click : undefined}
      style={view === "narrow" ? { cursor: 'pointer' } : {}}
    >
      <h1 className={cn("text-center text-6xl transition z-100")}>{AUTHOR_NAME}</h1>
      <div className={cn("transition", starHidden ? "hidden" : "")}>
        <StarIcon
          size={100}
          className="hover:cursor-pointer duration-750 z-100"
          variant="primary"
          animation="rotate"
          animationDuration={duration}
          title=""
          strokeWidth={0.2}
          n={9}
          step={4}
          onClick={click}
          onMouseEnter={() => setDuration(0.7)}
          onMouseLeave={() => setDuration(5)}
        />
      </div>
    </div>
  );
}
