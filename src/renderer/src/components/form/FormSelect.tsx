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
        className="block text-[#475569] mb-1 pl-1 font-bold text-[12px] uppercase tracking-wider overflow-hidden text-ellipsis text-left"
      >
        {label}
      </label>
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
      {errors[name] && (
        <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic uppercase tracking-tighter">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FormSelect;
