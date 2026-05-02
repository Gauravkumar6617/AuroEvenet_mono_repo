import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import React from "react";
interface Toast {
  id: number;
  message: string;
  variant: "info" | "success" | "error" | "warning";
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, variant?: Toast["variant"]) => void;
  removeToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: Toast["variant"] = "info") => {
      const id = Date.now() + Math.random();
      setToasts((prev) => [...prev, { id, message, variant }]);
      setTimeout(() => removeToast(id), 2600);
    },
    [removeToast],
  );

  const value = useMemo<ToastContextType>(
    () => ({ showToast, toasts, removeToast }),
    [showToast, toasts, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>{children}</ToastContext.Provider>
  );
}

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
