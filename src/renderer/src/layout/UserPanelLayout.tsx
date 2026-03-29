import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const UserPanelLayout = () => {
  return (
    <div className="min-h-screen flex bg-canvas transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 min-h-screen overflow-auto">
        <main className="px-4 py-4 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default UserPanelLayout;
