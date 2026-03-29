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
    <div className="w-full text-ellipsis text-left">
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-700 font-medium mb-1 text-left"
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
        <p className="text-red-500 text-sm mt-1 ml-1 text-left">
          {errors[name]?.message as string}
        </p>
      )}
    </div>
  );
};

export default FormInput;
