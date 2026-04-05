import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserPanelLayout = () => {
  return (
    <div className="min-h-screen flex bg-canvas transition-colors duration-300">
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex-1 min-h-screen overflow-auto">
        <main className="px-4 py-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserPanelLayout;
