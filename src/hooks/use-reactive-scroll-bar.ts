import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export default function useReactiveScrollBar() {
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolling(true);

      // Clear any existing timeout
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      // Set a new timeout
      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1500); // Hide scrollbar after 1.5 seconds of inactivity
    };

    container.addEventListener("scroll", handleScroll);

    // Initial mouse movement should show scrollbar
    const handleMouseMove = () => {
      setIsScrolling(true);

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false);
      }, 1500);
    };

    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      container.removeEventListener("mousemove", handleMouseMove);
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);
  const idleCN = cn(
    "overflow-auto",
    "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent",
    isScrolling ? "scrollbar-thumb-primary" : "scrollbar-thumb-transparent",
  );
  const resetCN = cn(
    "overflow-auto",
    "scrollbar-thin scrollbar-thumb-rounded-md scrollbar-track-transparent",
    "scrollbar-thumb-transparent hover:scrollbar-thumb-primary",
  );
  return {
    ref: containerRef,
    idleCN,
    resetCN,
  };
}
