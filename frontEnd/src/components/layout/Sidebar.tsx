import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Cpu,
  History,
  Settings,
  LogOut,
  Radio,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { cn } from "../../utils/cn";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();

  const navigation = [
    {
      name: "Dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Mis Dispositivos",
      to: "/devices",
      icon: Cpu,
    },
    {
      name: "Historial de Comandos",
      to: "/history",
      icon: History,
    },
    {
      name: "Configuración y Perfil",
      to: "/settings",
      icon: Settings,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden animate-fade-in"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={cn(
          "fixed top-16 bottom-0 left-0 z-40 w-64 bg-espresso-light/95 border-r border-cafe-roast/50 flex flex-col justify-between p-4 transition-transform duration-300 ease-in-out lg:translate-x-0 backdrop-blur-md",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="space-y-6">
          {/* Quick status box */}
          <div className="p-3.5 rounded-xl bg-cafe-deep/70 border border-cafe-roast/60 shadow-coffee-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold tracking-wider uppercase text-cafe-latte flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cafe-caramel animate-pulse" />
                Red IoT
              </span>
              <span className="text-[10px] text-status-online font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-status-online" />
                Online
              </span>
            </div>
            <p className="text-xs text-cafe-muted">
              Canal de comandos ESP8266 seguro vía HTTPS / JWT.
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-cafe-muted/70 px-3 py-1">
              Navegación
            </div>
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group",
                    isActive
                      ? "bg-cafe-caramel/20 text-cafe-cream border border-cafe-caramel/50 shadow-caramel-glow"
                      : "text-cafe-muted hover:text-cafe-cream hover:bg-cafe-deep/60 hover:border-cafe-roast/40 border border-transparent"
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      className={cn(
                        "w-4 h-4 transition-colors",
                        isActive
                          ? "text-cafe-caramel"
                          : "text-cafe-muted group-hover:text-cafe-latte"
                      )}
                    />
                    <span>{item.name}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="pt-4 border-t border-cafe-roast/40 space-y-3">
          <a
            href="https://esparduinoweb.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-cafe-muted hover:text-cafe-cream hover:bg-cafe-deep/50 transition-colors"
          >
            <span className="font-mono text-[11px]">Backend API</span>
            <ExternalLink className="w-3.5 h-3.5 text-cafe-muted" />
          </a>

          {user && (
            <div className="flex items-center justify-between p-2 rounded-xl bg-cafe-deep/50 border border-cafe-roast/40">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-cafe-caramel/25 border border-cafe-caramel/40 flex items-center justify-center text-cafe-latte font-bold text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-cafe-cream truncate">
                    {user.name}
                  </p>
                  <p className="text-[11px] text-cafe-muted truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                title="Cerrar sesión"
                className="p-1.5 text-cafe-muted hover:text-status-offline rounded-lg hover:bg-cafe-roast/40 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

