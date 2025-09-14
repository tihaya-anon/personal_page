import { useState, lazy, Suspense } from "react";
import { cn } from "@/lib/utils";
import { Check, Copy } from "lucide-react";
import useTheme from "@/hooks/use-theme";
import LoadingFallback from "./loading-fallback.tsx";

// Lazy load the syntax highlighter component
const LazyPrismHighlighter = lazy(() => import("./lazy-syntax-highlighter.tsx"));

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
  rounded?: boolean;
}

export default function CodeBlock({
  code,
  language = "typescript",
  showLineNumbers = true,
  className,
  rounded = false,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { theme } = useTheme();

  const handleCopy = async (event: React.MouseEvent) => {
    event.stopPropagation();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div
      className={cn("relative group overflow-hidden bg-primary-foreground my-2", className, rounded && "rounded-sm")}
      onClick={() => setClicked((prev) => !prev)}
    >
      <div
        className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50",
          clicked && "opacity-100",
        )}
      >
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-primary hover:bg-primary/70 text-primary-foreground dark:bg-primary dark:hover:bg-primary/70 dark:text-primary-foreground hover:cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <Suspense fallback={<LoadingFallback msg="Loading syntax highlighter..." />}>
        <LazyPrismHighlighter
          code={code}
          language={language}
          theme={theme}
          showLineNumbers={showLineNumbers}
          rounded={rounded}
        />
      </Suspense>
    </div>
  );
}
