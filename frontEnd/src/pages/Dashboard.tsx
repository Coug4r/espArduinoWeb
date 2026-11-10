import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Cpu,
  Wifi,
  WifiOff,
  Plus,
  RefreshCw,
  Activity,
  Zap,
  Sliders,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { useInterval } from "../hooks/useInterval";
import { devicesService } from "../services/devices.service";
import { StatCard } from "../components/dashboard/StatCard";
import { Button } from "../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { NewDeviceModal } from "../components/devices/NewDeviceModal";
import { DeviceTokenModal } from "../components/devices/DeviceTokenModal";
import { formatRelativeTime } from "../utils/formatDate";
import { getErrorMessage } from "../utils/errors";
import type { Device } from "../types/device.types";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { error: toastError } = useToast();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<{
    name: string;
    token: string;
  } | null>(null);

  const fetchDevices = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      const response = await devicesService.getDevices();
      setDevices(response.devices || []);
    } catch (err) {
      if (!isSilent) {
        toastError("Error al cargar dispositivos", getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [toastError]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Auto-refresh devices telemetry every 15 seconds
  useInterval(() => {
    fetchDevices(true);
  }, 15000);

  const onlineCount = devices.filter((d) => d.isOnline).length;
  const offlineCount = devices.length - onlineCount;

  // Find most recent active device
  const recentDevice = devices.length > 0
    ? [...devices].sort((a, b) => {
        const timeA = a.lastSeen ? new Date(a.lastSeen).getTime() : 0;
        const timeB = b.lastSeen ? new Date(b.lastSeen).getTime() : 0;
        return timeB - timeA;
      })[0]
    : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cafe-roast/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream">
              ¡Hola, <span className="text-cafe-latte">{user?.name}</span>!
            </h1>
            <span className="w-2.5 h-2.5 rounded-full bg-status-online animate-pulse" title="Sistema Activo" />
          </div>
          <p className="text-xs sm:text-sm text-cafe-muted mt-1">
            Centro de monitoreo y telemetría en tiempo real para tus microcontroladores ESP8266.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDevices(false)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />}
            title="Refrescar estado"
          >
            Sincronizar
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsNewModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Nuevo Dispositivo
          </Button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {isLoading ? (
          <>
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
            <Skeleton className="h-28" />
          </>
        ) : (
          <>
            <StatCard
              title="Dispositivos Registrados"
              value={devices.length}
              subtitle="En tu cuenta"
              icon={Cpu}
              variant="caramel"
            />
            <StatCard
              title="Conectados Ahora"
              value={onlineCount}
              subtitle={onlineCount > 0 ? "Transmitiendo heartbeat" : "Sin actividad reciente"}
              icon={Wifi}
              variant="online"
            />
            <StatCard
              title="Desconectados"
              value={offlineCount}
              subtitle="Esperando conexión"
              icon={WifiOff}
              variant="offline"
            />
            <StatCard
              title="Estado del Backend"
              value="ACTIVO"
              subtitle="Vercel Cloud Node.js"
              icon={ShieldCheck}
              variant="latte"
            />
          </>
        )}
      </div>

      {/* Main Body: Quick Controls & Activity Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Registered Devices & Quick Control */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-cafe-caramel" />
                  <span>Acceso Rápido a Controles</span>
                </CardTitle>
                <CardDescription>
                  Envía comandos directos a los microcontroladores conectados
                </CardDescription>
              </div>

              {devices.length > 0 && (
                <Link
                  to="/devices"
                  className="text-xs font-semibold text-cafe-caramel hover:text-cafe-latte flex items-center gap-1 transition-colors"
                >
                  <span>Ver todos ({devices.length})</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              )}
            </CardHeader>

            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-20" />
                  <Skeleton className="h-20" />
                </div>
              ) : devices.length === 0 ? (
                <EmptyState
                  icon={Cpu}
                  title="No tienes dispositivos registrados"
                  description="Comienza vinculando tu primer ESP8266 para controlar su LED integrado remotamente."
                  actionLabel="Registrar mi primer dispositivo"
                  onAction={() => setIsNewModalOpen(true)}
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {devices.slice(0, 4).map((device) => (
                    <div
                      key={device.id}
                      className="p-4 rounded-xl bg-espresso-light/70 border border-cafe-roast/50 hover:border-cafe-caramel/50 transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-bold text-sm text-cafe-cream group-hover:text-cafe-latte transition-colors truncate">
                            {device.name}
                          </p>
                          <p className="text-[11px] text-cafe-muted font-mono mt-0.5">
                            ESP8266 • {formatRelativeTime(device.lastSeen)}
                          </p>
                        </div>
                        <Badge variant={device.isOnline ? "online" : "offline"} dot>
                          {device.isOnline ? "Online" : "Offline"}
                        </Badge>
                      </div>

                      <Link to={`/devices/${device.id}`} className="mt-1">
                        <Button
                          variant={device.isOnline ? "primary" : "secondary"}
                          size="sm"
                          className="w-full text-xs"
                          leftIcon={<Sliders className="w-3.5 h-3.5" />}
                        >
                          Abrir Panel LED
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right 1 Col: Architecture / Telemetry Activity summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cafe-latte" />
                <span>Última Actividad IoT</span>
              </CardTitle>
              <CardDescription>
                Registro de comunicación y latencia del sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {recentDevice ? (
                <div className="p-3.5 rounded-xl bg-espresso/80 border border-cafe-roast/50 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cafe-muted font-medium">Dispositivo más activo:</span>
                    <span className="font-bold text-cafe-cream">{recentDevice.name}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cafe-muted font-medium">Último contacto:</span>
                    <span className="font-mono text-cafe-latte">
                      {formatRelativeTime(recentDevice.lastSeen)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-cafe-muted font-medium">Estado:</span>
                    <Badge variant={recentDevice.isOnline ? "online" : "offline"} dot>
                      {recentDevice.isOnline ? "En Línea (<60s)" : "Sin Señal"}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-xs text-cafe-muted">
                  Aún no hay actividad de dispositivos registrada.
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-cafe-deep/50 border border-cafe-roast/40 space-y-2 text-xs text-cafe-muted">
                <p className="font-semibold text-cafe-latte">Protocolo de Entrega:</p>
                <ul className="space-y-1.5 list-disc list-inside text-[11px] leading-relaxed">
                  <li>Tus comandos se almacenan de forma segura en Postgres.</li>
                  <li>El ESP8266 consulta periódicamente por comandos pendientes.</li>
                  <li>Al ejecutarse, el ESP8266 confirma el estado <code className="text-cafe-cream">EXECUTED</code>.</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <NewDeviceModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onDeviceCreated={(newDev, token) => {
          setDevices((prev) => [newDev, ...prev]);
          setCreatedTokenInfo({ name: newDev.name, token });
        }}
      />

      {createdTokenInfo && (
        <DeviceTokenModal
          isOpen={!!createdTokenInfo}
          onClose={() => setCreatedTokenInfo(null)}
          deviceName={createdTokenInfo.name}
          deviceToken={createdTokenInfo.token}
        />
      )}
    </div>
  );
};

