import { useEffect, useState } from "react";
import { Button } from "#/ui/button";
import { Book, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buttonStyle, iconSize } from "@/constants/icon-button-style";
type NavType = "personal" | "docs";
export default function NavToggle() {
  const navigate = useNavigate();
  const [nav, setNav] = useState<NavType>(document.location.pathname.split("/")[1] as NavType);

  const toggleNav = () => {
    navigate(nav === "personal" ? "/docs" : "/personal");
    setNav(nav === "personal" ? "docs" : "personal");
  };

  useEffect(() => {
    const currentNav = document.location.pathname.split("/")[1] as NavType;
    setNav(currentNav);
  }, []);

  return (
    <Button
      variant="ghost"
      onClick={toggleNav}
      aria-label={`Switch to ${nav === "personal" ? "docs" : "personal"} view`}
      className={buttonStyle}
    >
      {nav === "personal" ? <Book className={iconSize} /> : <User className={iconSize} />}
    </Button>
  );
}
