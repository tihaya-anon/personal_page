import ModeToggle from "#/mode-toggle";
import NavToggle from "#/nav-toggle";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { appRoutes } from "@/routes";
import { Suspense } from "react";
import StarIcon from "./components/star-icon";

function App() {
  return (
    <div className="fixed h-screen w-screen overflow-hidden">
      <BrowserRouter>
        <div className="fixed top-4 right-4 z-50">
          <ModeToggle />
        </div>
        <div className="fixed top-4 left-4 z-50">
          <NavToggle />
        </div>
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-screen w-screen">
              <StarIcon
                variant="primary"
                size={500}
                animation="draw"
                strokeWidth={0.2}
                title=""
                animationDuration={2}
              />
            </div>
          }
        >
          <Routes>
            {appRoutes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element}>
                {route.children?.map((childRoute, childIndex) => (
                  <Route
                    key={childIndex}
                    index={childRoute.index}
                    path={childRoute.path}
                    element={childRoute.element}
                  />
                ))}
              </Route>
            ))}
          </Routes>
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
