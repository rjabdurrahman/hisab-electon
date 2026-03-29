import React from "react";

interface FormSelectProps {
  name: string;
  label?: string | React.ReactNode;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  value?: string | number;
  options?: { label: string; value: string | number }[];
  [key: string]: any;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  autoFocus = false,
  placeholder,
  className = "",
  disabled = false,
  onChange,
  value,
  options,
  ...rest
}) => {
  return (
    <div className="flex-1 w-full overflow-hidden">
      {label && (
        <label
          htmlFor={name}
          className="block text-[#475569] mb-1 pl-1 whitespace-nowrap font-bold text-[12px] uppercase tracking-wider overflow-hidden text-ellipsis"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={name}
          name={name}
          value={value}
          autoFocus={autoFocus}
          onChange={onChange}
          disabled={disabled}
          className={`w-full rounded border border-gray-300 bg-[#F4F4F4F2] px-3 py-2 text-[13px] outline-none transition-all focus:border-pos-blue focus:ring-4 focus:ring-pos-blue/10 disabled:bg-gray-300 font-bold appearance-none cursor-pointer ${className}`}
          {...rest}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 pointer-events-none text-gray-400">
           ▼
        </div>
      </div>
    </div>
  );
};

export default FormSelect;
