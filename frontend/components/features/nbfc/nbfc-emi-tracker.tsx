"use client"

import { useState } from "react"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { cn } from "@/lib/utils"
import { Calendar, AlertTriangle, CheckCircle2, Clock, IndianRupee, TrendingUp } from "lucide-react"
import type { NBFCEMIRecord } from "@/types"

const DEMO: NBFCEMIRecord[] = [
  { id: "EMI001", customerId: "C001", customerName: "Amit Sharma", loanId: "LN001", emiNumber: 8, totalEmis: 24, amount: 16500, dueDate: "2026-03-05", status: "upcoming", paidDate: null },
  { id: "EMI002", customerId: "C002", customerName: "Neha Gupta", loanId: "LN002", emiNumber: 6, totalEmis: 36, amount: 9800, dueDate: "2026-03-05", status: "upcoming", paidDate: null },
  { id: "EMI003", customerId: "C003", customerName: "Ravi Patel", loanId: "LN003", emiNumber: 2, totalEmis: 36, amount: 24200, dueDate: "2026-03-01", status: "overdue", paidDate: null },
  { id: "EMI004", customerId: "C005", customerName: "Deepak Verma", loanId: "LN005", emiNumber: 4, totalEmis: 24, amount: 18500, dueDate: "2026-03-10", status: "upcoming", paidDate: null },
  { id: "EMI005", customerId: "C001", customerName: "Amit Sharma", loanId: "LN001", emiNumber: 7, totalEmis: 24, amount: 16500, dueDate: "2026-02-05", status: "paid", paidDate: "2026-02-04" },
  { id: "EMI006", customerId: "C002", customerName: "Neha Gupta", loanId: "LN002", emiNumber: 5, totalEmis: 36, amount: 9800, dueDate: "2026-02-05", status: "paid", paidDate: "2026-02-05" },
  { id: "EMI007", customerId: "C003", customerName: "Ravi Patel", loanId: "LN003", emiNumber: 1, totalEmis: 36, amount: 24200, dueDate: "2026-02-01", status: "overdue", paidDate: null },
  { id: "EMI008", customerId: "C005", customerName: "Deepak Verma", loanId: "LN005", emiNumber: 3, totalEmis: 24, amount: 18500, dueDate: "2026-02-10", status: "paid", paidDate: "2026-02-09" },
]

const FILTERS = ["All", "Upcoming", "Overdue", "Paid"]

export function NbfcEmiTracker() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const filtered = DEMO.filter((e) => {
    const match = e.customerName.toLowerCase().includes(search.toLowerCase()) || e.loanId.toLowerCase().includes(search.toLowerCase())
    if (filter === "Upcoming") return match && e.status === "upcoming"
    if (filter === "Overdue") return match && e.status === "overdue"
    if (filter === "Paid") return match && e.status === "paid"
    return match
  })

  const totalUpcoming = DEMO.filter((e) => e.status === "upcoming").reduce((s, e) => s + e.amount, 0)
  const totalOverdue = DEMO.filter((e) => e.status === "overdue").reduce((s, e) => s + e.amount, 0)
  const totalCollected = DEMO.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>EMI Tracker</h1>
        <p className="text-xs text-muted-foreground mt-1">Track and manage EMI collections</p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center"><Clock className="h-5 w-5 text-accent" /></div>
          <div><p className="text-[10px] text-muted-foreground">Upcoming</p><p className="text-lg font-bold text-foreground">₹{totalUpcoming.toLocaleString("en-IN")}</p></div>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
          <div><p className="text-[10px] text-muted-foreground">Overdue</p><p className="text-lg font-bold text-foreground">₹{totalOverdue.toLocaleString("en-IN")}</p></div>
        </div>
        <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-[10px] text-muted-foreground">Collected (This Month)</p><p className="text-lg font-bold text-foreground">₹{totalCollected.toLocaleString("en-IN")}</p></div>
        </div>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["Customer", "Loan ID", "EMI #", "Amount", "Due Date", "Status", "Paid On"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((emi) => (
                <tr key={emi.id} className={cn(
                  "border-b border-border last:border-0 transition-colors",
                  emi.status === "overdue" ? "bg-red-500/5 hover:bg-red-500/10" : "hover:bg-secondary/20"
                )}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-accent/10 flex items-center justify-center text-[10px] font-bold text-accent">
                        {emi.customerName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-xs font-semibold text-foreground">{emi.customerName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{emi.loanId}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{emi.emiNumber}/{emi.totalEmis}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{emi.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{emi.dueDate}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold",
                      emi.status === "paid" ? "bg-accent/10 text-accent" :
                      emi.status === "overdue" ? "bg-red-500/10 text-red-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>{emi.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-muted-foreground">{emi.paidDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No EMI records found</div>}
      </div>
    </div>
  )
}
