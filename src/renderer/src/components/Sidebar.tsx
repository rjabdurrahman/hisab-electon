import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.split('/')[1] || 'dashboard';

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '📊' },
    { id: 'test', label: 'TESTS', icon: '🧪' },
    { id: 'doctor', label: 'DOCTOR', icon: '👨‍⚕️' },
    { id: 'client', label: 'PATIENT', icon: '👥' },
    { id: 'service', label: 'TEST SERVICE', icon: '💼' },
  ];

  return (
    <div className="w-[240px] h-screen bg-[#333333] text-[#FFFFFF] flex flex-col sticky top-0 left-0 transition-all duration-300 shadow-lg">
      <div className="p-6 border-b border-gray-600 flex items-center justify-between">
        <h1 className="text-xl font-black text-white flex items-center gap-2 font-exo2">
          HISAB-KHATA
        </h1>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(`/${item.id}`)}
            className={`w-full flex cursor-pointer items-center gap-4 px-6 py-4 text-[13px] font-bold tracking-wider transition-all duration-200 border-l-4
              ${currentPath === item.id
                ? 'bg-[#FEFEFE0F] text-[#2CAFFE] border-[#2CAFFE]'
                : 'border-transparent hover:bg-[#FEFEFE0F] hover:text-white'
              }`}
          >
            <span className={`text-lg ${currentPath === item.id ? 'text-[#2CAFFE]' : 'opacity-70 group-hover:opacity-100'}`}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-600">
        <div className="bg-[#FEFEFE0F] rounded p-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-active/20 shadow-md">
            AA
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-[12px] font-bold text-white truncate tracking-tighter">Abdur Rahman</p>
            <p className="text-[10px] text-gray-400 truncate mt-0.5">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
