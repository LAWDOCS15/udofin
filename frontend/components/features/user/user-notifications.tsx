"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle2, AlertCircle, Sparkles, Bell, Info } from "lucide-react"
import type { UserNotification } from "@/types"

const INITIAL_NOTIFICATIONS: UserNotification[] = [
  { id: "N1", title: "EMI Reminder", message: "₹20,400 EMI due on 1st March 2026 for Tata Capital loan", type: "warning", read: false, createdAt: "Today, 9:00 AM" },
  { id: "N2", title: "Loan Completed!", message: "Congratulations! Your HDFC personal loan has been fully repaid.", type: "success", read: false, createdAt: "Yesterday, 3:00 PM" },
  { id: "N3", title: "Document Verified", message: "Your PAN card has been verified successfully.", type: "info", read: true, createdAt: "25 Feb 2026" },
  { id: "N4", title: "EMI Payment Received", message: "₹16,500 EMI payment confirmed for Bajaj Finserv loan.", type: "success", read: true, createdAt: "24 Feb 2026" },
  { id: "N5", title: "New Offer!", message: "Pre-approved personal loan up to ₹10L at 10.5% from ICICI Bank.", type: "info", read: true, createdAt: "20 Feb 2026" },
  { id: "N6", title: "System Update", message: "Scheduled maintenance on 15th March between 2 AM - 4 AM.", type: "info", read: true, createdAt: "18 Feb 2026" },
]

const TYPE_CONFIG = {
  success: { icon: CheckCircle2, color: "bg-accent/15 text-accent" },
  warning: { icon: AlertCircle, color: "bg-amber-500/15 text-amber-500" },
  info: { icon: Sparkles, color: "bg-blue-500/15 text-blue-500" },
  error: { icon: AlertCircle, color: "bg-red-500/15 text-red-500" },
}

export function UserNotifications() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)
  const unread = notifications.filter((n) => !n.read).length

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const toggleRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5 text-accent" />
              <div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h1>
                <p className="text-xs text-muted-foreground mt-0.5">{unread} unread notifications</p>
              </div>
            </div>
            {unread > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-accent hover:text-accent/80 transition-colors">
                Mark all as read
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        <div className="max-w-2xl space-y-3">
          {notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type]
            const Icon = config.icon
            return (
              <div
                key={notif.id}
                onClick={() => !notif.read && toggleRead(notif.id)}
                className={cn(
                  "rounded-2xl border p-5 flex items-start gap-3 transition-all",
                  !notif.read ? "border-accent/20 bg-accent/5 cursor-pointer hover:bg-accent/10" : "border-border bg-card",
                )}
              >
                <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", config.color)}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-foreground">{notif.title}</p>
                    {!notif.read && <div className="h-2 w-2 rounded-full bg-accent" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-1.5">{notif.createdAt}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
