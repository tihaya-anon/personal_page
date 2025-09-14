import { useState, useEffect, lazy } from "react";
import { type DocInfo, fetchDocData } from "@/api/doc-api";
import { cn } from "@/lib/utils";
import useView from "@/hooks/use-view";
import useDocList from "@/hooks/use-doc-list";
import { fetchDocList } from "@/api/doc-api";
import StarIcon from "@/components/star-icon";
import { Library, TableOfContents } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buttonStyle, iconSize } from "@/constants/icon-button-style";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Lazy load page components
const Article = lazy(() => import("./article"));
const Catalogue = lazy(() => import("./catalogue"));

// Lazy load UI components
const Sheet = lazy(() => import("@/components/ui/sheet").then((module) => ({ default: module.Sheet })));
const SheetContent = lazy(() => import("@/components/ui/sheet").then((module) => ({ default: module.SheetContent })));
const SheetDescription = lazy(() =>
  import("@/components/ui/sheet").then((module) => ({ default: module.SheetDescription })),
);
const SheetHeader = lazy(() => import("@/components/ui/sheet").then((module) => ({ default: module.SheetHeader })));
const SheetTitle = lazy(() => import("@/components/ui/sheet").then((module) => ({ default: module.SheetTitle })));

export default function Docs() {
  const [doc, setDoc] = useState<DocInfo>({ title: "", tags: [], date: "", type: "document" });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [docListOpen, setDocListOpen] = useState<boolean>(false);
  const [catalogueOpen, setCatalogueOpen] = useState<boolean>(false);
  const view = useView();
  const { pk, setPK, docs, setDocs, DocList } = useDocList();

  // Function to handle document selection and close sheet
  const handleDocSelect = (newPk: string) => {
    setPK(newPk);
    setDocListOpen(false);
  };

  // Fetch doc list when component mounts
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const newDocs = await fetchDocList();
        setDocs(newDocs);

        // Only set the first doc if we have docs and pk is empty
        if (newDocs.length > 0) {
          setPK(newDocs[0].pk);
        }
      } catch (error) {
        console.error("Error fetching doc list:", error);
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setDocs, setPK]); // Include dependencies

  // Fetch doc data when pk changes
  useEffect(() => {
    // Only fetch if pk is not empty
    if (!pk) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const docData = await fetchDocData(pk);
        setDoc(docData);
      } catch (error) {
        console.error(`Error fetching doc data from ${pk}:`, error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pk]);

  // Update document title when doc changes
  useEffect(() => {
    if (doc.title) {
      document.title = `${doc.title}`;
    } else {
      document.title = "Docs";
    }
  }, [doc.title]);

  function DocListToggle() {
    return (
      <Button variant="ghost" className={buttonStyle} onClick={() => setDocListOpen(true)}>
        <Library className={iconSize} />
      </Button>
    );
  }
  function CatalogueToggle() {
    return (
      <Button variant="ghost" className={buttonStyle} onClick={() => setCatalogueOpen(true)}>
        <TableOfContents className={iconSize} />
      </Button>
    );
  }
  const paddingY = "py-[3.5rem]";
  // Render DocList component based on view mode
  const renderDocList = () => {
    // For narrow view, we use a wrapper function that matches the expected type
    const setPKWrapper =
      view === "narrow"
        ? (value: React.SetStateAction<string>) => {
            // Handle both function and direct value forms of SetStateAction
            const newPk = typeof value === "function" ? (value as (prevState: string) => string)(pk) : value;
            handleDocSelect(newPk);
          }
        : setPK;

    const docListComponent = <DocList docs={docs} pk={pk} setPK={setPKWrapper} />;

    if (view === "narrow") {
      return (
        <Sheet open={docListOpen} onOpenChange={setDocListOpen}>
          <SheetContent side="left" className="w-[65vw] sm:w-[350px] p-0 pt-10">
            <VisuallyHidden asChild>
              <SheetHeader>
                <SheetTitle>Document List</SheetTitle>
                <SheetDescription>Document List</SheetDescription>
              </SheetHeader>
            </VisuallyHidden>
            <div className="px-4 py-2 overflow-y-auto h-full">{docListComponent}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div className={cn("fixed flex flex-col mx-auto", "w-[20vw] h-[100vh]", "pr-[1rem] pl-[1.6rem]", paddingY)}>
        {docListComponent}
      </div>
    );
  };

  // Render Catalogue component based on view mode
  const renderCatalogue = () => {
    const catalogueComponent = <Catalogue key={pk} doc={doc} />;

    if (view === "narrow") {
      return (
        <Sheet open={catalogueOpen} onOpenChange={setCatalogueOpen}>
          <SheetContent side="right" className="w-[65vw] sm:w-[350px] p-0 pt-10">
            <VisuallyHidden asChild>
              <SheetHeader>
                <SheetTitle>Table of Contents</SheetTitle>
                <SheetDescription>Table of Contents</SheetDescription>
              </SheetHeader>
            </VisuallyHidden>
            <div className="px-4 py-2 overflow-y-auto h-full">{catalogueComponent}</div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        className={cn("fixed flex flex-col mx-auto", "w-[20vw] h-[100vh] right-0", "pr-[1.6rem] pl-[1rem]", paddingY)}
      >
        {catalogueComponent}
      </div>
    );
  };

  return (
    <>
      <div className="h-[calc(100vh-var(--spacing)*8)]">
        {view === "wide" && renderDocList()}
        <div
          className={cn(
            "fixed flex flex-col justify-center mx-auto",
            view === "narrow" ? "w-[100vw] px-0.5" : "w-[60vw] left-[20vw] right-[20vw]",
            "h-full",
            paddingY,
          )}
        >
          {isLoading && pk ? (
            <div className="flex items-center justify-center h-full">
              <StarIcon
                variant="primary"
                size={500}
                animation="rotate"
                strokeWidth={0.2}
                title=""
                animationDuration={2}
              />
            </div>
          ) : (
            <Article key={pk} pk={pk} doc={doc} />
          )}
        </div>
        {view === "wide" && renderCatalogue()}
      </div>

      {view === "narrow" && renderDocList()}
      {view === "narrow" && renderCatalogue()}

      <div className="fixed bottom-4 left-4 z-50" hidden={view === "wide"}>
        <DocListToggle />
      </div>
      <div className="fixed bottom-4 right-4 z-50" hidden={view === "wide"}>
        <CatalogueToggle />
      </div>
    </>
  );
}
