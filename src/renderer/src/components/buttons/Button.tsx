import React, { MouseEventHandler } from "react";
import { clsx } from "../../helpers";

type ButtonVariant = "filled" | "outlined" | "icon";
type ButtonSize = "extraSmall" | "small" | "medium" | "large";

interface ButtonProps {
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  size?: ButtonSize;
  label?: string | React.ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  className?: string;
  textColor?: string;
  bgColor?: string;
  IconLeft?: React.ReactNode;
  IconRight?: React.ReactNode;
  width?: string;
  loading?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  type = "button",
  variant = "filled",
  size = "medium",
  onClick,
  disabled = false,
  className = "",
  textColor = "#FFFFFF",
  bgColor = "#333333",
  IconLeft,
  IconRight,
  width = "auto",
  loading = false,
  children,
}) => {
  const baseStyles =
    "inline-flex gap-1 items-center justify-center rounded focus:outline-none transition leading-none disabled:cursor-not-allowed disabled:bg-gray-400";

  const sizeStyles: Record<ButtonSize, string> = {
    extraSmall: "px-2 py-1 text-[10px] min-h-[24px]",
    small: "px-3 py-1.5 text-sm min-h-[32px]",
    medium: "px-4 py-2 text-base min-h-[36px]",
    large: "px-6 py-3 text-base min-h-[40px]",
  };

  const iconSizeStyles: Record<ButtonSize, string> = {
    extraSmall: "p-1 min-w-[24px] min-h-[24px]",
    small: "p-1.5 min-w-[32px] min-h-[32px]",
    medium: "p-2 min-w-[36px] min-h-[36px]",
    large: "p-3 min-w-[40px] min-h-[40px]",
  };

  const variantStyles = {
    filled: `hover:brightness-90`,
    outlined: `border hover:brightness-90 disabled:border-gray-400`,
    icon: `bg-transparent hover:bg-gray-100 disabled:text-gray-400`,
  };

  const content = () => {
    if (loading) return <span>Loading...</span>;
    if (children) {
      return (
        <span
          className="font-exo2"
          style={{
            color: variant === "outlined" ? bgColor : textColor,
          }}
        >
          {children}
        </span>
      );
    }
    return null;
  };

  return (
    <button
      type={type}
      onClick={onClick || (() => {})}
      disabled={loading || disabled}
      className={clsx(
        baseStyles,
        variant === "icon" ? iconSizeStyles[size] : sizeStyles[size],
        variantStyles[variant],
        className
      )}
      style={{
        width,
        backgroundColor: variant === "filled" ? bgColor : undefined,
        border: variant === "outlined" ? `1px solid ${bgColor}` : undefined,
      }}
    >
      {!loading && IconLeft}
      {content()}
      {!loading && IconRight}
    </button>
  );
};

export default Button;