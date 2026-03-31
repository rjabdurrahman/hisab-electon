import { createBrowserRouter, Navigate } from "react-router-dom";
import UserPanelLayout from "./layout/UserPanelLayout";
import Dashboard from "./pages/Dashboard";
import Test from "./pages/Test";
import Doctor from "./pages/Doctor";
import Client from "./pages/Client";
import Service from "./pages/Investigations";
import Investigations from "./pages/Investigations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserPanelLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "test",
        element: <Test />,
      },
      {
        path: "doctor",
        element: <Doctor />,
      },
      {
        path: "client",
        element: <Client />,
      },
      {
        path: "investigations",
        element: <Investigations />,
      },
    ],
  },
]);

export default router;
