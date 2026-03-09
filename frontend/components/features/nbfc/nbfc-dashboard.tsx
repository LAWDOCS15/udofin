// "use client"

// import { StatsCard } from "@/components/shared/stats-card"
// import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
// import { cn } from "@/lib/utils"
// import { FileText, Users, IndianRupee, TrendingUp, Clock, CheckCircle2, AlertTriangle } from "lucide-react"
// import type { NBFCDashboardStats } from "@/types"

// const STATS: NBFCDashboardStats = {
//   totalApplications: 342, approvedLoans: 298, totalDisbursed: 85000000, pendingReview: 28,
//   activeCustomers: 275, overdueEMIs: 12, monthlyCollection: 4500000, defaultRate: 1.8,
// }

// const RECENT_APPS = [
//   { id: "APP101", name: "Amit Sharma", amount: 500000, status: "pending", date: "Today" },
//   { id: "APP102", name: "Neha Gupta", amount: 300000, status: "approved", date: "Today" },
//   { id: "APP103", name: "Ravi Patel", amount: 800000, status: "under-review", date: "Yesterday" },
//   { id: "APP104", name: "Kavita Singh", amount: 200000, status: "disbursed", date: "Yesterday" },
//   { id: "APP105", name: "Deepak Verma", amount: 600000, status: "pending", date: "2 days ago" },
// ]

// const UPCOMING_EMIS = [
//   { customer: "Amit Sharma", amount: 16500, dueDate: "Mar 5, 2026", status: "upcoming" },
//   { customer: "Neha Gupta", amount: 9800, dueDate: "Mar 5, 2026", status: "upcoming" },
//   { customer: "Ravi Patel", amount: 24200, dueDate: "Mar 1, 2026", status: "overdue" },
//   { customer: "Kavita Singh", amount: 6500, dueDate: "Mar 10, 2026", status: "upcoming" },
// ]

// export function NbfcDashboardView() {
//   return (
//     <div className="p-6 lg:p-8 space-y-6">
//       <div>
//         <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>NBFC Dashboard</h1>
//         <p className="text-xs text-muted-foreground mt-1">QuickLend Finance — Overview</p>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatsCard title="Total Applications" value={STATS.totalApplications.toString()} change="+15 this week" icon={FileText} accent idx={0} />
//         <StatsCard title="Active Customers" value={STATS.activeCustomers.toString()} change="+8 this month" icon={Users} accent idx={1} />
//         <StatsCard title="Total Disbursed" value="₹8.5Cr" change="+₹45L this month" icon={IndianRupee} idx={2} />
//         <StatsCard title="Monthly Collection" value="₹45L" change="+12%" icon={TrendingUp} idx={3} />
//       </div>

//       {/* Alert cards */}
//       <div className="grid gap-4 sm:grid-cols-3">
//         <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-center gap-3">
//           <Clock className="h-5 w-5 text-yellow-500" />
//           <div><p className="text-xs font-semibold text-foreground">Pending Review</p><p className="text-lg font-bold text-yellow-500">{STATS.pendingReview}</p></div>
//         </div>
//         <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
//           <AlertTriangle className="h-5 w-5 text-red-500" />
//           <div><p className="text-xs font-semibold text-foreground">Overdue EMIs</p><p className="text-lg font-bold text-red-500">{STATS.overdueEMIs}</p></div>
//         </div>
//         <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3">
//           <CheckCircle2 className="h-5 w-5 text-accent" />
//           <div><p className="text-xs font-semibold text-foreground">Default Rate</p><p className="text-lg font-bold text-accent">{STATS.defaultRate}%</p></div>
//         </div>
//       </div>

//       <div className="grid gap-6 lg:grid-cols-5">
//         {/* Recent Applications */}
//         <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Recent Applications</h2>
//           <div className="space-y-3">
//             {RECENT_APPS.map((app) => (
//               <div key={app.id} className="flex items-center justify-between rounded-xl bg-secondary/20 p-3 hover:bg-secondary/40 transition-colors cursor-pointer">
//                 <div className="flex items-center gap-3">
//                   <div className="h-8 w-8 rounded-full bg-accent/10 flex items-center justify-center text-xs font-bold text-accent">
//                     {app.name.split(" ").map((n) => n[0]).join("")}
//                   </div>
//                   <div>
//                     <p className="text-xs font-semibold text-foreground">{app.name}</p>
//                     <p className="text-[10px] text-muted-foreground">{app.id} • {app.date}</p>
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-3">
//                   <span className="text-xs font-semibold text-foreground">₹{(app.amount / 100000).toFixed(1)}L</span>
//                   <LoanStatusBadge status={app.status} />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Upcoming EMIs */}
//         <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Upcoming EMIs</h2>
//           <div className="space-y-3">
//             {UPCOMING_EMIS.map((emi, i) => (
//               <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-0">
//                 <div>
//                   <p className="text-xs font-semibold text-foreground">{emi.customer}</p>
//                   <p className="text-[10px] text-muted-foreground">Due: {emi.dueDate}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="text-xs font-bold text-foreground">₹{emi.amount.toLocaleString("en-IN")}</p>
//                   <span className={cn("text-[10px] font-semibold", emi.status === "overdue" ? "text-red-500" : "text-accent")}>{emi.status}</span>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





"use client";

import { useEffect, useState } from "react";
import { nbfcAPI } from "@/config/api"; 
import { StatsCard } from "@/components/shared/stats-card";
import { LoanStatusBadge } from "@/components/shared/loan-status-badge";
import { cn } from "@/lib/utils"
import {
  FileText, Users, IndianRupee, TrendingUp, CheckCircle2,
  AlertTriangle, Clock, Check, RefreshCcw, Search, X, Receipt
} from "lucide-react";
import type { NBFCDashboardStats } from "@/types";

export function NbfcDashboardView() {
  const [stats, setStats] = useState<NBFCDashboardStats | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [upcomingEmis, setUpcomingEmis] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [isTerminalMode, setIsTerminalMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [leadsRes, statsRes, emiRes] = await Promise.allSettled([
        nbfcAPI.getLeads(),
        nbfcAPI.getStats(),
        nbfcAPI.getUpcomingEmis()
      ]);

      if (leadsRes.status === 'fulfilled') {
        const apps = leadsRes.value.data?.applications || leadsRes.value.data?.leads || leadsRes.value.data || [];
        setApplications(Array.isArray(apps) ? apps.slice(0, 5) : []);
      }

      if (emiRes.status === 'fulfilled') {
        const emis = emiRes.value.data?.emis || emiRes.value.data || [];
        setUpcomingEmis(Array.isArray(emis) ? emis : []);
      }
      if (statsRes.status === 'fulfilled' && statsRes.value.data) {
        const s = statsRes.value.data;
        setStats({
          totalApplications: s.totalApplications || s.totalLoans || 0,
          totalLoans: s.totalLoans || 0,
          runningLoans: s.activeCustomers || 0, 
          completedLoans: s.completedLoans || 0,
          totalDisbursed: s.totalDisbursed || 0,
          emiExpectedToday: s.emiExpectedToday || 0,
          emiCollectedToday: s.emiCollectedToday || 0,
          emiOverdueToday: s.emiOverdueToday || 0,
          pendingApplications: s.pendingApplications || 0,
          pendingDisbursements: s.pendingDisbursements || 0,
          pendingDocVerifications: s.pendingDocVerifications || 0,
          defaultRate: s.defaultRate || 0,
        });
      }
    } catch (error) {
      console.error("Dashboard Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (emi: any) => {
    if (!confirm(`Receive ₹${emi.amount} cash from ${emi.borrowerId?.name}?`)) return;
    try {
      await nbfcAPI.markEmiAsPaid(emi._id, { 
        paymentMethod: "CASH_COUNTER", 
        transactionId: `TXN-${Math.floor(Math.random() * 1000000)}` 
      });
      loadDashboardData();
    } catch (error) {
      alert("Failed to update status");
    }
  };

  useEffect(() => { loadDashboardData(); }, []);

  const filteredEmis = upcomingEmis.filter(emi => 
    emi.borrowerId?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emi.borrowerId?.phone?.includes(searchQuery)
  );

  if (loading) return (
    <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
      <RefreshCcw className="h-8 w-8 animate-spin text-accent" />
      <p className="text-sm font-medium text-muted-foreground tracking-widest uppercase">Syncing Ledger...</p>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">NBFC Dashboard</h1>
          <p className="text-xs text-muted-foreground">System Status: <span className="text-emerald-500 font-bold uppercase">Operational</span></p>
        </div>
        <button onClick={loadDashboardData} title="Refresh Data" className="p-2 hover:bg-secondary rounded-full transition-colors group">
          <RefreshCcw className="h-4 w-4 group-active:rotate-180 transition-transform" />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Applications" value={stats?.totalApplications.toString() || "0"} icon={FileText} accent idx={0} />
        <StatsCard title="Running Loans" value={stats?.runningLoans.toString() || "0"} icon={Users} accent idx={1} />
        <StatsCard title="Total Disbursed" value={`₹${((stats?.totalDisbursed || 0) / 100000).toFixed(1)}L`} icon={IndianRupee} idx={2} />
        <StatsCard title="Today's Collection" value={`₹${(stats?.emiCollectedToday || 0).toLocaleString()}`} icon={TrendingUp} idx={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/5 p-4 flex items-center gap-3">
          <Clock className="h-5 w-5 text-yellow-500" />
          <div><p className="text-xs font-semibold uppercase opacity-70">Pending Review</p><p className="text-lg font-bold text-yellow-500">{stats?.pendingApplications}</p></div>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div><p className="text-xs font-semibold uppercase opacity-70">Overdue EMIs</p><p className="text-lg font-bold text-red-500">{stats?.emiOverdueToday}</p></div>
        </div>
        <div className="rounded-2xl border border-accent/20 bg-accent/5 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-accent" />
          <div><p className="text-xs font-semibold uppercase opacity-70">Default Rate</p><p className="text-lg font-bold text-accent">{stats?.defaultRate}%</p></div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 rounded-3xl border bg-card p-6 shadow-sm">
          <h2 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" /> Recent Leads
          </h2>
          <div className="space-y-3">
            {applications.map((app) => (
              <div key={app._id} className="flex items-center justify-between rounded-xl bg-secondary/10 p-3 hover:bg-secondary/20 transition-all">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-black text-accent">
                    {app.borrowerId?.name?.[0] || "U"}
                  </div>
                  <div>
                    <p className="text-xs font-bold">{app.borrowerId?.name || "Unknown Applicant"}</p>
                    <p className="text-[10px] text-muted-foreground uppercase">{new Date(app.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold">₹{(app.aiChatData?.requestedAmount || 0).toLocaleString()}</span>
                  <LoanStatusBadge status={app.verificationStatus?.toLowerCase() || "pending"} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={cn(
          "lg:col-span-2 rounded-3xl border transition-all duration-300 shadow-sm overflow-hidden",
          isTerminalMode ? "bg-accent/5 border-accent/30" : "bg-card border-border"
        )}>
          <div className="p-5 border-b border-border flex items-center justify-between bg-card/50">
            <div className="flex items-center gap-2">
              <Receipt className={cn("h-4 w-4", isTerminalMode ? "text-accent" : "text-muted-foreground")} />
              <h2 className="text-sm font-black uppercase tracking-wider">
                {isTerminalMode ? "Cash Terminal" : "Collections"}
              </h2>
            </div>
            <button 
              onClick={() => { setIsTerminalMode(!isTerminalMode); setSearchQuery(""); }}
              className={cn(
                "text-[10px] font-bold px-3 py-1 rounded-full border transition-all uppercase tracking-tighter",
                isTerminalMode ? "bg-red-500 border-red-500 text-white" : "bg-accent/10 border-accent/20 text-accent hover:bg-accent hover:text-white"
              )}
            >
              {isTerminalMode ? "Close Terminal" : "Open Terminal"}
            </button>
          </div>

          <div className="p-5">
            {isTerminalMode ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <input 
                    autoFocus
                    placeholder="Search name or phone..."
                    className="w-full bg-secondary/30 border-none h-10 rounded-xl pl-10 text-xs font-bold focus:ring-1 ring-accent outline-none"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {filteredEmis.map((emi) => (
                    <div key={emi._id} className="p-3 bg-card border border-border rounded-xl flex items-center justify-between group hover:border-accent/50 transition-all">
                      <div>
                        <p className="text-[11px] font-black uppercase">{emi.borrowerId?.name}</p>
                        <p className="text-[9px] text-muted-foreground font-mono">DUE: {new Date(emi.dueDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs font-black text-accent">₹{Number(emi.amount).toLocaleString()}</p>
                        <button 
                          onClick={() => handleMarkAsPaid(emi)}
                          title="Mark as Paid"
                          className="h-8 w-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEmis.slice(0, 4).map((emi, i) => (
                  <div key={emi._id || i} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className={cn("h-1.5 w-1.5 rounded-full", emi.status?.toLowerCase() === 'overdue' ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
                      <div>
                        <p className="text-[11px] font-bold leading-none">{emi.borrowerId?.name || "Customer"}</p>
                        <p className="text-[9px] text-muted-foreground mt-1">₹{Number(emi.amount).toLocaleString()}</p>
                      </div>
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground">{new Date(emi.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                  </div>
                ))}
                <button 
                  onClick={() => setIsTerminalMode(true)}
                  className="w-full py-3 bg-secondary/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary/20 transition-all mt-2"
                >
                  View All Collections
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
