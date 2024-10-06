import {
  Navigate,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import MapPage from "../features/Map/MapPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Navigate to={MapPage.path} replace />,
  },
  {
    path: MapPage.path,
    element: <MapPage />,
  },
];

const router = createBrowserRouter(routes);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
