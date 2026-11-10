import React from "react";
import { cn } from "../../utils/cn";

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-cafe-roast/40 border border-cafe-roast/30",
        className
      )}
      {...props}
    />
  );
};

