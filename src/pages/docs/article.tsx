import type { DocInfo } from "@/api/doc-api";
import { cn } from "@/lib/utils";
import useReactiveScrollBar from "@/hooks/use-reactive-scroll-bar";
import { lazy } from "react";

const NodeRenderer = lazy(() => import("@/components/node-renderer"));
interface ArticleProps {
  pk: string;
  doc: DocInfo;
}

export default function Article({ pk, doc }: ArticleProps) {
  const { ref, idleCN } = useReactiveScrollBar();

  return (
    <div ref={ref} className={cn("p-4", idleCN)}>
      <NodeRenderer node={doc} pk={pk} />
    </div>
  );
}
