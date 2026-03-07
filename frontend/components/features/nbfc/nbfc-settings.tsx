


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Save, Building2, IndianRupee, Shield, Bell, ToggleLeft, ToggleRight } from "lucide-react"

type Section = "company" | "loan" | "notifications" | "security"

export function NbfcSettings() {
  const [section, setSection] = useState<Section>("company")
  const [settings, setSettings] = useState({
    companyName: "QuickLend Finance", registrationNumber: "N-14.03456", address: "Mumbai, Maharashtra", contactEmail: "admin@quicklend.in", contactPhone: "+91 22 4567 8901",
    minLoanAmount: "50000", maxLoanAmount: "5000000", minTenure: "6", maxTenure: "120", defaultInterestRate: "10.5", processingFee: "2", minCibilScore: "650",
    emailAlerts: true, smsAlerts: true, emiReminders: true, overdueAlerts: true,
    twoFactorAuth: true, sessionTimeout: "30", auditLog: true,
  })

  const toggle = (key: keyof typeof settings) => setSettings((p) => ({ ...p, [key]: !p[key] }))
  const update = (key: keyof typeof settings, val: string) => setSettings((p) => ({ ...p, [key]: val }))

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
  const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: "company", label: "Company", icon: <Building2 className="h-4 w-4" /> },
    { id: "loan", label: "Loan Config", icon: <IndianRupee className="h-4 w-4" /> },
    { id: "notifications", label: "Notifications", icon: <Bell className="h-4 w-4" /> },
    { id: "security", label: "Security", icon: <Shield className="h-4 w-4" /> },
  ]

  const ToggleSwitch = ({ enabled, onToggle, label, desc }: { enabled: boolean; onToggle: () => void; label: string; desc: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-border last:border-0">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <button 
        type="button"
        onClick={onToggle} 
        title={`Toggle ${label}`}
        aria-label={`Toggle ${label}`}
      >
        {enabled ? <ToggleRight className="h-6 w-6 text-accent" /> : <ToggleLeft className="h-6 w-6 text-muted-foreground" />}
      </button>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>NBFC Settings</h1>
          <p className="text-xs text-muted-foreground mt-1">Configure your NBFC operations</p>
        </div>
        <Button className="h-9 gap-2 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">
          <Save className="h-3.5 w-3.5" /> Save Changes
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="rounded-2xl border border-border bg-card p-3 h-fit space-y-1">
          {sections.map((s) => (
            <button 
              key={s.id} 
              onClick={() => setSection(s.id)} 
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                section === s.id ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              {s.icon} {s.label}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          {section === "company" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Company Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="compName" className={labelClass}>Company Name</label><input id="compName" placeholder="Enter company name" value={settings.companyName} onChange={(e) => update("companyName", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="regNum" className={labelClass}>Registration Number</label><input id="regNum" placeholder="N-XX.XXXXX" value={settings.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} className={inputClass} /></div>
                <div className="sm:col-span-2"><label htmlFor="address" className={labelClass}>Address</label><input id="address" placeholder="Full business address" value={settings.address} onChange={(e) => update("address", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="email" className={labelClass}>Contact Email</label><input id="email" type="email" placeholder="admin@example.com" value={settings.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="phone" className={labelClass}>Contact Phone</label><input id="phone" placeholder="+91 XXXX XXX XXX" value={settings.contactPhone} onChange={(e) => update("contactPhone", e.target.value)} className={inputClass} /></div>
              </div>
            </div>
          )}

          {section === "loan" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Configuration</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label htmlFor="minAmt" className={labelClass}>Min Loan Amount (₹)</label><input id="minAmt" type="number" placeholder="50000" value={settings.minLoanAmount} onChange={(e) => update("minLoanAmount", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="maxAmt" className={labelClass}>Max Loan Amount (₹)</label><input id="maxAmt" type="number" placeholder="5000000" value={settings.maxLoanAmount} onChange={(e) => update("maxLoanAmount", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="minTen" className={labelClass}>Min Tenure (months)</label><input id="minTen" type="number" placeholder="6" value={settings.minTenure} onChange={(e) => update("minTenure", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="maxTen" className={labelClass}>Max Tenure (months)</label><input id="maxTen" type="number" placeholder="120" value={settings.maxTenure} onChange={(e) => update("maxTenure", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="intRate" className={labelClass}>Default Interest Rate (%)</label><input id="intRate" type="number" placeholder="10.5" value={settings.defaultInterestRate} onChange={(e) => update("defaultInterestRate", e.target.value)} className={inputClass} /></div>
                <div><label htmlFor="fee" className={labelClass}>Processing Fee (%)</label><input id="fee" type="number" placeholder="2" value={settings.processingFee} onChange={(e) => update("processingFee", e.target.value)} className={inputClass} /></div>
                <div className="sm:col-span-2"><label htmlFor="cibil" className={labelClass}>Min CIBIL Score Required</label><input id="cibil" type="number" placeholder="650" value={settings.minCibilScore} onChange={(e) => update("minCibilScore", e.target.value)} className={inputClass} /></div>
              </div>
            </div>
          )}

          {section === "notifications" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h2>
              <ToggleSwitch enabled={settings.emailAlerts as boolean} onToggle={() => toggle("emailAlerts")} label="Email Alerts" desc="Receive email notifications for new applications" />
              <ToggleSwitch enabled={settings.smsAlerts as boolean} onToggle={() => toggle("smsAlerts")} label="SMS Alerts" desc="Send SMS for critical events" />
              <ToggleSwitch enabled={settings.emiReminders as boolean} onToggle={() => toggle("emiReminders")} label="EMI Reminders" desc="Auto-send EMI reminders to customers 3 days before due date" />
              <ToggleSwitch enabled={settings.overdueAlerts as boolean} onToggle={() => toggle("overdueAlerts")} label="Overdue Alerts" desc="Alert when EMI payment is overdue" />
            </div>
          )}

          {section === "security" && (
            <div className="space-y-2 animate-in fade-in duration-200">
              <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Security</h2>
              <ToggleSwitch enabled={settings.twoFactorAuth as boolean} onToggle={() => toggle("twoFactorAuth")} label="Two-Factor Authentication" desc="Require 2FA for all staff accounts" />
              <div className="py-3 border-b border-border">
                <label htmlFor="timeout" className={labelClass}>Session Timeout (minutes)</label>
                <input id="timeout" type="number" placeholder="30" value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)} className={cn(inputClass, "max-w-xs")} />
              </div>
              <ToggleSwitch enabled={settings.auditLog as boolean} onToggle={() => toggle("auditLog")} label="Audit Logging" desc="Log all staff actions" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}