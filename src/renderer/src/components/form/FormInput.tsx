import React from "react";

interface FormInputProps {
  name: string;
  label?: string | React.ReactNode;
  type?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value?: string | number;
  [key: string]: any;
}

const FormInput: React.FC<FormInputProps> = ({
  name,
  label,
  type = "text",
  autoFocus = false,
  placeholder,
  className = "",
  disabled = false,
  onChange,
  value,
  ...rest
}) => {
  return (
    <div className="flex-1">
      <label
        htmlFor={name}
        className="block text-[#475569] mb-1 pl-1 whitespace-nowrap font-bold text-[12px] uppercase tracking-wider"
      >
        {label}
      </label>
      <div className="relative flex items-center">
        <input
          id={name}
          name={name}
          type={type}
          autoFocus={autoFocus}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded border border-gray-300 bg-[#F4F4F4F2] px-3 py-2 text-[13px] outline-none transition-all 
            focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 disabled:bg-gray-300 ${className}`}
          disabled={disabled}
          {...rest}
        />
      </div>
    </div>
  );
};

export default FormInput;
