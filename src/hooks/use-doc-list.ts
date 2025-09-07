import type { DocRow } from "@/api/doc-api";
import { lazy, useState } from "react";
const DocList = lazy(() => import("@/pages/docs/doc-list"));

export default function useDocList() {
  const [pk, setPK] = useState<string>("");
  const [docs, setDocs] = useState<DocRow[]>([]);
  return {
    pk,
    setPK,
    docs,
    setDocs,
    DocList,
  };
}
