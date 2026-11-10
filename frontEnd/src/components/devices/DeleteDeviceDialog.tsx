import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { AlertTriangle, Trash2 } from "lucide-react";
import { devicesService } from "../../services/devices.service";
import { useToast } from "../../hooks/useToast";
import { getErrorMessage } from "../../utils/errors";
import type { Device } from "../../types/device.types";

export interface DeleteDeviceDialogProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleted: (deviceId: string) => void;
}

export const DeleteDeviceDialog: React.FC<DeleteDeviceDialogProps> = ({
  device,
  isOpen,
  onClose,
  onDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { success, error: toastError } = useToast();

  if (!device) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await devicesService.deleteDevice(device.id);
      success("Dispositivo eliminado", `"${device.name}" ha sido eliminado`);
      onDeleted(device.id);
      onClose();
    } catch (err) {
      const msg = getErrorMessage(err, "No se pudo eliminar el dispositivo");
      toastError("Error", msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Eliminar Dispositivo"
      maxWidth="sm"
    >
      <div className="space-y-4">
        <div className="p-3.5 rounded-xl bg-status-offline/10 border border-status-offline/30 flex items-start gap-3 text-status-offline">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-cafe-cream">
            ¿Estás seguro de que deseas eliminar permanentemente el dispositivo{" "}
            <span className="font-bold text-status-offline">"{device.name}"</span>?
            Esta acción eliminará todos los comandos asociados en el servidor.
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancelar
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
            leftIcon={<Trash2 className="w-4 h-4" />}
          >
            Eliminar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

