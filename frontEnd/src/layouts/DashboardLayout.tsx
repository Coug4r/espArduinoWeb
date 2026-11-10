import React, { useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/layout/Navbar";
import { Sidebar } from "../components/layout/Sidebar";
import { Footer } from "../components/layout/Footer";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

export const DashboardLayout: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-espresso flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-cafe-deep border border-cafe-caramel/40 shadow-caramel-glow flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-cafe-caramel" />
          </div>
          <p className="text-sm font-medium text-cafe-latte animate-pulse">
            Cargando IoT Control...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-espresso flex flex-col selection:bg-cafe-caramel selection:text-white">
      <Navbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />

      <div className="flex flex-1">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Pane */}
        <main className="flex-1 lg:pl-64 flex flex-col min-h-[calc(100vh-4rem)]">
          <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-fade-in">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};

