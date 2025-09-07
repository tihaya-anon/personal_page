import { useEffect, useState } from "react";
import { PrismAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { cn } from "@/lib/utils";
import StarIcon from "./star-icon";
import useReactiveScrollBar from "@/hooks/use-reactive-scroll-bar";

// Define props interface
interface LazySyntaxHighlighterProps {
  code: string;
  language?: string;
  theme: string;
  showLineNumbers?: boolean;
  rounded?: boolean;
}

type Style = {
  [key: string]: React.CSSProperties;
};

export default function LazySyntaxHighlighter({
  code,
  language = "typescript",
  theme,
  showLineNumbers = true,
  rounded = false,
}: LazySyntaxHighlighterProps) {
  const { resetCN } = useReactiveScrollBar();
  // State to hold the dynamically loaded styles
  const [styles, setStyles] = useState<{
    darkStyle: Style;
    lightStyle: Style;
  } | null>(null);

  // Load the styles dynamically
  useEffect(() => {
    const loadStyles = async () => {
      // Import the syntax highlighter and styles only when the component is mounted
      await import("@/code/syntax");
      const { gruvboxDark, gruvboxLight } = await import("react-syntax-highlighter/dist/esm/styles/prism");

      // Create custom styles with transparent backgrounds
      const darkStyle = {
        ...gruvboxDark,
        'pre[class*="language-"]': {
          ...gruvboxDark['pre[class*="language-"]'],
          background: "transparent",
        },
        'code[class*="language-"]': {
          ...gruvboxDark['code[class*="language-"]'],
          background: "transparent",
        },
      };

      const lightStyle = {
        ...gruvboxLight,
        'pre[class*="language-"]': {
          ...gruvboxLight['pre[class*="language-"]'],
          background: "transparent",
        },
        'code[class*="language-"]': {
          ...gruvboxLight['code[class*="language-"]'],
          background: "transparent",
        },
      };

      setStyles({ darkStyle, lightStyle });
    };

    loadStyles();
  }, []);

  // If styles haven't loaded yet, show a simple placeholder
  if (!styles) {
    return (
      <div className="flex flex-row items-center justify-center">
        <div className="p-4 text-sm animate-pulse text-center">Loading syntax highlighter...</div>
        <StarIcon animation="rotate" strokeWidth={0.2} title="" animationDuration={2} variant="primary" />
      </div>
    );
  }
  return (
    <SyntaxHighlighter
      language={language}
      style={theme === "dark" ? styles.darkStyle : styles.lightStyle}
      showLineNumbers={showLineNumbers}
      wrapLines={true}
      customStyle={{
        margin: 0,
        padding: "0.7rem 1.2rem 0.7rem 0.5rem",
        fontSize: "0.85rem",
        backgroundColor: "transparent",
        background: "transparent",
      }}
      lineNumberStyle={{
        color: "#64748b",
        minWidth: "2.5em",
      }}
      codeTagProps={{
        style: {
          display: "inline",
          background: "transparent",
        },
      }}
      wrapLongLines={false}
      className={cn("w-full bg-primary-foreground", rounded && "rounded-sm", resetCN)}
    >
      {code.trim()}
    </SyntaxHighlighter>
  );
}
