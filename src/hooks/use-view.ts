import { useContext } from "react";
import { ViewProviderContext } from "@/contexts/view-provider";

export default function useView() {
  const context = useContext(ViewProviderContext);

  if (context === undefined) throw new Error("useView must be used within a ViewProviderContext");

  return context;
}
