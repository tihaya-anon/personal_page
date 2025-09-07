import { Moon, Sun } from "lucide-react";
import { Button } from "#/ui/button";
import useTheme from "@/hooks/use-theme";
import { buttonStyle, iconSize } from "@/constants/icon-button-style";

export default function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button
      variant="ghost"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
      className={buttonStyle}
    >
      {theme === "light" ? <Moon className={iconSize} /> : <Sun className={iconSize} />}
    </Button>
  );
}
