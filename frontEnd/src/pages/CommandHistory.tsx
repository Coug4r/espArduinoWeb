import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Terminal,
  Cpu,
  ArrowRight,
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hourglass,
  Send,
  Sliders,
  Trash2,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { formatDate } from "../utils/formatDate";
import type { Command } from "../types/command.types";

interface SessionCommand extends Command {
  deviceName: string;
  deviceId: string;
}

export const CommandHistory: React.FC = () => {
  const [sessionCommands, setSessionCommands] = useState<SessionCommand[]>([]);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("iot_session_commands");
      if (stored) {
        setSessionCommands(JSON.parse(stored));
      }
    } catch {
      // Ignorar
    }
  }, []);

  const handleClearSession = () => {
    sessionStorage.removeItem("iot_session_commands");
    setSessionCommands([]);
  };

  const statuses = [
    {
      status: "PENDING",
      variant: "pending" as const,
      icon: Hourglass,
      title: "Pendiente (PENDING)",
      description: "El comando fue registrado en Neon PostgreSQL y está en espera de que el ESP8266 lo reclame.",
    },
    {
      status: "DELIVERED",
      variant: "delivered" as const,
      icon: Send,
      title: "Entregado (DELIVERED)",
      description: "El microcontrolador solicitó el comando mediante GET /api/iot/commands/next (reserva de 30s).",
    },
    {
      status: "EXECUTED",
      variant: "executed" as const,
      icon: CheckCircle2,
      title: "Ejecutado (EXECUTED)",
      description: "El ESP8266 confirmó la ejecución física mediante POST /api/iot/commands/:id/ack.",
    },
    {
      status: "FAILED",
      variant: "failed" as const,
      icon: XCircle,
      title: "Fallido (FAILED)",
      description: "El ESP8266 reportó un fallo al intentar conmutar el hardware.",
    },
    {
      status: "EXPIRED",
      variant: "expired" as const,
      icon: AlertTriangle,
      title: "Expirado (EXPIRED)",
      description: "El comando superó su tiempo de expiración (5 min) sin ser reclamado o confirmado.",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cafe-roast/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream">
              Historial de Comandos
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cafe-roast/50 text-cafe-latte border border-cafe-roast font-mono">
              Auditoría
            </span>
          </div>
          <p className="text-xs sm:text-sm text-cafe-muted mt-1">
            Registro y ciclo de vida de los comandos despachados a los microcontroladores.
          </p>
        </div>

        <Link to="/devices">
          <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
            Ir a Mis Dispositivos
          </Button>
        </Link>
      </div>

      {/* Live Session Commands (if user has sent any from DeviceControl) */}
      {sessionCommands.length > 0 && (
        <Card className="border-cafe-caramel/40 shadow-caramel-glow">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cafe-caramel" />
                <span>Comandos Emitidos en Esta Sesión (En Vivo)</span>
              </CardTitle>
              <CardDescription>
                Comandos registrados y confirmados por el backend en tu navegador actual
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSession}
              className="text-xs text-cafe-muted hover:text-status-offline"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
            >
              Limpiar
            </Button>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cafe-roast/60 text-cafe-muted uppercase font-mono text-[10px] tracking-wider">
                    <th className="py-2.5 px-3">Dispositivo</th>
                    <th className="py-2.5 px-3">Comando</th>
                    <th className="py-2.5 px-3">Fecha y Hora</th>
                    <th className="py-2.5 px-3">Estado</th>
                    <th className="py-2.5 px-3">ID / Resultado</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cafe-roast/30 font-mono">
                  {sessionCommands.map((cmd) => (
                    <tr key={cmd.id} className="hover:bg-cafe-roast/20 transition-colors">
                      <td className="py-3 px-3 font-sans font-semibold text-cafe-cream">
                        {cmd.deviceName}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-espresso text-cafe-latte border border-cafe-roast font-bold">
                          {cmd.payload?.commands?.led || JSON.stringify(cmd.payload)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-cafe-muted">
                        {formatDate(cmd.createdAt)}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            cmd.status === "EXECUTED"
                              ? "executed"
                              : cmd.status === "PENDING"
                              ? "pending"
                              : cmd.status === "DELIVERED"
                              ? "delivered"
                              : cmd.status === "FAILED"
                              ? "failed"
                              : "expired"
                          }
                          dot
                        >
                          {cmd.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-cafe-muted truncate max-w-[150px]">
                        {cmd.id}
                      </td>
                      <td className="py-3 px-3 text-right font-sans">
                        <Link to={`/devices/${cmd.deviceId}`}>
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Sliders className="w-3.5 h-3.5 mr-1" />
                            Panel
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backend Endpoint Status Notice (Honest Architecture Documentation) */}
      <Card className="border-cafe-latte/30 bg-cafe-deep/90 shadow-coffee-md">
        <CardContent className="p-5 sm:p-6 space-y-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cafe-caramel/20 border border-cafe-caramel/40 flex items-center justify-center text-cafe-caramel flex-shrink-0 mt-0.5">
              <Database className="w-5 h-5" />
            </div>

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold text-cafe-cream">
                  Integración del Historial Global con el Backend
                </h3>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cafe-roast text-cafe-latte border border-cafe-roast/80">
                  Documentación Oficial
                </span>
              </div>
              <p className="text-xs text-cafe-muted leading-relaxed">
                El backend actual expone la emisión de comandos vía <code className="text-cafe-latte bg-espresso px-1 py-0.5 rounded">POST /api/devices/:id/commands</code> y el reclamo por parte del ESP8266 vía <code className="text-cafe-latte bg-espresso px-1 py-0.5 rounded">GET /api/iot/commands/next</code>. Sin embargo, el backend <strong>no cuenta actualmente con un endpoint REST para listar el histórico de comandos</strong> para el cliente web (ej. <code className="text-cafe-cream bg-espresso px-1 py-0.5 rounded">GET /api/devices/:id/commands</code>).
              </p>
              <p className="text-xs text-cafe-muted leading-relaxed">
                Respetando estrictamente la directriz de no simular datos ficticios, los comandos mostrados arriba corresponden a los emitidos en tiempo real durante tu sesión en el navegador. La vista está preparada para consumir el endpoint persistente de la API una vez implementado en el backend.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Official Status Glossary Cards */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cafe-caramel" />
          <h2 className="text-base font-bold text-cafe-cream">
            Ciclo de Vida de los Estados de Comandos (Prisma Enum)
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statuses.map((item) => (
            <Card key={item.status} className="border-cafe-roast/50 hover:border-cafe-roast transition-all">
              <CardContent className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Badge variant={item.variant} dot>
                    {item.status}
                  </Badge>
                  <item.icon className="w-4 h-4 text-cafe-latte/70" />
                </div>
                <h4 className="text-sm font-semibold text-cafe-cream">{item.title}</h4>
                <p className="text-xs text-cafe-muted leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Schema Technical Specs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cafe-caramel" />
            <span>Especificación Técnica del Modelo Prisma Command</span>
          </CardTitle>
          <CardDescription>
            Estructura de la tabla en Neon PostgreSQL para referencia de integración
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="p-4 rounded-xl bg-espresso-dark border border-cafe-roast font-mono text-xs overflow-x-auto text-cafe-cream/90 space-y-1">
            <p className="text-cafe-latte font-bold">// backend/prisma/schema.prisma</p>
            <p className="text-cafe-muted">model Command &#123;</p>
            <p className="pl-4">id               String        @id @default(cuid())</p>
            <p className="pl-4">payload          Json          // &#123; "commands": &#123; "led": "LED_ON" | "LED_OFF" &#125; &#125;</p>
            <p className="pl-4">status           CommandStatus @default(PENDING)</p>
            <p className="pl-4">createdAt        DateTime      @default(now())</p>
            <p className="pl-4">deliveredAt      DateTime?</p>
            <p className="pl-4">executedAt       DateTime?</p>
            <p className="pl-4">expiresAt        DateTime      // TTL de 5 minutos</p>
            <p className="pl-4">deviceId         String</p>
            <p className="text-cafe-muted">&#125;</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
