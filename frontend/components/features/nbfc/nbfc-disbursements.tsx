

"use client"

import { useState, useEffect } from "react" 
import axios from "axios" 
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { cn } from "@/lib/utils"
import { IndianRupee, Send, Download, Clock, Loader2 } from "lucide-react"

export function NbfcDisbursements() {
  const [disbursements, setDisbursements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  useEffect(() => {
    const fetchDisbursements = async () => {
      try {
        setLoading(true)
        const response = await axios.get("http://localhost:5000/api/nbfc/disbursements", {
          withCredentials: true,
        })
        if (response.data.success) {
          setDisbursements(response.data.data)
        }
      } catch (error) {
        console.error("Error fetching real data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDisbursements()
  }, [])

  const filtered = disbursements.filter((d) => {
    const match = 
      d.customerName.toLowerCase().includes(search.toLowerCase()) || 
      d.loanId.toLowerCase().includes(search.toLowerCase())
    
    if (filter === "Completed") return match && d.status === "disbursed"
    if (filter === "Processing") return match && d.status === "processing"
    if (filter === "Pending") return match && d.status === "pending"
    return match
  })

  const totalDisbursed = disbursements
    .filter((d) => d.status === "disbursed")
    .reduce((s, d) => s + d.amount, 0)
  
  const totalPending = disbursements
    .filter((d) => d.status !== "disbursed")
    .reduce((s, d) => s + d.amount, 0)

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
          <h1 className="text-2xl font-bold text-foreground">Disbursements</h1>
          <p className="text-xs text-muted-foreground mt-1">Track live loan fund releases</p>
        </div>
        <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs">
          <Download className="h-3.5 w-3.5" /> Export
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center">
            <IndianRupee className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Total Disbursed</p>
            <p className="text-lg font-bold text-foreground">₹{(totalDisbursed / 100000).toFixed(2)}L</p>
          </div>
        </div>
        
        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
            <Clock className="h-5 w-5 text-yellow-500" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Pending Amount</p>
            <p className="text-lg font-bold text-foreground">₹{(totalPending / 100000).toFixed(2)}L</p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
            <Send className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <p className="text-[10px] text-muted-foreground">Transactions</p>
            <p className="text-lg font-bold text-foreground">{disbursements.length}</p>
          </div>
        </div>
      </div>

      <SearchFilterBar 
        search={search} 
        onSearchChange={setSearch} 
        filters={["All", "Completed", "Processing", "Pending"]} 
        activeFilter={filter} 
        onFilterChange={setFilter} 
      />

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
                  <td className="px-4 py-3">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-medium text-foreground">{d.method}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{d.accountNumber}</td>
                  <td className="px-4 py-3">
                    <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-semibold capitalize",
                      d.status === "disbursed" ? "bg-accent/10 text-accent" :
                      d.status === "processing" ? "bg-blue-500/10 text-blue-500" :
                      "bg-yellow-500/10 text-yellow-500"
                    )}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[10px] text-muted-foreground">{d.disbursedAt || "—"}</td>
                  <td className="px-4 py-3 text-[10px] font-mono text-muted-foreground">{d.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No records found in database</div>}
      </div>
    </div>
  )
}