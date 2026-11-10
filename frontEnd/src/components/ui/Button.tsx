import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils/cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cafe-latte focus-visible:ring-offset-2 focus-visible:ring-offset-espresso disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]";

    const variants = {
      primary:
        "bg-cafe-caramel hover:bg-cafe-caramel-hover text-white shadow-caramel-glow hover:shadow-caramel-glow-lg border border-cafe-latte/30 font-semibold",
      secondary:
        "bg-cafe-roast hover:bg-[#78503d] text-cafe-cream border border-cafe-roast/60 hover:border-cafe-latte/40 shadow-coffee-sm",
      outline:
        "border border-cafe-roast/80 hover:border-cafe-caramel text-cafe-latte hover:text-cafe-cream hover:bg-cafe-deep/50",
      ghost:
        "text-cafe-cream/80 hover:text-cafe-cream hover:bg-cafe-deep/60",
      danger:
        "bg-status-offline/20 hover:bg-status-offline/30 text-status-offline border border-status-offline/40 shadow-offline-glow",
      success:
        "bg-status-online/20 hover:bg-status-online/30 text-status-online border border-status-online/40 shadow-online-glow",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
      md: "h-10 px-4 text-sm rounded-xl gap-2",
      lg: "h-12 px-6 text-base rounded-xl gap-2.5",
      icon: "h-10 w-10 p-0 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon
        )}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = "Button";

