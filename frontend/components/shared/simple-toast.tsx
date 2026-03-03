"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Toast, ToastType } from "@/types";

const ToastContext = createContext<any>(null);

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type });
  };

  // 🔥 Auto close after 8 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const closeToast = () => {
    setToast(null);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
          <div
            className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl text-white min-w-[280px]
              ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            <span className="flex-1">{toast.message}</span>

            <button
              onClick={closeToast}
              className="opacity-80 hover:opacity-100 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
