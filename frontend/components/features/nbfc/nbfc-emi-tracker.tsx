

"use client"

import { useEffect, useState } from "react"
import { nbfcAPI } from "@/config/api" 
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { cn } from "@/lib/utils"
import { AlertTriangle, CheckCircle2, Clock, RefreshCcw, ChevronLeft, ChevronRight } from "lucide-react"
import type { NBFCEMIRecord } from "@/types"
import { Button } from "@/components/ui/button"

const FILTERS = ["All", "Upcoming", "Overdue", "Paid"]
const ITEMS_PER_PAGE = 10; 
export function NbfcEmiTracker() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [emis, setEmis] = useState<NBFCEMIRecord[]>([]) 
  const [loading, setLoading] = useState(true)
  
  const [currentPage, setCurrentPage] = useState(1);

  const loadTrackerData = async () => {
    try {
      setLoading(true);
      const res = await nbfcAPI.getTrackerData(); 
      if (res.data?.success) {
        setEmis(res.data.emis);
      }
    } catch (error) {
      console.error("EMI Tracker Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrackerData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filter]);

  const filtered = emis.filter((e) => {
    const match = 
      e.customerName.toLowerCase().includes(search.toLowerCase()) || 
      e.loanId.toLowerCase().includes(search.toLowerCase())
    
    if (filter === "Upcoming") return match && e.status === "upcoming"
    if (filter === "Overdue") return match && e.status === "overdue"
    if (filter === "Paid") return match && e.status === "paid"
    return match
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalUpcoming = emis.filter((e) => e.status === "upcoming").reduce((s, e) => s + e.amount, 0)
  const totalOverdue = emis.filter((e) => e.status === "overdue").reduce((s, e) => s + e.amount, 0)
  const totalCollected = emis.filter((e) => e.status === "paid").reduce((s, e) => s + e.amount, 0)

  if (loading) return (
    <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
      <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
      <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">Fetching Records...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight italic uppercase">EMI.Tracker</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Database Node: Ledger-01</p>
        </div>
        <button 
  onClick={loadTrackerData} 
  title="Refresh Data" 
  aria-label="Refresh Tracker Data"
  className="p-2 hover:bg-secondary rounded-full transition-colors group"
>
  <RefreshCcw className="h-4 w-4 group-active:rotate-180 transition-transform" />
</button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-accent/15 flex items-center justify-center"><Clock className="h-5 w-5 text-accent" /></div>
          <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Upcoming</p><p className="text-lg font-black text-foreground tracking-tighter">₹{totalUpcoming.toLocaleString("en-IN")}</p></div>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-red-500/15 flex items-center justify-center"><AlertTriangle className="h-5 w-5 text-red-500" /></div>
          <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Overdue</p><p className="text-lg font-black text-red-500 tracking-tighter">₹{totalOverdue.toLocaleString("en-IN")}</p></div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 flex items-center gap-3 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-emerald-500/15 flex items-center justify-center"><CheckCircle2 className="h-5 w-5 text-emerald-500" /></div>
          <div><p className="text-[10px] font-bold text-muted-foreground uppercase">Collected</p><p className="text-lg font-black text-foreground tracking-tighter">₹{totalCollected.toLocaleString("en-IN")}</p></div>
        </div>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-secondary/20">
                {["Customer", "Loan ID", "EMI #", "Amount", "Due Date", "Status", "Paid On"].map((h) => (
                  <th key={h} className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/70">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {paginatedData.map((emi) => (
                <tr key={emi.id} className={cn(
                  "hover:bg-secondary/10 transition-colors group",
                  emi.status === "overdue" ? "bg-red-500/[0.02]" : ""
                )}>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-black text-accent uppercase">
                        {emi.customerName.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="text-xs font-bold text-foreground">{emi.customerName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-tight">{emi.loanId}</td>
                  <td className="px-5 py-4 text-xs font-bold text-foreground">{emi.emiNumber}/12</td>
                  <td className="px-5 py-4 text-xs font-black text-foreground">₹{emi.amount.toLocaleString("en-IN")}</td>
                  <td className="px-5 py-4 text-xs font-medium text-foreground">{emi.dueDate}</td>
                  <td className="px-5 py-4">
                    <span className={cn("text-[9px] px-2 py-1 rounded-lg font-black uppercase tracking-wider",
                      emi.status === "paid" ? "bg-emerald-500/10 text-emerald-600" :
                      emi.status === "overdue" ? "bg-red-500/10 text-red-500 animate-pulse" :
                      "bg-yellow-500/10 text-yellow-600"
                    )}>{emi.status}</span>
                  </td>
                  <td className="px-5 py-4 text-[10px] font-bold text-muted-foreground uppercase">{emi.paidDate || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 bg-secondary/10 border-t border-border">
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
              Showing {startIndex + 1} to {Math.min(startIndex + ITEMS_PER_PAGE, filtered.length)} of {filtered.length} Records
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={cn(
                      "h-8 w-8 p-0 rounded-lg text-[10px] font-bold",
                      currentPage === page ? "bg-accent text-white" : ""
                    )}
                  >
                    {page}
                  </Button>
                ))}
              </div>

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0 rounded-lg"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
        
        {filtered.length === 0 && <div className="py-20 text-center text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] opacity-50">Zero Records Found</div>}
      </div>
    </div>
  )
}