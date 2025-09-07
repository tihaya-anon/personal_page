import { createContext, useEffect, useState } from "react";
type View = "wide" | "narrow";

type ViewProviderProps = {
  children: React.ReactNode;
};

export const ViewProviderContext = createContext<View>("wide");

export default function ViewProvider({ children }: ViewProviderProps) {
  const [view, setView] = useState<View>("wide");
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setView(width < height ? "narrow" : "wide");
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <ViewProviderContext.Provider value={view}>{children}</ViewProviderContext.Provider>;
}
