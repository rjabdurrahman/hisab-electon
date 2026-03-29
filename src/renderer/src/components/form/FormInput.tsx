import React from "react";
import { useFormContext } from "react-hook-form";
import { getInputStyles } from "../utils/formStyles";

interface FormInputProps {
  name: string;
  label?: string | React.ReactNode;
  type?: string;
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: any;
  required?: string | boolean;
  pattern?: any;
  validate?: any;
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
  defaultValue,
  required,
  pattern,
  validate,
  ...rest
}) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <div className="flex-1 w-full overflow-hidden text-ellipsis text-left">
      {label && (
        <label
          htmlFor={name}
          className="block text-[#475569] mb-1 pl-1 whitespace-nowrap font-bold text-[12px] uppercase tracking-wider overflow-hidden text-ellipsis text-left"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <input
          {...register(name, { required, pattern, validate })}
          id={name}
          type={type}
          autoFocus={autoFocus}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className={getInputStyles(className)}
          disabled={disabled}
          {...rest}
        />
      </div>
      {errors[name] && (
        <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold italic uppercase tracking-tighter">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FormInput;
