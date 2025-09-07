import { AUTHOR_NAME } from "@/constants/strings";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function Personal() {
  useEffect(() => {
    document.title = AUTHOR_NAME;
  }, []);
  return <Outlet />;
}
