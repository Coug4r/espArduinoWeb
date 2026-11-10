import React, { useCallback, useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Cpu,
  Power,
  RefreshCw,
  Clock,
  Wifi,
  WifiOff,
  Radio,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Terminal,
  Send,
} from "lucide-react";
import { devicesService } from "../services/devices.service";
import { commandsService } from "../services/commands.service";
import { useToast } from "../hooks/useToast";
import { useInterval } from "../hooks/useInterval";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Skeleton } from "../components/ui/Skeleton";
import { formatRelativeTime, formatDate } from "../utils/formatDate";
import { getErrorMessage } from "../utils/errors";
import type { Device } from "../types/device.types";
import type { Command } from "../types/command.types";

export const DeviceControl: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { success, error: toastError } = useToast();

  const [device, setDevice] = useState<Device | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Command state tracking
  const [isSendingCommand, setIsSendingCommand] = useState(false);
  const [lastCommand, setLastCommand] = useState<Command | null>(null);
  const [activeLedState, setActiveLedState] = useState<"LED_ON" | "LED_OFF" | null>(null);
  const [customCommandInput, setCustomCommandInput] = useState("");
  const [commandError, setCommandError] = useState<string | null>(null);

  const fetchDevice = useCallback(async (isSilent = false) => {
    if (!id) return;
    if (!isSilent) setIsRefreshing(true);

    try {
      const response = await devicesService.getDeviceById(id);
      setDevice(response.device);
    } catch (err) {
      if (!isSilent) {
        toastError("Error al consultar el dispositivo", getErrorMessage(err));
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [id, toastError]);

  useEffect(() => {
    fetchDevice();
  }, [fetchDevice]);

  // Polling device telemetry every 5 seconds for live status
  useInterval(() => {
    fetchDevice(true);
  }, 5000);

  const handleSendCommand = async (commandText: string) => {
    if (!device) return;

    const trimmed = commandText.trim();
    if (!trimmed) {
      setCommandError("El comando no puede estar vacío");
      return;
    }
    if (trimmed.length > 200 || /[\r\n]/.test(trimmed)) {
      setCommandError("El comando debe tener máximo 200 caracteres sin saltos de línea");
      return;
    }

    setCommandError(null);
    setIsSendingCommand(true);
    try {
      const response = await commandsService.sendCommand(device.id, trimmed);
      setLastCommand(response.command);

      // Track LED state if it was an LED command
      if (trimmed === "LED_ON") {
        setActiveLedState("LED_ON");
      } else if (trimmed === "LED_OFF") {
        setActiveLedState("LED_OFF");
      }

      // Save to sessionStorage so it appears in CommandHistory in real-time
      try {
        const stored = sessionStorage.getItem("iot_session_commands");
        const list = stored ? JSON.parse(stored) : [];
        list.unshift({
          ...response.command,
          deviceName: device.name,
          deviceId: device.id,
        });
        sessionStorage.setItem("iot_session_commands", JSON.stringify(list.slice(0, 30)));
      } catch {
        // Silently continue if storage is restricted
      }

      success(
        "Comando registrado en el Backend",
        `Comando "${trimmed}" encolado para ${device.name} (Estado: ${response.command.status})`
      );

      setCustomCommandInput("");
    } catch (err) {
      const msg = getErrorMessage(err, "No se pudo enviar el comando al servidor");
      setCommandError(msg);
      toastError("Error al enviar comando", msg);
    } finally {
      setIsSendingCommand(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (!device) {
    return (
      <div className="text-center py-16 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-status-offline/10 border border-status-offline/30 flex items-center justify-center text-status-offline">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-cafe-cream">Dispositivo no encontrado</h2>
        <p className="text-sm text-cafe-muted max-w-md mx-auto">
          El microcontrolador que buscas no existe o no pertenece a tu cuenta.
        </p>
        <Link to="/devices">
          <Button variant="outline" leftIcon={<ArrowLeft className="w-4 h-4" />}>
            Volver a mis dispositivos
          </Button>
        </Link>
      </div>
    );
  }

  const isLedOn = activeLedState === "LED_ON";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-cafe-roast/40">
        <div className="flex items-center gap-3">
          <Link to="/devices">
            <Button
              variant="outline"
              size="sm"
              className="px-2.5 h-9"
              aria-label="Volver a lista"
              title="Volver a Mis Dispositivos"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>

          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-cafe-cream">
                {device.name}
              </h1>
              <Badge variant={device.isOnline ? "online" : "offline"} dot>
                {device.isOnline ? "En Línea" : "Desconectado"}
              </Badge>
            </div>
            <p className="text-xs text-cafe-muted font-mono flex items-center gap-2 mt-0.5">
              <span>ESP8266 Wi-Fi</span>
              <span>•</span>
              <span className="truncate">ID: {device.id}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDevice(false)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />}
          >
            Sincronizar
          </Button>
        </div>
      </div>

      {/* Main Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Big Interactive LED Control Hub & Custom Commands (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* LED Control Card */}
          <Card className="border-cafe-roast/60 bg-cafe-deep/80 shadow-coffee-lg overflow-hidden">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                <Power className="w-5 h-5 text-cafe-caramel" />
                <span>Control del LED Integrado (GPIO2 / D4)</span>
              </CardTitle>
              <CardDescription>
                Transmisión remota de órdenes digitales mediante cola en servidor
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-2 pb-6 flex flex-col items-center">
              {/* Virtual LED Hardware Diode Visualizer */}
              <div className="relative my-4 flex flex-col items-center justify-center">
                {/* Exterior Glow Aura */}
                <div
                  className={`w-40 h-40 rounded-full transition-all duration-700 blur-2xl pointer-events-none ${
                    isLedOn
                      ? "bg-cafe-caramel/40 opacity-100 scale-110"
                      : "bg-transparent opacity-0 scale-90"
                  }`}
                />

                {/* LED Outer Enclosure / Ring */}
                <div
                  className={`relative w-32 h-32 rounded-full p-2 transition-all duration-500 shadow-2xl flex items-center justify-center ${
                    isLedOn
                      ? "bg-gradient-to-tr from-cafe-deep via-cafe-roast to-cafe-caramel border-2 border-cafe-caramel/80 shadow-caramel-glow-lg"
                      : "bg-espresso-dark border-2 border-cafe-roast/50 shadow-inner"
                  }`}
                >
                  {/* Internal Diode Core */}
                  <div
                    className={`w-full h-full rounded-full transition-all duration-500 flex flex-col items-center justify-center relative overflow-hidden ${
                      isLedOn
                        ? "bg-gradient-to-br from-cafe-caramel via-[#cf8b55] to-cafe-latte shadow-[inset_0_0_20px_rgba(255,255,255,0.7)]"
                        : "bg-espresso/90 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]"
                    }`}
                  >
                    {/* Filament specular reflection */}
                    <div
                      className={`absolute top-2 left-5 w-7 h-3 rounded-full rotate-[-30deg] transition-opacity ${
                        isLedOn ? "bg-white/60 blur-[1px]" : "bg-white/10"
                      }`}
                    />

                    <Power
                      className={`w-9 h-9 transition-all duration-300 ${
                        isLedOn
                          ? "text-espresso-dark scale-110 drop-shadow-md"
                          : "text-cafe-roast scale-95"
                      }`}
                    />
                  </div>
                </div>

                {/* State Label Below Diode */}
                <div className="mt-4 text-center space-y-1">
                  <div className="flex items-center justify-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full transition-colors ${
                        isLedOn
                          ? "bg-cafe-caramel shadow-[0_0_8px_#B87945] animate-pulse"
                          : "bg-cafe-roast"
                      }`}
                    />
                    <span className="text-xs uppercase font-mono tracking-widest font-bold text-cafe-cream">
                      {isLedOn ? "ESTADO: ENCENDIDO (LED_ON)" : "ESTADO: APAGADO (LED_OFF)"}
                    </span>
                  </div>
                  <p className="text-[11px] text-cafe-muted">
                    {lastCommand
                      ? `Confirmado por backend: ${lastCommand.status}`
                      : "Esperando primer comando de la sesión"}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 w-full max-w-md mt-2">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={() => handleSendCommand("LED_ON")}
                  isLoading={isSendingCommand && activeLedState === "LED_ON"}
                  disabled={isSendingCommand}
                  className="h-12 font-bold text-sm tracking-wide gap-2 bg-cafe-caramel hover:bg-cafe-caramel-hover shadow-caramel-glow"
                  leftIcon={<Power className="w-4 h-4 text-white" />}
                >
                  ENCENDER LED
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => handleSendCommand("LED_OFF")}
                  isLoading={isSendingCommand && activeLedState === "LED_OFF"}
                  disabled={isSendingCommand}
                  className="h-12 font-bold text-sm tracking-wide gap-2 hover:border-cafe-latte"
                  leftIcon={<Power className="w-4 h-4 text-cafe-muted" />}
                >
                  APAGAR LED
                </Button>
              </div>

              {/* Status advisory */}
              {!device.isOnline && (
                <div className="mt-4 p-3 rounded-xl bg-status-offline/10 border border-status-offline/30 text-xs text-status-offline flex items-start gap-2.5 max-w-md">
                  <WifiOff className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    El dispositivo se encuentra desconectado. El comando quedará registrado en la cola del backend y el ESP8266 lo procesará cuando vuelva a conectarse (dentro de los 5 minutos de validez).
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* New Feature: Custom Commands Terminal */}
          <Card className="border-cafe-roast/60 bg-cafe-deep/80 shadow-coffee-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cafe-caramel" />
                  <span>Consola de Comandos Flexibles</span>
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cafe-roast/60 text-cafe-latte border border-cafe-roast">
                  NUEVO BACKEND
                </span>
              </CardTitle>
              <CardDescription>
                El backend ahora admite cualquier cadena de comando (1-200 caracteres). Escribe tu orden o usa los accesos directos.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3.5">
              {/* Presets */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] text-cafe-muted font-medium mr-1">Rápidos:</span>
                {[
                  "LED_ON",
                  "LED_OFF",
                  "STATUS",
                  "REBOOT",
                  "RELAY_1_ON",
                  "RELAY_1_OFF",
                  "PING",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => handleSendCommand(preset)}
                    disabled={isSendingCommand}
                    className="px-2.5 py-1 rounded-lg text-xs font-mono bg-espresso hover:bg-cafe-roast/60 text-cafe-cream border border-cafe-roast/60 hover:border-cafe-caramel/50 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              {/* Command text input form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendCommand(customCommandInput);
                }}
                className="flex items-center gap-2"
              >
                <div className="flex-1">
                  <Input
                    placeholder="Escribe un comando personalizado (ej. BUZZER_BEEP, GET_TEMP)..."
                    value={customCommandInput}
                    onChange={(e) => {
                      setCustomCommandInput(e.target.value);
                      if (commandError) setCommandError(null);
                    }}
                    error={commandError || undefined}
                    leftIcon={<Terminal className="w-4 h-4" />}
                    className="h-10 text-xs font-mono"
                    maxLength={200}
                  />
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSendingCommand}
                  disabled={!customCommandInput.trim() || isSendingCommand}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                  className="h-10 text-xs font-semibold px-4"
                >
                  Enviar
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Execution status & Technical Telemetry (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Last Command Status Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cafe-caramel" />
                  <span>Último Comando Registrado</span>
                </span>
                {lastCommand && (
                  <Badge
                    variant={
                      lastCommand.status === "EXECUTED"
                        ? "executed"
                        : lastCommand.status === "PENDING"
                        ? "pending"
                        : lastCommand.status === "DELIVERED"
                        ? "delivered"
                        : lastCommand.status === "FAILED"
                        ? "failed"
                        : "expired"
                    }
                    dot
                  >
                    {lastCommand.status}
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>
                Respuesta del backend para auditoría de entrega
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {lastCommand ? (
                <div className="space-y-3 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-espresso-dark border border-cafe-roast/60 space-y-2">
                    <div className="flex justify-between items-center text-cafe-muted">
                      <span>ID Comando:</span>
                      <span className="text-cafe-cream select-all">
                        {lastCommand.id.substring(0, 16)}...
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-cafe-muted">
                      <span>Payload:</span>
                      <span className="text-cafe-caramel font-bold break-all">
                        {JSON.stringify(lastCommand.payload)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-cafe-muted">
                      <span>Hora de emisión:</span>
                      <span className="text-cafe-latte">
                        {formatDate(lastCommand.createdAt)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center text-cafe-muted">
                      <span>Vigencia:</span>
                      <span className="text-cafe-muted text-[11px]">
                        Hasta {formatDate(lastCommand.expiresAt)}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-cafe-deep/50 border border-cafe-roast/40 flex items-start gap-2.5 text-xs text-cafe-muted">
                    <CheckCircle2 className="w-4 h-4 text-status-online flex-shrink-0 mt-0.5" />
                    <p className="leading-relaxed">
                      El comando ha sido guardado exitosamente con estado{" "}
                      <strong className="text-cafe-cream">{lastCommand.status}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-xs text-cafe-muted border border-dashed border-cafe-roast/50 rounded-xl">
                  No has emitido ningún comando en esta sesión de navegación.
                </div>
              )}
            </CardContent>
          </Card>

          {/* Device Hardware Specs Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cafe-latte" />
                <span>Parámetros de Telemetría</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-2 border-b border-cafe-roast/30">
                <span className="text-cafe-muted flex items-center gap-2">
                  <Wifi className="w-3.5 h-3.5" />
                  Estado de Conexión:
                </span>
                <Badge variant={device.isOnline ? "online" : "offline"} dot>
                  {device.isOnline ? "En Línea (Conectado)" : "Desconectado"}
                </Badge>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cafe-roast/30">
                <span className="text-cafe-muted flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  Última Comunicación:
                </span>
                <span className="font-mono text-cafe-cream">
                  {formatRelativeTime(device.lastSeen)}
                </span>
              </div>

              <div className="flex items-center justify-between py-2 border-b border-cafe-roast/30">
                <span className="text-cafe-muted flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5" />
                  Registrado el:
                </span>
                <span className="font-mono text-cafe-latte">
                  {formatDate(device.createdAt)}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-espresso/60 border border-cafe-roast/30 text-[11px] text-cafe-muted flex items-start gap-2 mt-2">
                <HelpCircle className="w-4 h-4 text-cafe-caramel flex-shrink-0 mt-0.5" />
                <p>
                  El estado en línea se calcula si el microcontrolador ha enviado un pulso o solicitado comandos en los últimos 60 segundos.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
