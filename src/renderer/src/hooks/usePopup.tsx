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
          className={`relative top-20 ${
            variant === "large" ? "w-[600px]" : "w-[400px]"
          } bg-white rounded shadow-2xl h-fit animate-in slide-in-from-top-10 duration-300 border border-gray-200`}
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b-[1.5px] border-gray-100 p-3 bg-white rounded-t">
            <h2 className="text-[14px] font-black text-[#333333] uppercase tracking-widest font-exo2">{title}</h2>
            <button
              className="text-gray-400 hover:text-black hover:bg-gray-100 rounded w-6 h-6 flex items-center justify-center transition-all leading-none pb-1"
              onClick={closeModal}
            >
              &times;
            </button>
          </div>

          {/* Body */}
          <div className="p-5">
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
