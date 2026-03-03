"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { IndianRupee, Send, Download, CheckCircle2, Clock, AlertCircle } from "lucide-react"
import type { NBFCDisbursement } from "@/types"

const DEMO: NBFCDisbursement[] = [
  { id: "DIS001", loanId: "LN001", customerName: "Amit Sharma", amount: 500000, status: "completed", method: "NEFT", accountNumber: "XXXX4567", disbursedAt: "2025-08-16", reference: "UTR9876543210" },
  { id: "DIS002", loanId: "LN002", customerName: "Neha Gupta", amount: 300000, status: "completed", method: "IMPS", accountNumber: "XXXX2345", disbursedAt: "2025-09-21", reference: "UTR1234567890" },
  { id: "DIS003", loanId: "LN003", customerName: "Ravi Patel", amount: 800000, status: "pending", method: "NEFT", accountNumber: "XXXX6789", disbursedAt: null, reference: null },
  { id: "DIS004", loanId: "LN004", customerName: "Kavita Singh", amount: 200000, status: "completed", method: "RTGS", accountNumber: "XXXX8901", disbursedAt: "2025-06-06", reference: "UTR5678901234" },
  { id: "DIS005", loanId: "LN005", customerName: "Deepak Verma", amount: 600000, status: "processing", method: "NEFT", accountNumber: "XXXX0123", disbursedAt: null, reference: null },
]

const FILTERS = ["All", "Completed", "Processing", "Pending"]

export function NbfcDisbursements() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const filtered = DEMO.filter((d) => {
    const match = d.customerName.toLowerCase().includes(search.toLowerCase()) || d.loanId.toLowerCase().includes(search.toLowerCase())
    if (filter === "Completed") return match && d.status === "completed"
    if (filter === "Processing") return match && d.status === "processing"
    if (filter === "Pending") return match && d.status === "pending"
    return match
  })

  const totalDisbursed = DEMO.filter((d) => d.status === "completed").reduce((s, d) => s + d.amount, 0)
  const totalPending = DEMO.filter((d) => d.status !== "completed").reduce((s, d) => s + d.amount, 0)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Disbursements</h1>
          <p className="text-xs text-muted-foreground mt-1">Track loan fund releases</p>
        </div>
        <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center"><IndianRupee className="h-5 w-5 text-accent" /></div>
          <div><p className="text-[10px] text-muted-foreground">Total Disbursed</p><p className="text-lg font-bold text-foreground">₹{(totalDisbursed / 100000).toFixed(0)}L</p></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-500/15 flex items-center justify-center"><Clock className="h-5 w-5 text-yellow-500" /></div>
          <div><p className="text-[10px] text-muted-foreground">Pending Amount</p><p className="text-lg font-bold text-foreground">₹{(totalPending / 100000).toFixed(0)}L</p></div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center"><Send className="h-5 w-5 text-blue-500" /></div>
          <div><p className="text-[10px] text-muted-foreground">Total Transactions</p><p className="text-lg font-bold text-foreground">{DEMO.length}</p></div>
        </div>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "Customer", "Loan", "Amount", "Method", "Account", "Status", "Date", "Reference"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3 text-xs font-mono text-accent">{d.id}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{d.customerName}</td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{d.loanId}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{d.amount.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3"><span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-medium text-foreground">{d.method}</span></td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{d.accountNumber}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold",
                      d.status === "completed" ? "bg-accent/10 text-accent" :
                      d.status === "processing" ? "bg-blue-500/10 text-blue-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-muted-foreground">{d.disbursedAt || "—"}</td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted-foreground">{d.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No disbursements found</div>}
      </div>
    </div>
  )
}
