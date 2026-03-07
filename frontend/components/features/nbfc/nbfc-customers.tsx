"use client"

import { useState, useEffect, useCallback } from "react"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { Phone, Mail, IndianRupee, Loader2 } from "lucide-react"
import type { NBFCCustomer } from "@/types"
import { nbfcAPI } from "@/config/api" 
import { useToast } from "@/hooks/use-toast"

const FILTERS = ["All", "Active", "Overdue", "Closed"]

export function NbfcCustomers() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [customers, setCustomers] = useState<NBFCCustomer[]>([])
  const [selected, setSelected] = useState<NBFCCustomer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchCustomers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await nbfcAPI.getCustomers() 
      setCustomers(response.data.customers || [])
    } catch (err: any) {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || 'Failed to fetch customers', 
        variant: "destructive" 
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => { 
    fetchCustomers() 
  }, [fetchCustomers])

  const filtered = customers.filter((c) => {
    const searchStr = search.toLowerCase()
    const match = (c.name?.toLowerCase() || "").includes(searchStr) || 
                  (c.email?.toLowerCase() || "").includes(searchStr) ||
                  (c.phone || "").includes(searchStr)

    if (filter === "Active") return match && c.status === "active"
    if (filter === "Overdue") return match && c.status === "overdue"
    if (filter === "Closed") return match && c.status === "closed"
    return match
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Customers</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {customers.filter((c) => c.status === "active").length} active borrowers
          </p>
        </div>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      {isLoading ? (
        <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3 space-y-3">
            {filtered.map((c) => (
              <div 
                key={c.id || (c as any)._id} 
                onClick={() => setSelected(c)} 
                className={cn(
                  "rounded-2xl border bg-card p-4 cursor-pointer transition-all hover:border-accent/20",
                  selected?.id === c.id ? "border-accent/30 bg-accent/5 shadow-sm" : "border-border"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                      {c.name ? c.name.split(" ").map((n) => n[0]).join("") : "?"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{c.name || "Unknown Name"}</p>
                      <p className="text-[10px] text-muted-foreground">{c.loanId || "No ID"} • Joined {c.joinedAt ? new Date(c.joinedAt).toLocaleDateString() : "N/A"}</p>
                    </div>
                  </div>
                  <LoanStatusBadge status={c.status || "pending"} />
                </div>
                
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Loan</p>
                    <p className="text-xs font-bold text-foreground">₹{((c.loanAmount || 0) / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">Outstanding</p>
                    <p className="text-xs font-bold text-foreground">₹{((c.outstandingAmount || 0) / 100000).toFixed(1)}L</p>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-secondary/30">
                    <p className="text-[10px] text-muted-foreground">EMI</p>
                    <p className="text-xs font-bold text-foreground">₹{(c.emiAmount || 0).toLocaleString("en-IN")}</p>
                  </div>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="py-12 text-center text-sm text-muted-foreground rounded-2xl border border-dashed border-border bg-card">
                No customers found
              </div>
            )}
          </div>

          {/* Detail Panel */}
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm h-fit sticky top-24">
            {selected ? (
              <div className="animate-in fade-in duration-200 space-y-4">
                <div className="text-center pb-4 border-b border-border">
                  <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                    {selected.name ? selected.name.split(" ").map((n) => n[0]).join("") : "?"}
                  </div>
                  <p className="text-sm font-bold text-foreground">{selected.name}</p>
                  <p className="text-[10px] text-muted-foreground">{selected.email || "No email"} • {selected.phone || "No phone"}</p>
                </div>

                <div className="space-y-2">
                  {[
                    ["Loan ID", selected.loanId || "N/A"],
                    ["Loan Amount", `₹${((selected.loanAmount || 0) / 100000).toFixed(1)}L`],
                    ["Outstanding", `₹${((selected.outstandingAmount || 0) / 100000).toFixed(1)}L`],
                    ["EMI Amount", `₹${(selected.emiAmount || 0).toLocaleString("en-IN")}`],
                    ["Next EMI Date", selected.nextEmiDate || "N/A"],
                    ["CIBIL Score", selected.cibilScore?.toString() || "N/A"],
                    ["KYC Status", (selected.kycStatus || "pending").toUpperCase()],
                    ["Risk Level", (selected.riskLevel || "low").toUpperCase()],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-xs py-1.5 border-b border-border/50 last:border-0">
                      <span className="text-muted-foreground">{k}</span>
                      <span className="font-medium text-foreground">{v}</span>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button title="Call Customer" className="flex-1 h-9 rounded-xl bg-secondary flex items-center justify-center gap-1.5 text-xs text-foreground hover:bg-secondary/80 transition-colors">
                    <Phone className="h-3.5 w-3.5" /> Call
                  </button>
                  <button title="Email Customer" className="flex-1 h-9 rounded-xl bg-secondary flex items-center justify-center gap-1.5 text-xs text-foreground hover:bg-secondary/80 transition-colors">
                    <Mail className="h-3.5 w-3.5" /> Email
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center">
                <IndianRupee className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-medium">Select a customer to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}