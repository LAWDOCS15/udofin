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

"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { SearchFilterBar } from "@/components/shared/search-filter-bar";
import { LoanStatusBadge } from "@/components/shared/loan-status-badge";
import { ConfirmationModal } from "@/components/shared/confirmation-modal";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Eye,
  CheckCircle2,
  XCircle,
  Download,
  Loader2,
  FileCheck,
  X,
  IndianRupee,
  Banknote,
  User,
  Mail,
  Phone,
  Calendar as CalendarIcon,
  ShieldCheck,
  Info,
  ArrowRight,
} from "lucide-react";
import { nbfcAPI, formatDocumentUrl } from "@/config/api";

// --- TYPES ---
type VerificationStatus = "PENDING" | "VERIFIED" | "REJECTED" | "DISBURSED";

interface Application {
  _id: string;
  borrowerId: { _id: string; name: string; email: string; phone?: string };
  documents?: {
    panCardUrl?: string;
    aadhaarCardUrl?: string;
    selfieUrl?: string;
  };
  nbfcId: string;
  verificationStatus: VerificationStatus;
  aiChatData: { score: number; requestedAmount: number; summary?: string };
  createdAt: string;
  rejectionReason?: string;
}

const FILTERS = ["All", "PENDING", "VERIFIED", "REJECTED", "DISBURSED"];

// --- COMPONENT: DOCUMENT VIEWER ---
function DocViewer({
  url,
  label,
  onClose,
}: {
  url: string;
  label: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative bg-card rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-border">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-secondary/20">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-accent" /> {label}
          </h3>
          <button
            onClick={onClose}
            className="rounded-full p-2 hover:bg-secondary transition-all active:scale-95"
            title="Close"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-2 bg-muted/30 flex justify-center items-center min-h-[300px]">
          <img
            src={url}
            alt={label}
            className="rounded-xl object-contain max-h-[75vh] shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}

export function NbfcApplications() {
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [applications, setApplications] = useState<Application[]>([]);
  const [selected, setSelected] = useState<Application | null>(null);
  const [action, setAction] = useState<
    "VERIFIED" | "REJECTED" | "DISBURSED" | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);
  const [docViewer, setDocViewer] = useState<{
    url: string;
    label: string;
  } | null>(null);

  const fetchApplications = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await nbfcAPI.getLeads();
      setApplications(response.data.applications || []);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleAction = async () => {
    if (!selected || !action) return;
    setIsActing(true);
    try {
      if (action === "DISBURSED") {
        await nbfcAPI.disburseLoan(selected._id);
        toast({
          title: "Loan Disbursed",
          description: "The money has been sent to borrower's account.",
        });
      } else {
        await nbfcAPI.updateApplicationStatus(selected._id, {
          verificationStatus: action,
        });
        toast({
          title: "Status Updated",
          description: `Application ${action.toLowerCase()} successfully.`,
        });
      }
      setApplications((prev) =>
        prev.map((a) =>
          a._id === selected._id ? { ...a, verificationStatus: action } : a,
        ),
      );
      setSelected(null);
      setAction(null);
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Action failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsActing(false);
    }
  };

  const filtered = applications.filter((a) => {
    const matchSearch =
      a.borrowerId.name.toLowerCase().includes(search.toLowerCase()) ||
      a._id.toLowerCase().includes(search.toLowerCase());
    return filter !== "All"
      ? matchSearch && a.verificationStatus === filter
      : matchSearch;
  });

  return (
    <>
      {docViewer && (
        <DocViewer
          url={docViewer.url}
          label={docViewer.label}
          onClose={() => setDocViewer(null)}
        />
      )}

      {/* PROFESSIONAL POPUP / SIDE-DRAWER */}
      {selected && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-card h-full shadow-2xl border-l border-border flex flex-col animate-in slide-in-from-right duration-500 ease-out">
            {/* Drawer Header */}
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent font-bold text-lg uppercase">
                  {selected.borrowerId.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-base font-bold tracking-tight">
                    {selected.borrowerId.name}
                  </h2>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase">
                    APP ID: #{selected._id.slice(-8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 hover:bg-secondary rounded-full transition-transform active:scale-90"
                title="Close"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>{" "}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                    Requested Amount
                  </p>
                  <p className="text-xl font-black text-foreground">
                    ₹
                    {selected.aiChatData?.requestedAmount.toLocaleString(
                      "en-IN",
                    )}
                  </p>
                </div>
                <div className="p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <p className="text-[10px] text-muted-foreground uppercase font-bold mb-1">
                    Credit Score
                  </p>
                  <p
                    className={cn(
                      "text-xl font-black",
                      selected.aiChatData?.score >= 700
                        ? "text-emerald-500"
                        : "text-amber-500",
                    )}
                  >
                    {selected.aiChatData?.score || "N/A"}
                  </p>
                </div>
              </div>

              {/* Status Alert */}
              {selected.verificationStatus === "DISBURSED" && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                    This loan is active. Disbursement was successful and EMI
                    tracking is live for this customer.
                  </p>
                </div>
              )}

              {/* Contact Info */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                  <Info className="h-3.5 w-3.5" /> Basic Information
                </h4>
                <div className="grid gap-3">
                  <div className="flex items-center gap-3 text-xs bg-muted/20 p-3 rounded-xl">
                    <Mail className="h-4 w-4 text-accent" />{" "}
                    {selected.borrowerId.email}
                  </div>
                  <div className="flex items-center gap-3 text-xs bg-muted/20 p-3 rounded-xl">
                    <Phone className="h-4 w-4 text-accent" />{" "}
                    {selected.borrowerId.phone || "Contact not provided"}
                  </div>
                </div>
              </div>

              {/* Documents Section */}
              <div className="space-y-4">
                <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  Verification Documents
                </h4>
                <div className="grid grid-cols-1 gap-2">
                  {selected.documents?.panCardUrl && (
                    <button
                      onClick={() =>
                        setDocViewer({
                          url: formatDocumentUrl(
                            selected.documents!.panCardUrl,
                          ),
                          label: "PAN Card",
                        })
                      }
                      className="flex items-center justify-between w-full p-4 rounded-xl border border-border hover:bg-secondary/50 transition-all group"
                    >
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <FileCheck className="h-4 w-4 text-accent" /> PAN Card
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </button>
                  )}
                  {selected.documents?.aadhaarCardUrl && (
                    <button
                      onClick={() =>
                        setDocViewer({
                          url: formatDocumentUrl(
                            selected.documents!.aadhaarCardUrl,
                          ),
                          label: "Aadhaar Card",
                        })
                      }
                      className="flex items-center justify-between w-full p-4 rounded-xl border border-border hover:bg-secondary/50 transition-all group"
                    >
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <FileCheck className="h-4 w-4 text-accent" /> Aadhaar
                        Card
                      </div>
                      <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-6 border-t border-border bg-secondary/5">
              <div className="flex gap-3">
                {selected.verificationStatus === "PENDING" && (
                  <>
                    <Button
                      onClick={() => setAction("VERIFIED")}
                      className="flex-1 h-12 rounded-2xl bg-emerald-600 hover:bg-emerald-700 font-bold text-white shadow-lg shadow-emerald-500/20"
                    >
                      Approve
                    </Button>
                    <Button
                      onClick={() => setAction("REJECTED")}
                      variant="outline"
                      className="flex-1 h-12 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/5 font-bold"
                    >
                      Reject
                    </Button>
                  </>
                )}
                {selected.verificationStatus === "VERIFIED" && (
                  <Button
                    onClick={() => setAction("DISBURSED")}
                    className="w-full h-14 rounded-2xl bg-accent hover:bg-accent/90 text-white font-black tracking-wide shadow-xl shadow-accent/30 gap-3"
                  >
                    <IndianRupee className="h-5 w-5" /> DISBURSE FUNDS NOW{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                {(selected.verificationStatus === "REJECTED" ||
                  selected.verificationStatus === "DISBURSED") && (
                  <div className="w-full text-center p-3 text-xs font-bold text-muted-foreground bg-muted/30 rounded-xl border border-dashed">
                    NO FURTHER ACTIONS AVAILABLE
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 lg:p-8 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-foreground tracking-tight">
              Applications
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and disburse your loan pipeline
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block text-right mr-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                Pending Review
              </p>
              <p className="text-sm font-black text-accent">
                {
                  applications.filter((a) => a.verificationStatus === "PENDING")
                    .length
                }
              </p>
            </div>
            <Button
              variant="outline"
              className="h-10 gap-2 rounded-xl text-xs font-bold px-5"
            >
              <Download className="h-4 w-4" /> Export Data
            </Button>
          </div>
        </div>

        <SearchFilterBar
          search={search}
          onSearchChange={setSearch}
          filters={FILTERS}
          activeFilter={filter}
          onFilterChange={setFilter}
        />

        {isLoading ? (
          <div className="py-32 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-accent" />
            <p className="text-xs font-bold text-muted-foreground animate-pulse">
              FETCHING APPLICATIONS...
            </p>
          </div>
        ) : (
          <div className="rounded-[32px] border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-secondary/40 border-b border-border">
                    {[
                      "Application ID",
                      "Borrower Details",
                      "Amount",
                      "AI Score",
                      "Status",
                      "Applied On",
                      "",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/70"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {filtered.map((app) => (
                    <tr
                      key={app._id}
                      onClick={() => setSelected(app)}
                      className="group hover:bg-secondary/30 transition-all cursor-pointer"
                    >
                      <td className="px-6 py-5 text-xs font-mono font-bold text-accent">
                        #{app._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-[10px] font-bold group-hover:bg-accent group-hover:text-white transition-colors">
                            {app.borrowerId.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-foreground">
                              {app.borrowerId.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {app.borrowerId.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-foreground">
                        ₹
                        {app.aiChatData?.requestedAmount.toLocaleString(
                          "en-IN",
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <div
                          className={cn(
                            "inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black",
                            app.aiChatData?.score >= 700
                              ? "bg-emerald-500/10 text-emerald-600"
                              : "bg-amber-500/10 text-amber-600",
                          )}
                        >
                          {app.aiChatData?.score || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <LoanStatusBadge
                          status={app.verificationStatus.toLowerCase()}
                        />
                      </td>
                      <td className="px-6 py-5 text-xs text-muted-foreground font-medium">
                        {new Date(app.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 rounded-full"
                          >
                            <ArrowRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && (
              <div className="py-20 text-center">
                <p className="text-sm font-bold text-muted-foreground">
                  No applications match your criteria
                </p>
              </div>
            )}
          </div>
        )}

        {/* REUSE EXISTING MODAL LOGIC */}
        {action && selected && (
          <ConfirmationModal
            open
            onClose={() => setAction(null)}
            onConfirm={handleAction}
            title={
              action === "VERIFIED"
                ? "Approve Application"
                : action === "DISBURSED"
                  ? "Confirm Disbursement"
                  : "Reject Application"
            }
            description={
              action === "DISBURSED"
                ? `Confirm disbursement of ₹${selected.aiChatData.requestedAmount.toLocaleString()}? This will create EMI schedules.`
                : `Are you sure you want to ${action.toLowerCase()} this application?`
            }
            confirmText={isActing ? "Processing..." : "Confirm Action"}
            danger={action === "REJECTED"}
          />
        )}
      </div>
    </>
  );
}
