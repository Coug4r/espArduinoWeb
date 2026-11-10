import React from "react";
import { Terminal, ShieldCheck, Cpu } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-cafe-roast/50 bg-espresso/80 py-4 px-6 text-xs text-cafe-muted font-mono">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-cafe-cream font-bold flex items-center gap-1">
            <Cpu className="w-3.5 h-3.5 text-cafe-caramel" />
            IoT_CONTROL_SYSTEM
          </span>
          <span>::</span>
          <span className="flex items-center gap-1 text-cafe-latte">
            <Terminal className="w-3.5 h-3.5 text-cafe-caramel" />
            CYBER_CORE // SECURE_HTTPS_JWT
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5 text-status-online">
            <span className="w-1.5 h-1.5 rounded-full bg-status-online animate-pulse" />
            <ShieldCheck className="w-3.5 h-3.5" />
            VERCEL_NODEJS_ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
};
