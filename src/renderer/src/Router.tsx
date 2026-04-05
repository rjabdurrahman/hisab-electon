import { createHashRouter, Navigate } from "react-router-dom";
import UserPanelLayout from "./layout/UserPanelLayout";
import Dashboard from "./pages/Dashboard";
import Doctor from "./pages/Doctor";
import Patient from "./pages/Patient";
import Investigations from "./pages/Investigations";
import PathologyTests from "./pages/PathologyTests";
import Consultations from "./pages/Consultations";
import PathologyPrintPage from "./pages/PathologyPrintPage";
import InvestigationCategory from "./pages/InvestigationCategory";

const router = createHashRouter([
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
        path: "patient",
        element: <Patient />,
      },
      {
        path: "investigations",
        element: <Investigations />,
      },
      {
        path: "investigation-category",
        element: <InvestigationCategory />,
      },
    ],
  },
  {
    path: "/print/pathology",
    element: <PathologyPrintPage />,
  },
]);

export default router;
