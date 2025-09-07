import React, { useState } from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef((props, ref) => {
  const { className, type, value, onChange, variant = 'default', size = 'default', ...rest } = props;

  // Ensure `value` is always controlled by initializing it properly
  const [inputValue, setInputValue] = useState(value || "");

  const handleChange = (e) => {
    setInputValue(e.target.value);
    if (onChange) onChange(e); // Call the parent's onChange if provided
  };

  const variants = {
    default: 'border-neutral-300 bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-primary-500 focus:ring-primary-500',
    dark: 'border-neutral-600 bg-neutral-800 text-white placeholder:text-neutral-400 focus:border-primary-400 focus:ring-primary-400',
    glass: 'border-white/20 bg-white/10 text-white placeholder:text-white/60 focus:border-white/40 focus:ring-white/20',
    error: 'border-error bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-error focus:ring-error',
    success: 'border-success bg-white text-neutral-900 placeholder:text-neutral-500 focus:border-success focus:ring-success',
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    default: 'h-10 px-4 text-sm rounded-lg',
    lg: 'h-12 px-4 text-base rounded-xl',
  };

  return (
    <input
      type={type}
      className={cn(
        "flex w-full border transition-all duration-300 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      ref={ref}
      value={inputValue}
      onChange={handleChange}
      {...rest}
    />
  );
});

Input.displayName = "Input";

export { Input };
