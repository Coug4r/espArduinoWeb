import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Cpu, Coffee, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

export const AuthLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-espresso flex items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-cafe-caramel" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-espresso relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden">
      {/* Background radial gradient glow & subtle coffee aesthetic */}
      <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-cafe-caramel/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-cafe-roast/20 blur-[140px] pointer-events-none" />

      {/* Decorative subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #D6B58C 1px, transparent 0)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* Header Branding */}
      <div className="relative z-10 flex flex-col items-center mb-8 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cafe-caramel via-[#7d4e28] to-cafe-roast p-0.5 shadow-caramel-glow-lg flex items-center justify-center mb-4">
          <div className="w-full h-full bg-espresso-dark rounded-[14px] flex items-center justify-center">
            <Cpu className="w-7 h-7 text-cafe-caramel animate-pulse-slow" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream">
            IoT<span className="text-cafe-caramel">Control</span>
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-cafe-roast/50 text-cafe-latte border border-cafe-roast">
            Cloud
          </span>
        </div>
        <p className="text-xs sm:text-sm text-cafe-muted max-w-sm flex items-center justify-center gap-1.5">
          <Coffee className="w-3.5 h-3.5 text-cafe-caramel" />
          Control remoto inteligente de dispositivos ESP8266
        </p>
      </div>

      {/* Auth Card Outlet */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Outlet />
      </div>

      {/* Auth Footer notes */}
      <div className="relative z-10 mt-8 text-center text-xs text-cafe-muted/80 flex items-center gap-3">
        <span className="flex items-center gap-1 text-cafe-latte">
          <ShieldCheck className="w-3.5 h-3.5 text-status-online" />
          JWT Seguro
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-cafe-caramel" />
          Backend Vercel Activo
        </span>
      </div>
    </div>
  );
};

