// "use client"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { SearchFilterBar } from "@/components/shared/search-filter-bar"
// import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
// import { ConfirmationModal } from "@/components/shared/confirmation-modal"
// import { cn } from "@/lib/utils"
// import { Eye, CheckCircle2, XCircle, Download, ChevronLeft, ChevronRight, FileText } from "lucide-react"
// import type { NBFCApplication } from "@/types"

// const DEMO: NBFCApplication[] = [
//   { id: "APP101", applicantName: "Amit Sharma", email: "amit@email.com", phone: "+91 98765 12345", loanType: "Personal Loan", amount: 500000, tenure: 24, status: "pending", cibilScore: 745, monthlyIncome: 65000, appliedAt: "2026-02-15", documents: ["aadhaar", "pan", "salary-slip"] },
//   { id: "APP102", applicantName: "Neha Gupta", email: "neha@email.com", phone: "+91 87654 23456", loanType: "Business Loan", amount: 1000000, tenure: 36, status: "approved", cibilScore: 780, monthlyIncome: 120000, appliedAt: "2026-02-14", documents: ["aadhaar", "pan", "itr"] },
//   { id: "APP103", applicantName: "Ravi Patel", email: "ravi@email.com", phone: "+91 76543 34567", loanType: "Personal Loan", amount: 300000, tenure: 12, status: "under-review", cibilScore: 710, monthlyIncome: 45000, appliedAt: "2026-02-13", documents: ["aadhaar", "pan"] },
//   { id: "APP104", applicantName: "Kavita Singh", email: "kavita@email.com", phone: "+91 65432 45678", loanType: "Home Loan", amount: 2000000, tenure: 120, status: "disbursed", cibilScore: 790, monthlyIncome: 150000, appliedAt: "2026-02-10", documents: ["aadhaar", "pan", "itr", "property"] },
//   { id: "APP105", applicantName: "Deepak Verma", email: "deepak@email.com", phone: "+91 54321 56789", loanType: "Personal Loan", amount: 200000, tenure: 12, status: "rejected", cibilScore: 620, monthlyIncome: 28000, appliedAt: "2026-02-08", documents: ["aadhaar"] },
// ]

// const FILTERS = ["All", "Pending", "Under Review", "Approved", "Rejected", "Disbursed"]

// export function NbfcApplications() {
//   const [search, setSearch] = useState("")
//   const [filter, setFilter] = useState("All")
//   const [selected, setSelected] = useState<NBFCApplication | null>(null)
//   const [action, setAction] = useState<"approve" | "reject" | null>(null)

//   const filtered = DEMO.filter((a) => {
//     const matchSearch = a.applicantName.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase())
//     if (filter === "Pending") return matchSearch && a.status === "pending"
//     if (filter === "Under Review") return matchSearch && a.status === "under-review"
//     if (filter === "Approved") return matchSearch && a.status === "approved"
//     if (filter === "Rejected") return matchSearch && a.status === "rejected"
//     if (filter === "Disbursed") return matchSearch && a.status === "disbursed"
//     return matchSearch
//   })

//   return (
//     <div className="p-6 lg:p-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Applications</h1>
//           <p className="text-xs text-muted-foreground mt-1">{DEMO.filter((a) => a.status === "pending").length} pending review</p>
//         </div>
//         <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
//       </div>

//       <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

//       {/* Detail Panel */}
//       {selected && (
//         <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 animate-in fade-in slide-in-from-top-2 duration-200">
//           <div className="flex items-center justify-between mb-3">
//             <h3 className="text-sm font-bold text-foreground">{selected.applicantName} — {selected.id}</h3>
//             <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground">Close ✕</button>
//           </div>
//           <div className="grid gap-3 sm:grid-cols-4 mb-3">
//             <div><span className="text-[10px] text-muted-foreground block">Loan Type</span><span className="text-xs font-semibold text-foreground">{selected.loanType}</span></div>
//             <div><span className="text-[10px] text-muted-foreground block">Amount</span><span className="text-xs font-semibold text-foreground">₹{(selected.amount / 100000).toFixed(1)}L</span></div>
//             <div><span className="text-[10px] text-muted-foreground block">Tenure</span><span className="text-xs font-semibold text-foreground">{selected.tenure} months</span></div>
//             <div><span className="text-[10px] text-muted-foreground block">CIBIL</span><span className={cn("text-xs font-bold", selected.cibilScore >= 750 ? "text-accent" : selected.cibilScore >= 700 ? "text-yellow-500" : "text-red-500")}>{selected.cibilScore}</span></div>
//           </div>
//           <div className="grid gap-3 sm:grid-cols-4 mb-3">
//             <div><span className="text-[10px] text-muted-foreground block">Email</span><span className="text-xs text-foreground">{selected.email}</span></div>
//             <div><span className="text-[10px] text-muted-foreground block">Phone</span><span className="text-xs text-foreground">{selected.phone}</span></div>
//             <div><span className="text-[10px] text-muted-foreground block">Monthly Income</span><span className="text-xs font-semibold text-foreground">₹{selected.monthlyIncome.toLocaleString("en-IN")}</span></div>
//             <div><span className="text-[10px] text-muted-foreground block">Documents</span><span className="text-xs text-foreground">{selected.documents.length} uploaded</span></div>
//           </div>
//           {(selected.status === "pending" || selected.status === "under-review") && (
//             <div className="flex gap-3 border-t border-border pt-3">
//               <Button onClick={() => setAction("approve")} className="h-8 gap-1.5 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</Button>
//               <Button onClick={() => setAction("reject")} variant="outline" className="h-8 gap-1.5 rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/5"><XCircle className="h-3.5 w-3.5" /> Reject</Button>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Table */}
//       <div className="rounded-2xl border border-border bg-card overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-left">
//             <thead>
//               <tr className="border-b border-border bg-secondary/30">
//                 {["ID", "Applicant", "Type", "Amount", "CIBIL", "Status", "Date", ""].map((h) => (
//                   <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {filtered.map((app) => (
//                 <tr key={app.id} onClick={() => setSelected(app)} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer">
//                   <td className="px-4 py-3 text-xs font-mono text-accent">{app.id}</td>
//                   <td className="px-4 py-3">
//                     <p className="text-xs font-semibold text-foreground">{app.applicantName}</p>
//                     <p className="text-[10px] text-muted-foreground">{app.email}</p>
//                   </td>
//                   <td className="px-4 py-3 text-xs text-foreground">{app.loanType}</td>
//                   <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{(app.amount / 100000).toFixed(1)}L</td>
//                   <td className="px-4 py-3"><span className={cn("text-xs font-bold", app.cibilScore >= 750 ? "text-accent" : app.cibilScore >= 700 ? "text-yellow-500" : "text-red-500")}>{app.cibilScore}</span></td>
//                   <td className="px-4 py-3"><LoanStatusBadge status={app.status} /></td>
//                   <td className="px-4 py-3 text-[10px] text-muted-foreground">{app.appliedAt}</td>
//                   <td className="px-4 py-3"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No applications found</div>}
//       </div>

//       {action && selected && (
//         <ConfirmationModal open onClose={() => setAction(null)} onConfirm={() => { setAction(null); setSelected(null) }}
//           title={action === "approve" ? "Approve Application" : "Reject Application"}
//           description={action === "approve" ? `Approve ${selected.applicantName}'s loan of ₹${(selected.amount / 100000).toFixed(1)}L?` : `Reject ${selected.applicantName}'s application? This cannot be undone.`}
//           confirmText={action === "approve" ? "Approve" : "Reject"} danger={action === "reject"}
//         />
//       )}
//     </div>
//   )
// }


"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { ConfirmationModal } from "@/components/shared/confirmation-modal"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Eye, CheckCircle2, XCircle, Download, Loader2, FileCheck, X } from "lucide-react"
import { nbfcAPI, formatDocumentUrl } from "@/config/api"

type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'DISBURSED'

interface Application {
  _id: string
  borrowerId: { _id: string; name: string; email: string; phone?: string }
  documents?: { panCardUrl?: string; aadhaarCardUrl?: string; selfieUrl?: string }
  nbfcId: string
  verificationStatus: VerificationStatus
  aiChatData: { score: number; requestedAmount: number; summary?: string }
  createdAt: string
  rejectionReason?: string
}

const FILTERS = ["All", "PENDING", "VERIFIED", "REJECTED", "DISBURSED"]

function DocViewer({ url, label, onClose }: { url: string; label: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-card rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-border">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <span className="font-semibold text-sm text-foreground">{label}</span>
          <button onClick={onClose} className="rounded-lg p-1.5 hover:bg-secondary transition-colors">
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
        <div className="p-4">
          <img src={url} alt={label} className="w-full rounded-xl object-contain max-h-[70vh]" />
        </div>
      </div>
    </div>
  )
}

export function NbfcApplications() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [applications, setApplications] = useState<Application[]>([])
  const [selected, setSelected] = useState<Application | null>(null)
  const [action, setAction] = useState<"VERIFIED" | "REJECTED" | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isActing, setIsActing] = useState(false)
  const [docViewer, setDocViewer] = useState<{ url: string; label: string } | null>(null)

  const fetchApplications = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await nbfcAPI.getLeads()
      setApplications(response.data.applications || [])
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || 'Failed to fetch applications', variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  useEffect(() => { fetchApplications() }, [fetchApplications])

  const handleAction = async () => {
    if (!selected || !action) return
    setIsActing(true)
    try {
      await nbfcAPI.updateApplicationStatus(selected._id, { verificationStatus: action })
      
      toast({ 
        title: "Success", 
        description: action === 'VERIFIED' ? '✅ Application approved!' : '❌ Application rejected.' 
      })
      
      setApplications((prev) => prev.map((a) => a._id === selected._id ? { ...a, verificationStatus: action } : a))
      setSelected((prev) => prev ? { ...prev, verificationStatus: action } : null)
      setAction(null)
    } catch (err: any) {
      toast({ title: "Error", description: err.response?.data?.message || 'Something went wrong', variant: "destructive" })
    } finally {
      setIsActing(false)
    }
  }

  const filtered = applications.filter((a) => {
    const matchSearch = a.borrowerId.name.toLowerCase().includes(search.toLowerCase()) || a._id.toLowerCase().includes(search.toLowerCase())
    if (filter !== "All") return matchSearch && a.verificationStatus === filter
    return matchSearch
  })

  return (
    <>
      {docViewer && <DocViewer url={docViewer.url} label={docViewer.label} onClose={() => setDocViewer(null)} />}
      
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Applications</h1>
            <p className="text-xs text-muted-foreground mt-1">{applications.filter((a) => a.verificationStatus === "PENDING").length} pending review</p>
          </div>
          <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button>
        </div>

        <SearchFilterBar search={search} onSearchChange={setSearch} filters={FILTERS} activeFilter={filter} onFilterChange={setFilter} />

        {isLoading ? (
          <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-accent" /></div>
        ) : (
          <>
            {/* Detail Panel */}
            {selected && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 p-5 animate-in fade-in slide-in-from-top-2 duration-200 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold text-foreground">{selected.borrowerId.name} — #{selected._id.slice(-6).toUpperCase()}</h3>
                  <button onClick={() => setSelected(null)} className="text-xs text-muted-foreground hover:text-foreground">Close ✕</button>
                </div>
                <div className="grid gap-3 sm:grid-cols-4 mb-3">
                  <div><span className="text-[10px] text-muted-foreground block">Loan Amount</span><span className="text-xs font-semibold text-foreground">₹{(selected.aiChatData?.requestedAmount || 0).toLocaleString('en-IN')}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">CIBIL Score</span><span className={cn("text-xs font-bold", selected.aiChatData?.score >= 75 ? "text-accent" : selected.aiChatData?.score >= 50 ? "text-yellow-500" : "text-red-500")}>{selected.aiChatData?.score || 'N/A'}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">Email</span><span className="text-xs text-foreground">{selected.borrowerId.email}</span></div>
                  <div><span className="text-[10px] text-muted-foreground block">Phone</span><span className="text-xs text-foreground">{selected.borrowerId.phone || 'N/A'}</span></div>
                </div>

                <div className="mb-4">
                  <span className="text-[10px] text-muted-foreground block mb-2">Documents</span>
                  <div className="flex gap-3">
                    {selected.documents?.panCardUrl && (
                      <button onClick={() => setDocViewer({ url: formatDocumentUrl(selected.documents!.panCardUrl), label: "PAN Card" })} className="flex items-center gap-1.5 text-[11px] bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors"><FileCheck className="h-3 w-3 text-accent"/> PAN Card</button>
                    )}
                    {selected.documents?.aadhaarCardUrl && (
                      <button onClick={() => setDocViewer({ url: formatDocumentUrl(selected.documents!.aadhaarCardUrl), label: "Aadhaar Card" })} className="flex items-center gap-1.5 text-[11px] bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors"><FileCheck className="h-3 w-3 text-accent"/> Aadhaar</button>
                    )}
                    {selected.documents?.selfieUrl && (
                      <button onClick={() => setDocViewer({ url: formatDocumentUrl(selected.documents!.selfieUrl), label: "Selfie" })} className="flex items-center gap-1.5 text-[11px] bg-secondary px-3 py-1.5 rounded-lg hover:bg-secondary/80 transition-colors"><FileCheck className="h-3 w-3 text-accent"/> Selfie</button>
                    )}
                  </div>
                </div>

                {selected.verificationStatus === "PENDING" && (
                  <div className="flex gap-3 border-t border-border pt-3">
                    <Button onClick={() => setAction("VERIFIED")} className="h-8 gap-1.5 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 text-xs font-semibold"><CheckCircle2 className="h-3.5 w-3.5" /> Approve</Button>
                    <Button onClick={() => setAction("REJECTED")} variant="outline" className="h-8 gap-1.5 rounded-xl text-xs text-destructive border-destructive/30 hover:bg-destructive/5"><XCircle className="h-3.5 w-3.5" /> Reject</Button>
                  </div>
                )}
              </div>
            )}

            {/* Table */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-border bg-secondary/30">
                      {["ID", "Applicant", "Amount", "AI Score", "Status", "Date", ""].map((h) => (
                        <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((app) => (
                      <tr key={app._id} onClick={() => setSelected(app)} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer">
                        <td className="px-4 py-3 text-xs font-mono text-accent">#{app._id.slice(-6).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="text-xs font-semibold text-foreground">{app.borrowerId.name}</p>
                          <p className="text-[10px] text-muted-foreground">{app.borrowerId.email}</p>
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{(app.aiChatData?.requestedAmount || 0).toLocaleString('en-IN')}</td>
                        <td className="px-4 py-3"><span className={cn("text-xs font-bold", app.aiChatData?.score >= 75 ? "text-accent" : app.aiChatData?.score >= 50 ? "text-yellow-500" : "text-red-500")}>{app.aiChatData?.score || 'N/A'}</span></td>
                        <td className="px-4 py-3"><LoanStatusBadge status={app.verificationStatus.toLowerCase()} /></td>
                        <td className="px-4 py-3 text-[10px] text-muted-foreground">{new Date(app.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                        <td className="px-4 py-3"><Eye className="h-3.5 w-3.5 text-muted-foreground" /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filtered.length === 0 && <div className="py-12 text-center text-sm text-muted-foreground">No applications found</div>}
            </div>
          </>
        )}

        {action && selected && (
          <ConfirmationModal open onClose={() => setAction(null)} onConfirm={handleAction}
            title={action === "VERIFIED" ? "Approve Application" : "Reject Application"}
            description={action === "VERIFIED" ? `Approve ${selected.borrowerId.name}'s loan?` : `Reject ${selected.borrowerId.name}'s application? This cannot be undone.`}
            confirmText={isActing ? "Processing..." : (action === "VERIFIED" ? "Approve" : "Reject")} 
            danger={action === "REJECTED"}
          />
        )}
      </div>
    </>
  )
}