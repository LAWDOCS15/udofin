"use client"

import { useState } from "react"
import { useOnboarding } from "@/lib/onboarding-context"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { User, Mail, Phone, MapPin, Lock, Shield, Save, Check } from "lucide-react"

export function UserProfile() {
  const { userProfile } = useOnboarding()
  const [activeTab, setActiveTab] = useState<"personal" | "security">("personal")
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle")
  const [twoFA, setTwoFA] = useState(false)

  const handleSave = () => {
    setSaveState("saving")
    setTimeout(() => {
      setSaveState("saved")
      setTimeout(() => setSaveState("idle"), 2000)
    }, 800)
  }

  const [formData, setFormData] = useState({
    fullName: userProfile.fullName || "Priya Sharma",
    email: "priya@example.com",
    phone: "+91 98765 43210",
    dob: userProfile.dateOfBirth || "1995-06-15",
    address: userProfile.address || "123 HSR Layout, Bangalore, Karnataka 560102",
  })

  const update = (field: string, value: string) => setFormData((prev) => ({ ...prev, [field]: value }))

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Profile</h1>
          <p className="text-xs text-muted-foreground mt-1">Manage your personal and account information</p>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        {/* Tabs */}
        <div className="flex gap-1 rounded-xl border border-border bg-card overflow-hidden text-xs w-fit mb-8">
          {(["personal", "security"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-5 py-2.5 capitalize transition-all font-medium",
                activeTab === tab ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm max-w-2xl">
          {activeTab === "personal" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Personal Information</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Full Name</label>
                  <input type="text" value={formData.fullName} onChange={(e) => update("fullName", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Date of Birth</label>
                  <input type="date" value={formData.dob} onChange={(e) => update("dob", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Email</label>
                  <input type="email" value={formData.email} onChange={(e) => update("email", e.target.value)} className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Phone</label>
                  <input type="tel" value={formData.phone} onChange={(e) => update("phone", e.target.value)} className={inputClass} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Address</label>
                <input type="text" value={formData.address} onChange={(e) => update("address", e.target.value)} className={inputClass} />
              </div>
              <Button onClick={handleSave} disabled={saveState === "saving"} className="h-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold gap-2 transition-all">
                {saveState === "saving" ? <><div className="h-3.5 w-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> Saving...</> : saveState === "saved" ? <><Check className="h-3.5 w-3.5" /> Saved!</> : <><Save className="h-3.5 w-3.5" /> Save Changes</>}
              </Button>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-5">
              <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Security Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Current Password</label>
                  <input type="password" placeholder="Enter current password" className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">New Password</label>
                  <input type="password" placeholder="Enter new password" className={inputClass} />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-muted-foreground mb-1.5 block">Confirm New Password</label>
                  <input type="password" placeholder="Confirm new password" className={inputClass} />
                </div>
                <Button onClick={handleSave} disabled={saveState === "saving"} className="h-10 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold gap-2">
                  {saveState === "saving" ? <><div className="h-3.5 w-3.5 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" /> Updating...</> : saveState === "saved" ? <><Check className="h-3.5 w-3.5" /> Updated!</> : <><Lock className="h-3.5 w-3.5" /> Update Password</>}
                </Button>
              </div>
              <div className="h-px bg-border" />
              <div className="flex items-center justify-between rounded-xl border border-border bg-secondary/30 p-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-accent" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Two-Factor Authentication</p>
                    <p className="text-[10px] text-muted-foreground">Add extra security to your account</p>
                  </div>
                </div>
                <button onClick={() => setTwoFA(!twoFA)} className={cn("h-6 w-11 rounded-full relative transition-colors", twoFA ? "bg-accent" : "bg-secondary")}>
                  <div className={cn("absolute top-0.5 h-5 w-5 rounded-full transition-all", twoFA ? "left-[22px] bg-accent-foreground" : "left-0.5 bg-muted-foreground/40")} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
