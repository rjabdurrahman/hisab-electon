import { createBrowserRouter, Navigate } from "react-router-dom";
import UserPanelLayout from "./layout/UserPanelLayout";
import Dashboard from "./pages/Dashboard";
import Appointment from "./pages/Appointment";
import Doctor from "./pages/Doctor";
import Client from "./pages/Client";
import Service from "./pages/Service";

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
        path: "appointment",
        element: <Appointment />,
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
        path: "service",
        element: <Service />,
      },
    ],
  },
]);

export default router;
