import { createContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

type ThemeProviderProps = {
  children: React.ReactNode;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: Theme;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  systemTheme: "light",
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export default function ThemeProvider({ children, storageKey = "vite-ui-theme", ...props }: ThemeProviderProps) {
  const [systemTheme, setSystemTheme] = useState<Theme>(
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light",
  );

  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    return savedTheme || systemTheme;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const newSystemTheme = e.matches ? "dark" : "light";
      setSystemTheme(newSystemTheme);

      // Only update theme if no user preference has been set
      if (!localStorage.getItem(storageKey)) {
        setTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [storageKey]);

  const value = {
    theme,
    systemTheme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}
