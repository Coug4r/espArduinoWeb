import React from "react";
import { User, Mail, Calendar, Key, ShieldCheck, LogOut, Server, Database } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatDate } from "../utils/formatDate";

export const Settings: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-cafe-roast/40">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream">
          Configuración y Perfil
        </h1>
        <p className="text-xs sm:text-sm text-cafe-muted mt-1">
          Información de tu cuenta de usuario y configuración del entorno IoT.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Quick Actions */}
        <div className="space-y-6">
          <Card className="text-center p-6 flex flex-col items-center">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cafe-caramel to-cafe-roast p-0.5 shadow-caramel-glow mb-4">
              <div className="w-full h-full bg-espresso-dark rounded-[14px] flex items-center justify-center text-2xl font-bold text-cafe-latte">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </div>

            <h3 className="text-base font-bold text-cafe-cream">{user?.name}</h3>
            <p className="text-xs text-cafe-muted mb-4">{user?.email}</p>

            <Badge variant="online" dot className="mb-6">
              Sesión Activa
            </Badge>

            <Button
              variant="danger"
              size="sm"
              onClick={logout}
              className="w-full gap-2"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Cerrar Sesión
            </Button>
          </Card>
        </div>

        {/* Right 2 Columns: Detailed Account & Environment Info */}
        <div className="md:col-span-2 space-y-6">
          {/* User Account Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="w-4 h-4 text-cafe-caramel" />
                <span>Datos de la Cuenta</span>
              </CardTitle>
              <CardDescription>
                Información recuperada desde el backend vía GET /api/auth/me
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-espresso-light/70 border border-cafe-roast/40 space-y-1">
                  <div className="text-[11px] font-semibold text-cafe-muted flex items-center gap-1.5 uppercase tracking-wider">
                    <User className="w-3.5 h-3.5 text-cafe-latte" />
                    Nombre Completo
                  </div>
                  <div className="text-sm font-bold text-cafe-cream">{user?.name}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-espresso-light/70 border border-cafe-roast/40 space-y-1">
                  <div className="text-[11px] font-semibold text-cafe-muted flex items-center gap-1.5 uppercase tracking-wider">
                    <Mail className="w-3.5 h-3.5 text-cafe-latte" />
                    Correo Electrónico
                  </div>
                  <div className="text-sm font-bold text-cafe-cream">{user?.email}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-espresso-light/70 border border-cafe-roast/40 space-y-1">
                  <div className="text-[11px] font-semibold text-cafe-muted flex items-center gap-1.5 uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-cafe-latte" />
                    Identificador de Usuario (ID)
                  </div>
                  <div className="text-xs font-mono font-medium text-cafe-cream/80 truncate">
                    {user?.id}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-espresso-light/70 border border-cafe-roast/40 space-y-1">
                  <div className="text-[11px] font-semibold text-cafe-muted flex items-center gap-1.5 uppercase tracking-wider">
                    <Calendar className="w-3.5 h-3.5 text-cafe-latte" />
                    Fecha de Registro
                  </div>
                  <div className="text-xs font-mono font-medium text-cafe-cream">
                    {formatDate(user?.createdAt)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Infrastructure & Security Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Server className="w-4 h-4 text-cafe-latte" />
                <span>Infraestructura y Conexión</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-cafe-roast/30">
                <span className="text-cafe-muted flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-cafe-caramel" />
                  Backend Base URL:
                </span>
                <span className="font-mono text-cafe-cream bg-espresso px-2 py-0.5 rounded border border-cafe-roast/50">
                  {import.meta.env.VITE_API_URL || "https://esparduinoweb.vercel.app"}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cafe-roast/30">
                <span className="text-cafe-muted flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-status-online" />
                  Mecanismo de Autenticación:
                </span>
                <span className="font-mono text-cafe-latte">
                  JWT (JSON Web Token) / Bearer
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cafe-roast/30">
                <span className="text-cafe-muted flex items-center gap-2">
                  <Database className="w-3.5 h-3.5 text-status-delivered" />
                  Base de Datos:
                </span>
                <span className="font-mono text-cafe-latte">
                  Neon PostgreSQL + Prisma ORM
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

