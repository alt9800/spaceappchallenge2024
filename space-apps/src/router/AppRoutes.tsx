import {
  Navigate,
  RouteObject,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import MapPage from "../features/Map/MapPage";
import Layout from "../components/layouts/Layout";

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

const router = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        element: <Layout />,
        children: routes,
      },
    ],
  },
]);

export const AppRoutes = () => {
  return <RouterProvider router={router} />;
};
