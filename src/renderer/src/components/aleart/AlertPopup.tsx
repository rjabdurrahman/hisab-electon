import React, { useState, useEffect } from 'react';

interface AlertPopupProps {
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  onClose?: () => void;
}

const AlertPopup: React.FC<AlertPopupProps> = ({ message, type, duration = 3000, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  const getColorClass = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-amber-500';
      case 'info':
        return 'bg-sky-500';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-100 animate-in slide-in-from-right duration-300">
      <div className={`${getColorClass()} text-white px-5 py-3 rounded-lg shadow-xl flex items-center justify-between min-w-[300px]`}>
        <div className="flex flex-col">
          <span className="font-bold text-xs uppercase opacity-80 mb-0.5">{type}</span>
          <span className="text-sm font-medium">{message}</span>
        </div>
        <button onClick={() => setVisible(false)} className="ml-4 text-white/50 hover:text-white transition-colors text-xl font-bold leading-none">
          &times;
        </button>
      </div>
    </div>
  );
};

export default AlertPopup;
