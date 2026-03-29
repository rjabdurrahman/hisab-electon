import clsx from "clsx";

export const baseInputStyles =
    "w-full border border-gray-300 rounded bg-[#F4F4F4F2] px-3 py-2 focus:ring focus:ring-blue focus:outline-none";
export const baseButtonStyles =
    "bg-blue w-full text-white font-medium py-2 px-4 rounded hover:bg-blue";
export const baseCheckboxStyles =
    "w-5 h-5 border-gray rounded focus:ring focus:ring-blue";
export const baseSelectStyles =
    "w-full border border-gray rounded px-3 py-2 bg-white focus:ring focus:ring-blue focus:outline-none";

// Combine styles with clsx
export const getInputStyles = (className?: string) =>
    clsx(baseInputStyles, className);
export const getButtonStyles = (className?: string) =>
    clsx(baseButtonStyles, className);
export const getCheckboxStyles = (className?: string) =>
    clsx(baseCheckboxStyles, className);
export const getSelectStyles = (className?: string) =>
    clsx(baseSelectStyles, className, 'h-[42px]');
