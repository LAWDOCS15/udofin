// "use client"

// import { useMemo } from "react"
// import { useRouter } from "next/navigation"
// import { useOnboarding } from "@/lib/onboarding-context"
// import { StatsCard } from "@/components/shared/stats-card"
// import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
// import { cn } from "@/lib/utils"
// import {
//   Wallet, TrendingUp, Bell, IndianRupee, Clock,
//   FileText, ChevronRight, Shield, Sparkles,
//   CheckCircle2, AlertCircle, CreditCard,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import type { UserLoan, EMIEntry, UserNotification, UserDashboardStats } from "@/types"

// // ─── Demo Data ──────────────────────────────────────────────────────────────

// const DEMO_LOANS: UserLoan[] = [
//   {
//     id: "L001", nbfcName: "Bajaj Finserv", nbfcLogo: "BFL", loanType: "personal",
//     sanctionedAmount: 500000, disbursedAmount: 500000, interestRate: 11.5, tenure: 36,
//     emiAmount: 16500, emiPaid: 8, totalEMI: 36, outstandingBalance: 380000,
//     status: "running", startDate: "2025-07-01", maturityDate: "2028-07-01", nextEMIDate: "2026-03-01",
//   },
//   {
//     id: "L002", nbfcName: "Tata Capital", nbfcLogo: "TATA", loanType: "personal",
//     sanctionedAmount: 800000, disbursedAmount: 800000, interestRate: 10.5, tenure: 48,
//     emiAmount: 20400, emiPaid: 4, totalEMI: 48, outstandingBalance: 740000,
//     status: "running", startDate: "2025-11-01", maturityDate: "2029-11-01", nextEMIDate: "2026-03-05",
//   },
//   {
//     id: "L003", nbfcName: "HDFC", nbfcLogo: "HDFC", loanType: "personal",
//     sanctionedAmount: 300000, disbursedAmount: 300000, interestRate: 12.0, tenure: 24,
//     emiAmount: 14130, emiPaid: 24, totalEMI: 24, outstandingBalance: 0,
//     status: "completed", startDate: "2024-03-01", maturityDate: "2026-03-01", nextEMIDate: "-",
//   },
// ]

// const DEMO_UPCOMING_EMIS: EMIEntry[] = [
//   { emiNumber: 5, dueDate: "01 Mar 2026", amount: 20400, principal: 14200, interest: 6200, status: "upcoming", loanId: "L002", nbfcName: "Tata Capital" },
//   { emiNumber: 9, dueDate: "05 Mar 2026", amount: 16500, principal: 12800, interest: 3700, status: "upcoming", loanId: "L001", nbfcName: "Bajaj Finserv" },
//   { emiNumber: 6, dueDate: "01 Apr 2026", amount: 20400, principal: 14350, interest: 6050, status: "upcoming", loanId: "L002", nbfcName: "Tata Capital" },
// ]

// const DEMO_NOTIFICATIONS: UserNotification[] = [
//   { id: "N1", title: "EMI Reminder", message: "₹20,400 EMI due on 1st Mar for Tata Capital loan", type: "warning", read: false, createdAt: "Today" },
//   { id: "N2", title: "Loan Completed!", message: "HDFC personal loan fully repaid.", type: "success", read: false, createdAt: "Yesterday" },
//   { id: "N3", title: "Document Verified", message: "Your PAN card has been verified successfully.", type: "info", read: true, createdAt: "2 days ago" },
// ]

// // ─── Component ──────────────────────────────────────────────────────────────

// export function UserDashboard() {
//   const router = useRouter()
//   const { userProfile } = useOnboarding()

//   const name = userProfile.fullName ? userProfile.fullName.split(" ")[0] : "User"

//   const stats: UserDashboardStats = useMemo(() => ({
//     totalLoans: DEMO_LOANS.length,
//     runningLoans: DEMO_LOANS.filter((l) => l.status === "running").length,
//     completedLoans: DEMO_LOANS.filter((l) => l.status === "completed").length,
//     totalOutstanding: DEMO_LOANS.reduce((s, l) => s + l.outstandingBalance, 0),
//     nextEMI: DEMO_UPCOMING_EMIS[0] || null,
//     cibilScore: 758,
//   }), [])

//   // ── Main Dashboard ──────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <div className="border-b border-border bg-card">
//         <div className="px-6 py-6 lg:px-8">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
//                 <Wallet className="h-5 w-5 text-accent" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
//                   Welcome back, {name}!
//                 </h1>
//                 <p className="text-xs text-muted-foreground">Your loan dashboard overview</p>
//               </div>
//             </div>
//             <button
//               onClick={() => router.push("/user/notifications")}
//               className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-all"
//             >
//               <Bell className="h-4 w-4 text-muted-foreground" />
//               {DEMO_NOTIFICATIONS.filter((n) => !n.read).length > 0 && (
//                 <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white">
//                   {DEMO_NOTIFICATIONS.filter((n) => !n.read).length}
//                 </span>
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Stats Grid */}
//       <div className="px-6 pt-6 lg:px-8">
//         <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
//           <StatsCard label="Total Loans" value={String(stats.totalLoans)} icon={FileText} accent accentIndex={0} animationDelay={0} />
//           <StatsCard label="Running Loans" value={String(stats.runningLoans)} icon={TrendingUp} accent accentIndex={1} animationDelay={60} />
//           <StatsCard label="Outstanding" value={`₹${(stats.totalOutstanding / 100000).toFixed(1)}L`} icon={IndianRupee} animationDelay={120} />
//           <StatsCard label="CIBIL Score" value={String(stats.cibilScore)} change="Excellent" icon={Shield} animationDelay={180} />
//         </div>
//       </div>

//       {/* EMI Alert */}
//       {stats.nextEMI && (
//         <div className="px-6 pt-6 lg:px-8">
//           <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-3">
//               <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15">
//                 <AlertCircle className="h-5 w-5 text-red-500" />
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-foreground">Upcoming EMI Alert</p>
//                 <p className="text-xs text-muted-foreground">
//                   ₹{stats.nextEMI.amount.toLocaleString("en-IN")} due on {stats.nextEMI.dueDate} &middot; {stats.nextEMI.nbfcName}
//                 </p>
//               </div>
//             </div>
//             <div className="flex gap-2">
//               <Button className="h-9 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold px-5">
//                 <CreditCard className="h-3.5 w-3.5 mr-1.5" /> Pay Now
//               </Button>
//               <Button variant="ghost" className="h-9 rounded-xl border border-border text-xs text-muted-foreground hover:bg-secondary">
//                 <Clock className="h-3.5 w-3.5 mr-1.5" /> Set Reminder
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="px-6 py-8 lg:px-8">
//         <div className="grid gap-5 lg:grid-cols-3">
//           {/* Loans Summary */}
//           <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
//             <div className="mb-5 flex items-center justify-between">
//               <div>
//                 <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Loans</h2>
//                 <p className="text-xs text-muted-foreground mt-0.5">Quick overview of your active loans</p>
//               </div>
//               <button onClick={() => router.push("/user/loans")} className="text-xs text-accent font-semibold hover:underline">View All</button>
//             </div>
//             <div className="flex flex-col gap-3">
//               {DEMO_LOANS.map((loan, i) => (
//                 <div
//                   key={loan.id}
//                   onClick={() => router.push("/user/loans")}
//                   className="group flex items-center justify-between rounded-2xl border border-border/50 bg-secondary/30 p-4 hover:border-accent/25 hover:bg-secondary/50 cursor-pointer transition-all duration-300 animate-fade-up"
//                   style={{ animationDelay: `${i * 80}ms` }}
//                 >
//                   <div className="flex items-center gap-3 flex-1">
//                     <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all">
//                       {loan.nbfcLogo}
//                     </div>
//                     <div>
//                       <p className="font-semibold text-foreground text-sm">{loan.nbfcName}</p>
//                       <p className="text-[11px] text-muted-foreground">
//                         ₹{(loan.sanctionedAmount / 100000).toFixed(1)}L &middot; EMI: ₹{loan.emiAmount.toLocaleString("en-IN")} &middot; {loan.emiPaid}/{loan.totalEMI} paid
//                       </p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     <LoanStatusBadge status={loan.status} />
//                     <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-colors" />
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Right Column */}
//           <div className="flex flex-col gap-5">
//             {/* Upcoming EMIs */}
//             <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//               <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Upcoming EMIs</h2>
//               <div className="flex flex-col gap-2.5">
//                 {DEMO_UPCOMING_EMIS.map((emi, i) => (
//                   <div key={i} className="flex items-center justify-between rounded-xl bg-secondary/30 p-3">
//                     <div>
//                       <p className="text-xs font-semibold text-foreground">{emi.dueDate}</p>
//                       <p className="text-[10px] text-muted-foreground">{emi.nbfcName}</p>
//                     </div>
//                     <p className="text-sm font-bold text-foreground">₹{emi.amount.toLocaleString("en-IN")}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Notifications */}
//             <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//               <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h2>
//               <div className="flex flex-col gap-2.5">
//                 {DEMO_NOTIFICATIONS.map((notif) => (
//                   <div key={notif.id} className={cn(
//                     "rounded-xl p-3 flex items-start gap-2.5",
//                     !notif.read ? "bg-accent/5 border border-accent/10" : "bg-secondary/30",
//                   )}>
//                     <div className={cn(
//                       "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
//                       notif.type === "success" ? "bg-accent/15 text-accent" :
//                       notif.type === "warning" ? "bg-amber-500/15 text-amber-500" :
//                       "bg-blue-500/15 text-blue-500",
//                     )}>
//                       {notif.type === "success" ? <CheckCircle2 className="h-3 w-3" /> :
//                        notif.type === "warning" ? <AlertCircle className="h-3 w-3" /> :
//                        <Sparkles className="h-3 w-3" />}
//                     </div>
//                     <div>
//                       <p className="text-xs font-semibold text-foreground">{notif.title}</p>
//                       <p className="text-[10px] text-muted-foreground">{notif.message}</p>
//                       <p className="text-[9px] text-muted-foreground/60 mt-0.5">{notif.createdAt}</p>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

"use client"

import { useMemo, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useOnboarding } from "@/lib/onboarding-context"
import { StatsCard } from "@/components/shared/stats-card"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { API_BASE_URL } from "@/config/api"
import api from "@/config/axios"
import {
  Wallet, TrendingUp, Bell, IndianRupee, Clock,
  FileText, ChevronRight, Shield, Sparkles,
  CheckCircle2, AlertCircle, CreditCard, Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function UserDashboard() {
  const router = useRouter()
  const { userProfile, user } = useOnboarding()
  const [loans, setLoans] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const name = userProfile.fullName ? userProfile.fullName.split(" ")[0] : (user?.name?.split(" ")[0] || "User")

  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        // Here you would typically fetch from userAPI.getLoans()
        // Assuming the backend has a route like /api/user/loans to get logged-in user's loans
        const response = await api.get('/api/applications/my-applications') 
        if (response.data && response.data.loans) {
          setLoans(response.data.loans)
        }
      } catch (error) {
        console.error("Error fetching user loans:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchUserLoans()
  }, [])

  const stats = useMemo(() => ({
    totalLoans: loans.length,
    runningLoans: loans.filter((l) => l.status === "VERIFIED" || l.status === "DISBURSED").length,
    totalOutstanding: loans.filter((l) => l.status === "DISBURSED").reduce((s, l) => s + (l.amount || 0), 0),
    cibilScore: loans[0]?.cibilScore || 758, // Placeholder logic
  }), [loans])

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                <Wallet className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                  Welcome back, {name}!
                </h1>
                <p className="text-xs text-muted-foreground">Your loan dashboard overview</p>
              </div>
            </div>
            <button
              onClick={() => router.push("/user/notifications")}
              className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-all"
            >
              <Bell className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 pt-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatsCard label="Total Applications" value={String(stats.totalLoans)} icon={FileText} accent accentIndex={0} animationDelay={0} />
          <StatsCard label="Active Loans" value={String(stats.runningLoans)} icon={TrendingUp} accent accentIndex={1} animationDelay={60} />
          <StatsCard label="Disbursed" value={`₹${(stats.totalOutstanding / 100000).toFixed(1)}L`} icon={IndianRupee} animationDelay={120} />
          <StatsCard label="CIBIL Score" value={String(stats.cibilScore)} change="Simulated" icon={Shield} animationDelay={180} />
        </div>
      </div>

      <div className="px-6 py-8 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Applications</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Quick overview of your loan statuses</p>
              </div>
              {loans.length === 0 && (
                <Button onClick={() => router.push("/onboarding")} size="sm" className="h-8 text-xs bg-accent text-accent-foreground hover:bg-accent/90">Apply Now</Button>
              )}
            </div>
            <div className="flex flex-col gap-3">
              {loans.map((loan, i) => (
                <div
                  key={loan.id || loan._id}
                  className="group flex items-center justify-between rounded-2xl border border-border/50 bg-secondary/30 p-4 hover:border-accent/25 hover:bg-secondary/50 cursor-pointer transition-all duration-300 animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-xs font-bold text-foreground group-hover:bg-accent/10 group-hover:text-accent transition-all">
                      {loan.nbfcName ? loan.nbfcName.substring(0, 2).toUpperCase() : "LN"}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{loan.nbfcName || "Partner NBFC"}</p>
                      <p className="text-[11px] text-muted-foreground">
                        Amount: ₹{(loan.amount / 100000).toFixed(1)}L &middot; Date: {new Date(loan.createdAt || loan.appliedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <LoanStatusBadge status={loan.status ? loan.status.toLowerCase() : "pending"} />
                    <ChevronRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              ))}
              {loans.length === 0 && (
                <div className="py-10 text-center text-sm text-muted-foreground border-2 border-dashed border-border rounded-2xl">
                  You haven't submitted any applications yet.
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <h2 className="text-base font-bold text-foreground mb-4" style={{ fontFamily: "var(--font-heading)" }}>Notifications</h2>
              <div className="flex flex-col gap-2.5">
                <div className="rounded-xl p-3 flex items-start gap-2.5 bg-accent/5 border border-accent/10">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    <CheckCircle2 className="h-3 w-3" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Welcome to FinLend</p>
                    <p className="text-[10px] text-muted-foreground">Start your application journey today.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}