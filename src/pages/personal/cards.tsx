import useStarRouter, { StarRouter } from "#/star-router";
import { Button } from "#/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect, useCallback, type JSX } from "react";
interface CardsProps extends React.ComponentProps<"div"> {
  cards: ((props: React.ComponentProps<"div">) => JSX.Element)[];
}

export default function Cards({ cards, ...props }: CardsProps) {
  const cycleCards = [...cards, ...cards, ...cards];

  const { rotate, rotateLeft, rotateRight } = useStarRouter();
  const [idx, setIdx] = useState(0);

  const saveLoop = (idx: number, phase: number, total: number) => (idx + phase + total) % total;
  const prevIdx = saveLoop(idx, -1, cycleCards.length);
  const nextIdx = saveLoop(idx, 1, cycleCards.length);

  const toPrev = useCallback(() => {
    setIdx(prevIdx);
    rotateRight();
  }, [prevIdx, rotateRight]);

  const toNext = useCallback(() => {
    setIdx(nextIdx);
    rotateLeft();
  }, [nextIdx, rotateLeft]);

  const ArrowButton = (className: string, direction: "left" | "right", onClick: () => void) => {
    className = cn(
      "text-foreground transition",
      "hover:text-primary hover:cursor-pointer",
      "active:scale-90 active:text-primary active:opacity-80",
      "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50",
      className,
    );
    if (direction === "left") {
      className = cn(className, "left-[5%]");
    } else {
      className = cn(className, "right-[5%]");
    }
    return (
      <Button variant="link" onClick={onClick} size="icon" className={className} asChild>
        {direction === "left" ? (
          <ChevronLeft className="h-[2.8rem] w-[2.8rem]" />
        ) : (
          <ChevronRight className="h-[2.8rem] w-[2.8rem]" />
        )}
      </Button>
    );
  };

  const getCardPosition = (cardIdx: number) => {
    if (cardIdx === idx) return "current";
    if (cardIdx === prevIdx) return "prev";
    if (cardIdx === nextIdx) return "next";
    return "hidden";
  };

  const renderCard = (cardIdx: number, position: string) => {
    const CardComponent = cycleCards[cardIdx];
    return (
      <div key={`card-${cardIdx}`} className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
        <CardComponent key={cardIdx} className={position === "current" ? "shadow-xl dark:shadow-accent" : ""} />
      </div>
    );
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isScrolling = useRef<boolean>(false);
  const lastScrollTime = useRef<number>(0);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const now = Date.now();
      if (now - lastScrollTime.current < 25 || isScrolling.current) return;

      isScrolling.current = true;
      lastScrollTime.current = now;

      if (e.deltaY > 0) {
        toNext();
      } else if (e.deltaY < 0) {
        toPrev();
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 500);
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel);
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel);
      }
    };
  }, [prevIdx, nextIdx, toPrev, toNext]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartX.current === null) return;

      const touchEndX = e.changedTouches[0].clientX;
      const diff = touchEndX - touchStartX.current;

      // Only trigger if the swipe is significant enough (more than 50px)
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          toPrev(); // Swipe right to go to previous
        } else {
          toNext(); // Swipe left to go to next
        }
      }

      touchStartX.current = null;
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("touchstart", handleTouchStart);
      container.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      }
    };
  }, [prevIdx, nextIdx, toPrev, toNext]);

  const clickDot = (index: number) => {
    const toIdx = index % cards.length;
    const fromIdx = idx % cards.length;
    const diff = fromIdx - toIdx;

    if (diff === 0) return; // No need to rotate if already at the target index

    // Calculate the target index directly
    const targetIdx = saveLoop(idx, diff > 0 ? -Math.abs(diff) : Math.abs(diff), cycleCards.length);

    // Set the index directly instead of using the navigate functions in a loop
    setIdx(targetIdx);

    // Apply the appropriate rotation based on the direction and count
    const rotateCount = Math.abs(diff);
    if (diff > 0) {
      // Going backward (right rotation)
      for (let i = 0; i < rotateCount; i++) {
        rotateRight();
      }
    } else {
      // Going forward (left rotation)
      for (let i = 0; i < rotateCount; i++) {
        rotateLeft();
      }
    }
  };
  return (
    <div {...props}>
      {ArrowButton(cn("fixed top-[48%] z-20"), "left", toPrev)}
      {ArrowButton(cn("fixed top-[48%] z-20"), "right", toNext)}
      <div className="flex flex-col items-center justify-center w-full h-[100vh]">
        <div ref={containerRef} className="relative w-full h-[100vh] flex items-center justify-center">
          {cycleCards.map((_, cardIdx) => {
            const position = getCardPosition(cardIdx);
            if (position === "hidden") return null;

            return (
              <div
                key={`card-container-${cardIdx}`}
                className={cn(
                  "absolute w-full h-full flex items-center justify-center transition-all",
                  position === "current"
                    ? "opacity-100 scale-100 z-10 duration-500"
                    : "opacity-70 scale-90 z-0 duration-500",
                  position === "prev" ? "-translate-x-[50%] duration-450" : "",
                  position === "next" ? "translate-x-[50%] duration-450" : "",
                )}
              >
                {renderCard(cardIdx, position)}
              </div>
            );
          })}
          {cards.length > 1 && (
            <div className="flex flex-row gap-2 z-10 absolute bottom-[17.5%] hover:cursor-pointer">
              {Array.from({ length: cards.length }).map((_, index) => (
                <div
                  key={index}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    index === idx % cards.length ? "bg-primary" : "bg-muted",
                  )}
                  onClick={() => clickDot(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <StarRouter position="B" rotate={rotate} />
    </div>
  );
}
