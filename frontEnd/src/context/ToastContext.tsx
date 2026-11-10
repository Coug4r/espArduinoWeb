import React, { createContext, useCallback, useState } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

export interface ToastContextValue {
  toast: (item: Omit<ToastItem, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        dismiss(id);
      }, 5000);
    },
    [dismiss]
  );

  const success = useCallback(
    (title: string, message?: string) => toast({ type: "success", title, message }),
    [toast]
  );
  const error = useCallback(
    (title: string, message?: string) => toast({ type: "error", title, message }),
    [toast]
  );
  const info = useCallback(
    (title: string, message?: string) => toast({ type: "info", title, message }),
    [toast]
  );
  const warning = useCallback(
    (title: string, message?: string) => toast({ type: "warning", title, message }),
    [toast]
  );

  return (
    <ToastContext.Provider value={{ toast, success, error, info, warning, dismiss }}>
      {children}
      {/* Toast container */}
      <div
        aria-live="polite"
        className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((t) => {
          const icons = {
            success: <CheckCircle2 className="w-5 h-5 text-status-online flex-shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-status-offline flex-shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-status-pending flex-shrink-0" />,
            info: <Info className="w-5 h-5 text-cafe-latte flex-shrink-0" />,
          };

          const borders = {
            success: "border-status-online/40 shadow-[0_0_15px_-3px_rgba(117,214,154,0.3)]",
            error: "border-status-offline/40 shadow-[0_0_15px_-3px_rgba(228,119,112,0.3)]",
            warning: "border-status-pending/40 shadow-[0_0_15px_-3px_rgba(229,169,60,0.3)]",
            info: "border-cafe-caramel/40 shadow-[0_0_15px_-3px_rgba(184,121,69,0.3)]",
          };

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl bg-cafe-deep/95 backdrop-blur-md border ${borders[t.type]} animate-slide-up transition-all`}
            >
              <div className="mt-0.5">{icons[t.type]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-cafe-cream leading-tight">{t.title}</p>
                {t.message && (
                  <p className="text-xs text-cafe-muted mt-1 leading-relaxed break-words">{t.message}</p>
                )}
              </div>
              <button
                onClick={() => dismiss(t.id)}
                className="text-cafe-muted hover:text-cafe-cream transition-colors p-1 rounded-lg hover:bg-cafe-roast/50 flex-shrink-0"
                aria-label="Cerrar notificación"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

