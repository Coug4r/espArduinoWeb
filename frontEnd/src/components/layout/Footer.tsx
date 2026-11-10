import React from "react";
import { Coffee, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-cafe-roast/40 bg-espresso/60 py-4 px-6 text-xs text-cafe-muted">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>IoT Control System</span>
          <span>•</span>
          <span className="flex items-center gap-1 text-cafe-latte">
            <Coffee className="w-3.5 h-3.5 text-cafe-caramel" />
            Inspirado en la estética del café
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="flex items-center gap-1 text-status-online">
            <ShieldCheck className="w-3.5 h-3.5" />
            Vercel Backend Conectado
          </span>
        </div>
      </div>
    </footer>
  );
};

