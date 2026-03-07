"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SearchFilterBar } from "@/components/shared/search-filter-bar"
import { LoanStatusBadge } from "@/components/shared/loan-status-badge"
import { cn } from "@/lib/utils"
import { adminAPI } from "@/config/api/admin"
import { useToast } from "@/components/shared/simple-toast" 
import {
  ArrowLeft, Eye, Download, Loader2
} from "lucide-react"

export function AdminApplications() {
  const { showToast } = useToast()
  const [apps, setApps] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")
  const [selectedApp, setSelectedApp] = useState<any | null>(null)

  //  Fetch  Data from Backend
  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true)
      try {
        const response = await adminAPI.getApplications() // Assuming you added this to adminAPI
        if (response.data && response.data.applications) {
          // Format data to match your UI needs
          const formattedApps = response.data.applications.map((app: any) => ({
            id: `APP${app._id.toString().slice(-6).toUpperCase()}`,
            applicantName: app.borrowerId?.name || "Unknown",
            email: app.borrowerId?.email || "N/A",
            phone: app.borrowerId?.phoneNumber || "N/A",
            amount: app.aiChatData?.raw?.loanAmount || 0,
            cibil: app.aiChatData?.score || "N/A",
            nbfcName: app.nbfcId?.name || "Unassigned",
            status: app.verificationStatus, 
            appliedDate: new Date(app.createdAt).toLocaleDateString(),
          }))
          setApps(formattedApps)
        }
      } catch (error) {
        console.error("Failed to load applications", error)
        showToast("Failed to load live applications", "error")
      } finally {
        setIsLoading(false)
      }
    }
    fetchApps()
  }, [showToast])
  
   const filtered = apps.filter((a) => {
    const matchSearch = a.applicantName?.toLowerCase().includes(search.toLowerCase()) || a.id?.toLowerCase().includes(search.toLowerCase())
    if (filter !== "All") return matchSearch && a.status.toLowerCase() === filter.toLowerCase()
    return matchSearch
  })

  //  1. Applications Export CSV Function
  const handleExportCSV = () => {
    if (!filtered || filtered.length === 0) return;

    // Excel Sheet  Columns
    const headers = ["Applicant Name", "Email", "Amount Required", "Loan Type", "Status", "Applied Date"];

    // map data to rows
    const csvRows = filtered.map(app => {
      return [
        `"${app.applicantName || '-'}"`, 
        `"${app.email || '-'}"`,
        `"${app.amount || '-'}"`,
        `"-"`, 
        `"${app.status || 'Pending'}"`,
        `"${app.appliedDate}"`
      ].join(",");
    });

    const csvContent = [headers.join(","), ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    // name of the downloaded file
    link.setAttribute("download", "Applications_Report.csv"); 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  // ── Detail View ──
  if (selectedApp) {
    return (
      <div className="p-6 lg:p-8 space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedApp(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Applications
        </button>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center text-lg font-bold text-accent">
              {selectedApp.applicantName ? selectedApp.applicantName.substring(0, 2).toUpperCase() : "US"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>{selectedApp.applicantName}</h2>
                <LoanStatusBadge status={selectedApp.status.toLowerCase()} />
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{selectedApp.id} &middot; Applied {selectedApp.appliedDate}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-sm font-bold text-foreground mb-4">Application Details</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Amount Requested</span><span className="font-bold">₹{(selectedApp.amount / 100000).toFixed(1)}L</span></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">CIBIL Score</span><span className="font-bold text-accent">{selectedApp.cibil}</span></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Email</span><span className="font-medium">{selectedApp.email}</span></div>
              <div className="flex justify-between border-b border-border/50 pb-2"><span className="text-muted-foreground">Phone</span><span className="font-medium">{selectedApp.phone}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Assigned NBFC</span><span className="font-bold">{selectedApp.nbfcName}</span></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Applications List ──
  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground" style={{ fontFamily: "var(--font-heading)" }}>Loan Applications</h1>
          <p className="text-xs text-muted-foreground mt-1">Live tracking of all user applications</p>
        </div>
        {/* <Button variant="outline" className="h-9 gap-2 rounded-xl text-xs"><Download className="h-3.5 w-3.5" /> Export</Button> */}

        <Button onClick={handleExportCSV} variant="outline" className="gap-2 shadow-sm rounded-xl">
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>

      <SearchFilterBar search={search} onSearchChange={setSearch} filters={["All", "Pending", "Verified", "Rejected", "Disbursed"]} activeFilter={filter} onFilterChange={setFilter} />

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-secondary/30">
                {["ID", "Applicant", "Amount", "CIBIL", "NBFC", "Status", "Applied", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                 <tr><td colSpan={8} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-accent mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={8} className="py-12 text-center text-sm text-muted-foreground">No applications found in database</td></tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors cursor-pointer" onClick={() => setSelectedApp(app)}>
                    <td className="px-4 py-3 text-xs font-mono text-accent">{app.id}</td>
                    <td className="px-4 py-3">
                      <div>
                        <p className="text-xs font-semibold text-foreground">{app.applicantName}</p>
                        <p className="text-[10px] text-muted-foreground">{app.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-semibold text-foreground">₹{(app.amount / 100000).toFixed(1)}L</td>
                    <td className="px-4 py-3"><span className="text-xs font-bold text-accent">{app.cibil}</span></td>
                    <td className="px-4 py-3 text-xs font-medium text-foreground">{app.nbfcName}</td>
                    <td className="px-4 py-3"><LoanStatusBadge status={app.status.toLowerCase()} /></td>
                    <td className="px-4 py-3 text-[10px] text-muted-foreground">{app.appliedDate}</td>
                    <td className="px-4 py-3">
                      <button title="View details" className="h-7 w-7 rounded-lg hover:bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}