import type { AstNode, Attribute } from "@/components/node-renderer";

export type DocInfo = AstNode & {
  title: string;
  tags: string[];
  date: string;
};
export type DocRow = {
  title: string;
  date: string;
  tags: string[];
  pk: string;
};
type DocDatabase = {
  [key: string]: DocInfo;
};

const docCache: DocDatabase = {};

const fallbackData: DocDatabase = {
  notFound: {
    title: "Not Found",
    type: "document",
    tags: [],
    date: "",
  },
};

const fetchDocData = async (pk: string): Promise<DocInfo> => {
  if (docCache[pk]) {
    return docCache[pk];
  }

  try {
    const response = await fetch(`/docs/${pk}/doc.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch doc data: ${response.statusText}`);
    }

    const data: AstNode = await response.json();
    const attributes = data.attributes as Attribute;
    const docInfo: DocInfo = {
      type: "document",
      title: attributes.title as string,
      tags: attributes.tags as string[],
      date: attributes.date as string,
      children: data.children,
    };
    docCache[pk] = docInfo;
    return docInfo;
  } catch (error) {
    console.error(`Error fetching doc data from ${pk}:`, error);
    return fallbackData["notFound"];
  }
};

const fetchDocList = async (): Promise<DocRow[]> => {
  try {
    const response = await fetch("/docs/docs-db.json");
    if (!response.ok) {
      throw new Error(`Failed to fetch doc list: ${response.statusText}`);
    }
    const data: DocRow[] = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching doc list:", error);
    return [];
  }
};

export { fetchDocData, fetchDocList };
