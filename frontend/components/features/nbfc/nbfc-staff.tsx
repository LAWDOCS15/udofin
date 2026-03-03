"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { cn } from "@/lib/utils"
import { Plus, UserPlus, Mail, Phone, Shield, Trash2, X } from "lucide-react"
import type { NBFCStaffMember } from "@/types"

const DEMO: NBFCStaffMember[] = [
  { id: "S001", name: "Rahul Mehra", email: "rahul@quicklend.in", phone: "+91 98765 00001", role: "relationship-manager", status: "active", assignedCustomers: 45, joinedAt: "2025-06-20" },
  { id: "S002", name: "Pooja Kapoor", email: "pooja@quicklend.in", phone: "+91 98765 00002", role: "underwriter", status: "active", assignedCustomers: 0, joinedAt: "2025-07-15" },
  { id: "S003", name: "Vikram Das", email: "vikram@quicklend.in", phone: "+91 98765 00003", role: "collection-agent", status: "active", assignedCustomers: 32, joinedAt: "2025-08-10" },
  { id: "S004", name: "Anita Rao", email: "anita@quicklend.in", phone: "+91 98765 00004", role: "relationship-manager", status: "inactive", assignedCustomers: 0, joinedAt: "2025-05-01" },
]

const FILTERS = ["All", "Active", "Inactive"]
const ROLES = ["relationship-manager", "underwriter", "collection-agent", "operations"]

export function NbfcStaff() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [showAdd, setShowAdd] = useState(false)
  const [deleteStaff, setDeleteStaff] = useState<NBFCStaffMember | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "" })

  const filtered = DEMO.filter((s) => {
    const match = s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase())
    if (filter === "Active") return match && s.status === "active"
    if (filter === "Inactive") return match && s.status === "inactive"
    return match
  })

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
  const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Staff Management</h1>
          <p className="text-xs text-muted-foreground mt-1">{DEMO.filter((s) => s.status === "active").length} active staff members</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="h-9 gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold shadow-lg shadow-accent/20">
          <UserPlus className="h-3.5 w-3.5" /> Add Staff
        </Button>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((s) => (
          <div key={s.id} className="rounded-2xl border border-border bg-card p-5 hover:border-accent/20 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                  {s.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{s.name}</p>
                  <p className="text-[10px] text-muted-foreground">{s.email}</p>
                </div>
              </div>
              <LoanStatusBadge status={s.status} />
            </div>
            <div className="grid grid-cols-3 gap-2 mb-3">
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Role</p>
                <p className="text-[10px] font-semibold text-foreground capitalize">{s.role.replace("-", " ")}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Customers</p>
                <p className="text-xs font-bold text-foreground">{s.assignedCustomers}</p>
              </div>
              <div className="text-center p-2 rounded-lg bg-secondary/30">
                <p className="text-[10px] text-muted-foreground">Since</p>
                <p className="text-[10px] font-medium text-foreground">{s.joinedAt}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 border-t border-border pt-3">
              <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Phone className="h-3.5 w-3.5" /></button>
              <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Mail className="h-3.5 w-3.5" /></button>
              <button className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Shield className="h-3.5 w-3.5" /></button>
              <div className="flex-1" />
              <button onClick={() => setDeleteStaff(s)} className="h-7 w-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Add Staff Member</h3>
              <button onClick={() => setShowAdd(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <div><label className={labelClass}>Full Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" className={inputClass} /></div>
              <div><label className={labelClass}>Email *</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@company.in" className={inputClass} /></div>
              <div><label className={labelClass}>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" className={inputClass} /></div>
              <div>
                <label className={labelClass}>Role *</label>
                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={cn(inputClass, "appearance-none cursor-pointer")}>
                  <option value="">Select role</option>
                  {ROLES.map((r) => <option key={r} value={r}>{r.replace("-", " ")}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAdd(false)} className="h-9 px-4 rounded-xl text-xs text-muted-foreground hover:bg-secondary">Cancel</button>
                <Button className="h-9 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold gap-2"><Plus className="h-3 w-3" /> Add Member</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteStaff && (
        <ConfirmationModal open onClose={() => setDeleteStaff(null)} onConfirm={() => setDeleteStaff(null)}
          title="Remove Staff Member" description={`Remove ${deleteStaff.name}? Their assigned customers will need to be reassigned.`}
          confirmText="Remove" danger
        />
      )}
    </div>
  )
}
