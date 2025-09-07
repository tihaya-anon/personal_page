import useReactiveScrollBar from "@/hooks/use-reactive-scroll-bar";
import { cn } from "@/lib/utils";
import { useEffect, useState, lazy, Suspense } from "react";
import LoadingFallback from "./loading-fallback.tsx";
const BlockMath_ = lazy(() => import("react-katex").then((module) => ({ default: module.BlockMath })));
const InlineMath_ = lazy(() => import("react-katex").then((module) => ({ default: module.InlineMath })));
type MathProps = React.HTMLAttributes<HTMLSpanElement> & {
  tex: string;
  display?: boolean;
};

export default function Math({ tex, display = false, ...props }: MathProps) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const renderMath = () => {
      try {
        import("katex/dist/katex.min.css");
        setLoading(false);
      } catch (error) {
        console.error("Error rendering math:", error);
      }
    };

    renderMath();
  }, [tex, display]);

  const renderMath = () => {
    if (loading) {
      return <LoadingFallback msg="Loading LaTeX..." />;
    }
    const Math_ = display ? BlockMath_ : InlineMath_;
    return (
      <Suspense fallback={<LoadingFallback msg="Rendering LaTeX..." />}>
        <Math_ math={tex} {...props} />
      </Suspense>
    );
  };
  return renderMath();
}

export function InlineMath({ tex }: { tex: string }) {
  return <Math tex={tex} display={false} />;
}

export function BlockMath({ tex }: { tex: string }) {
  const { ref, resetCN } = useReactiveScrollBar();
  return (
    <div ref={ref} className={cn("my-4 px-2", resetCN)}>
      <Math tex={tex} display={true} />
    </div>
  );
}
