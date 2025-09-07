import { lazy } from "react";
import { useNavigate } from "react-router-dom";

// Lazy load components
const Personal = lazy(() => import("@/pages/personal"));
const Home = lazy(() => import("@/pages/personal/home"));
const Cards = lazy(() => import("@/pages/personal/cards"));

// Lazy load card components
const SelfIntroCard = lazy(() => import("@/pages/personal/cards/self-intro-card"));
const EduCard = lazy(() => import("@/pages/personal/cards/edu-card"));

// Home component with navigation capability
function HomeWrapper() {
  const navigate = useNavigate();
  const onIconClick = () => navigate("/personal/details");
  return <Home onIconClick={onIconClick} />;
}

// Cards component that displays all cards
function CardsWrapper() {
  // Wrap each lazy component in a function that returns the lazy component
  // This allows us to pass them to the Cards component without TypeScript errors
  const cardComponents = [
    (props: React.ComponentProps<"div">) => <SelfIntroCard {...props} />,
    (props: React.ComponentProps<"div">) => <EduCard {...props} />,
  ];

  return <Cards cards={cardComponents} />;
}

// Personal section routes
export default [
  {
    path: "/personal",
    element: <Personal />,
    children: [
      { index: true, element: <HomeWrapper /> },
      { path: "details", element: <CardsWrapper /> },
    ],
  },
];
