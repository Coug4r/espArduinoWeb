import React from "react";
import { Link } from "react-router-dom";
import { Cpu, Wifi, WifiOff, Clock, Sliders, Trash2, ChevronRight } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { formatRelativeTime } from "../../utils/formatDate";
import type { Device } from "../../types/device.types";

export interface DeviceCardProps {
  device: Device;
  onDeleteRequest: (device: Device) => void;
}

export const DeviceCard: React.FC<DeviceCardProps> = ({ device, onDeleteRequest }) => {
  return (
    <Card
      glow
      className="group relative overflow-hidden transition-all duration-300 hover:border-cafe-caramel/50 hover:-translate-y-1"
    >
      {/* Decorative top accent line */}
      <div
        className={`h-1 w-full transition-colors ${
          device.isOnline
            ? "bg-gradient-to-r from-status-online/80 via-status-online to-status-online/20"
            : "bg-gradient-to-r from-status-offline/50 via-cafe-roast to-transparent"
        }`}
      />

      <CardContent className="p-5 sm:p-6 space-y-4">
        {/* Header: Icon, Name and Status Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all ${
                device.isOnline
                  ? "bg-status-online/10 border border-status-online/30 text-status-online shadow-online-glow"
                  : "bg-cafe-roast/30 border border-cafe-roast/60 text-cafe-muted"
              }`}
            >
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h4 className="text-base font-bold text-cafe-cream group-hover:text-cafe-latte transition-colors truncate">
                {device.name}
              </h4>
              <p className="text-xs text-cafe-muted font-mono flex items-center gap-1.5 mt-0.5">
                <span>ESP8266</span>
                <span>•</span>
                <span className="truncate">ID: {device.id.substring(0, 8)}...</span>
              </p>
            </div>
          </div>

          <Badge variant={device.isOnline ? "online" : "offline"} dot>
            {device.isOnline ? "En Línea" : "Desconectado"}
          </Badge>
        </div>

        {/* Telemetry metadata */}
        <div className="grid grid-cols-2 gap-2 pt-2 pb-1 border-y border-cafe-roast/30 text-xs">
          <div className="flex items-center gap-2 text-cafe-muted">
            {device.isOnline ? (
              <Wifi className="w-3.5 h-3.5 text-status-online" />
            ) : (
              <WifiOff className="w-3.5 h-3.5 text-status-offline" />
            )}
            <span className="truncate">
              {device.isOnline ? "Señal Activa" : "Sin Señal"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-cafe-muted font-mono text-[11px] justify-end">
            <Clock className="w-3.5 h-3.5 text-cafe-latte/70" />
            <span className="truncate">{formatRelativeTime(device.lastSeen)}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <Link to={`/devices/${device.id}`} className="flex-1">
            <Button
              variant={device.isOnline ? "primary" : "secondary"}
              size="sm"
              className="w-full gap-1.5"
              leftIcon={<Sliders className="w-3.5 h-3.5" />}
              rightIcon={<ChevronRight className="w-3.5 h-3.5 opacity-70" />}
            >
              Panel de Control
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteRequest(device)}
            className="text-cafe-muted hover:text-status-offline hover:bg-status-offline/10 p-2"
            title="Eliminar dispositivo"
            aria-label={`Eliminar dispositivo ${device.name}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

