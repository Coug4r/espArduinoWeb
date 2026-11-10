import React from "react";
import { LucideIcon } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-cafe-deep/40 border border-dashed border-cafe-roast/60 backdrop-blur-sm">
      <div className="w-14 h-14 rounded-2xl bg-cafe-roast/30 border border-cafe-roast flex items-center justify-center text-cafe-latte mb-4 shadow-coffee-sm">
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-cafe-cream mb-1">{title}</h4>
      <p className="text-xs text-cafe-muted max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="md">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

