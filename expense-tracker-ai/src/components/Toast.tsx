"use client";

import { useEffect } from "react";

export interface ToastState {
  message: string;
  type: "success" | "error";
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isSuccess = toast.type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-lg px-4 py-3 shadow-lg text-sm font-medium text-white ${
        isSuccess ? "bg-emerald-600" : "bg-red-600"
      }`}
    >
      {toast.message}
    </div>
  );
}
