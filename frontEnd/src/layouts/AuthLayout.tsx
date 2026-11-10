import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Cpu, Terminal, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

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
    <div className="min-h-screen bg-espresso relative flex flex-col justify-center items-center p-4 sm:p-6 overflow-hidden font-mono">
      {/* Background radial gradient glow & cyberpunk matrix aura */}
      <div className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-cafe-caramel/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] rounded-full bg-cafe-latte/10 blur-[140px] pointer-events-none" />

      {/* Cyberpunk matrix dots grid */}
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, #00FF66 1px, transparent 0)`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Header Branding */}
      <div className="relative z-10 flex flex-col items-center mb-8 text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cafe-caramel via-[#008f4c] to-cafe-deep p-0.5 shadow-caramel-glow-lg flex items-center justify-center mb-4 border border-cafe-caramel/50">
          <div className="w-full h-full bg-espresso-dark rounded-[14px] flex items-center justify-center">
            <Cpu className="w-7 h-7 text-cafe-caramel animate-pulse-slow" />
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream">
            IoT<span className="text-cafe-caramel">_CONTROL</span>
          </h1>
          <span className="px-2 py-0.5 rounded text-[10px] uppercase bg-cafe-roast/60 text-cafe-latte border border-cafe-roast font-bold">
            CYBER_v2
          </span>
        </div>
        <p className="text-xs sm:text-sm text-cafe-muted max-w-sm flex items-center justify-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-cafe-caramel" />
          Terminal criptográfica para nodos ESP8266
        </p>
      </div>

      {/* Auth Card Outlet */}
      <div className="relative z-10 w-full max-w-md animate-scale-in">
        <Outlet />
      </div>

      {/* Auth Footer notes */}
      <div className="relative z-10 mt-8 text-center text-xs text-cafe-muted flex items-center gap-3">
        <span className="flex items-center gap-1 text-cafe-latte">
          <ShieldCheck className="w-3.5 h-3.5 text-status-online" />
          SHA256 // JWT
        </span>
        <span>•</span>
        <span className="flex items-center gap-1 text-cafe-caramel">
          <Sparkles className="w-3.5 h-3.5 text-cafe-caramel" />
          VERCEL_API_ACTIVE
        </span>
      </div>
    </div>
  );
};
