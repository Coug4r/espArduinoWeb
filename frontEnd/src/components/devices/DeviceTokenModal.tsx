import React, { useState } from "react";
import { Copy, Check, ShieldAlert, Key } from "lucide-react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { useToast } from "../../hooks/useToast";

export interface DeviceTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  deviceName: string;
  deviceToken: string;
}

export const DeviceTokenModal: React.FC<DeviceTokenModalProps> = ({
  isOpen,
  onClose,
  deviceName,
  deviceToken,
}) => {
  const [copied, setCopied] = useState(false);
  const { success } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(deviceToken);
      setCopied(true);
      success("Token copiado", "Pégalo en el código de tu ESP8266");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Token de Autenticación del ESP8266"
      description={`Dispositivo registrado: "${deviceName}"`}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Security Warning Notice */}
        <div className="p-3.5 rounded-xl bg-status-pending/10 border border-status-pending/30 flex items-start gap-3 text-status-pending">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <p className="font-semibold text-cafe-cream">¡Guarda este token ahora!</p>
            <p className="text-cafe-cream/80 leading-relaxed">
              Por razones estrictas de seguridad, este token solo se muestra una vez. Tu microcontrolador ESP8266 lo utilizará en la cabecera <code className="bg-espresso px-1 py-0.5 rounded text-cafe-latte font-mono">x-device-token</code> para autenticarse ante el backend.
            </p>
          </div>
        </div>

        {/* Token display box */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-cafe-latte flex items-center gap-1.5">
            <Key className="w-3.5 h-3.5 text-cafe-caramel" />
            Token Privado del Dispositivo
          </label>
          <div className="relative flex items-center">
            <div className="w-full p-3 pr-24 rounded-xl bg-espresso-dark border border-cafe-roast font-mono text-xs text-status-online break-all select-all">
              {deviceToken}
            </div>
            <button
              onClick={handleCopy}
              className="absolute right-2 px-3 py-1.5 rounded-lg bg-cafe-caramel hover:bg-cafe-caramel-hover text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-status-online" />
                  <span>Copiado</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ESP8266 Config preview */}
        <div className="p-3 rounded-xl bg-espresso/80 border border-cafe-roast/40 font-mono text-[11px] text-cafe-muted space-y-1">
          <p className="text-cafe-latte font-semibold text-xs">Ejemplo en C++ (Arduino/ESP8266):</p>
          <p className="text-cafe-cream/90">const char* deviceToken = &quot;{deviceToken.substring(0, 16)}...&quot;;</p>
          <p className="text-cafe-cream/70">http.addHeader(&quot;x-device-token&quot;, deviceToken);</p>
        </div>

        <div className="pt-2 flex justify-end">
          <Button onClick={onClose} size="md" className="w-full sm:w-auto">
            He guardado mi token, continuar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

