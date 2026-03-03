// "use client"

// import { useState, useMemo, useEffect } from "react"
// import { cn } from "@/lib/utils"
// import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
// import { SearchFilterBar } from "@/components/shared/search-filter-bar"
// import {
//   ChevronRight, Eye, ArrowLeft, IndianRupee,
//   CreditCard, CalendarDays, Receipt,
// } from "lucide-react"
// import type { UserLoan } from "@/types"

// // ─── Extended Loan Type (with charges for detail view) ──────────────────────

// interface LoanDetail extends UserLoan {
//   processingFee: number
//   insuranceFee: number
//   gstCharges: number
//   stampDuty: number
//   disbursedDate: string
// }

// // ─── Demo Data ──────────────────────────────────────────────────────────────

// const DEMO_LOANS: LoanDetail[] = [
//   {
//     id: "L001", nbfcName: "Bajaj Finserv", nbfcLogo: "BFL", loanType: "personal",
//     sanctionedAmount: 500000, disbursedAmount: 500000, interestRate: 11.5, tenure: 36,
//     emiAmount: 16500, emiPaid: 8, totalEMI: 36, outstandingBalance: 380000,
//     status: "running", startDate: "2025-07-01", maturityDate: "2028-07-01", nextEMIDate: "2026-03-01",
//     processingFee: 5000, insuranceFee: 2500, gstCharges: 900, stampDuty: 500, disbursedDate: "2025-07-05",
//   },
//   {
//     id: "L002", nbfcName: "Tata Capital", nbfcLogo: "TATA", loanType: "business",
//     sanctionedAmount: 800000, disbursedAmount: 800000, interestRate: 10.5, tenure: 48,
//     emiAmount: 20400, emiPaid: 4, totalEMI: 48, outstandingBalance: 740000,
//     status: "running", startDate: "2025-11-01", maturityDate: "2029-11-01", nextEMIDate: "2026-03-05",
//     processingFee: 8000, insuranceFee: 4000, gstCharges: 1440, stampDuty: 800, disbursedDate: "2025-11-03",
//   },
//   {
//     id: "L003", nbfcName: "HDFC", nbfcLogo: "HDFC", loanType: "personal",
//     sanctionedAmount: 300000, disbursedAmount: 300000, interestRate: 12.0, tenure: 24,
//     emiAmount: 14130, emiPaid: 24, totalEMI: 24, outstandingBalance: 0,
//     status: "completed", startDate: "2024-03-01", maturityDate: "2026-03-01", nextEMIDate: "-",
//     processingFee: 3000, insuranceFee: 1500, gstCharges: 540, stampDuty: 300, disbursedDate: "2024-03-05",
//   },
//   {
//     id: "L004", nbfcName: "Axis Finance", nbfcLogo: "AXIS", loanType: "car",
//     sanctionedAmount: 600000, disbursedAmount: 0, interestRate: 9.5, tenure: 60,
//     emiAmount: 0, emiPaid: 0, totalEMI: 0, outstandingBalance: 0,
//     status: "rejected", startDate: "-", maturityDate: "-", nextEMIDate: "-",
//     processingFee: 0, insuranceFee: 0, gstCharges: 0, stampDuty: 0, disbursedDate: "-",
//   },
// ]

// const FILTER_OPTIONS = [
//   { label: "All", value: "all" },
//   { label: "Running", value: "running" },
//   { label: "Completed", value: "completed" },
//   { label: "Rejected", value: "rejected" },
// ]

// const fmtDate = (d: string) =>
//   d === "-" ? "N/A" : new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })

// // ─── Loan Detail View ───────────────────────────────────────────────────────

// function LoanDetailView({ loan, onBack }: { loan: LoanDetail; onBack: () => void }) {
//   const progress = loan.totalEMI > 0 ? (loan.emiPaid / loan.totalEMI) * 100 : 0
//   const totalCharges = loan.processingFee + loan.insuranceFee + loan.gstCharges + loan.stampDuty

//   return (
//     <div className="animate-in fade-in slide-in-from-right-4 duration-300">
//       <button
//         onClick={onBack}
//         className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group"
//       >
//         <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
//         Back to My Loans
//       </button>

//       {/* Loan Header Card */}
//       <div className="rounded-3xl border border-border bg-card p-6 shadow-sm mb-5">
//         <div className="flex items-center gap-4 flex-wrap">
//           <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-sm font-bold text-accent">
//             {loan.nbfcLogo}
//           </div>
//           <div>
//             <div className="flex items-center gap-2">
//               <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
//                 {loan.nbfcName}
//               </h2>
//               <LoanStatusBadge status={loan.status} />
//             </div>
//             <p className="text-xs text-muted-foreground capitalize mt-0.5">
//               {loan.loanType} Loan &middot; ID: {loan.id}
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-5 lg:grid-cols-2">
//         {/* Loan Amount & Interest */}
//         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//             <IndianRupee className="h-4 w-4 text-accent" /> Loan Amount & Interest
//           </h3>
//           <div className="grid grid-cols-2 gap-3">
//             {[
//               { label: "Sanctioned", value: `₹${loan.sanctionedAmount.toLocaleString("en-IN")}` },
//               { label: "Disbursed", value: `₹${loan.disbursedAmount.toLocaleString("en-IN")}` },
//               { label: "Interest Rate", value: `${loan.interestRate}% p.a.`, accent: true },
//               { label: "Outstanding", value: `₹${loan.outstandingBalance.toLocaleString("en-IN")}` },
//             ].map((item) => (
//               <div key={item.label} className="rounded-xl bg-secondary/40 p-4">
//                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</p>
//                 <p className={cn("text-lg font-bold mt-1", item.accent ? "text-accent" : "text-foreground")}>{item.value}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* EMI Details */}
//         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//             <CreditCard className="h-4 w-4 text-accent" /> EMI Details
//           </h3>
//           <div className="space-y-4">
//             <div className="rounded-xl bg-accent/5 border border-accent/15 p-4">
//               <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Monthly EMI</p>
//               <p className="text-2xl font-bold text-accent mt-1">
//                 {loan.emiAmount > 0 ? `₹${loan.emiAmount.toLocaleString("en-IN")}` : "N/A"}
//               </p>
//             </div>
//             <div className="grid grid-cols-2 gap-3">
//               <div className="rounded-xl bg-secondary/40 p-3">
//                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Total EMIs</p>
//                 <p className="text-base font-bold text-foreground mt-0.5">{loan.totalEMI || "N/A"}</p>
//               </div>
//               <div className="rounded-xl bg-secondary/40 p-3">
//                 <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">EMIs Paid</p>
//                 <p className="text-base font-bold text-foreground mt-0.5">{loan.emiPaid}</p>
//               </div>
//             </div>
//             {loan.totalEMI > 0 && (
//               <div>
//                 <div className="flex items-center justify-between text-xs mb-1.5">
//                   <span className="text-muted-foreground">Repayment Progress</span>
//                   <span className="font-bold text-foreground">{progress.toFixed(0)}%</span>
//                 </div>
//                 <div className="h-2.5 rounded-full bg-secondary overflow-hidden">
//                   <div className="h-full rounded-full bg-accent transition-all duration-500" style={{ width: `${progress}%` }} />
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Tenure & Dates */}
//         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//             <CalendarDays className="h-4 w-4 text-accent" /> Tenure & Dates
//           </h3>
//           <div className="space-y-2.5">
//             {[
//               { label: "Loan Tenure", value: `${loan.tenure} months (${(loan.tenure / 12).toFixed(1)} years)` },
//               { label: "Issued Date", value: fmtDate(loan.startDate) },
//               { label: "Disbursed Date", value: fmtDate(loan.disbursedDate) },
//               { label: "Maturity Date", value: fmtDate(loan.maturityDate) },
//               { label: "Next EMI Date", value: fmtDate(loan.nextEMIDate) },
//             ].map((row) => (
//               <div key={row.label} className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3">
//                 <span className="text-xs text-muted-foreground">{row.label}</span>
//                 <span className="text-xs font-semibold text-foreground">{row.value}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Additional Charges */}
//         <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
//           <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
//             <Receipt className="h-4 w-4 text-accent" /> Additional Charges
//           </h3>
//           <div className="space-y-2.5">
//             {[
//               { label: "Processing Fee", value: loan.processingFee },
//               { label: "Insurance Premium", value: loan.insuranceFee },
//               { label: "GST Charges", value: loan.gstCharges },
//               { label: "Stamp Duty", value: loan.stampDuty },
//             ].map((c) => (
//               <div key={c.label} className="flex items-center justify-between rounded-xl bg-secondary/40 px-4 py-3">
//                 <span className="text-xs text-muted-foreground">{c.label}</span>
//                 <span className="text-xs font-semibold text-foreground">₹{c.value.toLocaleString("en-IN")}</span>
//               </div>
//             ))}
//             <div className="flex items-center justify-between rounded-xl bg-accent/5 border border-accent/15 px-4 py-3">
//               <span className="text-xs font-bold text-foreground">Total Charges</span>
//               <span className="text-sm font-bold text-accent">₹{totalCharges.toLocaleString("en-IN")}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// // ─── Component ──────────────────────────────────────────────────────────────

// export function UserLoans() {
//   const [search, setSearch] = useState("")
//   const [filter, setFilter] = useState("all")
//   const [loading, setLoading] = useState(true)
//   const [selectedLoan, setSelectedLoan] = useState<LoanDetail | null>(null)

//   useEffect(() => {
//     const t = setTimeout(() => setLoading(false), 600)
//     return () => clearTimeout(t)
//   }, [])

//   const filtered = useMemo(() =>
//     DEMO_LOANS.filter((loan) => {
//       const matchSearch = !search ||
//         loan.nbfcName.toLowerCase().includes(search.toLowerCase()) ||
//         loan.id.toLowerCase().includes(search.toLowerCase())
//       const matchFilter = filter === "all" || loan.status === filter
//       return matchSearch && matchFilter
//     }),
//   [search, filter])

//   // ── Loan Detail Screen ──────────────────────────────────────────────────
//   if (selectedLoan) {
//     return (
//       <div className="min-h-screen bg-background">
//         <div className="border-b border-border bg-card">
//           <div className="px-6 py-6 lg:px-8">
//             <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Details</h1>
//             <p className="text-xs text-muted-foreground mt-1">Complete information about your loan</p>
//           </div>
//         </div>
//         <div className="px-6 py-6 lg:px-8">
//           <LoanDetailView loan={selectedLoan} onBack={() => setSelectedLoan(null)} />
//         </div>
//       </div>
//     )
//   }

//   // ── Loans List ──────────────────────────────────────────────────────────
//   return (
//     <div className="min-h-screen bg-background">
//       <div className="border-b border-border bg-card">
//         <div className="px-6 py-6 lg:px-8">
//           <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Loans</h1>
//           <p className="text-xs text-muted-foreground mt-1">View all your loan applications and status</p>
//         </div>
//       </div>

//       <div className="px-6 py-6 lg:px-8">
//         <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
//           <SearchFilterBar
//             searchQuery={search}
//             onSearchChange={setSearch}
//             searchPlaceholder="Search by NBFC name or Loan ID..."
//             filterOptions={FILTER_OPTIONS}
//             activeFilter={filter}
//             onFilterChange={setFilter}
//           />

//           <div className="overflow-x-auto">
//             <table className="w-full text-sm">
//               <thead>
//                 <tr className="border-b border-border bg-secondary/50">
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Loan</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Rate</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">EMI</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Progress</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Outstanding</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
//                   <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {loading ? (
//                   Array.from({ length: 3 }).map((_, i) => (
//                     <tr key={i} className="border-b border-border/50 animate-pulse">
//                       <td className="px-6 py-4"><div className="h-4 w-28 rounded bg-secondary" /><div className="h-3 w-20 rounded bg-secondary/60 mt-1.5" /></td>
//                       <td className="px-6 py-4"><div className="h-4 w-14 rounded bg-secondary" /></td>
//                       <td className="px-6 py-4"><div className="h-4 w-10 rounded bg-secondary" /></td>
//                       <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-secondary" /></td>
//                       <td className="px-6 py-4"><div className="h-1.5 w-20 rounded-full bg-secondary" /></td>
//                       <td className="px-6 py-4"><div className="h-4 w-14 rounded bg-secondary" /></td>
//                       <td className="px-6 py-4"><div className="h-5 w-16 rounded-full bg-secondary" /></td>
//                       <td className="px-6 py-4"><div className="h-8 w-8 rounded-xl bg-secondary" /></td>
//                     </tr>
//                   ))
//                 ) : (
//                 filtered.map((loan) => (
//                   <tr
//                     key={loan.id}
//                     onClick={() => setSelectedLoan(loan)}
//                     className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
//                   >
//                     <td className="px-6 py-4">
//                       <div>
//                         <p className="font-semibold text-foreground text-sm">{loan.nbfcName}</p>
//                         <p className="text-[11px] text-muted-foreground capitalize">{loan.id} • {loan.loanType} Loan</p>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 font-medium text-foreground">₹{(loan.sanctionedAmount / 100000).toFixed(1)}L</td>
//                     <td className="px-6 py-4 text-muted-foreground">{loan.interestRate}%</td>
//                     <td className="px-6 py-4 font-medium text-foreground">
//                       {loan.emiAmount > 0 ? `₹${loan.emiAmount.toLocaleString("en-IN")}` : "-"}
//                     </td>
//                     <td className="px-6 py-4">
//                       {loan.totalEMI > 0 ? (
//                         <div className="flex items-center gap-2">
//                           <div className="h-1.5 w-20 rounded-full bg-secondary overflow-hidden">
//                             <div className="h-full rounded-full bg-accent" style={{ width: `${(loan.emiPaid / loan.totalEMI) * 100}%` }} />
//                           </div>
//                           <span className="text-[10px] text-muted-foreground">{loan.emiPaid}/{loan.totalEMI}</span>
//                         </div>
//                       ) : <span className="text-[10px] text-muted-foreground">-</span>}
//                     </td>
//                     <td className="px-6 py-4 font-medium text-foreground">
//                       {loan.outstandingBalance > 0 ? `₹${(loan.outstandingBalance / 100000).toFixed(1)}L` : "-"}
//                     </td>
//                     <td className="px-6 py-4"><LoanStatusBadge status={loan.status} /></td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={(e) => { e.stopPropagation(); setSelectedLoan(loan) }}
//                         className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-secondary transition-colors"
//                       >
//                         <Eye className="h-4 w-4 text-muted-foreground" />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {filtered.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-16">
//               <p className="text-sm text-muted-foreground">No loans found</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   )
// }



"use client"

import { useState, useMemo, useEffect } from "react"
import { cn } from "@/lib/utils"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { ChevronRight, Eye, ArrowLeft, IndianRupee, CreditCard, CalendarDays, Receipt, Loader2 } from "lucide-react"
import api from "@/config/axios" // ✅ Added api

const FILTER_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Running", value: "verified" },
  { label: "Completed", value: "disbursed" },
  { label: "Rejected", value: "rejected" },
]

export function UserLoans() {
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [loans, setLoans] = useState<any[]>([])
  const [selectedLoan, setSelectedLoan] = useState<any | null>(null)

  // ✅ Fetch Real DB Loans
  useEffect(() => {
    const fetchUserLoans = async () => {
      try {
        const response = await api.get('/api/applications/my-applications') 
        if (response.data && response.data.loans) {
          setLoans(response.data.loans)
        }
      } catch (error) {
        console.error("Error fetching user loans:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUserLoans()
  }, [])

  const filtered = useMemo(() =>
    loans.filter((loan) => {
      const matchSearch = !search ||
        (loan.nbfcName || "").toLowerCase().includes(search.toLowerCase()) ||
        loan.id.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === "all" || loan.status === filter.toUpperCase()
      return matchSearch && matchFilter
    }),
  [search, filter, loans])

  // ── Loan Detail Screen ──────────────────────────────────────────────────
  if (selectedLoan) {
    return (
      <div className="min-h-screen bg-background">
        <div className="border-b border-border bg-card">
          <div className="px-6 py-6 lg:px-8">
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Details</h1>
            <p className="text-xs text-muted-foreground mt-1">Complete information about your loan</p>
          </div>
        </div>
        <div className="px-6 py-6 lg:px-8">
           {/* Detailed View Code */}
           <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <button onClick={() => setSelectedLoan(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 group">
               <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" /> Back to My Loans
             </button>
             <div className="rounded-3xl border border-border bg-card p-6 shadow-sm mb-5">
               <div className="flex items-center gap-4 flex-wrap">
                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/10 text-sm font-bold text-accent">
                   {selectedLoan.nbfcName ? selectedLoan.nbfcName.substring(0,2).toUpperCase() : "LN"}
                 </div>
                 <div>
                   <div className="flex items-center gap-2">
                     <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>
                       {selectedLoan.nbfcName}
                     </h2>
                     <LoanStatusBadge status={selectedLoan.status ? selectedLoan.status.toLowerCase() : "pending"} />
                   </div>
                   <p className="text-xs text-muted-foreground capitalize mt-0.5">
                     ID: #{selectedLoan.id.slice(-6).toUpperCase()}
                   </p>
                 </div>
               </div>
             </div>

             <div className="grid gap-5 lg:grid-cols-2">
               <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                 <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                   <IndianRupee className="h-4 w-4 text-accent" /> Loan Amount
                 </h3>
                 <div className="grid grid-cols-2 gap-3">
                   <div className="rounded-xl bg-secondary/40 p-4">
                     <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Requested</p>
                     <p className="text-lg font-bold mt-1 text-foreground">₹{(selectedLoan.amount / 100000).toFixed(1)}L</p>
                   </div>
                   <div className="rounded-xl bg-secondary/40 p-4">
                     <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">CIBIL Score</p>
                     <p className="text-lg font-bold mt-1 text-accent">{selectedLoan.cibilScore || 'N/A'}</p>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </div>
    )
  }

  // ── Loans List ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="px-6 py-6 lg:px-8">
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>My Applications</h1>
          <p className="text-xs text-muted-foreground mt-1">View all your loan applications and status</p>
        </div>
      </div>

      <div className="px-6 py-6 lg:px-8">
        <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
          <SearchFilterBar
            search={search}
            onSearchChange={setSearch}
            filters={FILTER_OPTIONS.map(f => f.label)}
            activeFilter={FILTER_OPTIONS.find(f => f.value === filter)?.label || "All"}
            onFilterChange={(label) => setFilter(FILTER_OPTIONS.find(f => f.label === label)?.value || "all")}
          />

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50">
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Loan ID</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Amount</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">CIBIL</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Date</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="border-b border-border/50 animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 w-28 rounded bg-secondary" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-14 rounded bg-secondary" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-10 rounded bg-secondary" /></td>
                      <td className="px-6 py-4"><div className="h-4 w-16 rounded bg-secondary" /></td>
                      <td className="px-6 py-4"><div className="h-5 w-16 rounded-full bg-secondary" /></td>
                      <td className="px-6 py-4"><div className="h-8 w-8 rounded-xl bg-secondary" /></td>
                    </tr>
                  ))
                ) : (
                filtered.map((loan) => (
                  <tr
                    key={loan.id}
                    onClick={() => setSelectedLoan(loan)}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-foreground text-sm">{loan.nbfcName}</p>
                        <p className="text-[11px] text-muted-foreground capitalize">#{loan.id.slice(-6).toUpperCase()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-foreground">₹{(loan.amount / 100000).toFixed(1)}L</td>
                    <td className="px-6 py-4 font-medium text-accent">{loan.cibilScore || 'N/A'}</td>
                    <td className="px-6 py-4 text-muted-foreground text-xs">{new Date(loan.appliedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4"><LoanStatusBadge status={loan.status ? loan.status.toLowerCase() : "pending"} /></td>
                    <td className="px-6 py-4">
                      <button className="flex h-8 w-8 items-center justify-center rounded-xl hover:bg-secondary transition-colors">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      </button>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>

          {!loading && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}