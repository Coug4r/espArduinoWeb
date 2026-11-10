import React from "react";
import { cn } from "../../utils/cn";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "online" | "offline" | "pending" | "delivered" | "executed" | "failed" | "expired" | "default";
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = "default",
  dot = false,
  children,
  ...props
}) => {
  const variants = {
    online: "bg-status-online/15 text-status-online border-status-online/30 shadow-[0_0_10px_-2px_rgba(117,214,154,0.3)]",
    offline: "bg-status-offline/15 text-status-offline border-status-offline/30",
    pending: "bg-status-pending/15 text-status-pending border-status-pending/30 shadow-[0_0_10px_-2px_rgba(229,169,60,0.3)]",
    delivered: "bg-status-delivered/15 text-status-delivered border-status-delivered/30",
    executed: "bg-status-online/15 text-status-online border-status-online/30",
    failed: "bg-status-offline/15 text-status-offline border-status-offline/30",
    expired: "bg-cafe-muted/15 text-cafe-muted border-cafe-muted/30",
    default: "bg-cafe-roast/30 text-cafe-latte border-cafe-roast/50",
  };

  const dotColors = {
    online: "bg-status-online animate-pulse",
    offline: "bg-status-offline",
    pending: "bg-status-pending animate-pulse",
    delivered: "bg-status-delivered",
    executed: "bg-status-online",
    failed: "bg-status-offline",
    expired: "bg-cafe-muted",
    default: "bg-cafe-latte",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border tracking-wide uppercase font-mono",
        variants[variant],
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotColors[variant])} />}
      {children}
    </span>
  );
};

