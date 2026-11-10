import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { cn } from "../../utils/cn";

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: "caramel" | "online" | "offline" | "latte";
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = "caramel",
}) => {
  const iconThemes = {
    caramel: "bg-cafe-caramel/15 text-cafe-caramel border-cafe-caramel/30",
    online: "bg-status-online/15 text-status-online border-status-online/30 shadow-online-glow",
    offline: "bg-status-offline/15 text-status-offline border-status-offline/30",
    latte: "bg-cafe-latte/15 text-cafe-latte border-cafe-latte/30",
  };

  return (
    <Card className="hover:border-cafe-roast/80 transition-all duration-200">
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-cafe-muted">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream font-mono">
            {value}
          </div>
          {subtitle && (
            <p className="text-[11px] text-cafe-latte/80 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div
          className={cn(
            "w-12 h-12 rounded-2xl flex items-center justify-center border shadow-coffee-sm flex-shrink-0",
            iconThemes[variant]
          )}
        >
          <Icon className="w-6 h-6" />
        </div>
      </CardContent>
    </Card>
  );
};

