import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "#/ui/card";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cva } from "class-variance-authority";

const cardVariants = cva("flex flex-col transition-all duration-300", {
  variants: {
    position: {
      current: "z-10 scale-100 opacity-100",
      prev: "absolute z-0 -translate-x-[80%] scale-90 opacity-70",
      next: "absolute z-0 translate-x-[80%] scale-90 opacity-70",
      hidden: "absolute z-0 opacity-0 scale-75",
    },
  },
  defaultVariants: {
    position: "current",
  },
});

export default function FlexCard({
  className,
  children,
  header,
  footer,
  position = "current",
  ...props
}: React.ComponentProps<"div"> & {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  position?: "current" | "prev" | "next" | "hidden";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardStyle, setCardStyle] = useState<{ width?: string; height?: string }>({});

  const calculateDimensions = () => {
    if (!cardRef.current || !cardRef.current.parentElement) return;

    const parentWidth = cardRef.current.parentElement.clientWidth;
    const parentHeight = cardRef.current.parentElement.clientHeight;

    let width = "80%";
    const height = "60%";

    const proportion = (parentWidth * 0.8) / (parentHeight * 0.6);

    if (proportion >= 3 / 2) {
      const fixedHeight = parentHeight * 0.6;
      const adjustedWidth = fixedHeight * (3 / 2);
      const widthPercentage = (adjustedWidth / parentWidth) * 100;
      width = `${Math.min(80, widthPercentage)}%`;
    } else if (proportion > 2 / 3 && proportion < 3 / 2) {
      const fixedHeight = parentHeight * 0.6;
      const adjustedWidth = fixedHeight * (2 / 3);
      const widthPercentage = (adjustedWidth / parentWidth) * 100;
      width = `${Math.min(80, widthPercentage)}%`;
    }

    return { width, height };
  };

  useLayoutEffect(() => {
    const dimensions = calculateDimensions();
    if (dimensions) {
      setCardStyle(dimensions);
    }
  }, [children]);

  useEffect(() => {
    const updateDimensions = () => {
      const dimensions = calculateDimensions();
      if (dimensions) {
        setCardStyle(dimensions);
      }
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <Card ref={cardRef} className={cn(cardVariants({ position }), className)} style={cardStyle} {...props}>
      {<CardHeader>{header}</CardHeader>}
      <CardContent className="flex-grow">{children}</CardContent>
      {<CardFooter>{footer}</CardFooter>}
    </Card>
  );
}
