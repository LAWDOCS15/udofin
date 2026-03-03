// "use client";

// import { StatsCard } from "@/components/shared/stats-card";
// import { cn } from "@/lib/utils";
// import {
//   FileText,
//   Users,
//   DollarSign,
//   TrendingUp,
//   ArrowUpRight,
//   ArrowDownRight,
//   Building2,
//   Clock,
// } from "lucide-react";
// import type { AdminDashboardStats } from "@/types";

// interface MonthlyChartEntry {
//   month: string;
//   applications: number;
//   approved: number;
//   disbursed: number;
// }

// const STATS: AdminDashboardStats = {
//   totalUsers: 8932,
//   totalApplications: 1284,
//   activeLoans: 542,
//   totalDisbursed: 425000000,
//   revenue: 12500000,
//   approvalRate: 87.3,
//   totalNBFCs: 30,
//   activeNBFCs: 24,
//   newUsersThisMonth: 312,
//   newUsersToday: 47,
//   pendingApplications: 156,
//   rejectedToday: 8,
// };

// const RECENT_ACTIVITIES = [
//   {
//     text: "Virendra Singh's loan of ₹8L approved",
//     time: "2 min ago",
//     type: "success" as const,
//   },
//   {
//     text: "NBFC partner 'QuickLend' onboarded",
//     time: "15 min ago",
//     type: "info" as const,
//   },
//   {
//     text: "Priya Sharma's application under review",
//     time: "1 hour ago",
//     type: "warning" as const,
//   },
//   {
//     text: "3 KYC documents verified",
//     time: "2 hours ago",
//     type: "info" as const,
//   },
//   {
//     text: "Monthly report generated",
//     time: "3 hours ago",
//     type: "info" as const,
//   },
// ];

// const MONTHLY_DATA: MonthlyChartEntry[] = [
//   { month: "Jan", applications: 180, approved: 156, disbursed: 140 },
//   { month: "Feb", applications: 210, approved: 182, disbursed: 165 },
//   { month: "Mar", applications: 245, approved: 210, disbursed: 190 },
//   { month: "Apr", applications: 198, approved: 168, disbursed: 155 },
//   { month: "May", applications: 280, approved: 248, disbursed: 220 },
//   { month: "Jun", applications: 310, approved: 270, disbursed: 245 },
// ];

// export function AdminDashboardView() {
//   const maxApps = Math.max(...MONTHLY_DATA.map((d) => d.applications));

//   return (
//     <div className="p-6 lg:p-8 space-y-6">
//       <div>
//         <h1
//           className="text-2xl font-bold text-foreground"
//           style={{ fontFamily: "var(--font-heading)" }}
//         >
//           Dashboard Overview
//         </h1>
//         <p className="text-xs text-muted-foreground mt-1">
//           Platform performance at a glance
//         </p>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         <StatsCard
//           title="Total Applications"
//           value={STATS.totalApplications.toLocaleString("en-IN")}
//           change="+12.5%"
//           icon={FileText}
//           accent
//           idx={0}
//         />
//         <StatsCard
//           title="Active Users"
//           value={STATS.totalUsers.toLocaleString("en-IN")}
//           change="+5.2%"
//           icon={Users}
//           accent
//           idx={1}
//         />
//         <StatsCard
//           title="Total Disbursed"
//           value="₹42.5Cr"
//           change="+18.3%"
//           icon={DollarSign}
//           idx={2}
//         />
//         <StatsCard
//           title="Approval Rate"
//           value={`${STATS.approvalRate}%`}
//           change="+3.1%"
//           icon={TrendingUp}
//           idx={3}
//         />
//       </div>

//       {/* Secondary Stats */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {[
//           {
//             label: "Active NBFCs",
//             value: STATS.activeNBFCs,
//             icon: Building2,
//             color: "text-blue-500",
//           },
//           {
//             label: "Pending Reviews",
//             value: STATS.pendingApplications,
//             icon: Clock,
//             color: "text-yellow-500",
//           },
//           {
//             label: "Rejected Today",
//             value: STATS.rejectedToday,
//             icon: ArrowDownRight,
//             color: "text-red-500",
//           },
//           {
//             label: "New Users Today",
//             value: STATS.newUsersToday,
//             icon: ArrowUpRight,
//             color: "text-accent",
//           },
//         ].map((s) => (
//           <div
//             key={s.label}
//             className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3"
//           >
//             <div
//               className={cn(
//                 "h-10 w-10 rounded-xl bg-secondary flex items-center justify-center",
//                 s.color,
//               )}
//             >
//               <s.icon className="h-5 w-5" />
//             </div>
//             <div>
//               <p className="text-[10px] text-muted-foreground">{s.label}</p>
//               <p className="text-lg font-bold text-foreground">{s.value}</p>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="grid gap-6 lg:grid-cols-5 ">
//         {/* Chart Area */}
//         <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h2
//             className="text-base font-bold text-foreground mb-4"
//             style={{ fontFamily: "var(--font-heading)" }}
//           >
//             Monthly Trends
//           </h2>
//           <div className="flex items-end gap-3 h-auto">
//             {MONTHLY_DATA.map((d) => (
//               <div
//                 key={d.month}
//                 className="flex-1 flex flex-col items-center gap-1"
//               >
//                 <div className="w-full flex flex-col gap-0.5">
//                   <div
//                     className="w-full rounded-t-md bg-accent/20"
//                     style={{ height: `${(d.applications / maxApps) * 160}px` }}
//                   />
//                   <div
//                     className="w-full rounded-b-md bg-accent"
//                     style={{ height: `${(d.approved / maxApps) * 160}px` }}
//                   />
//                 </div>
//                 <span className="text-[10px] text-muted-foreground">
//                   {d.month}
//                 </span>
//               </div>
//             ))}
//           </div>
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
//             <div className="flex items-center gap-1.5">
//               <div className="h-2.5 w-2.5 rounded-sm bg-accent/20" />
//               <span className="text-[10px] text-muted-foreground">
//                 Applications
//               </span>
//             </div>
//             <div className="flex items-center gap-1.5">
//               <div className="h-2.5 w-2.5 rounded-sm bg-accent" />
//               <span className="text-[10px] text-muted-foreground">
//                 Approved
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Recent Activity */}
//         <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h2
//             className="text-base font-bold text-foreground mb-4"
//             style={{ fontFamily: "var(--font-heading)" }}
//           >
//             Recent Activity
//           </h2>
//           <div className="space-y-3">
//             {RECENT_ACTIVITIES.map((a, i) => (
//               <div key={i} className="flex items-start gap-3">
//                 <div
//                   className={cn(
//                     "mt-1 h-2 w-2 rounded-full shrink-0",
//                     a.type === "success"
//                       ? "bg-accent"
//                       : a.type === "warning"
//                         ? "bg-yellow-500"
//                         : "bg-blue-500",
//                   )}
//                 />
//                 <div>
//                   <p className="text-xs text-foreground">{a.text}</p>
//                   <p className="text-[10px] text-muted-foreground">{a.time}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/shared/stats-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { adminAPI } from "@/config/api";
import {
  FileText, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, 
  Building2, Clock, Plus, Loader2, UserPlus, X, AlertTriangle
} from "lucide-react";
import type { AdminDashboardStats } from "@/types";

interface MonthlyChartEntry {
  month: string;
  applications: number;
  approved: number;
  disbursed: number;
}

const MONTHLY_DATA: MonthlyChartEntry[] = [
  { month: "Jan", applications: 180, approved: 156, disbursed: 140 },
  { month: "Feb", applications: 210, approved: 182, disbursed: 165 },
  { month: "Mar", applications: 245, approved: 210, disbursed: 190 },
  { month: "Apr", applications: 198, approved: 168, disbursed: 155 },
  { month: "May", applications: 280, approved: 248, disbursed: 220 },
  { month: "Jun", applications: 310, approved: 270, disbursed: 245 },
];

export function AdminDashboardView() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [partnerForm, setPartnerForm] = useState({
    nbfcName: "", registrationNumber: "", adminName: "", adminEmail: "", adminPassword: ""
  });

  const [stats, setStats] = useState<AdminDashboardStats>({
    totalUsers: 0, totalApplications: 0, activeLoans: 0, totalDisbursed: 0,
    revenue: 0, approvalRate: 0, totalNBFCs: 0, activeNBFCs: 0,
    newUsersThisMonth: 0, newUsersToday: 0, pendingApplications: 0, rejectedToday: 0,
  });

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      const response = await adminAPI.getDashboardData();
      const data = response.data;

      setStats((prev) => ({
        ...prev,
        totalApplications: data.stats.totalApplications || 0,
        totalUsers: data.stats.activeUsers || 0,
        approvalRate: parseFloat(data.stats.approvalRate) || 0,
        pendingApplications: data.applications.filter((a: any) => a.status === 'pending').length,
      }));

      const mappedActivities = data.applications.slice(0, 5).map((app: any) => ({
        text: `${app.applicantName}'s application is ${app.status}`,
        time: app.appliedDate,
        type: app.status === 'approved' ? 'success' : app.status === 'rejected' ? 'warning' : 'info'
      }));
      
      setRecentActivities(mappedActivities);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load live data", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreatePartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const nbfcRes = await adminAPI.createNbfc({
        name: partnerForm.nbfcName,
        registrationNumber: partnerForm.registrationNumber
      });
      
      await adminAPI.createNbfcAdmin({
        name: partnerForm.adminName,
        email: partnerForm.adminEmail,
        password: partnerForm.adminPassword,
        nbfcId: nbfcRes.data.nbfcId 
      });

      toast({ title: "Success", description: "Partner NBFC created successfully!" });
      setShowAddPartnerModal(false);
      setPartnerForm({ nbfcName: "", registrationNumber: "", adminName: "", adminEmail: "", adminPassword: "" });
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create partner";
      toast({ title: "Error", description: errorMsg, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxApps = Math.max(...MONTHLY_DATA.map((d) => d.applications));

  if (isLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-3" style={{ fontFamily: "var(--font-heading)" }}>
            Dashboard Overview
            <span className="px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-bold rounded flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" /> Simulated KYC
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Platform performance at a glance</p>
        </div>
        <Button onClick={() => setShowAddPartnerModal(true)} className="gap-2 shadow-sm rounded-xl">
          <Plus className="h-4 w-4" /> Add NBFC Partner
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Applications" value={stats.totalApplications.toLocaleString("en-IN")} change="Live" icon={FileText} accent idx={0} />
        <StatsCard title="Active Users" value={stats.totalUsers.toLocaleString("en-IN")} change="Live" icon={Users} accent idx={1} />
        <StatsCard title="Total Disbursed" value="₹0.0" change="Pending Module" icon={DollarSign} idx={2} />
        <StatsCard title="Approval Rate" value={`${stats.approvalRate}%`} change="Live" icon={TrendingUp} idx={3} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Active NBFCs", value: stats.activeNBFCs, icon: Building2, color: "text-blue-500" },
          { label: "Pending Reviews", value: stats.pendingApplications, icon: Clock, color: "text-yellow-500" },
          { label: "Rejected Today", value: stats.rejectedToday, icon: ArrowDownRight, color: "text-red-500" },
          { label: "New Users Today", value: stats.newUsersToday, icon: ArrowUpRight, color: "text-accent" },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
            <div className={cn("h-10 w-10 rounded-xl bg-secondary flex items-center justify-center", s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5 ">
        <div className="lg:col-span-3 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Monthly Trends</h2>
          <div className="flex items-end gap-3 h-auto">
            {MONTHLY_DATA.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5">
                  <div className="w-full rounded-t-md bg-accent/20" style={{ height: `${(d.applications / maxApps) * 160}px` }} />
                  <div className="w-full rounded-b-md bg-accent" style={{ height: `${(d.approved / maxApps) * 160}px` }} />
                </div>
                <span className="text-[10px] text-muted-foreground">{d.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-accent/20" /><span className="text-[10px] text-muted-foreground">Applications</span></div>
            <div className="flex items-center gap-1.5"><div className="h-2.5 w-2.5 rounded-sm bg-accent" /><span className="text-[10px] text-muted-foreground">Approved</span></div>
          </div>
        </div>

        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", a.type === "success" ? "bg-accent" : a.type === "warning" ? "bg-yellow-500" : "bg-blue-500")} />
                <div>
                  <p className="text-xs text-foreground">{a.text}</p>
                  <p className="text-[10px] text-muted-foreground">{a.time}</p>
                </div>
              </div>
            ))}
            {recentActivities.length === 0 && <p className="text-xs text-muted-foreground">No recent activity.</p>}
          </div>
        </div>
      </div>

      {showAddPartnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => !isSubmitting && setShowAddPartnerModal(false)} />
          <div className="relative w-full max-w-md bg-card rounded-3xl border border-border shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <h3 className="text-lg font-bold text-foreground">Onboard Lending Partner</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Create NBFC and assign an Admin</p>
              </div>
              <button onClick={() => setShowAddPartnerModal(false)} disabled={isSubmitting} className="text-muted-foreground hover:text-foreground transition-colors bg-secondary p-1.5 rounded-full">
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePartner} className="p-6">
              <div className="space-y-5">
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"><Building2 className="h-4 w-4 text-blue-500" /> Company Details</h4>
                  <div className="grid gap-3">
                    <input type="text" placeholder="NBFC Company Name (e.g., Bajaj Finserv)" required value={partnerForm.nbfcName} onChange={(e) => setPartnerForm({...partnerForm, nbfcName: e.target.value})} className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <input type="text" placeholder="Registration Number (CIN/RBI Reg No)" required value={partnerForm.registrationNumber} onChange={(e) => setPartnerForm({...partnerForm, registrationNumber: e.target.value})} className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
                <div className="h-px w-full bg-border" />
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-semibold text-foreground mb-3"><UserPlus className="h-4 w-4 text-emerald-500" /> Admin Account</h4>
                  <div className="grid gap-3">
                    <input type="text" placeholder="Admin Full Name" required value={partnerForm.adminName} onChange={(e) => setPartnerForm({...partnerForm, adminName: e.target.value})} className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <input type="email" placeholder="Admin Email Address" required value={partnerForm.adminEmail} onChange={(e) => setPartnerForm({...partnerForm, adminEmail: e.target.value})} className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                    <input type="password" placeholder="Set Admin Password (Min 8 chars)" required minLength={8} value={partnerForm.adminPassword} onChange={(e) => setPartnerForm({...partnerForm, adminPassword: e.target.value})} className="w-full px-4 py-3 text-sm bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowAddPartnerModal(false)} disabled={isSubmitting} className="rounded-xl">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl min-w-[130px]">
                  {isSubmitting ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating...</> : 'Create Partner'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}