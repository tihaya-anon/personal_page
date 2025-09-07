import { Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import personalRoutes from "./personal";

// Lazy load components
const Docs = lazy(() => import("@/pages/docs"));

// All application routes
export const appRoutes: RouteObject[] = [
  // Default redirect
  { path: "/", element: <Navigate to="/docs" replace /> },

  // Personal section with nested routes
  ...personalRoutes,

  // Docs section
  { path: "/docs", element: <Docs /> },
];
