import React from "react";
import { useFormContext } from "react-hook-form";
import { getSelectStyles } from "../utils/formStyles";

interface FormSelectProps {
  name: string;
  label: string;
  options: { value: string | number; label: string }[];
  className?: string;
  disabled?: boolean;
  defaultValue?: any;
  placeholder?: string;
  required?: string | boolean;
}

const FormSelect: React.FC<FormSelectProps> = ({ 
  defaultValue, 
  name, 
  label, 
  options, 
  className, 
  disabled, 
  placeholder,
  required 
}) => {
  const { register, formState: { errors }, watch } = useFormContext();

  return (
    <div className="w-full">
      <label 
        htmlFor={name} 
        className="block text-gray-700 font-medium mb-1 text-left"
      >
        {label}
      </label>
      <div className="relative group">
        <select
          {...register(name, { required })}
          id={name}
          className={getSelectStyles(className)}
          disabled={disabled}
          defaultValue={defaultValue}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none text-[#94a3b8] group-focus-within:text-[#2CAFFE] transition-colors">
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="4"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      {errors[name] && (
        <p className="text-red-500 text-sm mt-1 ml-1 text-left">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
