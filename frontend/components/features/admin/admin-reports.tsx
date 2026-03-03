"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { BarChart3, TrendingUp, Download, Calendar, PieChart, ArrowUpRight, ArrowDownRight, IndianRupee, Users, FileText } from "lucide-react"
import { DataExportButton } from "@/components/shared/data-export-button"
import type { AdminChartData } from "@/types"

const MONTHLY: AdminChartData[] = [
  { month: "Sep", applications: 145, approved: 120, disbursed: 108 },
  { month: "Oct", applications: 175, approved: 148, disbursed: 132 },
  { month: "Nov", applications: 210, approved: 182, disbursed: 165 },
  { month: "Dec", applications: 195, approved: 168, disbursed: 150 },
  { month: "Jan", applications: 245, approved: 210, disbursed: 190 },
  { month: "Feb", applications: 280, approved: 248, disbursed: 220 },
]

const NBFC_PERFORMANCE = [
  { name: "QuickLend Finance", loans: 342, disbursed: 85000000, approval: 89 },
  { name: "PrimeLoan Corp", loans: 450, disbursed: 120000000, approval: 91 },
  { name: "TrustCapital Pvt Ltd", loans: 198, disbursed: 52000000, approval: 85 },
  { name: "EasyFin Solutions", loans: 87, disbursed: 15000000, approval: 72 },
]

const OVERVIEW_STATS = [
  { label: "This Month Revenue", value: "₹12.5L", change: "+18%", up: true },
  { label: "Avg Loan Amount", value: "₹6.2L", change: "+5%", up: true },
  { label: "Default Rate", value: "2.1%", change: "-0.3%", up: false },
  { label: "Avg Processing Time", value: "2.4 days", change: "-8%", up: false },
]

type Period = "7d" | "30d" | "90d" | "1y"

export function AdminReports() {
  const [period, setPeriod] = useState<Period>("30d")
  const maxApps = Math.max(...MONTHLY.map((d) => d.applications))

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Reports & Analytics</h1>
          <p className="text-xs text-muted-foreground mt-1">Platform performance insights</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-xl border border-border bg-card p-1">
            {(["7d", "30d", "90d", "1y"] as Period[]).map((p) => (
              <button key={p} onClick={() => setPeriod(p)} className={cn(
                "px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all",
                period === p ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:text-foreground"
              )}>{p}</button>
            ))}
          </div>
          <DataExportButton onExportCSV={() => {}} onExportPDF={() => {}} />
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {OVERVIEW_STATS.map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[10px] text-muted-foreground mb-1">{s.label}</p>
            <div className="flex items-center justify-between">
              <p className="text-xl font-bold text-foreground">{s.value}</p>
              <span className={cn("flex items-center gap-0.5 text-[10px] font-semibold",
                s.label === "Default Rate" || s.label === "Avg Processing Time"
                  ? "text-accent" : s.up ? "text-accent" : "text-red-500"
              )}>
                {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />} {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Chart */}
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Trends</h2>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end gap-2 h-48">
            {MONTHLY.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full space-y-0.5">
                  <div className="w-full rounded-t-md bg-accent/15" style={{ height: `${(d.applications / maxApps) * 150}px` }} />
                  <div className="w-full bg-accent/40" style={{ height: `${(d.approved / maxApps) * 150}px` }} />
                  <div className="w-full rounded-b-md bg-accent" style={{ height: `${(d.disbursed / maxApps) * 150}px` }} />
                </div>
                <span className="text-[9px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-accent/15" /><span className="text-[10px] text-muted-foreground">Applied</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-accent/40" /><span className="text-[10px] text-muted-foreground">Approved</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-accent" /><span className="text-[10px] text-muted-foreground">Disbursed</span></div>
          </div>
        </div>

        {/* Distribution */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Loan Distribution</h2>
          <div className="space-y-3">
            {[
              { label: "Personal Loan", pct: 42, color: "bg-accent" },
              { label: "Business Loan", pct: 28, color: "bg-blue-500" },
              { label: "Home Loan", pct: 18, color: "bg-yellow-500" },
              { label: "Education Loan", pct: 8, color: "bg-purple-500" },
              { label: "Vehicle Loan", pct: 4, color: "bg-red-500" },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-foreground">{item.label}</span>
                  <span className="text-xs font-semibold text-foreground">{item.pct}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary">
                  <div className={cn("h-full rounded-full transition-all", item.color)} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* NBFC Performance */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>NBFC Performance</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["NBFC", "Total Loans", "Disbursed", "Approval Rate", "Performance"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NBFC_PERFORMANCE.map((n) => (
                <tr key={n.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 text-xs font-semibold text-foreground">{n.name}</td>
                  <td className="px-4 py-3 text-xs text-foreground">{n.loans}</td>
                  <td className="px-4 py-3 text-xs text-foreground">₹{(n.disbursed / 10000000).toFixed(1)}Cr</td>
                  <td className="px-4 py-3 text-xs text-foreground">{n.approval}%</td>
                  <td className="px-4 py-3">
                    <div className="h-2 w-24 rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${n.approval}%` }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
