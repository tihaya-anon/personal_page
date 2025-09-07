import { type DocRow } from "@/api/doc-api";
import DocListItem from "@/components/doc-list-item";
export type DocListProps = {
  docs: DocRow[];
  pk: string;
  setPK: React.Dispatch<React.SetStateAction<string>>;
};
export default function DocList({ docs, pk, setPK }: DocListProps) {
  return (
    <>
      {docs.map((doc) => {
        return <DocListItem key={doc.pk} docTitle={doc.title} onClick={() => setPK(doc.pk)} active={doc.pk === pk} />;
      })}
    </>
  );
}
