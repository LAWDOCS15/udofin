"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { AlertTriangle, X } from "lucide-react"

interface ConfirmationModalProps {
  open: boolean
  title: string
  description: string
  /** Primary API */
  confirmLabel?: string
  cancelLabel?: string
  variant?: "danger" | "default"
  onConfirm: () => void
  onCancel?: () => void
  isLoading?: boolean
  /** Alias API */
  confirmText?: string
  cancelText?: string
  danger?: boolean
  onClose?: () => void
}

export function ConfirmationModal({
  open,
  title,
  description,
  confirmLabel,
  confirmText,
  cancelLabel,
  cancelText,
  variant,
  danger,
  onConfirm,
  onCancel,
  onClose,
  isLoading = false,
}: ConfirmationModalProps) {
  const handleClose = onCancel || onClose || (() => {})
  const displayConfirm = confirmLabel || confirmText || "Confirm"
  const displayCancel = cancelLabel || cancelText || "Cancel"
  const isDanger = variant === "danger" || danger === true

  // Close on Escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") handleClose()
  }, [handleClose])

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown)
      document.body.style.overflow = "hidden"
      return () => {
        document.removeEventListener("keydown", handleKeyDown)
        document.body.style.overflow = ""
      }
    }
  }, [open, handleKeyDown])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-150" onClick={handleClose} />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl shadow-foreground/10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex items-start gap-3">
            {isDanger && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                {title}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
            <button
              onClick={handleClose}
              className="h-7 w-7 shrink-0 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="border-t border-border px-6 py-4 flex items-center justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="h-9 px-4 rounded-xl text-xs font-medium text-muted-foreground hover:bg-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-accent/20"
          >
            {displayCancel}
          </button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`h-9 rounded-xl text-xs font-semibold min-w-[100px] transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${
              isDanger
                ? "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/30"
                : "bg-accent text-accent-foreground hover:bg-accent/90 focus:ring-accent/30"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-r-transparent" />
                Processing...
              </span>
            ) : displayConfirm}
          </Button>
        </div>
      </div>
    </div>
  )
}
