import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { BlockMath } from "./math";

export default function MathBlock({ math }: { math: string }) {
  math = math.trim();
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(math);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group overflow-hidden my-2">
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-md bg-primary hover:bg-primary/70 text-primary-foreground dark:bg-primary dark:hover:bg-primary/70 dark:text-primary-foreground hover:cursor-pointer"
          aria-label="Copy code"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <BlockMath tex={math} />
    </div>
  );
}
