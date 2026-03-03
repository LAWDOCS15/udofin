"use client"

import { useState } from "react"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { Eye, Phone, Mail, IndianRupee } from "lucide-react"
import type { NBFCCustomer } from "@/types"

const DEMO: NBFCCustomer[] = [
  { id: "C001", name: "Amit Sharma", email: "amit@email.com", phone: "+91 98765 12345", loanId: "LN001", loanAmount: 500000, outstandingAmount: 350000, emiAmount: 16500, nextEmiDate: "Mar 5, 2026", status: "active", cibilScore: 745, joinedAt: "2025-08-15" },
  { id: "C002", name: "Neha Gupta", email: "neha@email.com", phone: "+91 87654 23456", loanId: "LN002", loanAmount: 300000, outstandingAmount: 220000, emiAmount: 9800, nextEmiDate: "Mar 5, 2026", status: "active", cibilScore: 780, joinedAt: "2025-09-20" },
  { id: "C003", name: "Ravi Patel", email: "ravi@email.com", phone: "+91 76543 34567", loanId: "LN003", loanAmount: 800000, outstandingAmount: 800000, emiAmount: 24200, nextEmiDate: "Mar 1, 2026", status: "overdue", cibilScore: 710, joinedAt: "2026-01-10" },
  { id: "C004", name: "Kavita Singh", email: "kavita@email.com", phone: "+91 65432 45678", loanId: "LN004", loanAmount: 200000, outstandingAmount: 0, emiAmount: 0, nextEmiDate: "—", status: "closed", cibilScore: 790, joinedAt: "2025-06-05" },
  { id: "C005", name: "Deepak Verma", email: "deepak@email.com", phone: "+91 54321 56789", loanId: "LN005", loanAmount: 600000, outstandingAmount: 480000, emiAmount: 18500, nextEmiDate: "Mar 10, 2026", status: "active", cibilScore: 735, joinedAt: "2025-11-01" },
]

const FILTERS = ["All", "Active", "Overdue", "Closed"]

export function NbfcCustomers() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selected, setSelected] = useState<NBFCCustomer | null>(null)

  const filtered = DEMO.filter((c) => {
    const match = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
    if (filter === "Active") return match && c.status === "active"
    if (filter === "Overdue") return match && c.status === "overdue"
    if (filter === "Closed") return match && c.status === "closed"
    return match
  })

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Customers</h1>
        <p className="text-xs text-muted-foreground mt-1">{DEMO.filter((c) => c.status === "active").length} active borrowers</p>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Customer list */}
        <div className="lg:col-span-3 space-y-3">
          {filtered.map((c) => (
            <div key={c.id} onClick={() => setSelected(c)} className={cn(
              "rounded-2xl border bg-card p-4 cursor-pointer transition-all hover:border-accent/20",
              selected?.id === c.id ? "border-accent/30 bg-accent/5" : "border-border"
            )}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{c.name}</p>
                    <p className="text-[10px] text-muted-foreground">{c.loanId} • Joined {c.joinedAt}</p>
                  </div>
                </div>
                <LoanStatusBadge status={c.status} />
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">Loan</p><p className="text-xs font-bold text-foreground">₹{(c.loanAmount / 100000).toFixed(1)}L</p></div>
                <div className="text-center p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">Outstanding</p><p className="text-xs font-bold text-foreground">₹{(c.outstandingAmount / 100000).toFixed(1)}L</p></div>
                <div className="text-center p-2 rounded-lg bg-secondary/30"><p className="text-[10px] text-muted-foreground">EMI</p><p className="text-xs font-bold text-foreground">₹{c.emiAmount.toLocaleString("en-IN")}</p></div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground rounded-2xl border border-border bg-card">No customers found</div>}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm h-fit sticky top-24">
          {selected ? (
            <div className="animate-in fade-in duration-200 space-y-4">
              <div className="text-center pb-4 border-b border-border">
                <div className="mx-auto mb-2 h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-sm font-bold text-accent">
                  {selected.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <p className="text-sm font-bold text-foreground">{selected.name}</p>
                <p className="text-[10px] text-muted-foreground">{selected.email}</p>
              </div>
              <div className="space-y-2">
                {[
                  ["Loan ID", selected.loanId],
                  ["Loan Amount", `₹${(selected.loanAmount / 100000).toFixed(1)}L`],
                  ["Outstanding", `₹${(selected.outstandingAmount / 100000).toFixed(1)}L`],
                  ["EMI Amount", `₹${selected.emiAmount.toLocaleString("en-IN")}`],
                  ["Next EMI", selected.nextEmiDate],
                  ["CIBIL Score", selected.cibilScore.toString()],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-xs py-1 border-b border-border last:border-0">
                    <span className="text-muted-foreground">{k}</span><span className="font-medium text-foreground">{v}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 pt-2">
                <button className="flex-1 h-8 rounded-xl bg-secondary flex items-center justify-center gap-1.5 text-xs text-foreground hover:bg-secondary/80"><Phone className="h-3 w-3" /> Call</button>
                <button className="flex-1 h-8 rounded-xl bg-secondary flex items-center justify-center gap-1.5 text-xs text-foreground hover:bg-secondary/80"><Mail className="h-3 w-3" /> Email</button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">
              <IndianRupee className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Select a customer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
