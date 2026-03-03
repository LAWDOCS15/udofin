"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Save, Globe, Bell, Shield, Palette, Mail, Database, ToggleLeft, ToggleRight } from "lucide-react"

type SettingSection = "general" | "notifications" | "security" | "appearance"

export function AdminSettings() {
  const [section, setSection] = useState<SettingSection>("general")
  const [settings, setSettings] = useState({
    platformName: "UDOFIN", supportEmail: "support@udofin.in", maxLoanAmount: "5000000", minCibilScore: "650", autoApproveThreshold: "750",
    emailNotifications: true, smsNotifications: true, slackAlerts: false, dailyDigest: true,
    twoFactorRequired: true, sessionTimeout: "30", ipWhitelist: false, auditLogging: true,
    darkMode: false, compactMode: false,
  })

  const toggle = (key: keyof typeof settings) => setSettings((p) => ({ ...p, [key]: !p[key] }))
  const update = (key: keyof typeof settings, val: string) => setSettings((p) => ({ ...p, [key]: val }))

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
  const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"

  const sections: { id: SettingSection; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <Globe className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
    { id: "appearance", label: "Appearance", icon: <Palette className="h-4 w-4" /> },
  ]

  const ToggleSwitch = ({ enabled, onToggle, label, desc }: { enabled: boolean; onToggle: () => void; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <button onClick={onToggle} className="relative">
        {enabled
          ? <ToggleRight className="h-6 w-6 text-accent" />
          : <ToggleLeft className="h-6 w-6 text-muted-foreground" />
        }
      </button>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Platform Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure platform-wide settings</p>
        </div>
        <Button className="h-9 gap-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">
          <Save className="h-3.5 w-3.5" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Section Nav */}
        <div className="rounded-2xl border border-border bg-card p-3 h-fit space-y-1">
          {sections.map((s) => (
            <button key={s.id} onClick={() => setSection(s.id)} className={cn(
              "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              section === s.id ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            )}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          {section === "general" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>General Settings</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className={labelClass}>Platform Name</label><input value={settings.platformName} onChange={(e) => update("platformName", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Support Email</label><input value={settings.supportEmail} onChange={(e) => update("supportEmail", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Max Loan Amount (₹)</label><input type="number" value={settings.maxLoanAmount} onChange={(e) => update("maxLoanAmount", e.target.value)} className={inputClass} /></div>
                <div><label className={labelClass}>Min CIBIL Score</label><input type="number" value={settings.minCibilScore} onChange={(e) => update("minCibilScore", e.target.value)} className={inputClass} /></div>
                <div className="sm:col-span-2"><label className={labelClass}>Auto-Approve CIBIL Threshold</label><input type="number" value={settings.autoApproveThreshold} onChange={(e) => update("autoApproveThreshold", e.target.value)} className={inputClass} /></div>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Notification Preferences</h2>
              <ToggleSwitch enabled={settings.emailNotifications as boolean} onToggle={() => toggle("emailNotifications")} label="Email Notifications" desc="Receive application updates via email" />
              <ToggleSwitch enabled={settings.smsNotifications as boolean} onToggle={() => toggle("smsNotifications")} label="SMS Notifications" desc="Send SMS alerts for important events" />
              <ToggleSwitch enabled={settings.slackAlerts as boolean} onToggle={() => toggle("slackAlerts")} label="Slack Alerts" desc="Push notifications to Slack channel" />
              <ToggleSwitch enabled={settings.dailyDigest as boolean} onToggle={() => toggle("dailyDigest")} label="Daily Digest" desc="Send daily summary report to admin team" />
            </div>
          )}

          {section === "security" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Security Settings</h2>
              <ToggleSwitch enabled={settings.twoFactorRequired as boolean} onToggle={() => toggle("twoFactorRequired")} label="2FA Required" desc="Require two-factor authentication for all admins" />
              <div className="py-3 border-b border-border">
                <label className={labelClass}>Session Timeout (minutes)</label>
                <input type="number" value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)} className={cn(inputClass, "max-w-xs")} />
              </div>
              <ToggleSwitch enabled={settings.ipWhitelist as boolean} onToggle={() => toggle("ipWhitelist")} label="IP Whitelist" desc="Restrict admin access to whitelisted IPs only" />
              <ToggleSwitch enabled={settings.auditLogging as boolean} onToggle={() => toggle("auditLogging")} label="Audit Logging" desc="Log all admin actions for security trail" />
            </div>
          )}

          {section === "appearance" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Appearance</h2>
              <ToggleSwitch enabled={settings.darkMode as boolean} onToggle={() => toggle("darkMode")} label="Dark Mode" desc="Enable dark theme for admin panel" />
              <ToggleSwitch enabled={settings.compactMode as boolean} onToggle={() => toggle("compactMode")} label="Compact Mode" desc="Reduce spacing for denser information display" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
