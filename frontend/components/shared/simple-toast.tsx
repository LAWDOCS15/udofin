// "use client";

// import { createContext, useContext, useState, useEffect } from "react";
// import { X } from "lucide-react";
// import type { Toast, ToastType } from "@/types";

// const ToastContext = createContext<any>(null);

// export function useToast() {
//   return useContext(ToastContext);
// }

// export function ToastProvider({ children }: { children: React.ReactNode }) {
//   const [toast, setToast] = useState<Toast | null>(null);

//   const showToast = (message: string, type: ToastType = "success") => {
//     setToast({ message, type });
//   };

//   // 🔥 Auto close after 8 seconds
//   useEffect(() => {
//     if (toast) {
//       const timer = setTimeout(() => {
//         setToast(null);
//       }, 6000);

//       return () => clearTimeout(timer);
//     }
//   }, [toast]);

//   const closeToast = () => {
//     setToast(null);
//   };

//   return (
//     <ToastContext.Provider value={{ showToast }}>
//       {children}

//       {toast && (
//         <div className="fixed bottom-6 right-6 z-50 animate-slide-in">
//           <div
//             className={`flex items-center gap-4 px-6 py-4 rounded-xl shadow-xl text-white min-w-[280px]
//               ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
//           >
//             <span className="flex-1">{toast.message}</span>

//             <button
//               onClick={closeToast}
//               className="opacity-80 hover:opacity-100 transition"
//             >
//               <X size={18} />
//             </button>
//           </div>
//         </div>
//       )}
//     </ToastContext.Provider>
//   );
// }



"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { X, CheckCircle2, AlertCircle } from "lucide-react";
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

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] w-full max-w-md px-4 pointer-events-none">
          <div
            className={`
              pointer-events-auto
              flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border
              bg-background/95 backdrop-blur-md transition-all duration-300
              animate-in fade-in slide-in-from-top-4
              ${toast.type === "success" ? "border-green-500/50" : "border-red-500/50"}
            `}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="text-green-500 h-5 w-5" />
            ) : (
              <AlertCircle className="text-red-500 h-5 w-5" />
            )}
            
            <p className="flex-1 text-sm font-medium text-foreground">
              {toast.message}
            </p>

            <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}