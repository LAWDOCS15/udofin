"use client"

import { StatsCard } from "@/components/shared/stats-card"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { FileText, Users, IndianRupee, TrendingUp, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
import type { NBFCDashboardStats } from "@/types"

const STATS: NBFCDashboardStats = {
  totalApplications: 342, approvedLoans: 298, totalDisbursed: 85000000, pendingReview: 28,
  activeCustomers: 275, overdueEMIs: 12, monthlyCollection: 4500000, defaultRate: 1.8,
}

const RECENT_APPS = [
  { id: "APP101", name: "Amit Sharma", amount: 500000, status: "pending", date: "Today" },
  { id: "APP102", name: "Neha Gupta", amount: 300000, status: "approved", date: "Today" },
  { id: "APP103", name: "Ravi Patel", amount: 800000, status: "under-review", date: "Yesterday" },
  { id: "APP104", name: "Kavita Singh", amount: 200000, status: "disbursed", date: "Yesterday" },
  { id: "APP105", name: "Deepak Verma", amount: 600000, status: "pending", date: "2 days ago" },
]

const UPCOMING_EMIS = [
  { customer: "Amit Sharma", amount: 16500, dueDate: "Mar 5, 2026", status: "upcoming" },
  { customer: "Neha Gupta", amount: 9800, dueDate: "Mar 5, 2026", status: "upcoming" },
  { customer: "Ravi Patel", amount: 24200, dueDate: "Mar 1, 2026", status: "overdue" },
  { customer: "Kavita Singh", amount: 6500, dueDate: "Mar 10, 2026", status: "upcoming" },
]

export function NbfcDashboardView() {
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>NBFC Dashboard</h1>
        <p className="text-xs text-muted-foreground mt-1">QuickLend Finance — Overview</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Applications" value={STATS.totalApplications.toString()} change="+15 this week" icon={FileText} accent idx={0} />
        <StatsCard title="Active Customers" value={STATS.activeCustomers.toString()} change="+8 this month" icon={Users} accent idx={1} />
        <StatsCard title="Total Disbursed" value="₹8.5Cr" change="+₹45L this month" icon={IndianRupee} idx={2} />
        <StatsCard title="Monthly Collection" value="₹45L" change="+12%" icon={TrendingUp} idx={3} />
      </div>

      {/* Alert cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-yellow-500" />
          <div><p className="text-xs font-semibold text-foreground">Pending Review</p><p className="text-lg font-bold text-yellow-500">{STATS.pendingReview}</p></div>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div><p className="text-xs font-semibold text-foreground">Overdue EMIs</p><p className="text-lg font-bold text-red-500">{STATS.overdueEMIs}</p></div>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <div><p className="text-xs font-semibold text-foreground">Default Rate</p><p className="text-lg font-bold text-accent">{STATS.defaultRate}%</p></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent Applications */}
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Recent Applications</h2>
          <div className="space-y-3">
            {RECENT_APPS.map((app) => (
              <div key={app.id} className="flex items-center justify-between rounded-xl bg-secondary/20 p-3 hover:bg-secondary/40 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
                    {app.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">{app.name}</p>
                    <p className="text-[10px] text-muted-foreground">{app.id} • {app.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-foreground">₹{(app.amount / 100000).toFixed(1)}L</span>
                  <LoanStatusBadge status={app.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming EMIs */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Upcoming EMIs</h2>
          <div className="space-y-3">
            {UPCOMING_EMIS.map((emi, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-xs font-semibold text-foreground">{emi.customer}</p>
                  <p className="text-[10px] text-muted-foreground">Due: {emi.dueDate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-foreground">₹{emi.amount.toLocaleString("en-IN")}</p>
                  <span className={cn("text-[10px] font-semibold", emi.status === "overdue" ? "text-red-500" : "text-accent")}>{emi.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
