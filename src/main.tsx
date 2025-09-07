import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import ThemeProvider from "@/contexts/theme-provider";
import ViewProvider from "@/contexts/view-provider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider storageKey="vite-ui-theme">
      <ViewProvider>
        <App />
      </ViewProvider>
    </ThemeProvider>
  </StrictMode>,
);
