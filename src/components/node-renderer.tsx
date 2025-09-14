import { cn } from "@/lib/utils";
import type { ElementType, ReactNode } from "react";
import type { DocInfo } from "@/api/doc-api";
import { Badge } from "#/ui/badge";
import MathBlock from "./math-block";
import CodeBlock from "./code-block";
import { InlineMath } from "./math";
import useReactiveScrollBar from "@/hooks/use-reactive-scroll-bar";
type AttributeValue = string | number | boolean;
type Attribute = Record<string, AttributeValue | AttributeValue[]>;
type AstNodeType =
  | "document"
  | "heading"
  | "paragraph"
  | "text"
  | "link"
  | "image"
  | "inlineCode"
  | "codeBlock"
  | "list"
  | "listItem"
  | "table"
  | "tableHead"
  | "tableBody"
  | "tableRow"
  | "tableCell"
  | "emphasis"
  | "strong"
  | "delete"
  | "blockQuote"
  | "html"
  | "inlineHtml"
  | "inlineMath"
  | "mathBlock"
  | "thematicBreak";
type AstNode = {
  type: AstNodeType;
  children?: AstNode[];
  content?: string;
  attributes?: Attribute;
};
export type { Attribute, AttributeValue, AstNode, AstNodeType };

export default function NodeRenderer({ node, pk }: { node: AstNode; pk: string }): ReactNode {
  // Process a paragraph with mixed HTML and text content
  const { ref, resetCN } = useReactiveScrollBar();
  const processHtmlParagraph = (parent: AstNode): ReactNode => {
    if (!parent.children) return null;

    // First, collect all content into a single string
    let combinedContent = "";
    let hasHtml = false;

    // Traverse all children to build the combined content
    const processNode = (node: AstNode) => {
      if (node.type === "html" || node.type === "inlineHtml") {
        combinedContent += node.content || "";
        hasHtml = true;
      } else if (node.type === "text") {
        combinedContent += node.content || "";
      } else if (node.children) {
        // For complex nodes, we need to extract their text representation
        node.children.forEach(processNode);
      }
    };

    parent.children.forEach(processNode);

    // If we found HTML content, render it all together
    if (hasHtml) {
      return <span dangerouslySetInnerHTML={{ __html: combinedContent }} />;
    }

    // If no HTML was found, return null and let the normal renderer handle it
    return null;
  };

  const renderChildren = (parent: AstNode): ReactNode => {
    // Check if parent contains HTML nodes that need special handling
    const hasHtmlNodes = parent.children?.some((child) => child.type === "html" || child.type === "inlineHtml");

    if (hasHtmlNodes && parent.children) {
      const htmlResult = processHtmlParagraph(parent);
      if (htmlResult) {
        return htmlResult;
      }
    }

    // Standard rendering for non-HTML content
    return parent.children?.map((child, index) => <NodeRenderer key={index} node={child} pk={pk} />);
  };

  if (!node) return null;

  switch (node.type) {
    case "document": {
      const doc = node as DocInfo;
      return (
        <>
          <div className="flex flex-col gap-2 pb-6">
            <h1 className="leading-16 scroll-m-20 text-5xl text-center font-extrabold tracking-tight text-balance">
              {doc.title}
            </h1>
            <p className="text-center">{doc.date}</p>
            <div className="flex flex-wrap gap-2 justify-center pt-1">
              {doc.tags.map((tag) => (
                <Badge className="text-white" key={tag}>
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          {renderChildren(doc)}
        </>
      );
    }

    case "heading": {
      const level = (node.attributes?.level as number) || 1;
      const Tag = `h${level}` as ElementType;
      switch (level) {
        case 1:
          return (
            <Tag
              className="leading-12 my-4 scroll-m-20 border-b-primary border-b-2 text-4xl font-extrabold tracking-tight text-balance"
              id={node.attributes?.id as string}
            >
              {renderChildren(node)}
            </Tag>
          );
        case 2:
          return (
            <Tag
              className="leading-9 my-3 scroll-m-20 border-b-primary border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
              id={node.attributes?.id as string}
            >
              {renderChildren(node)}
            </Tag>
          );
        case 3:
          return (
            <Tag
              className="leading-6 my-2 scroll-m-20 border-b pb-1 text-2xl font-semibold tracking-tight"
              id={node.attributes?.id as string}
            >
              {renderChildren(node)}
            </Tag>
          );
        case 4:
          return (
            <Tag
              className="leading-3 my-1 scroll-m-20 border-b pb-1 text-xl font-semibold tracking-tight"
              id={node.attributes?.id as string}
            >
              {renderChildren(node)}
            </Tag>
          );
        default:
          return (
            <Tag
              className="leading-12 my-4 scroll-m-20 border-b-primary border-b-2 text-4xl font-extrabold tracking-tight text-balance"
              id={node.attributes?.id as string}
            >
              {renderChildren(node)}
            </Tag>
          );
      }
    }

    case "paragraph":
      return <p className="leading-7 text-justify">{renderChildren(node)}</p>;

    case "text":
      return <>{node.content}</>;

    case "strong":
      return <strong className="font-bold">{renderChildren(node)}</strong>;

    case "emphasis":
      return <em className="italic">{renderChildren(node)}</em>;

    case "delete":
      return <del className="line-through">{renderChildren(node)}</del>;

    case "link":
      return (
        <a
          href={node.attributes?.href as string}
          title={node.attributes?.title as string}
          className="text-primary hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {renderChildren(node)}
        </a>
      );

    case "image":
      return (
        <img
          src={`docs/${pk}/${node.attributes?.src as string}`}
          alt={(node.attributes?.alt as string) || ""}
          className="max-w-full h-auto my-4 mx-auto"
        />
      );

    case "blockQuote":
      return (
        <blockquote className="border-primary my-6 border-l-4 pl-6 bg-primary/15">{renderChildren(node)}</blockquote>
      );

    case "list": {
      const Tag = (node.attributes?.ordered ? "ol" : "ul") as ElementType;
      return (
        <Tag className={cn("my-2 ml-6 list-disc", node.attributes?.ordered ? "list-decimal" : "list-disc")}>
          {renderChildren(node)}
        </Tag>
      );
    }

    case "listItem":
      return <li>{renderChildren(node)}</li>;

    case "table":
      return (
        <div ref={ref} className={cn("relative w-full", resetCN)}>
          <table className="w-full border-collapse border-spacing-0" style={{ minWidth: "500px" }}>
            {renderChildren(node)}
          </table>
        </div>
      );

    case "tableHead":
      return <thead className="[&_tr]:border-b font-bold bg-primary/25">{renderChildren(node)}</thead>;

    case "tableBody":
      return <tbody className="[&_tr:last-child]:border-0">{renderChildren(node)}</tbody>;

    case "tableRow":
      return <tr className="border-b bg-primary/5">{renderChildren(node)}</tr>;

    case "tableCell": {
      // Check if this cell is in a header row to determine if it should be a th or td
      const isHeader = node.attributes?.header === true;
      const Component = isHeader ? "th" : "td";

      return (
        <Component
          className={cn(
            isHeader
              ? "h-10 px-2 text-left align-middle font-medium whitespace-nowrap"
              : "p-2 align-middle whitespace-nowrap",
            node.attributes?.align === "center" && "text-center",
            node.attributes?.align === "right" && "text-right",
            node.attributes?.align === "left" && "text-left",
          )}
        >
          {renderChildren(node)}
        </Component>
      );
    }

    case "codeBlock":
      return <CodeBlock code={node.content as string} language={node.attributes?.language as string} rounded />;

    case "inlineCode":
      return (
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold">
          {node.content}
        </code>
      );

    case "inlineMath":
      return <InlineMath tex={node.content as string} />;

    case "mathBlock":
      return <MathBlock math={node.content as string} />;

    case "thematicBreak":
      return <hr className="my-6 border-t border-gray-300 dark:border-gray-700" />;

    case "html":
    case "inlineHtml":
      return <span dangerouslySetInnerHTML={{ __html: node.content || "" }} />;

    default:
      console.warn(`Unhandled node type: ${node.type}`, node);
      return <div className="text-red-500">[Unhandled node type: {node.type}]</div>;
  }
}
