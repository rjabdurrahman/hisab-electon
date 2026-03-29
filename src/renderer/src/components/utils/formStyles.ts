import clsx from "clsx";

export const baseInputStyles =
    "w-full border border-gray-300 rounded bg-[#F4F4F4F2] px-3 py-2 text-[13px] font-bold outline-none transition-all focus:border-[#2CAFFE] focus:ring-4 focus:ring-[#2CAFFE]/10 disabled:bg-gray-300";

export const baseButtonStyles =
    "bg-[#333333] w-full text-white font-black py-3 px-6 rounded uppercase tracking-wider transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-400";

export const baseCheckboxStyles =
    "w-5 h-5 border-gray-300 rounded focus:ring-2 focus:ring-[#2CAFFE]";

export const baseSelectStyles =
    "w-full border border-gray-300 rounded bg-white px-3 py-2 text-[13px] font-bold outline-none cursor-pointer transition-all focus:border-[#2CAFFE] focus:ring-4 focus:ring-[#2CAFFE]/10 disabled:bg-gray-300 appearance-none h-[42px]";

// Combine styles with clsx
export const getInputStyles = (className?: string) =>
    clsx(baseInputStyles, className);

export const getButtonStyles = (className?: string) =>
    clsx(baseButtonStyles, className);

export const getCheckboxStyles = (className?: string) =>
    clsx(baseCheckboxStyles, className);

export const getSelectStyles = (className?: string) =>
    clsx(baseSelectStyles, className);
