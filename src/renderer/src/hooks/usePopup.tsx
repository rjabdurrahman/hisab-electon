import React, { useState } from "react";

interface ReturnType {
  openModal: () => void;
  closeModal: () => void;
  Modal: React.FC<ContentProps>;
}

interface ContentProps {
  title: string;
  children: React.ReactNode;
}

interface ChildProps {
  handleClose?: () => void;
}

const usePopup = (
  variant: "medium" | "large" = "medium"
): ReturnType => {
  const [isOpen, setIsOpen] = useState(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const Modal: React.FC<ContentProps> = ({ title, children }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 flex justify-center bg-black/50 z-[100] w-full h-screen overflow-hidden backdrop-blur-[2px] animate-in fade-in duration-200">
        <div
          className={`relative top-10 flex flex-col ${
            variant === "large" ? "w-[600px]" : "w-[400px]"
          } max-w-[95vw] max-h-[85vh] bg-white rounded shadow-2xl animate-in slide-in-from-top-10 duration-300 border border-gray-200`}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b border-gray-100 p-3 bg-white rounded-t">
            <h2 className="text-[15px] font-bold text-pos-primary font-exo2">{title}</h2>
            <button
              className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full w-8 h-8 flex items-center justify-center transition-all leading-none pb-1.5 text-2xl"
              onClick={closeModal}
              title="Close"
            >
              &times;
            </button>
          </div>

          {/* Body with scrolling */}
          <div className="p-4 overflow-y-auto overflow-x-hidden custom-scrollbar flex-1">
            {React.Children.map(children, (child) => {
              if (React.isValidElement<ChildProps>(child)) {
                return React.cloneElement(child, { handleClose: closeModal });
              }
              return child;
            })}
          </div>
        </div>
      </div>
    );
  };
  return { openModal, closeModal, Modal };
};

export default usePopup;
