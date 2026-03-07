


"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { cn } from "@/lib/utils"
import { Plus, UserPlus, Mail, Phone, Shield, Trash2, X, Loader2 } from "lucide-react"
import { toast } from "sonner"

const FILTERS = ["All", "Active", "Inactive"]
const ROLES = ["relationship-manager", "underwriter", "collection-agent", "operations"]

export function NbfcStaff() {
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [showAdd, setShowAdd] = useState(false)
  const [deleteStaff, setDeleteStaff] = useState<any | null>(null)
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "" })

  const fetchStaff = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/nbfc/staff", { withCredentials: true })
      if (res.data.success) {
        setStaff(res.data.staff)
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to load staff")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleAddStaff = async () => {
    if (!form.name || !form.email || !form.role) {
      toast.error("Please fill all required fields")
      return
    }
    try {
      const res = await axios.post("http://localhost:5000/api/nbfc/staff", form, { withCredentials: true })
      if (res.data.success) {
        setStaff([res.data.staff, ...staff])
        setShowAdd(false)
        setForm({ name: "", email: "", phone: "", role: "" })
        toast.success("Staff member added successfully")
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Error adding staff")
    }
  }

  const handleDeleteConfirm = async () => {
    if (!deleteStaff) return
    try {
      const res = await axios.delete(`http://localhost:5000/api/nbfc/staff/${deleteStaff._id}`, { withCredentials: true })
      if (res.data.success) {
        setStaff(staff.filter((s) => s._id !== deleteStaff._id))
        setDeleteStaff(null)
        toast.success("Staff removed successfully")
      }
    } catch (err: any) {
      toast.error("Could not remove staff")
    }
  }

  const filtered = staff.filter((s) => {
    const match = s.name.toLowerCase().includes(search.toLowerCase()) || 
                  s.email.toLowerCase().includes(search.toLowerCase())
    if (filter === "Active") return match && s.status === "active"
    if (filter === "Inactive") return match && s.status === "inactive"
    return match
  })

  const inputClass = "h-10 w-full rounded-xl border border-border bg-secondary/30 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/30 transition-colors"
  const labelClass = "text-[11px] font-semibold text-muted-foreground mb-1.5 block"

  if (loading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Staff Management</h1>
          <p className="text-xs text-muted-foreground mt-1">{staff.filter(s => s.status === 'active').length} active members</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="h-9 gap-2 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold">
          <UserPlus className="h-3.5 w-3.5" /> Add Staff
        </Button>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      {filtered.length === 0 ? (
        <div className="p-12 text-center border-2 border-dashed rounded-3xl text-muted-foreground">
          No staff members found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((s) => (
            <div key={s._id} className="rounded-2xl border border-border bg-card p-5 hover:border-accent/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {s.name.split(" ").map((n: any) => n[0]).join("")}
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
                  <p className="text-xs font-bold text-foreground">{s.assignedCustomers || 0}</p>
                </div>
                <div className="text-center p-2 rounded-lg bg-secondary/30">
                  <p className="text-[10px] text-muted-foreground">Since</p>
                  <p className="text-[10px] font-medium text-foreground">{new Date(s.joinedAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 border-t border-border pt-3">
                <button title="Call Staff" aria-label="Call Staff" className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Phone className="h-3.5 w-3.5" /></button>
                <button title="Email Staff" aria-label="Email Staff" className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground"><Mail className="h-3.5 w-3.5" /></button>
                <div className="flex-1" />
                <button title="Delete Staff" aria-label="Delete Staff" onClick={() => setDeleteStaff(s)} className="h-7 w-7 rounded-lg hover:bg-destructive/10 flex items-center justify-center text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowAdd(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-border bg-card shadow-2xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-5">Add Staff Member</h3>
              <div className="space-y-4">
                <div>
                  <label htmlFor="staffName" className={labelClass}>Full Name *</label>
                  <input id="staffName" placeholder="Enter full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="staffEmail" className={labelClass}>Email *</label>
                  <input id="staffEmail" type="email" placeholder="email@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="staffPhone" className={labelClass}>Phone</label>
                  <input id="staffPhone" placeholder="+91 XXXX XXX XXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label htmlFor="staffRole" className={labelClass}>Role *</label>
                  <select id="staffRole" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className={inputClass}>
                    <option value="">Select role</option>
                    {ROLES.map((r) => <option key={r} value={r}>{r.replace("-", " ")}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-muted-foreground">Cancel</button>
                  <Button onClick={handleAddStaff} className="h-9 rounded-xl bg-accent text-accent-foreground">Add Member</Button>
                </div>
              </div>
          </div>
        </div>
      )}

      {deleteStaff && (
        <ConfirmationModal 
          open 
          onClose={() => setDeleteStaff(null)} 
          onConfirm={handleDeleteConfirm}
          title="Remove Staff" 
          description={`Remove ${deleteStaff.name} from the system?`}
          confirmText="Remove" 
          danger
        />
      )}
    </div>
  )
}