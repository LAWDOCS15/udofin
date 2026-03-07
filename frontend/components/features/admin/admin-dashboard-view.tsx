"use client";

import { useState, useEffect } from "react";
import { StatsCard } from "@/components/shared/stats-card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/simple-toast"; 
import { cn } from "@/lib/utils";
import { adminAPI } from "@/config/api/admin"; 
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

// Fallback data if backend trends are empty
// const FALLBACK_MONTHLY_DATA: MonthlyChartEntry[] = [
//   { month: "Jan", applications: 180, approved: 156, disbursed: 140 },
//   { month: "Feb", applications: 210, approved: 182, disbursed: 165 },
// ];

const getReadableAction = (rawAction: string, moduleName: string) => {
  const action = rawAction?.toLowerCase() || "";
  
  if (action.includes("settings")) return "Updated Platform Settings";
  if (action.includes("delete") && action.includes("nbfcs")) return "Deleted an NBFC Partner";
  if (action.includes("create-nbfc-admin")) return "Created NBFC Admin Account";
  if (action.includes("create-nbfc")) return "Onboarded New NBFC Partner";
  if (action.includes("support/reply")) return "Replied to a Support Ticket";
  if (action.includes("status") && action.includes("tickets")) return "Resolved/Closed a Support Ticket";

  if (moduleName) return moduleName.replace(/_/g, ' '); 
  return rawAction; 
};

export function AdminDashboardView() {
  const { showToast } = useToast(); 
  
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

  const [realUsersCount, setRealUsersCount] = useState(0); 
  // const [monthlyData, setMonthlyData] = useState<MonthlyChartEntry[]>;
  const [monthlyData, setMonthlyData] = useState<MonthlyChartEntry[]>([]);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await adminAPI.getDashboardData(); 
      const data = response.data.data || response.data; 

      setStats((prev) => ({
        ...prev,
        totalApplications: data.totalApplications || 0,
        totalUsers: (data.realUsers || 0) + (data.duplicateUsers || 0),
        approvalRate: parseFloat(data.approvalRate) || 0,
        pendingApplications: data.pendingReviews || 0,
        rejectedToday: data.rejectedToday || 0,
        newUsersToday: data.newUsersToday || 0,
        activeNBFCs: data.activeNbfc || 0,
        totalDisbursed: data.totalDisbursed || 0
      }));

      setRealUsersCount(data.realUsers || 0);

      if (data.trends && data.trends.length > 0) {
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const mappedTrends = data.trends.map((t: any) => ({
          month: monthNames[t._id.month - 1] || "Unknown",
          applications: t.count,
          approved: Math.floor(t.count * (parseFloat(data.approvalRate) / 100)) || 0, 
          disbursed: 0
        }));
        setMonthlyData(mappedTrends);
      }

      // setRecentActivities([]); 
      // Fetch Audit logs for recent activity
  //     const logsRes = await adminAPI.getAuditLogs();
  //     if (logsRes.data && logsRes.data.length > 0) {
  //       const mappedLogs = logsRes.data.slice(0, 5).map((l: any) => ({
  //         text: l.action,
  //         time: new Date(l.createdAt).toLocaleTimeString(),
  //         type: l.action.includes("create") ? "success" : "info"
  //       }));
  //       setRecentActivities(mappedLogs);
  //     }

  //   } catch (error: any) {
  //     console.error(error);
  //     showToast("Failed to load live dashboard data", "error"); 
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };


try {
        const logsRes = await adminAPI.getAuditLogs();
        const fetchedLogs = logsRes.data?.logs || logsRes.data || [];
        if (fetchedLogs.length > 0) {
          const mappedLogs = fetchedLogs.slice(0, 5).map((l: any) => {
            const isDelete = l.action?.toLowerCase().includes("delete");
            return {
              text: getReadableAction(l.action, l.module), // 👈 English text applied here
              time: new Date(l.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
              type: isDelete ? "warning" : "info" // Red for delete, Blue for others
            }
          });
          setRecentActivities(mappedLogs);
        }
      } catch (logErr) {
        console.error("Could not fetch recent activities");
      }
      
    } catch (error: any) {
      console.error(error);
      showToast("Failed to load live dashboard data", "error"); 
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

      // 4.  CHANGED: Success message in new format
      showToast("Partner NBFC created successfully!", "success");
      
      setShowAddPartnerModal(false);
      setPartnerForm({ nbfcName: "", registrationNumber: "", adminName: "", adminEmail: "", adminPassword: "" });
      fetchDashboardData(); 
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || "Failed to create partner";
      // 5.  CHANGED: Error message in new format
      showToast(errorMsg, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const maxApps = Math.max(...monthlyData.map((d) => d.applications), 10); 

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
              <AlertTriangle className="h-3 w-3" /> Live Data
            </span>
          </h1>
          <p className="text-xs text-muted-foreground mt-1">Platform performance at a glance (Unique Users: {realUsersCount})</p>
        </div>
        <Button onClick={() => setShowAddPartnerModal(true)} className="gap-2 shadow-sm rounded-xl">
          <Plus className="h-4 w-4" /> Add NBFC Partner
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Applications" value={stats.totalApplications.toLocaleString("en-IN")} change="Live" icon={FileText} accent idx={0} />
        <StatsCard title="Active Users" value={stats.totalUsers.toLocaleString("en-IN")} change="Live" icon={Users} accent idx={1} />
        <StatsCard title="Total Disbursed" value={`₹${stats.totalDisbursed.toLocaleString("en-IN")}`} change="Live" icon={DollarSign} idx={2} />
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
            {monthlyData.map((d) => (
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
            {recentActivities.length === 0 && <p className="text-xs text-muted-foreground">Live activity log connected (Waiting for new events...)</p>}
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