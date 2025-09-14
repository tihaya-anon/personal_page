import { useEffect, useState } from "react";
import { Button } from "#/ui/button";
import { Book as Doc, User as Personal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { buttonStyle, iconSize } from "@/constants/icon-button-style";
type NavType = "personal" | "docs";
export default function NavToggle() {
  const navigate = useNavigate();
  const toPage = (page: NavType) => {
    page = page === "personal" ? "docs" : "personal";
    return page;
  };
  const [curPage, setCurPage] = useState<NavType>("personal");

  const toggleNav = () => {
    navigate(`/${toPage(curPage)}`);
    setCurPage(toPage(curPage));
  };

  useEffect(() => {
    let curPath = document.location.pathname.split("/")[1];
    if (curPath != "docs" && curPath != "personal") curPath = "personal";
    setCurPage(curPath as NavType);
  }, []);

  return (
    <Button
      variant="ghost"
      onClick={toggleNav}
      aria-label={`Switch to ${toPage(curPage)} view`}
      className={buttonStyle}
    >
      {curPage === "personal" ? <Doc className={iconSize} /> : <Personal className={iconSize} />}
    </Button>
  );
}
