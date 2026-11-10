import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Cpu, Plus } from "lucide-react";
import { devicesService } from "../../services/devices.service";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errors";
import type { Device } from "../../types/device.types";

export interface NewDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeviceCreated: (device: Device, deviceToken: string) => void;
}

export const NewDeviceModal: React.FC<NewDeviceModalProps> = ({
  isOpen,
  onClose,
  onDeviceCreated,
}) => {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, error: toastError } = useToast();

  const handleClose = () => {
    setName("");
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();

    if (!cleanName) {
      setError("El nombre del dispositivo es obligatorio");
      return;
    }

    if (cleanName.length < 2 || cleanName.length > 80) {
      setError("El nombre debe tener entre 2 y 80 caracteres");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await devicesService.createDevice({ name: cleanName });
      success("Dispositivo creado", `"${response.device.name}" registrado con éxito`);
      onDeviceCreated(response.device, response.deviceToken);
      handleClose();
    } catch (err) {
      const msg = getErrorMessage(err, "Error al registrar dispositivo");
      setError(msg);
      toastError("Error", msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Registrar Nuevo Dispositivo"
      description="Vincula una placa ESP8266 o microcontrolador a tu cuenta"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre del Dispositivo"
          placeholder="Ej: NodeMCU Sala, ESP8266 Oficina..."
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError(null);
          }}
          error={error || undefined}
          leftIcon={<Cpu className="w-4 h-4" />}
          helperText="Elige un nombre descriptivo para identificarlo fácilmente."
          autoFocus
        />

        <div className="p-3 rounded-xl bg-espresso/70 border border-cafe-roast/40 text-xs text-cafe-muted space-y-1">
          <p className="font-semibold text-cafe-latte">Nota técnica:</p>
          <p>
            Al registrar el dispositivo, el servidor generará un token único de 64 caracteres hexadecimales (SHA-256) con el que tu placa se autenticará.
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            isLoading={isSubmitting}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Registrar Dispositivo
          </Button>
        </div>
      </form>
    </Modal>
  );
};

