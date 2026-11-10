import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", label, error, helperText, leftIcon, id, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    const isPassword = type === "password";

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-semibold uppercase tracking-wider text-cafe-latte"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 text-cafe-muted pointer-events-none flex items-center justify-center">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={isPassword ? (showPassword ? "text" : "password") : type}
            className={cn(
              "w-full h-11 px-3.5 rounded-xl bg-espresso-light/90 border border-cafe-roast/70 text-cafe-cream placeholder:text-cafe-muted/60 text-sm transition-all duration-200 outline-none",
              "focus:border-cafe-caramel focus:ring-2 focus:ring-cafe-caramel/20 focus:bg-espresso",
              leftIcon ? "pl-10" : "",
              isPassword ? "pr-10" : "",
              error && "border-status-offline/80 focus:border-status-offline focus:ring-status-offline/20",
              className
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              className="absolute right-3.5 text-cafe-muted hover:text-cafe-cream transition-colors p-0.5 rounded"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-status-offline font-medium animate-fade-in">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-cafe-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

