import React, { useCallback, useEffect, useState } from "react";
import { Cpu, Plus, Search, RefreshCw, Filter } from "lucide-react";
import { devicesService } from "../services/devices.service";
import { useToast } from "../hooks/useToast";
import { useInterval } from "../hooks/useInterval";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Skeleton } from "../components/ui/Skeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { DeviceCard } from "../components/devices/DeviceCard";
import { NewDeviceModal } from "../components/devices/NewDeviceModal";
import { DeviceTokenModal } from "../components/devices/DeviceTokenModal";
import { DeleteDeviceDialog } from "../components/devices/DeleteDeviceDialog";
import { getErrorMessage } from "../utils/errors";
import type { Device } from "../types/device.types";

export const Devices: React.FC = () => {
  const { error: toastError } = useToast();

  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "online" | "offline">("all");

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [createdTokenInfo, setCreatedTokenInfo] = useState<{
    name: string;
    token: string;
  } | null>(null);
  const [deviceToDelete, setDeviceToDelete] = useState<Device | null>(null);

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

  // Periodic polling every 15s to update status
  useInterval(() => {
    fetchDevices(true);
  }, 15000);

  const filteredDevices = devices.filter((device) => {
    const matchesSearch = device.name.toLowerCase().includes(searchQuery.toLowerCase());
    if (statusFilter === "online") return matchesSearch && device.isOnline;
    if (statusFilter === "offline") return matchesSearch && !device.isOnline;
    return matchesSearch;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-cafe-roast/40">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-cafe-cream">
              Mis Dispositivos
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cafe-roast/50 text-cafe-latte border border-cafe-roast font-mono">
              {devices.length} {devices.length === 1 ? "unidad" : "unidades"}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-cafe-muted mt-1">
            Administra los microcontroladores vinculados a tu cuenta y accede a sus paneles de control.
          </p>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDevices(false)}
            isLoading={isRefreshing}
            leftIcon={<RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />}
            title="Refrescar lista"
          >
            Actualizar
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

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="w-full sm:flex-1">
          <Input
            placeholder="Buscar dispositivo por nombre..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            className="h-10 text-xs"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1 p-1 bg-espresso-light/80 border border-cafe-roast/50 rounded-xl w-full sm:w-auto justify-center">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                statusFilter === "all"
                  ? "bg-cafe-caramel text-white shadow-sm"
                  : "text-cafe-muted hover:text-cafe-cream"
              }`}
            >
              Todos ({devices.length})
            </button>
            <button
              onClick={() => setStatusFilter("online")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "online"
                  ? "bg-status-online/20 text-status-online border border-status-online/40 shadow-sm"
                  : "text-cafe-muted hover:text-status-online"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-status-online" />
              Online ({devices.filter((d) => d.isOnline).length})
            </button>
            <button
              onClick={() => setStatusFilter("offline")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                statusFilter === "offline"
                  ? "bg-status-offline/20 text-status-offline border border-status-offline/40 shadow-sm"
                  : "text-cafe-muted hover:text-status-offline"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-status-offline" />
              Offline ({devices.filter((d) => !d.isOnline).length})
            </button>
          </div>
        </div>
      </div>

      {/* Device Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
          <Skeleton className="h-52" />
        </div>
      ) : devices.length === 0 ? (
        <EmptyState
          icon={Cpu}
          title="No hay dispositivos configurados"
          description="Registra tu primera placa ESP8266 para empezar a enviarle comandos y monitorear su estado."
          actionLabel="Registrar Dispositivo"
          onAction={() => setIsNewModalOpen(true)}
        />
      ) : filteredDevices.length === 0 ? (
        <EmptyState
          icon={Filter}
          title="No se encontraron coincidencias"
          description={`No hay ningún dispositivo que coincida con "${searchQuery}".`}
          actionLabel="Limpiar búsqueda"
          onAction={() => {
            setSearchQuery("");
            setStatusFilter("all");
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDevices.map((device) => (
            <DeviceCard
              key={device.id}
              device={device}
              onDeleteRequest={(dev) => setDeviceToDelete(dev)}
            />
          ))}
        </div>
      )}

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

      <DeleteDeviceDialog
        device={deviceToDelete}
        isOpen={!!deviceToDelete}
        onClose={() => setDeviceToDelete(null)}
        onDeleted={(deletedId) => {
          setDevices((prev) => prev.filter((d) => d.id !== deletedId));
        }}
      />
    </div>
  );
};

