import type { DocInfo } from "@/api/doc-api";
import CatalogueItem from "@/components/catalogue-item";
import { useEffect, useState, useMemo } from "react";
import useReactiveScrollBar from "@/hooks/use-reactive-scroll-bar";
import { cn } from "@/lib/utils";

export default function Catalogue({ doc }: { doc: DocInfo }) {
  const headings = useMemo(() => {
    return doc.children ? doc.children.filter((node) => node.type === "heading") : [];
  }, [doc.children]);

  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined" || !window.IntersectionObserver) {
      console.warn("IntersectionObserver not supported");
      return;
    }

    // Get all heading elements with IDs
    const headingElements = headings
      .map((heading) => {
        const id = heading.attributes?.id as string;
        return { id, element: document.getElementById(id) };
      })
      .filter((item) => item.element && item.id);

    if (headingElements.length === 0) return;

    // Set the first heading as active by default
    setActiveId(headingElements[0].id);

    const observer = new IntersectionObserver(
      (entries) => {
        // Get all entries that are intersecting
        const visibleHeadings = entries.filter((entry) => entry.isIntersecting).map((entry) => entry.target.id);

        // If we have visible headings, update the active ID
        if (visibleHeadings.length > 0) {
          // Use the first visible heading as the active one
          setActiveId(visibleHeadings[0]);
        }
      },
      {
        // Element is considered in view when it's 30% visible
        threshold: 0.3,
        // Start detecting when element is near viewport
        rootMargin: "-100px 0px -66% 0px",
      },
    );

    // Observe all heading elements
    headingElements.forEach(({ element }) => {
      if (element) observer.observe(element);
    });

    // Clean up
    return () => {
      headingElements.forEach(({ element }) => {
        if (element) observer.unobserve(element);
      });
    };
  }, [headings]);

  const { ref, resetCN } = useReactiveScrollBar();

  return (
    <div ref={ref} className={cn("", resetCN)}>
      {headings.map((heading, index) => (
        <CatalogueItem
          key={index}
          node={heading}
          anchor={heading.attributes?.id as string}
          active={activeId === (heading.attributes?.id as string)}
        />
      ))}
    </div>
  );
}
