import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Menu, X, LogOut, Activity } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";

export interface NavbarProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full h-16 border-b border-cafe-roast/50 bg-espresso/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
          className="lg:hidden p-2 rounded-xl text-cafe-latte hover:text-cafe-cream hover:bg-cafe-deep transition-colors"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cafe-caramel to-cafe-roast p-0.5 shadow-caramel-glow flex items-center justify-center transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-espresso-dark rounded-[10px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-cafe-caramel group-hover:text-cafe-latte transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-cafe-cream font-mono">
                IoT_<span className="text-cafe-caramel">CONTROL</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-cafe-roast/60 text-cafe-latte border border-cafe-roast font-mono uppercase tracking-wider font-bold">
                ESP8266_NODE
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Center / Right: Live Backend Indicator & User profile */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Backend live badge */}
        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cafe-deep/80 border border-cafe-roast/60 text-xs text-cafe-latte">
          <Activity className="w-3.5 h-3.5 text-status-online animate-pulse" />
          <span className="font-mono text-[11px] text-cafe-cream/90">API Vercel</span>
        </div>

        {/* User profile dropdown / info */}
        {user && (
          <div className="flex items-center gap-2">
            <Link
              to="/settings"
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-cafe-deep/60 hover:bg-cafe-deep border border-cafe-roast/50 hover:border-cafe-caramel/50 transition-all text-xs text-cafe-cream"
            >
              <div className="w-6 h-6 rounded-lg bg-cafe-caramel/20 border border-cafe-caramel/40 flex items-center justify-center text-cafe-latte font-semibold text-xs uppercase">
                {user.name.charAt(0)}
              </div>
              <span className="hidden md:inline font-medium text-cafe-cream">{user.name}</span>
            </Link>

            <button
              onClick={logout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="p-2 rounded-xl text-cafe-muted hover:text-status-offline hover:bg-cafe-deep border border-transparent hover:border-status-offline/30 transition-all"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
