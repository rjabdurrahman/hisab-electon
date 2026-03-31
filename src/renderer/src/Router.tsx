import { createBrowserRouter, Navigate } from "react-router-dom";
import UserPanelLayout from "./layout/UserPanelLayout";
import Dashboard from "./pages/Dashboard";
import Doctor from "./pages/Doctor";
import Client from "./pages/Client";
import Investigations from "./pages/Investigations";
import PathologyTests from "./pages/PathologyTests";
import Consultations from "./pages/Consultations";

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
        path: "consultations",
        element: <Consultations />,
      },
      {
        path: "pathology-tests",
        element: <PathologyTests />,
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
